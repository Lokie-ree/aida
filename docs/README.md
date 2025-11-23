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

## Operational Reference

### [TESTING.md](TESTING.md)
**Testing Guide** - Quick reference for running tests and best practices.

### [IT_WHITELISTING.md](IT_WHITELISTING.md)
**IT Requirements** - Domain whitelisting for school districts.

### [RUBRIC_INTEGRATION_GUIDE.md](RUBRIC_INTEGRATION_GUIDE.md)
**Rubric Integration** - How the Louisiana Educator Rubric is infused throughout all platform features.

---

## Archived Documentation

### [archived/](archived/)
**Historical Reference** - Archived documentation for reference only.
- PELICAN_AI_BRAND_GUIDELINES.md - Detailed brand guidelines (reference)
- PELICAN_AI_BETA_CORE_FRAMEWORKS.md - Framework prompts (reference)
- ARCHITECTURE_VALIDATION.md - Point-in-time architecture validation (reference)
- launch/ - Pre-launch alignment documentation (November 2025)
- Decision records and historical context

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

**Last Updated:** November 23, 2025
**Version:** 3.1.0 - Updated for beta launch and rubric integration
