# System Architecture Document
## ~~AI for LA Educators Platform~~ → Pelican AI

**Version:** 1.0  
**Date:** October 4, 2025  
**Status:** Phase 3 - System Architecture (ARCHIVED - See note below)  
**Owner:** System Architect  

---

## ⚠️ BRANDING & TECHNICAL UPDATE NOTICE

**This architecture document was created before final branding and technical decisions.** Key updates since planning:

### Branding
- **Platform Name:** Now **"Pelican AI"** (not "AI for LA Educators")
- **Colors:** Pelican Blue `#0ea5e9`, Louisiana Gold `#f59e0b`
- **Logo:** Pelican (Louisiana state bird), not compass

### Technical
- **Authentication:** Migrated to **Better Auth** (not Convex Auth) - See [ADR 004](../../decisions/004-migrate-to-better-auth.md)
- **Component Structure:** Organized into auth/, community/, dashboard/, framework/, shared/, legacy/
- **Design System:** Fully implemented at [src/lib/design-system.ts](../../../src/lib/design-system.ts)

### Current Documentation
- **Architecture:** [ARCHITECTURE.md](../../../ARCHITECTURE.md)
- **Brand Guidelines:** [docs/PELICAN_AI_BRAND_GUIDELINES.md](../../PELICAN_AI_BRAND_GUIDELINES.md)
- **Decisions:** [docs/decisions/](../../decisions/)

---

## 1. Executive Summary

This document defines the technical architecture for the platform, building upon the existing A.I.D.A. codebase. The architecture leverages the current Convex backend, React frontend, and design system while introducing new features specific to the educator empowerment initiative.

### 1.1 Architectural Approach

**Evolution, Not Revolution:** Rather than rebuilding from scratch, we're strategically extending the existing A.I.D.A. platform to serve the AI for LA Educators use case. This approach:
- Preserves proven infrastructure (Convex, authentication, RAG system)
- Reuses existing components (spaces, documents, chat)
- Adds educator-specific features (frameworks, testimonials, beta program)
- Maintains compatibility with future A.I.D.A. features

### 1.2 Key Architectural Decisions

1. **Repurpose "Spaces" as "Frameworks"** - The existing spaces concept maps perfectly to framework categories
2. **Extend Schema** - Add new tables for frameworks, testimonials, and beta program tracking
3. **Reuse RAG System** - Leverage existing document processing for framework content
4. **Preserve Authentication** - Keep Convex Auth with Password provider
5. **Enhance Design System** - Update color palette and typography per design docs
6. **Add Framework Management** - New backend APIs for framework CRUD operations

---

## 2. System Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript + Vite                        │  │
│  │  - Landing Page (Unauthenticated)                    │  │
│  │  - Dashboard (Authenticated)                         │  │
│  │  - Framework Library                                 │  │
│  │  - Framework Detail Pages                            │  │
│  │  - Community Hub                                     │  │
│  │  - User Profile & Settings                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UI Components (shadcn/ui + Custom)                  │  │
│  │  - Framework Card                                    │  │
│  │  - Testimonial Card                                  │  │
│  │  - Time Savings Tracker                              │  │
│  │  - Beta Tester Badge                                 │  │
│  │  - Feedback Modal                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layer (Convex)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Layer (Queries, Mutations, Actions)            │  │
│  │  - frameworks.ts (new)                               │  │
│  │  - testimonials.ts (new)                             │  │
│  │  - betaProgram.ts (new)                              │  │
│  │  - spaces.ts (existing - repurposed)                 │  │
│  │  - chat.ts (existing)                                │  │
│  │  - documents.ts (existing)                           │  │
│  │  - auth.ts (existing)                                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Layer (Convex Database)                        │  │
│  │  - frameworks (new table)                            │  │
│  │  - frameworkUsage (new table)                        │  │
│  │  - testimonials (new table)                          │  │
│  │  - innovations (new table)                           │  │
│  │  - users (existing - extended)                       │  │
│  │  - spaces (existing)                                 │  │
│  │  - documents (existing)                              │  │
│  │  - chatMessages (existing)                           │  │
│  │  - auditLogs (existing)                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   External Services                         │
│  - OpenAI API (existing - for RAG and chat)                │
│  - Resend (existing - for email)                            │
│  - Convex File Storage (existing - for documents)           │
│  - Vapi.ai (existing - voice interface, future)             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack (Current + Additions)

**Frontend:**
- ✅ React 19 (existing)
- ✅ TypeScript (existing)
- ✅ Vite (existing)
- ✅ Tailwind CSS (existing)
- ✅ shadcn/ui components (existing)
- ✅ Framer Motion (existing)
- ✅ Lucide React icons (existing)
- ✅ Sonner for toasts (existing)
- 🆕 Updated design tokens (Lexend, Poppins fonts)

**Backend:**
- ✅ Convex (existing - real-time database + serverless functions)
- ✅ Convex Auth with Better Auth (existing)
- ✅ OpenAI API (existing)
- ✅ @convex-dev/rag (existing)
- ✅ Resend for email (existing)
- 🆕 Extended schema for frameworks

**Infrastructure:**
- ✅ Vercel (deployment - existing)
- ✅ Convex Cloud (backend hosting - existing)

---

## 3. Data Architecture

### 3.1 Extended Database Schema

**New Tables:**

```typescript
// convex/schema.ts additions

// Frameworks (Atomic Notes)
frameworks: defineTable({
  // Metadata
  frameworkId: v.string(), // e.g., "AIB-001", "IEH-012"
  title: v.string(),
  module: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
  category: v.string(), // e.g., "teacher-productivity", "louisiana-framework"
  tags: v.array(v.string()),
  
  // Content
  challenge: v.string(), // The problem statement
  solution: v.string(), // Step-by-step solution (markdown)
  samplePrompt: v.string(), // Copy-paste ready prompt
  ethicalGuardrail: v.string(), // Responsible use guidance
  tipsAndVariations: v.optional(v.string()), // Additional guidance
  
  // Metadata
  timeEstimate: v.number(), // Minutes
  difficultyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
  platformCompatibility: v.array(v.string()), // e.g., ["MagicSchool AI", "Gemini", "SchoolAI"]
  
  // Louisiana Standards Alignment
  louisianaStandards: v.optional(v.array(v.string())),
  lerDomains: v.optional(v.array(v.string())), // Louisiana Educator Rubric domains
  
  // Status
  status: v.union(v.literal("draft"), v.literal("beta"), v.literal("published")),
  createdBy: v.id("users"),
  publishedAt: v.optional(v.number()),
  
  // Analytics
  usageCount: v.number(),
  averageRating: v.optional(v.number()),
  averageTimeSaved: v.optional(v.number()), // Minutes
}).index("by_module", ["module"])
  .index("by_category", ["category"])
  .index("by_framework_id", ["frameworkId"])
  .index("by_status", ["status"])
  .searchIndex("search_content", {
    searchField: "title",
    filterFields: ["module", "category", "status"],
  }),

// Framework Usage Tracking
frameworkUsage: defineTable({
  frameworkId: v.id("frameworks"),
  userId: v.id("users"),
  
  // Interaction
  action: v.union(
    v.literal("viewed"),
    v.literal("copied_prompt"),
    v.literal("marked_tried"),
    v.literal("saved")
  ),
  
  // Feedback (when marked as tried)
  rating: v.optional(v.number()), // 1-5 stars
  timeSaved: v.optional(v.number()), // Minutes
  comment: v.optional(v.string()),
  
  // Timestamp
  timestamp: v.number(),
}).index("by_framework", ["frameworkId"])
  .index("by_user", ["userId"])
  .index("by_timestamp", ["timestamp"]),

// Testimonials
testimonials: defineTable({
  userId: v.id("users"),
  frameworkId: v.optional(v.id("frameworks")),
  
  // Content
  quote: v.string(),
  timeSaved: v.optional(v.number()), // Minutes per week
  impact: v.string(), // Brief description of impact
  
  // User Info (denormalized for display)
  userName: v.string(),
  school: v.string(),
  subject: v.string(),
  
  // Status
  status: v.union(v.literal("pending"), v.literal("approved"), v.literal("featured")),
  approvedBy: v.optional(v.id("users")),
  approvedAt: v.optional(v.number()),
  
  // Display
  featured: v.boolean(),
  displayOrder: v.optional(v.number()),
}).index("by_user", ["userId"])
  .index("by_status", ["status"])
  .index("by_featured", ["featured"]),

// Community Innovations
innovations: defineTable({
  userId: v.id("users"),
  
  // Content
  title: v.string(),
  description: v.string(),
  relatedFramework: v.optional(v.id("frameworks")),
  tags: v.array(v.string()),
  timeSaved: v.optional(v.number()),
  
  // User Info (denormalized)
  userName: v.string(),
  school: v.string(),
  subject: v.string(),
  
  // Engagement
  likes: v.number(),
  triesCount: v.number(),
  
  // Timestamp
  createdAt: v.number(),
}).index("by_user", ["userId"])
  .index("by_created_at", ["createdAt"])
  .index("by_likes", ["likes"]),

// Innovation Interactions
innovationInteractions: defineTable({
  innovationId: v.id("innovations"),
  userId: v.id("users"),
  
  // Interaction type
  type: v.union(v.literal("like"), v.literal("tried"), v.literal("comment")),
  
  // Optional comment
  comment: v.optional(v.string()),
  rating: v.optional(v.number()), // If tried
  
  // Timestamp
  timestamp: v.number(),
}).index("by_innovation", ["innovationId"])
  .index("by_user", ["userId"]),

// Beta Program Tracking
betaProgram: defineTable({
  userId: v.id("users"),
  
  // Status
  status: v.union(v.literal("invited"), v.literal("active"), v.literal("completed")),
  invitedAt: v.number(),
  joinedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  
  // Onboarding Progress
  onboardingStep: v.number(), // 0-4
  onboardingCompleted: v.boolean(),
  
  // Engagement Metrics
  frameworksTried: v.number(),
  totalTimeSaved: v.number(), // Minutes
  innovationsShared: v.number(),
  officeHoursAttended: v.number(),
  
  // Weekly Engagement
  lastWeeklyPromptOpened: v.optional(v.number()),
  weeklyEngagementCount: v.number(),
}).index("by_user", ["userId"])
  .index("by_status", ["status"]),
```

**Extended Existing Tables:**

```typescript
// Extend users table via auth system
// Add these fields to user profile:
// - school: string
// - subject: string
// - gradeLevel: optional string
// - aiToolsUsed: array of strings
// - betaTester: boolean
// - role: "educator" | "admin" | "coach"

// Repurpose feedbackSessions for framework feedback
// Already has: userId, spaceId, lessonPlan, feedback, title
// Can be used for framework usage feedback with:
// - lessonPlan → frameworkId
// - feedback → user comments
// - title → framework title
```

### 3.2 Data Relationships

```
users (1) ──── (many) frameworkUsage
users (1) ──── (many) testimonials
users (1) ──── (many) innovations
users (1) ──── (1) betaProgram

frameworks (1) ──── (many) frameworkUsage
frameworks (1) ──── (many) testimonials
frameworks (1) ──── (many) innovations (optional)

innovations (1) ──── (many) innovationInteractions
```

### 3.3 Data Access Patterns

**High-Frequency Queries:**
1. Get frameworks by module (index: by_module)
2. Get user's framework usage history (index: by_user)
3. Search frameworks by title/content (search index)
4. Get featured testimonials (index: by_featured)
5. Get recent innovations (index: by_created_at)

**Medium-Frequency Queries:**
1. Get framework by ID (index: by_framework_id)
2. Get user's saved frameworks
3. Get community innovations by user
4. Get beta program stats

**Low-Frequency Queries:**
1. Admin analytics queries
2. Framework approval workflows
3. Testimonial moderation

---

## 4. API Architecture

### 4.1 New Backend Modules

**convex/frameworks.ts** (New)

```typescript
import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Queries
export const getAllFrameworks = query({
  args: {
    module: v.optional(v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub"))),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("beta"), v.literal("published"))),
  },
  returns: v.array(v.object({
    _id: v.id("frameworks"),
    frameworkId: v.string(),
    title: v.string(),
    module: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
    category: v.string(),
    tags: v.array(v.string()),
    timeEstimate: v.number(),
    difficultyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    usageCount: v.number(),
    averageRating: v.optional(v.number()),
    // ... other fields
  })),
  handler: async (ctx, args) => {
    // Implementation
  },
});

export const getFrameworkById = query({
  args: { frameworkId: v.string() },
  returns: v.union(v.object({
    // Full framework object
  }), v.null()),
  handler: async (ctx, args) => {
    // Implementation
  },
});

export const searchFrameworks = query({
  args: { query: v.string() },
  returns: v.array(v.object({
    // Framework search results
  })),
  handler: async (ctx, args) => {
    // Use search index
  },
});

export const getUserSavedFrameworks = query({
  args: {},
  returns: v.array(v.id("frameworks")),
  handler: async (ctx, args) => {
    // Get user's saved frameworks
  },
});

export const getFrameworkUsageStats = query({
  args: { frameworkId: v.id("frameworks") },
  returns: v.object({
    totalUses: v.number(),
    averageRating: v.optional(v.number()),
    averageTimeSaved: v.optional(v.number()),
    ratingDistribution: v.object({
      1: v.number(),
      2: v.number(),
      3: v.number(),
      4: v.number(),
      5: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    // Calculate stats
  },
});

// Mutations
export const createFramework = mutation({
  args: {
    frameworkId: v.string(),
    title: v.string(),
    module: v.union(v.literal("ai-basics-hub"), v.literal("instructional-expert-hub")),
    category: v.string(),
    tags: v.array(v.string()),
    challenge: v.string(),
    solution: v.string(),
    samplePrompt: v.string(),
    ethicalGuardrail: v.string(),
    // ... other fields
  },
  returns: v.id("frameworks"),
  handler: async (ctx, args) => {
    // Admin only - create framework
  },
});

export const saveFramework = mutation({
  args: { frameworkId: v.id("frameworks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Save framework to user's collection
  },
});

export const unsaveFramework = mutation({
  args: { frameworkId: v.id("frameworks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Remove from saved
  },
});

export const recordFrameworkUsage = mutation({
  args: {
    frameworkId: v.id("frameworks"),
    action: v.union(v.literal("viewed"), v.literal("copied_prompt"), v.literal("marked_tried"), v.literal("saved")),
    rating: v.optional(v.number()),
    timeSaved: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.id("frameworkUsage"),
  handler: async (ctx, args) => {
    // Record usage and update framework stats
  },
});
```

**convex/testimonials.ts** (New)

```typescript
export const submitTestimonial = mutation({
  args: {
    frameworkId: v.optional(v.id("frameworks")),
    quote: v.string(),
    timeSaved: v.optional(v.number()),
    impact: v.string(),
  },
  returns: v.id("testimonials"),
  handler: async (ctx, args) => {
    // Submit testimonial for approval
  },
});

export const getFeaturedTestimonials = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object({
    // Testimonial object
  })),
  handler: async (ctx, args) => {
    // Get featured testimonials
  },
});

export const approveTestimonial = mutation({
  args: {
    testimonialId: v.id("testimonials"),
    featured: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Admin only - approve testimonial
  },
});
```

**convex/innovations.ts** (New)

```typescript
export const shareInnovation = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    relatedFramework: v.optional(v.id("frameworks")),
    tags: v.array(v.string()),
    timeSaved: v.optional(v.number()),
  },
  returns: v.id("innovations"),
  handler: async (ctx, args) => {
    // Share innovation
  },
});

export const getRecentInnovations = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object({
    // Innovation object
  })),
  handler: async (ctx, args) => {
    // Get recent innovations
  },
});

export const likeInnovation = mutation({
  args: { innovationId: v.id("innovations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Like innovation
  },
});

export const markInnovationTried = mutation({
  args: {
    innovationId: v.id("innovations"),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Mark innovation as tried
  },
});
```

**convex/betaProgram.ts** (New)

```typescript
export const getBetaStatus = query({
  args: {},
  returns: v.union(v.object({
    // Beta program status
  }), v.null()),
  handler: async (ctx, args) => {
    // Get user's beta program status
  },
});

export const updateOnboardingProgress = mutation({
  args: { step: v.number() },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Update onboarding step
  },
});

export const recordWeeklyEngagement = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    // Record weekly prompt engagement
  },
});

export const getBetaStats = query({
  args: {},
  returns: v.object({
    frameworksTried: v.number(),
    totalTimeSaved: v.number(),
    innovationsShared: v.number(),
    weeklyEngagementStreak: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get user's beta stats
  },
});
```

### 4.2 Existing Modules (Reused)

**convex/auth.ts** - No changes needed, already handles authentication

**convex/spaces.ts** - Repurpose for framework categories if needed

**convex/documents.ts** - Reuse for framework content storage (future)

**convex/chat.ts** - Reuse for AI assistant (future enhancement)

**convex/rag.ts** - Leverage for framework content search (future)

**convex/email.ts** - Extend for beta program emails

**convex/security.ts** - Reuse for audit logging

---

## 5. Frontend Architecture

### 5.1 Component Hierarchy

```
App.tsx
├── ThemeProvider
├── Authenticated
│   ├── Header
│   │   ├── Logo
│   │   ├── FrameworkSelector (new - replaces SpaceSelector)
│   │   ├── Search
│   │   ├── Notifications
│   │   ├── ModeToggle
│   │   └── UserMenu
│   ├── Main Content
│   │   ├── Dashboard (new)
│   │   │   ├── WelcomeBanner
│   │   │   ├── QuickStatsCards (new)
│   │   │   ├── RecommendedFrameworks (new)
│   │   │   └── RecentActivity (new)
│   │   ├── FrameworkLibrary (new)
│   │   │   ├── FilterBar
│   │   │   └── FrameworkGrid
│   │   │       └── FrameworkCard (new custom component)
│   │   ├── FrameworkDetail (new)
│   │   │   ├── FrameworkHeader
│   │   │   ├── ChallengeSection
│   │   │   ├── SolutionSection
│   │   │   ├── PromptSection (with copy button)
│   │   │   ├── EthicalGuardrailSection
│   │   │   └── FooterActions
│   │   ├── CommunityHub (new)
│   │   │   ├── InnovationFeed
│   │   │   └── ShareInnovationModal
│   │   ├── UserProfile (new)
│   │   │   ├── ProfileHeader
│   │   │   ├── StatsCards
│   │   │   └── ActivityHistory
│   │   └── Settings (new)
│   │       ├── AccountSettings
│   │       ├── NotificationSettings
│   │       └── PreferencesSettings
│   └── Sidebar/BottomNav
│       ├── Home
│       ├── Frameworks
│       ├── Community
│       └── Profile
└── Unauthenticated
    └── LandingPage (update for AI for LA Educators)
        ├── Hero
        ├── Features
        ├── Testimonials (new)
        ├── BetaProgramCTA
        └── Footer
```

### 5.2 New Custom Components

**FrameworkCard.tsx**
```typescript
interface FrameworkCardProps {
  framework: {
    _id: Id<"frameworks">;
    frameworkId: string;
    title: string;
    module: "ai-basics-hub" | "instructional-expert-hub";
    category: string;
    tags: string[];
    challenge: string;
    timeEstimate: number;
    difficultyLevel: "beginner" | "intermediate" | "advanced";
    usageCount: number;
    averageRating?: number;
  };
  variant: "compact" | "expanded";
  onView: () => void;
  onSave: () => void;
  isSaved: boolean;
}
```

**TestimonialCard.tsx**
```typescript
interface TestimonialCardProps {
  testimonial: {
    quote: string;
    userName: string;
    school: string;
    subject: string;
    timeSaved?: number;
  };
  variant: "default" | "featured";
}
```

**TimeSavingsTracker.tsx**
```typescript
interface TimeSavingsTrackerProps {
  weeklyMinutes: number;
  monthlyMinutes: number;
  totalMinutes: number;
  goal?: number;
}
```

**BetaTesterBadge.tsx**
```typescript
interface BetaTesterBadgeProps {
  size: "sm" | "md" | "lg";
  showTooltip: boolean;
}
```

**FeedbackModal.tsx**
```typescript
interface FeedbackModalProps {
  frameworkId: Id<"frameworks">;
  frameworkTitle: string;
  onSubmit: (feedback: {
    rating: number;
    timeSaved?: number;
    comment?: string;
  }) => void;
  onClose: () => void;
}
```

### 5.3 State Management

**Approach:** React Context + Convex Real-time Queries (no additional state management library needed)

**Contexts:**
1. **AuthContext** (existing) - User authentication state
2. **ThemeContext** (existing) - Light/dark mode
3. **FrameworkContext** (new) - Current framework selection, saved frameworks
4. **BetaProgramContext** (new) - Beta program status, onboarding progress

**Real-time Data:**
- All data fetched via Convex `useQuery` hooks
- Automatic real-time updates when data changes
- Optimistic updates for mutations

---

## 6. Design System Integration

### 6.1 Updated Design Tokens

**Update `src/lib/design-tokens.ts`:**

```typescript
// Update color palette to match design docs
export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Primary blue (keep existing)
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  secondary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24', // Louisiana gold (new)
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  accent: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Success green (keep existing)
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  // ... rest of colors
};

// Update typography
export const typography = {
  fontFamily: {
    primary: ['Lexend', 'system-ui', 'sans-serif'], // New primary font
    heading: ['Poppins', 'system-ui', 'sans-serif'], // New heading font
    mono: ['JetBrains Mono', 'monospace'], // New monospace font
  },
  // ... rest of typography
};
```

**Update `tailwind.config.js`:**

```javascript
// Update font families
fontFamily: {
  sans: ['Lexend', 'system-ui', 'sans-serif'],
  heading: ['Poppins', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},

// Update color palette to match design docs
colors: {
  // ... existing shadcn/ui theme colors ...
  
  // AI for LA Educators brand colors
  'educator-primary': {
    // Blue shades
  },
  'educator-secondary': {
    // Gold shades
  },
  'educator-accent': {
    // Green shades
  },
},
```

### 6.2 Component Styling Approach

**Strategy:** Tailwind CSS utility classes + CSS custom properties for design tokens

**Example:**
```tsx
<Card className="p-6 border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow">
  <CardHeader>
    <Badge className="bg-secondary-400 text-neutral-900">AIB-001</Badge>
    <CardTitle className="font-heading text-2xl text-neutral-900">
      Email Drafting for Parent Communication
    </CardTitle>
  </CardHeader>
  <CardContent className="font-primary text-base text-neutral-700">
    {/* Content */}
  </CardContent>
</Card>
```

---

## 7. Authentication & Authorization

### 7.1 Authentication Flow (Existing - No Changes)

- Convex Auth with Password provider
- Email/password authentication
- Session management via Convex
- Protected routes via `<Authenticated>` component

### 7.2 Authorization Levels

**Roles:**
1. **Beta Tester** (default) - Access to all frameworks, can submit testimonials/innovations
2. **Admin** - Can create/edit frameworks, approve testimonials, view analytics
3. **Coach** (future) - Can view beta tester progress, provide support

**Implementation:**
```typescript
// Add role field to user profile
// Check role in backend functions
const user = await ctx.db.get(userId);
if (user.role !== "admin") {
  throw new Error("Unauthorized");
}
```

---

## 8. Performance Optimization

### 8.1 Frontend Optimizations

**Code Splitting:**
```typescript
// Lazy load routes
const FrameworkLibrary = lazy(() => import('./components/FrameworkLibrary'));
const FrameworkDetail = lazy(() => import('./components/FrameworkDetail'));
const CommunityHub = lazy(() => import('./components/CommunityHub'));
```

**Image Optimization:**
- Use WebP format for images
- Lazy load images below the fold
- Responsive images with `srcset`

**Bundle Size:**
- Tree-shake unused Lucide icons
- Minimize shadcn/ui component imports
- Use dynamic imports for heavy components

### 8.2 Backend Optimizations

**Database Indexes:**
- All high-frequency queries have indexes
- Search index for framework content
- Compound indexes for filtered queries

**Caching Strategy:**
- Convex automatic query caching
- Stale-while-revalidate for framework list
- Cache framework content in browser localStorage

**Query Optimization:**
- Limit results with `.take(n)`
- Use pagination for long lists
- Denormalize frequently accessed data (user info in testimonials)

---

## 9. Security & Privacy

### 9.1 Data Protection (FERPA Compliance)

**No Student PII:**
- Framework examples use generic placeholders
- Testimonials reviewed before approval
- Audit logs track all sensitive actions

**Access Control:**
- Row-level security via Convex queries
- Users can only access their own data
- Admin actions logged in auditLogs table

### 9.2 Content Security

**Framework Content:**
- Admin-only creation/editing
- Version control for framework updates
- Approval workflow for user-generated content

**User-Generated Content:**
- Testimonials require approval
- Innovations moderated for inappropriate content
- Report mechanism for violations

---

## 10. Scalability Considerations

### 10.1 Current Scale (Beta Phase)

**Expected Load:**
- 30-50 beta testers
- ~30 frameworks
- ~100 framework uses per week
- ~10 innovations per week

**Infrastructure:**
- Convex free tier sufficient
- No additional scaling needed

### 10.2 Future Scale (District-Wide)

**Expected Load:**
- 500-1000 educators
- ~50 frameworks
- ~5000 framework uses per week
- ~50 innovations per week

**Scaling Strategy:**
- Convex scales automatically
- Add read replicas if needed
- Implement CDN for static assets
- Consider framework content caching

### 10.3 Statewide Scale (12-24 months)

**Expected Load:**
- 10,000+ educators
- ~100 frameworks
- ~50,000 framework uses per week
- ~500 innovations per week

**Scaling Strategy:**
- Upgrade Convex plan
- Implement full CDN strategy
- Add analytics database (separate from operational DB)
- Consider microservices for specific features

---

## 11. Monitoring & Analytics

### 11.1 Application Monitoring

**Tools:**
- Convex Dashboard (existing)
- Vercel Analytics (existing)
- Error tracking via Sentry (add if needed)

**Metrics:**
- Page load times
- API response times
- Error rates
- User engagement

### 11.2 Product Analytics

**Key Metrics:**
1. **Framework Usage:**
   - Views per framework
   - Copy prompt rate
   - Mark as tried rate
   - Average rating

2. **User Engagement:**
   - Daily/weekly active users
   - Frameworks tried per user
   - Time saved per user
   - Community participation rate

3. **Beta Program:**
   - Onboarding completion rate
   - Weekly engagement rate
   - Testimonial submission rate
   - Innovation sharing rate

**Implementation:**
- Custom analytics via Convex queries
- Dashboard for admins
- Weekly email reports

---

## 12. Deployment Strategy

### 12.1 Environments

**Development:**
- Local Convex dev instance
- Local Vite dev server
- Hot module replacement

**Staging:**
- Convex staging deployment
- Vercel preview deployments
- Beta tester access for testing

**Production:**
- Convex production deployment
- Vercel production deployment
- Custom domain: `aiforeducators.la` (example)

### 12.2 Deployment Process

**CI/CD Pipeline:**
1. Push to `main` branch
2. Convex deployment triggered
3. Vercel build triggered
4. Automated tests run
5. Deploy to production if tests pass

**Rollback Strategy:**
- Convex supports instant rollback
- Vercel supports instant rollback
- Database migrations use Convex schema versioning

---

## 13. Migration Plan

### 13.1 Phase 1: Schema Extension (Week 1)

**Tasks:**
1. Add new tables to `convex/schema.ts`
2. Run Convex schema migration
3. Seed initial framework data (30 atomic notes)
4. Test data access patterns

**Validation:**
- All new tables created
- Indexes working correctly
- Sample data queryable

### 13.2 Phase 2: Backend API Development (Week 2-3)

**Tasks:**
1. Implement `convex/frameworks.ts`
2. Implement `convex/testimonials.ts`
3. Implement `convex/innovations.ts`
4. Implement `convex/betaProgram.ts`
5. Write unit tests for all functions

**Validation:**
- All CRUD operations working
- Authorization checks in place
- Error handling robust

### 13.3 Phase 3: Frontend Components (Week 4-5)

**Tasks:**
1. Update design tokens
2. Create custom components (FrameworkCard, etc.)
3. Build Dashboard page
4. Build FrameworkLibrary page
5. Build FrameworkDetail page
6. Build CommunityHub page
7. Update LandingPage

**Validation:**
- All pages render correctly
- Components match design specs
- Responsive design working

### 13.4 Phase 4: Integration & Testing (Week 6)

**Tasks:**
1. Connect frontend to backend APIs
2. Implement user flows
3. Add loading states
4. Add error handling
5. Accessibility audit
6. Performance testing

**Validation:**
- All user flows working end-to-end
- WCAG 2.1 AA compliance
- Page load times < 2 seconds

### 13.5 Phase 5: Beta Launch (Week 7)

**Tasks:**
1. Deploy to production
2. Onboard beta testers
3. Monitor for issues
4. Collect feedback

**Validation:**
- 30-50 beta testers onboarded
- No critical bugs
- Positive initial feedback

---

## 14. Technical Debt & Future Enhancements

### 14.1 Known Technical Debt

**From Existing Codebase:**
1. `feedbackSessions` table marked as legacy - repurpose or remove
2. Voice interface (Vapi) integration incomplete
3. Email templates need updating for new brand
4. Some components use inline styles instead of Tailwind

**New Technical Debt:**
1. Framework content stored in database - consider file-based approach
2. No automated testing yet
3. Analytics dashboard not built
4. Admin panel not built

### 14.2 Future Enhancements (Post-Beta)

**Phase 2 (6-12 months):**
1. Full RAG system for framework content
2. AI-powered framework recommendations
3. Advanced analytics dashboard
4. Mobile app (React Native)
5. Offline mode

**Phase 3 (12-24 months):**
1. Voice interface for hands-free framework access
2. Integration with district LMS
3. API for third-party integrations
4. Multi-language support (Spanish)
5. Advanced collaboration features

---

## 15. Success Criteria

### 15.1 Technical Success Criteria

**Performance:**
- ✅ Page load time < 2 seconds on 3G
- ✅ API response time < 500ms
- ✅ 99.5%+ uptime during beta

**Quality:**
- ✅ Zero critical bugs in production
- ✅ WCAG 2.1 AA compliance
- ✅ All user flows working end-to-end

**Scalability:**
- ✅ Support 50 concurrent users
- ✅ Handle 1000 framework uses per week
- ✅ Database queries optimized with indexes

### 15.2 Product Success Criteria (from PRD)

**Beta Phase:**
- ✅ 30-50 beta testers recruited
- ✅ 85%+ save 3+ hours per week
- ✅ 15+ documented testimonials
- ✅ 90%+ satisfaction rating
- ✅ 75%+ weekly engagement

---

## 16. Appendices

### 16.1 API Reference Summary

**Frameworks:**
- `getAllFrameworks` - Get all frameworks with filters
- `getFrameworkById` - Get single framework
- `searchFrameworks` - Search frameworks
- `createFramework` - Create new framework (admin)
- `saveFramework` - Save to user collection
- `recordFrameworkUsage` - Track usage and feedback

**Testimonials:**
- `submitTestimonial` - Submit testimonial
- `getFeaturedTestimonials` - Get featured testimonials
- `approveTestimonial` - Approve testimonial (admin)

**Innovations:**
- `shareInnovation` - Share innovation
- `getRecentInnovations` - Get recent innovations
- `likeInnovation` - Like innovation
- `markInnovationTried` - Mark as tried

**Beta Program:**
- `getBetaStatus` - Get user's beta status
- `updateOnboardingProgress` - Update onboarding
- `recordWeeklyEngagement` - Track engagement
- `getBetaStats` - Get user stats

### 16.2 Component Reference Summary

**New Custom Components:**
- `FrameworkCard` - Display framework in grid/list
- `TestimonialCard` - Display testimonial
- `TimeSavingsTracker` - Show time saved
- `BetaTesterBadge` - Beta tester indicator
- `FeedbackModal` - Collect framework feedback
- `InnovationCard` - Display innovation
- `QuickStatsCard` - Dashboard stat display

**Existing Components (Reused):**
- All shadcn/ui components
- `AuthModal`, `LandingPage`, `ModeToggle`
- `ThemeProvider`, `Toaster`

### 16.3 Database Schema Reference

**New Tables:**
- `frameworks` - Framework content
- `frameworkUsage` - Usage tracking
- `testimonials` - User testimonials
- `innovations` - Community innovations
- `innovationInteractions` - Innovation engagement
- `betaProgram` - Beta program tracking

**Existing Tables (Reused):**
- `users` - User accounts
- `spaces` - Spaces (repurposed)
- `documents` - Document storage
- `chatMessages` - Chat history
- `auditLogs` - Security audit logs

---

## 17. Conclusion

This architecture document provides a comprehensive technical blueprint for the AI for LA Educators platform, building strategically upon the existing A.I.D.A. codebase. The architecture is designed to:

1. **Leverage existing infrastructure** - Reuse proven Convex backend, React frontend, and authentication
2. **Add educator-specific features** - Frameworks, testimonials, beta program tracking
3. **Maintain scalability** - Support growth from beta (50 users) to statewide (10,000+ users)
4. **Ensure quality** - WCAG 2.1 AA compliance, performance optimization, security
5. **Enable future enhancements** - RAG system, voice interface, mobile app

**Next Phase:** Implementation Planning (Phase 4) - Create detailed implementation plan with step-by-step instructions for development team.

---

**End of System Architecture Document**
