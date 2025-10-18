import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserSafe } from "./auth";
import { api } from "./_generated/api";

/**
 * Query to get the current user's profile.
 * 
 * Retrieves the authenticated user's profile data including school, subject, grade level, etc.
 * Returns null if user is not authenticated or profile doesn't exist.
 * 
 * **Phase 1 MVP:** Used to display user information and pre-fill forms.
 * 
 * @returns {Object|null} User profile object or null if not found/authenticated
 * 
 * @example
 * const profile = useQuery(api.userProfiles.getUserProfile);
 * if (profile) {
 *   console.log("Teaching at:", profile.school);
 * }
 */
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
    // Use safe auth getter (returns null if not authenticated, no throw)
    const user = await getAuthUserSafe(ctx);
    
    if (!user) {
      console.log("getUserProfile: No authenticated user");
      return null;
    }
    const userId = user._id;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      console.log("getUserProfile: No profile found for user:", userId);
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
    isTestData: v.optional(v.boolean()), // NEW: Optional test data flag
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    let user;
    try {
      user = await getAuthUserSafe(ctx);
    } catch (error) {
      throw new Error("User must be authenticated");
    }
    
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
      isTestData: args.isTestData || false, // NEW: Set test data flag
    });

    return profileId;
  },
});

/**
 * Mutation to update the current user's profile.
 * 
 * Updates or creates the authenticated user's profile with provided fields.
 * If profile doesn't exist, creates a new one automatically.
 * 
 * **Phase 1 MVP:** Used for onboarding and profile editing.
 * 
 * @param {string} [args.school] - School name
 * @param {string} [args.subject] - Subject taught
 * @param {string} [args.gradeLevel] - Grade level taught
 * @param {string} [args.district] - School district
 * @param {"teacher"|"admin"|"coach"} [args.role] - User role
 * 
 * @returns {null}
 * 
 * @throws {Error} If user is not authenticated
 * 
 * @example
 * const updateProfile = useMutation(api.userProfiles.updateUserProfile);
 * await updateProfile({
 *   school: "Lincoln High School",
 *   subject: "Mathematics",
 *   gradeLevel: "9-12"
 * });
 */
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
    let user;
    try {
      user = await getAuthUserSafe(ctx);
    } catch (error) {
      throw new Error("User must be authenticated");
    }
    
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
    const user = await getAuthUserSafe(ctx);
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
    let user;
    try {
      user = await getAuthUserSafe(ctx);
    } catch (error) {
      throw new Error("User must be authenticated");
    }
    
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

export const initializeNewUser = mutation({
  args: {},
  returns: v.union(
    v.object({ 
      success: v.boolean(),
      profileId: v.id("userProfiles"),
      betaProgramId: v.id("betaProgram"),
      message: v.string()
    }),
    v.object({
      success: v.boolean(),
      message: v.string()
    })
  ),
  handler: async (ctx) => {
    const user = await getAuthUserSafe(ctx);
    if (!user) {
      return { success: false, message: "User must be authenticated" };
    }

    // Check if already initialized
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existingProfile) {
      return { success: false, message: "User already initialized" };
    }

    // Get beta signup data
    const betaSignup = await ctx.db
      .query("betaSignups")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .first();

    if (!betaSignup || betaSignup.status !== "approved") {
      return { success: false, message: "No approved beta signup found" };
    }

    // Create user profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId: user._id,
      school: betaSignup.school,
      subject: betaSignup.subject,
      gradeLevel: undefined,
      district: undefined,
      role: "teacher",
    });

    // Initialize beta program
    const betaProgramId = await ctx.db.insert("betaProgram", {
      userId: user._id,
      status: "active",
      invitedAt: betaSignup.signupDate,
      joinedAt: Date.now(),
      onboardingStep: 0,
      onboardingCompleted: false,
      frameworksTried: 0,
      totalTimeSaved: 0,
      innovationsShared: 0,
      officeHoursAttended: 0,
      weeklyEngagementCount: 0,
    });

    return { 
      success: true,
      profileId, 
      betaProgramId, 
      message: "User initialized successfully" 
    };
  },
});

// Test helper functions
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
            district: undefined,
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
            officeHoursAttended: 0,
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

// UNAUTHENTICATED VERSION: Create userProfile for a specific user ID
// This is used when creating profiles from actions where the user isn't authenticated yet
export const createUserProfileForUserId = mutation({
  args: {
    userId: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    district: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
    isTestData: v.optional(v.boolean()), // NEW: Optional test data flag
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingProfile) {
      return existingProfile._id;
    }

    // Create new profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId: args.userId,
      school: args.school,
      subject: args.subject,
      gradeLevel: args.gradeLevel,
      district: args.district,
      role: args.role || "teacher",
      isTestData: args.isTestData || false, // NEW: Set test data flag
    });

    return profileId;
  },
});