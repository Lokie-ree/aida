# Pelican AI - Technical Architecture

**Last Updated:** October 20, 2025  
**Phase:** Phase 1 Complete → Phase 2 Transition  
**Status:** Production-ready backend, UI wiring in progress

---

## Overview

Pelican AI is a platform-agnostic AI guidance system for Louisiana educators. We provide **guidance, not tools** - helping educators use ANY AI platform effectively while maintaining Louisiana standards alignment and ethical guardrails.

### Core Principles

1. **Platform-Agnostic**: Works with MagicSchool AI, Brisk, SchoolAI, ChatGPT, Gemini - any tool
2. **Louisiana-First**: All frameworks aligned to Louisiana state standards
3. **Serverless-First**: Zero server management, auto-scaling, pay-per-use
4. **Type-Safe**: End-to-end TypeScript with Convex-generated types
5. **FERPA-Compliant**: Zero-trust security, no PII in logs, audit logging

---

## Tech Stack

### Frontend
```yaml
Framework: React 19 (concurrent features, automatic batching)
Build Tool: Vite (fast HMR, optimized builds)
Language: TypeScript (strict mode)
Styling: Tailwind CSS + design tokens
Components: shadcn/ui (accessible, customizable)
State: Convex React hooks (real-time, optimistic updates)
Routing: React Router v6 (Phase 2+)
```

### Backend
```yaml
Database: Convex (real-time, serverless)
Functions: Convex queries, mutations, actions
Scheduling: Convex cron jobs (weekly email dispatch)
Auth: Better Auth (@convex-dev/better-auth)
Email: Resend API (transactional, marketing)
AI: OpenAI API (RAG system - Phase 3+)
Voice: Vapi (@vapi-ai/web - Phase 3+)
Web Scraping: Firecrawl (@mendable/firecrawl-js - Phase 3+)
```

### Development Tools
```yaml
MCP Integration: Convex MCP, Playwright MCP, Semgrep MCP
Testing: Custom test suite (unit, integration, E2E, API)
AI Agents: Role-based agent system (.cursorrules)
Linting: ESLint + TypeScript compiler
Formatting: Prettier
```

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
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │     Vapi     │  │  Firecrawl   │                        │
│  │   (Voice)    │  │  (Scraping)  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

See `convex/schema.ts` for the full, self-documenting source of truth. Here's the high-level structure:

### Phase 1 Tables (Production Active)

**Authentication & Users** (Better Auth Managed)
- `user` - User accounts (email, name, verification status)
- `session` - Active sessions (tokens, expiration)
- `account` - OAuth accounts (future)
- `verification` - Email verification (future)

**Application Data**
- `betaSignups` - Beta tester recruitment and approval workflow
- `userProfiles` - Extended user data (school, subject, gradeLevel, district, role)

### Phase 2 Tables (Implemented, UI Not Fully Exposed)

**Content & Frameworks**
- `frameworks` - AI guidance frameworks with Louisiana standards
- `frameworkUsage` - User interaction tracking (views, copies, usage)
- `testimonials` - User feedback and success stories
- `innovations` - Community-shared teaching innovations
- `innovationInteractions` - Community engagement (likes, comments)

**Analytics & Tracking**
- `betaProgram` - Beta program participation and progress
- `timeTracking` - Time savings analytics

**RAG System** (Phase 3+ - Auto-managed by @convex-dev/rag)
- `documents` - Document embeddings for intelligent search
- `chatMessages` - Conversation history
- `feedbackSessions` - User feedback collection
- `auditLogs` - System audit trail for FERPA compliance

### Key Indexes

```typescript
// Beta Signups
.index("by_email", ["email"])
.index("by_status", ["status"])
.index("by_signup_date", ["signupDate"])

// Frameworks
.index("by_module", ["module"])
.index("by_category", ["category"])
.index("by_framework_id", ["frameworkId"])
.index("by_status", ["status"])
.index("search_content", ["title", "description", "tags"])

// User Profiles
.index("by_user", ["userId"])
.index("by_authId", ["authId"])

// Innovations
.index("by_user", ["userId"])
.index("by_created_at", ["createdAt"])
.index("search_innovations", ["title", "description", "tags"])
```

---

## Authentication System

**Architecture Decision:** Better Auth + Convex Integration (see ADR-004, ADR-008)

### Flow Overview

```
1. User signs up → Better Auth creates account
2. Auto-login → Session created automatically (ADR-008 fix)
3. Profile sync → userProfiles entry created via database trigger
4. Dashboard access → <Authenticated> component renders app
```

### Key Components

**Backend (`convex/auth.ts`)**
- `authComponent` - Better Auth instance with email/password provider
- `getCurrentUser()` - Query for current authenticated user
- HTTP routes registered via `convex/http.ts` with CORS support

**Frontend (`src/lib/auth-client.ts`)**
- `authClient` - Better Auth client with Convex plugins
- Session management with httpOnly cookies
- 30-day session duration with 24-hour refresh window

### Security Features

- **CORS-enabled** for cross-origin requests (fixed in ADR-011)
- **httpOnly cookies** prevent XSS attacks
- **CSRF protection** via Better Auth
- **Session expiration** with automatic refresh
- **FERPA-compliant logging** - no PII in logs

### Common Patterns

```typescript
// Check if user is authenticated (query)
const user = await ctx.runQuery(api.auth.getCurrentUser);
if (!user) throw new Error("User must be authenticated");

// Get user profile (mutation)
const profile = await ctx.db
  .query("userProfiles")
  .withIndex("by_authId", (q) => q.eq("authId", user.id))
  .unique();

// Create session (frontend)
const result = await authClient.signIn.email({
  email: "user@example.com",
  password: "password"
});
```

---

## Data Flow Patterns

### Real-Time Data Updates

Convex provides automatic real-time updates. When data changes, all subscribed clients receive updates immediately:

```typescript
// Frontend component automatically re-renders when data changes
const frameworks = useQuery(api.frameworks.getAllFrameworks);
```

### Optimistic Updates

```typescript
const createInnovation = useMutation(api.innovations.submitInnovation);

// Optimistic update: UI updates immediately, syncs in background
await createInnovation({
  title: "New Innovation",
  description: "...",
  // Convex handles rollback if mutation fails
});
```

### Scheduled Jobs (Cron)

```typescript
// Weekly prompt dispatch (Monday 6am Central Time)
crons.cron(
  "weekly-prompt-dispatch",
  "0 6 * * 1", // Cron expression
  internal.email.sendWeeklyPromptToAllUsers
);
```

---

## API Structure

### Function Organization

```
convex/
├── auth.ts              # Authentication queries
├── betaSignup.ts        # Beta signup workflow
├── userProfiles.ts      # User profile management
├── frameworks.ts        # Framework library (80+ functions)
├── innovations.ts       # Community innovations
├── testimonials.ts      # User testimonials
├── betaProgram.ts       # Beta program analytics
├── timeTracking.ts      # Time savings tracking
├── admin.ts             # Admin dashboard
├── email.ts             # Email automation
└── http.ts              # HTTP endpoints (Better Auth routes)
```

### Function Types

**Queries** (read-only, real-time)
```typescript
export const getAllFrameworks = query({
  args: {},
  returns: v.array(frameworkSchema),
  handler: async (ctx) => {
    return await ctx.db.query("frameworks").collect();
  }
});
```

**Mutations** (writes, transactional)
```typescript
export const recordFrameworkUsage = mutation({
  args: {
    frameworkId: v.id("frameworks"),
    action: v.union(v.literal("viewed"), v.literal("copied")),
    timeSaved: v.number()
  },
  returns: v.id("frameworkUsage"),
  handler: async (ctx, args) => {
    // Transactional write
    return await ctx.db.insert("frameworkUsage", { ...args, userId, timestamp });
  }
});
```

**Actions** (external API calls, non-transactional)
```typescript
export const sendWelcomeEmail = action({
  args: { userId: v.id("user") },
  returns: v.object({ success: v.boolean(), message: v.string() }),
  handler: async (ctx, args) => {
    // Call external Resend API
    await resend.emails.send({ ... });
  }
});
```

---

## Email System

**Provider:** Resend API  
**Templates:** React Email components

### Email Types

1. **Beta Welcome Email** - Sent immediately after signup approval
2. **Weekly Prompt Email** - Dispatched every Monday 6am CT via cron
3. **Framework Recommendation** - Triggered by user activity (Phase 2+)
4. **Innovation Approval** - Sent when community content is approved (Phase 2+)

### Email Architecture

```typescript
// Email templates (src/emails/)
BetaWelcomeEmail.tsx        // Onboarding
WeeklyPromptEmail.tsx       // Engagement
FrameworkRecommendation.tsx // Personalization
InnovationApproved.tsx      // Community

// Email sending (convex/email.ts)
export const sendWelcomeEmail = action({
  handler: async (ctx, args) => {
    const { data, error } = await resend.emails.send({
      from: "Pelican AI <hello@pelicanai.org>",
      to: user.email,
      subject: "Welcome to Pelican AI",
      react: BetaWelcomeEmail({ userName, temporaryPassword })
    });
  }
});
```

### Performance Targets

- **Delivery Time:** <10 seconds for transactional emails
- **Open Rate:** >75% for weekly prompts (Phase 1 success metric)
- **Mobile Optimization:** All templates <600px width

---

## Testing Architecture

**Test Runner:** Custom Node.js suite (`scripts/test-runner.js`)  
**Test Categories:** Unit, Integration, E2E, API, Diagnostic

### Test Data Management

**Safety System** (ADR-010):
- All test data flagged with `isTestData: true`
- Centralized cleanup via `testDataCleanup:deleteAllTestData`
- Safety verification prevents real data deletion
- Recovery system for accidental deletions

### Test Structure

```
scripts/
├── test-runner.js           # Orchestrator
├── test-utils.js            # Shared utilities
├── test-fixtures.js         # Test data
├── unit/                    # Unit tests (14 suites)
├── integration/             # Integration tests (3 suites)
├── e2e/                     # End-to-end tests (2 suites)
├── api/                     # API tests (2 suites)
└── diagnostic/              # Environment validation (2 suites)
```

### Current Test Status

- **Phase 1:** 100% success rate (11/11 tests passing)
- **Phase 2:** 100% success rate (48/48 tests passing)
- **Overall:** 100% success rate across all test suites

---

## Performance Targets

### Page Load
- **Target:** <3 seconds on 3G connection
- **Strategy:** Code splitting, lazy loading, optimized bundles

### API Response
- **Target:** <500ms for critical operations
- **Strategy:** Indexed queries, pagination, memoization

### Email Delivery
- **Target:** <10 seconds for transactional emails
- **Strategy:** Async actions, Resend API, retry logic

### Uptime
- **Target:** 99%+ during MVP period
- **Monitoring:** Convex dashboard, error tracking

---

## Security & Compliance

### FERPA Compliance

**Requirements:**
- No PII in logs or error messages
- Secure session management
- Audit logging for sensitive operations
- Data encryption at rest and in transit

**Implementation:**
```typescript
// ✅ CORRECT: No PII in logs
console.log("User signed up", { userId: user.id, timestamp: Date.now() });

// ❌ WRONG: PII in logs (FERPA violation)
console.log("User signed up", { email: user.email, name: user.name });
```

### Security Scans

**Semgrep Rules:** `.semgrep/ferpa-compliance-rules.yml`
- Detects PII in console logs
- Validates data sanitization
- Checks for secure patterns

**Run Security Scan:**
```bash
# Scan for FERPA violations
npx semgrep --config .semgrep/ferpa-compliance-rules.yml convex/
```

---

## Scalability Considerations

### Current Capacity
- **Users:** Designed for 100+ concurrent beta testers
- **Frameworks:** 50+ Louisiana-aligned frameworks
- **Database:** Convex auto-scales to handle load

### Phase 3+ Preparation

**When to Scale:**
- 100+ active users → Optimize queries, add pagination
- 1000+ frameworks → Implement full-text search indexing
- High email volume → Batch email sending, queue management

**Future Integrations:**
- **RAG System:** Already integrated (@convex-dev/rag)
- **Voice Interface:** Backend ready (Vapi integration)
- **Mobile App:** API-first design supports React Native

---

## Development Workflows

### Local Development

```bash
# Start development servers
pnpm dev                    # Frontend + Backend
pnpm dev:frontend          # Vite dev server
pnpm dev:backend           # Convex dev server

# Run tests
pnpm test:unit             # Unit tests
pnpm test:integration      # Integration tests
pnpm test:e2e              # End-to-end tests
pnpm test:api              # API tests
```

### Deployment

```bash
# Deploy to Convex
npx convex deploy          # Production deployment
npx convex dev --once      # Deploy without watching

# Environment variables
VITE_CONVEX_URL            # Convex deployment URL
BETTER_AUTH_SECRET         # Auth encryption key
RESEND_API_KEY            # Email service key
```

### Database Migrations

Convex handles schema migrations automatically. When you update `convex/schema.ts`:

1. Run `npx convex dev` - Convex validates schema changes
2. Deploy with `npx convex deploy` - Schema updates automatically
3. No manual migration scripts needed

---

## Known Issues & Limitations

### Current Issues

See README.md and Linear (WEB-47, WEB-48, WEB-49) for current bugs.

### Technical Limitations

1. **Convex Query Limits:** 1MB response size, optimize with pagination
2. **Better Auth:** HTTP endpoint CORS issues resolved (ADR-011)
3. **Email Rate Limits:** Resend free tier limits, monitor usage

---

## Architecture Decision Records

See `docs/decisions/` for detailed ADRs:

- **ADR-001:** Use Convex Backend
- **ADR-004:** Migrate to Better Auth
- **ADR-007:** Email-First Beta Flow
- **ADR-008:** Authentication Flow Fixes (Auto-Login)
- **ADR-009:** Critical Infrastructure Fixes (Database Conflicts)
- **ADR-010:** Test Data Isolation and Recovery
- **ADR-011:** CORS Fix and Phase 2 Testing

---

## Quick Reference

### Key Files

```
.cursorrules                      # Agent context (primary)
convex/schema.ts                  # Database schema (source of truth)
convex/auth.ts                    # Authentication logic
src/lib/auth-client.ts           # Frontend auth client
src/lib/design-system.ts         # Design tokens
```

### Important Commands

```bash
# Development
pnpm dev                         # Start everything
pnpm test:unit                   # Run unit tests

# Database
npx convex dashboard             # Open Convex dashboard
npx convex run [function]        # Call a function

# Testing
node scripts/test-runner.js      # Run all tests
pnpm test:cleanup                # Clean test data
```

### Useful Queries

```bash
# Check database state
npx convex run testDataCleanup:getDatabaseState

# Verify cleanup safety
npx convex run testDataCleanup:verifyCleanupSafety

# Get framework stats
npx convex run frameworks:getFrameworkStats
```

---

## Further Reading

- **Contributing Guide:** CONTRIBUTING.md (development practices)
- **Brand Guidelines:** docs/brand/PELICAN_AI_BRAND_GUIDELINES.md
- **Data Recovery:** docs/operations/DATA-RECOVERY-GUIDE.md
- **Test Documentation:** scripts/README.md

---

*This document is maintained by the development team and reviewed during each phase transition.*