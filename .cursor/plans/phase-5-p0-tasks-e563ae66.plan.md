<!-- e563ae66-e80d-4afa-8b05-52c31bd9daa8 ee1841ca-bfa3-41b3-a5c7-339c4e4b367c -->
# Phase 5 P0 Tasks Implementation Plan

## Overview

Based on orchestrator.json Phase 5 objectives and PRD requirements, this plan addresses the P0 (must-have for beta) features needed to launch Pelican AI platform.

## Status Assessment

### Completed

- ✅ Database schema (frameworks, testimonials, betaProgram, innovations)
- ✅ Authentication system (Better Auth)
- ✅ Email infrastructure (Resend)
- ✅ Mobile responsiveness
- ✅ Basic Convex API functions (frameworks, testimonials, betaProgram)
- ✅ Dashboard UI with stats display
- ✅ Design system and branding

### P0 Tasks (Must-Have for Beta)

## Implementation Tasks

### 1. Seed Framework Content

**Priority:** P0 - Critical
**File:** `convex/seedFrameworks.ts` (exists but needs data)

Create 10+ production-ready frameworks (5 per hub) based on PRD Section 7:

- **AI Basics Hub:** AIB-001 through AIB-005 (email drafting, newsletters, document summarization, meeting notes, professional emails)
- **Instructional Expert Hub:** IEH-001 through IEH-005 (Louisiana standards unpacking, I Can statements, learning objectives, assessment alignment, curriculum mapping)

Each framework must include:

- Complete challenge, solution, samplePrompt, ethicalGuardrail
- Louisiana standards alignment (louisianaStandards, lerDomains)
- Platform compatibility markers (MagicSchool AI, Brisk, SchoolAI, Gemini)
- Accurate timeEstimate and difficultyLevel

**Acceptance:** 10+ published frameworks visible in dashboard

---

### 2. User Profile Management

**Priority:** P0 - Critical
**Files:**

- `convex/userProfiles.ts` (new)
- `src/components/dashboard/ProfileSettings.tsx` (new)

Implement user profile creation/editing per PRD Section 8.2:

- Create Convex mutations: `createUserProfile`, `updateUserProfile`, `getUserProfile`
- Profile fields: school, subject, gradeLevel, district, role
- UI form with validation and accessibility
- Auto-initialize profile for new users in beta program
- Integrate with Better Auth user data

**Acceptance:** Users can create/edit profiles; dashboard shows real user data

---

### 3. Framework Library UI

**Priority:** P0 - Critical
**Files:**

- `src/components/framework/FrameworkLibrary.tsx` (new)
- `src/components/framework/FrameworkDetail.tsx` (new)
- `src/components/framework/FrameworkFilters.tsx` (new)

Build framework browsing interface per PRD Section 5.1:

- Grid/list view of all frameworks
- Filter by module (AI Basics vs Instructional Expert)
- Filter by category, difficulty, tags
- Search using existing `api.frameworks.searchFrameworks`
- Framework detail modal/page with full content
- Copy-to-clipboard for sample prompts
- "Save Framework" and "Mark as Tried" actions
- Track usage with `api.frameworks.recordFrameworkUsage`

**Acceptance:** Users can browse, filter, search, view details, and save frameworks

---

### 4. Beta Onboarding Flow

**Priority:** P0 - Critical
**Files:**

- `src/components/dashboard/BetaOnboarding.tsx` (new)
- `convex/email.ts` (update)

Implement 4-step onboarding per PRD Section 5.3:

1. Welcome & profile setup
2. Choose first framework to try
3. Join community space (Google/Slack link)
4. Schedule office hours

- Create onboarding wizard UI with progress indicator
- Send welcome email via Resend (WelcomeEmail.tsx template)
- Track progress with `api.betaProgram.updateOnboardingProgress`
- Show onboarding modal on first login
- Dismissible but accessible from profile

**Acceptance:** New users complete 4-step onboarding; welcome email sent

---

### 5. Email System Integration

**Priority:** P0 - Critical
**Files:**

- `convex/email.ts` (update)
- `src/emails/WeeklyPromptEmail.tsx` (new)
- `src/emails/BetaInviteEmail.tsx` (new)

Complete email system per PRD Section 5.3:

- Implement weekly "Productivity Prompt of the Week" email
- Beta program invitation email
- Email preferences management
- Cron job for weekly email delivery
- Test email sending with Resend

**Acceptance:** Welcome, weekly prompt, and invite emails send successfully

---

### 6. Innovation Sharing Feature

**Priority:** P0 - Beta Program
**Files:**

- `convex/innovations.ts` (update)
- `src/components/community/InnovationForm.tsx` (new)
- `src/components/community/InnovationList.tsx` (new)
- `src/components/community/InnovationCard.tsx` (new)

Build community innovation sharing per PRD Section 6.3:

- Form to submit innovations (title, description, related framework, tags)
- List view of recent innovations
- Like and "I tried this" interactions
- Filter by tags, school, subject
- Track with betaProgram.innovationsShared counter
- Admin moderation (approval workflow)

**Acceptance:** Users can submit, view, like, and try community innovations

---

### 7. Testimonial Collection System

**Priority:** P0 - Beta Program
**Files:**

- `src/components/community/TestimonialForm.tsx` (new)
- Dashboard integration

Implement testimonial submission per PRD Section 5.3:

- Form to submit testimonials (quote, impact, timeSaved, optional frameworkId)
- Post-framework usage prompt "Share your experience?"
- Admin approval workflow (use existing `api.testimonials.approveTestimonial`)
- Display featured testimonials on landing page and dashboard

**Acceptance:** Users can submit testimonials; admins can approve/feature

---

### 8. Admin Panel

**Priority:** P0 - Beta Management
**Files:**

- `src/components/admin/AdminPanel.tsx` (new)
- `src/components/admin/TestimonialModeration.tsx` (new)
- `src/components/admin/InnovationModeration.tsx` (new)
- `src/components/admin/BetaSignupManagement.tsx` (new)

Create admin interface per PRD requirements:

- Role-based access control (check user.role === "admin")
- Approve/reject testimonials
- Moderate innovations
- Manage beta signups (approve, reject, notes)
- View beta program stats (aggregate analytics)
- Protected route accessible only to admins

**Acceptance:** Admins can moderate content and manage beta signups

---

### 9. Time Savings Tracking

**Priority:** P0 - Success Metrics
**Files:**

- `convex/betaProgram.ts` (update)
- `src/components/shared/TimeSavingsForm.tsx` (new)

Implement time tracking per PRD Section 4.2:

- Prompt users to report time saved after framework usage
- Calculate and display weekly/monthly totals
- Update betaProgram.totalTimeSaved
- Show progress toward 120+ minutes/week goal
- Visual progress indicators in dashboard

**Acceptance:** Users can report time saved; dashboard shows aggregated totals

---

### 10. App Navigation & Routing

**Priority:** P0 - UX
**Files:**

- `src/App.tsx` (update)
- `src/components/shared/Navigation.tsx` (new)

Complete navigation system:

- Header navigation: Dashboard, Framework Library, Community, Profile
- Active route highlighting
- Mobile-responsive hamburger menu
- Breadcrumb navigation for deep pages
- Implement view switching in App.tsx (currently stubbed)

**Acceptance:** Users can navigate between all main sections

---

### 11. Beta Signup Landing Page

**Priority:** P0 - Recruitment
**Files:**

- `src/components/shared/LandingPage.tsx` (update)
- `convex/betaSignup.ts` (update)

Enhance landing page per PRD Section 10.1:

- Beta program value proposition
- Sign-up form (email, name, school, subject)
- Submit to `api.betaSignup.submitBetaSignup`
- Success message with "What's next" steps
- Countdown to beta launch or spots remaining
- Featured testimonials and success metrics

**Acceptance:** Visitors can sign up for beta program; data captured in database

---

### 12. Error Handling & Loading States

**Priority:** P0 - UX
**Files:** All components

Implement comprehensive error handling:

- Loading skeletons for all data fetching
- Error boundaries with user-friendly messages
- Toast notifications for actions (save, submit, error)
- Retry mechanisms for failed requests
- Offline state detection and messaging

**Acceptance:** All loading and error states handled gracefully

---

## Success Criteria (PRD Section 13)

**Platform Metrics:**

- ✅ 10+ frameworks at launch (5 per hub)
- ✅ Page load time <3 seconds
- ✅ WCAG 2.1 Level AA compliance
- ✅ Mobile-first with 44px touch targets
- ✅ Platform-agnostic guidance

**Beta Program:**

- ✅ Onboarding completion within 48 hours
- ✅ Framework usage tracking functional
- ✅ Time savings self-reporting working
- ✅ Innovation sharing active
- ✅ Email system operational

## Out of Scope (P1/P2)

- RAG system implementation
- Voice interface (Vapi integration)
- Advanced analytics dashboard
- Multi-language support
- Mobile app

### To-dos

- [ ] Create 10+ production frameworks with Louisiana standards alignment
- [ ] Build user profile management API and UI
- [ ] Build framework browsing, filtering, and detail views
- [ ] Implement 4-step beta onboarding flow with welcome email
- [ ] Complete email system with weekly prompts and beta invites
- [ ] Build innovation sharing feature with community interactions
- [ ] Implement testimonial submission and collection system
- [ ] Create admin panel for content moderation and beta management
- [ ] Build time savings tracking and reporting
- [ ] Complete app navigation and routing system
- [ ] Enhance beta signup landing page with value proposition
- [ ] Implement comprehensive error handling and loading states