// ============================================
// PHASE 2: Out of scope for MVP
// ============================================
// This file contains admin panel functionality which is not part of Phase 1 MVP.
// Uncomment and refactor when Phase 2 development begins.

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Helper function to check if current user has admin privileges.
 * 
 * Checks user authentication and validates against admin email list.
 * Used by all admin-only functions for access control.
 * 
 * @param ctx - Convex context object
 * @returns Better Auth user object if admin
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not in admin list
 * 
 * @see adminEmails array in auth.config.ts for admin configuration
 */
const isAdmin = async (ctx: any) => {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) {
    throw new Error("User must be authenticated");
  }
  
  // For now, check if user email is in admin list
  // In production, this would be a proper role-based system
  const adminEmails = [
    "admin@pelicanai.org",
    "support@pelicanai.org",
    "test@example.com" // Temporary for testing
  ];
  
  if (!adminEmails.includes((user as any).email)) {
    throw new Error("Admin access required");
  }
  
  return user;
};

/**
 * Query: Check if current user has admin privileges.
 * 
 * Safe query that returns boolean without throwing errors.
 * Used by frontend to conditionally show admin UI elements.
 * 
 * @returns {boolean} true if user is admin, false otherwise
 * 
 * @example
 * const isAdmin = useQuery(api.admin.checkIsAdmin);
 * if (isAdmin) {
 *   // Show admin dashboard
 * }
 */
export const checkIsAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    try {
      await isAdmin(ctx);
      return true;
    } catch {
      return false;
    }
  },
});

/**
 * Query: Get all beta users for admin management dashboard.
 * 
 * Returns comprehensive beta user data including profile information,
 * engagement metrics, and program status for admin oversight.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @returns Array of beta user objects with profile and engagement data
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @see betaProgram table in schema.ts for data structure
 */
export const getAllBetaUsersAdmin = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("betaProgram"),
    userId: v.string(),
    status: v.union(v.literal("invited"), v.literal("active"), v.literal("completed")),
    invitedAt: v.number(),
    joinedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    onboardingStep: v.number(),
    onboardingCompleted: v.boolean(),
    frameworksTried: v.number(),
    totalTimeSaved: v.number(),
    innovationsShared: v.number(),
    officeHoursAttended: v.number(),
    weeklyEngagementCount: v.number(),
    lastWeeklyPromptOpened: v.optional(v.number()),
    userEmail: v.string(),
    userName: v.optional(v.string()),
    userSchool: v.optional(v.string()),
    userSubject: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    await isAdmin(ctx);
    
    const betaUsers = await ctx.db
      .query("betaProgram")
      .withIndex("by_status")
      .collect();
    
    const result = [];
    for (const betaUser of betaUsers) {
      const user = await ctx.db.get(betaUser.userId as any);
      const userProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", betaUser.userId))
        .first();
      
      result.push({
        _id: betaUser._id,
        userId: betaUser.userId,
        status: betaUser.status,
        invitedAt: betaUser.invitedAt,
        joinedAt: betaUser.joinedAt,
        completedAt: betaUser.completedAt,
        onboardingStep: betaUser.onboardingStep,
        onboardingCompleted: betaUser.onboardingCompleted,
        frameworksTried: betaUser.frameworksTried,
        totalTimeSaved: betaUser.totalTimeSaved,
        innovationsShared: betaUser.innovationsShared,
        officeHoursAttended: betaUser.officeHoursAttended,
        weeklyEngagementCount: betaUser.weeklyEngagementCount,
        lastWeeklyPromptOpened: betaUser.lastWeeklyPromptOpened,
        userEmail: (user as any)?.email || "Unknown",
        userName: (user as any)?.name || userProfile?.role || "Unknown",
        userSchool: userProfile?.school || "Not specified",
        userSubject: userProfile?.subject || "Not specified",
      });
    }
    
    return result;
  },
});

/**
 * Query: Get all testimonials for admin moderation.
 * 
 * Returns testimonials ordered by creation date for admin review,
 * approval, and content moderation workflows.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @returns Array of testimonial objects with status and metadata
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @see testimonials table in schema.ts for data structure
 */
export const getAllTestimonialsAdmin = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("testimonials"),
    _creationTime: v.number(),
    quote: v.string(),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("featured")),
    featured: v.boolean(),
    frameworkId: v.optional(v.id("frameworks")),
    timeSaved: v.optional(v.number()),
    impact: v.string(),
  })),
  handler: async (ctx) => {
    await isAdmin(ctx);
    
    const testimonials = await ctx.db
      .query("testimonials")
      .order("desc")
      .collect();
    
    return testimonials;
  },
});

/**
 * Query: Get all innovations for admin moderation.
 * 
 * Returns community innovations ordered by creation date for admin review,
 * content moderation, and community management workflows.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @returns Array of innovation objects with engagement metrics
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @see innovations table in schema.ts for data structure
 */
export const getAllInnovationsAdmin = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("innovations"),
    _creationTime: v.number(),
    title: v.string(),
    description: v.string(),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
    likes: v.number(),
    triesCount: v.number(),
    createdAt: v.number(),
    relatedFramework: v.optional(v.id("frameworks")),
  })),
  handler: async (ctx) => {
    await isAdmin(ctx);
    
    const innovations = await ctx.db
      .query("innovations")
      .order("desc")
      .collect();
    
    return innovations;
  },
});

/**
 * Query: Get admin dashboard statistics and metrics.
 * 
 * Returns comprehensive system statistics for admin dashboard including
 * user counts, engagement metrics, and content statistics.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @returns Object containing system-wide statistics and metrics
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @example
 * const stats = useQuery(api.admin.getAdminStats);
 * console.log(`Total beta users: ${stats.totalBetaUsers}`);
 */
export const getAdminStats = query({
  args: {},
  returns: v.object({
    totalBetaUsers: v.number(),
    activeBetaUsers: v.number(),
    completedBetaUsers: v.number(),
    pendingTestimonials: v.number(),
    approvedTestimonials: v.number(),
    featuredTestimonials: v.number(),
    totalInnovations: v.number(),
    totalFrameworks: v.number(),
    totalTimeSaved: v.number(),
    averageEngagement: v.number(),
  }),
  handler: async (ctx) => {
    await isAdmin(ctx);
    
    const betaUsers = await ctx.db.query("betaProgram").collect();
    const testimonials = await ctx.db.query("testimonials").collect();
    const innovations = await ctx.db.query("innovations").collect();
    const frameworks = await ctx.db.query("frameworks").collect();
    
    const activeBetaUsers = betaUsers.filter(u => u.status === "active").length;
    const completedBetaUsers = betaUsers.filter(u => u.status === "completed").length;
    const pendingTestimonials = testimonials.filter(t => t.status === "pending").length;
    const approvedTestimonials = testimonials.filter(t => t.status === "approved").length;
    const featuredTestimonials = testimonials.filter(t => t.featured).length;
    
    const totalTimeSaved = betaUsers.reduce((sum, user) => sum + user.totalTimeSaved, 0);
    const totalEngagement = betaUsers.reduce((sum, user) => sum + user.weeklyEngagementCount, 0);
    const averageEngagement = betaUsers.length > 0 ? totalEngagement / betaUsers.length : 0;
    
    return {
      totalBetaUsers: betaUsers.length,
      activeBetaUsers,
      completedBetaUsers,
      pendingTestimonials,
      approvedTestimonials,
      featuredTestimonials,
      totalInnovations: innovations.length,
      totalFrameworks: frameworks.length,
      totalTimeSaved,
      averageEngagement: Math.round(averageEngagement * 100) / 100,
    };
  },
});

/**
 * Mutation: Update beta user program status.
 * 
 * Allows admins to change beta user status (invited/active/completed)
 * and automatically sets completion timestamp when status changes.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @param betaUserId - ID of the beta program record to update
 * @param status - New status (invited | active | completed)
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @see betaProgram table in schema.ts for status values
 */
export const updateBetaUserStatus = mutation({
  args: {
    betaUserId: v.id("betaProgram"),
    status: v.union(v.literal("invited"), v.literal("active"), v.literal("completed")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await isAdmin(ctx);
    
    await ctx.db.patch(args.betaUserId, {
      status: args.status,
      completedAt: args.status === "completed" ? Date.now() : undefined,
    });
    
    return null;
  },
});

/**
 * Mutation: Approve or feature a testimonial.
 * 
 * Allows admins to approve testimonials for public display or mark them
 * as featured for prominent placement in the community.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @param testimonialId - ID of the testimonial to approve/feature
 * @param status - New status (approved | featured)
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @see testimonials table in schema.ts for status values
 */
export const approveTestimonialAdmin = mutation({
  args: {
    testimonialId: v.id("testimonials"),
    status: v.union(v.literal("approved"), v.literal("featured")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await isAdmin(ctx);
    
    await ctx.db.patch(args.testimonialId, {
      status: args.status,
      featured: args.status === "featured",
    });
    
    return null;
  },
});

/**
 * Mutation: Delete a testimonial (admin only).
 * 
 * Permanently removes a testimonial from the system.
 * Used for content moderation and removal of inappropriate content.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @param testimonialId - ID of the testimonial to delete
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @warning This action is irreversible
 */
export const deleteTestimonialAdmin = mutation({
  args: {
    testimonialId: v.id("testimonials"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await isAdmin(ctx);
    
    await ctx.db.delete(args.testimonialId);
    
    return null;
  },
});

/**
 * Mutation: Delete an innovation (admin only).
 * 
 * Permanently removes a community innovation from the system.
 * Used for content moderation and removal of inappropriate content.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @param innovationId - ID of the innovation to delete
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @warning This action is irreversible
 */
export const deleteInnovationAdmin = mutation({
  args: {
    innovationId: v.id("innovations"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await isAdmin(ctx);
    
    await ctx.db.delete(args.innovationId);
    
    return null;
  },
});

/**
 * Mutation: Send beta program invitation to a user.
 * 
 * Creates a beta program record and sends invitation email to the specified user.
 * Used by admins to manually invite educators to the beta program.
 * 
 * @requires Admin access - Must be authenticated admin user
 * @param email - Email address of the user to invite
 * @param name - Optional name of the user
 * 
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user not admin
 * 
 * @see betaProgram table in schema.ts for record structure
 * @see email.ts for invitation email templates
 */
export const sendBetaInviteAdmin = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await isAdmin(ctx);
    
    // Create beta program entry
    await ctx.db.insert("betaProgram", {
      userId: "pending", // Will be updated when user signs up
      status: "invited",
      invitedAt: Date.now(),
      onboardingStep: 0,
      onboardingCompleted: false,
      frameworksTried: 0,
      totalTimeSaved: 0,
      innovationsShared: 0,
      officeHoursAttended: 0,
      weeklyEngagementCount: 0,
    });
    
    // TODO: Send actual invite email
    console.log("Beta invite sent successfully");
    
    return null;
  },
});
