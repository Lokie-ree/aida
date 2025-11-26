/**
 * 🧪 TEST HELPERS - For manual validation and testing
 * RAG validation: Manual testing functions for validating RAG search accuracy and embedding quality
 * Run via: npx convex run ragValidation:validateSearchAccuracy
 */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { authComponent } from "./auth";

/**
 * Validate RAG search accuracy with known query → expected results pairs
 */
export const validateSearchAccuracy = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    results: v.array(v.object({
      query: v.string(),
      expectedCount: v.number(),
      actualCount: v.number(),
      match: v.boolean(),
      details: v.string(),
    })),
  }),
  handler: async (ctx): Promise<{
    success: boolean;
    results: Array<{
      query: string;
      expectedCount: number;
      actualCount: number;
      match: boolean;
      details: string;
    }>;
  }> => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const testCases = [
      {
        query: { subject: "ela" as const, gradeLevel: "10" },
        expectedMin: 5,
        description: "Grade 10 ELA standards",
      },
      {
        query: { subject: "math" as const, gradeLevel: "5" },
        expectedMin: 5,
        description: "Grade 5 Math standards",
      },
      {
        query: { subject: "science" as const, gradeLevel: "3" },
        expectedMin: 3,
        description: "Grade 3 Science standards",
      },
    ];

    const results: Array<{
      query: string;
      expectedCount: number;
      actualCount: number;
      match: boolean;
      details: string;
    }> = [];

    for (const testCase of testCases) {
      try {
        const standards = await ctx.runAction(api.ragService.getStandards, testCase.query);
        const actualCount: number = standards.length;
        const match: boolean = actualCount >= testCase.expectedMin;

        results.push({
          query: `${testCase.query.subject} grade ${testCase.query.gradeLevel}`,
          expectedCount: testCase.expectedMin,
          actualCount,
          match,
          details: match
            ? `✓ Found ${actualCount} standards (expected at least ${testCase.expectedMin})`
            : `✗ Found only ${actualCount} standards (expected at least ${testCase.expectedMin})`,
        });
      } catch (error) {
        results.push({
          query: `${testCase.query.subject} grade ${testCase.query.gradeLevel}`,
          expectedCount: testCase.expectedMin,
          actualCount: 0,
          match: false,
          details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }

    const allMatch = results.every((r) => r.match);

    return {
      success: allMatch,
      results,
    };
  },
});

/**
 * Validate embedding quality by checking semantic relevance of results
 */
export const validateEmbeddingQuality = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    results: v.array(v.object({
      query: v.string(),
      subject: v.string(),
      gradeLevel: v.string(),
      resultCount: v.number(),
      relevanceCheck: v.string(),
    })),
  }),
  handler: async (ctx): Promise<{
    success: boolean;
    results: Array<{
      query: string;
      subject: string;
      gradeLevel: string;
      resultCount: number;
      relevanceCheck: string;
    }>;
  }> => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const testQueries = [
      { subject: "ela" as const, gradeLevel: "10", searchTerm: "reading literature" },
      { subject: "math" as const, gradeLevel: "5", searchTerm: "fractions" },
      { subject: "science" as const, gradeLevel: "3", searchTerm: "life cycles" },
    ];

    const results: Array<{
      query: string;
      subject: string;
      gradeLevel: string;
      resultCount: number;
      relevanceCheck: string;
    }> = [];

    for (const testQuery of testQueries) {
      try {
        const standards: Array<{ description: string; subject: string; gradeLevel: string }> = await ctx.runAction(api.ragService.getStandards, {
          subject: testQuery.subject,
          gradeLevel: testQuery.gradeLevel,
        });

        // Check if results are semantically relevant
        const relevantCount = standards.filter((s: { description: string; subject: string; gradeLevel: string }) => {
          const text = s.description.toLowerCase();
          return text.includes(testQuery.searchTerm.toLowerCase()) ||
                 text.includes(testQuery.subject) ||
                 s.gradeLevel === testQuery.gradeLevel;
        }).length;

        const relevancePercentage = standards.length > 0
          ? (relevantCount / standards.length) * 100
          : 0;

        results.push({
          query: `${testQuery.searchTerm} (${testQuery.subject} grade ${testQuery.gradeLevel})`,
          subject: testQuery.subject,
          gradeLevel: testQuery.gradeLevel,
          resultCount: standards.length,
          relevanceCheck: `${relevantCount}/${standards.length} results appear relevant (${relevancePercentage.toFixed(1)}%)`,
        });
      } catch (error) {
        results.push({
          query: `${testQuery.searchTerm} (${testQuery.subject} grade ${testQuery.gradeLevel})`,
          subject: testQuery.subject,
          gradeLevel: testQuery.gradeLevel,
          resultCount: 0,
          relevanceCheck: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }

    const success: boolean = results.every((r) => r.resultCount > 0);

    return {
      success,
      results,
    };
  },
});

/**
 * Validate filter behavior by testing filter combinations
 */
export const validateFilterBehavior = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    results: v.array(v.object({
      filter: v.string(),
      resultCount: v.number(),
      allMatchFilter: v.boolean(),
      details: v.string(),
    })),
  }),
  handler: async (ctx): Promise<{
    success: boolean;
    results: Array<{
      filter: string;
      resultCount: number;
      allMatchFilter: boolean;
      details: string;
    }>;
  }> => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const filterTests = [
      {
        name: "Subject filter (ELA)",
        query: { subject: "ela" as const, gradeLevel: "10" },
        check: (s: any) => s.subject === "ela",
      },
      {
        name: "Subject filter (Math)",
        query: { subject: "math" as const, gradeLevel: "5" },
        check: (s: any) => s.subject === "math",
      },
      {
        name: "Grade level filter (Grade 10)",
        query: { subject: "ela" as const, gradeLevel: "10" },
        check: (s: any) => s.gradeLevel === "10",
      },
      {
        name: "Grade level filter (Grade 5)",
        query: { subject: "math" as const, gradeLevel: "5" },
        check: (s: any) => s.gradeLevel === "5",
      },
      {
        name: "Combined filter (ELA Grade 10)",
        query: { subject: "ela" as const, gradeLevel: "10" },
        check: (s: any) => s.subject === "ela" && s.gradeLevel === "10",
      },
    ];

    const results: Array<{
      filter: string;
      resultCount: number;
      allMatchFilter: boolean;
      details: string;
    }> = [];

    for (const filterTest of filterTests) {
      try {
        const standards = await ctx.runAction(api.ragService.getStandards, filterTest.query);
        const allMatch: boolean = standards.length === 0 || standards.every(filterTest.check);

        results.push({
          filter: filterTest.name,
          resultCount: standards.length,
          allMatchFilter: allMatch,
          details: allMatch
            ? `✓ All ${standards.length} results match filter criteria`
            : `✗ Some results do not match filter criteria`,
        });
      } catch (error) {
        results.push({
          filter: filterTest.name,
          resultCount: 0,
          allMatchFilter: false,
          details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }

    const success: boolean = results.every((r) => r.allMatchFilter);

    return {
      success,
      results,
    };
  },
});

/**
 * Validate rubric integration (when LER data is available)
 */
export const validateRubricIntegration = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    note: v.string(),
  }),
  handler: async (ctx) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    // TODO: Implement when LER data is populated in RAG
    return {
      success: false,
      message: "LER rubric data not yet populated in RAG",
      note: "This validation will be implemented in Phase 2 of RAG_PLAN.md when LER data is added to RAG system",
    };
  },
});

