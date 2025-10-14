// ============================================
// PHASE 2: Out of scope for MVP
// ============================================
// This file contains beta program tracking functionality which is not part of Phase 1 MVP.
// Some basic beta program records are created in auth.ts triggers.
// Uncomment and refactor when Phase 2 development begins.

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserSafe } from "./auth";

// Query: Get beta program status
export const getBetaStatus = query({
  args: {},
  returns: v.union(v.object({
    _id: v.id("betaProgram"),
    status: v.union(v.literal("invited"), v.literal("active"), v.literal("completed")),
    onboardingStep: v.number(),
    onboardingCompleted: v.boolean(),
    frameworksTried: v.number(),
    totalTimeSaved: v.number(),
    innovationsShared: v.number(),
    weeklyEngagementCount: v.number(),
  }), v.null()),
  handler: async (ctx) => {
    const user = await getAuthUserSafe(ctx);
    if (!user) {
      return null;
    }
    const userId = user._id;

    const betaStatus = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!betaStatus) {
      return null;
    }

    return {
      _id: betaStatus._id,
      status: betaStatus.status,
      onboardingStep: betaStatus.onboardingStep,
      onboardingCompleted: betaStatus.onboardingCompleted,
      frameworksTried: betaStatus.frameworksTried,
      totalTimeSaved: betaStatus.totalTimeSaved,
      innovationsShared: betaStatus.innovationsShared,
      weeklyEngagementCount: betaStatus.weeklyEngagementCount,
    };
  },
});

// Mutation: Initialize beta program for user
export const initializeBetaProgram = mutation({
  args: {},
  returns: v.id("betaProgram"),
  handler: async (ctx) => {
    const user = await getAuthUserSafe(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Check if already exists
    const existing = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create beta program record
    const betaProgramId = await ctx.db.insert("betaProgram", {
      userId,
      status: "active",
      invitedAt: Date.now(),
      joinedAt: Date.now(),
      onboardingStep: 0,
      onboardingCompleted: false,
      frameworksTried: 0,
      totalTimeSaved: 0,
      innovationsShared: 0,
      officeHoursAttended: 0,
      weeklyEngagementCount: 0,
    });

    return betaProgramId;
  },
});

// Mutation: Update onboarding progress
export const updateOnboardingProgress = mutation({
  args: { step: v.number() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthUserSafe(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    const betaStatus = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!betaStatus) {
      throw new Error("Beta program not initialized");
    }

    await ctx.db.patch(betaStatus._id, {
      onboardingStep: args.step,
      onboardingCompleted: args.step >= 4,
    });

    return null;
  },
});

// Mutation: Record weekly engagement
export const recordWeeklyEngagement = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await getAuthUserSafe(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    const betaStatus = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!betaStatus) {
      return null;
    }

    await ctx.db.patch(betaStatus._id, {
      lastWeeklyPromptOpened: Date.now(),
      weeklyEngagementCount: betaStatus.weeklyEngagementCount + 1,
    });

    return null;
  },
});

// Query: Get beta stats
export const getBetaStats = query({
  args: {},
  returns: v.object({
    frameworksTried: v.number(),
    totalTimeSaved: v.number(),
    innovationsShared: v.number(),
    weeklyEngagementStreak: v.number(),
  }),
  handler: async (ctx) => {
    let user;
    try {
      user = await getAuthUserSafe(ctx);
    } catch (error) {
      // If authentication fails, return default values
      return {
        frameworksTried: 0,
        totalTimeSaved: 0,
        innovationsShared: 0,
        weeklyEngagementStreak: 0,
      };
    }
    
    if (!user) {
      return {
        frameworksTried: 0,
        totalTimeSaved: 0,
        innovationsShared: 0,
        weeklyEngagementStreak: 0,
      };
    }
    const userId = user._id;

    const betaStatus = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!betaStatus) {
      return {
        frameworksTried: 0,
        totalTimeSaved: 0,
        innovationsShared: 0,
        weeklyEngagementStreak: 0,
      };
    }

    return {
      frameworksTried: betaStatus.frameworksTried,
      totalTimeSaved: betaStatus.totalTimeSaved,
      innovationsShared: betaStatus.innovationsShared,
      weeklyEngagementStreak: betaStatus.weeklyEngagementCount,
    };
  },
});

// Query: Get all beta users (for email distribution)
export const getAllBetaUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    email: v.string(),
    name: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    // Get all active beta users
    const betaUsers = await ctx.db
      .query("betaProgram")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    // Get user details for each beta user
    const users: Array<{
      _id: any;
      email: string;
      name?: string;
    }> = [];
    
    for (const betaUser of betaUsers) {
      const user = await ctx.db.get(betaUser.userId as any);
      if (user && 'email' in user) {
        users.push({
          _id: user._id,
          email: (user as any).email,
          name: (user as any).name,
        });
      }
    }

    return users;
  },
});

// Test helper functions
export const getAllBetaPrograms = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("betaProgram"),
    _creationTime: v.number(),
    userId: v.string(),
    status: v.string(),
    joinedAt: v.number(),
  })),
  handler: async (ctx) => {
    const programs = await ctx.db.query("betaProgram").collect();
    return programs.map(p => ({
      _id: p._id,
      _creationTime: p._creationTime,
      userId: p.userId,
      status: p.status,
      joinedAt: p.joinedAt || 0,
    }));
  },
});

export const deleteBetaProgram = mutation({
  args: { programId: v.id("betaProgram") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.programId);
    return true;
  },
});

// UNAUTHENTICATED VERSION: Create betaProgram for a specific user ID
// This is used when creating beta programs from actions where the user isn't authenticated yet
export const createBetaProgramForUserId = mutation({
  args: {
    userId: v.string(),
    invitedAt: v.optional(v.number()),
  },
  returns: v.id("betaProgram"),
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create beta program record
    const betaProgramId = await ctx.db.insert("betaProgram", {
      userId: args.userId,
      status: "active",
      invitedAt: args.invitedAt || Date.now(),
      joinedAt: Date.now(),
      onboardingStep: 0,
      onboardingCompleted: false,
      frameworksTried: 0,
      totalTimeSaved: 0,
      innovationsShared: 0,
      officeHoursAttended: 0,
      weeklyEngagementCount: 0,
    });

    return betaProgramId;
  },
});