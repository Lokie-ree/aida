// ============================================
// PHASE 2: Out of scope for MVP
// ============================================
// This file contains community innovation sharing functionality which is not part of Phase 1 MVP.
// Uncomment and refactor when Phase 2 development begins.

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Mutation: Share a community innovation.
 * 
 * Allows authenticated users to share their AI innovations with the community.
 * Creates an innovation record with user information and engagement metrics.
 * 
 * @requires Authentication - Must be logged in
 * @param title - Innovation title
 * @param description - Detailed description of the innovation
 * @param relatedFramework - Optional framework ID this innovation relates to
 * @param tags - Array of tags for categorization
 * @param timeSaved - Optional minutes saved using this innovation
 * 
 * @returns ID of the created innovation record
 * 
 * @throws "User must be authenticated" if no session
 * 
 * @see innovations table in schema.ts for data structure
 */
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

/**
 * Query: Get all innovations with optional limit.
 * 
 * Returns all community innovations ordered by creation date.
 * Used by admin panels and community browsing interfaces.
 * 
 * @param limit - Optional limit on number of results (default: 20)
 * @returns Array of innovation objects with metadata
 * 
 * @see innovations table in schema.ts for data structure
 */
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

/**
 * Query: Search innovations by title and content.
 * 
 * Performs full-text search on innovation titles and descriptions.
 * Uses Convex search indexes for efficient text searching.
 * 
 * @param query - Search query string
 * @param limit - Optional limit on number of results (default: 20)
 * @returns Array of matching innovation objects
 * 
 * @see search_innovations index in schema.ts
 */
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

/**
 * Query: Get innovation by ID.
 * 
 * Returns detailed information for a specific innovation.
 * Used by innovation detail pages and modal displays.
 * 
 * @param innovationId - ID of the innovation to retrieve
 * @returns Innovation object or null if not found
 * 
 * @see innovations table in schema.ts for data structure
 */
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

/**
 * Mutation: Comment on an innovation.
 * 
 * Allows authenticated users to add comments to community innovations.
 * Creates an interaction record linking the user to the innovation.
 * 
 * @requires Authentication - Must be logged in
 * @param innovationId - ID of the innovation being commented on
 * @param comment - Comment text content
 * 
 * @returns ID of the created interaction record
 * 
 * @throws "User must be authenticated" if no session
 * 
 * @see innovationInteractions table in schema.ts for data structure
 */
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

/**
 * Mutation: Submit innovation (alias for shareInnovation).
 * 
 * Alternative function name for sharing innovations.
 * Provides the same functionality as shareInnovation with different naming.
 * 
 * @requires Authentication - Must be logged in
 * @param title - Innovation title
 * @param description - Detailed description of the innovation
 * @param relatedFramework - Optional framework ID this innovation relates to
 * @param tags - Array of tags for categorization
 * @param timeSaved - Optional minutes saved using this innovation
 * 
 * @returns ID of the created innovation record
 * 
 * @throws "User must be authenticated" if no session
 * 
 * @see shareInnovation for identical functionality
 */
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

/**
 * Query: Get recent innovations.
 * 
 * Returns the most recently created innovations ordered by creation date.
 * Used by community pages to show latest activity.
 * 
 * @param limit - Optional limit on number of results (default: 20)
 * @returns Array of recent innovation objects
 * 
 * @see innovations table in schema.ts for data structure
 */
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

/**
 * Query: Get innovations created by current user.
 * 
 * Returns innovations created by the authenticated user.
 * Used by user profile pages to show their contributions.
 * 
 * @requires Authentication - Must be logged in
 * @param limit - Optional limit on number of results (default: 20)
 * @returns Array of user's innovation objects
 * 
 * @see innovations table in schema.ts for data structure
 */
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

/**
 * Mutation: Like or unlike an innovation.
 * 
 * Toggles the like status for an innovation. If already liked, removes the like.
 * If not liked, adds a like and increments the innovation's like count.
 * 
 * @requires Authentication - Must be logged in
 * @param innovationId - ID of the innovation to like/unlike
 * 
 * @throws "User must be authenticated" if no session
 * 
 * @see innovationInteractions table in schema.ts for data structure
 */
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

/**
 * Mutation: Mark innovation as tried with optional rating and comment.
 * 
 * Records that the user has tried an innovation with optional feedback.
 * Updates the innovation's tries count and stores user rating/comment.
 * 
 * @requires Authentication - Must be logged in
 * @param innovationId - ID of the innovation being tried
 * @param rating - Optional rating (1-5 scale)
 * @param comment - Optional comment about the experience
 * 
 * @throws "User must be authenticated" if no session
 * 
 * @see innovationInteractions table in schema.ts for data structure
 */
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

/**
 * Query: Get all interactions for a specific innovation.
 * 
 * Returns all likes, comments, and tries for an innovation.
 * Used by innovation detail pages to show community engagement.
 * 
 * @param innovationId - ID of the innovation to get interactions for
 * @returns Array of interaction objects with user data
 * 
 * @see innovationInteractions table in schema.ts for data structure
 */
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

/**
 * Mutation: Delete innovation (for test cleanup).
 * 
 * Permanently removes an innovation from the system.
 * Used by test scripts for data cleanup and isolation.
 * 
 * @param innovationId - ID of the innovation to delete
 * @returns true if deletion was successful
 * 
 * @warning This action is irreversible
 * @see testDataCleanup.ts for safe test data management
 */
export const deleteInnovation = mutation({
  args: { innovationId: v.id("innovations") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.innovationId);
    return true;
  },
});

/**
 * Mutation: Delete innovation interaction (for test cleanup).
 * 
 * Permanently removes an innovation interaction from the system.
 * Used by test scripts for data cleanup and isolation.
 * 
 * @param interactionId - ID of the interaction to delete
 * @returns true if deletion was successful
 * 
 * @warning This action is irreversible
 * @see testDataCleanup.ts for safe test data management
 */
export const deleteInnovationInteraction = mutation({
  args: { interactionId: v.id("innovationInteractions") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.interactionId);
    return true;
  },
});

/**
 * Query: Get all innovations (for test cleanup).
 * 
 * Returns all innovation records for test data management and cleanup.
 * Used by test scripts to identify and clean up test data.
 * 
 * @returns Array of all innovation records with full data
 * 
 * @see testDataCleanup.ts for safe test data management
 */
export const getAllInnovationsForCleanup = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("innovations"),
    _creationTime: v.number(),
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    relatedFramework: v.optional(v.id("frameworks")),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    likes: v.number(),
    triesCount: v.number(),
    createdAt: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("innovations").collect();
  },
});

/**
 * Query: Get all innovation interactions (for test cleanup).
 * 
 * Returns all innovation interaction records for test data management and cleanup.
 * Used by test scripts to identify and clean up test data.
 * 
 * @returns Array of all innovation interaction records
 * 
 * @see testDataCleanup.ts for safe test data management
 */
export const getAllInnovationInteractions = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("innovationInteractions"),
    _creationTime: v.number(),
    innovationId: v.id("innovations"),
    userId: v.string(),
    type: v.union(v.literal("like"), v.literal("tried"), v.literal("comment")),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
    timestamp: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("innovationInteractions").collect();
  },
});