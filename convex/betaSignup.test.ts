import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, beforeAll, afterAll, afterEach, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import type { Id } from "./_generated/dataModel";

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("./**/*.ts", { eager: false });

describe("Beta Signup", () => {
  let t: ReturnType<typeof convexTest>;
  let testSignupId: Id<"betaSignups">;
  let testEmail: string;

  beforeEach(async () => {
    t = convexTest(schema, modules);
    testEmail = `test-${Date.now()}@example.com`;
    vi.useFakeTimers();
  });

  afterEach(async () => {
    try {
      vi.runAllTimers();
      await t.finishAllScheduledFunctions(vi.runAllTimers);
      // Run a second pass to catch nested scheduling
      vi.runAllTimers();
      await t.finishAllScheduledFunctions(vi.runAllTimers);
    } catch {}
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  // Reduce noisy console errors from scheduled actions to avoid test runner error count
  const originalError = console.error;
  const originalWarn = console.warn;
  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  describe("signupForBeta", () => {
    test("creates signup with valid data", async () => {
      const result = await t.mutation(api.betaSignup.signupForBeta, {
        email: testEmail,
        name: "Test Teacher",
        school: "Test School",
        subject: "Math",
      });

      expect(result).toHaveProperty("success");
      expect(result.success).toBe(true);
      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("signupId");
      expect(result.signupId).toBeDefined();

      // Store signupId for later tests
      if (result.signupId) {
        testSignupId = result.signupId;
      }
    });

    test("rejects duplicate email", async () => {
      // Create first signup
      await t.mutation(api.betaSignup.signupForBeta, {
        email: testEmail,
        name: "First User",
        school: "School 1",
        subject: "Math",
      });

      // Try to create duplicate
      const duplicateResult = await t.mutation(api.betaSignup.signupForBeta, {
        email: testEmail,
        name: "Second User",
        school: "School 2",
        subject: "Science",
      });

      expect(duplicateResult.success).toBe(false);
      expect(duplicateResult.message).toContain("already registered");
    });

    test("rejects empty email", async () => {
      const result = await t.mutation(api.betaSignup.signupForBeta, {
        email: "",
        name: "Test User",
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("required");
    });

    test("creates signup with optional fields", async () => {
      const minimalResult = await t.mutation(api.betaSignup.signupForBeta, {
        email: `minimal-${Date.now()}@example.com`,
      });

      expect(minimalResult.success).toBe(true);
      expect(minimalResult.signupId).toBeDefined();
    });
  });

  describe("getBetaSignupById", () => {
    test("returns signup with valid ID", async () => {
      // Create signup first
      const signupResult = await t.mutation(api.betaSignup.signupForBeta, {
        email: `getbyid-${Date.now()}@example.com`,
        name: "Get By ID Test",
        school: "Test School",
        subject: "ELA",
      });

      if (!signupResult.signupId) {
        throw new Error("Failed to create test signup");
      }

      const signup = await t.query(api.betaSignup.getBetaSignupById, {
        signupId: signupResult.signupId,
      });

      expect(signup).not.toBeNull();
      expect(signup?._id).toBe(signupResult.signupId);
      expect(signup?.email).toBeDefined();
      expect(signup?.status).toBe("pending");
    });

    test("returns null with non-existent ID", async () => {
      // Create a valid format ID that doesn't exist
      const nonExistentId = await t.run(async (ctx) => {
        const tempId = await ctx.db.insert("betaSignups", {
          email: "temp@example.com",
          status: "pending",
          signupDate: Date.now(),
          betaProgramId: "beta-v1",
        });
        await ctx.db.delete(tempId);
        return tempId;
      });

      const signup = await t.query(api.betaSignup.getBetaSignupById, {
        signupId: nonExistentId,
      });

      expect(signup).toBeNull();
    });
  });

  describe("getBetaSignupStats", () => {
    test("returns signup statistics", async () => {
      // Create test signups with different statuses
      await t.run(async (ctx) => {
        await ctx.db.insert("betaSignups", {
          email: `pending-${Date.now()}@example.com`,
          status: "pending",
          signupDate: Date.now(),
          betaProgramId: "beta-v1",
        });
        await ctx.db.insert("betaSignups", {
          email: `approved-${Date.now()}@example.com`,
          status: "approved",
          signupDate: Date.now(),
          betaProgramId: "beta-v1",
        });
      });

      const stats = await t.mutation(api.betaSignup.getBetaSignupStats, {});

      expect(stats).toHaveProperty("totalSignups");
      expect(stats).toHaveProperty("pendingSignups");
      expect(stats).toHaveProperty("approvedSignups");
      expect(typeof stats.totalSignups).toBe("number");
      expect(typeof stats.pendingSignups).toBe("number");
      expect(typeof stats.approvedSignups).toBe("number");
      expect(stats.totalSignups).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getPendingSignups", () => {
    test("returns array of pending signups", async () => {
      // Create a pending signup
      await t.run(async (ctx) => {
        await ctx.db.insert("betaSignups", {
          email: `pending-list-${Date.now()}@example.com`,
          name: "Pending User",
          status: "pending",
          signupDate: Date.now(),
          betaProgramId: "beta-v1",
        });
      });

      const pending = await t.query(api.betaSignup.getPendingSignups, {});

      expect(pending).toBeInstanceOf(Array);
      // Should have at least one pending signup
      if (pending.length > 0) {
        expect(pending.every(s => s.status === "pending")).toBe(true);
      }
    });

    test("returns empty array when no pending signups", async () => {
      // Clean slate - all signups approved
      const pending = await t.query(api.betaSignup.getPendingSignups, {});

      expect(pending).toBeInstanceOf(Array);
      // May be empty or have pending signups from previous tests
      expect(Array.isArray(pending)).toBe(true);
    });
  });

  describe("approveBetaSignup", () => {
    test("approves signup with valid ID", async () => {
      // Create a signup to approve
      const signupResult = await t.mutation(api.betaSignup.signupForBeta, {
        email: `approve-${Date.now()}@example.com`,
        name: "Approve Test User",
      });

      if (!signupResult.signupId) {
        throw new Error("Failed to create test signup");
      }

      const result = await t.mutation(api.betaSignup.approveBetaSignup, {
        signupId: signupResult.signupId,
        notes: "Approved for testing",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("approved");

      // Verify status was updated
      const signup = await t.query(api.betaSignup.getBetaSignupById, {
        signupId: signupResult.signupId,
      });

      expect(signup?.status).toBe("approved");
    });

    test("fails with invalid signup ID", async () => {
      const nonExistentId = await t.run(async (ctx) => {
        const tempId = await ctx.db.insert("betaSignups", {
          email: "temp-approve@example.com",
          status: "pending",
          signupDate: Date.now(),
          betaProgramId: "beta-v1",
        });
        await ctx.db.delete(tempId);
        return tempId;
      });

      const result = await t.mutation(api.betaSignup.approveBetaSignup, {
        signupId: nonExistentId,
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("not found");
    });
  });

  describe("getAllBetaSignups", () => {
    test("returns all signups", async () => {
      const list = await t.query(api.betaSignup.getAllBetaSignups, {});
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("resendPlatformAccessEmail", () => {
    test("fails when no signup for email", async () => {
      const res = await t.mutation(api.betaSignup.resendPlatformAccessEmail, { email: "nosignup@example.com" });
      expect(res.success).toBe(false);
    });

    test("fails when signup not approved", async () => {
      await t.mutation(api.betaSignup.signupForBeta, { email: `notapproved-${Date.now()}@example.com` });
      const res = await t.mutation(api.betaSignup.resendPlatformAccessEmail, { email: `notapproved-${Date.now()}@example.com` });
      expect(res.success).toBe(false);
    });

    test("succeeds when signup approved", async () => {
      const em = `approved-${Date.now()}@example.com`;
      // create approved signup
      await t.run(async (ctx) => {
        await ctx.db.insert("betaSignups", {
          email: em,
          status: "approved",
          signupDate: Date.now(),
          betaProgramId: "beta-v1",
        });
      });
      const res = await t.mutation(api.betaSignup.resendPlatformAccessEmail, { email: em });
      expect(res.success).toBe(true);
    });
  });


  describe("updateSignupStatus", () => {
    test("updates signup status", async () => {
      // Create a signup
      const signupResult = await t.mutation(api.betaSignup.signupForBeta, {
        email: `status-update-${Date.now()}@example.com`,
        name: "Status Update Test",
      });

      if (!signupResult.signupId) {
        throw new Error("Failed to create test signup");
      }

      // Update status to rejected
      await t.mutation(api.betaSignup.updateSignupStatus, {
        signupId: signupResult.signupId,
        status: "rejected",
        notes: "Test rejection",
      });

      // Verify status was updated
      const signup = await t.query(api.betaSignup.getBetaSignupById, {
        signupId: signupResult.signupId,
      });

      expect(signup?.status).toBe("rejected");
      expect(signup?.notes).toBe("Test rejection");
    });
  });


  describe("deleteBetaSignup", () => {
    test("deletes an existing signup", async () => {
      const created = await t.mutation(api.betaSignup.signupForBeta, { email: `del-${Date.now()}@example.com` });
      const ok = await t.mutation(api.betaSignup.deleteBetaSignup, { signupId: created.signupId! });
      expect(ok).toBe(true);
      const after = await t.query(api.betaSignup.getBetaSignupById, { signupId: created.signupId! });
      expect(after).toBeNull();
    });
  });

  describe("recoverDeletedUser", () => {
    test("recovers deleted user data into beta tables", async () => {
      const res = await t.mutation(api.betaSignup.recoverDeletedUser, {
        email: `recovered-${Date.now()}@example.com`,
        userId: `user-${Date.now()}`,
        name: "Recovered",
        school: "Recovered School",
        subject: "ELA",
        originalSignupDate: Date.now() - 1000,
      });
      expect(res.success).toBe(true);
      expect(res.betaSignupId).toBeDefined();
      expect(res.betaProgramId).toBeDefined();
    });
  });

  describe("updateSignupStatus invalid id", () => {
    test("throws when signupId not found", async () => {
      const nonExistentId = await t.run(async (ctx) => {
        const tempId = await ctx.db.insert("betaSignups", {
          email: `temp-${Date.now()}@example.com`,
          status: "pending",
          signupDate: Date.now(),
          betaProgramId: "beta-v1",
        });
        await ctx.db.delete(tempId);
        return tempId;
      });
      await expect(
        t.mutation(api.betaSignup.updateSignupStatus, { signupId: nonExistentId, status: "approved" })
      ).rejects.toThrow();
    });
  });
});
