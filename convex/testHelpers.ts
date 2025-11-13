import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { authComponent } from "./auth";

async function getAuthUserId(ctx: any): Promise<string | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}

/**
 * Test Helpers for Alignment Scorecard POC
 * 
 * These functions help test and debug the Alignment Scorecard workflow.
 */

/**
 * Add sample Louisiana Standards to RAG for testing
 */
export const addTestStandards = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    addedCount: v.number(),
  }),
  handler: async (ctx): Promise<{
    success: boolean;
    addedCount: number;
  }> => {
    const testStandards = [
      {
        standardCode: "LA.ELA.10.1",
        gradeLevel: "10",
        subject: "ela",
        standardText: "Cite strong and thorough textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.",
        cognitiveDepth: "application" as const,
      },
      {
        standardCode: "LA.ELA.10.2",
        gradeLevel: "10",
        subject: "ela",
        standardText: "Determine a theme or central idea of a text and analyze in detail its development over the course of the text, including how it emerges and is shaped and refined by specific details.",
        cognitiveDepth: "synthesis" as const,
      },
      {
        standardCode: "LA.ELA.10.3",
        gradeLevel: "10",
        subject: "ela",
        standardText: "Analyze how complex characters develop over the course of a text, interact with other characters, and advance the plot or develop the theme.",
        cognitiveDepth: "application" as const,
      },
      {
        standardCode: "LA.MATH.10.1",
        gradeLevel: "10",
        subject: "math",
        standardText: "Use properties of rational and irrational numbers to solve problems.",
        cognitiveDepth: "application" as const,
      },
      {
        standardCode: "LA.MATH.10.2",
        gradeLevel: "10",
        subject: "math",
        standardText: "Interpret expressions that represent a quantity in terms of its context.",
        cognitiveDepth: "synthesis" as const,
      },
    ];

    const result: {
      success: boolean;
      addedCount: number;
      errors: string[];
    } = await ctx.runAction(
      api.populateStandards.populateStandardsFromData,
      {
        standards: testStandards,
      }
    );

    return {
      success: result.success,
      addedCount: result.addedCount,
    };
  },
});

/**
 * Test the full Alignment Scorecard workflow with sample content
 */
export const testAlignmentScorecard = action({
  args: {
    content: v.optional(v.string()),
    gradeLevel: v.optional(v.string()),
    subject: v.optional(
      v.union(
        v.literal("ela"),
        v.literal("math"),
        v.literal("science"),
        v.literal("social_studies")
      )
    ),
  },
  returns: v.object({
    workflowId: v.string(),
    status: v.any(),
  }),
  handler: async (ctx, args): Promise<{
    workflowId: string;
    status: any;
  }> => {
    // Default test content
    const sampleContent =
      args.content ||
      `
Quiz: Reading Comprehension - Theme Analysis

1. What is the main theme of the passage?
   a) Friendship
   b) Betrayal
   c) Redemption
   d) Justice

2. Which quote from the text best supports your answer to question 1?
   a) "He looked at her with suspicion"
   b) "They had been friends since childhood"
   c) "The truth would come out eventually"
   d) "Justice must be served"

3. Based on the text, what can you infer about the main character's motivation?
   a) They seek revenge
   b) They want to protect their family
   c) They are driven by justice
   d) They are confused about their purpose

4. How does the author develop the theme throughout the passage?
   [Short answer question requiring analysis]
`;

    const gradeLevel = args.gradeLevel || "10";
    const subject = args.subject || "ela";

    // Start the workflow
    const { workflowId }: { workflowId: string } = await ctx.runAction(
      api.rag.analyzeContentAlignment,
      {
        content: sampleContent,
        gradeLevel,
        subject,
      }
    );

    console.log("Workflow started:", workflowId);

    // Poll for completion (in production, use reactive queries)
    let status: any;
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds max

    do {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      status = await ctx.runQuery(api.rag.getAlignmentStatus, { workflowId });
      attempts++;
      const statusType = (status as any)?.type || "unknown";
      console.log(`Attempt ${attempts}:`, statusType);
    } while (
      (status as any)?.type === "inProgress" &&
      attempts < maxAttempts
    );

    return {
      workflowId,
      status,
    };
  },
});

/**
 * Get recent alignment analyses for the current user
 */
export const getRecentAnalyses = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("alignmentAnalyses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

/**
 * Test RAG search for standards (without full workflow)
 */
export const testRAGSearch = action({
  args: {
    gradeLevel: v.string(),
    subject: v.string(),
  },
  returns: v.object({
    results: v.array(v.any()),
    count: v.number(),
  }),
  handler: async (ctx, args): Promise<{
    results: any[];
    count: number;
  }> => {
    const standards: Array<{
      code: string;
      text: string;
      cognitiveDepth?: "recall" | "application" | "synthesis";
    }> = await ctx.runAction(
      internal.alignmentSteps.retrieveStandards,
      {
        gradeLevel: args.gradeLevel,
        subject: args.subject,
      }
    );

    return {
      results: standards,
      count: standards.length,
    };
  },
});

/**
 * Full integration test - populates standards and tests workflow
 */
export const fullIntegrationTest = action({
  args: {},
  returns: v.object({
    standardsPopulated: v.boolean(),
    testResults: v.array(v.any()),
  }),
  handler: async (ctx): Promise<{
    standardsPopulated: boolean;
    testResults: any[];
  }> => {
    // 1. Populate test standards
    const populateResult: {
      success: boolean;
      addedCount: number;
    } = await ctx.runAction(api.testHelpers.addTestStandards, {});
    console.log("Standards populated:", populateResult);

    // 2. Test with sample content
    const testResult: {
      workflowId: string;
      status: any;
    } = await ctx.runAction(api.testHelpers.testAlignmentScorecard, {
      content: `
Lesson Plan: Analyzing Theme in Literature

Objective: Students will identify and analyze themes in selected texts.

Activities:
1. Read chapter 5 of "To Kill a Mockingbird"
2. Answer comprehension questions about theme
3. Write a paragraph analyzing how the theme develops
4. Compare themes across multiple texts

Assessment:
- Multiple choice questions about theme identification
- Short answer questions requiring textual evidence
- Essay analyzing theme development
`,
      gradeLevel: "10",
      subject: "ela",
    });

    return {
      standardsPopulated: populateResult.success,
      testResults: [testResult],
    };
  },
});

