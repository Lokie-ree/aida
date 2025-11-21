# Pelican AI - Project Context

**Last Updated:** November 18, 2025
**Status:** LAUNCHING - Grassroots Launch with 5 Committed Educators (Core Flare #1: Alignment Scorecard Implemented)

## Vision & Mission

### Vision

Navigate AI with Confidence - Louisiana educators building practical, ethical, and platform-agnostic AI guidance together.

### Mission

We're Louisiana educators who understand the challenges teachers face. We're tired of waiting for LDOE to give us guidance on AI tools. So we're building it ourselves—Louisiana educators, for Louisiana educators.

Pelican AI is the "colleague you wish you had"—the master teacher who checks your work and gives you confidence. It's not another AI tool to learn. It's guidance that works with whatever AI tool you already use.

### Founder Story

Pelican AI was built by a Louisiana educator who understands the challenges teachers face. The founder was "that teacher—grading papers at 11 PM, drowning in admin work, anxious about using AI tools because 'what if I get it wrong?'"

When ChatGPT launched, the need became clear: Louisiana educators needed someone to tell them "Here's how to use this responsibly. Here's what aligns with Louisiana standards. Here's what won't get you in trouble."

That person didn't exist. So Pelican AI became that person—the colleague you wish you had, the "master teacher" who checks your work and gives you confidence.

**Founder Credentials:**
- 15+ years Louisiana classroom experience
- Mathematics Teacher, Iberville Parish
- Built Pelican AI in 60 days while teaching full-time
- Platform-agnostic approach (works with ANY AI tool)

### What We're Building Together

  * **Intelligent Coaching Layer:** Not another AI tool—Pelican AI is the "educator in the loop" that sits *on top* of all other AI tools, translating generic AI output into high-quality, safe, and localized classroom practice.
  * **Platform-Agnostic:** Works with ANY AI tool (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.).
  * **Louisiana-Aligned:** Built for Louisiana state standards and educator rubric.
  * **Ethical Guardrails:** Responsible AI use is built-in.
  * **Quality-Keeper & Confidence-Builder:** Beyond time-saving—provides trust, quality assurance, and pedagogical validation.
  * **Built Together:** Starting with 5 educators. Your feedback literally shapes everything.

-----

## Brand Voice & Tone

### Personality
- **Professional yet Approachable**: Expert guidance without intimidation
- **Louisiana-Proud**: Celebrates local identity and values
- **Educator-First**: Always puts teachers and their needs first
- **Authentic and Human**: Teacher-to-teacher communication, not corporate speak

### Tone Guidelines

**✅ DO:**
- "Stop wondering if your AI-generated content is any good"
- "I was that teacher—grading papers at 11 PM, drowning in admin work"
- "Real talk: Is this useful?"
- "Brutally honest is helpful. 'This is confusing' is better than silence."
- "You're shaping the future of AI guidance for Louisiana educators"

**❌ DON'T:**
- "Leverage AI synergies"
- "Paradigm-shifting EdTech solution"
- "Revolutionary platform that transforms education"
- Overly formal corporate language
- Generic buzzwords
- Fake social proof numbers

### Visual Identity
- **Primary Colors**: Pelican Blue (#0ea5e9), Louisiana Gold (#f59e0b), Deep Blue (#1e40af)
- **Typography**: Lexend (primary), Poppins (headings), JetBrains Mono (code)
- **Logo**: Stylized pelican silhouette representing Louisiana pride and guidance

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
  * ✅ **Email System:** Welcome emails and weekly prompts (real conversations, not automation)
  * ✅ **User Profiles:** Extended educator data (school, subject, grade, district)
  * 🚧 **Alignment Scorecard (Core Flare #1):** Multi-step workflow analyzing AI-generated content against Louisiana Standards with structured scorecards, gap analysis, and recommendations
    - Backend: ✅ Complete (workflow, RAG, database solid)
    - Frontend: ❌ UI not yet built
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

## What Makes This Different

### Not Another AI Tool

Pelican AI's fundamental differentiator is that it **is not another AI tool.** Instead, it's guidance that sits *on top* of all other AI tools. It's the "educator in the loop" who translates generic AI output into high-quality, safe, and localized classroom practice.

This is the colleague you wish you had—the master teacher who checks your work and gives you confidence.

### We're Not Competing With AI Tools

  * **MagicSchool AI, Brisk, SchoolAI:** These are AI tools you have to learn. We work WITH whatever tool you already use.
  * **Generic EdTech:** We're hyperlocal to Louisiana—we understand your district's expectations because we live them.
  * **Corporate Solutions:** We're teacher-to-teacher, not corporate-to-teacher. No jargon, just practical frameworks.

### Core Features We're Building

#### 1. From "Prompt Library" to "Safety Net" - The Alignment Scorecard

  * **The Problem:** Any teacher can use Gemini to get a 10-question quiz. But they are *anxious*. "Is this quiz any good? Is it *actually* testing the Louisiana standard? Am I accidentally using a low-quality, generic resource that my principal will question?"
  * **The Pelican Flare:** Pelican AI provides the "master teacher" gut check—instantly. It's a "quality-control" station.
      * A teacher pastes their AI-generated quiz into Pelican.
      * The app—*because it's the only tool that has actually read and understood the Louisiana standards*—doesn't just give a thumbs-up.
      * It provides an "Alignment Scorecard" that says: "This is 75% aligned. It's great at *recall*, but the state standard (LA.10.1a) demands *synthesis*. Your AI-generated quiz is missing the most important part of the standard."
  * **Why This Matters:** This builds **trust**. It's not just a "time-saver" (which is what MagicSchool and Brisk claim); it's a **"quality-keeper"** and a **"confidence-builder."**

#### 2. From "Static Tool" to "Active Partner" - The Weekly Spark

  * **The Problem:** A teacher's work is dictated by the calendar. They are always thinking, "What am I teaching next week?"
  * **The Pelican Flare:** Pelican AI acts like an experienced, helpful department head.
      * A teacher logs in on Monday. The app *knows* what they teach (10th Grade English) and *knows* the state's pacing guide.
      * The app proactively says: "Hi Sarah, it looks like you're starting the *Julius Caesar* unit this week. Here is a top-rated 'Rhetorical Analysis' warm-up that another teacher in Jefferson Parish shared. It's perfectly aligned."
  * **Why This Matters:** The app is **context-aware** in a way no generic tool can be. It's not waiting for the user to search; it's *anticipating* their needs based on hyper-local data (the state curriculum map).

#### 3. From "One-Size-Fits-All" to "Instant Differentiation" - The Delta Generator

  * **The Problem:** A teacher *never* uses a "one-size-fits-all" resource. The *real* work is modifying that one lesson plan for five different student groups (ELL, IEP, Gifted, etc.). This is where all the time is lost.
  * **The Pelican Flare:** Pelican AI does the *real* work of teaching.
      * A teacher has a lesson plan. They click the "Differentiate" button.
      * The app—*because it has ingested Louisiana's official guidelines for accommodations*—instantly generates three new versions of that lesson.
      * It's not just "simpler text." It's pedagogically-sound differentiation: "Here is the ELL version with key vocabulary pre-defined," "Here is the IEP version with the task 'chunked' into smaller steps," and "Here is the Gifted version with a new extension activity."
  * **Why This Matters:** This solves a problem that non-educator developers *don't even know exists*. It saves the teacher from their most time-consuming, complex task. This is the real work of teaching—differentiation that actually works.

-----

## Launch Strategy: "We're Not Waiting for LDOE"

### Core Positioning

**"We're Not Waiting for LDOE"**

Louisiana teachers are using AI tools RIGHT NOW. But LDOE hasn't given us clear guidance. So we're building it ourselves—Louisiana educators, for Louisiana educators.

### Launch Philosophy: Authentic & Organic

**Old Approach (Formal):**
- Wait until Nov 25 for "launch day"
- Automated email sequences  
- Corporate positioning
- Formal pilot programs

**New Approach (Organic):**
- Start TODAY with 5 committed educators
- Real conversations over automation
- "We're Not Waiting for LDOE" positioning
- Relationship-based growth

### How We Talk About This

**Landing Page Hero:**
> "We're Not Waiting for LDOE"
> 
> Louisiana teachers are using AI tools RIGHT NOW. But LDOE hasn't given us clear guidance. So we're building it ourselves—Louisiana educators, for Louisiana educators.

**Tech Facilitator Conversation:**
> "You know how teachers are anxious about using AI without guidance? I built something. [Teacher] has been testing it for 2 weeks. Want to hear their experience?"

**Peer-to-Peer:**
> "I was spending 45 minutes unpacking standards. This framework got me there in 5 minutes. Want to try it?"

### Launch Timeline (Starting TODAY)

- **Today:** Send message to 5 educators ✅
- **This Week:** Daily check-ins, collect feedback
- **Week 2:** Gather testimonials, update landing page with "We're Not Waiting for LDOE" messaging
- **Week 3:** Organic referrals, newsletter snippet
- **Week 4:** Tech facilitator meeting prep
- **Dec 16-31:** Scale to 30-50 users through word-of-mouth

### Launch Message Template

```
Subject: Ready to dive in?

Hey [Name],

You said you were ready to try Pelican AI. Let's do it.

Here's your login: [link]

Start here:
1. Log in
2. Go to Framework Library
3. Try the "Lesson Objective Unpacker" with something you're 
   actually planning this week
4. Tell me: Did this help or waste your time?

No formal training. No big onboarding. Just try it and tell me
what you think.

We're tired of waiting for LDOE to give us guidance on AI tools.
Let's figure this out ourselves.

— Randall

P.S. — You're one of 5 educators I'm starting with. Your feedback
will literally shape everything about this platform.
```

### How We Grow (Organically)

**Real Testimonials:**
- Beta user feedback (Week 2)
- Professional credibility quotes (from existing relationships)
- Remove ALL placeholder content

**Landing Page Updates:**
- Authentic hero section addressing LDOE guidance gap
- Founder story component
- Honest numbers (5 educators building together, not fake inflated numbers)
- FAQ addressing why not wait for LDOE

**Tech Facilitator Meeting:**
- 10-minute conversational share (not corporate pitch)
- Teacher testimonial as proof
- One-page handout with QR code
- Natural peer conversation

**Organic Growth:**
- "Who else needs this?" conversations
- Department and school-level spread
- Newsletter mention (if approved)
- No growth hacks or incentives

### What This Changes

1. **No more waiting** - Start today with real users
2. **Authentic positioning** - LDOE guidance gap is your differentiator  
3. **Real relationships** - Personal conversations > automated systems
4. **Honest numbers** - 3 users testing > fake social proof
5. **Organic growth** - Teacher recommendations > marketing hacks

### Launch Targets

- **Week 1:** 3 committed beta users
- **Week 2:** Collect authentic testimonials
- **Week 3:** 5-10 users through organic referrals
- **Week 4:** Tech facilitator meeting
- **Dec 16-31:** 30-50 users through word-of-mouth

-----

## What We're Building

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

  * Beta user management (starting with 5 educators)
  * Content moderation (testimonials, innovations)
  * Basic analytics (honest numbers, not inflated metrics)
  * Access control (teacher/coach/admin roles)

-----

## How We Know It's Working

### Early-Stage Indicators (Starting with 3 Users)

  * **Real Feedback:** "Did this help or waste your time?" (brutally honest)
  * **Actual Usage:** Are they using frameworks? What worked? What didn't?
  * **Time Saved:** Specific examples ("14.5 minutes per lesson" not generic claims)
  * **Word-of-Mouth:** "Who else needs this?" conversations happening

### Technical Performance

  * Page Load Time: <3 seconds on 3G connection
  * Email Delivery: <10 seconds for transactional emails
  * API Response: <500ms for critical operations
  * WCAG 2.1 Level AA: Compliant

### Quality Standards

  * **Honest Numbers:** 3 users testing, not fake social proof
  * **Real Testimonials:** Specific quotes with names, not placeholders
  * **Authentic Communication:** Teacher-to-teacher, not corporate speak
  * **Iterative Improvement:** Platform evolves based on real educator needs

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
  * `ARCHITECTURE_VALIDATION.md` - Architecture validation for scaling
  * `docs/README.md` - Documentation index

### Documentation

  * **[PROJECT.md](PROJECT.md)** - Main project context (you are here!)
  * **[ARCHITECTURE_VALIDATION.md](ARCHITECTURE_VALIDATION.md)** - Scaling validation
  * **[docs/README.md](docs/README.md)** - Documentation index
  * **[docs/PELICAN_AI_BETA_CORE_FRAMEWORKS.md](docs/PELICAN_AI_BETA_CORE_FRAMEWORKS.md)** - Framework specifications

**Note:** Convex auto-generates API types from `convex/schema.ts` - see `_generated/api.d.ts` for complete type definitions.

-----

## Next Steps

### Immediate Actions (TODAY)

1.  **Launch to 5 Educators:** Send launch message to committed colleagues
2.  **Personal Check-ins:** Real conversations, not automated emails
3.  **Collect Feedback:** "Did this help or waste your time?"

### Week 1-2

1.  **Authentic Testimonials:** Gather beta user feedback and professional credibility quotes
2.  **Landing Page Update:** Add "We're Not Waiting for LDOE" hero section and founder story
3.  **Monitor & Iterate:** Real-time feedback shaping platform development

### Week 3-4

1.  **Organic Referrals:** "Who else needs this?" conversations
2.  **Tech Facilitator Meeting:** 10-minute conversational share with teacher testimonial
3.  **Newsletter Mention:** If approved, authentic mention of platform

### December 2025

1.  **Scale Organically:** 30-50 users through word-of-mouth
2.  **Continue Iteration:** Platform evolves based on real educator needs
3.  **Build Community:** Teacher-to-teacher recommendations drive growth

-----

*This document reflects Pelican AI as a grassroots effort—Louisiana educators building solutions for Louisiana educators. We're starting with 5 educators and building together.*