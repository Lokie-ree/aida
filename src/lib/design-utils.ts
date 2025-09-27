/**
 * A.I.D.A. Design Utilities
 * Utility functions for applying design tokens consistently across components
 */

import { designTokens } from "./design-tokens";

// Color utility functions
export const getAidaColors = () => ({
  // Primary colors for actions and trust
  primaryBlue: designTokens.colors.primary.blue,
  primaryGreen: designTokens.colors.primary.green,
  primaryRed: designTokens.colors.primary.red,

  // Secondary colors for AI features and innovation
  secondaryPurple: designTokens.colors.secondary.purple,
  secondaryOrange: designTokens.colors.secondary.orange,
});

// Spacing utility functions
export const getAidaSpacing = () => ({
  // Section padding
  sectionPadding: `${designTokens.spacing[16]} ${designTokens.spacing[32]}`, // py-16 md:py-32
  sectionPaddingMobile: designTokens.spacing[16], // py-16
  sectionPaddingDesktop: designTokens.spacing[32], // md:py-32

  // Container padding
  containerPadding: designTokens.spacing[6], // px-6

  // Content spacing
  contentSpacing: designTokens.spacing[12], // space-y-12
  contentSpacingSmall: designTokens.spacing[8], // space-y-8
  contentSpacingLarge: designTokens.spacing[16], // space-y-16
});

// Typography utility functions
export const getAidaTypography = () => ({
  // Headings
  headingLarge: {
    fontSize: designTokens.typography.fontSize["4xl"][0], // text-4xl
    fontWeight: designTokens.typography.fontWeight.semibold, // font-semibold
  },
  headingXLarge: {
    fontSize: designTokens.typography.fontSize["5xl"][0], // text-5xl
    fontWeight: designTokens.typography.fontWeight.semibold, // font-semibold
  },

  // Body text
  bodyText: {
    fontSize: designTokens.typography.fontSize.base[0], // text-base
    lineHeight: designTokens.typography.fontSize.base[1].lineHeight,
  },
});

// Component-specific utilities
export const getAidaComponentStyles = () => ({
  // Feature icons
  featureIcon: {
    size: "1rem", // size-4
    colors: {
      voice: designTokens.colors.primary.blue, // Voice Interface
      feedback: designTokens.colors.secondary.purple, // AI Feedback
      knowledge: designTokens.colors.primary.green, // Knowledge Base
      workspace: designTokens.colors.secondary.orange, // Smart Workspaces
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

// CSS custom properties for Tailwind integration
export const getAidaCSSVariables = () => ({
  "--aida-primary-blue": designTokens.colors.primary.blue,
  "--aida-primary-green": designTokens.colors.primary.green,
  "--aida-primary-red": designTokens.colors.primary.red,
  "--aida-secondary-purple": designTokens.colors.secondary.purple,
  "--aida-secondary-orange": designTokens.colors.secondary.orange,
});

// Tailwind class mappings for design tokens
export const getAidaTailwindClasses = () => ({
  colors: {
    primaryBlue: "text-[#3B82F6]", // Primary actions, voice interface
    primaryGreen: "text-[#10B981]", // Success states, positive feedback
    primaryRed: "text-[#EF4444]", // Error states, warnings
    secondaryPurple: "text-[#8B5CF6]", // AI features, voice responses
    secondaryOrange: "text-[#F59E0B]", // Warnings, attention
  },
  spacing: {
    sectionPadding: "py-16 md:py-32", // Section padding
    containerPadding: "px-6", // Container padding
    contentSpacing: "space-y-12", // Content spacing
    contentSpacingSmall: "space-y-8", // Small content spacing
    contentSpacingLarge: "space-y-16", // Large content spacing
  },
  typography: {
    headingLarge: "text-4xl font-semibold", // Large headings
    headingXLarge: "text-5xl font-semibold", // Extra large headings
    bodyText: "text-base", // Body text
  },
});
