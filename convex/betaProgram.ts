// ============================================
// PHASE 2: Out of scope for MVP
// ============================================
// This file contains beta program tracking functionality which is not part of Phase 1 MVP.
// Some basic beta program records are created in auth.ts triggers.
// Uncomment and refactor when Phase 2 development begins.

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserSafe } from "./auth";

/**
 * Query: Get beta program status for current user.
 * 
 * Returns the user's beta program participation status, onboarding progress,
 * and engagement metrics. Used by dashboard to show program status.
 * 
 * @returns Beta program status object or null if not enrolled
 * 
 * @example
 * const betaStatus = useQuery(api.betaProgram.getBetaStatus);
 * if (betaStatus) {
 *   console.log(`Onboarding step: ${betaStatus.onboardingStep}`);
 * }
 */
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

/**
 * Mutation: Initialize beta program for authenticated user.
 * 
 * Creates a beta program record for the current user if one doesn't exist.
 * Used during user onboarding to track program participation.
 * 
 * @requires Authentication - Must be logged in
 * @returns ID of the created or existing beta program record
 * 
 * @throws "User must be authenticated" if no session
 * 
 * @see betaProgram table in schema.ts for record structure
 */
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

/**
 * Mutation: Update user's onboarding progress.
 * 
 * Updates the onboarding step and marks onboarding as completed when
 * the user reaches the final step (step 4).
 * 
 * @requires Authentication - Must be logged in
 * @param step - New onboarding step number (0-4)
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Beta program not initialized" if no beta program record
 * 
 * @see betaProgram table in schema.ts for onboarding fields
 */
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

/**
 * Mutation: Record weekly engagement for current user.
 * 
 * Updates the user's weekly engagement count and last prompt opened timestamp.
 * Used to track user activity and engagement with weekly email prompts.
 * 
 * @requires Authentication - Must be logged in
 * 
 * @throws "User must be authenticated" if no session
 * 
 * @see betaProgram table in schema.ts for engagement fields
 */
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

/**
 * Query: Get beta program statistics for current user.
 * 
 * Returns user's engagement metrics including frameworks tried, time saved,
 * innovations shared, and weekly engagement streak.
 * 
 * @returns Object containing user's beta program statistics
 * 
 * @example
 * const stats = useQuery(api.betaProgram.getBetaStats);
 * console.log(`Time saved: ${stats.totalTimeSaved} minutes`);
 */
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

/**
 * Query: Get all active beta users for email distribution.
 * 
 * Returns list of all users with active beta program status.
 * Used by email automation to send weekly prompts and notifications.
 * 
 * @returns Array of user objects with email and name
 * 
 * @see email.ts for weekly email automation
 */
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

/**
 * Query: Get all beta programs (for testing and cleanup).
 * 
 * Returns all beta program records with basic information.
 * Used by test scripts and admin tools for data management.
 * 
 * @returns Array of beta program records with creation metadata
 * 
 * @see testDataCleanup.ts for test data management
 */
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

/**
 * Mutation: Delete beta program record (for test cleanup).
 * 
 * Permanently removes a beta program record from the system.
 * Used by test scripts for data cleanup and isolation.
 * 
 * @param programId - ID of the beta program record to delete
 * @returns true if deletion was successful
 * 
 * @warning This action is irreversible
 * @see testDataCleanup.ts for safe test data management
 */
export const deleteBetaProgram = mutation({
  args: { programId: v.id("betaProgram") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.programId);
    return true;
  },
});

/**
 * Mutation: Create beta program record for specific user ID.
 * 
 * Creates a beta program record for a user without requiring authentication.
 * Used during user account creation flows where the user isn't authenticated yet.
 * 
 * @param userId - Better Auth user ID
 * @param invitedAt - Optional invitation timestamp (defaults to now)
 * @param isTestData - Optional test data flag for isolation
 * @returns ID of the created or existing beta program record
 * 
 * @see auth.ts for user creation triggers
 */
export const createBetaProgramForUserId = mutation({
  args: {
    userId: v.string(),
    invitedAt: v.optional(v.number()),
    isTestData: v.optional(v.boolean()), // NEW: Optional test data flag
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
      isTestData: args.isTestData || false, // NEW: Set test data flag
    });

    return betaProgramId;
  },
});