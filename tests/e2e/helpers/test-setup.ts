/**
 * Test Setup Helpers
 * 
 * Utilities for setting up test environment, creating test users,
 * and verifying app accessibility before running tests.
 */

import type { Page } from "playwright";

const BASE_URL = process.env.VITE_TEST_BASE_URL || "http://localhost:5173";

/**
 * Verify the app is accessible and running
 */
export async function verifyAppAccessible(page: Page): Promise<boolean> {
  try {
    const response = await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 10000 });
    return response?.status() === 200 || response?.status() === 304;
  } catch (error) {
    console.error(`App not accessible at ${BASE_URL}:`, error);
    return false;
  }
}

/**
 * Check if the page loaded successfully
 */
export async function verifyPageLoaded(page: Page): Promise<boolean> {
  try {
    // Wait for React to hydrate
    await page.waitForFunction(() => {
      return document.readyState === "complete" && 
             (window as any).React !== undefined;
    }, { timeout: 10000 });
    return true;
  } catch {
    return false;
  }
}

