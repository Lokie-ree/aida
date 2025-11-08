import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * DEV HELPER: Quick approve and send magic link
 * 
 * This is a convenience function for testing the beta approval flow.
 * It approves a beta signup and immediately sends a magic link.
 * 
 * Usage in Convex dashboard:
 * 1. Go to Functions tab
 * 2. Select "devHelpers:quickApproveAndSendMagicLink"
 * 3. Enter: { "email": "test@resend.dev" }
 * 4. Run
 * 
 * This will:
 * - Find the beta signup by email
 * - Approve it
 * - Send the magic link
 * - Return the result
 */
export const quickApproveAndSendMagicLink = action({
  args: {
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    signupId: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; message: string; signupId?: string }> => {
    console.log(`[quickApproveAndSendMagicLink] Starting for email: ${args.email}`);
    
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
    
    console.log(`[quickApproveAndSendMagicLink] Found signup: ${signup._id}, status: ${signup.status}`);
    
    // If already approved, just send the magic link
    if (signup.status === "approved") {
      console.log(`[quickApproveAndSendMagicLink] Signup already approved, sending magic link`);
      const result: { success: boolean; message: string } = await ctx.runAction(api.betaSignup.sendMagicLinkForApproval, {
        email: args.email,
        name: signup.name,
      });
      return {
        ...result,
        signupId: signup._id,
      };
    }
    
    // Approve the signup
    console.log(`[quickApproveAndSendMagicLink] Approving signup`);
    const approveResult: { success: boolean; message: string } = await ctx.runMutation(api.betaSignup.approveBetaSignup, {
      signupId: signup._id as any,
    });
    
    if (!approveResult.success) {
      return {
        ...approveResult,
        signupId: signup._id,
      };
    }
    
    // Wait a moment for the scheduler to process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Send the magic link
    console.log(`[quickApproveAndSendMagicLink] Sending magic link`);
    const magicLinkResult: { success: boolean; message: string } = await ctx.runAction(api.betaSignup.sendMagicLinkForApproval, {
      email: args.email,
      name: signup.name,
    });
    
    return {
      success: magicLinkResult.success,
      message: magicLinkResult.success 
        ? `Approved and magic link sent to ${args.email}`
        : `Approved but failed to send magic link: ${magicLinkResult.message}`,
      signupId: signup._id,
    };
  },
});

/**
 * DEV HELPER: Complete test flow - signup, approve, send magic link
 * 
 * This runs the entire flow in one action for easy testing:
 * 1. Creates a beta signup (if it doesn't exist)
 * 2. Approves it
 * 3. Sends the magic link
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
    
    // Step 2: Approve if not already approved
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
      steps.push("Signup approved");
      // Wait for scheduler
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      steps.push("Signup already approved");
    }
    
    // Step 3: Send magic link
    steps.push("Sending magic link");
    const magicLinkResult = await ctx.runAction(api.betaSignup.sendMagicLinkForApproval, {
      email: args.email,
      name: signup.name || args.name,
    });
    
    if (!magicLinkResult.success) {
      return {
        success: false,
        message: `Flow completed but magic link failed: ${magicLinkResult.message}`,
        steps,
      };
    }
    
    steps.push("Magic link sent");
    
    return {
      success: true,
      message: `Complete test flow finished! Check email ${args.email} for magic link.`,
      steps,
    };
  },
});

