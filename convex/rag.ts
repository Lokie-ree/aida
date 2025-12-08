/**
 * ✅ ACTIVE - RAG instance for Louisiana standards and educator rubric
 *
 * December 2025 Beta: Simplified to core RAG initialization only.
 * Alignment scorecard features removed (see git history to restore).
 *
 * ## Content Types & Namespaces
 *
 * ### Louisiana Student Standards (LSS)
 * - Namespace: `louisiana_standards`
 * - contentType: `louisiana_standard`
 * - Filters: subject, gradeLevel, standardCode, cognitiveDepth
 *
 * ### Louisiana Educator Rubric (LER)
 * Namespaces by domain:
 * - `louisiana_rubric_instruction` (12 indicators: SO, MS, PIC, LS, ACT, QU, FEED, GRP, TCK, TKS, TH, PS)
 * - `louisiana_rubric_planning` (3 indicators: IP, SW, AS)
 * - `louisiana_rubric_environment` (4 indicators: ES, ESMB, ENV, RC)
 * - `louisiana_rubric_professionalism` (4 indicators: GDP, RT, SI, SR)
 * - `louisiana_rubric_system` (LEADS overview, LER overview)
 * - `louisiana_rubric_coaching` (Coaching questions for all indicators)
 *
 * Content types:
 * - `rubric_indicator`: Performance level descriptors (L1, L3, L5)
 * - `rubric_summary`: All 3 levels combined for comparison queries
 * - `rubric_explanation`: Deep coaching content (why indicator matters, curriculum connections)
 * - `coaching_questions`: Reflective questions for teacher coaching conversations
 *
 * ## Query Examples
 *
 * ```typescript
 * // Find rubric indicators about questioning
 * await rag.search(ctx, {
 *   namespace: "louisiana_rubric_instruction",
 *   query: "How do I improve questioning techniques?",
 *   filters: [{ name: "contentType", value: "rubric_indicator" }],
 *   limit: 5,
 * });
 *
 * // Find coaching questions for any indicator
 * await rag.search(ctx, {
 *   namespace: "louisiana_rubric_coaching",
 *   query: "differentiation for students",
 *   filters: [{ name: "contentType", value: "coaching_questions" }],
 *   limit: 3,
 * });
 *
 * // Find level comparison for specific indicator
 * await rag.search(ctx, {
 *   namespace: "louisiana_rubric_instruction",
 *   query: "standards and objectives progression",
 *   filters: [{ name: "contentType", value: "rubric_summary" }],
 *   limit: 1,
 * });
 * ```
 */
import { components } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";

/**
 * Pelican AI RAG instance
 *
 * Stores Louisiana Student Standards and Louisiana Educator Rubric content
 * for semantic search during prompt coaching conversations.
 */
const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  embeddingDimension: 1536,
  filterNames: [
    // Content categorization
    "contentType", // "louisiana_standard" | "rubric_indicator" | "rubric_summary" | "rubric_explanation" | "coaching_questions"

    // Subject filtering (standards & rubric apply to all subjects)
    "subject", // "ela" | "math" | "science" | "social_studies" | "all"

    // Grade level filtering
    "gradeLevel", // "K" | "1" | "2" | ... | "12" | "all"

    // Unique identifier for content
    "standardCode", // e.g., "RL.3.1" for standards, "INSTRUCTION_SO_L5" for rubric

    // Cognitive complexity level
    "cognitiveDepth", // "recall" | "skill" | "conceptual" | "application" | "analysis" | "synthesis" | "evaluation" | "strategic"

    // User-specific content (for future personalization)
    "userId", // "system" for public content, user ID for personal content
  ],
});

// Export RAG instance for use in promptCoach and other backend files
export { rag };

/**
 * Chunk counts (after full ingestion):
 *
 * Louisiana Educator Rubric:
 * - 69 performance level chunks (23 indicators × 3 levels)
 * - 23 summary chunks (one per indicator, all levels combined)
 * - 19 explanation chunks (rich coaching content)
 * - 19 coaching question chunks
 * - 2 system chunks (LEADS overview, LER overview)
 * = 132 total rubric chunks
 *
 * Louisiana Student Standards:
 * - ~2000+ standard chunks (varies by subject)
 *
 * Run `pnpm ingest-rag --dry-run` to see current counts.
 */
