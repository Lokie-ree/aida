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

// Initialize Resend component
// testMode: true = only send to @resend.dev test addresses (for development)
// testMode: false = send to real addresses (requires verified domain in Resend)
export const resend: Resend = new Resend(components.resend, {
  testMode: false, // Set to false once you have a verified domain in Resend
  onEmailEvent: internal.emailEvents.handleEmailEvent,
});


/**
 * Action to send welcome email to new beta tester.
 * 
 * Sends a welcome email with temporary password and next steps for beta testers
 * who have successfully signed up.
 * 
 * **Phase 1 MVP:** Scheduled automatically after beta signup.
 * 
 * @param {string} args.email - Recipient email address
 * @param {string} [args.name] - Recipient name (defaults to "Educator")
 * @param {string} [args.school] - School name (included in email)
 * @param {string} [args.temporaryPassword] - Generated temporary password
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
 *   school: "Lincoln High",
 *   temporaryPassword: "Temp123!"
 * });
 */
export const sendBetaWelcomeEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    temporaryPassword: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // Render the React email component to HTML
      const emailHtml = await render(
        BetaWelcomeEmail({
          name: args.name || "Educator",
          school: args.school,
          temporaryPassword: args.temporaryPassword,
        })
      );

      // Send the email using the Convex Resend component
      const emailId = await resend.sendEmail(ctx, {
        from: "Pelican AI <beta@pelicanai.org>",
        to: args.email,
        subject: "Welcome to Pelican AI Beta Program - Reclaim Your Time!",
        html: emailHtml,
      });

      console.log("Beta welcome email sent successfully:", emailId);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending beta welcome email:", error);
      throw new Error("Failed to send beta welcome email");
    }
  },
});

export const sendPlatformAccessEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    temporaryPassword: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // Render the React email component to HTML
      const emailHtml = await render(
        PlatformAccessEmail({
          email: args.email,
          name: args.name || "Educator",
          temporaryPassword: args.temporaryPassword,
        })
      );

      // Send the email using the Convex Resend component
      const emailId = await resend.sendEmail(ctx, {
        from: "Pelican AI <beta@pelicanai.org>",
        to: args.email,
        subject: "Your Pelican AI Platform Access is Ready!",
        html: emailHtml,
      });

      console.log("Platform access email sent successfully:", emailId);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending platform access email:", error);
      throw new Error("Failed to send platform access email");
    }
  },
});


/**
 * Action to send weekly AI prompt email to a user.
 * 
 * Sends a curated AI prompt with time estimate, difficulty level, and ethical guardrails.
 * Used for weekly engagement and value delivery to beta testers.
 * 
 * **Phase 1 MVP:** Scheduled via cron job every Monday 6am CT.
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
        from: "Pelican AI <weekly@pelicanai.org>",
        to: args.userEmail,
        subject: `This Week's Productivity Prompt: ${args.frameworkTitle}`,
        html: emailHtml,
      });

      console.log("Weekly prompt email sent successfully:", emailId);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending weekly prompt email:", error);
      throw new Error("Failed to send weekly prompt email");
    }
  },
});


// Cron job for weekly email delivery
export const sendWeeklyEmailsToAllUsers = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    emailsSent: v.number(),
  }),
  handler: async (ctx, args) => {
    try {
      // Get all active beta users
      const betaUsers = await ctx.runQuery(api.betaProgram.getAllBetaUsers, {});
      
      // Get this week's featured framework (get full details)
      const frameworks = await ctx.runQuery(api.frameworks.getAllFrameworks, { 
        status: "published" 
      });
      
      if (frameworks.length === 0) {
        console.log("No frameworks available for weekly email");
        return { success: false, emailsSent: 0 };
      }
      
      // Select a random framework for this week and get full details
      const randomFramework = frameworks[Math.floor(Math.random() * frameworks.length)];
      const featuredFramework = await ctx.runQuery(api.frameworks.getFrameworkById, {
        frameworkId: randomFramework.frameworkId
      });
      
      if (!featuredFramework) {
        console.log("Could not get framework details");
        return { success: false, emailsSent: 0 };
      }
      
      let emailsSent = 0;
      
      for (const user of betaUsers) {
        try {
          await ctx.runAction(api.email.sendWeeklyPromptEmail, {
            userEmail: user.email,
            userName: user.name || "Educator",
            frameworkTitle: featuredFramework.title,
            frameworkId: featuredFramework.frameworkId,
            samplePrompt: featuredFramework.samplePrompt,
            timeEstimate: featuredFramework.timeEstimate,
            difficultyLevel: featuredFramework.difficultyLevel,
            weekNumber: Math.ceil((Date.now() - new Date("2025-10-15").getTime()) / (7 * 24 * 60 * 60 * 1000)),
          });
          emailsSent++;
        } catch (error) {
          console.error(`Failed to send weekly email to ${user.email}:`, error);
        }
      }
      
      console.log(`Weekly emails sent successfully: ${emailsSent}/${betaUsers.length}`);
      return { success: true, emailsSent };
    } catch (error) {
      console.error("Error sending weekly emails:", error);
      throw new Error("Failed to send weekly emails");
    }
  },
});
