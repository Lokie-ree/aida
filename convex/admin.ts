// ============================================
// PHASE 2: Out of scope for MVP
// ============================================
// This file contains admin panel functionality which is not part of Phase 1 MVP.
// Uncomment and refactor when Phase 2 development begins.

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Check if user is admin
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

// Query: Check if current user is admin
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

// Query: Get all beta users for admin management
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

// Query: Get all testimonials for moderation
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

// Query: Get all innovations for moderation
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

// Query: Get admin dashboard stats
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

// Mutation: Update beta user status
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

// Mutation: Approve testimonial
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

// Mutation: Delete testimonial
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

// Mutation: Delete innovation
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

// Mutation: Send beta invite
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
