/**
 * Performance Monitoring Utilities
 * Tracks Core Web Vitals and custom metrics for Pelican AI
 */

import React from 'react';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  pageLoadTime?: number;
  componentRenderTime?: Record<string, number>;
  apiResponseTime?: Record<string, number>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeCoreWebVitals();
    this.initializeCustomMetrics();
  }

  private initializeCoreWebVitals() {
    // LCP - Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.logMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.logMetric('FID', this.metrics.fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
            this.logMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private initializeCustomMetrics() {
    // Page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.metrics.pageLoadTime = loadTime;
      this.logMetric('Page Load Time', loadTime);
    });

    // TTFB - Time to First Byte
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.responseStart > 0) {
            this.metrics.ttfb = entry.responseStart - entry.requestStart;
            this.logMetric('TTFB', this.metrics.ttfb);
          }
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    }
  }

  // Track component render time
  trackComponentRender(componentName: string, startTime: number) {
    const renderTime = performance.now() - startTime;
    if (!this.metrics.componentRenderTime) {
      this.metrics.componentRenderTime = {};
    }
    this.metrics.componentRenderTime[componentName] = renderTime;
    
    // Log slow renders (>16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Track API response time
  trackApiResponse(endpoint: string, startTime: number) {
    const responseTime = performance.now() - startTime;
    if (!this.metrics.apiResponseTime) {
      this.metrics.apiResponseTime = {};
    }
    this.metrics.apiResponseTime[endpoint] = responseTime;
    
    // Log slow API calls (>1000ms)
    if (responseTime > 1000) {
      console.warn(`Slow API call detected: ${endpoint} took ${responseTime.toFixed(2)}ms`);
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Log metric with appropriate level
  private logMetric(name: string, value: number) {
    const thresholds = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'TTFB': { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (threshold) {
      if (value <= threshold.good) {
        console.log(`✅ ${name}: ${value.toFixed(2)}ms (Good)`);
      } else if (value <= threshold.poor) {
        console.warn(`⚠️ ${name}: ${value.toFixed(2)}ms (Needs Improvement)`);
      } else {
        console.error(`❌ ${name}: ${value.toFixed(2)}ms (Poor)`);
      }
    } else {
      console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
    }
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  const startTime = performance.now();
  
  React.useEffect(() => {
    performanceMonitor.trackComponentRender(componentName, startTime);
  });
}

// Utility for API performance tracking
export function trackApiCall(endpoint: string) {
  const startTime = performance.now();
  return () => performanceMonitor.trackApiResponse(endpoint, startTime);
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).pelicanPerformance = performanceMonitor;
}
