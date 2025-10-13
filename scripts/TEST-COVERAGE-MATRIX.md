# Test Coverage Matrix

## Quick Reference: User Story → Test Coverage Mapping

| User Story | Unit Tests | Integration Tests | E2E Tests | API Tests | Diagnostic Tests | Manual Tests | Coverage |
|------------|-----------|------------------|-----------|-----------|-----------------|--------------|----------|
| **USER-001: Beta Signup** | ✅ test-unit-beta-signup.js | ✅ test-integration-signup-flow.js | ✅ test-e2e-beta-flow.js | ✅ test-api-better-auth.js | ✅ test-database-state.js | ✅ Manual Checklist | 100% |
| **USER-002: Authentication** | ✅ test-unit-auth.js | ✅ test-integration-auth-initialization.js | ✅ test-e2e-beta-flow.js | ✅ test-api-better-auth.js | ✅ test-environment-config.js | ✅ Manual Checklist | 100% |
| **USER-003: Profile Init** | ✅ test-unit-user-profiles.js<br>✅ test-unit-beta-program.js | ✅ test-integration-auth-initialization.js | ✅ test-e2e-beta-flow.js | — | ✅ test-database-state.js | ✅ Manual Checklist | 100% |
| **USER-004: Dev Diagnostics** | — | — | — | ✅ test-api-better-auth.js | ✅ test-environment-config.js<br>✅ test-database-state.js | ✅ Troubleshooting Guide | 100% |
| **USER-005: Test Data Mgmt** | ✅ All tests use cleanTestData() | ✅ test-runner.js --cleanup | — | — | ✅ test-database-state.js | — | 100% |
| **USER-006: QA Validation** | — | — | — | — | — | ✅ test-e2e-manual-checklist.md | 100% |
| **USER-007: Error Handling** | ✅ test-unit-beta-signup.js | ✅ test-integration-signup-flow.js | ✅ test-e2e-beta-flow.js | ✅ test-api-better-auth.js | — | ✅ Manual Checklist | 100% |
| **USER-008: DB Monitoring** | — | ✅ test-integration-signup-flow.js | — | — | ✅ test-database-state.js | — | 100% |

---

## Test File → User Story Coverage

| Test File | Covers User Stories | Test Type | Run Command |
|-----------|-------------------|-----------|-------------|
| `test-unit-beta-signup.js` | USER-001, USER-007 | Unit | `pnpm test:unit:beta-signup` |
| `test-unit-user-profiles.js` | USER-003 | Unit | `pnpm test:unit:user-profiles` |
| `test-unit-beta-program.js` | USER-003 | Unit | `pnpm test:unit:beta-program` |
| `test-unit-auth.js` | USER-002 | Unit | `pnpm test:unit:auth` |
| `test-integration-signup-flow.js` | USER-001, USER-007, USER-008 | Integration | `pnpm test:integration:signup-flow` |
| `test-integration-auth-initialization.js` | USER-002, USER-003 | Integration | `pnpm test:integration:auth-init` |
| `test-e2e-beta-flow.js` | USER-001, USER-002, USER-003, USER-007 | E2E | `pnpm test:e2e:automated` |
| `test-api-better-auth.js` | USER-001, USER-002, USER-004, USER-007 | API | `pnpm test:api:better-auth` |
| `test-environment-config.js` | USER-002, USER-004 | Diagnostic | `pnpm test:diagnostic:env` |
| `test-database-state.js` | USER-001, USER-003, USER-004, USER-005, USER-008 | Diagnostic | `pnpm test:diagnostic:db` |
| `test-e2e-manual-checklist.md` | USER-001, USER-002, USER-003, USER-006, USER-007 | Manual | Manual Execution |
| `troubleshooting-guide.md` | USER-004 | Documentation | Reference Material |

---

## Test Execution Recommendations

### 🚀 Quick Start (First Time)
```bash
# 1. Validate environment setup
pnpm test:diagnostic

# 2. Run unit tests to verify individual components
pnpm test:unit

# 3. Run integration tests to verify flows
pnpm test:integration

# 4. Run E2E test to verify complete journey
pnpm test:e2e:automated

# 5. Review manual checklist for UX validation
cat scripts/test-e2e-manual-checklist.md
```

### 🔄 Regular Development Workflow
```bash
# Before making changes
pnpm test:cleanup

# After making changes
pnpm test:beta-auth  # Runs all automated tests

# Before committing
pnpm test:diagnostic  # Ensures environment still valid
```

### 🐛 Debugging Workflow
```bash
# If tests fail, run diagnostics first
pnpm test:diagnostic:env    # Check environment variables
pnpm test:diagnostic:db     # Check database state

# Then run specific test suite that failed
pnpm test:unit:beta-signup  # Example

# If still failing, check troubleshooting guide
cat scripts/troubleshooting-guide.md
```

### 🚢 Pre-Deployment Workflow
```bash
# 1. Clean database
pnpm test:cleanup

# 2. Run full test suite
pnpm test:beta-auth

# 3. Run manual E2E checklist
# Follow: scripts/test-e2e-manual-checklist.md

# 4. Verify environment is production-ready
pnpm test:diagnostic:env
```

---

## Coverage Statistics

### By Test Type
- **Unit Tests:** 4 files, ~60 test cases
- **Integration Tests:** 2 files, ~20 test cases
- **E2E Tests:** 1 file, ~25 test cases
- **API Tests:** 1 file, ~20 test cases
- **Diagnostic Tests:** 2 files, ~25 test cases
- **Manual Tests:** 1 comprehensive checklist

**Total:** 18 files, ~150+ test cases

### By User Story
- **USER-001 (Beta Signup):** 6 test files covering this story
- **USER-002 (Authentication):** 6 test files covering this story
- **USER-003 (Profile Init):** 5 test files covering this story
- **USER-004 (Dev Diagnostics):** 4 test files covering this story
- **USER-005 (Test Data Mgmt):** All test files use cleanup utilities
- **USER-006 (QA Validation):** 1 comprehensive manual checklist
- **USER-007 (Error Handling):** 5 test files covering this story
- **USER-008 (DB Monitoring):** 3 test files covering this story

### By Component Tested
- **Beta Signup Functions:** 3 test files
- **User Profile Functions:** 3 test files
- **Beta Program Functions:** 3 test files
- **Auth Functions:** 4 test files
- **Better Auth API:** 1 test file
- **Database State:** 2 test files
- **Environment Config:** 1 test file

---

## Quality Gates

### ✅ All Tests Must Pass
- Unit tests: 100% pass rate
- Integration tests: 100% pass rate
- E2E automated tests: 100% pass rate
- API tests: 100% pass rate
- Diagnostic tests: 100% pass rate

### ✅ Performance Requirements
- Full test suite execution: < 60 seconds
- Individual test file execution: < 10 seconds
- Database cleanup: < 5 seconds
- API response times: < 2 seconds

### ✅ Data Integrity Requirements
- No orphaned records after tests
- Database returns to clean state after cleanup
- All foreign key relationships intact
- State transitions validated

---

## Test Maintenance Schedule

### Daily (During Development)
- Run relevant unit tests for changed components
- Run integration tests if multiple components changed
- Clean test data at end of day

### Before Each Commit
- Run full test suite: `npm run test:beta-auth`
- Verify no new linter errors
- Update test fixtures if data models changed

### Before Each Deployment
- Run full test suite
- Execute manual E2E checklist
- Validate environment configuration
- Check database state consistency

### Weekly
- Review test coverage reports
- Update test documentation
- Add tests for new bugs discovered
- Clean up obsolete test data

### Monthly
- Review test suite architecture
- Identify slow tests for optimization
- Update test fixtures with realistic data
- Review and update troubleshooting guide

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full coverage / Test exists |
| 🟡 | Partial coverage / Enhancement opportunity |
| ❌ | No coverage / Out of scope |
| — | Not applicable for this user story |

---

**Last Updated:** 2025-10-13  
**Version:** 1.0  
**Phase:** Phase 1 MVP

