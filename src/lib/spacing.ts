/**
 * Pelican AI Spacing Utilities
 * Consistent spacing tokens aligned with Tailwind and brand guidelines
 */

export const spacing = {
  // Container padding - responsive
  container: 'px-4 sm:px-6 lg:px-8',
  containerY: 'py-6 sm:py-8',
  
  // Card padding - consistent across all cards
  card: 'p-4 sm:p-6',
  cardHeader: 'p-4 sm:p-6 pb-4',
  cardContent: 'p-4 sm:p-6 pt-0',
  
  // Section spacing - vertical gaps between major sections
  sectionGap: 'space-y-6 lg:space-y-8',
  sectionGapSmall: 'space-y-4 lg:space-y-6',
  
  // Grid gaps - horizontal and vertical spacing in grids
  gridGap: 'gap-4 lg:gap-6',
  gridGapSmall: 'gap-3 lg:gap-4',
  
  // Chart containers - max width for readability
  chartContainer: 'max-w-5xl mx-auto',
  chartContainerLarge: 'max-w-7xl mx-auto',
} as const;

export const chartSizing = {
  // Responsive chart heights - optimized for better mobile experience
  small: 200,
  medium: 280, // Reduced for better mobile fit
  large: 350, // Reduced for better mobile fit
  
  // Responsive margins
  margin: {
    top: 10,
    right: 20,
    left: 0,
    bottom: 10,
  },
  
  // Pie chart specific radius - smaller for better fit
  pieOuterRadius: 80, // Reduced from default
  pieInnerRadius: 50, // Reduced from default
} as const;
