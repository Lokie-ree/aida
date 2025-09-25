"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
});

export const scrapeWebsite = action({
  args: { 
    url: v.string(),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    websiteId: string;
    title: string;
    chunksCount: number;
    contentLength: number;
  }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // If spaceId is provided, verify user has access to the space
    if (args.spaceId) {
      const membership = await ctx.runQuery(api.spaces.getSpaceById, { spaceId: args.spaceId });
      if (!membership) {
        throw new Error("You don't have access to this space");
      }
    }

    try {
      // Validate URL format
      const url = new URL(args.url);
      if (!url.protocol.startsWith('http')) {
        throw new Error("Invalid URL format");
      }

      // Scrape the website using Firecrawl
      const scrapeResult = await firecrawl.scrapeUrl(args.url, {
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        includeTags: ['title', 'meta'],
        excludeTags: ['nav', 'footer', 'aside', 'script', 'style'],
      });

      if (!scrapeResult.success) {
        throw new Error("Failed to scrape website: " + (scrapeResult.error || "Unknown error"));
      }

      const content = (scrapeResult as any).data;
      if (!content || !content.markdown) {
        throw new Error("No content found on the website");
      }

      // Extract title from metadata or URL
      const title = content.metadata?.title || 
                   content.metadata?.ogTitle || 
                   url.hostname;

      // Process the content into chunks (split by paragraphs/sections)
      const textContent = content.markdown;
      const chunks = processContentIntoChunks(textContent);

      // Save the scraped website data with space association
      const websiteId = await ctx.runMutation(api.webscraping.saveScrapedWebsite, {
        url: args.url,
        title,
        content: textContent,
        chunks,
        metadata: {
          description: content.metadata?.description || "",
          ogImage: content.metadata?.ogImage || "",
          sourceURL: content.metadata?.sourceURL || args.url,
        },
        spaceId: args.spaceId,
      });

      // Add website content to RAG for semantic search
      await ctx.runAction(api.rag.addWebScrapingToRAG, {
        websiteId,
        content: textContent,
        title,
        url: args.url,
        spaceId: args.spaceId,
      });

      return {
        success: true,
        websiteId,
        title,
        chunksCount: chunks.length,
        contentLength: textContent.length,
      };
    } catch (error) {
      console.error("Error scraping website:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to scrape website: ${error.message}`);
      }
      throw new Error("Failed to scrape website: Unknown error");
    }
  },
});

function processContentIntoChunks(content: string): string[] {
  // Split content into meaningful chunks (by paragraphs, sections, etc.)
  const chunks: string[] = [];
  
  // Split by double newlines (paragraphs) and headers
  const sections = content.split(/\n\s*\n|\n#{1,6}\s+/);
  
  for (const section of sections) {
    const trimmed = section.trim();
    if (trimmed.length < 50) continue; // Skip very short sections
    
    // If section is too long, split it further
    if (trimmed.length > 1000) {
      const sentences = trimmed.split(/[.!?]+\s+/);
      let currentChunk = "";
      
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > 800) {
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = sentence;
        } else {
          currentChunk += (currentChunk ? ". " : "") + sentence;
        }
      }
      
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
    } else {
      chunks.push(trimmed);
    }
  }
  
  return chunks.filter(chunk => chunk.length > 30); // Filter out very short chunks
}
