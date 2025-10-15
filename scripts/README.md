# Pelican AI - Test Suite

**Phase 1 MVP Testing:** Comprehensive test coverage for beta signup, authentication, and email automation.

## 🚀 Quick Start

```bash
# Run all tests
pnpm test:beta-auth

# Run specific test suites
pnpm test:unit          # Unit tests
pnpm test:integration   # Integration tests  
pnpm test:e2e          # End-to-end tests
pnpm test:api          # API tests
pnpm test:diagnostic   # Diagnostic tests
```

## 📊 Current Status

**Success Rate:** 72.7%  
**Passing:** 8/11 test categories  
**Failing:** Better Auth HTTP endpoints, CORS, Session management

## 🧪 Test Categories

### Unit Tests
- `test-unit-auth.js` - Authentication logic
- `test-unit-beta-signup.js` - Beta signup flow
- `test-unit-user-profiles.js` - User profile management
- `test-unit-beta-program.js` - Beta program logic

### Integration Tests
- `test-integration-auth-initialization.js` - Auth setup
- `test-integration-signup-flow.js` - Complete signup flow

### E2E Tests
- `test-e2e-beta-flow.js` - Automated browser testing
- `test-e2e-manual-checklist.md` - Manual testing checklist

### API Tests
- `test-api-better-auth.js` - Better Auth HTTP endpoints

### Diagnostic Tests
- `test-database-state.js` - Database validation
- `test-environment-config.js` - Environment setup

## 🔧 Test Utilities

- `test-runner.js` - Main test orchestrator
- `test-utils.js` - Shared test utilities
- `test-fixtures.js` - Test data and mocks

## 📁 Archive

Historical test reports and summaries moved to `docs/archive-consolidated/summary-reports/`

---

*Last Updated: October 14, 2025*