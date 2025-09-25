import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

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
    spaceId: v.optional(v.id("spaces")),
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

    // If spaceId is provided, verify user has access to the space
    if (args.spaceId) {
      const membership = await ctx.runQuery(api.spaces.getSpaceById, { spaceId: args.spaceId });
      if (!membership) {
        throw new Error("You don't have access to this space");
      }
    }

    try {
      // Get the file from storage
      const file = await ctx.storage.get(args.storageId);
      if (!file) {
        throw new Error("File not found");
      }

      // Extract text content (for now, assume text files)
      const textContent = await file.text();
      
      // Save document with space association
      const documentId: any = await ctx.runMutation(api.documents.saveDocument, {
        fileName: args.fileName,
        fileSize: args.fileSize,
        storageId: args.storageId,
        contentType: args.contentType,
        textContent,
        spaceId: args.spaceId,
      });

      // Add document to RAG for semantic search
      await ctx.runAction(api.rag.addDocumentToRAG, {
        documentId,
        textContent,
        fileName: args.fileName,
        spaceId: args.spaceId,
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
    spaceId: v.optional(v.id("spaces")),
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
      spaceId: args.spaceId,
    });
  },
});

export const getUserDocuments = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // If spaceId is provided, verify user has access to the space
    if (args.spaceId) {
      const membership = await ctx.db
        .query("spaceMembers")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
        .first();

      if (!membership) {
        return [];
      }

      // Return documents for the specific space
      return await ctx.db
        .query("documents")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
        .order("desc")
        .collect();
    }

    // Return personal documents (no spaceId)
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("spaceId"), undefined))
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

    // Check if user has permission to delete
    if (document.spaceId) {
      // For space documents, check if user is a member
      const membership = await ctx.db
        .query("spaceMembers")
        .withIndex("by_space", (q) => q.eq("spaceId", document.spaceId!))
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
        .first();

      if (!membership) {
        throw new Error("You don't have access to this space");
      }
    } else {
      // For personal documents, check ownership
      if (document.userId !== userId) {
        throw new Error("Access denied");
      }
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
    spaceId: v.optional(v.id("spaces")),
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
      let documents;

      if (args.spaceId) {
        // Verify user has access to the space
        const membership = await ctx.db
          .query("spaceMembers")
          .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
          .filter((q) => q.eq(q.field("userId"), userId))
          .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
          .first();

        if (!membership) {
          return [];
        }

        // Get documents for the specific space
        documents = await ctx.db
          .query("documents")
          .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
          .collect();
      } else {
        // Get personal documents
        documents = await ctx.db
          .query("documents")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .filter((q) => q.eq(q.field("spaceId"), undefined))
          .collect();
      }

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
