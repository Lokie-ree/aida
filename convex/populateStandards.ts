import { v } from "convex/values";
import { action } from "./_generated/server";
import { components } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";
import { internal } from "./_generated/api";

/**
 * Populate RAG with Louisiana Student Standards
 * 
 * Takes scraped standards data and chunks it appropriately,
 * then adds to RAG with proper filters for semantic search.
 */

// Initialize RAG with comprehensive filters for standards
const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  embeddingDimension: 1536,
  filterNames: [
    "contentType",
    "subject",
    "gradeLevel",
    "standardCode",
    "cognitiveDepth",
  ],
});

interface StandardData {
  standardCode: string;
  gradeLevel: string;
  subject: string;
  standardText: string;
  performanceExpectations?: string;
  cognitiveDepth?: "recall" | "application" | "synthesis";
}

/**
 * Add a single standard to RAG
 */
async function addStandardToRAG(
  ctx: any,
  standard: StandardData
): Promise<void> {
  // Create comprehensive text chunk with all standard information
  const textChunk = `Louisiana Student Standard: ${standard.standardCode}

Subject: ${standard.subject}
Grade Level: ${standard.gradeLevel}
Cognitive Depth: ${standard.cognitiveDepth || "recall"}

Standard Text:
${standard.standardText}

${standard.performanceExpectations ? `Performance Expectations:\n${standard.performanceExpectations}` : ""}`;

  await rag.add(ctx, {
    namespace: "louisiana_standards",
    key: `standard_${standard.standardCode}`,
    text: textChunk,
    filterValues: [
      { name: "contentType", value: "louisiana_standard" },
      { name: "subject", value: standard.subject },
      { name: "gradeLevel", value: standard.gradeLevel },
      { name: "standardCode", value: standard.standardCode },
      { name: "cognitiveDepth", value: standard.cognitiveDepth || "recall" },
    ],
  });
}

/**
 * Populate standards from scraper results
 */
export const populateStandardsFromScraper = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    addedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx): Promise<{
    success: boolean;
    addedCount: number;
    errors: string[];
  }> => {
    // Scrape all standards
    const scrapeResult: {
      success: boolean;
      totalStandards: number;
      bySubject: {
        ela: number;
        math: number;
        science: number;
        social_studies: number;
      };
      errors: string[];
    } = await ctx.runAction(
      internal.standardsScraper.scrapeAllStandards,
      {}
    );

    if (!scrapeResult.success) {
      return {
        success: false,
        addedCount: 0,
        errors: scrapeResult.errors,
      };
    }

    // Get individual subject results
    const [ela, math, science, socialStudies] = await Promise.all([
      ctx.runAction(internal.standardsScraper.scrapeELAStandards, {}),
      ctx.runAction(internal.standardsScraper.scrapeMathStandards, {}),
      ctx.runAction(internal.standardsScraper.scrapeScienceStandards, {}),
      ctx.runAction(internal.standardsScraper.scrapeSocialStudiesStandards, {}),
    ]);

    const allStandards: StandardData[] = [
      ...(ela.standards as StandardData[]),
      ...(math.standards as StandardData[]),
      ...(socialStudies.standards as StandardData[]),
      // Science standards would go here when ZIP parsing is implemented
    ];

    let addedCount = 0;
    const errors: string[] = [];

    // Add each standard to RAG
    for (const standard of allStandards) {
      try {
        await addStandardToRAG(ctx, standard);
        addedCount++;
      } catch (error) {
        errors.push(
          `Failed to add ${standard.standardCode}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return {
      success: errors.length === 0,
      addedCount,
      errors,
    };
  },
});

/**
 * Populate standards from provided data (for manual/testing use)
 */
export const populateStandardsFromData = action({
  args: {
    standards: v.array(
      v.object({
        standardCode: v.string(),
        gradeLevel: v.string(),
        subject: v.string(),
        standardText: v.string(),
        performanceExpectations: v.optional(v.string()),
        cognitiveDepth: v.optional(
          v.union(
            v.literal("recall"),
            v.literal("application"),
            v.literal("synthesis")
          )
        ),
      })
    ),
  },
  returns: v.object({
    success: v.boolean(),
    addedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    let addedCount = 0;
    const errors: string[] = [];

    for (const standard of args.standards) {
      try {
        await addStandardToRAG(ctx, standard);
        addedCount++;
      } catch (error) {
        errors.push(
          `Failed to add ${standard.standardCode}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return {
      success: errors.length === 0,
      addedCount,
      errors,
    };
  },
});

