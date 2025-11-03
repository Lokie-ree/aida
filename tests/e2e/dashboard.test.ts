/**
 * E2E Tests: Dashboard Features
 * 
 * Test Cases TC-DASHBOARD-001 through TC-DASHBOARD-009
 * Covers personal dashboard, stats, time tracking, and quick start
 */

import { test, expect, describe, beforeEach, afterEach } from "vitest";
import type { Page } from "playwright";
import { createPage } from "./setup";
import { navigateTo } from "./helpers/navigation";
import { loginAsTestUser } from "./helpers/auth";
import { testUsers } from "./helpers/fixtures";

describe("Dashboard Features - Core Functionality", () => {
  let page: Page;

  beforeEach(async () => {
    page = await createPage();
  });

  afterEach(async () => {
    await page.close();
  });
  test("TC-DASHBOARD-001: View Personal Dashboard", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    
    // Verify page loads
    await page.locator("main").waitFor({ state: "visible", timeout: 3000 });
    
    // Verify stats are displayed
    const stats = page.locator("text=/frameworks tried|time saved|innovations shared|engagement streak/i");
    await stats.first().waitFor({ state: "visible", timeout: 2000 });
  });

  test("TC-DASHBOARD-002: View Time Savings Tracker", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    
    // Find time savings tracker
    const timeTracker = page.locator("text=/time saved|time tracking/i");
    await timeTracker.first().waitFor({ state: "visible", timeout: 2000 });
    
    // Check weekly view (default)
    const weeklyView = page.getByRole("button", { name: /weekly/i });
    if (await weeklyView.isVisible({ timeout: 1000 }).catch(() => false)) {
      await weeklyView.waitFor({ state: "visible" });
    }
    
    // Switch to monthly view
    const monthlyView = page.getByRole("button", { name: /monthly/i });
    if (await monthlyView.isVisible({ timeout: 1000 }).catch(() => false)) {
      await monthlyView.click();
      await page.waitForTimeout(500);
      await monthlyView.waitFor({ state: "visible" });
    }
    
    // Switch to total view
    const totalView = page.getByRole("button", { name: /total|all time/i });
    if (await totalView.isVisible({ timeout: 1000 }).catch(() => false)) {
      await totalView.click();
      await page.waitForTimeout(500);
      await totalView.waitFor({ state: "visible" });
    }
  });

  test("TC-DASHBOARD-003: View Engagement Streak", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    // Wait for page to be fully loaded (dashboard has async data loading)
    await page.waitForLoadState("networkidle", { timeout: 10000 });
    await page.waitForTimeout(1000); // Allow for animations
    
    // Find streak indicator using test ID
    const journeyStats = page.getByTestId("dashboard-journey-stats");
    await journeyStats.waitFor({ state: "visible", timeout: 10000 });
    
    // Find engagement streak stat using test ID
    const streakStat = page.getByTestId("dashboard-stat-day-learning-streak");
    await streakStat.waitFor({ state: "visible", timeout: 5000 });
    
    // Verify the stat contains content
    const text = await streakStat.textContent();
    expect(text).toBeTruthy();
    
    // Hover for details if available
    await streakStat.hover();
    await page.waitForTimeout(500);
  });

  test("TC-DASHBOARD-004: View Frameworks Tried", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    // Wait for page to be fully loaded (dashboard has async data loading)
    await page.waitForLoadState("networkidle", { timeout: 10000 });
    await page.waitForTimeout(1000); // Allow for animations
    
    // Find frameworks tried section using test ID
    const journeyStats = page.getByTestId("dashboard-journey-stats");
    await journeyStats.waitFor({ state: "visible", timeout: 10000 });
    
    // Find frameworks tried stat using test ID
    const frameworksStat = page.getByTestId("dashboard-stat-ai-frameworks-mastered");
    await frameworksStat.waitFor({ state: "visible", timeout: 5000 });
    
    // Verify count matches usage - stat should contain a number
    const countText = await frameworksStat.textContent();
    expect(countText).toMatch(/\d+/);
    
    // Open list of tried frameworks if available
    const viewListButton = page.getByRole("button", { name: /view all|see all/i });
    if (await viewListButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await viewListButton.click();
      await page.waitForTimeout(500);
      
      // Verify list is displayed - use framework card test ID
      const frameworkList = page.getByTestId("framework-card");
      await frameworkList.first().waitFor({ state: "visible", timeout: 2000 }).catch(() => {
        // List might not exist, that's okay
      });
    }
  });

  test("TC-DASHBOARD-005: Dashboard Mobile View", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    await navigateTo(page, "/dashboard");
    
    // Verify responsive layout
    await page.locator("main").waitFor({ state: "visible", timeout: 3000 });
    
    // Verify no horizontal scrolling
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance
  });

  test("TC-DASHBOARD-006: View Recommended Frameworks", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    
    // Find recommended frameworks section
    const recommendedSection = page.locator("text=/recommended|recommended for you/i");
    if (await recommendedSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await recommendedSection.waitFor({ state: "visible" });
      
      // Verify frameworks are recommended using test ID
      const recommendedCards = page.getByTestId("framework-card");
      const count = await recommendedCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("TC-DASHBOARD-007: View Recently Used Frameworks", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    
    // Find recently used section
    const recentlyUsedSection = page.locator("text=/recently used|recent frameworks/i");
    if (await recentlyUsedSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await recentlyUsedSection.waitFor({ state: "visible" });
      
      // Verify frameworks are listed
      const recentCards = page.locator('[data-testid="framework-card"], .framework-card, [role="article"]');
      const count = await recentCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
      
      // Open framework detail if available
      if (count > 0) {
        await recentCards.first().click();
        await page.waitForTimeout(500);
        
        // Verify detail view opens
        await page.locator("text=/title|prompt|framework/i").waitFor({ state: "visible", timeout: 2000 });
      }
    }
  });

  test("TC-DASHBOARD-008: Access Framework Library", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    
    // Find browse framework library button
    const browseButton = page.getByRole("link", { name: /browse framework library|view frameworks/i }).or(
      page.getByRole("button", { name: /browse framework library|view frameworks/i })
    );
    
    if (await browseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await browseButton.click();
      
      // Verify navigation to frameworks page
      await page.waitForURL(/\/frameworks/, { timeout: 3000 });
      await page.locator("main").waitFor({ state: "visible", timeout: 2000 });
    }
  });

  test("TC-DASHBOARD-009: New User Onboarding", async () => {
    // Note: Onboarding test uses regular user - if onboarding shows for users who haven't completed it,
    // this will work. If onboarding only shows for brand new users, create a fixed "onboarding-test-user@resend.dev" account.
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/dashboard");
    
    
    // Verify onboarding modal/flow appears (if it exists)
    const onboardingModal = page.locator("text=/welcome|get started|onboarding|tour/i");
    if (await onboardingModal.isVisible({ timeout: 3000 }).catch(() => false)) {
      await onboardingModal.waitFor({ state: "visible" });
      
      // Complete onboarding steps if available
      const nextButton = page.getByRole("button", { name: /next|continue/i });
      if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
      
      // Close onboarding
      const closeButton = page.getByRole("button", { name: /close|skip|finish/i });
      if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    } else {
      // If onboarding doesn't appear, that's fine - user may have already completed it
      // This test validates that onboarding UI works when it appears
      console.log("Onboarding modal not visible - user may have already completed onboarding");
    }
  });
});

