import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

// Mock React email renderer and email components to avoid JSX rendering
vi.mock("@react-email/render", () => ({
  render: vi.fn(async () => "<html><body>mock</body></html>")
}));

vi.mock("../src/emails/WeeklyPromptEmail", () => ({
  WeeklyPromptEmail: () => ({})
}));
vi.mock("../src/emails/BetaWelcomeEmail", () => ({
  BetaWelcomeEmail: () => ({})
}));
vi.mock("../src/emails/PlatformAccessEmail", () => ({
  PlatformAccessEmail: () => ({})
}));

// Spy on resend to avoid network and return deterministic email IDs
import { resend } from "./email";
import type { EmailId } from "@convex-dev/resend";
vi.spyOn(resend, "sendEmail").mockImplementation(async () => {
  return { __isEmailId: true } as EmailId;
});

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("./**/*.ts", { eager: false });

describe("Email actions", () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(async () => {
    t = convexTest(schema, modules);
  });

  test("sendBetaWelcomeEmail sends email and returns id", async () => {
    const result = await t.action(api.email.sendBetaWelcomeEmail, {
      email: "teacher@school.edu",
      name: "Test Teacher",
      school: "Test School",
    });

    expect(result.success).toBe(true);
    expect(result.emailId).toBeDefined();
  });

  test("sendPlatformAccessEmail sends email and returns id", async () => {
    const result = await t.action(api.email.sendPlatformAccessEmail, {
      email: "teacher@school.edu",
      name: "Test Teacher",
      magicLinkUrl: "https://example.com/magic-link",
    });

    expect(result.success).toBe(true);
    expect(result.emailId).toBeDefined();
  });

  test("sendWeeklyPromptEmail sends email and returns id", async () => {
    const result = await t.action(api.email.sendWeeklyPromptEmail, {
      userEmail: "teacher@school.edu",
      userName: "Test Teacher",
      frameworkTitle: "Lesson Objective Unpacker",
      frameworkId: "AIB-001",
      samplePrompt: "Break down this objective...",
      timeEstimate: 15,
      difficultyLevel: "beginner",
      weekNumber: 3,
    });

    expect(result.success).toBe(true);
    expect(result.emailId).toBeDefined();
  });

  test("sendWeeklyEmailsToAllUsers iterates beta users and sends emails", async () => {
    // Seed one beta user and one published framework
    await t.run(async (ctx) => {
      await ctx.db.insert("betaProgram", {
        userId: "user-1",
        status: "active",
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
      await ctx.db.insert("frameworks", {
        frameworkId: "fw-1",
        title: "Framework One",
        module: "ai-basics-hub",
        category: "Category",
        tags: ["tag"],
        challenge: "challenge",
        solution: "solution",
        samplePrompt: "prompt",
        ethicalGuardrail: "guardrail",
        timeEstimate: 10,
        difficultyLevel: "beginner",
        platformCompatibility: ["ChatGPT"],
        status: "published",
        createdBy: "seed",
        usageCount: 0,
      });
    });

    const result = await t.action(api.email.sendWeeklyEmailsToAllUsers, {});
    expect(result.success).toBe(true);
    expect(result.emailsSent).toBeGreaterThanOrEqual(0);
  });

  test("sendBetaWelcomeEmail throws on render error", async () => {
    const orig = (await import("@react-email/render")) as any;
    const spy = vi.spyOn(orig, "render").mockImplementation(async () => {
      throw new Error("render fail");
    });
    await expect(
      t.action(api.email.sendBetaWelcomeEmail, { email: "e@example.com", name: "N" })
    ).rejects.toThrow(/Failed to send beta welcome email/);
    spy.mockRestore();
  });

  test("sendPlatformAccessEmail throws on send failure", async () => {
    const sendSpy = vi.spyOn(resend, "sendEmail").mockImplementationOnce(async () => {
      throw new Error("send fail");
    });
    await expect(
      t.action(api.email.sendPlatformAccessEmail, { email: "e@example.com", name: "N", magicLinkUrl: "https://example.com/link" })
    ).rejects.toThrow(/Failed to send platform access email/);
    sendSpy.mockRestore();
  });

  test("sendWeeklyPromptEmail throws on send failure", async () => {
    const sendSpy = vi.spyOn(resend, "sendEmail").mockImplementationOnce(async () => {
      throw new Error("send fail");
    });
    await expect(
      t.action(api.email.sendWeeklyPromptEmail, {
        userEmail: "e@example.com",
        userName: "U",
        frameworkTitle: "F",
        frameworkId: "id",
        samplePrompt: "p",
        timeEstimate: 1,
        difficultyLevel: "beginner",
        weekNumber: 1,
      })
    ).rejects.toThrow(/Failed to send weekly prompt email/);
    sendSpy.mockRestore();
  });
});


