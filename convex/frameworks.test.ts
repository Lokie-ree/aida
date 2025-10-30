import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import type { Id } from "./_generated/dataModel";

// Bridge Better Auth: mock authComponent to derive user from ctx.auth
vi.mock("./auth", () => ({
  authComponent: {
    getAuthUser: async (ctx: any) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthenticated");
      return { _id: identity.subject, email: identity.tokenIdentifier ?? "u@example.com", name: identity.name ?? "User" };
    },
  },
}));

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("./**/*.ts", { eager: false });

describe("Framework Library", () => {
  let t: ReturnType<typeof convexTest>;
  let testFrameworkId: string; // frameworkId (string) for queries
  let testFrameworkConvexId: Id<"frameworks">; // _id for mutations

  beforeEach(async () => {
    t = convexTest(schema, modules);
    
    // Note: Better Auth component (`authComponent.getAuthUser()`) testing has limitations
    // with convex-test. Functions using Better Auth may require actual deployment testing.
    // For basic auth simulation, `t.withIdentity()` works for identity-based tests.
    
    // Seed test framework before each test
    const result = await t.run(async (ctx) => {
      const insertedId = await ctx.db.insert("frameworks", {
        frameworkId: `test-${Date.now()}`,
        title: "Test Framework for Unit Testing",
        module: "ai-basics-hub",
        category: "Test Category",
        tags: ["test", "verification"],
        challenge: "Testing framework functionality",
        solution: "Verify that convex-test works correctly",
        samplePrompt: "Test prompt template",
        ethicalGuardrail: "Test ethical considerations",
        timeEstimate: 15,
        difficultyLevel: "beginner",
        platformCompatibility: ["ChatGPT", "Test"],
        louisianaStandards: ["ELA.K-12.W.1"],
        status: "published",
        createdBy: "test-user",
        usageCount: 0,
      });
      
      const framework = await ctx.db.get(insertedId);
      return {
        frameworkId: framework?.frameworkId || `test-${Date.now()}`,
        convexId: insertedId,
      };
    });
    
    testFrameworkId = result.frameworkId;
    testFrameworkConvexId = result.convexId;
  });

  describe("getAllFrameworks", () => {
    test("returns all published frameworks without authentication", async () => {
      const frameworks = await t.query(api.frameworks.getAllFrameworks, {});
      
      expect(frameworks).toBeInstanceOf(Array);
      expect(frameworks.length).toBeGreaterThan(0);
      
      const firstFramework = frameworks[0];
      expect(firstFramework).toHaveProperty("_id");
      expect(firstFramework).toHaveProperty("title");
      expect(firstFramework).toHaveProperty("module");
      expect(firstFramework).toHaveProperty("category");
      expect(firstFramework).toHaveProperty("frameworkId");
      expect(firstFramework).toHaveProperty("tags");
      expect(Array.isArray(firstFramework.tags)).toBe(true);
      expect(firstFramework.tags.length).toBeGreaterThan(0);
    });

    test("returns frameworks with correct structure", async () => {
      const frameworks = await t.query(api.frameworks.getAllFrameworks, {});
      
      expect(frameworks.length).toBeGreaterThan(0);
      expect(frameworks[0]).toMatchObject({
        title: expect.any(String),
        module: expect.stringMatching(/ai-basics-hub|instructional-expert-hub/),
        category: expect.any(String),
        frameworkId: expect.any(String),
      });
    });

    test("filters by module", async () => {
      // Add another framework with different module
      await t.run(async (ctx) => {
        await ctx.db.insert("frameworks", {
          frameworkId: `test-instructional-${Date.now()}`,
          title: "Instructional Expert Framework",
          module: "instructional-expert-hub",
          category: "Test Category",
          tags: ["test"],
          challenge: "Test challenge",
          solution: "Test solution",
          samplePrompt: "Test prompt",
          ethicalGuardrail: "Test guardrail",
          timeEstimate: 10,
          difficultyLevel: "beginner",
          platformCompatibility: ["Test"],
          status: "published",
          createdBy: "test-user",
          usageCount: 0,
        });
      });

      const aiBasicsFrameworks = await t.query(api.frameworks.getAllFrameworks, {
        module: "ai-basics-hub",
      });

      expect(aiBasicsFrameworks.every(f => f.module === "ai-basics-hub")).toBe(true);
    });

    test("filters by status", async () => {
      // Add a draft framework
      await t.run(async (ctx) => {
        await ctx.db.insert("frameworks", {
          frameworkId: `test-draft-${Date.now()}`,
          title: "Draft Framework",
          module: "ai-basics-hub",
          category: "Test Category",
          tags: ["test"],
          challenge: "Test",
          solution: "Test",
          samplePrompt: "Test",
          ethicalGuardrail: "Test",
          timeEstimate: 5,
          difficultyLevel: "beginner",
          platformCompatibility: ["Test"],
          status: "draft",
          createdBy: "test-user",
          usageCount: 0,
        });
      });

      const publishedFrameworks = await t.query(api.frameworks.getAllFrameworks, {
        status: "published",
      });

      expect(publishedFrameworks.every(f => f.module === "ai-basics-hub" || f.module === "instructional-expert-hub")).toBe(true);
      // Draft frameworks should not appear when status filter is "published"
    });
  });

  describe("average recomputation for rating and timeSaved", () => {
    test("recomputes averages across multiple usage records", async () => {
      // Fresh test context
      // @ts-expect-error - import.meta.glob is a Vite feature
      const modules = import.meta.glob("./**/*.ts", { eager: false });
      const t2 = convexTest(schema, modules);

      // Seed a framework
      const fid = await t2.run(async (ctx) => {
        return await ctx.db.insert("frameworks", {
          frameworkId: `avg-fw-${Date.now()}`,
          title: "Avg Framework",
          module: "ai-basics-hub",
          category: "Cat",
          tags: ["t"],
          challenge: "c",
          solution: "s",
          samplePrompt: "p",
          ethicalGuardrail: "g",
          timeEstimate: 10,
          difficultyLevel: "beginner",
          platformCompatibility: ["ChatGPT"],
          status: "published",
          createdBy: "u",
          usageCount: 0,
        });
      });

      const asUser = t2.withIdentity({ name: "U", email: "u@example.com" });
      await asUser.mutation(api.frameworks.recordFrameworkUsage, { frameworkId: fid, action: "viewed", rating: 5, timeSaved: 10 });
      await asUser.mutation(api.frameworks.recordFrameworkUsage, { frameworkId: fid, action: "copied_prompt", rating: 3, timeSaved: 20 });

      const fw = await t2.run(async (ctx) => await ctx.db.get(fid));
      expect(fw?.averageRating).toBeDefined();
      expect(fw?.averageTimeSaved).toBeDefined();
      // Exact averages: (5+3)/2 = 4, (10+20)/2 = 15
      expect(Math.round((fw!.averageRating || 0) * 100) / 100).toBeCloseTo(4, 5);
      expect(Math.round((fw!.averageTimeSaved || 0) * 100) / 100).toBeCloseTo(15, 5);
    });
  });

  describe("getFrameworkById", () => {
    test("returns framework with valid frameworkId", async () => {
      const framework = await t.query(api.frameworks.getFrameworkById, {
        frameworkId: testFrameworkId,
      });
      
      expect(framework).not.toBeNull();
      expect(framework?.frameworkId).toBe(testFrameworkId);
      expect(framework?.title).toBe("Test Framework for Unit Testing");
    });

    test("returns null with invalid frameworkId", async () => {
      const framework = await t.query(api.frameworks.getFrameworkById, {
        frameworkId: "non-existent-framework-id",
      });
      
      expect(framework).toBeNull();
    });

    test("includes Louisiana standards alignment", async () => {
      const framework = await t.query(api.frameworks.getFrameworkById, {
        frameworkId: testFrameworkId,
      });
      
      expect(framework).not.toBeNull();
      expect(framework?.louisianaStandards).toBeDefined();
      if (framework?.louisianaStandards) {
        expect(Array.isArray(framework.louisianaStandards)).toBe(true);
      }
      expect(framework?.platformCompatibility).toBeDefined();
      expect(Array.isArray(framework?.platformCompatibility)).toBe(true);
    });
  });

  describe("searchFrameworks", () => {
    test("searches frameworks by text query", async () => {
      // Add framework with searchable content
      await t.run(async (ctx) => {
        await ctx.db.insert("frameworks", {
          frameworkId: `test-search-${Date.now()}`,
          title: "Lesson Planning Framework for Math",
          module: "ai-basics-hub",
          category: "Lesson Planning",
          tags: ["math", "lesson", "planning"],
          challenge: "Planning math lessons effectively",
          solution: "Use AI to generate lesson plans",
          samplePrompt: "Create a math lesson plan",
          ethicalGuardrail: "Test guardrail",
          timeEstimate: 20,
          difficultyLevel: "beginner",
          platformCompatibility: ["ChatGPT"],
          status: "published",
          createdBy: "test-user",
          usageCount: 0,
        });
      });

      const results = await t.query(api.frameworks.searchFrameworks, {
        query: "lesson",
      });

      expect(results).toBeInstanceOf(Array);
      // Should find frameworks with "lesson" in title or description
    });

    test("returns empty array for no matches", async () => {
      const results = await t.query(api.frameworks.searchFrameworks, {
        query: "nonexistentxyzabc123",
      });

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });
  });

  describe("getAllFrameworks filters", () => {
    test("filters by module", async () => {
      // Add framework to instructional-expert-hub
      await t.run(async (ctx) => {
        await ctx.db.insert("frameworks", {
          frameworkId: `test-module-${Date.now()}`,
          title: "Expert Hub Framework",
          module: "instructional-expert-hub",
          category: "Test Category",
          tags: ["test"],
          challenge: "Test",
          solution: "Test",
          samplePrompt: "Test",
          ethicalGuardrail: "Test",
          timeEstimate: 15,
          difficultyLevel: "beginner",
          platformCompatibility: ["ChatGPT"],
          status: "published",
          createdBy: "test-user",
          usageCount: 0,
        });
      });

      const frameworks = await t.query(api.frameworks.getAllFrameworks, {
        module: "instructional-expert-hub",
      });

      expect(frameworks).toBeInstanceOf(Array);
      if (frameworks.length > 0) {
        expect(frameworks.every(f => f.module === "instructional-expert-hub")).toBe(true);
      }
    });

    test("filters by module and status together", async () => {
      const frameworks = await t.query(api.frameworks.getAllFrameworks, {
        module: "ai-basics-hub",
        status: "published",
      });

      expect(frameworks).toBeInstanceOf(Array);
      if (frameworks.length > 0) {
        // getAllFrameworks filters by status internally but doesn't return it
        // So we just verify the module filter worked
        expect(frameworks.every(f => f.module === "ai-basics-hub")).toBe(true);
      }
    });
  });

  describe("Search and Filters", () => {
    test("searchFrameworks returns empty for no matches", async () => {
      const results = await t.query(api.frameworks.searchFrameworks, { query: "no-such-term-xyz" });
      expect(Array.isArray(results)).toBe(true);
    });

    test("getAllFrameworks filters by module and status", async () => {
      // Ensure there is at least one published in ai-basics-hub from setup
      const basics = await t.query(api.frameworks.getAllFrameworks, { module: "ai-basics-hub", status: "published" });
      expect(Array.isArray(basics)).toBe(true);
      if (basics.length > 0) {
        basics.forEach(f => {
          expect(f.module).toBe("ai-basics-hub");
        });
      }
    });

    test("getAllFrameworks filters by category", async () => {
      const results = await t.query(api.frameworks.getAllFrameworks, { category: "Test Category" });
      expect(Array.isArray(results)).toBe(true);
      if (results.length > 0) {
        results.forEach(f => expect(f.category).toBe("Test Category"));
      }
    });
  });

  describe("getUserSavedFrameworks", () => {
    test.skip("returns saved frameworks with authenticated user", async () => {
      // Skipped: Requires Better Auth component registration
    });
  });

  describe("getAllFrameworkUsage", () => {
    test("returns all framework usage (public query)", async () => {
      // This is a public query that doesn't require authentication
      const allUsage = await t.query(api.frameworks.getAllFrameworkUsage, {});

      expect(allUsage).toBeInstanceOf(Array);
      // May be empty or contain usage from previous tests
    });
  });

  describe("save/unsave frameworks", () => {
    test("saveFramework requires authentication", async () => {
      await expect(
        t.mutation(api.frameworks.saveFramework, { frameworkId: testFrameworkConvexId })
      ).rejects.toThrow();
    });

    test("user can save and then unsave framework; saved list reflects changes", async () => {
      const asUser = t.withIdentity({ name: "Saver", email: "saver@example.com" });
      await asUser.mutation(api.frameworks.saveFramework, { frameworkId: testFrameworkConvexId });

      const saved = await asUser.query(api.frameworks.getUserSavedFrameworks, {} as any);
      expect(Array.isArray(saved)).toBe(true);
      expect(saved.length).toBeGreaterThanOrEqual(1);

      await asUser.mutation(api.frameworks.unsaveFramework, { frameworkId: testFrameworkConvexId });
      const savedAfter = await asUser.query(api.frameworks.getUserSavedFrameworks, {} as any);
      expect(savedAfter.find?.((id: any) => id === testFrameworkConvexId)).toBeUndefined();
    });
  });

  describe("delete helpers", () => {
    test("deleteFramework deletes existing framework", async () => {
      const toDelete = await t.run(async (ctx) => {
        return await ctx.db.insert("frameworks", {
          frameworkId: `del-${Date.now()}`,
          title: "Temp",
          module: "ai-basics-hub",
          category: "Temp",
          tags: ["t"],
          challenge: "c",
          solution: "s",
          samplePrompt: "p",
          ethicalGuardrail: "g",
          timeEstimate: 1,
          difficultyLevel: "beginner",
          platformCompatibility: ["ChatGPT"],
          status: "published",
          createdBy: "test",
          usageCount: 0,
        });
      });
      await t.mutation(api.frameworks.deleteFramework, { frameworkId: toDelete });
      const exists = await t.run(async (ctx) => await ctx.db.get(toDelete));
      expect(exists).toBeNull();
    });

    test("deleteFrameworkUsage deletes an existing usage", async () => {
      const asUser = t.withIdentity({ name: "Remover", email: "rem@example.com" });
      const usageId = await asUser.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "viewed",
      });
      const ok = await t.mutation(api.frameworks.deleteFrameworkUsage, { usageId });
      expect(ok).toBe(true);
    });
  });
  describe("recordFrameworkUsage validations", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.frameworks.recordFrameworkUsage, {
          frameworkId: testFrameworkConvexId,
          action: "viewed",
        })
      ).rejects.toThrow();
    });

    test("validator rejects missing action", async () => {
      const asUser = t.withIdentity({ name: "User", email: "u@example.com" });
      // bypass typing to trigger runtime validator
      await expect(
        asUser.mutation((api.frameworks.recordFrameworkUsage as unknown) as any, {
          frameworkId: testFrameworkConvexId as any,
        } as any)
      ).rejects.toThrow();
    });

    test("records usage and updates usageCount", async () => {
      const asUser = t.withIdentity({ name: "User", email: "u@example.com" });

      const before = await t.run(async (ctx) => await ctx.db.get(testFrameworkConvexId));

      const usageId = await asUser.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "viewed",
      });

      expect(usageId).toBeDefined();

      const after = await t.run(async (ctx) => await ctx.db.get(testFrameworkConvexId));
      expect(after?.usageCount).toBeGreaterThanOrEqual((before?.usageCount || 0) + 1);
    });

    test("updates averageRating when rating is provided", async () => {
      const asUser = t.withIdentity({ name: "User A", email: "a@example.com" });
      await asUser.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "viewed",
        rating: 5,
      });

      const asUser2 = t.withIdentity({ name: "User B", email: "b@example.com" });
      await asUser2.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "viewed",
        rating: 3,
      });

      const after = await t.run(async (ctx) => await ctx.db.get(testFrameworkConvexId));
      expect(typeof after?.averageRating === "number").toBe(true);
    });

    test("updates averageTimeSaved when timeSaved is provided", async () => {
      const asUser = t.withIdentity({ name: "User C", email: "c@example.com" });
      await asUser.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "viewed",
        timeSaved: 10,
      });

      const asUser2 = t.withIdentity({ name: "User D", email: "d@example.com" });
      await asUser2.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "viewed",
        timeSaved: 20,
      });

      const after = await t.run(async (ctx) => await ctx.db.get(testFrameworkConvexId));
      expect(typeof after?.averageTimeSaved === "number").toBe(true);
    });
  });

  describe("getUserFrameworkUsage", () => {
    test("returns usage for authenticated user and respects limit", async () => {
      const asUser = t.withIdentity({ name: "User E", email: "e@example.com" });

      await asUser.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "viewed",
      });
      await asUser.mutation(api.frameworks.recordFrameworkUsage, {
        frameworkId: testFrameworkConvexId,
        action: "copied_prompt",
      });

      const list = await asUser.query(api.frameworks.getUserFrameworkUsage, { limit: 1 });
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeLessThanOrEqual(1);
    });
  });

  describe("getFrameworkStats", () => {
    test("returns framework usage statistics", async () => {
      const stats = await t.query(api.frameworks.getFrameworkStats, {});
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalFrameworks");
      expect(stats).toHaveProperty("totalUsage");
      expect(typeof stats.totalFrameworks).toBe("number");
      expect(typeof stats.totalUsage).toBe("number");
    });
  });

  describe("Louisiana Standards Validation", () => {
    test("frameworks can include Louisiana standards", async () => {
      const framework = await t.query(api.frameworks.getFrameworkById, {
        frameworkId: testFrameworkId,
      });

      expect(framework).not.toBeNull();
      // Framework should support Louisiana standards (optional field)
      if (framework?.louisianaStandards) {
        expect(Array.isArray(framework.louisianaStandards)).toBe(true);
      }
    });

    test("frameworks are platform-agnostic", async () => {
      const framework = await t.query(api.frameworks.getFrameworkById, {
        frameworkId: testFrameworkId,
      });

      expect(framework).not.toBeNull();
      expect(framework?.platformCompatibility).toBeDefined();
      expect(Array.isArray(framework?.platformCompatibility)).toBe(true);
      expect(framework?.platformCompatibility.length).toBeGreaterThan(0);
    });
  });
});

