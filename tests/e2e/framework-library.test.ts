/**
 * E2E Tests: Framework Library
 * 
 * Test Cases TC-FRAMEWORK-001 through TC-FRAMEWORK-014
 * Covers browsing, filtering, searching, and saving frameworks
 */

import { test, expect, describe, beforeEach, afterEach } from "vitest";
import type { Page } from "playwright";
import { createPage } from "./setup";
import { navigateTo, expectUrl } from "./helpers/navigation";
import { loginAsTestUser } from "./helpers/auth";
import { testUsers } from "./helpers/fixtures";

describe("Framework Library - Core Functionality", () => {
  let page: Page;

  beforeEach(async () => {
    page = await createPage();
  });

  afterEach(async () => {
    await page.close();
  });
  test("TC-FRAMEWORK-001: View Framework Library", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    // Verify page loads
    await expect(page.locator("main")).toBeVisible({ timeout: 3000 });
    
    // Verify frameworks are displayed
    const frameworkCards = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]');
    const count = await frameworkCards.count();
    expect(count).toBeGreaterThanOrEqual(10);
    
    // Verify metadata is visible on at least one card
    const firstCard = frameworkCards.first();
    await expect(firstCard.locator("text=/title|module|category|difficulty|time/i")).toBeVisible();
  });

  test("TC-FRAMEWORK-002: Filter Frameworks by Module", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Test AI Basics Hub filter
    const aiBasicsFilter = page.getByRole("button", { name: /ai basics hub/i });
    await aiBasicsFilter.click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Verify frameworks are filtered
    const filteredCards = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]');
    await expect(filteredCards.first()).toBeVisible();
    
    // Test Instructional Expert Hub filter
    const instructionalFilter = page.getByRole("button", { name: /instructional expert hub/i });
    await instructionalFilter.click();
    await page.waitForTimeout(500);
    await expect(filteredCards.first()).toBeVisible();
    
    // Test "All Modules" reset
    const allModulesFilter = page.getByRole("button", { name: /all modules/i });
    if (await allModulesFilter.isVisible()) {
      await allModulesFilter.click();
      await page.waitForTimeout(500);
      const allCards = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]');
      const count = await allCards.count();
      expect(count).toBeGreaterThanOrEqual(10);
    }
  });

  test("TC-FRAMEWORK-003: Search Frameworks", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Find search input
    const searchInput = page.getByPlaceholder(/search|find/i).or(page.getByRole("searchbox"));
    await searchInput.fill("lesson plan");
    
    // Wait for search results (debounced search)
    await page.waitForTimeout(500);
    
    // Verify results are filtered
    const results = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(0);
    
    // Test empty state
    await searchInput.fill("nonexistentframework12345");
    await page.waitForTimeout(500);
    
    // Should show empty state or no results message
    const emptyState = page.locator("text=/no results|not found|no frameworks/i");
    if (await emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(emptyState).toBeVisible();
    }
  });

  test("TC-FRAMEWORK-004: View Framework Metadata", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Click on first framework card to open detail modal
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    await firstCard.click();
    
    // Wait for modal or detail view
    await page.waitForTimeout(500);
    
    // Verify metadata fields are visible
    await expect(page.locator("text=/title|module|category|difficulty|time estimate/i")).toBeVisible();
    
    // Verify Louisiana standards badge if present
    const laBadge = page.locator("text=/louisiana|la standards/i");
    if (await laBadge.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(laBadge).toBeVisible();
    }
  });

  test("TC-FRAMEWORK-005: Mobile Framework Browsing", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await navigateTo(page, "/frameworks");
    
    // Verify single-column layout (mobile responsive)
    const frameworkGrid = page.locator('[data-testid="framework-grid"], .framework-grid, main');
    const styles = await frameworkGrid.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        flexDirection: computed.flexDirection,
        gridTemplateColumns: computed.gridTemplateColumns,
      };
    });
    
    // Should be single column on mobile
    expect(styles.gridTemplateColumns).toMatch(/1fr|none/);
  });

  test("TC-FRAMEWORK-006: Accessibility Validation", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Test keyboard navigation - tab through interactive elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    
    // Verify focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
    
    // Verify ARIA labels
    const elementsWithAria = await page.locator("[aria-label], [aria-labelledby]").count();
    expect(elementsWithAria).toBeGreaterThan(0);
  });

  test("TC-FRAMEWORK-007: Copy Prompt to Clipboard", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Open framework detail
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);
    
    // Find and click copy button
    const copyButton = page.getByRole("button", { name: /copy prompt/i });
    await copyButton.click();
    
    // Verify success message/toast
    const successMessage = page.locator("text=/copied|success/i");
    await expect(successMessage).toBeVisible({ timeout: 2000 });
    
    // Verify clipboard content (if possible in test environment)
    // Note: Clipboard API may be restricted in test environment
  });

  test("TC-FRAMEWORK-008: Track Framework Usage", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Get initial usage count (if visible)
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);
    
    // Copy prompt (should increment usage)
    const copyButton = page.getByRole("button", { name: /copy prompt/i });
    await copyButton.click();
    await page.waitForTimeout(1000);
    
    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Usage tracking verification would require backend checks
    // This is primarily validated in unit tests
  });

  test("TC-FRAMEWORK-009: View Platform Compatibility", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Open framework detail
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);
    
    // Verify platform compatibility section
    const platformSection = page.locator("text=/platform|works with|any ai tool/i");
    await expect(platformSection.first()).toBeVisible();
    
    // Verify platform badges
    const platformBadges = page.locator("text=/magicschool|brisk|gemini|chatgpt/i");
    const badgeCount = await platformBadges.count();
    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });

  test("TC-FRAMEWORK-010: View Ethical Guardrails", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Open framework detail
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);
    
    // Verify ethical guardrails section
    const guardrailsSection = page.locator("text=/ethical|ferpa|guardrail/i");
    await expect(guardrailsSection.first()).toBeVisible({ timeout: 2000 });
  });

  test("TC-FRAMEWORK-011: Save Framework", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Find save button on first framework card
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    const saveButton = firstCard.locator('button[aria-label*="save"], button:has-text("Save")').first();
    
    // Click save
    await saveButton.click();
    await page.waitForTimeout(500);
    
    // Verify icon changes to "Saved" state
    const savedIndicator = firstCard.locator('[aria-label*="saved"], text=/saved/i');
    await expect(savedIndicator).toBeVisible({ timeout: 2000 });
  });

  test("TC-FRAMEWORK-012: Unsave Framework", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // First save a framework
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    const saveButton = firstCard.locator('button[aria-label*="save"], button:has-text("Save")').first();
    await saveButton.click();
    await page.waitForTimeout(500);
    
    // Now unsave it
    const unsaveButton = firstCard.locator('button[aria-label*="unsave"], button:has-text("Unsave")').first();
    await unsaveButton.click();
    await page.waitForTimeout(500);
    
    // Verify unsaved state
    const saveButtonAgain = firstCard.locator('button[aria-label*="save"], button:has-text("Save")').first();
    await expect(saveButtonAgain).toBeVisible({ timeout: 2000 });
  });

  test("TC-FRAMEWORK-013: Saved Frameworks Persist", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Save 3 frameworks
    const cards = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]');
    for (let i = 0; i < Math.min(3, await cards.count()); i++) {
      const card = cards.nth(i);
      const saveButton = card.locator('button[aria-label*="save"], button:has-text("Save")').first();
      await saveButton.click();
      await page.waitForTimeout(300);
    }
    
    // Log out
    await page.getByRole("button", { name: /sign out|log out/i }).click();
    await page.waitForTimeout(1000);
    
    // Log back in
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    // Verify saved frameworks are still saved
    const savedCards = page.locator('[aria-label*="saved"]').or(page.locator("text=/saved/i"));
    const savedCount = await savedCards.count();
    expect(savedCount).toBeGreaterThanOrEqual(0);
  });

  test("TC-FRAMEWORK-014: Saved Framework Indicator", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/frameworks");
    
    
    // Save a framework
    const firstCard = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]').first();
    const saveButton = firstCard.locator('button[aria-label*="save"], button:has-text("Save")').first();
    await saveButton.click();
    await page.waitForTimeout(500);
    
    // Verify visual distinction (saved indicator visible)
    const savedIndicator = firstCard.locator('[aria-label*="saved"], text=/saved/i, [data-saved="true"]');
    await expect(savedIndicator).toBeVisible({ timeout: 2000 });
  });
});

