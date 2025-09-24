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

      // Search for relevant documents using simple text search
      const relevantDocs: Array<{
        documentId: string;
        fileName: string;
        textContent: string;
        relevanceScore: number;
      }> = await ctx.runQuery(api.documents.searchDocuments, {
        query: args.message,
        spaceId: args.spaceId,
      });

      // Search for relevant scraped websites
      const relevantWebsites: Array<{
        websiteId: string;
        title: string;
        url: string;
        content: string;
        relevanceScore: number;
      }> = await ctx.runQuery(api.webscraping.searchScrapedWebsites, {
        query: args.message,
        spaceId: args.spaceId,
      });

      // Build context from relevant sources
      let context: string = "";
      const contextDocuments: string[] = [];
      const contextWebsites: string[] = [];
      
      // Add document context
      if (relevantDocs.length > 0) {
        context += "Context from uploaded documents:\n\n";
        relevantDocs.forEach((doc: any) => {
          context += `Document: ${doc.fileName}\n${doc.textContent}\n\n`;
          contextDocuments.push(doc.fileName);
        });
      }

      // Add website context
      if (relevantWebsites.length > 0) {
        context += "Context from scraped websites:\n\n";
        relevantWebsites.forEach((website: any) => {
          context += `Website: ${website.title} (${website.url})\n${website.content}\n\n`;
          contextWebsites.push(website.title);
        });
      }

      // Get recent chat history for context
      const recentMessages: Array<{
        _id: string;
        role: "user" | "assistant";
        content: string;
        _creationTime: number;
      }> = await ctx.runQuery(api.chat.getChatHistory, { spaceId: args.spaceId });
      
      const conversationHistory: string = recentMessages
        .slice(-10) // Last 10 messages
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join("\n");

      // Create the prompt with space context
      const spaceContext = args.spaceId ? 
        "You are responding in a shared team space where multiple users collaborate and share knowledge." :
        "You are responding in a personal workspace.";

      const prompt: string = `You are A.I.D.A. (AI Instructional Design Assistant), an expert instructional coach with years of experience in curriculum design and pedagogy. You provide constructive, actionable feedback to enhance teaching and learning.

${spaceContext}

${context ? `${context}\n` : ""}Previous conversation:
${conversationHistory}

Current question: ${args.message}

Please provide helpful, specific guidance based on instructional design best practices. If you have relevant context from documents or scraped websites, reference them specifically in your response.`;

      // Generate AI response
      const response: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse: string = response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";

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
