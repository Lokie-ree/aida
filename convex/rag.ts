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
