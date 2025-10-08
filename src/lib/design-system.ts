/**
 * Pelican AI Design System
 * Simple, consistent design tokens for the platform
 */

export const colors = {
  // Primary Brand Colors - Pelican Blue
  primary: {
    50: '#f0f9ff',   // Lightest blue
    100: '#e0f2fe',  // Very light blue
    200: '#bae6fd',  // Light blue
    300: '#7dd3fc',  // Medium light blue
    400: '#38bdf8',  // Medium blue
    500: '#0ea5e9',  // Primary blue (Pelican blue - main brand color)
    600: '#0284c7',  // Dark blue
    700: '#0369a1',  // Darker blue
    800: '#075985',  // Very dark blue
    900: '#0c4a6e',  // Darkest blue
  },
  
  // Secondary Colors - Louisiana Gold
  secondary: {
    50: '#FFFBEB',   // Lightest gold
    100: '#FEF3C7',  // Very light gold
    200: '#FDE68A',  // Light gold
    300: '#FCD34D',  // Medium light gold
    400: '#FBBF24',  // Louisiana gold
    500: '#F59E0B',  // Primary gold
    600: '#D97706',  // Dark gold
    700: '#B45309',  // Darker gold
    800: '#92400E',  // Very dark gold
    900: '#78350F',  // Darkest gold
  },
  
  // Accent Colors - Success Green
  accent: {
    50: '#ECFDF5',   // Lightest green
    100: '#D1FAE5',  // Very light green
    200: '#A7F3D0',  // Light green
    300: '#6EE7B7',  // Medium light green
    400: '#34D399',  // Medium green
    500: '#10B981',  // Success green
    600: '#059669',  // Dark green
    700: '#047857',  // Darker green
    800: '#065F46',  // Very dark green
    900: '#064E3B',  // Darkest green
  },
  
  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export const typography = {
  fontFamily: {
    primary: ['Lexend', 'system-ui', 'sans-serif'],
    heading: ['Poppins', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Courier New', 'monospace'],
    sans: ['Lexend', 'system-ui', 'sans-serif'], // Keep for compatibility
    serif: ['Source Serif 4', 'serif'],
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

export const brand = {
  name: 'Pelican AI',
  tagline: 'Reclaim Your Time with Confidence',
  description: 'Works with ANY AI tool you already use. Designed specifically for Louisiana educators.',
  url: 'https://pelicanai.org',
  email: 'hello@pelicanai.org',
} as const;

// Recommended primary color for better brand alignment
export const recommendedPrimary = '#0ea5e9'; // colors.primary[500]
