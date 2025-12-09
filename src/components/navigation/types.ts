import type { LucideIcon } from "lucide-react";

/**
 * Navigation item configuration for main navigation links.
 * These appear in the center of the header on desktop (pill-style nav)
 * and in the Navigation section of the mobile menu.
 */
export interface NavItem {
  /** Display label for the navigation item */
  label: string;
  /** Optional icon from lucide-react */
  icon?: LucideIcon;
  /** Click handler - called when item is selected */
  onClick?: () => void;
  /** Optional href for link-based navigation */
  href?: string;
  /** Button variant - "default" for primary, "ghost" for secondary */
  variant?: "default" | "ghost";
  /** Whether this item is currently active/selected */
  active?: boolean;
  /** Optional badge to display next to the label (e.g., count) */
  badge?: number | string;
}

/**
 * Action button configuration for header actions.
 * These appear on the right side of the header (desktop only)
 * and in the Account section of the mobile menu.
 */
export interface NavAction {
  /** Display label for the action (used as tooltip on desktop, text on mobile) */
  label: string;
  /** Required icon from lucide-react */
  icon: LucideIcon;
  /** Click handler - called when action is triggered */
  onClick: () => void;
  /** Button variant styling */
  variant?: "default" | "ghost" | "destructive";
  /** Whether to show text label alongside icon on desktop (default: false = icon-only) */
  showLabel?: boolean;
}

/**
 * Complete navigation configuration for a page/route.
 * Pass this to AppHeader to configure the entire navigation.
 */
export interface NavConfig {
  /** Main navigation links - displayed in center pill on desktop, nav section on mobile */
  navItems?: NavItem[];
  /** Right-side action buttons - Profile, Sign Out, etc. */
  actions?: NavAction[];
  /** Whether to show the theme toggle button (default: true) */
  showThemeToggle?: boolean;
}

/**
 * Props for navigation section in mobile menu (internal use)
 */
export interface NavSection {
  title: string;
  items: (NavItem | NavAction)[];
}
