/**
 * ✅ ACTIVE - Used in production
 * Functions: getUserProfile, updateUserProfile, initializeNewUser
 */
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";
import { requireAdmin } from "./authorization";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

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
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  }), v.null()),
  handler: async (ctx) => {
    // ConvexBetterAuthProvider handles token sync automatically
    // If called before token sync, getAuthUser may throw - handle gracefully
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
    } catch (error) {
      // Expected during initial token sync - return null gracefully
      // ConvexBetterAuthProvider ensures queries inside <Authenticated> wait for auth
      return null;
    }
    
    if (!user) {
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
      role: profile.role,
    };
  },
});

/**
 * @deprecated Use initializeNewUser() instead
 * This function is kept for backwards compatibility but will be removed in a future version
 */
export const createUserProfile = mutation({
  args: {
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
    isTestData: v.optional(v.boolean()), // NEW: Optional test data flag
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
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
      role: args.role || "teacher",
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
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
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
        role: args.role || "teacher",
      });
    } else {
      // Update existing profile
      await ctx.db.patch(profile._id, {
        school: args.school,
        subject: args.subject,
        gradeLevel: args.gradeLevel,
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
    role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
  })),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const profiles = await ctx.db
      .query("userProfiles")
      .collect();

    return profiles.map((profile) => ({
      _id: profile._id,
      userId: profile.userId,
      school: profile.school,
      subject: profile.subject,
      gradeLevel: profile.gradeLevel,
      role: profile.role,
    }));
  },
});

/**
 * @deprecated Use initializeNewUser() instead
 * This function is kept for backwards compatibility but will be removed in a future version
 */
export const initializeProfileForBeta = mutation({
  args: {
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
  },
  returns: v.id("userProfiles"),
  handler: async (ctx, args) => {
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
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
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
    } catch (error) {
      console.error("initializeNewUser: Failed to get auth user", error);
      return { success: false, message: "User must be authenticated" };
    }
    if (!user) {
      console.error("initializeNewUser: No user found");
      return { success: false, message: "User must be authenticated" };
    }

    console.log("initializeNewUser: Starting for user", { userId: user._id, email: user.email });

    // Check if already initialized
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existingProfile) {
      console.log("initializeNewUser: Profile already exists", existingProfile._id);
      return { success: false, message: "User already initialized" };
    }

    // Get beta signup data
    const betaSignup = await ctx.db
      .query("betaSignups")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .first();

    if (!betaSignup) {
      console.error("initializeNewUser: No beta signup found for email", user.email);
      return { success: false, message: "No beta signup found" };
    }

    if (betaSignup.status !== "approved") {
      console.error("initializeNewUser: Beta signup not approved", { email: user.email, status: betaSignup.status });
      return { success: false, message: `Beta signup status is '${betaSignup.status}', not 'approved'` };
    }

    // Check if betaProgram already exists for this user
    let betaProgram = await ctx.db
      .query("betaProgram")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    // Create betaProgram record if it doesn't exist
    // This happens when user clicks magic link after approval
    let betaProgramId: Id<"betaProgram">;
    if (!betaProgram) {
      betaProgramId = await ctx.db.insert("betaProgram", {
        userId: user._id,
        status: "invited",
        invitedAt: betaSignup.signupDate || Date.now(),
        joinedAt: undefined, // Set when onboarding completes
        onboardingStep: 0,
        onboardingCompleted: false,
        frameworksTried: 0,
        totalTimeSaved: 0,
        innovationsShared: 0,
        weeklyEngagementCount: 0,
      });
    } else {
      betaProgramId = betaProgram._id;
      // Update status to "invited" if it was in a different state
      if (betaProgram.status !== "invited") {
        await ctx.db.patch(betaProgram._id, {
          status: "invited",
        });
      }
    }

    // Create user profile with data from betaSignup
    const profileId = await ctx.db.insert("userProfiles", {
      userId: user._id,
      school: betaSignup.school,
      subject: betaSignup.subject,
      gradeLevel: undefined,
      role: "teacher",
    });

    console.log("initializeNewUser: SUCCESS", { profileId, betaProgramId, userId: user._id });

    return { 
      success: true,
      profileId, 
      betaProgramId, 
      message: "User initialized successfully" 
    };
  },
});

/**
 * @deprecated Use initializeNewUser() instead
 * UNAUTHENTICATED VERSION: Create userProfile for a specific user ID
 * This function is kept for backwards compatibility but will be removed in a future version
 */
export const createUserProfileForUserId = mutation({
  args: {
    userId: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
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
      role: args.role || "teacher",
    });

    return profileId;
  },
});