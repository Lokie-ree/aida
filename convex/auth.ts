import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { betterAuth } from "better-auth";

const siteUrl = process.env.SITE_URL || "https://kindly-setter-935.convex.site";
const frontendUrl = "http://localhost:5175"; // Frontend development URL

/** 
 * This configures Better Auth with Convex following the official integration guide.
 * Uses email/password authentication without email verification for beta testing.
 * 
 * @see https://convex-better-auth.netlify.app/framework-guides/react
 */

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth, {
  verbose: true,
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        try {
          console.log("Better Auth user created, creating user profile:", doc._id);
          
          // Validate required fields
          if (!doc._id || !doc.email) {
            console.error("User creation trigger: Missing required fields");
            return; // Gracefully exit without throwing
          }
          
          // Check if profile already exists using authId
          const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("authId", (q) => q.eq("authId", doc._id))
            .first();

          if (existingProfile) {
            console.log("User profile already exists for user:", doc._id);
            return; // Profile already created, nothing to do
          }

          // Look up beta signup data by email to populate profile
          const betaSignup = await ctx.db
            .query("betaSignups")
            .withIndex("by_email", (q) => q.eq("email", doc.email))
            .first();

          // Create user profile with authId (new pattern) and legacy userId for compatibility
          await ctx.db.insert("userProfiles", {
            userId: doc._id, // Legacy field for compatibility
            authId: doc._id, // New Better Auth 0.9 pattern
            school: betaSignup?.school || undefined,
            subject: betaSignup?.subject || undefined,
            gradeLevel: undefined,
            district: undefined,
            role: "teacher",
          });
          console.log("User profile created for user:", doc._id);

          // Create beta program record for ALL users (not just beta signups)
          // This ensures every user has a beta program record
          await ctx.db.insert("betaProgram", {
            userId: doc._id,
            status: betaSignup && betaSignup.status === "approved" ? "active" : "invited",
            invitedAt: betaSignup?.signupDate || Date.now(),
            joinedAt: Date.now(),
            onboardingStep: 0,
            onboardingCompleted: false,
            frameworksTried: 0,
            totalTimeSaved: 0,
            innovationsShared: 0,
            officeHoursAttended: 0,
            weeklyEngagementCount: 0,
          });
          console.log("Beta program record created for user:", doc._id);
        } catch (error) {
          console.error("Error in onCreate trigger:", error);
          // Don't throw - let Better Auth continue even if profile creation fails
          // This prevents blocking user creation if there's a profile sync issue
        }
      },
      onUpdate: async (ctx, newDoc, oldDoc) => {
        // When a Better Auth user is updated, sync any relevant changes
        console.log("Better Auth user updated:", newDoc._id);
        
        // Check if email changed and update any related data
        if (newDoc.email !== oldDoc.email) {
          console.log("User email changed for user:", newDoc._id);
          
          // Update user profile if it exists
          const userProfile = await ctx.db
            .query("userProfiles")
            .withIndex("authId", (q) => q.eq("authId", newDoc._id))
            .first();
          
          if (userProfile) {
            // Update any related records that might reference the email
            console.log("User profile found, email change handled for user:", newDoc._id);
          }
        }
      },
      onDelete: async (ctx, doc) => {
        try {
          // When a Better Auth user is deleted, clean up related data
          console.log("Better Auth user deleted, cleaning up user profile:", doc._id);
          
          // Validate required fields
          if (!doc._id) {
            console.error("User deletion trigger: Missing user ID");
            return;
          }
          
          // Find and delete the associated user profile using authId
          const profile = await ctx.db
            .query("userProfiles")
            .withIndex("authId", (q) => q.eq("authId", doc._id))
            .first();

          if (profile) {
            await ctx.db.delete(profile._id);
            console.log("User profile deleted for user:", doc._id);
          } else {
            console.log("No user profile found to delete for user:", doc._id);
          }
        } catch (error) {
          console.error("Error in onDelete trigger (profile):", error);
          // Continue with cleanup even if profile deletion fails
        }

        // Clean up Phase 2 related data (wrapped in try-catch for resilience)
        try {
          // Delete beta program records
          const betaPrograms = await ctx.db
            .query("betaProgram")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .collect();
          
          for (const betaProgram of betaPrograms) {
            await ctx.db.delete(betaProgram._id);
          }

          // Delete framework usage records
          const frameworkUsage = await ctx.db
            .query("frameworkUsage")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .collect();
          
          for (const usage of frameworkUsage) {
            await ctx.db.delete(usage._id);
          }

          // Delete testimonials
          const testimonials = await ctx.db
            .query("testimonials")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .collect();
          
          for (const testimonial of testimonials) {
            await ctx.db.delete(testimonial._id);
          }

          // Delete innovations
          const innovations = await ctx.db
            .query("innovations")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .collect();
          
          for (const innovation of innovations) {
            await ctx.db.delete(innovation._id);
          }

          // Delete time tracking records
          const timeTracking = await ctx.db
            .query("timeTracking")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .collect();
          
          for (const tracking of timeTracking) {
            await ctx.db.delete(tracking._id);
          }

          console.log("All user data cleaned up for user:", doc._id);
        } catch (error) {
          console.error("Error cleaning up Phase 2 data in onDelete trigger:", error);
          // Log but don't throw - cleanup should continue even if Phase 2 data fails
        }
      },
    },
  },
});

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: frontendUrl, // Use frontend URL for Better Auth redirects
    trustedOrigins: [
      siteUrl, // Production URL
      "http://localhost:5173", // Development URL
      "http://localhost:5175", // Alternative dev port (current)
      "http://localhost:3000", // Alternative dev port
      "https://pelicanai.org", // Production domain
      "https://www.pelicanai.org", // Production domain with www
    ],
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password for beta program
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The cross domain plugin is required for client side frameworks
      crossDomain({ siteUrl: frontendUrl }),
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  });
};

/**
 * Internal mutation to create a Better Auth user using the internal API.
 * 
 * This bypasses the HTTP endpoints and creates users directly through Better Auth's
 * internal signup API. Used primarily for testing and internal user creation flows.
 * 
 * **Security:** This function should only be called from trusted internal actions.
 * 
 * @param {string} args.email - User's email address (must be unique)
 * @param {string} args.password - User's password (will be hashed by Better Auth)
 * @param {string} [args.name] - Optional display name (defaults to email prefix)
 * 
 * @returns {Object} Result object containing:
 *   - success: boolean indicating if user was created
 *   - userId: string ID of created user (if successful)
 *   - message: string description of result
 * 
 * @throws {Error} Implicitly throws if Better Auth API fails
 * 
 * @example
 * const result = await ctx.runMutation(api.auth.createBetterAuthUser, {
 *   email: "teacher@school.edu",
 *   password: "SecureTemp123!",
 *   name: "Jane Teacher"
 * });
 */
export const createBetterAuthUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.optional(v.string()),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      console.log("Creating Better Auth user internally");
      
      const auth = createAuth(ctx);
      
      // Create user using Better Auth's internal signup API
      const result = await auth.api.signUpEmail({
        body: {
          email: args.email,
          password: args.password,
          name: args.name || args.email.split('@')[0],
        },
      });

      if (result && result.user) {
        console.log("Successfully created Better Auth user, ID:", result.user.id);
        console.log(`User ID: ${result.user.id}`);
        
        return {
          success: true,
          userId: result.user.id,
          message: "User created successfully",
        };
      } else {
        console.error("No user returned from Better Auth signup");
        return {
          success: false,
          message: "Failed to create user - no user returned",
        };
      }
    } catch (error) {
      console.error("Error creating Better Auth user:", error);
      return {
        success: false,
        message: `Failed to create user: ${error}`,
      };
    }
  },
});

/**
 * Public mutation for frontend to create users directly via internal API.
 * 
 * This function creates a Better Auth user and manually initializes their profile records
 * since Better Auth triggers don't fire when using the internal signup API.
 * 
 * **Phase 1 MVP:** Primary user creation method for beta signup flow.
 * 
 * @param {string} args.email - User's email address (must be unique)
 * @param {string} args.password - User's password (will be hashed by Better Auth)
 * @param {string} [args.name] - Optional display name (defaults to email prefix)
 * 
 * @returns {Object} Result object containing:
 *   - success: boolean indicating if user was created
 *   - userId: string ID of created user (if successful)
 *   - message: string description of result
 * 
 * @throws {Error} Implicitly throws if profile creation fails
 * 
 * @example
 * const result = await ctx.runMutation(api.auth.createUserDirectly, {
 *   email: "teacher@school.edu",
 *   password: "SecureTemp123!",
 *   name: "Jane Teacher"
 * });
 */
export const createUserDirectly = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.optional(v.string()),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      console.log("Creating user directly via internal API");
      
      const auth = createAuth(ctx);
      
      // Create user using Better Auth's internal signup API
      const result = await auth.api.signUpEmail({
        body: {
          email: args.email,
          password: args.password,
          name: args.name || args.email.split('@')[0],
        },
      });

      if (result && result.user) {
        console.log("Successfully created user, ID:", result.user.id);
        console.log(`User ID: ${result.user.id}`);
        
        // Since triggers don't fire with internal API, manually create profile records
        console.log(`Manually creating profile records for user: ${result.user.id}`);
        
        // Look up beta signup data by email to populate profile
        const betaSignup = await ctx.db
          .query("betaSignups")
          .withIndex("by_email", (q) => q.eq("email", args.email))
          .first();

        // Create user profile with authId (new pattern) and legacy userId for compatibility
        await ctx.db.insert("userProfiles", {
          userId: result.user.id, // Legacy field for compatibility
          authId: result.user.id, // New Better Auth 0.9 pattern
          school: betaSignup?.school || undefined,
          subject: betaSignup?.subject || undefined,
          gradeLevel: undefined,
          district: undefined,
          role: "teacher",
        });
        console.log(`User profile created for user: ${result.user.id}`);

        // Create beta program record for ALL users (not just beta signups)
        await ctx.db.insert("betaProgram", {
          userId: result.user.id,
          status: betaSignup && betaSignup.status === "approved" ? "active" : "invited",
          invitedAt: betaSignup?.signupDate || Date.now(),
          joinedAt: Date.now(),
          onboardingStep: 0,
          onboardingCompleted: false,
          frameworksTried: 0,
          totalTimeSaved: 0,
          innovationsShared: 0,
          officeHoursAttended: 0,
          weeklyEngagementCount: 0,
        });
        console.log(`Beta program record created for user: ${result.user.id}`);
        
        return {
          success: true,
          userId: result.user.id,
          message: "User created successfully",
        };
      } else {
        console.error("No user returned from Better Auth signup");
        return {
          success: false,
          message: "Failed to create user - no user returned",
        };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        message: `Failed to create user: ${error}`,
      };
    }
  },
});

/**
 * Get the currently authenticated user from session.
 * 
 * This query safely retrieves the current user without throwing errors.
 * Used by frontend components to check authentication status.
 * 
 * **Phase 1 MVP:** Used in dashboard and profile components.
 * 
 * @returns {Object|null} Better Auth user object or null if not authenticated
 * 
 * @example
 * const user = useQuery(api.auth.getCurrentUser);
 * if (user) {
 *   console.log("Logged in as:", user.email);
 * }
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await authComponent.getAuthUser(ctx);
    } catch (error) {
      // If authentication fails, return null instead of throwing
      return null;
    }
  },
});

/**
 * Safe wrapper for getting authenticated user in mutations and queries.
 * 
 * This helper function catches authentication errors and returns null instead of throwing.
 * Use this in mutations/queries that should gracefully handle unauthenticated requests.
 * 
 * **Phase 1 MVP:** Used throughout userProfiles.ts and betaSignup.ts for safe auth checks.
 * 
 * @param {GenericCtx<DataModel>} ctx - Convex context object
 * @returns {Promise<Object|null>} Better Auth user object or null if not authenticated
 * 
 * @example
 * const user = await getAuthUserSafe(ctx);
 * if (!user) {
 *   throw new Error("User must be authenticated");
 * }
 */
export const getAuthUserSafe = async (ctx: GenericCtx<DataModel>) => {
  try {
    return await authComponent.getAuthUser(ctx);
  } catch (error) {
    // If authentication fails, return null instead of throwing
    return null;
  }
};

/**
 * Legacy compatibility alias
 * @deprecated Use getCurrentUser instead
 */
export const currentUser = getCurrentUser;

/**
 * Query to get all Better Auth users (for synchronization)
 * Note: This function is deprecated as Better Auth manages its own user table
 * Use triggers to sync data instead
 */
export const getAllUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    // Better Auth manages its own user table internally
    // This function is kept for compatibility but returns empty array
    // Use triggers to sync data between Better Auth and app tables
    return [];
  },
});

/**
 * Legacy compatibility alias
 * @deprecated Use getCurrentUser instead
 */
export const loggedInUser = getCurrentUser;

// Test helper functions removed due to Better Auth integration complexity
// Use the simplified test script instead

// Export triggers API for external use
export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
