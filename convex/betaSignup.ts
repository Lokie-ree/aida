import { mutation, action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { createAuth, authComponent } from "./auth";
import { requireActionCtx } from "@convex-dev/better-auth/utils";

/**
 * Public mutation for beta program signup.
 * 
 * Creates a beta signup record with "pending" status and sends welcome email.
 * User will receive a magic link after admin approval.
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
  }),
  handler: async (ctx, args) => {
    // Validate email is not null or empty
    if (!args.email || args.email.trim() === "") {
      return {
        success: false,
        message: "Email is required.",
        signupId: undefined,
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
      };
    }

    // Create new beta signup
    const signupId = await ctx.db.insert("betaSignups", {
      email: args.email,
      name: args.name || "",
      school: args.school || "",
      subject: args.subject || "",
      status: "pending", // Require manual approval for Phase 1 MVP
      signupDate: Date.now(),
      betaProgramId: "beta-v1",
    });

    // Send welcome email (no platform credentials yet - user will receive magic link after approval)
    await ctx.scheduler.runAfter(1000, api.email.sendBetaWelcomeEmail, {
      email: args.email,
      name: args.name,
      school: args.school,
    });

    return {
      success: true,
      message: "Successfully signed up for the beta program! Your application is pending approval. We'll notify you via email once approved.",
      signupId,
    };
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
      console.error(`[updateSignupStatus] Beta signup not found: ${args.signupId}`);
      throw new Error(`Beta signup with ID ${args.signupId} not found`);
    }
    
    const previousStatus = existingDoc.status;
    
    await ctx.db.patch(args.signupId, {
      status: args.status,
      ...(args.notes && { notes: args.notes }),
    });


    // If status is being changed to "approved", trigger magic link sending
    if (args.status === "approved" && previousStatus !== "approved") {
      console.log(`[updateSignupStatus] Status changed to approved, scheduling magic link for: ${existingDoc.email}`);
      await ctx.scheduler.runAfter(100, api.betaSignup.sendMagicLinkForApproval, {
        email: existingDoc.email,
        name: existingDoc.name,
      });
    }
    
    return null;
  },
});

/**
 * Action to send magic link via Convex HTTP endpoint
 * 
 * Calls the Better Auth HTTP endpoint registered in http.ts.
 * This is the proper way to trigger Better Auth from Convex actions.
 */
export const sendMagicLinkForApproval = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    
    try {
      // Get the Convex site URL - this is where the HTTP endpoints are registered
      // In production: https://xxx.convex.site
      // In local dev: http://localhost:5174 (or check CONVEX_SITE_URL)
      // SITE_URL is the frontend URL, we need the Convex site URL
      let convexSiteUrl = process.env.CONVEX_SITE_URL || process.env.VITE_CONVEX_SITE_URL;
      if (!convexSiteUrl) {
        // Fallback: try to construct from CONVEX_URL if available
        const convexUrl = process.env.CONVEX_URL;
        if (convexUrl) {
          // Convert https://xxx.convex.cloud to https://xxx.convex.site
          convexSiteUrl = convexUrl.replace(/\.convex\.cloud/, ".convex.site");
        } else {
          throw new Error("CONVEX_SITE_URL or VITE_CONVEX_SITE_URL environment variable not set. Set it with: npx convex env set CONVEX_SITE_URL <your-site-url>");
        }
      }

      // The HTTP endpoint is at /api/auth/sign-in/magic-link
      // This endpoint is registered in http.ts via authComponent.registerRoutes
      const betterAuthEndpoint = `${convexSiteUrl}/api/auth/sign-in/magic-link`;
      

      // Get the frontend URL for callback URLs
      // Better Auth will use this to construct the full redirect URL
      const frontendUrl = process.env.SITE_URL || "http://localhost:5173";
      
      const response = await fetch(betterAuthEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add origin header to match trusted origins in auth.ts
          "Origin": frontendUrl,
        },
        body: JSON.stringify({
          email: args.email,
          name: args.name,
          // Use full URLs for callbacks to ensure proper redirection
          callbackURL: `${frontendUrl}/dashboard`,
          newUserCallbackURL: `${frontendUrl}/onboarding`,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        console.error(`[sendMagicLinkForApproval] HTTP error: ${response.status} - ${errorMessage}`);
        return {
          success: false,
          message: `Failed to send magic link: ${errorMessage}`,
        };
      }

      return {
        success: true,
        message: "Magic link sent successfully",
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error(`[sendMagicLinkForApproval] Exception: ${errorMessage}`);
      if (errorStack) {
        console.error(`[sendMagicLinkForApproval] Stack: ${errorStack.substring(0, 500)}`);
      }
      
      return {
        success: false,
        message: `Failed to send magic link: ${errorMessage}`,
      };
    }
  },
});

/**
 * TEST ACTION: Manually trigger magic link for a beta signup
 * 
 * This can be called directly from the Convex dashboard function runner
 * to test the magic link flow without needing admin UI access.
 * 
 * Usage in Convex dashboard:
 * 1. Go to Functions tab
 * 2. Select "betaSignup:testSendMagicLink"
 * 3. Enter: { "email": "user@example.com" }
 * 4. Run
 */
export const testSendMagicLink = action({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; message: string }> => {    
    // Find the beta signup by email
    const signup: { _id: string; email: string; name?: string; status: string } | null = await ctx.runQuery(api.betaSignup.getBetaSignupByEmail, {
      email: args.email,
    });
    
    if (!signup) {
      return {
        success: false,
        message: `No beta signup found for email: ${args.email}`,
      };
    }
        
    // Send the magic link
    const result: { success: boolean; message: string } = await ctx.runAction(api.betaSignup.sendMagicLinkForApproval, {
      email: args.email,
      name: signup.name,
    });
    
    return result;
  },
});

export const approveBetaSignup = mutation({
  args: { 
    signupId: v.id("betaSignups"),
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

    console.log(`[approveBetaSignup] Status updated to approved`);

    // Note: We don't create betaProgram here because the user doesn't exist yet.
    // betaProgram will be created in initializeNewUser when the user clicks the magic link
    // and Better Auth creates their account.

    // Send magic link email via Better Auth API
    // Use runAfter with a small delay to ensure the mutation completes first
    console.log(`[approveBetaSignup] Scheduling sendMagicLinkForApproval for email: ${signup.email}`);
    await ctx.scheduler.runAfter(100, api.betaSignup.sendMagicLinkForApproval, {
      email: signup.email,
      name: signup.name,
    });

    console.log(`[approveBetaSignup] Scheduled action completed, returning success`);

    return {
      success: true,
      message: "Beta signup approved. User will receive a magic link to access the platform."
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

export const getBetaSignupByEmail = query({
  args: { email: v.string() },
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
      isTestData: v.optional(v.boolean()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("betaSignups")
      .withIndex("by_email", (q) => q.eq("email", args.email.trim()))
      .unique();
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
        message: `Failed to recover user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
  }),
  handler: async (ctx, args): Promise<{
    success: boolean;
    message: string;
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
      
      // Send magic link via Better Auth API
      await ctx.scheduler.runAfter(0, api.betaSignup.sendMagicLinkForApproval, {
        email: signup.email,
        name: signup.name,
      });
      
      return {
        success: true,
        message: "Magic link sent successfully. Check your email for the access link.",
      };
    } catch (error) {
      console.error("Error resending platform access email:", error);
      return {
        success: false,
        message: `Failed to resend email: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
});
