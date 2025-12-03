# DHH-Style Architecture Review: Pelican AI

**Reviewer:** @agent-dhh-rails-reviewer
**Date:** December 1, 2024
**Review Type:** Product & Technical Architecture
**Codebase:** Pelican AI - Louisiana K-12 Educator Coaching Platform

---

## Overall Assessment: **NEEDS SIMPLIFICATION**

You've got a good product buried under too much infrastructure. The vision is clear and valuable - Louisiana teachers need Louisiana-specific AI prompt coaching. But you're building the Burj Khalifa when you need a food truck.

**The Good News:** You caught yourself. The refocus from "framework library" to "conversational coach" was the right move. Now finish the job.

**The Bad News:** You're still dragging around a bunch of YAGNI complexity that's going to slow you down when you should be learning from real users.

---

## Key Issues

### 1. **32 Backend Files for 4 Beta Users**

You have **32 TypeScript files in your backend** (not counting tests) and **93 React components** for a product that doesn't have paying customers yet. That's not a minimum viable product - that's a maximum viable architecture.

**Files you DON'T need right now:**
- `alignmentScorecard.ts` + `alignmentSteps.ts` - You explicitly deferred this, but it's still cluttering the codebase
- `workflows.ts` + `populateStandardsWorkflow.ts` - Premature optimization for RAG ingestion that hasn't happened yet
- `innovations.ts` + `testimonials.ts` + `betaProgram.ts` - Community features before you have a community
- `timeTracking.ts` + `frameworkUsage.ts` - Analytics before you have data worth analyzing
- `emailEvents.ts` + `email.ts` + `crons.ts` - Transactional email infrastructure for what? Welcome emails?
- `authorization.ts` + `admin.ts` - Role-based access control for a beta with 4 handpicked users?

**What that leaves you:**
- `promptCoach.ts` - THE PRODUCT
- `userProfiles.ts` - Needed for personalization
- `rag.ts` + `ragService.ts` - Core infrastructure
- `auth.ts` - You need login
- `schema.ts` - You need a database

Everything else is speculation about future features. **Delete it or move it to a branch called `future-maybe`.**

### 2. **The RAG Situation is Comical**

You've built an elaborate RAG ingestion system with:
- Workflow orchestration
- Rate limiting
- Batch processing
- Subject-specific parsers
- 6 metadata filters
- Estimated 3-hour ingestion time

But according to `RAG_INGESTION_PLAN.md`:

> **Status:** 🚧 **PLANNING PHASE**
> **❌ What's Missing:** Data ingestion: No standards or rubric data in RAG yet

You spent time building the *infrastructure* to load data but never loaded the data. That's like buying a truck to move into a new apartment, customizing the truck with hydraulic lifts and a navigation system, but never actually moving.

**Just load the damn data.** Write a 50-line Node.js script that reads your JSON files and calls `rag.add()` in a loop. It doesn't need retry logic. It doesn't need workflows. It needs to **work by Tuesday**.

### 3. **The Framework Library Theater**

Per VISION.md, the framework library is "SECONDARY" and will be "populated FROM successful beta conversations, not seeded upfront."

Then why does `seedFrameworks.ts` exist? Why are there 80+ CRUD functions in `frameworks.ts`? Why is there a whole `frameworkUsage` tracking table?

You're hedging. You say it's secondary, but you built it like it's primary. **Ship without it.** If teachers ask for pre-made prompts after using the conversational coach, THEN build it. Not before.

### 4. **Component Explosion**

93 React components for a chat interface and a few settings screens? Come on.

Modern web development has this disease where every div gets its own component file. You've got `shared/` and `ui/` folders full of abstractions that probably get used once.

**Collocate by feature, not by type.** A chat interface is a chat interface - it shouldn't be spread across 15 files. Put the coach UI in `coach/PromptCoach.tsx` and stop there until you need to split it for actual complexity reasons, not "clean architecture" reasons.

### 5. **Testing Without Users**

You have comprehensive testing infrastructure:
- Vitest
- Playwright
- E2E tests
- Coverage reports
- Backend tests with `convex-test`

For what? **You have zero users.** The most important test right now is whether a Louisiana teacher will use this on Tuesday morning during planning period.

I'm not saying delete the tests - Convex encourages testing and that's fine - but don't spend another minute on test infrastructure until you've watched a real teacher use the product.

### 6. **The Workflow Obsession**

You're using `@convex-dev/workflow` for multi-step processes. That's a sophisticated abstraction for handling:
- Retry logic
- Backoff
- Durability
- State management

What are you using it for? The Alignment Scorecard you deferred and RAG ingestion you haven't done.

**You don't need workflows.** You need to ship a working chat interface that calls GPT-4o with Louisiana context. That's an action calling an API. Done.

---

## What to Cut Right Now

### **Backend Files to Delete:**
1. `alignmentScorecard.ts` + `alignmentSteps.ts` - Deferred feature
2. `populateStandardsWorkflow.ts` - Over-engineered for one-time script
3. `innovations.ts` + `testimonials.ts` + `betaProgram.ts` - No community yet
4. `timeTracking.ts` + `frameworkUsage.ts` - Premature analytics
5. `emailEvents.ts` + `crons.ts` - You don't need scheduled jobs
6. `authorization.ts` + `admin.ts` - Everyone's an admin in beta
7. `frameworks.ts` + `seedFrameworks.ts` - You said it's secondary

### **Schema Tables to Delete:**
1. `alignmentAnalyses` - Feature deferred
2. `frameworkUsage` - Analytics nobody's looking at
3. `timeTracking` - YAGNI
4. `innovations` + `innovationInteractions` - Community features
5. `betaProgram` - Just use `userProfiles`
6. `frameworks` - You're not shipping pre-built prompts

### **What That Leaves You:**

**Core Schema:**
```typescript
- betaSignups (landing page)
- userProfiles (personalization)
- promptConversations (THE PRODUCT)
- generatedPrompts (saved outputs)
```

**Core Backend:**
```typescript
- auth.ts (login)
- userProfiles.ts (CRUD for profiles)
- promptCoach.ts (THE PRODUCT)
- rag.ts (infrastructure)
- schema.ts (database)
```

That's **5 files** instead of 32. That's a product you can understand in an afternoon.

---

## What to Build Instead

### **This Week: Ship the Chat**

1. **Fix RAG Ingestion** (2 hours)
   - Write a Node.js script: `scripts/load-rag-data.ts`
   - Read JSON files from `knowledge/`
   - Call `rag.add()` in a loop
   - Log progress to console
   - Done

2. **Polish the Conversational Coach** (4 hours)
   - Verify GPT-4o is getting Louisiana context from RAG
   - Test that prompts are copy-pasteable
   - Add feedback buttons (👍/👎)
   - Ship it

3. **Beta Deploy** (2 hours)
   - Deploy to Convex production
   - Send 4 beta users their login links
   - Watch them use it (Zoom/Loom recordings)
   - Take notes

**That's 8 hours of work.** Not 3 weeks.

### **Next Week: Learn from Users**

Don't touch the code. Just watch teachers use it and ask:
- Do they understand the product?
- Are the clarifying questions helpful or annoying?
- Are the generated prompts actually Louisiana-specific?
- Do they use the prompts in ChatGPT/Claude?
- Do they come back for more prompts?

**Ship based on what you learn, not what you planned.**

### **After Beta: Build What's Needed**

Maybe you need the framework library. Maybe you need community features. Maybe teachers want to share innovations. **You don't know yet.**

The only way to know is to ship the simplest version and listen.

---

## Recommendations

### **Immediate Actions (This Week)**

1. **Delete 27 backend files** - Keep only: auth, userProfiles, promptCoach, rag, schema
2. **Delete 7 schema tables** - Keep only: betaSignups, userProfiles, promptConversations, generatedPrompts
3. **Write RAG ingestion script** - 50 lines of Node.js, no workflows
4. **Run the script** - Load Louisiana standards and rubric into RAG
5. **Test the coach** - Does it generate Louisiana-aligned prompts?
6. **Ship to beta** - 4 users, 3 weeks, real feedback

### **Medium-Term Strategy**

1. **Learn from beta users** - What do they actually need?
2. **Build ONE feature** they ask for - Don't build the whole roadmap
3. **Charge money** - Even $10/month tells you if this is real
4. **Repeat** - Ship, learn, ship, learn

### **Long-Term Philosophy**

- **Delete code aggressively** - Every line is a liability
- **Build for today's problem** - Not next year's scale
- **Ship ugly** - Polish is expensive and doesn't teach you anything
- **Listen to users** - They'll tell you what to build if you let them

---

## The Bottom Line

You have a good product idea: **Louisiana teachers need help writing Louisiana-aligned AI prompts.** That's a real problem with a real solution.

But you're drowning it in infrastructure complexity. You've got workflows and analytics and admin panels and community features for a product that doesn't have users yet.

**Simplify ruthlessly.**

Ship a chat interface that:
1. Takes a teacher's vague idea
2. Asks clarifying questions
3. Generates a Louisiana-aligned prompt
4. Lets them copy/paste it into ChatGPT

That's it. That's the product. Everything else is distraction until you prove people want that core experience.

You caught yourself once (framework library → conversational coach). Catch yourself again. **Delete half your codebase and ship what's left.**

Then let real teachers tell you what to build next.

---

**Assessment:** Needs simplification
**Confidence in Product Vision:** High
**Confidence in Current Implementation:** Low (too much complexity)
**Recommended Path:** Delete, simplify, ship, learn

**tl;dr:** You're building a Majestic Monolith but forgetting the "Majestic" part comes from being actually useful, not architecturally impressive. Ship the chat. Learn from users. Build what they need. Stop building what you think they might need someday.
