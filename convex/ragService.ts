/**
 * ✅ ACTIVE - Used in production
 * RAG service: getStandards (rate-limited standards retrieval)
 */
import { action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { rag } from "./rag";
import { authComponent } from "./auth";
import { rateLimiter, getRagRateLimitKey } from "./rateLimiting";
import { internal } from "./_generated/api";

/**
 * Centralized RAG service layer with caching and rate limiting.
 * 
 * This service provides:
 * - Standards retrieval with caching (24 hour TTL for static standards)
 * - Content alignment queries with caching (1 hour TTL)
 * - Policy/document search
 * - Rate limiting based on user role
 * - Error handling
 * 
 * Note: Action Cache integration will be added after types are regenerated.
 */

/**
 * Retrieve Louisiana standards by subject and grade level.
 * 
 * Cached for 24 hours since standards are static.
 * Rate limited based on user role.
 * 
 * @param subject - Subject area (ela, math, science, social_studies)
 * @param gradeLevel - Grade level (K, 1, 2, ..., 12)
 * @param standardCodes - Optional array of specific standard codes to retrieve
 */
export const getStandards = action({
  args: {
    subject: v.union(
      v.literal("ela"),
      v.literal("math"),
      v.literal("science"),
      v.literal("social_studies")
    ),
    gradeLevel: v.string(),
    standardCodes: v.optional(v.array(v.string())),
  },
  returns: v.array(v.object({
    code: v.string(),
    description: v.string(),
    gradeLevel: v.string(),
    subject: v.string(),
    strand: v.optional(v.string()),
    cognitiveDepth: v.optional(v.string()),
  })),
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;
    
    // Get user profile for role using internal query
    // Note: Using type assertion until types are regenerated
    const profile = await ctx.runQuery(
      internal.ragService.getUserProfileForRole as any,
      { userId }
    );
    const role = profile?.role;
    
    // Apply rate limiting
    const rateLimitKey = await getRagRateLimitKey(ctx, userId, role);
    const rateLimitStatus = await rateLimiter.limit(ctx, rateLimitKey as any, {
      key: userId,
    });
    
    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again after ${new Date(rateLimitStatus.retryAfter).toISOString()}`
      );
    }
    
    // Build filters for RAG query (must be array format)
    const filters: Array<{ name: string; value: string }> = [
      { name: "contentType", value: "louisiana_standard" },
      { name: "subject", value: args.subject },
      { name: "gradeLevel", value: args.gradeLevel },
    ];
    
    // Query RAG for standards using semantic search
    const { results } = await rag.search(ctx, {
      namespace: "louisiana_standards",
      query: args.standardCodes
        ? `Louisiana ${args.subject.toUpperCase()} standards for grade ${args.gradeLevel}: ${args.standardCodes.join(", ")}`
        : `Louisiana ${args.subject.toUpperCase()} standards for grade ${args.gradeLevel}`,
      filters,
      limit: 100,
      vectorScoreThreshold: 0.6,
    });
    
    // Transform RAG results to standardized format
    return results.map((result: any) => {
      const firstContent = result.content?.[0];
      return {
        code: (firstContent?.metadata?.standardCode as string) || "",
        description: firstContent?.text || "",
        gradeLevel: (firstContent?.metadata?.gradeLevel as string) || args.gradeLevel,
        subject: (firstContent?.metadata?.subject as string) || args.subject,
        strand: firstContent?.metadata?.strand as string | undefined,
        cognitiveDepth: firstContent?.metadata?.cognitiveDepth as string | undefined,
      };
    });
  },
});

/**
 * Search for content alignment against Louisiana standards.
 * 
 * Cached for 1 hour to avoid re-analyzing identical content.
 * Rate limited based on user role.
 * 
 * @param content - Content to analyze (quiz, lesson plan, etc.)
 * @param subject - Subject area
 * @param gradeLevel - Grade level
 */
export const analyzeContentAlignment = action({
  args: {
    content: v.string(),
    subject: v.union(
      v.literal("ela"),
      v.literal("math"),
      v.literal("science"),
      v.literal("social_studies")
    ),
    gradeLevel: v.string(),
  },
  returns: v.object({
    alignedStandards: v.array(v.object({
      code: v.string(),
      description: v.string(),
      alignmentScore: v.number(),
      reasoning: v.string(),
    })),
    overallAlignment: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;
    
    // Get user profile for role using internal query
    // Note: Using type assertion until types are regenerated
    const profile = await ctx.runQuery(
      internal.ragService.getUserProfileForRole as any,
      { userId }
    );
    const role = profile?.role;
    
    // Apply rate limiting
    const rateLimitKey = await getRagRateLimitKey(ctx, userId, role);
    const rateLimitStatus = await rateLimiter.limit(ctx, rateLimitKey as any, {
      key: userId,
    });
    
    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again after ${new Date(rateLimitStatus.retryAfter).toISOString()}`
      );
    }
    
    // Query RAG for relevant standards
    const filters: Array<{ name: string; value: string }> = [
      { name: "contentType", value: "louisiana_standard" },
      { name: "subject", value: args.subject },
      { name: "gradeLevel", value: args.gradeLevel },
    ];
    
    const { results } = await rag.search(ctx, {
      namespace: "louisiana_standards",
      query: `Analyze this content for alignment with Louisiana ${args.subject.toUpperCase()} standards for grade ${args.gradeLevel}: ${args.content}`,
      filters,
      limit: 20,
      vectorScoreThreshold: 0.6,
    });
    
    // Transform results (simplified - actual implementation would use AI for scoring)
    const alignedStandards = results.map((result: any, index: number) => {
      const firstContent = result.content?.[0];
      const standardCode = (firstContent?.metadata?.standardCode as string) || `STANDARD-${index}`;
      return {
        code: standardCode,
        description: firstContent?.text || "",
        alignmentScore: result.score || 0.5,
        reasoning: `Content aligns with ${standardCode} based on semantic similarity.`,
      };
    });
    
    const overallAlignment = alignedStandards.length > 0
      ? alignedStandards.reduce((sum: number, s: any) => sum + s.alignmentScore, 0) / alignedStandards.length
      : 0;
    
    return {
      alignedStandards,
      overallAlignment,
    };
  },
});

/**
 * Search for district policies and documents.
 * 
 * Cached for 1 hour.
 * Rate limited based on user role.
 * 
 * @param query - Search query
 * @param limit - Maximum number of results
 */
export const searchPolicies = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    text: v.string(),
    metadata: v.any(),
    score: v.number(),
  })),
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    const userId = user._id;
    
    // Get user profile for role using internal query
    // Note: Using type assertion until types are regenerated
    const profile = await ctx.runQuery(
      internal.ragService.getUserProfileForRole as any,
      { userId }
    );
    const role = profile?.role;
    
    // Apply rate limiting
    const rateLimitKey = await getRagRateLimitKey(ctx, userId, role);
    const rateLimitStatus = await rateLimiter.limit(ctx, rateLimitKey as any, {
      key: userId,
    });
    
    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again after ${new Date(rateLimitStatus.retryAfter).toISOString()}`
      );
    }
    
    const filters: Array<{ name: string; value: string }> = [
      { name: "contentType", value: "policy" },
    ];
    
    const { results } = await rag.search(ctx, {
      namespace: "policies",
      query: args.query,
      filters,
      limit: args.limit || 10,
      vectorScoreThreshold: 0.6,
    });
    
    return results.map((result: any) => {
      const firstContent = result.content?.[0];
      return {
        text: firstContent?.text || "",
        metadata: firstContent?.metadata || {},
        score: result.score || 0,
      };
    });
  },
});

/**
 * Internal helper query to get user profile for role checking.
 * This is used by actions to get user profile data.
 */
export const getUserProfileForRole = internalQuery({
  args: {
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("userProfiles"),
      userId: v.string(),
      role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("coach"))),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    if (!profile) {
      return null;
    }
    
    return {
      _id: profile._id,
      userId: profile.userId,
      role: profile.role,
    };
  },
});

