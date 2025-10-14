# Changelog

All notable changes to the Pelican AI project.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Phase 1 MVP - Beta Launch Preparation

**Status:** ✅ Ready for Beta Launch

**Target:** Validate email-first approach with 20+ Louisiana educators

**Key Metrics:**
- 75%+ weekly email open rate over 4 weeks
- 80%+ report 10+ minutes saved per prompt
- 90%+ satisfaction rating

---

## [1.0.0] - 2025-10-14 - Phase 1 MVP Complete

### Authentication & User Experience Fixes

**Critical Issues Resolved:**
- ✅ **Auto-login after signup** - Users now seamlessly transition from signup to dashboard
- ✅ **Complete beta signup form** - All required fields (name, email, school, subject) collected
- ✅ **Accessibility improvements** - Semantic HTML for better screen reader support
- ✅ **Admin dashboard access** - Email allowlist system for admin control

**Related:** ADR-008, WEB-10, WEB-11, WEB-13, WEB-14

### Documentation Overhaul

**Created:**
- `AUTHENTICATION-ARCHITECTURE.md` - Comprehensive authentication guide
- `AUTH-FIXES-SUMMARY.md` - Testing and troubleshooting guide
- `QA-AUDIT-REPORT-2025-10-14.md` - Complete QA audit results
- `ADR-008` - Authentication Flow Fixes decision record

**Archived:**
- Historical migration summaries (completed work)
- Superseded readiness reports (replaced by QA audit)

### Technical Details

**Files Modified:** 3  
**Files Created:** 6 (documentation)  
**Lines Changed:** +1,647 / -62  
**Test Coverage:** 100% pass rate on E2E tests

---

## [0.9.0] - 2025-10-11 - Email-First Beta Flow

### Added

**Email System:**
- React Email components for professional, branded emails
- `BetaWelcomeEmail.tsx` - Welcome email for new beta signups
- `PlatformAccessEmail.tsx` - Credentials email for approved users
- Email webhook handling for delivery status tracking

**Beta Approval Workflow:**
- Manual approval process (pending → approved)
- Admin control over platform access
- Two-stage email flow (welcome → access)

**Related:** ADR-007

### Changed

**Beta Signup Flow:**
- Status now defaults to `"pending"` (not auto-approved)
- Simple confirmation message on signup (no credentials displayed)
- Admin reviews and approves each signup before access granted

**Node.js Architecture:**
- Proper separation: actions in `email.ts`, mutations in `emailEvents.ts`
- Fixed Node.js runtime constraint issues

### Technical Details

**Files Created:** 3 (email components, webhook handler)  
**Files Modified:** 4 (backend, frontend, docs)

---

## [0.8.0] - 2025-10-10 - Authentication Flow Resolution

### Fixed

**Authentication Issues:**
- User account creation now works via `createUserDirectly` mutation
- Session management updated to use `authClient.useSession()`
- CORS configuration fixed for local development
- Auto-initialization of user profiles and beta program records

**Related:** ADR-006

### Added

**Workarounds:**
- Internal API approach for user creation (bypasses broken HTTP endpoints)
- Manual profile creation (triggers don't fire with internal API)

**Database Migration:**
- Added `authId` field to `userProfiles` table (Better Auth 0.9 compatibility)
- Updated triggers to use both `userId` (legacy) and `authId` (new)

### Technical Details

**Status:** Complete signup-to-dashboard flow functional  
**Impact:** Beta program unblocked, ready for launch

---

## [0.7.0] - 2025-10-06 - Better Auth Migration

### Changed

**Authentication System:**
- Migrated from `@convex-dev/auth` to Better Auth
- Created `convex/auth.config.ts` with Better Auth provider config
- Implemented email/password authentication (no verification for beta)
- Set up HTTP routes with CORS support

**Related:** ADR-004

### Added

**Frontend Integration:**
- `src/lib/auth-client.ts` - Better Auth client with Convex plugins
- `src/main.tsx` - ConvexBetterAuthProvider setup
- Updated all auth-related components (AuthModal, SignIn, SignOut)

**Documentation:**
- `docs/BETTER_AUTH_SETUP.md` - Complete setup guide

### Technical Details

**Migration Status:** ✅ Complete  
**Authentication Flow:** Sign up → Sign in → Dashboard → Sign out (all working)

---

## [0.6.0] - 2025-10-05 - Architecture & Content Foundation

### Added

**Architecture Decisions:**
- ADR-001: Use Convex for Backend
- ADR-002: Extend A.I.D.A. Codebase
- ADR-003: Framework-Based Content Structure

**Documentation:**
- Implementation plan (7-week guide)
- System architecture document
- Clean documentation structure

### Changed

- Organized documentation into living vs. archived
- Simplified maintenance approach

---

## [0.5.0] - 2025-01-27 - Landing Page & Brand Refresh

### Added

**Complete Landing Page:**
- Hero section with platform-agnostic messaging
- 6 core benefits section
- Louisiana framework examples
- Beta signup form with Convex integration
- Testimonials section
- FAQ section
- Footer with navigation

**Framer Motion Animations:**
- Fade-in-up animations
- Scroll-triggered animations
- Hover effects and transitions

### Changed

**Project Identity:**
- Name: "aida-ixp" → "Pelican AI"
- Focus: Platform-agnostic AI guidance for Louisiana educators
- Value Proposition: Works with ANY AI tool, Louisiana-aligned, ethical guardrails

**Design System:**
- Removed gradients for better performance
- Solid color usage throughout
- Simplified shadow system

### Technical Details

**Component:** `src/components/shared/LandingPage.tsx`  
**Lines of Code:** 690+ lines  
**Sections:** 7 major sections  
**Accessibility:** WCAG 2.1 AA compliant

---

## [0.4.0] - 2025-01-27 - Spaces Cleanup

### Removed

**Deprecated Features:**
- Spaces concept (collaborative workspace functionality)
- Space management, membership, invitations
- Database tables: `spaces`, `spaceMembers`
- All `spaceId` references from database

**Unused Components:**
- PDDemoSetup
- SpaceSelector
- SpaceTemplateSelector

### Changed

**App Direction:**
- From collaborative workspaces → individual educator focus
- Simplified authentication and user management
- Removed 8 space-related database indexes

### Technical Details

**Files Deleted:** 6  
**Files Modified:** 25+  
**Build Status:** ✅ Successful (728.04 kB bundle)

---

## [0.3.0] - 2025-10-04 - Design System

### Added

- Design system with Louisiana brand identity
- Pelican Blue (#0ea5e9), Louisiana Gold (#f59e0b)
- Typography: Lexend (primary), Poppins (headings)
- User flows and interaction patterns
- Accessibility standards (WCAG 2.1 AA)

---

## [0.2.0] - 2025-10-03 - Product Requirements

### Added

- Product requirements document
- Two-hub structure (AI Basics + Instructional Expert)
- Framework-based content approach
- Beta program plan (50 educators, 3 months)

---

## [0.1.0] - 2025-10-02 - Strategic Foundation

### Added

- Strategic positioning and philosophy
- Brand guidelines
- AI guidance analysis (state best practices)
- Orchestrator workflow configuration

---

## [0.0.1] - 2025-10-01 - Project Start

### Added

- A.I.D.A. codebase baseline
- Convex backend (auth, database)
- React frontend with shadcn/ui
- Initial repository setup

---

## Documentation

**For detailed architectural decisions:** See `docs/decisions/`  
**For authentication guide:** See `docs/AUTHENTICATION-ARCHITECTURE.md`  
**For testing documentation:** See `scripts/README.md`  
**For QA audit:** See `scripts/QA-AUDIT-REPORT-2025-10-14.md`

---

## Version Numbering

**Format:** MAJOR.MINOR.PATCH (Semantic Versioning)

- **MAJOR:** Breaking changes, major feature releases
- **MINOR:** New features, non-breaking changes
- **PATCH:** Bug fixes, minor improvements

**Current:** v1.0.0 (Phase 1 MVP - Beta Launch Ready)  
**Next:** v1.1.0 (Post-beta improvements)
