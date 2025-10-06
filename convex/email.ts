import { action } from "./_generated/server";
import { v } from "convex/values";
import { WelcomeEmail } from "../src/emails/WelcomeEmail";
import { VoiceSessionSummaryEmail } from "../src/emails/VoiceSessionSummaryEmail";
import { render } from "@react-email/render";
import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";

// Initialize Resend component
// testMode: true = only send to @resend.dev test addresses (for development)
// testMode: false = send to real addresses (requires verified domain in Resend)
export const resend: Resend = new Resend(components.resend, {
  testMode: false, // Set to false once you have a verified domain in Resend
});

export const sendWelcomeEmail = action({
  args: {
    userEmail: v.string(),
    userName: v.string(),
    districtName: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // Render the React email component to HTML
      const emailHtml = await render(
        WelcomeEmail({
          userName: args.userName,
          districtName: args.districtName || "your district",
        })
      );

      // Send the email using the Convex Resend component
      const emailId = await resend.sendEmail(ctx, {
        from: "EdCoachAI <welcome@edcoachai.org>",
        to: args.userEmail,
        subject:
          "Welcome to EdCoachAI - AI for Louisiana Educators",
        html: emailHtml,
      });

      console.log("Welcome email sent successfully:", emailId);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }
  },
});

export const sendVoiceInteractionSummary = action({
  args: {
    userEmail: v.string(),
    userName: v.string(),
    interactionCount: v.number(),
    topicsDiscussed: v.array(v.string()),
    spaceName: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // Render the React email component to HTML
      const emailHtml = await render(
        VoiceSessionSummaryEmail({
          userName: args.userName,
          interactionCount: args.interactionCount,
          topicsDiscussed: args.topicsDiscussed,
          spaceName: args.spaceName,
        })
      );

      const emailId = await resend.sendEmail(ctx, {
        from: "EdCoachAI <sessions@edcoachai.org>",
        to: args.userEmail,
        subject: `Your EdCoachAI Session Summary - ${args.interactionCount} interactions`,
        html: emailHtml,
      });

      console.log("Voice session summary sent successfully:", emailId);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending voice session summary:", error);
      throw new Error("Failed to send session summary");
    }
  },
});
