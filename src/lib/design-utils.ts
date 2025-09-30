/**
 * A.I.D.A. Design Utilities
 * Utility functions for applying design tokens consistently across components
 * Aligned with "Voice of the School District" strategic vision
 */

import { designTokens } from "./design-tokens";

// Brand Color Utilities
export const getAidaBrandColors = () => ({
  // Primary brand colors
  primary: {
    50: designTokens.colors.brand.primary[50],
    500: designTokens.colors.brand.primary[500],
    600: designTokens.colors.brand.primary[600],
  },
  secondary: {
    50: designTokens.colors.brand.secondary[50],
    500: designTokens.colors.brand.secondary[500],
    600: designTokens.colors.brand.secondary[600],
  },
});

// Community Stakeholder Colors
export const getAidaCommunityColors = () => ({
  teachers: {
    50: designTokens.colors.community.teachers[50],
    500: designTokens.colors.community.teachers[500],
    600: designTokens.colors.community.teachers[600],
  },
  parents: {
    50: designTokens.colors.community.parents[50],
    500: designTokens.colors.community.parents[500],
    600: designTokens.colors.community.parents[600],
  },
  administrators: {
    50: designTokens.colors.community.administrators[50],
    500: designTokens.colors.community.administrators[500],
    600: designTokens.colors.community.administrators[600],
  },
});

// Voice Interface Colors
export const getAidaVoiceColors = () => ({
  idle: {
    50: designTokens.colors.voice.idle[50],
    500: designTokens.colors.voice.idle[500],
    600: designTokens.colors.voice.idle[600],
  },
  listening: {
    50: designTokens.colors.voice.listening[50],
    500: designTokens.colors.voice.listening[500],
    600: designTokens.colors.voice.listening[600],
  },
  speaking: {
    50: designTokens.colors.voice.speaking[50],
    500: designTokens.colors.voice.speaking[500],
    600: designTokens.colors.voice.speaking[600],
  },
  error: {
    50: designTokens.colors.voice.error[50],
    500: designTokens.colors.voice.error[500],
    600: designTokens.colors.voice.error[600],
  },
});

// Voice Interface Utilities
export const getAidaVoiceInterface = () => ({
  button: {
    size: {
      sm: designTokens.voiceInterface.button.size.sm,
      md: designTokens.voiceInterface.button.size.md,
      lg: designTokens.voiceInterface.button.size.lg,
      xl: designTokens.voiceInterface.button.size.xl,
    },
    animation: designTokens.voiceInterface.button.animation,
    ring: designTokens.voiceInterface.button.ring,
  },
  status: {
    indicators: designTokens.voiceInterface.status.indicators,
  },
  examples: {
    grid: designTokens.voiceInterface.examples.grid,
  },
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

  // Voice interface spacing
  voiceButtonPadding: designTokens.spacing[4], // p-4
  voiceStatusSpacing: designTokens.spacing[1], // gap-1
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
      insights: designTokens.colors.secondary.purple, // AI Insights
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
  // Brand Colors
  brand: {
    primary: {
      50: "bg-aida-primary-50 text-aida-primary-50",
      500: "bg-aida-primary-500 text-aida-primary-500",
      600: "bg-aida-primary-600 text-aida-primary-600",
    },
    secondary: {
      50: "bg-aida-secondary-50 text-aida-secondary-50",
      500: "bg-aida-secondary-500 text-aida-secondary-500",
      600: "bg-aida-secondary-600 text-aida-secondary-600",
    },
  },
  
  // Community Stakeholder Colors
  community: {
    teachers: {
      50: "bg-aida-teachers-50 text-aida-teachers-50",
      500: "bg-aida-teachers-500 text-aida-teachers-500",
      600: "bg-aida-teachers-600 text-aida-teachers-600",
    },
    parents: {
      50: "bg-aida-parents-50 text-aida-parents-50",
      500: "bg-aida-parents-500 text-aida-parents-500",
      600: "bg-aida-parents-600 text-aida-parents-600",
    },
    administrators: {
      50: "bg-aida-administrators-50 text-aida-administrators-50",
      500: "bg-aida-administrators-500 text-aida-administrators-500",
      600: "bg-aida-administrators-600 text-aida-administrators-600",
    },
  },
  
  // Voice Interface States
  voice: {
    idle: {
      50: "bg-aida-voice-idle-50 text-aida-voice-idle-50",
      500: "bg-aida-voice-idle-500 text-aida-voice-idle-500",
      600: "bg-aida-voice-idle-600 text-aida-voice-idle-600",
    },
    listening: {
      50: "bg-aida-voice-listening-50 text-aida-voice-listening-50",
      500: "bg-aida-voice-listening-500 text-aida-voice-listening-500",
      600: "bg-aida-voice-listening-600 text-aida-voice-listening-600",
    },
    speaking: {
      50: "bg-aida-voice-speaking-50 text-aida-voice-speaking-50",
      500: "bg-aida-voice-speaking-500 text-aida-voice-speaking-500",
      600: "bg-aida-voice-speaking-600 text-aida-voice-speaking-600",
    },
  },
  
  // Voice Interface Components
  voiceButton: {
    idle: "w-28 h-28 bg-aida-voice-idle-500 hover:bg-aida-voice-idle-600 rounded-full animate-pulse",
    listening: "w-28 h-28 bg-aida-voice-listening-500 hover:bg-aida-voice-listening-600 rounded-full animate-ping ring-voice-listening",
    speaking: "w-28 h-28 bg-aida-voice-speaking-500 hover:bg-aida-voice-speaking-600 rounded-full animate-bounce ring-voice-speaking",
    error: "w-28 h-28 bg-red-500 hover:bg-red-600 rounded-full",
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
  
  // Trust Signals
  trustSignal: "w-2 h-2 rounded-full",
});
