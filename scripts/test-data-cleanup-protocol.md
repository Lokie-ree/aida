# Test Data Cleanup Protocol

## Overview

This document outlines the comprehensive test data cleanup protocol for Pelican AI's test suite, ensuring clean test environments and preventing data contamination between test runs.

## 🧹 Cleanup Strategy

### 1. Pre-Test Cleanup
- **When:** Before each test suite execution
- **What:** Remove all test data from previous runs
- **How:** Automated cleanup via `test-runner.js`

### 2. Post-Test Cleanup
- **When:** After each test suite completion
- **What:** Remove test data created during the current run
- **How:** Individual test cleanup + suite-level cleanup

### 3. Emergency Cleanup
- **When:** Manual intervention required
- **What:** Complete database reset
- **How:** Manual Convex dashboard or CLI commands

## 📊 Test Data Categories

### Phase 1 Data
- `betaSignups` - Beta tester signup records
- `userProfiles` - User profile extensions
- `user` - Better Auth user records
- `session` - Better Auth session records
- `account` - Better Auth account records
- `verification` - Better Auth verification records

### Phase 2 Data
- `frameworks` - AI guidance frameworks
- `frameworkUsage` - Framework interaction tracking
- `testimonials` - User testimonials
- `innovations` - Community innovations
- `innovationInteractions` - Innovation engagement
- `betaProgram` - Beta program analytics
- `timeTracking` - Time savings tracking

### RAG System Data (Auto-managed)
- `documents` - Document embeddings
- `chatMessages` - Chat history
- `feedbackSessions` - User feedback
- `auditLogs` - System audit logs

## 🔧 Implementation

### Automated Cleanup Functions

```javascript
// Pre-test cleanup (in test-runner.js)
async function cleanupDatabase() {
  try {
    // Delete Phase 1 data
    await convex.mutation(api.betaSignup.deleteAllTestData)();
    await convex.mutation(api.userProfiles.deleteAllTestData)();
    
    // Delete Phase 2 data
    await convex.mutation(api.frameworks.deleteAllTestData)();
    await convex.mutation(api.testimonials.deleteAllTestData)();
    await convex.mutation(api.innovations.deleteAllTestData)();
    await convex.mutation(api.betaProgram.deleteAllTestData)();
    await convex.mutation(api.timeTracking.deleteAllTestData)();
    
    console.log('✅ Database cleanup completed');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  }
}
```

### Test-Specific Cleanup

```javascript
// Individual test cleanup (in each test file)
afterEach(async () => {
  // Clean up test-specific data
  await cleanupTestData();
});

async function cleanupTestData() {
  // Remove only data created by this specific test
  // Use test-specific identifiers or timestamps
}
```

### Manual Cleanup Commands

```bash
# Complete database reset (use with caution)
npx convex run admin:resetDatabase

# Clean specific table
npx convex run admin:cleanTable --tableName "betaSignups"

# View current data counts
npx convex run admin:getDataCounts
```

## 🚨 Cleanup Rules

### 1. Test Data Identification
- All test data must include `isTestData: true` flag
- Use consistent test email patterns: `*@test.pelicanai.org`
- Include test timestamps for time-based cleanup

### 2. Data Isolation
- Test data must not interfere with production data
- Use separate test user accounts
- Isolate test email addresses

### 3. Cleanup Timing
- **Before tests:** Remove all existing test data
- **After tests:** Remove data created during current run
- **On failure:** Attempt cleanup, log failures

### 4. Error Handling
- Continue test execution if cleanup fails
- Log cleanup failures for investigation
- Provide manual cleanup instructions

## 📋 Cleanup Checklist

### Pre-Test
- [ ] Clear all test tables
- [ ] Reset test counters
- [ ] Clean test email queues
- [ ] Verify clean state

### Post-Test
- [ ] Remove test user accounts
- [ ] Clear test email data
- [ ] Reset test configurations
- [ ] Log cleanup results

### Emergency
- [ ] Identify contaminated data
- [ ] Execute manual cleanup
- [ ] Verify clean state
- [ ] Document incident

## 🔍 Monitoring

### Cleanup Success Metrics
- **Cleanup Time:** < 5 seconds per suite
- **Data Remaining:** 0 test records after cleanup
- **Error Rate:** < 1% cleanup failures

### Monitoring Commands
```bash
# Check data counts
node scripts/diagnostic/test-database-state.js

# Verify clean state
node scripts/diagnostic/test-environment-config.js

# Run cleanup verification
node scripts/test-runner.js --cleanup-only
```

## 🚀 Usage

### Automatic Cleanup
```bash
# All test suites include automatic cleanup
pnpm test:unit
pnpm test:integration
pnpm test:api
```

### Manual Cleanup
```bash
# Clean specific suite
node scripts/test-runner.js --suite unit --cleanup-only

# Emergency cleanup
node scripts/emergency-cleanup.js
```

### Verification
```bash
# Verify clean state
node scripts/verify-cleanup.js
```

## 📝 Best Practices

1. **Always cleanup before tests** - Prevents data contamination
2. **Use test-specific identifiers** - Easy to identify and remove
3. **Log cleanup operations** - Track success/failure rates
4. **Handle cleanup failures gracefully** - Don't block test execution
5. **Document manual cleanup procedures** - For emergency situations

## 🆘 Troubleshooting

### Common Issues
- **Cleanup timeout:** Increase timeout values
- **Permission errors:** Check Convex permissions
- **Data not removed:** Verify test data identification
- **Performance issues:** Optimize cleanup queries

### Emergency Procedures
1. Stop all running tests
2. Execute manual cleanup commands
3. Verify clean state
4. Restart test execution
5. Document incident

---

*Last Updated: October 16, 2025*
*Version: 1.0.0*
