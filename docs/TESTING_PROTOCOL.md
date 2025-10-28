# Pelican AI - E2E Testing Protocol

**Version:** 2.0  
**Date:** November 2025  
**Status:** Active - Phase 2 Complete, Pre-Launch  
**Objective:** Comprehensive end-to-end testing of all Phase 2 features before beta launch

---

## Overview

This protocol defines the complete E2E testing strategy for Pelican AI Phase 2 features, ensuring platform readiness for beta launch. All features have been implemented and are ready for validation.

**Current Status:**
- ✅ **Phase 2 MVP Complete** (October 26, 2025)
- ✅ **Backend Fully Implemented** (80+ Convex functions)
- ✅ **UI Fully Exposed** (Framework library, community, dashboard, admin)
- ⏳ **E2E Testing Pending** (Ready to execute)

---

## Pre-Testing Checklist

### Environment Setup
- [ ] Development environment running (`npx convex dev`)
- [ ] Test user credentials ready
- [ ] Database seeded with test frameworks (80+)
- [ ] Test data cleanup protocol understood
- [ ] Browser tools configured (DevTools, network monitoring)

### Test Data Requirements
- [ ] At least 10 AI frameworks seeded
- [ ] Test innovations and testimonials in database
- [ ] Admin user account configured
- [ ] Time tracking data initialized
- [ ] User profile fully configured

---

## Test Execution Plan

### Phase 1: Framework Library (USER-003, USER-004, USER-005)

**Duration:** 2-3 days  
**Test Cases:** 14 test cases  
**Focus:** Browse, use, and save framework prompts

#### Test Suite: Framework Library Core

**TC-FRAMEWORK-001: View Framework Library**
- Navigate to `/frameworks`
- Verify grid layout with 10+ frameworks
- Check metadata display (title, module, category, difficulty, time estimate)
- Validate Louisiana standards badge
- **Success Criteria:** Page loads <3s, all metadata visible

**TC-FRAMEWORK-002: Filter Frameworks by Module**
- Test "AI Basics Hub" filter
- Test "Instructional Expert Hub" filter
- Test "All Modules" reset
- **Success Criteria:** Filters apply instantly, count updates correctly

**TC-FRAMEWORK-003: Search Frameworks**
- Search by title ("lesson plan")
- Test real-time filtering
- Test empty state
- **Success Criteria:** Search results accurate, <200ms response

**TC-FRAMEWORK-004: View Framework Metadata**
- Open framework detail modal
- Verify all metadata fields
- Check Louisiana standards alignment
- Verify platform compatibility indicators
- **Success Criteria:** All metadata populated correctly

**TC-FRAMEWORK-005: Mobile Framework Browsing**
- Test on mobile viewport (375x667)
- Verify single-column layout
- Test touch interactions
- **Success Criteria:** Fully responsive, no layout issues

**TC-FRAMEWORK-006: Accessibility Validation**
- Navigate with keyboard only
- Test screen reader compatibility
- Verify ARIA labels
- Check color contrast ratios
- **Success Criteria:** WCAG 2.1 AA compliant

**TC-FRAMEWORK-007: Copy Prompt to Clipboard**
- Click "Copy Prompt" button
- Verify success message
- Paste and validate content
- **Success Criteria:** Prompt copied correctly, notification shown

**TC-FRAMEWORK-008: Track Framework Usage**
- Copy framework prompt
- Refresh page
- Verify usage count incremented
- **Success Criteria:** Usage tracking works, analytics recorded

**TC-FRAMEWORK-009: View Platform Compatibility**
- Check platform compatibility section
- Verify platform badges (MagicSchool AI, Brisk, Gemini, etc.)
- Check "Works with ANY AI tool" messaging
- **Success Criteria:** Platform-agnostic messaging clear

**TC-FRAMEWORK-010: View Ethical Guardrails**
- Locate ethical guardrails section
- Verify FERPA warnings
- Check Louisiana-specific guidance
- **Success Criteria:** Ethical warnings prominently displayed

**TC-FRAMEWORK-011: Save Framework**
- Click "Save" icon on framework card
- Verify icon changes to "Saved"
- Check "My Saved Frameworks" section
- **Success Criteria:** Framework saved, appears in saved list

**TC-FRAMEWORK-012: Unsave Framework**
- Navigate to saved frameworks
- Click "Unsave"
- Verify removal from saved list
- **Success Criteria:** Framework removed, indicator reverts

**TC-FRAMEWORK-013: Saved Frameworks Persist**
- Save 3 frameworks
- Log out and back in
- Verify saved frameworks retained
- **Success Criteria:** Data persists across sessions

**TC-FRAMEWORK-014: Saved Framework Indicator**
- Browse framework library
- Verify saved frameworks marked clearly
- Test visual distinction
- **Success Criteria:** Saved status obvious, accessible

---

### Phase 2: Community Features (USER-006, USER-007, USER-008)

**Duration:** 2-3 days  
**Test Cases:** 14 test cases  
**Focus:** Innovation sharing, discovery, and testimonials

#### Test Suite: Community Core

**TC-COMMUNITY-001: Submit Innovation**
- Fill innovation form (title, description, tags)
- Select subject/grade level/AI tool
- Submit innovation
- **Success Criteria:** Submission successful, enters moderation queue

**TC-COMMUNITY-002: Innovation Form Validation**
- Test empty required fields
- Verify error messages
- Test character limits
- **Success Criteria:** Validation prevents invalid submission

**TC-COMMUNITY-003: Tag Innovation**
- Add tags (subject, grade, AI tool, custom)
- Verify tags display
- **Success Criteria:** Tags properly formatted and searchable

**TC-COMMUNITY-004: Louisiana Context Encouragement**
- Locate Louisiana standards field
- Select Louisiana standard
- Verify Louisiana badge added
- **Success Criteria:** Louisiana context encouraged and displayed

**TC-COMMUNITY-005: Mobile Innovation Submission**
- Test form on mobile (375x667)
- Verify keyboard behavior
- Test touch targets
- **Success Criteria:** Form fully functional on mobile

**TC-COMMUNITY-006: View Community Innovations**
- Navigate to `/community`
- Verify chronological display
- Check all innovation metadata
- **Success Criteria:** Innovations displayed, page loads <3s

**TC-COMMUNITY-007: Filter Innovations**
- Filter by subject ("Mathematics")
- Reset to "All Subjects"
- **Success Criteria:** Filters apply instantly, count updates

**TC-COMMUNITY-008: Search Innovations**
- Search for "differentiation"
- Verify real-time filtering
- Test empty state
- **Success Criteria:** Search works, results accurate

**TC-COMMUNITY-009: View Innovation Details**
- Click innovation card
- Verify detail view opens
- Check all fields populated
- **Success Criteria:** Detail view shows all information

**TC-COMMUNITY-010: Like Innovation**
- Click "Like" button
- Verify count increments
- Refresh page
- **Success Criteria:** Like persists across sessions

**TC-COMMUNITY-011: Submit Testimonial**
- Fill testimonial form
- Include quote, time saved, impact
- Submit testimonial
- **Success Criteria:** Testimonial enters moderation queue

**TC-COMMUNITY-012: Testimonial Form Validation**
- Test required fields
- Test character limits
- **Success Criteria:** Validation prevents invalid submission

**TC-COMMUNITY-013: Louisiana Context in Testimonials**
- Select Louisiana school
- Verify Louisiana badge
- **Success Criteria:** Louisiana context displayed

**TC-COMMUNITY-014: View Submitted Testimonials**
- Navigate to profile/dashboard
- Locate "My Testimonials"
- Verify status (pending/approved)
- **Success Criteria:** All submitted testimonials visible

---

### Phase 3: Dashboard Features (USER-009, USER-010)

**Duration:** 1-2 days  
**Test Cases:** 9 test cases  
**Focus:** Personal progress and quick start

#### Test Suite: Dashboard Core

**TC-DASHBOARD-001: View Personal Dashboard**
- Navigate to `/dashboard`
- Verify stats display (frameworks tried, time saved, innovations shared)
- Check engagement streak
- **Success Criteria:** All stats accurate, page loads <3s

**TC-DASHBOARD-002: View Time Savings Tracker**
- Check weekly view (default)
- Switch to monthly view
- Switch to total view
- **Success Criteria:** Data accurate across all time ranges

**TC-DASHBOARD-003: View Engagement Streak**
- Locate streak indicator
- Verify count displayed
- Hover for details
- **Success Criteria:** Streak clearly displayed

**TC-DASHBOARD-004: View Frameworks Tried**
- Locate frameworks tried section
- Verify count matches usage
- Open list of tried frameworks
- **Success Criteria:** Accurate framework count and list

**TC-DASHBOARD-005: Dashboard Mobile View**
- Test on mobile (375x667)
- Verify responsive layout
- Test scrolling
- **Success Criteria:** Fully responsive, no layout issues

**TC-DASHBOARD-006: View Recommended Frameworks**
- Check "Recommended for You" section
- Verify 3-5 frameworks recommended
- Verify matches user profile
- **Success Criteria:** Recommendations personalized and relevant

**TC-DASHBOARD-007: View Recently Used Frameworks**
- Locate "Recently Used" section
- Verify chronological order
- Open framework detail
- **Success Criteria:** Recently used frameworks accessible

**TC-DASHBOARD-008: Access Framework Library**
- Click "Browse Framework Library" button
- Verify navigation to library
- **Success Criteria:** One-click navigation works

**TC-DASHBOARD-009: New User Onboarding**
- Log in as new user
- Verify onboarding modal/flow appears
- Complete onboarding
- **Success Criteria:** Onboarding guides new users

---

### Phase 4: Admin Features (USER-021, USER-022)

**Duration:** 2-3 days  
**Test Cases:** 9 test cases  
**Focus:** Content moderation and beta program management

#### Test Suite: Admin Core

**TC-ADMIN-001: Access Admin Dashboard**
- Navigate to `/admin` as admin
- Verify admin dashboard loads
- Test non-admin access blocked
- **Success Criteria:** Proper access control enforced

**TC-ADMIN-002: Review Pending Content**
- Navigate to "Pending Content" section
- Verify pending items displayed
- Check count matches database
- **Success Criteria:** All pending items visible

**TC-ADMIN-003: Approve Content**
- Review pending innovation
- Click "Approve" button
- Verify confirmation dialog
- **Success Criteria:** Innovation approved, appears in community

**TC-ADMIN-004: Reject Content**
- Review pending testimonial
- Click "Reject"
- Enter rejection reason
- **Success Criteria:** Content rejected, reason recorded

**TC-ADMIN-005: View Moderation History**
- Navigate to "Moderation History"
- Verify audit trail
- Filter by action type
- **Success Criteria:** Complete audit trail visible

**TC-ADMIN-006: View Beta Signups**
- Navigate to "Beta Program" section
- Verify pending signups displayed
- Check signup details
- **Success Criteria:** All signups visible, details complete

**TC-ADMIN-007: Approve Beta Signup**
- Review signup details
- Click "Approve"
- Verify welcome email sent
- **Success Criteria:** User account created, email sent

**TC-ADMIN-008: Track Beta User Engagement**
- Navigate to "User Engagement"
- View engagement metrics
- Check individual user details
- **Success Criteria:** Engagement metrics accurate

**TC-ADMIN-009: Monitor Platform Health**
- Navigate to "Platform Health"
- Check system metrics
- Verify alerts functional
- **Success Criteria:** Health metrics displayed, alerts work

---

## Cross-Device & Accessibility Testing

### Mobile Testing (iOS/Android)
- **Devices:** iPhone 12/13/14, Samsung Galaxy S21/S22
- **Browsers:** Safari iOS, Chrome Android
- **Coverage:** All critical user flows on mobile

### Accessibility Testing
- **Keyboard Navigation:** All interactive elements accessible
- **Screen Reader:** NVDA (Windows), VoiceOver (iOS)
- **Color Contrast:** ≥4.5:1 for normal text
- **Semantic HTML:** Proper heading hierarchy

### Cross-Browser Testing
- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest version
- **Safari:** Latest version

---

## Performance Benchmarks

### Page Load Times
- Dashboard: <3s
- Framework Library: <3s
- Community Page: <3s
- Admin Dashboard: <3s

### API Response Times
- Framework queries: <500ms
- Innovation submission: <1s
- Time tracking updates: <500ms

### Mobile Performance
- First Contentful Paint: <1.5s
- Time to Interactive: <3s

---

## Bug Reporting

### Severity Levels
- **Critical (P0):** Blocks Phase 2 launch
- **High (P1):** Must fix before beta testing
- **Medium (P2):** Fix before general availability
- **Low (P3):** Backlog for future sprints

### Bug Report Template
```markdown
**Title:** [Brief description]
**Severity:** [P0/P1/P2/P3]
**User Story:** [USER-XXX]
**Test Case:** [TC-XXX-XXX]
**Environment:** [Dev/Preview/Production]
**Steps to Reproduce:**
1. 
2. 
3.
**Expected Result:**
**Actual Result:**
**Screenshots/Logs:**
```

---

## Success Criteria

### Test Coverage
- ✅ **100% of P0 user stories tested**
- ✅ **66 test cases executed**
- ✅ **95%+ pass rate on first execution**

### Critical Bugs
- ❌ **Zero critical bugs acceptable**

### Performance
- ✅ **All pages <3s load time**
- ✅ **API responses <500ms for critical operations**

### Accessibility
- ✅ **WCAG 2.1 AA compliance**
- ✅ **Full keyboard navigation**
- ✅ **Screen reader compatibility**

### Mobile
- ✅ **Full functionality on mobile**
- ✅ **Touch targets meet minimum size**
- ✅ **No horizontal scrolling**

---

## Test Execution Workflow

### Day 1-2: Framework Library Testing
```bash
# Run framework library tests
pnpm test:e2e --suite framework

# Check results
# Report bugs in Linear
# Retest fixes
```

### Day 3-4: Community Features Testing
```bash
# Run community tests
pnpm test:e2e --suite community

# Validate testimonial submission (verify form created)
# Report bugs in Linear
# Retest fixes
```

### Day 5: Dashboard Testing
```bash
# Run dashboard tests
pnpm test:e2e --suite dashboard

# Validate all stats and quick start features
# Report bugs in Linear
# Retest fixes
```

### Day 6-7: Admin Features Testing
```bash
# Run admin tests
pnpm test:e2e --suite admin

# Test moderation workflow
# Test beta program management
# Report bugs in Linear
```

### Day 8: Cross-Device & Accessibility
```bash
# Run mobile tests
pnpm test:e2e --mobile

# Run accessibility audit
pnpm test:accessibility

# Cross-browser testing
```

### Day 9-10: Bug Fixes & Retesting
```bash
# Fix critical bugs
# Retest all scenarios
# Verify 100% test coverage
```

---

## Next Steps After Testing

1. **Document Test Results:** Create test execution report
2. **Update Linear Issues:** Mark completed user stories as "Done"
3. **Sign-Off:** QA sign-off for beta launch
4. **Prepare Launch:** Beta launch announcement and onboarding

---

**Last Updated:** November 2025  
**Status:** Ready for Execution  
**Owner:** QA Agent (@.cursor/rules/qa.mdc)

