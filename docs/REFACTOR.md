# Technical Debt Refactoring Plan

**Last Updated:** November 24, 2025  
**Beta Launch Target:** December 1, 2025  
**Priority:** Aligned with ROADMAP.md - Focus on Alignment Scorecard UI first

---

## 📊 Current State Assessment

### Backend Analysis
- **Total Functions:** ~150+ across 35+ files
- **Actively Used:** ~50-60 functions (~65% unused)
- **Critical Gap:** Alignment Scorecard backend 100% complete, UI 0% implemented (ROADMAP Priority #1)
- **Test Helpers:** Already consolidated in `convex/testHelpers.ts` (alignment scorecard tests)
- **Orphaned Files:** 4 files with no usage (dashboardAnalytics.ts, adminDebug.ts, vapi.ts, router.ts)
- **Redundant Code:** User query aliases, duplicate innovation functions, unused analytics

### Frontend Analysis
- **Community Features:** Route exists in App.tsx (line 92-99), navigation cards in QuickAccessGrid, handlers in Dashboard - **NOT truly hidden**
- **Unused Components:** 4 chart components (CommunityInsights, ProgressTrackingChart, FrameworkUsageChart, TimeSavingsChart) - none imported
- **Duplicate Components:** `ui/gradient-text.tsx` duplicates `shared/GradientText.tsx` (only shared version used)
- **Missing UI:** No Alignment Scorecard UI despite being "Core Flare #1" and ROADMAP Priority #1

---

## 🎯 Refactoring Strategy (Prioritized for Beta Launch)

### Phase 0: Alignment Scorecard UI (ROADMAP Priority #1) ⚡
**Status:** Backend complete, UI missing  
**Target:** Complete before beta launch (Dec 1, 2025)

#### 0.1 Document Backend Readiness
- ✅ Backend already documented in `convex/alignmentScorecard.ts`
- ✅ Workflow: `analyzeContentAlignment` (multi-step)
- ✅ RAG: Louisiana Standards retrieval via `ragService.getStandards`
- ✅ Agent: GPT-4o analysis via `alignmentSteps.analyzeWithAgent`
- ✅ Database: `alignmentAnalyses` table with full scorecard structure
- ✅ Test helpers: `testHelpers.ts` has alignment scorecard test functions

#### 0.2 Create UI Components Structure
**Files to Create:**
```
src/components/alignment/
  ├── AlignmentScorecard.tsx      # Main page component
  ├── ContentInputForm.tsx         # Form for content input (grade, subject, content)
  ├── ScorecardResults.tsx         # Display results (score, breakdown, gaps, recommendations)
  ├── StandardsDisplay.tsx         # Show relevant Louisiana Standards
  └── WorkflowStatus.tsx           # Show workflow progress (inProgress, completed, error)
```

**Integration Points:**
- Add route in `src/App.tsx`: `/alignment-scorecard`
- Add navigation item in `src/components/shared/Navigation.tsx`
- Add quick access card in `src/components/dashboard/QuickAccessGrid.tsx` (replace one community card)
- Connect to backend: `api.alignmentScorecard.analyzeContentAlignment` (workflow action)

**Backend API to Use:**
- `api.alignmentScorecard.analyzeContentAlignment` - Start workflow (action)
- `api.testHelpers.getRecentAnalyses` - Get user's recent analyses (query)
- `api.ragService.getStandards` - Get standards by subject/grade (action)

---

### Phase 1: Quick Wins - Remove Dead Code (1-2 hours)
**Priority:** High - Reduces confusion, improves maintainability  
**Risk:** Low - No usage found

#### 1.1 Delete Orphaned Files
**Files to Delete:**
- `convex/dashboardAnalytics.ts` - 5 functions, 0 imports in frontend
  - `getWeeklyTimeSavings`, `getMonthlyTimeSavings`, `getFrameworkUsageData`, `getProgressTrackingData`, `getDashboardAnalytics`
  - **Reason:** TimeTracking.tsx handles time tracking differently, no chart components use these
- `convex/adminDebug.ts` - 3 functions, 0 imports
  - `deleteUserProfile`, `debugDatabaseState`, `syncExistingUsers`
  - **Reason:** Legacy migration helpers, no longer needed
- `convex/vapi.ts` - Empty file (1 line)
  - **Reason:** No Vapi integration planned
- `convex/router.ts` - Only commented code
  - **Reason:** Vapi webhook commented out, unused

#### 1.2 Remove Unused Frontend Components
**Components to Delete:**
- `src/components/dashboard/CommunityInsights.tsx` - Not imported anywhere
- `src/components/dashboard/ProgressTrackingChart.tsx` - Not imported
- `src/components/dashboard/FrameworkUsageChart.tsx` - Not imported
- `src/components/dashboard/TimeSavingsChart.tsx` - Not imported
- `src/components/ui/gradient-text.tsx` - Duplicate of `shared/GradientText.tsx`

**Update:**
- Remove exports from `src/components/dashboard/index.ts` (CommunityInsights)

---

### Phase 2: Hide Community Features Properly (30 minutes)
**Priority:** High - Critical inconsistency (ROADMAP notes this)  
**Risk:** Low - Backend stays intact, just hide UI access

#### 2.1 Remove Community Route Access
**File:** `src/App.tsx`
- ❌ **REMOVE** lines 92-99: `/community` route
- ✅ **KEEP** all community components (will unhide when scaling to 30-100 users)

#### 2.2 Remove Community Navigation Cards
**File:** `src/components/dashboard/QuickAccessGrid.tsx`
- ❌ **REMOVE** "Louisiana Educator Community" card (id: "community")
- ❌ **REMOVE** "Share Your Success" card (id: "innovation")
- ✅ **REPLACE** with Alignment Scorecard card (once UI is built)

**File:** `src/components/dashboard/Dashboard.tsx`
- ❌ **REMOVE** `handleNavigateToCommunity()` function (line 53)
- ❌ **REMOVE** `handleNavigateToInnovation()` function (line 54)
- ❌ **REMOVE** props from QuickAccessGrid (lines 155-156)

**Note:** Navigation.tsx already has community hidden (commented out), so no changes needed there.

---

### Phase 3: Backend Cleanup - Consolidate Redundant Code (2-3 hours)
**Priority:** Medium - Improves maintainability, reduces confusion  
**Risk:** Medium - Need to verify all usages first

#### 3.1 Simplify User Query Aliases
**File:** `convex/auth.ts`
- ❌ **REMOVE:** `currentUser` (alias, line 79)
- ❌ **REMOVE:** `getCurrentUser` (alias, line 71)
- ✅ **KEEP:** `loggedInUser` (actively used in 3+ frontend files)

**Verification:** Only `loggedInUser` is imported in frontend (Navigation.tsx, ProfileSettings.tsx, etc.)

#### 3.2 Clean Up Innovation Functions
**File:** `convex/innovations.ts`

**Functions to KEEP (actively used):**
- ✅ `shareInnovation` - Used in InnovationForm.tsx
- ✅ `getRecentInnovations` - Used in InnovationList.tsx
- ✅ `getUserInnovations` - Used in InnovationList.tsx
- ✅ `getInnovationsByFramework` - Used in FrameworkDetail.tsx
- ✅ `likeInnovation` - Used in InnovationCard.tsx
- ✅ `markInnovationTried` - Used in InnovationCard.tsx

**Functions to REMOVE (unused):**
- ❌ `submitInnovation` - Duplicate of `shareInnovation` (line 439)
- ❌ `getAllInnovations` - Not imported anywhere (line 77)
- ❌ `searchInnovations` - Not imported anywhere (line 132)
- ❌ `getInnovationById` - Not imported anywhere (line 189)
- ❌ `getSimilarInnovations` - Not implemented/used (line 298)
- ❌ `commentInnovation` - Not implemented/used (line 395)

**Test Helpers (move to testHelpers.ts if not already there):**
- `deleteInnovation` - Test helper
- `deleteInnovationInteraction` - Test helper
- `getAllInnovationsForCleanup` - Test helper
- `getAllInnovationInteractions` - Test helper

#### 3.3 Clean Up Testimonial Functions
**File:** `convex/testimonials.ts`

**Functions to KEEP:**
- ✅ `submitTestimonial` - Used in TestimonialForm.tsx

**Functions to REMOVE:**
- ❌ `getTestimonialById` - Not imported (line 7)
- ❌ `getAllTestimonials` - Not imported (line 40)
- ❌ `approveTestimonial` - Use admin version instead (line 85)
- ❌ `getFeaturedTestimonials` - Not imported (line 107)

**Test Helpers:**
- `deleteTestimonial` - Test helper
- `getAllTestimonialsForCleanup` - Test helper

#### 3.4 Deprecate Legacy User Profile Functions
**File:** `convex/userProfiles.ts`

**Functions to REMOVE:**
- ❌ `createUserProfile` - Already marked @deprecated, use `initializeNewUser` instead (line 76)
- ❌ `initializeProfileForBeta` - Check if used, likely legacy
- ❌ `createUserProfileForUserId` - Check if used, likely legacy
- ❌ `getAllUserProfiles` - Admin-only, check admin.ts for usage

**Verification Needed:** Check if any of these are used in admin.ts or tests before removing.

#### 3.5 Clean Up Beta Signup Functions
**File:** `convex/betaSignup.ts`

**Functions to KEEP:**
- ✅ `signupForBeta` - Used in AuthModal.tsx
- ✅ `getBetaSignupByEmail` - Used in AuthModal.tsx, DashboardRoute.tsx
- ✅ `approveBetaSignup` - Used in AdminDashboard.tsx
- ✅ `getPendingSignups` - Used in AdminDashboard.tsx

**Functions to REMOVE (test/debug helpers):**
- ❌ `testSendMagicLink` - Test helper
- ❌ `getBetaSignupStats` - Debug helper (line 99)
- ❌ `updateSignupStatus` - Check if used
- ❌ `getBetaSignupById` - Check if used
- ❌ `getAllBetaSignups` - Check if used
- ❌ `deleteBetaSignup` - Test helper
- ❌ `recoverDeletedUser` - Test helper

#### 3.6 Document Feature-Flagged Email Functions
**File:** `convex/email.ts`

**Functions to KEEP but document:**
- ⚠️ `sendWeeklyPromptEmail` - Add comment: `// 🚫 FEATURE-FLAGGED: Disabled for grassroots launch (5 users). Enable when scaling to 30-100 users.`
- ⚠️ `sendWeeklyEmailsToAllUsers` - Add comment: `// 🚫 FEATURE-FLAGGED: Disabled for grassroots launch (5 users). Enable when scaling to 30-100 users.`

**Functions actively used:**
- ✅ `sendBetaWelcomeEmail` - Used in betaSignup.ts
- ✅ `sendPlatformAccessEmail` - Used in betaSignup.ts

---

### Phase 4: Documentation & Status Markers (1 hour)
**Priority:** Low - Improves long-term maintainability  
**Risk:** None

#### 4.1 Add Status Comments to Convex Files
Add header comments to all Convex files:

```typescript
/**
 * ✅ ACTIVE - Used in production
 * Functions: getUserProfile, updateUserProfile, initializeNewUser
 */

/**
 * ⚠️ PHASE 2 - Backend ready, UI hidden for MVP
 * Backend: Complete (workflows, RAG, database)
 * Frontend: Community features hidden until 30-100 users
 */

/**
 * 🚫 FEATURE-FLAGGED - Disabled for grassroots launch
 * Enable when scaling to 30-100 users
 * Functions: sendWeeklyPromptEmail, sendWeeklyEmailsToAllUsers
 */

/**
 * 🧪 TEST HELPERS - For testing only
 * Functions: deleteX, getAllXForCleanup, testX
 */
```

#### 4.2 Update Documentation
- Update `CLAUDE.md` with refactor results
- Document when to enable feature-flagged code (30-100 user threshold)
- Note community features unhide threshold

---

## 📋 Implementation Checklist

### Phase 0: Alignment Scorecard UI (ROADMAP Priority #1)
- [ ] Create `src/components/alignment/` directory
- [ ] Build `AlignmentScorecard.tsx` main component
- [ ] Build `ContentInputForm.tsx` (grade, subject, content input)
- [ ] Build `ScorecardResults.tsx` (display scorecard, gaps, recommendations)
- [ ] Build `StandardsDisplay.tsx` (show relevant Louisiana Standards)
- [ ] Build `WorkflowStatus.tsx` (show workflow progress)
- [ ] Add route in `App.tsx`: `/alignment-scorecard`
- [ ] Add navigation item in `Navigation.tsx`
- [ ] Add quick access card in `QuickAccessGrid.tsx`
- [ ] Connect to backend workflow: `api.alignmentScorecard.analyzeContentAlignment`
- [ ] Test end-to-end workflow

### Phase 1: Quick Wins
- [ ] Delete `convex/dashboardAnalytics.ts`
- [ ] Delete `convex/adminDebug.ts`
- [ ] Delete `convex/vapi.ts`
- [ ] Delete `convex/router.ts`
- [ ] Delete `src/components/dashboard/CommunityInsights.tsx`
- [ ] Delete `src/components/dashboard/ProgressTrackingChart.tsx`
- [ ] Delete `src/components/dashboard/FrameworkUsageChart.tsx`
- [ ] Delete `src/components/dashboard/TimeSavingsChart.tsx`
- [ ] Delete `src/components/ui/gradient-text.tsx`
- [ ] Update `src/components/dashboard/index.ts` (remove CommunityInsights export)

### Phase 2: Hide Community Features
- [ ] Remove `/community` route from `App.tsx` (lines 92-99)
- [ ] Remove community cards from `QuickAccessGrid.tsx` (ids: "community", "innovation")
- [ ] Remove navigation handlers from `Dashboard.tsx` (handleNavigateToCommunity, handleNavigateToInnovation)
- [ ] Verify community components still exist (for future unhiding)

### Phase 3: Backend Cleanup
- [ ] Remove `currentUser` and `getCurrentUser` aliases from `auth.ts`
- [ ] Remove unused innovation functions from `innovations.ts` (submitInnovation, getAllInnovations, searchInnovations, getInnovationById, getSimilarInnovations, commentInnovation)
- [ ] Move innovation test helpers to `testHelpers.ts` (if not already there)
- [ ] Remove unused testimonial functions from `testimonials.ts` (getTestimonialById, getAllTestimonials, approveTestimonial, getFeaturedTestimonials)
- [ ] Move testimonial test helpers to `testHelpers.ts` (if not already there)
- [ ] Remove deprecated user profile functions from `userProfiles.ts` (createUserProfile, initializeProfileForBeta, createUserProfileForUserId, getAllUserProfiles) - **after verification**
- [ ] Remove test/debug helpers from `betaSignup.ts` (testSendMagicLink, getBetaSignupStats, etc.) - **after verification**
- [ ] Add feature-flag comments to `email.ts` (sendWeeklyPromptEmail, sendWeeklyEmailsToAllUsers)

### Phase 4: Documentation
- [ ] Add status comments to all Convex files
- [ ] Update `CLAUDE.md` with refactor results
- [ ] Document feature-flag activation thresholds

### Testing & Verification
- [ ] Run `pnpm test:once` after each phase
- [ ] Verify no broken imports
- [ ] Test all active routes still work
- [ ] Verify admin dashboard still functional
- [ ] Check framework library still works
- [ ] Confirm time tracking still operational
- [ ] Test Alignment Scorecard end-to-end

---

## 🎯 Expected Results

### Code Reduction
- **Backend:** ~150 functions → ~60-70 active functions (~55% reduction)
- **Files:** 35 total → 31 total (4 files deleted)
- **Frontend:** ~90 components → ~85 components (5 removed)

### Clarity Improvements
- ✅ Clear MVP vs Future feature separation
- ✅ Community features truly hidden (not just nav menu)
- ✅ Test helpers consolidated (already in testHelpers.ts)
- ✅ No orphaned/empty files
- ✅ Alignment Scorecard UI ready for beta launch

### Maintainability
- ✅ Easier to understand what's active vs dormant
- ✅ Clear path to enable community features later (30-100 user threshold)
- ✅ Feature flags documented with activation thresholds
- ✅ Status markers on all files for quick reference

### Beta Launch Readiness
- ✅ Alignment Scorecard UI complete (ROADMAP Priority #1)
- ✅ Dead code removed (reduces confusion)
- ✅ Community features properly hidden
- ✅ Clear separation of MVP vs future features

---

## ⚠️ Important Notes

1. **ROADMAP Alignment:** This refactor prioritizes Alignment Scorecard UI (ROADMAP Priority #1) before cleanup tasks
2. **Community Features:** Backend stays intact - only UI access is hidden. Will unhide when scaling to 30-100 users
3. **Test Helpers:** Already consolidated in `convex/testHelpers.ts` - no need to move again
4. **Verification Required:** Before removing functions, verify they're not used in:
   - Admin dashboard (`src/components/admin/`)
   - Test files (`convex/*.test.ts`)
   - E2E tests (`tests/e2e/`)
5. **Beta Launch Focus:** Complete Phase 0 (Alignment Scorecard UI) before Dec 1, 2025 beta launch
6. **Incremental Approach:** Can do Phase 1-3 in parallel with Phase 0, or after beta launch

---

*This refactoring plan is a living document and will evolve based on implementation findings and beta launch priorities.*
