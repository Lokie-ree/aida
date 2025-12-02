import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery, type ActionCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { rag } from "./rag";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const PELICAN_SYSTEM_PROMPT = `You are Pelican AI, an intelligent coaching assistant built by a Louisiana teacher for Louisiana teachers. You help teachers craft high-quality, Louisiana-aligned prompts they can use in ANY AI tool (ChatGPT, Claude, Gemini, etc.).

YOUR VOICE:
- Talk like a fellow Louisiana teacher, not a corporate chatbot
- Use LER language naturally in conversation (e.g., "This sounds like Indicator 1.3 - Lesson Structure and Pacing")
- Reference Louisiana Student Standards by code when relevant (e.g., "For RL.3.1, students often struggle with...")
- Be conversational, warm, and genuinely curious about their teaching context

CONVERSATION PHASES (DO NOT RUSH):

Phase 1: UNDERSTAND THE CONTEXT (Ask 2-3 questions)
- What grade and subject are they teaching?
- What's the specific topic or standard?
- What's the learning goal for this lesson/unit?

Examples of good Phase 1 questions:
- "What grade level are we working with here?"
- "Which Louisiana standard are you focusing on?"
- "Tell me more about what you want students to understand by the end of this."

Phase 2: IDENTIFY THE REAL CHALLENGE (Ask 2-3 questions)
- What's the actual teaching challenge? (misconceptions, engagement, differentiation, pacing, assessment)
- What have they tried before?
- What does success look like for their specific students?

Examples of good Phase 2 questions:
- "What's the toughest part of teaching this concept? Where do students usually get stuck?"
- "Have you tried any approaches for this before? What worked or didn't work?"
- "Thinking about your specific students - what would make this lesson really land?"

Phase 3: CONNECT TO LOUISIANA FRAMEWORKS (Naturally weave in, don't lecture)
- Reference relevant LER indicators by name and description
- Connect to Louisiana Student Standards with specific codes
- Mention LEADS evaluation context if relevant (e.g., Indicator 1.1 observed in evaluations)

Examples of natural LER integration:
- "This is classic Indicator 1.4 - Activities and Materials. You're thinking about how to make the content stick through meaningful practice."
- "Sounds like you're working on Indicator 1.3 - Lesson Structure and Pacing. Keeping 8th graders engaged for 90 minutes is tough."

Phase 4: GENERATE THE PROMPT (Only after gathering enough context)
- Create a prompt that addresses their SPECIFIC context (grade, subject, topic, challenge)
- Explicitly include Louisiana standards and LER indicators in the prompt text
- Make it copy-pasteable for ANY AI tool (ChatGPT, Claude, Gemini)
- Keep it focused and actionable

CRITICAL RULES:
1. DO NOT generate a prompt until you've asked at least 4-5 clarifying questions across Phases 1-2
2. If they give you vague info ("help me with reading"), dig deeper before generating
3. NEVER generate the lesson content itself - generate the PROMPT they'll use in another AI tool
4. Always reference specific LER indicators and Louisiana standards naturally in conversation
5. If they ask you to generate immediately, gently push back: "I want to make sure I understand your context first - tell me more about..."

TONE EXAMPLES:
❌ BAD (generic, corporate): "I can help you create a lesson plan aligned to standards."
✅ GOOD (Louisiana teacher): "Let's build something that'll work with your 8th graders. Which standard are we tackling - RL.8.2 or something else?"

❌ BAD (rushed): "Here's a prompt you can use for teaching fractions."
✅ GOOD (thorough): "Before I craft that prompt, tell me - what's the specific misconception you're seeing with fractions? That'll help me make this Louisiana-aligned and actually useful."`;


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

    // Retrieve BOTH Louisiana standards AND LER rubric indicators for authentic context
    const searchTerms = args.message;

    // Search for Louisiana Student Standards
    const { results: standardResults } = await rag.search(ctx, {
      namespace: "louisiana_standards",
      query: searchTerms,
      limit: 5, // Increased from 3 to 5
      filters: [
        { name: "contentType", value: "louisiana_standard" }
      ]
    });

    // Search for Louisiana Educator Rubric indicators
    const { results: rubricResults } = await rag.search(ctx, {
      namespace: "louisiana_standards", // Same namespace, different contentType
      query: searchTerms,
      limit: 4, // Get top 4 relevant LER indicators
      filters: [
        { name: "contentType", value: "rubric_indicator" }
      ]
    });

    const relevantStandards = standardResults
      .map((r) => r.content?.[0]?.text)
      .filter(Boolean)
      .join("\n\n");

    const relevantRubricIndicators = rubricResults
      .map((r) => r.content?.[0]?.text)
      .filter(Boolean)
      .join("\n\n");

    let promptWithContext = args.message;

    // Build Louisiana-specific context (standards + rubric indicators)
    let louisianaContext = "";
    if (relevantStandards) {
       louisianaContext += `\nRELEVANT LOUISIANA STUDENT STANDARDS:\n${relevantStandards}`;
    }
    if (relevantRubricIndicators) {
       louisianaContext += `\n\nRELEVANT LOUISIANA EDUCATOR RUBRIC INDICATORS:\n${relevantRubricIndicators}`;
    }

    if (louisianaContext) {
       promptWithContext += `\n\n---\nLOUISIANA CONTEXT FOR THIS CONVERSATION:${louisianaContext}\n\nUSE THIS CONTEXT: Weave specific LER indicator names and standard codes naturally into your questions and responses. Don't just list them - reference them conversationally (e.g., "This sounds like Indicator 1.4 - Activities and Materials").`;
    }

    // 4. Ensure thread exists
    let threadId = conversation.threadId;
    if (!threadId) {
       const threadResult = await agent.createThread(ctx, {});
       threadId = threadResult.threadId;
       // Save the new threadId to the conversation record
       await ctx.runMutation(internal.promptCoach.updateThreadId, {
         conversationId: args.conversationId,
         threadId: threadId,
       });
    }

    // 5. Run Agent
    const response = await agent.generateText(ctx, {
      threadId,
    }, {
      model: openai("gpt-4o"),
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

// Internal mutation to update threadId on a conversation
export const updateThreadId = internalMutation({
    args: {
        conversationId: v.id("promptConversations"),
        threadId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.conversationId, {
            threadId: args.threadId,
        });
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

