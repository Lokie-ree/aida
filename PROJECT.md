# Pelican AI - Project Context

**Last Updated:** November 1, 2025  
**Status:** Beta Launch Ready

---

## Vision & Mission

### Vision
Navigate AI with Confidence - Every Louisiana educator equipped with practical, ethical, and platform-agnostic AI guidance.

### Mission
Empower Louisiana educators with practical, ethical, and platform-agnostic AI guidance that reclaims their time for high-impact teaching.

### Core Value Proposition
- **Platform-Agnostic:** Works with ANY AI tool (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.)
- **Louisiana-Aligned:** Built for Louisiana state standards and educator rubric
- **Ethical Guardrails:** Responsible AI use is built-in
- **Time-Saving:** Immediate, practical solutions for common tasks (3-5 hours/week savings target)

---

## User Personas

### Sarah Johnson - High School English Teacher, Jefferson Parish
- **Pain Points:** Overwhelmed by AI tools, lacks time for lesson planning, ethical concerns
- **Goals:** Save time on administrative tasks, improve lesson quality, use AI responsibly
- **Tech Comfort:** Moderate - uses district-provided tools

### Michael Chen - Elementary Math Teacher, Lafayette
- **Pain Points:** Struggles with AI prompt writing, wants Louisiana-specific guidance
- **Goals:** Differentiate instruction, create engaging activities, maintain academic integrity
- **Tech Comfort:** High - early adopter of new tools

### Dr. Lisa Rodriguez - Middle School Science Teacher, Baton Rouge
- **Pain Points:** Needs standards-aligned content, wants to share innovations
- **Goals:** Align with Louisiana standards, collaborate with peers, track impact
- **Tech Comfort:** High - tech-savvy educator

---

## Current System Snapshot

### Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Convex (real-time database + serverless functions)
- **Authentication:** Better Auth (@convex-dev/better-auth)
- **Email:** Resend API
- **Design:** Louisiana-branded, WCAG 2.1 AA compliant, mobile-first

### Deployment Environments
- **Development:** `kindly-setter.convex.cloud` (local dev + testing)
- **Production:** `outgoing-parttridge.convex.cloud` (live platform)
- **Frontend:** Vercel (preview/production deployments)

### Key Features Operational
- ✅ **Authentication:** Better Auth integration with email/password
- ✅ **Framework Library:** 80+ AI guidance frameworks with search, filter, copy functionality
- ✅ **Community Features:** Innovation sharing and testimonials
- ✅ **Dashboard:** Personalized dashboard with stats and quick start
- ✅ **Admin Dashboard:** Content moderation and beta program management
- ✅ **Email System:** Automated welcome emails and weekly prompts
- ✅ **User Profiles:** Extended educator data (school, subject, grade, district)

### Database Schema
See `convex/schema.ts` for the complete, self-documenting source of truth. Convex automatically generates API contracts from the schema.

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

## Feature Requirements

### Framework Library
- Browse, search, and filter AI frameworks by module, category, difficulty, tags
- Louisiana standards alignment indicators
- Platform compatibility tracking (works with ANY AI tool)
- Usage analytics and tracking
- One-click copy prompt functionality
- Saved frameworks persistence

### Community Features
- Innovation sharing system (submit, browse, filter, search)
- Testimonial submission and approval workflow
- Community interaction tracking (likes, views, shares)
- Louisiana context encouraged throughout

### Dashboard
- Personal progress tracking (frameworks tried, time saved, innovations shared)
- Time savings tracker (weekly/monthly/total views)
- Weekly engagement streak display
- Quick start experience with personalized recommendations
- Recently used frameworks

### Admin Dashboard
- Beta user management and approval workflow
- Content moderation (testimonials, innovations)
- Analytics and reporting
- Access control and role-based permissions

---

## Success Metrics & KPIs

### User Engagement
- Framework Usage: 50+ frameworks used per user per month
- Community Engagement: 25% of users share innovations
- Retention: 80% monthly active users

### Time Savings
- Average 3+ hours saved per week per educator
- 80%+ report immediate time savings (10+ minutes per prompt)

### Performance
- Page Load Time: <3 seconds on 3G connection
- Email Delivery: <10 seconds for transactional emails
- API Response: <500ms for critical operations
- Uptime: 99%+ target

### Quality
- User Satisfaction: 90%+ rating
- WCAG 2.1 Level AA: Compliant
- Test Coverage: ~88% unit coverage

---

## Competitive Analysis

### Direct Competitors
- **MagicSchool AI:** AI tool, not guidance
- **Brisk:** AI tool, not guidance
- **SchoolAI:** AI tool, not guidance

### Competitive Advantages
- **Platform-Agnostic:** Works with any AI tool
- **Louisiana-Specific:** Aligned to state standards
- **Educator-Led:** Built by educators for educators
- **Ethical Focus:** Responsible AI use built-in

---

## Technical Requirements

### Performance Requirements
- Page Load Time: <3 seconds on 3G connection
- Email Delivery: <10 seconds for transactional emails
- API Response: <500ms for critical operations
- Uptime: 99%+ target

### Security Requirements
- **FERPA Compliance:** All educator data protected
- **Authentication:** Secure session management via Better Auth
- **Data Privacy:** No data sharing without consent
- **Audit Logging:** Track sensitive operations
- **No PII in Logs:** FERPA-compliant logging practices

### Accessibility Requirements
- **WCAG 2.1 Level AA:** Mandatory compliance
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader:** Semantic HTML and ARIA labels
- **Color Contrast:** Minimum 4.5:1 for normal text

---

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
- `convex/schema.ts` - Database schema (source of truth for API contracts)
- `convex/auth.ts` - Authentication logic
- `src/lib/auth-client.ts` - Frontend auth client
- `docs/ARCHITECTURE.md` - Technical architecture reference
- `docs/TESTING_PROTOCOL.md` - E2E testing guide

### Documentation
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Minimal technical reference
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Development guidelines
- **[TESTING_PROTOCOL.md](docs/TESTING_PROTOCOL.md)** - E2E testing strategy
- **[PELICAN_AI_BRAND_GUIDELINES.md](docs/PELICAN_AI_BRAND_GUIDELINES.md)** - Design system
- **[decisions/](docs/decisions/)** - Architectural decision records (ADRs)

---

## Next Steps

1. **E2E Testing:** Execute comprehensive test protocol (see `TESTING_PROTOCOL.md`)
2. **Beta Launch:** Soft launch to initial beta testers
3. **Monitor & Iterate:** Gather metrics and user feedback

---

*This document provides a single source of truth for Pelican AI vision and current system state.*

