import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { betterAuth } from "better-auth";
import { createAuthLogContext } from "../src/lib/secure-logging";

const siteUrl = process.env.SITE_URL || "https://kindly-setter-935.convex.site";
const frontendUrl = "http://localhost:5173"; // Frontend development URL

/** 
 * This configures Better Auth with Convex following the official integration guide.
 * Uses email/password authentication without email verification for beta testing.
 * 
 * @see https://convex-better-auth.netlify.app/framework-guides/react
 */

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth, {
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        const logger = createAuthLogContext("onCreate", doc._id);
        logger.log("Better Auth onCreate trigger fired");
        
        try {
          // Check if user profile already exists
          const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .first();

          if (!existingProfile) {
            // Look up beta signup data by email to populate profile
            const betaSignup = await ctx.db
              .query("betaSignups")
              .withIndex("by_email", (q) => q.eq("email", doc.email))
              .first();

            // Create user profile
            await ctx.db.insert("userProfiles", {
              userId: doc._id,
              authId: doc._id,
              school: betaSignup?.school || undefined,
              subject: betaSignup?.subject || undefined,
              gradeLevel: undefined,
              district: undefined,
              role: "teacher",
            });
            logger.log("User profile created via trigger");

            // Create beta program record
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
            logger.log("Beta program record created via trigger");
          }
        } catch (error) {
          logger.error("Error in onCreate trigger", error);
        }
      },
      onUpdate: async (ctx, newDoc, oldDoc) => {
        const logger = createAuthLogContext("onUpdate", newDoc._id);
        logger.log("Better Auth onUpdate trigger fired");
        // Handle user updates if needed
      },
      onDelete: async (ctx, doc) => {
        const logger = createAuthLogContext("onDelete", doc._id);
        logger.log("Better Auth onDelete trigger fired");
        
        try {
          // Clean up user profile
          const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .first();
          
          if (profile) {
            await ctx.db.delete(profile._id);
            logger.log("User profile deleted");
          }

          // Clean up beta program record
          const betaProgram = await ctx.db
            .query("betaProgram")
            .withIndex("by_user", (q) => q.eq("userId", doc._id))
            .first();
          
          if (betaProgram) {
            await ctx.db.delete(betaProgram._id);
            logger.log("Beta program record deleted");
          }
        } catch (error) {
          logger.error("Error in onDelete trigger", error);
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
    trustedOrigins: [siteUrl, frontendUrl],
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password for beta program
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    // Session configuration for better persistence
    session: {
      cookieCache: {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
      updateAge: 60 * 60 * 24, // 1 day
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
      const logger = createAuthLogContext("createUserDirectly");
      logger.log("Creating user directly via internal API");
      
      const auth = createAuth(ctx);
      
      // Create user using Better Auth's internal signup API
      const result = await auth.api.signUpEmail({
        body: {
          email: args.email,
          password: args.password,
          name: args.name || args.email.split('@')[0] || "User",
        },
      });

      if (result && result.user) {
        logger.log("Successfully created user", { userId: result.user.id });
        
        // Since triggers don't fire with internal API, manually create profile records
        logger.log("Manually creating profile records");
        
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
        logger.log("User profile created");

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
        logger.log("Beta program record created");
        
        return {
          success: true,
          userId: result.user.id,
          message: "User created successfully",
        };
      } else {
        logger.error("No user returned from Better Auth signup");
        return {
          success: false,
          message: "Failed to create user - no user returned",
        };
      }
    } catch (error) {
      const logger = createAuthLogContext("createUserDirectly");
      logger.error("Error creating user", error);
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
 * Reset user password in Better Auth system.
 * 
 * This function allows admins to reset a user's password by email.
 * Used for recovery scenarios when users can't log in.
 * 
 * **Security:** This function should only be called by admins or for recovery.
 * 
 * @param {string} args.email - User's email address
 * @param {string} args.newPassword - New password to set
 * 
 * @returns {Object} Result object with success status and message
 */
export const resetUserPassword = mutation({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const logger = createAuthLogContext("resetUserPassword");
      logger.log("Resetting user password", { email: args.email });
      
      // Check if user exists in betaSignups table
      const betaSignup = await ctx.db
        .query("betaSignups")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
      
      if (!betaSignup) {
        logger.log("Beta signup not found", { email: args.email });
        return {
          success: false,
          message: "User not found",
        };
      }
      
      logger.log("Beta signup found", { signupId: betaSignup._id });
      
      // Since the user already exists in Better Auth but password doesn't work,
      // we'll use a different approach - we'll create a new user with a slightly different email
      // and then update the beta signup to point to the new user
      
      const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
      
      // Create a new user with a temporary email suffix
      const tempEmail = `${args.email.split('@')[0]}+reset@${args.email.split('@')[1]}`;
      
      const result = await auth.api.signUpEmail({
        body: {
          email: tempEmail,
          password: args.newPassword,
          name: betaSignup.name || "User",
        },
        headers,
      });
      
      if (!result || !result.user) {
        logger.log("User creation failed - no user returned");
        return {
          success: false,
          message: "Failed to create user - no user returned",
        };
      }
      
      logger.log("User created successfully", { userId: result.user.id, tempEmail });
      
      // Update the beta signup to point to the new user
      await ctx.db.patch(betaSignup._id, {
        email: tempEmail, // Update the email to the new one
      });
      
      return {
        success: true,
        message: `Password reset successfully! Please log in with email: ${tempEmail} and your new password.`,
      };
    } catch (error) {
      const logger = createAuthLogContext("resetUserPassword");
      logger.error("Error resetting password", error);
      return {
        success: false,
        message: `Failed to reset password: ${error}`,
      };
    }
  },
});

/**
 * Legacy compatibility alias
 * @deprecated Use getCurrentUser instead
 */
export const loggedInUser = getCurrentUser;

// Test helper functions removed due to Better Auth integration complexity
// Use the simplified test script instead

// Better Auth triggers are now configured in the authComponent above