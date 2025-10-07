import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { authComponent } from "./auth";
import { components, api } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";

/**
 * Helper function to get the authenticated user ID
 * Returns the user's _id if authenticated, null otherwise
 */
async function getAuthUserId(ctx: any): Promise<string | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}

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
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Create namespace based on user
    const namespace = `user_${userId}`;

    await rag.add(ctx, {
      namespace,
      key: `doc_${args.documentId}`,
      text: args.textContent,
      filterValues: [
        { name: "spaceId", value: "personal" },
        { name: "contentType", value: "document" },
        { name: "userId", value: userId },
      ],
    });

    return { success: true };
  },
});

// Document-based RAG pipeline - foundation of A.I.D.A.'s intelligent Space architecture

// Semantic search across all content
export const semanticSearch = action({
  args: {
    query: v.string(),
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

    // Create namespace based on user
    const namespace = `user_${userId}`;

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

    // Create namespace based on user
    const namespace = `user_${userId}`;

    const { text, context } = await rag.generateText(ctx, {
      search: { 
        namespace, 
        limit: 10,
        vectorScoreThreshold: 0.5,
      },
      prompt: `You are A.I.D.A., the Intelligent Experience Platform for Education. You are the official voice of this district's digital ecosystem, providing instant access to official policies, procedures, and information.

Your role is to provide accurate, authoritative answers to questions about district policies, procedures, handbooks, and official documents. Always cite the specific source document when providing information.

You are responding in a personal workspace.

User question: ${args.message}

Please provide a clear, accurate answer based on the district documents in your knowledge base. Always cite the specific source and section when possible. Keep responses concise and professional.`,
      model: openai("gpt-4o-mini"),
    });

    return { response: text, context };
  },
});

// Get RAG statistics for a namespace
export const getRAGStats = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const namespace = `user_${userId}`;
    
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
  args: {},
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

    // Get all documents for the user
    const documents: any = await ctx.runQuery(api.documents.getUserDocuments, {});
    
    let migratedCount = 0;
    const errors: string[] = [];

    for (const doc of documents) {
      try {
        await ctx.runAction(api.rag.addDocumentToRAG, {
          documentId: doc._id,
          textContent: doc.textContent,
          fileName: doc.fileName,
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

// Document-only migration - Spaces use uploaded documents as single source of truth

// Add demo data to RAG for realistic district policy responses
export const addDemoDataToRAG = action({
  args: {},
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

    // Demo district policy data - Comprehensive and realistic
    const demoPolicies = [
      {
        title: "Student Attendance Policy",
        content: "Our district requires students to maintain a minimum attendance rate of 95%. Students with more than 9 unexcused absences per semester may be required to attend a student attendance review board meeting. Teachers must mark attendance within the first 10 minutes of each class period. Excused absences include illness, family emergencies, religious observances, and medical appointments with proper documentation. Chronic absenteeism (missing 10% or more of school days) triggers mandatory intervention including parent conferences, attendance contracts, and referral to school social worker.",
        keywords: ["attendance", "absences", "excused", "unexcused", "95%", "review board", "documentation", "chronic absenteeism", "intervention", "social worker"]
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
      },
      {
        title: "School Safety and Emergency Procedures",
        content: "All staff must be trained on emergency procedures including fire drills, lockdown procedures, and severe weather protocols. Fire drills are conducted monthly and lockdown drills quarterly. Teachers must maintain updated emergency contact information for all students. In case of emergency, follow the RACE protocol: Report, Alert, Confine, Evacuate. All emergency incidents must be reported to administration immediately and documented using the district's incident reporting system.",
        keywords: ["safety", "emergency", "fire drill", "lockdown", "severe weather", "RACE protocol", "incident reporting"]
      },
      {
        title: "Student Information System (SIS) Usage and Data Privacy",
        content: "All student data must be entered and maintained in the district's Student Information System (SIS). Teachers must update grades, attendance, and behavioral records within 24 hours. Student information is protected under FERPA and may only be shared with authorized personnel. Teachers must never share student information via email or unsecured platforms. All SIS access is logged and monitored for compliance.",
        keywords: ["SIS", "student data", "FERPA", "privacy", "grades", "attendance", "authorized personnel", "monitored"]
      },
      {
        title: "Curriculum and Instructional Materials Policy",
        content: "All instructional materials must align with state standards and district curriculum maps. Teachers must use district-approved textbooks and supplementary materials. Any new materials must be reviewed by the curriculum committee and approved by administration. Digital resources must be vetted for educational value and age-appropriateness. Teachers are responsible for ensuring all materials support learning objectives and maintain academic rigor.",
        keywords: ["curriculum", "instructional materials", "state standards", "textbooks", "digital resources", "learning objectives", "academic rigor"]
      },
      {
        title: "Professional Development and Continuing Education",
        content: "All certified staff must complete 20 hours of professional development annually, including 10 hours of district-mandated training and 10 hours of self-selected learning. Topics must align with district goals and individual professional growth plans. Professional development hours must be documented in the district's learning management system. Teachers are encouraged to pursue advanced degrees and certifications relevant to their teaching assignments.",
        keywords: ["professional development", "20 hours", "mandated training", "growth plans", "advanced degrees", "certifications"]
      },
      {
        title: "Student Assessment and Testing Procedures",
        content: "All assessments must be administered according to state and district guidelines. Teachers must provide appropriate accommodations for students with IEPs and 504 plans. Test security protocols must be followed, including secure storage of test materials and monitoring during administration. Results must be entered into the SIS within 48 hours. Teachers must analyze assessment data to inform instruction and provide targeted interventions for struggling students.",
        keywords: ["assessment", "testing", "accommodations", "IEP", "504", "test security", "data analysis", "interventions"]
      },
      {
        title: "Technology Integration and Digital Citizenship",
        content: "Teachers must integrate technology meaningfully into instruction to enhance learning outcomes. All technology use must align with district's acceptable use policy and digital citizenship standards. Students must be taught responsible use of technology, including online safety, cyberbullying prevention, and digital footprint awareness. Teachers should model appropriate technology use and monitor student online activities during class time.",
        keywords: ["technology integration", "digital citizenship", "acceptable use", "online safety", "cyberbullying", "digital footprint", "monitoring"]
      },
      {
        title: "Student Support Services and Intervention Programs",
        content: "Teachers must identify students who need additional support and refer them to appropriate services. This includes academic interventions, behavioral support, and social-emotional learning programs. Teachers should collaborate with counselors, special education staff, and intervention specialists to develop comprehensive support plans. Progress monitoring is required for all students receiving intervention services, with data reviewed monthly by the student support team.",
        keywords: ["student support", "interventions", "academic support", "behavioral support", "social-emotional", "counselors", "progress monitoring"]
      },
      {
        title: "Classroom Management and Positive Behavior Support",
        content: "Teachers must establish clear expectations and consistent routines in their classrooms. Positive behavior support strategies should be used to prevent and address behavioral issues. Teachers should build positive relationships with students and families. Disciplinary actions must be fair, consistent, and documented. Teachers should seek support from administration and student services when behavioral issues persist or escalate.",
        keywords: ["classroom management", "positive behavior", "expectations", "routines", "relationships", "disciplinary actions", "documentation"]
      },
      {
        title: "Cultural Responsiveness and Equity in Education",
        content: "Teachers must create inclusive learning environments that respect and value diversity. Instruction should be culturally responsive and address the needs of all students. Teachers must examine their own biases and work to ensure equitable outcomes for all students. Materials and examples should reflect the diversity of the student population. Teachers should seek professional development on cultural competency and equity in education.",
        keywords: ["cultural responsiveness", "equity", "inclusive", "diversity", "biases", "equitable outcomes", "cultural competency"]
      }
    ];

    // Create namespace based on user
    const namespace = `user_${userId}`;

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
            { name: "spaceId", value: "personal" },
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

// Migration for documents only - web scraping removed
export const migrateAllExistingContent = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    documents: v.object({
      success: v.boolean(),
      migratedCount: v.number(),
      totalDocuments: v.number(),
      errors: v.array(v.string()),
    }),
    totalMigrated: v.number(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Migrate documents only
    const documentResult: any = await ctx.runAction(api.rag.migrateExistingDocuments, {});

    return {
      success: true,
      documents: documentResult,
      totalMigrated: documentResult.migratedCount,
    };
  },
});

// Process uploaded files from storage and add to RAG
export const processUploadedFiles = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    processedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // For now, let's add some demo content to get the RAG system working
    // In a real implementation, you'd process the actual uploaded files
    const namespace = `user_${userId}`;
    
    let processedCount = 0;
    const errors: string[] = [];

    // Add some sample district policy content to get the RAG working
    const samplePolicies = [
      {
        title: "Student Attendance Policy",
        content: "Students must maintain 95% attendance rate. Excused absences include illness, family emergencies, and medical appointments with documentation. Chronic absenteeism triggers intervention including parent conferences and attendance contracts."
      },
      {
        title: "Homework and Assignment Policy", 
        content: "Elementary students: 30 minutes max per night. Middle school: 60 minutes max. High school: 90 minutes max. Teachers must provide clear instructions and due dates. Late work policies must be communicated to students and parents."
      },
      {
        title: "Student Discipline Policy",
        content: "Progressive discipline approach. Minor infractions: verbal warnings. Repeated violations: parent contact, detention, or in-school suspension. Major infractions: out-of-school suspension or expulsion. All actions documented in SIS within 24 hours."
      }
    ];

    for (const policy of samplePolicies) {
      try {
        const textContent = `District Policy: ${policy.title}\n\n${policy.content}`;
        
        await rag.add(ctx, {
          namespace,
          key: `sample_policy_${policy.title.toLowerCase().replace(/\s+/g, "_")}`,
          text: textContent,
          filterValues: [
            { name: "spaceId", value: "personal" },
            { name: "contentType", value: "district_policy" },
            { name: "userId", value: userId },
          ],
        });
        
        processedCount++;
      } catch (error) {
        errors.push(`Failed to add policy ${policy.title}: ${error}`);
      }
    }

    return {
      success: true,
      processedCount,
      errors,
    };
  },
});

// Test function to verify RAG integration
export const testRAGIntegration = action({
  args: {},
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

    const namespace = `user_${userId}`;
    
    // Test adding content
    const testEntry = await rag.add(ctx, {
      namespace,
      key: "test_entry",
      text: "This is a test entry to verify RAG integration is working correctly.",
      filterValues: [
        { name: "spaceId", value: "personal" },
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

// Add Louisiana-specific district content to RAG for PD demo
export const addLouisianaDistrictContent = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    addedCount: v.number(),
    categories: v.object({
      leads: v.number(),
      sped: v.number(),
      counselor: v.number(),
      niet: v.number(),
      ckh: v.number(),
    }),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const namespace = `user_${userId}`;
    let totalAdded = 0;
    const categoryCount = { leads: 0, sped: 0, counselor: 0, niet: 0, ckh: 0 };
    const errors: string[] = [];

    // LDOE LEADS Framework Content
    const leadsContent = [
      {
        title: "LEADS Framework Overview",
        category: "leads" as const,
        content: `Louisiana Educator Advancement and Development System (LEADS) is the state's reimagined teacher evaluation framework, launching statewide in 2025-2026. Based on feedback from over 8,000 Louisiana educators, LEADS focuses on:

- More responsive and impactful evaluation processes
- Professional growth and development
- Supporting both educators and students
- Multiple evaluation components and conferences

The system replaces the previous Compass evaluation system and introduces new rubrics, observation protocols, and professional growth planning tools.`,
        keywords: ["LEADS", "evaluation", "teacher evaluation", "Louisiana", "LDOE", "professional development", "2025-2026"]
      },
      {
        title: "Louisiana Educator Rubric - Planning and Preparation",
        category: "leads" as const,
        content: `Component 1: Planning and Preparation includes demonstrating knowledge of content and students, setting instructional outcomes, demonstrating knowledge of resources, designing coherent instruction, and designing student assessment. Teachers must show they understand their subject matter, know their students' needs, set clear learning goals, use appropriate resources, create well-structured lessons, and plan effective assessments.`,
        keywords: ["planning", "preparation", "lesson planning", "instructional design", "student assessment", "learning objectives"]
      },
      {
        title: "Louisiana Educator Rubric - Classroom Environment",
        category: "leads" as const,
        content: `Component 2: Classroom Environment focuses on creating an environment of respect and rapport, establishing a culture for learning, managing classroom procedures, managing student behavior, and organizing physical space. Effective teachers build positive relationships, set high expectations, establish efficient routines, maintain appropriate behavior standards, and optimize classroom layout for learning.`,
        keywords: ["classroom management", "classroom environment", "student behavior", "classroom culture", "physical space", "procedures"]
      },
      {
        title: "Louisiana Educator Rubric - Instruction",
        category: "leads" as const,
        content: `Component 3: Instruction emphasizes communicating with students, using questioning and discussion techniques, engaging students in learning, using assessment in instruction, and demonstrating flexibility and responsiveness. Strong instructional practice includes clear communication, higher-order thinking questions, student engagement strategies, formative assessment, and adapting to student needs in real-time.`,
        keywords: ["instruction", "teaching strategies", "student engagement", "questioning", "formative assessment", "differentiation", "flexibility"]
      },
      {
        title: "Louisiana Educator Rubric - Professional Responsibilities",
        category: "leads" as const,
        content: `Component 4: Professional Responsibilities covers reflecting on teaching, maintaining accurate records, communicating with families, participating in a professional community, growing and developing professionally, and showing professionalism. Teachers must be reflective practitioners, keep organized documentation, partner with families, collaborate with colleagues, pursue continuous learning, and maintain ethical standards.`,
        keywords: ["professional responsibilities", "reflection", "parent communication", "collaboration", "professional growth", "ethics", "record keeping"]
      },
      {
        title: "LEADS Evaluation Ratings and Performance Levels",
        category: "leads" as const,
        content: `LEADS uses four performance levels for educator evaluation:
- Ineffective: Does not meet expectations; requires significant improvement
- Effective: Emerging: Developing skills; showing progress toward proficiency
- Effective: Proficient: Consistently meets expectations; solid professional practice
- Highly Effective: Exceeds expectations; exemplary professional practice

Teachers receive ratings based on multiple measures including classroom observations, professional growth plans, and student learning targets. The evaluation process includes pre-conferences, observations, post-conferences, and mid-year reviews.`,
        keywords: ["evaluation ratings", "performance levels", "highly effective", "proficient", "emerging", "ineffective", "observation"]
      },
    ];

    // SPED and Accommodations Content
    const spedContent = [
      {
        title: "IEP Implementation Requirements for Teachers",
        category: "sped" as const,
        content: `Individualized Education Programs (IEPs) are legal documents that must be followed precisely. Teacher responsibilities include:
- Review all IEPs at the beginning of the semester
- Implement all specified accommodations and modifications consistently
- Document accommodation implementation
- Communicate concerns to the special education coordinator immediately
- Participate in IEP meetings as requested
- Update progress on IEP goals regularly

Common accommodations: extended time on tests, preferential seating, use of assistive technology, modified assignments, small group instruction, frequent breaks, visual aids, and read-aloud support.`,
        keywords: ["IEP", "individualized education program", "accommodations", "special education", "disabilities", "modifications", "implementation"]
      },
      {
        title: "Section 504 Accommodation Plans",
        category: "sped" as const,
        content: `Section 504 plans provide accommodations for students with disabilities who don't qualify for special education services but need support to access the general education curriculum. Unlike IEPs, 504 plans don't require specialized instruction - they focus on removing barriers to learning.

Common 504 accommodations include preferential seating, extended time, use of technology, modified testing conditions, and breaks as needed. Teachers must implement all 504 accommodations exactly as specified in the student's plan. These plans are legally binding under federal law.`,
        keywords: ["504", "Section 504", "accommodations", "disabilities", "general education", "testing accommodations", "accessibility"]
      },
      {
        title: "FERPA and Student Privacy Requirements",
        category: "sped" as const,
        content: `Student information is protected under FERPA (Family Educational Rights and Privacy Act). Teachers must:
- Never share student information via email or unsecured platforms
- Only discuss student information with authorized personnel
- Keep IEPs and 504 plans confidential and secure
- Be aware that all system access is logged and monitored
- Obtain proper consent before sharing educational records
- Protect students' personally identifiable information

Violations of FERPA can result in serious consequences for both the teacher and the district. When in doubt about sharing information, consult with administration or the special education coordinator.`,
        keywords: ["FERPA", "privacy", "confidentiality", "student records", "educational records", "data protection", "authorized personnel"]
      },
      {
        title: "Dyslexia Screening and Support in Louisiana",
        category: "sped" as const,
        content: `Louisiana requires dyslexia screening and specialized support through Bulletin 1903. Key requirements:
- Universal screening for dyslexia and related disorders
- Evidence-based intervention programs for identified students
- Specialized instruction by trained teachers
- Progress monitoring and data collection
- Parent notification and involvement

Teachers should watch for signs of dyslexia including difficulty with phonological awareness, decoding, spelling, and reading fluency. Early identification and intervention are critical for student success. Refer students showing signs of dyslexia to the school's screening team.`,
        keywords: ["dyslexia", "Bulletin 1903", "screening", "reading disorders", "intervention", "phonological awareness", "decoding"]
      },
    ];

    // Counselor Tools and Resources
    const counselorContent = [
      {
        title: "ACT Test Preparation and Registration",
        category: "counselor" as const,
        content: `ACT Test Information for School Counselors:
- Registration deadlines: 5 weeks before test date
- Test dates: September, October, December, February, April, June
- Fee waivers available for eligible students through the counseling office
- Students should register online at act.org
- ACT prep resources available in the school library and online
- Practice tests should be administered at least twice before the actual test
- Students should take the ACT at least once during junior year

Counselors should help students understand score ranges, college admission requirements, and scholarship opportunities based on ACT scores.`,
        keywords: ["ACT", "college readiness", "testing", "registration", "test prep", "college admission", "scholarships"]
      },
      {
        title: "WorkKeys Assessment for Career Readiness",
        category: "counselor" as const,
        content: `WorkKeys is Louisiana's career readiness assessment required for Jump Start students. Key information:
- Three components: Applied Math, Graphic Literacy, Workplace Documents
- Administered during junior year to Career and Technical Education students
- Results used for workforce certification and college readiness measurement
- National Career Readiness Certificate (NCRC) awarded based on scores
- Practice tests available online through ACT WorkKeys website
- Students need Bronze, Silver, Gold, or Platinum level certificates

Counselors should ensure all CTE students are registered and prepare students using available practice materials. WorkKeys scores are valuable for employment and postsecondary education.`,
        keywords: ["WorkKeys", "career readiness", "Jump Start", "CTE", "workforce certification", "NCRC", "career technical education"]
      },
      {
        title: "Ripple Effects Social-Emotional Learning Program",
        category: "counselor" as const,
        content: `Ripple Effects is a computer-based social-emotional learning and behavior intervention program. Program features:
- Self-paced interactive lessons on social-emotional skills
- Addresses: anger management, peer relationships, study skills, decision-making, self-control
- Students can access individually or in small counselor-led groups
- Progress monitored through program dashboard
- Appropriate for grades 4-12
- Referrals made through school counselor or administration

Counselors should use Ripple Effects for tier 2 and tier 3 interventions, especially for students struggling with behavior, social skills, or emotional regulation. The program provides data on student engagement and skill development.`,
        keywords: ["Ripple Effects", "social-emotional learning", "behavior intervention", "SEL", "anger management", "counseling tools", "student support"]
      },
      {
        title: "College and Career Counseling Timeline",
        category: "counselor" as const,
        content: `Key Counseling Tasks and Deadlines:
- Course scheduling: January-February for next school year
- Transcript requests: Allow 2-week processing time
- College application support: Begin fall of senior year
- FAFSA completion assistance: Opens October 1st annually (priority deadline varies by college)
- Career interest inventories: Administer in 8th, 10th, and 11th grades
- College visits: Coordinate during junior and senior years
- Scholarship applications: Begin searching in junior year, apply senior year

Counselors should maintain a yearly calendar of deadlines and proactively remind students and families of upcoming important dates. Early planning is critical for college and career success.`,
        keywords: ["college counseling", "career planning", "FAFSA", "college applications", "transcripts", "scholarships", "deadlines", "student planning"]
      },
    ];

    // NIET Best Practices
    const nietContent = [
      {
        title: "NIET Observation and Feedback Cycle",
        category: "niet" as const,
        content: `National Institute for Excellence in Teaching (NIET) provides professional development focused on effective teaching practices. NIET observation cycle includes:
- Pre-observation conferences to discuss lesson plans and objectives
- Classroom observations (announced and unannounced)
- Post-observation feedback sessions with specific, actionable feedback
- Action planning for continuous improvement

Key Focus Areas:
- Standards-aligned instruction with clear learning objectives
- Multiple student engagement strategies throughout the lesson
- Frequent checks for understanding using varied methods
- Specific, timely feedback to students on their learning
- Differentiated instruction meeting diverse learner needs
- Positive classroom culture and effective behavior management
- Use of assessment data to inform instruction

NIET emphasizes the importance of specific, evidence-based feedback that teachers can immediately apply to improve their practice.`,
        keywords: ["NIET", "observation", "feedback", "professional development", "teaching effectiveness", "student engagement", "instructional strategies"]
      },
      {
        title: "NIET Best Practices for Classroom Observations",
        category: "niet" as const,
        content: `NIET Observation Best Practices for Teachers:
- Have clear, visible learning objectives posted
- Use multiple engagement strategies (think-pair-share, questioning, hands-on activities)
- Check for understanding frequently throughout the lesson
- Provide specific, actionable feedback to students
- Maintain positive, respectful relationships with all students
- Use effective classroom management strategies
- Show evidence of using data to plan and adjust instruction
- Differentiate for various learner needs
- Connect content to real-world applications
- Demonstrate strong content knowledge

Prepare by reviewing your lesson plan, ensuring materials are ready, and thinking about how you'll engage all learners. Remember that NIET focuses on continuous growth - observations are opportunities to learn and improve, not just evaluate.`,
        keywords: ["NIET observation", "teaching strategies", "best practices", "classroom management", "student engagement", "differentiation", "assessment"]
      },
    ];

    // Core Knowledge/Hillsdale (CKH) Content
    const ckhContent = [
      {
        title: "Core Knowledge History and Geography (CKH) Overview",
        category: "ckh" as const,
        content: `Core Knowledge History and Geography is our district's adopted social studies curriculum emphasizing content-rich, systematic instruction. Key principles:
- Build knowledge systematically across grade levels
- Focus on world geography and history with cultural literacy
- Integration of primary source documents and artifacts
- Development of critical thinking and analytical skills
- Coherent, cumulative learning sequence

Implementation Requirements:
- Follow the scope and sequence for your grade level
- Use provided text resources and supplementary materials
- Incorporate required vocabulary and key concepts
- Assess student knowledge using provided assessments
- Supplement with additional primary sources when possible

CKH builds a strong foundation of cultural literacy and historical knowledge that students will use throughout their education.`,
        keywords: ["Core Knowledge", "CKH", "Hillsdale", "social studies", "history", "geography", "curriculum", "cultural literacy"]
      },
      {
        title: "CKH Grade-Level Focus Areas",
        category: "ckh" as const,
        content: `Core Knowledge History and Geography by Grade Level:

Kindergarten: Exploring People and Places - basic geography, community helpers, seasons
1st Grade: Early American Civilizations and Communities - Native Americans, colonial America, community roles
2nd Grade: Early Asian Civilizations and American Westward Expansion - ancient China and India, pioneers, westward movement
3rd Grade: Ancient Rome and California Missions - Roman civilization, Spanish missions, California history
4th Grade: The Middle Ages and Age of Exploration - medieval Europe, Vikings, European explorers, discovery of Americas
5th Grade: Early American History and Indigenous Peoples - American Revolution, Constitution, Native American nations, early republic

Teachers should follow the grade-level scope and sequence, use primary sources, and help students make connections between past events and present-day life. CKH emphasizes building knowledge systematically from year to year.`,
        keywords: ["CKH curriculum", "grade level", "social studies standards", "history curriculum", "scope and sequence", "ancient civilizations"]
      },
    ];

    // Add all content to RAG
    const allContent = [
      ...leadsContent,
      ...spedContent,
      ...counselorContent,
      ...nietContent,
      ...ckhContent,
    ];

    for (const item of allContent) {
      try {
        const textChunk = `${item.title}\n\nSource: Louisiana District Professional Resources\nCategory: ${item.category.toUpperCase()}\n\n${item.content}\n\nRelated Keywords: ${item.keywords.join(", ")}`;
        
        await rag.add(ctx, {
          namespace,
          key: `louisiana_${item.category}_${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
          text: textChunk,
          filterValues: [
            { name: "spaceId", value: "personal" },
            { name: "contentType", value: `louisiana_${item.category}` },
            { name: "userId", value: userId },
          ],
        });
        
        totalAdded++;
        categoryCount[item.category]++;
      } catch (error) {
        errors.push(`Failed to add ${item.title}: ${error}`);
      }
    }

    return {
      success: true,
      addedCount: totalAdded,
      categories: categoryCount,
      errors,
    };
  },
});
