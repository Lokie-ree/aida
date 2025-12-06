# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** December 3, 2025 (Beta launch preparation complete)
**Major Change:** Conversational Prompt Coach optimized for STEM beta testers with LER short code integration

## Project Overview

**Pelican AI** is an intelligent coaching assistant for Louisiana K-12 educators, helping them generate high-quality, Louisiana-aligned prompts for use in any AI tool (ChatGPT, Claude, Gemini, etc.). The platform is built specifically for Louisiana educators navigating LEADS evaluations and the Louisiana Educator Rubric.

**Core Mission:** Platform-agnostic guidance that improves teaching practice through Louisiana-specific alignment, not just generic AI assistance.

**CRITICAL PRODUCT VISION:** Per recent refocus (see `VISION.md` and recent commits), the **Conversational Prompt Coach** is the PRIMARY product experience, not the framework library. The beta focuses on testing whether the conversational coaching experience feels intelligent and Louisiana-specific.

See `VISION.md` for complete product vision and strategic context.

---

## 🚀 CURRENT PRODUCT STATUS (Post-Refocus)

### ✅ CORE PRODUCT: Conversational Prompt Coach

**Status:** ✅ IMPLEMENTED AND LIVE
- **Backend:** `convex/promptCoach.ts` - Full implementation with Agent integration ✅
- **UI:** `src/components/coach/PromptCoach.tsx` - Chat interface complete ✅
- **Route:** `/coach` - Active in `src/App.tsx` ✅
- **RAG Integration:** Louisiana standards and rubric embedded ✅
- **System Prompt:** Louisiana-specific teacher-to-teacher voice configured ✅

**What It Does:**
1. Conversational chat interface where teachers describe what they're teaching
2. AI asks clarifying questions (like a colleague, not a form)
3. Generates Louisiana-aligned prompts teachers can copy/paste into ChatGPT, Claude, Gemini, etc.
4. Saves successful prompts to user's library
5. Feedback loop for refinement

**This is the product.** Everything else supports this core experience.

### ✅ SUPPORTING FEATURES (Ready to Ship)

**1. User Profiles** (`src/components/dashboard/ProfileSettings.tsx`)
- **Purpose:** Personalize coach recommendations based on grade/subject
- **Status:** ✅ Working - Backend + UI complete

**2. Generated Prompts Library** (via `convex/promptCoach.ts`)
- **Purpose:** Save and reuse prompts from coaching conversations
- **Status:** ✅ Working - Backend complete, integrated in coach UI

**3. Framework Library** (`src/components/framework/FrameworkLibrary.tsx`) - SECONDARY
- **Purpose:** Pre-built exemplar prompts from beta testing
- **Status:** ✅ Working but de-prioritized
- **Note:** Per VISION.md, this will be populated FROM successful beta conversations, not seeded upfront

### 🟡 FUTURE ENHANCEMENTS (Post-Beta)

**4. Community Features**
- Innovations sharing (`convex/innovations.ts` - backend ready)
- Testimonials (`convex/testimonials.ts` - backend ready)
- **Decision:** Add after beta validates core coaching experience

**5. Alignment Scorecard**
- Workflow-based standards alignment analysis
- **Decision:** Defer until RAG data fully populated

---

## 📋 DECEMBER BETA DEPLOYMENT (Dec 9-28, 2025)

### Beta Tester Profile

**5 Louisiana K-12 Educators:**
- Middle/high school science teacher
- Middle school math teacher
- Media specialist/library science
- STEM teacher
- Special education teacher

**Common Pain Points:**
- Internalizing curriculum resources (GLEs, Louisiana standards)
- Analyzing assessment data (LEAP, formative assessments)
- Identifying highly effective teacher/student actions from the Louisiana Educator Rubric
- Differentiation for IEP students
- Evidence collection for LEADS observations

**Critical Design Decision:** All UI elements, starter prompts, and system prompt examples are STEM/SPED-focused to match beta tester needs.

### Beta Success Criteria

**Primary Goal:** Validate that the conversational coaching experience feels intelligent and Louisiana-specific.

**Beta User Journey:**
1. Sign up → Complete profile (grade, subject, school)
2. Start conversation in Prompt Coach (`/coach`)
3. Generate 2-3 Louisiana-aligned prompts for real lessons
4. Use prompts in their preferred AI tool (ChatGPT, Claude, Gemini)
5. Provide feedback on prompt quality and coaching experience

**Success Metrics:**
- All 5 beta testers generate at least 2 prompts ✅
- 75%+ of prompts rated "helpful" (thumbs up) ✅
- At least 10 prompts marked "worked in my classroom" ✅
- Qualitative feedback confirms "intelligent coaching" feel ✅

### Pre-Launch Checklist

**Core Product:**
- [ ] Test `/coach` conversational interface end-to-end
- [ ] Verify RAG integration (Louisiana standards + rubric accessible)
- [ ] Confirm generated prompts are copy-pasteable
- [ ] Test prompt saving and library functionality
- [ ] Verify feedback mechanism (👍/👎 + comments)

**Supporting Features:**
- [ ] Test user profile creation/editing
- [ ] Verify profile data personalizes coach recommendations
- [ ] Test authentication flow (signup, login, logout)

**Technical:**
- [ ] Run `pnpm test` to ensure backend tests pass
- [ ] Run `pnpm lint` to check TypeScript/build issues
- [ ] Verify environment variables in Convex dashboard:
  - `OPENAI_API_KEY` (for GPT-4o and embeddings)
  - `RESEND_API_KEY` (for transactional emails)
  - Better Auth configuration
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)

### Post-Launch Monitoring

**Week 1 (Dec 9-14): Generation Phase**
- Monitor conversation starts (`promptConversations` table)
- Track prompts generated (`generatedPrompts` table)
- Collect feedback ratings and comments
- Identify patterns in clarifying questions

**Week 2 (Dec 15-21): Implementation Phase**
- Monitor "worked in classroom" flags
- Track refinement requests (users coming back to improve prompts)
- Identify high-quality prompts for exemplar library

**Week 3 (Dec 22-28): Refinement Phase**
- Curate 8-12 field-tested exemplars for Framework Library
- Analyze what makes prompts "high-quality"
- Plan post-beta improvements based on feedback

---

## 🎯 PRODUCT FOCUS: Conversation Over Configuration

**Remember VISION.md core principles:**
- **Conversation Over Configuration:** Natural dialogue, not forms and dropdowns
- **Louisiana-Specific Intelligence:** Every prompt demonstrates knowledge of LER, LSS, LEADS
- **Platform-Agnostic:** Works with ANY AI tool teachers already use
- **Teacher-to-Teacher Voice:** Authentic colleague, not corporate EdTech
- **Quality Over Speed:** Better prompts that improve practice, not just save time

**The product IS the conversation.** Everything else supports this core experience.

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
   - Stateful chat threads with Louisiana-specific system prompts
   - LER short codes (SO, TKS, PIC, etc.) used instead of numeric indicators for teacher familiarity
   - Multi-task recognition (lesson planning, assessment analysis, curriculum internalization, LER evidence, etc.)
   - 4-phase coaching flow: Understand Task → Identify Challenge → Connect Frameworks → Generate Prompt
   - See `PELICAN_SYSTEM_PROMPT` in `convex/promptCoach.ts` for complete implementation
   - ✅ **LIVE AND READY FOR BETA**

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
const results = await rag.search(ctx, {
  namespace: "louisiana_standards",
  query: query,
  filters: [
    { name: "subject", value: "ela" },
    { name: "gradeLevel", value: "3" }
  ],
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
  filterValues: [
    { name: "contentType", value: "louisiana_standard" },
    { name: "subject", value: "ela" },
    { name: "gradeLevel", value: "3" },
    { name: "standardCode", value: "RL.3.1" }
  ],
  metadata: {
    // Optional: Additional non-searchable metadata
    importedAt: Date.now(),
    sourceFile: "la-ela.md"
  }
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

**LER Short Codes (CRITICAL - Always Use These):**
- **INSTRUCTION**: SO (Standards/Objectives), MS (Motivating Students), PIC (Presenting Instructional Content), LS (Lesson Structure/Pacing), ACT (Activities/Materials), QU (Questioning), FEED (Academic Feedback), GRP (Grouping Students), TCK (Teacher Content Knowledge), TKS (Teacher Knowledge of Students), TH (Thinking), PS (Problem Solving)
- **PLANNING**: IP (Instructional Plans), SW (Student Work), AS (Assessment)
- **ENVIRONMENT**: ES (Expectations), ESMB (Engaging Students/Managing Behavior), ENV (Environment), RC (Respectful Conditions)
- **PROFESSIONALISM**: GDP (Growing/Developing Professionally), RT (Reflecting on Teaching), SI (School Involvement), SR (School Responsibilities)

**Short Codes in Code**: Always reference indicators by short code (e.g., "SO - Standards and Objectives", "TKS - Teacher Knowledge of Students") instead of numeric identifiers (e.g., "Indicator 1.1", "Indicator 1.10"). Teachers are more familiar with short codes from LEADS observations.

**Integration in Seeded Frameworks:** The 10 seeded frameworks in `convex/seedFrameworks.ts` already include LER context via `formatLERContext()` function. This provides Louisiana-specific definitions without needing RAG.

See `knowledge/la-ler-rubric.md` for full rubric text and `knowledge/la-rubric-evaluation-handbook.json` for complete short code mappings.

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

### Working on the Conversational Coach

The Prompt Coach is the core product. When making changes:

1. **Backend (`convex/promptCoach.ts`):**
   - Agent integration via `@convex-dev/agent`
   - System prompt defines Louisiana-specific behavior
   - RAG search provides standards/rubric context
   - Conversation state stored in `promptConversations` table
   - Generated prompts saved to `generatedPrompts` table

2. **Frontend (`src/components/coach/PromptCoach.tsx`):**
   - Chat interface with message history
   - Real-time updates via Convex subscriptions
   - Prompt copy/save/feedback actions
   - Prompt library view

3. **Testing the Coach:**
   - Start conversation: Navigate to `/coach`
   - Test clarifying questions: Be vague, see if it asks good follow-ups
   - Verify Louisiana context: Prompts should mention LER indicators, LSS standards
   - Test prompt generation: Should be copy-pasteable, platform-agnostic
   - Test feedback: 👍/👎 buttons, "worked in classroom" flag

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

### Working with RAG

**Status:** RAG infrastructure is set up with Louisiana Student Standards and Louisiana Educator Rubric data.

**Location:** `convex/rag.ts` initializes the RAG instance with 6 filters:
- `contentType`: "louisiana_standard", "framework", "user_content"
- `subject`: "ela", "math", "science", "social_studies"
- `gradeLevel`: "K", "1", "2", ..., "12"
- `standardCode`: Standard identifier (e.g., "RL.3.1")
- `cognitiveDepth`: "recall", "application", "synthesis"
- `userId`: For user-specific content

**Usage in Prompt Coach:**
When generating prompts, the coach uses RAG to:
1. Search for relevant Louisiana standards based on grade/subject/topic
2. Retrieve LER indicator descriptions for alignment
3. Find exemplar prompts from previous successful conversations

**Key points:**
- RAG filters are OR-ed; use composite filters for AND operations
- 256 results max per search (design queries to narrow efficiently)
- Embeddings use OpenAI `text-embedding-3-small`
- LER language preserved exactly in embeddings for authenticity

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

### Current Status (Post-Refocus)
✅ **Conversational Coach:** Live and working
🚧 **RAG Integration:** Infrastructure ready, but data not yet ingested (see `docs/RAG_INGESTION_PLAN.md`)
✅ **User Profiles:** Working
✅ **Authentication:** Better Auth integrated

### Post-Beta Enhancements
🟡 **Community Features:** Backend ready, UI not connected
🟡 **Framework Library:** Can be populated from successful beta prompts
🟡 **Alignment Scorecard:** Deferred until needed

### Technical Constraints
- RAG search: 256 results max per query
- OpenAI rate limits: Monitor usage during beta
- Agent response time: GPT-4o can take 2-5 seconds for complex prompts

## Additional Resources

- **Product Vision:** `VISION.md` - Complete product strategy and beta testing plan (**READ THIS FIRST**)
- **Convex Documentation:** https://docs.convex.dev
- **Better Auth:** https://www.better-auth.com
- **shadcn/ui:** https://ui.shadcn.com
- **Convex Agent SDK:** https://github.com/get-convex/agent
- **Convex RAG:** https://github.com/get-convex/rag

---

## Quick Reference: What's Ready vs. What's Not

| Feature | Backend | UI | Status | Beta Launch? |
|---------|---------|-----|---------|--------------|
| **Conversational Coach** | ✅ | ✅ | **LIVE - CORE PRODUCT** | ✅ **YES** |
| User Profiles | ✅ | ✅ | READY | ✅ YES |
| Generated Prompts Library | ✅ | ✅ | READY | ✅ YES |
| RAG (Standards + Rubric) | ✅ | N/A | READY | ✅ YES |
| Framework Library | ✅ | ✅ | Secondary - populate from beta | 🟡 Later |
| Innovations | ✅ | 🟡 Needs routing | Post-beta | ❌ NO |
| Testimonials | ✅ | 🟡 Needs UI | Post-beta | ❌ NO |
| Alignment Scorecard | ✅ | ✅ | Deferred | ❌ NO |
| Time Tracking | ✅ | ✅ | Post-beta analytics | ❌ NO |

**Legend:**
- ✅ Complete and tested
- 🟡 Partial implementation
- ❌ Not for beta launch

---

## Critical Reminders

1. **The product IS the conversational coach.** Don't lose focus on this.
2. **Louisiana-specific intelligence is the differentiator.** Every generated prompt must demonstrate knowledge of LER, LSS, and LEADS.
3. **Platform-agnostic is essential.** Prompts work in ANY AI tool, not just ours.
4. **Teacher-to-teacher voice matters.** The conversation should feel like a colleague, not a chatbot.
5. **Quality over speed.** Better prompts that improve practice > faster prompts that save time.
