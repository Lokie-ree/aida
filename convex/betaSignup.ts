import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import { api } from "./_generated/api";

// Initialize Resend component
// testMode: true = only send to @resend.dev test addresses (for development)
// testMode: false = send to real addresses (requires verified domain in Resend)
const resend: Resend = new Resend(components.resend, {
  testMode: false, // Set to false once you have a verified domain in Resend
});

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
      };
    }

    // Create new beta signup
    const signupId = await ctx.db.insert("betaSignups", {
      email: args.email,
      name: args.name || "",
      school: args.school || "",
      subject: args.subject || "",
      status: "pending",
      signupDate: Date.now(),
      betaProgramId: "beta-v1", // Track which beta program version
    });

    // Schedule the welcome email to be sent
    await ctx.scheduler.runAfter(0, api.betaSignup.sendBetaWelcomeEmail, {
      email: args.email,
      name: args.name,
      school: args.school,
    });

    return {
      success: true,
      message: "Successfully signed up for the beta program! You'll receive an email with next steps within 24 hours.",
      signupId,
    };
  },
});

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
      // Note: testMode is currently enabled, so emails will only be sent to @resend.dev addresses
      // To send to real addresses, verify your domain in Resend and set testMode: false
      
      // Create a simple HTML email for beta signup
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to EdCoachAI Beta</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #3B82F6, #FBBF24); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 28px;">EdCoachAI</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">AI for Louisiana Educators</p>
            </div>
          </div>
          
          <h2 style="color: #1F2937; margin-bottom: 20px;">Welcome to the Beta Program!</h2>
          
          <p>Hi${args.name ? ` ${args.name}` : ''},</p>
          
          <p>Thank you for joining the EdCoachAI beta program! We're excited to have you as part of our community of Louisiana educators who are shaping the future of AI in education.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1F2937;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>You'll receive access to the platform within 24-48 hours</li>
              <li>Complete the 3-minute onboarding survey</li>
              <li>Start exploring our curated AI guidance frameworks</li>
              <li>Join our weekly community check-ins</li>
            </ul>
          </div>
          
          <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h3 style="margin-top: 0; color: #1F2937;">What You'll Get</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>10+ AI Guidance Frameworks</strong> - Copy-paste prompts for common tasks</li>
              <li><strong>Louisiana Standards Alignment</strong> - LER domains and state standards mapped</li>
              <li><strong>Time Savings Tracking</strong> - Measure your efficiency gains</li>
              <li><strong>Community Access</strong> - Share innovations with fellow educators</li>
            </ul>
          </div>
          
          <p>We'll be in touch soon with your platform access and next steps. In the meantime, feel free to reply to this email if you have any questions.</p>
          
          <p>Thank you for helping us build AI tools that truly serve Louisiana educators!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>EdCoachAI</strong> - AI for Louisiana Educators<br>
            Built with Louisiana educators, for Louisiana educators<br>
            <a href="https://edcoachai.org" style="color: #3B82F6; text-decoration: none;">edcoachai.org</a></p>
          </div>
        </body>
        </html>
      `;

      // Send the email using the Convex Resend component
      const emailId = await resend.sendEmail(ctx, {
        from: "EdCoachAI <beta@edcoachai.org>",
        to: args.email,
        subject: "Welcome to AI for Louisiana Educators Beta Program!",
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
