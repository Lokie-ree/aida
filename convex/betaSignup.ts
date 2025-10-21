import { mutation, action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * Public mutation for beta program signup.
 * 
 * Creates a beta signup record, generates a temporary password, and schedules
 * user account creation and welcome email delivery (email-first approach).
 * 
 * **Phase 1 MVP:** Primary entry point for beta tester recruitment.
 * 
 * @param {string} args.email - Beta tester's email address (must be unique)
 * @param {string} [args.name] - Beta tester's name (optional)
 * @param {string} [args.school] - School name (optional, used for profile)
 * @param {string} [args.subject] - Subject taught (optional, used for profile)
 * 
 * @returns {Object} Result containing:
 *   - success: boolean indicating signup status
 *   - message: string description for user
 *   - signupId: ID of created signup record (if successful)
 *   - temporaryPassword: generated password (for internal use, not sent to user yet)
 * 
 * @throws {Error} Implicitly throws if database operations fail
 * 
 * @example
 * const result = await ctx.runMutation(api.betaSignup.signupForBeta, {
 *   email: "teacher@school.edu",
 *   name: "Jane Teacher",
 *   school: "Lincoln High School",
 *   subject: "Math"
 * });
 */
export const signupForBeta = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    isTestData: v.optional(v.boolean()), // NEW: Optional test data flag
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    signupId: v.optional(v.id("betaSignups")),
    temporaryPassword: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Validate email is not null or empty
    if (!args.email || args.email.trim() === "") {
      return {
        success: false,
        message: "Email is required.",
        signupId: undefined,
        temporaryPassword: undefined,
      };
    }

    // Check if email already exists
    const existingSignup = await ctx.db
      .query("betaSignups")
      .withIndex("by_email", (q) => q.eq("email", args.email.trim()))
      .unique();

    if (existingSignup) {
      return {
        success: false,
        message: "This email is already registered for the beta program.",
        signupId: undefined,
        temporaryPassword: undefined,
      };
    }

    // Generate secure temporary password for the user
    const temporaryPassword = generateSecurePassword();

    // Create new beta signup
    const signupId = await ctx.db.insert("betaSignups", {
      email: args.email,
      name: args.name || "",
      school: args.school || "",
      subject: args.subject || "",
      status: "pending", // Require manual approval for Phase 1 MVP
      signupDate: Date.now(),
      betaProgramId: "beta-v1",
      isTestData: args.isTestData || false, // NEW: Set test data flag
    });

    // Schedule user account creation with temporary password
    await ctx.scheduler.runAfter(
      1000,
      api.betaSignup.createUserAccountFromBetaSignup,
      {
        signupId,
        temporaryPassword,
      }
    );

    // Send welcome email (no platform credentials yet)
    await ctx.scheduler.runAfter(1000, api.email.sendBetaWelcomeEmail, {
      email: args.email,
      name: args.name,
      school: args.school,
    });

    return {
      success: true,
      message: "Successfully signed up for the beta program! Check your email for next steps.",
      signupId,
      temporaryPassword,
    };
  },
});

/**
 * Internal action to create Better Auth user account from beta signup.
 * 
 * This action runs asynchronously after beta signup to create the actual user account,
 * sync their profile, and approve their signup status.
 * 
 * **Phase 1 MVP:** Scheduled automatically 1 second after beta signup.
 * 
 * @param {Id<"betaSignups">} args.signupId - ID of the beta signup record
 * @param {string} args.temporaryPassword - Generated temporary password for user
 * 
 * @returns {Object} Result containing:
 *   - success: boolean indicating account creation status
 *   - message: string description of result
 * 
 * @example
 * // Automatically scheduled in signupForBeta
 * await ctx.scheduler.runAfter(1000, api.betaSignup.createUserAccountFromBetaSignup, {
 *   signupId,
 *   temporaryPassword
 * });
 */
export const createUserAccountFromBetaSignup = action({
  args: {
    signupId: v.id("betaSignups"),
    temporaryPassword: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; message: string }> => {
    try {
      // Get beta signup data
      const signup: any = await ctx.runQuery(api.betaSignup.getBetaSignupById, { 
        signupId: args.signupId 
      });
      
      if (!signup) {
        return { success: false, message: "Beta signup not found" };
      }

      // Use Better Auth's internal mutation instead of HTTP API
      // This avoids circular dependency issues and ensures proper user creation
      console.log("Creating Better Auth user internally for signup:", args.signupId);
      
      const result: any = await ctx.runMutation(api.auth.createUserDirectly, {
        email: signup.email,
        password: args.temporaryPassword,
        name: signup.name || signup.email.split('@')[0],
      });

      if (result.success) {
        console.log("Successfully created user account, ID:", result.userId);
        
        // The onCreate trigger will automatically create userProfile and betaProgram
        // No need for manual creation anymore - the trigger handles everything
        console.log("User created, trigger will handle profile creation, ID:", result.userId);
        
        // Update signup status to approved
        await ctx.runMutation(api.betaSignup.updateSignupStatus, {
          signupId: args.signupId,
          status: "approved",
        });
        
        // Send platform access email with credentials
        await ctx.scheduler.runAfter(0, api.email.sendPlatformAccessEmail, {
          email: signup.email,
          name: signup.name,
          temporaryPassword: args.temporaryPassword,
        });
        
        return {
          success: true,
          message: "User account created successfully",
        };
      } else {
        console.error(`Failed to create user account: ${result.message}`);
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (error) {
      console.error("Error creating user account:", error);
      return {
        success: false,
        message: "Failed to create user account",
      };
    }
  },
});

export const getBetaSignupStats = mutation({
  args: {},
  returns: v.object({
    totalSignups: v.number(),
    pendingSignups: v.number(),
    approvedSignups: v.number(),
  }),
  handler: async (ctx) => {
    const allSignups = await ctx.db.query("betaSignups").collect();
    
    return {
      totalSignups: allSignups.length,
      pendingSignups: allSignups.filter(s => s.status === "pending").length,
      approvedSignups: allSignups.filter(s => s.status === "approved").length,
    };
  },
});

export const updateSignupStatus = mutation({
  args: {
    signupId: v.id("betaSignups"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if document exists before updating
    const existingDoc = await ctx.db.get(args.signupId);
    if (!existingDoc) {
      throw new Error(`Beta signup with ID ${args.signupId} not found`);
    }
    
    await ctx.db.patch(args.signupId, {
      status: args.status,
      ...(args.notes && { notes: args.notes }),
    });
    return null;
  },
});

export const approveBetaSignup = mutation({
  args: { 
    signupId: v.id("betaSignups"),
    temporaryPassword: v.string(),
    notes: v.optional(v.string())
  },
  returns: v.object({ 
    success: v.boolean(), 
    message: v.string()
  }),
  handler: async (ctx, args) => {
    // Get beta signup
    const signup = await ctx.db.get(args.signupId);
    if (!signup) {
      return { success: false, message: "Beta signup not found" };
    }

    // Update beta signup status
    await ctx.db.patch(args.signupId, { 
      status: "approved",
      notes: args.notes 
    });

    // Schedule platform access email
    await ctx.scheduler.runAfter(0, api.email.sendPlatformAccessEmail, {
      email: signup.email,
      name: signup.name,
      temporaryPassword: args.temporaryPassword,
    });

    return {
      success: true,
      message: "Beta signup approved. User will receive platform access instructions."
    };
  },
});

/**
 * Query to get all pending beta signups for admin review.
 * 
 * Returns beta signup records with "pending" status, ordered by signup date.
 * Used by admin panel to approve or reject beta applications.
 * 
 * **Phase 1 MVP:** Used for manual beta tester approval workflow.
 * 
 * @returns {Array<Object>} Array of pending beta signup records
 * 
 * @example
 * const pendingSignups = useQuery(api.betaSignup.getPendingSignups);
 */
export const getPendingSignups = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("betaSignups"),
    _creationTime: v.number(), // System field
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    signupDate: v.number(),
    betaProgramId: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
    isTestData: v.optional(v.boolean()), // NEW: Added test data flag
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("betaSignups")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

export const getBetaSignupById = query({
  args: { signupId: v.id("betaSignups") },
  returns: v.union(
    v.object({
      _id: v.id("betaSignups"),
      _creationTime: v.number(),
      email: v.string(),
      name: v.optional(v.string()),
      school: v.optional(v.string()),
      subject: v.optional(v.string()),
      status: v.string(),
      signupDate: v.number(),
      betaProgramId: v.string(),
      notes: v.optional(v.string()),
      isTestData: v.optional(v.boolean()), // NEW: Added test data flag
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.signupId);
  },
});

// Test helper functions
export const getAllBetaSignups = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("betaSignups"),
    _creationTime: v.number(),
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    status: v.string(),
    signupDate: v.number(),
    betaProgramId: v.string(),
    notes: v.optional(v.string()),
    isTestData: v.optional(v.boolean()), // NEW: Added test data flag
  })),
  handler: async (ctx) => {
    return await ctx.db.query("betaSignups").collect();
  },
});

export const deleteBetaSignup = mutation({
  args: { signupId: v.id("betaSignups") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.signupId);
    return true;
  },
});

/**
 * ADMIN RECOVERY MUTATION: Recover deleted user data
 * 
 * This mutation is used to recover accidentally deleted user data.
 * It bypasses normal duplicate checks and creates records directly.
 * 
 * **Use with caution:** Only for data recovery scenarios
 * 
 * @param {string} args.email - User's email address
 * @param {string} args.userId - Better Auth user ID
 * @param {string} [args.name] - User's name (optional)
 * @param {string} [args.school] - School name
 * @param {string} [args.subject] - Subject taught
 * @param {number} [args.originalSignupDate] - Original signup timestamp
 * 
 * @returns {Object} Result containing success status and created IDs
 */
export const recoverDeletedUser = mutation({
  args: {
    email: v.string(),
    userId: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    originalSignupDate: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    betaSignupId: v.optional(v.id("betaSignups")),
    betaProgramId: v.optional(v.id("betaProgram")),
  }),
  handler: async (ctx, args) => {
    try {
      // Check if user already exists (prevent duplicate recovery)
      const existingSignup = await ctx.db
        .query("betaSignups")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .unique();

      if (existingSignup) {
        return {
          success: false,
          message: "User already exists in betaSignups table",
          betaSignupId: undefined,
          betaProgramId: undefined,
        };
      }

      // Create beta signup record
      const signupDate = args.originalSignupDate || Date.now();
      const betaSignupId = await ctx.db.insert("betaSignups", {
        email: args.email,
        name: args.name || args.email.split('@')[0],
        school: args.school || "",
        subject: args.subject || "",
        status: "approved", // User already has account
        signupDate: signupDate,
        betaProgramId: "beta-v1",
        notes: "Recovered from accidental deletion",
      });

      // Create beta program record
      const betaProgramId = await ctx.db.insert("betaProgram", {
        userId: args.userId,
        status: "active",
        invitedAt: signupDate,
        joinedAt: signupDate,
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
        message: "User data recovered successfully",
        betaSignupId,
        betaProgramId,
      };
    } catch (error) {
      console.error("Error recovering user data:", error);
      return {
        success: false,
        message: `Failed to recover user data: ${error}`,
        betaSignupId: undefined,
        betaProgramId: undefined,
      };
    }
  },
});

/**
 * Mutation: Resend platform access email for existing user.
 * 
 * Allows admins or users to resend their platform access email with credentials.
 * Useful for recovery when users don't receive their initial email.
 * 
 * @param email - Email address to resend credentials to
 * @returns Result object with success status and message
 * 
 * @throws "User not found" if no user exists with that email
 * @throws "User not approved" if user exists but signup not approved
 */
export const resendPlatformAccessEmail = mutation({
  args: { email: v.string() },
  returns: v.object({ 
    success: v.boolean(), 
    message: v.string(),
    temporaryPassword: v.optional(v.string())
  }),
  handler: async (ctx, args): Promise<{
    success: boolean;
    message: string;
    temporaryPassword?: string;
  }> => {
    try {
      // Find beta signup by email
      const signup = await ctx.db
        .query("betaSignups")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
      
      if (!signup) {
        return { 
          success: false, 
          message: "No beta signup found for this email address" 
        };
      }
      
      if (signup.status !== "approved") {
        return { 
          success: false, 
          message: "Beta signup not approved yet" 
        };
      }
      
      // Generate new temporary password
      const temporaryPassword = generateSecurePassword();
      
      // Reset the user's password in Better Auth system
      const passwordResetResult: any = await ctx.runMutation(api.auth.resetUserPassword, {
        email: signup.email,
        newPassword: temporaryPassword,
      });
      
      if (!passwordResetResult.success) {
        return {
          success: false,
          message: `Failed to reset password: ${passwordResetResult.message}`
        };
      }
      
      // Send platform access email
      await ctx.scheduler.runAfter(0, api.email.sendPlatformAccessEmail, {
        email: signup.email,
        name: signup.name,
        temporaryPassword: temporaryPassword,
      });
      
      return {
        success: true,
        message: "Platform access email sent successfully",
        temporaryPassword: temporaryPassword // For admin use only
      };
    } catch (error) {
      console.error("Error resending platform access email:", error);
      return {
        success: false,
        message: `Failed to resend email: ${error}`
      };
    }
  },
});

/**
 * Generate a secure temporary password for beta testers
 * Password includes uppercase, lowercase, numbers, and special characters
 * Default length: 16 characters
 */
function generateSecurePassword(length = 16): string {
  const charset = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}