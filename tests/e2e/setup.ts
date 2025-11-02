/**
 * E2E Test Setup
 * 
 * Sets up Playwright browser for E2E tests.
 * Each test gets a fresh page instance for isolation.
 */

import { beforeAll, afterAll } from "vitest";
import { chromium, Browser, BrowserContext } from "playwright";
import { verifyAppAccessible } from "./helpers/test-setup";

// Global browser instance
let browser: Browser;
let context: BrowserContext;

const BASE_URL = process.env.VITE_TEST_BASE_URL || "http://localhost:5173";

beforeAll(async () => {
  browser = await chromium.launch({
    headless: process.env.CI === "true", // Headless in CI, headed locally
  });
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  // Verify app is accessible before running tests
  const testPage = await context.newPage();
  const isAccessible = await verifyAppAccessible(testPage);
  await testPage.close();
  
  if (!isAccessible) {
    throw new Error(
      `Application is not accessible at ${BASE_URL}. ` +
      `Please ensure:\n` +
      `1. The dev server is running (pnpm dev)\n` +
      `2. The app is accessible at ${BASE_URL}\n` +
      `3. Convex backend is running (npx convex dev)\n` +
      `4. Test users exist (see tests/e2e/README.md for setup instructions)`
    );
  }
  
  console.log(`✓ Application accessible at ${BASE_URL}`);
  console.log(`ℹ Note: Ensure test users exist before running tests (see tests/e2e/README.md)`);
});

afterAll(async () => {
  await context?.close();
  await browser?.close();
});

/**
 * Creates a new page for a test
 * Export this for use in tests that need a custom page
 */
export async function createPage() {
  return await context.newPage();
}

/**
 * Make context available for test utilities
 */
export function getContext() {
  return context;
}

