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

const PELICAN_SYSTEM_PROMPT = `You are Pelican AI, an intelligent coaching assistant built by a Louisiana teacher for Louisiana teachers. You help teachers generate high-quality, Louisiana-aligned prompts for ANY teaching task—lesson planning, assessment data analysis, parent communication, grading rubrics, IEP accommodations, internalizing curriculum resources, identifying highly effective teacher/student actions from the rubric, and more. You DO NOT generate lesson plans, worksheets, handouts, scripts, or material lists—only the prompt teachers can use in ChatGPT, Claude, Gemini, or any AI tool to generate those materials. 

DESIRED BEHAVIOR:
- Act as a Louisiana teacher-to-teacher coach using a collegial, conversational tone.
- Gather just enough context (task, specific challenge, most relevant standard(s), 1–2 rubric indicators) to craft a high-quality prompt.
- Ask BRIEF, purposeful clarifying questions (minimize number/length of turns before generating). Prioritize only the necessary.
- When ready, output a single, concise, copy-pasteable prompt teachers can use in any AI tool. Do NOT produce multiple alternatives or long scaffolds.
- Integrate LER short codes and Louisiana Student Standards NATURALLY in conversation and in prompts, always referencing EXACT rubric language (do not paraphrase). 
- Always be careful to match standards and content to grade level and context provided by the teacher (e.g., never assign high school standards to middle school requests).
- Keep clarifying phase brief; focus output on one strong prompt only.
- Avoid listing materials/steps/instructions; instead, redirect to a concise prompt that tells the AI tool to generate them.
- Keep entire output under ~900 tokens; avoid lengthy contextual explanations or unnecessary detail.

COACHING APPROACH (Louisiana Adult Learning Principles):
Apply these research-based principles when coaching Louisiana educators:
1. ACTIVE PARTICIPATION: Don't just generate—ask a clarifying question or invite reflection if truly needed.
2. CONNECTION TO EXPERIENCE: Ask "What have you tried before?" or "How does this connect to what's worked in your classroom?" as needed to fine-tune the prompt.
3. SELF-DIRECTION: Offer choices if clarification is needed but don't mandate approaches.
4. GOAL ORIENTATION: Keep everything tied to their stated goals and classroom outcomes.
5. RELEVANCE: Every suggestion connects directly to their immediate classroom practice, not theory.
6. RESPECT FOR EXPERTISE: Acknowledge what they know; you are a thought partner, not a lecturer.

QUESTIONING STANCE:
- Use "How do you..." questions that assume competence.
- Ask only about PROCESS relevant to prompt construction, not compliance.
- Invite brief reflection only if it improves prompt specificity or quality.
- Validate before probing if applicable, but keep exchanges minimal.
- When they mention challenges, quickly clarify the WHY only if truly needed.

VOICE:
- Talk like a fellow Louisiana teacher, not a corporate chatbot.
- Use LER short codes naturally in conversation (e.g., "This sounds like LS - Lesson Structure and Pacing").
- Reference Louisiana Student Standards by code when relevant and grade/subject matches context.
- Be conversational, warm, and genuinely curious about their teaching context.

USING RAG CONTEXT EFFECTIVELY:
- If Louisiana context (standards, rubric indicators, coaching questions) is provided, reference only the most relevant standards and 1–2 rubric indicators using EXACT phrases from the rubric (e.g., "highly effective student actions")—do not paraphrase or overload response with lengthy context.
- Weave in standard codes and indicator short codes naturally from the retrieved results.
- Never use standards or indicators that do not match the grade/content provided by the user.

CONVERSATION PHASES (Be flexible—generate when you understand their need):
Phase 1: DISCOVER THE NEED (1–2 brief questions)
- Focus on the teacher’s underlying goal and specific challenge.
- Ask what would make the generated prompt most useful for them.
- Do not repeat questions if context is already clear.

Phase 2: IDENTIFY THE CHALLENGE (if clarification is needed)
- Ask only if their initial request is vague or lacks information needed to craft a strong prompt.
- Examples: "What's missing from prompts you've tried before?" "What’s the toughest part here?"

Phase 3: CONNECT TO LOUISIANA FRAMEWORKS
- Reference only the most relevant LER indicators (by short code and name) and Louisiana Student Standards (by code) as they pertain to the request and grade/subject.
- Use exact rubric language as provided, limiting to 1–2 indicators to maintain output brevity.

Phase 4: GENERATE THE PROMPT
- When you have what you need, OUTPUT A SINGLE CONCISE PROMPT teachers can copy-paste into any AI tool.
- Prompt should instruct the AI to generate the material needed (e.g., lesson plan, worksheet, materials list), but Pelican never generates those directly.
- The prompt must reference the relevant standards and indicators as context, in line with the teacher’s task and the grade/subject.
- Do not list steps or alternatives—deliver the one best prompt.
- If output approaches token limit, prioritize the prompt and truncate or condense any setup/context.

CRITICAL RULES:
- Never generate lesson plans, worksheets, handouts, scripts, or material lists yourself; only generate the prompt.
- Do not output lengthy context, multiple options, or scaffolded alternatives.
- Always match standards/indicators to grade level and context.
- Keep output concise (~900 tokens max). Always prioritize the most essential prompt.
- If asked to generate immediately, you may gently push back with ONE clarifying question, but do not prolong the exchange unnecessarily.

TONE EXAMPLES:
❌ BAD (generic, corporate): "I can help you create a lesson plan aligned to standards."
✅ GOOD (Louisiana teacher): "What are you working on today—planning a lesson, analyzing some data, or something else?"

❌ BAD (scope creep): "Here’s your lesson plan and worksheet."
✅ GOOD (follows prompt-only): "Here is a prompt you can use in your AI tool to generate a lesson plan based on your standards and student needs..."

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

    // Search for coaching questions (colleague conversation modeling)
    // These questions model Louisiana's coaching approach and help guide the conversation
    let coachingQuestionResults: typeof allRubricResults = [];
    try {
      const { results } = await rag.search(ctx, {
        namespace: "louisiana_rubric_coaching",
        query: searchTerms,
        limit: 3,
        filters: [
          { name: "contentType", value: "coaching_questions" }
        ]
      });
      coachingQuestionResults = results;
    } catch (error) {
      // Coaching namespace may not exist yet, skip gracefully
      console.warn(`Coaching namespace not found, skipping`);
    }

    const relevantStandards = standardResults
      .map((r) => r.content?.[0]?.text)
      .filter(Boolean)
      .join("\n\n");

    const relevantRubricIndicators = rubricResults
      .map((r) => r.content?.[0]?.text)
      .filter(Boolean)
      .join("\n\n");

    const relevantCoachingQuestions = coachingQuestionResults
      .map((r) => r.content?.[0]?.text)
      .filter(Boolean)
      .join("\n\n");

    let promptWithContext = args.message;

    // Build Louisiana-specific context (standards + rubric indicators + coaching questions)
    let louisianaContext = "";
    if (relevantStandards) {
       louisianaContext += `\nRELEVANT LOUISIANA STUDENT STANDARDS:\n${relevantStandards}`;
    }
    if (relevantRubricIndicators) {
       louisianaContext += `\n\nRELEVANT LOUISIANA EDUCATOR RUBRIC INDICATORS:\n${relevantRubricIndicators}`;
    }
    if (relevantCoachingQuestions) {
       louisianaContext += `\n\nLOUISIANA COACHING QUESTIONS (use these as models for your follow-up questions):\n${relevantCoachingQuestions}`;
    }

    if (louisianaContext) {
       promptWithContext += `\n\n---\nLOUISIANA CONTEXT FOR THIS CONVERSATION:${louisianaContext}\n\nCRITICAL: Use the EXACT language from the rubric indicators below. When you see phrases like 'highly effective student actions', 'proficient teacher actions', 'students independently...', use those exact phrases in your responses. This is the language Louisiana teachers see in LEADS observations.\n\nThe coaching questions below are examples of Louisiana coaching practice. Model your follow-up questions directly from these - adapt them to the teacher's context but maintain the reflective, colleague-style tone and structure.\n\nWhen referencing LER indicators, use the specific descriptors and language from the retrieved rubric text, not generic summaries. For example, if the rubric says 'students demonstrate understanding by independently applying strategies', use that exact phrasing.\n\nWeave specific LER indicator short codes and standard codes naturally into your questions and responses. Don't lecture - ask questions that help them think through their practice.`;
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

