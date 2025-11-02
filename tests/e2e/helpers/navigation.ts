/**
 * Navigation Helpers for E2E Tests
 * 
 * Provides utilities for navigating between pages and waiting for navigation
 */

import { expect } from "vitest";
import type { Page } from "playwright";

const BASE_URL = process.env.VITE_TEST_BASE_URL || "http://localhost:5173";

/**
 * Navigate to a route and wait for page load
 * @param page - Playwright page instance
 * @param path - Path to navigate to
 * @param options - Navigation options
 */
export async function navigateTo(
  page: Page,
  path: string,
  options?: { timeout?: number }
): Promise<void> {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
  
  // Wait for main content to be visible
  await page.waitForSelector("main, [role='main'], #main-content", {
    timeout: options?.timeout || 5000,
  });
}

/**
 * Verify page URL
 * @param page - Playwright page instance
 * @param expectedPath - Expected path (string or regex)
 */
export async function expectUrl(
  page: Page,
  expectedPath: string | RegExp
): Promise<void> {
  const url = new URL(page.url());
  
  if (typeof expectedPath === "string") {
    expect(url.pathname).toBe(expectedPath);
  } else {
    expect(url.pathname).toMatch(expectedPath);
  }
}

/**
 * Click a navigation link
 * @param page - Playwright page instance
 * @param linkText - Text of the link to click
 */
export async function clickNavLink(
  page: Page,
  linkText: string | RegExp
): Promise<void> {
  const link = page.getByRole("link", { name: linkText });
  await link.click();
  
  // Wait for navigation
  await page.waitForLoadState("networkidle");
}

