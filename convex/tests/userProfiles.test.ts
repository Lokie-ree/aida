import { convexTest } from "convex-test";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

// Bridge Better Auth: mock authComponent to derive user from ctx.auth
vi.mock("../auth", () => ({
  authComponent: {
    getAuthUser: async (ctx: any) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Unauthenticated");
      }
      const isAdmin = identity.name === "Admin User";
      return {
        _id: identity.subject,
        email: "teacher@school.edu",
        name: identity.name ?? "Test Teacher",
        role: isAdmin ? "admin" : "teacher",
      } as any;
    },
  },
}));

// Explicitly provide modules for convex-test
// @ts-expect-error - import.meta.glob is a Vite feature, TypeScript doesn't recognize it
const modules = import.meta.glob("../**/*.ts", { eager: false });

describe("User Profiles", () => {
  let t: ReturnType<typeof convexTest>;

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
    
    // Note: Functions using authComponent.getAuthUser() have limitations in convex-test
    // They require Better Auth component registration which has complexities
  });

  describe("getUserProfile", () => {
    test("returns null when not authenticated", async () => {
      const profile = await t.query(api.userProfiles.getUserProfile);
      
      expect(profile).toBeNull();
    });
  });

  describe("createUserProfile", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.userProfiles.createUserProfile, {
          school: "Test School",
          subject: "Math",
          gradeLevel: "9-12",
        })
      ).rejects.toThrow();
    });

    test("creates profile with authenticated user", async () => {
      const asUser = t.withIdentity({
        name: "Test Teacher",
        email: "teacher@school.edu",
      });

      const result = await asUser.mutation(api.userProfiles.createUserProfile, {
        school: "Test School",
        subject: "Math",
        gradeLevel: "9-12",
      });
      expect(result).toBeDefined();
      // Verify the created profile exists
      const profile = await asUser.query(api.userProfiles.getUserProfile);
      expect(profile?.school).toBe("Test School");
    });

    test("throws on duplicate create", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      await asUser.mutation(api.userProfiles.createUserProfile, {
        school: "Dup School",
      });
      await expect(
        asUser.mutation(api.userProfiles.createUserProfile, {
          school: "Dup School",
        })
      ).rejects.toThrow();
    });
  });

  describe("updateUserProfile", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.userProfiles.updateUserProfile, {
          school: "Updated School",
          subject: "Science",
        })
      ).rejects.toThrow();
    });

    test("updates profile with authenticated user", async () => {
      const asUser = t.withIdentity({
        name: "Test Teacher",
        email: "teacher@school.edu",
      });

      // ensure profile exists first
      await asUser.mutation(api.userProfiles.createUserProfile, {
        school: "Initial School",
        subject: "Math",
      });

      await asUser.mutation(api.userProfiles.updateUserProfile, {
        school: "Updated School",
        subject: "Science",
      });

      const profile = await asUser.query(api.userProfiles.getUserProfile);
      expect(profile?.school).toBe("Updated School");
      expect(profile?.subject).toBe("Science");
    });

    test("updates optional fields without touching others", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      await asUser.mutation(api.userProfiles.createUserProfile, { school: "Initial", subject: "Math" });
      await asUser.mutation(api.userProfiles.updateUserProfile, { gradeLevel: "9-12" });
      const profile = await asUser.query(api.userProfiles.getUserProfile);
      expect(profile?.gradeLevel).toBe("9-12");
    });
  });

  describe("initializeNewUser", () => {
    test("requires authentication", async () => {
      const result = await t.mutation(api.userProfiles.initializeNewUser);
      
      // Function returns {success: false, message: "..."} instead of throwing
      expect(result).toHaveProperty("success");
      expect(result.success).toBe(false);
      expect(result.message).toContain("authenticated");
    });

    test("initializes profile and beta program with authenticated user", async () => {
      const asUser = t.withIdentity({
        name: "Test Teacher",
        email: "teacher@school.edu",
      });

      const result = await asUser.mutation(api.userProfiles.initializeNewUser);
      expect(result).toHaveProperty("success");
    });
  });

  describe("initializeProfileForBeta", () => {
    test("requires authentication", async () => {
      await expect(
        t.mutation(api.userProfiles.initializeProfileForBeta, { school: "S" })
      ).rejects.toThrow();
    });

    test("creates profile for authenticated user when none exists", async () => {
      const asUser = t.withIdentity({ name: "Test Teacher", email: "teacher@school.edu" });
      const profileId = await asUser.mutation(api.userProfiles.initializeProfileForBeta, {
        school: "Pelican High",
        subject: "ELA",
      });
      expect(profileId).toBeDefined();
    });
  });

  describe("createUserProfileForUserId (unauthenticated)", () => {
    test("creates when not exists and returns existing on duplicate", async () => {
      const created = await t.mutation(api.userProfiles.createUserProfileForUserId, {
        userId: "user-no-auth",
        school: "S1",
      });
      expect(created).toBeDefined();

      const again = await t.mutation(api.userProfiles.createUserProfileForUserId, {
        userId: "user-no-auth",
        school: "S1",
      });
      expect(again).toBe(created);
    });
  });

  describe("syncExistingUsers and debugDatabaseState", () => {
    // syncExistingUsers and debugDatabaseState were removed
    // User initialization now happens automatically via initializeNewUser
    test.skip("syncExistingUsers - function removed", async () => {});
  });

  describe("getAllUserProfiles", () => {
    test("returns empty array when not authenticated", async () => {
      // getAllUserProfiles requires admin access, so it should throw when not authenticated
      await expect(
        t.query(api.userProfiles.getAllUserProfiles)
      ).rejects.toThrow();
    });

    test("non-admin is forbidden", async () => {
      const asUser = t.withIdentity({ name: "Normal User", email: "user@example.com" });
      await expect(asUser.query(api.userProfiles.getAllUserProfiles, {} as any)).rejects.toThrow();
    });

    test("admin can list profiles", async () => {
      // seed two profiles
      await t.run(async (ctx) => {
        await ctx.db.insert("userProfiles", { userId: "u1", school: "S1", subject: "Math" });
        await ctx.db.insert("userProfiles", { userId: "u2", school: "S2", subject: "ELA" });
      });
      const asAdmin = t.withIdentity({ name: "Admin User", email: "admin@resend.dev" });
      await ensureAdminProfile(asAdmin);
      const profiles = await asAdmin.query(api.userProfiles.getAllUserProfiles);
      expect(Array.isArray(profiles)).toBe(true);
      expect(profiles.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("profile data structure", () => {
    test("can insert profile data directly via database", async () => {
      // Test that profile schema is correct by inserting directly
      const profileId = await t.run(async (ctx) => {
        return await ctx.db.insert("userProfiles", {
          userId: "test-user-id",
          school: "Test School",
          subject: "Mathematics",
          gradeLevel: "9-12",
          role: "teacher",
        });
      });

      expect(profileId).toBeDefined();

      // Verify we can retrieve it
      const profile = await t.run(async (ctx) => {
        return await ctx.db.get(profileId);
      });

      expect(profile).toBeDefined();
      expect(profile?.school).toBe("Test School");
      expect(profile?.subject).toBe("Mathematics");
      expect(profile?.role).toBe("teacher");
    });
  });
});

