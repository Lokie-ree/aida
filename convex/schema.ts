import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Pelican AI Database Schema
 * 
 * Note: Better Auth tables (user, session, account, verification) are automatically
 * managed by the @convex-dev/better-auth component and don't need to be defined here.
 * 
 * Note: The RAG tables (documents, chatMessages, feedbackSessions, auditLogs) are
 * automatically managed by the @convex-dev/rag component and don't need to be defined here.
 */

const applicationTables = {
  // ============================================
  // PHASE 1 TABLES (Active in Production)
  // ============================================
  
  /**
   * Beta program signups - main table for the landing page
   * 
   * Flow: User submits form → betaSignup created with "pending" status
   * → Admin approves → User account created → Status becomes "approved"
   * 
   * @see ADR-004 for Better Auth migration decision
   * @see betaSignup.ts for mutation functions
   */
  betaSignups: defineTable({
    email: v.string(), // Primary identifier, must be unique
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),  // Initial state after signup
      v.literal("approved"), // After admin approval
      v.literal("rejected")  // If not suitable for beta
    ),
    signupDate: v.number(), // Unix timestamp
    betaProgramId: v.string(), // Links to betaProgram entry
    notes: v.optional(v.string()), // Admin notes for approval decisions
    isTestData: v.optional(v.boolean()), // Flag for test data isolation
  }).index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_signup_date", ["signupDate"]),

  /**
   * User profile extensions (Better Auth manages core user data)
   * 
   * Extends Better Auth user records with Louisiana educator-specific information.
   * Used for personalization, analytics, and Louisiana standards alignment.
   * 
   * @see ADR-004 for Better Auth integration details
   * @see userProfiles.ts for mutation functions
   */
  userProfiles: defineTable({
    userId: v.string(), // References Better Auth user ID (legacy)
    authId: v.optional(v.string()), // Better Auth user ID (new pattern)
    school: v.optional(v.string()), // Louisiana school name
    subject: v.optional(v.string()), // Teaching subject (e.g., "Mathematics", "English")
    gradeLevel: v.optional(v.string()), // Grade level taught (e.g., "K-5", "9-12")
    district: v.optional(v.string()), // Louisiana school district
    role: v.optional(v.union(
      v.literal("teacher"),  // Classroom teacher
      v.literal("admin"),    // School administrator
      v.literal("coach")     // Instructional coach
    )),
    isTestData: v.optional(v.boolean()), // Flag for test data isolation
  }).index("by_user", ["userId"]).index("authId", ["authId"]),

  // ============================================
  // PHASE 2 TABLES (Backend Ready, UI Not Exposed)
  // ============================================
  // These tables have full CRUD operations implemented but are not exposed to users yet.
  // They will be activated when Phase 2 UI is connected to the backend.
  
  /**
   * AI Guidance Frameworks (Atomic Notes)
   * 
   * Core content table containing AI guidance frameworks designed for Louisiana educators.
   * Each framework provides platform-agnostic guidance that works with ANY AI tool.
   * 
   * USER-003: Framework Library Access
   * Educators can browse, search, and use frameworks to save time on AI prompt writing.
   * 
   * @see frameworks.ts for CRUD operations (80+ functions implemented)
   * @see seedFrameworks.ts for initial data population
   */
  frameworks: defineTable({
    frameworkId: v.string(), // Unique identifier for framework
    title: v.string(), // Framework title (e.g., "Create Differentiated Lesson Plans")
    module: v.union(
      v.literal("ai-basics-hub"),           // Basic AI concepts and safety
      v.literal("instructional-expert-hub") // Advanced instructional applications
    ),
    category: v.string(), // Framework category (e.g., "Lesson Planning", "Assessment")
    tags: v.array(v.string()), // Searchable tags
    challenge: v.string(), // The teaching challenge this framework addresses
    solution: v.string(), // How AI can help solve the challenge
    samplePrompt: v.string(), // Copy-paste ready prompt template
    ethicalGuardrail: v.string(), // Ethical considerations and guidelines
    tipsAndVariations: v.optional(v.string()), // Additional tips and variations
    timeEstimate: v.number(), // Estimated time savings in minutes
    difficultyLevel: v.union(
      v.literal("beginner"),    // New to AI tools
      v.literal("intermediate"), // Some AI experience
      v.literal("advanced")     // Experienced AI user
    ),
    platformCompatibility: v.array(v.string()), // Compatible AI tools (e.g., ["ChatGPT", "Gemini", "Claude"])
    louisianaStandards: v.optional(v.array(v.string())), // Louisiana state standards alignment
    lerDomains: v.optional(v.array(v.string())), // Louisiana Educator Rubric domains
    status: v.union(
      v.literal("draft"),     // Work in progress
      v.literal("beta"),      // Beta testing
      v.literal("published")  // Live for users
    ),
    createdBy: v.string(), // Creator user ID
    publishedAt: v.optional(v.number()), // Publication timestamp
    usageCount: v.number(), // Number of times used
    averageRating: v.optional(v.number()), // User rating (1-5)
    averageTimeSaved: v.optional(v.number()), // Average time saved per use
    isTestData: v.optional(v.boolean()), // Flag for test data isolation
  }).index("by_module", ["module"])
    .index("by_category", ["category"])
    .index("by_framework_id", ["frameworkId"])
    .index("by_status", ["status"])
    .searchIndex("search_content", {
      searchField: "title",
      filterFields: ["module", "category", "status"],
    }),

  /**
   * Framework Usage Tracking
   * 
   * Records framework usage and time saved for analytics.
   * 
   * USER-003: Framework Library Access
   * Tracks when educators use frameworks to measure impact and
   * provide personalized recommendations.
   * 
   * @see frameworks.ts for usage tracking functions
   * @see timeTracking.ts for time savings analytics
   */
  frameworkUsage: defineTable({
    frameworkId: v.id("frameworks"), // Reference to frameworks table
    userId: v.string(), // User who used the framework
    action: v.union(
      v.literal("viewed"),        // User viewed framework details
      v.literal("copied_prompt"), // User copied the sample prompt
      v.literal("marked_tried"),  // User marked as tried
      v.literal("saved")          // User saved framework for later
    ),
    rating: v.optional(v.number()), // User rating (1-5)
    timeSaved: v.optional(v.number()), // Minutes saved (user's estimate)
    comment: v.optional(v.string()), // User feedback or notes
    timestamp: v.number(), // When the action occurred
    isTestData: v.optional(v.boolean()), // Flag for test data isolation
  }).index("by_framework", ["frameworkId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  /**
   * User Testimonials
   * 
   * Stores user feedback and success stories about framework usage.
   * Used for social proof and community building.
   * 
   * @see testimonials.ts for CRUD operations
   */
  testimonials: defineTable({
    userId: v.string(), // User who provided testimonial
    frameworkId: v.optional(v.id("frameworks")), // Optional framework reference
    quote: v.string(), // Testimonial text
    timeSaved: v.optional(v.number()), // Time saved in minutes
    impact: v.string(), // Description of impact on teaching
    userName: v.string(), // Display name (may be anonymized)
    school: v.string(), // Louisiana school name
    subject: v.string(), // Teaching subject
    status: v.union(
      v.literal("pending"),  // Awaiting approval
      v.literal("approved"), // Approved for display
      v.literal("featured")  // Featured testimonial
    ),
    approvedBy: v.optional(v.string()), // Admin who approved
    approvedAt: v.optional(v.number()), // Approval timestamp
    featured: v.boolean(), // Whether this is a featured testimonial
    displayOrder: v.optional(v.number()), // Order for display
    isTestData: v.optional(v.boolean()), // Flag for test data isolation
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"]),

  // Beta Program Tracking
  betaProgram: defineTable({
    userId: v.string(),
    status: v.union(v.literal("invited"), v.literal("active"), v.literal("completed")),
    invitedAt: v.number(),
    joinedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    onboardingStep: v.number(),
    onboardingCompleted: v.boolean(),
    frameworksTried: v.number(),
    totalTimeSaved: v.number(),
    innovationsShared: v.number(),
    officeHoursAttended: v.number(),
    lastWeeklyPromptOpened: v.optional(v.number()),
    weeklyEngagementCount: v.number(),
    isTestData: v.optional(v.boolean()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Community Innovations
  innovations: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    relatedFramework: v.optional(v.id("frameworks")),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
    userName: v.string(),
    school: v.string(),
    subject: v.string(),
    likes: v.number(),
    triesCount: v.number(),
    createdAt: v.number(),
    isTestData: v.optional(v.boolean()),
  }).index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_innovations", {
      searchField: "title",
      filterFields: ["tags", "school", "subject"],
    }),

  // Innovation Interactions (likes, tries, comments)
  innovationInteractions: defineTable({
    innovationId: v.id("innovations"),
    userId: v.string(),
    type: v.union(v.literal("like"), v.literal("tried"), v.literal("comment")),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
    timestamp: v.number(),
    isTestData: v.optional(v.boolean()),
  }).index("by_innovation", ["innovationId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  /**
   * Time Tracking
   * 
   * Records detailed time savings from framework usage for analytics.
   * Used to measure impact and provide personalized recommendations.
   * 
   * @see timeTracking.ts for CRUD operations
   * @see frameworkUsage for related usage tracking
   */
  timeTracking: defineTable({
    userId: v.string(), // User who saved time
    frameworkId: v.id("frameworks"), // Framework that saved time
    timeSaved: v.number(), // Time saved in minutes
    activity: v.string(), // Description of what was done
    category: v.optional(v.string()), // Optional categorization (e.g., "Lesson Planning", "Assessment")
    timestamp: v.number(), // When the time was saved
    isTestData: v.optional(v.boolean()), // Flag for test data isolation
  }).index("by_user", ["userId"])
    .index("by_framework", ["frameworkId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_category", ["category"]),
};

export default defineSchema({
  ...applicationTables,
});
