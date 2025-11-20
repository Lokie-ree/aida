import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Admin Debug & Testing Functions
 *
 * This file contains functions used for debugging, testing, and manual data management.
 * These functions should only be used by administrators and in development/testing environments.
 */

// Test helper: Delete user profile by ID
export const deleteUserProfile = mutation({
  args: { profileId: v.id("userProfiles") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.profileId);
    return true;
  },
});

// Debug query to check database state
export const debugDatabaseState = query({
  args: {},
  returns: v.object({
    userProfilesCount: v.number(),
    betaSignupsCount: v.number(),
    betaProgramsCount: v.number(),
    userProfiles: v.array(v.object({
      _id: v.id("userProfiles"),
      userId: v.string(),
      school: v.optional(v.string()),
      subject: v.optional(v.string()),
    })),
    betaSignups: v.array(v.object({
      _id: v.id("betaSignups"),
      email: v.string(),
      status: v.string(),
    })),
  }),
  handler: async (ctx) => {
    const userProfiles = await ctx.db.query("userProfiles").collect();
    const betaSignups = await ctx.db.query("betaSignups").collect();
    const betaPrograms = await ctx.db.query("betaProgram").collect();

    return {
      userProfilesCount: userProfiles.length,
      betaSignupsCount: betaSignups.length,
      betaProgramsCount: betaPrograms.length,
      userProfiles: userProfiles.map(p => ({
        _id: p._id,
        userId: p.userId,
        school: p.school,
        subject: p.subject,
      })),
      betaSignups: betaSignups.map(s => ({
        _id: s._id,
        email: s.email,
        status: s.status,
      })),
    };
  },
});

// Manual sync function to create userProfiles for existing Better Auth users
// NOTE: This is a legacy migration helper and may be obsolete
export const syncExistingUsers = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    syncedCount: v.number(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    try {
      // Get all beta signups
      const betaSignups = await ctx.db.query("betaSignups").collect();

      let syncedCount = 0;

      for (const signup of betaSignups) {
        // Check if userProfile already exists for this email
        const existingProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", signup.email)) // Using email as userId for now
          .first();

        if (!existingProfile) {
          // Create userProfile for this beta signup
          await ctx.db.insert("userProfiles", {
            userId: signup.email, // We'll need to map this to actual Better Auth user ID
            school: signup.school,
            subject: signup.subject,
            gradeLevel: undefined,
            role: "teacher",
          });

          // Create beta program record
          await ctx.db.insert("betaProgram", {
            userId: signup.email, // We'll need to map this to actual Better Auth user ID
            status: "active",
            invitedAt: signup.signupDate,
            joinedAt: Date.now(),
            onboardingStep: 0,
            onboardingCompleted: false,
            frameworksTried: 0,
            totalTimeSaved: 0,
            innovationsShared: 0,
            weeklyEngagementCount: 0,
          });

          syncedCount++;
        }
      }

      return {
        success: true,
        syncedCount,
        message: `Synced ${syncedCount} users`,
      };
    } catch (error) {
      console.error("Error syncing users:", error);
      return {
        success: false,
        syncedCount: 0,
        message: `Failed to sync users: ${error}`,
      };
    }
  },
});
