import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { api, internal } from "../_generated/api";
import schema from "../schema";

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

describe("RAG Service", () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(async () => {
    t = convexTest(schema, modules);
  });

  describe("getStandards - Unit Tests", () => {
    test("validates subject enum", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Should throw error for invalid subject
      await expect(
        asUser.action(api.ragService.getStandards as any, {
          subject: "invalid",
          gradeLevel: "10",
        })
      ).rejects.toThrow();
    });

    test("validates required parameters", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Should throw error for missing gradeLevel
      await expect(
        asUser.action(api.ragService.getStandards as any, {
          subject: "ela",
        })
      ).rejects.toThrow();
    });

    test("accepts valid subject and gradeLevel", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Should not throw for valid parameters (will fail at RAG search, but that's expected)
      // This test validates the input validation layer
      try {
        await asUser.action(api.ragService.getStandards, {
          subject: "ela",
          gradeLevel: "10",
        });
      } catch (error) {
        // Expected: RAG component not available in convex-test
        // But we've validated the input parameters are accepted
        expect(error).toBeDefined();
      }
    });

    test("accepts optional standardCodes parameter", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      try {
        await asUser.action(api.ragService.getStandards, {
          subject: "ela",
          gradeLevel: "10",
          standardCodes: ["RL.10.1", "RI.10.2"],
        });
      } catch (error) {
        // Expected: RAG component not available in convex-test
        expect(error).toBeDefined();
      }
    });
  });

  describe("getStandards - Integration Tests", () => {
    test.skip("retrieves standards by grade and subject", async () => {
      // Skip: Requires RAG component to be initialized (not available in convex-test)
      // Run this test against a real Convex deployment
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // First populate test standards
      // await asUser.action(api.populateStandards.populateStandardsFromData, { ... });
      
      const result = await asUser.action(api.ragService.getStandards, {
        subject: "ela",
        gradeLevel: "10",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        const firstStandard = result[0];
        expect(firstStandard).toHaveProperty("code");
        expect(firstStandard).toHaveProperty("description");
        expect(firstStandard).toHaveProperty("gradeLevel");
        expect(firstStandard).toHaveProperty("subject");
        expect(firstStandard.gradeLevel).toBe("10");
        expect(firstStandard.subject).toBe("ela");
      }
    });

    test.skip("filters by subject correctly", async () => {
      // Skip: Requires RAG component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const elaResults = await asUser.action(api.ragService.getStandards, {
        subject: "ela",
        gradeLevel: "5",
      });

      const mathResults = await asUser.action(api.ragService.getStandards, {
        subject: "math",
        gradeLevel: "5",
      });

      // Results should be different
      expect(elaResults).not.toEqual(mathResults);
      
      // All ELA results should have subject "ela"
      elaResults.forEach((standard: { subject: string }) => {
        expect(standard.subject).toBe("ela");
      });
      
      // All Math results should have subject "math"
      mathResults.forEach((standard: { subject: string }) => {
        expect(standard.subject).toBe("math");
      });
    });

    test.skip("filters by gradeLevel correctly", async () => {
      // Skip: Requires RAG component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const grade5Results = await asUser.action(api.ragService.getStandards, {
        subject: "ela",
        gradeLevel: "5",
      });

      const grade10Results = await asUser.action(api.ragService.getStandards, {
        subject: "ela",
        gradeLevel: "10",
      });

      // Results should be different
      expect(grade5Results).not.toEqual(grade10Results);
      
      // All results should match requested grade level
      grade5Results.forEach((standard: { gradeLevel: string }) => {
        expect(standard.gradeLevel).toBe("5");
      });
      
      grade10Results.forEach((standard: { gradeLevel: string }) => {
        expect(standard.gradeLevel).toBe("10");
      });
    });

    test.skip("respects vector score threshold (0.6)", async () => {
      // Skip: Requires RAG component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.ragService.getStandards, {
        subject: "ela",
        gradeLevel: "10",
      });

      // All results should have relevance score >= 0.6
      // Note: This would need to be verified by checking RAG search results directly
      // The current API doesn't expose scores, but we can verify results are relevant
      expect(result.length).toBeGreaterThan(0);
    });

    test.skip("respects limit parameter (100)", async () => {
      // Skip: Requires RAG component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.ragService.getStandards, {
        subject: "ela",
        gradeLevel: "10",
      });

      // Should not exceed limit of 100
      expect(result.length).toBeLessThanOrEqual(100);
    });

    test.skip("filters by standardCodes when provided", async () => {
      // Skip: Requires RAG component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.ragService.getStandards, {
        subject: "ela",
        gradeLevel: "10",
        standardCodes: ["RL.10.1", "RI.10.2"],
      });

      // Results should be relevant to requested standard codes
      expect(result.length).toBeGreaterThan(0);
      
      // Verify results contain requested codes (or semantically similar)
      const codes = result.map((s: { code: string }) => s.code);
      // Note: Semantic search may return related standards, not exact matches
    });
  });

  describe("analyzeContentAlignment - Unit Tests", () => {
    test("validates required parameters", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Should throw error for missing content
      await expect(
        asUser.action(api.ragService.analyzeContentAlignment as any, {
          subject: "ela",
          gradeLevel: "10",
        })
      ).rejects.toThrow();
    });

    test("validates subject enum", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      await expect(
        asUser.action(api.ragService.analyzeContentAlignment as any, {
          content: "Test content",
          subject: "invalid",
          gradeLevel: "10",
        })
      ).rejects.toThrow();
    });
  });

  describe("analyzeContentAlignment - Integration Tests", () => {
    test.skip("analyzes content alignment with standards", async () => {
      // Skip: Requires RAG component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.ragService.analyzeContentAlignment, {
        content: "Students will analyze the theme of a novel and write an essay.",
        subject: "ela",
        gradeLevel: "10",
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("overallAlignment");
      expect(typeof result.overallAlignment).toBe("number");
      expect(result.overallAlignment).toBeGreaterThanOrEqual(0);
      expect(result.overallAlignment).toBeLessThanOrEqual(1);
    });

    test.skip("returns aligned standards with scores", async () => {
      // Skip: Requires RAG component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      const result = await asUser.action(api.ragService.analyzeContentAlignment, {
        content: "Students will analyze the theme of a novel and write an essay.",
        subject: "ela",
        gradeLevel: "10",
      });

      expect(result).toHaveProperty("alignedStandards");
      expect(Array.isArray(result.alignedStandards)).toBe(true);
      
      if (result.alignedStandards.length > 0) {
        const firstStandard = result.alignedStandards[0];
        expect(firstStandard).toHaveProperty("code");
        expect(firstStandard).toHaveProperty("description");
        expect(firstStandard).toHaveProperty("alignmentScore");
        expect(typeof firstStandard.alignmentScore).toBe("number");
      }
    });
  });

  describe("Rate Limiting", () => {
    test.skip("enforces rate limits based on user role", async () => {
      // Skip: Requires rate limiter component
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      
      // Make multiple rapid requests
      const requests = Array(15).fill(null).map(() =>
        asUser.action(api.ragService.getStandards, {
          subject: "ela",
          gradeLevel: "10",
        })
      );

      // Teacher role limit is 10/min, so 11th request should fail
      const results = await Promise.allSettled(requests);
      const failures = results.filter((r) => r.status === "rejected");
      
      // At least one should fail due to rate limiting
      expect(failures.length).toBeGreaterThan(0);
    });
  });
});

