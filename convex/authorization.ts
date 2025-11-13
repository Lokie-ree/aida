import { authComponent } from "./auth";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";

/**
 * User profile with role information
 */
export interface UserWithProfile {
  user: any; // Better Auth user object
  profile: {
    _id: string;
    userId: string;
    school?: string;
    subject?: string;
    gradeLevel?: string;
    district?: string;
    role?: "teacher" | "admin" | "coach";
  } | null;
}

/**
 * Admin email fallback list for backward compatibility during migration.
 * This will be phased out as roles are properly assigned to userProfiles.
 * 
 * @see admin.ts for current admin email list
 */
const ADMIN_EMAILS = [
  "admin@resend.dev", // Test admin user
  "rplapointjr@gmail.com"
];

/**
 * Require authentication and return user with profile.
 * 
 * This is the base helper that all other authorization helpers use.
 * It ensures the user is authenticated and fetches their profile.
 * 
 * @param ctx - Convex context object
 * @returns User with profile information
 * @throws "User must be authenticated" if no session
 * 
 * @example
 * const { user, profile } = await requireAuth(ctx);
 * console.log("User:", user.email, "Role:", profile?.role);
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
): Promise<UserWithProfile> {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) {
    throw new Error("User must be authenticated");
  }
  
  const userId = user._id;
  
  // Fetch user profile to get role information
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  
  return {
    user,
    profile: profile ? {
      _id: profile._id,
      userId: profile.userId,
      school: profile.school,
      subject: profile.subject,
      gradeLevel: profile.gradeLevel,
      district: profile.district,
      role: profile.role,
    } : null,
  };
}

/**
 * Require a specific role.
 * 
 * Checks if the authenticated user has the specified role in their profile.
 * 
 * @param ctx - Convex context object
 * @param role - Required role ("teacher" | "admin" | "coach")
 * @returns User with profile information
 * @throws "User must be authenticated" if no session
 * @throws "Role access required" if user doesn't have the required role
 * 
 * @example
 * const { user, profile } = await requireRole(ctx, "admin");
 */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  role: "teacher" | "admin" | "coach"
): Promise<UserWithProfile> {
  const { user, profile } = await requireAuth(ctx);
  
  if (profile?.role !== role) {
    throw new Error(`Role access required: ${role}`);
  }
  
  return { user, profile };
}

/**
 * Require admin access.
 * 
 * Checks if the authenticated user is an admin. Uses role-based check first,
 * then falls back to email-based check for backward compatibility during migration.
 * 
 * Migration strategy:
 * 1. Check userProfiles.role === "admin" (preferred)
 * 2. Fall back to email check if role not set (backward compatibility)
 * 
 * @param ctx - Convex context object
 * @returns User with profile information
 * @throws "User must be authenticated" if no session
 * @throws "Admin access required" if user is not admin
 * 
 * @example
 * const { user, profile } = await requireAdmin(ctx);
 * // User is guaranteed to be admin
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx
): Promise<UserWithProfile> {
  const { user, profile } = await requireAuth(ctx);
  
  // Primary check: role-based (preferred)
  if (profile?.role === "admin") {
    return { user, profile };
  }
  
  // Fallback: email-based check for backward compatibility
  // This allows existing admin users to continue working during migration
  const userEmail = (user as any).email;
  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    return { user, profile };
  }
  
  throw new Error("Admin access required");
}

/**
 * Check if user has admin access (non-throwing version).
 * 
 * Safe query helper that returns boolean without throwing errors.
 * Used by frontend queries that need to check admin status.
 * 
 * @param ctx - Convex context object
 * @returns true if user is admin, false otherwise
 * 
 * @example
 * const isAdmin = await checkIsAdmin(ctx);
 * if (isAdmin) {
 *   // Show admin UI
 * }
 */
export async function checkIsAdmin(
  ctx: QueryCtx | MutationCtx
): Promise<boolean> {
  try {
    await requireAdmin(ctx);
    return true;
  } catch {
    return false;
  }
}

