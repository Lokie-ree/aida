import { mutation, action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const signupForBeta = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    signupId: v.optional(v.id("betaSignups")),
    temporaryPassword: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingSignup = await ctx.db
      .query("betaSignups")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

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

    // Send welcome email with temporary password
    await ctx.scheduler.runAfter(1000, api.email.sendBetaWelcomeEmail, {
      email: args.email,
      name: args.name,
      school: args.school,
      temporaryPassword,
    });

    return {
      success: true,
      message: "Successfully signed up for the beta program! Check your email for next steps.",
      signupId,
      temporaryPassword,
    };
  },
});

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
      console.log(`Creating Better Auth user internally for: ${signup.email}`);
      
      const result: any = await ctx.runMutation(api.auth.createUserDirectly, {
        email: signup.email,
        password: args.temporaryPassword,
        name: signup.name || signup.email.split('@')[0],
      });

      if (result.success) {
        console.log(`Successfully created user account for ${signup.email}`);
        
        // The onCreate trigger will automatically create userProfile and betaProgram
        // No need for manual creation anymore - the trigger handles everything
        console.log(`User created, trigger will handle profile creation for ${signup.email}`);
        
        // Update signup status to approved
        await ctx.runMutation(api.betaSignup.updateSignupStatus, {
          signupId: args.signupId,
          status: "approved",
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