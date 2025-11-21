# CLAUDE.md - AI Assistant Guide for Pelican AI

**Last Updated:** November 21, 2025
**Version:** 3.0.0
**Status:** Production Ready - Streamlined Documentation

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

const identity = await requireAuth(ctx);
const userId = identity.subject;
```

**In React Components:**
```typescript
import { useSession } from "@/lib/auth-client";

const { data: session } = useSession();
const userId = session?.user?.id;
```

### Authorization

```typescript
// Require authentication
await requireAuth(ctx);

// Require specific role
await requireRole(ctx, "admin");

// Require admin
await requireAdmin(ctx);
```

### Rate Limiting

```typescript
await checkRateLimit(ctx, userId, "aiGeneration");
// Types: "aiGeneration", "ragQuery", "emailSend"
// Limits vary by role: teacher (10/min), coach (20/min), admin (100/min)
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

### 3. Community Features
Fully implemented and available for testing:
- `src/components/community/` - Innovation sharing and testimonials
- Navigation menu - Community features accessible
- Gathering feedback from early users

### 4. Platform-Agnostic Approach
**CRITICAL:** Frameworks must work with ANY AI tool (ChatGPT, Gemini, Claude, MagicSchool AI, etc.). No vendor lock-in.

### 5. Louisiana Standards Alignment
All content aligns with Louisiana Student Standards (LSS) and Louisiana Educator Rubric (LER) across ELA, Math, Science, Social Studies for K-12.

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
- `testimonials` - User feedback and success stories

### Auto-Managed Tables (via Convex Components)
- `user`, `session`, `account`, `verification` - Better Auth

**DO NOT define these in schema.ts** - managed by Convex components.

---

## Quick Reference

### Essential Commands
```bash
# Development
pnpm dev                    # Start frontend + backend
pnpm test:once              # Run unit tests
pnpm test:coverage          # Generate coverage report

# Database
npx convex dashboard        # Open Convex dashboard
npx convex deploy           # Deploy to production
npx convex env set KEY val  # Set environment variable

# Linting
pnpm lint                   # Full lint + type check
```

### Important Files
- `convex/schema.ts` - Database schema (source of truth)
- `convex/authorization.ts` - Auth helpers (requireAuth, requireRole)
- `convex/rateLimiting.ts` - Rate limit configuration
- `src/lib/auth-client.ts` - Better Auth client
- `src/App.tsx` - Routing configuration
- `PROJECT.md` - Project vision and context

### Key Concepts
- **Convex Reactivity:** Queries auto-update when data changes
- **Better Auth:** Session-based authentication
- **Role-Based Access:** teacher, coach, admin roles
- **FERPA Compliance:** No PII in logs
- **Platform-Agnostic:** Works with ANY AI tool
- **Louisiana-Aligned:** LSS and LER standards

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

**Last Updated:** November 21, 2025
**Maintained by:** Pelican AI Development Team
**Version:** 3.0.0 - Streamlined for efficiency
