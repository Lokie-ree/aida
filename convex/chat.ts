import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const getChatHistory = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

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

      // Return chat history for the specific space
      return await ctx.db
        .query("chatMessages")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
        .order("asc")
        .take(50);
    }

    // Return personal chat history (no spaceId)
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("spaceId"), undefined))
      .order("asc")
      .take(50);
  },
});

export const sendMessage = action({
  args: { 
    message: v.string(),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args): Promise<string> => {
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
      // Save user message
      await ctx.runMutation(api.chat.saveMessage, {
        role: "user",
        content: args.message,
        spaceId: args.spaceId,
      });

      // Use RAG for semantic search and response generation
      const { response: aiResponse, context } = await ctx.runAction(api.rag.generateResponseWithRAG, {
        message: args.message,
        spaceId: args.spaceId,
      });

      // Extract context information for tracking
      const contextDocuments: string[] = [];
      const contextWebsites: string[] = [];
      
      if (context && context.entries) {
        context.entries.forEach((entry: any) => {
          if (entry.key.startsWith('doc_')) {
            contextDocuments.push(entry.key.replace('doc_', ''));
          } else if (entry.key.startsWith('web_')) {
            contextWebsites.push(entry.key.replace('web_', ''));
          }
        });
      }

      // Save AI response
      await ctx.runMutation(api.chat.saveMessage, {
        role: "assistant",
        content: aiResponse,
        contextDocuments: contextDocuments.length > 0 ? contextDocuments : undefined,
        contextWebsites: contextWebsites.length > 0 ? contextWebsites : undefined,
        spaceId: args.spaceId,
      });

      return aiResponse;
    } catch (error) {
      console.error("Error in chat:", error);
      throw new Error("Failed to process message");
    }
  },
});

export const saveMessage = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    contextDocuments: v.optional(v.array(v.string())),
    contextWebsites: v.optional(v.array(v.string())),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    return await ctx.db.insert("chatMessages", {
      userId,
      role: args.role,
      content: args.content,
      contextDocuments: args.contextDocuments,
      contextWebsites: args.contextWebsites,
      spaceId: args.spaceId,
    });
  },
});

export const clearChatHistory = mutation({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    let messages;
    if (args.spaceId) {
      // Verify user has access to the space
      const membership = await ctx.db
        .query("spaceMembers")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
        .first();

      if (!membership) {
        throw new Error("You don't have access to this space");
      }

      messages = await ctx.db
        .query("chatMessages")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
        .collect();
    } else {
      messages = await ctx.db
        .query("chatMessages")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("spaceId"), undefined))
        .collect();
    }

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});
