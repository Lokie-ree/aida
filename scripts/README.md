# Beta Authentication Testing Suite

This directory contains a comprehensive testing suite for the beta authentication flow, designed to diagnose and validate the issues documented in ADR 006.

## Overview

The testing suite provides multiple layers of testing:

- **Unit Tests**: Test individual Convex functions in isolation
- **Integration Tests**: Test interactions between multiple components
- **End-to-End Tests**: Test complete user journeys
- **API Tests**: Test Better Auth HTTP endpoints directly
- **Diagnostic Tests**: Test environment configuration and database state

## Quick Start

### Run All Tests

```bash
# Run complete test suite
pnpm test:beta-auth

# Run specific test suite
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:api
pnpm test:diagnostic
```

### Run Individual Tests

```bash
# Unit tests
pnpm test:unit:beta-signup
pnpm test:unit:user-profiles
pnpm test:unit:beta-program
pnpm test:unit:auth

# Integration tests
pnpm test:integration:signup-flow
pnpm test:integration:auth-init

# E2E tests
pnpm test:e2e:automated

# API tests
pnpm test:api:better-auth

# Diagnostic tests
pnpm test:diagnostic:env
pnpm test:diagnostic:db
```

### Cleanup

```bash
# Clean test data
pnpm test:cleanup

# Clean and run tests
pnpm test:cleanup && pnpm test:beta-auth
```

## Test Structure

### Directory Organization
```
scripts/
├── unit/                  # Unit tests (individual functions)
├── integration/           # Integration tests (cross-component)
├── e2e/                   # End-to-end tests (full user journeys)
├── api/                   # API endpoint tests
├── diagnostic/            # Environment & database validation
├── archive/               # Archived/legacy test files
├── test-utils.js          # Shared test utilities
├── test-fixtures.js       # Reusable test data
├── test-runner.js         # Test orchestrator
└── [documentation files]  # Test documentation
```

### Test Utilities (`test-utils.js`)

Shared utilities for all test scripts:

- `TestRunner`: Manages test execution and results
- `ConvexTestClient`: Wrapper for Convex client operations
- Helper functions for data generation and cleanup

### Test Fixtures (`test-fixtures.js`)

Reusable test data and scenarios:

- `TEST_USERS`: Various user scenarios (valid, invalid, edge cases)
- `BETA_PROGRAM_SCENARIOS`: Different beta program states
- `USER_PROFILE_SCENARIOS`: Profile data variations
- `API_TEST_DATA`: Better Auth API test data

### Unit Tests (`unit/`)

Test individual Convex functions:

- `test-unit-beta-signup.js`: Beta signup functions
- `test-unit-user-profiles.js`: User profile functions
- `test-unit-beta-program.js`: Beta program functions
- `test-unit-auth.js`: Authentication functions

### Integration Tests (`integration/`)

Test component interactions:

- `test-integration-signup-flow.js`: Complete signup flow
- `test-integration-auth-initialization.js`: Auth to profile initialization

### End-to-End Tests (`e2e/`)

Test complete user journeys:

- `test-e2e-beta-flow.js`: Automated E2E tests
- `test-e2e-manual-checklist.md`: Manual testing checklist

### API Tests (`api/`)

Test Better Auth endpoints:

- `test-api-better-auth.js`: Direct API endpoint testing

### Diagnostic Tests (`diagnostic/`)

Test environment and database:

- `test-environment-config.js`: Environment variable validation
- `test-database-state.js`: Database state validation

### Archived Tests (`archive/`)

Legacy test files preserved for historical reference:
- See `archive/README.md` for details on archived files

## Configuration

### Environment Variables

Required environment variables:

```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
SITE_URL=https://your-site.com
BETTER_AUTH_SECRET=your-secret-key
RESEND_API_KEY=your-resend-key
```

### Test Configuration

Tests use the following configuration:

- **Convex URL**: `VITE_CONVEX_URL` or default
- **Site URL**: `SITE_URL` or default
- **Test Data**: Generated fresh for each test run
- **Cleanup**: Automatic cleanup between test runs

## Test Execution

### Phase 1: Diagnostic Tests

Run first to identify configuration issues:

```bash
npm run test:diagnostic
```

### Phase 2: Unit Tests

Run second to verify individual function correctness:

```bash
npm run test:unit
```

### Phase 3: Integration Tests

Run third to verify cross-component interactions:

```bash
npm run test:integration
```

### Phase 4: End-to-End Tests

Run last to verify complete user experience:

```bash
npm run test:e2e
```

## Expected Results

### Success Criteria

- All unit tests pass (100% of individual functions work correctly)
- All integration tests pass (cross-component flows work)
- E2E test completes full user journey successfully
- Database state is consistent after each test
- No orphaned records in any table

### Failure Analysis

Each test provides:

- Clear pass/fail status
- Detailed error messages
- Database state at failure point
- Relevant log excerpts
- Suggested next steps for debugging

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**: Check CORS configuration
2. **User account creation failing**: Check deployment URL and environment variables
3. **Authentication state not recognized**: Check Better Auth integration
4. **Profile initialization failing**: Check auto-initialization logic
5. **Email delivery issues**: Check Resend configuration

### Debugging Steps

1. Run diagnostic tests first
2. Check environment variables
3. Test individual components
4. Check database state
5. Review logs

See [troubleshooting-guide.md](./troubleshooting-guide.md) for detailed solutions.

## Monitoring

### Convex Logs

```bash
# Monitor real-time logs
npx convex logs --watch

# Get recent logs
npx convex logs --limit 50
```

### Database Inspection

```bash
# Check database state
npx convex data

# Check specific tables
npx convex data --table betaSignups
```

## Contributing

### Adding New Tests

1. Create test file in appropriate directory
2. Use shared utilities from `test-utils.js`
3. Add test data to `test-fixtures.js`
4. Update test runner configuration
5. Add npm script to `package.json`

### Test Naming Convention

- `test-{type}-{component}.js` for test files
- `TEST_{CATEGORY}` for test data constants
- `test{Description}` for test functions

### Best Practices

- Use descriptive test names
- Clean up test data after each test
- Provide clear error messages
- Test both success and failure scenarios
- Use realistic test data

## Documentation

### Testing Documentation
- [Test Suite Overview](./README.md): This file - complete testing guide
- [Troubleshooting Guide](./troubleshooting-guide.md): Common issues and solutions
- [Manual Testing Checklist](./test-e2e-manual-checklist.md): Manual testing procedures
- [ADR 006](../docs/decisions/006-beta-auth-investigation.md): Original investigation

### Phase 1 MVP Test Results (2025-10-13)
**Quick Links:**
- 📋 [**PHASE1-MVP-READINESS.md**](./PHASE1-MVP-READINESS.md) - **START HERE** - 1-page executive summary
- ✅ [FIX-COMPLETION-REPORT.md](./FIX-COMPLETION-REPORT.md) - What we implemented today
- 📊 [MVP-PHASE1-GAP-ANALYSIS.md](./MVP-PHASE1-GAP-ANALYSIS.md) - Detailed analysis (863 lines, reference)

**Detailed Coverage Reports:**
- [USER-STORY-COVERAGE.md](./USER-STORY-COVERAGE.md) - User story coverage analysis
- [TEST-COVERAGE-MATRIX.md](./TEST-COVERAGE-MATRIX.md) - Test coverage matrix
- [COVERAGE-SUMMARY.md](./COVERAGE-SUMMARY.md) - Test coverage summary

### Archived Documentation
- [archive/](./archive/) - Obsolete docs preserved for historical reference

## Support

If you encounter issues not covered in this documentation:

1. Check the troubleshooting guide
2. Review test results and logs
3. Run diagnostic tests
4. Create an issue with collected information

---

**Last Updated**: 2025-10-13  
**Version**: 1.1 (Post-Critical-Fixes)  
**Status**: ✅ All critical fixes complete, ready for UAT
