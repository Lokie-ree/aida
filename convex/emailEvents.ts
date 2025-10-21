import { internalMutation } from "./_generated/server";
import { vOnEmailEventArgs } from "@convex-dev/resend";

/**
 * Internal mutation: Handle email delivery status webhooks.
 * 
 * Processes webhook events from Resend for email delivery tracking.
 * Logs delivery status for monitoring and debugging purposes.
 * 
 * **Internal Use:** Called automatically by Resend webhook system.
 * 
 * @param args - Email event data from Resend webhook
 * 
 * @see Resend webhook documentation for event structure
 * @see email.ts for email sending functions
 */
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

