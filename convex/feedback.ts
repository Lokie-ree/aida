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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const prompt = `You are an expert instructional coach with years of experience in curriculum design and pedagogy. Review the following lesson plan and provide constructive feedback to enhance engagement and rigor. Focus on:

1. Learning objectives clarity and alignment
2. Student engagement strategies
3. Assessment methods
4. Differentiation opportunities
5. Real-world connections
6. Areas for improvement

Lesson Plan:
${args.lessonPlan}

Please provide specific, actionable feedback that will help improve this lesson:`;

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
    });
  },
});

export const getFeedbackHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("feedbackSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});
