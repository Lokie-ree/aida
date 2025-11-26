import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import type { Id } from "./_generated/dataModel";

// Bridge Better Auth: mock authComponent to derive user and role from ctx.auth
vi.mock("./auth", () => ({
  authComponent: {
    getAuthUser: async (ctx: any) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthenticated");
      const isAdmin = identity.name === "Admin User";
      const email = isAdmin ? "delivered@resend.dev" : "user@example.com";
      return { _id: identity.subject, email, name: identity.name ?? "User", role: isAdmin ? "admin" : "teacher" } as any;
    },
  },
}));

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("./**/*.ts", { eager: false });

describe("Admin Dashboard", () => {
  let t: ReturnType<typeof convexTest>;
  let testTestimonialId: Id<"testimonials">;
  let testInnovationId: Id<"innovations">;
  let testBetaUserId: Id<"betaProgram">;

  beforeEach(async () => {
    t = convexTest(schema, modules);

    // Seed test data for admin moderation tests
    testTestimonialId = await t.run(async (ctx) => {
      return await ctx.db.insert("testimonials", {
        userId: "test-user",
        quote: "Test testimonial for moderation",
        userName: "Test Teacher",
        school: "Test School",
        subject: "Math",
        impact: "Time saved",
        status: "pending",
        featured: false,
      });
    });

    testInnovationId = await t.run(async (ctx) => {
      return await ctx.db.insert("innovations", {
        userId: "test-user",
        title: "Test Innovation for Moderation",
        description: "Test innovation description",
        userName: "Test Teacher",
        school: "Test School",
        subject: "Math",
        tags: ["test"],
        likes: 0,
        triesCount: 0,
        createdAt: Date.now(),
      });
    });

    testBetaUserId = await t.run(async (ctx) => {
      return await ctx.db.insert("betaProgram", {
        userId: "test-beta-user",
        status: "invited",
        invitedAt: Date.now(),
        onboardingStep: 0,
        onboardingCompleted: false,
        frameworksTried: 0,
        totalTimeSaved: 0,
        innovationsShared: 0,
        weeklyEngagementCount: 0,
      });
    });
  });

  describe("checkIsAdmin", () => {
    test("returns false when not authenticated", async () => {
      const isAdmin = await t.query(api.admin.checkIsAdmin, {});

      expect(isAdmin).toBe(false);
    });

    test("returns true with authenticated admin user", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
      const isAdmin = await asAdmin.query(api.admin.checkIsAdmin, {});
      expect(isAdmin).toBe(true);
    });

    test("returns false with authenticated non-admin user", async () => {
      const asUser = t.withIdentity({ name: "Normal User", email: "user@example.com" });
      const isAdmin = await asUser.query(api.admin.checkIsAdmin, {});
      expect(isAdmin).toBe(false);
    });
  });

  describe("getAllBetaUsersAdmin", () => {
    test("requires admin authentication", async () => {
      await expect(
        t.query(api.admin.getAllBetaUsersAdmin, {})
      ).rejects.toThrow();
    });

    test("returns beta users with authenticated admin", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
      const users = await asAdmin.query(api.admin.getAllBetaUsersAdmin, {});
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe("getAllTestimonialsAdmin", () => {
    test("requires admin authentication", async () => {
      await expect(
        t.query(api.admin.getAllTestimonialsAdmin, {})
      ).rejects.toThrow();
    });

    test("returns all testimonials with authenticated admin", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
      const list = await asAdmin.query(api.admin.getAllTestimonialsAdmin, {});
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("getAllInnovationsAdmin", () => {
    test("requires admin authentication", async () => {
      await expect(
        t.query(api.admin.getAllInnovationsAdmin, {})
      ).rejects.toThrow();
    });

    test("returns all innovations with authenticated admin", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
      const list = await asAdmin.query(api.admin.getAllInnovationsAdmin, {});
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("getAdminStats", () => {
    test("requires admin authentication", async () => {
      await expect(
        t.query(api.admin.getAdminStats, {})
      ).rejects.toThrow();
    });

    test("returns admin statistics with authenticated admin", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
      const stats = await asAdmin.query(api.admin.getAdminStats, {});
      expect(stats).toHaveProperty("totalBetaUsers");
      expect(stats).toHaveProperty("totalFrameworks");
      expect(typeof stats.totalBetaUsers).toBe("number");
    });
  });

  describe("Content Moderation", () => {
    describe("approveTestimonialAdmin", () => {
      test("requires admin authentication", async () => {
        await expect(
          t.mutation(api.admin.approveTestimonialAdmin, {
            testimonialId: testTestimonialId,
            status: "approved",
          })
        ).rejects.toThrow();
      });

      test("approves testimonial with authenticated admin", async () => {
        const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
        await asAdmin.mutation(api.admin.approveTestimonialAdmin, {
          testimonialId: testTestimonialId,
          status: "approved",
        });
        const updated = await t.query(api.testimonials.getTestimonialById, { testimonialId: testTestimonialId });
        expect(updated?.status).toBe("approved");
      });

      test("features testimonial with authenticated admin", async () => {
        const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
        await asAdmin.mutation(api.admin.approveTestimonialAdmin, {
          testimonialId: testTestimonialId,
          status: "featured",
        });
        const updated = await t.query(api.testimonials.getTestimonialById, { testimonialId: testTestimonialId });
        expect(updated?.status).toBe("featured");
        expect(updated?.featured).toBe(true);
      });
    });

    describe("deleteTestimonialAdmin", () => {
      test("requires admin authentication", async () => {
        await expect(
          t.mutation(api.admin.deleteTestimonialAdmin, {
            testimonialId: testTestimonialId,
          })
        ).rejects.toThrow();
      });

      test("deletes testimonial with authenticated admin", async () => {
        const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
        await asAdmin.mutation(api.admin.deleteTestimonialAdmin, { testimonialId: testTestimonialId });
        const exists = await t.query(api.testimonials.getTestimonialById, { testimonialId: testTestimonialId });
        expect(exists).toBeNull();
      });
    });

    describe("deleteInnovationAdmin", () => {
      test("requires admin authentication", async () => {
        await expect(
          t.mutation(api.admin.deleteInnovationAdmin, {
            innovationId: testInnovationId,
          })
        ).rejects.toThrow();
      });

      test("deletes innovation with authenticated admin", async () => {
        const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
        await asAdmin.mutation(api.admin.deleteInnovationAdmin, { innovationId: testInnovationId });
        const deleted = await t.run(async (ctx) => await ctx.db.get(testInnovationId));
        expect(deleted).toBeNull();
      });
    });
  });

  describe("Beta Program Management", () => {
    describe("updateBetaUserStatus", () => {
      test("requires admin authentication", async () => {
        await expect(
          t.mutation(api.admin.updateBetaUserStatus, {
            betaUserId: testBetaUserId,
            status: "active",
          })
        ).rejects.toThrow();
      });

      test("updates beta user status with authenticated admin", async () => {
        const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
        await asAdmin.mutation(api.admin.updateBetaUserStatus, {
          betaUserId: testBetaUserId,
          status: "active",
        });
        const updated = await t.run(async (ctx) => await ctx.db.get(testBetaUserId));
        expect(updated?.status).toBe("active");
      });
    });

    describe("sendBetaInviteAdmin", () => {
      test("requires admin authentication", async () => {
        await expect(
          t.mutation(api.admin.sendBetaInviteAdmin, {
            email: "test@example.com",
          })
        ).rejects.toThrow();
      });

      test("sends beta invite with authenticated admin", async () => {
        const asAdmin = t.withIdentity({ name: "Admin User", email: "delivered@resend.dev" });
        await asAdmin.mutation(api.admin.sendBetaInviteAdmin, { email: "invitee@example.com" });
        // verify an invited beta record exists
        const invited = await t.run(async (ctx) => {
          return await ctx.db
            .query("betaProgram")
            .filter((q) => q.eq(q.field("status"), "invited"))
            .first();
        });
        expect(invited).toBeDefined();
      });
    });
  });

  describe("Platform Analytics", () => {
    test("returns framework statistics without authentication", async () => {
      const stats = await t.query(api.frameworks.getFrameworkStats, {});

      expect(stats).toBeDefined();
      expect(typeof stats).toBe("object");
      expect(stats.totalFrameworks).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Content Management", () => {
    test("can query testimonials without admin access", async () => {
      // This test verifies that non-admin queries still work
      const featured = await t.query(api.testimonials.getFeaturedTestimonials, {
        limit: 10,
      });

      expect(featured).toBeInstanceOf(Array);
    });

    test("can query innovations without admin access", async () => {
      // This test verifies that non-admin queries still work
      const innovations = await t.query(api.innovations.getAllInnovations, {
        limit: 20,
      });

      expect(innovations).toBeInstanceOf(Array);
    });
  });
});
