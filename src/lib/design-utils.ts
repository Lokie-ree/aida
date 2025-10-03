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
    50: designTokens.colors.primary.blue,
    500: designTokens.colors.primary.blue,
    600: designTokens.colors.primary.blue,
  },
  secondary: {
    50: designTokens.colors.secondary.purple,
    500: designTokens.colors.secondary.purple,
    600: designTokens.colors.secondary.purple,
  },
});

// Community Stakeholder Colors
export const getAidaCommunityColors = () => ({
  teachers: {
    50: designTokens.colors.community.teachers[50],
    100: designTokens.colors.community.teachers[100],
    200: designTokens.colors.community.teachers[200],
    300: designTokens.colors.community.teachers[300],
    400: designTokens.colors.community.teachers[400],
    500: designTokens.colors.community.teachers[500],
    600: designTokens.colors.community.teachers[600],
    700: designTokens.colors.community.teachers[700],
    800: designTokens.colors.community.teachers[800],
    900: designTokens.colors.community.teachers[900],
  },
  parents: {
    50: designTokens.colors.community.parents[50],
    100: designTokens.colors.community.parents[100],
    200: designTokens.colors.community.parents[200],
    300: designTokens.colors.community.parents[300],
    400: designTokens.colors.community.parents[400],
    500: designTokens.colors.community.parents[500],
    600: designTokens.colors.community.parents[600],
    700: designTokens.colors.community.parents[700],
    800: designTokens.colors.community.parents[800],
    900: designTokens.colors.community.parents[900],
  },
  administrators: {
    50: designTokens.colors.community.administrators[50],
    100: designTokens.colors.community.administrators[100],
    200: designTokens.colors.community.administrators[200],
    300: designTokens.colors.community.administrators[300],
    400: designTokens.colors.community.administrators[400],
    500: designTokens.colors.community.administrators[500],
    600: designTokens.colors.community.administrators[600],
    700: designTokens.colors.community.administrators[700],
    800: designTokens.colors.community.administrators[800],
    900: designTokens.colors.community.administrators[900],
  },
});

// Voice Interface Colors
export const getAidaVoiceColors = () => ({
  idle: {
    50: designTokens.colors.voice.idle[50],
    100: designTokens.colors.voice.idle[100],
    200: designTokens.colors.voice.idle[200],
    300: designTokens.colors.voice.idle[300],
    400: designTokens.colors.voice.idle[400],
    500: designTokens.colors.voice.idle[500],
    600: designTokens.colors.voice.idle[600],
    700: designTokens.colors.voice.idle[700],
    800: designTokens.colors.voice.idle[800],
    900: designTokens.colors.voice.idle[900],
  },
  listening: {
    50: designTokens.colors.voice.listening[50],
    100: designTokens.colors.voice.listening[100],
    200: designTokens.colors.voice.listening[200],
    300: designTokens.colors.voice.listening[300],
    400: designTokens.colors.voice.listening[400],
    500: designTokens.colors.voice.listening[500],
    600: designTokens.colors.voice.listening[600],
    700: designTokens.colors.voice.listening[700],
    800: designTokens.colors.voice.listening[800],
    900: designTokens.colors.voice.listening[900],
  },
  speaking: {
    50: designTokens.colors.voice.speaking[50],
    100: designTokens.colors.voice.speaking[100],
    200: designTokens.colors.voice.speaking[200],
    300: designTokens.colors.voice.speaking[300],
    400: designTokens.colors.voice.speaking[400],
    500: designTokens.colors.voice.speaking[500],
    600: designTokens.colors.voice.speaking[600],
    700: designTokens.colors.voice.speaking[700],
    800: designTokens.colors.voice.speaking[800],
    900: designTokens.colors.voice.speaking[900],
  },
  error: {
    50: designTokens.colors.voice.error[50],
    100: designTokens.colors.voice.error[100],
    200: designTokens.colors.voice.error[200],
    300: designTokens.colors.voice.error[300],
    400: designTokens.colors.voice.error[400],
    500: designTokens.colors.voice.error[500],
    600: designTokens.colors.voice.error[600],
    700: designTokens.colors.voice.error[700],
    800: designTokens.colors.voice.error[800],
    900: designTokens.colors.voice.error[900],
  },
});

// Voice Interface Utilities
export const getAidaVoiceInterface = () => ({
  button: {
    size: {
      sm: "w-16 h-16",
      md: "w-20 h-20", 
      lg: "w-24 h-24",
      xl: "w-28 h-28",
    },
    animation: "animate-pulse",
    ring: "ring-2 ring-offset-2",
  },
  status: {
    indicators: "w-2 h-2 rounded-full",
  },
  examples: {
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
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
  
  
  // Voice Interface States
  voice: {
    idle: {
      50: "bg-aida-voice-idle-50 text-aida-voice-idle-50",
      100: "bg-aida-voice-idle-100 text-aida-voice-idle-100",
      200: "bg-aida-voice-idle-200 text-aida-voice-idle-200",
      300: "bg-aida-voice-idle-300 text-aida-voice-idle-300",
      400: "bg-aida-voice-idle-400 text-aida-voice-idle-400",
      500: "bg-aida-voice-idle-500 text-aida-voice-idle-500",
      600: "bg-aida-voice-idle-600 text-aida-voice-idle-600",
      700: "bg-aida-voice-idle-700 text-aida-voice-idle-700",
      800: "bg-aida-voice-idle-800 text-aida-voice-idle-800",
      900: "bg-aida-voice-idle-900 text-aida-voice-idle-900",
    },
    listening: {
      50: "bg-aida-voice-listening-50 text-aida-voice-listening-50",
      100: "bg-aida-voice-listening-100 text-aida-voice-listening-100",
      200: "bg-aida-voice-listening-200 text-aida-voice-listening-200",
      300: "bg-aida-voice-listening-300 text-aida-voice-listening-300",
      400: "bg-aida-voice-listening-400 text-aida-voice-listening-400",
      500: "bg-aida-voice-listening-500 text-aida-voice-listening-500",
      600: "bg-aida-voice-listening-600 text-aida-voice-listening-600",
      700: "bg-aida-voice-listening-700 text-aida-voice-listening-700",
      800: "bg-aida-voice-listening-800 text-aida-voice-listening-800",
      900: "bg-aida-voice-listening-900 text-aida-voice-listening-900",
    },
    speaking: {
      50: "bg-aida-voice-speaking-50 text-aida-voice-speaking-50",
      100: "bg-aida-voice-speaking-100 text-aida-voice-speaking-100",
      200: "bg-aida-voice-speaking-200 text-aida-voice-speaking-200",
      300: "bg-aida-voice-speaking-300 text-aida-voice-speaking-300",
      400: "bg-aida-voice-speaking-400 text-aida-voice-speaking-400",
      500: "bg-aida-voice-speaking-500 text-aida-voice-speaking-500",
      600: "bg-aida-voice-speaking-600 text-aida-voice-speaking-600",
      700: "bg-aida-voice-speaking-700 text-aida-voice-speaking-700",
      800: "bg-aida-voice-speaking-800 text-aida-voice-speaking-800",
      900: "bg-aida-voice-speaking-900 text-aida-voice-speaking-900",
    },
    error: {
      50: "bg-aida-voice-error-50 text-aida-voice-error-50",
      100: "bg-aida-voice-error-100 text-aida-voice-error-100",
      200: "bg-aida-voice-error-200 text-aida-voice-error-200",
      300: "bg-aida-voice-error-300 text-aida-voice-error-300",
      400: "bg-aida-voice-error-400 text-aida-voice-error-400",
      500: "bg-aida-voice-error-500 text-aida-voice-error-500",
      600: "bg-aida-voice-error-600 text-aida-voice-error-600",
      700: "bg-aida-voice-error-700 text-aida-voice-error-700",
      800: "bg-aida-voice-error-800 text-aida-voice-error-800",
      900: "bg-aida-voice-error-900 text-aida-voice-error-900",
    },
  },
  
  // Community Stakeholder Colors
  community: {
    teachers: {
      50: "bg-aida-community-teachers-50 text-aida-community-teachers-50",
      100: "bg-aida-community-teachers-100 text-aida-community-teachers-100",
      200: "bg-aida-community-teachers-200 text-aida-community-teachers-200",
      300: "bg-aida-community-teachers-300 text-aida-community-teachers-300",
      400: "bg-aida-community-teachers-400 text-aida-community-teachers-400",
      500: "bg-aida-community-teachers-500 text-aida-community-teachers-500",
      600: "bg-aida-community-teachers-600 text-aida-community-teachers-600",
      700: "bg-aida-community-teachers-700 text-aida-community-teachers-700",
      800: "bg-aida-community-teachers-800 text-aida-community-teachers-800",
      900: "bg-aida-community-teachers-900 text-aida-community-teachers-900",
    },
    parents: {
      50: "bg-aida-community-parents-50 text-aida-community-parents-50",
      100: "bg-aida-community-parents-100 text-aida-community-parents-100",
      200: "bg-aida-community-parents-200 text-aida-community-parents-200",
      300: "bg-aida-community-parents-300 text-aida-community-parents-300",
      400: "bg-aida-community-parents-400 text-aida-community-parents-400",
      500: "bg-aida-community-parents-500 text-aida-community-parents-500",
      600: "bg-aida-community-parents-600 text-aida-community-parents-600",
      700: "bg-aida-community-parents-700 text-aida-community-parents-700",
      800: "bg-aida-community-parents-800 text-aida-community-parents-800",
      900: "bg-aida-community-parents-900 text-aida-community-parents-900",
    },
    administrators: {
      50: "bg-aida-community-administrators-50 text-aida-community-administrators-50",
      100: "bg-aida-community-administrators-100 text-aida-community-administrators-100",
      200: "bg-aida-community-administrators-200 text-aida-community-administrators-200",
      300: "bg-aida-community-administrators-300 text-aida-community-administrators-300",
      400: "bg-aida-community-administrators-400 text-aida-community-administrators-400",
      500: "bg-aida-community-administrators-500 text-aida-community-administrators-500",
      600: "bg-aida-community-administrators-600 text-aida-community-administrators-600",
      700: "bg-aida-community-administrators-700 text-aida-community-administrators-700",
      800: "bg-aida-community-administrators-800 text-aida-community-administrators-800",
      900: "bg-aida-community-administrators-900 text-aida-community-administrators-900",
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
