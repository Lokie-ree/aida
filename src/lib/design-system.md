# A.I.D.A. Design System

This document outlines the design system for A.I.D.A., including design tokens, components, and usage guidelines.

## Design Tokens

### Colors

The color system is built around a primary blue theme for UI elements and backgrounds, with semantic color variants for text and content:

#### Primary Colors
- `primary.50` - Lightest blue (backgrounds)
- `primary.100` - Very light blue (subtle backgrounds)
- `primary.200` - Light blue (borders, dividers)
- `primary.300` - Medium light blue (disabled states)
- `primary.400` - Medium blue (secondary text)
- `primary.500` - Main blue (primary actions)
- `primary.600` - Darker blue (hover states)
- `primary.700` - Dark blue (active states)
- `primary.800` - Very dark blue (text)
- `primary.900` - Darkest blue (high contrast text)

#### Neutral Colors
- `neutral.50` - Pure white
- `neutral.100` - Off-white (backgrounds)
- `neutral.200` - Very light gray (borders)
- `neutral.300` - Light gray (dividers)
- `neutral.400` - Medium gray (placeholder text)
- `neutral.500` - Gray (secondary text)
- `neutral.600` - Dark gray (primary text)
- `neutral.700` - Very dark gray (headings)
- `neutral.800` - Almost black (high contrast text)
- `neutral.900` - Pure black

#### Semantic Colors
- **Success**: Green variants for positive actions and states
- **Warning**: Yellow/amber variants for caution and alerts
- **Error**: Red variants for errors and destructive actions

### Spacing

The spacing system uses a consistent scale based on 4px increments:

- `0` - 0px
- `0.5` - 2px
- `1` - 4px
- `2` - 8px
- `3` - 12px
- `4` - 16px
- `6` - 24px
- `8` - 32px
- `12` - 48px
- `16` - 64px
- `20` - 80px
- `24` - 96px
- `32` - 128px
- `48` - 192px
- `64` - 256px

### Typography

#### Font Families
- **Sans**: Inter (primary UI font)
- **Serif**: Lora (headings and emphasis)
- **Mono**: Fira Code (code and technical content)

#### Font Sizes
- `xs` - 12px (captions, labels)
- `sm` - 14px (small text)
- `base` - 16px (body text)
- `lg` - 18px (large text)
- `xl` - 20px (small headings)
- `2xl` - 24px (medium headings)
- `3xl` - 30px (large headings)
- `4xl` - 36px (extra large headings)
- `5xl` - 48px (display headings)

#### Font Weights
- `thin` - 100
- `extralight` - 200
- `light` - 300
- `normal` - 400
- `medium` - 500
- `semibold` - 600
- `bold` - 700
- `extrabold` - 800
- `black` - 900

### Border Radius

- `none` - 0px (sharp corners)
- `sm` - 2px (subtle rounding)
- `base` - 4px (default rounding)
- `md` - 6px (medium rounding)
- `lg` - 8px (large rounding)
- `xl` - 12px (extra large rounding)
- `2xl` - 16px (very large rounding)
- `3xl` - 24px (extra large rounding)
- `full` - 9999px (fully rounded)

### Shadows

- `none` - No shadow
- `sm` - Subtle shadow (1px blur)
- `base` - Default shadow (3px blur)
- `md` - Medium shadow (6px blur)
- `lg` - Large shadow (15px blur)
- `xl` - Extra large shadow (25px blur)
- `2xl` - Very large shadow (50px blur)
- `inner` - Inset shadow

### Z-Index

- `hide` - -1 (hidden elements)
- `auto` - auto (default)
- `base` - 0 (base layer)
- `docked` - 10 (docked elements)
- `dropdown` - 1000 (dropdowns)
- `sticky` - 1100 (sticky elements)
- `banner` - 1200 (banners)
- `overlay` - 1300 (overlays)
- `modal` - 1400 (modals)
- `popover` - 1500 (popovers)
- `skipLink` - 1600 (skip links)
- `toast` - 1700 (toasts)
- `tooltip` - 1800 (tooltips)

## Usage Guidelines

### Using Design Tokens

#### In CSS
```css
.my-component {
  background-color: var(--primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

#### In JavaScript/TypeScript
```typescript
import { designTokens } from '@/lib/design-tokens';

const styles = {
  backgroundColor: designTokens.colors.primary[500],
  padding: designTokens.spacing[4],
  borderRadius: designTokens.borderRadius.lg,
  boxShadow: designTokens.shadows.md,
};
```

#### Using Utility Functions
```typescript
import { getColor, getSpacing, getTypography } from '@/lib/design-utils';

const styles = {
  backgroundColor: getColor('primary.500'),
  padding: getSpacing('4'),
  fontSize: getTypography('fontSize.lg'),
};
```

### Component Guidelines

#### Buttons
- Use `primary` variant for main actions
- Use `secondary` variant for secondary actions
- Use `outline` variant for subtle actions
- Use `ghost` variant for minimal actions
- Use `destructive` variant for dangerous actions

#### Cards
- Use consistent padding (`p-4`, `p-6`, `p-8`)
- Apply subtle shadows (`shadow-sm`, `shadow-md`)
- Use rounded corners (`rounded-lg`)

#### Forms
- Use consistent spacing between form elements
- Apply proper focus states with ring colors
- Use semantic colors for validation states

#### Typography
- Use Inter for UI text
- Use Lora for headings and emphasis
- Maintain proper hierarchy with font sizes
- Ensure sufficient contrast ratios
- **Text Colors**: Use `text-foreground` for primary text, `text-muted-foreground` for secondary text
- **Avoid Blue Text**: Never use blue for text content - blue is reserved for UI elements and backgrounds only

### Responsive Design

The design system includes breakpoints for responsive design:

- `xs` - 0px (mobile)
- `sm` - 640px (large mobile)
- `md` - 768px (tablet)
- `lg` - 1024px (desktop)
- `xl` - 1280px (large desktop)
- `2xl` - 1536px (extra large desktop)

### Dark Mode

The design system supports both light and dark modes through CSS custom properties. All components automatically adapt to the current theme.

### Accessibility

- Maintain WCAG AA contrast ratios
- Use semantic HTML elements
- Provide proper focus indicators
- Include screen reader support
- Ensure keyboard navigation

## Implementation

### CSS Custom Properties

The design system is implemented using CSS custom properties defined in `src/index.css`. These properties automatically switch between light and dark themes.

### Tailwind Integration

The design tokens are integrated with Tailwind CSS through the `tailwind.config.js` file, allowing you to use utility classes that reference the design tokens.

### TypeScript Support

Full TypeScript support is provided through the `design-tokens.ts` file, ensuring type safety when using design tokens in your code.

## Information Architecture (IA)

### Layout Structure

The A.I.D.A. dashboard follows a hierarchical layout structure optimized for voice-first interactions and space-scoped knowledge access:

#### Desktop Layout (1440px+)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                          │
│ ┌─────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ A.I.D.A.    │ │ [District-wide Coach ▼]     │ │ [User Menu ▼]              │ │
│ │ (brand)     │ │ (active space)              │ │ (profile/settings)         │ │
│ └─────────────┘ └─────────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT AREA                                                               │
│ ┌─────────────────────────────┐ ┌─────────────────────────────────────────────┐ │
│ │ VOICE HUB (1/3)             │ │ CONVERSATION (2/3)                          │ │
│ │ ┌─────────────────────────┐ │ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ 🎤 Voice Interface      │ │ │ │ 💬 Ask A.I.D.A. anything...             │ │ │
│ │ │ [Large Voice Button]    │ │ │ │                                         │ │ │
│ │ │                         │ │ │ │ [Message History]                       │ │ │
│ │ │ Status: Ready           │ │ │ │                                         │ │ │
│ │ │ Sources: 3 docs         │ │ │ │ [Input Field] [Send]                    │ │ │
│ │ └─────────────────────────┘ │ │ └─────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────┐ │ │                                             │ │
│ │ │ Quick Actions           │ │ │                                             │ │
│ │ │ [Upload Doc] [Invite]   │ │ │                                             │ │
│ │ │ [Create Space]          │ │ │                                             │ │
│ │ └─────────────────────────┘ │ │                                             │ │
│ └─────────────────────────────┘ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CONTEXT TRAY (full width, collapsible)                                         │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ [Documents] [Sources] [Activity] │ [▼ Collapse]                            │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Document List | Source Citations | Recent Activity                     │ │ │
│ │ │ • Policy.pdf  | 1. District Policy | • Asked about attendance          │ │ │
│ │ │ • Handbook.md | 2. Student Handbook| • Uploaded new doc                 │ │ │
│ │ │ • Guide.pdf   | 3. LDOE Guidelines | • Created new space               │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Layout (768px and below)
```
┌─────────────────────────────────┐
│ HEADER                          │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ A.I.D.A.    │ │ [Menu ☰]    │ │
│ └─────────────┘ └─────────────┘ │
├─────────────────────────────────┤
│ VOICE HUB (full width)          │
│ ┌─────────────────────────────┐ │
│ │ 🎤 Voice Interface          │ │
│ │ [Large Voice Button]        │ │
│ │ Status: Ready | Sources: 3  │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ CONVERSATION (full width)       │
│ ┌─────────────────────────────┐ │
│ │ 💬 Ask A.I.D.A. anything... │ │
│ │ [Message History]           │ │
│ │ [Input Field] [Send]        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ CONTEXT TRAY (collapsed)        │
│ [Documents] [Sources] [Activity]│
│ [▼ Expand]                      │
└─────────────────────────────────┘
```

### Component Hierarchy

#### VoiceHub (Primary Interface)
- **Purpose**: Central voice interaction point with district knowledge
- **Components**: VoiceInterface, Quick Actions, Status Summary
- **Layout**: Left column (1/3 on desktop), full width on mobile
- **Priority**: Always visible, primary interaction method

#### Conversation (Secondary Interface)
- **Purpose**: Text-based chat with message history and input
- **Components**: MessageHistory, InputField, SourceCitations
- **Layout**: Right column (2/3 on desktop), full width on mobile
- **Priority**: Secondary to voice, collapsible when empty

#### ContextTray (Supporting Interface)
- **Purpose**: Document management, source citations, activity tracking
- **Components**: DocumentList, SourceCitations, ActivityFeed
- **Layout**: Full width, collapsible panel
- **Priority**: Supporting information, progressive disclosure

#### Header (Global Navigation)
- **Purpose**: Brand identity, space switching, user controls
- **Components**: BrandLogo, SpaceSelector, UserMenu
- **Layout**: Fixed top, full width
- **Priority**: Always visible, global context

### Layout Guidelines

#### Grid System
- **Desktop**: 3-column grid (1/3 + 2/3 + full width)
- **Mobile**: Single column stack
- **Breakpoints**: `lg:1024px` for desktop layout
- **Gaps**: Consistent 6-unit spacing between components

#### Spacing Hierarchy
- **Header**: Fixed height (64px), sticky positioning
- **Main Content**: Flexible height with min-height constraints
- **Voice Hub**: Fixed aspect ratio, responsive sizing
- **Conversation**: Flexible height, scrollable content
- **Context Tray**: Collapsible height (64px collapsed, 256px expanded)

#### Responsive Behavior
- **Mobile First**: Single column layout by default
- **Progressive Enhancement**: Desktop layout at `lg` breakpoint
- **Touch Friendly**: Minimum 44px touch targets
- **Content Priority**: Voice Hub → Conversation → Context Tray

### Content Strategy

#### Primary Actions (Always Visible)
- Voice interaction button
- Space switching
- Message input
- Quick document upload

#### Secondary Actions (Discoverable)
- Document management
- Team invitations
- Space creation
- Activity monitoring

#### Progressive Disclosure
- Context Tray starts collapsed
- Conversation starts collapsed when empty
- Advanced features in dropdown menus
- Help and onboarding in modals

### Accessibility Guidelines

#### Focus Management
- Logical tab order: Header → Voice Hub → Conversation → Context Tray
- Skip links for main content areas
- Focus indicators on all interactive elements
- Voice button as primary focus target

#### Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex interactions
- Live regions for dynamic content updates
- Descriptive alt text for visual elements

#### Keyboard Navigation
- Space/Enter for voice activation
- Tab navigation between components
- Escape to close modals and collapse panels
- Arrow keys for dropdown navigation

## Best Practices

1. **Consistency**: Always use design tokens instead of hardcoded values
2. **Semantic Colors**: Use semantic color names (primary, success, error) rather than specific colors
3. **Responsive**: Design mobile-first and use responsive utilities
4. **Accessibility**: Ensure proper contrast and keyboard navigation
5. **Performance**: Use CSS custom properties for efficient theme switching
6. **Maintainability**: Keep design tokens centralized and well-documented
7. **Voice-First**: Prioritize voice interactions over text input
8. **Space-Centric**: Design around space-scoped knowledge access
9. **Progressive Disclosure**: Hide secondary information until needed
10. **Cognitive Load**: Minimize information density to reduce overwhelm
