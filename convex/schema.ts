import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Legacy table: Lesson plan feedback feature (not currently active in IXP platform)
  // TODO: Evaluate for removal or repurposing as Space-specific coaching feature
  feedbackSessions: defineTable({
    userId: v.id("users"),
    lessonPlan: v.string(),
    feedback: v.string(),
    title: v.optional(v.string()),
    spaceId: v.optional(v.id("spaces")), // Associate feedback with spaces
  }).index("by_user", ["userId"])
    .index("by_space", ["spaceId"]),
  
  documents: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    contentType: v.string(),
    textContent: v.string(),
    spaceId: v.optional(v.id("spaces")), // null for personal space
  }).index("by_user", ["userId"])
    .index("by_space", ["spaceId"]),
  
  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    contextDocuments: v.optional(v.array(v.string())), // Document names used for context
    spaceId: v.optional(v.id("spaces")), // null for personal space
  }).index("by_user", ["userId"])
    .index("by_space", ["spaceId"]),

  // New tables for shared spaces
  spaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    description: v.optional(v.string()),
  }).index("by_owner", ["ownerId"]),

  spaceMembers: defineTable({
    spaceId: v.id("spaces"),
    userId: v.id("users"),
    invitationStatus: v.union(v.literal("pending"), v.literal("accepted")),
    invitedBy: v.id("users"),
    invitedEmail: v.string(), // Store email for invitation tracking
  }).index("by_space", ["spaceId"])
    .index("by_user", ["userId"])
    .index("by_email", ["invitedEmail"]),

  // Security audit logs for FERPA compliance
  auditLogs: defineTable({
    userId: v.id("users"),
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
  ...authTables,
  ...applicationTables,
});
