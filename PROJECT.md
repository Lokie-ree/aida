# Pelican AI - Project Context

**Last Updated:** November 11, 2025
**Status:** Beta Launch Ready (Core Flare #1: Alignment Scorecard Implemented)

## Vision & Mission

### Vision

Navigate AI with Confidence - Every Louisiana educator equipped with practical, ethical, and platform-agnostic AI guidance.

### Mission

Empower Louisiana educators with practical, ethical, and platform-agnostic AI guidance that reclaims their time for high-impact teaching. Pelican AI serves as an "indispensable colleague"—an Intelligent Coaching Layer that transforms generic AI output into high-quality, safe, and localized classroom practice.

### Core Value Proposition

  * **Intelligent Coaching Layer:** Not another AI tool—Pelican AI is the "educator in the loop" that sits *on top* of all other AI tools, translating generic AI output into high-quality, safe, and localized classroom practice.
  * **Platform-Agnostic:** Works with ANY AI tool (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.).
  * **Louisiana-Aligned:** Built for Louisiana state standards and educator rubric.
  * **Ethical Guardrails:** Responsible AI use is built-in.
  * **Time-Saving:** Immediate, practical solutions for common tasks (3-5 hours/week savings target).
  * **Quality-Keeper & Confidence-Builder:** Beyond time-saving—provides trust, quality assurance, and pedagogical validation.

-----

## User Personas

### Sarah Johnson - High School English Teacher, Jefferson Parish

  * **Pain Points:** Overwhelmed by AI tools, lacks time for lesson planning, ethical concerns.
  * **Goals:** Save time on administrative tasks, improve lesson quality, use AI responsibly.
  * **Tech Comfort:** Moderate - uses district-provided tools.

### Michael Chen - Elementary Math Teacher, Lafayette

  * **Pain Points:** Struggles with AI prompt writing, wants Louisiana-specific guidance.
  * **Goals:** Differentiate instruction, create engaging activities, maintain academic integrity.
  * **Tech Comfort:** High - early adopter of new tools.

### Dr. Lisa Rodriguez - Middle School Science Teacher, Baton Rouge

  * **Pain Points:** Needs standards-aligned content, wants to share innovations.
  * **Goals:** Align with Louisiana standards, collaborate with peers, track impact.
  * **Tech Comfort:** High - tech-savvy educator.

-----

## Current System Snapshot

### Tech Stack

  * **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
  * **Backend:** Convex (real-time database + serverless functions)
  * **Authentication:** Better Auth (@convex-dev/better-auth)
  * **Email:** Resend API
  * **Design:** Louisiana-branded, WCAG 2.1 AA compliant, mobile-first

### Deployment Environments

  * **Development:** `kindly-setter.convex.cloud` (local dev + testing)
  * **Production:** `outgoing-parttridge.convex.cloud` (live platform)
  * **Frontend:** Vercel (preview/production deployments)

### Key Features Operational

  * ✅ **Authentication:** Better Auth integration with email/password
  * ✅ **Framework Library:** 10+ foundational AI guidance frameworks with search, filter, copy functionality (growing weekly)
  * ✅ **Community Features:** Innovation sharing and testimonials
  * ✅ **Dashboard:** Personalized dashboard with stats and quick start
  * ✅ **Admin Dashboard:** Content moderation and beta program management
  * ✅ **Email System:** Automated welcome emails and weekly prompts
  * ✅ **User Profiles:** Extended educator data (school, subject, grade, district)
  * ✅ **Alignment Scorecard (Core Flare #1):** Multi-step workflow analyzing AI-generated content against Louisiana Standards with structured scorecards, gap analysis, and recommendations
  * ✅ **RAG System:** Vector search for Louisiana Standards with semantic filtering by subject, grade level, and cognitive depth
  * ✅ **Workflow Infrastructure:** Multi-step processes with retry logic and status tracking
  * ✅ **Authorization & Rate Limiting:** Role-based access control (teacher/coach/admin) with tiered rate limits

### Database Schema

See `convex/schema.ts` for the complete, self-documenting source of truth. Convex automatically generates API contracts from the schema.

**Key Tables:**

  * `betaSignups` - Beta tester recruitment and approval
  * `userProfiles` - Extended educator data
  * `frameworks` - AI guidance frameworks with Louisiana standards
  * `frameworkUsage` - User interaction tracking
  * `innovations` - Community-shared teaching innovations
  * `testimonials` - User feedback and success stories
  * `betaProgram` - Beta program participation and progress
  * `timeTracking` - Time savings analytics
  * `alignmentAnalyses` - Alignment Scorecard analysis results (scores, gaps, recommendations)

-----

## Strategic Positioning & Core Flares

### The Moat: Intelligent Coaching Layer

Pelican AI's fundamental differentiator is that it **is not another AI tool.** Instead, it's an **Intelligent Coaching Layer** that sits *on top* of all other AI tools. It's the "educator in the loop" who translates generic AI output into high-quality, safe, and localized classroom practice.

This positioning shifts Pelican AI from a "helpful utility" to an **"indispensable colleague."**

### Core Flares (Strategic Features)

#### 1. From "Prompt Library" to "Safety Net" - The Alignment Scorecard

  * **The Problem:** Any teacher can use Gemini to get a 10-question quiz. But they are *anxious*. "Is this quiz any good? Is it *actually* testing the Louisiana standard? Am I accidentally using a low-quality, generic resource that my principal will question?"
  * **The Pelican Flare:** Pelican AI provides the "master teacher" gut check—instantly. It's a "quality-control" station.
      * A teacher pastes their AI-generated quiz into Pelican.
      * The app—*because it's the only tool that has actually read and understood the Louisiana standards*—doesn't just give a thumbs-up.
      * It provides an "Alignment Scorecard" that says: "This is 75% aligned. It's great at *recall*, but the state standard (LA.10.1a) demands *synthesis*. Your AI-generated quiz is missing the most important part of the standard."
  * **The Moat:** This builds **trust**. Pelican AI is no longer just a "time-saver" (which is what MagicSchool and Brisk claim); it's a **"quality-keeper"** and a **"confidence-builder."**

#### 2. From "Static Tool" to "Active Partner" - The Weekly Spark

  * **The Problem:** A teacher's work is dictated by the calendar. They are always thinking, "What am I teaching next week?"
  * **The Pelican Flare:** Pelican AI acts like an experienced, helpful department head.
      * A teacher logs in on Monday. The app *knows* what they teach (10th Grade English) and *knows* the state's pacing guide.
      * The app proactively says: "Hi Sarah, it looks like you're starting the *Julius Caesar* unit this week. Here is a top-rated 'Rhetorical Analysis' warm-up that another teacher in Jefferson Parish shared. It's perfectly aligned."
  * **The Moat:** The app is **context-aware** in a way no generic tool can be. It's not waiting for the user to search; it's *anticipating* their needs based on hyper-local data (the state curriculum map).

#### 3. From "One-Size-Fits-All" to "Instant Differentiation" - The Delta Generator

  * **The Problem:** A teacher *never* uses a "one-size-fits-all" resource. The *real* work is modifying that one lesson plan for five different student groups (ELL, IEP, Gifted, etc.). This is where all the time is lost.
  * **The Pelican Flare:** Pelican AI does the *real* work of teaching.
      * A teacher has a lesson plan. They click the "Differentiate" button.
      * The app—*because it has ingested Louisiana's official guidelines for accommodations*—instantly generates three new versions of that lesson.
      * It's not just "simpler text." It's pedagogically-sound differentiation: "Here is the ELL version with key vocabulary pre-defined," "Here is the IEP version with the task 'chunked' into smaller steps," and "Here is the Gifted version with a new extension activity."
  * **The Moat:** This solves a problem that non-educator developers *don't even know exists*. Pelican AI saves the teacher from their most time-consuming, complex task. This is the ultimate "time-reclamation" feature and the heart of the paid tier.

-----

## Feature Requirements (Standard)

### Framework Library

  * Browse, search, and filter AI frameworks by module, category, difficulty, tags
  * Louisiana standards alignment indicators
  * Platform compatibility tracking (works with ANY AI tool)
  * Usage analytics and tracking
  * One-click copy prompt functionality
  * Saved frameworks persistence

### Community Features

  * Innovation sharing system (submit, browse, filter, search)
  * Testimonial submission and approval workflow
  * Community interaction tracking (likes, views, shares)
  * Louisiana context encouraged throughout

### Dashboard

  * Personal progress tracking (frameworks tried, time saved, innovations shared)
  * Time savings tracker (weekly/monthly/total views)
  * Weekly engagement streak display
  * Quick start experience with personalized recommendations
  * Recently used frameworks

### Admin Dashboard

  * Beta user management and approval workflow
  * Content moderation (testimonials, innovations)
  * Analytics and reporting
  * Access control and role-based permissions

-----

## Success Metrics & KPIs

### User Engagement

  * Framework Usage: 50+ frameworks used per user per month
  * Community Engagement: 25% of users share innovations
  * Retention: 80% monthly active users

### Time Savings

  * Average 3+ hours saved per week per educator
  * 80%+ report immediate time savings (10+ minutes per prompt)

### Performance

  * Page Load Time: <3 seconds on 3G connection
  * Email Delivery: <10 seconds for transactional emails
  * API Response: <500ms for critical operations
  * Uptime: 99%+ target

### Quality

  * User Satisfaction: 90%+ rating
  * WCAG 2.1 Level AA: Compliant
  * Test Coverage: ~88% unit coverage

-----

## Competitive Analysis

### Direct Competitors

  * **MagicSchool AI:** AI tool, not guidance
  * **Brisk:** AI tool, not guidance
  * **SchoolAI:** AI tool, not guidance

### Competitive Advantages

  * **The Moat:** Not another AI tool—an Intelligent Coaching Layer that sits on top of all AI tools
  * **Platform-Agnostic:** Works with any AI tool
  * **Louisiana-Specific:** Aligned to state standards with deep understanding of state curriculum
  * **Educator-Led:** Built by educators for educators—solves problems non-educator developers don't know exist
  * **Ethical Focus:** Responsible AI use built-in
  * **Quality-Keeper & Confidence-Builder:** Beyond time-saving—provides trust, validation, and pedagogical assurance
  * **Context-Aware:** Anticipates needs based on hyper-local data (state curriculum map, pacing guides)

-----

## Technical Requirements

### Performance Requirements

  * Page Load Time: <3 seconds on 3G connection
  * Email Delivery: <10 seconds for transactional emails
  * API Response: <500ms for critical operations
  * Uptime: 99%+ target

### Security Requirements

  * **FERPA Compliance:** All educator data protected
  * **Authentication:** Secure session management via Better Auth
  * **Data Privacy:** No data sharing without consent
  * **Audit Logging:** Track sensitive operations
  * **No PII in Logs:** FERPA-compliant logging practices

### Accessibility Requirements

  * **WCAG 2.1 Level AA:** Mandatory compliance
  * **Keyboard Navigation:** Full keyboard support
  * **Screen Reader:** Semantic HTML and ARIA labels
  * **Color Contrast:** Minimum 4.5:1 for normal text

-----

## Quick Reference

### Essential Commands

```bash
# Development
pnpm dev                    # Start frontend + backend
pnpm test:once              # Run unit tests once
pnpm test:coverage           # Generate coverage report
pnpm build                   # Build for production

# Database
npx convex dashboard        # Open Convex dashboard
npx convex deploy           # Deploy to production
```

### Key Files

  * `convex/schema.ts` - Database schema (source of truth for API contracts)
  * `convex/auth.ts` - Authentication logic
  * `src/lib/auth-client.ts` - Frontend auth client
  * `docs/ARCHITECTURE.md` - Technical architecture reference
  * `docs/TESTING.md` - Complete testing documentation

### Documentation

  * **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Minimal technical reference
  * **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Development guidelines
  * **[TESTING.md](docs/TESTING.md)** - Complete testing documentation (protocol, results, best practices)
  * **[PELICAN_AI_BRAND_GUIDELINES.md](docs/PELICAN_AI_BRAND_GUIDELINES.md)** - Design system
  * **[decisions/](docs/decisions/)** - Architectural decision records (ADRs)

-----

## Next Steps

1.  **E2E Testing:** Execute comprehensive test protocol (see `TESTING.md`)
2.  **Beta Launch:** Soft launch to initial beta testers
3.  **Monitor & Iterate:** Gather metrics and user feedback

-----

*This document provides a single source of truth for Pelican AI vision and current system state.*