# Changelog

All notable changes to the AI for LA Educators project.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Next: Phase 5 - Software Engineering
- Implement new database schema (6 tables)
- Build backend APIs (frameworks, testimonials, innovations, beta program)
- Create frontend components and pages
- Beta launch preparation

---

## [0.5.0] - 2025-01-27 - Spaces Cleanup Complete

### Removed
- **Spaces Concept**: Complete removal of collaborative workspace functionality
- **Space Management**: All space creation, membership, and invitation features
- **Complex Design System**: Simplified from custom tokens to standard Tailwind CSS
- **Unused Components**: PDDemoSetup, SpaceSelector, SpaceTemplateSelector
- **Database Tables**: `spaces` and `spaceMembers` tables
- **Database Fields**: All `spaceId` references from documents, messages, feedback, and audit logs

### Changed
- **App Direction**: Transitioned from collaborative to individual educator focus
- **Branding**: Updated from "A.I.D.A." to "EdCoachAI" throughout
- **Authentication**: Migrated to Better Auth with simplified user management
- **Database Schema**: Removed 8 space-related indexes, simplified queries
- **Frontend Components**: 15+ components updated to remove space dependencies
- **Design System**: Simplified to use shadcn/ui defaults and standard Tailwind classes

### Fixed
- **Build Issues**: Resolved all TypeScript compilation errors
- **Lint Issues**: Fixed all ESLint and type checking errors
- **Tailwind v4 Compatibility**: Updated CSS and configuration for Tailwind CSS v4
- **Component Props**: Simplified component interfaces by removing space-related props

### Technical Details
- **Files Deleted**: 6 files (spaces.ts, 3 components, 2 design system files)
- **Files Modified**: 25+ files across backend and frontend
- **Database Indexes Removed**: 8 space-related indexes
- **Build Status**: ✅ Successful (728.04 kB bundle)
- **Type Check**: ✅ No errors
- **Convex Functions**: ✅ All 42 functions deployed successfully

---

## [0.4.0] - 2025-10-05 - Phase 4 Complete

### Added
- Implementation plan (7-week guide)
- System architecture document
- Clean documentation structure
- Architecture Decision Records (ADRs)

### Changed
- Organized documentation into living vs. archived
- Simplified maintenance approach

---

## [0.3.0] - 2025-10-04 - Phase 3 Complete

### Added
- Design system with Louisiana brand
- User flows and interaction patterns
- Accessibility standards (WCAG 2.1 AA)

---

## [0.2.0] - 2025-10-03 - Phase 2 Complete

### Added
- Product requirements document
- Two-hub structure (AI Basics + Instructional Expert)
- Framework-based content approach
- Beta program plan (50 educators, 3 months)

---

## [0.1.0] - 2025-10-02 - Phase 1 Complete

### Added
- Strategic positioning and philosophy
- Brand guidelines (Louisiana Gold, Lexend/Poppins)
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

**For detailed planning documentation, see `docs/planning/v0.4.0/`**
