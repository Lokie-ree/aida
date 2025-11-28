/**
 * ✅ ACTIVE - Used in production
 * Workflow for bulk ingestion of Louisiana Student Standards
 * 
 * Orchestrates durable, retry-safe bulk ingestion with rate limiting
 * Processes standards in batches to avoid timeouts and rate limit issues
 */

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { workflow } from "./workflows";

/**
 * Workflow step: Process a batch of standards
 * 
 * This step is called repeatedly by the workflow to process standards in batches.
 * Each batch is small (50 standards) to avoid timeouts and respect rate limits.
 */
export const processStandardsBatch: ReturnType<typeof internalAction> = internalAction({
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
    // Call the batch action
    return await ctx.runAction(internal.populateStandards.addStandardsBatch, {
      standards: args.standards,
    });
  },
});

/**
 * Main workflow: Populate standards from JSON
 * 
 * Orchestrates bulk ingestion by:
 * 1. Parsing JSON to get all standards
 * 2. Splitting into batches (50 standards per batch)
 * 3. Processing each batch with retry logic
 * 4. Aggregating results
 */
export const populateStandardsFromJsonWorkflow = workflow.define({
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
    subject: v.union(
      v.literal("ela"),
      v.literal("math"),
      v.literal("science"),
      v.literal("social_studies")
    ),
  },
  returns: v.object({
    totalStandards: v.number(),
    addedCount: v.number(),
    errorCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (step, args): Promise<{
    totalStandards: number;
    addedCount: number;
    errorCount: number;
    errors: string[];
  }> => {
    const BATCH_SIZE = 50; // Process 50 standards per batch
    const batches: typeof args.standards[] = [];

    // Split standards into batches
    for (let i = 0; i < args.standards.length; i += BATCH_SIZE) {
      batches.push(args.standards.slice(i, i + BATCH_SIZE));
    }

    let totalAdded = 0;
    const allErrors: string[] = [];

    // Process each batch with retry logic (handled by workflow)
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // Use step.runAction for durable, retry-safe processing
      const result = await step.runAction(
        internal.populateStandardsWorkflow.processStandardsBatch,
        {
          standards: batch,
        },
        {
          name: `Process Batch ${i + 1}/${batches.length}`,
          retry: {
            maxAttempts: 3,
            initialBackoffMs: 2000,
            base: 2,
          },
        }
      );

      totalAdded += result.addedCount;
      allErrors.push(...result.errors);
    }

    return {
      totalStandards: args.standards.length,
      addedCount: totalAdded,
      errorCount: allErrors.length,
      errors: allErrors,
    };
  },
});

/**
 * Action to start the workflow from JSON content
 * 
 * Parses JSON first, then starts the workflow with parsed standards
 */
export const startPopulateStandardsWorkflow: ReturnType<typeof internalAction> = internalAction({
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
    workflowId: v.string(),
  }),
  handler: async (ctx, args): Promise<{ workflowId: string }> => {
    // Parse JSON first to validate
    const { parseLSSJSON } = await import("./lssJsonParser");
    const standards = parseLSSJSON(args.jsonContent);

    if (standards.length === 0) {
      throw new Error("No standards found in JSON content");
    }

    // Start workflow
    const workflowId: string = await workflow.start(
      ctx,
      internal.populateStandardsWorkflow.populateStandardsFromJsonWorkflow,
      {
        standards,
        subject: args.subject,
      }
    );

    return { workflowId };
  },
});

