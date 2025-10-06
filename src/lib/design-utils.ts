/**
 * Simplified Design Utilities
 * Working with CSS custom properties for better maintainability
 */

import { designTokens } from "./design-tokens";

// Brand Color Utilities
export const getBrandColors = () => ({
  primary: designTokens.colors.primary,
  secondary: designTokens.colors.secondary,
  accent: designTokens.colors.accent,
});

// CSS custom properties for Tailwind integration
export const getCSSVariables = () => ({
  "--primary": "hsl(var(--primary))",
  "--secondary": "hsl(var(--secondary))",
  "--accent": "hsl(var(--accent))",
});

// Tailwind class mappings for design tokens
export const getTailwindClasses = () => ({
  // Brand Colors
  brand: {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
  },
  
  // Spacing
  spacing: {
    sectionPadding: "py-16 md:py-32", // Section padding
    containerPadding: "px-6", // Container padding
    contentSpacing: "space-y-12", // Content spacing
    contentSpacingSmall: "space-y-8", // Small content spacing
    contentSpacingLarge: "space-y-16", // Large content spacing
  },
  
  // Typography
  typography: {
    headingLarge: "text-4xl font-semibold", // Large headings
    headingXLarge: "text-5xl font-semibold", // Extra large headings
    bodyText: "text-base", // Body text
  },
  
  // Component Styles
  card: "bg-card text-card-foreground border border-border rounded-lg shadow-sm",
  button: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors",
  input: "border border-input bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring",
});

// Utility functions for common patterns
export const getGradientStyles = (from: string, to: string) => ({
  background: `linear-gradient(135deg, ${from}, ${to})`,
});

export const getShadowStyles = (level: keyof typeof designTokens.shadows) => ({
  boxShadow: designTokens.shadows[level],
});

export const getSpacingStyles = (size: keyof typeof designTokens.spacing) => ({
  padding: designTokens.spacing[size],
});

// Component-specific utilities
export const getComponentStyles = () => ({
  // Feature icons
  featureIcon: {
    size: "1rem", // size-4
    colors: {
      voice: designTokens.colors.primary, // Voice Interface
      insights: designTokens.colors.secondary, // AI Insights
      knowledge: designTokens.colors.accent, // Knowledge Base
      workspace: designTokens.colors.primary, // Smart Workspaces
    },
  },

  // Landing page sections
  section: {
    padding: {
      mobile: `${designTokens.spacing[16]} 0`,
      desktop: `${designTokens.spacing[32]} 0`,
    },
    maxWidth: "80rem", // max-w-5xl
    containerPadding: `0 ${designTokens.spacing[6]}`, // px-6
  },

  // Call to action
  cta: {
    buttonPadding: `${designTokens.spacing[3]} ${designTokens.spacing[8]}`, // px-8 py-3
    buttonSize: "lg",
  },
});

// Animation utilities
export const getAnimationStyles = () => ({
  fadeIn: "animate-in fade-in duration-300",
  slideUp: "animate-in slide-in-from-bottom-4 duration-300",
  slideDown: "animate-in slide-in-from-top-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-300",
  hover: "hover:scale-105 transition-transform duration-200",
  focus: "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
});

// Responsive utilities
export const getResponsiveStyles = () => ({
  container: "mx-auto px-4 sm:px-6 lg:px-8",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  flex: "flex flex-col sm:flex-row gap-4",
  text: "text-sm sm:text-base lg:text-lg",
  spacing: "space-y-4 sm:space-y-6 lg:space-y-8",
});