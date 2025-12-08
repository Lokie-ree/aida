/**
 * Pelican AI Email Design System Configuration
 *
 * This file contains design tokens and configuration for email templates.
 * With Tailwind integration, most styling is done via utility classes in
 * BaseEmailTemplate.tsx. This config provides shared values for JavaScript
 * logic and legacy compatibility.
 */

// =============================================================================
// BRAND COLORS (reference for non-Tailwind contexts)
// =============================================================================

export const colors = {
  // Primary brand colors (Louisiana sky blue)
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Primary brand color
    600: "#0284c7", // Buttons, links
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },

  // Louisiana blue (accent)
  louisiana: {
    500: "#1e40af", // Headers, emphasis
    600: "#1e3a8a",
    700: "#1e3a8a",
  },

  // Warm gold (pelican accents)
  gold: {
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
  },

  // Neutrals (slate)
  gray: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Semantic colors
  success: {
    light: "#dcfce7",
    main: "#22c55e",
    dark: "#16a34a",
    text: "#166534",
  },
  warning: {
    light: "#fef3c7",
    main: "#f59e0b",
    dark: "#d97706",
    text: "#92400e",
  },
  info: {
    light: "#eff6ff",
    main: "#3b82f6",
    dark: "#2563eb",
    text: "#1e40af",
  },

  // Base colors
  white: "#ffffff",
  black: "#000000",
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const fonts = {
  heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  body: '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"SF Mono", Monaco, "Cascadia Code", Menlo, monospace',
} as const;

export const fontSizes = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
} as const;

// =============================================================================
// SPACING & LAYOUT
// =============================================================================

export const spacing = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
} as const;

export const borderRadius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  full: "9999px",
} as const;

// =============================================================================
// EMAIL-SPECIFIC SETTINGS
// =============================================================================

export const emailConfig = {
  // Maximum width for email content
  maxWidth: "600px",

  // Logo settings
  logo: {
    url: "https://pelicanai.org/icon.png",
    alt: "Pelican AI",
    width: 48,
    height: 48,
  },

  // Links
  links: {
    website: "https://pelicanai.org",
    coach: "https://pelicanai.org/coach",
    support: "mailto:hello@pelicanai.org",
  },

  // From information
  sender: {
    name: "Randall",
    title: "Louisiana educator building this for Louisiana educators",
    signature: "Louisiana educator building this for Louisiana educators",
  },
} as const;

// =============================================================================
// LEGACY STYLES (for backwards compatibility)
// =============================================================================

/**
 * Legacy inline style objects.
 * New templates should use Tailwind classes via BaseEmailTemplate components.
 */
export const styles = {
  // Layout
  main: {
    backgroundColor: colors.gray[50],
    fontFamily: fonts.body,
    padding: "40px 0",
  },

  container: {
    backgroundColor: colors.white,
    margin: "0 auto",
    maxWidth: emailConfig.maxWidth,
    borderRadius: borderRadius.xl,
    overflow: "hidden" as const,
  },

  // Typography
  h1: {
    color: colors.louisiana[500],
    fontSize: fontSizes["2xl"],
    fontWeight: "bold" as const,
    fontFamily: fonts.heading,
    margin: `0 0 ${spacing[4]}`,
  },

  h2: {
    color: colors.louisiana[500],
    fontSize: fontSizes.xl,
    fontWeight: "bold" as const,
    fontFamily: fonts.heading,
    margin: `${spacing[6]} 0 ${spacing[3]}`,
  },

  h3: {
    color: colors.gray[800],
    fontSize: fontSizes.lg,
    fontWeight: "600" as const,
    fontFamily: fonts.heading,
    margin: `${spacing[4]} 0 ${spacing[2]}`,
  },

  paragraph: {
    color: colors.gray[700],
    fontSize: fontSizes.base,
    lineHeight: "1.625",
    margin: `0 0 ${spacing[4]}`,
  },

  small: {
    color: colors.gray[500],
    fontSize: fontSizes.sm,
  },

  listItem: {
    color: colors.gray[700],
    fontSize: fontSizes.sm,
    lineHeight: "1.625",
    margin: `${spacing[2]} 0`,
    paddingLeft: spacing[4],
  },

  // Links
  link: {
    color: colors.primary[600],
    textDecoration: "none" as const,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: "bold" as const,
    textDecoration: "none" as const,
    textAlign: "center" as const,
    display: "inline-block" as const,
    padding: `${spacing[3]} ${spacing[6]}`,
    margin: `${spacing[4]} 0`,
  },

  buttonSecondary: {
    backgroundColor: colors.white,
    border: `2px solid ${colors.primary[600]}`,
    borderRadius: borderRadius.md,
    color: colors.primary[600],
    fontSize: fontSizes.base,
    fontWeight: "bold" as const,
    textDecoration: "none" as const,
    textAlign: "center" as const,
    display: "inline-block" as const,
    padding: `${spacing[3]} ${spacing[6]}`,
    margin: `${spacing[4]} 0`,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray[200]}`,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    margin: `${spacing[6]} 0`,
  },

  cardHighlight: {
    backgroundColor: colors.info.light,
    border: `1px solid ${colors.primary[200]}`,
    borderLeft: `4px solid ${colors.primary[500]}`,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    margin: `${spacing[6]} 0`,
  },

  cardSuccess: {
    backgroundColor: colors.success.light,
    border: `1px solid ${colors.success.main}`,
    borderLeft: `4px solid ${colors.success.main}`,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    margin: `${spacing[6]} 0`,
  },

  cardWarning: {
    backgroundColor: colors.warning.light,
    border: `1px solid ${colors.warning.main}`,
    borderLeft: `4px solid ${colors.warning.main}`,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    margin: `${spacing[6]} 0`,
  },

  cardAction: {
    backgroundColor: colors.gray[50],
    border: `2px dashed ${colors.gray[300]}`,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    margin: `${spacing[6]} 0`,
    textAlign: "center" as const,
  },

  // Code/Prompt boxes
  codeBox: {
    backgroundColor: colors.gray[900],
    color: colors.gray[100],
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    margin: `${spacing[4]} 0`,
  },

  promptBox: {
    backgroundColor: colors.gray[50],
    border: `1px solid ${colors.gray[200]}`,
    borderLeft: `3px solid ${colors.primary[500]}`,
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    margin: `${spacing[4]} 0`,
  },

  // Dividers
  hr: {
    borderColor: colors.gray[200],
    borderTop: "none",
    margin: `${spacing[8]} 0`,
  },

  // Footer
  footer: {
    backgroundColor: colors.gray[50],
    padding: `${spacing[8]} ${spacing[6]}`,
    textAlign: "center" as const,
    borderTop: `1px solid ${colors.gray[200]}`,
  },

  footerText: {
    color: colors.gray[500],
    fontSize: fontSizes.sm,
    margin: `${spacing[2]} 0`,
  },

  // Header
  header: {
    backgroundColor: colors.primary[500],
    backgroundImage: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.louisiana[500]} 100%)`,
    padding: `${spacing[8]} ${spacing[6]}`,
    textAlign: "center" as const,
  },

  headerTitle: {
    color: colors.white,
    fontSize: fontSizes["2xl"],
    fontWeight: "bold" as const,
    fontFamily: fonts.heading,
    margin: "0",
  },

  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: fontSizes.base,
    margin: `${spacing[2]} 0 0`,
  },

  // Content
  content: {
    padding: `${spacing[8]} ${spacing[6]}`,
  },

  // Badges
  badge: {
    backgroundColor: colors.gray[200],
    color: colors.gray[700],
    fontSize: fontSizes.xs,
    fontWeight: "500" as const,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.sm,
    display: "inline-block" as const,
  },

  badgePrimary: {
    backgroundColor: colors.primary[100],
    color: colors.primary[700],
    fontSize: fontSizes.xs,
    fontWeight: "500" as const,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.sm,
    display: "inline-block" as const,
  },

  badgeSuccess: {
    backgroundColor: colors.success.light,
    color: colors.success.text,
    fontSize: fontSizes.xs,
    fontWeight: "500" as const,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.sm,
    display: "inline-block" as const,
  },

  // Testimonials
  testimonial: {
    backgroundColor: colors.info.light,
    borderLeft: `4px solid ${colors.primary[500]}`,
    padding: spacing[4],
    margin: `${spacing[4]} 0`,
    fontStyle: "italic" as const,
  },

  testimonialText: {
    color: colors.louisiana[500],
    fontSize: fontSizes.base,
    lineHeight: "1.625",
    margin: 0,
  },

  testimonialAuthor: {
    color: colors.gray[500],
    fontSize: fontSizes.sm,
    margin: `${spacing[2]} 0 0`,
    fontStyle: "normal" as const,
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type EmailStyles = typeof styles;
export type EmailColors = typeof colors;
