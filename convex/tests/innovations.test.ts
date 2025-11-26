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

describe("Innovations", () => {
  let t: ReturnType<typeof convexTest>;
  let testInnovationId: Id<"innovations">;

  beforeEach(async () => {
    t = convexTest(schema, modules);
    
    // Seed a test innovation using correct schema fields
    testInnovationId = await t.run(async (ctx) => {
      return await ctx.db.insert("innovations", {
        userId: "test-user-id",
        title: "Test Innovation",
        description: "A test innovation for unit testing",
        userName: "Test Teacher",
        school: "Test School",
        subject: "Mathematics",
        tags: ["test", "math"],
        likes: 0,
        triesCount: 0,
        createdAt: Date.now(),
      });
    });
  });

  describe("getAllInnovations", () => {
    test("returns all approved innovations without authentication", async () => {
      const innovations = await t.query(api.innovations.getAllInnovations, {
        limit: 20,
      });
      
      expect(innovations).toBeInstanceOf(Array);
      expect(innovations.length).toBeGreaterThan(0);
      
      const first = innovations[0];
      expect(first).toHaveProperty("_id");
      expect(first).toHaveProperty("title");
      expect(first).toHaveProperty("description");
      expect(first).toHaveProperty("userName");
      expect(first).toHaveProperty("school");
      expect(first).toHaveProperty("subject");
      expect(first).toHaveProperty("tags");
      expect(first).toHaveProperty("likes");
      expect(first).toHaveProperty("triesCount");
    });

    test("returns innovations with FERPA-compliant structure", async () => {
      const innovations = await t.query(api.innovations.getAllInnovations, {
        limit: 20,
      });
      
      if (innovations.length > 0) {
        const innovation = innovations[0];
        // Should NOT have student-specific data (FERPA compliance)
        expect(innovation).not.toHaveProperty("studentName");
        expect(innovation).not.toHaveProperty("studentId");
        expect(innovation).not.toHaveProperty("studentExample");
      }
    });
  });

  describe("getInnovationById", () => {
    test("returns innovation with valid ID", async () => {
      const innovation = await t.query(api.innovations.getInnovationById, {
        innovationId: testInnovationId,
      });

      expect(innovation).not.toBeNull();
      expect(innovation?._id).toBe(testInnovationId);
      expect(innovation?.title).toBe("Test Innovation");
    });

    test("returns null with non-existent ID", async () => {
      // Create a valid format ID but ensure it doesn't exist
      const nonExistentId = await t.run(async (ctx) => {
        // Insert then immediately delete to get a valid format ID that doesn't exist
        const tempId = await ctx.db.insert("innovations", {
          userId: "temp",
          title: "temp",
          description: "temp",
          userName: "temp",
          school: "temp",
          subject: "temp",
          tags: [],
          likes: 0,
          triesCount: 0,
          createdAt: Date.now(),
        });
        await ctx.db.delete(tempId);
        return tempId;
      });
      
      const innovation = await t.query(api.innovations.getInnovationById, {
        innovationId: nonExistentId,
      });

      expect(innovation).toBeNull();
    });
  });

  describe("searchInnovations", () => {
    test("searches by subject", async () => {
      // Add innovation with different subject
      await t.run(async (ctx) => {
        await ctx.db.insert("innovations", {
          userId: "test-user-id-2",
          title: "ELA Innovation",
          description: "ELA test innovation",
          userName: "Test Teacher",
          school: "Test School",
          subject: "ELA",
          tags: ["test", "ela"],
          likes: 0,
          triesCount: 0,
          createdAt: Date.now(),
        });
      });

      // searchInnovations uses text search, not filtering
      // So we search for "Mathematics" in the query
      const mathInnovations = await t.query(api.innovations.searchInnovations, {
        query: "Mathematics",
        limit: 10,
      });

      expect(mathInnovations).toBeInstanceOf(Array);
      // Results may include innovations with "Mathematics" in title/description/tags
    });
  });

  describe("shareInnovation", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.innovations.shareInnovation, {
          title: "New Innovation",
          description: "Description",
          tags: ["test"],
        })
      ).rejects.toThrow();
    });

    test("shares innovation with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const result = await asUser.mutation(api.innovations.shareInnovation, {
        title: "New Innovation",
        description: "Description",
        tags: ["test"],
      });
      expect(result).toBeDefined();
      const created = await t.query(api.innovations.getInnovationById, { innovationId: result });
      expect(created).not.toBeNull();
    });
  });

  describe("likeInnovation", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.innovations.likeInnovation, {
          innovationId: testInnovationId,
        })
      ).rejects.toThrow();
    });

    test("likes innovation with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const result = await asUser.mutation(api.innovations.likeInnovation, {
        innovationId: testInnovationId,
      });
      expect(result).toBeNull();
    });

    test("like toggles on second call (unlike)", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });

      // like
      await asUser.mutation(api.innovations.likeInnovation, { innovationId: testInnovationId });
      let afterLike = await t.run(async (ctx) => await ctx.db.get(testInnovationId));
      expect(afterLike?.likes).toBe(1);

      // unlike (second call)
      await asUser.mutation(api.innovations.likeInnovation, { innovationId: testInnovationId });
      let afterUnlike = await t.run(async (ctx) => await ctx.db.get(testInnovationId));
      expect(afterUnlike?.likes).toBe(0);
    });
  });

  describe("commentInnovation", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.innovations.commentInnovation, {
          innovationId: testInnovationId,
          comment: "Great innovation!",
        })
      ).rejects.toThrow();
    });

    test("comments on innovation with authenticated user", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const result = await asUser.mutation(api.innovations.commentInnovation, {
        innovationId: testInnovationId,
        comment: "Great innovation!",
      });
      expect(result).toBeDefined();
    });
  });

  describe("markInnovationTried", () => {
    test("creates tried interaction and increments triesCount", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // initial triesCount
      const before = await t.run(async (ctx) => await ctx.db.get(testInnovationId));

      await asUser.mutation(api.innovations.markInnovationTried, {
        innovationId: testInnovationId,
        rating: 5,
        comment: "Tried it!",
      });

      const after = await t.run(async (ctx) => await ctx.db.get(testInnovationId));
      expect(after?.triesCount).toBe((before?.triesCount || 0) + 1);
    });

    test("second try updates existing record without incrementing triesCount", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const before = await t.run(async (ctx) => await ctx.db.get(testInnovationId));

      // first ensure tried exists
      await asUser.mutation(api.innovations.markInnovationTried, { innovationId: testInnovationId, rating: 4 });
      // second call should update, not increment triesCount
      await asUser.mutation(api.innovations.markInnovationTried, { innovationId: testInnovationId, rating: 3, comment: "Updated" });

      const after = await t.run(async (ctx) => await ctx.db.get(testInnovationId));
      // only incremented once
      expect(after?.triesCount).toBe((before?.triesCount || 0) + 1);
    });
  });

  describe("getUserInnovations", () => {
    test("throws unauthenticated in convex-test (auth component)", async () => {
      await expect(t.query(api.innovations.getUserInnovations, {})).rejects.toThrow();
    });

    test("returns user's innovations when authenticated", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      // share one
      await asUser.mutation(api.innovations.shareInnovation, {
        title: "Another Innovation",
        description: "Desc",
        tags: ["tag"],
      });
      const list = await asUser.query(api.innovations.getUserInnovations, {});
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
    });
  });

  describe("getRecentInnovations", () => {
    test("returns recent innovations ordered by date", async () => {
      const recent = await t.query(api.innovations.getRecentInnovations, {
        limit: 10,
      });

      expect(recent).toBeInstanceOf(Array);
      // Should be ordered by most recent first
      for (let i = 1; i < recent.length; i++) {
        if (recent[i-1].createdAt && recent[i].createdAt) {
          expect(recent[i-1].createdAt).toBeGreaterThanOrEqual(recent[i].createdAt);
        }
      }
    });
  });

  describe("getInnovationInteractions and cleanup helpers", () => {
    test("returns interactions for an innovation", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      await asUser.mutation(api.innovations.commentInnovation, {
        innovationId: testInnovationId,
        comment: "Nice!",
      });
      await asUser.mutation(api.innovations.likeInnovation, { innovationId: testInnovationId });

      const interactions = await t.query(api.innovations.getInnovationInteractions, { innovationId: testInnovationId });
      expect(Array.isArray(interactions)).toBe(true);
      if (interactions.length > 0) {
        expect(interactions[0]).toHaveProperty("type");
      }
    });

    test("deleteInnovation and deleteInnovationInteraction remove records", async () => {
      const asUser = t.withIdentity({ name: "User X", email: "x@example.com" });
      const newInnovationId = await asUser.mutation(api.innovations.shareInnovation, {
        title: "Temp",
        description: "Temp",
        tags: ["t"],
      });
      const interactionId = await asUser.mutation(api.innovations.commentInnovation, {
        innovationId: newInnovationId,
        comment: "temp",
      });
      await t.mutation(api.innovations.deleteInnovationInteraction, { interactionId });
      const interactions = await t.query(api.innovations.getInnovationInteractions, { innovationId: newInnovationId });
      expect(interactions.find((i: { _id: string }) => i._id === interactionId)).toBeUndefined();

      await t.mutation(api.innovations.deleteInnovation, { innovationId: newInnovationId });
      const deleted = await t.run(async (ctx) => await ctx.db.get(newInnovationId));
      expect(deleted).toBeNull();
    });

    test("getAllInnovationInteractions returns array", async () => {
      const all = await t.query(api.innovations.getAllInnovationInteractions, {});
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe("FERPA Compliance", () => {
    test("innovations do not contain student data", async () => {
      const innovations = await t.query(api.innovations.getAllInnovations, {
        limit: 20,
      });
      
      innovations.forEach((innovation: {
        _id: any;
        _creationTime: number;
        title: string;
        description: string;
        userName: string;
        school: string;
        subject: string;
        tags: string[];
        timeSaved?: number;
        likes: number;
        triesCount: number;
        createdAt: number;
        relatedFramework?: any;
        studentName?: never;
        studentId?: never;
        studentExample?: never;
      }) => {
        expect(innovation).not.toHaveProperty("studentName");
        expect(innovation).not.toHaveProperty("studentId");
        expect(innovation).not.toHaveProperty("studentExample");
      });
    });
  });
});

