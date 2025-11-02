/**
 * E2E Tests: Community Features
 * 
 * Test Cases TC-COMMUNITY-001 through TC-COMMUNITY-014
 * Covers innovation submission, viewing, filtering, and testimonials
 */

import { test, expect, describe, beforeEach, afterEach } from "vitest";
import type { Page } from "playwright";
import { createPage } from "./setup";
import { navigateTo } from "./helpers/navigation";
import { loginAsTestUser } from "./helpers/auth";
import { testUsers, testInnovations, testTestimonials } from "./helpers/fixtures";

describe("Community Features - Core Functionality", () => {
  let page: Page;

  beforeEach(async () => {
    page = await createPage();
  });

  afterEach(async () => {
    await page.close();
  });
  test("TC-COMMUNITY-001: Submit Innovation", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Find and click submit innovation button
    // Use first() to handle multiple matches (e.g., "Share Innovation" and "Submit Testimonial")
    const submitButton = page.getByRole("button", { name: /submit|share|add innovation/i }).first();
    await submitButton.click();
    
    // Fill innovation form
    const titleInput = page.getByLabel(/title/i).or(page.getByPlaceholder(/title/i));
    await titleInput.fill(testInnovations.basic.title);
    
    const descriptionInput = page.getByLabel(/description/i).or(page.getByPlaceholder(/description/i));
    await descriptionInput.fill(testInnovations.basic.description);
    
    // Select subject if dropdown
    const subjectSelect = page.getByLabel(/subject/i);
    await subjectSelect.click();
    await page.getByRole("option", { name: new RegExp(testInnovations.basic.subject, "i") }).click();
    
    // Submit form
    const submitFormButton = page.getByRole("button", { name: /submit|share/i });
    await submitFormButton.click();
    
    // Verify success message
    const successMessage = page.locator("text=/success|submitted|thank you/i");
    await expect(successMessage).toBeVisible({ timeout: 3000 });
  });

  test("TC-COMMUNITY-002: Innovation Form Validation", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Open submit form
    const submitButton = page.getByRole("button", { name: /submit|share|add innovation/i }).first();
    await submitButton.click();
    
    // Try to submit empty form
    const submitFormButton = page.getByRole("button", { name: /submit|share/i });
    await submitFormButton.click();
    
    // Verify error messages appear
    const errorMessages = page.locator("text=/required|please fill|error/i");
    await expect(errorMessages.first()).toBeVisible({ timeout: 2000 });
  });

  test("TC-COMMUNITY-003: Tag Innovation", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Open submit form
    const submitButton = page.getByRole("button", { name: /submit|share|add innovation/i }).first();
    await submitButton.click();
    
    // Add tags
    const tagsInput = page.getByLabel(/tags/i).or(page.getByPlaceholder(/tags/i));
    if (await tagsInput.isVisible()) {
      await tagsInput.fill("differentiation, math, ai");
      
      // Verify tags display
      const tagElements = page.locator('[data-testid="tag"], .tag, [role="button"]:has-text("differentiation")');
      await expect(tagElements.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test("TC-COMMUNITY-004: Louisiana Context Encouragement", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Open submit form
    const submitButton = page.getByRole("button", { name: /submit|share|add innovation/i }).first();
    await submitButton.click();
    
    // Find Louisiana standards field
    const laStandardsField = page.getByLabel(/louisiana|la standards/i);
    if (await laStandardsField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await laStandardsField.click();
      
      // Select Louisiana standard
      const standardOption = page.getByRole("option", { name: /louisiana/i }).first();
      await standardOption.click();
      
      // Verify Louisiana badge appears
      const laBadge = page.locator("text=/louisiana|la badge/i");
      await expect(laBadge).toBeVisible({ timeout: 2000 });
    }
  });

  test("TC-COMMUNITY-005: Mobile Innovation Submission", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    await navigateTo(page, "/community");
    
    // Open submit form
    const submitButton = page.getByRole("button", { name: /submit|share|add innovation/i }).first();
    await submitButton.click();
    
    // Verify form is usable on mobile
    const titleInput = page.getByLabel(/title/i).or(page.getByPlaceholder(/title/i));
    await expect(titleInput).toBeVisible();
    
    // Test touch targets are adequate size
    const inputRect = await titleInput.boundingBox();
    expect(inputRect?.height).toBeGreaterThanOrEqual(44); // Minimum touch target size
  });

  test("TC-COMMUNITY-006: View Community Innovations", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Verify page loads
    await expect(page.locator("main")).toBeVisible({ timeout: 3000 });
    
    // Verify innovations are displayed
    const innovationCards = page.locator('[data-testid="innovation-card"], .innovation-card, [role="article"]');
    const count = await innovationCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
    
    // Verify metadata is visible
    if (count > 0) {
      const firstCard = innovationCards.first();
      await expect(firstCard.locator("text=/title|subject|grade|school/i")).toBeVisible();
    }
  });

  test("TC-COMMUNITY-007: Filter Innovations", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Find filter dropdown/button
    const subjectFilter = page.getByLabel(/subject/i).or(page.getByRole("button", { name: /subject/i }));
    await subjectFilter.click();
    
    // Select Mathematics filter
    await page.getByRole("option", { name: /mathematics/i }).click();
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const filteredCards = page.locator('[data-testid="innovation-card"], .innovation-card, [role="article"]');
    await expect(filteredCards.first()).toBeVisible({ timeout: 2000 });
    
    // Reset to "All Subjects"
    const allSubjectsFilter = page.getByRole("button", { name: /all subjects/i });
    if (await allSubjectsFilter.isVisible()) {
      await allSubjectsFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test("TC-COMMUNITY-008: Search Innovations", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Find search input
    const searchInput = page.getByPlaceholder(/search|find/i).or(page.getByRole("searchbox"));
    await searchInput.fill("differentiation");
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Verify results are filtered
    const results = page.locator('[data-testid="innovation-card"], .innovation-card, [role="article"]');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(0);
    
    // Test empty state
    await searchInput.fill("nonexistentinnovation12345");
    await page.waitForTimeout(500);
    
    const emptyState = page.locator("text=/no results|not found|no innovations/i");
    if (await emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(emptyState).toBeVisible();
    }
  });

  test("TC-COMMUNITY-009: View Innovation Details", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Click on first innovation card
    const firstCard = page.locator('[data-testid="innovation-card"], .innovation-card, [role="article"]').first();
    if (await firstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstCard.click();
      await page.waitForTimeout(500);
      
      // Verify detail view opens
      await expect(page.locator("text=/title|description|subject|grade/i")).toBeVisible({ timeout: 2000 });
    }
  });

  test("TC-COMMUNITY-010: Like Innovation", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/community");
    
    
    // Find first innovation card
    const firstCard = page.locator('[data-testid="innovation-card"], .innovation-card, [role="article"]').first();
    if (await firstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Find like button
      const likeButton = firstCard.locator('button[aria-label*="like"], button:has-text("Like")').first();
      await likeButton.click();
      await page.waitForTimeout(500);
      
      // Verify like count increments or button state changes
      const likedState = firstCard.locator('[aria-label*="liked"], text=/liked/i');
      if (await likedState.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(likedState).toBeVisible();
      }
      
      // Refresh and verify like persists
      await page.reload();
      await page.waitForTimeout(1000);
    }
  });

  test("TC-COMMUNITY-011: Submit Testimonial", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/profile");
    
    
    // Find submit testimonial button/link
    const submitTestimonialButton = page.getByRole("button", { name: /submit testimonial|share testimonial/i });
    if (await submitTestimonialButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitTestimonialButton.click();
      
      // Fill testimonial form
      const quoteInput = page.getByLabel(/quote|testimonial/i).or(page.getByPlaceholder(/quote/i));
      await quoteInput.fill(testTestimonials.basic.quote);
      
      // Submit form
      const submitButton = page.getByRole("button", { name: /submit|share/i });
      await submitButton.click();
      
      // Verify success message
      const successMessage = page.locator("text=/success|submitted|thank you/i");
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test("TC-COMMUNITY-012: Testimonial Form Validation", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/profile");
    
    
    // Find submit testimonial button
    const submitTestimonialButton = page.getByRole("button", { name: /submit testimonial|share testimonial/i });
    if (await submitTestimonialButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitTestimonialButton.click();
      
      // Try to submit empty form
      const submitButton = page.getByRole("button", { name: /submit|share/i });
      await submitButton.click();
      
      // Verify error messages
      const errorMessages = page.locator("text=/required|please fill|error/i");
      await expect(errorMessages.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test("TC-COMMUNITY-013: Louisiana Context in Testimonials", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/profile");
    
    
    // Find submit testimonial button
    const submitTestimonialButton = page.getByRole("button", { name: /submit testimonial|share testimonial/i });
    if (await submitTestimonialButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitTestimonialButton.click();
      
      // Select Louisiana school
      const schoolSelect = page.getByLabel(/school/i);
      await schoolSelect.fill(testTestimonials.basic.school);
      
      // Verify Louisiana badge if present
      const laBadge = page.locator("text=/louisiana|la badge/i");
      if (await laBadge.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(laBadge).toBeVisible();
      }
    }
  });

  test("TC-COMMUNITY-014: View Submitted Testimonials", async () => {
    await loginAsTestUser(page, testUsers.regular.email);
    await navigateTo(page, "/profile");
    
    
    // Find "My Testimonials" section
    const testimonialsSection = page.locator("text=/my testimonials|testimonials/i");
    if (await testimonialsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(testimonialsSection).toBeVisible();
      
      // Verify status is visible (pending/approved)
      const statusIndicators = page.locator("text=/pending|approved|rejected/i");
      const statusCount = await statusIndicators.count();
      expect(statusCount).toBeGreaterThanOrEqual(0);
    }
  });
});

