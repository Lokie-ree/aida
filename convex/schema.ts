import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * EdCoachAI Database Schema
 * 
 * Note: Better Auth tables (user, session, account, verification) are automatically
 * managed by the @convex-dev/better-auth component and don't need to be defined here.
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
    userId: v.string(), // References Better Auth user ID
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  }).index("by_user", ["userId"]),

  // Core application tables

  documents: defineTable({
    userId: v.string(), // Better Auth user ID
    fileName: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    contentType: v.string(),
    textContent: v.string(),
  }).index("by_user", ["userId"]),

  chatMessages: defineTable({
    userId: v.string(), // Better Auth user ID
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    contextDocuments: v.optional(v.array(v.string())),
  }).index("by_user", ["userId"]),

  feedbackSessions: defineTable({
    userId: v.string(), // Better Auth user ID
    lessonPlan: v.string(),
    feedback: v.string(),
    title: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  auditLogs: defineTable({
    userId: v.string(), // Better Auth user ID
    action: v.string(),
    resource: v.string(),
    details: v.optional(v.string()),
    timestamp: v.number(),
    ipAddress: v.string(),
  }).index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),
};

export default defineSchema({
  ...applicationTables,
});
