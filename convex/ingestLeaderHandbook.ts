/**
 * RAG Ingestion: Louisiana Leader Handbook
 *
 * Ingests coaching questions, evidence examples, and adult learning principles
 * from the Louisiana Leader Rubric & Evaluation Handbook.
 *
 * While this rubric is for school leaders/principals, many coaching questions
 * and strategies transfer well to teacher coaching conversations. The questioning
 * style models effective Louisiana coaching practices.
 */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { rag } from "./rag";

/**
 * Indicator explanation data structure (matches Leader Handbook format)
 */
const leaderIndicatorExplanationValidator = v.object({
  indicatorCode: v.string(),
  indicatorName: v.string(),
  indicatorNumber: v.string(),
  domain: v.string(),
  explanation: v.string(),
  descriptorExplanations: v.optional(v.record(v.string(), v.string())),
  evidenceExamples: v.array(v.string()),
  coachingQuestions: v.array(v.string()),
});

/**
 * Adult learning principle data structure
 */
const adultLearningPrincipleValidator = v.object({
  principle: v.string(),
  description: v.string(),
});

/**
 * LEADS system data structure (for leader context)
 */
const leadsSystemValidator = v.object({
  name: v.string(),
  overview: v.string(),
  keyObjectives: v.array(v.string()),
  leadershipBeliefs: v.optional(v.array(v.string())),
  threeProvenStrategies: v.optional(
    v.array(
      v.object({
        name: v.string(),
        description: v.string(),
      })
    )
  ),
});

/**
 * Batch ingest Louisiana Leader Handbook content into RAG
 *
 * Focuses on coaching questions and evidence examples which transfer
 * well to teacher coaching conversations.
 */
export const batchIngestLeaderHandbook = action({
  args: {
    /** Indicator explanations with coaching questions and evidence examples */
    indicatorExplanations: v.array(leaderIndicatorExplanationValidator),
    /** Adult learning principles */
    adultLearningPrinciples: v.optional(v.array(adultLearningPrincipleValidator)),
    /** LEADS system overview for leaders */
    leadsSystem: v.optional(leadsSystemValidator),
    /** Rubric metadata */
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

    // Ingest coaching questions from each indicator explanation
    // These go to louisiana_rubric_coaching with LEADER_ prefix to distinguish from LER
    for (const explanation of args.indicatorExplanations) {
      // 1. Ingest coaching questions chunk
      if (explanation.coachingQuestions.length > 0) {
        try {
          const coachingChunk = formatLeaderCoachingQuestionsForRAG(explanation);
          await rag.add(ctx, {
            namespace: "louisiana_rubric_coaching",
            text: coachingChunk,
            filterValues: [
              { name: "contentType", value: "coaching_questions" },
              { name: "subject", value: "all" },
              { name: "gradeLevel", value: "all" },
              { name: "standardCode", value: `LEADER_${explanation.indicatorCode}_COACHING` },
              { name: "cognitiveDepth", value: "application" },
              { name: "userId", value: "system" },
            ],
          });
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            code: `LEADER_${explanation.indicatorCode}_COACHING`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // 2. Ingest evidence examples chunk (useful for grounding conversations)
      if (explanation.evidenceExamples.length > 0) {
        try {
          const evidenceChunk = formatLeaderEvidenceExamplesForRAG(explanation);
          await rag.add(ctx, {
            namespace: "louisiana_rubric_coaching",
            text: evidenceChunk,
            filterValues: [
              { name: "contentType", value: "coaching_questions" }, // Use same type for searchability
              { name: "subject", value: "all" },
              { name: "gradeLevel", value: "all" },
              { name: "standardCode", value: `LEADER_${explanation.indicatorCode}_EVIDENCE` },
              { name: "cognitiveDepth", value: "application" },
              { name: "userId", value: "system" },
            ],
          });
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            code: `LEADER_${explanation.indicatorCode}_EVIDENCE`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    // Ingest adult learning principles as a single chunk
    if (args.adultLearningPrinciples && args.adultLearningPrinciples.length > 0) {
      try {
        const principlesChunk = formatAdultLearningPrinciplesForRAG(
          args.adultLearningPrinciples
        );
        await rag.add(ctx, {
          namespace: "louisiana_rubric_coaching",
          text: principlesChunk,
          filterValues: [
            { name: "contentType", value: "coaching_questions" },
            { name: "subject", value: "all" },
            { name: "gradeLevel", value: "all" },
            { name: "standardCode", value: "ADULT_LEARNING_PRINCIPLES" },
            { name: "cognitiveDepth", value: "synthesis" },
            { name: "userId", value: "system" },
          ],
        });
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          code: "ADULT_LEARNING_PRINCIPLES",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Ingest LEADS leadership beliefs (valuable for professional growth conversations)
    if (args.leadsSystem?.leadershipBeliefs && args.leadsSystem.leadershipBeliefs.length > 0) {
      try {
        const beliefsChunk = formatLeadershipBeliefsForRAG(args.leadsSystem);
        await rag.add(ctx, {
          namespace: "louisiana_rubric_coaching",
          text: beliefsChunk,
          filterValues: [
            { name: "contentType", value: "coaching_questions" },
            { name: "subject", value: "all" },
            { name: "gradeLevel", value: "all" },
            { name: "standardCode", value: "LEADERSHIP_BELIEFS" },
            { name: "cognitiveDepth", value: "synthesis" },
            { name: "userId", value: "system" },
          ],
        });
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          code: "LEADERSHIP_BELIEFS",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Calculate totals
    const coachingCount = args.indicatorExplanations.filter(
      (e) => e.coachingQuestions.length > 0
    ).length;
    const evidenceCount = args.indicatorExplanations.filter(
      (e) => e.evidenceExamples.length > 0
    ).length;
    const principlesCount = args.adultLearningPrinciples ? 1 : 0;
    const beliefsCount = args.leadsSystem?.leadershipBeliefs ? 1 : 0;

    return {
      total: coachingCount + evidenceCount + principlesCount + beliefsCount,
      successCount,
      errorCount,
      errors: errors.slice(0, 10),
      breakdown: {
        coachingQuestions: coachingCount,
        evidenceExamples: evidenceCount,
        adultLearningPrinciples: principlesCount,
        leadershipBeliefs: beliefsCount,
      },
    };
  },
});

/**
 * Format leader coaching questions for RAG
 *
 * These questions model effective coaching conversations and can inform
 * how Pelican asks follow-up questions to teachers.
 */
function formatLeaderCoachingQuestionsForRAG(explanation: {
  indicatorCode: string;
  indicatorName: string;
  indicatorNumber: string;
  domain: string;
  coachingQuestions: string[];
}): string {
  const parts: string[] = [];

  // Header that frames these as coaching models
  parts.push(`Louisiana Coaching Questions - ${explanation.domain.replace(/_/g, " ")}`);
  parts.push(`Topic: ${explanation.indicatorCode} - ${explanation.indicatorName}`);
  parts.push("");
  parts.push(
    "These research-based coaching questions model how to have reflective conversations:"
  );
  parts.push("");

  explanation.coachingQuestions.forEach((question, i) => {
    parts.push(`${i + 1}. ${question}`);
  });

  parts.push("");
  parts.push(
    "Use these question patterns to guide conversations - ask about process, invite reflection, assume competence."
  );

  return parts.join("\n");
}

/**
 * Format leader evidence examples for RAG
 *
 * Evidence examples help ground coaching conversations in real artifacts
 * teachers and leaders would recognize.
 */
function formatLeaderEvidenceExamplesForRAG(explanation: {
  indicatorCode: string;
  indicatorName: string;
  indicatorNumber: string;
  domain: string;
  evidenceExamples: string[];
}): string {
  const parts: string[] = [];

  parts.push(`Louisiana Evidence Examples - ${explanation.domain.replace(/_/g, " ")}`);
  parts.push(`Topic: ${explanation.indicatorCode} - ${explanation.indicatorName}`);
  parts.push("");
  parts.push("Examples of evidence/artifacts that demonstrate this practice:");
  parts.push("");

  explanation.evidenceExamples.forEach((example) => {
    parts.push(`• ${example}`);
  });

  parts.push("");
  parts.push(
    "Reference these concrete examples when discussing evidence or documentation with educators."
  );

  return parts.join("\n");
}

/**
 * Format adult learning principles for RAG
 *
 * These principles inform HOW to coach - applicable to any coaching conversation.
 */
function formatAdultLearningPrinciplesForRAG(
  principles: Array<{ principle: string; description: string }>
): string {
  const parts: string[] = [];

  parts.push("Louisiana Adult Learning Principles for Coaching");
  parts.push("");
  parts.push(
    "Apply these research-based principles when coaching Louisiana educators:"
  );
  parts.push("");

  principles.forEach((p, i) => {
    parts.push(`${i + 1}. ${p.principle.toUpperCase()}`);
    parts.push(`   ${p.description}`);
    parts.push("");
  });

  parts.push(
    "These principles ensure coaching conversations respect educator expertise and connect to their practice."
  );

  return parts.join("\n");
}

/**
 * Format leadership beliefs for RAG
 *
 * These core beliefs inform professional growth conversations.
 */
function formatLeadershipBeliefsForRAG(leadsSystem: {
  name: string;
  leadershipBeliefs?: string[];
}): string {
  const parts: string[] = [];

  parts.push("Louisiana Leadership Beliefs (LEADS System)");
  parts.push("");
  parts.push("Core beliefs that inform Louisiana's approach to educator development:");
  parts.push("");

  leadsSystem.leadershipBeliefs?.forEach((belief, i) => {
    parts.push(`${i + 1}. ${belief}`);
  });

  parts.push("");
  parts.push(
    "Reference these beliefs when discussing professional growth, improvement, and evaluation."
  );

  return parts.join("\n");
}
