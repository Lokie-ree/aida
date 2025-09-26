import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateFeedback = action({
  args: {
    lessonPlan: v.string(),
    title: v.optional(v.string()),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Enhanced prompt for better feedback quality
    const prompt = `You are A.I.D.A. (AI Instructional Design Assistant), an expert instructional coach with years of experience in curriculum design and pedagogy. Review the following lesson plan and provide constructive, actionable feedback to enhance engagement and rigor.

Focus on these key areas:
1. Learning objectives clarity and alignment with standards
2. Student engagement strategies and active learning opportunities
3. Assessment methods and formative evaluation
4. Differentiation opportunities for diverse learners
5. Real-world connections and relevance
6. Specific areas for improvement with concrete suggestions
7. Pedagogical soundness and best practices

${args.spaceId ? "Note: This feedback is being generated in a shared team space where multiple educators collaborate." : ""}

Lesson Plan:
${args.lessonPlan}

Please provide specific, actionable feedback that will help improve this lesson. Structure your response with clear headings and bullet points for easy reading:`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const feedback = response.choices[0].message.content || "No feedback generated.";

      // Save the feedback session to the database
      await ctx.runMutation(api.feedback.saveFeedbackSession, {
        lessonPlan: args.lessonPlan,
        feedback,
        title: args.title,
        spaceId: args.spaceId,
      });

      // Log the feedback generation for audit purposes
      await ctx.runMutation(api.security.createAuditLog, {
        action: "generate_feedback",
        resource: "lesson_plan",
        details: `Generated feedback for lesson: ${args.title || "Untitled"}`,
        spaceId: args.spaceId,
      });

      return feedback;
    } catch (error) {
      console.error("Error generating feedback:", error);
      throw new Error("Failed to generate feedback. Please try again.");
    }
  },
});

export const saveFeedbackSession = mutation({
  args: {
    lessonPlan: v.string(),
    feedback: v.string(),
    title: v.optional(v.string()),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    return await ctx.db.insert("feedbackSessions", {
      userId,
      lessonPlan: args.lessonPlan,
      feedback: args.feedback,
      title: args.title,
      spaceId: args.spaceId,
    });
  },
});

export const getFeedbackHistory = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    if (args.spaceId) {
      return await ctx.db
        .query("feedbackSessions")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
        .order("desc")
        .take(10);
    } else {
      return await ctx.db
        .query("feedbackSessions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("spaceId"), undefined))
        .order("desc")
        .take(10);
    }
  },
});
