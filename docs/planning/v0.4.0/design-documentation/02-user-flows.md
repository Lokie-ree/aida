# User Flows
## ~~AI for LA Educators Platform~~ → Pelican AI

**Version:** 1.0  
**Date:** October 4, 2025  
**Status:** Phase 2 - Design Documentation (ARCHIVED)  
**Owner:** UX/UI Designer  

---

## ⚠️ BRANDING UPDATE

**Platform is now "Pelican AI"** - See [docs/PELICAN_AI_BRAND_GUIDELINES.md](../../PELICAN_AI_BRAND_GUIDELINES.md)

---

## 1. Overview

This document details the user flows for the platform, mapping out each step users take to accomplish key tasks. These flows inform the wireframes and final UI design.

### 1.1 Flow Notation

- **[Screen]** - Indicates a screen or page
- **{Action}** - User action or interaction
- **→** - Flow direction
- **?** - Decision point
- **✓** - Success state
- **✗** - Error state

---

## 2. Authentication Flows

### 2.1 First-Time User Sign-Up (Beta Tester)

**Entry Point:** PD presentation QR code or sign-up link

```
[Landing Page]
  ↓
{User clicks "Join Beta Program" CTA}
  ↓
[Sign-Up Form]
  - Email address
  - Full name
  - School
  - Subject/Grade level
  - Current AI tools used (checkboxes)
  - Agree to terms
  ↓
{User submits form}
  ↓
? Email validation
  ↓ Valid
[Email Verification Sent Screen]
  - "Check your email for verification link"
  - Resend option
  ↓
{User clicks verification link in email}
  ↓
[Email Verified Screen]
  ↓
{User sets password}
  ↓
[Password Creation]
  - Password requirements shown
  - Strength indicator
  ↓
{User submits password}
  ↓
✓ [Welcome Screen]
  - Brief welcome message
  - "Get Started" CTA
  ↓
[Onboarding Flow] (See Section 3.1)
```

**Alternative Paths:**
- ✗ Email already exists → Show "Account exists, please sign in" message
- ✗ Invalid email format → Inline validation error
- ✗ Weak password → Show requirements, prevent submission

### 2.2 Returning User Sign-In

**Entry Point:** Landing page or direct URL

```
[Landing Page]
  ↓
{User clicks "Sign In"}
  ↓
[Sign-In Form]
  - Email address
  - Password
  - "Remember me" checkbox
  - "Forgot password?" link
  ↓
{User submits credentials}
  ↓
? Authentication
  ↓ Success
✓ [Dashboard] (See Section 4.1)
  ↓ Failure
✗ [Sign-In Form with error]
  - "Invalid email or password"
  - Highlight error state
```

**Alternative Paths:**
- {User clicks "Forgot password?"} → [Password Reset Flow]
- ✗ Account not verified → Show "Please verify your email" message with resend option

---

## 3. Onboarding Flows

### 3.1 Beta Tester Onboarding

**Entry Point:** First sign-in after email verification

```
[Welcome Screen]
  - Welcome message
  - Brief overview of platform
  - "Let's Get Started" CTA
  ↓
{User clicks "Let's Get Started"}
  ↓
[Onboarding Step 1: Quick Start Guide]
  - Video or interactive tutorial (2 minutes)
  - Key features overview
  - "Next" and "Skip" options
  - Progress indicator (1 of 4)
  ↓
{User clicks "Next"}
  ↓
[Onboarding Step 2: Choose Your First Framework]
  - Display 3 high-impact frameworks
    * Parent Communication Framework
    * Lesson Internalization Framework
    * Differentiation Framework
  - Brief description of each
  - "Select to Try" buttons
  - Progress indicator (2 of 4)
  ↓
{User selects a framework}
  ↓
[Onboarding Step 3: Try Your First Prompt]
  - Display selected framework card
  - Highlight "Copy Prompt" button
  - Instructions: "Copy this prompt and try it in your AI tool"
  - "I tried it!" button
  - Progress indicator (3 of 4)
  ↓
{User clicks "I tried it!"}
  ↓
[Onboarding Step 4: Join the Community]
  - Link to Google Space or collaboration platform
  - Virtual office hours schedule
  - "Join Community" CTA
  - "Complete Onboarding" button
  - Progress indicator (4 of 4)
  ↓
{User clicks "Complete Onboarding"}
  ↓
✓ [Dashboard]
  - Celebration toast: "Welcome! You're all set up 🎉"
  - Highlight key areas of dashboard
```

**Alternative Paths:**
- {User clicks "Skip" at any step} → Jump to dashboard with "Complete onboarding" reminder banner
- {User closes onboarding} → Save progress, show "Continue onboarding" option on next visit

---

## 4. Core Platform Flows

### 4.1 Dashboard Navigation

**Entry Point:** Successful sign-in

```
[Dashboard Home]
  ├─ Header
  │  ├─ Logo (clickable → Home)
  │  ├─ Framework Selector (dropdown)
  │  ├─ Search bar
  │  ├─ Notifications bell
  │  └─ User menu (avatar)
  │
  ├─ Main Content Area
  │  ├─ Welcome banner (collapsible)
  │  │  └─ "Welcome back! Here's your progress this week"
  │  │
  │  ├─ Quick Stats Cards
  │  │  ├─ Time Saved This Week
  │  │  ├─ Frameworks Tried
  │  │  └─ Community Activity
  │  │
  │  ├─ Recommended Frameworks
  │  │  └─ 3-4 framework cards based on user profile
  │  │
  │  └─ Recent Activity Feed
  │     ├─ Your recent framework uses
  │     ├─ Peer innovations shared
  │     └─ New content added
  │
  └─ Sidebar (desktop) / Bottom Nav (mobile)
     ├─ Home
     ├─ All Frameworks
     ├─ My Saved
     ├─ Community
     └─ Settings
```

### 4.2 Browsing Frameworks

**Entry Point:** Dashboard or "All Frameworks" navigation

```
[All Frameworks Page]
  ├─ Header: "Framework Library"
  ├─ Filter Bar
  │  ├─ Module filter: "All" | "AI Basics Hub" | "Instructional Expert Hub"
  │  ├─ Category filter: Dropdown with categories
  │  ├─ Search input
  │  └─ Sort: "Most Popular" | "Newest" | "A-Z"
  │
  └─ Framework Grid
     └─ Framework cards (3-4 columns on desktop, 1-2 on mobile)
        ├─ ID badge (e.g., "AIB-001")
        ├─ Title
        ├─ Module badge
        ├─ Tags
        ├─ Brief description
        ├─ Time estimate
        └─ "View Details" button

{User applies filter}
  ↓
[Filtered Results]
  - Grid updates with matching frameworks
  - Show count: "Showing 12 of 30 frameworks"

{User clicks "View Details" on a framework}
  ↓
[Framework Detail Flow] (See Section 4.3)
```

### 4.3 Using a Framework (Core User Flow)

**Entry Point:** Framework card click from any location

```
[Framework Detail Page]
  ├─ Header
  │  ├─ Back button
  │  ├─ Framework ID + Title
  │  ├─ Save/Bookmark icon
  │  └─ Share button
  │
  ├─ Metadata Bar
  │  ├─ Module badge
  │  ├─ Tags
  │  ├─ Time estimate
  │  └─ Difficulty level
  │
  ├─ Section 1: The Challenge
  │  ├─ Icon (problem/question mark)
  │  ├─ Heading: "The Challenge"
  │  └─ Description (1-2 sentences, italic, relatable)
  │
  ├─ Section 2: The AI-Powered Solution
  │  ├─ Icon (lightbulb)
  │  ├─ Heading: "The AI-Powered Solution"
  │  └─ Step-by-step instructions (numbered list)
  │
  ├─ Section 3: Sample Prompt
  │  ├─ Icon (code/terminal)
  │  ├─ Heading: "Sample Prompt"
  │  ├─ Code block with prompt text
  │  │  └─ Monospace font, syntax highlighting
  │  ├─ "Copy to Clipboard" button (prominent)
  │  └─ Platform compatibility badges
  │
  ├─ Section 4: Ethical Guardrail
  │  ├─ Icon (shield/alert)
  │  ├─ Heading: "Ethical Guardrail"
  │  ├─ Highlighted background (warning color)
  │  └─ Responsible use guidance
  │
  ├─ Section 5: Tips & Variations (collapsible)
  │  └─ Additional tips, alternative phrasings
  │
  └─ Footer Actions
     ├─ "Mark as Tried" button
     ├─ "Report Time Saved" link
     └─ "Share Your Results" link

{User clicks "Copy to Clipboard"}
  ↓
✓ Toast notification: "Prompt copied! ✓"
  ↓
{User clicks "Mark as Tried"}
  ↓
[Feedback Modal]
  ├─ "Great! How did it go?"
  ├─ Rating: 1-5 stars
  ├─ Time saved: Input field (minutes)
  ├─ Optional comment: Textarea
  └─ "Submit Feedback" button
  ↓
{User submits feedback}
  ↓
✓ Toast: "Thanks for your feedback! 🎉"
  ↓
[Framework Detail Page]
  - "Tried" badge appears
  - Time saved added to user stats
```

**Alternative Paths:**
- {User clicks "Save/Bookmark"} → Framework added to "My Saved" list, icon fills
- {User clicks "Share"} → Share modal with copy link option
- {User clicks "Report Time Saved"} → Quick form to log time savings

### 4.4 Community Interaction Flow

**Entry Point:** "Community" navigation or innovation highlight

```
[Community Hub]
  ├─ Header: "Community Innovations"
  ├─ Tabs
  │  ├─ Recent Activity (default)
  │  ├─ Top Innovations
  │  └─ My Contributions
  │
  ├─ "Share Your Innovation" CTA button
  │
  └─ Activity Feed
     └─ Innovation cards
        ├─ Author avatar + name
        ├─ School + subject
        ├─ Innovation title
        ├─ Description
        ├─ Related framework (if applicable)
        ├─ Engagement metrics (likes, tries)
        └─ Actions: Like, "I tried this", Comment

{User clicks "Share Your Innovation"}
  ↓
[Share Innovation Modal]
  ├─ Title: "Share Your AI Innovation"
  ├─ Form fields:
  │  ├─ Innovation title
  │  ├─ Description (textarea)
  │  ├─ Related framework (dropdown, optional)
  │  ├─ Time saved (optional)
  │  └─ Tags (multi-select)
  ├─ "Preview" button
  └─ "Share with Community" button
  ↓
{User submits innovation}
  ↓
✓ Toast: "Innovation shared! 🌟"
  ↓
[Community Hub]
  - New innovation appears in feed
  - User's contribution count increases

{User clicks "I tried this" on an innovation}
  ↓
[Quick Feedback Modal]
  ├─ "How did it work for you?"
  ├─ Rating: 1-5 stars
  ├─ Optional comment
  └─ "Submit" button
  ↓
✓ Innovation card updates with "You tried this" indicator
```

---

## 5. Content Management Flows

### 5.1 Saving & Organizing Frameworks

**Entry Point:** Framework detail page or browse view

```
{User clicks "Save" icon on framework}
  ↓
? Framework already saved?
  ↓ No
✓ Framework added to "My Saved"
  - Icon fills/changes color
  - Toast: "Saved to your collection"
  ↓ Yes
[Unsave Confirmation]
  - "Remove from saved?"
  - "Yes" / "Cancel"
  ↓
✓ Framework removed from "My Saved"
  - Icon returns to outline
  - Toast: "Removed from collection"

[My Saved Page]
  ├─ Header: "My Saved Frameworks"
  ├─ Filter/Sort options
  │  ├─ Filter by module
  │  ├─ Filter by category
  │  └─ Sort: "Recently Added" | "Most Used" | "A-Z"
  │
  └─ Saved Frameworks Grid
     └─ Framework cards with "Remove" option
```

### 5.2 Search Flow

**Entry Point:** Search bar in header (available on all pages)

```
[Any Page with Search Bar]
  ↓
{User clicks search bar}
  ↓
[Search Input Active]
  - Placeholder: "Search frameworks, topics, or keywords..."
  - Recent searches shown (if any)
  ↓
{User types query}
  ↓
[Search Suggestions Dropdown]
  - Auto-complete suggestions
  - Matching frameworks
  - Matching topics/tags
  - "See all results for '[query]'" option
  ↓
{User presses Enter or clicks "See all results"}
  ↓
[Search Results Page]
  ├─ Header: "Results for '[query]'"
  ├─ Result count
  ├─ Filters (same as browse page)
  ├─ Sort options
  │
  └─ Results Grid
     ├─ Framework cards (matching results)
     ├─ Community innovations (if relevant)
     └─ "No results" state if empty
        ├─ Suggestions for alternative searches
        └─ "Browse all frameworks" link
```

---

## 6. Profile & Settings Flows

### 6.1 User Profile Management

**Entry Point:** User menu → "Profile"

```
[User Profile Page]
  ├─ Profile Header
  │  ├─ Avatar (editable)
  │  ├─ Name
  │  ├─ School + Subject
  │  └─ Beta tester badge
  │
  ├─ Stats Dashboard
  │  ├─ Total time saved
  │  ├─ Frameworks tried
  │  ├─ Community contributions
  │  └─ Member since date
  │
  ├─ Tabs
  │  ├─ Overview (default)
  │  ├─ Activity History
  │  └─ Settings
  │
  └─ [Overview Tab]
     ├─ Recent frameworks used
     ├─ Achievements/badges
     └─ Quick stats

{User clicks "Edit Profile"}
  ↓
[Edit Profile Modal]
  ├─ Form fields:
  │  ├─ Name
  │  ├─ School
  │  ├─ Subject/Grade level
  │  ├─ AI tools used (checkboxes)
  │  └─ Bio (optional)
  ├─ Avatar upload
  └─ "Save Changes" button
  ↓
{User saves changes}
  ↓
✓ Toast: "Profile updated"
  ↓
[User Profile Page]
  - Updated information displayed
```

### 6.2 Settings & Preferences

**Entry Point:** User menu → "Settings" or Profile → "Settings" tab

```
[Settings Page]
  ├─ Sidebar Navigation
  │  ├─ Account
  │  ├─ Notifications
  │  ├─ Preferences
  │  └─ Privacy
  │
  └─ [Account Settings]
     ├─ Email address (display only)
     ├─ Change password button
     ├─ Connected accounts (future)
     └─ Delete account (danger zone)

[Notification Settings]
  ├─ Email Notifications
  │  ├─ Weekly prompt email (toggle)
  │  ├─ Community activity (toggle)
  │  ├─ New frameworks (toggle)
  │  └─ Office hours reminders (toggle)
  │
  └─ In-App Notifications
     ├─ Community interactions (toggle)
     ├─ Framework updates (toggle)
     └─ System announcements (toggle)

[Preferences]
  ├─ Appearance
  │  ├─ Theme: Light | Dark | System
  │  └─ Font size: Small | Medium | Large
  │
  ├─ Default Views
  │  ├─ Homepage layout preference
  │  └─ Framework sort preference
  │
  └─ Accessibility
     ├─ Reduce motion (toggle)
     ├─ High contrast mode (toggle)
     └─ Screen reader optimizations (toggle)

{User changes any setting}
  ↓
✓ Auto-save with toast: "Settings saved"
```

---

## 7. Feedback & Support Flows

### 7.1 Providing Feedback on Framework

**Entry Point:** Framework detail page or post-use prompt

```
[Framework Detail Page]
  ↓
{User clicks "Mark as Tried"}
  ↓
[Feedback Modal]
  ├─ "How did it go?"
  ├─ Rating: 1-5 stars (required)
  ├─ Time saved: Number input (minutes, optional)
  ├─ What worked well? (textarea, optional)
  ├─ What could be improved? (textarea, optional)
  └─ "Submit Feedback" button
  ↓
{User submits feedback}
  ↓
✓ Toast: "Thanks for your feedback! 🎉"
  ↓
? Rating < 3 stars?
  ↓ Yes
[Follow-up Modal]
  ├─ "We're sorry it didn't work well"
  ├─ "Would you like to schedule office hours for support?"
  ├─ "Yes, schedule" button
  └─ "No, thanks" button
  ↓ No
[Framework Detail Page]
  - Feedback recorded
  - "Tried" badge appears
```

### 7.2 Getting Help

**Entry Point:** Help icon or "Need Help?" link (available on all pages)

```
[Help Menu Dropdown]
  ├─ Quick Start Guide
  ├─ Framework Library
  ├─ Office Hours Schedule
  ├─ Contact Support
  └─ Report an Issue

{User clicks "Contact Support"}
  ↓
[Support Form Modal]
  ├─ Subject: Dropdown
  │  ├─ Technical issue
  │  ├─ Framework question
  │  ├─ Account issue
  │  └─ Other
  ├─ Description: Textarea
  ├─ Urgency: Low | Medium | High
  ├─ Attach screenshot (optional)
  └─ "Submit" button
  ↓
{User submits support request}
  ↓
✓ [Confirmation Screen]
  ├─ "We've received your request"
  ├─ Ticket number
  ├─ Expected response time
  └─ "Back to Dashboard" button
```

---

## 8. Error & Edge Case Flows

### 8.1 Network Error Handling

```
{Network connection lost during action}
  ↓
[Error Toast]
  ├─ "Connection lost. Retrying..."
  ├─ Spinner icon
  └─ Auto-dismiss on reconnection
  ↓
? Reconnection successful?
  ↓ Yes
✓ Action completes
  - Success toast
  ↓ No (after 3 retries)
[Error Banner]
  ├─ "Unable to connect. Please check your internet connection."
  ├─ "Retry" button
  └─ "Work Offline" option (if applicable)
```

### 8.2 Empty States

```
[My Saved Frameworks - Empty State]
  ├─ Illustration (empty folder icon)
  ├─ Heading: "No saved frameworks yet"
  ├─ Description: "Save frameworks to quickly access them later"
  └─ "Browse Frameworks" CTA button

[Community Hub - No Activity]
  ├─ Illustration (community icon)
  ├─ Heading: "Be the first to share!"
  ├─ Description: "Share your AI innovations with fellow educators"
  └─ "Share Innovation" CTA button

[Search - No Results]
  ├─ Illustration (magnifying glass)
  ├─ Heading: "No results for '[query]'"
  ├─ Suggestions:
  │  ├─ Check spelling
  │  ├─ Try different keywords
  │  └─ Browse all frameworks
  └─ "Clear Search" button
```

### 8.3 Permission/Access Errors

```
{User attempts to access restricted content}
  ↓
[Access Denied Screen]
  ├─ Icon (lock)
  ├─ Heading: "Beta Tester Access Required"
  ├─ Description: "This content is available to beta testers only"
  ├─ "Learn More" button
  └─ "Back to Home" button
```

---

## 9. Mobile-Specific Flows

### 9.1 Mobile Navigation Pattern

```
[Mobile Layout]
  ├─ Top Bar (fixed)
  │  ├─ Menu icon (hamburger)
  │  ├─ Logo (centered)
  │  └─ Search icon
  │
  ├─ Main Content (scrollable)
  │
  └─ Bottom Navigation (fixed)
     ├─ Home
     ├─ Frameworks
     ├─ Community
     └─ Profile

{User taps menu icon}
  ↓
[Slide-in Drawer]
  ├─ User profile summary
  ├─ Navigation links
  │  ├─ Home
  │  ├─ All Frameworks
  │  ├─ My Saved
  │  ├─ Community
  │  ├─ Settings
  │  └─ Help
  ├─ Theme toggle
  └─ Sign out

{User taps outside drawer or X icon}
  ↓
Drawer slides out, returns to previous screen
```

### 9.2 Mobile Framework Interaction

```
[Framework Detail - Mobile]
  ├─ Sticky header with back button
  ├─ Content sections (stacked vertically)
  │  ├─ Challenge
  │  ├─ Solution
  │  ├─ Sample Prompt
  │  └─ Ethical Guardrail
  │
  └─ Sticky Footer Bar
     ├─ "Copy Prompt" button (full width)
     └─ Secondary actions (icons)
        ├─ Save
        ├─ Share
        └─ More (overflow menu)

{User taps "Copy Prompt"}
  ↓
✓ Haptic feedback (vibration)
  ↓
Toast: "Copied! Switch to your AI app to paste"
  ↓
[Quick Action Sheet]
  ├─ "Open MagicSchool AI"
  ├─ "Open Gemini"
  ├─ "Open SchoolAI"
  └─ "Cancel"
```

---

## 10. Flow Summary & Key Metrics

### 10.1 Critical User Paths

**Path 1: Sign-up to First Framework Use**
- Target time: < 5 minutes
- Steps: 7 (sign-up → verify → onboarding → framework selection → copy prompt)
- Success metric: 80%+ completion rate

**Path 2: Returning User to Framework Use**
- Target time: < 30 seconds
- Steps: 3 (sign-in → browse/search → copy prompt)
- Success metric: 90%+ completion rate

**Path 3: Framework Use to Feedback Submission**
- Target time: < 2 minutes
- Steps: 4 (use framework → mark as tried → provide feedback → submit)
- Success metric: 60%+ completion rate

### 10.2 Flow Optimization Priorities

1. **Reduce friction in prompt copying** - Make it one-click from any framework card
2. **Streamline feedback collection** - Use progressive disclosure, don't require all fields
3. **Improve framework discovery** - Smart recommendations based on user profile
4. **Enhance mobile experience** - Optimize for one-handed use, minimize scrolling

---

**End of User Flows Document**
