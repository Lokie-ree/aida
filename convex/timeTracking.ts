import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Mutation: Record time saved
export const recordTimeSaved = mutation({
  args: {
    frameworkId: v.id("frameworks"),
    timeSaved: v.number(), // in minutes
    activity: v.string(), // description of what was done
    category: v.optional(v.string()), // optional categorization
  },
  returns: v.id("timeTracking"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Record the time tracking entry
    const timeEntryId = await ctx.db.insert("timeTracking", {
      userId,
      frameworkId: args.frameworkId,
      timeSaved: args.timeSaved,
      activity: args.activity,
      category: args.category,
      timestamp: Date.now(),
    });

    // Update user's total time saved in beta program
    const betaStatus = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (betaStatus) {
      await ctx.db.patch(betaStatus._id, {
        totalTimeSaved: betaStatus.totalTimeSaved + args.timeSaved,
      });
    }

    return timeEntryId;
  },
});

// Query: Get user's time tracking history
export const getUserTimeTracking = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("timeTracking"),
    _creationTime: v.number(),
    frameworkId: v.id("frameworks"),
    timeSaved: v.number(),
    activity: v.string(),
    category: v.optional(v.string()),
    timestamp: v.number(),
    frameworkTitle: v.string(),
    frameworkModule: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
  })),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    const userId = user._id;

    const limit = args.limit || 50;

    const timeEntries = await ctx.db
      .query("timeTracking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    // Get framework details for each entry
    const result = [];
    for (const entry of timeEntries) {
      const framework = await ctx.db.get(entry.frameworkId);
      if (framework) {
        result.push({
          _id: entry._id,
          _creationTime: entry._creationTime,
          frameworkId: entry.frameworkId,
          timeSaved: entry.timeSaved,
          activity: entry.activity,
          category: entry.category,
          timestamp: entry.timestamp,
          frameworkTitle: framework.title,
          frameworkModule: framework.module,
        });
      }
    }

    return result;
  },
});

// Query: Get time tracking analytics
export const getTimeTrackingAnalytics = query({
  args: {
    period: v.optional(v.union(v.literal("week"), v.literal("month"), v.literal("all"))),
  },
  returns: v.object({
    totalTimeSaved: v.number(),
    averageTimePerSession: v.number(),
    mostUsedFrameworks: v.array(v.object({
      frameworkId: v.id("frameworks"),
      frameworkTitle: v.string(),
      totalTimeSaved: v.number(),
      usageCount: v.number(),
    })),
    timeByCategory: v.array(v.object({
      category: v.string(),
      totalTime: v.number(),
      count: v.number(),
    })),
    dailyBreakdown: v.array(v.object({
      date: v.string(),
      timeSaved: v.number(),
      sessions: v.number(),
    })),
  }),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        totalTimeSaved: 0,
        averageTimePerSession: 0,
        mostUsedFrameworks: [],
        timeByCategory: [],
        dailyBreakdown: [],
      };
    }
    const userId = user._id;

    const period = args.period || "month";
    const now = Date.now();
    let startTime = now;

    switch (period) {
      case "week":
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case "all":
        startTime = 0;
        break;
    }

    // Get all time tracking entries for the period
    const allEntries = await ctx.db
      .query("timeTracking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("timestamp"), startTime))
      .collect();

    // Calculate total time saved
    const totalTimeSaved = allEntries.reduce((sum, entry) => sum + entry.timeSaved, 0);
    const averageTimePerSession = allEntries.length > 0 ? totalTimeSaved / allEntries.length : 0;

    // Group by framework
    const frameworkStats = new Map();
    for (const entry of allEntries) {
      const framework = await ctx.db.get(entry.frameworkId);
      if (framework) {
        const key = entry.frameworkId;
        if (!frameworkStats.has(key)) {
          frameworkStats.set(key, {
            frameworkId: entry.frameworkId,
            frameworkTitle: framework.title,
            totalTimeSaved: 0,
            usageCount: 0,
          });
        }
        const stats = frameworkStats.get(key);
        stats.totalTimeSaved += entry.timeSaved;
        stats.usageCount += 1;
      }
    }

    const mostUsedFrameworks = Array.from(frameworkStats.values())
      .sort((a, b) => b.totalTimeSaved - a.totalTimeSaved)
      .slice(0, 5);

    // Group by category
    const categoryStats = new Map();
    for (const entry of allEntries) {
      const category = entry.category || "uncategorized";
      if (!categoryStats.has(category)) {
        categoryStats.set(category, {
          category,
          totalTime: 0,
          count: 0,
        });
      }
      const stats = categoryStats.get(category);
      stats.totalTime += entry.timeSaved;
      stats.count += 1;
    }

    const timeByCategory = Array.from(categoryStats.values())
      .sort((a, b) => b.totalTime - a.totalTime);

    // Daily breakdown
    const dailyStats = new Map();
    for (const entry of allEntries) {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      if (!dailyStats.has(date)) {
        dailyStats.set(date, {
          date,
          timeSaved: 0,
          sessions: 0,
        });
      }
      const stats = dailyStats.get(date);
      stats.timeSaved += entry.timeSaved;
      stats.sessions += 1;
    }

    const dailyBreakdown = Array.from(dailyStats.values())
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalTimeSaved,
      averageTimePerSession: Math.round(averageTimePerSession * 100) / 100,
      mostUsedFrameworks,
      timeByCategory,
      dailyBreakdown,
    };
  },
});

// Query: Get time tracking leaderboard (for community motivation)
export const getTimeTrackingLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    userId: v.string(),
    userName: v.string(),
    school: v.string(),
    totalTimeSaved: v.number(),
    frameworksTried: v.number(),
    rank: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get all beta users with their time saved
    const betaUsers = await ctx.db
      .query("betaProgram")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const leaderboard = [];
    for (const betaUser of betaUsers) {
      const user = await ctx.db.get(betaUser.userId as any);
      const userProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", betaUser.userId))
        .first();

      if (user && userProfile) {
        leaderboard.push({
          userId: betaUser.userId,
          userName: (user as any).name || "Anonymous",
          school: userProfile.school || "Not specified",
          totalTimeSaved: betaUser.totalTimeSaved,
          frameworksTried: betaUser.frameworksTried,
          rank: 0, // Will be set after sorting
        });
      }
    }

    // Sort by total time saved and assign ranks
    leaderboard.sort((a, b) => b.totalTimeSaved - a.totalTimeSaved);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return leaderboard.slice(0, limit);
  },
});

// Mutation: Bulk record time saved (for batch operations)
export const bulkRecordTimeSaved = mutation({
  args: {
    entries: v.array(v.object({
      frameworkId: v.id("frameworks"),
      timeSaved: v.number(),
      activity: v.string(),
      category: v.optional(v.string()),
      timestamp: v.optional(v.number()),
    })),
  },
  returns: v.array(v.id("timeTracking")),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    const entryIds = [];
    let totalTimeSaved = 0;

    for (const entry of args.entries) {
      const timeEntryId = await ctx.db.insert("timeTracking", {
        userId,
        frameworkId: entry.frameworkId,
        timeSaved: entry.timeSaved,
        activity: entry.activity,
        category: entry.category,
        timestamp: entry.timestamp || Date.now(),
      });
      entryIds.push(timeEntryId);
      totalTimeSaved += entry.timeSaved;
    }

    // Update user's total time saved in beta program
    const betaStatus = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (betaStatus) {
      await ctx.db.patch(betaStatus._id, {
        totalTimeSaved: betaStatus.totalTimeSaved + totalTimeSaved,
      });
    }

    return entryIds;
  },
});
