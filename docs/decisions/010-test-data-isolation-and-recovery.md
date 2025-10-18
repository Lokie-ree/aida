# ADR-010: Test Data Isolation and Recovery System

**Date:** 2025-10-18
**Status:** ✅ **ACCEPTED**
**Deciders:** Development Team, Security Team
**Related Issues:** Accidental user data deletion, test data cleanup inconsistencies

---

## Context

During development and testing, we encountered several critical issues:

1. **Accidental Data Deletion:** A beta user was accidentally deleted from both `betaSignups` and `betaProgram` tables during manual database operations
2. **Inconsistent Test Data Cleanup:** The existing test data cleanup process was not flawless, leading to potential data loss
3. **No Data Recovery Mechanism:** No systematic way to recover accidentally deleted user data
4. **Mixed Test/Production Data:** Test data and real user data were not clearly isolated in the development database

The project uses a single Convex development deployment for both development and testing, which requires careful data management to prevent accidental deletion of real user data.

## Decision

We will implement a comprehensive test data isolation and recovery system with the following components:

### 1. Schema-Level Test Data Flag
- Add `isTestData: v.optional(v.boolean())` field to all application tables
- This field will be `true` for test data, `false` or `undefined` for real data
- Backward compatible - existing data remains unaffected

### 2. Centralized Test Data Cleanup System
- Create `convex/testDataCleanup.ts` with centralized cleanup functions
- Only delete records with `isTestData: true` flag
- Provide safety warnings for records without the flag
- Include comprehensive database state debugging tools

### 3. Enhanced Mutation Functions
- Update all mutation functions to accept optional `isTestData` parameter
- Automatically set the flag based on the parameter value
- Maintain backward compatibility with existing code

### 4. Test Fixtures Enhancement
- Update `scripts/test-fixtures.js` to set `isTestData: true` for all test data
- Ensure all test data creation functions properly flag test records

### 5. Data Recovery System
- Create recovery mutations for accidentally deleted user data
- Implement user data restoration procedures
- Document recovery workflows for future incidents

### 6. Enhanced Test Runner
- Update `scripts/test-runner.js` to use centralized cleanup system
- Provide detailed cleanup reporting and safety warnings
- Integrate with existing test workflow

## Consequences

### Positive Consequences
- **Data Safety:** Real user data is protected from accidental deletion during testing
- **Clear Isolation:** Test data is clearly identified and can be safely managed
- **Recovery Capability:** Accidental deletions can be systematically recovered
- **Improved Testing:** More reliable and safer testing environment
- **Better Debugging:** Comprehensive database state inspection tools
- **Backward Compatibility:** Existing data and code remain unaffected

### Negative Consequences
- **Schema Changes:** All application tables now have an additional optional field
- **Code Updates:** Mutation functions require updates to handle the new parameter
- **Test Data Management:** All test data must be properly flagged
- **Learning Curve:** Team needs to understand the new test data management patterns

### Risks and Mitigations
- **Risk:** Forgetting to set `isTestData: true` for test data
  - **Mitigation:** Updated test fixtures automatically set the flag
- **Risk:** Accidentally deleting real data during cleanup
  - **Mitigation:** Cleanup system only deletes flagged test data and provides warnings
- **Risk:** Performance impact of additional field
  - **Mitigation:** Optional field with minimal storage overhead

## Alternatives Considered

### Alternative 1: Separate Development and Production Deployments
- **Description:** Create separate Convex projects for development and production
- **Rejected Because:** 
  - Higher complexity and cost
  - Current single deployment works well for the project size
  - Team prefers simpler deployment model

### Alternative 2: Email Pattern-Based Test Data Identification
- **Description:** Use email patterns (e.g., `*@test.pelicanai.org`) to identify test data
- **Rejected Because:**
  - Less reliable than explicit flags
  - Could conflict with real user email patterns
  - Harder to manage and debug

### Alternative 3: Separate Test Tables
- **Description:** Create separate tables for test data (e.g., `test_betaSignups`)
- **Rejected Because:**
  - Duplicates schema maintenance
  - Complex data management
  - Harder to test with realistic data structures

### Alternative 4: No Changes (Status Quo)
- **Description:** Continue with current test data management approach
- **Rejected Because:**
  - Risk of accidental data deletion remains high
  - No recovery mechanism for lost data
  - Inconsistent cleanup process

## Implementation Details

### Schema Changes
```typescript
// Added to all application tables
isTestData: v.optional(v.boolean()), // NEW: Flag for test data isolation
```

### Centralized Cleanup Functions
- `deleteAllTestData()` - Safely deletes only test data
- `getTestDataCounts()` - Shows test data counts per table
- `verifyCleanupSafety()` - Warns about potential real data
- `getDatabaseState()` - Comprehensive debugging information

### Recovery Mutations
- `recoverDeletedUser()` - Restores accidentally deleted user data
- Bypasses normal duplicate checks for recovery scenarios
- Creates both `betaSignups` and `betaProgram` records

### Test Data Creation Pattern
```typescript
// All test data creation functions now include:
isTestData: true // NEW: Mark all test data for isolation
```

## Monitoring and Success Metrics

### Success Metrics
- **Zero Accidental Deletions:** No real user data deleted during testing
- **100% Test Data Cleanup:** All test data properly identified and cleanable
- **Recovery Success:** Accidental deletions can be fully recovered
- **Test Reliability:** Test suite runs consistently without data conflicts

### Monitoring
- Regular cleanup verification runs
- Database state monitoring
- Test data accumulation tracking
- Recovery procedure testing

## Future Considerations

### Phase 2 Enhancements
- Automated test data generation with proper flagging
- Test data lifecycle management
- Integration with CI/CD pipeline cleanup

### Production Deployment
- Consider separate staging deployment for production testing
- Implement data migration strategies for production deployment
- Establish production data backup and recovery procedures

## References

- **Convex Best Practices:** [Convex Documentation](https://docs.convex.dev/)
- **Test Data Management:** `scripts/test-data-cleanup-protocol.md`
- **Schema Definition:** `convex/schema.ts`
- **Cleanup Implementation:** `convex/testDataCleanup.ts`
- **Recovery Procedures:** `docs/DATA-RECOVERY-GUIDE.md` (to be created)
