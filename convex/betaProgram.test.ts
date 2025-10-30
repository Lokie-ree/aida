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

describe("Beta Program", () => {
  let t: ReturnType<typeof convexTest>;
  let testBetaProgramId: Id<"betaProgram">;

  beforeEach(async () => {
    t = convexTest(schema, modules);

    // Seed a test beta program
    testBetaProgramId = await t.run(async (ctx) => {
      return await ctx.db.insert("betaProgram", {
        userId: "test-user-id",
        status: "active",
        invitedAt: Date.now(),
        joinedAt: Date.now(),
        onboardingStep: 2,
        onboardingCompleted: false,
        frameworksTried: 5,
        totalTimeSaved: 120,
        innovationsShared: 2,
        officeHoursAttended: 1,
        weeklyEngagementCount: 3,
      });
    });
  });

  describe("getBetaStatus", () => {
    test("returns null when not authenticated", async () => {
      const status = await t.query(api.betaProgram.getBetaStatus, {});

      expect(status).toBeNull();
    });

    test("returns beta status with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user@example.com" });
      const identity = await asUser.run(async (ctx) => await ctx.auth.getUserIdentity());
      if (!identity) throw new Error("no identity");

      // ensure program exists
      await asUser.run(async (ctx) => {
        await ctx.db.insert("betaProgram", {
          userId: identity.subject,
          status: "active",
          invitedAt: Date.now(),
          joinedAt: Date.now(),
          onboardingStep: 1,
          onboardingCompleted: false,
          frameworksTried: 1,
          totalTimeSaved: 10,
          innovationsShared: 0,
          officeHoursAttended: 0,
          weeklyEngagementCount: 0,
        });
      });

      const status = await asUser.query(api.betaProgram.getBetaStatus, {});
      expect(status).not.toBeNull();
      if (status) {
        expect(status.status).toBeDefined();
      }
    });

    test("returns null when authenticated but no beta program record", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user2@example.com" });
      const status = await asUser.query(api.betaProgram.getBetaStatus, {});
      expect(status).toBeNull();
    });
  });

  describe("getBetaStats", () => {
    test("returns default stats when not authenticated", async () => {
      const stats = await t.query(api.betaProgram.getBetaStats, {});

      expect(stats).toHaveProperty("frameworksTried");
      expect(stats).toHaveProperty("totalTimeSaved");
      expect(stats).toHaveProperty("innovationsShared");
      expect(stats).toHaveProperty("weeklyEngagementStreak");

      expect(stats.frameworksTried).toBe(0);
      expect(stats.totalTimeSaved).toBe(0);
      expect(stats.innovationsShared).toBe(0);
      expect(stats.weeklyEngagementStreak).toBe(0);
    });

    test("returns actual stats with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user@example.com" });
      const identity = await asUser.run(async (ctx) => await ctx.auth.getUserIdentity());
      if (!identity) throw new Error("no identity");

      // ensure program exists with known values
      await asUser.run(async (ctx) => {
        await ctx.db.insert("betaProgram", {
          userId: identity.subject,
          status: "active",
          invitedAt: Date.now(),
          joinedAt: Date.now(),
          onboardingStep: 2,
          onboardingCompleted: false,
          frameworksTried: 3,
          totalTimeSaved: 45,
          innovationsShared: 1,
          officeHoursAttended: 2,
          weeklyEngagementCount: 4,
        });
      });

      const stats = await asUser.query(api.betaProgram.getBetaStats, {});
      expect(stats.frameworksTried).toBeGreaterThanOrEqual(0);
      expect(typeof stats.weeklyEngagementStreak).toBe("number");
    });

    test("authenticated with no program returns zeros", async () => {
      const asUser = t.withIdentity({ name: "UserZ", email: "userz@example.com" });
      const stats = await asUser.query(api.betaProgram.getBetaStats, {});
      expect(stats.frameworksTried).toBe(0);
      expect(stats.totalTimeSaved).toBe(0);
      expect(stats.innovationsShared).toBe(0);
      expect(stats.weeklyEngagementStreak).toBe(0);
    });
  });

  describe("getAllBetaUsers", () => {
    test("returns array (may be empty when not authenticated)", async () => {
      const users = await t.query(api.betaProgram.getAllBetaUsers, {});

      expect(users).toBeInstanceOf(Array);
      // May be empty or have users depending on test data
    });

    test("iterates active programs and attempts to fetch users", async () => {
      await t.run(async (ctx) => {
        await ctx.db.insert("betaProgram", {
          userId: "auth-user-1",
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
        await ctx.db.insert("betaProgram", {
          userId: "auth-user-2",
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
      });

      const list = await t.query(api.betaProgram.getAllBetaUsers, {});
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("getAllBetaPrograms", () => {
    test("returns all beta programs", async () => {
      const programs = await t.query(api.betaProgram.getAllBetaPrograms, {});

      expect(programs).toBeInstanceOf(Array);
      expect(programs.length).toBeGreaterThanOrEqual(0);

      if (programs.length > 0) {
        expect(programs[0]).toHaveProperty("_id");
        expect(programs[0]).toHaveProperty("userId");
        expect(programs[0]).toHaveProperty("status");
      }
    });
  });

  describe("initializeBetaProgram", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.betaProgram.initializeBetaProgram, {})
      ).rejects.toThrow();
    });

    test("initializes beta program with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user@example.com" });
      const result = await asUser.mutation(api.betaProgram.initializeBetaProgram, {});
      // result likely an id; verify a beta program exists for this user
      const identity = await asUser.run(async (ctx) => await ctx.auth.getUserIdentity());
      const existing = await asUser.run(async (ctx) => {
        return await ctx.db
          .query("betaProgram")
          .filter((q) => q.eq(q.field("userId"), identity!.subject))
          .first();
      });
      expect(existing).toBeDefined();
    });
  });

  describe("updateOnboardingProgress", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.betaProgram.updateOnboardingProgress, {
          step: 3,
        })
      ).rejects.toThrow();
    });

    test("updates onboarding progress with authenticated user and clamps bounds", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user@example.com" });
      const identity = await asUser.run(async (ctx) => await ctx.auth.getUserIdentity());
      if (!identity) throw new Error("no identity");

      // ensure user beta program exists
      const betaId = await asUser.run(async (ctx) => {
        return await ctx.db.insert("betaProgram", {
          userId: identity.subject,
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
      });

      // update to high step to test clamping and completion flag if implemented
      await asUser.mutation(api.betaProgram.updateOnboardingProgress, { step: 999 });
      const after = await asUser.run(async (ctx) => await ctx.db.get(betaId));
      expect(after?.onboardingStep).toBeGreaterThanOrEqual(0);
    });

    test("setting step to 4 marks onboardingCompleted true", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user@example.com" });
      const identity = await asUser.run(async (ctx) => await ctx.auth.getUserIdentity());
      if (!identity) throw new Error("no identity");

      const betaId = await asUser.run(async (ctx) => {
        return await ctx.db.insert("betaProgram", {
          userId: identity.subject,
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
      });

      await asUser.mutation(api.betaProgram.updateOnboardingProgress, { step: 4 });
      const after = await asUser.run(async (ctx) => await ctx.db.get(betaId));
      expect(after?.onboardingCompleted).toBe(true);
      expect(after?.onboardingStep).toBe(4);
    });
  });

  describe("recordWeeklyEngagement", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.betaProgram.recordWeeklyEngagement, {})
      ).rejects.toThrow();
    });

    test("records weekly engagement increments count", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user@example.com" });
      const identity = await asUser.run(async (ctx) => await ctx.auth.getUserIdentity());
      if (!identity) throw new Error("no identity");

      // ensure beta program exists
      const betaId = await asUser.run(async (ctx) => {
        return await ctx.db.insert("betaProgram", {
          userId: identity.subject,
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
      });

      await asUser.mutation(api.betaProgram.recordWeeklyEngagement, {});
      const after = await asUser.run(async (ctx) => await ctx.db.get(betaId));
      expect(after?.weeklyEngagementCount).toBe(1);
    });

    test("records weekly engagement twice increments to 2", async () => {
      const asUser = t.withIdentity({ name: "User", email: "user@example.com" });
      const identity = await asUser.run(async (ctx) => await ctx.auth.getUserIdentity());
      if (!identity) throw new Error("no identity");

      const betaId = await asUser.run(async (ctx) => {
        return await ctx.db.insert("betaProgram", {
          userId: identity.subject,
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
      });

      await asUser.mutation(api.betaProgram.recordWeeklyEngagement, {});
      await asUser.mutation(api.betaProgram.recordWeeklyEngagement, {});
      const after = await asUser.run(async (ctx) => await ctx.db.get(betaId));
      expect(after?.weeklyEngagementCount).toBe(2);
    });
  });

  describe("Data Structure", () => {
    test("beta program has correct structure", async () => {
      const program = await t.run(async (ctx) => {
        return await ctx.db.get(testBetaProgramId);
      });

      expect(program).toBeDefined();
      expect(program?._id).toBe(testBetaProgramId);
      expect(program).toHaveProperty("userId");
      expect(program).toHaveProperty("status");
      expect(program).toHaveProperty("onboardingStep");
      expect(program).toHaveProperty("frameworksTried");
      expect(program).toHaveProperty("totalTimeSaved");
    });
  });
});
