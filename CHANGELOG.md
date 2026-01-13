# Changelog

All notable changes to the Pelican AI project.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Phase 4: UX Polish & Mobile Improvements

**Status:** ✅ **COMPLETED**

**Date:** January 13, 2026

**Impact:** Enhanced mobile and tablet user experience with improved touch targets, collapsible long messages, better button layouts, and contextual tooltips.

**Key Features:**

**Touch Target Improvements:**
- ✅ **Example Prompt Chips:** Increased vertical padding from `py-1.5` to `py-2.5` and added `min-h-[44px]` for better mobile tapping
- ✅ **Button Alignment Fixes (Phase 3.1 Hotfix):** Adjusted button sizes for better visual balance
  - Rating buttons (thumbs up/down, copy) changed from `h-11 w-11` to `h-9 w-9` with `touch-manipulation`
  - Mobile menu 3-dot buttons optimized to `h-9 w-9` for better alignment with session rows
  - Sidebar 3-dot buttons reverted to default styling with built-in touch area expansion

**Content Management:**
- ✅ **Collapsible Long AI Responses:** Messages over 500 characters now show "Show more/less" toggle
  - Smooth height animation (6rem collapsed, auto expanded)
  - Reuses PromptLibrary expand/collapse pattern
  - Only applies to assistant messages (AI responses)
  - Improves mobile readability for long generated prompts

**Mobile Layout Improvements:**
- ✅ **Profile Page Buttons:** Buttons now stack vertically on mobile (`flex-col sm:flex-row`)
  - Better spacing on small screens
  - Horizontal layout preserved on tablet+
- ✅ **Phase Header Tooltip:** Added tooltip to phase badge showing description text on mobile
  - Provides context where description text is hidden on small screens
  - Uses consistent `delayDuration={300}` for tooltip timing

**Modified Files:**
- `src/components/coach/ChatInterface.tsx` - Example chips touch targets, collapsible messages, phase header tooltip
- `src/components/ui/button-group.tsx` - Responsive button stacking
- `src/components/layout/MobileMenu.tsx` - Button size adjustments (Phase 3.1)
- `src/components/layout/ConversationList.tsx` - Button alignment fixes (Phase 3.1)

**Dependencies:** None (used existing tooltip and animation libraries)

---

### Phase 3.1 Hotfix: Button Alignment

**Status:** ✅ **COMPLETED**

**Date:** January 13, 2026

**Impact:** Fixed button alignment issues identified after Phase 3, improving visual consistency and touch target balance across mobile interface.

**Key Changes:**
- ✅ **Rating Buttons:** Adjusted from 44px (`h-11 w-11`) to 36px (`h-9 w-9`) with `touch-manipulation` CSS for better visual balance
- ✅ **Mobile Menu 3-Dot Buttons:** Optimized size for better alignment with multi-line session rows
- ✅ **Sidebar 3-Dot Buttons:** Reverted to default `SidebarMenuAction` styling which has built-in touch area expansion via pseudo-elements

**Modified Files:**
- `src/components/coach/ChatInterface.tsx` - Rating button sizes
- `src/components/layout/MobileMenu.tsx` - 3-dot button sizes
- `src/components/layout/ConversationList.tsx` - Removed custom sizing override

---

### Phase 3: Mobile Polish

**Status:** ✅ **COMPLETED**

**Date:** January 13, 2026

**Impact:** Improved mobile user experience with better spacing, full-width menu, responsive refinement buttons, and enhanced touch targets.

**Key Features:**

**Mobile Layout Improvements:**
- ✅ **Mobile Input Area Spacing:** Added safe area inset padding (`env(safe-area-inset-bottom)`) for notched devices
  - Prevents content from being cut off by home indicators on modern phones
  - Improved bottom padding for better thumb accessibility
- ✅ **Mobile Menu Sheet Width:** Changed from fixed `w-[300px]` to responsive `w-full sm:w-[320px]`
  - Full-width menu on mobile for better readability
  - Session titles no longer truncate as aggressively
  - Better use of screen real estate on small devices
- ✅ **Prompt Card Refinement Buttons:** Changed to stacked layout on mobile with visible labels
  - Buttons now stack vertically with labels visible (previously horizontal scroll with icon-only)
  - Better discoverability and usability on mobile
  - Horizontal layout preserved on tablet+ screens
- ✅ **Touch Target Sizes:** Increased to 44px (`h-11 w-11`) for rating, copy, and menu buttons
  - Meets Apple HIG recommendations for minimum touch target size
  - Better tap accuracy on mobile devices
  - Note: Later adjusted in Phase 3.1 hotfix for visual balance

**Modified Files:**
- `src/components/coach/ChatInterface.tsx` - Input area safe padding, touch target sizes
- `src/components/coach/PromptLibrary.tsx` - Stacked refinement buttons on mobile
- `src/components/layout/MobileMenu.tsx` - Full-width menu, touch target sizes

**Dependencies:** None

---

### Phase 2: High-Impact Quick Wins

**Status:** ✅ **COMPLETED**

**Date:** January 13, 2026

**Impact:** Enhanced user experience with loading states, keyboard shortcuts, better error handling, and improved mobile input behavior.

**Key Features:**

**User Experience Enhancements:**
- ✅ **Example Prompt Chips:** Added 3 example prompt chips in empty state
  - Quick-start options for new users
  - "Help me teach RL.5.3 to struggling readers"
  - "Create an assessment for adding fractions"
  - "Differentiation ideas for mixed-ability class"
- ✅ **Rotating Placeholder Text:** 4 variations that rotate every 4 seconds
  - Keeps empty state engaging
  - Provides helpful hints about what to ask
- ✅ **Loading Skeletons:** Added loading states for conversation list
  - Shows `LoadingList` component while conversations load
  - Better perceived performance
  - Prevents blank screen during data fetching
- ✅ **Error Retry Mechanism:** Preserves user input on send failure
  - Input value restored if message send fails
  - Toast notification with retry action
  - Better error recovery UX
- ✅ **Copy Feedback Enhancement:** Visual feedback when copying prompts
  - Icon changes from Copy to Check on successful copy
  - Toast notification confirms copy action
  - Better user confidence in actions
- ✅ **Keyboard Shortcuts:** Added global keyboard shortcuts
  - `Cmd/Ctrl + K`: Start new chat
  - `Escape`: Close modals/dialogs
  - Power user efficiency improvements
- ✅ **Mobile Input Improvements:** Enhanced mobile keyboard behavior
  - `inputMode="text"` for appropriate keyboard
  - `autoComplete="off"` and `autoCorrect="off"` to prevent interference
  - `autoCapitalize="sentences"` for natural typing
- ✅ **Recent Sessions as Text Links:** Added clickable session links in empty state
  - Quick access to continue previous conversations
  - Better than hunting through menu

**New Files:**
- `src/hooks/useKeyboardShortcuts.ts` - Keyboard shortcut hook for global shortcuts

**Modified Files:**
- `src/components/coach/ChatInterface.tsx` - Example chips, rotating placeholders, error retry, copy feedback, keyboard shortcuts, mobile input attributes, recent sessions
- `src/components/layout/ConversationList.tsx` - Loading skeletons
- `src/components/shared/LoadingStates.tsx` - Loading skeleton components

**Dependencies:** None

---

### Phase 1: Critical First Impressions

**Status:** ✅ **COMPLETED**

**Date:** January 13, 2026

**Impact:** Improved accessibility and first-time user experience with better button labels, auto-focus, tooltips, and helpful guidance.

**Key Features:**

**Accessibility Improvements:**
- ✅ **Send Button Accessible Labels:** Added `aria-label` and `title` attributes
  - Clear labels for screen readers
  - Helpful tooltips showing current state (disabled, sending, ready)
  - Better accessibility compliance
- ✅ **Input Auto-Focus:** Input field automatically focuses on page load
  - Immediate typing capability
  - Better mobile experience (keyboard appears automatically)
  - Reduces friction for new conversations
- ✅ **Disabled Send Button Tooltip:** Explains why send button is disabled
  - "Type a message to send" when input is empty
  - "Sending..." when message is in flight
  - Better user guidance
- ✅ **Conversation Title Tooltips:** Added tooltips to conversation titles
  - Shows full title on hover/tap in mobile menu
  - Shows full title on hover in sidebar
  - Helps when titles are truncated

**Modified Files:**
- `src/components/coach/ChatInterface.tsx` - Send button labels, auto-focus, tooltips
- `src/components/layout/MobileMenu.tsx` - Conversation title tooltips
- `src/components/layout/ConversationList.tsx` - Conversation title tooltips

**Dependencies:** None

---

### Quick Refinement Buttons & Smart Profile Detection

**Status:** ✅ **COMPLETED**

**Date:** January 10-11, 2026

**Impact:** Major UX improvements for prompt refinement and profile completion. Users can now refine prompts with one click, and new users get automatic profile detection from their first message.

**Key Features:**

**Quick Refinement Buttons (Phase 1 & 2):**
- ✅ **One-Click Refinements in Chat:** After each generated prompt, users see refinement buttons
  - Universal: "Make shorter", "Add details", "Simplify"
  - Profile-locked: "Differentiate", "Align to standard" (unlock by completing profile)
- ✅ **Refinement Buttons in Prompt Library:** Refine saved prompts directly from My Prompts page
  - Creates new conversation with refined prompt
  - No hunting through chat history to iterate on saved work
- ✅ **Mobile-Responsive Design:** Icon-only buttons on mobile, horizontal scroll

**Smart Profile Detection:**
- ✅ **Auto-Detect Grade & Subject:** Parses user's first message for grade level and subject
  - Supports: "5th grade", "grade 5", "kindergarten", "pre-k", "middle school", etc.
  - Detects: Math, ELA, Science, Social Studies, Special Education, Arts, PE, World Languages
- ✅ **One-Click Profile Save:** Inline prompt offers to save detected info to profile
  - "We noticed you're teaching 5th Grade ELA. Save to profile?"
  - Immediately unlocks profile-locked refinement buttons
- ✅ **Non-Intrusive:** Only shows once, dismisses permanently with "Not now"

**Prompt Generation Improvements:**
- ✅ **Grade-Level RAG Filtering:** Standards search now filters by user's grade level
- ✅ **Profile Context Injection:** AI prompts include teacher's grade, subject, and school
- ✅ **Increased Token Limit:** Raised from 900 to 1200 to prevent prompt cutoff

**New Files:**
- `src/lib/profile-detection.ts` - Grade/subject detection patterns and localStorage utilities
- `src/components/coach/RefinementButtons.tsx` - Container for refinement button row
- `src/components/coach/RefinementButton.tsx` - Individual button with locked/unlocked states
- `src/components/coach/refinement-definitions.ts` - Button configs and prompt modifiers
- `src/components/ui/popover.tsx` - Radix UI Popover component

**Modified Files:**
- `src/components/coach/ChatInterface.tsx` - Added refinement buttons, profile detection UI
- `src/components/coach/PromptLibrary.tsx` - Added refinement buttons to saved prompts
- `convex/promptCoach.ts` - Added `refineFromLibrary` action, improved RAG filtering
- `convex/userProfiles.ts` - Added `getUserProfileByUserId` internal query

**Dependencies Added:**
- `@radix-ui/react-popover` - For locked button popovers

---

### Codebase Cleanup & Bug Fixes

**Status:** ✅ **COMPLETED**

**Date:** December 18, 2025

**Impact:** Fixed duplicate prompt saving bug, reorganized component structure for better maintainability, removed unused code, and standardized file naming conventions.

**Key Changes:**

**Bug Fixes:**
- ✅ **Duplicate Prompts Fix:** Added backend deduplication in `savePrompt` mutation
  - Checks for existing prompt with same `conversationId` and `promptText` before inserting
  - Returns existing prompt ID if duplicate is found
  - Previously, local state tracking (`savedPromptIndices`) reset on page refresh causing duplicates

**Component Reorganization:**
- ✅ **Auth/Dashboard/Routes → Shared:** Consolidated single-use folders into `shared/`
  - `auth/AuthModal.tsx` → `shared/AuthModal.tsx`
  - `dashboard/ProfileSettings.tsx` → `shared/ProfileSettings.tsx`
  - `routes/ProtectedRoute.tsx` → `shared/ProtectedRoute.tsx`
  - Removed empty `auth/`, `dashboard/`, `routes/` folders
- ✅ **Landing Page Consolidation:** Grouped all landing-related files in `landing/`
  - `shared/LandingPage.tsx` → `landing/LandingPage.tsx`
  - `data/landingPageContent.ts` → `landing/landing-page-content.ts`
  - Removed empty `data/` folder

**File Naming Conventions:**
- ✅ **Kebab-case for data files:** `landingPageContent.ts` → `landing-page-content.ts`

**Barrel Exports:**
- ✅ **Added index.ts to component folders:** Consistent exports across codebase
  - `src/components/landing/index.ts` - All landing components + content
  - `src/components/coach/index.ts` - ChatInterface, InlineProfilePrompt, PromptLibrary
  - `src/components/shared/index.ts` - All shared components

**Email Template Cleanup:**
- ✅ **Removed 5 unused email templates:**
  - `BetaWelcomeEmail.tsx` - Replaced by ApprovalNotificationEmail
  - `PlatformAccessEmail.tsx` - Replaced by ApprovalNotificationEmail
  - `OutreachEmail.tsx` - Cold outreach (deprioritized)
  - `FollowupEmail.tsx` - Cold follow-up (deprioritized)
  - `NetworkPartnerEmail.tsx` - Partnerships (deprioritized)
- ✅ **Active email templates:** MagicLinkEmail, ApprovalNotificationEmail, WeeklyPromptEmail (feature-flagged)

**Files Modified:**
- `convex/promptCoach.ts` (duplicate fix)
- `src/App.tsx` (import paths)
- `src/pages/ProfilePage.tsx` (import paths)
- `src/components/landing/*.tsx` (import paths)
- `src/emails/index.ts` (removed unused exports)

**Files Added:**
- `src/components/landing/index.ts`
- `src/components/coach/index.ts`
- `src/components/shared/index.ts`

**Files Removed:**
- `src/emails/BetaWelcomeEmail.tsx`
- `src/emails/PlatformAccessEmail.tsx`
- `src/emails/OutreachEmail.tsx`
- `src/emails/FollowupEmail.tsx`
- `src/emails/NetworkPartnerEmail.tsx`

---

### Beta Launch Preparation - Coach UX & System Prompt Enhancements

**Status:** ✅ **COMPLETED**

**Date:** December 3, 2025

**Impact:** Optimized Conversational Prompt Coach for STEM/SPED beta testers with improved mobile UX, reliable save functionality, and Louisiana-specific LER short code integration.

**Key Changes:**

**Chat Interface Improvements:**
- ✅ **Starter Prompts Optimized:** Changed from generic ELA/Math to STEM/SPED-focused examples
  - "Analyze LEAP data to identify misconceptions" (Assessment Data)
  - "Differentiate science lab for IEP students" (Special Education)
  - "Highly effective actions for PIC in STEM" (LER Evidence)
  - "Internalize 7th grade math standards (GLEs)" (Curriculum Mastery)
- ✅ **Pre-fill Functionality Fixed:** Added setTimeout(150ms) to ensure conversation creation before populating input field
- ✅ **Mobile UX Enhanced:** Shortened prompts from 60-100 characters to 30-50 characters for mobile screens
- ✅ **Save Button Always Available:** Removed heuristic detection - save button now appears on ALL assistant messages to prevent prompt loss

**System Prompt Enhancements (convex/promptCoach.ts):**
- ✅ **LER Short Code Integration:** Replaced numeric indicators with teacher-familiar short codes
  - Before: "Indicator 1.1", "Indicator 1.10"
  - After: "SO - Standards and Objectives", "TKS - Teacher Knowledge of Students"
- ✅ **Complete Short Code Reference:** Added organized list of all 23 LER indicators by domain
  - INSTRUCTION (12): SO, MS, PIC, LS, ACT, QU, FEED, GRP, TCK, TKS, TH, PS
  - PLANNING (3): IP, SW, AS
  - ENVIRONMENT (4): ES, ESMB, ENV, RC
  - PROFESSIONALISM (4): GDP, RT, SI, SR
- ✅ **Multi-Task Recognition:** Expanded from lesson planning focus to recognize diverse teaching tasks
  - Lesson planning, assessment data analysis, curriculum internalization
  - LER evidence gathering, differentiation, parent communication
  - Professional reflection and growth planning
- ✅ **4-Phase Coaching Flow Enhanced:**
  - Phase 1: "UNDERSTAND THE TASK AND CONTEXT" (not just lesson context)
  - Phase 2: "IDENTIFY THE REAL CHALLENGE" with varied prompts
  - Phase 3: "CONNECT TO LOUISIANA FRAMEWORKS" with short codes
  - Phase 4: "GENERATE THE PROMPT" only after sufficient context

**Documentation Updates:**
- ✅ **CLAUDE.md:** Updated with LER short code guidance, beta tester profiles, multi-task recognition
- ✅ **beta-launch-7day-critical-path.md:** Marked Day 1 fixes as completed, updated acceptance criteria

**Beta Tester Alignment:**
- Middle/high science, middle school math, media specialist, STEM, special education teachers
- Pain points addressed: curriculum internalization, assessment analysis, LEADS observation evidence

**Files Modified:**
- `src/components/coach/ChatInterface.tsx` (lines 98-119, 143-150, 305-314)
- `convex/promptCoach.ts` (lines 10-89)
- `CLAUDE.md` (multiple sections)
- `plans/beta-launch-7day-critical-path.md` (multiple sections)

---

### Documentation Updates - README, Landing Page, and Changelog

**Status:** ✅ **COMPLETED**

**Date:** December 1, 2025

**Impact:** Created comprehensive README.md, updated landing page content to emphasize Conversational Prompt Coach as primary product, and updated CHANGELOG with current status.

**Key Changes:**

**New Documentation:**
- ✅ **README.md:** Created comprehensive project documentation
  - Project overview and core mission
  - Current product status (Conversational Prompt Coach as primary)
  - Tech stack and architecture overview
  - Getting started guide with setup instructions
  - Testing and building commands
  - Project structure and key features

**Landing Page Content Updates:**
- ✅ **src/data/landingPageContent.ts:** Refocused on Conversational Prompt Coach
  - Features updated to emphasize conversational coaching experience
  - Testimonials updated to highlight conversational coach and Louisiana-specific intelligence
  - FAQs rewritten to explain conversational coach workflow and prompt library
  - Removed outdated "10 frameworks" messaging, now emphasizes coach as primary product

**Changelog Updates:**
- ✅ **CHANGELOG.md:** Added current status entry
  - Documented README creation and landing page updates
  - Clarified product focus: Conversational Prompt Coach is primary product

**Current Product Status:**
- ✅ **Conversational Prompt Coach:** Live and operational at `/coach` route
- 🚧 **RAG Integration:** Infrastructure ready, but Louisiana standards and rubric data not yet ingested (see `docs/RAG_INGESTION_PLAN.md`)
- ✅ **User Profiles:** Working - Backend + UI complete
- ✅ **Generated Prompts Library:** Working - Backend complete, integrated in coach UI
- ✅ **Framework Library:** Secondary feature - populated from successful beta conversations
- ✅ **Authentication:** Better Auth integrated

---

### Roadmap Creation & Launch Documentation Archiving

**Status:** ✅ **COMPLETED**

**Date:** November 21, 2025

**Impact:** Created development roadmap to track current sprint work and capture manual testing observations. Archived pre-launch documentation that was explicitly marked as historical reference only.

**Key Changes:**

**New Documentation:**
- ✅ **docs/ROADMAP.md:** Created development roadmap
  - Current sprint: Alignment Scorecard completion, Unused UI cleanup, LER/LSS + RAG refinements
  - Future improvements: 4 observations from manual testing (email flow simplification, beta signup management, onboarding UX, dashboard personalization)
  - Long-term considerations for post-30-user work
  - Living document for tracking progress and continuous improvement ideas

**Documentation Archiving:**
- ✅ **docs/launch/ → docs/archived/launch/:** Moved entire launch folder
  - Contains 6 files of pre-launch alignment work (November 18, 2025)
  - Explicitly marked as "Not Needed for Ongoing Development"
  - Preserved as historical reference
- ✅ **docs/README.md:** Updated to reflect new structure
  - Added ROADMAP.md to Core Documentation
  - Moved launch/ reference to Archived Documentation section

**Founder Story Enhancement:**
- ✅ **PROJECT.md:** Updated founder story to emphasize platform development
  - Clarified learning progression: AI workflow optimization → building platforms with AI
  - Strengthened positioning as educator who builds solutions, not just shares tips

---

### Documentation Consolidation & Ambiguity Resolution

**Status:** ✅ **COMPLETED**

**Date:** November 21, 2025

**Impact:** Streamlined documentation from 1329-line CLAUDE.md to 366 lines (72% reduction), resolved 10 critical ambiguities identified via vibe-check MCP, and established single sources of truth for all project information.

**Key Changes:**

**Documentation Streamlining:**
- ✅ **CLAUDE.md:** Reduced from 1329 → 366 lines
  - Removed verbose examples, troubleshooting sections, common tasks
  - Kept only essential patterns, conventions, and constraints
  - Removed outdated test coverage claims
  - Updated community features status (now available, not hidden)
- ✅ **PROJECT.md:** Updated with accurate implementation status
  - Fixed founder credentials (Mathematics Teacher and Technology Facilitator, Iberville Parish)
  - Changed specific numbers to "small group of Louisiana educators"
  - Updated Key Features with proper status indicators (✅ operational vs 🚧 in development)
  - Removed "Core Flare" terminology
  - Fixed broken documentation references
- ✅ **docs/archived/PELICAN_AI_BETA_CORE_FRAMEWORKS.md:** Consolidated from 367 → 150 lines
  - Removed detailed prompts (maintained in `convex/seedFrameworks.ts`)
  - Kept only framework overview and philosophy
  - Referenced source of truth for developers

**Ambiguities Resolved (10 total):**
1. ✅ Founder credentials synchronized (single location in PROJECT.md)
2. ✅ Launch numbers changed to variable "small group" (not "3" or "5")
3. ✅ Framework count clarified (10 at launch, growing based on feedback)
4. ✅ Documentation dates synchronized (November 21, 2025)
5. ✅ RAG system details removed (in progress, not ready for documentation)
6. ✅ "Core Flare" terminology removed (misleading status claims)
7. ✅ Documentation links fixed (CORE_FRAMEWORKS moved to archived/)
8. ✅ Community features status updated (available for testing, not hidden)
9. ✅ Deployment environment context added (both working, standards can wait)
10. ✅ Test coverage claims removed (suite needs refining, can wait for 30+ users)

**File Moves:**
- ✅ `ARCHITECTURE_VALIDATION.md` → `docs/archived/`
- ✅ `docs/PELICAN_AI_BRAND_GUIDELINES.md` → `docs/archived/`
- ✅ `docs/PELICAN_AI_BETA_CORE_FRAMEWORKS.md` → `docs/archived/`

**Single Sources of Truth Established:**
- Founder story: `PROJECT.md` only
- Framework details: `convex/seedFrameworks.ts`
- Database schema: `convex/schema.ts`
- Brand voice: `PROJECT.md`
- Development patterns: `CLAUDE.md`

**Updated Files:**
- `CLAUDE.md` - Streamlined AI assistant guide
- `PROJECT.md` - Accurate project vision and status
- `docs/README.md` - Simplified documentation index
- `README.md` - Updated quick start guide
- `docs/archived/PELICAN_AI_BETA_CORE_FRAMEWORKS.md` - Consolidated overview

**Results:**
- ✅ No duplicate information between documentation files
- ✅ All dates synchronized to November 21, 2025
- ✅ All ambiguities and inconsistencies resolved
- ✅ Documentation load time improved for AI assistants
- ✅ Clear hierarchy: living docs vs archived reference

---

### Grassroots Launch Alignment - "We're Not Waiting for LDOE"

**Status:** ✅ **COMPLETED**

**Date:** November 18, 2025

**Impact:** Complete grassroots alignment across 21 files with zero corporate language, honest numbers, and "We're Not Waiting for LDOE" positioning throughout. Ready for launch with 5 Louisiana educators.

**Key Changes:**

**Backend Code (5 files):**
- ✅ `convex/seedFrameworks.ts` - 10 frameworks (3 advanced Louisiana-specific + 7 essential) with grassroots messaging
- ✅ `convex/email.ts` - Grassroots tone + feature flags (WEEKLY_EMAILS_ENABLED=false for personal check-ins)
- ✅ `convex/frameworks.ts` - Optimized database indexes (by_module, by_category, by_status) + platform-agnostic messaging
- ✅ `convex/alignmentScorecard.ts` - "We're Not Waiting for LDOE" positioning in JSDoc
- ✅ `convex/betaProgram.ts` - "Building together" tone, removed corporate language

**Frontend Code (7 files):**
- ✅ `src/App.tsx` - Community routes hidden for grassroots launch (code stays, UI hidden)
- ✅ `src/components/shared/Navigation.tsx` - Community nav hidden
- ✅ `src/components/dashboard/BetaOnboarding.tsx` - All 4 steps aligned ("You're one of 5 educators building this together")
- ✅ `src/components/dashboard/ProfileSettings.tsx` - "Building Together" card (not "Beta Program")
- ✅ `src/components/dashboard/TimeTracking.tsx` - Leaderboard: "5 educators building together"
- ✅ `src/components/dashboard/QuickAccessGrid.tsx` - "10 frameworks" (not "10+")
- ✅ `src/data/landingPageContent.ts` - Testimonials + FAQ updated (public-facing, scalable messaging)

**Email Templates (6 files):**
- ✅ `src/emails/BetaWelcomeEmail.tsx` - Personal, grassroots tone ("Ready to dive in?")
- ✅ `src/emails/PlatformAccessEmail.tsx` - "You're in" (not "application approved")
- ✅ `src/emails/WeeklyPromptEmail.tsx` - No "Atomic Note", no Phase 1/2 language
- ✅ `src/emails/OutreachEmail.tsx` - Documented as deprioritized (cold outreach for scaling phase)
- ✅ `src/emails/FollowupEmail.tsx` - Documented as deprioritized (cold follow-up for scaling phase)
- ✅ `src/emails/NetworkPartnerEmail.tsx` - Documented as deprioritized (partnerships for 100+ users) + ActionBox import fix

**Documentation (3 files created, 1 deleted):**
- ✅ `ARCHITECTURE_VALIDATION.md` - Scaling validation for 5→100 users ($1-2/month → $20-50/month)
- ✅ `docs/README.md` - Simplified documentation index
- ✅ `docs/launch/README.md` - Archive for temporary alignment docs
- ✅ Updated `PROJECT.md` - 5 educators, grassroots vision, brand voice & tone
- ✅ Updated `README.md` - Fixed ARCHITECTURE.md reference
- ❌ Deleted `docs/ARCHITECTURE.md` - Redundant with auto-generated Convex types + ARCHITECTURE_VALIDATION.md

**Key Messaging Changes:**

**Removed (Corporate/Old):**
- "Welcome to Pelican AI Beta Program"
- "Your beta program application has been approved"
- "10+ foundational frameworks"
- "Office hours schedule", "Beta Overview Podcast"
- "Phase 1 MVP validation", "Atomic Note" terminology
- "The Pelican AI Team" (corporate signature)

**Added (Grassroots):**
- "You're one of 5 educators building this together"
- "We're Not Waiting for LDOE"
- "Platform-agnostic frameworks that work with ANY AI tool"
- "10 frameworks" (3 advanced + 7 essential) - honest numbers
- "With 5 users, every piece of feedback matters"
- "Tell me honestly—did it save you time or waste it?"
- "Just reply to this email or text me" - real conversations
- "Ryan - Louisiana educator building this for Louisiana educators"

**Public vs. Private Strategy:**
- **Public-Facing (Landing Page):** Scalable grassroots messaging, no "5 educators" language
  - "We're Not Waiting for LDOE"
  - "Louisiana educators building together"
  - "Will you be the first to share your success story?"
- **Private (Dashboard/Emails):** Personal to 5 educators
  - "You're one of 5 educators building this together"
  - "Your feedback literally shapes everything"
  - Personal signature from Ryan

**Performance Optimizations:**
- ✅ `getAllFrameworks` query refactored to use database indexes (no in-memory filtering)
- ✅ Most selective index first strategy (module > category > status)
- ✅ No table scans for common queries

**Features Scoped for Launch:**
- **Enabled:** Framework Library (10 frameworks), Alignment Scorecard, Dashboard, Time Tracking, Profile
- **Hidden (Code stays, UI hidden):** Community/Innovations (deprioritized for 5 users)
- **Feature-Flagged:** Weekly emails (WEEKLY_EMAILS_ENABLED=false by default)

**Architecture Validated:**
- ✅ Ready for organic scaling: 5 users → 100 users
- ✅ Cost: $1-2/month (5 users) → $20-50/month (100 users)
- ✅ 7 production-ready Convex components
- ✅ Auto-scaling built-in (no infrastructure changes needed)
- ✅ Rate limiting configured (tiered by role)

**Documentation Cleanup:**
- **Root Directory:** Clean, essential files only (PROJECT.md, ARCHITECTURE_VALIDATION.md, README.md, CHANGELOG.md, LICENSE)
- **Archived to `docs/launch/`:** Temporary alignment docs (COMPREHENSIVE_VIBE_CHECK_FINDINGS.md, EMAIL_TEMPLATES_ALIGNMENT.md, LAUNCH_READINESS_CHECKLIST.md, PERSONALIZED_ONBOARDING.md, PUBLIC_VS_PRIVATE_MESSAGING.md)

**Environment Variables:**
- Required: CONVEX_DEPLOYMENT, OPENAI_API_KEY, RESEND_API_KEY
- Feature Flags: WEEKLY_EMAILS_ENABLED=false (default) - set to "true" when scaling to 30-100 users

**Related Documentation:**
- `docs/launch/` - Archived alignment documentation
- `ARCHITECTURE_VALIDATION.md` - Scaling validation and cost projections
- `PROJECT.md` - Updated with grassroots vision and brand voice

---

### Alignment Scorecard Backend Architecture

**Status:** 🚧 **BACKEND COMPLETE, UI PENDING**

**Date:** November 11, 2025 (Backend), UI implementation in progress

**Backend Status:** ✅ Fully implemented and tested
**Frontend Status:** ❌ UI components not yet built

**Impact:** Backend architecture complete for analyzing AI-generated content against Louisiana Standards with multi-step workflows, vector search, and structured scorecards.
**Impact:** Major milestone - Backend infrastructure complete. Enables educators to analyze AI-generated content against Louisiana Standards with structured scorecards, gap analysis, and actionable recommendations (once UI is built).

**Key Features:**
- ✅ **Alignment Scorecard Workflow:** Multi-step analysis process using Convex Workflows
  - Step 1: Retrieve relevant Louisiana Standards from RAG
  - Step 2: Analyze content against standards using Convex Agent (GPT-4o)
  - Step 3: Generate structured scorecard with scores, gaps, and recommendations
  - Step 4: Save results to database
- ✅ **RAG System:** Vector search for Louisiana Standards
  - Semantic search with metadata filtering (subject, grade level, cognitive depth)
  - OpenAI text-embedding-3-small embeddings (1536 dimensions)
  - Centralized service layer with caching and rate limiting
- ✅ **Standards Scraping & Population:** Tools to scrape and populate Louisiana Standards
  - PDF scraping from LDOE (ELA, Math, Social Studies)
  - Structured data extraction with cognitive depth inference
  - RAG population with proper metadata and filters
- ✅ **Workflow Infrastructure:** Multi-step process orchestration
  - WorkflowManager with retry logic and parallelism (max 10)
  - Status tracking and reactive queries for frontend
  - Error handling and graceful degradation
- ✅ **Authorization System:** Role-based access control
  - `requireAuth`, `requireRole`, `requireAdmin` helpers
  - Migration support (role-based + email fallback)
  - Profile-based role management
- ✅ **Rate Limiting:** Tiered limits by user role
  - Teachers: Standard limits (20 RAG queries/min, 10 AI gen/min)
  - Coaches: Elevated limits (40 RAG queries/min, 20 AI gen/min)
  - Admins: Unlimited (200 RAG queries/min, 100 AI gen/min)
- ✅ **Testing Infrastructure:** Comprehensive test suite
  - Unit tests for workflow steps
  - Integration test helpers
  - Test data population utilities
  - Testing guide documentation

**New Files:**
- `convex/alignmentScorecard.ts` - Main workflow definition
- `convex/alignmentSteps.ts` - Individual workflow step implementations
- `convex/ragService.ts` - Centralized RAG service with rate limiting
- `convex/workflows.ts` - WorkflowManager configuration
- `convex/authorization.ts` - Role-based authorization helpers
- `convex/rateLimiting.ts` - Tiered rate limiting by role
- `convex/populateStandards.ts` - Standards population from scraper/data
- `convex/standardsScraper.ts` - PDF scraping for Louisiana Standards
- `convex/crons.ts` - Scheduled jobs infrastructure
- `convex/testHelpers.ts` - Test utilities for Alignment Scorecard
- `convex/alignmentScorecard.test.ts` - Comprehensive test suite
- `docs/TESTING_ALIGNMENT_SCORECARD.md` - Testing guide
- `docs/rag/` - RAG documentation directory

**Modified Files:**
- `convex/rag.ts` - Added workflow integration for alignment analysis
- `convex/schema.ts` - Added `alignmentAnalyses` table
- `convex/router.ts` - Updated for new routes
- `convex/admin.ts`, `convex/auth.ts`, `convex/userProfiles.ts` - Authorization updates
- `PROJECT.md` - Updated with Alignment Scorecard feature details
- `package.json`, `pnpm-lock.yaml` - New dependencies (workflows, rate-limiter, agent)

**Database Changes:**
- New table: `alignmentAnalyses` - Stores analysis results with scorecards, gaps, and recommendations
  - Indexed by `userId` and `alignmentScore`
  - Includes full scorecard structure (overallScore, breakdown, gaps, recommendations)

**API Changes:**
- New action: `rag.analyzeContentAlignment` - Starts alignment analysis workflow
- New query: `rag.getAlignmentStatus` - Gets workflow status reactively
- New action: `ragService.getStandards` - Retrieve standards by subject/grade
- New action: `ragService.analyzeContentAlignment` - Content alignment queries
- New action: `ragService.searchPolicies` - Policy/document search

**Backend Complete:**
- Multi-step workflow orchestration with retry logic and status tracking
- RAG system for Louisiana Standards (vector search with metadata filtering)
- Authorization system with role-based access control
- Tiered rate limiting by user role (teacher/coach/admin)
- Database schema for analysis results and scorecards

**UI In Development:**
- Frontend components for Alignment Scorecard need to be built
- User interface for workflow initiation and result display pending
- Integration with backend workflows in progress

**Dependencies Added:**
- `@convex-dev/workflow`, `@convex-dev/rate-limiter`, `@convex-dev/agent`, `@convex-dev/rag`

### UI Polish & Consistency

**Status:** ✅ **COMPLETED**

**Date:** November 5, 2025

**Impact:** Standardized UI components across Dashboard, Frameworks, and Community routes with consistent styling patterns

**Changes:**
- Unified card backgrounds, borders, shadows, and spacing across all routes
- Standardized button heights, alignment, and responsive behavior
- Improved modal UX with better backdrop and close functionality
- Fixed TypeScript/Zod type errors

### Mobile Responsiveness Fixes

**Status:** ✅ **COMPLETED**

**Date:** November 4, 2025

**Impact:** Fixed horizontal scroll issues on mobile (375px) across all pages

**Changes:**
- Fixed horizontal scroll on Frameworks, Community, Dashboard, and Landing pages
- Added responsive text truncation and button wrapping
- Improved mobile filter controls with shorter labels

### Performance: Route-Level Code Splitting

**Status:** ✅ **COMPLETED**

**Date:** November 4, 2025

**Impact:** Implemented route-level code splitting with 33% reduction in initial bundle size

**Results:**
- Initial bundle: 519 KB → 349 KB (33% reduction)
- Gzipped: 140 KB → 104 KB (25% reduction)
- 8 route components split into separate chunks with lazy loading

### QA Testing & Audit

**Status:** ✅ **COMPLETED**

**Date:** November 4, 2025

**Impact:** Comprehensive QA audit across accessibility, responsiveness, performance, and edge cases

**Completed:**
- Accessibility testing and improvements (skip links, heading hierarchy, ARIA compliance)
- Responsiveness fixes for mobile horizontal scroll issues
- Performance analysis and code splitting implementation
- Edge case testing (empty states, error boundaries, form validation)

**Issues Identified:**
- WEB-75: Additional accessibility improvements needed
- WEB-76: Code splitting (completed)
- WEB-77: Mobile responsiveness (completed)
- WEB-78: Input validation improvements

**Documentation:** Results consolidated in `docs/QA_AUDIT.md`

### Documentation Consolidation (QA & Testing)

**Status:** ✅ **COMPLETED**

**Date:** November 3, 2025

**Impact:** Consolidated scattered QA and testing documentation into single comprehensive files

**Changes:**
- Merged four separate audit files into `docs/QA_AUDIT.md`
- Consolidated testing documentation into fewer reference files
- Updated documentation index to reflect new structure

### Documentation Consolidation & CI/CD

**Status:** ✅ **COMPLETED**

**Date:** November 1, 2025

**Impact:** Streamlined documentation to single source of truth and added automated testing

**Changes:**
- Created `PROJECT.md` as single source of truth for vision and current system
- Simplified `ARCHITECTURE.md` to point to Convex schema
- Added GitHub Actions workflow for automated testing
- Archived outdated phase-specific documentation
- Removed phase terminology from active docs

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
