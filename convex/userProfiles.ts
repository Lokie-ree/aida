import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Query: Get user profile
export const getUserProfile = query({
  args: {},
  returns: v.union(v.object({
    _id: v.id("userProfiles"),
    userId: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  }), v.null()),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }
    const userId = user._id;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return null;
    }

    return {
      _id: profile._id,
      userId: profile.userId,
      school: profile.school,
      subject: profile.subject,
      gradeLevel: profile.gradeLevel,
      district: profile.district,
      role: profile.role,
    };
  },
});

// Mutation: Create user profile
export const createUserProfile = mutation({
  args: {
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      throw new Error("User profile already exists");
    }

    // Create new profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId,
      school: args.school,
      subject: args.subject,
      gradeLevel: args.gradeLevel,
      district: args.district,
      role: args.role || "teacher",
    });

    return profileId;
  },
});

// Mutation: Update user profile
export const updateUserProfile = mutation({
  args: {
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      // Create profile if it doesn't exist
      await ctx.db.insert("userProfiles", {
        userId,
        school: args.school,
        subject: args.subject,
        gradeLevel: args.gradeLevel,
        district: args.district,
        role: args.role || "teacher",
      });
    } else {
      // Update existing profile
      await ctx.db.patch(profile._id, {
        school: args.school,
        subject: args.subject,
        gradeLevel: args.gradeLevel,
        district: args.district,
        role: args.role,
      });
    }

    return null;
  },
});

// Query: Get all user profiles (admin only)
export const getAllUserProfiles = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("userProfiles"),
    userId: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  })),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }

    // TODO: Add admin role check
    if ((user as any).role !== "admin") {
      throw new Error("Admin access required");
    }

    const profiles = await ctx.db
      .query("userProfiles")
      .collect();

    return profiles.map((profile) => ({
      _id: profile._id,
      userId: profile.userId,
      school: profile.school,
      subject: profile.subject,
      gradeLevel: profile.gradeLevel,
      district: profile.district,
      role: profile.role,
    }));
  },
});

// Mutation: Initialize profile for new beta user
export const initializeProfileForBeta = mutation({
  args: {
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return existingProfile._id;
    }

    // Create profile for beta user
    const profileId = await ctx.db.insert("userProfiles", {
      userId,
      school: args.school,
      subject: args.subject,
      gradeLevel: args.gradeLevel,
      district: args.district,
      role: "teacher",
    });

    return profileId;
  },
});
