/**
 * ✅ ACTIVE - RAG instance for Louisiana standards and educator rubric
 *
 * December 2025 Beta: Simplified to core RAG initialization only.
 * Alignment scorecard features removed (see git history to restore).
 */
import { components } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";

// Initialize RAG with Louisiana Student Standards and Educator Rubric
const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  embeddingDimension: 1536,
  filterNames: [
    "contentType",      // "louisiana_standard", "rubric_indicator"
    "subject",          // "ela", "math", "science", "social_studies"
    "gradeLevel",       // "K", "1", "2", ... "12"
    "standardCode",     // Parsed standard identifier (e.g., "RL.3.1")
    "cognitiveDepth",   // "recall", "application", "synthesis"
    "userId",           // For user-specific content
      ],
    });

// Export RAG instance for use in promptCoach and other backend files
export { rag };

// Note: Alignment scorecard functions removed for December 2025 beta
// See git history to restore analyzeContentAlignment and getAlignmentStatus
