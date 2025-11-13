# Pelican AI - Technical Architecture

**Last Updated:** November 11, 2025  
**Status:** Minimal Reference

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Convex (real-time database + serverless functions)
- **Authentication:** Better Auth (@convex-dev/better-auth)
- **Email:** Resend API
- **AI/ML:** OpenAI (GPT-4o, text-embedding-3-small), Convex RAG, Convex Agent, Convex Workflows
- **Design:** Louisiana-branded, WCAG 2.1 AA compliant, mobile-first

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  React 19 + TypeScript + Tailwind CSS + shadcn/ui          │
│  Mobile-First, WCAG 2.1 AA Compliant                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Convex React Hooks
                      │ (useQuery, useMutation, useAction)
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                     CONVEX BACKEND LAYER                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Queries    │  │  Mutations   │  │   Actions    │     │
│  │ (read-only)  │  │   (writes)   │  │  (external)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Real-Time Database                       │  │
│  │  betaSignups, userProfiles, frameworks, innovations  │  │
│  │  testimonials, betaProgram, timeTracking,            │  │
│  │  alignmentAnalyses, etc.                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              RAG System (Vector Search)               │  │
│  │  Louisiana Standards, Policies, User Content          │  │
│  │  Semantic search with metadata filtering              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Workflows (Multi-Step Processes)        │  │
│  │  Alignment Scorecard Analysis                        │  │
│  │  Retry logic, parallelism, status tracking            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Scheduled Jobs (Cron)                    │  │
│  │  Weekly Prompt Dispatch (Monday 6am CT)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ External API Calls
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Better Auth  │  │    Resend    │  │   OpenAI     │     │
│  │ (Sessions)   │  │   (Email)    │  │ (GPT-4o,     │     │
│  └──────────────┘  └──────────────┘  │ Embeddings)  │     │
│                                       └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

**Source of Truth:** `convex/schema.ts`

Convex automatically generates API contracts from the schema. See the schema file for complete documentation, indexes, and field definitions.

**Key Tables:**
- `betaSignups` - Beta tester recruitment and approval
- `userProfiles` - Extended educator data (includes role-based permissions)
- `frameworks` - AI guidance frameworks with Louisiana standards
- `frameworkUsage` - User interaction tracking
- `innovations` - Community-shared teaching innovations
- `testimonials` - User feedback and success stories
- `betaProgram` - Beta program participation and progress
- `timeTracking` - Time savings analytics
- `alignmentAnalyses` - Alignment Scorecard analysis results

**Key Systems:**
- **RAG (Retrieval-Augmented Generation):** Vector search for Louisiana Standards, policies, and content
- **Workflows:** Multi-step processes (e.g., Alignment Scorecard analysis) with retry logic
- **Rate Limiting:** Tiered rate limits by user role (teacher/coach/admin)
- **Authorization:** Role-based access control with migration support

---

## Deployment Environments

**Development:** `kindly-setter.convex.cloud`  
- Used for local development and testing
- Auto-sync with local code via `npx convex dev`

**Production:** `outgoing-parttridge.convex.cloud`  
- Live production environment
- Deployed via `npx convex deploy`

---

## Key Components

### RAG System
- **Namespace:** `louisiana_standards` - Louisiana Student Standards
- **Filters:** contentType, subject, gradeLevel, standardCode, cognitiveDepth
- **Embedding Model:** OpenAI text-embedding-3-small (1536 dimensions)
- **Service:** `convex/ragService.ts` - Centralized RAG operations with caching and rate limiting

### Workflow System
- **Manager:** `convex/workflows.ts` - WorkflowManager configuration
- **Alignment Scorecard:** `convex/alignmentScorecard.ts` - Multi-step content analysis workflow
- **Steps:** `convex/alignmentSteps.ts` - Individual workflow step implementations
- **Features:** Retry logic, parallelism (max 10), status tracking

### Authorization & Rate Limiting
- **Authorization:** `convex/authorization.ts` - Role-based access helpers
- **Rate Limiting:** `convex/rateLimiting.ts` - Tiered limits by user role
- **Roles:** teacher (standard), coach (elevated), admin (unlimited)

## Further Reading

- **Convex Documentation:** https://docs.convex.dev
- **Convex RAG:** https://docs.convex.dev/rag
- **Convex Workflows:** https://docs.convex.dev/workflows
- **Convex Agent:** https://docs.convex.dev/agent
- **Better Auth:** https://www.better-auth.com/docs
- **React 19:** https://react.dev
- **Convex Schema:** `convex/schema.ts` (source of truth for API contracts)

---

*This document provides minimal architecture reference. For detailed API contracts, see `convex/schema.ts`. For testing, see `docs/TESTING.md`. For Alignment Scorecard testing, see `docs/TESTING_ALIGNMENT_SCORECARD.md`.*
