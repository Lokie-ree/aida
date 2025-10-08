import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

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

    // Create testimonial (pending approval)
    const testimonialId = await ctx.db.insert("testimonials", {
      userId,
      frameworkId: args.frameworkId,
      quote: args.quote.trim(),
      timeSaved: args.timeSaved,
      impact: args.impact.trim(),
      userName: user.name || "Anonymous",
      school: (user as any).school || "Not specified",
      subject: (user as any).subject || "Not specified",
      status: "pending",
      featured: false,
    });

    return testimonialId;
  },
});

// Query: Get featured testimonials
export const getFeaturedTestimonials = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object({
    _id: v.id("testimonials"),
    quote: v.string(),
    timeSaved: v.optional(v.number()),
    impact: v.string(),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    frameworkId: v.optional(v.id("frameworks")),
  })),
  handler: async (ctx, args) => {
    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .order("desc")
      .take(args.limit || 10);

    return testimonials.map((t) => ({
      _id: t._id,
      quote: t.quote,
      timeSaved: t.timeSaved,
      impact: t.impact,
      userName: t.userName,
      school: t.school,
      subject: t.subject,
      frameworkId: t.frameworkId,
    }));
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
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }

    // TODO: Add admin role check
    if ((user as any).role !== "admin") {
      throw new Error("Admin access required");
    }

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
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    // TODO: Add admin role check
    if ((user as any).role !== "admin") {
      throw new Error("Admin access required");
    }
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
