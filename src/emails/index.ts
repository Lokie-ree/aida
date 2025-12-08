/**
 * Pelican AI Email Templates
 *
 * First-class email experience built with React Email and Tailwind CSS.
 *
 * Features:
 * - Tailwind CSS utility classes for styling
 * - Responsive mobile-first design
 * - Dark mode support (where email clients support it)
 * - Louisiana-specific branding and typography
 * - Reusable component library
 *
 * Usage:
 *   pnpm email:dev    - Start visual preview server at localhost:3001
 *   pnpm email:export - Export emails as HTML files
 */

// =============================================================================
// EMAIL CONFIGURATION & DESIGN SYSTEM
// =============================================================================

export * from "./email-config";

// =============================================================================
// BASE TEMPLATE & COMPONENTS
// =============================================================================

export {
  BaseEmailTemplate,
  // Typography
  Heading,
  Paragraph,
  // Cards & Boxes
  Card,
  InfoBox,
  HighlightBox,
  SuccessBox,
  WarningBox,
  ActionBox,
  CredentialsBox,
  // Buttons
  CTAButton,
  SecondaryButton,
  // Code & Prompts
  PromptBox,
  CodeBlock,
  // Lists & Steps
  ListItem,
  Step,
  // Features & Stats
  Feature,
  FeatureCard,
  StatsRow,
  // Timeline
  TimelineItem,
  // Special Components
  Testimonial,
  Badge,
  Signature,
  Divider,
  // Legacy exports
  textStyles,
} from "./BaseEmailTemplate";

// =============================================================================
// ACTIVE EMAIL TEMPLATES (Used in Production)
// =============================================================================

export { BetaWelcomeEmail } from "./BetaWelcomeEmail";
export { PlatformAccessEmail } from "./PlatformAccessEmail";
export { WeeklyPromptEmail } from "./WeeklyPromptEmail";
export { MagicLinkEmail } from "./MagicLinkEmail";
export { ApprovalNotificationEmail } from "./ApprovalNotificationEmail";

// =============================================================================
// FUTURE EMAIL TEMPLATES (Ready for Scaling Phase)
// =============================================================================

export { OutreachEmail } from "./OutreachEmail";
export { FollowupEmail } from "./FollowupEmail";
export { NetworkPartnerEmail } from "./NetworkPartnerEmail";

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type { EmailStyles, EmailColors } from "./email-config";
