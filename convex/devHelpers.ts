/**
 * 🧪 DEV HELPERS - For development and testing only
 * Functions: quickApproveAndNotify, completeTestFlow
 */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * DEV HELPER: Quick approve and send notification
 * 
 * This is a convenience function for testing the beta approval flow.
 * It approves a beta signup and sends an approval notification email.
 * 
 * Usage in Convex dashboard:
 * 1. Go to Functions tab
 * 2. Select "devHelpers:quickApproveAndNotify"
 * 3. Enter: { "email": "test@resend.dev" }
 * 4. Run
 * 
 * This will:
 * - Find the beta signup by email
 * - Approve it
 * - Send the notification email
 * - Return the result
 * 
 * FLOW: User receives notification → Goes to sign-in page → Requests magic link
 */
export const quickApproveAndNotify = action({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    signupId: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; message: string; signupId?: string }> => {
    console.log(`[quickApproveAndNotify] Starting for email: ${args.email}`);
    
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
    
    console.log(`[quickApproveAndNotify] Found signup: ${signup._id}, status: ${signup.status}`);
    
    // If already approved, just resend the notification
    if (signup.status === "approved") {
      console.log(`[quickApproveAndNotify] Signup already approved, resending notification`);
      const result = await ctx.runAction(api.email.sendApprovalNotificationEmail, {
        email: args.email,
        name: signup.name,
      });
      return {
        success: result.success,
        message: result.success 
          ? `User already approved. Notification resent to ${args.email}`
          : `User already approved but notification failed`,
        signupId: signup._id,
      };
    }
    
    // Approve the signup (this triggers notification email automatically)
    console.log(`[quickApproveAndNotify] Approving signup`);
    const approveResult: { success: boolean; message: string } = await ctx.runMutation(api.betaSignup.approveBetaSignup, {
      signupId: signup._id as any,
    });
    
    return {
      success: approveResult.success,
      message: approveResult.success 
        ? `Approved and notification sent to ${args.email}. User should sign in from the website.`
        : approveResult.message,
      signupId: signup._id,
    };
  },
});

/**
 * DEV HELPER: Complete test flow - signup, approve, send notification
 * 
 * This runs the entire flow in one action for easy testing:
 * 1. Creates a beta signup (if it doesn't exist)
 * 2. Approves it
 * 3. Sends notification email (user will request magic link from sign-in page)
 * 
 * Usage in Convex dashboard:
 * 1. Go to Functions tab
 * 2. Select "devHelpers:completeTestFlow"
 * 3. Enter: { "email": "test@resend.dev", "name": "Test User" }
 * 4. Run
 */
export const completeTestFlow = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    steps: v.array(v.string()),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; message: string; steps: string[] }> => {
    const steps: string[] = [];
    console.log(`[completeTestFlow] Starting complete test flow for: ${args.email}`);
    
    // Step 1: Check if signup exists, create if not
    let signup: { _id: string; email: string; name?: string; status: string } | null = await ctx.runQuery(api.betaSignup.getBetaSignupByEmail, {
      email: args.email,
    });
    
    if (!signup) {
      steps.push("Creating beta signup");
      const signupResult = await ctx.runMutation(api.betaSignup.signupForBeta, {
        email: args.email,
        name: args.name,
      });
      if (!signupResult.success) {
        return {
          success: false,
          message: `Failed to create signup: ${signupResult.message}`,
          steps,
        };
      }
      steps.push("Beta signup created");
      // Re-fetch the signup
      signup = await ctx.runQuery(api.betaSignup.getBetaSignupByEmail, {
        email: args.email,
      });
    } else {
      steps.push("Beta signup already exists");
    }
    
    if (!signup) {
      return {
        success: false,
        message: "Failed to get signup after creation",
        steps,
      };
    }
    
    // Step 2: Approve if not already approved (this triggers notification email)
    if (signup.status !== "approved") {
      steps.push("Approving signup");
      const approveResult = await ctx.runMutation(api.betaSignup.approveBetaSignup, {
        signupId: signup._id as any,
      });
      if (!approveResult.success) {
        return {
          success: false,
          message: `Failed to approve: ${approveResult.message}`,
          steps,
        };
      }
      steps.push("Signup approved - notification email scheduled");
    } else {
      steps.push("Signup already approved");
      // Resend notification for already approved users
      steps.push("Resending notification email");
      await ctx.runAction(api.email.sendApprovalNotificationEmail, {
        email: args.email,
        name: signup.name || args.name,
      });
    }
    
    steps.push("User should check email and sign in from website");
    
    return {
      success: true,
      message: `Complete test flow finished! User ${args.email} should check email and sign in from the website.`,
      steps,
    };
  },
});
