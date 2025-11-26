# Pelican AI Documentation

**Streamlined Documentation - Essential Living Docs Only**

---

## Core Documentation

### [CLAUDE.md](../CLAUDE.md)
**AI Assistant Guide** - Essential patterns, conventions, and constraints for working with the Pelican AI codebase.
- Architecture patterns (queries, mutations, actions)
- Code conventions (TypeScript, components, DB queries)
- Critical constraints (FERPA, positioning, platform-agnostic)
- Quick reference (commands, files, concepts)

### [PROJECT.md](../PROJECT.md)
**Project Vision & Strategy** - Mission, brand voice, launch strategy, and system overview.
- Vision and mission
- Brand voice and tone
- Launch strategy ("We're Not Waiting for LDOE")
- Current system snapshot
- What makes this different

### [ROADMAP.md](ROADMAP.md)
**Development Roadmap** - Current sprint, future improvements, and long-term vision.
- Current work in progress (Alignment Scorecard, Knowledge Base cleanup)
- Beta launch timeline (December 1, 2025)
- Long-term vision (Spring 2026 testimonials, Summer 2026 conferences)
- Future enhancement ideas

---

## Reference Documentation

### [ROADMAP.md](ROADMAP.md)
**Development Roadmap** - Current sprint, future improvements, and long-term vision.
- Referenced in CLAUDE.md for active development planning

### [REFACTOR.md](REFACTOR.md)
**Technical Debt Tracking** - Refactoring plan and status.
- Referenced in CLAUDE.md for technical debt management

### [RAG_PLAN.md](RAG_PLAN.md)
**RAG Implementation Plan** - Detailed technical plan for Louisiana Standards RAG system.
- Key constraints and patterns consolidated in CLAUDE.md
- Detailed implementation guidance remains here for reference

### [IT_WHITELISTING.md](IT_WHITELISTING.md)
**IT Whitelisting Guide** - Domain whitelisting instructions for school districts.
- Quick reference in CLAUDE.md deployment section
- Full guide here for IT administrators

### [RUBRIC_INTEGRATION_GUIDE.md](RUBRIC_INTEGRATION_GUIDE.md)
**Rubric Integration Guide** - Comprehensive guide to Louisiana Educator Rubric integration.
- Strategic vision in PROJECT.md
- Technical implementation details in CLAUDE.md
- Full comprehensive guide here for deep reference

### [TESTING.md](TESTING.md)
**Testing Quick Reference** - Legacy testing guide.
- Content consolidated into CLAUDE.md testing section
- Kept for historical reference

---

## Quick Commands

```bash
# Development
pnpm dev                    # Start frontend + backend
npx convex dashboard        # Open Convex dashboard

# Testing
pnpm test:once              # Run unit tests
pnpm test:coverage          # Generate coverage report

# Deployment
npx convex deploy           # Deploy backend to production
git push                    # Vercel auto-deploys frontend

# Environment Variables
npx convex env set WEEKLY_EMAILS_ENABLED true   # Enable weekly emails
npx convex env set RESEND_TEST_MODE false       # Disable email test mode
```

---

## Documentation Philosophy

**Keep it minimal.** Living documentation should be:
- **Essential** - Only what's needed for development
- **Current** - Actively maintained and updated
- **Concise** - Patterns over prescriptions
- **Single Source** - No duplication across files

**Source of Truth:**
- Database schema: `convex/schema.ts`
- API types: `convex/_generated/api.d.ts` (auto-generated)
- Project vision: `PROJECT.md`
- Development patterns: `CLAUDE.md`

---

**Last Updated:** November 25, 2025
**Version:** 3.2.0 - Consolidated documentation: Testing, IT operations, and RAG details moved to CLAUDE.md
