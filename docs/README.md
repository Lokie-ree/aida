# Pelican AI - Phase 1 MVP Documentation

**Mission:** Empower Louisiana educators with practical, ethical, and platform-agnostic AI guidance  
**Phase 1 Goal:** Validate email-first onboarding with 20+ beta testers, achieve 75%+ weekly email open rate over 4 weeks

## 🚀 Quick Start

### For Developers
1. **Setup:** `npm install && npx convex dev`
2. **Test:** `pnpm test:beta-auth` (72.7% success rate)
3. **Deploy:** `npx convex dev --once`

### For Beta Testers
1. **Signup:** Visit landing page → Beta signup form
2. **Wait:** Manual approval (24-48 hours)
3. **Access:** Email with temporary password
4. **Engage:** Weekly prompt emails

## 📁 Essential Documentation

### Core Architecture
- **[Authentication Architecture](AUTHENTICATION-ARCHITECTURE.md)** - Better Auth + Convex integration
- **[Brand Guidelines](PELICAN_AI_BRAND_GUIDELINES.md)** - Design system and voice

### Development
- **[Resend Testing](RESEND_TESTING.md)** - Email automation testing
- **[UI Healing System](UI_HEALING_SYSTEM.md)** - Interface audit protocol
- **[Git Workflow](GIT-WORKFLOW.md)** - Development process

### Decisions
- **[ADR-001: Convex Backend](decisions/001-use-convex-backend.md)**
- **[ADR-002: Extend AIDA Codebase](decisions/002-extend-aida-codebase.md)**
- **[ADR-004: Better Auth Migration](decisions/004-migrate-to-better-auth.md)**
- **[ADR-006: Beta Auth Investigation](decisions/006-beta-auth-investigation.md)**
- **[ADR-007: Email-First Beta Flow](decisions/007-email-first-beta-flow.md)**
- **[ADR-008: Auth Flow Fixes](decisions/008-authentication-flow-fixes.md)**

## 🎯 Phase 1 MVP Scope

**In Scope:**
- ✅ Beta invitation email system
- ✅ Simple web signup/auth flow (Better Auth)
- ✅ Automated welcome email
- ✅ Automated weekly prompt email (cron job)
- ✅ Database schema: users, userProfiles, betaSignups, sessions

**Out of Scope (Phase 2+):**
- ❌ Web dashboard
- ❌ Framework library UI
- ❌ Community features (innovations, testimonials)
- ❌ Admin panel
- ❌ Voice interface (Vapi)
- ❌ RAG system (OpenAI embeddings)

## 📊 Current Status

**Test Coverage:** 72.7% success rate  
**Critical Issues:** Better Auth HTTP endpoints (404 errors)  
**Next Steps:** Discord community consultation for HTTP routing fixes

## 🔧 Technical Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Convex (database, functions, scheduling)
- **Auth:** Better Auth (@convex-dev/better-auth)
- **Email:** Resend (automation)
- **Testing:** Custom test suite (unit, integration, E2E)

## 📞 Support

- **Discord:** [Convex Community](https://discord.gg/convex)
- **Issues:** GitHub Issues
- **Documentation:** This README + linked docs

---

*Last Updated: October 14, 2025*
