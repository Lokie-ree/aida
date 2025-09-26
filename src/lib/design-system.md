# A.I.D.A. Design System

This document outlines the design system for A.I.D.A., including design tokens, components, and usage guidelines.

## Design Tokens

### Colors

The color system is built around a primary blue theme with semantic color variants:

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

## Best Practices

1. **Consistency**: Always use design tokens instead of hardcoded values
2. **Semantic Colors**: Use semantic color names (primary, success, error) rather than specific colors
3. **Responsive**: Design mobile-first and use responsive utilities
4. **Accessibility**: Ensure proper contrast and keyboard navigation
5. **Performance**: Use CSS custom properties for efficient theme switching
6. **Maintainability**: Keep design tokens centralized and well-documented
