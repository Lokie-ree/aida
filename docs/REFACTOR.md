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
- **Community Features:** Route exists in App.tsx (`/community` route), navigation cards in QuickAccessGrid, handlers in Dashboard - **NOT truly hidden**
- **Unused Components:** 4 chart components (CommunityInsights, ProgressTrackingChart, FrameworkUsageChart, TimeSavingsChart) - none imported
- **Duplicate Components:** `ui/gradient-text.tsx` duplicates `shared/GradientText.tsx` (only shared version used)
- **Missing UI:** No Alignment Scorecard UI despite being "Core Flare #1" and ROADMAP Priority #1

---

## 🎯 Refactoring Strategy (Prioritized for Beta Launch)

### Phase 0: Alignment Scorecard UI (ROADMAP Priority #1) ⚡
**Status:** Backend complete ✅, UI missing  
**Testing:** Backend workflow tested and working with test data from `populateStandards.ts` ✅  
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

**Component Interfaces:**
- `AlignmentScorecard.tsx`: Main container, manages workflow state
  - Props: None (uses hooks for data)
  - State: `workflowId: string | null`, `currentAnalysis: any | null`
- `ContentInputForm.tsx`: Form for user input
  - Props: `onSubmit: (data: { content: string, gradeLevel: string, subject: "ela" | "math" | "science" | "social_studies", standardCodes?: string[] }) => void`
  - Returns: Form data to parent
- `WorkflowStatus.tsx`: Shows workflow progress
  - Props: `workflowId: string`
  - Uses: `useQuery(api.rag.getAlignmentStatus, { workflowId })` to reactively track status
  - Displays: "inProgress", "completed", "error" states with progress indicators
- `ScorecardResults.tsx`: Displays final analysis results
  - Props: `scorecard: { overallScore: number, breakdown: any[], gaps: string[], recommendations: string[] }`
  - Displays: Score visualization, breakdown table, gaps list, recommendations
- `StandardsDisplay.tsx`: Shows relevant Louisiana Standards
  - Props: `standards: Array<{ code: string, description: string, gradeLevel: string, subject: string, strand?: string, cognitiveDepth?: string }>`
  - Displays: Standards in a searchable/filterable list

**Data Flow:**
1. User submits form → `ContentInputForm` calls `onSubmit`
2. `AlignmentScorecard` calls `useAction(api.rag.analyzeContentAlignment)` → receives `{ workflowId }`
3. `AlignmentScorecard` passes `workflowId` to `WorkflowStatus`
4. `WorkflowStatus` uses `useQuery(api.rag.getAlignmentStatus, { workflowId })` to track progress
5. When workflow completes, `getAlignmentStatus` returns result → `AlignmentScorecard` displays via `ScorecardResults`
6. `AlignmentScorecard` can also fetch recent analyses via `useQuery(api.testHelpers.getRecentAnalyses)`

**Integration Points:**
- Add route in `src/App.tsx`: `/alignment-scorecard` (after `/frameworks` route, before `/community`)
- Add navigation item in `src/components/shared/Navigation.tsx` (add new item to `navigationItems` array, after "Framework Library")
- Add quick access card in `src/components/dashboard/QuickAccessGrid.tsx` (replace "community" card in `getDefaultItems` function)
- Connect to backend: `api.rag.analyzeContentAlignment` (action that starts workflow)

**Backend API to Use:**
- `api.rag.analyzeContentAlignment` - Start workflow (action)
  - Args: `{ content: string, gradeLevel: string, subject: "ela" | "math" | "science" | "social_studies", standardCodes?: string[] }`
  - Returns: `{ workflowId: string }` (NOT the full result - use status query to get result)
- `api.rag.getAlignmentStatus` - Track workflow progress (query)
  - Args: `{ workflowId: string }`
  - Returns: Workflow status object with `type: "inProgress" | "completed" | "error"` and result data when completed
  - Use with: `useQuery(api.rag.getAlignmentStatus, { workflowId })` for reactive updates
- `api.testHelpers.getRecentAnalyses` - Get user's recent analyses (query)
  - Args: None (uses authenticated user)
  - Returns: `Array<{ _id: string, userId: string, content: string, scorecard: { overallScore: number, breakdown: any[], gaps: string[], recommendations: string[] }, gradeLevel: string, subject: string, _creationTime: number }>`
  - Returns up to 10 most recent analyses, ordered by creation time (descending)
- `api.ragService.getStandards` - Get standards by subject/grade (action)
  - Args: `{ subject: "ela" | "math" | "science" | "social_studies", gradeLevel: string, standardCodes?: string[] }`
  - Returns: `Array<{ code: string, description: string, gradeLevel: string, subject: string, strand?: string, cognitiveDepth?: string }>`

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
- ❌ **REMOVE** `/community` route (find route with path="/community" that renders `<InnovationList />`)
- ✅ **KEEP** all community components (will unhide when scaling to 30-100 users)

#### 2.2 Remove Community Navigation Cards
**File:** `src/components/dashboard/QuickAccessGrid.tsx`
- ❌ **REMOVE** "Louisiana Educator Community" card (id: "community") from `getDefaultItems` function
- ❌ **REMOVE** "Share Your Success" card (id: "innovation") from `getDefaultItems` function
- ✅ **NOTE:** Alignment Scorecard card should be added in Phase 0.2 (before or during Phase 2)
- **Implementation Order:** Either (1) Add alignment card in Phase 0.2, then remove community cards in Phase 2, OR (2) Remove community cards in Phase 2 and add alignment card in Phase 0.2 simultaneously

**File:** `src/components/dashboard/Dashboard.tsx`
- ❌ **REMOVE** `handleNavigateToCommunity()` function (find function that navigates to '/community')
- ❌ **REMOVE** `handleNavigateToInnovation()` function (find function that navigates to '/community?tab=innovations')
- ❌ **REMOVE** `onNavigateToCommunity` and `onNavigateToInnovation` props from QuickAccessGrid component call

**Note:** Navigation.tsx already has community hidden (commented out), so no changes needed there.

---

### Phase 3: Backend Cleanup - Consolidate Redundant Code (2-3 hours)
**Priority:** Medium - Improves maintainability, reduces confusion  
**Risk:** Medium - Need to verify all usages first

#### 3.1 Simplify User Query Aliases
**File:** `convex/auth.ts`
- ❌ **REMOVE:** `currentUser` (alias, find `export const currentUser = getCurrentUser`)
- ❌ **REMOVE:** `getCurrentUser` (find `export const getCurrentUser = query(...)`)
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

**Functions to REMOVE (verify not used first):**
- ❌ `submitInnovation` - Duplicate of `shareInnovation` (search for function definition)
- ❌ `getAllInnovations` - Not imported anywhere (search for function definition)
- ❌ `searchInnovations` - Not imported anywhere (search for function definition)
- ❌ `getInnovationById` - Not imported anywhere (search for function definition)
- ❌ `getSimilarInnovations` - Not implemented/used (search for function definition)
- ❌ `commentInnovation` - Not implemented/used (search for function definition)

**Verification:** Before removing, search codebase for imports/usage in:
- Admin dashboard (`src/components/admin/`)
- Test files (`convex/*.test.ts`)
- E2E tests (`tests/e2e/`)

**Test Helpers (verify location, move to testHelpers.ts if not already there):**
- `deleteInnovation` - Test helper (check if in testHelpers.ts, move if not)
- `deleteInnovationInteraction` - Test helper (check if in testHelpers.ts, move if not)
- `getAllInnovationsForCleanup` - Test helper (check if in testHelpers.ts, move if not)
- `getAllInnovationInteractions` - Test helper (check if in testHelpers.ts, move if not)

#### 3.3 Clean Up Testimonial Functions
**File:** `convex/testimonials.ts`

**Functions to KEEP:**
- ✅ `submitTestimonial` - Used in TestimonialForm.tsx

**Functions to REMOVE (verify not used first):**
- ❌ `getTestimonialById` - Not imported (search for function definition)
- ❌ `getAllTestimonials` - Not imported (search for function definition)
- ❌ `approveTestimonial` - Use admin version instead (search for function definition)
- ❌ `getFeaturedTestimonials` - Not imported (search for function definition)

**Verification:** Before removing, search codebase for imports/usage in:
- Admin dashboard (`src/components/admin/`)
- Test files (`convex/*.test.ts`)
- E2E tests (`tests/e2e/`)

**Test Helpers (verify location, move to testHelpers.ts if not already there):**
- `deleteTestimonial` - Test helper (check if in testHelpers.ts, move if not)
- `getAllTestimonialsForCleanup` - Test helper (check if in testHelpers.ts, move if not)

#### 3.4 Deprecate Legacy User Profile Functions
**File:** `convex/userProfiles.ts`

**Functions to REMOVE (after verification):**
- ❌ `createUserProfile` - Already marked @deprecated, use `initializeNewUser` instead (search for function definition)
- ❌ `initializeProfileForBeta` - **Action:** If used, keep; if unused, remove (search for function definition)
- ❌ `createUserProfileForUserId` - **Action:** If used, keep; if unused, remove (search for function definition)
- ❌ `getAllUserProfiles` - **Action:** If used in admin.ts, keep; if unused, remove (search for function definition)

**Verification Required:** Search codebase for usage in:
- Admin dashboard (`src/components/admin/`)
- Admin backend (`convex/admin.ts`)
- Test files (`convex/*.test.ts`)
- E2E tests (`tests/e2e/`)
- **Decision:** If found in admin/test code, keep; if not found anywhere, remove

#### 3.5 Clean Up Beta Signup Functions
**File:** `convex/betaSignup.ts`

**Functions to KEEP:**
- ✅ `signupForBeta` - Used in AuthModal.tsx
- ✅ `getBetaSignupByEmail` - Used in AuthModal.tsx, DashboardRoute.tsx
- ✅ `approveBetaSignup` - Used in AdminDashboard.tsx
- ✅ `getPendingSignups` - Used in AdminDashboard.tsx

**Functions to REMOVE (after verification):**
- ❌ `testSendMagicLink` - Test helper (remove if not used in tests)
- ❌ `getBetaSignupStats` - Debug helper (remove if not used in admin/debug)
- ❌ `updateSignupStatus` - **Action:** If used, keep; if unused, remove (search for function definition)
- ❌ `getBetaSignupById` - **Action:** If used, keep; if unused, remove (search for function definition)
- ❌ `getAllBetaSignups` - **Action:** If used in admin.ts, keep; if unused, remove (search for function definition)
- ❌ `deleteBetaSignup` - Test helper (remove if not used in tests)
- ❌ `recoverDeletedUser` - Test helper (remove if not used in tests)

**Verification Required:** Search codebase for usage in:
- Admin dashboard (`src/components/admin/`)
- Admin backend (`convex/admin.ts`)
- Test files (`convex/*.test.ts`)
- E2E tests (`tests/e2e/`)
- **Decision:** If found in admin/test code, keep; if not found anywhere, remove

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
- [ ] Connect to backend workflow: `api.rag.analyzeContentAlignment` (action)
- [ ] Implement workflow status tracking: `api.rag.getAlignmentStatus` (query)
- [ ] Test end-to-end workflow

### Phase 1: Quick Wins
- [x] Delete `convex/dashboardAnalytics.ts` ✅ (already deleted per git status)
- [x] Delete `convex/adminDebug.ts` ✅ (already deleted per git status)
- [x] Delete `convex/vapi.ts` ✅ (already deleted per git status)
- [x] Delete `convex/router.ts` ✅ (already deleted per git status)
- [ ] Delete `src/components/dashboard/CommunityInsights.tsx`
- [ ] Delete `src/components/dashboard/ProgressTrackingChart.tsx`
- [ ] Delete `src/components/dashboard/FrameworkUsageChart.tsx`
- [ ] Delete `src/components/dashboard/TimeSavingsChart.tsx`
- [ ] Delete `src/components/ui/gradient-text.tsx`
- [ ] Update `src/components/dashboard/index.ts` (remove CommunityInsights export)

### Phase 2: Hide Community Features
- [ ] Remove `/community` route from `App.tsx` (find route with path="/community")
- [ ] Remove community cards from `QuickAccessGrid.tsx` (ids: "community", "innovation" in `getDefaultItems` function)
- [ ] Remove navigation handlers from `Dashboard.tsx` (find `handleNavigateToCommunity` and `handleNavigateToInnovation` functions)
- [ ] Remove handler props from QuickAccessGrid in `Dashboard.tsx` (`onNavigateToCommunity`, `onNavigateToInnovation`)
- [ ] Verify community components still exist (for future unhiding)

### Phase 3: Backend Cleanup
- [ ] Remove `currentUser` and `getCurrentUser` aliases from `auth.ts` (verify only `loggedInUser` is used)
- [ ] Verify and remove unused innovation functions from `innovations.ts` (submitInnovation, getAllInnovations, searchInnovations, getInnovationById, getSimilarInnovations, commentInnovation) - **verify not used in admin/tests first**
- [ ] Verify location and move innovation test helpers to `testHelpers.ts` (if not already there)
- [ ] Verify and remove unused testimonial functions from `testimonials.ts` (getTestimonialById, getAllTestimonials, approveTestimonial, getFeaturedTestimonials) - **verify not used in admin/tests first**
- [ ] Verify location and move testimonial test helpers to `testHelpers.ts` (if not already there)
- [ ] Verify and remove deprecated user profile functions from `userProfiles.ts` (createUserProfile, initializeProfileForBeta, createUserProfileForUserId, getAllUserProfiles) - **verify usage in admin.ts/tests first**
- [ ] Verify and remove test/debug helpers from `betaSignup.ts` (testSendMagicLink, getBetaSignupStats, updateSignupStatus, getBetaSignupById, getAllBetaSignups, deleteBetaSignup, recoverDeletedUser) - **verify not used in admin/tests first**
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
