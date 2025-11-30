import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery, type ActionCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { rag } from "./rag";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const PELICAN_SYSTEM_PROMPT = `You are Pelican AI, an intelligent coaching assistant built by a Louisiana teacher for Louisiana teachers. Your role is to help teachers generate high-quality, Louisiana-aligned prompts they can use in any AI tool (ChatGPT, Claude, Gemini, etc.).

CORE BEHAVIORS:
1. Ask clarifying questions like a colleague would, not like a form
2. Demonstrate knowledge of Louisiana Educator Rubric, Louisiana Student Standards, and LEADS framework
3. Generate prompts that are immediately usable and Louisiana-specific
4. Use teacher-to-teacher voice (authentic, not corporate)
5. Focus on improving practice, not just saving time

CONVERSATION FLOW:
1. Understand what they're teaching (grade, subject, specific topic)
2. Identify the real challenge (misconception, pacing, differentiation, etc.)
3. Connect to Louisiana frameworks naturally (LER indicator, standards)
4. Generate a prompt that addresses their specific context
5. Explain how to use it

CRITICAL: Never generate the lesson content itself. Generate the PROMPT that teachers can use in their preferred AI tool to get Louisiana-aligned support.`;

// Mutation to start a new conversation
export const startConversation = mutation({
  args: {
    title: v.optional(v.string()),
  },
  returns: v.id("promptConversations"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Initialize agent thread
    const agent = new Agent(components.agent, {
      name: "PelicanCoach",
      languageModel: openai("gpt-4o"),
    });
    const { threadId } = await agent.createThread(ctx, {});

    return await ctx.db.insert("promptConversations", {
      userId: user._id,
      title: args.title || "New Conversation",
      messages: [],
      threadId, // Link to Agent thread
      status: "active",
      lastUpdated: Date.now(),
    });
  },
});

// Query to get a conversation by ID
export const getConversation = query({
  args: { conversationId: v.id("promptConversations") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== user._id) {
      throw new Error("Conversation not found or access denied");
    }

    return conversation;
  },
});

// Query to list recent conversations
export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db
      .query("promptConversations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20);
  },
});

// Internal mutation to append a message to history
// Kept for syncing Agent messages to frontend table
export const appendMessage = internalMutation({
  args: {
    conversationId: v.id("promptConversations"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const newMessage = {
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.conversationId, {
      messages: [...conversation.messages, newMessage],
      lastUpdated: Date.now(),
    });
  },
});

// Action to handle sending a message (using Agent component)
export const sendMessage = action({
  args: {
    conversationId: v.id("promptConversations"),
    message: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // 1. Get conversation to find threadId
    const conversation = await ctx.runQuery(internal.promptCoach.getConversationInternal, {
      conversationId: args.conversationId
    });

    if (!conversation) throw new Error("Conversation not found");

    // 2. Save user message to our sync table (frontend compatibility)
    await ctx.runMutation(internal.promptCoach.appendMessage, {
      conversationId: args.conversationId,
      role: "user",
      content: args.message,
    });

    // 3. Initialize Agent
    const agent = new Agent(components.agent, {
      name: "PelicanCoach",
      languageModel: openai("gpt-4o"),
      instructions: PELICAN_SYSTEM_PROMPT,
    });

    // Retrieve standards manually (since we are moving fast and tool definition syntax is tricky without docs)
    const searchTerms = args.message; 
    const { results: standardResults } = await rag.search(ctx, {
      namespace: "louisiana_standards",
      query: searchTerms,
      limit: 3,
      filters: [{ name: "contentType", value: "louisiana_standard" }]
    });

    const relevantStandards = standardResults
      .map((r) => r.content[0]?.text)
      .filter(Boolean)
      .join("\n\n");

    let promptWithContext = args.message;
    if (relevantStandards) {
       promptWithContext += `\n\nRELEVANT LOUISIANA STANDARDS:\n${relevantStandards}`;
    }

    // 4. Ensure thread exists
    let threadId = conversation.threadId;
    if (!threadId) {
       const threadResult = await agent.createThread(ctx, {});
       threadId = threadResult.threadId;
    }

    // 5. Run Agent
    const response = await agent.generateText(ctx, {
      threadId,
    }, {
      prompt: promptWithContext, 
    });

    const responseText = response.text;

    // 6. Save assistant response to our sync table
    await ctx.runMutation(internal.promptCoach.appendMessage, {
      conversationId: args.conversationId,
      role: "assistant",
      content: responseText,
    });

    return responseText;
  },
});

// Internal query to get conversation (bypasses auth check for internal use)
export const getConversationInternal = internalQuery({
    args: { conversationId: v.id("promptConversations") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.conversationId);
    }
});

// Mutation to save a prompt to the library
export const savePrompt = mutation({
  args: {
    conversationId: v.id("promptConversations"),
    promptText: v.string(),
    context: v.object({
      grade: v.optional(v.string()),
      subject: v.optional(v.string()),
      topic: v.optional(v.string()),
      challenge: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("generatedPrompts", {
      userId: user._id,
      conversationId: args.conversationId,
      promptText: args.promptText,
      context: args.context,
      isExemplar: false,
      createdAt: Date.now(),
    });
  },
});

// Query to get saved prompts
export const getSavedPrompts = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db
      .query("generatedPrompts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Mutation to delete a saved prompt
export const deleteSavedPrompt = mutation({
    args: { promptId: v.id("generatedPrompts") },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        const prompt = await ctx.db.get(args.promptId);
        if (!prompt || prompt.userId !== user._id) {
            throw new Error("Prompt not found or access denied");
        }

        await ctx.db.delete(args.promptId);
    }
});

// Mutation to toggle "Worked in Classroom" feedback
export const toggleWorkedInClassroom = mutation({
    args: { promptId: v.id("generatedPrompts"), worked: v.boolean() },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        const prompt = await ctx.db.get(args.promptId);
        if (!prompt || prompt.userId !== user._id) {
            throw new Error("Prompt not found or access denied");
        }

        const currentFeedback = prompt.feedback || { workedInClassroom: false, rating: "positive" }; // Default rating if initializing

        await ctx.db.patch(args.promptId, {
            feedback: {
                ...currentFeedback,
                workedInClassroom: args.worked
            }
        });
    }
});

