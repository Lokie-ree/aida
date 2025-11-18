<!-- 553b851d-24e6-4ed0-9a16-7fa67ae45768 740f7ae3-3ea1-40e2-93b8-bb1599184d1b -->
# Grassroots Launch Realignment

## Core Problem

You've built for scale before validating with users. Now launching with 5 specific educators:

1. MS science, SPED (differentiation needs)
2. HS science (standards alignment)
3. MS Math (math standards, misconceptions)
4. Media Specialist/Librarian/Tech Facilitator (teacher support)
5. Media Specialist/STEM/Tech Facilitator (teacher support)

**Goal:** Give these 5 what they need, remove what they don't, ensure architecture can handle organic growth to 100.

## Phase 1: Audit & Scope Reduction

### What's Actually Built (Convex Tables)

- betaSignups, betaProgram (beta tracking)
- frameworks, frameworkUsage (framework library)
- alignmentAnalyses (alignment scorecard - Core Flare #1)
- innovations, testimonials (community features)
- userProfiles, timeTracking (user data)
- louisiana_standards (RAG vector search)

### What's Actually Needed for 5 Users

- **Framework Library:** YES (core value)
- **Alignment Scorecard:** YES (Core Flare #1)
- **Beta Program Tracking:** MINIMAL (5 users, not complex onboarding)
- **Community Features:** NO (not with 5 users - premature)
- **Time Tracking:** MAYBE (simple "did this save time?")
- **RAG Standards:** YES (powers Alignment Scorecard)

### Scope Creep Features to Deprioritize

From code review:

- **innovations.ts** (855 lines) - Community sharing, likes, views - NOT NEEDED for 5 users
- **testimonials.ts** - Approval workflow - OVERKILL (just ask for quotes directly)
- **dashboardAnalytics.ts** - Complex analytics - NOT NEEDED yet
- **Complex onboarding** - 5 colleagues don't need multi-step onboarding

**Action:** Don't delete code (it's there for later), but remove from documentation/UI/emails as "available features"

## Phase 2: Framework Alignment

### Current State Mismatch

**PELICAN_AI_BETA_CORE_FRAMEWORKS.md** (the good stuff):

- AIB-001: Louisiana Lesson Alignment Analyzer (detailed, sophisticated)
- AIB-006: 10-Minute Curriculum Internalizer
- AIB-008: Louisiana Contextualization Engine

**seedFrameworks.ts** (what's actually seeded):

- AIB-001: Email Drafting
- AIB-002: Newsletter Generation
- AIB-003: Document Summarization
- AIB-004: Meeting Notes
- AIB-005: Professional Email Responses
- IEH-001 through IEH-007: Various instructional tools

**PROBLEM:** The beta core frameworks doc is better/more sophisticated than what's seeded!

### What 5 Users Actually Need

**MS Science (SPED):**

- Louisiana Lesson Alignment Analyzer (science standards)
- Differentiation tools
- Anticipating Student Misconceptions (IEH-003)

**HS Science:**

- Louisiana Lesson Alignment Analyzer (HS science standards)
- Curriculum Internalizer (for lab safety, procedures)

**MS Math:**

- Louisiana Lesson Alignment Analyzer (math standards)
- Anticipating Student Misconceptions (IEH-003)
- Standards Unpacking (IEH-001)

**Tech Facilitators (2):**

- All frameworks (they'll use these to help other teachers)
- Email Drafting (AIB-001 current)
- Professional communication tools

### Action: Refine seedFrameworks.ts

**Keep & Enhance:**

1. Rewrite AIB-001 to match "Louisiana Lesson Alignment Analyzer" from BETA_CORE_FRAMEWORKS.md
2. Add AIB-006: 10-Minute Curriculum Internalizer
3. Add AIB-008: Louisiana Contextualization Engine
4. Keep IEH-001 (Standards Unpacking)
5. Keep IEH-003 (Misconceptions)
6. Keep 2-3 productivity frameworks (email, summarization)

**Remove/Simplify:**

- IEH-006 (Multi-Standard Unit Planning) - too complex for initial launch
- IEH-007 (LEADS Aligned Assessment) - too complex for initial launch
- AIB-002, AIB-004, AIB-005 - nice-to-have, not essential

## Phase 3: Email & Messaging Updates

### Current Issues in email.ts

Lines to update:

- Line 84: "Welcome to Pelican AI Beta Program - Reclaim Your Time!" → Too generic
- Line 151: "Your Pelican AI Platform Access is Ready!" → Too corporate
- Email content doesn't reflect grassroots positioning

### New Email Messaging

**Welcome Email:**

- Subject: "Ready to dive in? - Pelican AI"
- Tone: "You're one of 5 educators I'm starting with. Your feedback literally shapes everything."
- Include: Which framework to try first based on their role

**Weekly Prompts:**

- Remove "Weekly Prompt" concept entirely for 5 users
- Replace with: Personal check-ins ("Did that framework help? What would make it better?")

### Action: Update email.ts

1. Rewrite `sendBetaWelcomeEmail` with grassroots tone
2. Remove/simplify `sendWeeklyPromptEmail` (not needed for 5 users)
3. Add `sendPersonalCheckIn` for individual feedback collection

## Phase 4: Documentation Consolidation

### Current Documentation Sprawl

You're right - too many docs to maintain:

- PROJECT.md
- ARCHITECTURE.md
- PELICAN_AI_BRAND_GUIDELINES.md
- PELICAN_AI_BETA_CORE_FRAMEWORKS.md
- TESTING.md
- CONTRIBUTING.md
- README.md (probably)

### Consolidation Strategy

**Keep & Make Authoritative:**

1. **PROJECT.md** - Single source of truth for vision, current state, launch strategy
2. **PELICAN_AI_BETA_CORE_FRAMEWORKS.md** - THE frameworks (align seedFrameworks.ts to this)
3. **ARCHITECTURE.md** - Technical reference only

**Merge or Reduce:**

- PELICAN_AI_BRAND_GUIDELINES.md → Merge key sections into PROJECT.md
- TESTING.md → Only keep if you're actually running tests regularly
- CONTRIBUTING.md → Not needed for 5 user launch

**Action:** Create a single docs/README.md that points to the 2-3 essential docs

## Phase 5: Architecture Validation

### What You've Already Built (Good for 100 Users)

**Convex Backend:**

- ✅ Real-time database (handles scale)
- ✅ Serverless functions (auto-scales)
- ✅ Better Auth (production-ready)
- ✅ RAG with vector search (scales well)
- ✅ Workflow infrastructure (already built for Alignment Scorecard)
- ✅ Rate limiting (already in place)

**Frontend:**

- ✅ React 19 + TypeScript (production-ready)
- ✅ Tailwind + shadcn/ui (performant)
- ✅ Vercel deployment (auto-scales)

**YOU'RE ALREADY ARCHITECTED FOR 100 USERS.** The issue isn't architecture - it's feature creep.

### What to Verify

1. **Rate Limits:** Check `convex/rateLimiting.ts` - are limits appropriate for 5 users growing to 100?
2. **Database Indexes:** Review `convex/schema.ts` - are indexes optimized?
3. **API Costs:** Alignment Scorecard uses OpenAI - what's the cost per analysis? Can you afford 100 users?

## Phase 6: Convex Optimization (Based on Best Practices)

### Issue: Filter vs Index Performance

**Current Problem:** Many functions use `.filter()` after `.collect()` which scans entire tables.

**Files to Audit:**

- `convex/frameworks.ts` - Lines 56-62, 123-125 (filters after collection)
- `convex/betaProgram.ts` - Check for filter usage
- `convex/innovations.ts` - 855 lines, likely has filter issues
- `convex/testimonials.ts` - Check for filter usage

**Convex Best Practice:**

```typescript
// ❌ BAD: Scans entire table then filters in memory
const frameworks = await ctx.db.query("frameworks").collect();
return frameworks.filter(f => f.module === args.module);

// ✅ GOOD: Uses index to filter at database level
const frameworks = await ctx.db
  .query("frameworks")
  .withIndex("by_module", q => q.eq("module", args.module))
  .collect();
```

**Action:** Audit schema.ts indexes and update queries to use them.

### Weekly Email Cron Decision (Based on Convex Docs)

**Current:** `convex/crons.ts` - Weekly email every Monday 6am CT

**Convex Best Practice:** Cron jobs are standard and well-supported. Keep the infrastructure but:

- ✅ Keep cron job (it's lightweight, won't hurt with 5 users)
- ✅ Add feature flag: `WEEKLY_EMAILS_ENABLED` env var (default: false)
- ✅ For 5 users: disable via env var, do personal check-ins instead
- ✅ For 100 users: enable via env var, automate engagement

**Implementation:**

```typescript
// In crons.ts
const isEnabled = (process.env.WEEKLY_EMAILS_ENABLED ?? "false") === "true";
if (!isEnabled) {
  console.log("Weekly emails disabled via env var");
  return;
}
```

**Benefits:** Infrastructure ready, but feature-flagged for grassroots launch.

### ARCHITECTURE.md Decision (Based on Convex Docs)

**Convex Docs Say:** "Update your README.md - agents need context about business goals, not just inferred details from files"

**Decision:**

- ❌ Remove ARCHITECTURE.md (redundant with auto-generated types)
- ✅ Keep PROJECT.md as single source of truth for business context
- ✅ Convex auto-generates all API types from schema.ts
- ✅ Dashboard shows real-time logs, data, metrics

**Reasoning:**

- Agents get types from `_generated/api.d.ts` automatically
- Business logic lives in PROJECT.md
- Technical architecture is self-documenting via schema.ts
- Duplicate docs = maintenance burden = out-of-sync docs

### 7-Component Setup Validation

**Your Setup (convex.config.ts):**

1. `resend` - Email (production-ready)
2. `betterAuth` - Auth (production-ready)
3. `rag` - Vector search (production-ready)
4. `agent` - LLM integration (production-ready)
5. `workflow` - Multi-step processes (production-ready)
6. `rateLimiter` - Rate limiting (production-ready)
7. `actionCache` - Action caching (production-ready)

**Convex Best Practice Assessment:**

- ✅ All 7 components are official Convex packages
- ✅ Well-integrated, tested for scale
- ✅ This stack handles 100+ users easily
- ✅ Rate limiter + action cache = built for scale

**Your architecture is already production-ready.** The issue isn't technical - it's feature scope.

### Critical Path Analysis (Convex Stack Doc)

**Per Vibe-Coding-to-Production Guide:** Identify functions called most often (your critical path).

**Your Critical Path Functions:**

1. `getAllFrameworks` (frameworks.ts) - Most frequent read
2. `getFrameworkById` (frameworks.ts) - Detail view
3. `recordFrameworkUsage` (frameworks.ts) - Every interaction
4. `analyzeContentAlignment` (alignmentScorecard.ts) - Core Flare #1, expensive

**Optimization Priority:**

1. Fix filter → index in `getAllFrameworks` (called constantly)
2. Ensure `recordFrameworkUsage` is fast (tracks every click)
3. Add caching to `analyzeContentAlignment` (uses OpenAI, expensive)

### Schema Optimization

**Current Schema Issues to Fix:**

1. Missing indexes for common queries
2. Filters used instead of indexes
3. No compound indexes for multi-field queries

**Action Items:**

1. Review schema.ts - ensure indexes exist for all common queries
2. Update queries to use `.withIndex()` instead of `.filter()`
3. Add compound indexes where needed (e.g., `by_module_and_status`)

## Phase 7: Implementation Order

### Week 1: Strip & Focus (Most Critical)

1. **Update seedFrameworks.ts:**

- Rewrite to match PELICAN_AI_BETA_CORE_FRAMEWORKS.md
- Focus on 5-7 frameworks the 5 users actually need
- Remove complex frameworks (IEH-006, IEH-007)

2. **Update email.ts:**

- Rewrite welcome email with grassroots tone
- Remove weekly automation (too impersonal for 5 users)
- Add personal check-in function

3. **Update convex JSDoc comments:**

- alignmentScorecard.ts - add grassroots positioning
- frameworks.ts - platform-agnostic emphasis
- betaProgram.ts - "building together" tone

4. **Hide premature features in UI:**

- Remove/hide innovations page
- Remove/hide testimonials page
- Simplify dashboard to: frameworks + alignment scorecard

### Week 2: Polish & Launch Prep

5. **Consolidate documentation:**

- Merge BRAND_GUIDELINES key sections into PROJECT.md
- Create docs/README.md pointing to essential docs only
- Archive TESTING.md and CONTRIBUTING.md

6. **Personalize for 5 users:**

- Create personalized onboarding for each user's role
- Identify 2-3 frameworks each user should try first
- Prepare personal check-in questions

### Week 3: Launch & Iterate

7. **Launch to 5 users with personal message**
8. **Daily check-ins** (not automated)
9. **Rapid iteration based on feedback**

## Decisions Made

1. **Frameworks:** Keep 3 advanced frameworks (AIB-001, AIB-006, AIB-008) + add 7 more = 10 total frameworks

- Mix of AIB (AI Basics) and IEH (Instructional Expert) to serve all 5 educator roles
- Tech facilitators need basics to support teachers
- Teachers need advanced for their specific subjects

2. **Community Features:** Deprioritize in docs, keep in codebase (bug testing with 5 users before 100)

3. **Weekly Emails:** Research Convex best practices for cron jobs with components

4. **Documentation:** Merge BRAND_GUIDELINES into PROJECT.md, evaluate need for ARCHITECTURE.md (may be redundant with generated types)

5. **Alignment Scorecard:** ALL 5 users try it - tech facilitators need hands-on experience to support teachers

## AIB vs IEH Strategy for Scaling

**Current Approach (Good for Scale):**

- **AIB (AI Basics Hub):** Productivity, communication, quick wins (5-15 min)
- **IEH (Instructional Expert Hub):** Louisiana-specific, standards-aligned, sophisticated (20-35 min)

**Why This Works:**

- Clear difficulty progression (beginner → advanced)
- Self-selection based on confidence level
- Tech facilitators can guide teachers from AIB → IEH
- Scales naturally: new users start with AIB, power users graduate to IEH

**Keep This Structure** - it's already architected well for 100 users.

## Success Metrics (Honest Numbers)

**Week 1:**

- 5 users have accounts
- Each user has tried at least 1 framework
- 5/5 respond to "Did this help or waste your time?"

**Month 1:**

- 5 users still active
- 3+ authentic testimonials
- Specific time-saved examples ("14.5 minutes per lesson")

**By Year-End:**

- 30-50 users through word-of-mouth
- Architecture handles load easily
- 3-5 frameworks validated as high-value