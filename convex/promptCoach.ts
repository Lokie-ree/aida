import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery, type ActionCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { rag } from "./rag";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

/**
 * Generates a meaningful conversation title from the user's first message.
 * Extraction priority:
 * 1. Louisiana standard codes (e.g., "RL.5.3" → "RL.5.3 Character Traits")
 * 2. Grade + subject keywords (e.g., "5th grade fractions" → "5th Grade Fractions")
 * 3. Fallback: First 40 characters of message, cleaned up
 */
function generateConversationTitle(message: string): string {
  // Try to find Louisiana standard codes (e.g., RL.5.3, W.8.2, 5.NF.A.1)
  const standardCodeMatch = message.match(/\b([A-Z]{1,4}\.\d+\.\d+(?:\.[A-Z]\.\d+)?|\d+\.[A-Z]{1,4}\.[A-Z]\.\d+)\b/i);
  if (standardCodeMatch) {
    const code = standardCodeMatch[1].toUpperCase();
    // Extract some context around the code
    const words = message.split(/\s+/).slice(0, 8);
    const context = words.filter(w => !w.match(/^[A-Z]{1,4}\.\d+/i)).slice(0, 3).join(" ");
    if (context.length > 3) {
      return `${code} ${context.charAt(0).toUpperCase() + context.slice(1)}`.slice(0, 50);
    }
    return code;
  }

  // Try to find grade + subject pattern (e.g., "5th grade math", "8th grade ELA")
  const gradeSubjectMatch = message.match(/(\d+(?:st|nd|rd|th)?)\s*grade\s+(\w+)/i);
  if (gradeSubjectMatch) {
    const grade = gradeSubjectMatch[1];
    const subject = gradeSubjectMatch[2];
    // Find any additional context
    const restOfMessage = message.slice(gradeSubjectMatch.index! + gradeSubjectMatch[0].length).trim();
    const contextWords = restOfMessage.split(/\s+/).slice(0, 3).filter(w => w.length > 2).join(" ");
    if (contextWords.length > 3) {
      return `${grade} Grade ${subject.charAt(0).toUpperCase() + subject.slice(1)} - ${contextWords}`.slice(0, 50);
    }
    return `${grade} Grade ${subject.charAt(0).toUpperCase() + subject.slice(1)}`;
  }

  // Fallback: Clean up first 40 characters
  const cleaned = message
    .replace(/^(hi|hello|hey|i'm|i am|can you|could you|help me|please)/i, "")
    .trim()
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= 40) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Truncate at word boundary
  const truncated = cleaned.slice(0, 40);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 20) {
    return truncated.slice(0, lastSpace).trim() + "…";
  }
  return truncated + "…";
}

const PELICAN_SYSTEM_PROMPT = `You are Pelican AI, a prompt generator built by a Louisiana teacher for Louisiana teachers. You create high-quality, Louisiana-aligned prompts that teachers copy-paste into ANY AI tool (ChatGPT, Claude, Gemini, etc.).

WHAT YOU DO:
- Generate prompts for lesson planning, assessments, parent communication, IEP accommodations, rubric creation, data analysis, and more
- Embed relevant Louisiana Student Standards and LER indicators into prompts
- Match standards to the correct grade level and subject

WHAT YOU DON'T DO:
- Generate lesson plans, worksheets, or materials directly—only the prompts to create them
- Ask multiple clarifying questions before delivering value
- Write lengthy explanations or multiple alternatives

CORE BEHAVIOR:
Generate a usable prompt IMMEDIATELY when a teacher messages you. Use smart defaults for any missing context (grade level, subject focus, specific standards). The teacher will tell you if something needs adjustment.

RESPONSE FORMAT:
1. A copy-pasteable prompt in a markdown code block
2. One sentence: "Let me know if you'd like me to adjust anything."

That's it. No preamble, no explanation, no alternatives.

EXAMPLE RESPONSE:
\`\`\`
Act as a 5th grade ELA teacher in Louisiana. Create a close reading lesson for RL.5.3 (comparing and contrasting characters, settings, or events) using a grade-appropriate literary text. Include:
- Text-dependent questions that build from literal to inferential
- Opportunities for students to cite textual evidence
- A culminating written response aligned to W.5.9
Focus on student actions: students independently annotate, discuss with partners using accountable talk stems, and produce written analysis with text evidence.
\`\`\`

Let me know if you'd like me to adjust anything.

WHEN TEACHER ASKS FOR REFINEMENT:
Regenerate the prompt with their feedback incorporated. Same format: prompt block + one-line follow-up.

SMART DEFAULTS:
When information is missing, make reasonable assumptions and generate anyway:
- No grade specified → infer from context clues, or use a common grade range (e.g., 4th-5th for elementary math)
- No specific standard → select the most relevant Louisiana Student Standard for the topic/grade
- No LER focus → embed student-action language naturally without forcing a specific indicator
- Vague request → interpret generously and deliver something useful

USING LOUISIANA CONTEXT:
You receive retrieved Louisiana Student Standards and LER indicators relevant to the teacher's request. Use them to:
- Reference specific standard codes (e.g., RL.5.3, 4.NF.A.1) in the generated prompt
- Include exact rubric language for student/teacher actions (e.g., "students independently apply strategies," "teacher provides specific academic feedback")
- Match standards to the grade level mentioned or inferred—never assign high school standards to middle school

If retrieved context doesn't match the teacher's request, ignore it and use your knowledge of Louisiana frameworks instead.

VOICE:
- Teacher-to-teacher, not corporate EdTech
- Concise and direct—respect their time
- Use LER short codes naturally when relevant (SO, MS, LS, QU, etc.) but don't force them
- Warm but efficient—no filler phrases like "Great question!" or "I'd be happy to help!"

CRITICAL RULES:
1. NEVER generate lesson plans, worksheets, or materials—only prompts
2. NEVER ask clarifying questions before the first prompt—generate immediately
3. NEVER provide multiple alternatives—one strong prompt only
4. ALWAYS match standards to grade level (no high school standards for middle school)
5. ALWAYS use exact rubric language from retrieved context, not paraphrases
6. Keep total response under 400 tokens—the prompt itself plus one follow-up line

WHEN IN DOUBT:
Generate something useful. A prompt the teacher needs to tweak is better than no prompt while you ask questions.
`;


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
      languageModel: openai("gpt-5.1-2025-11-13"),
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
      .take(50);
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

    // 2.5. Auto-generate title on first user message
    const isFirstMessage = !conversation.messages || conversation.messages.length === 0;
    if (isFirstMessage) {
      const generatedTitle = generateConversationTitle(args.message);
      await ctx.runMutation(internal.promptCoach.updateConversationTitle, {
        conversationId: args.conversationId,
        title: generatedTitle,
      });
    }

    // 3. Initialize Agent
    const agent = new Agent(components.agent, {
      name: "PelicanCoach",
      languageModel: openai("gpt-5.1-2025-11-13"),
      instructions: PELICAN_SYSTEM_PROMPT,
    });

    // Retrieve BOTH Louisiana standards AND LER rubric indicators for authentic context
    const searchTerms = args.message;

    // Search for Louisiana Student Standards
    // Standards data is stored in subject-specific namespaces:
    // - louisiana_standards_ela
    // - louisiana_standards_math
    // - louisiana_standards_science
    // - louisiana_standards_social_studies
    // Search across all subject namespaces and combine results
    const standardNamespaces = [
      "louisiana_standards_ela",
      "louisiana_standards_math",
      "louisiana_standards_science",
      "louisiana_standards_social_studies",
    ];
    
    const allStandardResults = [];
    for (const namespace of standardNamespaces) {
      try {
        const { results } = await rag.search(ctx, {
          namespace,
          query: searchTerms,
          limit: 2, // Get top 2 from each namespace
          filters: [
            { name: "contentType", value: "louisiana_standard" }
          ]
        });
        allStandardResults.push(...results);
      } catch (error) {
        // If a namespace doesn't exist yet (e.g., not ingested), skip it
        console.warn(`Standards namespace ${namespace} not found, skipping`);
      }
    }
    
    // Sort by score (highest first) and take top 5
    const standardResults = allStandardResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Search for Louisiana Educator Rubric indicators
    // Rubric data is stored in multiple namespaces:
    // - louisiana_rubric_system (LEADS system and overview)
    // - louisiana_rubric_instruction, planning, environment, professionalism (domain-specific)
    // Search across all rubric namespaces and combine results
    const rubricNamespaces = [
      "louisiana_rubric_system",
      "louisiana_rubric_instruction",
      "louisiana_rubric_planning",
      "louisiana_rubric_environment",
      "louisiana_rubric_professionalism",
    ];
    
    const allRubricResults = [];
    for (const namespace of rubricNamespaces) {
      try {
        const { results } = await rag.search(ctx, {
          namespace,
          query: searchTerms,
          limit: 2, // Get top 2 from each namespace
          filters: [
            { name: "contentType", value: "rubric_indicator" }
          ]
        });
        allRubricResults.push(...results);
      } catch (error) {
        // If a namespace doesn't exist yet (e.g., not ingested), skip it
        console.warn(`Rubric namespace ${namespace} not found, skipping`);
      }
    }
    
    // Sort by score (highest first) and take top 4
    const rubricResults = allRubricResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

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
       promptWithContext += `\n\n---\nLOUISIANA CONTEXT:${louisianaContext}\n\nUse EXACT language from the rubric indicators above (e.g., "students independently apply strategies"). Reference standard codes and LER short codes naturally in the generated prompt.`;
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
      model: openai("gpt-5.1-2025-11-13"),
      prompt: promptWithContext,
      maxOutputTokens: 900, // keep responses concise and under the agreed cap
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

// Internal mutation to update conversation title
export const updateConversationTitle = internalMutation({
    args: {
        conversationId: v.id("promptConversations"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.conversationId, {
            title: args.title,
        });
    }
});

// Mutation to rename a conversation
export const renameConversation = mutation({
    args: {
        conversationId: v.id("promptConversations"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation || conversation.userId !== user._id) {
            throw new Error("Conversation not found or access denied");
        }

        await ctx.db.patch(args.conversationId, {
            title: args.title,
            lastUpdated: Date.now(),
        });
    }
});

// Mutation to delete a conversation
export const deleteConversation = mutation({
    args: {
        conversationId: v.id("promptConversations"),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation || conversation.userId !== user._id) {
            throw new Error("Conversation not found or access denied");
        }

        // Delete any saved prompts associated with this conversation
        const prompts = await ctx.db
            .query("generatedPrompts")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .collect();

        for (const prompt of prompts) {
            await ctx.db.delete(prompt._id);
        }

        // Delete the conversation
        await ctx.db.delete(args.conversationId);
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
    rating: v.optional(v.union(v.literal("positive"), v.literal("negative"))),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check for duplicate: same conversation + same prompt text
    const existingPrompts = await ctx.db
      .query("generatedPrompts")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const isDuplicate = existingPrompts.some(
      (p) => p.promptText === args.promptText
    );

    if (isDuplicate) {
      // Return the existing prompt ID instead of creating a duplicate
      const existing = existingPrompts.find((p) => p.promptText === args.promptText);
      return existing!._id;
    }

    return await ctx.db.insert("generatedPrompts", {
      userId: user._id,
      conversationId: args.conversationId,
      promptText: args.promptText,
      context: args.context,
      feedback: args.rating ? {
        rating: args.rating,
        workedInClassroom: false,
      } : undefined,
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

// Mutation to set prompt rating
export const setPromptRating = mutation({
    args: { promptId: v.id("generatedPrompts"), rating: v.union(v.literal("positive"), v.literal("negative")) },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        const prompt = await ctx.db.get(args.promptId);
        if (!prompt || prompt.userId !== user._id) {
            throw new Error("Prompt not found or access denied");
        }

        const currentFeedback = prompt.feedback || { workedInClassroom: false, rating: "positive" };

        await ctx.db.patch(args.promptId, {
            feedback: {
                ...currentFeedback,
                rating: args.rating
            }
        });
    }
});

