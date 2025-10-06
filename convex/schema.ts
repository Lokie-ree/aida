import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

  // Placeholder tables to prevent errors - will be properly implemented with Better Auth
  spaces: defineTable({
    name: v.string(),
    ownerId: v.string(), // Changed to string for Better Auth compatibility
    description: v.optional(v.string()),
  }).index("by_owner", ["ownerId"]),

  spaceMembers: defineTable({
    spaceId: v.id("spaces"),
    userId: v.string(), // Changed to string for Better Auth compatibility
    invitationStatus: v.union(v.literal("pending"), v.literal("accepted")),
    invitedBy: v.string(), // Changed to string for Better Auth compatibility
    invitedEmail: v.string(),
  }).index("by_space", ["spaceId"])
    .index("by_user", ["userId"])
    .index("by_email", ["invitedEmail"]),

  documents: defineTable({
    userId: v.string(), // Changed to string for Better Auth compatibility
    fileName: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    contentType: v.string(),
    textContent: v.string(),
    spaceId: v.optional(v.id("spaces")),
  }).index("by_user", ["userId"])
    .index("by_space", ["spaceId"]),

  chatMessages: defineTable({
    userId: v.string(), // Changed to string for Better Auth compatibility
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    contextDocuments: v.optional(v.array(v.string())),
    spaceId: v.optional(v.id("spaces")),
  }).index("by_user", ["userId"])
    .index("by_space", ["spaceId"]),

  feedbackSessions: defineTable({
    userId: v.string(), // Changed to string for Better Auth compatibility
    lessonPlan: v.string(),
    feedback: v.string(),
    title: v.optional(v.string()),
    spaceId: v.optional(v.id("spaces")),
  }).index("by_user", ["userId"])
    .index("by_space", ["spaceId"]),

  auditLogs: defineTable({
    userId: v.string(), // Changed to string for Better Auth compatibility
    action: v.string(),
    resource: v.string(),
    details: v.optional(v.string()),
    spaceId: v.optional(v.id("spaces")),
    timestamp: v.number(),
    ipAddress: v.string(),
  }).index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_timestamp", ["timestamp"]),
};

export default defineSchema({
  ...applicationTables,
});
