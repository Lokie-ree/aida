/**
 * ✅ ACTIVE - Used in production
 * Functions: signupForBeta, getBetaSignupByEmail, approveBetaSignup, getPendingSignups
 *
 * ADMIN GUIDE: How to approve beta signups in Convex Dashboard
 * =============================================================
 * Option 1 (RECOMMENDED): Use the adminApproveBetaSignup action
 *   1. Go to Functions tab in Convex dashboard
 *   2. Search for "betaSignup:adminApproveBetaSignup"
 *   3. Enter: { "email": "user@example.com" }
 *   4. Click "Run" - this will approve AND send notification email
 *
 * Option 2: Use the updateSignupStatus mutation
 *   1. Find the signup in Data tab -> betaSignups table
 *   2. Copy the _id
 *   3. Go to Functions -> betaSignup:updateSignupStatus
 *   4. Enter: { "signupId": "<paste_id_here>", "status": "approved" }
 *   5. Click "Run" - this will approve AND send notification email
 *
 * ⚠️ DO NOT manually patch the status field in the Data tab!
 *    This will NOT send the notification email to the user.
 *
 * FLOW: User receives notification email -> Clicks link to sign-in page ->
 *       Enters email -> Receives magic link -> Clicks to complete sign-in
 */
import { mutation, action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

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
    gradeLevel: v.optional(v.string()),
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
    // Store trimmed email to ensure consistency with queries
    const signupId = await ctx.db.insert("betaSignups", {
      email: args.email.trim(),
      name: args.name || "",
      school: args.school,
      subject: args.subject,
      gradeLevel: args.gradeLevel,
      status: "pending", // Require manual approval for Phase 1 MVP
      signupDate: Date.now(),
    });

    // Email sending removed during cleanup - welcome email functionality disabled
    // TODO: Implement email service if welcome emails are needed
    console.log(`[Beta Signup] New signup: ${args.email} (${args.name || 'No name'})`);

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


    // If status is being changed to "approved", send notification email
    if (args.status === "approved" && previousStatus !== "approved") {
      console.log(`[updateSignupStatus] Status changed to approved, sending notification for: ${existingDoc.email}`);
      await ctx.scheduler.runAfter(100, api.email.sendApprovalNotificationEmail, {
        email: existingDoc.email,
        name: existingDoc.name,
      });
    }
    
    return null;
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

    console.log(`[approveBetaSignup] Status updated to approved for: ${signup.email}`);

    // Send approval notification email (user will request magic link from frontend)
    await ctx.scheduler.runAfter(100, api.email.sendApprovalNotificationEmail, {
      email: signup.email,
      name: signup.name,
    });

    return {
      success: true,
      message: "Beta signup approved. User will receive a notification email to sign in."
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
    gradeLevel: v.optional(v.string()),
    signupDate: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
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
      gradeLevel: v.optional(v.string()),
      status: v.string(),
      signupDate: v.number(),
      notes: v.optional(v.string()),
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
      gradeLevel: v.optional(v.string()),
      status: v.string(),
      signupDate: v.number(),
      notes: v.optional(v.string()),
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
    gradeLevel: v.optional(v.string()),
    status: v.string(),
    signupDate: v.number(),
    notes: v.optional(v.string()),
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
  }),
  handler: async (ctx, args) => {
    try {
      // Check if user already exists (prevent duplicate recovery)
      // Use trimmed email for consistency
      const trimmedEmail = args.email.trim();
      const existingSignup = await ctx.db
        .query("betaSignups")
        .withIndex("by_email", (q) => q.eq("email", trimmedEmail))
        .unique();

      if (existingSignup) {
        return {
          success: false,
          message: "User already exists in betaSignups table",
          betaSignupId: undefined,
        };
      }

      // Create beta signup record
      // Store trimmed email to ensure consistency with queries
      const signupDate = args.originalSignupDate || Date.now();
      const betaSignupId = await ctx.db.insert("betaSignups", {
        email: trimmedEmail,
        name: args.name || args.email.split('@')[0],
        school: args.school || "",
        subject: args.subject || "",
        status: "approved", // User already has account
        signupDate: signupDate,
        notes: "Recovered from accidental deletion",
      });

      // Note: betaProgram table removed during cleanup - user profile should be created separately if needed

      return {
        success: true,
        message: "User data recovered successfully",
        betaSignupId,
      };
    } catch (error) {
      console.error("Error recovering user data:", error);
      return {
        success: false,
        message: `Failed to recover user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        betaSignupId: undefined,
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
      // Find beta signup by email (trim for consistency)
      const trimmedEmail = args.email.trim();
      const signup = await ctx.db
        .query("betaSignups")
        .withIndex("by_email", (q) => q.eq("email", trimmedEmail))
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
      
      // Send approval notification email (user will request magic link from frontend)
      await ctx.scheduler.runAfter(0, api.email.sendApprovalNotificationEmail, {
        email: signup.email,
        name: signup.name,
      });
      
      return {
        success: true,
        message: "Notification email sent. Check your email for instructions to sign in.",
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

/**
 * ADMIN ACTION: Approve beta signup by email address
 *
 * This is the easiest way for admins to approve beta signups from the Convex dashboard.
 * Just provide the email address and it will:
 * 1. Find the beta signup
 * 2. Update status to "approved"
 * 3. Send notification email (user will request magic link from sign-in page)
 *
 * Usage in Convex dashboard:
 * 1. Go to Functions tab
 * 2. Search for "betaSignup:adminApproveBetaSignup"
 * 3. Enter: { "email": "user@example.com" }
 * 4. Click "Run"
 *
 * @param {string} email - Email address of the user to approve
 * @returns {Object} Success status and message
 */
export const adminApproveBetaSignup = action({
  args: { email: v.string() },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; message: string }> => {
    try {
      // Find the beta signup by email
      const signup = await ctx.runQuery(api.betaSignup.getBetaSignupByEmail, {
        email: args.email,
      });

      if (!signup) {
        return {
          success: false,
          message: `No beta signup found for email: ${args.email}`,
        };
      }

      if (signup.status === "approved") {
        return {
          success: false,
          message: `User ${args.email} is already approved. Use resendPlatformAccessEmail to resend the notification if needed.`,
        };
      }

      // Update status to approved using the mutation (this will trigger notification email)
      await ctx.runMutation(api.betaSignup.updateSignupStatus, {
        signupId: signup._id,
        status: "approved",
        notes: "Approved by admin via adminApproveBetaSignup",
      });

      return {
        success: true,
        message: `Successfully approved ${args.email}. Notification email sent - user will sign in from the website.`,
      };
    } catch (error) {
      console.error("[adminApproveBetaSignup] Error:", error);
      return {
        success: false,
        message: `Failed to approve signup: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
