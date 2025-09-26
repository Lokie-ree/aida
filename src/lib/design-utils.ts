/**
 * Design Utilities
 * Helper functions for working with design tokens
 */

import { designTokens } from './design-tokens';

/**
 * Get a color value from the design tokens
 * @param colorPath - Path to the color (e.g., 'primary.500', 'neutral.100')
 * @returns The color value
 */
export function getColor(colorPath: string): string {
  const [category, shade] = colorPath.split('.');
  return (designTokens.colors as any)[category]?.[shade] || colorPath;
}

/**
 * Get a spacing value from the design tokens
 * @param size - The spacing size (e.g., '4', '8', '16')
 * @returns The spacing value
 */
export function getSpacing(size: keyof typeof designTokens.spacing): string {
  return designTokens.spacing[size];
}

/**
 * Get a typography value from the design tokens
 * @param property - The typography property (e.g., 'fontSize.lg', 'fontWeight.bold')
 * @returns The typography value
 */
export function getTypography(property: string): any {
  const [category, variant] = property.split('.');
  return (designTokens.typography as any)[category]?.[variant];
}

/**
 * Get a border radius value from the design tokens
 * @param size - The border radius size (e.g., 'sm', 'lg', 'full')
 * @returns The border radius value
 */
export function getBorderRadius(size: keyof typeof designTokens.borderRadius): string {
  return designTokens.borderRadius[size];
}

/**
 * Get a shadow value from the design tokens
 * @param size - The shadow size (e.g., 'sm', 'md', 'lg')
 * @returns The shadow value
 */
export function getShadow(size: keyof typeof designTokens.shadows): string {
  return designTokens.shadows[size];
}

/**
 * Get a z-index value from the design tokens
 * @param level - The z-index level (e.g., 'modal', 'dropdown', 'tooltip')
 * @returns The z-index value
 */
export function getZIndex(level: keyof typeof designTokens.zIndex): string | number {
  return designTokens.zIndex[level];
}

/**
 * Get a breakpoint value from the design tokens
 * @param size - The breakpoint size (e.g., 'sm', 'md', 'lg')
 * @returns The breakpoint value
 */
export function getBreakpoint(size: keyof typeof designTokens.breakpoints): string {
  return designTokens.breakpoints[size];
}

/**
 * Get an animation duration value from the design tokens
 * @param speed - The animation speed (e.g., 'fast', 'normal', 'slow')
 * @returns The animation duration value
 */
export function getAnimationDuration(speed: keyof typeof designTokens.animations.duration): string {
  return designTokens.animations.duration[speed];
}

/**
 * Get an animation easing value from the design tokens
 * @param type - The easing type (e.g., 'linear', 'in', 'out', 'inOut')
 * @returns The animation easing value
 */
export function getAnimationEasing(type: keyof typeof designTokens.animations.easing): string {
  return designTokens.animations.easing[type];
}

/**
 * Generate CSS custom properties for a component
 * @param overrides - Object with CSS custom property overrides
 * @returns CSS string with custom properties
 */
export function generateCSSVariables(overrides: Record<string, string>): string {
  return Object.entries(overrides)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(' ');
}

/**
 * Create a responsive style object
 * @param styles - Object with breakpoint-specific styles
 * @returns Responsive style object
 */
export function createResponsiveStyles(styles: {
  base?: Record<string, string>;
  sm?: Record<string, string>;
  md?: Record<string, string>;
  lg?: Record<string, string>;
  xl?: Record<string, string>;
}): Record<string, string> {
  const responsiveStyles: Record<string, string> = { ...styles.base };
  
  Object.entries(styles).forEach(([breakpoint, style]) => {
    if (breakpoint !== 'base' && style) {
      const mediaQuery = `@media (min-width: ${designTokens.breakpoints[breakpoint as keyof typeof designTokens.breakpoints]})`;
      Object.entries(style).forEach(([property, value]) => {
        responsiveStyles[`${mediaQuery} ${property}`] = value;
      });
    }
  });
  
  return responsiveStyles;
}

/**
 * Generate Tailwind CSS classes based on design tokens
 * @param config - Configuration object for generating classes
 * @returns Object with Tailwind class mappings
 */
export function generateTailwindClasses(config: {
  spacing?: Record<string, keyof typeof designTokens.spacing>;
  colors?: Record<string, string>;
  typography?: Record<string, string>;
  borderRadius?: Record<string, keyof typeof designTokens.borderRadius>;
}): Record<string, string> {
  const classes: Record<string, string> = {};
  
  if (config.spacing) {
    Object.entries(config.spacing).forEach(([key, value]) => {
      classes[key] = `p-${value}`;
    });
  }
  
  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      classes[key] = `bg-${value}`;
    });
  }
  
  if (config.typography) {
    Object.entries(config.typography).forEach(([key, value]) => {
      classes[key] = `text-${value}`;
    });
  }
  
  if (config.borderRadius) {
    Object.entries(config.borderRadius).forEach(([key, value]) => {
      classes[key] = `rounded-${value}`;
    });
  }
  
  return classes;
}

/**
 * Validate that a color path exists in the design tokens
 * @param colorPath - Path to the color (e.g., 'primary.500')
 * @returns True if the color path exists
 */
export function isValidColorPath(colorPath: string): boolean {
  const [category, shade] = colorPath.split('.');
  return !!(designTokens.colors as any)[category]?.[shade];
}

/**
 * Get all available color shades for a category
 * @param category - Color category (e.g., 'primary', 'neutral')
 * @returns Array of available shades
 */
export function getColorShades(category: keyof typeof designTokens.colors): string[] {
  return Object.keys(designTokens.colors[category]);
}

/**
 * Get all available spacing values
 * @returns Array of available spacing values
 */
export function getAvailableSpacing(): string[] {
  return Object.keys(designTokens.spacing);
}

/**
 * Get all available typography variants
 * @param category - Typography category (e.g., 'fontSize', 'fontWeight')
 * @returns Array of available variants
 */
export function getTypographyVariants(category: keyof typeof designTokens.typography): string[] {
  return Object.keys(designTokens.typography[category]);
}
