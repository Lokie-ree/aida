# Deployment Test Strategy - Phase 2 MVP

**Last Updated:** October 26, 2025  
**Status:** Implementation Plan  
**Objective:** Ensure comprehensive test coverage across all deployment environments (dev, preview, production)

---

## Overview

Based on [CONVEX_DEPLOYMENTS.md](CONVEX_DEPLOYMENTS.md), we need to implement tests that validate:

1. **Development Environment** - Local testing with `npx convex dev`
2. **Preview Deployments** - PR-based isolated testing
3. **Production Deployment** - Production readiness validation

---

## Current Test Coverage Gaps

### ❌ Missing Tests

1. **Environment Variable Validation**
   - Different variables required for dev vs preview vs production
   - VITE_* prefix validation for frontend variables
   - Backend Convex environment variables

2. **Deployment-Specific Configuration**
   - Development: `.env.local` with dev deployment URLs
   - Preview: Vercel preview environment variables
   - Production: Production deployment configuration

3. **Cross-Deployment Consistency**
   - Same features work across all environments
   - Database schema consistency
   - API endpoint availability

4. **Preview Deployment Testing**
   - Isolated PR testing environment
   - Preview deployment key configuration
   - Safe, isolated testing before merge

5. **Environment-Specific Behavior**
   - Dev: Auto-cleanup of test data
   - Preview: Isolated test data
   - Production: Protection against accidental deletion

---

## Implementation Plan

### Phase 1: Environment Configuration Tests Enhancement

**File:** `scripts/diagnostic/test-environment-config.js`

**New Tests to Add:**

```javascript
// 1. Deployment Type Detection
async function testDeploymentType(runner, client) {
  // Detect if running in dev/preview/production
  // Validate appropriate environment variables
}

// 2. Environment Variable Validation by Deployment Type
async function testEnvironmentVariablesByDeploymentType(runner) {
  // dev: VITE_CONVEX_URL, VITE_CONVEX_SITE_URL, SITE_URL
  // preview: CONVEX_DEPLOY_KEY (preview), frontend variables
  // production: CONVEX_DEPLOY_KEY (prod), frontend variables
}

// 3. Preview Deployment Key Configuration
async function testPreviewDeploymentKey(runner) {
  // Validate preview deploy key exists
  // Validate preview environment variables
}

// 4. Production Deployment Safety
async function testProductionDeploymentSafety(runner, client) {
  // Check for production data
  // Validate production environment variables
  // Ensure production data protection
}
```

### Phase 2: Deploy-Specific Test Suites

**New File:** `scripts/diagnostic/test-deployment-types.js`

**Tests to Implement:**

1. **Development Environment Tests**
   - `.env.local` configuration
   - Dev deployment URLs
   - Local development workflow

2. **Preview Environment Tests**
   - Preview deploy key configuration
   - Preview-specific environment variables
   - PR isolation validation

3. **Production Environment Tests**
   - Production deploy key validation
   - Production environment variables
   - Production data protection

### Phase 3: Integration Test Updates

**File:** `scripts/integration/test-integration-phase2-features.js`

**Enhancements:**

```javascript
// Add deployment-aware testing
async function testFrameworkLibraryAcrossEnvironments(runner, client) {
  // Test framework library works in dev/preview/prod
  // Validate environment-specific behavior
}

async function testCommunityFeaturesAcrossEnvironments(runner, client) {
  // Test community features in all environments
  // Validate isolated preview testing
}
```

### Phase 4: E2E Test Updates

**File:** `scripts/e2e/test-e2e-phase2-user-journey.js`

**Enhancements:**

```javascript
// Add deployment-specific E2E tests
async function testUserJourneyInDev(runner) {
  // Complete user journey in development
}

async function testUserJourneyInPreview(runner) {
  // Complete user journey in preview (PR)
}

async function testUserJourneyInProduction(runner) {
  // Complete user journey validation for production
}
```

---

## Test Execution Strategy

### Development Environment

```bash
# Run all tests against development deployment
npm run test:all
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Preview Environment (PR)

```bash
# Run tests against preview deployment
VITE_CONVEX_URL=https://preview-deployment.convex.cloud npm run test:all
```

### Production Environment

```bash
# Run validation tests only (read-only)
npm run test:validation
npm run test:diagnostic
```

---

## Environment Variable Testing

### Required Variables by Deployment Type

#### Development
```env
VITE_CONVEX_URL=https://dev-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://dev-deployment.convex.site
SITE_URL=http://localhost:5173
```

#### Preview
```env
CONVEX_DEPLOY_KEY=preview-key-from-dashboard
VITE_CONVEX_URL=https://preview-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://preview-deployment.convex.site
SITE_URL=https://preview-branch.vercel.app
```

#### Production
```env
CONVEX_DEPLOY_KEY=production-key-from-dashboard
VITE_CONVEX_URL=https://prod-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://prod-deployment.convex.site
SITE_URL=https://pelicanai.org
```

---

## Safety Considerations

### Production Data Protection

1. **Development/Preview:** Full test data cleanup enabled
2. **Production:** Read-only validation tests only
3. **Force flag:** Bypass safety checks (NOT RECOMMENDED)

### Test Isolation

1. **Preview Deployments:** Each PR gets isolated Convex backend
2. **Test Data:** Marked with `isTestData: true`
3. **Cleanup:** Automatic cleanup of test data only

---

## Implementation Checklist

- [ ] Enhance `scripts/diagnostic/test-environment-config.js` with deployment type detection
- [ ] Create `scripts/diagnostic/test-deployment-types.js` for deployment-specific tests
- [ ] Update `scripts/integration/test-integration-phase2-features.js` for cross-environment testing
- [ ] Update `scripts/e2e/test-e2e-phase2-user-journey.js` for deployment-specific journeys
- [ ] Add preview deployment testing to test-runner.js
- [ ] Update package.json with new test scripts
- [ ] Document deployment test strategy in CONVEX_DEPLOYMENTS.md
- [ ] Create CI/CD configuration for automated testing

---

## Next Steps

1. **Create enhanced diagnostic tests** for environment detection
2. **Add deployment-specific test suites** for dev/preview/production
3. **Update integration tests** to validate cross-environment consistency
4. **Implement preview deployment testing** in CI/CD pipeline
5. **Document test strategy** in contributing guide

---

*This strategy ensures comprehensive test coverage across all deployment environments, protecting production data while enabling safe testing in isolated environments.*

