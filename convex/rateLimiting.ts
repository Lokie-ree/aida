import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

/**
 * Rate limiter configuration for different user roles and operations.
 * 
 * Tiered limits:
 * - Teachers: Standard limits
 * - Coaches: Higher limits
 * - Admins: Unlimited (or very high limits)
 * 
 * Uses fixed window algorithm for predictable rate limiting.
 */
export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // RAG queries (expensive operations)
  // Teachers: 20 requests per minute
  // Coaches: 40 requests per minute
  // Admins: 200 requests per minute (effectively unlimited)
  ragQuery: { kind: "fixed window", rate: 20, period: MINUTE },
  ragQueryCoach: { kind: "fixed window", rate: 40, period: MINUTE },
  ragQueryAdmin: { kind: "fixed window", rate: 200, period: MINUTE },
  
  // AI generation endpoints (alignment scorecard, etc.)
  // Teachers: 10 requests per minute
  // Coaches: 20 requests per minute
  // Admins: 100 requests per minute (effectively unlimited)
  aiGeneration: { kind: "fixed window", rate: 10, period: MINUTE },
  aiGenerationCoach: { kind: "fixed window", rate: 20, period: MINUTE },
  aiGenerationAdmin: { kind: "fixed window", rate: 100, period: MINUTE },
  
  // Email sending (prevent spam)
  // All users: 5 emails per hour
  // Admins: 20 emails per hour
  emailSend: { kind: "fixed window", rate: 5, period: HOUR },
  emailSendAdmin: { kind: "fixed window", rate: 20, period: HOUR },
});

/**
 * Helper to get the appropriate rate limit key based on user role
 */
export async function getRagRateLimitKey(ctx: any, userId: string, role?: "teacher" | "admin" | "coach"): Promise<string> {
  if (role === "admin") {
    return "ragQueryAdmin";
  }
  if (role === "coach") {
    return "ragQueryCoach";
  }
  return "ragQuery";
}

/**
 * Helper to get the appropriate AI generation rate limit key based on user role
 */
export async function getAiGenerationRateLimitKey(ctx: any, userId: string, role?: "teacher" | "admin" | "coach"): Promise<string> {
  if (role === "admin") {
    return "aiGenerationAdmin";
  }
  if (role === "coach") {
    return "aiGenerationCoach";
  }
  return "aiGeneration";
}

/**
 * Helper to get the appropriate email rate limit key based on user role
 */
export async function getEmailRateLimitKey(ctx: any, userId: string, role?: "teacher" | "admin" | "coach"): Promise<string> {
  if (role === "admin") {
    return "emailSendAdmin";
  }
  return "emailSend";
}

