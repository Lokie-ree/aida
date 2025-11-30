# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pelican AI** is an intelligent coaching assistant for Louisiana K-12 educators, helping them generate high-quality, Louisiana-aligned prompts for use in any AI tool (ChatGPT, Claude, Gemini, etc.). The platform is built specifically for Louisiana educators navigating LEADS evaluations and the Louisiana Educator Rubric.

**Core Mission:** Platform-agnostic guidance that improves teaching practice through Louisiana-specific alignment, not just generic AI assistance.

See `VISION.md` for complete product vision and strategic context.

---

## 🚀 SHIPPING GUIDE: What Can Deploy This Week

### ✅ READY TO SHIP NOW (Backend + UI Complete)

**1. Framework Library** (`src/components/framework/FrameworkLibrary.tsx`)
- **Status:** ✅ Fully functional, seeded with 10 frameworks
- **Backend:** Complete CRUD operations in `convex/frameworks.ts`
- **UI:** Polished interface with search, filters, recommendations
- **Data:** `convex/seedFrameworks.ts` has 10 production-ready frameworks
- **User Value:** Teachers can browse, search, save, and use AI guidance frameworks
- **Action Required:** NONE - Deploy as-is
- **Test:** `pnpm dev` → Navigate to `/frameworks`

**2. User Profiles** (`src/components/dashboard/ProfileSettings.tsx`)
- **Status:** ✅ Working profile management
- **Backend:** `convex/userProfiles.ts` - CRUD complete
- **UI:** Profile settings page with school, subject, grade level
- **User Value:** Personalized framework recommendations
- **Action Required:** NONE - Deploy as-is

**3. Time Tracking** (`src/components/shared/TimeSavingsTracker.tsx`)
- **Status:** ✅ Working time savings display
- **Backend:** `convex/timeTracking.ts` - CRUD complete
- **UI:** Visual time savings tracker on dashboard
- **User Value:** See time saved using frameworks
- **Action Required:** NONE - Deploy as-is

### 🟡 BACKEND READY, UI NEEDS CONNECTION (Ship Week 2)

**4. Community Innovations**
- **Status:** 🟡 Backend complete, UI partially implemented
- **Backend:** `convex/innovations.ts` - Full CRUD operations ✅
- **UI Files:**
  - `src/components/community/InnovationForm.tsx` ✅
  - `src/components/community/InnovationList.tsx` ✅
  - `src/components/community/InnovationCard.tsx` ✅
- **What's Missing:** Integration into dashboard/navigation
- **User Value:** Teachers share and discover classroom innovations
- **Action Required:**
  1. Add route to `src/App.tsx` for `/community` or `/innovations`
  2. Add navigation link in `src/components/shared/Navigation.tsx`
  3. Test create/list/like functionality
- **Estimated Time:** 1-2 hours

**5. Testimonials**
- **Status:** 🟡 Backend complete, UI partially implemented
- **Backend:** `convex/testimonials.ts` - Full CRUD operations ✅
- **UI Files:**
  - `src/components/community/TestimonialForm.tsx` ✅
  - `src/components/community/TestimonialCard.tsx` ✅
  - `src/components/landing/TestimonialsSection.tsx` (landing page) ✅
- **What's Missing:** Integration for authenticated users to submit testimonials
- **User Value:** Social proof, community building
- **Action Required:**
  1. Add testimonial submission page/modal
  2. Connect to dashboard or community section
  3. Add admin approval flow (backend already exists)
- **Estimated Time:** 2-3 hours

### ⏳ NOT NEEDED FOR WEEK 1 LAUNCH

**6. Alignment Scorecard**
- **Status:** ⏳ Blocked by RAG data population
- **Why Not Now:** Requires Louisiana Student Standards in RAG (see `docs/RAG_PLAN.md`)
- **Backend:** Workflow infrastructure ready, but no data to search
- **Decision:** Defer to Phase 2 after RAG Phase 1 complete
- **User Impact:** Low - not part of Week 1 beta goals per `VISION.md`

**7. Conversational Prompt Coach**
- **Status:** ⏳ Backend ready, UI in development
- **Why Not Now:** Core value is frameworks library, not chat interface
- **Backend:** `convex/promptCoach.ts` fully implemented ✅
- **UI:** `src/components/coach/ChatInterface.tsx`, `PromptLibrary.tsx` exist but need integration
- **Decision:** Ship in Week 2-3 after frameworks proven valuable
- **User Impact:** Medium - nice to have, but frameworks deliver immediate value

---

## ⚠️ CRITICAL UI/UX ISSUES TO ADDRESS

### 1. Dashboard Complexity (HIGH PRIORITY)

**Problem:** `src/components/dashboard/Dashboard.tsx` tries to show too much

**Current Dashboard Components:**
- WelcomeHero
- JourneyStats (frameworksTried, timeSaved, innovationsShared, weeklyStreak)
- FeaturedRecommendation
- TimeSavingsTracker
- QuickAccessGrid
- Profile completion prompt

**Issues:**
- Overwhelming for new beta users (violates VISION.md principle of simplicity)
- Shows stats for features not yet live (innovations, weekly streak)
- Too many cards competing for attention

**Recommended Simplification for Week 1 Beta:**

```tsx
// Simplified Dashboard for Beta Launch
- WelcomeHero (keep - friendly, sets tone)
- Profile completion prompt (keep - critical for personalization)
- QuickAccessGrid with ONLY:
  → "Browse Frameworks" (primary action)
  → "My Saved Frameworks" (if user has saved any)
  → "Share Feedback" (testimonial submission)
- Remove: JourneyStats (no data yet), FeaturedRecommendation (redundant with framework library), TimeSavingsTracker (add after usage data exists)
```

**Action Required:**
1. Create `src/components/dashboard/SimplifiedDashboard.tsx` for beta
2. Use feature flag or environment variable to toggle between full/simple
3. Move complexity to "full dashboard" post-beta

**Estimated Time:** 2-3 hours

### 2. Navigation Clarity (MEDIUM PRIORITY)

**Problem:** Navigation doesn't clearly surface working features

**Current Navigation:** (Check `src/components/shared/Navigation.tsx`)
- Likely has routes for features not ready (Coach, Alignment)
- Missing route for Innovations (backend ready)

**Recommended Beta Navigation:**
```
- Home/Dashboard
- Framework Library ← PRIMARY FEATURE
- My Profile
- Community (Innovations + Testimonials) ← NEW
- (Remove or hide: Coach, Alignment Scorecard until ready)
```

**Action Required:**
1. Audit `src/components/shared/Navigation.tsx`
2. Hide unfinished features
3. Add Community section route
4. Make "Framework Library" visually prominent (primary CTA)

**Estimated Time:** 1 hour

### 3. Onboarding Flow (MEDIUM PRIORITY)

**Problem:** No clear "first use" experience

**Current:** Profile completion prompt appears, but users don't know what to do next

**Recommended:**
1. After signup/first login → Show simple modal:
   - "Welcome to Pelican AI!"
   - "Complete your profile to get personalized framework recommendations"
   - Big button: "Complete Profile" → Navigate to profile page
2. After profile complete → Navigate directly to Framework Library with tooltip:
   - "Start here! Browse frameworks designed for Louisiana educators"

**Action Required:**
1. Check if `src/components/dashboard/BetaOnboarding.tsx` exists and what it does
2. Implement simple 2-step onboarding (profile → frameworks)
3. Use localStorage to track onboarding completion

**Estimated Time:** 2-3 hours

### 4. Framework Library - Minor Polish

**Current Status:** Excellent UI, fully functional

**Minor Improvements:**
1. Empty state when user has no saved frameworks (show popular instead)
2. Add "Getting Started" tooltip on first visit
3. Ensure seed data is loaded (`pnpm convex run seedFrameworks:seedInitialFrameworks`)

**Action Required:**
1. Run seed function if not already run
2. Test all framework actions (view, save, copy, mark tried)

**Estimated Time:** 30 minutes

---

## 📋 WEEK 1 DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] Run `pnpm convex run seedFrameworks:seedInitialFrameworks` to populate frameworks
- [ ] Test framework library thoroughly (search, filters, view, save, copy)
- [ ] Test user profile CRUD (create, read, update)
- [ ] Simplify dashboard to beta version (or hide unused stats)
- [ ] Update navigation to show only working features
- [ ] Add basic onboarding flow (profile → frameworks)
- [ ] Test full user journey:
  1. Sign up → Complete profile → Browse frameworks → Save framework → Copy prompt
- [ ] Run `pnpm test` to ensure backend tests pass
- [ ] Run `pnpm lint` to check TypeScript/build issues
- [ ] Verify environment variables are set in Convex dashboard

### Post-Deployment (Week 1 Monitoring)

- [ ] Monitor framework usage (`frameworkUsage` table)
- [ ] Track time savings entries (`timeTracking` table)
- [ ] Monitor beta signup → activation conversion
- [ ] Collect qualitative feedback from beta testers
- [ ] Identify most popular frameworks (usageCount, averageRating)

### Week 2 Additions (After Week 1 Success)

- [ ] Connect Innovations UI to navigation
- [ ] Add testimonial submission flow
- [ ] Implement conversational coach UI
- [ ] (Optional) Begin RAG Phase 1 if time permits

---

## 🎯 FOCUS: Ship Value, Not Features

**Remember VISION.md principles:**
- **Quality over Speed:** "Better aligned, more thoughtful, Louisiana-specific prompts that improve your practice"
- **Conversation Over Configuration:** Keep it simple, not overwhelming
- **Louisiana-Specific Intelligence:** The 10 seeded frameworks ARE Louisiana-specific

**Week 1 Success = 4 beta testers each:**
- Complete their profile ✅
- Browse and save 2-3 frameworks ✅
- Copy at least 1 prompt to use in their preferred AI tool ✅
- Provide feedback on framework quality ✅

**Everything else is secondary.**

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite 6
- **Routing:** React Router v7
- **UI Components:** Radix UI + shadcn/ui + Tailwind CSS v4
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Auth:** Better Auth (client-side)
- **Real-time Data:** Convex (React hooks)

### Backend
- **Platform:** Convex (serverless backend with real-time subscriptions)
- **Authentication:** Better Auth via `@convex-dev/better-auth`
- **RAG (Retrieval-Augmented Generation):** `@convex-dev/rag` for Louisiana Student Standards and Louisiana Educator Rubric
- **AI Agents:** `@convex-dev/agent` for conversational prompt coaching
- **Workflows:** `@convex-dev/workflow` for multi-step processes (e.g., Alignment Scorecard)
- **Rate Limiting:** `@convex-dev/rate-limiter` for API call management
- **Email:** `@convex-dev/resend` for transactional emails
- **AI Models:** OpenAI (GPT-4o, text-embedding-3-small) via `@ai-sdk/openai`

## Architecture Overview

### Directory Structure

```
convex/           # Convex backend (serverless functions)
├── tests/        # Backend tests using convex-test
├── schema.ts     # Database schema definitions
├── rag.ts        # RAG initialization (Louisiana standards & rubric)
├── workflows.ts  # Workflow manager configuration
├── promptCoach.ts # Conversational AI coach
├── alignmentScorecard.ts # Alignment workflow entry points
├── alignmentSteps.ts # Workflow step definitions
├── frameworks.ts # ✅ Framework CRUD (READY TO SHIP)
├── innovations.ts # ✅ Innovations CRUD (READY TO SHIP)
├── testimonials.ts # ✅ Testimonials CRUD (READY TO SHIP)
├── seedFrameworks.ts # ✅ Seed 10 frameworks (RUN THIS)
└── *.ts          # Other backend functions

src/              # React frontend
├── components/   # UI components
│   ├── alignment/ # ⏳ Alignment Scorecard (Week 2-3)
│   ├── coach/     # ⏳ Conversational Coach (Week 2-3)
│   ├── community/ # 🟡 Innovations + Testimonials (Week 1-2)
│   ├── framework/ # ✅ Framework Library (READY TO SHIP)
│   ├── dashboard/ # ⚠️ Needs simplification for beta
│   ├── shared/    # Shared components
│   └── ui/        # shadcn/ui components
├── App.tsx       # Root component with routing
└── main.tsx      # Application entry point

knowledge/        # Louisiana education data (markdown source files)
├── schemas/      # JSON schemas for data validation
├── la-ela.md     # Louisiana ELA standards
├── la-math.md    # Louisiana Math standards
└── la-ler-rubric.md # Louisiana Educator Rubric

docs/             # Technical documentation
└── RAG_PLAN.md   # RAG implementation plan (Phase 2-3, NOT Week 1)
```

### Convex Backend Architecture

Convex uses three function types:

1. **Queries** (`query`): Read-only, real-time subscriptions, cached, deterministic
   - Use for: Fetching data, listing records, searching
   - Example: `getConversation`, `listConversations`

2. **Mutations** (`mutation`): Write operations, real-time updates, deterministic
   - Use for: Creating/updating/deleting records
   - Example: `startConversation`, `savePrompt`

3. **Actions** (`action`): Non-deterministic operations (API calls, AI, external services)
   - Use for: LLM calls, embeddings, RAG search, external APIs
   - Example: `analyzeContentAlignment`, `sendMessage`

**Internal functions** (prefixed with `internal`): Only callable from backend, not exposed to frontend.

### Key Architectural Patterns

1. **RAG Integration**: All Louisiana Student Standards and Educator Rubric data is embedded in Convex RAG
   - See `convex/rag.ts` for RAG initialization (6 filters: contentType, subject, gradeLevel, standardCode, cognitiveDepth, userId)
   - See `docs/RAG_PLAN.md` for comprehensive RAG architecture and implementation plan
   - **CRITICAL**: RAG filters are OR-ed together; use composite filters for AND operations (see RAG_PLAN.md Technical Constraints)
   - **NOT NEEDED FOR WEEK 1 BETA** - Defer to Phase 2

2. **Workflow System**: Multi-step processes use `@convex-dev/workflow`
   - Example: Alignment Scorecard workflow (`convex/alignmentSteps.ts`)
   - Steps: retrieve standards → analyze with agent → generate scorecard
   - Workflows provide retry logic, backoff, and durability
   - **NOT NEEDED FOR WEEK 1 BETA** - Frameworks provide immediate value

3. **AI Agent Integration**: Conversational coach uses `@convex-dev/agent`
   - Stateful chat threads with system prompts
   - Louisiana-specific context (see `PELICAN_SYSTEM_PROMPT` in `convex/promptCoach.ts`)
   - **NOT NEEDED FOR WEEK 1 BETA** - Ship in Week 2-3

4. **Authentication**: Better Auth integration
   - User sessions managed by `@convex-dev/better-auth`
   - Helper function: `authComponent.getAuthUser(ctx)` returns authenticated user or null
   - User profiles extended in `userProfiles` table

## Common Development Commands

### Development
```bash
# Start both frontend and backend development servers
pnpm dev

# Start only frontend (Vite dev server with auto-open browser)
pnpm dev:frontend

# Start only backend (Convex dev server)
pnpm dev:backend
```

### Seeding Data (IMPORTANT FOR WEEK 1)
```bash
# Seed 10 initial frameworks for beta launch
pnpm convex run seedFrameworks:seedInitialFrameworks

# This populates the frameworks table with production-ready content
```

### Building
```bash
# Production build (includes TypeScript checks, lint, and Convex validation)
pnpm build

# This runs: tsc (frontend) → tsc (backend) → convex dev --once → vite build
```

### Testing
```bash
# Run all backend tests (Vitest with convex-test, edge-runtime environment)
pnpm test

# Run tests once (no watch mode)
pnpm test:once

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run single test file
pnpm test convex/tests/alignmentScorecard.test.ts

# Debug tests with inspector
pnpm test:debug

# E2E browser tests (Playwright)
pnpm test:e2e
pnpm test:e2e:watch
pnpm test:e2e:ui
```

### Linting
```bash
# TypeScript type checking (frontend + backend) + Convex validation + production build
pnpm lint
```

## Testing Architecture

### Backend Tests (Convex)

**Framework:** Vitest with `convex-test` for in-memory Convex simulation

**Environment:** `edge-runtime` (required for Convex backend tests)

**Location:** `convex/tests/**/*.test.ts`

**Key Patterns:**

1. **Test Setup:**
```typescript
import { convexTest } from "convex-test";
import { describe, it, expect, beforeEach } from "vitest";
import schema from "../schema";
import { api, internal } from "../_generated/api";

describe("FeatureName", () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(() => {
    t = convexTest(schema, import.meta.url);
  });

  it("should do something", async () => {
    const result = await t.query(api.module.functionName, { args });
    expect(result).toEqual(expected);
  });
});
```

2. **Authenticated Tests:**
```typescript
// Mock Better Auth user
const user = await t.mutation(internal.testHelpers.createTestUser, {
  email: "test@example.com",
  name: "Test User",
});

// Set auth context for subsequent calls
t.withIdentity({ subject: user._id });
```

3. **Async Workflows:**
```typescript
// Test workflow steps (use `t.runUntil()` for async operations)
const workflowId = await t.action(api.module.startWorkflow, { args });
await t.runUntil(async () => {
  const status = await t.query(api.module.getStatus, { workflowId });
  return status.completed;
});
```

**Important:** Integration tests that require real Convex deployment (RAG searches, LLM calls) should be marked as skipped with `.skip` and documented why they require real deployment.

### E2E Tests (Browser)

**Framework:** Vitest Browser Mode with Playwright

**Location:** Tests use `vitest.browser.config.mts`

**Run:** `pnpm test:e2e`

## Workflow System

### Workflow Manager Configuration

Located in `convex/workflows.ts`:

```typescript
export const workflow = new WorkflowManager(components.workflow, {
  workpoolOptions: {
    maxParallelism: 10,
    defaultRetryBehavior: {
      maxAttempts: 3,
      initialBackoffMs: 1000,
      base: 2, // Exponential backoff
    },
  },
});
```

### Creating a Workflow

1. **Define workflow steps** (in dedicated file, e.g., `convex/alignmentSteps.ts`):
```typescript
import { workflow } from "./workflows";

export const myWorkflow = workflow.define({
  args: v.object({
    userId: v.string(),
    // ... other args
  }),
  handler: async (step, args) => {
    // Step 1: Run a query
    const data = await step.runQuery(internal.module.getData, { args });

    // Step 2: Run an action (AI call, external API)
    const result = await step.runAction(internal.module.processData, { data });

    // Step 3: Save results
    await step.runMutation(internal.module.saveResults, { result });

    return { completed: true };
  },
});
```

2. **Start workflow from public action:**
```typescript
export const startMyWorkflow = action({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    const workflowId = await workflow.start(
      ctx,
      internal.module.myWorkflow,
      args
    );
    return { workflowId };
  },
});
```

3. **Query workflow status:**
```typescript
export const getStatus = query({
  args: { workflowId: v.string() },
  handler: async (ctx, args) => {
    return await workflow.status(ctx, args.workflowId as any);
  },
});
```

### Workflow Best Practices

- Use `step.runQuery`, `step.runMutation`, `step.runAction` for all operations
- Keep steps small and idempotent
- Use retry configuration for transient failures
- Workflows are deterministic - no `fetch()` or `Math.random()` directly in handler
- For long-running workflows, use `workflow.cleanup()` to manage state

## RAG (Retrieval-Augmented Generation)

**⚠️ NOT NEEDED FOR WEEK 1 BETA LAUNCH**

**CRITICAL:** Read `docs/RAG_PLAN.md` before working on RAG features. This is the comprehensive technical plan for Louisiana Student Standards and Louisiana Educator Rubric integration.

### RAG Instance

Initialized in `convex/rag.ts` and exported for use across backend:

```typescript
import { rag } from "./rag";
```

**Filters (6 total):**
- `contentType`: "louisiana_standard", "framework", "user_content"
- `subject`: "ela", "math", "science", "social_studies"
- `gradeLevel`: "K", "1", "2", ..., "12"
- `standardCode`: Parsed standard identifier (e.g., "RL.3.1")
- `cognitiveDepth`: "recall", "application", "synthesis"
- `userId`: For user-specific content

**IMPORTANT:** Filters are OR-ed together. For AND operations, use composite filter values or post-filtering in actions.

### Searching RAG

```typescript
const results = await rag.search(ctx, query, {
  filters: {
    subject: "ela",
    gradeLevel: "3",
  },
  limit: 10,
});
```

See `convex/ragService.ts` for search helper functions.

### Adding to RAG

**For bulk ingestion, use Workflows** (see `docs/RAG_PLAN.md` Phase 1 for LSS standards ingestion plan):

```typescript
await rag.add(ctx, {
  namespace: "louisiana_standards",
  text: standardText,
  metadata: {
    contentType: "louisiana_standard",
    subject: "ela",
    gradeLevel: "3",
    standardCode: "RL.3.1",
  },
});
```

### RAG Status

- **Phase 0:** ✅ COMPLETE - RAG consolidation (single instance)
- **Phase 1:** 🟡 IN PROGRESS - LSS standards JSON conversion and ingestion
- **Phase 2:** ⏳ PENDING - Louisiana Educator Rubric integration
- **Phase 3:** ⏳ PENDING - RAG service extensions and workflow updates

**Decision:** Defer RAG work until Week 2-3. Framework library provides immediate value without RAG dependency.

See `docs/RAG_PLAN.md` for detailed implementation plan and rubric integration requirements.

## Code Conventions

### TypeScript
- **Strict mode:** No `any` types (use `unknown` and type guards if needed)
- **Zod validation:** All user inputs validated with Zod schemas
- **Convex validators:** Use `v.*` from `convex/values` for function arguments

### Component Structure
- **Function components:** Use function declarations, not arrow functions
- **Hooks:** Custom hooks prefixed with `use`
- **Props:** Destructure in function signature
- **Types:** Define inline or in separate `types.ts` files

### File Naming
- **Components:** PascalCase (`AlignmentScorecard.tsx`)
- **Backend functions:** camelCase (`alignmentSteps.ts`)
- **Tests:** Match source file with `.test.ts` suffix

### Import Order
1. External dependencies (React, Convex)
2. Internal modules (components, utils)
3. Relative imports
4. Types (if separate)

### Documentation
- **JSDoc comments:** For all exported functions and complex logic
- **Inline comments:** Explain "why", not "what"
- **Schema documentation:** Document tables and fields in `convex/schema.ts`

## Louisiana-Specific Context

### Louisiana Educator Rubric (LER)

The platform's core differentiator is rubric integration. All features must be **rubric-infused**, not just rubric-aligned.

**Four Domains:**
1. **Instruction Domain** (12 indicators): Standards and Objectives, Motivating Students, Presenting Instructional Content, etc.
2. **Planning Domain** (3 indicators): Instructional Plans, Student Work, Assessment
3. **Environment Domain** (4 indicators): Expectations, Engaging Students, Physical Environment, Respectful Conditions
4. **Professionalism Domain** (4 indicators): Professional Growth, Reflection, School Involvement, Fulfillment of Responsibilities

**Performance Levels:** Each indicator has descriptors for Unsatisfactory (Level 1), Proficient (Level 3), and Exemplary (Level 5).

**Integration in Seeded Frameworks:** The 10 seeded frameworks in `convex/seedFrameworks.ts` already include LER context via `formatLERContext()` function. This provides Louisiana-specific definitions without needing RAG.

See `knowledge/la-ler-rubric.md` for full rubric text.

### Louisiana Student Standards (LSS)

**Subjects:**
- ELA (English Language Arts): RL (Reading Literature), RI (Reading Informational), W (Writing), etc.
- Math: NBT (Number & Operations), OA (Operations & Algebraic Thinking), etc.
- Science, Social Studies

**Format Examples:**
- ELA: `RL.3.1` (Reading Literature, Grade 3, Standard 1)
- Math: `3.NBT.A.1` (Grade 3, Number & Operations in Base Ten, Cluster A, Standard 1)

See `knowledge/` folder for complete standards markdown files.

## Environment Variables

Required environment variables (configured in Convex dashboard):

- `OPENAI_API_KEY`: OpenAI API key for embeddings and GPT-4o
- `RESEND_API_KEY`: Resend API key for transactional emails
- Better Auth environment variables (configured via `convex/auth.config.ts`)

## Database Schema

See `convex/schema.ts` for complete schema definitions.

**Key Tables (Ready to Ship):**
- `betaSignups`: Beta program signups (landing page form) ✅
- `userProfiles`: User profile extensions (Louisiana educator-specific) ✅
- `frameworks`: AI guidance frameworks (library content) ✅
- `frameworkUsage`: Framework usage tracking ✅
- `timeTracking`: Time savings tracking ✅
- `innovations`: Community innovations ✅
- `testimonials`: User testimonials ✅

**Tables for Week 2-3:**
- `promptConversations`: Chat history for Conversational Coach
- `generatedPrompts`: Saved prompts from conversations
- `alignmentAnalyses`: Alignment Scorecard results

**Auto-managed by components:**
- Better Auth: `user`, `session`, `account`, `verification`
- RAG: `documents`, `chatMessages`, `feedbackSessions`, `auditLogs`

## Development Workflow

### Week 1 Beta Launch Workflow

1. **Simplify Dashboard** (2-3 hours)
   - Create simplified version for beta users
   - Hide stats for features not yet live
   - Focus on "Browse Frameworks" primary action

2. **Connect Innovations UI** (1-2 hours)
   - Add `/community` or `/innovations` route
   - Wire up InnovationForm and InnovationList
   - Test create/list/like functionality

3. **Add Testimonial Submission** (2-3 hours)
   - Create testimonial submission modal or page
   - Connect TestimonialForm to backend
   - Add to navigation

4. **Simple Onboarding** (2-3 hours)
   - Welcome modal on first login
   - Guided profile completion
   - Navigate to Framework Library with tooltip

5. **Test End-to-End** (1 hour)
   - Complete user journey: signup → profile → frameworks → save → copy
   - Verify seed data loaded
   - Check all CRUD operations

**Total Estimated Time: 8-12 hours** (1-2 days)

### Adding a New Feature (Post-Beta)

1. **Backend first:**
   - Define schema in `convex/schema.ts` (if new tables needed)
   - Write queries/mutations/actions in `convex/`
   - Write tests in `convex/tests/`
   - Run `pnpm test` to verify

2. **Frontend integration:**
   - Create components in `src/components/`
   - Use Convex React hooks (`useQuery`, `useMutation`, `useAction`)
   - Style with Tailwind CSS and shadcn/ui components

3. **Testing:**
   - Backend: `pnpm test`
   - E2E: `pnpm test:e2e`
   - Lint: `pnpm lint`

### Working with RAG (Phase 2-3, NOT Week 1)

**ALWAYS read `docs/RAG_PLAN.md` first.** This document contains:
- Current implementation status
- Technical constraints (filter limits, vector search limits, rate limiting)
- Phased implementation plan
- Rubric integration requirements
- Workflow-based ingestion patterns

**Key points:**
- RAG filters are OR-ed; use composite filters for AND operations
- 256 results max per search (design queries to narrow search efficiently)
- Bulk ingestion must use Workflows + Rate Limiter (not plain actions)
- Embedding calls should integrate Rate Limiter with `reserve: true`
- LER integration requires preserving exact rubric language in embeddings

### Git Workflow

- Main branch: `main`
- Feature branches: Descriptive names (e.g., `feature/simplify-dashboard-beta`)
- Commit messages: Descriptive, present tense (e.g., "Simplify dashboard for beta launch")
- Pull requests: Reference related issues, include testing notes

## Performance Considerations

### Frontend
- Code splitting via Vite manual chunks (see `vite.config.ts`)
- Lazy loading routes with React.lazy
- Optimistic UI updates with Convex mutations
- Memoization for expensive computations

### Backend
- RAG search results cached at query level
- Rate limiting for external API calls (OpenAI, etc.)
- Workflow parallelism configured (max 10 concurrent)
- Database indexes on frequently queried fields

## Known Issues & Limitations

### Week 1 Launch Blockers (MUST FIX)
1. **Dashboard Complexity:** Too overwhelming for beta users
2. **Missing Routes:** Innovations and testimonials not in navigation
3. **No Onboarding:** Users don't know what to do after signup
4. **Seed Data:** May not be loaded yet (run `pnpm convex run seedFrameworks:seedInitialFrameworks`)

### Not Blocking Week 1 (Defer to Later)
1. **RAG Data Population:** LSS standards and LER rubric not yet populated (Phase 1-2 of RAG_PLAN.md)
2. **Alignment Scorecard:** Works with test data only; needs real standards for production
3. **Conversational Coach:** Backend ready, UI in development

See `docs/RAG_PLAN.md` for complete RAG status and blocking issues.

## Additional Resources

- **Product Vision:** `VISION.md` - Complete product strategy and beta testing plan (**READ THIS FIRST**)
- **RAG Implementation Plan:** `docs/RAG_PLAN.md` - Comprehensive technical plan for RAG integration (Phase 2-3, not Week 1)
- **UX Audit:** `docs/UX_AUDIT.md` - User experience decisions and design patterns
- **Convex Documentation:** https://docs.convex.dev
- **Better Auth:** https://www.better-auth.com
- **shadcn/ui:** https://ui.shadcn.com

---

## Quick Reference: What's Ready vs. What's Not

| Feature | Backend | UI | Status | Week 1? |
|---------|---------|-----|---------|---------|
| Framework Library | ✅ | ✅ | READY TO SHIP | ✅ YES |
| User Profiles | ✅ | ✅ | READY TO SHIP | ✅ YES |
| Time Tracking | ✅ | ✅ | READY TO SHIP | ✅ YES |
| Innovations | ✅ | 🟡 Needs routing | ALMOST READY | 🟡 WEEK 1-2 |
| Testimonials | ✅ | 🟡 Needs submission flow | ALMOST READY | 🟡 WEEK 1-2 |
| Dashboard | ✅ | ⚠️ Too complex | NEEDS SIMPLIFICATION | ⚠️ REFACTOR |
| Conversational Coach | ✅ | 🟡 Needs integration | WEEK 2-3 | ❌ NO |
| Alignment Scorecard | 🟡 No data | 🟡 Blocked by RAG | WEEK 2-3 | ❌ NO |
| RAG System | 🟡 Infrastructure only | N/A | PHASE 2-3 | ❌ NO |

**Legend:**
- ✅ Complete and tested
- 🟡 Partial implementation
- ⚠️ Needs changes
- ❌ Not ready for Week 1
