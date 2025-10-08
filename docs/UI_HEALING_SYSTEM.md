# UI/UX Healing System
## Pelican AI - Interface Audit & Refinement Protocol

**Purpose:** Systematic approach to audit, grade, and refine UI/UX against Pelican AI's design standards  
**Scope:** All user-facing interfaces (landing page, dashboard, framework views, modals, forms)  
**Standards:** WCAG 2.1 Level AA, Pelican AI Brand Guidelines, Design System

---

## 📋 Pre-Audit Checklist

Before beginning the audit, ensure you have:
- [ ] Latest code pulled from main branch
- [ ] Development server running (`npm run dev`)
- [ ] Convex backend running (`npx convex dev`)
- [ ] Browser DevTools Chrome MCP connected
- [ ] Access to design documentation

**Reference Documents:**
- [Pelican AI Brand Guidelines](PELICAN_AI_BRAND_GUIDELINES.md)
- [Design System Implementation](../src/lib/design-system.ts)
- [Architecture](../ARCHITECTURE.md)
- [Planning Design Docs](planning/v0.4.0/design-documentation/)

---

## 🔍 Step 1: Capture Current State

### 1.1 Take Screenshots
Use Browser DevTools MCP to capture screenshots of:

**Landing Page (Unauthenticated):**
- [ ] Hero section (desktop & mobile)
- [ ] Features section
- [ ] Beta signup section
- [ ] Testimonials section
- [ ] FAQ section
- [ ] Footer

**Dashboard (Authenticated):**
- [ ] Dashboard home view
- [ ] Framework library view
- [ ] Framework detail page
- [ ] Community hub (if implemented)
- [ ] User profile
- [ ] Settings page

**Components:**
- [ ] Navigation (header, sidebar, mobile menu)
- [ ] Modals (auth, feedback, share)
- [ ] Cards (framework, testimonial, stats)
- [ ] Forms (sign in, sign up, feedback)
- [ ] Empty states
- [ ] Loading states
- [ ] Error states

### 1.2 Document Interaction States
For each interactive element, capture:
- [ ] Default state
- [ ] Hover state
- [ ] Focus state (keyboard navigation)
- [ ] Active/pressed state
- [ ] Disabled state
- [ ] Error state (for forms)

### 1.3 Test Responsive Breakpoints
Capture at standard breakpoints:
- [ ] Mobile: 375px width (iPhone SE)
- [ ] Mobile: 428px width (iPhone 14 Pro Max)
- [ ] Tablet: 768px width (iPad)
- [ ] Desktop: 1280px width (standard laptop)
- [ ] Desktop: 1920px width (large monitor)

---

## 📊 Step 2: Objective Grading

Grade each screen/component on a scale of **1-10** across these dimensions:

### 2.1 Brand Alignment (Weight: 20%)
**Reference:** [PELICAN_AI_BRAND_GUIDELINES.md](PELICAN_AI_BRAND_GUIDELINES.md)

**Criteria:**
- [ ] Uses Pelican Blue (`#0ea5e9`) as primary color
- [ ] Uses Louisiana Gold (`#f59e0b`) as accent appropriately
- [ ] Pelican logo/branding visible and consistent
- [ ] Tagline usage correct ("Navigate AI with Confidence" / "Your AI Guidance Partner")
- [ ] Voice & tone matches brand personality (professional yet approachable)
- [ ] Louisiana-specific elements present where appropriate

**Scoring:**
- 10: Perfect brand alignment, all colors and messaging correct
- 7-9: Minor inconsistencies (wrong shade, missing logo)
- 4-6: Significant issues (wrong colors, missing branding)
- 1-3: No brand alignment, generic appearance

### 2.2 Design System Compliance (Weight: 25%)
**Reference:** [src/lib/design-system.ts](../src/lib/design-system.ts)

**Typography:**
- [ ] Lexend used for body text
- [ ] Poppins used for headings
- [ ] JetBrains Mono used for code/prompts
- [ ] Font sizes follow scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl)
- [ ] Line heights appropriate (tight, normal, relaxed)

**Spacing:**
- [ ] Uses 8px base unit spacing scale
- [ ] Consistent padding on cards (p-4, p-6, p-8)
- [ ] Consistent gaps in grids (gap-4, gap-6, gap-8)
- [ ] Section spacing follows scale (space-12, space-16)

**Colors:**
- [ ] Primary actions use primary.500 (`#0ea5e9`)
- [ ] Secondary actions use secondary.500 (`#f59e0b`)
- [ ] Success states use accent.500 (`#10B981`)
- [ ] Semantic colors used correctly (error, warning, info)
- [ ] Dark mode support (if applicable)

**Components:**
- [ ] Buttons follow size variants (sm, md, lg)
- [ ] Cards use consistent border radius (rounded-lg)
- [ ] Shadows applied appropriately (shadow-sm, shadow-md, shadow-lg)
- [ ] Icons sized consistently (16px, 20px, 24px, 32px)

**Scoring:**
- 10: Perfect adherence to design system
- 7-9: Minor deviations (inconsistent spacing)
- 4-6: Multiple violations (wrong colors, inconsistent sizing)
- 1-3: No design system compliance

### 2.3 Accessibility (Weight: 25%)
**Reference:** WCAG 2.1 Level AA

**Color Contrast:**
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Large text contrast ratio ≥ 3:1 (18pt+)
- [ ] UI component contrast ratio ≥ 3:1
- [ ] Color not sole means of conveying information

**Keyboard Navigation:**
- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Visible focus indicators (2px ring, 2px offset)
- [ ] Skip links present
- [ ] Escape key closes modals

**Screen Readers:**
- [ ] Semantic HTML used (header, nav, main, footer)
- [ ] ARIA labels on icons and complex components
- [ ] Alt text on all images
- [ ] Form labels properly associated
- [ ] Error messages programmatically linked

**Touch Targets:**
- [ ] Minimum 44×44px touch targets
- [ ] Adequate spacing between targets (8px minimum)
- [ ] No hover-only interactions on mobile

**Scoring:**
- 10: Fully accessible, passes all WCAG 2.1 AA criteria
- 7-9: Minor issues (missing alt text, contrast borderline)
- 4-6: Significant barriers (keyboard trap, poor contrast)
- 1-3: Inaccessible to many users

### 2.4 User Experience (Weight: 20%)
**Reference:** [planning/v0.4.0/design-documentation/02-user-flows.md](planning/v0.4.0/design-documentation/02-user-flows.md)

**Clarity:**
- [ ] Clear visual hierarchy (headings, body, actions)
- [ ] Primary actions obvious and prominent
- [ ] Information architecture logical
- [ ] No cognitive overload (appropriate information density)

**Efficiency:**
- [ ] Critical tasks require ≤3 clicks
- [ ] Forms minimize required fields
- [ ] Smart defaults provided
- [ ] Copy-paste functionality works (framework prompts)

**Feedback:**
- [ ] Loading states shown for async operations
- [ ] Success confirmations clear (toasts, messages)
- [ ] Error messages helpful and actionable
- [ ] Progress indicators for multi-step flows

**Consistency:**
- [ ] Navigation consistent across pages
- [ ] Button styles consistent (primary, secondary, outline)
- [ ] Card layouts consistent
- [ ] Spacing patterns consistent

**Scoring:**
- 10: Delightful UX, intuitive and efficient
- 7-9: Good UX with minor friction points
- 4-6: Usable but frustrating in places
- 1-3: Confusing, difficult to use

### 2.5 Responsive Design (Weight: 10%)
**Reference:** Mobile-first approach, breakpoints at 640px, 768px, 1024px, 1280px

**Layout:**
- [ ] Single column on mobile, multi-column on desktop
- [ ] Content readable without horizontal scroll
- [ ] Images/media scale appropriately
- [ ] Navigation adapts (bottom nav mobile, sidebar desktop)

**Typography:**
- [ ] Font sizes scale down on mobile (10-15%)
- [ ] Line heights increase on mobile for readability
- [ ] No text smaller than 16px on mobile

**Interactions:**
- [ ] Touch-friendly on mobile (44×44px targets)
- [ ] Hover states work on desktop
- [ ] Swipe gestures intuitive (if used)
- [ ] Modals full-screen on mobile, centered on desktop

**Scoring:**
- 10: Perfect responsive behavior across all breakpoints
- 7-9: Minor issues at specific breakpoints
- 4-6: Broken layouts or unusable on mobile/desktop
- 1-3: Not responsive, single breakpoint only

---

## 🧮 Step 3: Calculate Composite Score

**Formula:**
```
Total Score = (Brand × 0.20) + (Design System × 0.25) + (Accessibility × 0.25) + (UX × 0.20) + (Responsive × 0.10)
```

**Example:**
- Brand Alignment: 9/10 × 0.20 = 1.8
- Design System: 8/10 × 0.25 = 2.0
- Accessibility: 7/10 × 0.25 = 1.75
- User Experience: 9/10 × 0.20 = 1.8
- Responsive: 8/10 × 0.10 = 0.8
- **Total: 8.15/10** ✅ (Passes threshold)

**Thresholds:**
- **9.0-10.0:** Excellent - Minor polish only
- **8.0-8.9:** Good - Small refinements needed
- **7.0-7.9:** Acceptable - Moderate improvements needed
- **< 7.0:** Needs significant work - Proceed to Step 4

---

## 🔧 Step 4: Identify & Prioritize Issues

For any screen/component scoring **< 8.0**, create an issue list:

### Issue Template
```markdown
**Component:** [Name]
**Score:** [X/10]
**Category:** [Brand/Design System/Accessibility/UX/Responsive]
**Priority:** [P0/P1/P2]
**Issue:** [Specific problem]
**Expected:** [What it should be]
**Fix:** [Proposed solution]
**Reference:** [Link to design doc/guideline]
```

### Priority Levels
- **P0 (Critical):** Accessibility barriers, brand violations, broken functionality
- **P1 (High):** Design system violations, poor UX, responsive issues
- **P2 (Medium):** Polish, minor inconsistencies, nice-to-haves

---

## ✨ Step 5: Implement Fixes

### 5.1 Make Changes
For each identified issue:
1. Reference the appropriate design documentation
2. Update the component code
3. Test in browser at multiple breakpoints
4. Verify accessibility with keyboard navigation
5. Check dark mode (if applicable)

### 5.2 Document Changes
Update the component file with:
```typescript
/**
 * [Component Name]
 * 
 * Design System Compliance: ✓
 * Accessibility: WCAG 2.1 AA ✓
 * Responsive: Mobile-first ✓
 * 
 * Last Audit: [Date]
 * Score: [X/10]
 */
```

---

## 🔄 Step 6: Re-Audit

After implementing fixes:
1. **Repeat Step 1:** Capture new screenshots
2. **Repeat Step 2:** Re-grade against criteria
3. **Verify improvement:** New score should be ≥ 8.0
4. **If still < 8.0:** Return to Step 4 and refine further

**Success Criteria:**
- All screens/components score ≥ 8.0
- No P0 issues remaining
- All P1 issues resolved or documented for future sprint
- P2 issues tracked in backlog

---

## 📝 Step 7: Document Results

Create an audit report:

```markdown
# UI/UX Audit Report
**Date:** [Date]
**Auditor:** [Name]
**Scope:** [Screens/components audited]

## Summary
- **Total Components Audited:** [N]
- **Average Score:** [X/10]
- **Components Passing (≥8.0):** [N]
- **Components Needing Work (<8.0):** [N]

## Detailed Scores
| Component | Brand | Design | A11y | UX | Responsive | Total |
|-----------|-------|--------|------|----|-----------| ------|
| Landing   | 9/10  | 8/10   | 7/10 | 9/10| 8/10     | 8.2   |
| Dashboard | 8/10  | 9/10   | 8/10 | 8/10| 9/10     | 8.4   |
| ...       | ...   | ...    | ...  | ... | ...      | ...   |

## Issues Identified
[List of issues with priorities]

## Fixes Implemented
[List of changes made]

## Recommendations
[Future improvements]
```

---

## 🎯 Quick Audit Checklist

Use this for rapid spot-checks:

**Brand ✓**
- [ ] Pelican Blue primary color
- [ ] Louisiana Gold accents
- [ ] Logo visible
- [ ] Correct tagline

**Design System ✓**
- [ ] Correct fonts (Lexend, Poppins)
- [ ] 8px spacing scale
- [ ] Consistent component styling
- [ ] Proper color usage

**Accessibility ✓**
- [ ] 4.5:1 text contrast
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] 44×44px touch targets

**UX ✓**
- [ ] Clear hierarchy
- [ ] ≤3 clicks to action
- [ ] Helpful feedback
- [ ] Consistent patterns

**Responsive ✓**
- [ ] Works on mobile
- [ ] Works on tablet
- [ ] Works on desktop
- [ ] No horizontal scroll

---

## 🛠️ Tools & Resources

**Browser DevTools MCP:**
- `take_screenshot` - Capture current state
- `take_snapshot` - Get DOM structure
- `evaluate_script` - Test interactions
- `resize_page` - Test responsive breakpoints

**Reference Documentation:**
- [Brand Guidelines](PELICAN_AI_BRAND_GUIDELINES.md)
- [Design System](../src/lib/design-system.ts)
- [Planning Docs](planning/v0.4.0/design-documentation/)
- [Architecture](../ARCHITECTURE.md)

**Testing Tools:**
- WebAIM Contrast Checker
- WAVE Accessibility Tool
- Lighthouse Audit
- axe DevTools

---

## 📌 Best Practices

1. **Audit regularly:** After major features, before releases
2. **Focus on user impact:** Prioritize accessibility and UX over polish
3. **Document everything:** Screenshots, scores, reasoning
4. **Iterate quickly:** Small fixes, frequent re-audits
5. **Maintain standards:** Don't let technical debt accumulate
6. **Test with real users:** Scores are guides, user feedback is truth

---

**Last Updated:** October 8, 2025  
**Version:** 1.0  
**Owner:** Development Team