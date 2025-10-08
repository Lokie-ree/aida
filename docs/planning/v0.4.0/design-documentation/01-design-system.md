# Design System
## ~~AI for LA Educators Platform~~ → Pelican AI

**Version:** 1.0  
**Date:** October 4, 2025  
**Status:** Phase 2 - Design Documentation (ARCHIVED)  
**Owner:** UX/UI Designer  

---

## ⚠️ BRANDING UPDATE

**This design system was created before final branding.** The platform is now **"Pelican AI"** with these changes:

- **Logo:** Pelican (not compass/lighthouse)
- **Primary Color:** Pelican Blue `#0ea5e9` (not `#3B82F6`)
- **Fonts:** Lexend, Poppins, JetBrains Mono ✓ (matches)

**Current design system:** [src/lib/design-system.ts](../../../src/lib/design-system.ts)  
**Current brand guidelines:** [docs/PELICAN_AI_BRAND_GUIDELINES.md](../../PELICAN_AI_BRAND_GUIDELINES.md)

---

## 1. Introduction

### 1.1 Purpose
This design system establishes the visual language, interaction patterns, and component library for the platform. It ensures consistency, accessibility, and a cohesive user experience across all touchpoints.

### 1.2 Design Philosophy
- **Educator-First:** Every design decision prioritizes educator needs and workflows
- **Clarity Over Complexity:** Simple, intuitive interfaces that reduce cognitive load
- **Trust & Warmth:** Professional yet approachable, building confidence in AI guidance
- **Accessibility:** WCAG 2.1 Level AA compliant, ensuring all educators can participate
- **Scalability:** Flexible system that grows from beta to district-wide deployment

---

## 2. Brand Foundation

### 2.1 Brand Personality
- **Supportive Mentor** - Guides without dictating
- **Practical Innovator** - Grounded in real classroom needs
- **Trustworthy & Ethical** - Transparent about AI capabilities and limitations
- **Empowering** - Builds educator confidence and autonomy
- **Responsive** - Adapts to feedback and evolving needs

### 2.2 Visual Identity Concept

**Logo: The Guiding Compass**
- Stylized compass rose symbolizing navigation through the AI landscape
- Subtle Louisiana magnolia petal integration in the design
- Clean, modern execution suitable for digital and print
- Variations: Full color, monochrome, icon-only

**Symbolism:**
- Compass = Guidance and direction
- Louisiana elements = Local relevance and pride
- Open design = Accessibility and inclusivity

---

## 3. Color System

### 3.1 Primary Colors

**Primary Blue** - Trust & Reliability
- `--color-primary-50`: `#EFF6FF`
- `--color-primary-100`: `#DBEAFE`
- `--color-primary-200`: `#BFDBFE`
- `--color-primary-300`: `#93C5FD`
- `--color-primary-400`: `#60A5FA`
- `--color-primary-500`: `#3B82F6` (Base)
- `--color-primary-600`: `#2563EB`
- `--color-primary-700`: `#1D4ED8`
- `--color-primary-800`: `#1E40AF`
- `--color-primary-900`: `#1E3A8A`

**Usage:**
- Primary actions (buttons, links)
- Navigation highlights
- Focus states
- Brand elements

### 3.2 Secondary Colors

**Secondary Gold** - Excellence & Louisiana Spirit
- `--color-secondary-50`: `#FFFBEB`
- `--color-secondary-100`: `#FEF3C7`
- `--color-secondary-200`: `#FDE68A`
- `--color-secondary-300`: `#FCD34D`
- `--color-secondary-400`: `#FBBF24` (Base)
- `--color-secondary-500`: `#F59E0B`
- `--color-secondary-600`: `#D97706`
- `--color-secondary-700`: `#B45309`
- `--color-secondary-800`: `#92400E`
- `--color-secondary-900`: `#78350F`

**Usage:**
- Highlights and accents
- Success states
- Featured content
- Celebration moments (achievements, testimonials)

### 3.3 Accent Colors

**Accent Green** - Growth & Success
- `--color-accent-50`: `#ECFDF5`
- `--color-accent-100`: `#D1FAE5`
- `--color-accent-200`: `#A7F3D0`
- `--color-accent-300`: `#6EE7B7`
- `--color-accent-400`: `#34D399`
- `--color-accent-500`: `#10B981` (Base)
- `--color-accent-600`: `#059669`
- `--color-accent-700`: `#047857`
- `--color-accent-800`: `#065F46`
- `--color-accent-900`: `#064E3B`

**Usage:**
- Success messages
- Positive feedback
- Completion states
- Growth indicators (time saved, progress)

### 3.4 Neutral Colors

**Grays** - Professional & Accessible
- `--color-neutral-50`: `#F9FAFB`
- `--color-neutral-100`: `#F3F4F6`
- `--color-neutral-200`: `#E5E7EB`
- `--color-neutral-300`: `#D1D5DB`
- `--color-neutral-400`: `#9CA3AF`
- `--color-neutral-500`: `#6B7280`
- `--color-neutral-600`: `#4B5563`
- `--color-neutral-700`: `#374151`
- `--color-neutral-800`: `#1F2937`
- `--color-neutral-900`: `#111827`

**Usage:**
- Text (700-900 for body, 500-600 for secondary)
- Borders and dividers (200-300)
- Backgrounds (50-100)
- Disabled states (300-400)

### 3.5 Semantic Colors

**Error Red**
- `--color-error-500`: `#EF4444`
- `--color-error-600`: `#DC2626`

**Warning Orange**
- `--color-warning-500`: `#F97316`
- `--color-warning-600`: `#EA580C`

**Info Blue**
- `--color-info-500`: `#3B82F6`
- `--color-info-600`: `#2563EB`

### 3.6 Dark Mode Support

**Dark Mode Palette:**
- Background: `#0F172A` (Slate 900)
- Surface: `#1E293B` (Slate 800)
- Text Primary: `#F1F5F9` (Slate 100)
- Text Secondary: `#CBD5E1` (Slate 300)
- Borders: `#334155` (Slate 700)

**Accessibility Note:** All color combinations maintain 4.5:1 contrast ratio minimum for WCAG AA compliance.

---

## 4. Typography

### 4.1 Font Families

**Primary Font: Lexend**
- Purpose: Body text, UI elements
- Characteristics: Highly readable, designed for educational contexts, excellent legibility
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Fallback: `system-ui, -apple-system, sans-serif`

**Secondary Font: Poppins**
- Purpose: Headings, emphasis
- Characteristics: Modern, friendly, professional
- Weights: 500 (Medium), 600 (Semibold), 700 (Bold)
- Fallback: `system-ui, -apple-system, sans-serif`

**Monospace Font: JetBrains Mono**
- Purpose: Code snippets, prompts, technical content
- Weights: 400 (Regular), 500 (Medium)
- Fallback: `'Courier New', monospace`

### 4.2 Type Scale

**Desktop Scale:**
- `--text-xs`: `0.75rem` (12px) - Line height: 1rem
- `--text-sm`: `0.875rem` (14px) - Line height: 1.25rem
- `--text-base`: `1rem` (16px) - Line height: 1.5rem
- `--text-lg`: `1.125rem` (18px) - Line height: 1.75rem
- `--text-xl`: `1.25rem` (20px) - Line height: 1.75rem
- `--text-2xl`: `1.5rem` (24px) - Line height: 2rem
- `--text-3xl`: `1.875rem` (30px) - Line height: 2.25rem
- `--text-4xl`: `2.25rem` (36px) - Line height: 2.5rem
- `--text-5xl`: `3rem` (48px) - Line height: 1

**Mobile Scale (Responsive Adjustments):**
- Headings scale down 10-15% on mobile
- Body text remains at 16px minimum for readability
- Line heights increase slightly for better mobile reading

### 4.3 Typography Styles

**Headings:**
```css
h1 {
  font-family: Poppins, system-ui, sans-serif;
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 2.5rem;
  color: var(--color-neutral-900);
  letter-spacing: -0.025em;
}

h2 {
  font-family: Poppins, system-ui, sans-serif;
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: 2.25rem;
  color: var(--color-neutral-900);
  letter-spacing: -0.025em;
}

h3 {
  font-family: Poppins, system-ui, sans-serif;
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 2rem;
  color: var(--color-neutral-800);
}

h4 {
  font-family: Lexend, system-ui, sans-serif;
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1.75rem;
  color: var(--color-neutral-800);
}
```

**Body Text:**
```css
body {
  font-family: Lexend, system-ui, sans-serif;
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.5rem;
  color: var(--color-neutral-700);
}

.text-secondary {
  color: var(--color-neutral-600);
  font-size: var(--text-sm);
}

.text-small {
  font-size: var(--text-sm);
  line-height: 1.25rem;
}
```

**Emphasis:**
```css
strong, .font-semibold {
  font-weight: 600;
}

em, .italic {
  font-style: italic;
}

.text-muted {
  color: var(--color-neutral-500);
}
```

---

## 5. Spacing System

### 5.1 Spacing Scale (8px Base Unit)

```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### 5.2 Layout Spacing Guidelines

**Component Internal Spacing:**
- Buttons: `padding: var(--space-3) var(--space-6)`
- Cards: `padding: var(--space-6)`
- Form fields: `padding: var(--space-3) var(--space-4)`
- List items: `padding: var(--space-4)`

**Component External Spacing:**
- Stack spacing (vertical): `var(--space-4)` to `var(--space-6)`
- Grid gaps: `var(--space-4)` to `var(--space-8)`
- Section spacing: `var(--space-12)` to `var(--space-16)`

**Responsive Spacing:**
- Mobile: Reduce spacing by 25-50% for compact layouts
- Tablet: Standard spacing scale
- Desktop: Full spacing scale with optional increases for large screens

---

## 6. Layout System

### 6.1 Grid System

**12-Column Grid:**
- Max width: `1280px` (7xl container)
- Gutter: `var(--space-6)` (24px)
- Margins: `var(--space-4)` on mobile, `var(--space-6)` on tablet+

**Breakpoints:**
```css
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### 6.2 Container Sizes

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
--container-full: 100%;
```

### 6.3 Layout Patterns

**Dashboard Layout:**
- Header: Fixed, 64px height
- Main content: Flexible, max-width 1280px, centered
- Sidebar (if needed): 256px width on desktop, drawer on mobile

**Content Layout:**
- Reading width: Max 65ch (characters) for optimal readability
- Card grid: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop
- Form layout: Single column, max 600px width

---

## 7. Components

### 7.1 Buttons

**Primary Button:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}
```

**Styles:**
- Primary: Blue background, white text, hover darkens
- Secondary: Gold background, dark text, hover darkens
- Outline: Transparent background, blue border, hover fills
- Ghost: Transparent background, no border, hover subtle background
- Destructive: Red background, white text, hover darkens

**Sizes:**
- Small: `height: 32px`, `padding: 0 12px`, `font-size: 14px`
- Medium: `height: 40px`, `padding: 0 16px`, `font-size: 16px`
- Large: `height: 48px`, `padding: 0 24px`, `font-size: 18px`

**States:**
- Default: Base styles
- Hover: Darker background, subtle scale (1.02)
- Active: Even darker, scale (0.98)
- Focus: 2px ring, primary color, 2px offset
- Disabled: Reduced opacity (0.5), no pointer events
- Loading: Spinner icon, disabled state

### 7.2 Form Elements

**Input Fields:**
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  size: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}
```

**Styles:**
- Border: 1px solid neutral-300, rounded-md
- Focus: 2px ring primary-500, border primary-500
- Error: Border error-500, ring error-500
- Disabled: Background neutral-100, cursor not-allowed

**Textarea:**
- Min height: 80px
- Resize: Vertical only
- Same styling as input fields

**Select Dropdown:**
- Native select styled with custom arrow icon
- Dropdown menu: White background, shadow-lg, rounded-lg
- Options: Hover background primary-50

**Checkbox & Radio:**
- Size: 20px × 20px
- Checked: Primary-500 background, white checkmark
- Focus: Ring primary-500

### 7.3 Cards

**Card Component:**
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding: 'sm' | 'md' | 'lg';
}
```

**Styles:**
- Default: White background, border neutral-200, rounded-lg
- Elevated: White background, shadow-md, no border
- Outlined: Transparent background, border primary-300
- Interactive: Hover shadow-lg, cursor pointer, transition

**Card Sections:**
- Header: Border-bottom, padding-bottom
- Body: Standard padding
- Footer: Border-top, padding-top, often contains actions

### 7.4 Navigation

**Header Navigation:**
- Fixed position, backdrop blur
- Height: 64px
- Logo left, actions right
- Mobile: Hamburger menu, drawer navigation

**Breadcrumbs:**
- Font size: 14px
- Separator: `/` or `›`
- Current page: Bold, not clickable
- Links: Primary color, hover underline

**Tabs:**
- Horizontal tabs with underline indicator
- Active: Primary color, 2px bottom border
- Inactive: Neutral-600, hover neutral-800
- Mobile: Scrollable horizontal tabs

### 7.5 Feedback Components

**Toast Notifications:**
- Position: Top-right corner
- Auto-dismiss: 5 seconds
- Types: Success (green), Error (red), Warning (orange), Info (blue)
- Icon + message + dismiss button

**Alert Banners:**
- Full-width or contained
- Types: Info, Success, Warning, Error
- Icon + title + description + optional action

**Progress Indicators:**
- Linear progress bar: Height 4px, rounded, animated
- Circular spinner: 24px diameter, primary color
- Skeleton loaders: Animated gradient, matches content shape

### 7.6 Content Display

**Framework Card (Atomic Note Display):**
```typescript
interface FrameworkCardProps {
  id: string;
  title: string;
  module: 'AI Basics Hub' | 'Instructional Expert Hub';
  tags: string[];
  challenge: string;
  solution: string;
  samplePrompt: string;
  ethicalGuardrail: string;
}
```

**Layout:**
- Header: Title, ID badge, module badge, tags
- Challenge section: Italic, neutral-600, icon
- Solution section: Numbered steps, clear formatting
- Sample Prompt section: Monospace font, copy button, code block styling
- Ethical Guardrail section: Warning icon, highlighted background

**Testimonial Card:**
- Quote icon
- Testimonial text (italic)
- Author name, school, subject
- Time saved metric (highlighted)
- Photo (optional)

---

## 8. Iconography

### 8.1 Icon System

**Library:** Lucide React (consistent, modern, accessible)

**Sizes:**
- Extra small: 16px
- Small: 20px
- Medium: 24px
- Large: 32px
- Extra large: 48px

**Usage:**
- Always pair with accessible labels
- Use consistent size within component groups
- Maintain 1:1 aspect ratio
- Color: Inherit from parent or semantic colors

### 8.2 Common Icons

**Navigation:**
- Home, Menu, X (close), ChevronRight, ChevronLeft, ChevronDown

**Actions:**
- Plus, Edit, Trash2, Download, Upload, Copy, Check, X

**Content:**
- FileText, Folder, Search, Filter, Star, Heart, Share2

**Feedback:**
- AlertCircle, CheckCircle, Info, AlertTriangle, HelpCircle

**User:**
- User, Users, Settings, LogOut, Bell

**AI/Education Specific:**
- Brain (AI), BookOpen (learning), Lightbulb (ideas), Target (goals), Award (achievement)

---

## 9. Motion & Animation

### 9.1 Animation Principles

**Purpose-Driven:**
- Guide attention to important changes
- Provide feedback for user actions
- Smooth transitions between states
- Never animate for decoration alone

**Performance:**
- Use `transform` and `opacity` for best performance
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`

### 9.2 Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 9.3 Duration Scale

```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-medium: 300ms;
--duration-slow: 500ms;
```

### 9.4 Common Animations

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide In:**
```css
@keyframes slideInFromTop {
  from { 
    opacity: 0;
    transform: translateY(-16px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Scale:**
```css
.scale-hover {
  transition: transform var(--duration-base) var(--ease-out);
}
.scale-hover:hover {
  transform: scale(1.02);
}
```

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Accessibility

### 10.1 WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum
- All color combinations tested and validated

**Keyboard Navigation:**
- All interactive elements focusable
- Logical tab order
- Visible focus indicators (2px ring, 2px offset)
- Skip links for main content

**Screen Readers:**
- Semantic HTML elements
- ARIA labels for icons and complex components
- ARIA live regions for dynamic content
- Alt text for all images

**Forms:**
- Labels associated with inputs
- Error messages programmatically linked
- Required fields indicated
- Clear validation feedback

### 10.2 Focus Management

**Focus Styles:**
```css
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Focus Trap:**
- Modals trap focus within dialog
- Escape key closes modals
- Focus returns to trigger element on close

### 10.3 Text Alternatives

- All images have alt text
- Icons have aria-labels
- Complex graphics have detailed descriptions
- Video content has captions

---

## 11. Responsive Design

### 11.1 Mobile-First Approach

**Strategy:**
- Design for mobile first, enhance for larger screens
- Touch targets minimum 44×44px
- Adequate spacing between interactive elements
- Simplified navigation on mobile

### 11.2 Breakpoint Strategy

**Mobile (< 640px):**
- Single column layouts
- Stacked navigation
- Full-width cards
- Simplified data tables (cards instead)

**Tablet (640px - 1024px):**
- 2-column layouts where appropriate
- Tab navigation
- Grid layouts for cards
- Sidebar becomes drawer

**Desktop (1024px+):**
- Multi-column layouts
- Persistent navigation
- Advanced data tables
- Sidebar visible

### 11.3 Touch Optimization

- Minimum touch target: 44×44px
- Adequate spacing between targets (8px minimum)
- Swipe gestures for mobile navigation
- Pull-to-refresh where appropriate

---

## 12. Dark Mode

### 12.1 Dark Mode Strategy

**Implementation:**
- System preference detection
- Manual toggle available
- Preference saved in local storage
- Smooth transition between modes

### 12.2 Dark Mode Colors

**Backgrounds:**
- Primary: `#0F172A` (Slate 900)
- Secondary: `#1E293B` (Slate 800)
- Elevated: `#334155` (Slate 700)

**Text:**
- Primary: `#F1F5F9` (Slate 100)
- Secondary: `#CBD5E1` (Slate 300)
- Muted: `#94A3B8` (Slate 400)

**Adjustments:**
- Reduce shadow intensity
- Increase border visibility
- Adjust color saturation for comfort

---

## 13. Design Tokens

### 13.1 Token Structure

All design values stored as CSS custom properties for easy theming and consistency.

**File: `design-tokens.css`**
```css
:root {
  /* Colors */
  --color-primary-500: #3B82F6;
  --color-secondary-400: #FBBF24;
  --color-accent-500: #10B981;
  
  /* Typography */
  --font-primary: Lexend, system-ui, sans-serif;
  --font-heading: Poppins, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  /* Borders */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### 13.2 Token Usage

```typescript
// TypeScript design tokens
export const designTokens = {
  colors: {
    primary: {
      500: '#3B82F6',
      // ... other shades
    },
  },
  spacing: {
    4: '1rem',
    6: '1.5rem',
    // ... other values
  },
  // ... other token categories
};
```

---

## 14. Component Library Integration

### 14.1 Existing Components (shadcn/ui)

The platform uses shadcn/ui components as a foundation:
- Button, Input, Textarea, Select
- Card, Dialog, Dropdown Menu
- Avatar, Badge, Progress
- Accordion, Scroll Area, Label

**Customization Strategy:**
- Maintain shadcn/ui structure
- Override with brand colors and typography
- Add custom variants as needed
- Ensure accessibility is preserved

### 14.2 Custom Components

**Framework Card** - Display atomic notes with copy functionality  
**Testimonial Card** - Showcase educator success stories  
**Time Savings Tracker** - Visual progress indicator  
**Space Selector** - Framework category navigation  
**Beta Tester Badge** - Recognition component  

---

## 15. Documentation & Maintenance

### 15.1 Design System Documentation

- Living document updated with each component addition
- Storybook or similar tool for component showcase
- Usage guidelines and code examples
- Accessibility notes for each component

### 15.2 Version Control

- Semantic versioning for design system updates
- Changelog maintained
- Breaking changes communicated clearly
- Migration guides provided

### 15.3 Governance

- Design system review process
- Contribution guidelines
- Component proposal template
- Regular audits for consistency

---

**End of Design System Document**
