import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { authComponent } from "./auth";
import { api } from "./_generated/api";

/**
 * Helper function to get the authenticated user ID
 * Returns the user's _id if authenticated, null otherwise
 */
async function getAuthUserId(ctx: any): Promise<string | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const processUploadedDocument = action({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.number(),
    contentType: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    documentId: v.id("documents"),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    try {
      // Get the file from storage
      const file = await ctx.storage.get(args.storageId);
      if (!file) {
        throw new Error("File not found");
      }

      // Extract text content (for now, assume text files)
      const textContent = await file.text();
      
      // Save document
      const documentId: any = await ctx.runMutation(api.documents.saveDocument, {
        fileName: args.fileName,
        fileSize: args.fileSize,
        storageId: args.storageId,
        contentType: args.contentType,
        textContent,
      });

      // Add document to RAG for semantic search
      await ctx.runAction(api.rag.addDocumentToRAG, {
        documentId,
        textContent,
        fileName: args.fileName,
      });

      return { success: true, documentId };
    } catch (error) {
      console.error("Error processing document:", error);
      throw new Error("Failed to process document");
    }
  },
});

export const saveDocument = mutation({
  args: {
    fileName: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    contentType: v.string(),
    textContent: v.string(),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    return await ctx.db.insert("documents", {
      userId,
      fileName: args.fileName,
      fileSize: args.fileSize,
      storageId: args.storageId,
      contentType: args.contentType,
      textContent: args.textContent,
    });
  },
});

export const getUserDocuments = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Return personal documents
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getDocumentById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Check ownership for personal documents
    if (document.userId !== userId) {
      throw new Error("Access denied");
    }

    // Delete from storage
    await ctx.storage.delete(document.storageId);
    
    // Delete from database
    await ctx.db.delete(args.documentId);
  },
});

export const searchDocuments = query({
  args: { 
    query: v.string(),
  },
  handler: async (ctx, args): Promise<Array<{
    documentId: string;
    fileName: string;
    textContent: string;
    relevanceScore: number;
  }>> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    try {
      // Get personal documents
      const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      // Simple text-based search
      const searchTerms = args.query.toLowerCase().split(' ').filter(term => term.length > 2);
      const results: Array<{
        documentId: string;
        fileName: string;
        textContent: string;
        relevanceScore: number;
      }> = [];

      for (const doc of documents) {
        const content = doc.textContent.toLowerCase();
        let score = 0;
        
        // Calculate relevance score based on term matches
        for (const term of searchTerms) {
          const matches = (content.match(new RegExp(term, 'g')) || []).length;
          score += matches;
        }
        
        if (score > 0) {
          results.push({
            documentId: doc._id,
            fileName: doc.fileName,
            textContent: doc.textContent.substring(0, 500) + "...",
            relevanceScore: score,
          });
        }
      }

      // Sort by relevance score (highest first)
      return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
    } catch (error) {
      console.error("Error searching documents:", error);
      return [];
    }
  },
});
