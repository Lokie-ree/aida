# Admin Features Test Plan - WEB-42 & WEB-43

**Date:** October 28, 2025  
**Status:** Ready for Manual Testing  
**Purpose:** Validate admin dashboard features for content moderation (WEB-42) and beta program management (WEB-43)

---

## ✅ Recent Updates

**Smart Redirect Implementation (October 28, 2025):**
- Added `SmartRedirect` component to automatically route admin users to `/admin` after login
- Regular users continue to be routed to `/dashboard`
- Fixes issue where admin users were being redirected to the regular dashboard
- Admin users now land directly on the admin dashboard after authentication

---

## Test Environment

- **URL:** http://localhost:5173/admin (or just http://localhost:5173 - admins are auto-redirected)
- **Prerequisites:**
  - Must be logged in as admin user (delivered@resend.dev or rplapointjr+reset@gmail.com)
  - Development server running (`npm run dev`)
  - Convex dev deployment active

---

## WEB-42: Content Moderation Tests

### Test Suite 1: Testimonial Moderation

#### TC-ADMIN-001: View Pending Testimonials
**Steps:**
1. Navigate to `/admin`
2. Click "Content Moderation" tab
3. Verify "Pending Testimonials" section displays

**Expected:**
- Section shows pending testimonials count
- Each testimonial displays: quote, userName, school, subject, status badge
- "Approve", "Feature", and "Delete" buttons visible

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-002: Approve Testimonial
**Steps:**
1. In Content Moderation tab
2. Find a pending testimonial
3. Click "Approve" button
4. Verify success toast appears

**Expected:**
- Toast: "Testimonial approved!"
- Testimonial status changes from "pending" to "approved"
- Testimonial appears in community/public view

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-003: Feature Testimonial
**Steps:**
1. In Content Moderation tab
2. Find a pending testimonial
3. Click "Feature" button (star icon)
4. Verify success toast appears

**Expected:**
- Toast: "Testimonial featured!"
- Testimonial status changes to "featured"
- Testimonial marked as featured in database

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-004: Delete Testimonial
**Steps:**
1. In Content Moderation tab
2. Find a testimonial
3. Click "Delete" button
4. Confirmation modal appears
5. Optionally add reason
6. Click "Delete Testimonial"

**Expected:**
- Confirmation modal displays testimonial details
- Optional reason field available
- Browser confirmation dialog appears
- After confirmation: Toast "Testimonial deleted"
- Testimonial removed from list

**Status:** ⏳ Pending Manual Test

---

### Test Suite 2: Innovation Moderation

#### TC-ADMIN-005: View Recent Innovations
**Steps:**
1. Navigate to Content Moderation tab
2. Scroll to "Recent Innovations" section
3. Verify innovations from last 7 days display

**Expected:**
- Up to 10 most recent innovations shown
- Each displays: title, description, school, subject, tags
- Engagement metrics shown (likes, tries, time saved)
- "Delete" button available

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-006: Delete Innovation
**Steps:**
1. In Recent Innovations section
2. Click "Delete" button on an innovation
3. Confirmation modal appears
4. Review innovation details
5. Click "Delete Innovation"

**Expected:**
- Modal shows innovation title, description, author
- Browser confirmation dialog appears
- After confirmation: Toast "Innovation deleted"
- Innovation removed from community

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-007: Empty States
**Steps:**
1. If no pending testimonials exist
2. If no recent innovations exist
3. Verify empty state messages

**Expected:**
- Pending testimonials: "No pending testimonials" with checkmark icon
- Recent innovations: "No recent innovations to review" with lightbulb icon

**Status:** ⏳ Pending Manual Test

---

## WEB-43: Beta Program Management Tests

### Test Suite 3: Beta Signup Approval

#### TC-ADMIN-008: View Pending Beta Signups
**Steps:**
1. Navigate to `/admin`
2. Click "Beta Signups" tab
3. Verify pending signups display

**Expected:**
- List of pending signups shown
- Each displays: email, name, school, subject, signup date
- "Review" button available
- Count badge on tab if signups exist

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-009: Approve Beta Signup
**Steps:**
1. In Beta Signups tab
2. Click "Review" on a pending signup
3. Modal appears with signup details
4. Click "Generate" to create temporary password
5. Verify password appears in field
6. Optionally add notes
7. Click "Approve & Send Email"

**Expected:**
- Modal displays signup details
- Generate button creates 12-character password
- Password field populated
- Notes field optional
- Success toast: "Beta signup approved!"
- Welcome email sent to user
- Signup removed from pending list

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-010: Cancel Signup Approval
**Steps:**
1. Click "Review" on pending signup
2. Modal appears
3. Click "Cancel" button

**Expected:**
- Modal closes
- No changes made to signup status
- Signup remains in pending list

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-011: Empty Pending Signups
**Steps:**
1. When no pending signups exist
2. View Beta Signups tab

**Expected:**
- Empty state message: "No pending beta signups"
- UserPlus icon displayed
- Tab shows no count badge

**Status:** ⏳ Pending Manual Test

---

### Test Suite 4: Beta User Management

#### TC-ADMIN-012: View All Beta Users
**Steps:**
1. Navigate to `/admin`
2. Click "Beta Users" tab
3. Verify all beta users display

**Expected:**
- List of all beta users shown
- Each displays: userName, email, school, status badge
- Stats shown: frameworks tried, time saved
- Status dropdown available for each user

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-013: Update User Status
**Steps:**
1. In Beta Users tab
2. Find a user with "invited" status
3. Click status dropdown
4. Select "active"
5. Verify change applies

**Expected:**
- Dropdown shows: invited, active, completed
- Selection triggers status update
- Success toast: "User status updated to active"
- User's status badge updates immediately
- Change persists in database

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-014: Update to Completed Status
**Steps:**
1. Select a user with "active" status
2. Change status to "completed"
3. Verify completedAt timestamp set

**Expected:**
- Status changes to "completed"
- Badge updates to secondary variant
- completedAt timestamp recorded in database
- Toast confirmation shown

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-015: Status Update Error Handling
**Steps:**
1. Disconnect from network or stop Convex
2. Try to update a user's status
3. Verify error handling

**Expected:**
- Error toast: "Failed to update user status"
- Status reverts to original value
- User not affected by failed update

**Status:** ⏳ Pending Manual Test

---

## Test Suite 5: Dashboard Overview

#### TC-ADMIN-016: View Admin Stats
**Steps:**
1. Navigate to `/admin`
2. Stay on "Overview" tab
3. Verify stats cards display

**Expected:**
- 4 stat cards shown:
  - Total Beta Users (with active/completed breakdown)
  - Testimonials (with pending/featured breakdown)
  - Innovations (total count)
  - Time Saved (total minutes)
- All numbers accurate and real-time

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-017: Tab Navigation
**Steps:**
1. Click through all tabs: Overview, Beta Signups, Content Moderation, Beta Users
2. Verify each loads correctly

**Expected:**
- All tabs clickable
- Content updates when tab changes
- No loading errors
- Badge counts update appropriately

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-018: Tab Badge Counts
**Steps:**
1. Note pending counts on tabs
2. Approve a signup or testimonial
3. Verify badge counts decrement

**Expected:**
- Beta Signups tab: shows pending signup count
- Content Moderation tab: shows pending testimonials count
- Counts update in real-time after actions
- Badge disappears when count reaches 0

**Status:** ⏳ Pending Manual Test

---

## Test Suite 6: Access Control

#### TC-ADMIN-019: Admin-Only Access
**Steps:**
1. Log out
2. Try to navigate to `/admin`
3. Verify redirect

**Expected:**
- Non-authenticated users redirected to landing page
- ProtectedRoute component enforces auth

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-020: Non-Admin User Access
**Steps:**
1. Log in as non-admin user
2. Try to navigate to `/admin`
3. Verify redirect

**Expected:**
- Non-admin users redirected to `/dashboard`
- Admin check enforced by ProtectedRoute
- No admin UI elements visible in navigation

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-021: Admin Badge Display
**Steps:**
1. Log in as admin
2. View admin dashboard header
3. Verify admin badge

**Expected:**
- Red "Admin Only" badge displayed in header
- Clear visual indicator of admin access

**Status:** ⏳ Pending Manual Test

---

## Test Suite 7: Responsive Design

#### TC-ADMIN-022: Mobile View (375px)
**Steps:**
1. Resize browser to mobile width (375px)
2. Navigate through all admin tabs
3. Verify responsive layout

**Expected:**
- All content readable
- Buttons accessible
- Modals fit screen
- No horizontal scroll
- Touch targets minimum 44px

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-023: Tablet View (768px)
**Steps:**
1. Resize to tablet width (768px)
2. Navigate through admin features
3. Verify layout adapts

**Expected:**
- Grid layouts adjust appropriately
- Stats cards stack or reflow
- All features accessible

**Status:** ⏳ Pending Manual Test

---

## Test Suite 8: Error Scenarios

#### TC-ADMIN-024: Network Failure During Moderation
**Steps:**
1. Disconnect network
2. Try to approve testimonial
3. Verify error handling

**Expected:**
- Error toast displayed
- Action doesn't complete
- User feedback clear

**Status:** ⏳ Pending Manual Test

---

#### TC-ADMIN-025: Concurrent Admin Actions
**Steps:**
1. Open admin in two browser windows
2. Approve same testimonial in both
3. Verify conflict handling

**Expected:**
- One succeeds
- Other shows appropriate error or updates
- No data corruption

**Status:** ⏳ Pending Manual Test

---

## Success Criteria

### WEB-42 (Content Moderation)
- ✅ Admins can approve testimonials
- ✅ Admins can feature testimonials
- ✅ Admins can delete testimonials with confirmation
- ✅ Admins can delete inappropriate innovations
- ✅ Pending content clearly visible
- ✅ Empty states display correctly

### WEB-43 (Beta Program Management)
- ✅ Admins can view pending signups
- ✅ Admins can approve signups with temp password
- ✅ Welcome emails sent automatically
- ✅ Admins can view all beta users
- ✅ Admins can update user status (invited/active/completed)
- ✅ Changes persist and update in real-time

### Overall Admin Experience
- ✅ Tabbed interface functional
- ✅ Badge counts accurate
- ✅ Access control enforced
- ✅ Mobile responsive
- ✅ Error handling robust

---

## Test Execution Instructions

1. **Setup:**
   ```bash
   npm run dev
   # Login as admin: rplapointjr+reset@gmail.com
   ```

2. **Navigate to admin:**
   ```
   http://localhost:5173/admin
   ```

3. **Execute tests sequentially** by test suite

4. **Document results:** Mark each test as Pass/Fail

5. **Report bugs:** Create Linear issues for any failures

---

## Notes for Tester

- Admin email is hardcoded in `convex/admin.ts` (line 32-34)
- Test data can be created using the platform (submit testimonials/innovations)
- Beta signups can be created from landing page
- All actions should show toast notifications
- Real-time updates should occur without page refresh

---

**Test Owner:** QA Team  
**Related Issues:** WEB-42, WEB-43  
**Documentation:** See `ARCHITECTURE.md` for technical details

