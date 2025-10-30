/**
 * Test Utilities for TypeScript Test Suite
 * 
 * Reusable helpers and utilities for convex-test based tests.
 * These replace the JavaScript test-utils.js functions.
 */

import { convexTest } from "convex-test";
import type { ReturnType } from "convex/test-helpers";
import schema from "../convex/schema";
import type { Id } from "../convex/_generated/dataModel";

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("../convex/**/*.ts", { eager: false });

/**
 * Creates a fresh convex-test instance with the schema
 * Use this in beforeEach hooks to ensure clean test state
 */
export function createTestInstance(): ReturnType<typeof convexTest> {
  return convexTest(schema, modules);
}

/**
 * Creates test data for a framework
 */
export async function createTestFramework(
  t: ReturnType<typeof convexTest>,
  overrides: Partial<{
    frameworkId: string;
    title: string;
    module: "ai-basics-hub" | "instructional-expert-hub";
    category: string;
    difficultyLevel: "beginner" | "intermediate" | "advanced";
  }> = {}
): Promise<{ frameworkId: string; convexId: Id<"frameworks"> }> {
  const result = await t.run(async (ctx) => {
    const insertedId = await ctx.db.insert("frameworks", {
      frameworkId: overrides.frameworkId || `test-${Date.now()}`,
      title: overrides.title || "Test Framework",
      module: overrides.module || "ai-basics-hub",
      category: overrides.category || "Test Category",
      tags: ["test"],
      challenge: "Test challenge",
      solution: "Test solution",
      samplePrompt: "Test prompt template",
      ethicalGuardrail: "Test guardrail",
      timeEstimate: 15,
      difficultyLevel: overrides.difficultyLevel || "beginner",
      platformCompatibility: ["ChatGPT"],
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

  return result;
}

/**
 * Creates test data for a beta signup
 */
export async function createTestBetaSignup(
  t: ReturnType<typeof convexTest>,
  overrides: Partial<{
    email: string;
    name: string;
    school: string;
    subject: string;
    status: "pending" | "approved" | "rejected";
  }> = {}
): Promise<Id<"betaSignups">> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("betaSignups", {
      email: overrides.email || `test-${Date.now()}@example.com`,
      name: overrides.name || "Test Teacher",
      school: overrides.school || "Test School",
      subject: overrides.subject || "Math",
      status: overrides.status || "pending",
      signupDate: Date.now(),
      betaProgramId: "beta-v1",
    });
  });
}

/**
 * Creates test data for a beta program
 */
export async function createTestBetaProgram(
  t: ReturnType<typeof convexTest>,
  overrides: Partial<{
    userId: string;
    status: "invited" | "active" | "completed";
  }> = {}
): Promise<Id<"betaProgram">> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("betaProgram", {
      userId: overrides.userId || `test-user-${Date.now()}`,
      status: overrides.status || "active",
      invitedAt: Date.now(),
      joinedAt: Date.now(),
      onboardingStep: 0,
      onboardingCompleted: false,
      frameworksTried: 0,
      totalTimeSaved: 0,
      innovationsShared: 0,
      officeHoursAttended: 0,
      weeklyEngagementCount: 0,
    });
  });
}

/**
 * Creates test data for a testimonial
 */
export async function createTestTestimonial(
  t: ReturnType<typeof convexTest>,
  overrides: Partial<{
    userId: string;
    quote: string;
    status: "pending" | "approved" | "featured";
    featured: boolean;
  }> = {}
): Promise<Id<"testimonials">> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("testimonials", {
      userId: overrides.userId || "test-user",
      quote: overrides.quote || "Test testimonial quote",
      userName: "Test Teacher",
      school: "Test School",
      subject: "Math",
      impact: "Time saved",
      status: overrides.status || "pending",
      featured: overrides.featured || false,
    });
  });
}

/**
 * Creates test data for an innovation
 */
export async function createTestInnovation(
  t: ReturnType<typeof convexTest>,
  overrides: Partial<{
    userId: string;
    title: string;
    subject: string;
  }> = {}
): Promise<Id<"innovations">> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("innovations", {
      userId: overrides.userId || "test-user",
      title: overrides.title || "Test Innovation",
      description: "Test innovation description",
      userName: "Test Teacher",
      school: "Test School",
      subject: overrides.subject || "Math",
      tags: ["test"],
      likes: 0,
      triesCount: 0,
      createdAt: Date.now(),
    });
  });
}

/**
 * Helper to wait for scheduled functions (if needed in future)
 * Note: Currently convex-test doesn't expose finishInProgressScheduledFunctions,
 * but this provides a placeholder for when it's available
 */
export async function waitForScheduledFunctions(
  t: ReturnType<typeof convexTest>,
  timeoutMs: number = 5000
): Promise<void> {
  // Placeholder - scheduled function handling in convex-test is limited
  // In production, use t.finishInProgressScheduledFunctions() when available
  await new Promise((resolve) => setTimeout(resolve, timeoutMs));
}

