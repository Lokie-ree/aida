import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveScrapedWebsite = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
    chunks: v.array(v.string()),
    metadata: v.object({
      description: v.string(),
      ogImage: v.string(),
      sourceURL: v.string(),
    }),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const websiteId = await ctx.db.insert("scrapedWebsites", {
      userId,
      url: args.url,
      title: args.title,
      content: args.content,
      chunks: args.chunks,
      metadata: args.metadata,
      spaceId: args.spaceId,
    });

    return websiteId;
  },
});

export const getUserScrapedWebsites = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    if (args.spaceId) {
      // Verify user has access to the space
      const membership = await ctx.db
        .query("spaceMembers")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
        .first();

      if (!membership) {
        return [];
      }

      // Return websites for the specific space
      return await ctx.db
        .query("scrapedWebsites")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
        .order("desc")
        .collect();
    }

    // Return personal websites (no spaceId)
    return await ctx.db
      .query("scrapedWebsites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("spaceId"), undefined))
      .order("desc")
      .collect();
  },
});

export const deleteScrapedWebsite = mutation({
  args: { websiteId: v.id("scrapedWebsites") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const website = await ctx.db.get(args.websiteId);
    if (!website) {
      throw new Error("Website not found");
    }

    // Check if user has permission to delete
    if (website.spaceId) {
      // For space websites, check if user is a member
      const membership = await ctx.db
        .query("spaceMembers")
        .withIndex("by_space", (q) => q.eq("spaceId", website.spaceId!))
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
        .first();

      if (!membership) {
        throw new Error("You don't have access to this space");
      }
    } else {
      // For personal websites, check ownership
      if (website.userId !== userId) {
        throw new Error("Access denied");
      }
    }

    await ctx.db.delete(args.websiteId);
  },
});

export const searchScrapedWebsites = query({
  args: { 
    query: v.string(),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args): Promise<Array<{
    websiteId: string;
    title: string;
    url: string;
    content: string;
    relevanceScore: number;
  }>> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    try {
      let websites;

      if (args.spaceId) {
        // Verify user has access to the space
        const membership = await ctx.db
          .query("spaceMembers")
          .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
          .filter((q) => q.eq(q.field("userId"), userId))
          .filter((q) => q.eq(q.field("invitationStatus"), "accepted"))
          .first();

        if (!membership) {
          return [];
        }

        // Get websites for the specific space
        websites = await ctx.db
          .query("scrapedWebsites")
          .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId!))
          .collect();
      } else {
        // Get personal websites
        websites = await ctx.db
          .query("scrapedWebsites")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .filter((q) => q.eq(q.field("spaceId"), undefined))
          .collect();
      }

      // Simple text-based search across chunks
      const searchTerms = args.query.toLowerCase().split(' ').filter(term => term.length > 2);
      const results: Array<{
        websiteId: string;
        title: string;
        url: string;
        content: string;
        relevanceScore: number;
      }> = [];

      for (const website of websites) {
        let totalScore = 0;
        let bestChunk = "";
        
        // Search through all chunks for this website
        for (const chunk of website.chunks) {
          const content = chunk.toLowerCase();
          let chunkScore = 0;
          
          // Calculate relevance score based on term matches
          for (const term of searchTerms) {
            const matches = (content.match(new RegExp(term, 'g')) || []).length;
            chunkScore += matches;
          }
          
          if (chunkScore > 0) {
            totalScore += chunkScore;
            if (chunkScore > 0 && (!bestChunk || chunkScore > 0)) {
              bestChunk = chunk;
            }
          }
        }
        
        if (totalScore > 0) {
          results.push({
            websiteId: website._id,
            title: website.title,
            url: website.url,
            content: bestChunk.substring(0, 500) + "...",
            relevanceScore: totalScore,
          });
        }
      }

      // Sort by relevance score (highest first)
      return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
    } catch (error) {
      console.error("Error searching scraped websites:", error);
      return [];
    }
  },
});
