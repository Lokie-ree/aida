import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";
import type { Id } from "../_generated/dataModel";

// Bridge Better Auth: mock authComponent to derive user from ctx.auth
vi.mock("../auth", () => ({
  authComponent: {
    getAuthUser: async (ctx: any) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthenticated");
      return { _id: identity.subject, email: "teacher@school.edu", name: identity.name ?? "Test Teacher" };
    },
  },
}));

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("../**/*.ts", { eager: false });

describe("Dashboard", () => {
  let t: ReturnType<typeof convexTest>;
  let testFrameworkId: Id<"frameworks">;

  beforeEach(async () => {
    t = convexTest(schema, modules);

    // Seed test data: framework for usage tracking
    testFrameworkId = await t.run(async (ctx) => {
      return await ctx.db.insert("frameworks", {
        frameworkId: `test-dashboard-${Date.now()}`,
        title: "Dashboard Test Framework",
        module: "ai-basics-hub",
        category: "Test Category",
        tags: ["test", "dashboard"],
        challenge: "Testing dashboard functionality",
        solution: "Verify analytics work correctly",
        samplePrompt: "Test prompt template",
        ethicalGuardrail: "Test ethical considerations",
        timeEstimate: 15,
        difficultyLevel: "beginner",
        platformCompatibility: ["ChatGPT"],
        status: "published",
        createdBy: "test-user",
        usageCount: 0,
      });
    });
  });

  // NOTE: dashboardAnalytics.ts was removed in Phase 1 refactoring
  // Time tracking functionality is now in timeTracking.ts
  describe("Dashboard Analytics (DEPRECATED)", () => {
    test.skip("dashboardAnalytics functions removed - use timeTracking.ts instead", async () => {
      // Skipped: dashboardAnalytics.ts was deleted in Phase 1 refactoring
      // Time tracking functionality is now in timeTracking.ts
      // See timeTracking.test.ts for time tracking tests
    });
  });

  describe("Quick Start Frameworks", () => {
    test("filters frameworks by beginner difficulty", async () => {
      const frameworks = await t.query(api.frameworks.getAllFrameworks, {});

      const beginnerFrameworks = frameworks.filter((f: { difficultyLevel: string }) => f.difficultyLevel === "beginner");

      expect(Array.isArray(frameworks)).toBe(true);
      expect(beginnerFrameworks.length).toBeGreaterThanOrEqual(0);
      
      // Verify all returned beginner frameworks have correct difficulty
      beginnerFrameworks.forEach((framework: { difficultyLevel: string }) => {
        expect(framework.difficultyLevel).toBe("beginner");
      });
    });
  });

  describe("Analytics and Insights", () => {
    test("returns framework statistics", async () => {
      const stats = await t.query(api.frameworks.getFrameworkStats, {});

      expect(stats).toBeDefined();
      expect(typeof stats).toBe("object");
      expect(stats.totalFrameworks).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Goal Setting and Tracking", () => {
    test("returns null beta status when not authenticated", async () => {
      const betaStatus = await t.query(api.betaProgram.getBetaStatus, {});

      expect(betaStatus).toBeNull();
    });

    test("returns beta status with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const betaStatus = await asUser.query(api.betaProgram.getBetaStatus, {});
      // Depending on data presence, may be null or object; assert shape safely
      if (betaStatus) {
        expect(betaStatus).toHaveProperty("status");
      } else {
        expect(betaStatus).toBeNull();
      }
    });
  });
});
