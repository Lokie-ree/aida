import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("./**/*.ts", { eager: false });

test("convex-test is working", async () => {
  const t = convexTest(schema, modules);
  expect(t).toBeDefined();
});

test("can query database", async () => {
  const t = convexTest(schema, modules);
  
  // Insert a test record using correct schema
  const testId = await t.run(async (ctx) => {
    return await ctx.db.insert("frameworks", {
      frameworkId: "test-setup-verification",
      title: "Setup Verification Test Framework",
      module: "ai-basics-hub",
      category: "Test Category",
      tags: ["test", "verification"],
      challenge: "Testing setup",
      solution: "Verify convex-test works",
      samplePrompt: "Test prompt",
      ethicalGuardrail: "Test guardrail",
      timeEstimate: 5,
      difficultyLevel: "beginner",
      platformCompatibility: ["Test"],
      status: "draft",
      createdBy: "test-user",
      usageCount: 0,
    });
  });
  
  expect(testId).toBeDefined();
  
  // Query it back
  const framework = await t.run(async (ctx) => {
    return await ctx.db.get(testId);
  });
  
  expect(framework).toBeDefined();
  expect(framework?.title).toBe("Setup Verification Test Framework");
});

