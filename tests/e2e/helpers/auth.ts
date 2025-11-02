/**
 * Authentication Helpers for E2E Tests
 * 
 * Provides utilities for logging in test users, creating sessions,
 * and managing authentication state in browser tests.
 */

import type { Page } from "playwright";

const BASE_URL = process.env.VITE_TEST_BASE_URL || "http://localhost:5173";

// Default test password if not provided
// In a real scenario, test users should have known passwords or be created via test setup
const DEFAULT_TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "test-password-123";

/**
 * Mask email address for logging (PII protection)
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const maskedLocal = local.length > 2 
    ? `${local.slice(0, 2)}${"*".repeat(Math.min(local.length - 2, 10))}`
    : "**";
  return `${maskedLocal}@${domain}`;
}

/**
 * Login as a test user
 * @param page - Playwright page instance
 * @param email - User email
 * @param password - User password (optional for test users)
 */
export async function loginAsTestUser(
  page: Page,
  email: string,
  password?: string
): Promise<void> {
  // Use default password if not provided
  const userPassword = password || DEFAULT_TEST_PASSWORD;
  
  // Navigate to login/auth page
  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 15000 });
  
  // Wait for page to be ready and any redirects to complete
  await page.waitForLoadState("networkidle");
  
  // Wait a bit for React to hydrate and any client-side redirects to occur
  await page.waitForTimeout(500);
  
  // Check if already authenticated by looking for authenticated indicators
  // First check: if we're on a protected route, we're authenticated
  // (Authenticated users get redirected from "/" to "/dashboard" or "/admin")
  const currentUrl = page.url();
  if (currentUrl.match(/\/dashboard|\/frameworks|\/community|\/admin|\/profile/)) {
    console.log(`User ${maskEmail(email)} appears to be already authenticated (on protected route: ${currentUrl})`);
    return;
  }
  
  // Also check if we're being redirected (wait for redirect to complete)
  try {
    await page.waitForURL(/\/dashboard|\/frameworks|\/community|\/admin|\/profile/, { timeout: 2000 });
    const redirectedUrl = page.url();
    console.log(`User ${maskEmail(email)} appears to be already authenticated (redirected to: ${redirectedUrl})`);
    return;
  } catch {
    // No redirect, continue checking
  }
  
  // Second check: look for authenticated UI elements
  try {
    // Check for navigation elements (Dashboard, Frameworks, Community buttons)
    // These are buttons inside nav elements, not anchor tags
    const navButton = page.locator('nav button:has-text("Dashboard"), nav button:has-text("Frameworks"), nav button:has-text("Community")').first();
    const hasNav = await navButton.waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
    
    if (hasNav) {
      console.log(`User ${maskEmail(email)} appears to be already authenticated (navigation visible)`);
      return;
    }
  } catch {
    // Continue checking
  }
  
  try {
    // Check for Sign Out button
    const signOutButton = page.locator('button:has-text("Sign out"), button:has-text("Sign Out")').first();
    const hasSignOut = await signOutButton.waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
    
    if (hasSignOut) {
      console.log(`User ${maskEmail(email)} appears to be already authenticated (Sign Out button visible)`);
      return;
    }
  } catch {
    // Continue checking
  }
  
  try {
    // Check for user menu/profile indicators
    const userMenu = page.locator('[data-testid="user-menu"], [aria-label*="user"], button:has-text("Profile")').first();
    await userMenu.waitFor({ timeout: 2000 });
    console.log(`User ${maskEmail(email)} appears to be already authenticated`);
    return;
  } catch {
    // Not authenticated, proceed with login
    console.log(`Attempting to login as ${maskEmail(email)}`);
  }
  
  // Check viewport size to determine if we're on mobile
  const viewport = page.viewportSize();
  const isMobile = viewport && viewport.width < 768; // md breakpoint is typically 768px
  
  // Wait for auth button to be visible and clickable
  try {
    if (isMobile) {
      // On mobile, need to open hamburger menu first
      console.log("Mobile viewport detected, opening hamburger menu");
      
      // Find hamburger menu button - look for button with Menu/X icon
      // The button contains an SVG and has sr-only text "Toggle menu"
      let menuButton;
      try {
        // Try finding by the sr-only text
        menuButton = page.locator('button:has-text("Toggle menu")').first();
        await menuButton.waitFor({ state: "visible", timeout: 3000 });
      } catch {
        // Fallback: find any button with SVG in the header that's visible on mobile
        menuButton = page.locator('header button:has(svg)').filter({ hasNot: page.locator('text=Sign In') }).first();
        await menuButton.waitFor({ state: "visible", timeout: 3000 });
      }
      
      await menuButton.click();
      
      // Wait for mobile menu to appear
      await page.waitForTimeout(500);
      
      // Now find Sign In button in mobile menu
      const authButton = page.getByRole("button", { name: /sign in/i }).first();
      await authButton.waitFor({ state: "visible", timeout: 5000 });
      await authButton.click();
    } else {
      // Desktop: look for Sign In button directly
      // First ensure the header is visible and React has rendered
      await page.waitForSelector('header', { state: "visible", timeout: 10000 });
      
      // Wait a bit for React to finish rendering
      await page.waitForTimeout(300);
      
      // Try multiple strategies to find the Sign In button
      let authButton;
      try {
        // Strategy 1: Use getByRole with accessible name
        authButton = page.getByRole("button", { name: /sign in/i }).first();
        await authButton.waitFor({ state: "visible", timeout: 5000 });
      } catch {
        // Strategy 2: Find by text content
        authButton = page.locator('button:has-text("Sign In")').first();
        await authButton.waitFor({ state: "visible", timeout: 5000 });
      }
      
      await authButton.click();
    }
    
    // Wait for auth modal/form to appear
    await page.waitForTimeout(500);
  } catch (error) {
    console.error("Could not find or click auth button:", error);
    
    // Take screenshot for debugging
    await page.screenshot({ path: `test-auth-button-error-${Date.now()}.png` }).catch(() => {});
    
    // Try alternative strategies
    try {
      // Strategy 1: Try finding by text content (more flexible)
      const authButtonByText = page.locator('button:has-text("Sign In"), button:has-text("Log In")').first();
      await authButtonByText.waitFor({ state: "visible", timeout: 3000 });
      await authButtonByText.click();
    } catch {
      // Strategy 2: Try finding hamburger menu and opening it (if not already mobile)
      if (!isMobile) {
        try {
          // Check if hamburger menu is visible (might be visible on certain screen sizes)
          const menuButton = page.locator('button:has-text("Toggle menu"), header button:has(svg)').first();
          await menuButton.waitFor({ state: "visible", timeout: 2000 });
          await menuButton.click();
          await page.waitForTimeout(500);
          const authButton = page.getByRole("button", { name: /sign in/i }).first();
          await authButton.click();
        } catch {
          // Strategy 3: Look for auth modal or form directly (might already be open)
          try {
            const authModal = page.locator('[role="dialog"], .auth-modal, form').first();
            await authModal.waitFor({ state: "visible", timeout: 5000 });
          } catch {
            // Final fallback: throw informative error
            const currentUrl = page.url();
            const viewportInfo = viewport ? `Viewport: ${viewport.width}x${viewport.height}` : 'Viewport: unknown';
            throw new Error(
              `Could not find Sign In button. ` +
              `URL: ${currentUrl}, ${viewportInfo}. ` +
              `This might indicate: ` +
              `1. The page hasn't fully loaded, ` +
              `2. The button is hidden due to CSS, ` +
              `3. The viewport size is causing the button to be hidden. ` +
              `Screenshot saved for debugging.`
            );
          }
        }
      } else {
        // On mobile, if menu didn't work, try looking for modal directly
        try {
          const authModal = page.locator('[role="dialog"], .auth-modal, form').first();
          await authModal.waitFor({ state: "visible", timeout: 5000 });
        } catch {
          // Final fallback: throw informative error
          const currentUrl = page.url();
          throw new Error(
            `Could not find Sign In button on mobile. ` +
            `URL: ${currentUrl}. ` +
            `This might indicate the hamburger menu didn't open or the Sign In button isn't in the menu. ` +
            `Screenshot saved for debugging.`
          );
        }
      }
    }
  }
  
  // Fill in credentials with better error handling
  try {
    const emailInput = page.getByLabel(/email/i).first();
    await emailInput.waitFor({ state: "visible", timeout: 5000 });
    await emailInput.fill(email);
    
    // Always fill password (use default if not provided)
    const passwordInput = page.getByLabel(/password/i).first();
    await passwordInput.waitFor({ state: "visible", timeout: 5000 });
    await passwordInput.fill(userPassword);
  } catch (error) {
    console.error("Could not fill credentials:", error);
    // Take screenshot for debugging
    await page.screenshot({ path: `test-auth-form-error-${Date.now()}.png` }).catch(() => {});
    throw new Error(`Failed to fill login form: ${error}`);
  }
  
  // Submit form
  try {
    const submitButton = page.getByRole("button", { name: /sign in|log in|submit/i }).first();
    await submitButton.waitFor({ state: "visible", timeout: 5000 });
    await submitButton.click();
  } catch (error) {
    // Try alternative submit methods
    await page.keyboard.press("Enter");
  }
  
  // Wait for successful login with more flexible checking
  try {
    // Wait for either URL change OR authenticated state indicators
    await Promise.race([
      page.waitForURL(/\/dashboard|\/frameworks/, { timeout: 10000 }),
      page.waitForSelector('[data-testid="user-menu"], [aria-label*="user"]', { timeout: 10000 }),
    ]);
    console.log("Login successful");
  } catch (error) {
    // Log current state for debugging
    const currentUrl = page.url();
    const pageTitle = await page.title();
    console.error(`Login timeout. Current URL: ${currentUrl}, Title: ${pageTitle}`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: `test-failure-login-${Date.now()}.png` }).catch(() => {});
    
    // Check if we're actually logged in but didn't redirect
    const isAuth = await isAuthenticated(page);
    if (isAuth) {
      console.log("User appears authenticated but no redirect occurred");
      return;
    }
    
    // Provide helpful error message with setup instructions
    throw new Error(
      `Login failed or timed out for ${maskEmail(email)}. ` +
      `This usually means the test user doesn't exist. ` +
      `See tests/e2e/README.md for test user setup instructions. ` +
      `Original error: ${error}`
    );
  }
}

/**
 * Logout current user
 * @param page - Playwright page instance
 */
export async function logout(page: Page): Promise<void> {
  // Find and click logout button
  const logoutButton = page.getByRole("button", { name: /sign out|log out/i });
  await logoutButton.click();
  
  // Wait for redirect to landing page
  await page.waitForURL(/^.*\/$/, { timeout: 3000 });
}

/**
 * Check if user is authenticated
 * @param page - Playwright page instance
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for authenticated indicators (user menu, dashboard link, etc.)
  try {
    await page.waitForSelector('[data-testid="user-menu"], [aria-label*="user"], nav', {
      timeout: 2000,
    });
    return true;
  } catch {
    return false;
  }
}

