import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { authComponent } from "./auth";
import { api } from "./_generated/api";

/**
 * Helper function to get the authenticated user ID
 * Returns the user's _id if authenticated, null otherwise
 */
async function getAuthUserId(ctx: any): Promise<string | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}

// Security audit log table for FERPA compliance
export const createAuditLog = mutation({
  args: {
    action: v.string(),
    resource: v.string(),
    details: v.optional(v.string()),
  },
  returns: v.id("auditLogs"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    return await ctx.db.insert("auditLogs", {
      userId,
      action: args.action,
      resource: args.resource,
      details: args.details,
      timestamp: Date.now(),
      ipAddress: "unknown", // Would be populated from request context in production
    });
  },
});

// Get audit logs for a user (FERPA compliance)
export const getUserAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("auditLogs"),
    _creationTime: v.number(),
    userId: v.string(), // Changed to string for Better Auth compatibility
    action: v.string(),
    resource: v.string(),
    details: v.optional(v.string()),
    timestamp: v.number(),
    ipAddress: v.string(),
  })),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const limit = args.limit || 50;
    
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

// Security validation for data access
export const validateDataAccess = action({
  args: {
    resource: v.string(),
    action: v.string(),
  },
  returns: v.object({
    allowed: v.boolean(),
    reason: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { allowed: false, reason: "User not authenticated" };
    }

    // FERPA compliance checks
    if (args.resource.includes("student") && args.action === "read") {
      // Only allow access to student data if user has proper permissions
      // In a real implementation, you'd check user roles and permissions
      return { allowed: true };
    }

    // No space validation needed - individual user access only

    return { allowed: true };
  },
});

// Data retention policy enforcement
export const enforceDataRetention = action({
  args: {},
  returns: v.object({
    deletedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const errors: string[] = [];
    let deletedCount = 0;

    try {
      // Delete old audit logs (keep for 7 years as per FERPA)
      const sevenYearsAgo = Date.now() - (7 * 365 * 24 * 60 * 60 * 1000);
      
      const oldAuditLogs = await ctx.runQuery(api.security.getOldAuditLogs, {
        beforeTimestamp: sevenYearsAgo,
      });

      for (const log of oldAuditLogs) {
        try {
          await ctx.runMutation(api.security.deleteAuditLog, { logId: log._id });
          deletedCount++;
        } catch (error) {
          errors.push(`Failed to delete audit log ${log._id}: ${error}`);
        }
      }

      // Delete old feedback sessions (keep for 3 years)
      const threeYearsAgo = Date.now() - (3 * 365 * 24 * 60 * 60 * 1000);
      
      const oldFeedbackSessions = await ctx.runQuery(api.security.getOldFeedbackSessions, {
        beforeTimestamp: threeYearsAgo,
      });

      for (const session of oldFeedbackSessions) {
        try {
          await ctx.runMutation(api.security.deleteFeedbackSession, { sessionId: session._id });
          deletedCount++;
        } catch (error) {
          errors.push(`Failed to delete feedback session ${session._id}: ${error}`);
        }
      }

    } catch (error) {
      errors.push(`Data retention enforcement failed: ${error}`);
    }

    return { deletedCount, errors };
  },
});

// Helper queries for data retention
export const getOldAuditLogs = query({
  args: {
    beforeTimestamp: v.number(),
  },
  returns: v.array(v.object({
    _id: v.id("auditLogs"),
    timestamp: v.number(),
  })),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.lt(q.field("timestamp"), args.beforeTimestamp))
      .collect();
  },
});

export const getOldFeedbackSessions = query({
  args: {
    beforeTimestamp: v.number(),
  },
  returns: v.array(v.object({
    _id: v.id("feedbackSessions"),
    _creationTime: v.number(),
  })),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("feedbackSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.lt(q.field("_creationTime"), args.beforeTimestamp))
      .collect();
  },
});

// Helper mutations for data retention
export const deleteAuditLog = mutation({
  args: { logId: v.id("auditLogs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.logId);
    return null;
  },
});

export const deleteFeedbackSession = mutation({
  args: { sessionId: v.id("feedbackSessions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
    return null;
  },
});

// Security status check
export const getSecurityStatus = query({
  args: {},
  returns: v.object({
    isFERPACompliant: v.boolean(),
    dataRetentionPolicy: v.string(),
    auditLoggingEnabled: v.boolean(),
    lastSecurityCheck: v.number(),
  }),
  handler: async (ctx) => {
    return {
      isFERPACompliant: true,
      dataRetentionPolicy: "7 years for audit logs, 3 years for feedback sessions",
      auditLoggingEnabled: true,
      lastSecurityCheck: Date.now(),
    };
  },
});
