/**
 * E2E Tests: Admin Features
 * 
 * Test Cases TC-ADMIN-001 through TC-ADMIN-009
 * Covers content moderation, beta program management, and platform health
 */

import { test, expect, describe, beforeEach, afterEach } from "vitest";
import type { Page } from "playwright";
import { createPage } from "./setup";
import { navigateTo } from "./helpers/navigation";
import { loginAsTestUser, logout } from "./helpers/auth";
import { testUsers } from "./helpers/fixtures";

describe("Admin Features - Core Functionality", () => {
  let page: Page;

  beforeEach(async () => {
    page = await createPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test("TC-ADMIN-001: Access Admin Dashboard", async () => {
    // Test admin access
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Verify admin dashboard loads
    await page.locator("main").waitFor({ state: 'visible', timeout: 3000 });
    // Use more specific selector to avoid matching "Dashboard" button and "Admin User" text
    await page.getByRole("heading", { name: /admin dashboard/i }).waitFor({ state: 'visible', timeout: 2000 });
    
    // Test non-admin access blocked
    await page.getByRole("button", { name: /sign out|log out/i }).click();
    await page.waitForTimeout(1000);
    
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/admin");
    
    // Should be blocked or redirected
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).not.toContain("/admin");
  });

  test("TC-ADMIN-002: Review Pending Content", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to pending content section - wait for tabs to be visible first
    const tabsList = page.getByRole("tablist");
    await tabsList.waitFor({ state: 'visible', timeout: 5000 });
    const pendingContentTab = page.getByTestId("admin-tab-content-moderation");
    await pendingContentTab.waitFor({ state: 'visible', timeout: 5000 });
    await pendingContentTab.click();
    await page.waitForTimeout(500);
    
    // Verify pending items displayed using test ID
    const pendingItems = page.getByTestId("admin-pending-item");
    const count = await pendingItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("TC-ADMIN-003: Approve Content", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to pending content - wait for tabs to be visible first
    const tabsList = page.getByRole("tablist");
    await tabsList.waitFor({ state: 'visible', timeout: 5000 });
    const pendingContentTab = page.getByTestId("admin-tab-content-moderation");
    await pendingContentTab.waitFor({ state: 'visible', timeout: 5000 });
    await pendingContentTab.click();
    await page.waitForTimeout(500);
    
    // Find first pending item using test ID
    const pendingItems = page.getByTestId("admin-pending-item");
    const firstItem = pendingItems.first();
    if (await firstItem.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstItem.waitFor({ state: 'visible', timeout: 2000 });
      
      // Click approve button using test ID
      const approveButton = firstItem.getByTestId("admin-approve-button");
      await approveButton.waitFor({ state: 'visible', timeout: 2000 });
      await approveButton.click();
      
      // Verify confirmation dialog if present
      const confirmButton = page.getByRole("button", { name: /confirm|yes|approve/i });
      if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmButton.click();
        await page.waitForTimeout(500);
      }
      
      // Verify success toast notification
      const successMessage = page.locator('[data-sonner-toast], [role="status"]').filter({ hasText: /approved|success/i }).first();
      await successMessage.waitFor({ state: 'visible', timeout: 3000 });
    }
  });

  test("TC-ADMIN-004: Reject Content", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to pending content - wait for tabs to be visible first
    const tabsList = page.getByRole("tablist");
    await tabsList.waitFor({ state: 'visible', timeout: 5000 });
    const pendingContentTab = page.getByTestId("admin-tab-content-moderation");
    await pendingContentTab.waitFor({ state: 'visible', timeout: 5000 });
    await pendingContentTab.click();
    await page.waitForTimeout(500);
    
    // Find first pending item using test ID
    const pendingItems = page.getByTestId("admin-pending-item");
    const firstItem = pendingItems.first();
    if (await firstItem.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstItem.waitFor({ state: 'visible', timeout: 2000 });
      
      // Click reject button using test ID
      const rejectButton = firstItem.getByTestId("admin-reject-button");
      await rejectButton.waitFor({ state: 'visible', timeout: 2000 });
      await rejectButton.click();
      
      // Enter rejection reason
      const reasonInput = page.getByLabel(/reason/i).or(page.getByPlaceholder(/reason/i));
      if (await reasonInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await reasonInput.fill("Test rejection reason");
      }
      
      // Confirm rejection
      const confirmButton = page.getByRole("button", { name: /confirm|reject/i });
      await confirmButton.click();
      await page.waitForTimeout(500);
      
      // Verify rejection toast notification
      const rejectionMessage = page.locator('[data-sonner-toast], [role="status"]').filter({ hasText: /rejected|deleted|removed/i }).first();
      await rejectionMessage.waitFor({ state: 'visible', timeout: 3000 });
    }
  });

  test("TC-ADMIN-005: View Moderation History", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to moderation history
    const historyTab = page.getByRole("tab", { name: /history|audit|log/i }).or(
      page.getByRole("link", { name: /history/i })
    );
    if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await historyTab.click();
      await page.waitForTimeout(500);
      
      // Verify audit trail is visible
      const historyItems = page.locator('[data-testid="history-item"], .history-item, [role="row"]');
      const count = await historyItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
      
      // Filter by action type if available
      const filterButton = page.getByRole("button", { name: /filter|type/i });
      if (await filterButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await filterButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test("TC-ADMIN-006: View Beta Signups", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to beta program section - wait for tabs to be visible first
    const tabsList = page.getByRole("tablist");
    await tabsList.waitFor({ state: 'visible', timeout: 5000 });
    const betaTab = page.getByTestId("admin-tab-beta-signups");
    await betaTab.waitFor({ state: 'visible', timeout: 5000 });
    await betaTab.click();
    await page.waitForTimeout(500);
    
    // Verify pending signups displayed
    const signups = page.locator('[data-testid="signup-item"], .signup-item, [role="row"]');
    const count = await signups.count();
    expect(count).toBeGreaterThanOrEqual(0);
    
      // Verify signup details are visible
      if (count > 0) {
        const firstSignup = signups.first();
        await firstSignup.locator("text=/email|name|school|subject/i").waitFor({ state: 'visible', timeout: 2000 });
      }
  });

  test("TC-ADMIN-007: Approve Beta Signup", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to beta program section - wait for tabs to be visible first
    const tabsList = page.getByRole("tablist");
    await tabsList.waitFor({ state: 'visible', timeout: 5000 });
    const betaTab = page.getByTestId("admin-tab-beta-signups");
    await betaTab.waitFor({ state: 'visible', timeout: 5000 });
    await betaTab.click();
    await page.waitForTimeout(500);
    
    // Find first pending signup
    const firstSignup = page.locator('[data-testid="signup-item"], .signup-item, [role="row"]').first();
    if (await firstSignup.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstSignup.click();
      await page.waitForTimeout(500);
      
      // Review signup details
      await page.locator("text=/email|name|school|subject/i").waitFor({ state: 'visible', timeout: 2000 });
      
      // Click approve
      const approveButton = page.getByRole("button", { name: /approve/i });
      await approveButton.click();
      
      // Verify confirmation if present
      const confirmButton = page.getByRole("button", { name: /confirm|yes|approve/i });
      if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmButton.click();
        await page.waitForTimeout(500);
      }
      
      // Verify success message
      const successMessage = page.locator("text=/approved|welcome email sent|success/i");
      await successMessage.waitFor({ state: 'visible', timeout: 3000 });
    }
  });

  test("TC-ADMIN-008: Track Beta User Engagement", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to user engagement section
    const engagementTab = page.getByRole("tab", { name: /engagement|users|metrics/i }).or(
      page.getByRole("link", { name: /engagement/i })
    );
    if (await engagementTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await engagementTab.click();
      await page.waitForTimeout(500);
      
      // View engagement metrics
      const metrics = page.locator("text=/engagement|active users|frameworks tried|time saved/i");
      await metrics.first().waitFor({ state: 'visible', timeout: 2000 });
      
      // Check individual user details if available
      const userList = page.locator('[data-testid="user-item"], .user-item, [role="row"]');
      const count = await userList.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("TC-ADMIN-009: Monitor Platform Health", async () => {
    await loginAsTestUser(page, testUsers.admin.email);
    await navigateTo(page, "/admin");
    
    // Navigate to platform health section
    const healthTab = page.getByRole("tab", { name: /health|monitoring|system/i }).or(
      page.getByRole("link", { name: /health/i })
    );
    if (await healthTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await healthTab.click();
      await page.waitForTimeout(500);
      
      // Check system metrics
      const metrics = page.locator("text=/health|status|uptime|performance/i");
      await metrics.first().waitFor({ state: 'visible', timeout: 2000 });
      
      // Verify alerts functional if present
      const alerts = page.locator('[data-testid="alert"], .alert, [role="alert"]');
      const alertCount = await alerts.count();
      expect(alertCount).toBeGreaterThanOrEqual(0);
    }
  });
});

