import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Pelican AI Database Schema - DECEMBER 2025 BETA
 *
 * Simplified to core tables only for December 9, 2025 beta launch.
 * Post-beta features archived - see git history for full schemas.
 *
 * Better Auth tables (user, session, account, verification) are automatically
 * managed by @convex-dev/better-auth component.
 *
 * RAG tables (documents, chatMessages, feedbackSessions, auditLogs) are
 * automatically managed by @convex-dev/rag component.
 */

const applicationTables = {
  /**
   * Beta program signups from landing page
   *
   * Flow: User submits form → betaSignup created → Admin approves → User gets magic link
   */
  betaSignups: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    signupDate: v.number(),
    notes: v.optional(v.string()),
  }).index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_signup_date", ["signupDate"]),

  /**
   * User profiles - Louisiana educator context
   *
   * Extends Better Auth users with teaching context for personalized coaching.
   */
  userProfiles: defineTable({
    userId: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("teacher"),
      v.literal("admin"),
      v.literal("coach")
    )),
    onboardingComplete: v.optional(v.boolean()),
    onboardingCompletedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_role", ["role"]),

  /**
   * Prompt Conversations - CORE PRODUCT
   *
   * Chat threads between teacher and Pelican AI conversational coach.
   */
  promptConversations: defineTable({
    userId: v.string(),
    threadId: v.optional(v.string()),
    title: v.optional(v.string()),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
      content: v.string(),
      timestamp: v.number(),
    })),
    status: v.union(v.literal("active"), v.literal("archived")),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"])
    .index("by_last_updated", ["lastUpdated"]),

  /**
   * Generated Prompts - CORE PRODUCT
   *
   * High-quality Louisiana-aligned prompts saved from coaching conversations.
   */
  generatedPrompts: defineTable({
    userId: v.string(),
    conversationId: v.id("promptConversations"),
    promptText: v.string(),
    context: v.object({
      grade: v.optional(v.string()),
      subject: v.optional(v.string()),
      topic: v.optional(v.string()),
      challenge: v.optional(v.string()),
    }),
    feedback: v.optional(v.object({
      rating: v.union(v.literal("positive"), v.literal("negative")),
      workedInClassroom: v.boolean(),
      notes: v.optional(v.string()),
    })),
    isExemplar: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"])
    .index("by_created_at", ["createdAt"]),
};

export default defineSchema({
  ...applicationTables,
});
