# Changelog

All notable changes to the Pelican AI project.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Comprehensive QA Testing & Audit

**Status:** ✅ **COMPLETED**

**Date:** November 4, 2025

**Impact:** Comprehensive QA audit completed across all four critical areas with browser testing and detailed findings documented

**Key Changes:**
- **Comprehensive QA Testing:**
  - ✅ Accessibility testing completed on all authenticated routes (Playwright MCP)
  - ✅ Responsiveness testing completed on mobile (375px) and tablet (768px) viewports
  - ✅ Performance testing completed with production build analysis
  - ✅ Edge cases testing completed with browser testing and code review
  - All test results documented in `docs/QA_AUDIT.md`

- **Accessibility Improvements:**
  - ✅ Skip link added and tested on all routes
  - ✅ Heading hierarchy fixed (H2 → H3 on landing page footer)
  - ✅ DialogDescription added to AuthModal for ARIA compliance
  - ✅ Autocomplete attributes added to form inputs
  - ⚠️ 2 icon buttons on frameworks page need `aria-label` (WEB-75)

- **Responsiveness Issues Found:**
  - ⚠️ Frameworks page: 173px horizontal scroll on mobile (CRITICAL - WEB-77)
  - ⚠️ Dashboard: 6px horizontal scroll on mobile
  - ⚠️ Community page: 23px horizontal scroll on mobile
  - ⚠️ Landing page: 6px horizontal scroll on mobile
  - ✅ Profile page: No horizontal scroll issues

- **Performance Analysis:**
  - ✅ Bundle sizes measured: 519KB main bundle (139KB gzipped)
  - ✅ Query optimization verified (Convex indexes in use)
  - ⚠️ Route-level code splitting needed (CRITICAL - WEB-76)
  - ⚠️ Image optimization recommended
  - ⚠️ Lighthouse audit needed on production build

- **Edge Cases Testing:**
  - ✅ Empty states tested (all pages handle empty data gracefully)
  - ✅ Error boundaries verified (ErrorBoundary component wraps App)
  - ✅ Form validation verified (Zod schemas with limits)
  - ⚠️ HTML `maxLength` attributes needed for better UX (WEB-78)
  - ⚠️ Browser compatibility testing needed
  - ⚠️ XSS testing needed (manual verification)

- **Linear Issues Created:**
  - WEB-75: Accessibility - WCAG 2.1 AA Compliance Improvements
  - WEB-76: Performance - Route-Level Code Splitting & Optimization (Urgent)
  - WEB-77: Responsiveness - Fix Horizontal Scroll Issues on Mobile (Urgent)
  - WEB-78: Edge Cases - Testing & Input Validation Improvements

- **Documentation:**
  - Updated `docs/QA_AUDIT.md` with comprehensive test results
  - Removed broken references to deleted `ACCESSIBILITY_TEST_RESULTS.md`
  - Updated dates and audit method in QA_AUDIT.md
  - All test results consolidated in single comprehensive document

### Documentation Consolidation (QA & Testing)

**Status:** ✅ **COMPLETED**

**Date:** November 3, 2025

**Impact:** Consolidated QA audit and testing documentation into single comprehensive documents

**Key Changes:**
- **QA Audit Consolidation:**
  - Consolidated `RESPONSIVENESS_AUDIT.md`, `ACCESSIBILITY_AUDIT.md`, `PERFORMANCE_AUDIT.md`, and `EDGE_CASES_AUDIT.md` into single `docs/QA_AUDIT.md`
  - Comprehensive QA report now includes all four audit areas (responsiveness, accessibility, performance, edge cases)
  - Fixed button overflow issues on mobile for FrameworkLibrary and InnovationList components
  - Added skip link for accessibility compliance
  
- **Testing Documentation Consolidation:**
  - Merged `CURRENT_STATUS.md` into `E2E_TEST_RESULTS.md` (status summary at top)
  - Merged `VITEST_BEST_PRACTICES.md` into `TESTING_PROTOCOL.md` (best practices section)
  - Updated `TESTING_QUICK_REFERENCE.md` to reference consolidated docs
  - Updated `docs/README.md` to reflect new structure

- **Removed Files:**
  - `docs/RESPONSIVENESS_AUDIT.md` (consolidated into QA_AUDIT.md)
  - `docs/ACCESSIBILITY_AUDIT.md` (consolidated into QA_AUDIT.md)
  - `docs/PERFORMANCE_AUDIT.md` (consolidated into QA_AUDIT.md)
  - `docs/EDGE_CASES_AUDIT.md` (consolidated into QA_AUDIT.md)
  - `docs/CURRENT_STATUS.md` (merged into E2E_TEST_RESULTS.md)
  - `docs/VITEST_BEST_PRACTICES.md` (merged into TESTING_PROTOCOL.md)
  - `docs/IMPLEMENTATION_SUMMARY.md` (redundant after consolidation)

- Updated root `README.md` to reference consolidated documentation structure

### Documentation Consolidation & CI/CD Setup

**Status:** ✅ **COMPLETED**

**Date:** November 1, 2025

**Impact:** Streamlined documentation to single source of truth, removed phase-specific language, added basic CI/CD

**Key Changes:**
- Created `PROJECT.md` - Single source of truth combining vision + current system snapshot
- Simplified `ARCHITECTURE.md` to ultra-lightweight reference (points to Convex schema)
- Created minimal `CONTRIBUTING.md` with essential guidelines
- Added GitHub Actions workflow for automated testing (`.github/workflows/test.yml`)
- Archived outdated documentation to `/docs/archived/pelican-ai/`:
  - `AGENT.md` (agent system no longer needed)
  - `docs/PROJECT_STATUS.md` (status now in PROJECT.md)
  - `docs/PRODUCT_REQUIREMENTS_DOCUMENT.md` (content consolidated into PROJECT.md)
  - `docs/CONTRIBUTING.md` (previous version)
  - `docs/TESTING_MIGRATION.md` (historical migration doc)
- Updated `README.md` to reference new documentation structure
- Removed all phase-specific language from active documentation

---

## [1.3.0] - 2025-10-19 - Phase 2 UI Testing & CORS Fix

### Added
- Official Better Auth route registration with CORS support
- Phase 2 UI routes exposed with React Router
- 3 critical bugs documented in Linear (WEB-47, WEB-48, WEB-49)
- ADR-011: CORS Fix and Phase 2 UI Testing Results
- Comprehensive testing milestone documentation

**See:** [MILESTONE-PHASE2-TESTING.md](docs/archive/milestones/MILESTONE-PHASE2-TESTING.md) for detailed testing results

### Fixed
- CORS errors completely resolved
- Better Auth HTTP endpoints fully functional
- Authentication system and session management stable

### Known Issues
- Framework Detail Modal not loading (WEB-47)
- Share Innovation Form Select component error (WEB-48)
- Time Tracking Record button click interception (WEB-49)

---

## [1.2.0] - 2025-10-18 - Test Data Management & Recovery System

### Added
- Test data isolation system with `isTestData` flags
- Centralized cleanup system with safety verification
- User data recovery system for accidental deletions
- ADR-010: Test Data Isolation and Recovery

**See:** [DATA-RECOVERY-GUIDE.md](docs/DATA-RECOVERY-GUIDE.md) for complete recovery procedures

### Fixed
- Resolved accidental user data deletion during testing
- Improved test data identification and management

---

## [1.1.0] - 2025-10-15 - Phase 2 Planning Documentation

### Added
- Comprehensive Product Requirements Document (PRD) for Phase 2+
- System state analysis and feature prioritization
- Phase 2 readiness assessment

**See:** [PRODUCT_REQUIREMENTS_DOCUMENT.md](docs/PRODUCT_REQUIREMENTS_DOCUMENT.md) for complete specifications

---

## [1.0.0] - 2025-10-14 - Phase 1 MVP Complete

### Added
- Auto-login after signup for seamless user experience
- Complete beta signup form with all required fields
- Admin dashboard with email allowlist system
- ADR-008: Authentication Flow Fixes

**See:** [MILESTONE-INFRASTRUCTURE-STABLE.md](docs/archive/milestones/MILESTONE-INFRASTRUCTURE-STABLE.md) for complete Phase 1 details

### Fixed
- Authentication flow and user experience issues
- Accessibility improvements for screen readers

---

## [0.9.0] - 2025-10-11 - Email-First Beta Flow

### Added
- React Email components for branded emails
- Beta approval workflow with two-stage email flow (welcome → access)
- Email webhook handling for delivery tracking
- ADR-007: Email-First Beta Flow

### Changed
- Beta signup flow now requires manual admin approval

---

## [0.8.0] - 2025-10-10 - Authentication Flow Resolution

### Added
- Internal API approach for user creation
- Database migration: `authId` field for Better Auth 0.9 compatibility
- ADR-006: Authentication Flow Investigation

### Fixed
- User account creation and session management
- CORS configuration for local development

---

## [0.7.0] - 2025-10-06 - Better Auth Migration

### Changed
- Migrated from `@convex-dev/auth` to Better Auth
- Implemented email/password authentication
- ADR-004: Migrate to Better Auth

### Added
- Better Auth client with Convex plugins
- HTTP routes with CORS support

---

## [0.6.0] - 2025-10-05 - Architecture & Content Foundation

### Added
- ADR-001: Use Convex for Backend
- ADR-002: Extend A.I.D.A. Codebase
- ADR-003: Framework-Based Content Structure
- System architecture document and implementation plan

---

## [0.5.0] - 2025-01-27 - Landing Page & Brand Refresh

### Added
- Complete landing page with platform-agnostic messaging
- Framer Motion animations and transitions

### Changed
- Project name: "aida-ixp" → "Pelican AI"
- Design system: Louisiana brand identity (Pelican Blue, Louisiana Gold)

---

## [0.4.0] - 2025-01-27 - Spaces Cleanup

### Removed
- Spaces concept (collaborative workspace functionality)
- Space-related database tables and components

### Changed
- Simplified to individual educator focus

---

## Earlier Versions (0.3.0 - 0.0.1)

**0.3.0** - Design system with Louisiana brand identity  
**0.2.0** - Product requirements and framework-based content approach  
**0.1.0** - Strategic foundation and brand guidelines  
**0.0.1** - Project initialization with A.I.D.A. codebase baseline

---

## Reference Documentation

- **Architecture Decisions:** [docs/decisions/](docs/decisions/)
- **Testing Documentation:** [scripts/README.md](scripts/README.md)
- **Data Recovery:** [docs/DATA-RECOVERY-GUIDE.md](docs/DATA-RECOVERY-GUIDE.md)
- **Milestone Archive:** [docs/archive/milestones/](docs/archive/milestones/)

---

## Version Numbering

**Format:** MAJOR.MINOR.PATCH (Semantic Versioning)

**Current:** v1.3.0 (Phase 2 UI Exposure)  
**Next:** v2.0.0 (Phase 2 Launch)
