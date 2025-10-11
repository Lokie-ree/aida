# UI/UX Healing System
## Pelican AI - Phase 1 MVP Interface Audit & Refinement Protocol

**Purpose:** Systematic approach to audit, grade, and refine UI/UX for Phase 1 MVP against Pelican AI's design standards  
**Scope:** Phase 1 MVP interfaces (landing page, beta signup, auth flow, email templates)  
**Standards:** WCAG 2.1 Level AA, Pelican AI Brand Guidelines, Phase 1 MVP Design System
**Context:** Email-first approach for Louisiana educator empowerment

---

## 📋 Pre-Audit Checklist

Before beginning the audit, ensure you have:
- [ ] Latest code pulled from main branch
- [ ] Development server running (`npm run dev`)
- [ ] Convex backend running (`npx convex dev`)
- [ ] Browser DevTools Chrome MCP connected
- [ ] Access to design documentation

**Reference Documents:**
- [Pelican AI Orchestrator](../flow/orchestrator.json) - Phase 1 MVP scope and brand guidelines
- [Design System Implementation](../src/lib/design-system.ts)
- [Agent Specifications](../flow/agent-specs.json) - UX/UI Designer Agent standards

---

## 🔍 Step 1: Capture Current State

### 1.1 Take Screenshots
Use Browser DevTools MCP to capture screenshots of:

**Phase 1 MVP Landing Page (Unauthenticated):**
- [ ] Hero section with "Navigate AI with Confidence" tagline
- [ ] Louisiana educator value proposition
- [ ] Beta invitation section
- [ ] Simple signup form
- [ ] Footer with Pelican AI branding

**Phase 1 MVP Auth Flow:**
- [ ] Beta invitation email template
- [ ] Signup form (name, email, school, subject)
- [ ] Welcome email template
- [ ] Weekly prompt email template
- [ ] Email responsive design (mobile/desktop)

**Phase 1 MVP Components:**
- [ ] Navigation (simple header)
- [ ] Auth modals (sign in, sign up)
- [ ] Form components (beta signup, profile)
- [ ] Email templates (invitation, welcome, weekly prompt)
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

### 2.1 Brand Alignment (Weight: 25%)
**Reference:** [flow/orchestrator.json](../flow/orchestrator.json) - Brand and Design System

**Criteria:**
- [ ] Uses Pelican Blue (`#0ea5e9`) as primary color
- [ ] Uses Louisiana Gold (`#f59e0b`) as accent appropriately  
- [ ] Uses Deep Blue (`#1e40af`) for depth and professionalism
- [ ] Pelican logo/branding visible and consistent
- [ ] Tagline usage correct ("Navigate AI with Confidence")
- [ ] Voice & tone matches brand personality (Professional yet Approachable, Louisiana-Proud, Educator-First)
- [ ] Louisiana educator context present where appropriate
- [ ] Typography uses Lexend (primary), Poppins (headings), JetBrains Mono (code)

**Scoring:**
- 10: Perfect brand alignment, all colors and messaging correct
- 7-9: Minor inconsistencies (wrong shade, missing logo)
- 4-6: Significant issues (wrong colors, missing branding)
- 1-3: No brand alignment, generic appearance

### 2.2 Design System Compliance (Weight: 25%)
**Reference:** [src/lib/design-system.ts](../src/lib/design-system.ts) and [flow/orchestrator.json](../flow/orchestrator.json)

**Typography:**
- [ ] Lexend used for body text (primary font)
- [ ] Poppins used for headings (heading font)
- [ ] JetBrains Mono used for code/prompts (monospace font)
- [ ] Font sizes follow scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl)
- [ ] Line heights appropriate (tight, normal, relaxed)

**Spacing:**
- [ ] Uses 8px base unit spacing scale
- [ ] Consistent padding on cards (p-4, p-6, p-8)
- [ ] Consistent gaps in grids (gap-4, gap-6, gap-8)
- [ ] Section spacing follows scale (space-12, space-16)

**Colors (Phase 1 MVP):**
- [ ] Primary actions use Pelican Blue (`#0ea5e9`)
- [ ] Secondary actions use Louisiana Gold (`#f59e0b`)
- [ ] Deep Blue (`#1e40af`) used for depth and professionalism
- [ ] Semantic colors used correctly (error, warning, info)
- [ ] Neutral grays for professional, accessible design

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
**Reference:** WCAG 2.1 Level AA - Louisiana educator accessibility needs

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

**Touch Targets (Mobile-First):**
- [ ] Minimum 44×44px touch targets
- [ ] Adequate spacing between targets (8px minimum)
- [ ] No hover-only interactions on mobile
- [ ] Mobile-responsive email templates

**Scoring:**
- 10: Fully accessible, passes all WCAG 2.1 AA criteria
- 7-9: Minor issues (missing alt text, contrast borderline)
- 4-6: Significant barriers (keyboard trap, poor contrast)
- 1-3: Inaccessible to many users

### 2.4 User Experience (Weight: 15%)
**Reference:** Phase 1 MVP "Aha! Moment Funnel" - Email-first approach

**Clarity:**
- [ ] Clear visual hierarchy (headings, body, actions)
- [ ] Primary actions obvious and prominent
- [ ] Information architecture logical for Louisiana educators
- [ ] No cognitive overload (appropriate information density)
- [ ] Email templates easy to scan and understand

**Efficiency (Phase 1 MVP Focus):**
- [ ] Beta signup requires ≤3 clicks
- [ ] Forms minimize required fields (name, email, school, subject)
- [ ] Smart defaults provided where appropriate
- [ ] Copy-paste functionality works (weekly prompt emails)
- [ ] Email templates render correctly across devices

**Feedback:**
- [ ] Loading states shown for async operations
- [ ] Success confirmations clear (welcome email, signup confirmation)
- [ ] Error messages helpful and actionable
- [ ] Email delivery confirmations provided

**Consistency:**
- [ ] Navigation consistent across pages
- [ ] Button styles consistent (primary, secondary, outline)
- [ ] Email template styling consistent
- [ ] Spacing patterns consistent

**Scoring:**
- 10: Delightful UX, intuitive and efficient
- 7-9: Good UX with minor friction points
- 4-6: Usable but frustrating in places
- 1-3: Confusing, difficult to use

### 2.5 Responsive Design (Weight: 10%)
**Reference:** Mobile-first approach, Phase 1 MVP email templates

**Layout:**
- [ ] Single column on mobile, multi-column on desktop
- [ ] Content readable without horizontal scroll
- [ ] Email templates scale appropriately
- [ ] Navigation adapts (simple header mobile/desktop)

**Typography:**
- [ ] Font sizes scale down on mobile (10-15%)
- [ ] Line heights increase on mobile for readability
- [ ] No text smaller than 16px on mobile
- [ ] Email text readable on all devices

**Interactions:**
- [ ] Touch-friendly on mobile (44×44px targets)
- [ ] Hover states work on desktop
- [ ] Email links work on mobile and desktop
- [ ] Forms accessible on all devices

**Scoring:**
- 10: Perfect responsive behavior across all breakpoints
- 7-9: Minor issues at specific breakpoints
- 4-6: Broken layouts or unusable on mobile/desktop
- 1-3: Not responsive, single breakpoint only

---

## 🧮 Step 3: Calculate Composite Score

**Formula:**
```
Total Score = (Brand × 0.25) + (Design System × 0.25) + (Accessibility × 0.25) + (UX × 0.15) + (Responsive × 0.10)
```

**Example:**
- Brand Alignment: 9/10 × 0.25 = 2.25
- Design System: 8/10 × 0.25 = 2.0
- Accessibility: 7/10 × 0.25 = 1.75
- User Experience: 9/10 × 0.15 = 1.35
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
- **P0 (Critical):** Accessibility barriers, brand violations, broken functionality, email template issues
- **P1 (High):** Design system violations, poor UX, responsive issues, Louisiana educator context missing
- **P2 (Medium):** Polish, minor inconsistencies, nice-to-haves

---

## ✨ Step 5: Implement Fixes

### 5.1 Make Changes
For each identified issue:
1. Reference the orchestrator.json brand guidelines and Phase 1 MVP scope
2. Update the component code
3. Test in browser at multiple breakpoints
4. Verify accessibility with keyboard navigation
5. Test email templates across devices and email clients
6. Ensure Louisiana educator context is maintained

### 5.2 Document Changes
Update the component file with:
```typescript
/**
 * [Component Name] - Phase 1 MVP
 * 
 * Design System Compliance: ✓
 * Accessibility: WCAG 2.1 AA ✓
 * Responsive: Mobile-first ✓
 * Louisiana Educator Context: ✓
 * Email Template: ✓ (if applicable)
 * 
 * Last Audit: [Date]
 * Score: [X/10]
 * Phase: 1 MVP
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
- [ ] Pelican Blue primary color (`#0ea5e9`)
- [ ] Louisiana Gold accents (`#f59e0b`)
- [ ] Deep Blue for depth (`#1e40af`)
- [ ] Logo visible
- [ ] "Navigate AI with Confidence" tagline
- [ ] Louisiana educator context

**Design System ✓**
- [ ] Correct fonts (Lexend, Poppins, JetBrains Mono)
- [ ] 8px spacing scale
- [ ] Consistent component styling
- [ ] Proper color usage from orchestrator.json

**Accessibility ✓**
- [ ] 4.5:1 text contrast
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] 44×44px touch targets
- [ ] Mobile-responsive email templates

**UX ✓**
- [ ] Clear hierarchy
- [ ] ≤3 clicks to beta signup
- [ ] Helpful feedback
- [ ] Consistent patterns
- [ ] Email-first approach optimized

**Responsive ✓**
- [ ] Works on mobile
- [ ] Works on tablet
- [ ] Works on desktop
- [ ] No horizontal scroll
- [ ] Email templates responsive

---

## 🛠️ Tools & Resources

**Browser DevTools MCP:**
- `take_screenshot` - Capture current state
- `take_snapshot` - Get DOM structure
- `evaluate_script` - Test interactions
- `resize_page` - Test responsive breakpoints

**Reference Documentation:**
- [Orchestrator](../flow/orchestrator.json) - Phase 1 MVP scope and brand guidelines
- [Design System](../src/lib/design-system.ts)
- [Agent Specifications](../flow/agent-specs.json) - UX/UI Designer Agent standards
- [Architecture Decisions](../docs/decisions/README.md) - ADRs for architectural choices

**Testing Tools:**
- WebAIM Contrast Checker
- WAVE Accessibility Tool
- Lighthouse Audit
- axe DevTools

---

## 📌 Best Practices

1. **Audit regularly:** After Phase 1 MVP features, before releases
2. **Focus on Louisiana educator impact:** Prioritize accessibility and UX for busy educators
3. **Document everything:** Screenshots, scores, reasoning
4. **Iterate quickly:** Small fixes, frequent re-audits
5. **Maintain Phase 1 MVP standards:** Don't let technical debt accumulate
6. **Test email templates:** Critical for Phase 1 MVP success
7. **Validate with real educators:** Scores are guides, educator feedback is truth

---

**Last Updated:** October 10, 2025  
**Version:** 2.0 - Phase 1 MVP Aligned  
**Owner:** Development Team  
**Context:** Email-first approach for Louisiana educator empowerment