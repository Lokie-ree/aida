import { internalMutation } from "./_generated/server";
import { vOnEmailEventArgs } from "@convex-dev/resend";

// Email event handler for webhook delivery status tracking
// This is an internal mutation (not an action) so it can't be in email.ts which has "use node"
export const handleEmailEvent = internalMutation({
  args: vOnEmailEventArgs,
  handler: async (ctx, args) => {
    // Log email delivery events for monitoring
    console.log(`Email ${args.id} event: ${args.event.type}`, {
      status: args.event.type,
      timestamp: args.event.created_at,
      email: args.event.data.to,
    });
    
    // Future: Store email delivery status in database for analytics
    // For now, just log for debugging and monitoring
  },
});

