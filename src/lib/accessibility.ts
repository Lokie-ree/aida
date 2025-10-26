/**
 * Accessibility Audit Utilities
 * WCAG 2.1 Level AA compliance checking for Pelican AI
 */

import React from 'react';

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: string;
  message: string;
  wcagGuideline: string;
  fix: string;
}

export interface AccessibilityAuditResult {
  score: number; // 0-100
  issues: AccessibilityIssue[];
  passed: number;
  failed: number;
  warnings: number;
}

class AccessibilityAuditor {
  private issues: AccessibilityIssue[] = [];

  // Check color contrast ratios
  checkColorContrast(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = this.getBackgroundColor(element);
    const textColor = computedStyle.color;

    if (backgroundColor && textColor) {
      const contrastRatio = this.calculateContrastRatio(backgroundColor, textColor);
      
      if (contrastRatio < 4.5) {
        issues.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: `Color contrast ratio ${contrastRatio.toFixed(2)} is below WCAG AA standard (4.5:1)`,
          wcagGuideline: '1.4.3 Contrast (Minimum)',
          fix: 'Increase color contrast by using darker text or lighter background'
        });
      } else if (contrastRatio < 7) {
        issues.push({
          type: 'warning',
          element: element.tagName.toLowerCase(),
          message: `Color contrast ratio ${contrastRatio.toFixed(2)} meets AA but not AAA standard (7:1)`,
          wcagGuideline: '1.4.6 Contrast (Enhanced)',
          fix: 'Consider increasing contrast for better accessibility'
        });
      }
    }

    return issues;
  }

  // Check for proper heading hierarchy
  checkHeadingHierarchy(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        issues.push({
          type: 'error',
          element: heading.tagName.toLowerCase(),
          message: 'First heading should be h1',
          wcagGuideline: '1.3.1 Info and Relationships',
          fix: 'Change first heading to h1'
        });
      }

      if (level > previousLevel + 1) {
        issues.push({
          type: 'error',
          element: heading.tagName.toLowerCase(),
          message: `Heading level ${level} skips level ${previousLevel + 1}`,
          wcagGuideline: '1.3.1 Info and Relationships',
          fix: 'Use proper heading hierarchy (h1, h2, h3, etc.)'
        });
      }

      previousLevel = level;
    });

    return issues;
  }

  // Check for proper alt text on images
  checkImageAltText(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      
      if (alt === null) {
        issues.push({
          type: 'error',
          element: 'img',
          message: 'Image missing alt attribute',
          wcagGuideline: '1.1.1 Non-text Content',
          fix: 'Add alt attribute to image'
        });
      } else if (alt === '') {
        // Check if image is decorative
        const role = img.getAttribute('role');
        if (role !== 'presentation' && role !== 'none') {
          issues.push({
            type: 'warning',
            element: 'img',
            message: 'Image has empty alt text - ensure it is decorative',
            wcagGuideline: '1.1.1 Non-text Content',
            fix: 'Add descriptive alt text or role="presentation" for decorative images'
          });
        }
      }
    });

    return issues;
  }

  // Check for proper form labels
  checkFormLabels(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!id && !ariaLabel && !ariaLabelledBy) {
        // Check for associated label
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
          issues.push({
            type: 'error',
            element: input.tagName.toLowerCase(),
            message: 'Form control missing label',
            wcagGuideline: '3.3.2 Labels or Instructions',
            fix: 'Add label, aria-label, or aria-labelledby attribute'
          });
        }
      }
    });

    return issues;
  }

  // Check for proper focus management
  checkFocusManagement(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push({
          type: 'warning',
          element: element.tagName.toLowerCase(),
          message: 'Positive tabindex can disrupt natural tab order',
          wcagGuideline: '2.4.3 Focus Order',
          fix: 'Use tabindex="0" or remove tabindex attribute'
        });
      }
    });

    return issues;
  }

  // Check for proper ARIA attributes
  checkAriaAttributes(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const elementsWithAria = document.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked]');

    elementsWithAria.forEach(element => {
      const expanded = element.getAttribute('aria-expanded');
      const selected = element.getAttribute('aria-selected');
      const checked = element.getAttribute('aria-checked');

      if (expanded && !['true', 'false'].includes(expanded)) {
        issues.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: 'aria-expanded must be "true" or "false"',
          wcagGuideline: '4.1.2 Name, Role, Value',
          fix: 'Set aria-expanded to "true" or "false"'
        });
      }

      if (selected && !['true', 'false'].includes(selected)) {
        issues.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: 'aria-selected must be "true" or "false"',
          wcagGuideline: '4.1.2 Name, Role, Value',
          fix: 'Set aria-selected to "true" or "false"'
        });
      }

      if (checked && !['true', 'false', 'mixed'].includes(checked)) {
        issues.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: 'aria-checked must be "true", "false", or "mixed"',
          wcagGuideline: '4.1.2 Name, Role, Value',
          fix: 'Set aria-checked to "true", "false", or "mixed"'
        });
      }
    });

    return issues;
  }

  // Run comprehensive accessibility audit
  runAudit(): AccessibilityAuditResult {
    this.issues = [];

    // Run all checks
    this.issues.push(...this.checkHeadingHierarchy());
    this.issues.push(...this.checkImageAltText());
    this.issues.push(...this.checkFormLabels());
    this.issues.push(...this.checkFocusManagement());
    this.issues.push(...this.checkAriaAttributes());

    // Check color contrast for all text elements
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
    textElements.forEach(element => {
      this.issues.push(...this.checkColorContrast(element as HTMLElement));
    });

    // Calculate score
    const errors = this.issues.filter(issue => issue.type === 'error').length;
    const warnings = this.issues.filter(issue => issue.type === 'warning').length;
    const totalIssues = errors + warnings;
    const score = Math.max(0, 100 - (errors * 10) - (warnings * 5));

    return {
      score,
      issues: this.issues,
      passed: this.issues.length - totalIssues,
      failed: errors,
      warnings
    };
  }

  // Helper method to get background color
  private getBackgroundColor(element: HTMLElement): string | null {
    const computedStyle = window.getComputedStyle(element);
    let backgroundColor = computedStyle.backgroundColor;
    
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      const parent = element.parentElement;
      if (parent) {
        return this.getBackgroundColor(parent);
      }
    }
    
    return backgroundColor;
  }

  // Helper method to calculate contrast ratio
  private calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const lum1 = this.getLuminance(rgb1);
    const lum2 = this.getLuminance(rgb2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
}

// Singleton instance
export const accessibilityAuditor = new AccessibilityAuditor();

// React hook for accessibility checking
export function useAccessibilityCheck() {
  const [auditResult, setAuditResult] = React.useState<AccessibilityAuditResult | null>(null);

  const runAudit = React.useCallback(() => {
    const result = accessibilityAuditor.runAudit();
    setAuditResult(result);
    return result;
  }, []);

  return { auditResult, runAudit };
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).pelicanAccessibility = accessibilityAuditor;
}
