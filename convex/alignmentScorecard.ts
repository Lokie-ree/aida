import { v } from "convex/values";
import { workflow } from "./workflows";
import { internal } from "./_generated/api";

/**
 * Alignment Scorecard Workflow - Core Flare #1
 * 
 * **We're Not Waiting for LDOE:** Louisiana educators need confidence that their
 * AI-generated content actually meets state standards NOW, not when official guidance arrives.
 * This is the #1 pain point: "Is this quiz any good? Does it ACTUALLY test the Louisiana standard?"
 * 
 * Built by Louisiana educators, for Louisiana educators. This is your quality-keeper and
 * confidence-builder - platform-agnostic analysis that works with ANY AI tool you already use.
 * 
 * Orchestrates multi-step analysis of AI-generated content against Louisiana Standards:
 * 1. Retrieve relevant Louisiana Standards from RAG
 * 2. Analyze content against standards using Agent
 * 3. Generate structured scorecard
 * 4. Save results to database
 * 
 * **Grassroots Launch:** ALL 5 initial users should try this feature - it's the core value.
 */

export const analyzeContentAlignment = workflow.define({
  args: {
    userId: v.string(),
    content: v.string(),
    gradeLevel: v.string(),
    subject: v.union(
      v.literal("ela"),
      v.literal("math"),
      v.literal("science"),
      v.literal("social_studies")
    ),
    standardCodes: v.optional(v.array(v.string())),
  },
  returns: v.object({
    overallScore: v.number(),
    breakdown: v.array(v.any()),
    gaps: v.array(v.string()),
    recommendations: v.array(v.string()),
  }),
  handler: async (step, args): Promise<{
    overallScore: number;
    breakdown: any[];
    gaps: string[];
    recommendations: string[];
  }> => {
    // Step 1: Retrieve relevant Louisiana Standards from RAG
    const standards = await step.runAction(
      internal.alignmentSteps.retrieveStandards,
      {
        gradeLevel: args.gradeLevel,
        subject: args.subject,
        standardCodes: args.standardCodes,
      },
      {
        name: "Retrieve Louisiana Standards",
        retry: true, // Retry on transient RAG errors
      }
    );

    // Step 2: Analyze content against standards using Agent
    const analysis = await step.runAction(
      internal.alignmentSteps.analyzeWithAgent,
      {
        content: args.content,
        standards: standards,
      },
      {
        name: "Analyze Content Alignment",
        retry: {
          maxAttempts: 5,
          initialBackoffMs: 2000,
          base: 2,
        }, // More retries for LLM calls
      }
    );

    // Step 3: Generate structured scorecard
    const scorecard = await step.runAction(
      internal.alignmentSteps.generateScorecard,
      {
        analysis: analysis,
        standards: standards,
        content: args.content,
      },
      {
        name: "Generate Alignment Scorecard",
        retry: true,
      }
    );

    // Step 4: Save results to database
    await step.runMutation(
      internal.alignmentSteps.saveAnalysis,
      {
        userId: args.userId,
        content: args.content,
        scorecard: scorecard,
        gradeLevel: args.gradeLevel,
        subject: args.subject,
      },
      {
        name: "Save Analysis Results",
      }
    );

    return scorecard;
  },
});

