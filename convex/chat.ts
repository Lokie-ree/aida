import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { authComponent } from "./auth";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

/**
 * Helper function to get the authenticated user ID
 * Returns the user's _id if authenticated, null otherwise
 */
async function getAuthUserId(ctx: any): Promise<string | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}

export const getChatHistory = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Return personal chat history
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .take(50);
  },
});

export const sendMessage = action({
  args: { 
    message: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    try {
      // Save user message
      await ctx.runMutation(api.chat.saveMessage, {
        role: "user",
        content: args.message,
      });

      // Use RAG for semantic search and response generation
      const { response: aiResponse, context } = await ctx.runAction(api.rag.generateResponseWithRAG, {
        message: args.message,
      });

      // Extract context information for tracking
      const contextDocuments: string[] = [];
      
      if (context && context.entries) {
        context.entries.forEach((entry: any) => {
          if (entry.key.startsWith('doc_')) {
            contextDocuments.push(entry.key.replace('doc_', ''));
          } else if (entry.key.startsWith('demo_policy_')) {
            contextDocuments.push(entry.key.replace('demo_policy_', 'District Policy: '));
          }
        });
      }

      // Save AI response with document context
      await ctx.runMutation(api.chat.saveMessage, {
        role: "assistant",
        content: aiResponse,
        contextDocuments: contextDocuments.length > 0 ? contextDocuments : undefined,
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
    });
  },
});

export const clearChatHistory = mutation({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});
