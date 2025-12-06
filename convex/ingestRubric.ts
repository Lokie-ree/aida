/**
 * RAG Ingestion: Louisiana Educator Rubric
 *
 * Batch ingestion of Louisiana Educator Rubric (LER) indicators and
 * performance levels into RAG for coaching context.
 */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { rag } from "./rag";

/**
 * Rubric indicator data structure
 */
const rubricIndicatorValidator = v.object({
  domain: v.string(),
  domainName: v.string(),
  indicatorCode: v.string(),
  indicatorName: v.string(),
  performanceLevels: v.array(
    v.object({
      level: v.number(),
      levelName: v.string(),
      levelDescription: v.string(),
      categoryDescription: v.optional(v.string()),
      descriptors: v.array(v.string()),
    })
  ),
});

/**
 * LEADS system data structure
 */
const leadsSystemValidator = v.object({
  name: v.string(),
  overview: v.string(),
  keyObjectives: v.array(v.string()),
  threeProvenStrategies: v.optional(v.array(v.string())),
});

/**
 * Batch ingest Louisiana Educator Rubric into RAG
 *
 * Processes rubric indicators and performance levels for coaching context.
 */
export const batchIngestRubric = action({
  args: {
    indicators: v.array(rubricIndicatorValidator),
    leadsSystem: v.optional(leadsSystemValidator),
    rubricMetadata: v.optional(
      v.object({
        name: v.string(),
        releaseDate: v.string(),
        overview: v.string(),
        performanceLevelGuidance: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ code: string; error: string }> = [];

    // First, ingest LEADS system overview if provided
    if (args.leadsSystem) {
      try {
        const leadsChunk = formatLEADSForRAG(args.leadsSystem);
        await rag.add(ctx, {
          namespace: "louisiana_rubric_system",
          text: leadsChunk,
          filterValues: [
            { name: "contentType", value: "rubric_indicator" },
            { name: "subject", value: "all" },
            { name: "gradeLevel", value: "all" },
            { name: "standardCode", value: "LEADS_SYSTEM" },
            { name: "cognitiveDepth", value: "application" },
            { name: "userId", value: "system" }
          ],
        });
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          code: "LEADS_SYSTEM",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Ingest rubric overview if provided
    if (args.rubricMetadata) {
      try {
        const rubricOverviewChunk = formatRubricOverviewForRAG(
          args.rubricMetadata
        );
        await rag.add(ctx, {
          namespace: "louisiana_rubric_system",
          text: rubricOverviewChunk,
          filterValues: [
            { name: "contentType", value: "rubric_indicator" },
            { name: "subject", value: "all" },
            { name: "gradeLevel", value: "all" },
            { name: "standardCode", value: "LER_OVERVIEW" },
            { name: "cognitiveDepth", value: "application" },
            { name: "userId", value: "system" }
          ],
        });
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          code: "LER_OVERVIEW",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Process each indicator
    for (const indicator of args.indicators) {
      // Create a chunk for each performance level
      for (const level of indicator.performanceLevels) {
        try {
          const textChunk = formatRubricIndicatorForRAG(indicator, level);

          await rag.add(ctx, {
            namespace: `louisiana_rubric_${indicator.domain.toLowerCase()}`,
            text: textChunk,
            filterValues: [
              { name: "contentType", value: "rubric_indicator" },
              { name: "subject", value: "all" }, // Rubric applies to all subjects
              { name: "gradeLevel", value: "all" }, // Rubric applies to all grades
              { name: "standardCode", value: `${indicator.domain}_${indicator.indicatorCode}_L${level.level}` },
              { name: "cognitiveDepth", value: "application" },
            { name: "userId", value: "system" }
            ],
          });

          successCount++;
        } catch (error) {
          errorCount++;
          const errorCode = `${indicator.indicatorCode}_L${level.level}`;
          errors.push({
            code: errorCode,
            error: error instanceof Error ? error.message : String(error),
          });
          console.error(`Error ingesting rubric indicator ${errorCode}:`, error);
        }
      }
    }

    // Calculate total: sum of all performance levels from indicators,
    // plus optional LEADS system and rubric metadata
    const indicatorsTotal = args.indicators.reduce(
      (sum, ind) => sum + ind.performanceLevels.length,
      0 // Start with 0, add optional counts separately
    );
    const optionalCounts = (args.leadsSystem ? 1 : 0) + (args.rubricMetadata ? 1 : 0);
    
    return {
      total: indicatorsTotal + optionalCounts,
      successCount,
      errorCount,
      errors: errors.slice(0, 10),
    };
  },
});

/**
 * Format LEADS system overview for RAG
 */
function formatLEADSForRAG(leadsSystem: {
  name: string;
  overview: string;
  keyObjectives: string[];
  threeProvenStrategies?: string[];
}): string {
  const parts: string[] = [];

  parts.push(`Louisiana Educator Advancement and Development System (LEADS)`);
  parts.push("");
  parts.push("Overview:");
  parts.push(leadsSystem.overview);
  parts.push("");
  parts.push("Key Objectives:");
  leadsSystem.keyObjectives.forEach((obj, i) => {
    parts.push(`${i + 1}. ${obj}`);
  });

  if (
    leadsSystem.threeProvenStrategies &&
    leadsSystem.threeProvenStrategies.length > 0
  ) {
    parts.push("");
    parts.push("Three Proven Strategies:");
    leadsSystem.threeProvenStrategies.forEach((strategy, i) => {
      parts.push(`${i + 1}. ${strategy}`);
    });
  }

  return parts.join("\n");
}

/**
 * Format rubric overview for RAG
 */
function formatRubricOverviewForRAG(metadata: {
  name: string;
  releaseDate: string;
  overview: string;
  performanceLevelGuidance?: string;
}): string {
  const parts: string[] = [];

  parts.push(metadata.name);
  parts.push(`Release Date: ${metadata.releaseDate}`);
  parts.push("");
  parts.push("Overview:");
  parts.push(metadata.overview);

  if (metadata.performanceLevelGuidance) {
    parts.push("");
    parts.push("Performance Level Guidance:");
    parts.push(metadata.performanceLevelGuidance);
  }

  return parts.join("\n");
}

/**
 * Format a rubric indicator at a specific performance level for RAG
 */
function formatRubricIndicatorForRAG(
  indicator: {
    domain: string;
    domainName: string;
    indicatorCode: string;
    indicatorName: string;
  },
  level: {
    level: number;
    levelName: string;
    levelDescription: string;
    categoryDescription?: string;
    descriptors: string[];
  }
): string {
  const parts: string[] = [];

  // Header
  parts.push(
    `Louisiana Educator Rubric - ${indicator.domainName} Domain`
  );
  parts.push(
    `Indicator: ${indicator.indicatorCode} - ${indicator.indicatorName}`
  );
  parts.push(
    `Performance Level: ${level.level} - ${level.levelName} (${level.levelDescription})`
  );
  parts.push("");

  // Category description (if present)
  if (level.categoryDescription) {
    parts.push(`Teaching Approach: ${level.categoryDescription}`);
    parts.push("");
  }

  // Descriptors
  parts.push("Evidence of Performance:");
  level.descriptors.forEach((descriptor, i) => {
    parts.push(`• ${descriptor}`);
  });

  return parts.join("\n");
}
