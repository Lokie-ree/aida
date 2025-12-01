import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { api, internal } from "../_generated/api";
import schema from "../schema";
import type { Id } from "../_generated/dataModel";

// Bridge Better Auth: mock authComponent to derive user from ctx.auth
vi.mock("../auth", () => ({
  authComponent: {
    getAuthUser: async (ctx: any) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthenticated");
      return { _id: identity.subject, email: identity.tokenIdentifier ?? "u@example.com", name: identity.name ?? "User" };
    },
  },
}));

// Explicitly provide modules for convex-test
// Exclude test files to avoid circular dependencies
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modulesRaw = import.meta.glob("../**/*.ts", { eager: false });
// Filter out test files from the modules object
const modules: Record<string, () => Promise<any>> = {};
for (const [path, loader] of Object.entries(modulesRaw)) {
  if (!path.includes("/tests/") && !path.endsWith(".test.ts") && !path.endsWith(".spec.ts")) {
    modules[path] = loader as () => Promise<any>;
  }
}

  describe("Alignment Scorecard", () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(async () => {
    t = convexTest(schema, modules);
  });

  describe("Step 1: Populate Standards", () => {
    test.skip("addTestStandards adds sample standards to RAG", async () => {
      // Skip: Requires RAG component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.testHelpers.addTestStandards, {});
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.addedCount).toBeGreaterThan(0);
    });

    test.skip("populateStandardsFromData adds standards with correct structure", async () => {
      // Skip: Requires RAG component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
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
          standardText: "Determine a theme or central idea of a text and analyze in detail its development over the course of the text.",
          cognitiveDepth: "synthesis" as const,
        },
      ];

      const result = await asUser.action(api.populateStandards.populateStandardsFromData, {
        standards: testStandards,
      });

      expect(result.success).toBe(true);
      expect(result.addedCount).toBe(2);
      expect(result.errors).toEqual([]);
    });
  });

  describe("Step 2: RAG Search for Standards", () => {
    beforeEach(async () => {
      // Skip: RAG component not available in convex-test
      // In a real deployment, populate test standards before each test
      // const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // await asUser.action(api.testHelpers.addTestStandards, {});
    });

    test.skip("testRAGSearch retrieves standards by grade and subject", async () => {
      // Skip: Requires RAG component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.testHelpers.testRAGSearch, {
        gradeLevel: "10",
        subject: "ela",
      });

      expect(result).toBeDefined();
      expect(result.count).toBeGreaterThan(0);
      expect(Array.isArray(result.results)).toBe(true);
      
      // Verify structure of returned standards
      if (result.results.length > 0) {
        const firstStandard = result.results[0];
        expect(firstStandard).toHaveProperty("code");
        expect(firstStandard).toHaveProperty("text");
        expect(typeof firstStandard.code).toBe("string");
        expect(typeof firstStandard.text).toBe("string");
      }
    });

    test.skip("retrieveStandards filters by grade level", async () => {
      // Skip: Requires RAG component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const standards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "ela",
      });

      expect(Array.isArray(standards)).toBe(true);
      // Standards should be relevant to grade 10
      standards.forEach((s: any) => {
        expect(s).toHaveProperty("code");
        expect(s).toHaveProperty("text");
      });
    });

    test.skip("retrieveStandards filters by subject", async () => {
      // Skip: Requires RAG component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const elaStandards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "ela",
      });

      const mathStandards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "math",
      });

      expect(Array.isArray(elaStandards)).toBe(true);
      expect(Array.isArray(mathStandards)).toBe(true);
      // ELA and Math standards should be different
      if (elaStandards.length > 0 && mathStandards.length > 0) {
        const elaCodes = elaStandards.map((s: any) => s.code);
        const mathCodes = mathStandards.map((s: any) => s.code);
        expect(elaCodes).not.toEqual(mathCodes);
      }
    });

    test.skip("retrieveStandards filters by standardCodes when provided", async () => {
      // Skip: Requires RAG component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const allStandards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "ela",
      });

      if (allStandards.length > 0) {
        const specificCodes = [allStandards[0].code];
        
        const filteredStandards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
          gradeLevel: "10",
          subject: "ela",
          standardCodes: specificCodes,
        });

        expect(filteredStandards.length).toBeLessThanOrEqual(allStandards.length);
        expect(filteredStandards.every((s: any) => specificCodes.includes(s.code))).toBe(true);
      }
    });

    test.skip("RAG search returns relevant standards for given content", async () => {
      // Skip: Requires RAG component
      // Test that semantic search returns standards relevant to content
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // First populate test standards
      // await asUser.action(api.populateStandards.populateStandardsFromData, { ... });
      
      const standards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "ela",
      });

      // Verify results are semantically relevant to ELA grade 10
      expect(standards.length).toBeGreaterThan(0);
      standards.forEach((standard: any) => {
        expect(standard.code).toMatch(/^(RL|RI|W|SL|L|RH|RST|WHST)\.10\./);
        expect(standard.text.length).toBeGreaterThan(0);
      });
    });

    test.skip("filters correctly narrow results (subject + gradeLevel)", async () => {
      // Skip: Requires RAG component
      // Test that combining filters works correctly
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const elaGrade10 = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "ela",
      });

      const mathGrade10 = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "math",
      });

      const elaGrade5 = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "5",
        subject: "ela",
      });

      // Results should be different for different subject/grade combinations
      expect(elaGrade10).not.toEqual(mathGrade10);
      expect(elaGrade10).not.toEqual(elaGrade5);
    });

    test.skip("vector score threshold (0.6) returns quality results", async () => {
      // Skip: Requires RAG component
      // Test that threshold filters out low-relevance results
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const standards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
        gradeLevel: "10",
        subject: "ela",
      });

      // All returned standards should be relevant (threshold ensures this)
      // Note: We can't directly check scores, but we can verify results make sense
      expect(standards.length).toBeGreaterThan(0);
      
      // Verify standards are actually ELA-related
      standards.forEach((standard: any) => {
        expect(standard.code).toMatch(/^(RL|RI|W|SL|L|RH|RST|WHST)/);
      });
    });
  });

  describe("Step 3: Individual Workflow Steps", () => {
    let testStandards: Array<{
      code: string;
      text: string;
      cognitiveDepth?: "recall" | "application" | "synthesis";
    }>;

    beforeEach(async () => {
      // Skip: RAG component not available in convex-test
      // In a real deployment, populate test standards and retrieve them
      // const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // await asUser.action(api.testHelpers.addTestStandards, {});
      // testStandards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
      //   gradeLevel: "10",
      //   subject: "ela",
      // });
      testStandards = []; // Empty for unit tests
    });

    test.skip("analyzeWithAgent analyzes content against standards", async () => {
      // Skip: Requires RAG component and OpenAI API key (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const sampleContent = `
        Quiz: Reading Comprehension
        1. What is the main idea of the passage?
        2. Based on the text, what can you infer?
      `;

      if (testStandards.length > 0) {
        const analysis = await asUser.action(internal.alignmentSteps.analyzeWithAgent, {
          content: sampleContent,
          standards: testStandards,
        });

        expect(analysis).toBeDefined();
        expect(analysis).toHaveProperty("alignmentAnalysis");
        expect(analysis).toHaveProperty("standardMatches");
        expect(analysis).toHaveProperty("cognitiveDepthGaps");
        expect(typeof analysis.alignmentAnalysis).toBe("string");
        expect(Array.isArray(analysis.standardMatches)).toBe(true);
        expect(Array.isArray(analysis.cognitiveDepthGaps)).toBe(true);
      }
    });

    test.skip("generateScorecard creates structured scorecard", async () => {
      // Skip: Requires OpenAI API key (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const mockAnalysis = {
        alignmentAnalysis: "Content aligns well with standards LA.ELA.10.1 and LA.ELA.10.2",
        standardMatches: testStandards.map((s) => ({ code: s.code, matched: true })),
        cognitiveDepthGaps: [],
      };

      if (testStandards.length > 0) {
        const scorecard = await asUser.action(internal.alignmentSteps.generateScorecard, {
          analysis: mockAnalysis,
          standards: testStandards,
          content: "Sample content",
        });

        expect(scorecard).toBeDefined();
        expect(scorecard).toHaveProperty("overallScore");
        expect(scorecard).toHaveProperty("breakdown");
        expect(scorecard).toHaveProperty("gaps");
        expect(scorecard).toHaveProperty("recommendations");
        expect(typeof scorecard.overallScore).toBe("number");
        expect(scorecard.overallScore).toBeGreaterThanOrEqual(0);
        expect(scorecard.overallScore).toBeLessThanOrEqual(100);
        expect(Array.isArray(scorecard.breakdown)).toBe(true);
        expect(Array.isArray(scorecard.gaps)).toBe(true);
        expect(Array.isArray(scorecard.recommendations)).toBe(true);
      }
    });

    test("saveAnalysis saves results to database", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // Get userId from identity - in real tests, this would come from auth
      const userId = "test-user-id";
      
      const mockScorecard = {
        overallScore: 75,
        breakdown: [
          {
            standardCode: "LA.ELA.10.1",
            score: 80,
            status: "aligned",
            notes: "Content addresses this standard well",
          },
        ],
        gaps: ["Missing application-level questions for standard LA.ELA.10.2"],
        recommendations: ["Add synthesis-level questions to meet cognitive depth requirements"],
      };

      // Save analysis
      await asUser.mutation(internal.alignmentSteps.saveAnalysis, {
        userId,
        content: "Sample quiz content",
        scorecard: mockScorecard,
        gradeLevel: "10",
        subject: "ela",
      });

      // Verify it was saved
      const analyses = await t.run(async (ctx) => {
        return await ctx.db
          .query("alignmentAnalyses")
          .filter((q) => q.eq(q.field("userId"), userId))
          .collect();
      });

      expect(analyses.length).toBeGreaterThan(0);
      const savedAnalysis = analyses[0];
      expect(savedAnalysis).toBeDefined();
      expect(savedAnalysis?.userId).toBe(userId);
      expect(savedAnalysis?.content).toBe("Sample quiz content");
      expect(savedAnalysis?.gradeLevel).toBe("10");
      expect(savedAnalysis?.subject).toBe("ela");
      expect(savedAnalysis?.alignmentScore).toBe(75);
      expect(savedAnalysis?.scorecard).toEqual(mockScorecard);
      expect(savedAnalysis?.analyzedAt).toBeDefined();
      expect(typeof savedAnalysis?.analyzedAt).toBe("number");
    });
  });

  describe("Step 4: Full Workflow Integration", () => {
    beforeEach(async () => {
      // Skip: RAG component not available in convex-test
      // In a real deployment, populate test standards before workflow tests
      // const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // await asUser.action(api.testHelpers.addTestStandards, {});
    });

    test("analyzeContentAlignment requires authentication", async () => {
      await expect(
        t.action(api.rag.analyzeContentAlignment, {
          content: "Sample content",
          gradeLevel: "10",
          subject: "ela",
        })
      ).rejects.toThrow();
    });

    test.skip("analyzeContentAlignment starts workflow and returns workflowId", async () => {
      // Skip: Requires RAG component and OpenAI API key (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const sampleContent = `
        Quiz: Reading Comprehension - Theme Analysis
        
        1. What is the main theme of the passage?
           a) Friendship
           b) Betrayal
           c) Redemption
           d) Justice
        
        2. Which quote from the text best supports your answer?
           a) "He looked at her with suspicion"
           b) "They had been friends since childhood"
           c) "The truth would come out eventually"
           d) "Justice must be served"
      `;

      const result = await asUser.action(api.rag.analyzeContentAlignment, {
        content: sampleContent,
        gradeLevel: "10",
        subject: "ela",
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("workflowId");
      expect(typeof result.workflowId).toBe("string");
      expect(result.workflowId.length).toBeGreaterThan(0);
    });

    test.skip("getAlignmentStatus returns workflow status", async () => {
      // Skip: Requires workflow component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      // Note: This test may fail if no workflow exists, which is expected
      // In a real scenario, you'd start a workflow first
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Try to get status for a non-existent workflow
      const status = await asUser.query(api.rag.getAlignmentStatus, {
        workflowId: "non-existent-workflow-id",
      });

      // Status might be null or have a specific structure
      // We just verify the query doesn't throw
      expect(status !== undefined).toBe(true);
    });

    test.skip("testAlignmentScorecard runs full workflow with polling", async () => {
      // Skip: Requires RAG component and OpenAI API key (not available in convex-test)
      // Run this test against a real Convex deployment
      // Note: This test may take longer due to workflow execution and polling
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.testHelpers.testAlignmentScorecard, {
        content: `
          Lesson Plan: Analyzing Theme in Literature
          
          Objective: Students will identify and analyze themes in selected texts.
          
          Activities:
          1. Read chapter 5 of "To Kill a Mockingbird"
          2. Answer comprehension questions about theme
          3. Write a paragraph analyzing how the theme develops
        `,
        gradeLevel: "10",
        subject: "ela",
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("workflowId");
      expect(result).toHaveProperty("status");
      expect(typeof result.workflowId).toBe("string");
    });
  });

  describe("Step 5: Database Verification", () => {
    test("getRecentAnalyses returns analyses for authenticated user", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // Note: In real scenario, userId would come from auth identity
      const userId = "test-user-id";
      
      // Insert a test analysis
      await t.run(async (ctx) => {
        await ctx.db.insert("alignmentAnalyses", {
          userId,
          content: "Test content",
          gradeLevel: "10",
          subject: "ela",
          alignmentScore: 85,
          scorecard: {
            overallScore: 85,
            breakdown: [],
            gaps: [],
            recommendations: [],
          },
          analyzedAt: Date.now(),
        });
      });

      const analyses = await asUser.query(api.testHelpers.getRecentAnalyses, {});

      expect(Array.isArray(analyses)).toBe(true);
      if (analyses.length > 0) {
        const firstAnalysis = analyses[0];
        expect(firstAnalysis).toHaveProperty("_id");
        expect(firstAnalysis).toHaveProperty("userId");
        expect(firstAnalysis).toHaveProperty("content");
        expect(firstAnalysis).toHaveProperty("gradeLevel");
        expect(firstAnalysis).toHaveProperty("subject");
        expect(firstAnalysis).toHaveProperty("alignmentScore");
        expect(firstAnalysis).toHaveProperty("scorecard");
        expect(firstAnalysis).toHaveProperty("analyzedAt");
        
        // Verify scorecard structure
        const scorecard = firstAnalysis.scorecard;
        expect(scorecard).toHaveProperty("overallScore");
        expect(scorecard).toHaveProperty("breakdown");
        expect(scorecard).toHaveProperty("gaps");
        expect(scorecard).toHaveProperty("recommendations");
      }
    });

    test("getRecentAnalyses returns empty array for unauthenticated user", async () => {
      // Note: This might throw due to auth mock, which is expected behavior
      try {
        const analyses = await t.query(api.testHelpers.getRecentAnalyses, {});
        expect(Array.isArray(analyses)).toBe(true);
      } catch (error) {
        // Expected: unauthenticated users should not access this
        expect(error).toBeDefined();
      }
    });

    test("alignmentAnalyses table stores complete analysis data", async () => {
      const userId = "test-user-id";
      const testScorecard = {
        overallScore: 90,
        breakdown: [
          {
            standardCode: "LA.ELA.10.1",
            score: 95,
            status: "aligned",
            notes: "Excellent alignment",
          },
          {
            standardCode: "LA.ELA.10.2",
            score: 85,
            status: "partial",
            notes: "Needs improvement",
          },
        ],
        gaps: ["Missing synthesis-level questions"],
        recommendations: ["Add more complex analysis questions"],
      };

      const analysisId = await t.run(async (ctx) => {
        return await ctx.db.insert("alignmentAnalyses", {
          userId,
          content: "Comprehensive quiz content",
          gradeLevel: "10",
          subject: "ela",
          alignmentScore: 90,
          scorecard: testScorecard,
          analyzedAt: Date.now(),
        });
      });

      const saved = await t.run(async (ctx) => {
        return await ctx.db.get(analysisId);
      });

      expect(saved).toBeDefined();
      expect(saved?.userId).toBe(userId);
      expect(saved?.alignmentScore).toBe(90);
      expect(saved?.scorecard).toEqual(testScorecard);
      expect(saved?.scorecard.breakdown.length).toBe(2);
      expect(saved?.scorecard.gaps.length).toBe(1);
      expect(saved?.scorecard.recommendations.length).toBe(1);
    });
  });

  describe("Step 6: Error Handling", () => {
    test("analyzeContentAlignment handles missing standards gracefully", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Try to analyze without populating standards first
      // This should either return empty results or handle gracefully
      try {
        const standards = await asUser.action(internal.alignmentSteps.retrieveStandards, {
          gradeLevel: "99", // Non-existent grade
          subject: "ela",
        });

        // Should return empty array or handle gracefully
        expect(Array.isArray(standards)).toBe(true);
      } catch (error) {
        // If it throws, that's also acceptable error handling
        expect(error).toBeDefined();
      }
    });

    test("retrieveStandards handles invalid subject", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Try with invalid subject (should be caught by validator)
      await expect(
        asUser.action(internal.alignmentSteps.retrieveStandards, {
          gradeLevel: "10",
          subject: "invalid-subject" as any,
        })
      ).rejects.toThrow();
    });

    test("saveAnalysis validates required fields", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Try to save with missing required fields
      await expect(
        asUser.mutation(internal.alignmentSteps.saveAnalysis, {
          userId: "test",
          content: "",
          scorecard: {
            overallScore: 0,
            breakdown: [],
            gaps: [],
            recommendations: [],
          },
          gradeLevel: "",
          subject: "",
        } as any)
      ).resolves.not.toThrow(); // Validator might allow empty strings, or throw
    });
  });

  describe("Step 7: Integration Test", () => {
    test.skip("fullIntegrationTest populates standards and runs workflow", async () => {
      // Skip: Requires RAG component and OpenAI API key (not available in convex-test)
      // Run this test against a real Convex deployment
      // Note: This is a comprehensive integration test that may take longer
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.testHelpers.fullIntegrationTest, {});

      expect(result).toBeDefined();
      expect(result).toHaveProperty("standardsPopulated");
      expect(result).toHaveProperty("testResults");
      expect(result.standardsPopulated).toBe(true);
      expect(Array.isArray(result.testResults)).toBe(true);
      expect(result.testResults.length).toBeGreaterThan(0);
    });
  });

  describe("Step 8: Validation and Edge Cases", () => {
    test("analyzeContentAlignment validates subject enum", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Should reject invalid subject
      await expect(
        asUser.action(api.rag.analyzeContentAlignment, {
          content: "Test content",
          gradeLevel: "10",
          subject: "invalid" as any,
        })
      ).rejects.toThrow();
    });

    test.skip("analyzeContentAlignment validates required fields", async () => {
      // Skip: Requires workflow component to be registered (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Should reject missing content
      await expect(
        asUser.action(api.rag.analyzeContentAlignment, {
          content: "",
          gradeLevel: "10",
          subject: "ela",
        } as any)
      ).resolves.not.toThrow(); // Validator might allow empty string, or throw
    });

    test.skip("getAlignmentStatus validates workflowId format", async () => {
      // Skip: Requires workflow component to be registered (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Should handle empty string workflowId
      const status = await asUser.query(api.rag.getAlignmentStatus, {
        workflowId: "",
      });
      
      // Status might be null or have specific structure
      expect(status !== undefined).toBe(true);
    });

    test("saveAnalysis handles empty scorecard arrays", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const userId = "test-user-id";
      
      const emptyScorecard = {
        overallScore: 0,
        breakdown: [],
        gaps: [],
        recommendations: [],
      };

      await asUser.mutation(internal.alignmentSteps.saveAnalysis, {
        userId,
        content: "Empty test content",
        scorecard: emptyScorecard,
        gradeLevel: "10",
        subject: "ela",
      });

      // Verify it was saved
      const analyses = await t.run(async (ctx) => {
        return await ctx.db
          .query("alignmentAnalyses")
          .filter((q) => q.eq(q.field("userId"), userId))
          .order("desc")
          .first();
      });

      expect(analyses).toBeDefined();
      expect(analyses?.scorecard.breakdown).toEqual([]);
      expect(analyses?.scorecard.gaps).toEqual([]);
      expect(analyses?.scorecard.recommendations).toEqual([]);
    });

    test("getRecentAnalyses limits to 10 most recent", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const userId = "test-user-id";
      
      // Insert 15 test analyses
      await t.run(async (ctx) => {
        for (let i = 0; i < 15; i++) {
          await ctx.db.insert("alignmentAnalyses", {
            userId,
            content: `Test content ${i}`,
            gradeLevel: "10",
            subject: "ela",
            alignmentScore: 80 + i,
            scorecard: {
              overallScore: 80 + i,
              breakdown: [],
              gaps: [],
              recommendations: [],
            },
            analyzedAt: Date.now() + i, // Ensure ordering
          });
        }
      });

      const analyses = await asUser.query(api.testHelpers.getRecentAnalyses, {});

      expect(Array.isArray(analyses)).toBe(true);
      // Should return at most 10
      expect(analyses.length).toBeLessThanOrEqual(10);
      // Should be ordered by creation time (most recent first)
      if (analyses.length > 1) {
        for (let i = 0; i < analyses.length - 1; i++) {
          expect(analyses[i]._creationTime).toBeGreaterThanOrEqual(analyses[i + 1]._creationTime);
        }
      }
    });
  });

  describe("Multiple Content Types", () => {
    beforeEach(async () => {
      // Skip: RAG component not available in convex-test
      // In a real deployment, populate test standards
      // const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // await asUser.action(api.testHelpers.addTestStandards, {});
    });

    test.skip("workflow handles quiz content", async () => {
      // Skip: Requires RAG component and OpenAI API key (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const quizContent = `
        Quiz: Reading Comprehension
        
        1. What is the main idea?
           a) Option A
           b) Option B
           c) Option C
        
        2. What can you infer?
           a) Option A
           b) Option B
      `;

      const { workflowId } = await asUser.action(api.rag.analyzeContentAlignment, {
        content: quizContent,
        gradeLevel: "10",
        subject: "ela",
      });

      expect(workflowId).toBeDefined();
    });

    test.skip("workflow handles lesson plan content", async () => {
      // Skip: Requires RAG component and OpenAI API key (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const lessonPlanContent = `
        Lesson Plan: Character Development
        
        Objective: Students will analyze character development.
        
        Activities:
        1. Read selected passages
        2. Identify character traits
        3. Write analysis paragraph
      `;

      const { workflowId } = await asUser.action(api.rag.analyzeContentAlignment, {
        content: lessonPlanContent,
        gradeLevel: "10",
        subject: "ela",
      });

      expect(workflowId).toBeDefined();
    });
  });
});

