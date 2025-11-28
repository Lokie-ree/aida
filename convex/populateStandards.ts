/**
 * ✅ ACTIVE - Used in production
 * Standards population: populateStandardsFromData (for manual/testing data entry)
 * populateStandardsFromJson (preferred method)
 * 
 * Note: Markdown conversion is done via scripts/convert-markdown-to-json.ts (one-time script)
 */
import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { rag } from "./rag";
import { rateLimiter } from "./rateLimiting";
import { parseLSSJSON, StandardData } from "./lssJsonParser";

/**
 * Populate RAG with Louisiana Student Standards
 * 
 * Takes scraped standards data and chunks it appropriately,
 * then adds to RAG with proper filters for semantic search.
 */

// StandardData interface is now imported from lssJsonParser.ts

/**
 * Add a single standard to RAG with rate limiting
 * Used by workflow steps for bulk ingestion
 */
export async function addStandardToRAG(
  ctx: any,
  standard: StandardData
): Promise<void> {
  // Reserve rate limit capacity for embedding operation
  const rateLimitStatus = await rateLimiter.limit(ctx, "bulkIngestion" as any, {
    key: "bulk-ingestion",
    reserve: true, // Reserve capacity to prevent starvation
  });

  if (!rateLimitStatus.ok) {
    throw new Error(
      `Rate limit exceeded. Retry after ${new Date(rateLimitStatus.retryAfter).toISOString()}`
    );
  }

  // Create comprehensive text chunk with all standard information
  const textChunk = `Louisiana Student Standard: ${standard.standardCode}

Subject: ${standard.subject}
Grade Level: ${standard.gradeLevel}
Cognitive Depth: ${standard.cognitiveDepth || "recall"}
${standard.strand ? `Strand: ${standard.strand}` : ""}
${standard.domain ? `Domain: ${standard.domain}` : ""}
${standard.cluster ? `Cluster: ${standard.cluster}` : ""}
${standard.course ? `Course: ${standard.course}` : ""}

Standard Text:
${standard.standardText}

${standard.performanceExpectations ? `Performance Expectations:\n${standard.performanceExpectations}` : ""}`;

  await rag.add(ctx, {
    namespace: "louisiana_standards",
    key: `standard_${standard.standardCode.replace(/[^a-zA-Z0-9]/g, "_")}`,
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
 * Add a batch of standards to RAG (for workflow steps)
 * Processes standards in small batches with rate limiting
 */
export const addStandardsBatch = internalAction({
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
        strand: v.optional(v.string()),
        domain: v.optional(v.string()),
        cluster: v.optional(v.string()),
        subStandard: v.optional(v.string()),
        course: v.optional(v.string()),
      })
    ),
  },
  returns: v.object({
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

/**
 * Populate standards from JSON content (preferred method)
 * 
 * Accepts JSON string containing array of standards, validates against schema,
 * and populates RAG. Should be called via workflow for bulk ingestion.
 */
export const populateStandardsFromJson = action({
  args: {
    jsonContent: v.string(),
    subject: v.union(
      v.literal("ela"),
      v.literal("math"),
      v.literal("science"),
      v.literal("social_studies")
    ),
  },
  returns: v.object({
    success: v.boolean(),
    parsedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      // Parse and validate JSON
      const standards = parseLSSJSON(args.jsonContent);

      // Validate subject matches
      const mismatchedSubjects = standards.filter(
        (s) => s.subject !== args.subject
      );
      if (mismatchedSubjects.length > 0) {
        return {
          success: false,
          parsedCount: standards.length,
          errors: [
            `Subject mismatch: ${mismatchedSubjects.length} standards have subject '${mismatchedSubjects[0].subject}' but expected '${args.subject}'`,
          ],
        };
      }

      // Add standards to RAG (with rate limiting)
      let addedCount = 0;
      const errors: string[] = [];

      for (const standard of standards) {
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
        parsedCount: standards.length,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        parsedCount: 0,
        errors: [
          error instanceof Error ? error.message : "Unknown parsing error",
        ],
      };
    }
  },
});


