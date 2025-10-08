import { action } from "./_generated/server";
import { v } from "convex/values";
import { WelcomeEmail } from "../src/emails/WelcomeEmail";
import { VoiceSessionSummaryEmail } from "../src/emails/VoiceSessionSummaryEmail";
import { WeeklyPromptEmail } from "../src/emails/WeeklyPromptEmail";
import { BetaInviteEmail } from "../src/emails/BetaInviteEmail";
import { render } from "@react-email/render";
import { components } from "./_generated/api";
import { api } from "./_generated/api";
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
          name: args.userName,
          school: "your school",
        })
      );

      // Send the email using the Convex Resend component
      const emailId = await resend.sendEmail(ctx, {
        from: "Pelican AI <welcome@pelicanai.org>",
        to: args.userEmail,
        subject:
          "Welcome to Pelican AI - Reclaim Your Time with Confidence",
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
        from: "Pelican AI <sessions@pelicanai.org>",
        to: args.userEmail,
        subject: `Your Pelican AI Session Summary - ${args.interactionCount} interactions`,
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

export const sendBetaInviteEmail = action({
  args: {
    recipientEmail: v.string(),
    recipientName: v.string(),
    inviterName: v.string(),
    inviterSchool: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      const emailHtml = await render(
        BetaInviteEmail({
          recipientName: args.recipientName,
          inviterName: args.inviterName,
          inviterSchool: args.inviterSchool,
          betaProgramDetails: {
            startDate: "October 15, 2025",
            duration: "12 weeks",
            benefits: [
              "Access to 10+ AI guidance frameworks",
              "Weekly productivity prompts",
              "Community of Louisiana educators",
              "Office hours with our team",
              "Early access to new features"
            ]
          }
        })
      );

      const emailId = await resend.sendEmail(ctx, {
        from: "Pelican AI <invite@pelicanai.org>",
        to: args.recipientEmail,
        subject: `${args.inviterName} invited you to join Pelican AI Beta`,
        html: emailHtml,
      });

      console.log("Beta invite email sent successfully:", emailId);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending beta invite email:", error);
      throw new Error("Failed to send beta invite email");
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
