import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { components, api } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";

// Initialize RAG with OpenAI embeddings
const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  embeddingDimension: 1536,
  filterNames: ["spaceId", "contentType", "userId"],
});

// Add document content to RAG
export const addDocumentToRAG = action({
  args: {
    documentId: v.id("documents"),
    textContent: v.string(),
    fileName: v.string(),
    spaceId: v.optional(v.id("spaces")),
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Create namespace based on space or user
    const namespace = args.spaceId ? `space_${args.spaceId}` : `user_${userId}`;

    await rag.add(ctx, {
      namespace,
      key: `doc_${args.documentId}`,
      text: args.textContent,
      filterValues: [
        { name: "spaceId", value: args.spaceId || "personal" },
        { name: "contentType", value: "document" },
        { name: "userId", value: userId },
      ],
    });

    return { success: true };
  },
});

// Add web scraping content to RAG
export const addWebScrapingToRAG = action({
  args: {
    websiteId: v.id("scrapedWebsites"),
    content: v.string(),
    title: v.string(),
    url: v.string(),
    spaceId: v.optional(v.id("spaces")),
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Create namespace based on space or user
    const namespace = args.spaceId ? `space_${args.spaceId}` : `user_${userId}`;

    await rag.add(ctx, {
      namespace,
      key: `web_${args.websiteId}`,
      text: args.content,
      filterValues: [
        { name: "spaceId", value: args.spaceId || "personal" },
        { name: "contentType", value: "website" },
        { name: "userId", value: userId },
      ],
    });

    return { success: true };
  },
});

// Semantic search across all content
export const semanticSearch = action({
  args: {
    query: v.string(),
    spaceId: v.optional(v.id("spaces")),
    limit: v.optional(v.number()),
  },
  returns: v.object({
    results: v.array(v.any()),
    text: v.string(),
    entries: v.array(v.any()),
    usage: v.any(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Create namespace based on space or user
    const namespace = args.spaceId ? `space_${args.spaceId}` : `user_${userId}`;

    const { results, text, entries, usage } = await rag.search(ctx, {
      namespace,
      query: args.query,
      limit: args.limit || 10,
      vectorScoreThreshold: 0.5,
    });

    return { results, text, entries, usage };
  },
});

// Generate AI response with RAG context
export const generateResponseWithRAG = action({
  args: {
    message: v.string(),
    spaceId: v.optional(v.id("spaces")),
  },
  returns: v.object({
    response: v.string(),
    context: v.any(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Create namespace based on space or user
    const namespace = args.spaceId ? `space_${args.spaceId}` : `user_${userId}`;

    const { text, context } = await rag.generateText(ctx, {
      search: { 
        namespace, 
        limit: 10,
        vectorScoreThreshold: 0.5,
      },
      prompt: `You are A.I.D.A. (AI Instructional Design Assistant), an expert instructional coach with years of experience in curriculum design and pedagogy. You provide constructive, actionable feedback to enhance teaching and learning.

${args.spaceId ? "You are responding in a shared team space where multiple users collaborate and share knowledge." : "You are responding in a personal workspace."}

User question: ${args.message}

Please provide helpful, specific guidance based on instructional design best practices. If you have relevant context from documents or scraped websites, reference them specifically in your response.`,
      model: openai("gpt-4o-mini"),
    });

    return { response: text, context };
  },
});

// Get RAG statistics for a namespace
export const getRAGStats = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const namespace = args.spaceId ? `space_${args.spaceId}` : `user_${userId}`;
    
    // Get all entries for this namespace
    const entries = await rag.list(ctx, {
      namespaceId: namespace as any,
      paginationOpts: { numItems: 1000, cursor: null },
    });

    return {
      namespace,
      totalEntries: entries.page.length,
      entries: entries.page.map(entry => ({
        entryId: entry.entryId,
        key: entry.key,
        status: entry.status,
        createdAt: Date.now(), // Entry doesn't expose creation time
      })),
    };
  },
});

// Migration function to add existing documents to RAG
export const migrateExistingDocuments = action({
  args: { spaceId: v.optional(v.id("spaces")) },
  returns: v.object({
    success: v.boolean(),
    migratedCount: v.number(),
    totalDocuments: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Get all documents for the user/space
    const documents: any = await ctx.runQuery(api.documents.getUserDocuments, { spaceId: args.spaceId });
    
    let migratedCount = 0;
    const errors: string[] = [];

    for (const doc of documents) {
      try {
        await ctx.runAction(api.rag.addDocumentToRAG, {
          documentId: doc._id,
          textContent: doc.textContent,
          fileName: doc.fileName,
          spaceId: args.spaceId,
        });
        migratedCount++;
      } catch (error) {
        errors.push(`Failed to migrate document ${doc.fileName}: ${error}`);
      }
    }

    return {
      success: true,
      migratedCount,
      totalDocuments: documents.length,
      errors,
    };
  },
});

// Migration function to add existing web scraping content to RAG
export const migrateExistingWebsites = action({
  args: { spaceId: v.optional(v.id("spaces")) },
  returns: v.object({
    success: v.boolean(),
    migratedCount: v.number(),
    totalWebsites: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Get all scraped websites for the user/space
    const websites: any = await ctx.runQuery(api.webscraping.getUserScrapedWebsites, { spaceId: args.spaceId });
    
    let migratedCount = 0;
    const errors: string[] = [];

    for (const website of websites) {
      try {
        await ctx.runAction(api.rag.addWebScrapingToRAG, {
          websiteId: website._id,
          content: website.content,
          title: website.title,
          url: website.url,
          spaceId: args.spaceId,
        });
        migratedCount++;
      } catch (error) {
        errors.push(`Failed to migrate website ${website.title}: ${error}`);
      }
    }

    return {
      success: true,
      migratedCount,
      totalWebsites: websites.length,
      errors,
    };
  },
});

// Add demo data to RAG for realistic district policy responses
export const addDemoDataToRAG = action({
  args: { spaceId: v.optional(v.id("spaces")) },
  returns: v.object({
    success: v.boolean(),
    addedPolicies: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Demo district policy data
    const demoPolicies = [
      {
        title: "Student Attendance Policy",
        content: "Our district requires students to maintain a minimum attendance rate of 95%. Students with more than 9 unexcused absences per semester may be required to attend a student attendance review board meeting. Teachers must mark attendance within the first 10 minutes of each class period. Excused absences include illness, family emergencies, religious observances, and medical appointments with proper documentation.",
        keywords: ["attendance", "absences", "excused", "unexcused", "95%", "review board", "documentation"]
      },
      {
        title: "Student Tardiness Policy", 
        content: "Students who arrive more than 10 minutes late to class without a valid excuse will be marked tardy. Three tardies equal one unexcused absence. Teachers should document all tardies in the attendance system. Students with excessive tardies may be referred to administration for intervention strategies including parent conferences and attendance contracts.",
        keywords: ["tardiness", "late", "10 minutes", "excuse", "intervention", "parent conference"]
      },
      {
        title: "Homework and Assignment Policy",
        content: "Homework should be meaningful, relevant, and designed to reinforce classroom learning. Elementary students should have no more than 30 minutes of homework per night, middle school students up to 60 minutes, and high school students up to 90 minutes. Teachers must provide clear instructions and due dates. Late work policies should be clearly communicated to students and parents at the beginning of each semester.",
        keywords: ["homework", "assignments", "30 minutes", "elementary", "middle school", "high school", "late work"]
      },
      {
        title: "Grading and Assessment Policy",
        content: "Final grades should reflect a balanced assessment of student learning including formative assessments (40%), summative assessments (40%), and participation/effort (20%). Teachers must maintain a gradebook with at least one grade entry per week. Grade scales: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60). Progress reports must be sent home every 4.5 weeks.",
        keywords: ["grading", "assessment", "formative", "summative", "gradebook", "progress reports", "A-F scale"]
      },
      {
        title: "Student Discipline and Behavior Policy",
        content: "Our district follows a progressive discipline approach. Minor infractions result in verbal warnings and documentation. Repeated violations may lead to parent contact, detention, or in-school suspension. Major infractions including violence, drugs, or weapons may result in out-of-school suspension or expulsion. All disciplinary actions must be documented in the student information system within 24 hours.",
        keywords: ["discipline", "behavior", "progressive", "detention", "suspension", "expulsion", "documentation"]
      },
      {
        title: "Anti-Bullying and Harassment Policy",
        content: "Teachers must immediately report any suspected bullying or harassment to administration. All incidents must be documented using the district's incident report form within 24 hours. The school counselor and administration will investigate within 48 hours. Consequences range from mediation and counseling to suspension depending on severity. Parents of all involved students must be notified of the incident and resolution.",
        keywords: ["bullying", "harassment", "report", "investigation", "counseling", "mediation", "parent notification"]
      },
      {
        title: "Special Education Services and Accommodations",
        content: "All students with Individualized Education Programs (IEPs) must receive their specified accommodations and modifications. Common accommodations include extended time on tests, preferential seating, use of assistive technology, and modified assignments. Teachers must review each student's IEP at the beginning of the semester and implement accommodations consistently. Any concerns about accommodation implementation should be reported to the special education coordinator immediately.",
        keywords: ["IEP", "accommodations", "modifications", "extended time", "assistive technology", "special education"]
      },
      {
        title: "Section 504 Accommodation Plans",
        content: "Section 504 plans provide accommodations for students with disabilities who don't qualify for special education services but need support to access the general education curriculum. Unlike IEPs, 504 plans don't require specialized instruction. Common 504 accommodations include preferential seating, extended time, use of technology, and modified testing conditions. Teachers must implement all 504 accommodations as specified in the student's plan.",
        keywords: ["504", "accommodations", "general education", "disabilities", "testing conditions"]
      },
      {
        title: "Educational Technology and Device Usage",
        content: "Students may use district-issued devices for educational purposes only. Personal devices must remain in lockers during class time unless specifically permitted by the teacher. All device usage is monitored and filtered through the district's network. Inappropriate use may result in device confiscation and disciplinary action. Teachers should establish clear expectations for technology use in their classrooms and monitor student activity regularly.",
        keywords: ["devices", "technology", "educational purposes", "monitored", "filtered", "confiscation"]
      },
      {
        title: "Field Trip Procedures and Requirements",
        content: "All field trips require approval from administration at least 2 weeks in advance. Required documentation includes: completed field trip request form, parent permission slips for all students, medical information for students with health conditions, transportation arrangements, and emergency contact information. Teachers must maintain a 1:10 adult-to-student ratio for elementary trips and 1:15 for secondary trips. All chaperones must complete background checks and district volunteer training.",
        keywords: ["field trip", "permission slips", "chaperones", "background check", "transportation", "medical information"]
      },
      {
        title: "Teacher Professional Development Requirements",
        content: "All certified teachers must complete a minimum of 20 hours of district-approved professional development annually. This includes 10 hours of district-mandated training and 10 hours of self-selected professional learning. Topics may include curriculum updates, technology integration, classroom management, and student assessment strategies. Professional development hours must be documented and submitted to human resources by May 31st each year.",
        keywords: ["professional development", "20 hours", "certified teachers", "mandated training", "documentation"]
      },
      {
        title: "Parent and Guardian Communication Guidelines",
        content: "Teachers should maintain regular communication with parents through multiple channels. Required communications include: welcome letter at the beginning of the year, progress reports every 4.5 weeks, parent-teacher conferences twice annually, and immediate contact for academic or behavioral concerns. Teachers should respond to parent emails within 24 hours during the school week. All communications should be professional, positive, and solution-focused when addressing concerns.",
        keywords: ["parent communication", "progress reports", "conferences", "24 hours", "professional", "solution-focused"]
      }
    ];

    // Create namespace based on space or user
    const namespace = args.spaceId ? `space_${args.spaceId}` : `user_${userId}`;

    let addedPolicies = 0;
    const errors: string[] = [];

    for (const policy of demoPolicies) {
      try {
        // Create a comprehensive text chunk that includes title, content, and keywords
        const textChunk = `District Policy: ${policy.title}\n\n${policy.content}\n\nRelated Keywords: ${policy.keywords.join(", ")}`;
        
        await rag.add(ctx, {
          namespace,
          key: `demo_policy_${policy.title.toLowerCase().replace(/\s+/g, "_")}`,
          text: textChunk,
          filterValues: [
            { name: "spaceId", value: args.spaceId || "personal" },
            { name: "contentType", value: "demo_policy" },
            { name: "userId", value: userId },
          ],
        });
        addedPolicies++;
      } catch (error) {
        errors.push(`Failed to add policy ${policy.title}: ${error}`);
      }
    }

    return {
      success: true,
      addedPolicies,
      errors,
    };
  },
});

// Complete migration for all existing content
export const migrateAllExistingContent = action({
  args: { spaceId: v.optional(v.id("spaces")) },
  returns: v.object({
    success: v.boolean(),
    documents: v.object({
      success: v.boolean(),
      migratedCount: v.number(),
      totalDocuments: v.number(),
      errors: v.array(v.string()),
    }),
    websites: v.object({
      success: v.boolean(),
      migratedCount: v.number(),
      totalWebsites: v.number(),
      errors: v.array(v.string()),
    }),
    totalMigrated: v.number(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Migrate documents
    const documentResult: any = await ctx.runAction(api.rag.migrateExistingDocuments, { spaceId: args.spaceId });
    
    // Migrate websites
    const websiteResult: any = await ctx.runAction(api.rag.migrateExistingWebsites, { spaceId: args.spaceId });

    return {
      success: true,
      documents: documentResult,
      websites: websiteResult,
      totalMigrated: documentResult.migratedCount + websiteResult.migratedCount,
    };
  },
});

// Test function to verify RAG integration
export const testRAGIntegration = action({
  args: { spaceId: v.optional(v.id("spaces")) },
  returns: v.object({
    success: v.boolean(),
    testEntry: v.any(),
    searchResults: v.object({
      resultsCount: v.number(),
      hasResults: v.boolean(),
      sampleResult: v.any(),
    }),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const namespace = args.spaceId ? `space_${args.spaceId}` : `user_${userId}`;
    
    // Test adding content
    const testEntry = await rag.add(ctx, {
      namespace,
      key: "test_entry",
      text: "This is a test entry to verify RAG integration is working correctly.",
      filterValues: [
        { name: "spaceId", value: args.spaceId || "personal" },
        { name: "contentType", value: "test" },
        { name: "userId", value: userId },
      ],
    });

    // Test searching
    const searchResults = await rag.search(ctx, {
      namespace,
      query: "test integration",
      limit: 5,
    });

    return {
      success: true,
      testEntry,
      searchResults: {
        resultsCount: searchResults.results.length,
        hasResults: searchResults.results.length > 0,
        sampleResult: searchResults.results[0] || null,
      },
    };
  },
});
