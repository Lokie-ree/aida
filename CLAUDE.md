# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# CLAUDE.md - AI Assistant Guide for Pelican AI

**Last Updated:** November 24, 2025
**Version:** 3.2.0
**Status:** Production Ready - Refactored and Streamlined

---

## Purpose of This Document

This document provides AI assistants with essential patterns, conventions, and constraints for the Pelican AI codebase. For detailed project vision and strategy, see `PROJECT.md`.

---

## Project Overview

### What is Pelican AI?

Pelican AI is an **educational SaaS platform** that provides Louisiana educators with platform-agnostic AI guidance. It's NOT another AI tool—it's an "intelligent coaching layer" that works with ANY AI tool (ChatGPT, Gemini, MagicSchool AI, etc.).

**Mission:** "We're Not Waiting for LDOE" - Louisiana educators building practical, ethical, and platform-agnostic AI guidance together.

### Key Features (User-Accessible)

1. **Framework Library** - 10 platform-agnostic AI guidance frameworks (exact count, honest numbers)
2. **Dashboard** - Personalized educator dashboard with time tracking and analytics
3. **Beta Program Management** - Grassroots launch with small group of committed educators
4. **Alignment Scorecard (Core Flare #1)** - Analyze AI-generated content against Louisiana Standards
   - ✅ **Backend:** Complete (workflow, RAG, database, API endpoints)
   - ✅ **Frontend:** Complete (UI components, route, navigation)
   - **Files:** `convex/alignmentScorecard.ts`, `convex/alignmentSteps.ts`, `convex/rag.ts`, `src/components/alignment/`
   - **Rubric Integration:** Validates content against specific rubric indicators (Standards and Objectives, Presenting Instructional Content, Student Work, Assessment) with performance level feedback
5. **Community Features** - Innovation sharing and testimonials (backend implemented, UI intentionally hidden for MVP launch - will unhide at 30-100 users)

### Future Features (Planned, Not Yet Implemented)

**Weekly Spark** - Proactive weekly prompts based on Louisiana pacing guide (see PROJECT.md for details)
- Status: Vision documented, implementation pending post-launch
- **Rubric Integration:** Addresses rubric indicators (Standards and Objectives, Motivating Students, Lesson Structure and Pacing, Presenting Instructional Content)

**Delta Generator** - Instant differentiation based on Louisiana accommodation guidelines (see PROJECT.md for details)
- Status: Vision documented, implementation pending post-launch
- **Rubric Integration:** Grounded in rubric's Teacher Knowledge of Students and Grouping Students indicators, maintains grade-level standards access

> **Note for AI Assistants:**
> - Alignment Scorecard backend is COMPLETE - do not rebuild workflow/database logic
> - UI components need to be built - this is the current gap
> - Do NOT implement Weekly Spark or Delta Generator unless explicitly requested

### Current Launch Status

- **Stage:** Grassroots launch with small group of educators
- **Beta Launch Date:** December 1, 2025
- **Positioning:** "We're Not Waiting for LDOE"
- **Philosophy:** Authentic, teacher-to-teacher communication (not corporate speak)
- **Community Features:** Backend implemented, UI intentionally hidden for MVP launch
- **Weekly Emails:** Feature-flagged (WEEKLY_EMAILS_ENABLED=false by default)
  - **Why disabled:** Grassroots launch prioritizes personal check-ins over automation
  - Real conversations (text/email replies) > automated email sequences
  - Will enable when scaling to 30-100 users (see PROJECT.md for details)

### Launch Timeline (From PROJECT.md)

- **December 1, 2025:** Beta launch with small group of educators
- **December 2025:** Daily personal check-ins, gather authentic testimonials
- **Spring 2026:** Accumulate wealth of user testimonials demonstrating platform value
- **Summer 2026:** Present at APEL LEADS conference (Louisiana educators) and ISTE conference (Orlando)
- **Ongoing:** Organic growth through word-of-mouth recommendations

> **Note for AI Assistants:** Do NOT build automated email workflows or marketing features. The grassroots approach prioritizes 1-on-1 relationships over automation during initial launch phase.

---

## Tech Stack

### Frontend
- **React 19.2.0** + **TypeScript 5.7.3** + **Vite 6.3.6**
- **React Router DOM 7.9.4** - Client-side routing
- **Tailwind CSS 4.1.14** + **shadcn/ui** - Styling
- **Framer Motion 12.23.22** - Animations

### Backend
- **Convex 1.27.5** - Serverless backend + real-time database
- **Better Auth 1.3.27** - Authentication (@convex-dev/better-auth)
- **OpenAI GPT-4o** - AI agent for content analysis
- **Resend API** - Email delivery

### Convex Components (Production-Ready)
1. `@convex-dev/better-auth` - Authentication
2. `@convex-dev/resend` - Email delivery
3. `@convex-dev/rag` - Vector search for Louisiana Standards
4. `@convex-dev/agent` - LLM integration with retry logic
5. `@convex-dev/workflow` - Multi-step processes with fault tolerance
6. `@convex-dev/rate-limiter` - Distributed rate limiting
7. `@convex-dev/action-cache` - Action result caching

### Testing
- **Vitest 4.0.6** - Unit tests
- **@vitest/browser + Playwright** - E2E tests
- **convex-test 0.0.38** - Convex backend testing

---

## Architecture Patterns

### Convex Function Types

**Query** - Read-only, reactive (re-runs when data changes):
```typescript
export const getFrameworks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("frameworks").collect();
  },
});
```

**Mutation** - Write operations:
```typescript
export const createFramework = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("frameworks", args);
  },
});
```

**Action** - External API calls (OpenAI, Resend):
```typescript
export const analyzeContent = action({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const result = await openai.chat.completions.create(...);
    await ctx.runMutation(api.frameworks.saveAnalysis, result);
  },
});
```

### Real-Time Reactivity

**CRITICAL:** Convex provides automatic real-time updates. When you use `useQuery()` in React, the query automatically re-runs when underlying data changes. No manual polling needed.

```typescript
// This automatically updates when frameworks change
const frameworks = useQuery(api.frameworks.getAllFrameworks);
```

### Authentication

**In Convex Functions:**
```typescript
import { requireAuth } from "./authorization";

const { user, profile } = await requireAuth(ctx);
const userId = user._id;
```

**In React Components:**
```typescript
import { authClient } from "@/lib/auth-client";

const { data: session } = authClient.useSession();
const userId = session?.user?.id;
```

### Authorization

```typescript
// Require authentication
const { user, profile } = await requireAuth(ctx);

// Require specific role
await requireRole(ctx, "admin");

// Require admin (role-based + email fallback)
await requireAdmin(ctx);

// Non-throwing check
const isAdmin = await checkIsAdmin(ctx);
```

**Authorization Helpers** (`convex/authorization.ts`):
- `requireAuth(ctx)` - Returns user with profile, throws if not authenticated
- `requireRole(ctx, role)` - Checks user has specific role ("teacher" | "admin" | "coach")
- `requireAdmin(ctx)` - Checks admin access (role-based + email fallback)
- `checkIsAdmin(ctx)` - Non-throwing boolean check for admin status

### Rate Limiting

```typescript
import { checkRateLimit } from "./rateLimiting";

await checkRateLimit(ctx, userId, "aiGeneration");
// Types: "aiGeneration", "ragQuery", "emailSend"
// Limits vary by role: teacher (10/min), coach (20/min), admin (100/min)
```

### Workflow System (@convex-dev/workflow)

**Configuration** (`convex/workflows.ts`):
```typescript
export const workflow = new WorkflowManager(components.workflow, {
  workpoolOptions: {
    maxParallelism: 10,          // Max concurrent workflows
    defaultRetryBehavior: {
      maxAttempts: 3,            // Retry failed steps 3 times
      initialBackoffMs: 1000,    // Start with 1s delay
      base: 2,                   // Exponential backoff (2x)
    },
  },
});
```

**Current Workflows:**
- **Alignment Scorecard** (`convex/alignmentScorecard.ts`) - Multi-step AI content analysis
  - Step 1: Extract Louisiana Standards via RAG (`ragService.ts`)
  - Step 2: Analyze alignment via OpenAI GPT-4o
  - Step 3: Save results to `alignmentAnalyses` table
  - Built-in retry logic and status tracking

**Usage Pattern:**
```typescript
import { workflow } from "./workflows";

// Start workflow
const handle = await workflow.start(ctx, {
  workflowId: "alignmentAnalysis",
  args: { content, gradeLevel, subject }
});

// Workflow runs autonomously with fault tolerance
// Results saved to alignmentAnalyses table
```

### Email Template System

**React Email Components** (`src/emails/`):
All emails use `@react-email/components` for consistent, responsive design:
- `BetaWelcomeEmail.tsx` - New user onboarding
- `PlatformAccessEmail.tsx` - Beta access granted
- `WeeklyPromptEmail.tsx` - Weekly engagement prompts (feature-flagged)
- `FollowupEmail.tsx` - Follow-up communications
- `NetworkPartnerEmail.tsx` - Network partner outreach
- `OutreachEmail.tsx` - General outreach
- `BaseEmailTemplate.tsx` - Shared email layout

**Sending Emails:**
```typescript
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import { BetaWelcomeEmail } from "../src/emails/BetaWelcomeEmail";
import { render } from "@react-email/render";

const resend = new Resend(components.resend);

await resend.emails.send(ctx, {
  from: "Pelican AI <hello@pelicanai.com>",
  to: user.email,
  subject: "Welcome to Pelican AI",
  html: render(<BetaWelcomeEmail userName={user.name} />),
});
```

---

## Component Organization

### Directory Structure

```
src/components/
├── ui/              # shadcn/ui components (Button, Dialog, Card, etc.)
├── shared/          # Cross-cutting components (AppHeader, Logo, ErrorBoundary)
├── dashboard/       # Dashboard feature components
├── framework/       # Framework library feature components
├── community/       # Community features (innovations, testimonials)
├── admin/           # Admin dashboard components
├── auth/            # Authentication components (AuthModal)
├── routes/          # Route protection and navigation
└── landing/         # Landing page sections

src/emails/          # React Email templates (@react-email/components)
src/lib/             # Utility functions and configurations
```

**Naming Convention:**
- Feature-based organization with descriptive names
- ✅ `FrameworkUsageChart.tsx` (clear, descriptive)
- ❌ `Chart.tsx` (too generic)

**Component Pattern:**
```typescript
import { cn } from "@/lib/utils";

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: ComponentProps) {
  return (
    <div className={cn("px-4 py-2 rounded-lg")}>
      <h3>{title}</h3>
    </div>
  );
}
```

---

## Route Structure

### Authentication-Based Routing

**Convex React Authentication:**
- `<Authenticated>` - Routes shown when user is logged in
- `<Unauthenticated>` - Routes shown when user is logged out

**Route Protection:**
```typescript
<ProtectedRoute requireAdmin={true}>  // Admin-only routes
  <AdminRoute />
</ProtectedRoute>

<ProtectedRoute>                       // Authenticated user routes
  <DashboardRoute />
</ProtectedRoute>
```

### Key Routes

- `/` - Smart redirect (checks onboarding status → redirects to dashboard or onboarding)
- `/dashboard` - Main educator dashboard
- `/frameworks` - Framework library (10 frameworks)
- `/frameworks/:frameworkId` - Individual framework details
- `/community` - Innovation sharing & testimonials
- `/profile` - User profile settings
- `/time-tracking` - Time savings analytics
- `/admin` - Admin content moderation (admin-only)

**Implementation:** See `src/App.tsx` for complete route configuration

**Lazy Loading:**
All route components are lazy-loaded for code splitting:
```typescript
const FrameworkLibrary = lazy(() => import("./components/framework/FrameworkLibrary"));
```

---

## Build Optimization

### Code Splitting Strategy

**Lazy Loading:**
All route components use React's `lazy()` for automatic code splitting:
```typescript
import { lazy } from "react";

const DashboardRoute = lazy(() => import("./components/routes/DashboardRoute"));
const FrameworkLibrary = lazy(() => import("./components/framework/FrameworkLibrary"));
```

**Manual Chunk Splitting** (`vite.config.ts`):
Vendor chunks defined for optimal caching and parallel loading:
- `react-vendor` - React core (react, react-dom, react-router-dom)
- `ui-vendor` - Radix UI components (@radix-ui/*)
- `animation-vendor` - Framer Motion
- `convex-vendor` - Convex components
- `auth-vendor` - Better Auth
- `form-vendor` - React Hook Form + Zod
- `chart-vendor` - Recharts
- `table-vendor` - TanStack Table
- `dnd-vendor` - DnD Kit
- `email-vendor` - React Email
- `ai-vendor` - OpenAI SDK

### Production Optimizations

```typescript
// vite.config.ts optimizations
{
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: mode === 'production',  // Remove console.log in production
      drop_debugger: mode === 'production', // Remove debugger statements
    },
  },
  assetsInlineLimit: 4096,  // Inline assets smaller than 4KB
  cssCodeSplit: true,       // Split CSS for better caching
}
```

**Dependency Pre-bundling:**
Critical dependencies are pre-bundled for faster dev server startup:
```typescript
optimizeDeps: {
  include: [
    'react', 'react-dom', 'react-router-dom',
    'framer-motion', 'lucide-react',
    'class-variance-authority', 'clsx', 'tailwind-merge',
  ],
}
```

---

## Testing Architecture

### Dual Configuration Setup

**Backend Tests** (`vitest.config.mts`):
- **Environment:** `edge-runtime` (simulates Convex edge runtime)
- **Tests:** `convex/**/*.test.ts`
- **In-memory Testing:** Uses `convex-test` for in-memory Convex simulation
- **No network calls:** All Convex operations run locally

**E2E Tests** (`vitest.browser.config.mts`):
- **Environment:** `node` with Playwright browser automation
- **Tests:** `tests/e2e/**/*.test.ts`
- **Setup:** `tests/e2e/setup.ts`
- **Timeout:** 30s for browser operations
- **Hook Timeout:** 10s

### Better Auth Testing

```typescript
import { convexTest } from "convex-test";
import schema from "./schema";

const t = convexTest(schema);

// Mock authenticated user
const asUser = t.withIdentity({ subject: "user123" });
await asUser.run(async (ctx) => {
  // Test authenticated operations
  const result = await createFramework(ctx, { title: "Test" });
  expect(result).toBeDefined();
});
```

### Running Tests

```bash
# Run all backend tests once
pnpm test:once

# Run specific test file/pattern
pnpm test:once frameworks

# Watch mode for development
pnpm test:watch

# Generate coverage report (HTML at coverage/index.html)
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# E2E watch mode
pnpm test:e2e:watch

# E2E with UI
pnpm test:e2e:ui
```

### Test Coverage Exclusions

```typescript
// vitest.config.mts coverage settings
coverage: {
  exclude: [
    "convex/**/*.test.ts",           // Test files
    "convex/_generated/**",          // Auto-generated files
    "convex/schema.ts",              // Schema definition
    "convex/convex.config.ts",       // Configuration
    "convex/router.ts",              // Router setup
    "convex/http.ts",                // HTTP endpoints
    "convex/seedFrameworks.ts",      // Seed data
    "convex/auth.ts",                // Better Auth glue
    "convex/auth.config.ts",         // Auth config
  ],
}
```

---

## Code Conventions

### TypeScript Guidelines

**Use strict types, never `any`:**
```typescript
// ✅ GOOD
const frameworks: Framework[] = await ctx.db
  .query("frameworks")
  .filter(q => q.eq(q.field("status"), "published"))
  .collect();

// ❌ BAD
const frameworks: any = await ctx.db.query("frameworks").collect();
```

**Always use Convex validators:**
```typescript
export const createFramework = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => { /* ... */ },
});
```

### Component Patterns

**Naming:** PascalCase, descriptive names (`FrameworkUsageChart.tsx` not `Chart.tsx`)

**Structure:**
```typescript
import { cn } from "@/lib/utils";

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: ComponentProps) {
  return (
    <div className={cn("px-4 py-2 rounded-lg")}>
      <h3>{title}</h3>
    </div>
  );
}
```

### Database Query Patterns

**Always use indexes:**
```typescript
// ✅ GOOD - Uses index
const frameworks = await ctx.db
  .query("frameworks")
  .withIndex("by_status", q => q.eq("status", "published"))
  .collect();

// ❌ BAD - Table scan (slow)
const frameworks = await ctx.db
  .query("frameworks")
  .filter(q => q.eq(q.field("status"), "published"))
  .collect();
```

**Query optimization order:** Use most selective index first (module > category > status)

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

logSecure("info", "User action", {
  userId: user.id,
  action: "framework_viewed"
});
```

---

## Critical Constraints

### 1. FERPA Compliance
**NEVER log PII:** No student names, emails, addresses, or teacher emails in logs. Use user IDs only.

### 2. Grassroots Launch Positioning
**Brand Voice:**
- Teacher-to-teacher communication (NOT corporate speak)
- "We're Not Waiting for LDOE"
- Honest numbers (small group of Louisiana educators building together, 10 frameworks at launch)
- Personal tone, not marketing jargon
- Personal check-ins over automation

**Examples:**
- ✅ "Tell me honestly—did it save you time?"
- ✅ "You're one of the first educators I'm starting with"
- ❌ "Leverage AI synergies for paradigm-shifting results"
- ✅ "You're part of a small group of educators building this together"
- ✅ "10 frameworks" (exact count)
- ❌ "Join 10,000+ educators transforming education"
- ❌ "10+ frameworks" (implies we don't know the exact number)

**Public vs. Private Messaging:**
- **Public-facing (Landing Page):** Scalable grassroots messaging, no specific numbers
  - Use: "We're Not Waiting for LDOE", "Louisiana educators building together", "small group of educators"
- **Private (Dashboard/Emails):** Personal to current beta users
  - Use: "You're part of a small group of educators building this together"

### 3. Community Features
Fully implemented and available for testing:
- `src/components/community/` - Innovation sharing and testimonials
- Navigation menu - Community features accessible
- Gathering feedback from early users

### 4. Platform-Agnostic Approach
**CRITICAL:** Frameworks must work with ANY AI tool (ChatGPT, Gemini, Claude, MagicSchool AI, etc.). No vendor lock-in.

### 5. Louisiana Educator Rubric Integration
**CRITICAL:** The Louisiana Educator Rubric (LER) is the foundation for every Pelican AI feature and interaction. Every feature, suggestion, and validation explicitly references rubric indicators and performance descriptors (Exemplary Level 5, Proficient Level 3, Unsatisfactory Level 1).

**Rubric Domains Integrated:**
- **Instruction Domain** (12 indicators): Standards and Objectives, Motivating Students, Presenting Instructional Content, Lesson Structure and Pacing, Activities and Materials, Questioning, Academic Feedback, Grouping Students, Teacher Content Knowledge, Teacher Knowledge of Students, Thinking, Problem-Solving
- **Planning Domain** (3 indicators): Instructional Plans, Student Work, Assessment
- **Environment Domain** (4 indicators): Expectations, Engaging Students and Managing Behavior, Physical Environment, Respectful Conditions for Learning
- **Professionalism Domain** (4 indicators): Professional Growth and Development, Reflection on Teaching Practice, School Involvement, Fulfillment of School Responsibilities

**How It Works:**
- Alignment Scorecard validates against specific rubric indicators and cites exact descriptors
- Weekly Spark addresses rubric indicators in proactive suggestions
- Delta Generator grounds differentiation in rubric's Teacher Knowledge of Students and Grouping Students indicators
- Innovation Remix Engine ensures shared innovations maintain rubric alignment across contexts

All content also aligns with Louisiana Student Standards (LSS) across ELA, Math, Science, Social Studies for K-12.

### 6. TypeScript Strict Mode
NO `any` types without justification. Use proper types from `convex/_generated/api.d.ts`.

### 7. Testing Before Commits
**ALWAYS run tests:** `pnpm test:once` - Tests must pass, no exceptions.

---

## Database Schema

**Source of Truth:** `convex/schema.ts` (Convex auto-generates API types)

### Key Tables
- `betaSignups` - Landing page signups
- `userProfiles` - Extended educator data
- `frameworks` - AI guidance frameworks (10 at launch)
- `frameworkUsage` - Usage tracking
- `betaProgram` - Beta program participation
- `innovations` - Community-shared teaching innovations
- `innovationInteractions` - Innovation likes, tries, comments
- `testimonials` - User feedback and success stories
- `timeTracking` - Time savings analytics
- `alignmentAnalyses` - Alignment Scorecard results

### Auto-Managed Tables (via Convex Components)
- `user`, `session`, `account`, `verification` - Better Auth
- `documents`, `chatMessages`, `feedbackSessions`, `auditLogs` - RAG component

**DO NOT define these in schema.ts** - managed by Convex components.

---

## Quick Reference

### Essential Commands
```bash
# Development
pnpm dev                    # Start frontend + backend (parallel)
pnpm dev:frontend           # Start Vite dev server only
pnpm dev:backend            # Start Convex dev server only

# Testing
pnpm test                   # Run tests in watch mode
pnpm test:once              # Run unit tests once
pnpm test:once frameworks   # Run specific test pattern
pnpm test:watch             # Watch mode for development
pnpm test:coverage          # Generate coverage report (HTML)
pnpm test:e2e               # Run E2E tests
pnpm test:e2e:watch         # E2E watch mode
pnpm test:e2e:ui            # E2E with UI

# Build
pnpm build                  # Build for production
pnpm lint                   # Full lint + type check

# Database
npx convex dashboard        # Open Convex dashboard
npx convex deploy           # Deploy to production
npx convex env set KEY val  # Set environment variable
```

### Important Files
- `convex/schema.ts` - Database schema (source of truth)
- `convex/authorization.ts` - Auth helpers (requireAuth, requireRole, requireAdmin)
- `convex/rateLimiting.ts` - Rate limit configuration
- `convex/workflows.ts` - Workflow manager configuration
- `src/lib/auth-client.ts` - Better Auth client setup
- `src/App.tsx` - Routing configuration
- `vite.config.ts` - Vite build configuration
- `vitest.config.mts` - Backend test configuration
- `vitest.browser.config.mts` - E2E test configuration
- `PROJECT.md` - Project vision and context

### Key Concepts
- **Convex Reactivity:** Queries auto-update when data changes
- **Better Auth:** Session-based authentication with Convex integration
- **Role-Based Access:** teacher, coach, admin roles
- **FERPA Compliance:** No PII in logs
- **Platform-Agnostic:** Works with ANY AI tool
- **Louisiana-Aligned:** LSS and LER standards
- **Rubric-Infused:** Every feature grounded in Louisiana Educator Rubric indicators and performance descriptors
- **Workflow-Driven:** Multi-step processes with fault tolerance and retry logic

---

## Development Workflow

### Before Making Changes
1. Read `PROJECT.md` for project context
2. Check if tests exist for the code you're changing
3. Follow TypeScript strict mode (no `any` types)
4. Respect FERPA compliance (no PII in logs)

### Making Changes
1. Use Convex validators for all args and returns
2. Use indexes for database queries
3. Write tests for new functionality
4. Run `pnpm test:once` before committing
5. Follow code conventions (TypeScript, components, queries)

### NEVER
1. Push directly to `main` branch
2. Edit `convex/_generated/` files (auto-generated)
3. Use `any` types without explicit justification
4. Log PII (student names, emails, etc.)
5. Skip tests before committing

---

## Refactoring Status (November 2025)

### Completed Refactoring

**Phase 0: Alignment Scorecard UI** ✅
- Created complete UI component structure (`src/components/alignment/`)
- Added route, navigation item, and quick access card
- Connected to backend APIs (`api.rag.analyzeContentAlignment`, `api.rag.getAlignmentStatus`)

**Phase 1: Dead Code Removal** ✅
- Deleted 4 orphaned backend files (dashboardAnalytics.ts, adminDebug.ts, vapi.ts, router.ts)
- Removed 5 unused frontend components (CommunityInsights, ProgressTrackingChart, FrameworkUsageChart, TimeSavingsChart, gradient-text.tsx)
- Updated dashboard index.ts exports

**Phase 2: Community Features Hidden** ✅
- Removed `/community` route from App.tsx
- Removed community navigation cards from QuickAccessGrid
- Removed community navigation handlers from Dashboard
- Community backend remains intact for future unhiding

**Phase 3: Backend Cleanup** ✅
- Removed `currentUser` and `getCurrentUser` aliases from auth.ts (kept `loggedInUser`)
- Removed duplicate `submitInnovation` function from innovations.ts
- Removed unused `getSimilarInnovations` function
- Added feature-flag comments to email.ts functions

**Phase 4: Documentation** ✅
- Added status comments to all Convex files (ACTIVE, PHASE 2, FEATURE-FLAGGED, TEST HELPERS)
- Updated CLAUDE.md with refactor results

### Feature-Flag Activation Thresholds

**30-100 Users:**
- Community features (innovations, testimonials) - UI will be unhidden
- Weekly email automation (`sendWeeklyPromptEmail`, `sendWeeklyEmailsToAllUsers`) - Enable via `WEEKLY_EMAILS_ENABLED=true`

**Current Status:**
- Community features: Backend complete, UI hidden (5-user grassroots launch)
- Weekly emails: Disabled by default, feature-flagged in email.ts

### Code Status Markers

All Convex files now have header comments indicating status:
- ✅ **ACTIVE** - Used in production
- ⚠️ **PHASE 2** - Backend ready, UI hidden for MVP
- 🚫 **FEATURE-FLAGGED** - Disabled for grassroots launch
- 🧪 **TEST HELPERS** - For testing only

---

## Development Environment

**Platform:** Windows (MINGW64_NT-10.0-26200)
**Git:** Git Bash (MINGW64)
**Path Handling:** Use forward slashes in code (e.g., `./src/components`), backslashes auto-converted by Windows
**Working Directory:** `C:\Users\rplap\OneDrive\Desktop\personal\aida`

---

**Last Updated:** November 24, 2025
**Maintained by:** Pelican AI Development Team
**Version:** 3.2.0 - Refactored: Alignment Scorecard UI complete, dead code removed, community features properly hidden, status markers added
