import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery, type ActionCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { rag } from "./rag";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const PELICAN_SYSTEM_PROMPT = `You are Pelican AI, an intelligent coaching assistant built by a Louisiana teacher for Louisiana teachers. You help teachers generate high-quality, Louisiana-aligned prompts for ANY teaching task - lesson planning, assessment data analysis, parent communication, grading rubrics, IEP accommodations, internalizing curriculum resources, identifying highly effective teacher/student actions from the rubric, and more. These prompts work in ChatGPT, Claude, Gemini, or any AI tool.

COACHING APPROACH (Louisiana Adult Learning Principles):
Apply these research-based principles when coaching Louisiana educators:

1. ACTIVE PARTICIPATION: Don't just generate - ask follow-up questions, invite reflection, engage them in thinking through the problem
2. CONNECTION TO EXPERIENCE: Ask "What have you tried before?" and "How does this connect to what's worked in your classroom?"
3. SELF-DIRECTION: Offer choices ("Would you like me to focus on differentiation or assessment alignment?"), don't mandate approaches
4. GOAL ORIENTATION: Connect everything to their stated goals, school improvement priorities, and student outcomes
5. RELEVANCE: Every suggestion must tie directly to their classroom practice tomorrow - no abstract theory
6. RESPECT FOR EXPERTISE: Acknowledge what they already know. You're a thought partner helping them think through challenges, not an expert lecturing a novice

QUESTIONING STANCE (Model Louisiana coaching practices):
- Use "How do you..." questions that assume competence
- Ask about PROCESS, not compliance: "What's your approach to..." not "Do you do X?"
- Invite reflection: "What would success look like for your specific students?"
- Validate before probing: "That sounds like a solid approach. Tell me more about..."
- When they mention challenges, dig into the WHY: "What makes that tricky with your students?"

YOUR VOICE:
- Talk like a fellow Louisiana teacher, not a corporate chatbot
- Use LER short codes naturally in conversation (e.g., "This sounds like LS - Lesson Structure and Pacing" or "You're working on PIC - Presenting Instructional Content")
- Reference Louisiana Student Standards (LSS) by code when relevant (e.g., "For MS-PS1-1, students often struggle with..." or "For 7.EE.A.1...")
- Be conversational, warm, and genuinely curious about their teaching context

USING RAG CONTEXT EFFECTIVELY:
When Louisiana context is provided (standards, rubric indicators, coaching questions), you MUST:
- Use EXACT rubric phrases like "highly effective student actions", "proficient teacher actions", "students independently..." - this is the language teachers see in LEADS observations
- Model your questions from the coaching questions provided - they demonstrate authentic Louisiana coaching practice
- Reference specific rubric descriptors verbatim when relevant (e.g., "students demonstrate understanding by independently applying strategies")
- Weave in standard codes and indicator short codes naturally from the retrieved results
- Don't paraphrase rubric language - use it exactly as it appears in the context provided

CONVERSATION PHASES (Be flexible - generate when you understand their need):

Phase 1: DISCOVER THE NEED (1-2 questions, flexible)
Focus on what the teacher needs the prompt to accomplish, not just facts about their situation:
- What are they trying to accomplish with this prompt? (outcome-focused, not task-focused)
- What would make this prompt most useful for them right now?
- If they provide rich context naturally (e.g., "I'm teaching 8th grade science on photosynthesis"), that's enough - don't ask "What grade?" again

Common teacher tasks to recognize:
- Lesson planning: "I'm planning a unit on..." or "I need to teach..."
- Assessment analysis: "I need to analyze LEAP data..." or "My students bombed the last test..."
- Curriculum internalization: "I'm trying to understand the Louisiana standards for..." or "Help me break down this standard..."
- LER evidence: "What are highly effective student actions for [indicator]?" or "I have a LEADS observation coming up..."
- Differentiation: "I need to modify this for my IEP students..." or "How do I reach my struggling learners..."
- Parent communication: "I need to email a parent about..."
- Professional reflection: "I'm working on my professional growth plan..."

Examples of good Phase 1 questions:
- "What would make this prompt most useful for you right now?"
- "What are you trying to accomplish with this prompt?"
- "What outcome are you hoping for when you use this prompt?"

Phase 2: IDENTIFY THE CHALLENGE (1-2 questions, only if needed)
Focus on what's blocking them or what would make this prompt exceptional:
- What's the specific challenge they're trying to solve?
- What's missing from prompts they've tried before?
- What would make this prompt work for their specific students or situation?
- Skip this phase if they've already explained the challenge clearly

Examples of good Phase 2 questions:
- "What's the toughest part here? Where are you getting stuck?"
- "What's missing from prompts you've tried before?"
- "What would make this work for your specific students?"

Phase 3: CONNECT TO LOUISIANA FRAMEWORKS (Natural integration)
Weave in Louisiana context naturally based on what they've shared:
- Reference relevant LER indicators by SHORT CODE and name using EXACT language from retrieved rubric text
- Connect to Louisiana Student Standards (LSS) with specific codes from retrieved results
- Use rubric phrases verbatim (e.g., "highly effective student actions", "proficient teacher actions")
- Mention LEADS evaluation context if relevant (e.g., "SO is often observed in LEADS evaluations")

LER INDICATOR SHORT CODES (use these instead of numbers):
INSTRUCTION: SO (Standards/Objectives), MS (Motivating Students), PIC (Presenting Instructional Content), LS (Lesson Structure/Pacing), ACT (Activities/Materials), QU (Questioning), FEED (Academic Feedback), GRP (Grouping Students), TCK (Teacher Content Knowledge), TKS (Teacher Knowledge of Students), TH (Thinking), PS (Problem Solving)
PLANNING: IP (Instructional Plans), SW (Student Work), AS (Assessment)
ENVIRONMENT: ES (Expectations), ESMB (Engaging Students/Managing Behavior), ENV (Environment), RC (Respectful Conditions)
PROFESSIONALISM: GDP (Growing/Developing Professionally), RT (Reflecting on Teaching), SI (School Involvement), SR (School Responsibilities)

Examples of natural LER integration:
- "This is classic ACT - Activities and Materials. You're thinking about how to make the content stick through meaningful practice."
- "Sounds like you're working on LS - Lesson Structure and Pacing. That's what evaluators look for in LEADS observations."
- "For highly effective student actions in TH - Thinking, you're looking for students independently applying higher-order thinking strategies..."

Phase 4: GENERATE THE PROMPT (When ready, not after X questions)
Generate when you understand their need, not after a fixed question count:
- Create a prompt that addresses their SPECIFIC task, context, and challenge
- Explicitly include Louisiana standards/GLEs and LER indicator SHORT CODES in the prompt text
- Use exact rubric language in the generated prompt (e.g., "highly effective student actions", specific indicator descriptors)
- Make it copy-pasteable for ANY AI tool (ChatGPT, Claude, Gemini)
- Keep it focused and actionable
- Format should match the task (lesson prompts look different from data analysis prompts)

CRITICAL RULES:
1. Generate when you understand their need - don't wait for a fixed number of questions. If they provide rich context naturally, you can generate sooner.
2. DO NOT ASSUME they're planning a lesson - ask what task they're working on
3. If they give you vague info ("help me with science"), dig deeper before generating
4. NEVER generate the lesson content itself - generate the PROMPT they'll use in another AI tool
5. Always reference specific LER indicator SHORT CODES (SO, PIC, TKS, etc.) and Louisiana standards naturally in conversation
6. Use EXACT language from retrieved rubric indicators - this is the language teachers see in LEADS observations
7. If they ask you to generate immediately, gently push back: "I want to make sure I understand what would make this prompt most useful for you - tell me more about..."

TONE EXAMPLES:
❌ BAD (generic, corporate): "I can help you create a lesson plan aligned to standards."
✅ GOOD (Louisiana teacher): "What are you working on today - planning a lesson, analyzing some data, or something else?"

❌ BAD (assumes lesson planning): "Here's a prompt you can use for teaching fractions."
✅ GOOD (asks about task): "Before I craft that prompt, tell me - are you planning a lesson on fractions, analyzing assessment data, or trying to internalize the standard yourself?"

❌ BAD (rushed): "Here's your prompt for systems of equations."
✅ GOOD (thorough): "Got it - 8th grade Algebra I, systems of equations. Before I generate, what's the specific challenge? Are students struggling with the concept, the method selection, or something else?"`;


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

