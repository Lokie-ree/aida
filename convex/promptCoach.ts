import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery, type ActionCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { rag } from "./rag";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import type { Id } from "./_generated/dataModel";

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

/**
 * System prompt for Pelican AI Coach.
 * 
 * Key principles:
 * - Generate immediately, don't ask questions first
 * - Match standards EXACTLY to the teacher's grade level
 * - Use profile context (grade, subject) when provided
 * - One prompt, one follow-up line, nothing more
 */
const PELICAN_SYSTEM_PROMPT = `You are Pelican AI, a prompt generator built by a Louisiana teacher for Louisiana teachers. You create high-quality, Louisiana-aligned prompts that teachers copy-paste into ANY AI tool (ChatGPT, Claude, Gemini, etc.).

YOUR PURPOSE:
Generate prompts for lesson planning, assessments, parent communication, IEP accommodations, rubric creation, and data analysis. You do NOT generate the actual materials—only the prompts to create them.

RESPONSE FORMAT (STRICT):
1. A copy-pasteable prompt in a markdown code block
2. One sentence: "Let me know if you'd like me to adjust anything."

That's it. No preamble, no explanation, no alternatives, no questions before the first prompt.

EXAMPLE:
\`\`\`
Act as an 8th grade Math teacher in Louisiana. Create a lesson introducing one-step inequalities (8.EE.B.7) that includes:
- A real-world context relevant to Louisiana students
- Guided practice with number line representations  
- Exit ticket with 3 problems checking for understanding
Focus on students explaining their reasoning and justifying solutions.
\`\`\`

Let me know if you'd like me to adjust anything.

CRITICAL: GRADE-LEVEL MATCHING
This is the most important rule. Standards MUST match the teacher's grade level:
- If teacher says "8th grade" → ONLY use 8th grade standards (8.EE, 8.NS, etc.)
- If teacher says "5th grade ELA" → ONLY use 5th grade ELA standards (RL.5, RI.5, W.5, etc.)
- NEVER suggest a 6th grade standard for an 8th grade teacher
- NEVER suggest middle school standards for elementary teachers
- When retrieved standards don't match the grade level, IGNORE them and use your knowledge

TEACHER PROFILE CONTEXT:
You may receive the teacher's profile information (grade level, subject). When provided:
- ALWAYS use this as the primary context for the prompt
- The profile grade level overrides any ambiguity in the message
- Generate prompts appropriate for that specific grade level

USING RETRIEVED CONTEXT:
You receive Louisiana Student Standards and LER rubric indicators. Use them ONLY if they match the teacher's grade level:
- ✅ Teacher: "8th grade inequalities" + Retrieved: "8.EE.B.7" → Use it
- ❌ Teacher: "8th grade inequalities" + Retrieved: "6.EE.B.8" → IGNORE IT, find appropriate 8th grade standard

When incorporating standards:
- Reference specific standard codes in the prompt
- Use exact rubric language (e.g., "students independently apply strategies")
- Match cognitive depth to grade expectations

REFINEMENT REQUESTS:
When a teacher asks to adjust, shorten, add differentiation, etc.:
- Regenerate the full prompt with changes incorporated
- Same format: prompt block + one follow-up line
- Don't explain what you changed—just deliver the improved prompt

VOICE:
- Teacher-to-teacher, not corporate EdTech
- Concise and direct—respect their time
- Warm but efficient—no "Great question!" or "I'd be happy to help!"

WHEN IN DOUBT:
Generate something useful at the correct grade level. A prompt the teacher needs to tweak is better than no prompt while you ask questions.`;


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

/**
 * Core message handling logic - extracted for reuse by sendMessage and refineFromLibrary.
 * 
 * @param ctx - Action context
 * @param userId - Authenticated user ID
 * @param conversationId - Conversation to send message to
 * @param message - The message content
 * @returns The AI response text
 */
async function sendMessageHandler(
  ctx: ActionCtx,
  userId: string,
  conversationId: Id<"promptConversations">,
  message: string
): Promise<string> {
  // 1. Get conversation to find threadId
  const conversation = await ctx.runQuery(internal.promptCoach.getConversationInternal, {
    conversationId
  });

  if (!conversation) throw new Error("Conversation not found");

  // 1.5. Get user profile for context (grade level, subject)
  const userProfile = await ctx.runQuery(internal.userProfiles.getUserProfileByUserId, {
    userId
  });

  // 2. Save user message to our sync table (frontend compatibility)
  await ctx.runMutation(internal.promptCoach.appendMessage, {
    conversationId,
    role: "user",
    content: message,
  });

  // 2.5. Auto-generate title on first user message (skip if title already set, e.g., from refineFromLibrary)
  const isFirstMessage = !conversation.messages || conversation.messages.length === 0;
  const hasDefaultTitle = conversation.title === "New Conversation";
  if (isFirstMessage && hasDefaultTitle) {
    const generatedTitle = generateConversationTitle(message);
    await ctx.runMutation(internal.promptCoach.updateConversationTitle, {
      conversationId,
      title: generatedTitle,
    });
  }

  // 3. Initialize Agent
  const agent = new Agent(components.agent, {
    name: "PelicanCoach",
    languageModel: openai("gpt-5.1-2025-11-13"),
    instructions: PELICAN_SYSTEM_PROMPT,
  });

  // 4. Retrieve Louisiana standards with grade-level filtering
  const standardResults = await searchStandardsWithGradeFilter(
    ctx, 
    message, 
    userProfile?.gradeLevel,
    userProfile?.subject
  );

  // 5. Retrieve Louisiana Educator Rubric indicators
  const rubricResults = await searchRubricIndicators(ctx, message);

  const relevantStandards = standardResults
    .map((r) => r.content?.[0]?.text)
    .filter(Boolean)
    .join("\n\n");

  const relevantRubricIndicators = rubricResults
    .map((r) => r.content?.[0]?.text)
    .filter(Boolean)
    .join("\n\n");

  // 6. Build the prompt with profile and Louisiana context
  let promptWithContext = "";

  // Inject teacher profile context FIRST (critical for grade-level matching)
  if (userProfile?.gradeLevel || userProfile?.subject) {
    promptWithContext += "TEACHER PROFILE:\n";
    if (userProfile.gradeLevel) {
      promptWithContext += `- Grade Level: ${userProfile.gradeLevel}\n`;
    }
    if (userProfile.subject) {
      promptWithContext += `- Subject: ${userProfile.subject}\n`;
    }
    if (userProfile.school) {
      promptWithContext += `- School: ${userProfile.school}\n`;
    }
    promptWithContext += "\n";
  }

  // Add the teacher's message
  promptWithContext += `TEACHER REQUEST:\n${message}`;

  // Add Louisiana context (standards + rubric indicators)
  if (relevantStandards || relevantRubricIndicators) {
    promptWithContext += "\n\n---\nLOUISIANA CONTEXT (use ONLY if matching teacher's grade level):";
    
    if (relevantStandards) {
      promptWithContext += `\n\nRELEVANT LOUISIANA STUDENT STANDARDS:\n${relevantStandards}`;
    }
    if (relevantRubricIndicators) {
      promptWithContext += `\n\nRELEVANT LOUISIANA EDUCATOR RUBRIC INDICATORS:\n${relevantRubricIndicators}`;
    }

    // Reinforce grade-level matching instruction
    const gradeReminder = userProfile?.gradeLevel 
      ? `\n\nIMPORTANT: The teacher is ${userProfile.gradeLevel}. ONLY use standards that match this grade level. If the retrieved standards above don't match, ignore them and use your knowledge of ${userProfile.gradeLevel} standards instead.`
      : "\n\nUse EXACT language from the rubric indicators. Reference standard codes naturally in the generated prompt.";
    
    promptWithContext += gradeReminder;
  }

  // 7. Ensure thread exists
  let threadId = conversation.threadId;
  if (!threadId) {
     const threadResult = await agent.createThread(ctx, {});
     threadId = threadResult.threadId;
     await ctx.runMutation(internal.promptCoach.updateThreadId, {
       conversationId,
       threadId: threadId,
     });
  }

  // 8. Run Agent
  const response = await agent.generateText(ctx, {
    threadId,
  }, {
    model: openai("gpt-5.1-2025-11-13"),
    prompt: promptWithContext,
    maxOutputTokens: 1200, // Increased slightly to avoid cutoff issues
  });

  const responseText = response.text;

  // 9. Save assistant response to our sync table
  await ctx.runMutation(internal.promptCoach.appendMessage, {
    conversationId,
    role: "assistant",
    content: responseText,
  });

  return responseText;
}

// Action to handle sending a message (using Agent component)
export const sendMessage = action({
  args: {
    conversationId: v.id("promptConversations"),
    message: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await sendMessageHandler(ctx, user._id, args.conversationId, args.message);
  },
});

/**
 * Search for Louisiana Student Standards with optional grade-level filtering.
 * Prioritizes standards matching the teacher's grade level.
 */
async function searchStandardsWithGradeFilter(
  ctx: ActionCtx,
  query: string,
  gradeLevel?: string,
  subject?: string
): Promise<Array<{ score: number; content?: Array<{ text?: string }> }>> {
  // Determine which namespaces to search based on subject
  let standardNamespaces = [
    "louisiana_standards_ela",
    "louisiana_standards_math",
    "louisiana_standards_science",
    "louisiana_standards_social_studies",
  ];

  // If subject is known, prioritize that namespace
  if (subject) {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes("ela") || subjectLower.includes("english") || subjectLower.includes("reading")) {
      standardNamespaces = ["louisiana_standards_ela", ...standardNamespaces.filter(n => n !== "louisiana_standards_ela")];
    } else if (subjectLower.includes("math")) {
      standardNamespaces = ["louisiana_standards_math", ...standardNamespaces.filter(n => n !== "louisiana_standards_math")];
    } else if (subjectLower.includes("science")) {
      standardNamespaces = ["louisiana_standards_science", ...standardNamespaces.filter(n => n !== "louisiana_standards_science")];
    } else if (subjectLower.includes("social") || subjectLower.includes("history")) {
      standardNamespaces = ["louisiana_standards_social_studies", ...standardNamespaces.filter(n => n !== "louisiana_standards_social_studies")];
    }
  }

  const allResults: Array<{ score: number; content?: Array<{ text?: string }>; gradeLevel?: string }> = [];

  for (const namespace of standardNamespaces) {
    try {
      // Build filters - always filter by content type
      const filters: Array<{ name: string; value: string }> = [
        { name: "contentType", value: "louisiana_standard" }
      ];

      // Add grade-level filter if available
      // Note: gradeLevel in profile might be "8" or "8th Grade" - normalize it
      if (gradeLevel) {
        const normalizedGrade = normalizeGradeLevel(gradeLevel);
        if (normalizedGrade) {
          filters.push({ name: "gradeLevel", value: normalizedGrade });
        }
      }

      const { results } = await rag.search(ctx, {
        namespace,
        query,
        limit: gradeLevel ? 4 : 2, // Get more results when filtering by grade
        filters,
      });

      allResults.push(...results);
    } catch (error) {
      // If filtering fails or namespace doesn't exist, try without grade filter
      console.warn(`Standards search in ${namespace} failed, trying without grade filter`);
      try {
        const { results } = await rag.search(ctx, {
          namespace,
          query,
          limit: 2,
          filters: [{ name: "contentType", value: "louisiana_standard" }],
        });
        allResults.push(...results);
      } catch {
        // Namespace doesn't exist, skip
      }
    }
  }

  // Sort by score and take top 5
  return allResults
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/**
 * Search for Louisiana Educator Rubric indicators.
 */
async function searchRubricIndicators(
  ctx: ActionCtx,
  query: string
): Promise<Array<{ score: number; content?: Array<{ text?: string }> }>> {
  const rubricNamespaces = [
    "louisiana_rubric_system",
    "louisiana_rubric_instruction",
    "louisiana_rubric_planning",
    "louisiana_rubric_environment",
    "louisiana_rubric_professionalism",
  ];

  const allResults: Array<{ score: number; content?: Array<{ text?: string }> }> = [];

  for (const namespace of rubricNamespaces) {
    try {
      const { results } = await rag.search(ctx, {
        namespace,
        query,
        limit: 2,
        filters: [{ name: "contentType", value: "rubric_indicator" }],
      });
      allResults.push(...results);
    } catch {
      // Namespace doesn't exist, skip
    }
  }

  // Sort by score and take top 4
  return allResults
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

/**
 * Normalize grade level string to match RAG filter values.
 * Profile might have "8th Grade", "8", "Grade 8", etc.
 * Standards are stored with gradeLevel like "8", "K", "Pre-K", etc.
 */
function normalizeGradeLevel(gradeLevel: string): string | null {
  const input = gradeLevel.toLowerCase().trim();

  // Handle "Pre-K", "PreK", etc.
  if (input.includes("pre") && input.includes("k")) {
    return "Pre-K";
  }

  // Handle "Kindergarten", "K"
  if (input === "k" || input.includes("kindergarten")) {
    return "K";
  }

  // Handle "Multiple" or ranges - can't filter
  if (input.includes("multiple") || input.includes("-")) {
    return null;
  }

  // Extract numeric grade (1-12)
  const numMatch = input.match(/\d+/);
  if (numMatch) {
    const num = parseInt(numMatch[0], 10);
    if (num >= 1 && num <= 12) {
      return String(num);
    }
  }

  return null;
}

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

// =============================================================================
// Library Refinement Functions (Phase 2)
// =============================================================================

/**
 * Internal query to get a saved prompt by ID.
 * Used by refineFromLibrary action.
 */
export const getSavedPromptInternal = internalQuery({
    args: { promptId: v.id("generatedPrompts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.promptId);
    }
});

/**
 * Internal mutation to create a conversation without auth check.
 * Used by refineFromLibrary action.
 */
export const createConversationInternal = internalMutation({
    args: { 
        userId: v.string(), 
        title: v.string() 
    },
    handler: async (ctx, args) => {
        // Create thread for Agent
        const agent = new Agent(components.agent, {
            name: "PelicanCoach",
            languageModel: openai("gpt-5.1-2025-11-13"),
        });
        const { threadId } = await agent.createThread(ctx, {});

        return await ctx.db.insert("promptConversations", {
            userId: args.userId,
            title: args.title,
            messages: [],
            threadId,
            status: "active",
            lastUpdated: Date.now(),
        });
    }
});

/**
 * Action to refine a saved prompt from the library.
 * Creates a new conversation with the saved prompt as context,
 * applies the refinement modifier, and returns the new conversation ID.
 */
export const refineFromLibrary = action({
    args: {
        promptId: v.id("generatedPrompts"),
        refinementId: v.string(),
        refinementModifier: v.string(),
    },
    handler: async (ctx, args): Promise<Id<"promptConversations">> => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Not authenticated");

        // 1. Get the saved prompt
        const savedPrompt = await ctx.runQuery(internal.promptCoach.getSavedPromptInternal, {
            promptId: args.promptId,
        });
        if (!savedPrompt || savedPrompt.userId !== user._id) {
            throw new Error("Prompt not found or access denied");
        }

        // 2. Create new conversation with descriptive title
        const title = `Refining: ${savedPrompt.context?.topic || "Saved prompt"}`;
        const newConversationId = await ctx.runMutation(internal.promptCoach.createConversationInternal, {
            userId: user._id,
            title,
        });

        // 3. Build refinement message with original prompt as context
        const refinementMessage = `I have this prompt I'd like to refine:\n\n---\n${savedPrompt.promptText}\n---\n\n${args.refinementModifier}`;

        // 4. Send the refinement request (triggers AI response)
        await sendMessageHandler(ctx, user._id, newConversationId, refinementMessage);

        return newConversationId;
    },
});

