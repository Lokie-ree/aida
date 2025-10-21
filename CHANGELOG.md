# Changelog

All notable changes to the Pelican AI project.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Documentation Consolidation

**Status:** ✅ **COMPLETED** - Documentation Structure Refinement

**Date:** 2025-10-20

**Impact:** Improved documentation clarity, eliminated redundancies, streamlined agent system

**Key Changes:**
- Consolidated documentation structure (`.cursorrules`, `AGENT.md`, agent rules)
- Archived outdated `docs/README.md` (replaced by main `README.md`)
- Updated test coverage references to use `scripts/README.md` as single source of truth
- Streamlined `CONTRIBUTING.md` with consolidated best practices
- Created comprehensive documentation consolidation summary

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
