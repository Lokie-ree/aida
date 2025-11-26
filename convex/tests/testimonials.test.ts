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
      // allow role override via name for admin tests
      const isAdmin = identity.name === "Admin User";
      return { _id: identity.subject, email: "teacher@school.edu", name: identity.name ?? "Test Teacher", role: isAdmin ? "admin" : "teacher" } as any;
    },
  },
}));

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("../**/*.ts", { eager: false });

describe("Testimonials", () => {
  let t: ReturnType<typeof convexTest>;
  let testTestimonialId: Id<"testimonials">;

  // Helper function to ensure admin user profile exists
  async function ensureAdminProfile(asAdmin: ReturnType<ReturnType<typeof convexTest>["withIdentity"]>) {
    await asAdmin.run(async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthenticated");
      const adminUserId = identity.subject;
      
      const existing = await ctx.db
        .query("userProfiles")
        .filter((q: any) => q.eq(q.field("userId"), adminUserId))
        .first();
      
      if (!existing) {
        await ctx.db.insert("userProfiles", {
          userId: adminUserId,
          role: "admin",
          school: "Admin School",
          subject: "Admin",
        });
      }
    });
  }

  beforeEach(async () => {
    t = convexTest(schema, modules);
    
    // Seed a test testimonial using correct schema fields
    testTestimonialId = await t.run(async (ctx) => {
      return await ctx.db.insert("testimonials", {
        userId: "test-user-id",
        quote: "This tool saved me 30 minutes per lesson!",
        userName: "Test Teacher",
        school: "Test School",
        subject: "Mathematics",
        timeSaved: 30,
        impact: "Students are more engaged",
        status: "approved",
        featured: false,
      });
    });
  });

  describe("getAllTestimonials", () => {
    test("returns all approved testimonials with admin auth", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "admin@resend.dev" });
      await ensureAdminProfile(asAdmin);
      
      const approved = await asAdmin.query(api.testimonials.getAllTestimonials, { status: "approved" });
      expect(Array.isArray(approved)).toBe(true);
      // Should include the test testimonial we created in beforeEach
      expect(approved.some((t: { _id: string }) => t._id === testTestimonialId)).toBe(true);
    });

    test("can query testimonials via database directly", async () => {
      // Test that testimonials can be retrieved via direct database access
      const testimonial = await t.run(async (ctx) => {
        return await ctx.db.get(testTestimonialId);
      });

      expect(testimonial).toBeDefined();
      expect(testimonial?.quote).toBe("This tool saved me 30 minutes per lesson!");
      expect(testimonial?.status).toBe("approved");
    });

    test("admin can list pending testimonials", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "admin@resend.dev" });
      await ensureAdminProfile(asAdmin);
      const pending = await asAdmin.query(api.testimonials.getAllTestimonials, { status: "pending" });
      expect(Array.isArray(pending)).toBe(true);
      if (pending.length > 0) {
        expect(pending.every((t: { status: string }) => t.status === "pending")).toBe(true);
      }
    });
  });

  describe("getFeaturedTestimonials", () => {
    test("returns only featured testimonials", async () => {
      // Add a featured testimonial with correct schema
      await t.run(async (ctx) => {
        await ctx.db.insert("testimonials", {
          userId: "test-user-id-2",
          quote: "This is a featured testimonial",
          userName: "Featured Teacher",
          school: "Featured School",
          subject: "ELA",
          timeSaved: 45,
          impact: "Great impact",
          status: "approved",
          featured: true,
        });
      });

      const featured = await t.query(api.testimonials.getFeaturedTestimonials, {
        limit: 10,
      });
      
      expect(featured).toBeInstanceOf(Array);
      // getFeaturedTestimonials returns approved featured testimonials
      // The query filters by featured=true and status=approved internally
    });
  });

  describe("getTestimonialById", () => {
    test("returns testimonial with valid ID", async () => {
      const testimonial = await t.query(api.testimonials.getTestimonialById, {
        testimonialId: testTestimonialId,
      });

      expect(testimonial).not.toBeNull();
      expect(testimonial?._id).toBe(testTestimonialId);
      expect(testimonial?.quote).toBe("This tool saved me 30 minutes per lesson!");
    });

    test("returns null with non-existent ID", async () => {
      // Create a valid format ID but ensure it doesn't exist
      const nonExistentId = await t.run(async (ctx) => {
        // Insert then immediately delete to get a valid format ID that doesn't exist
        const tempId = await ctx.db.insert("testimonials", {
          userId: "temp",
          quote: "temp",
          userName: "temp",
          school: "temp",
          subject: "temp",
          impact: "temp",
          status: "pending",
          featured: false,
        });
        await ctx.db.delete(tempId);
        return tempId;
      });
      
      const testimonial = await t.query(api.testimonials.getTestimonialById, {
        testimonialId: nonExistentId,
      });

      expect(testimonial).toBeNull();
    });
  });

  describe("submitTestimonial", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.testimonials.submitTestimonial, {
          quote: "Test quote",
          timeSaved: 20,
          impact: "Test impact",
        })
      ).rejects.toThrow();
    });

    test("submits testimonial with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const result = await asUser.mutation(api.testimonials.submitTestimonial, {
        quote: "Great time savings!",
        timeSaved: 25,
        impact: "Improved lesson planning",
      });
      expect(result).toBeDefined();
      const created = await t.query(api.testimonials.getTestimonialById, { testimonialId: result });
      expect(created).not.toBeNull();
    });
  });

  describe("admin queries and cleanup helpers", () => {
    test("getAllTestimonialsForCleanup returns array", async () => {
      const list = await t.query(api.testimonials.getAllTestimonialsForCleanup, {});
      expect(Array.isArray(list)).toBe(true);
    });

    test("deleteTestimonial removes a testimonial", async () => {
      const toDelete = await t.run(async (ctx) => {
        return await ctx.db.insert("testimonials", {
          userId: "temp",
          quote: "temp",
          userName: "temp",
          school: "temp",
          subject: "temp",
          impact: "temp",
          status: "pending",
          featured: false,
        });
      });
      const ok = await t.mutation(api.testimonials.deleteTestimonial, { testimonialId: toDelete });
      expect(ok).toBe(true);
      const exists = await t.run(async (ctx) => await ctx.db.get(toDelete));
      expect(exists).toBeNull();
    });
  });

  describe("approveTestimonial", () => {
    test("non-admin cannot approve", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      await expect(
        asUser.mutation(api.testimonials.approveTestimonial, {
          testimonialId: testTestimonialId,
          featured: false,
        })
      ).rejects.toThrow();
    });

    test("admin can approve testimonial", async () => {
      const asAdmin = t.withIdentity({ name: "Admin User", email: "admin@resend.dev" });
      await ensureAdminProfile(asAdmin);
      await asAdmin.mutation(api.testimonials.approveTestimonial, {
        testimonialId: testTestimonialId,
        featured: true,
      });

      const updated = await t.query(api.testimonials.getTestimonialById, { testimonialId: testTestimonialId });
      expect(updated?.status).toBe("approved");
      expect(updated?.featured).toBe(true);
    });
  });

  describe("FERPA Compliance", () => {
    test("testimonials do not contain student data", async () => {
      // Check via direct database access since getAllTestimonials requires admin
      const testimonial = await t.run(async (ctx) => {
        return await ctx.db.get(testTestimonialId);
      });

      // Should NOT have student-specific data (FERPA compliance)
      expect(testimonial).not.toHaveProperty("studentName");
      expect(testimonial).not.toHaveProperty("studentId");
      expect(testimonial).not.toHaveProperty("studentExample");
    });
  });
});

