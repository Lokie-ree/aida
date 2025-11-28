# Pelican AI - MVP UX Audit

**Date:** November 27, 2025  
**Status:** Pre-Launch Polish  
**Focus:** MVP User Experience Refinement

---

## Executive Summary

This audit identifies UX polish issues, inconsistencies, and improvement opportunities across the Pelican AI platform. The focus is on **MVP readiness** for the December 1, 2025 beta launch with a small group of Louisiana educators.

**Key Findings:**
- ✅ Strong foundation: Well-structured components, good loading states, solid error handling
- ⚠️ Navigation inconsistencies: Community route visible but disabled
- ⚠️ Content clarity: Some technical language needs educator-friendly translation
- ⚠️ Empty states: Need more helpful guidance for first-time users
- ⚠️ Mobile experience: Some components need responsive refinement

---

## 1. User Flows

### 1.1 Landing Page → Sign Up Flow

**Current State:**
- Landing page has clear CTA buttons
- Auth modal handles sign-up and sign-in
- Beta signup process with approval workflow

**Issues Found:**

1. **Auth Modal Flow Confusion**
   - Location: `src/components/auth/AuthModal.tsx`
   - Issue: When user signs up and is already approved, shows info toast but doesn't automatically switch to sign-in mode
   - Impact: User might be confused about next steps
   - Recommendation: Auto-switch to sign-in mode with clear message: "You're approved! Sign in to access the platform."

2. **Beta Status Messaging**
   - Location: `src/components/auth/AuthModal.tsx` (lines 92-107)
   - Issue: Messages are informative but could be more encouraging for pending users
   - Current: "Your application is pending approval..."
   - Recommendation: Add timeline expectation: "We review applications within 24-48 hours. You'll receive an email once approved."

3. **Magic Link Instructions**
   - Location: `src/components/auth/AuthModal.tsx`
   - Issue: No guidance about checking spam folder or email delivery time
   - Recommendation: Add helper text: "Check your inbox (and spam folder) for the magic link. Links expire in 15 minutes."

### 1.2 Onboarding Flow

**Current State:**
- Auto-initialization for new users
- Onboarding modal triggered when needed
- Smart redirect based on onboarding status

**Issues Found:**

1. **Onboarding Modal Trigger Logic**
   - Location: `src/components/routes/DashboardRoute.tsx` (lines 61-72, 134-136)
   - Issue: Onboarding can be triggered multiple times, causing modal to appear/disappear
   - Recommendation: Add state to prevent duplicate triggers, ensure modal only shows once per session

2. **Onboarding Completion Feedback**
   - Location: `src/components/dashboard/BetaOnboarding.tsx` (not reviewed, but referenced)
   - Issue: Need to verify clear completion state and next steps
   - Recommendation: Show success state with "Get Started" button leading to dashboard

### 1.3 Dashboard → Feature Navigation

**Current State:**
- Dashboard shows welcome hero, stats, quick access grid
- Navigation header with Dashboard, Frameworks, Community (disabled)
- Profile completion prompt

**Issues Found:**

1. **Community Navigation Visible but Disabled**
   - Location: `src/components/shared/AppHeader.tsx` (lines 128-140, 248-265)
   - Issue: Community button appears in navigation but route is disabled (intentional for MVP)
   - Impact: Users might click and get confused
   - Recommendation: **Remove Community from navigation entirely** until ready to launch (30-100 users threshold)

2. **Quick Access Grid Navigation**
   - Location: `src/components/dashboard/QuickAccessGrid.tsx`
   - Issue: "Your AI Journey" card navigates to `/dashboard` (same page)
   - Recommendation: Either remove this card or link to `/time-tracking` route

3. **Profile Completion Prompt**
   - Location: `src/components/dashboard/Dashboard.tsx` (lines 81-106)
   - Issue: Good implementation, but could be more prominent for new users
   - Recommendation: Consider making it dismissible with "Remind me later" option

---

## 2. Key Features

### 2.1 Framework Library

**Current State:**
- Search, filters, grid/list views
- Personalized recommendations
- Recently viewed tracking
- Framework detail modal

**Issues Found:**

1. **Empty State Guidance**
   - Location: `src/components/framework/FrameworkLibrary.tsx` (lines 534-580)
   - Issue: Empty state shows popular frameworks, but could be more educational
   - Recommendation: Add brief explanation: "Frameworks are reusable AI prompts aligned to Louisiana Standards. Start with a popular one below."

2. **Filter Sidebar on Mobile**
   - Location: `src/components/framework/FrameworkLibrary.tsx` (line 422)
   - Issue: Filters hidden on mobile (`hidden lg:block`)
   - Recommendation: Add mobile filter button/drawer for mobile users

3. **Search Feedback**
   - Location: `src/components/framework/FrameworkLibrary.tsx` (lines 466-473)
   - Issue: No debouncing on search input, could cause performance issues
   - Recommendation: Add debounce (300ms) to search input

4. **Framework Detail Modal**
   - Location: `src/components/framework/FrameworkDetail.tsx` (not reviewed)
   - Issue: Need to verify mobile responsiveness and close button visibility
   - Recommendation: Ensure modal is fully responsive with clear close button

5. **Personalized Recommendations Banner**
   - Location: `src/components/framework/FrameworkLibrary.tsx` (lines 308-345)
   - Issue: Shows even if user hasn't completed profile (subject might be empty)
   - Recommendation: Only show if `userProfile?.subject` is truthy and non-empty

### 2.2 Alignment Scorecard

**Current State:**
- Content input form
- Workflow status tracking
- Results display with scorecard
- History tab

**Issues Found:**

1. **RAG Data Warning Clarity**
   - Location: `src/components/alignment/AlignmentScorecard.tsx` (lines 130-148)
   - Issue: Technical language ("populate RAG data") not educator-friendly
   - Current: "To populate sample standards, call the `populateSampleStandards` action..."
   - Recommendation: "Standards data is being loaded. This feature will be available shortly. Contact support if you need immediate access."

2. **Workflow Status Feedback**
   - Location: `src/components/alignment/WorkflowStatus.tsx` (not fully reviewed)
   - Issue: Need to verify progress indicators are clear and informative
   - Recommendation: Show estimated time remaining if possible, or at least "This may take 30-60 seconds"

3. **Content Input Form Validation**
   - Location: `src/components/alignment/ContentInputForm.tsx` (not reviewed)
   - Issue: Need to verify helpful error messages and character limits
   - Recommendation: Add character count and helpful placeholder text

4. **History Tab Empty State**
   - Location: `src/components/alignment/AlignmentScorecard.tsx` (lines 188-195)
   - Issue: Good empty state, but could encourage first analysis
   - Recommendation: Add "Start your first analysis" button that switches to analyze tab

5. **Results Display**
   - Location: `src/components/alignment/ScorecardResults.tsx` (not reviewed)
   - Issue: Need to verify results are clear and actionable
   - Recommendation: Ensure results highlight specific rubric indicators and provide actionable feedback

### 2.3 Dashboard

**Current State:**
- Welcome hero with user stats
- Journey stats cards
- Featured recommendation
- Time savings tracker
- Quick access grid

**Issues Found:**

1. **Time Savings Calculation**
   - Location: `src/components/dashboard/Dashboard.tsx` (lines 59-61)
   - Issue: Multiplies `stats.timeSaved` by 4 and 12, but `stats.timeSaved` might already be cumulative
   - Recommendation: Clarify what `timeSaved` represents (weekly? total?) and adjust calculations accordingly

2. **Featured Recommendation Logic**
   - Location: `src/components/dashboard/Dashboard.tsx` (line 64)
   - Issue: Always shows first framework, not necessarily most relevant
   - Recommendation: Use personalized recommendation logic (similar to Framework Library)

3. **Empty State for New Users**
   - Location: `src/components/dashboard/Dashboard.tsx`
   - Issue: Dashboard might feel empty for brand new users with no stats
   - Recommendation: Show onboarding-focused content or "Getting Started" guide for users with zero activity

4. **Journey Stats Cards**
   - Location: `src/components/dashboard/JourneyStats.tsx` (not reviewed)
   - Issue: Need to verify all stats are meaningful and not showing zeros confusingly
   - Recommendation: Hide or show placeholder values for zero stats

---

## 3. UI/UX Polish Issues

### 3.1 Consistency

**Issues Found:**

1. **Button Variants**
   - Issue: Inconsistent use of button variants across components
   - Examples:
     - QuickAccessGrid uses `variant="default"` for primary action
     - Framework Library uses `variant="outline"` for many actions
   - Recommendation: Establish and document button variant guidelines:
     - `default`: Primary actions (Save, Submit, Get Started)
     - `outline`: Secondary actions (Cancel, View Details)
     - `ghost`: Tertiary actions (Close, Dismiss)

2. **Spacing System**
   - Location: `src/lib/spacing.ts` (referenced but not reviewed)
   - Issue: Need to verify consistent spacing usage
   - Recommendation: Audit all components to ensure they use spacing utility

3. **Card Styling**
   - Issue: Some cards use `bg-gradient-to-br from-primary/5 to-primary/10`, others use plain backgrounds
   - Recommendation: Standardize card styles or document when to use gradients

### 3.2 Typography

**Issues Found:**

1. **Heading Hierarchy**
   - Issue: Inconsistent heading sizes and weights
   - Examples:
     - Dashboard: `text-3xl font-bold` for main heading
     - Framework Library: `text-3xl md:text-4xl font-bold`
     - Alignment Scorecard: `text-3xl font-bold`
   - Recommendation: Standardize heading sizes:
     - H1: `text-3xl md:text-4xl font-bold font-heading`
     - H2: `text-2xl font-semibold font-heading`
     - H3: `text-xl font-semibold`

2. **Body Text**
   - Issue: Some descriptions use `text-muted-foreground`, others use `text-foreground` with opacity
   - Recommendation: Use `text-muted-foreground` consistently for descriptions

### 3.3 Icons

**Issues Found:**

1. **Icon Sizing**
   - Issue: Inconsistent icon sizes (h-4 w-4, h-5 w-5, h-6 w-6)
   - Recommendation: Standardize:
     - Small icons: `h-4 w-4` (buttons, inline)
     - Medium icons: `h-5 w-5` (cards, headers)
     - Large icons: `h-6 w-6` (hero sections)

2. **Icon Consistency**
   - Issue: Some features use different icons for similar concepts
   - Recommendation: Create icon mapping document for common actions

### 3.4 Loading States

**Current State:**
- Good loading state components in `src/components/shared/LoadingStates.tsx`
- Loading spinners, cards, grids, tables

**Issues Found:**

1. **Loading State Usage**
   - Issue: Some components show custom loading states instead of using shared components
   - Example: `DashboardRoute.tsx` has custom loading animation (lines 76-107)
   - Recommendation: Use `LoadingPage` component from `LoadingStates.tsx` for consistency

2. **Skeleton Loading**
   - Issue: Not all components use skeleton loaders (some just show spinners)
   - Recommendation: Use `LoadingCard` or `LoadingGrid` for list/grid views

### 3.5 Error States

**Current State:**
- Error boundary component exists
- Error handling utility in `src/lib/error-handling.ts`
- Toast notifications for errors

**Issues Found:**

1. **Error Message Clarity**
   - Issue: Some error messages are technical (e.g., "RAG data required")
   - Recommendation: Translate all technical errors to user-friendly language

2. **Error Recovery**
   - Issue: Not all errors provide clear recovery actions
   - Recommendation: Always provide actionable next steps in error messages

3. **Network Error Handling**
   - Issue: Need to verify offline state handling
   - Recommendation: Add offline detection and user-friendly message

---

## 4. Accessibility

### 4.1 Keyboard Navigation

**Issues Found:**

1. **Skip Link**
   - Location: `src/App.tsx` (lines 46-51)
   - Status: ✅ Good - Skip link exists with proper styling

2. **Focus Indicators**
   - Issue: Need to verify all interactive elements have visible focus indicators
   - Recommendation: Audit all buttons, links, and form inputs

3. **Modal Focus Trap**
   - Issue: Need to verify modals trap focus properly
   - Recommendation: Test with keyboard navigation (Tab, Shift+Tab, Escape)

### 4.2 Screen Readers

**Issues Found:**

1. **ARIA Labels**
   - Location: Various components
   - Issue: Some buttons/icons might be missing aria-labels
   - Examples:
     - Theme toggle button
     - Close buttons in modals
     - Icon-only buttons
   - Recommendation: Add `aria-label` to all icon-only buttons

2. **Form Labels**
   - Issue: Need to verify all form inputs have associated labels
   - Recommendation: Audit all forms (AuthModal, ProfileSettings, ContentInputForm)

3. **Landmark Regions**
   - Location: `src/App.tsx`
   - Status: ✅ Good - Main content has `role="main"` and `id="main-content"`

### 4.3 Color Contrast

**Issues Found:**

1. **Text on Gradients**
   - Issue: Some text on gradient backgrounds might not meet WCAG AA contrast
   - Recommendation: Test all gradient text combinations

2. **Muted Text**
   - Issue: `text-muted-foreground` might be too light in some contexts
   - Recommendation: Verify contrast ratios meet WCAG AA (4.5:1 for normal text)

### 4.4 Touch Targets

**Issues Found:**

1. **Button Sizes**
   - Location: Various components
   - Issue: Some buttons might be smaller than 44x44px (WCAG AA minimum)
   - Recommendation: Ensure all interactive elements meet minimum touch target size

2. **Mobile Menu Items**
   - Location: `src/components/shared/AppHeader.tsx` (lines 212-265)
   - Status: ✅ Good - Mobile menu items have `h-12` (48px) which exceeds minimum

---

## 5. Mobile Responsiveness

### 5.1 Layout

**Issues Found:**

1. **Dashboard Grid**
   - Location: `src/components/dashboard/Dashboard.tsx`
   - Issue: Need to verify responsive breakpoints work well on tablets
   - Recommendation: Test on various screen sizes (320px, 768px, 1024px)

2. **Framework Library Filters**
   - Location: `src/components/framework/FrameworkLibrary.tsx` (line 422)
   - Issue: Filters completely hidden on mobile
   - Recommendation: Add mobile filter drawer/button

3. **Alignment Scorecard Tabs**
   - Location: `src/components/alignment/AlignmentScorecard.tsx` (lines 116-126)
   - Issue: Tabs might overflow on small screens
   - Recommendation: Make tabs scrollable horizontally on mobile

### 5.2 Touch Interactions

**Issues Found:**

1. **Hover States**
   - Issue: Some hover effects don't translate well to touch devices
   - Recommendation: Use `hover:` classes sparingly, ensure touch feedback is clear

2. **Swipe Gestures**
   - Issue: No swipe gestures for mobile navigation
   - Recommendation: Consider adding swipe-to-close for modals (nice-to-have, not critical)

### 5.3 Performance

**Issues Found:**

1. **Image Optimization**
   - Issue: Logo/icon images might not be optimized
   - Recommendation: Ensure all images are optimized (WebP format, appropriate sizes)

2. **Code Splitting**
   - Location: `src/App.tsx` (lines 14-22)
   - Status: ✅ Good - Components are lazy-loaded

---

## 6. Content & Messaging

### 6.1 Educator-Friendly Language

**Issues Found:**

1. **Technical Terms**
   - Issue: Some features use technical language that might confuse educators
   - Examples:
     - "RAG data" → "Standards database"
     - "Workflow" → "Analysis process"
     - "Framework" → Keep as is (well-explained in context)
   - Recommendation: Review all user-facing text for technical jargon

2. **Feature Descriptions**
   - Location: Various components
   - Issue: Some descriptions are too brief or too technical
   - Recommendation: Add tooltips or help text for complex features

### 6.2 Brand Voice

**Current State:**
- Good use of "We're Not Waiting for LDOE" messaging
- Teacher-to-teacher tone in most places

**Issues Found:**

1. **Consistency**
   - Issue: Some error messages and technical text don't match brand voice
   - Recommendation: Ensure all user-facing text matches the authentic, teacher-to-teacher voice

2. **Numbers**
   - Location: `src/components/dashboard/ProfileSettings.tsx` (line 275)
   - Issue: Hardcoded "One of 5 Educators" - will need dynamic update
   - Recommendation: Make this dynamic based on actual user count

### 6.3 Help & Guidance

**Issues Found:**

1. **Tooltips**
   - Issue: Many features could benefit from tooltips or help text
   - Recommendation: Add tooltips to:
     - Framework filters
     - Alignment Scorecard inputs
     - Dashboard stats

2. **Onboarding Help**
   - Issue: No help documentation or FAQ accessible from within app
   - Recommendation: Add "Help" link in header or footer (links to FAQ section on landing page)

---

## 7. Navigation & Information Architecture

### 7.1 Navigation Structure

**Issues Found:**

1. **Community Route**
   - Location: `src/components/shared/AppHeader.tsx`
   - Issue: Community navigation visible but route disabled
   - **Priority: HIGH** - Remove from navigation until ready

2. **Active Route Indicators**
   - Location: `src/components/shared/AppHeader.tsx` (lines 63-65, 103-140)
   - Status: ✅ Good - Active routes are highlighted

3. **Breadcrumbs**
   - Issue: No breadcrumbs for nested routes (e.g., `/frameworks/:frameworkId`)
   - Recommendation: Add breadcrumbs for better navigation context

### 7.2 Route Protection

**Current State:**
- Protected routes use `ProtectedRoute` component
- Admin routes require admin role

**Issues Found:**

1. **Redirect After Auth**
   - Location: `src/components/routes/SmartRedirect.tsx`
   - Status: ✅ Good - Smart redirect based on admin status

2. **Unauthorized Access**
   - Issue: Need to verify clear error message for unauthorized access
   - Recommendation: Add friendly "You don't have access" message with contact info

---

## 8. Performance & Optimization

### 8.1 Loading Performance

**Issues Found:**

1. **Initial Load**
   - Issue: Need to verify initial bundle size and load time
   - Recommendation: Run Lighthouse audit and optimize if needed

2. **Image Loading**
   - Issue: Logo/icon images might not be lazy-loaded
   - Recommendation: Use `loading="lazy"` for below-the-fold images

### 8.2 Runtime Performance

**Issues Found:**

1. **Search Debouncing**
   - Location: `src/components/framework/FrameworkLibrary.tsx`
   - Issue: Search input not debounced
   - Recommendation: Add 300ms debounce to search input

2. **Re-renders**
   - Issue: Need to verify components aren't causing unnecessary re-renders
   - Recommendation: Use React DevTools Profiler to identify optimization opportunities

---

## 9. Priority Recommendations

### High Priority (Before Launch)

1. **Remove Community Navigation**
   - Remove Community button from `AppHeader.tsx` until ready to launch
   - File: `src/components/shared/AppHeader.tsx`

2. **Fix Quick Access Grid Navigation**
   - Fix "Your AI Journey" card to navigate to `/time-tracking` or remove it
   - File: `src/components/dashboard/QuickAccessGrid.tsx`

3. **Improve Auth Modal Flow**
   - Auto-switch to sign-in when user is approved
   - Add helpful messaging about magic links
   - File: `src/components/auth/AuthModal.tsx`

4. **Add Mobile Filter Drawer**
   - Add mobile-accessible filters for Framework Library
   - File: `src/components/framework/FrameworkLibrary.tsx`

5. **Improve Error Messages**
   - Translate technical errors to educator-friendly language
   - Files: `src/components/alignment/AlignmentScorecard.tsx`, error handling throughout

### Medium Priority (Post-Launch Polish)

1. **Standardize UI Components**
   - Create design system documentation
   - Standardize button variants, spacing, typography

2. **Add Help & Tooltips**
   - Add tooltips to complex features
   - Add help documentation link

3. **Improve Empty States**
   - Add more helpful guidance for first-time users
   - Add "Getting Started" guides

4. **Accessibility Audit**
   - Complete keyboard navigation testing
   - Verify all ARIA labels
   - Test with screen readers

### Low Priority (Nice-to-Have)

1. **Add Breadcrumbs**
   - Improve navigation context for nested routes

2. **Swipe Gestures**
   - Add swipe-to-close for modals on mobile

3. **Performance Optimizations**
   - Image optimization
   - Code splitting refinements

---

## 10. Testing Checklist

Before launch, test the following:

### User Flows
- [ ] Sign up → Approval → Sign in → Dashboard
- [ ] Onboarding flow completion
- [ ] Framework Library → View Framework → Copy Prompt
- [ ] Alignment Scorecard → Submit Content → View Results
- [ ] Profile Settings → Update Profile → Save

### Edge Cases
- [ ] Empty states (no frameworks, no analyses, no stats)
- [ ] Error states (network error, API error, validation error)
- [ ] Loading states (slow network, long-running operations)
- [ ] Mobile navigation (hamburger menu, filters)

### Accessibility
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Color contrast (WCAG AA compliance)
- [ ] Touch targets (44x44px minimum)

### Responsive Design
- [ ] Mobile (320px, 375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1920px)

---

## 11. Next Steps

1. **Review this audit** with the team
2. **Prioritize fixes** based on launch timeline
3. **Create tickets** for each high-priority item
4. **Test fixes** thoroughly before launch
5. **Gather user feedback** after launch to inform next iteration

---

**Document Status:** Ready for Review  
**Last Updated:** November 27, 2025  
**Next Review:** Post-Launch (January 2026)

