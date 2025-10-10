import { mutation, action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { resend } from "./email";

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

    // Generate a temporary password
    const generateSecurePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const temporaryPassword = generateSecurePassword();

    // Create new beta signup
    const signupId = await ctx.db.insert("betaSignups", {
      email: args.email,
      name: args.name || "",
      school: args.school || "",
      subject: args.subject || "",
      status: "approved", // Auto-approve for now
      signupDate: Date.now(),
      betaProgramId: "beta-v1",
    });

    // Create user account immediately
    await ctx.scheduler.runAfter(0, api.betaSignup.createUserAccountFromBetaSignup, {
      signupId,
      temporaryPassword,
    });

    // Schedule the welcome email to be sent with platform access
    await ctx.scheduler.runAfter(1000, api.betaSignup.sendPlatformAccessEmail, {
      email: args.email,
      name: args.name,
      temporaryPassword: temporaryPassword,
    });

    return {
      success: true,
      message: "Successfully signed up for the beta program! You'll receive an email with your platform access credentials within a few minutes.",
      signupId,
      temporaryPassword, // Return for immediate use
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
          <title>Welcome to Pelican AI Beta</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #0ea5e9, #f59e0b); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 28px;">Pelican AI</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Reclaim Your Time with Confidence</p>
            </div>
          </div>
          
          <h2 style="color: #1F2937; margin-bottom: 20px;">Welcome to the Beta Program!</h2>
          
          <p>Hi${args.name ? ` ${args.name}` : ''},</p>
          
          <p>Thank you for joining the Pelican AI beta program! We're excited to have you as part of our community of Louisiana educators who are reclaiming their time and teaching with confidence.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1F2937;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>You'll receive access to the platform within 24-48 hours</li>
              <li>Complete the 3-minute onboarding survey</li>
              <li>Start exploring our curated AI guidance frameworks</li>
              <li>Join our weekly community check-ins</li>
            </ul>
          </div>
          
          <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
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
            <p><strong>Pelican AI</strong> - Reclaim Your Time with Confidence<br>
            Built with Louisiana educators, for Louisiana educators<br>
            <a href="https://pelicanai.org" style="color: #0ea5e9; text-decoration: none;">pelicanai.org</a></p>
          </div>
        </body>
        </html>
      `;

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
    await ctx.scheduler.runAfter(0, api.betaSignup.sendPlatformAccessEmail, {
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
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Pelican AI Platform Access</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #f59e0b); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="margin: 0;">Pelican AI</h1>
          <p style="margin: 10px 0 0 0;">Your Platform Access is Ready!</p>
        </div>
        
        <h2>Welcome${args.name ? ` ${args.name}` : ''}!</h2>
        
        <p>Your beta program application has been approved! You now have access to the Pelican AI platform.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Login Credentials</h3>
          <p><strong>Email:</strong> ${args.email}</p>
          <p><strong>Temporary Password:</strong> ${args.temporaryPassword}</p>
          <p style="color: #DC2626; font-size: 14px;">Please change your password after your first login.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://pelicanai.org" style="background: #0ea5e9; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Access Platform
          </a>
        </div>
        
        <p>Once you log in, you'll complete a brief onboarding to personalize your experience.</p>
      </body>
      </html>
    `;

    const emailId = await resend.sendEmail(ctx, {
      from: "Pelican AI <beta@pelicanai.org>",
      to: args.email,
      subject: "Your Pelican AI Platform Access is Ready!",
      html: emailHtml,
    });

    return { success: true, emailId };
  },
});

export const getPendingSignups = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("betaSignups"),
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    signupDate: v.number(),
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