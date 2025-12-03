/**
 * ✅ ACTIVE - Used in production
 * Functions: sendBetaWelcomeEmail, sendPlatformAccessEmail, sendMagicLinkEmail, sendApprovalNotificationEmail
 * 🚫 FEATURE-FLAGGED: sendWeeklyPromptEmail, sendWeeklyEmailsToAllUsers (disabled for grassroots launch, enable at 30-100 users)
 */
"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { WeeklyPromptEmail } from "../src/emails/WeeklyPromptEmail";
import { BetaWelcomeEmail } from "../src/emails/BetaWelcomeEmail";
import { PlatformAccessEmail } from "../src/emails/PlatformAccessEmail";
import { render } from "@react-email/render";
import { components, internal } from "./_generated/api";
import { api } from "./_generated/api";
import { Resend } from "@convex-dev/resend";

// Simple email configuration - just the essentials
export const SENDER_DOMAIN = "mail.pelicanai.org" as const;
export const FROM_ADDRESS = `Pelican AI <hello@${SENDER_DOMAIN}>`;
export const REPLY_TO = [`hello@${SENDER_DOMAIN}`] as string[];

// Initialize Resend component
// testMode: true = only send to @resend.dev test addresses (for development)
// testMode: false = send to real addresses (requires verified domain in Resend)
// Check Convex env var - defaults to true (test mode) for safety
// Set via: npx convex env set RESEND_TEST_MODE false
export const isTestMode = (process.env.RESEND_TEST_MODE ?? "true") !== "false";
export const resend: Resend = new Resend(components.resend, {
  testMode: isTestMode,
  onEmailEvent: internal.emailEvents.handleEmailEvent,
});


/**
 * Action: Send grassroots welcome email to one of the initial 5 educators.
 * 
 * Grassroots Launch Context: You're one of 5 educators building this together.
 * Your feedback literally shapes everything. This is a personal invitation, not
 * corporate automation.
 * 
 * @param {string} args.email - Recipient email address
 * @param {string} [args.name] - Recipient name (defaults to "Educator")
 * @param {string} [args.school] - School name (included in email)
 * 
 * @returns {Object} Result containing:
 *   - success: boolean indicating email sent status
 *   - emailId: Resend email ID for tracking
 * 
 * @throws {Error} If email sending fails
 * 
 * @example
 * await ctx.runAction(api.email.sendBetaWelcomeEmail, {
 *   email: "teacher@school.edu",
 *   name: "Jane Teacher",
 *   school: "Lincoln High"
 * });
 */
export const sendBetaWelcomeEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // In test mode, only allow @resend.dev addresses
      if (isTestMode && !args.email.endsWith("@resend.dev")) {
        console.warn(`Test mode: Skipping email to ${args.email} (not a @resend.dev test address)`);
        return { success: true, emailId: "test-mode-skipped" };
      }

      // Render the React email component to HTML
      const emailHtml = await render(
        BetaWelcomeEmail({
          name: args.name || "Educator",
          school: args.school,
        })
      );

      // Send the email using the Convex Resend component
      const emailId = await resend.sendEmail(ctx, {
        from: FROM_ADDRESS,
        to: args.email,
        subject: "Ready to dive in? - Pelican AI",
        html: emailHtml,
        replyTo: REPLY_TO,
      });

      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending beta welcome email:", error);
      // In test mode, don't throw - just log and continue
      if (isTestMode) {
        console.warn("Test mode: Email sending failed, but continuing execution");
        return { success: false, emailId: "test-mode-error" };
      }
      throw new Error("Failed to send beta welcome email");
    }
  },
});

/**
 * Action: Send platform access email to one of the initial 5 educators.
 * 
 * Grassroots Launch: Personal access email for building together. No corporate
 * jargon - just straightforward access information with a personal touch.
 * 
 * @param email - Recipient email address
 * @param name - Optional recipient name (defaults to "Educator")
 * @param magicLinkUrl - Magic link URL for platform access
 * 
 * @returns Object containing success status and Resend email ID
 * 
 * @throws {Error} If email sending fails
 * 
 * @see PlatformAccessEmail component for email template
 */
export const sendPlatformAccessEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    magicLinkUrl: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // In test mode, only allow @resend.dev addresses
      if (isTestMode && !args.email.endsWith("@resend.dev")) {
        console.warn(`Test mode: Skipping email to ${args.email} (not a @resend.dev test address)`);
        return { success: true, emailId: "test-mode-skipped" };
      }

      // Render the React email component to HTML
      const emailHtml = await render(
        PlatformAccessEmail({
          email: args.email,
          name: args.name || "Educator",
          magicLinkUrl: args.magicLinkUrl,
        })
      );

      // Send the email using the Convex Resend component
      const emailId = await resend.sendEmail(ctx, {
        from: FROM_ADDRESS,
        to: args.email,
        subject: "You're in - Let's get started",
        html: emailHtml,
        replyTo: REPLY_TO,
      });

      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending platform access email:", error);
      // In test mode, don't throw - just log and continue
      if (isTestMode) {
        console.warn("Test mode: Email sending failed, but continuing execution");
        return { success: false, emailId: "test-mode-error" };
      }
      throw new Error("Failed to send platform access email");
    }
  },
});


/**
 * Action: Send weekly AI prompt email to a user.
 * 
 * 🚫 FEATURE-FLAGGED: Disabled for grassroots launch (5 users). Enable when scaling to 30-100 users.
 * 
 * **Grassroots Launch Note:** For 5 users, use personal check-ins instead of automation.
 * This feature is ready for when you scale to 30-100 users. Enable via env var:
 * `npx convex env set WEEKLY_EMAILS_ENABLED true`
 * 
 * Sends a curated AI prompt with time estimate, difficulty level, and ethical guardrails.
 * Used for weekly engagement and value delivery to beta testers.
 * 
 * **Scaling Feature:** Scheduled via cron job every Monday 6am CT when enabled.
 * 
 * @param {string} args.userEmail - Recipient email address
 * @param {string} args.userName - Recipient name for personalization
 * @param {string} args.frameworkTitle - Title of the AI framework/prompt
 * @param {string} args.frameworkId - Framework ID for tracking
 * @param {string} args.samplePrompt - The actual prompt text
 * @param {number} args.timeEstimate - Estimated time savings in minutes
 * @param {string} args.difficultyLevel - Difficulty level (beginner/intermediate/advanced)
 * @param {number} args.weekNumber - Week number since beta launch
 * 
 * @returns {Object} Result containing:
 *   - success: boolean indicating email sent status
 *   - emailId: Resend email ID for tracking
 * 
 * @throws {Error} If email sending fails
 * 
 * @example
 * await ctx.runAction(api.email.sendWeeklyPromptEmail, {
 *   userEmail: "teacher@school.edu",
 *   userName: "Jane",
 *   frameworkTitle: "Lesson Objective Unpacker",
 *   frameworkId: "AIB-001",
 *   samplePrompt: "Break down this objective...",
 *   timeEstimate: 15,
 *   difficultyLevel: "beginner",
 *   weekNumber: 3
 * });
 */
export const sendWeeklyPromptEmail = action({
  args: {
    userEmail: v.string(),
    userName: v.string(),
    frameworkTitle: v.string(),
    frameworkId: v.string(),
    samplePrompt: v.string(),
    timeEstimate: v.number(),
    difficultyLevel: v.string(),
    weekNumber: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      const emailHtml = await render(
        WeeklyPromptEmail({
          userName: args.userName,
          frameworkTitle: args.frameworkTitle,
          frameworkId: args.frameworkId,
          samplePrompt: args.samplePrompt,
          timeEstimate: args.timeEstimate,
          difficultyLevel: args.difficultyLevel,
          weekNumber: args.weekNumber,
        })
      );

      const emailId = await resend.sendEmail(ctx, {
        from: FROM_ADDRESS,
        to: args.userEmail,
        subject: `This Week's Productivity Prompt: ${args.frameworkTitle}`,
        html: emailHtml,
        replyTo: REPLY_TO,
      });

      console.log("Weekly prompt email sent successfully:", emailId);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending weekly prompt email:", error);
      throw new Error("Failed to send weekly prompt email");
    }
  },
});


/**
 * Action: Send weekly emails to all active beta users.
 * 
 * 🚫 FEATURE-FLAGGED: Disabled for grassroots launch (5 users). Enable when scaling to 30-100 users.
 * 
 * **Grassroots Launch:** DISABLED by default for 5 users (use personal check-ins).
 * Enable when scaling to 30-100 users via: `npx convex env set WEEKLY_EMAILS_ENABLED true`
 * 
 * Automated cron job that sends weekly AI prompt emails to all active
 * beta users. Selects a random published framework for the week.
 * 
 * **Scaling Feature:** Scheduled via cron job every Monday 6am CT when enabled.
 * **Default:** Disabled (WEEKLY_EMAILS_ENABLED=false)
 * 
 * @returns Object containing success status and number of emails sent
 * 
 * @throws {Error} If email sending fails
 * 
 * @see WeeklyPromptEmail component for email template
 * @see frameworks.ts for framework selection
 * @see crons.ts for cron job configuration
 */
export const sendWeeklyEmailsToAllUsers = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    emailsSent: v.number(),
  }),
  handler: async (ctx, args) => {
    // Feature flag: Disabled for December 2025 beta
    // Requires betaProgram and frameworks tables (removed in beta cleanup)
    // Re-enable post-beta when scaling to 30-100 users
    console.log("Weekly emails disabled - feature removed for December 2025 beta");
    return { success: true, emailsSent: 0 };

    // Code commented out - depends on deleted tables (betaProgram, frameworks)
    // See git history to restore when ready to scale
    // When re-enabling, add try-catch error handling around the email sending logic
  },
});

/**
 * Action: Send magic link email.
 * 
 * Sends a magic link email for authentication. Used by Better Auth magic link plugin.
 * 
 * @param email - Recipient email address
 * @param url - Magic link URL
 * 
 * @returns Object containing success status and email ID
 */
export const sendMagicLinkEmail = action({
  args: {
    email: v.string(),
    url: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // In test mode, only allow @resend.dev addresses
      if (isTestMode && !args.email.endsWith("@resend.dev")) {
        console.warn(`Test mode: Skipping magic link email to ${args.email} (not a @resend.dev test address)`);
        return { success: true, emailId: "test-mode-skipped" };
      }

      // Send magic link email using Resend
      const emailId = await resend.sendEmail(ctx, {
        from: FROM_ADDRESS,
        to: args.email,
        subject: "Your Pelican AI sign-in link (expires in 5 min)",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Pelican AI</h1>
            <p>Hey there! 👋</p>
            <p>Click the button below to sign in and start creating Louisiana-aligned prompts:</p>
            <p><a href="${args.url}" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Sign In</a></p>
            <p style="color: #6b7280; font-size: 14px;">This link will expire in 5 minutes.</p>
            <p style="color: #6b7280; font-size: 14px;">Questions? Just reply—I read every one.<br>– Pelican AI Team</p>
          </div>
        `,
        replyTo: REPLY_TO,
      });

      console.log("Magic link email sent successfully to:", args.email);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending magic link email:", error);
      // In test mode, don't throw - just log and continue
      if (isTestMode) {
        console.warn("Test mode: Magic link email sending failed, but continuing execution");
        return { success: false, emailId: "test-mode-error" };
      }
      throw new Error("Failed to send magic link email");
    }
  },
});

/**
 * Action: Send approval notification email.
 * 
 * Sent when admin approves a beta signup. Notifies user they're approved
 * and provides a link to the sign-in page where they can request a magic link.
 * 
 * This is a simpler approach than backend-initiated magic links, which don't
 * work reliably with Better Auth's cross-domain setup.
 * 
 * @param email - Recipient email address
 * @param name - Optional recipient name (defaults to "Educator")
 * 
 * @returns Object containing success status and email ID
 */
export const sendApprovalNotificationEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // In test mode, only allow @resend.dev addresses
      if (isTestMode && !args.email.endsWith("@resend.dev")) {
        console.warn(`Test mode: Skipping approval notification email to ${args.email} (not a @resend.dev test address)`);
        return { success: true, emailId: "test-mode-skipped" };
      }

      // Get the frontend URL for the sign-in link
      const siteUrl = process.env.SITE_URL || "http://localhost:5173";
      const displayName = args.name || "Educator";

      // Send approval notification email using Resend
      const emailId = await resend.sendEmail(ctx, {
        from: FROM_ADDRESS,
        to: args.email,
        subject: "You're in! Sign in to Pelican AI",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Pelican AI</h1>
            <p>Hey ${displayName}! 👋</p>
            <p>Great news - your beta access has been approved!</p>
            <p>You're one of a small group of Louisiana educators helping shape Pelican AI. Your feedback will directly influence how this tool supports teachers across the state.</p>
            <p>Ready to get started? Click below to sign in:</p>
            <p><a href="${siteUrl}" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Sign In to Pelican AI</a></p>
            <p style="color: #6b7280; font-size: 14px;">On the sign-in page, enter your email address and we'll send you a secure link to access your account.</p>
            <p style="color: #6b7280; font-size: 14px;">Questions? Just reply to this email—I read every one.<br>– Pelican AI Team</p>
          </div>
        `,
        replyTo: REPLY_TO,
      });

      console.log("Approval notification email sent successfully to:", args.email);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending approval notification email:", error);
      // In test mode, don't throw - just log and continue
      if (isTestMode) {
        console.warn("Test mode: Approval notification email sending failed, but continuing execution");
        return { success: false, emailId: "test-mode-error" };
      }
      throw new Error("Failed to send approval notification email");
    }
  },
});

