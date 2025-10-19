# Changelog

All notable changes to the Pelican AI project.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Phase 2 UI Testing & CORS Fix

**Status:** ✅ **COMPLETED** - Phase 2 UI Testing and CORS Fix

**Date:** 2025-10-19

**Impact:** Critical infrastructure fixes, comprehensive Phase 2 feature validation, bug identification

**Key Deliverables:**
- CORS issues resolved with Better Auth integration
- Comprehensive QA testing of Phase 2 features (70% success rate)
- 3 critical bugs identified and documented in Linear
- Phase 2 UI routes exposed with React Router
- Complete testing infrastructure and bug reporting system

---

## [1.3.0] - 2025-10-19 - Phase 2 UI Testing & CORS Fix

### Added

**CORS Fix Implementation:**
- Official Better Auth route registration with CORS support
- `authComponent.registerRoutes()` method implementation
- Complete authentication system functionality restored

**Phase 2 UI Testing:**
- Comprehensive QA testing of all Phase 2 features
- 10 test cases covering authentication, framework library, community, and time tracking
- Automated testing with Playwright MCP
- Detailed bug reports with reproduction steps and impact assessment

**Linear Integration:**
- WEB-47: Framework Detail Modal Not Loading (High Priority)
- WEB-48: Share Innovation Form Select Component Error (High Priority)
- WEB-49: Header Intercepting Clicks on Record Time Button (Medium Priority)
- WEB-50: Phase 2 UI Exposure Testing Results Summary (High Priority)

**Documentation Updates:**
- ADR-011: CORS Fix and Phase 2 UI Testing Results
- MILESTONE-PHASE2-TESTING.md: Comprehensive testing milestone documentation
- Updated README.md with current project status and critical issues
- Updated CHANGELOG.md with recent changes

### Changed

**Authentication System:**
- CORS configuration fixed using official Better Auth method
- Authentication flow now fully functional
- Session management working correctly
- No more CORS errors during authentication

**Phase 2 UI Exposure:**
- React Router navigation implemented
- All Phase 2 UI components now accessible via routes
- Framework library, community, and time tracking pages exposed
- Dashboard integration with user profile data

**Testing Infrastructure:**
- Systematic testing approach implemented
- Bug reporting process established
- Quality assurance standards defined
- Test coverage and success metrics tracked

### Fixed

**Critical Infrastructure Issues:**
- CORS errors completely resolved
- Better Auth HTTP endpoints working correctly
- Authentication system fully functional
- Session management stable

**Phase 2 Feature Validation:**
- Framework library loading and display (7/10 tests passed)
- Search and filtering functionality working
- Dashboard integration and user profile loading
- Community page display and navigation
- Time tracking page display and statistics

### Known Issues

**Critical Bugs (Must Fix Before Launch):**
- Framework Detail Modal not loading (WEB-47)
- Share Innovation Form Select component error (WEB-48)
- Time Tracking Record button click interception (WEB-49)

### Technical Details

**Files Modified:** 3 (convex/http.ts, README.md, CHANGELOG.md)
**Files Created:** 3 (ADR-011, MILESTONE-PHASE2-TESTING.md, Linear issues)
**Test Success Rate:** 70% (7/10 tests passed)
**Critical Issues:** 3 high-priority bugs identified
**Authentication Status:** 100% functional after CORS fix

---

### Test Data Management & Recovery System

**Status:** ✅ **COMPLETED** - Test Data Isolation and Recovery System

**Date:** 2025-10-18

**Impact:** Enhanced data safety, improved test reliability, user data recovery capability

**Key Deliverables:**
- Test data isolation system with `isTestData` flags
- Centralized test data cleanup with safety verification
- User data recovery system for accidental deletions
- Enhanced test data management protocols
- Comprehensive documentation and procedures

---

## [1.2.0] - 2025-10-18 - Test Data Management & Recovery System

### Added

**Test Data Isolation System:**
- `isTestData: v.optional(v.boolean())` field added to all application tables
- Centralized cleanup system in `convex/testDataCleanup.ts`
- Safety verification before cleanup operations
- Comprehensive database state debugging tools

**Data Recovery System:**
- `recoverDeletedUser` mutation for restoring accidentally deleted users
- Data recovery procedures and documentation
- User data restoration workflows

**Enhanced Test Management:**
- Updated test fixtures to properly flag test data
- Centralized cleanup integration in test runner
- Safety warnings for potential real data
- Test data accumulation monitoring

### Changed

**Schema Updates:**
- All application tables now include `isTestData` optional field
- Backward compatible - existing data unaffected
- Query return types updated to include new field

**Test Data Creation:**
- All test data creation functions now set `isTestData: true`
- Test fixtures updated with proper flagging
- Mutation functions accept optional `isTestData` parameter

**Cleanup System:**
- Replaced individual cleanup functions with centralized system
- Enhanced safety verification and warning system
- Improved cleanup reporting and monitoring

### Security

**Data Protection:**
- Real user data protected from accidental deletion during testing
- Test data clearly isolated and safely manageable
- Recovery capability for accidental data loss
- Comprehensive safety checks and warnings

### Documentation

**New Documentation:**
- `docs/decisions/010-test-data-isolation-and-recovery.md` - ADR for test data system
- `docs/DATA-RECOVERY-GUIDE.md` - Comprehensive data recovery procedures
- Updated `scripts/test-data-cleanup-protocol.md` - Enhanced cleanup protocols
- Updated `README.md` - Test data management information

### Fixed

**Data Safety Issues:**
- Resolved accidental user data deletion during testing
- Fixed inconsistent test data cleanup process
- Eliminated risk of real data loss during test operations
- Improved test data identification and management

---

## [1.1.0] - 2025-10-15 - Phase 2 Planning Documentation

### Phase 2 Planning & Documentation

**Status:** 📋 Planning Phase 2 Development

**Target:** Expose existing Phase 2 features and begin user testing

**Key Deliverables:**
- Product Requirements Document (PRD) for Phase 2+
- Current system state documentation (Architect, UX/UI, Engineer perspectives)
- Phase 2 UI exposure plan
- Better Auth HTTP endpoint fixes

---

## [1.1.0] - 2025-10-15 - Phase 2 Planning Documentation

### Added

**Product Requirements Document:**
- Comprehensive PRD for Phase 2+ development
- Current system state analysis from multiple perspectives
- Feature prioritization and roadmap
- Success metrics and technical requirements

**System Documentation:**
- Architect perspective: Backend architecture, data models, API surface
- UX/UI Designer perspective: Design system, components, accessibility
- Engineer perspective: Implementation status, codebase structure, testing

**Phase 2 Readiness Assessment:**
- Backend: 100% complete (14 tables, 25+ functions)
- UI Components: 80% complete (built but not exposed)
- Testing: 72.7% pass rate (Better Auth issues identified)
- Email System: 100% complete (4 templates, automated flows)

### Changed

**Documentation Structure:**
- Updated PRD with current date (October 15, 2025)
- Next review scheduled for November 15, 2025
- Clear Phase 2 priorities identified

### Technical Details

**Files Created:** 1 (PRODUCT_REQUIREMENTS_DOCUMENT.md)  
**Files Modified:** 1 (CHANGELOG.md)  
**Status:** Phase 2 planning complete, ready for implementation

---

## [1.0.0] - 2025-10-14 - Phase 1 MVP Complete

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
