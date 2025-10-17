// ============================================
// PHASE 2: Out of scope for MVP
// ============================================
// This file contains community innovation sharing functionality which is not part of Phase 1 MVP.
// Uncomment and refactor when Phase 2 development begins.

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

// Mutation: Share innovation
export const shareInnovation = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    relatedFramework: v.optional(v.id("frameworks")),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
  },
  returns: v.id("innovations"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Create innovation
    const innovationId = await ctx.db.insert("innovations", {
      userId,
      title: args.title.trim(),
      description: args.description.trim(),
      relatedFramework: args.relatedFramework,
      tags: args.tags,
      timeSaved: args.timeSaved,
      userName: user.name || "Anonymous",
      school: (user as any).school || "Not specified",
      subject: (user as any).subject || "Not specified",
      likes: 0,
      triesCount: 0,
      createdAt: Date.now(),
    });

    return innovationId;
  },
});

// Query: Get all innovations (for admin/testing)
export const getAllInnovations = query({
  args: { limit: v.optional(v.number()) },
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
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    const innovations = await ctx.db
      .query("innovations")
      .order("desc")
      .take(limit);

    return innovations.map(i => ({
      _id: i._id,
      _creationTime: i._creationTime,
      title: i.title,
      description: i.description,
      userName: i.userName,
      school: i.school,
      subject: i.subject,
      tags: i.tags,
      timeSaved: i.timeSaved,
      likes: i.likes,
      triesCount: i.triesCount,
      createdAt: i.createdAt,
    }));
  },
});

// Query: Search innovations
export const searchInnovations = query({
  args: { 
    query: v.string(),
    limit: v.optional(v.number()) 
  },
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
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    const innovations = await ctx.db
      .query("innovations")
      .withSearchIndex("search_innovations", (q) => q.search("title", args.query))
      .take(limit);

    return innovations.map(i => ({
      _id: i._id,
      _creationTime: i._creationTime,
      title: i.title,
      description: i.description,
      userName: i.userName,
      school: i.school,
      subject: i.subject,
      tags: i.tags,
      timeSaved: i.timeSaved,
      likes: i.likes,
      triesCount: i.triesCount,
      createdAt: i.createdAt,
    }));
  },
});

// Query: Get innovation by ID
export const getInnovationById = query({
  args: { innovationId: v.id("innovations") },
  returns: v.union(
    v.object({
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
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const innovation = await ctx.db.get(args.innovationId);
    if (!innovation) return null;

    return {
      _id: innovation._id,
      _creationTime: innovation._creationTime,
      title: innovation.title,
      description: innovation.description,
      userName: innovation.userName,
      school: innovation.school,
      subject: innovation.subject,
      tags: innovation.tags,
      timeSaved: innovation.timeSaved,
      likes: innovation.likes,
      triesCount: innovation.triesCount,
      createdAt: innovation.createdAt,
    };
  },
});

// Mutation: Comment on innovation
export const commentInnovation = mutation({
  args: { 
    innovationId: v.id("innovations"),
    comment: v.string()
  },
  returns: v.id("innovationInteractions"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    const interactionId = await ctx.db.insert("innovationInteractions", {
      innovationId: args.innovationId,
      userId,
      type: "comment",
      comment: args.comment.trim(),
      timestamp: Date.now(),
    });

    return interactionId;
  },
});

// Mutation: Submit innovation (alias for shareInnovation)
export const submitInnovation = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    relatedFramework: v.optional(v.id("frameworks")),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
  },
  returns: v.id("innovations"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Create innovation
    const innovationId = await ctx.db.insert("innovations", {
      userId,
      title: args.title.trim(),
      description: args.description.trim(),
      relatedFramework: args.relatedFramework,
      tags: args.tags,
      timeSaved: args.timeSaved,
      userName: user.name || "Anonymous",
      school: (user as any).school || "Not specified",
      subject: (user as any).subject || "Not specified",
      likes: 0,
      triesCount: 0,
      createdAt: Date.now(),
    });

    return innovationId;
  },
});

// Query: Get recent innovations
export const getRecentInnovations = query({
  args: { limit: v.optional(v.number()) },
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
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    const innovations = await ctx.db
      .query("innovations")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);

    return innovations.map(i => ({
      _id: i._id,
      _creationTime: i._creationTime,
      title: i.title,
      description: i.description,
      userName: i.userName,
      school: i.school,
      subject: i.subject,
      tags: i.tags,
      timeSaved: i.timeSaved,
      likes: i.likes,
      triesCount: i.triesCount,
      createdAt: i.createdAt,
    }));
  },
});

// Query: Get innovations by user
export const getUserInnovations = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object({
    _id: v.id("innovations"),
    _creationTime: v.number(),
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
    likes: v.number(),
    triesCount: v.number(),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }
    const userId = user._id;
    
    const limit = args.limit || 20;
    
    const innovations = await ctx.db
      .query("innovations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return innovations.map(i => ({
      _id: i._id,
      _creationTime: i._creationTime,
      title: i.title,
      description: i.description,
      tags: i.tags,
      timeSaved: i.timeSaved,
      likes: i.likes,
      triesCount: i.triesCount,
      createdAt: i.createdAt,
    }));
  },
});

// Mutation: Like innovation
export const likeInnovation = mutation({
  args: { innovationId: v.id("innovations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Check if already liked
    const existingLike = await ctx.db
      .query("innovationInteractions")
      .withIndex("by_innovation", (q) => q.eq("innovationId", args.innovationId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("type"), "like"))
      .first();

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      
      // Decrement likes count
      const innovation = await ctx.db.get(args.innovationId);
      if (innovation) {
        await ctx.db.patch(args.innovationId, {
          likes: Math.max(0, innovation.likes - 1),
        });
      }
    } else {
      // Like
      await ctx.db.insert("innovationInteractions", {
        innovationId: args.innovationId,
        userId,
        type: "like",
        timestamp: Date.now(),
      });
      
      // Increment likes count
      const innovation = await ctx.db.get(args.innovationId);
      if (innovation) {
        await ctx.db.patch(args.innovationId, {
          likes: innovation.likes + 1,
        });
      }
    }

    return null;
  },
});

// Mutation: Mark innovation as tried
export const markInnovationTried = mutation({
  args: {
    innovationId: v.id("innovations"),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;

    // Check if already tried
    const existingTried = await ctx.db
      .query("innovationInteractions")
      .withIndex("by_innovation", (q) => q.eq("innovationId", args.innovationId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("type"), "tried"))
      .first();

    if (existingTried) {
      // Update existing
      await ctx.db.patch(existingTried._id, {
        rating: args.rating,
        comment: args.comment,
        timestamp: Date.now(),
      });
    } else {
      // Create new
      await ctx.db.insert("innovationInteractions", {
        innovationId: args.innovationId,
        userId,
        type: "tried",
        rating: args.rating,
        comment: args.comment,
        timestamp: Date.now(),
      });
      
      // Increment tries count
      const innovation = await ctx.db.get(args.innovationId);
      if (innovation) {
        await ctx.db.patch(args.innovationId, {
          triesCount: innovation.triesCount + 1,
        });
      }
    }

    return null;
  },
});

// Query: Get innovation interactions
export const getInnovationInteractions = query({
  args: { innovationId: v.id("innovations") },
  returns: v.array(v.object({
    _id: v.id("innovationInteractions"),
    userId: v.string(),
    type: v.union(v.literal("like"), v.literal("tried"), v.literal("comment")),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
    timestamp: v.number(),
  })),
  handler: async (ctx, args) => {
    const interactions = await ctx.db
      .query("innovationInteractions")
      .withIndex("by_innovation", (q) => q.eq("innovationId", args.innovationId))
      .order("desc")
      .collect();

    return interactions.map(i => ({
      _id: i._id,
      userId: i.userId,
      type: i.type,
      rating: i.rating,
      comment: i.comment,
      timestamp: i.timestamp,
    }));
  },
});
