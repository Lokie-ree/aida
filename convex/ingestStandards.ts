/**
 * RAG Ingestion: Louisiana Student Standards
 *
 * Batch ingestion of Louisiana standards from JSON files into RAG.
 * Supports ELA, Math, Science, and Social Studies.
 */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { rag } from "./rag";

/**
 * Standard data structure (normalized across all subjects)
 */
const standardDataValidator = v.object({
  code: v.string(),
  gradeLevel: v.string(),
  subject: v.union(
    v.literal("ela"),
    v.literal("math"),
    v.literal("science"),
    v.literal("social_studies")
  ),
  text: v.string(),
  cognitiveDepth: v.optional(
    v.union(
      v.literal("recall"),
      v.literal("skill"),
      v.literal("conceptual"),
      v.literal("application"),
      v.literal("analysis"),
      v.literal("synthesis"),
      v.literal("evaluation")
    )
  ),
  // Subject-specific metadata
  metadata: v.optional(
    v.object({
      // ELA
      strand: v.optional(v.string()),
      strandCode: v.optional(v.string()),
      category: v.optional(v.string()),
      // Math
      domain: v.optional(v.string()),
      domainCode: v.optional(v.string()),
      cluster: v.optional(v.string()),
      clusterCode: v.optional(v.string()),
      // Science
      discipline: v.optional(v.string()),
      disciplineCode: v.optional(v.string()),
      topic: v.optional(v.string()),
      performanceExpectation: v.optional(v.string()),
      clarificationStatement: v.optional(v.string()),
      // Social Studies
      contentThemes: v.optional(v.array(v.string())),
      historicalEra: v.optional(v.union(v.string(), v.null())),
      geographicRegion: v.optional(v.union(v.string(), v.null(), v.array(v.string()))),
    })
  ),
});

/**
 * Batch ingest Louisiana standards into RAG
 *
 * Processes standards in batches to handle rate limiting.
 * Returns statistics about the ingestion.
 */
export const batchIngestStandards = action({
  args: {
    standards: v.array(standardDataValidator),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize ?? 50;
    const standards = args.standards;

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ code: string; error: string }> = [];

    // Process in batches
    for (let i = 0; i < standards.length; i += batchSize) {
      const batch = standards.slice(i, i + batchSize);

      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          standards.length / batchSize
        )} (${batch.length} standards)`
      );

      // Process each standard in the batch
      for (const standard of batch) {
        try {
          // Format text chunk with context
          const textChunk = formatStandardForRAG(standard);

          // Add to RAG with filters
          await rag.add(ctx, {
            namespace: `louisiana_standards_${standard.subject}`,
            text: textChunk,
            filterValues: [
              { name: "contentType", value: "louisiana_standard" },
              { name: "subject", value: standard.subject },
              { name: "gradeLevel", value: standard.gradeLevel },
              { name: "standardCode", value: standard.code },
              { name: "cognitiveDepth", value: standard.cognitiveDepth || "recall" }
            ],
          });

          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            code: standard.code,
            error: error instanceof Error ? error.message : String(error),
          });
          console.error(
            `Error ingesting standard ${standard.code}:`,
            error
          );
        }
      }

      // Small delay between batches to avoid overwhelming the system
      if (i + batchSize < standards.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return {
      total: standards.length,
      successCount,
      errorCount,
      errors: errors.slice(0, 10), // Return first 10 errors only
    };
  },
});

/**
 * Format a standard for RAG ingestion
 *
 * Creates a rich text chunk with all relevant context for retrieval.
 */
function formatStandardForRAG(standard: {
  code: string;
  gradeLevel: string;
  subject: string;
  text: string;
  cognitiveDepth?: string;
  metadata?: Record<string, any>;
}): string {
  const parts: string[] = [];

  // Header with standard code and grade
  parts.push(`Louisiana Student Standard ${standard.code}`);
  parts.push(`Grade Level: ${standard.gradeLevel}`);
  parts.push(`Subject: ${formatSubjectName(standard.subject)}`);

  // Subject-specific context
  if (standard.metadata) {
    const meta = standard.metadata;

    // ELA: Strand and Category
    if (meta.strand) {
      parts.push(`Strand: ${meta.strand}`);
    }
    if (meta.category) {
      parts.push(`Category: ${meta.category}`);
    }

    // Math: Domain and Cluster
    if (meta.domain) {
      parts.push(`Domain: ${meta.domain}`);
    }
    if (meta.cluster) {
      parts.push(`Cluster: ${meta.cluster}`);
    }

    // Science: Discipline and Topic
    if (meta.discipline) {
      parts.push(`Discipline: ${meta.discipline}`);
    }
    if (meta.topic) {
      parts.push(`Topic: ${meta.topic}`);
    }

    // Social Studies: Content Themes
    if (meta.contentThemes && meta.contentThemes.length > 0) {
      parts.push(`Content Themes: ${meta.contentThemes.join(", ")}`);
    }
  }

  // Cognitive depth
  if (standard.cognitiveDepth) {
    parts.push(`Cognitive Depth: ${standard.cognitiveDepth}`);
  }

  // Main standard text
  parts.push("");
  parts.push("Standard:");
  parts.push(standard.text);

  // Science: Add clarification statement if present
  if (standard.metadata?.clarificationStatement) {
    parts.push("");
    parts.push("Clarification:");
    parts.push(standard.metadata.clarificationStatement);
  }

  return parts.join("\n");
}

/**
 * Format subject name for display
 */
function formatSubjectName(subject: string): string {
  const names: Record<string, string> = {
    ela: "English Language Arts (ELA)",
    math: "Mathematics",
    science: "Science",
    social_studies: "Social Studies",
  };
  return names[subject] || subject;
}
