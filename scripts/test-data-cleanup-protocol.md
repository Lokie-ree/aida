# Test Data Cleanup Protocol

## Overview

This document outlines the comprehensive test data cleanup protocol for Pelican AI's test suite, ensuring clean test environments and preventing data contamination between test runs. The system uses a centralized cleanup approach with test data isolation flags for maximum safety.

## 🧹 Cleanup Strategy

### 1. Pre-Test Cleanup
- **When:** Before each test suite execution
- **What:** Remove all test data from previous runs (only records with `isTestData: true`)
- **How:** Centralized cleanup via `testDataCleanup:deleteAllTestData`
- **Safety:** Only deletes flagged test data, preserves real user data

### 2. Post-Test Cleanup
- **When:** After each test suite completion
- **What:** Remove test data created during the current run
- **How:** Centralized cleanup system with safety verification
- **Safety:** Provides warnings about potential real data

### 3. Emergency Cleanup
- **When:** Manual intervention required
- **What:** Safe cleanup of test data only
- **How:** Centralized cleanup functions with safety checks
- **Safety:** Comprehensive safety verification before deletion

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

### Centralized Cleanup System

The new cleanup system uses a centralized approach with test data isolation flags for maximum safety:

```javascript
// Centralized cleanup (in test-runner.js)
async function runCentralizedCleanup(runner, client) {
  try {
    runner.log("🧹 Starting centralized test data cleanup...");
    
    // Use new centralized cleanup system
    const result = await client.mutation("testDataCleanup:deleteAllTestData", {});
    
    if (result.success) {
      runner.log(`✅ Cleanup completed successfully`);
      runner.log(`📊 Deleted records:`, "info");
      Object.entries(result.deletedCounts).forEach(([table, count]) => {
        runner.log(`  ${table}: ${count} records`, "info");
      });
      
      if (result.warnings.length > 0) {
        runner.log("⚠️ Cleanup warnings:", "warn");
        result.warnings.forEach(warning => {
          runner.log(`  ${warning}`, "warn");
        });
      }
      
      return true;
    } else {
      runner.log(`❌ Cleanup failed with warnings:`, "error");
      result.warnings.forEach(warning => {
        runner.log(`  ${warning}`, "error");
      });
      return false;
    }
  } catch (error) {
    runner.log(`❌ Cleanup error: ${error.message}`, "error");
    return false;
  }
}
```

### Available Cleanup Functions

```javascript
// Get test data counts
const counts = await convex.run("testDataCleanup:getTestDataCounts", {});

// Verify cleanup safety
const safety = await convex.run("testDataCleanup:verifyCleanupSafety", {});

// Get comprehensive database state
const state = await convex.run("testDataCleanup:getDatabaseState", {});

// Delete all test data (safe operation)
const result = await convex.run("testDataCleanup:deleteAllTestData", {});
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
# Safe test data cleanup (recommended)
node scripts/test-runner.js --cleanup

# Check test data counts
npx convex run testDataCleanup:getTestDataCounts

# Verify cleanup safety
npx convex run testDataCleanup:verifyCleanupSafety

# Get comprehensive database state
npx convex run testDataCleanup:getDatabaseState

# Emergency: Clean all test data (safe operation)
npx convex run testDataCleanup:deleteAllTestData
```

### Recovery Commands

```bash
# Recover accidentally deleted user
npx convex run betaSignup:recoverDeletedUser --email "user@example.com" --userId "user_id" --name "User Name" --school "School" --subject "Subject"
```

## 🚨 Cleanup Rules

### 1. Test Data Identification
- **REQUIRED:** All test data must include `isTestData: true` flag
- **RECOMMENDED:** Use consistent test email patterns: `*@test.pelicanai.org`
- **OPTIONAL:** Include test timestamps for time-based cleanup
- **SAFETY:** Records without `isTestData` flag are considered real data

### 2. Data Isolation
- Test data must not interfere with production data
- Use separate test user accounts with proper flagging
- Isolate test email addresses
- **CRITICAL:** Only delete records with `isTestData: true`

### 3. Cleanup Timing
- **Before tests:** Remove all existing test data (flagged records only)
- **After tests:** Remove data created during current run
- **On failure:** Attempt cleanup, log failures, preserve real data

### 4. Safety Measures
- **Safety Verification:** Always check for real data before cleanup
- **Warning System:** Alert about records without test data flag
- **Graceful Degradation:** Continue test execution if cleanup fails
- **Recovery Capability:** Maintain ability to recover accidentally deleted data

### 5. Error Handling
- Continue test execution if cleanup fails
- Log cleanup failures for investigation
- Provide manual cleanup instructions
- **NEVER** delete records without `isTestData: true` flag

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
