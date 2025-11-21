# CLAUDE.md - AI Assistant Guide for Pelican AI

**Last Updated:** November 18, 2025
**Version:** 2.0.0
**Status:** Beta Launch Ready - Grassroots Launch with 5 Louisiana Educators

---

## Purpose of This Document

This document provides AI assistants with essential context about the Pelican AI codebase, including architecture, conventions, development workflows, and critical constraints. Read this file first before making any code changes.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Key Architecture Concepts](#key-architecture-concepts)
5. [Development Workflows](#development-workflows)
6. [Code Conventions](#code-conventions)
7. [Testing Strategy](#testing-strategy)
8. [Database Schema](#database-schema)
9. [Authentication & Authorization](#authentication--authorization)
10. [Critical Constraints](#critical-constraints)
11. [Common Tasks](#common-tasks)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is Pelican AI?

Pelican AI is an **educational SaaS platform** that provides Louisiana educators with platform-agnostic AI guidance. It's NOT another AI tool—it's an "intelligent coaching layer" that sits on top of all AI tools (ChatGPT, Gemini, MagicSchool AI, etc.) to provide Louisiana standards-aligned guidance.

**Mission:** "We're Not Waiting for LDOE" - Louisiana educators building practical, ethical, and platform-agnostic AI guidance together.

### Key Features (User-Accessible)

1. **Framework Library** - 10 platform-agnostic AI guidance frameworks (exact count, honest numbers)
2. **Dashboard** - Personalized educator dashboard with time tracking and analytics
3. **Beta Program Management** - Grassroots launch with 5 committed educators
4. **Community Features** - Innovation sharing and testimonials (backend implemented, UI intentionally hidden for MVP launch)

### Features in Development

**Alignment Scorecard (Core Flare #1)** - Multi-step workflow analyzing AI-generated content against Louisiana Standards
- ✅ **Backend:** Complete (workflow, RAG, database, API endpoints)
- ❌ **Frontend:** UI components not yet built
- **Status:** Backend solid, ready for UI implementation
- **Files:** `convex/alignmentScorecard.ts`, `convex/alignmentSteps.ts`, `convex/ragService.ts`

### Future Features (Planned, Not Yet Implemented)

**Weekly Spark** - Proactive weekly prompts based on Louisiana pacing guide (see PROJECT.md lines 170-176)
- Status: Vision documented, implementation pending post-launch

**Delta Generator** - Instant differentiation based on Louisiana accommodation guidelines (see PROJECT.md lines 178-185)
- Status: Vision documented, implementation pending post-launch

> **Note for AI Assistants:**
> - Alignment Scorecard backend is COMPLETE - do not rebuild workflow/database logic
> - UI components need to be built - this is the current gap
> - Do NOT implement Weekly Spark or Delta Generator unless explicitly requested

### Current Launch Status

- **Stage:** Grassroots launch with 5 educators (active)
- **Positioning:** "We're Not Waiting for LDOE"
- **Philosophy:** Authentic, teacher-to-teacher communication (not corporate speak)
- **Community Features:** Backend implemented, UI intentionally hidden for MVP launch
- **Weekly Emails:** Feature-flagged (WEEKLY_EMAILS_ENABLED=false by default)
  - **Why disabled:** Grassroots launch prioritizes personal check-ins over automation
  - Real conversations (text/email replies) > automated email sequences
  - Will enable when scaling to 30-100 users (see PROJECT.md lines 224-231)

### Launch Timeline (From PROJECT.md)

- **Week 1:** Launch to 5 educators, daily personal check-ins
- **Week 2:** Gather authentic testimonials, update landing page
- **Week 3:** Organic referrals ("Who else needs this?" conversations)
- **Week 4:** Tech facilitator meeting prep
- **Dec 16-31:** Scale to 30-50 users through word-of-mouth

> **Note for AI Assistants:** Do NOT build automated email workflows or marketing features. The grassroots approach prioritizes 1-on-1 relationships over automation during initial launch phase.

---

## Tech Stack

### Frontend
- **React 19.2.0** - Latest stable with concurrent features
- **TypeScript 5.7.3** - Strict mode enabled
- **Vite 6.3.6** - Build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing
- **Tailwind CSS 4.1.14** - Utility-first styling
- **shadcn/ui** - Component library (New York style)
- **Framer Motion 12.23.22** - Animations
- **Lucide React** - Icon library

### Backend
- **Convex 1.27.5** - Serverless backend + real-time database
- **Better Auth 1.3.27** - Authentication (@convex-dev/better-auth)
- **OpenAI GPT-4o** - AI agent for content analysis
- **Resend API** - Email delivery

### Convex Component Stack (7 Production-Ready Components)

These are official Convex packages that handle complex functionality:

1. `@convex-dev/better-auth` - Authentication with Better Auth integration
2. `@convex-dev/resend` - Email delivery with Resend
3. `@convex-dev/rag` - Vector search for Louisiana Standards
4. `@convex-dev/agent` - LLM integration with retry logic
5. `@convex-dev/workflow` - Multi-step processes with fault tolerance
6. `@convex-dev/rate-limiter` - Distributed rate limiting
7. `@convex-dev/action-cache` - Action result caching

### Testing
- **Vitest 4.0.6** - Unit tests
- **@vitest/browser + Playwright** - E2E tests
- **convex-test 0.0.38** - Convex backend testing
- **Coverage:** ~88% statements/lines

### Development Tools
- **ESLint 9.37.0** - TypeScript-aware linting
- **Prettier 3.6.2** - Code formatting
- **pnpm** - Package manager (fast, disk-efficient)

---

## Project Structure

```
/home/user/aida/
├── convex/                      # Backend (Convex serverless functions)
│   ├── _generated/             # Auto-generated API types (DO NOT EDIT)
│   ├── schema.ts               # Database schema (SOURCE OF TRUTH)
│   ├── auth.ts                 # Better Auth integration
│   ├── authorization.ts        # Role-based access control
│   ├── alignmentScorecard.ts   # Core Flare #1 workflow
│   ├── alignmentSteps.ts       # Workflow step implementations
│   ├── frameworks.ts           # Framework library (80+ functions)
│   ├── betaProgram.ts          # Beta program management
│   ├── ragService.ts           # RAG service layer (centralized)
│   ├── rateLimiting.ts         # Rate limiting by role
│   ├── email.ts                # Email workflows
│   ├── workflows.ts            # Workflow manager config
│   └── *.test.ts               # 13 test files
│
├── src/                         # Frontend source
│   ├── components/             # React components (~90 .tsx files; 23 identified for cleanup)
│   │   ├── admin/              # Admin dashboard
│   │   ├── auth/               # Authentication modal
│   │   ├── community/          # Innovations & testimonials (UI HIDDEN)
│   │   ├── dashboard/          # Dashboard, onboarding, stats
│   │   ├── framework/          # Framework library UI
│   │   ├── landing/            # Landing page sections
│   │   ├── routes/             # Route protection & redirects
│   │   ├── shared/             # Shared components
│   │   └── ui/                 # shadcn/ui components (85+)
│   ├── data/                   # Static data
│   ├── emails/                 # React Email templates
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   │   ├── auth-client.ts      # Better Auth client
│   │   ├── accessibility.ts    # WCAG 2.1 AA helpers
│   │   ├── error-handling.ts   # Error boundary & logging
│   │   ├── secure-logging.ts   # FERPA-compliant logging
│   │   └── utils.ts            # cn() utility
│   ├── App.tsx                 # Main app component & routing
│   └── main.tsx                # React entry point
│
├── docs/                        # Documentation
│   ├── README.md               # Documentation index
│   ├── CONTRIBUTING.md         # Development guidelines
│   ├── TESTING.md              # Testing guide
│   ├── archived/               # Historical documentation
│   └── launch/                 # Temporary launch docs
│
├── PROJECT.md                  # Main project context (READ FIRST)
├── ARCHITECTURE_VALIDATION.md  # Scaling validation
├── CHANGELOG.md                # Version history
├── README.md                   # Quick start guide
└── package.json                # Dependencies & scripts
```

### Important File Locations

- **Database Schema:** `convex/schema.ts` (source of truth for API contracts)
- **Auth Configuration:** `convex/auth.config.ts` and `src/lib/auth-client.ts`
- **Routing:** `src/App.tsx` (React Router setup)
- **Environment Config:** `.env.local` (not in git) and Convex env vars
- **API Types:** `convex/_generated/api.d.ts` (auto-generated, do not edit)

---

## Key Architecture Concepts

### 1. Convex Backend

Convex is a serverless backend that combines a real-time database with serverless functions. Key concepts:

**Function Types:**
- **Query** - Read-only, reactive (re-runs when data changes), can be called from frontend
- **Mutation** - Write operations, can be called from frontend
- **Action** - External API calls (OpenAI, Resend), NOT reactive, can't read DB directly
- **Workflow** - Multi-step orchestrated processes with retry logic

**Important Patterns:**
```typescript
// Query (reactive, read-only)
export const getFrameworks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("frameworks").collect();
  },
});

// Mutation (write operations)
export const createFramework = mutation({
  args: { title: v.string(), ... },
  handler: async (ctx, args) => {
    return await ctx.db.insert("frameworks", args);
  },
});

// Action (external API calls)
export const analyzeContent = action({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const result = await openai.chat.completions.create(...);
    await ctx.runMutation(api.frameworks.saveAnalysis, result);
  },
});
```

### 2. Real-Time Reactivity

**CRITICAL:** Convex provides automatic real-time updates. When you use `useQuery()` in React:
- The query automatically re-runs when underlying data changes
- No manual polling or WebSocket management needed
- Component re-renders with fresh data

**Example:**
```typescript
// This automatically updates when frameworks change
const frameworks = useQuery(api.frameworks.getAllFrameworks);
```

### 3. Better Auth Integration

Authentication is handled by Better Auth with Convex integration:
- Session-based authentication
- Email/password + magic link support
- User data stored in auto-managed tables (`user`, `session`, `account`)
- Extended educator data in `userProfiles` table

**Getting Current User:**
```typescript
// In Convex functions
const identity = await requireAuth(ctx);
const userId = identity.subject;

// In React components
const { data: session } = useSession();
const userId = session?.user?.id;
```

### 4. Role-Based Access Control

Three roles with different permissions:
- **teacher** - Standard access, basic rate limits
- **coach** - Elevated rate limits
- **admin** - Full access, content moderation, highest rate limits

**Authorization Helpers (convex/authorization.ts):**
```typescript
// Require authentication
await requireAuth(ctx);

// Require specific role
await requireRole(ctx, "admin");

// Require admin
await requireAdmin(ctx);
```

### 5. Rate Limiting

Rate limiting is role-based (convex/rateLimiting.ts):
- **Teachers:** 10 AI generations/min, 20 RAG queries/min
- **Coaches:** 20 AI generations/min, 40 RAG queries/min
- **Admins:** 100 AI generations/min, 200 RAG queries/min

**Usage:**
```typescript
await checkRateLimit(ctx, userId, "aiGeneration");
```

### 6. RAG (Retrieval-Augmented Generation)

The RAG system provides vector search for Louisiana Standards:
- Embeddings stored in `documents` table (auto-managed)
- Semantic search with metadata filtering
- Centralized service layer in `convex/ragService.ts`

**Usage:**
```typescript
const results = await searchLouisianaStandards(ctx, {
  subject: "ela",
  gradeLevel: "9-12",
  query: "rhetorical analysis"
});
```

### 7. Workflow System (Alignment Scorecard)

The Alignment Scorecard uses multi-step workflows:

**Workflow Definition (convex/alignmentScorecard.ts):**
```typescript
const alignmentWorkflow = workflowManager.define({
  steps: {
    retrieve: retrieveStandards,
    analyze: analyzeContent,
    scorecard: generateScorecard,
    save: saveAnalysis,
  }
});
```

**Each step:**
- Has retry logic (3 attempts)
- Can be monitored for status
- Survives Convex restarts
- Runs asynchronously

---

## Development Workflows

### Starting Development

```bash
# Install dependencies
pnpm install

# Start both frontend and backend
pnpm dev

# Or start separately
pnpm dev:frontend  # Vite dev server (port 5173)
pnpm dev:backend   # Convex dev server
```

### Running Tests

```bash
# Watch mode (recommended during development)
pnpm test

# Run all tests once
pnpm test:once

# Run specific test file
pnpm test:once frameworks

# Generate coverage report
pnpm test:coverage
# Open coverage/index.html in browser

# E2E tests (Playwright)
pnpm test:e2e
pnpm test:e2e:watch
pnpm test:e2e:ui
```

### Database Operations

```bash
# Open Convex dashboard (view data, logs, functions)
npx convex dashboard

# Deploy to production
npx convex deploy

# Seed initial data
npx convex run seedFrameworks:seedInitialFrameworks

# Populate Louisiana Standards
npx convex run populateStandards:populate

# Set environment variables
npx convex env set WEEKLY_EMAILS_ENABLED true
npx convex env set RESEND_TEST_MODE false
```

### Linting and Type Checking

```bash
# Run full lint (TypeScript + Convex types + build)
pnpm lint

# This runs:
# 1. TypeScript check on convex/
# 2. TypeScript check on src/
# 3. Convex dev --once (validates schema & functions)
# 4. Vite build (validates frontend)
```

### Making Changes

**ALWAYS:**
1. Read `PROJECT.md` for project context
2. Check if tests exist for the code you're changing
3. Run tests before committing: `pnpm test:once`
4. Follow TypeScript strict mode (no `any` types)
5. Respect FERPA compliance (no PII in logs)

**NEVER:**
1. Push directly to `main` branch
2. Edit `convex/_generated/` files (auto-generated)
3. Use `any` types without explicit justification
4. Log PII (student names, emails, etc.)
5. Skip tests before committing

---

## Code Conventions

### TypeScript Guidelines

**Strict Type Safety:**
```typescript
// ✅ GOOD - Explicit types
const frameworks: Framework[] = await ctx.db
  .query("frameworks")
  .filter(q => q.eq(q.field("status"), "published"))
  .collect();

// ❌ BAD - Using 'any'
const frameworks: any = await ctx.db.query("frameworks").collect();
```

**Convex Validators:**
```typescript
// ALWAYS use validators for args and returns
export const createFramework = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

### Component Patterns

**Naming:**
- PascalCase for components: `BetaOnboarding.tsx`
- Descriptive names: `FrameworkUsageChart.tsx` (not `Chart.tsx`)

**Structure:**
```typescript
// ✅ GOOD - Functional component with hooks
export function FrameworkCard({ framework }: FrameworkCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      {/* Component content */}
    </Card>
  );
}
```

**Error Boundaries:**
```typescript
// Wrap route components in ErrorBoundary
<ErrorBoundary>
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
</ErrorBoundary>
```

### Styling Patterns

**Tailwind + cn() helper:**
```typescript
import { cn } from "@/lib/utils";

// ✅ GOOD - Conditional classes with cn()
<div className={cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-pelican-blue text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
```

**CSS Variables for theming:**
```css
/* Defined in index.css */
--pelican-blue: #0ea5e9;
--louisiana-gold: #f59e0b;
--deep-blue: #1e40af;
```

### Database Query Patterns

**Always use indexes:**
```typescript
// ✅ GOOD - Uses index
const frameworks = await ctx.db
  .query("frameworks")
  .withIndex("by_status", q => q.eq("status", "published"))
  .collect();

// ❌ BAD - Table scan (slow for large datasets)
const frameworks = await ctx.db
  .query("frameworks")
  .filter(q => q.eq(q.field("status"), "published"))
  .collect();
```

**Query optimization order:**
```typescript
// Use most selective index first
// Order: module > category > status
const frameworks = await ctx.db
  .query("frameworks")
  .withIndex("by_module", q => q.eq("module", "ai-basics-hub"))
  .filter(q => q.eq(q.field("category"), "Lesson Planning"))
  .filter(q => q.eq(q.field("status"), "published"))
  .collect();
```

### FERPA Compliance

**NEVER log PII:**
```typescript
// ❌ BAD - Logs student email
console.log("User email:", user.email);

// ✅ GOOD - Logs non-PII identifier
console.log("User action:", { userId: user.id, action: "framework_viewed" });
```

**Use secure logging:**
```typescript
import { logSecure } from "@/lib/secure-logging";

// Automatically strips PII
logSecure("info", "User action", {
  userId: user.id,
  action: "framework_viewed"
});
```

---

## Testing Strategy

### Testing Philosophy

- **Coverage Target:** ~88% statements/lines
- **Test Files:** Co-located with source (`.test.ts` next to `.ts`)
- **Test Environment:** edge-runtime (simulates Convex environment)
- **Mock Strategy:** Minimal mocking, use `convex-test` for real database operations

### Unit Tests (Convex Backend)

**Test Structure:**
```typescript
import { convexTest } from "convex-test";
import { describe, it, expect, vi } from "vitest";
import schema from "./schema";
import { createFramework, getAllFrameworks } from "./frameworks";

describe("frameworks", () => {
  it("should create and retrieve frameworks", async () => {
    const t = convexTest(schema);

    // Create framework
    const frameworkId = await t.mutation(createFramework, {
      title: "Test Framework",
      module: "ai-basics-hub",
      category: "Testing",
      // ... other required fields
    });

    // Retrieve and verify
    const frameworks = await t.query(getAllFrameworks, {});
    expect(frameworks).toHaveLength(1);
    expect(frameworks[0].title).toBe("Test Framework");
  });
});
```

**Testing with Authentication:**
```typescript
// Mock authenticated user
const userId = "user123";
await t.mutation(createFramework, args, {
  identity: { subject: userId }
});
```

**Testing Scheduled Functions:**
```typescript
import { vi } from "vitest";

it("should send weekly emails", async () => {
  vi.useFakeTimers();
  const t = convexTest(schema);

  // Trigger scheduled function
  await t.finishAllScheduledFunctions(new Date("2025-01-01"));

  // Verify side effects
  const emailsSent = await t.query(getEmailsSent, {});
  expect(emailsSent).toHaveLength(5);
});
```

### E2E Tests (Frontend)

**Test with @vitest/browser:**
```typescript
import { test, expect } from "@vitest/browser";

test("user can view frameworks", async () => {
  await page.goto("/frameworks");

  await page.waitForSelector('[data-testid="framework-card"]');

  const frameworks = await page.$$('[data-testid="framework-card"]');
  expect(frameworks.length).toBeGreaterThan(0);
});
```

**Use data-testid attributes:**
```typescript
// In component
<Button data-testid="copy-prompt-btn">Copy Prompt</Button>

// In test
await page.click('[data-testid="copy-prompt-btn"]');
```

### Coverage Reports

```bash
# Generate coverage
pnpm test:coverage

# Open coverage/index.html in browser
# Look for uncovered lines in red
```

---

## Database Schema

**Source of Truth:** `convex/schema.ts`

### Core Tables

#### betaSignups
Landing page signups for beta program.
```typescript
{
  email: string,              // Primary identifier
  name?: string,
  school?: string,
  subject?: string,
  status: "pending" | "approved" | "rejected",
  signupDate: number,         // Unix timestamp
  betaProgramId: string,
  notes?: string,             // Admin notes
}
```
**Indexes:** by_email, by_status, by_signup_date

#### userProfiles
Extended educator data (Better Auth manages core user data).
```typescript
{
  userId: string,             // Better Auth user ID (legacy)
  authId?: string,            // Better Auth user ID (new pattern)
  school?: string,
  subject?: string,
  gradeLevel?: string,
  district?: string,
  role?: "teacher" | "admin" | "coach",
}
```
**Indexes:** by_user, authId, by_role

#### frameworks
AI guidance frameworks (Atomic Notes).
```typescript
{
  frameworkId: string,
  title: string,
  module: "ai-basics-hub" | "instructional-expert-hub",
  category: string,
  tags: string[],
  challenge: string,
  solution: string,
  samplePrompt: string,
  ethicalGuardrail: string,
  tipsAndVariations?: string,
  timeEstimate: number,
  difficultyLevel: "beginner" | "intermediate" | "advanced",
  platformCompatibility: string[],
  louisianaStandards?: string[],
  lerDomains?: string[],
  status: "draft" | "beta" | "published",
  createdBy: string,
  publishedAt?: number,
  usageCount: number,
  averageRating?: number,
  averageTimeSaved?: number,
}
```
**Indexes:** by_module, by_category, by_framework_id, by_status, search_content

#### frameworkUsage
Framework usage tracking.
```typescript
{
  frameworkId: Id<"frameworks">,
  userId: string,
  action: "viewed" | "copied_prompt" | "marked_tried" | "saved",
  rating?: number,
  timeSaved?: number,
  comment?: string,
  timestamp: number,
}
```
**Indexes:** by_framework, by_user, by_timestamp

#### betaProgram
Beta program participation tracking.
```typescript
{
  userId: string,
  status: "invited" | "active" | "completed",
  invitedAt: number,
  joinedAt?: number,
  completedAt?: number,
  onboardingStep: number,
  onboardingCompleted: boolean,
  frameworksTried: number,
  totalTimeSaved: number,
  innovationsShared: number,
  officeHoursAttended: number,
  lastWeeklyPromptOpened?: number,
  weeklyEngagementCount: number,
}
```
**Indexes:** by_user, by_status

#### alignmentAnalyses
Alignment Scorecard analysis results.
```typescript
{
  userId: string,
  content: string,            // AI-generated content analyzed
  gradeLevel: string,
  subject: "ela" | "math" | "science" | "social_studies",
  alignmentScore: number,     // 0-100
  scorecard: {
    overallScore: number,
    breakdown: any[],
    gaps: string[],
    recommendations: string[],
  },
  analyzedAt: number,
}
```
**Indexes:** by_user, by_score

### Auto-Managed Tables (via Convex Components)

**Better Auth:**
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts
- `verification` - Email verification tokens

**RAG:**
- `documents` - Vector embeddings for Louisiana Standards
- `chatMessages` - Chat history (if used)
- `feedbackSessions` - User feedback
- `auditLogs` - Audit trail

**DO NOT define these tables in schema.ts** - they are managed by Convex components.

---

## Authentication & Authorization

### Authentication Flow

1. **User signs up** → Beta signup form → `betaSignups` table (status: "pending")
2. **Admin approves** → Account created via Better Auth → `user` table
3. **User logs in** → Better Auth session → `session` table
4. **Profile created** → Extended data → `userProfiles` table

### Getting Current User

**In Convex Functions:**
```typescript
import { requireAuth } from "./authorization";

export const myMutation = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);
    const userId = identity.subject;

    // Get user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    return profile;
  },
});
```

**In React Components:**
```typescript
import { useSession } from "@/lib/auth-client";

export function MyComponent() {
  const { data: session, isLoading } = useSession();

  if (isLoading) return <Spinner />;
  if (!session) return <SignInPrompt />;

  const userId = session.user.id;
  // Use userId...
}
```

### Authorization Helpers

**Require Authentication:**
```typescript
import { requireAuth } from "./authorization";

const identity = await requireAuth(ctx);
// Throws ConvexError if not authenticated
```

**Require Specific Role:**
```typescript
import { requireRole } from "./authorization";

await requireRole(ctx, "admin");
// Throws ConvexError if not admin
```

**Require Admin:**
```typescript
import { requireAdmin } from "./authorization";

await requireAdmin(ctx);
// Convenience wrapper for requireRole(ctx, "admin")
```

### Rate Limiting

**Check Rate Limit:**
```typescript
import { checkRateLimit } from "./rateLimiting";

await checkRateLimit(ctx, userId, "aiGeneration");
// Throws error if rate limit exceeded
```

**Rate Limit Types:**
- `aiGeneration` - AI content generation (10-100/min based on role)
- `ragQuery` - RAG vector search (20-200/min based on role)
- `emailSend` - Email sending (5-20/hour based on role)

---

## Critical Constraints

### 1. FERPA Compliance

**NEVER log Personally Identifiable Information (PII):**
- Student names, emails, addresses
- Teacher emails (use user IDs instead)
- School district identifiable data

**Use secure logging:**
```typescript
import { logSecure } from "@/lib/secure-logging";

// This automatically strips PII
logSecure("info", "User action", { userId, action: "framework_viewed" });
```

### 2. Grassroots Launch Positioning

**Brand Voice:**
- Teacher-to-teacher communication (NOT corporate speak)
- "We're Not Waiting for LDOE"
- **Honest numbers ALWAYS** (5 educators, 10 frameworks - NEVER use "10+" or inflated claims)
- Personal tone, not marketing jargon
- Personal check-ins over automation

**Examples:**
- ✅ "Tell me honestly—did it save you time?"
- ✅ "You're one of 5 educators I'm starting with"
- ✅ "10 frameworks" (exact count)
- ❌ "Leverage AI synergies for paradigm-shifting results"
- ❌ "Join 10,000+ educators transforming education"
- ❌ "10+ frameworks" (implies we don't know the exact number)

**Public vs. Private Messaging:**
- **Public-facing (Landing Page):** Scalable grassroots messaging, no "5 educators" language
  - Use: "We're Not Waiting for LDOE", "Louisiana educators building together"
- **Private (Dashboard/Emails):** Personal to current 5 beta users
  - Use: "You're one of 5 educators building this together"

### 3. Community Features Hidden for Launch

**Backend is ready, UI is intentionally hidden:**
- `src/components/community/` - Fully implemented
- Navigation menu - Community links commented out
- These will be enabled AFTER initial launch validation

**Why hidden:**
- Focus on Core Flare #1 (Alignment Scorecard)
- Reduce cognitive load for 5 initial users
- Enable organically based on user demand

### 4. Platform-Agnostic Approach

**CRITICAL:** Frameworks must work with ANY AI tool:
- ChatGPT, Gemini, Claude, MagicSchool AI, Brisk, etc.
- Copy-paste ready prompts
- No vendor lock-in
- No API integrations with specific AI tools (except our own analysis)

### 5. Louisiana Standards Alignment

**All content must align with:**
- Louisiana Student Standards (LSS)
- Louisiana Educator Rubric (LER)
- Subject areas: ELA, Math, Science, Social Studies
- Grade levels: K-12

**RAG system filters by:**
- Subject
- Grade level
- Cognitive depth (recall, skill/concept, strategic thinking, extended thinking)

### 6. Database Query Optimization

**ALWAYS use indexes:**
- Most selective index first
- Avoid table scans (filter after index query, not instead of)
- Order: module > category > status

**Example:**
```typescript
// ✅ GOOD
await ctx.db
  .query("frameworks")
  .withIndex("by_module", q => q.eq("module", "ai-basics-hub"))
  .filter(q => q.eq(q.field("status"), "published"))
  .collect();

// ❌ BAD
await ctx.db
  .query("frameworks")
  .filter(q => q.eq(q.field("module"), "ai-basics-hub"))
  .collect();
```

### 7. TypeScript Strict Mode

**NO `any` types without justification:**
```typescript
// ❌ BAD
const data: any = await ctx.db.query("frameworks").first();

// ✅ GOOD
const data: Doc<"frameworks"> | null = await ctx.db
  .query("frameworks")
  .first();
```

### 8. Testing Before Commits

**ALWAYS run tests before committing:**
```bash
pnpm test:once
```

**Tests must pass. No exceptions.**

---

## Common Tasks

### Adding a New Framework

1. **Create framework data** (see `convex/seedFrameworks.ts` for examples):
```typescript
const newFramework = {
  frameworkId: "unique-id",
  title: "Framework Title",
  module: "ai-basics-hub",
  category: "Lesson Planning",
  tags: ["lesson-planning", "differentiation"],
  challenge: "Teachers struggle with...",
  solution: "AI can help by...",
  samplePrompt: "Copy-paste ready prompt here",
  ethicalGuardrail: "Important considerations...",
  timeEstimate: 15,
  difficultyLevel: "beginner",
  platformCompatibility: ["ChatGPT", "Gemini", "Claude"],
  status: "published",
  // ... other fields
};
```

2. **Add via mutation:**
```typescript
await ctx.runMutation(api.frameworks.createFramework, newFramework);
```

3. **Or seed via script:**
```bash
npx convex run seedFrameworks:seedInitialFrameworks
```

### Adding a New Convex Function

1. **Define function in appropriate file** (e.g., `convex/frameworks.ts`):
```typescript
export const myNewQuery = query({
  args: { frameworkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("frameworks")
      .withIndex("by_framework_id", q => q.eq("frameworkId", args.frameworkId))
      .first();
  },
});
```

2. **Use in React component:**
```typescript
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";

const framework = useQuery(api.frameworks.myNewQuery, {
  frameworkId: "some-id"
});
```

3. **Add tests:**
```typescript
it("should query framework by ID", async () => {
  const t = convexTest(schema);
  const id = await t.mutation(createFramework, frameworkData);
  const result = await t.query(myNewQuery, { frameworkId: id });
  expect(result).toBeDefined();
});
```

### Adding a New React Component

1. **Create component file** (e.g., `src/components/framework/NewComponent.tsx`):
```typescript
import { cn } from "@/lib/utils";

interface NewComponentProps {
  title: string;
  onClick?: () => void;
}

export function NewComponent({ title, onClick }: NewComponentProps) {
  return (
    <div className={cn("px-4 py-2 rounded-lg bg-pelican-blue")}>
      <h3>{title}</h3>
      {onClick && (
        <Button onClick={onClick}>Click Me</Button>
      )}
    </div>
  );
}
```

2. **Export from index:**
```typescript
// src/components/framework/index.ts
export { NewComponent } from "./NewComponent";
```

3. **Use in parent component:**
```typescript
import { NewComponent } from "@/components/framework";

<NewComponent title="Hello" onClick={handleClick} />
```

### Adding a New Database Table

1. **Define in schema** (`convex/schema.ts`):
```typescript
myNewTable: defineTable({
  userId: v.string(),
  data: v.string(),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_created_at", ["createdAt"]),
```

2. **Create CRUD operations** (e.g., `convex/myNewTable.ts`):
```typescript
export const create = mutation({
  args: {
    userId: v.string(),
    data: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("myNewTable", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("myNewTable")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .collect();
  },
});
```

3. **Add tests:**
```typescript
describe("myNewTable", () => {
  it("should create and retrieve records", async () => {
    const t = convexTest(schema);
    const id = await t.mutation(create, { userId: "123", data: "test" });
    const records = await t.query(getByUser, { userId: "123" });
    expect(records).toHaveLength(1);
  });
});
```

### Setting Up Environment Variables

**Local development:**
```bash
# Create .env.local (not in git)
cp .env.example .env.local

# Add required variables
VITE_CONVEX_URL=https://kindly-setter.convex.cloud
VITE_CONVEX_SITE_URL=https://kindly-setter.convex.site
```

**Convex environment variables:**
```bash
# Set via CLI
npx convex env set OPENAI_API_KEY "sk-..."
npx convex env set RESEND_API_KEY "re_..."
npx convex env set WEEKLY_EMAILS_ENABLED false

# View current values
npx convex env list
```

### Deploying to Production

```bash
# Deploy Convex backend
npx convex deploy

# Frontend (Vercel) - auto-deploys on git push to main
git push origin main
```

---

## Troubleshooting

### Common Issues

#### "Convex function not found"
**Problem:** Using old API after schema changes.
**Solution:**
```bash
# Stop dev server (Ctrl+C)
# Restart to regenerate types
pnpm dev
```

#### "Type error in _generated/api.d.ts"
**Problem:** Schema doesn't match generated types.
**Solution:**
```bash
# Force regeneration
npx convex dev --once
```

#### "Rate limit exceeded"
**Problem:** Too many API calls in short time.
**Solution:**
- Check `convex/rateLimiting.ts` for current limits
- Adjust limits if legitimate use case
- Or wait for rate limit window to reset

#### "Authentication error"
**Problem:** Better Auth session expired or invalid.
**Solution:**
```typescript
// Refresh session
const { data: session } = useSession();
if (!session) {
  // Redirect to login
}
```

#### "Tests failing with 'Cannot find module'"
**Problem:** Import paths incorrect.
**Solution:**
- Use `@/` alias for src imports: `import { cn } from "@/lib/utils"`
- Use relative paths for convex: `import schema from "./schema"`

#### "Database query slow"
**Problem:** Not using indexes.
**Solution:**
```typescript
// Add index to schema.ts
.index("by_field", ["field"])

// Use withIndex() in query
.withIndex("by_field", q => q.eq("field", value))
```

### Debug Tools

**Convex Dashboard:**
```bash
npx convex dashboard
```
- View all tables and data
- Inspect function calls and logs
- Monitor performance
- View scheduled functions

**React DevTools:**
- Install browser extension
- Inspect component tree
- View props and state
- Profile performance

**Vite DevTools:**
- Network tab for API calls
- Console for logs
- Sources tab for debugging

### Getting Help

1. **Check documentation:**
   - `PROJECT.md` - Project context
   - `docs/CONTRIBUTING.md` - Development guidelines
   - `docs/TESTING.md` - Testing guide
   - `ARCHITECTURE_VALIDATION.md` - Scaling details

2. **Search codebase:**
   - Look for similar implementations
   - Check test files for examples

3. **Convex Community:**
   - Discord: https://discord.gg/convex
   - Docs: https://docs.convex.dev

4. **Better Auth Docs:**
   - https://www.better-auth.com/docs

---

## Quick Reference

### Essential Commands
```bash
# Development
pnpm dev                    # Start frontend + backend
pnpm dev:frontend           # Vite only
pnpm dev:backend            # Convex only

# Testing
pnpm test                   # Watch mode
pnpm test:once              # Run once
pnpm test:coverage          # Coverage report

# Database
npx convex dashboard        # Open dashboard
npx convex deploy           # Deploy to production
npx convex run <function>   # Run Convex function

# Linting
pnpm lint                   # Full lint + type check
```

### Important Files
```
convex/schema.ts            # Database schema (source of truth)
convex/authorization.ts     # Auth helpers (requireAuth, requireRole)
convex/rateLimiting.ts      # Rate limit configuration
src/lib/auth-client.ts      # Better Auth client
src/App.tsx                 # Routing configuration
PROJECT.md                  # Project vision and context
```

### Key Concepts
- **Convex Reactivity:** Queries auto-update when data changes
- **Better Auth:** Session-based authentication
- **Role-Based Access:** teacher, coach, admin roles
- **FERPA Compliance:** No PII in logs
- **Platform-Agnostic:** Works with ANY AI tool
- **Louisiana-Aligned:** LSS and LER standards

---

## Conclusion

This document provides the essential context for working on Pelican AI. Remember:

1. **Read `PROJECT.md` first** for project vision and current status
2. **Follow TypeScript strict mode** - no `any` types
3. **Test before committing** - `pnpm test:once`
4. **Respect FERPA compliance** - no PII in logs
5. **Use indexes for database queries** - avoid table scans
6. **Maintain grassroots positioning** - teacher-to-teacher voice

When in doubt, check existing implementations for patterns and conventions.

---

**Last Updated:** November 18, 2025
**Maintained by:** Pelican AI Development Team
**Version:** 2.0.0
