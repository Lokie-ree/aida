// ============================================
// PHASE 2: Out of scope for MVP
// ============================================
// This file contains framework library functionality which is not part of Phase 1 MVP.
// Uncomment and refactor when Phase 2 development begins.

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Query: Get all frameworks with optional filters
export const getAllFrameworks = query({
  args: {
    module: v.optional(v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub"))),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("beta"), v.literal("published"))),
  },
  returns: v.array(v.object({
    _id: v.id("frameworks"),
    _creationTime: v.number(),
    frameworkId: v.string(),
    title: v.string(),
    module: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
    category: v.string(),
    tags: v.array(v.string()),
    challenge: v.string(),
    timeEstimate: v.number(),
    difficultyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    usageCount: v.number(),
    averageRating: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    let frameworks;

    if (args.module) {
      frameworks = await ctx.db
        .query("frameworks")
        .withIndex("by_module", (q) => q.eq("module", args.module!))
        .collect();
    } else if (args.status) {
      frameworks = await ctx.db
        .query("frameworks")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      // Default to published only
      frameworks = await ctx.db
        .query("frameworks")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .collect();
    }

    // Apply additional filters
    if (args.module && args.status) {
      frameworks = frameworks.filter(f => f.status === args.status);
    }

    if (args.category) {
      frameworks = frameworks.filter(f => f.category === args.category);
    }

    // Return with limited fields for list view
    return frameworks.map((f) => ({
      _id: f._id,
      _creationTime: f._creationTime,
      frameworkId: f.frameworkId,
      title: f.title,
      module: f.module,
      category: f.category,
      tags: f.tags,
      challenge: f.challenge,
      timeEstimate: f.timeEstimate,
      difficultyLevel: f.difficultyLevel,
      usageCount: f.usageCount,
      averageRating: f.averageRating,
    }));
  },
});

// Query: Get single framework by ID
export const getFrameworkById = query({
  args: { frameworkId: v.string() },
  returns: v.union(v.object({
    _id: v.id("frameworks"),
    _creationTime: v.number(),
    frameworkId: v.string(),
    title: v.string(),
    module: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
    category: v.string(),
    tags: v.array(v.string()),
    challenge: v.string(),
    solution: v.string(),
    samplePrompt: v.string(),
    ethicalGuardrail: v.string(),
    tipsAndVariations: v.optional(v.string()),
    timeEstimate: v.number(),
    difficultyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    platformCompatibility: v.array(v.string()),
    louisianaStandards: v.optional(v.array(v.string())),
    lerDomains: v.optional(v.array(v.string())),
    usageCount: v.number(),
    averageRating: v.optional(v.number()),
    averageTimeSaved: v.optional(v.number()),
  }), v.null()),
  handler: async (ctx, args) => {
    const framework = await ctx.db
      .query("frameworks")
      .withIndex("by_framework_id", (q) => q.eq("frameworkId", args.frameworkId))
      .filter((q) => q.eq(q.field("status"), "published"))
      .first();

    if (!framework) {
      return null;
    }

    return {
      _id: framework._id,
      _creationTime: framework._creationTime,
      frameworkId: framework.frameworkId,
      title: framework.title,
      module: framework.module,
      category: framework.category,
      tags: framework.tags,
      challenge: framework.challenge,
      solution: framework.solution,
      samplePrompt: framework.samplePrompt,
      ethicalGuardrail: framework.ethicalGuardrail,
      tipsAndVariations: framework.tipsAndVariations,
      timeEstimate: framework.timeEstimate,
      difficultyLevel: framework.difficultyLevel,
      platformCompatibility: framework.platformCompatibility,
      louisianaStandards: framework.louisianaStandards,
      lerDomains: framework.lerDomains,
      usageCount: framework.usageCount,
      averageRating: framework.averageRating,
      averageTimeSaved: framework.averageTimeSaved,
    };
  },
});

// Query: Search frameworks
export const searchFrameworks = query({
  args: { query: v.string() },
  returns: v.array(v.object({
    _id: v.id("frameworks"),
    frameworkId: v.string(),
    title: v.string(),
    module: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
    category: v.string(),
    tags: v.array(v.string()),
    challenge: v.string(),
  })),
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("frameworks")
      .withSearchIndex("search_content", (q) =>
        q.search("title", args.query).eq("status", "published")
      )
      .take(20);

    return results.map((f) => ({
      _id: f._id,
      frameworkId: f.frameworkId,
      title: f.title,
      module: f.module,
      category: f.category,
      tags: f.tags,
      challenge: f.challenge,
    }));
  },
});

// Mutation: Record framework usage
export const recordFrameworkUsage = mutation({
  args: {
    frameworkId: v.id("frameworks"),
    action: v.union(
      v.literal("viewed"),
      v.literal("copied_prompt"),
      v.literal("marked_tried"),
      v.literal("saved")
    ),
    rating: v.optional(v.number()),
    timeSaved: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.id("frameworkUsage"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Record usage
    const usageId = await ctx.db.insert("frameworkUsage", {
      frameworkId: args.frameworkId,
      userId,
      action: args.action,
      rating: args.rating,
      timeSaved: args.timeSaved,
      comment: args.comment,
      timestamp: Date.now(),
    });

    // Update framework stats
    const framework = await ctx.db.get(args.frameworkId);
    if (framework) {
      // Increment usage count
      await ctx.db.patch(args.frameworkId, {
        usageCount: framework.usageCount + 1,
      });

      // Update average rating if provided
      if (args.rating) {
        const allRatings = await ctx.db
          .query("frameworkUsage")
          .withIndex("by_framework", (q) => q.eq("frameworkId", args.frameworkId))
          .filter((q) => q.neq(q.field("rating"), undefined))
          .collect();

        const totalRating = allRatings.reduce((sum, u) => sum + (u.rating || 0), 0);
        const averageRating = totalRating / allRatings.length;

        await ctx.db.patch(args.frameworkId, {
          averageRating,
        });
      }

      // Update average time saved if provided
      if (args.timeSaved) {
        const allTimeSaved = await ctx.db
          .query("frameworkUsage")
          .withIndex("by_framework", (q) => q.eq("frameworkId", args.frameworkId))
          .filter((q) => q.neq(q.field("timeSaved"), undefined))
          .collect();

        const totalTimeSaved = allTimeSaved.reduce((sum, u) => sum + (u.timeSaved || 0), 0);
        const averageTimeSaved = totalTimeSaved / allTimeSaved.length;

        await ctx.db.patch(args.frameworkId, {
          averageTimeSaved,
        });
      }
    }

    return usageId;
  },
});

// Query: Get user's framework usage history
export const getUserFrameworkUsage = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object({
    _id: v.id("frameworkUsage"),
    frameworkId: v.id("frameworks"),
    action: v.union(
      v.literal("viewed"),
      v.literal("copied_prompt"),
      v.literal("marked_tried"),
      v.literal("saved")
    ),
    rating: v.optional(v.number()),
    timeSaved: v.optional(v.number()),
    timestamp: v.number(),
  })),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    const userId = user._id;

    const usage = await ctx.db
      .query("frameworkUsage")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 50);

    return usage.map((u) => ({
      _id: u._id,
      frameworkId: u.frameworkId,
      action: u.action,
      rating: u.rating,
      timeSaved: u.timeSaved,
      timestamp: u.timestamp,
    }));
  },
});

// Mutation: Save framework to user's collection
export const saveFramework = mutation({
  args: { frameworkId: v.id("frameworks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Record as saved
    await ctx.db.insert("frameworkUsage", {
      frameworkId: args.frameworkId,
      userId,
      action: "saved",
      timestamp: Date.now(),
    });

    return null;
  },
});

// Mutation: Unsave framework
export const unsaveFramework = mutation({
  args: { frameworkId: v.id("frameworks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Find and delete saved usage
    const savedUsage = await ctx.db
      .query("frameworkUsage")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("frameworkId"), args.frameworkId))
      .filter((q) => q.eq(q.field("action"), "saved"))
      .first();

    if (savedUsage) {
      await ctx.db.delete(savedUsage._id);
    }

    return null;
  },
});

// Query: Get user's saved frameworks
export const getUserSavedFrameworks = query({
  args: {},
  returns: v.array(v.id("frameworks")),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    const userId = user._id;

    const savedUsage = await ctx.db
      .query("frameworkUsage")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("action"), "saved"))
      .collect();

    return savedUsage.map((u) => u.frameworkId);
  },
});
