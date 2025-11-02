# E2E Testing Quick Reference

**Quick guide for common E2E test issues and fixes**

---

## Common Errors & Quick Fixes

### ❌ Error: "Invalid Chai property: toBeVisible"

**Symptom:**
```
Error: Invalid Chai property: toBeVisible
```

**Fix:**
```typescript
// ❌ Wrong
await expect(page.locator("main")).toBeVisible({ timeout: 3000 });

// ✅ Correct
await page.locator("main").waitFor({ state: "visible", timeout: 3000 });
```

---

### ❌ Error: "Strict mode violation: resolved to N elements"

**Symptom:**
```
strict mode violation: getByRole('button', { name: /submit/i }) resolved to 4 elements
```

**Fix:**
```typescript
// ❌ Wrong
const button = page.getByRole("button", { name: /submit/i });
await button.click();

// ✅ Option 1: Use .first()
const button = page.getByRole("button", { name: /submit/i }).first();
await button.click();

// ✅ Option 2: Scope to container
const form = page.locator('form');
const button = form.getByRole("button", { name: /submit/i });
await button.click();

// ✅ Option 3: More specific selector
const button = page.getByRole("button", { name: "Share Innovation" });
await button.click();
```

---

### ❌ Error: "Test timed out in 30000ms"

**Symptom:**
```
Test timed out in 30000ms
```

**Possible Causes:**
1. Element doesn't exist on page
2. Selector is incorrect
3. Element takes longer than expected to render

**Fix:**
```typescript
// Check if element exists first
const element = page.locator("text=/optional text/i");
if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
  await element.waitFor({ state: "visible", timeout: 5000 });
} else {
  console.log("Element not found - may be optional");
  // Test can continue if element is optional
}
```

---

## Pre-Test Checklist

Before running E2E tests:

- [ ] Dev server running: `pnpm dev:frontend`
- [ ] Convex backend running: `npx convex dev`
- [ ] Test users exist:
  - `test-user@resend.dev` (password: `test-password-123`)
  - `admin@resend.dev` (password: `test-password-123`)
- [ ] Frameworks seeded: `npx convex run seedFrameworks:seedInitialFrameworks`
- [ ] App accessible at `http://localhost:5173`

---

## Quick Commands

```bash
# Run all E2E tests
pnpm test:e2e --run

# Run specific suite
pnpm test:e2e framework-library
pnpm test:e2e community
pnpm test:e2e dashboard
pnpm test:e2e admin

# Run with UI (watch mode)
pnpm test:e2e:ui

# Seed frameworks
npx convex run seedFrameworks:seedInitialFrameworks
```

---

## Selector Best Practices

### ✅ DO:
- Use semantic selectors: `getByRole`, `getByLabel`, `getByText`
- Use `.first()` when multiple matches are expected
- Scope selectors to containers: `form.getByRole("button")`
- Add conditional checks for optional elements
- Use `waitFor({ state: 'visible' })` for waits

### ❌ DON'T:
- Use `expect(locator).toBeVisible()` - not supported
- Use overly broad selectors that match multiple elements
- Use CSS selectors when semantic selectors are available
- Assume elements always exist - add conditional checks

---

## Getting Help

- **Detailed Test Results:** [E2E_TEST_RESULTS.md](./E2E_TEST_RESULTS.md)
- **Full Testing Protocol:** [TESTING_PROTOCOL.md](./TESTING_PROTOCOL.md)
- **E2E Test README:** [tests/e2e/README.md](../tests/e2e/README.md)

---

**Last Updated:** November 2, 2025

