# Changelog

All notable changes to the Pelican AI project.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### In Progress: Phase 5 - Software Engineering
- ✅ Component reorganization (feature-based folders)
- ✅ Better Auth migration complete
- ✅ Implement new database schema (6 tables)
- ✅ Build backend APIs (frameworks, testimonials, innovations, beta program)
- ✅ Create frontend components and pages
- ✅ Beta acceptance flow authentication (resolved Oct 10, 2025)
- ✅ Email-first beta signup flow (completed Oct 11, 2025)
- 🔄 Beta launch preparation (build configuration in progress)

### Completed
- **Email-First Beta Signup Flow (Oct 11, 2025)**: Refactored beta signup to follow Phase 1 MVP vision
  - **Manual Approval Process**: Beta signups now create "pending" status records requiring admin approval
  - **React Email Components**: Created `BetaWelcomeEmail.tsx` and `PlatformAccessEmail.tsx` for professional, branded emails
  - **Email Webhook Handling**: Implemented delivery status tracking via Resend webhooks
  - **Node.js Runtime Architecture**: Proper separation of actions (`email.ts`) and mutations (`emailEvents.ts`)
  - **Simplified Landing Page**: Removed credential display, added simple confirmation message
  - **Two-Stage Email Flow**: Welcome email on signup, platform access email on approval
  - **Admin Control**: Full control over when teachers gain access to the platform
  - **Status**: ✅ Beta program ready for launch with quality control in place
- **Authentication Flow Resolution (Oct 10, 2025)**: Complete resolution of beta acceptance flow issues
  - **Internal API Workaround**: Created `createUserDirectly` mutation to bypass broken HTTP endpoints
  - **Manual Profile Creation**: Implemented manual profile creation since triggers don't fire with internal API calls
  - **CORS Configuration**: Fixed local development CORS issues and added `http://localhost:5175` to trusted origins
  - **Better Auth Configuration**: Fixed `baseURL` to use frontend URL instead of Convex backend URL
  - **Session Management**: Updated from deprecated `loggedInUser` to `authClient.useSession()`
  - **Database Migration**: Added `authId` field to `userProfiles` table for Better Auth 0.9 compatibility
  - **Error Handling**: Comprehensive error handling and user feedback throughout auth flow
  - **Status**: ✅ Complete signup-to-dashboard flow functional, beta program ready for launch
- **Documentation Update (Oct 10, 2025)**: Comprehensive documentation cleanup and organization
  - **README.md**: Updated to accurately reflect all existing documentation files
  - **ADR 006**: Updated status from "Investigation Complete" to "Resolved"
  - **Documentation Inventory**: Catalogued all 14 markdown files across core docs, ADRs, and testing
  - **Quick Start Guides**: Enhanced role-based navigation paths
  - **Project Structure**: Updated to show complete documentation ecosystem
- **Phase 5 P0 Implementation**: Complete implementation of all 12 critical features for beta launch
  - **Database Seeding**: 10+ Louisiana-aligned frameworks with comprehensive content
  - **User Profile Management**: Complete profile system with API and UI
  - **Framework Library**: Full browsing, filtering, and detail views
  - **Beta Onboarding**: 4-step onboarding flow with email integration
  - **Email System**: Welcome emails, weekly prompts, and beta invites via Resend
  - **Innovation Sharing**: Community features for sharing AI-powered innovations
  - **Testimonials**: Collection and display system for user testimonials
  - **Admin Panel**: Content moderation and beta user management
  - **Time Tracking**: Time savings tracking and analytics
  - **Navigation**: Complete app navigation and routing system
  - **Landing Page**: Enhanced beta signup with value proposition
  - **Error Handling**: Comprehensive error boundaries and loading states
- **Component Organization**: Reorganized components into feature-based folders
  - `src/components/auth/` - Authentication components
  - `src/components/community/` - Community features
  - `src/components/dashboard/` - Dashboard components
  - `src/components/framework/` - Framework-related components
  - `src/components/legacy/` - Legacy components (Voice, Spaces)
  - `src/components/shared/` - Shared components
- **Better Auth Migration**: Successfully migrated from Convex Auth to Better Auth (see ADR 004)

---

## [2.0.0] - 2025-10-06 - Pelican AI Landing Page Complete

### Added
- **Complete Landing Page**: Production-ready marketing page aligned with brand guidelines
  - Hero section with platform-agnostic AI guidance messaging
  - Features section showcasing 6 core benefits from brand guidelines
  - Louisiana Framework Examples section with real pain points and AI solutions
  - Beta Signup section with working Convex integration
  - Testimonials section with Louisiana educator quotes
  - FAQ section addressing common concerns
  - Final CTA section with clean design
  - Complete footer with navigation links
- **Framer Motion Animations**: Smooth page animations and transitions
  - Fade-in-up animations for sections
  - Staggered children animations for cards
  - Scroll-triggered animations
  - Hover effects and transitions
- **Simplified Design System**: Clean, professional color scheme
  - Removed all gradients for better performance
  - Solid primary color usage throughout
  - Clean typography with standard foreground colors
  - Simplified shadow system

### Changed
- **Project Name**: "aida-ixp" → "edcoachai" (package.json)
- **Description**: Updated to reflect AI-powered instructional coaching platform
- **Landing Page Focus**: Platform-agnostic AI guidance for Louisiana educators
- **Value Proposition**: 
  - Platform-agnostic guidance (works with ANY AI tool)
  - Louisiana standards aligned
  - Ethical guardrails built-in
  - 3-5 hours saved per week
- **Target Audience**: All Louisiana educators (not just coaches)
- **Color Scheme**: Simplified from gradients to solid colors
  - Primary blue for all interactive elements
  - Clean foreground colors for text
  - Simplified shadow system
- **README.md**: Updated to reflect current focus
- **Dependencies**: Updated 20+ packages to latest versions
- **Design System**: Updated CSS with cleaner color palette and simplified shadows

### Removed
- **Gradient Effects**: All gradient backgrounds and text effects
- **Complex Color Schemes**: Simplified to basic primary/accent colors

### Technical Details
- **Component**: `src/components/LandingPage.tsx` (completely rewritten)
- **Dependencies**: Updated 20+ packages to latest versions
- **Lines of Code**: 690+ lines of production-ready React code
- **Sections**: 7 major sections (Hero, Features, Louisiana Examples, Beta Signup, Testimonials, FAQ, CTA, Footer)
- **Animations**: Motion variants with viewport detection
- **Responsive**: Mobile-first design with breakpoints
- **Accessibility**: WCAG 2.1 AA compliant interactions
- **Performance**: Simplified CSS for faster loading

### Documentation
- **landing-inspiration.json**: 532 lines of comprehensive documentation
- **README.md**: Updated to reflect current platform focus
- **CHANGELOG.md**: Complete documentation of all changes

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

**For detailed architectural decisions, see `docs/decisions/`**
