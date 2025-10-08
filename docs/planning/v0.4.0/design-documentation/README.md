# Design Documentation
## ~~AI for LA Educators Platform~~ → Pelican AI

**Version:** 1.0  
**Date:** October 4, 2025  
**Status:** Phase 2 - Complete (ARCHIVED - See note below)  
**Owner:** UX/UI Designer  

---

## ⚠️ BRANDING UPDATE NOTICE

**This documentation was created before final branding decisions.** The platform is now branded as **"Pelican AI"** with updated visual identity:

- **Name:** Pelican AI (not "AI for LA Educators")
- **Logo:** Pelican silhouette (not compass/lighthouse)
- **Primary Color:** Pelican Blue `#0ea5e9` (not `#3B82F6`)
- **Secondary Color:** Louisiana Gold `#f59e0b` (matches planning)
- **Fonts:** Lexend, Poppins, JetBrains Mono (matches planning ✓)

**For current branding:** See [docs/PELICAN_AI_BRAND_GUIDELINES.md](../../PELICAN_AI_BRAND_GUIDELINES.md)  
**For implemented design system:** See [src/lib/design-system.ts](../../../src/lib/design-system.ts)

---

## Overview

This directory contains the complete design documentation for the platform. The design phase translates the Product Requirements Document (PRD) into a comprehensive visual and interaction design system ready for technical implementation.

---

## Document Index

### 1. [Design System](./01-design-system.md)
**Purpose:** Establishes the visual language, component library, and design patterns

**Contents:**
- Brand foundation and visual identity
- Complete color system (primary, secondary, accent, semantic, dark mode)
- Typography system (Lexend, Poppins, JetBrains Mono)
- Spacing and layout systems
- Component specifications (buttons, forms, cards, navigation, feedback)
- Iconography guidelines (Lucide React)
- Motion and animation principles
- Accessibility standards (WCAG 2.1 Level AA)
- Responsive design strategy
- Dark mode implementation
- Design tokens and component library integration

**Key Decisions:**
- ✅ Lexend as primary font (educational context, high readability)
- ✅ Compass/lighthouse logo concept (guidance symbolism)
- ✅ Blue/Gold/Green color palette (trust, Louisiana spirit, growth)
- ✅ 8px spacing scale for consistency
- ✅ Mobile-first responsive approach
- ✅ shadcn/ui as component foundation

### 2. [User Flows](./02-user-flows.md)
**Purpose:** Maps all user interactions and decision points

**Contents:**
- Authentication flows (sign-up, sign-in, password reset)
- Onboarding flows (4-step beta tester onboarding)
- Core platform flows (dashboard, browsing, framework usage, community)
- Content management flows (saving, searching, organizing)
- Profile and settings flows
- Feedback and support flows
- Error and edge case handling
- Mobile-specific interaction patterns
- Flow metrics and optimization priorities

**Key User Paths:**
- ✅ Sign-up to first framework use: < 5 minutes, 7 steps
- ✅ Returning user to framework use: < 30 seconds, 3 steps
- ✅ Framework use to feedback: < 2 minutes, 4 steps

---

## Design Principles

### 1. Educator-First Design
Every design decision prioritizes educator needs and workflows. We design for time-starved professionals who need immediate value with minimal learning curve.

**Application:**
- One-click prompt copying
- Clear, scannable content hierarchy
- Minimal clicks to value
- Mobile-optimized for on-the-go use

### 2. Clarity Over Complexity
Simple, intuitive interfaces that reduce cognitive load. Educators shouldn't need to "learn" the platform—it should feel immediately familiar.

**Application:**
- Consistent navigation patterns
- Clear labeling and iconography
- Progressive disclosure (show advanced features only when needed)
- Familiar UI patterns (no novel interactions)

### 3. Trust & Warmth
Professional yet approachable design that builds confidence in AI guidance. The platform should feel like a supportive colleague, not a corporate tool.

**Application:**
- Warm color palette (gold accents)
- Friendly, conversational copy
- Celebration moments (toasts, badges)
- Transparent about AI capabilities and limitations

### 4. Accessibility First
WCAG 2.1 Level AA compliance ensures all educators can participate, regardless of ability or device.

**Application:**
- 4.5:1 color contrast minimum
- Keyboard navigation support
- Screen reader optimization
- Reduced motion support
- Touch target minimum 44×44px

### 5. Scalability
Flexible design system that grows from beta (30-50 users) to district-wide deployment (hundreds of users) to statewide expansion.

**Application:**
- Modular component system
- Design tokens for easy theming
- Documented patterns and guidelines
- Version-controlled design system

---

## Key Screens & Components

### Core Screens

**1. Landing Page (Unauthenticated)**
- Hero section with value proposition
- Beta program CTA
- Feature highlights
- Testimonials (post-beta)
- Footer with links

**2. Dashboard (Authenticated Home)**
- Welcome banner with weekly progress
- Quick stats cards (time saved, frameworks tried, community activity)
- Recommended frameworks (personalized)
- Recent activity feed
- Navigation sidebar/bottom nav

**3. Framework Library**
- Filter bar (module, category, search)
- Sort options (popular, newest, A-Z)
- Framework grid (3-4 columns desktop, 1-2 mobile)
- Framework cards with metadata

**4. Framework Detail Page**
- Header with actions (back, save, share)
- Metadata bar (module, tags, time estimate)
- Challenge section (problem statement)
- Solution section (step-by-step)
- Sample prompt section (copy button, code block)
- Ethical guardrail section (highlighted)
- Tips & variations (collapsible)
- Footer actions (mark as tried, report time saved)

**5. Community Hub**
- Tabs (recent activity, top innovations, my contributions)
- "Share Your Innovation" CTA
- Innovation feed with cards
- Engagement actions (like, try, comment)

**6. User Profile**
- Profile header (avatar, name, school, badge)
- Stats dashboard
- Tabs (overview, activity history, settings)
- Edit profile functionality

**7. Settings**
- Sidebar navigation (account, notifications, preferences, privacy)
- Toggle controls for preferences
- Theme selector (light, dark, system)
- Accessibility options

### Custom Components

**1. Framework Card**
- Compact version (for grids)
- Expanded version (detail page)
- Metadata display (ID, module, tags, time estimate)
- Action buttons (view, save, share)
- Status indicators (tried, saved)

**2. Testimonial Card**
- Quote icon
- Testimonial text (italic)
- Author info (name, school, subject)
- Time saved metric (highlighted)
- Optional photo

**3. Time Savings Tracker**
- Visual progress indicator
- Weekly/monthly/total views
- Comparison to goals
- Celebration milestones

**4. Beta Tester Badge**
- Icon badge component
- Tooltip with program info
- Appears on profile and community posts

**5. Feedback Modal**
- Star rating (1-5)
- Time saved input
- Comment textarea (optional)
- Submit button
- Progressive disclosure (don't overwhelm)

**6. Innovation Share Form**
- Title input
- Description textarea
- Related framework selector
- Tags multi-select
- Preview functionality

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices (large phones) */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### Layout Adaptations

**Mobile (< 640px):**
- Single column layouts
- Bottom navigation (4 items)
- Stacked cards
- Hamburger menu
- Full-width modals
- Sticky footer actions

**Tablet (640px - 1024px):**
- 2-column layouts where appropriate
- Tab navigation
- Grid layouts (2 columns)
- Drawer navigation
- Larger modals

**Desktop (1024px+):**
- Multi-column layouts (3-4 columns)
- Persistent sidebar navigation
- Grid layouts (3-4 columns)
- Larger modals with side-by-side content
- Hover states more prominent

---

## Accessibility Checklist

### Color & Contrast
- ✅ All text meets 4.5:1 contrast ratio minimum
- ✅ Large text (18pt+) meets 3:1 contrast ratio
- ✅ UI components meet 3:1 contrast ratio
- ✅ Color is not the only means of conveying information
- ✅ Dark mode maintains contrast requirements

### Keyboard Navigation
- ✅ All interactive elements are keyboard accessible
- ✅ Logical tab order throughout application
- ✅ Visible focus indicators (2px ring, 2px offset)
- ✅ Skip links to main content
- ✅ Escape key closes modals
- ✅ Arrow keys navigate lists/menus

### Screen Readers
- ✅ Semantic HTML elements used throughout
- ✅ ARIA labels for icons and complex components
- ✅ ARIA live regions for dynamic content updates
- ✅ Alt text for all meaningful images
- ✅ Form labels properly associated with inputs
- ✅ Error messages programmatically linked to fields

### Forms
- ✅ Labels visible and associated with inputs
- ✅ Required fields clearly indicated
- ✅ Error messages clear and specific
- ✅ Validation feedback immediate and helpful
- ✅ Success states confirmed

### Motion & Animation
- ✅ Respects `prefers-reduced-motion` setting
- ✅ Animations have purpose (not decorative)
- ✅ No auto-playing videos or animations
- ✅ Transitions smooth but not distracting

### Touch Targets
- ✅ Minimum 44×44px touch targets
- ✅ Adequate spacing between targets (8px minimum)
- ✅ Swipe gestures intuitive and optional
- ✅ No hover-only interactions on mobile

---

## Design Deliverables Summary

### ✅ Completed

1. **Design System Document** (01-design-system.md)
   - Complete color palette with all shades
   - Typography system with three font families
   - Spacing scale (8px base unit)
   - Layout system (12-column grid, breakpoints)
   - Component specifications (7 categories)
   - Iconography guidelines
   - Motion and animation principles
   - Accessibility standards
   - Responsive design strategy
   - Dark mode implementation
   - Design tokens structure

2. **User Flows Document** (02-user-flows.md)
   - Authentication flows (2 flows)
   - Onboarding flows (1 comprehensive flow)
   - Core platform flows (4 major flows)
   - Content management flows (2 flows)
   - Profile and settings flows (2 flows)
   - Feedback and support flows (2 flows)
   - Error and edge case flows (3 scenarios)
   - Mobile-specific flows (2 patterns)
   - Flow metrics and optimization priorities

### 📋 Design Assets Needed (Phase 3 - Implementation)

**High Priority:**
1. Logo design (compass/lighthouse concept)
2. Framework card component mockups
3. Dashboard layout mockups (mobile + desktop)
4. Framework detail page mockups
5. Onboarding screen mockups (4 steps)

**Medium Priority:**
6. Community hub mockups
7. Profile page mockups
8. Settings page mockups
9. Modal designs (feedback, share, support)
10. Empty state illustrations

**Low Priority:**
11. Icon set customization (if needed beyond Lucide)
12. Loading state animations
13. Celebration animations (confetti, badges)
14. Email templates (Welcome Kit, Weekly Prompt)

---

## Design-to-Development Handoff

### For System Architect (Phase 3)

**Technical Requirements from Design:**

1. **Component Library:**
   - Use shadcn/ui as foundation
   - Customize with design tokens
   - Add custom components (Framework Card, Testimonial Card, etc.)

2. **Styling Approach:**
   - Tailwind CSS for utility classes
   - CSS custom properties for design tokens
   - Dark mode via class-based theming

3. **Font Loading:**
   - Lexend (weights: 300, 400, 500, 600, 700)
   - Poppins (weights: 500, 600, 700)
   - JetBrains Mono (weights: 400, 500)
   - Use Google Fonts or self-host for performance

4. **Icon Library:**
   - Lucide React (already in dependencies)
   - Consistent sizing (16px, 20px, 24px, 32px, 48px)

5. **Animation Library:**
   - Framer Motion (already in dependencies)
   - Respect `prefers-reduced-motion`

6. **Responsive Implementation:**
   - Mobile-first CSS
   - Tailwind breakpoints (sm, md, lg, xl, 2xl)
   - Touch-optimized interactions

7. **Accessibility Implementation:**
   - Semantic HTML
   - ARIA attributes where needed
   - Focus management for modals
   - Keyboard navigation support

### Design Tokens File

Create `src/lib/design-tokens.ts`:

```typescript
export const designTokens = {
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      // ... all shades
      500: '#3B82F6',
      // ... remaining shades
    },
    secondary: {
      // ... gold shades
    },
    accent: {
      // ... green shades
    },
    neutral: {
      // ... gray shades
    },
    semantic: {
      error: { 500: '#EF4444', 600: '#DC2626' },
      warning: { 500: '#F97316', 600: '#EA580C' },
      info: { 500: '#3B82F6', 600: '#2563EB' },
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    // ... all spacing values
  },
  typography: {
    fontFamily: {
      primary: 'Lexend, system-ui, sans-serif',
      heading: 'Poppins, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      // ... all sizes
    },
  },
  // ... other token categories
};
```

---

## Design Alignment with PRD

### PRD Requirements Met

✅ **Brand Identity** (Section 9.1)
- Compass/lighthouse logo concept defined
- Color palette specified (Blue, Gold, Green)
- Typography selected (Lexend, Poppins)
- Brand personality reflected in design

✅ **Voice & Tone** (Section 9.2)
- Professional but approachable
- Clear and jargon-free
- Supportive mentor personality
- Reflected in UI copy and interactions

✅ **User Interface Requirements** (Section 9.3)
- Dashboard layout specified
- Content display hierarchy defined
- Navigation patterns established
- Mobile-optimized design

✅ **Accessibility Requirements** (Section 8.5)
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Mobile-responsive design

✅ **Performance Requirements** (Section 8.3)
- Design optimized for fast loading
- Minimal asset sizes
- Efficient animations (transform/opacity)
- Responsive images strategy

---

## Next Steps (Phase 3: Architecture)

The design documentation is complete and ready for handoff to the System Architect. The architect will:

1. **Review Design Documentation**
   - Validate technical feasibility
   - Identify any design-to-development gaps
   - Confirm component library strategy

2. **Create Technical Architecture**
   - Define component structure
   - Specify data flow patterns
   - Plan state management approach
   - Design API integration points

3. **Produce Architecture Output**
   - System architecture diagram
   - Component hierarchy
   - Data model refinements
   - Technology stack confirmation
   - Implementation dependencies

---

## Design System Governance

### Maintenance Process

1. **Component Additions:**
   - Propose new component with use case
   - Design and document component
   - Review with team
   - Add to component library
   - Update documentation

2. **Design Updates:**
   - Document reason for change
   - Update affected components
   - Version control changes
   - Communicate to development team
   - Update implementation

3. **Feedback Integration:**
   - Collect user feedback during beta
   - Identify design improvements
   - Prioritize changes
   - Implement and test
   - Document learnings

### Version Control

- **Major version (1.0 → 2.0):** Breaking changes to design system
- **Minor version (1.0 → 1.1):** New components or significant enhancements
- **Patch version (1.0.0 → 1.0.1):** Bug fixes or minor adjustments

---

## Appendix

### A. Design Tools Used
- Figma (wireframes and mockups - to be created in Phase 5)
- This documentation (Markdown for specifications)
- Lucide React (icon library)
- shadcn/ui (component foundation)

### B. Design References
- Missouri AI Guidance (comprehensive framework inspiration)
- New Mexico AI Guidance (human-centered approach)
- Utah AI Framework (practical implementation)
- Material Design (accessibility standards)
- Apple Human Interface Guidelines (mobile patterns)

### C. Accessibility Resources
- WCAG 2.1 Guidelines
- WebAIM Contrast Checker
- ARIA Authoring Practices Guide
- Inclusive Components by Heydon Pickering

---

**Design Phase Status: ✅ COMPLETE**

**Ready for Phase 3: System Architecture**

---

**End of Design Documentation README**
