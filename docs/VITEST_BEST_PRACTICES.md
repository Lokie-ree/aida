# Vitest/Playwright Best Practices for E2E Tests

This document outlines the best practices implemented in the framework library e2e tests.

## Core Principles

### 1. Use Stable Test Selectors

**✅ DO: Use `data-testid` attributes**
```typescript
const card = page.getByTestId("framework-card").first();
const saveButton = card.getByTestId("framework-card-save");
```

**❌ DON'T: Use icon class names or DOM positions**
```typescript
// ❌ Brittle - breaks if icon library changes
const saveButton = card.locator('svg[class*="Bookmark"]').first();

// ❌ Brittle - breaks if button order changes
const saveButton = buttons.nth(2);
```

### 2. Use Semantic Queries

**✅ DO: Use `getByRole()` with accessible names**
```typescript
const dialog = page.getByTestId("framework-detail-dialog");
const copyButton = dialog.getByRole("button", { name: /copy prompt/i });
```

**✅ DO: Use `getByTestId()` for test-specific elements**
```typescript
const viewButton = card.getByTestId("framework-card-view-details");
```

### 3. Proper Waiting Strategies

**✅ DO: Wait for elements to be visible**
```typescript
await dialog.waitFor({ state: 'visible', timeout: 5000 });
```

**❌ DON'T: Use arbitrary timeouts**
```typescript
// ❌ Unreliable - waits even if element appears faster
await page.waitForTimeout(2000);
```

**✅ DO: Use retries for async state updates**
```typescript
let ariaLabel: string | null = null;
for (let attempt = 0; attempt < 5; attempt++) {
  ariaLabel = await saveButton.getAttribute("aria-label");
  if (ariaLabel?.match(/unsave framework/i)) break;
  await page.waitForTimeout(500);
}
```

### 4. Verify State Changes

**✅ DO: Check attributes/state, not just visibility**
```typescript
const initialAriaLabel = await saveButton.getAttribute("aria-label");
expect(initialAriaLabel).toMatch(/save framework/i);

// After action...
const updatedAriaLabel = await saveButton.getAttribute("aria-label");
expect(updatedAriaLabel).toMatch(/unsave framework/i);
```

**❌ DON'T: Only check if element exists**
```typescript
// ❌ Doesn't verify actual state change
const button = await saveButton.isVisible();
```

### 5. Handle Async Updates Gracefully

**✅ DO: Allow for React Query refetch delays**
```typescript
// Wait for toast (confirms action completed)
await saveToast.waitFor({ state: 'visible', timeout: 3000 });

// Then verify UI state with retries
for (let attempt = 0; attempt < 5; attempt++) {
  const ariaLabel = await saveButton.getAttribute("aria-label");
  if (ariaLabel?.match(/unsave framework/i)) break;
  await page.waitForTimeout(500);
}
```

### 6. Use Proper Assertions

**✅ DO: Use Vitest's `expect()` with appropriate matchers**
```typescript
expect(count).toBeGreaterThanOrEqual(1);
expect(ariaLabel).toMatch(/save framework/i);
```

**❌ DON'T: Use non-existent assertions**
```typescript
// ❌ Playwright doesn't have toBeVisible() in expect
await expect(locator).toBeVisible(); // Wrong!
```

### 7. Test Structure (AAA Pattern)

**✅ DO: Follow Arrange-Act-Assert pattern**
```typescript
test("TC-FRAMEWORK-011: Save Framework", async () => {
  // Arrange
  await loginAsTestUser(page, testUsers.regular.email);
  await navigateTo(page, "/frameworks");
  const firstCard = page.getByTestId("framework-card").first();
  const saveButton = firstCard.getByTestId("framework-card-save");
  
  // Act
  await saveButton.click();
  
  // Assert
  const saveToast = page.locator('[data-sonner-toast]').filter({ hasText: /saved/i }).first();
  await saveToast.waitFor({ state: 'visible', timeout: 3000 });
});
```

### 8. Component Test IDs

**Framework Components Test IDs:**
- `framework-card` - Framework card wrapper
- `framework-card-view-details` - View Details button
- `framework-card-copy` - Copy button
- `framework-card-save` - Save/Unsave button
- `framework-card-tried` - Mark as tried button
- `framework-card-id` - Framework ID display
- `framework-detail-dialog` - Framework detail modal
- `framework-detail-copy-prompt` - Copy prompt button (in dialog)
- `framework-detail-save` - Save button (in dialog)
- `framework-detail-tried` - Mark as tried button (in dialog)

### 9. Error Handling

**✅ DO: Handle optional elements gracefully**
```typescript
const emptyState = page.locator("text=/no results/i");
if (await emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
  await emptyState.waitFor({ state: 'visible', timeout: 1000 });
}
```

### 10. Test Independence

**✅ DO: Set up and tear down for each test**
```typescript
beforeEach(async () => {
  page = await createPage();
});

afterEach(async () => {
  await page.close();
});
```

## Migration Checklist

When updating tests for robustness:

- [ ] Replace icon-based selectors with `getByTestId()`
- [ ] Replace position-based selectors (`.nth()`) with test IDs
- [ ] Replace CSS class selectors with test IDs
- [ ] Add `aria-label` attributes to components for accessibility
- [ ] Add `data-testid` attributes to interactive elements
- [ ] Update tests to use `getByTestId()` and `getByRole()`
- [ ] Remove hard-coded timeouts where possible
- [ ] Add retry logic for async state updates
- [ ] Verify tests pass after changes

## Benefits

✅ **Stability:** Tests won't break from UI styling changes  
✅ **Maintainability:** Clear intent with test IDs  
✅ **Accessibility:** Tests verify proper ARIA labels  
✅ **Speed:** No unnecessary waits  
✅ **Reliability:** Proper handling of async updates  

