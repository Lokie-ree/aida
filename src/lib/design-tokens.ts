/**
 * A.I.D.A. Design Tokens
 * Centralized design system tokens for consistent styling across the application
 */

// Color Tokens
export const colors = {
  // Primary Colors
  primary: {
    50: 'hsl(210 40% 98%)',
    100: 'hsl(210 40% 96%)',
    200: 'hsl(214.3 31.8% 91.4%)',
    300: 'hsl(213.1 27.2% 84.3%)',
    400: 'hsl(215 20.2% 65.1%)',
    500: 'hsl(221.2 83.2% 53.3%)',
    600: 'hsl(217.2 91.2% 59.8%)',
    700: 'hsl(222.2 84% 4.9%)',
    800: 'hsl(222.2 84% 4.9%)',
    900: 'hsl(222.2 84% 4.9%)',
    950: 'hsl(222.2 84% 4.9%)',
  },
  
  // Neutral Colors
  neutral: {
    50: 'hsl(0 0% 100%)',
    100: 'hsl(210 40% 98%)',
    200: 'hsl(210 40% 96%)',
    300: 'hsl(214.3 31.8% 91.4%)',
    400: 'hsl(215.4 16.3% 46.9%)',
    500: 'hsl(215 20.2% 65.1%)',
    600: 'hsl(222.2 84% 4.9%)',
    700: 'hsl(222.2 84% 4.9%)',
    800: 'hsl(222.2 84% 4.9%)',
    900: 'hsl(222.2 84% 4.9%)',
    950: 'hsl(222.2 84% 4.9%)',
  },
  
  // Semantic Colors
  success: {
    50: 'hsl(138 76% 97%)',
    100: 'hsl(141 84% 93%)',
    200: 'hsl(141 79% 85%)',
    300: 'hsl(142 76% 73%)',
    400: 'hsl(142 71% 45%)',
    500: 'hsl(142 76% 36%)',
    600: 'hsl(142 64% 24%)',
    700: 'hsl(143 61% 20%)',
    800: 'hsl(143 61% 16%)',
    900: 'hsl(144 61% 14%)',
    950: 'hsl(145 80% 7%)',
  },
  
  warning: {
    50: 'hsl(48 96% 89%)',
    100: 'hsl(48 96% 77%)',
    200: 'hsl(48 96% 61%)',
    300: 'hsl(46 91% 45%)',
    400: 'hsl(43 74% 66%)',
    500: 'hsl(38 92% 50%)',
    600: 'hsl(32 95% 44%)',
    700: 'hsl(26 90% 37%)',
    800: 'hsl(23 83% 31%)',
    900: 'hsl(22 78% 26%)',
    950: 'hsl(21 92% 14%)',
  },
  
  error: {
    50: 'hsl(0 86% 97%)',
    100: 'hsl(0 93% 94%)',
    200: 'hsl(0 96% 89%)',
    300: 'hsl(0 94% 82%)',
    400: 'hsl(0 91% 71%)',
    500: 'hsl(0 84.2% 60.2%)',
    600: 'hsl(0 62.8% 30.6%)',
    700: 'hsl(0 74.3% 41.8%)',
    800: 'hsl(0 70.7% 33.3%)',
    900: 'hsl(0 63.3% 31.4%)',
    950: 'hsl(0 46.5% 15.3%)',
  },
  
  // Chart Colors
  chart: {
    1: 'hsl(12 76% 61%)',
    2: 'hsl(173 58% 39%)',
    3: 'hsl(197 37% 24%)',
    4: 'hsl(43 74% 66%)',
    5: 'hsl(27 87% 67%)',
  },
} as const

// Spacing Tokens
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const

// Typography Tokens
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Lora', 'Georgia', 'serif'],
    mono: ['Fira Code', 'Monaco', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
    '8xl': ['6rem', { lineHeight: '1' }],         // 96px
    '9xl': ['8rem', { lineHeight: '1' }],         // 128px
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const

// Border Radius Tokens
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const

// Shadow Tokens
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

// Z-Index Tokens
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const

// Breakpoint Tokens
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Animation Tokens
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// Component-specific Tokens
export const components = {
  button: {
    height: {
      sm: spacing[8],    // 32px
      md: spacing[10],   // 40px
      lg: spacing[12],   // 48px
    },
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,
      md: `${spacing[2.5]} ${spacing[4]}`,
      lg: `${spacing[3]} ${spacing[6]}`,
    },
  },
  
  input: {
    height: {
      sm: spacing[8],    // 32px
      md: spacing[10],   // 40px
      lg: spacing[12],   // 48px
    },
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,
      md: `${spacing[2.5]} ${spacing[4]}`,
      lg: `${spacing[3]} ${spacing[4]}`,
    },
  },
  
  card: {
    padding: {
      sm: spacing[4],
      md: spacing[6],
      lg: spacing[8],
    },
    borderRadius: borderRadius.lg,
  },
  
  modal: {
    maxWidth: {
      sm: '400px',
      md: '500px',
      lg: '600px',
      xl: '800px',
    },
    padding: spacing[6],
  },
} as const

// Export all tokens as a single object
export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  animations,
  components,
} as const

export type DesignTokens = typeof designTokens
export type ColorTokens = typeof colors
export type SpacingTokens = typeof spacing
export type TypographyTokens = typeof typography
