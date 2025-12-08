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
 * Indicator explanation data structure (rich coaching content)
 */
const indicatorExplanationValidator = v.object({
  indicatorCode: v.string(),
  indicatorName: v.string(),
  domain: v.string(),
  explanation: v.string(),
  curriculumConnections: v.string(),
  evidenceOfStudentLearning: v.array(v.string()),
  keyTerms: v.record(v.string(), v.string()),
  coachingQuestions: v.array(v.string()),
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
    /** Rich indicator explanations with coaching questions, key terms, evidence examples */
    indicatorExplanations: v.optional(v.array(indicatorExplanationValidator)),
    /** Whether to generate indicator summary chunks (all levels combined for comparison) */
    generateSummaryChunks: v.optional(v.boolean()),
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

      // Optionally create indicator summary chunk (all levels combined for comparison queries)
      if (args.generateSummaryChunks) {
        try {
          const summaryChunk = formatIndicatorSummaryForRAG(indicator);
          await rag.add(ctx, {
            namespace: `louisiana_rubric_${indicator.domain.toLowerCase()}`,
            text: summaryChunk,
            filterValues: [
              { name: "contentType", value: "rubric_summary" },
              { name: "subject", value: "all" },
              { name: "gradeLevel", value: "all" },
              { name: "standardCode", value: `${indicator.domain}_${indicator.indicatorCode}_SUMMARY` },
              { name: "cognitiveDepth", value: "synthesis" },
              { name: "userId", value: "system" }
            ],
          });
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            code: `${indicator.indicatorCode}_SUMMARY`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    // Process indicator explanations (rich coaching content)
    if (args.indicatorExplanations && args.indicatorExplanations.length > 0) {
      for (const explanation of args.indicatorExplanations) {
        try {
          const explanationChunk = formatIndicatorExplanationForRAG(explanation);
          await rag.add(ctx, {
            namespace: `louisiana_rubric_${explanation.domain.toLowerCase()}`,
            text: explanationChunk,
            filterValues: [
              { name: "contentType", value: "rubric_explanation" },
              { name: "subject", value: "all" },
              { name: "gradeLevel", value: "all" },
              { name: "standardCode", value: `${explanation.domain}_${explanation.indicatorCode}_EXPLANATION` },
              { name: "cognitiveDepth", value: "synthesis" },
              { name: "userId", value: "system" }
            ],
          });
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            code: `${explanation.indicatorCode}_EXPLANATION`,
            error: error instanceof Error ? error.message : String(error),
          });
        }

        // Also create a separate chunk for coaching questions (highly searchable)
        try {
          const coachingChunk = formatCoachingQuestionsForRAG(explanation);
          await rag.add(ctx, {
            namespace: `louisiana_rubric_coaching`,
            text: coachingChunk,
            filterValues: [
              { name: "contentType", value: "coaching_questions" },
              { name: "subject", value: "all" },
              { name: "gradeLevel", value: "all" },
              { name: "standardCode", value: `${explanation.domain}_${explanation.indicatorCode}_COACHING` },
              { name: "cognitiveDepth", value: "application" },
              { name: "userId", value: "system" }
            ],
          });
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            code: `${explanation.indicatorCode}_COACHING`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    // Calculate total: sum of all performance levels from indicators,
    // plus optional LEADS system, rubric metadata, summaries, and explanations
    const indicatorsTotal = args.indicators.reduce(
      (sum, ind) => sum + ind.performanceLevels.length,
      0
    );
    const summaryCount = args.generateSummaryChunks ? args.indicators.length : 0;
    const explanationCount = args.indicatorExplanations?.length ?? 0;
    const coachingCount = args.indicatorExplanations?.length ?? 0; // One coaching chunk per explanation
    const optionalCounts = (args.leadsSystem ? 1 : 0) + (args.rubricMetadata ? 1 : 0);

    return {
      total: indicatorsTotal + summaryCount + explanationCount + coachingCount + optionalCounts,
      successCount,
      errorCount,
      errors: errors.slice(0, 10),
      breakdown: {
        performanceLevels: indicatorsTotal,
        summaries: summaryCount,
        explanations: explanationCount,
        coachingQuestions: coachingCount,
        system: optionalCounts,
      }
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
  level.descriptors.forEach((descriptor) => {
    parts.push(`• ${descriptor}`);
  });

  return parts.join("\n");
}

/**
 * Format indicator summary with all performance levels for comparison queries
 *
 * This chunk helps answer questions like "How do I move from Level 3 to Level 5?"
 * by including all levels in a single, searchable chunk.
 */
function formatIndicatorSummaryForRAG(indicator: {
  domain: string;
  domainName: string;
  indicatorCode: string;
  indicatorName: string;
  performanceLevels: Array<{
    level: number;
    levelName: string;
    levelDescription: string;
    categoryDescription?: string;
    descriptors: string[];
  }>;
}): string {
  const parts: string[] = [];

  // Header
  parts.push(`Louisiana Educator Rubric - ${indicator.domainName} Domain`);
  parts.push(`Indicator: ${indicator.indicatorCode} - ${indicator.indicatorName}`);
  parts.push("");
  parts.push("Performance Level Progression (Unsatisfactory → Proficient → Exemplary):");
  parts.push("");

  // Sort levels to ensure consistent order (1, 3, 5)
  const sortedLevels = [...indicator.performanceLevels].sort((a, b) => a.level - b.level);

  for (const level of sortedLevels) {
    parts.push(`--- Level ${level.level}: ${level.levelName} (${level.levelDescription}) ---`);
    if (level.categoryDescription) {
      parts.push(`Teaching Approach: ${level.categoryDescription}`);
    }
    parts.push("Key Descriptors:");
    // Include first 3 descriptors for summary (to manage chunk size)
    level.descriptors.slice(0, 3).forEach((descriptor) => {
      parts.push(`• ${descriptor}`);
    });
    if (level.descriptors.length > 3) {
      parts.push(`• (${level.descriptors.length - 3} more descriptors...)`);
    }
    parts.push("");
  }

  parts.push("Use this summary to understand the progression from unsatisfactory to exemplary teaching practices for this indicator.");

  return parts.join("\n");
}

/**
 * Format indicator explanation for RAG (rich coaching content)
 *
 * Includes the "why" behind each indicator - explanation, curriculum connections,
 * evidence of student learning, and key terms.
 */
function formatIndicatorExplanationForRAG(explanation: {
  indicatorCode: string;
  indicatorName: string;
  domain: string;
  explanation: string;
  curriculumConnections: string;
  evidenceOfStudentLearning: string[];
  keyTerms: Record<string, string>;
}): string {
  const parts: string[] = [];

  // Header
  parts.push(`Louisiana Educator Rubric - ${explanation.domain} Domain`);
  parts.push(`Indicator: ${explanation.indicatorCode} - ${explanation.indicatorName}`);
  parts.push("");

  // Explanation
  parts.push("Why This Indicator Matters:");
  parts.push(explanation.explanation);
  parts.push("");

  // Curriculum Connections
  parts.push("Curriculum Connections:");
  parts.push(explanation.curriculumConnections);
  parts.push("");

  // Evidence of Student Learning
  parts.push("Evidence of Student Learning:");
  explanation.evidenceOfStudentLearning.forEach((evidence) => {
    parts.push(`• ${evidence}`);
  });
  parts.push("");

  // Key Terms
  const termEntries = Object.entries(explanation.keyTerms);
  if (termEntries.length > 0) {
    parts.push("Key Terms:");
    termEntries.forEach(([term, definition]) => {
      parts.push(`• ${term}: ${definition}`);
    });
  }

  return parts.join("\n");
}

/**
 * Format coaching questions for RAG (separate chunk for better search)
 *
 * Coaching questions are highly valuable for the conversational coach
 * and benefit from being in their own searchable chunk.
 */
function formatCoachingQuestionsForRAG(explanation: {
  indicatorCode: string;
  indicatorName: string;
  domain: string;
  coachingQuestions: string[];
}): string {
  const parts: string[] = [];

  // Header
  parts.push(`Louisiana Educator Rubric - ${explanation.domain} Domain`);
  parts.push(`Coaching Questions for: ${explanation.indicatorCode} - ${explanation.indicatorName}`);
  parts.push("");
  parts.push("Use these questions to guide reflective conversations with teachers about this indicator:");
  parts.push("");

  explanation.coachingQuestions.forEach((question, i) => {
    parts.push(`${i + 1}. ${question}`);
  });

  parts.push("");
  parts.push("These questions help teachers reflect on their practice and identify areas for growth.");

  return parts.join("\n");
}
