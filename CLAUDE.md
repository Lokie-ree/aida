# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Pelican AI?

Pelican AI is an intelligent coaching assistant for Louisiana K-12 educators that generates high-quality, Louisiana-aligned prompts for use in ANY AI tool (ChatGPT, Claude, Gemini, etc.). It is NOT a content generator—it creates prompts that teachers copy/paste into their preferred AI tool.

**Core Product**: Conversational Prompt Coach at `/coach`

**Decision Filter**: "Does this help a Louisiana teacher get a better, more aligned prompt faster?" If no → cut it.

## Commands

```bash
# Development (runs frontend + backend in parallel)
pnpm dev

# Run separately
pnpm dev:frontend    # Vite dev server
pnpm dev:backend     # Convex dev server

# Testing
pnpm test            # Backend tests (watch mode)
pnpm test:once       # Backend tests (single run)
pnpm test convex/tests/specificFile.test.ts  # Single test file
pnpm test:e2e        # E2E tests with Playwright

# Build & Lint
pnpm build           # Production build
pnpm lint            # TypeScript checks + Convex validation + build
```

## Architecture

### Tech Stack
- **Frontend**: React 19 + Vite 6 + React Router v7 + Tailwind CSS v4 + shadcn/ui
- **Backend**: Convex (serverless functions, real-time database)
- **Auth**: Better Auth with magic link via Resend
- **AI**: OpenAI GPT-5.1-2025-11-13 + RAG via @convex-dev/rag + @convex-dev/agent

### Key Directories
```
convex/              # Backend: queries, mutations, actions, schema
├── promptCoach.ts   # CORE: AI coach logic and system prompt
├── schema.ts        # Database schema
├── rag.ts           # RAG initialization
└── tests/           # Backend unit tests

src/
├── components/
│   ├── coach/       # CORE: ChatInterface, PromptLibrary
│   ├── layout/      # AuthenticatedLayout, AppSidebar, MobileHeader
│   ├── shared/      # Shared components (dialogs, Logo, etc.)
│   └── ui/          # shadcn/ui components
├── pages/           # Page components (CoachPage, PromptsPage, ProfilePage)
├── lib/             # Utilities (auth-client, form-schemas, etc.)
└── App.tsx          # Root routing

knowledge/           # Louisiana education data (JSON for RAG ingestion)
```

### Data Flow Pattern
```typescript
// Frontend: real-time subscriptions
const data = useQuery(api.module.queryName, { args });
const mutate = useMutation(api.module.mutationName);

// Backend: Convex functions
export const myQuery = query({ args: {...}, handler: async (ctx, args) => {...} });
export const myMutation = mutation({ args: {...}, handler: async (ctx, args) => {...} });
export const myAction = action({ args: {...}, handler: async (ctx, args) => {...} });
```

### RAG Namespaces
- `louisiana_standards_ela`, `louisiana_standards_math`, etc. — Louisiana Student Standards
- `louisiana_rubric_instruction`, `louisiana_rubric_planning`, etc. — LER indicators by domain

## Louisiana Education Context

### LER Short Codes (Louisiana Educator Rubric)
The coach references these naturally in conversation:
- **Instruction**: SO, MS, PIC, LS, ACT, QU, FEED, GRP, TCK, TKS, TH, PS
- **Planning**: IP, SW, AS
- **Environment**: ES, ESMB, ENV, RC
- **Professionalism**: GDP, RT, SI, SR

### Critical Rules for the Prompt Coach
1. **NEVER generate lesson plans, worksheets, or materials**—only generate prompts
2. **NEVER ask clarifying questions before the first prompt**—generate immediately with smart defaults
3. **Always match standards to grade level** (never assign high school standards to middle school)
4. **Use EXACT rubric language** from retrieved RAG context, not paraphrases
5. **Keep output under 400 tokens**—prompt block + one follow-up line only
6. **Teacher-to-teacher voice**—collegial, not corporate EdTech

## Auth Pattern

```typescript
// Client-side protection
<Authenticated>Protected content</Authenticated>
<Unauthenticated>Landing page</Unauthenticated>

// Backend auth check
const user = await authComponent.getAuthUser(ctx);
if (!user) throw new Error("Not authenticated");
```

## Layout Pattern

All authenticated routes use `AuthenticatedLayout` which provides:
- Desktop: Persistent sidebar with navigation, Recent Sessions, and profile actions
- Mobile: Header with hamburger menu (aligned with sidebar structure)
- Routes: `/coach`, `/coach/:conversationId`, `/prompts`, `/profile`

## Testing Notes

- Backend tests use Vitest with edge-runtime environment
- E2E tests use Vitest Browser with Playwright
- Test helpers in `tests/test-helpers.ts` and `tests/e2e/helpers/`
