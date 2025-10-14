import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Pelican AI Database Schema
 * 
 * Note: Better Auth tables (user, session, account, verification) are automatically
 * managed by the @convex-dev/better-auth component and don't need to be defined here.
 * 
 * Note: The RAG tables (documents, chatMessages, feedbackSessions, auditLogs) are
 * automatically managed by the @convex-dev/rag component and don't need to be defined here.
 */

const applicationTables = {
  // Beta program signups - main table for the landing page
  betaSignups: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    signupDate: v.number(),
    betaProgramId: v.string(),
    notes: v.optional(v.string()),
  }).index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_signup_date", ["signupDate"]),

  // User profile extensions (Better Auth manages core user data)
  userProfiles: defineTable({
    userId: v.string(), // References Better Auth user ID (legacy)
    authId: v.optional(v.string()), // Better Auth user ID (new pattern)
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  }).index("by_user", ["userId"]).index("authId", ["authId"]),

  // ============================================
  // PHASE 2 TABLES (defined but not actively used in MVP)
  // ============================================
  // These tables exist for future functionality but are not part of Phase 1 MVP scope.
  // See phase 2 files: frameworks.ts, innovations.ts, testimonials.ts, timeTracking.ts, admin.ts, betaProgram.ts

  // Frameworks (Atomic Notes)
  frameworks: defineTable({
    // Metadata
    frameworkId: v.string(),
    title: v.string(),
    module: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
    category: v.string(),
    tags: v.array(v.string()),
    
    // Content
    challenge: v.string(),
    solution: v.string(),
    samplePrompt: v.string(),
    ethicalGuardrail: v.string(),
    tipsAndVariations: v.optional(v.string()),
    
    // Metadata
    timeEstimate: v.number(),
    difficultyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    platformCompatibility: v.array(v.string()),
    
    // Louisiana Standards Alignment
    louisianaStandards: v.optional(v.array(v.string())),
    lerDomains: v.optional(v.array(v.string())),
    
    // Status
    status: v.union(v.literal("draft"), v.literal("beta"), v.literal("published")),
    createdBy: v.string(),
    publishedAt: v.optional(v.number()),
    
    // Analytics
    usageCount: v.number(),
    averageRating: v.optional(v.number()),
    averageTimeSaved: v.optional(v.number()),
  }).index("by_module", ["module"])
    .index("by_category", ["category"])
    .index("by_framework_id", ["frameworkId"])
    .index("by_status", ["status"])
    .searchIndex("search_content", {
      searchField: "title",
      filterFields: ["module", "category", "status"],
    }),

  // Framework Usage Tracking
  frameworkUsage: defineTable({
    frameworkId: v.id("frameworks"),
    userId: v.string(),
    action: v.union(
      v.literal("viewed"),
      v.literal("copied_prompt"),
      v.literal("marked_tried"),
      v.literal("saved")
    ),
    rating: v.optional(v.number()),
    timeSaved: v.optional(v.number()),
    comment: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_framework", ["frameworkId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // Testimonials
  testimonials: defineTable({
    userId: v.string(),
    frameworkId: v.optional(v.id("frameworks")),
    quote: v.string(),
    timeSaved: v.optional(v.number()),
    impact: v.string(),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("featured")),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    featured: v.boolean(),
    displayOrder: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"]),

  // Beta Program Tracking
  betaProgram: defineTable({
    userId: v.string(),
    status: v.union(v.literal("invited"), v.literal("active"), v.literal("completed")),
    invitedAt: v.number(),
    joinedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    onboardingStep: v.number(),
    onboardingCompleted: v.boolean(),
    frameworksTried: v.number(),
    totalTimeSaved: v.number(),
    innovationsShared: v.number(),
    officeHoursAttended: v.number(),
    lastWeeklyPromptOpened: v.optional(v.number()),
    weeklyEngagementCount: v.number(),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Community Innovations
  innovations: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    relatedFramework: v.optional(v.id("frameworks")),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    likes: v.number(),
    triesCount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_innovations", {
      searchField: "title",
      filterFields: ["tags", "school", "subject"],
    }),

  // Innovation Interactions (likes, tries, comments)
  innovationInteractions: defineTable({
    innovationId: v.id("innovations"),
    userId: v.string(),
    type: v.union(v.literal("like"), v.literal("tried"), v.literal("comment")),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_innovation", ["innovationId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // Time Tracking
  timeTracking: defineTable({
    userId: v.string(),
    frameworkId: v.id("frameworks"),
    timeSaved: v.number(), // in minutes
    activity: v.string(), // description of what was done
    category: v.optional(v.string()), // optional categorization
    timestamp: v.number(),
  }).index("by_user", ["userId"])
    .index("by_framework", ["frameworkId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_category", ["category"]),

  // Note: RAG tables (documents, chatMessages, feedbackSessions, auditLogs) are
  // automatically managed by the @convex-dev/rag component
};

export default defineSchema({
  ...applicationTables,
});
