/**
 * ✅ ACTIVE - Used in production
 * Functions: getUserProfile, updateUserProfile, initializeNewUser
 */
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";
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
    onboardingComplete: v.optional(v.boolean()),
    onboardingCompletedAt: v.optional(v.number()),
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
      onboardingComplete: profile.onboardingComplete,
      onboardingCompletedAt: profile.onboardingCompletedAt,
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
    onboardingComplete: v.optional(v.boolean()),
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

    // Calculate final state after update (merge existing profile with args)
    // This ensures we check completeness based on the final combined state, not just args
    const finalSchool = args.school !== undefined ? args.school : profile?.school;
    const finalSubject = args.subject !== undefined ? args.subject : profile?.subject;
    const finalGradeLevel = args.gradeLevel !== undefined ? args.gradeLevel : profile?.gradeLevel;
    
    // Check if profile is complete (has required fields: subject and gradeLevel)
    // Note: school is optional - only subject and gradeLevel are required for completion
    const isComplete = !!(finalSubject && finalGradeLevel);
    const wasComplete = !!(profile?.subject && profile?.gradeLevel);
    const shouldMarkComplete = isComplete && !wasComplete;
    
    // Only auto-complete if onboardingComplete is explicitly set to true
    // Never auto-complete based on field presence alone - user must explicitly complete onboarding
    const markOnboardingComplete = args.onboardingComplete === true;

    if (!profile) {
      // Create profile if it doesn't exist
      await ctx.db.insert("userProfiles", {
        userId,
        school: args.school,
        subject: args.subject,
        gradeLevel: args.gradeLevel,
        role: args.role || "teacher",
        onboardingComplete: markOnboardingComplete ? true : undefined,
        onboardingCompletedAt: markOnboardingComplete ? Date.now() : undefined,
      });
    } else {
      // Update existing profile - only update fields that are explicitly provided
      const updateData: any = {};
      
      // Only include fields in update if they're provided (not undefined)
      if (args.school !== undefined) {
        updateData.school = args.school;
      }
      if (args.subject !== undefined) {
        updateData.subject = args.subject;
      }
      if (args.gradeLevel !== undefined) {
        updateData.gradeLevel = args.gradeLevel;
      }
      if (args.role !== undefined) {
        updateData.role = args.role;
      }
      
      // Only update onboardingComplete if explicitly set or if profile just became complete
      if (markOnboardingComplete) {
        updateData.onboardingComplete = true;
        updateData.onboardingCompletedAt = Date.now();
      }
      
      // Only patch if there's something to update
      if (Object.keys(updateData).length > 0) {
        await ctx.db.patch(profile._id, updateData);
      }
    }

    return null;
  },
});

// Admin function removed for beta - not needed for 4 beta testers
// Re-add post-beta if admin dashboard is needed

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

/**
 * @deprecated No longer needed - profiles are created automatically by updateUserProfile
 * This function is kept for backwards compatibility but should not be used.
 * Profile creation happens automatically when onboarding saves profile data.
 */
export const initializeNewUser = mutation({
  args: {},
  returns: v.union(
    v.object({
      success: v.boolean(),
      profileId: v.id("userProfiles"),
      message: v.string()
    }),
    v.object({
      success: v.boolean(),
      message: v.string()
    })
  ),
  handler: async (ctx) => {
    // This function is deprecated - profiles are created automatically by updateUserProfile
    // when onboarding saves profile data. No need to pre-create empty profiles.
    return { 
      success: false, 
      message: "Profile initialization is handled automatically during onboarding" 
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