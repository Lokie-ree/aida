# Pelican AI - Technical Architecture

**Last Updated:** November 1, 2025  
**Status:** Minimal Reference

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Convex (real-time database + serverless functions)
- **Authentication:** Better Auth (@convex-dev/better-auth)
- **Email:** Resend API
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
│  │  testimonials, betaProgram, timeTracking, etc.       │  │
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
│  │ (Sessions)   │  │   (Email)    │  │    (RAG)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

**Source of Truth:** `convex/schema.ts`

Convex automatically generates API contracts from the schema. See the schema file for complete documentation, indexes, and field definitions.

**Key Tables:**
- `betaSignups` - Beta tester recruitment and approval
- `userProfiles` - Extended educator data
- `frameworks` - AI guidance frameworks with Louisiana standards
- `frameworkUsage` - User interaction tracking
- `innovations` - Community-shared teaching innovations
- `testimonials` - User feedback and success stories
- `betaProgram` - Beta program participation and progress
- `timeTracking` - Time savings analytics

---

## Deployment Environments

**Development:** `kindly-setter.convex.cloud`  
- Used for local development and testing
- Auto-sync with local code via `npx convex dev`

**Production:** `outgoing-parttridge.convex.cloud`  
- Live production environment
- Deployed via `npx convex deploy`

---

## Further Reading

- **Convex Documentation:** https://docs.convex.dev
- **Better Auth:** https://www.better-auth.com/docs
- **React 19:** https://react.dev
- **Convex Schema:** `convex/schema.ts` (source of truth for API contracts)

---

*This document provides minimal architecture reference. For detailed API contracts, see `convex/schema.ts`. For testing, see `docs/TESTING_PROTOCOL.md`.*
