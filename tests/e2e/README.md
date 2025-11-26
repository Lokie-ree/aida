# E2E Testing Guide

This directory contains end-to-end tests using Vitest and Playwright.

## Prerequisites

**⚠️ IMPORTANT: Before running E2E tests, ensure:**

1. **Dev servers are running:**
   ```bash
   # Terminal 1: Start Convex backend
   npx convex dev
   
   # Terminal 2: Start Vite frontend
   pnpm dev:frontend
   ```

2. **Test users exist in your database:**
   - Test users are defined in `tests/e2e/helpers/fixtures.ts`
   - Users must exist in your Convex database
   - Users must have passwords set (default: `test-password-123` or set `TEST_USER_PASSWORD` env var)
   - See "Test User Setup" section below

3. **Environment variables:**
   ```bash
   # Optional: Override base URL if not using default
   export VITE_TEST_BASE_URL=http://localhost:5173
   
   # Optional: Override test user password
   export TEST_USER_PASSWORD=your-test-password
   
   # Note: Resend test mode is enabled by default in development
   # (emails only sent to @resend.dev addresses)
   # Set RESEND_TEST_MODE=false in production to send real emails
   ```

## Running Tests

### Run all E2E tests
```bash
pnpm test:e2e
```

### Run tests in watch mode
```bash
pnpm test:e2e:watch
```

### Run tests with UI
```bash
pnpm test:e2e:ui
```

### Run specific test suite
```bash
# Framework Library tests
pnpm test:e2e framework-library

# Alignment Scorecard tests
pnpm test:e2e alignment-scorecard

# Community tests (skipped - Phase 2 feature)
pnpm test:e2e community

# Dashboard tests
pnpm test:e2e dashboard

# Admin tests
pnpm test:e2e admin
```

## Test User Setup (One-Time)

Test users must exist before running E2E tests. Create them manually:

1. **Start dev servers:**
   ```bash
   pnpm dev
   ```

2. **Open the app:** Navigate to `http://localhost:5173`

3. **Sign up these two users:**
   - **Regular user:** Email `test-user@resend.dev`, Password `test-password-123`
   - **Admin user:** Email `admin@resend.dev`, Password `test-password-123`

   **Note:** We use `@resend.dev` addresses to prevent email bounces. Resend's test domain accepts all emails without bouncing, even if emails are sent during signup.

4. **Set admin role** (if needed):
   - Access Convex dashboard and set admin role for `admin@resend.dev` user
   - Or update user profile directly in database

**That's it!** Users persist across test runs, so you only need to do this once.

Test users are defined in `tests/e2e/helpers/fixtures.ts`:
- `testUsers.regular` - Regular user account (email: `test-user@resend.dev`)
- `testUsers.admin` - Admin user account (email: `admin@resend.dev`)
- `testUsers.newUser` - Dynamically generated new user (for tests that need fresh users)

## Test Structure

```
tests/e2e/
├── setup.ts                    # Global test setup (Playwright browser)
├── helpers/
│   ├── auth.ts                # Authentication helpers
│   ├── fixtures.ts            # Test data fixtures
│   ├── navigation.ts          # Navigation helpers
│   └── test-setup.ts         # App accessibility verification
├── framework-library.test.ts  # Framework Library tests (TC-FRAMEWORK-001 to 014)
├── alignment-scorecard.test.ts # Alignment Scorecard tests (TC-ALIGNMENT-001 to 010)
├── community.test.ts          # Community tests (TC-COMMUNITY-001 to 014) - SKIPPED
├── dashboard.test.ts          # Dashboard tests (TC-DASHBOARD-001 to 009)
└── admin.test.ts              # Admin tests (TC-ADMIN-001 to 009)
```

## Test Coverage

### Framework Library (14 tests)
- View Framework Library
- Filter by Module
- Search Frameworks
- View Framework Metadata
- Mobile Browsing
- Accessibility Validation
- Copy Prompt to Clipboard
- Track Framework Usage
- View Platform Compatibility
- View Ethical Guardrails
- Save Framework
- Unsave Framework
- Saved Frameworks Persist
- Saved Framework Indicator

### Alignment Scorecard (10 tests)
- View Alignment Scorecard Page
- Fill Content Input Form
- Submit Content for Analysis
- View Workflow Status During Analysis
- View Scorecard Results
- View Overall Alignment Score
- View Standards Breakdown Table
- View Alignment Gaps
- View Recommendations
- Validate Form Inputs

**Note:** Alignment Scorecard tests require RAG data to be populated. Run `npx convex run ragService:populateSampleStandards` before running these tests.

### Community Features (14 tests) - SKIPPED
⚠️ Community features are hidden for MVP launch (Phase 2). Tests are skipped until features are unhidden at 30-100 users.

- Submit Innovation
- Innovation Form Validation
- Tag Innovation
- Louisiana Context Encouragement
- Mobile Innovation Submission
- View Community Innovations
- Filter Innovations
- Search Innovations
- View Innovation Details
- Like Innovation
- Submit Testimonial
- Testimonial Form Validation
- Louisiana Context in Testimonials
- View Submitted Testimonials

### Dashboard Features (9 tests)
- View Personal Dashboard
- View Time Savings Tracker
- View Engagement Streak
- View Frameworks Tried
- Dashboard Mobile View
- View Recommended Frameworks
- View Recently Used Frameworks
- Access Framework Library
- New User Onboarding

### Admin Features (9 tests)
- Access Admin Dashboard
- Review Pending Content
- Approve Content
- Reject Content
- View Moderation History
- View Beta Signups
- Approve Beta Signup
- Track Beta User Engagement
- Monitor Platform Health

## Configuration

Tests are configured in `vitest.browser.config.mts`:
- Uses Playwright with Chromium browser
- Runs in headed mode locally, headless in CI
- Test timeout: 30 seconds
- Includes all test files in `tests/e2e/**/*.test.ts`

## Troubleshooting

### "Application is not accessible" error
- Ensure dev server is running: `pnpm dev:frontend`
- Check that app is accessible at `http://localhost:5173`
- Verify Convex backend is running: `npx convex dev`

### "Login timeout" errors
- **Most common cause:** Test users don't exist in database
- **Solution:** Create test users manually (see "Test User Setup" section above)
- Verify test users exist with correct emails:
  - `test-user@resend.dev` (regular user)
  - `admin@resend.dev` (admin user)
- Check that passwords match: `test-password-123` (or `TEST_USER_PASSWORD` env var)
- Ensure authentication is working in the app manually
- Check browser console for errors (tests will show screenshots on failure)

### Missing test data
- **Frameworks:** Run `npx convex run seedFrameworks:seedInitialFrameworks`
- **Innovations/Testimonials:** Create via UI or mutations before running tests

### Common Test Errors

#### 1. "Invalid Chai property: toBeVisible"
**Error:** `Error: Invalid Chai property: toBeVisible`

**Problem:** Playwright doesn't support `expect(locator).toBeVisible()` syntax

**Fix:**
```typescript
// ❌ Wrong:
await expect(page.locator("main")).toBeVisible({ timeout: 3000 });

// ✅ Correct:
await page.locator("main").waitFor({ state: "visible", timeout: 3000 });
```

#### 2. "Strict mode violation" - Multiple elements match
**Error:** `strict mode violation: resolved to N elements`

**Problem:** Selector matches multiple elements on the page

**Fix:**
```typescript
// ❌ Wrong:
const button = page.getByRole("button", { name: /submit|share/i });
await button.click();

// ✅ Correct - Option 1: Use .first()
const button = page.getByRole("button", { name: /submit|share/i }).first();
await button.click();

// ✅ Correct - Option 2: Scope to container
const form = page.locator('form');
const button = form.getByRole("button", { name: /submit/i });
await button.click();

// ✅ Correct - Option 3: More specific text
const button = page.getByRole("button", { name: "Share Innovation" });
await button.click();
```

#### 3. Test timeouts
**Error:** `Test timed out in 30000ms`

**Problem:** Element doesn't exist or takes too long to appear

**Solutions:**
- Verify the UI element actually exists on the page
- Check selector accuracy (use browser DevTools)
- Add conditional checks for optional elements:
```typescript
const element = page.locator("text=/optional element/i");
if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
  await element.waitFor({ state: "visible" });
} else {
  console.log("Optional element not present - test continues");
}
```

### Playwright browser not installed
```bash
pnpm exec playwright install
```

### Tests running but app not loading
- Check that `VITE_CONVEX_URL` environment variable is set correctly
- Verify Convex deployment is accessible
- Check network tab in browser for failed requests

**For detailed test results and more error patterns, see [docs/TESTING.md](../../docs/TESTING.md)**

## Best Practices

1. **Isolation**: Each test gets a fresh page instance for isolation
2. **Cleanup**: Pages are automatically closed after each test
3. **Error Handling**: Tests include screenshots on failure for debugging
4. **Selectors**: Use semantic selectors (`getByRole`, `getByLabel`) over CSS selectors
5. **Waits**: Always wait for elements using `waitFor({ state: 'visible' })` - **don't use `toBeVisible()`**
6. **Multiple Matches**: Use `.first()` or scope to containers when selectors match multiple elements
7. **Optional Elements**: Add conditional checks for elements that may not always be present

## References

- [Vitest Documentation](https://vitest.dev/guide/)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Complete Testing Documentation](../docs/TESTING.md) - Protocol, results, quick reference, and best practices
