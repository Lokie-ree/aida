import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";
import { requireAdmin } from "./authorization";

// Query: Get testimonial by ID
export const getTestimonialById = query({
  args: { testimonialId: v.id("testimonials") },
  returns: v.union(
    v.object({
      _id: v.id("testimonials"),
      _creationTime: v.number(),
      quote: v.string(),
      userName: v.string(),
      school: v.string(),
      subject: v.string(),
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("featured")),
      featured: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const testimonial = await ctx.db.get(args.testimonialId);
    if (!testimonial) return null;

    return {
      _id: testimonial._id,
      _creationTime: testimonial._creationTime,
      quote: testimonial.quote,
      userName: testimonial.userName,
      school: testimonial.school,
      subject: testimonial.subject,
      status: testimonial.status,
      featured: testimonial.featured,
    };
  },
});

// Query: Get all testimonials (admin only)
export const getAllTestimonials = query({
  args: { status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("featured"))) },
  returns: v.array(v.object({
    _id: v.id("testimonials"),
    _creationTime: v.number(),
    quote: v.string(),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("featured")),
    featured: v.boolean(),
  })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let testimonials;

    if (args.status) {
      testimonials = await ctx.db
        .query("testimonials")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      testimonials = await ctx.db
        .query("testimonials")
        .withIndex("by_featured", (q) => q.eq("featured", true))
        .order("desc")
        .collect();
    }

    return testimonials.map((t) => ({
      _id: t._id,
      _creationTime: t._creationTime,
      quote: t.quote,
      userName: t.userName,
      school: t.school,
      subject: t.subject,
      status: t.status,
      featured: t.featured,
    }));
  },
});

// Mutation: Approve testimonial (admin only)
export const approveTestimonial = mutation({
  args: {
    testimonialId: v.id("testimonials"),
    featured: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { user } = await requireAdmin(ctx);
    const userId = user._id;

    await ctx.db.patch(args.testimonialId, {
      status: "approved",
      featured: args.featured,
      approvedBy: userId,
      approvedAt: Date.now(),
    });

    return null;
  },
});

// Query: Get featured testimonials
export const getFeaturedTestimonials = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("testimonials"),
    _creationTime: v.number(),
    quote: v.string(),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("featured")),
    featured: v.boolean(),
  })),
  handler: async (ctx, args) => {
    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .collect();

    // Filter to only approved featured testimonials
    const filtered = testimonials
      .filter((t) => t.status === "approved" && t.featured)
      .map((t) => ({
        _id: t._id,
        _creationTime: t._creationTime,
        quote: t.quote,
        userName: t.userName,
        school: t.school,
        subject: t.subject,
        status: t.status,
        featured: t.featured,
      }));

    // Apply limit if provided
    if (args.limit) {
      return filtered.slice(0, args.limit);
    }
    return filtered;
  },
});

// Mutation: Submit testimonial
export const submitTestimonial = mutation({
  args: {
    frameworkId: v.optional(v.id("frameworks")),
    quote: v.string(),
    timeSaved: v.optional(v.number()),
    impact: v.string(),
  },
  returns: v.id("testimonials"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Get user profile for name and school
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const testimonialId = await ctx.db.insert("testimonials", {
      userId,
      quote: args.quote,
      userName: (user as any).name || profile?.school || "Anonymous",
      school: profile?.school || "Not specified",
      subject: profile?.subject || "Not specified",
      impact: args.impact,
      status: "pending",
      featured: false,
      frameworkId: args.frameworkId,
      timeSaved: args.timeSaved,
    });

    return testimonialId;
  },
});

// Query: Get all testimonials for cleanup (test helper)
export const getAllTestimonialsForCleanup = query({
  args: {},
  returns: v.array(v.id("testimonials")),
  handler: async (ctx) => {
    const testimonials = await ctx.db
      .query("testimonials")
      .collect();
    
    return testimonials.map((t) => t._id);
  },
});

// Mutation: Delete testimonial (for test cleanup)
export const deleteTestimonial = mutation({
  args: { testimonialId: v.id("testimonials") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.testimonialId);
    return true;
  },
});

