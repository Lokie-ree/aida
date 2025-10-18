# Data Recovery Guide

## Overview

This guide provides procedures for recovering accidentally deleted user data in the Pelican AI system. The recovery system is designed to restore user data while maintaining data integrity and preventing duplicate records.

## Recovery Scenarios

### Scenario 1: Accidental User Deletion
**When:** A user has been accidentally deleted from `betaSignups` and `betaProgram` tables
**Impact:** User loses access to their account and all associated data
**Recovery Time:** 5-10 minutes

### Scenario 2: Test Data Cleanup Gone Wrong
**When:** Real user data was deleted during test cleanup operations
**Impact:** Multiple users may be affected
**Recovery Time:** 15-30 minutes

### Scenario 3: Database Corruption
**When:** Database corruption or system failure causes data loss
**Impact:** Potentially all user data
**Recovery Time:** 1-2 hours

## Recovery Procedures

### Step 1: Assess the Damage

1. **Check Database State**
   ```bash
   # Run database state check
   node scripts/test-runner.js --cleanup
   ```

2. **Identify Affected Users**
   - Check user complaints or reports
   - Review database logs for deletion events
   - Use admin dashboard to identify missing users

3. **Verify Data Integrity**
   ```javascript
   // Use Convex MCP to check database state
   const state = await convex.run("testDataCleanup:getDatabaseState", {});
   console.log("Database state:", state);
   ```

### Step 2: Prepare Recovery Data

1. **Gather User Information**
   - User's email address
   - User's name
   - School and subject information
   - Original signup date (if available)
   - Any other relevant profile data

2. **Verify User Identity**
   - Confirm the user's identity through email verification
   - Check if user has any remaining data in the system
   - Verify the user was not intentionally removed

### Step 3: Execute Recovery

#### For Single User Recovery

1. **Create Better Auth User** (if needed)
   ```javascript
   // If user was deleted from Better Auth as well
   const userResult = await convex.run("auth:createUserDirectly", {
     email: "user@example.com",
     name: "User Name",
     password: "TempPassword123!"
   });
   ```

2. **Recover Beta Signup Data**
   ```javascript
   const recoveryResult = await convex.run("betaSignup:recoverDeletedUser", {
     email: "user@example.com",
     userId: "user_id_from_step_1",
     name: "User Name",
     school: "School Name",
     subject: "Subject",
     originalSignupDate: 1760727874763 // Original timestamp if available
   });
   ```

3. **Update User Profile** (if needed)
   ```javascript
   const profileResult = await convex.run("userProfiles:createUserProfileForUserId", {
     userId: "user_id_from_step_1",
     school: "School Name",
     subject: "Subject",
     role: "teacher",
     isTestData: false // Important: This is real user data
   });
   ```

#### For Multiple User Recovery

1. **Create Recovery Script**
   ```javascript
   // Create a script to recover multiple users
   const usersToRecover = [
     {
       email: "user1@example.com",
       name: "User One",
       school: "School One",
       subject: "Math"
     },
     // ... more users
   ];

   for (const user of usersToRecover) {
     // Recovery logic for each user
     await recoverUser(user);
   }
   ```

2. **Batch Recovery Process**
   - Process users in batches of 5-10
   - Verify each recovery before proceeding
   - Monitor system performance during recovery

### Step 4: Verify Recovery

1. **Check Data Integrity**
   ```javascript
   // Verify the recovered user data
   const userProfile = await convex.run("userProfiles:getUserProfile", {});
   const betaSignup = await convex.run("betaSignup:getBetaSignupById", {
     signupId: "recovered_signup_id"
   });
   ```

2. **Test User Access**
   - Verify user can log in
   - Check that all user data is accessible
   - Confirm user permissions are correct

3. **Update User**
   - Send recovery confirmation email
   - Provide new temporary password if needed
   - Explain what happened and what was restored

### Step 5: Post-Recovery Actions

1. **Update Documentation**
   - Record the incident in the changelog
   - Update recovery procedures if needed
   - Document lessons learned

2. **Prevent Future Incidents**
   - Review and improve test data cleanup procedures
   - Implement additional safety checks
   - Train team on proper data management

3. **Monitor System**
   - Watch for any issues with recovered users
   - Monitor system performance
   - Check for any data inconsistencies

## Recovery Tools

### Convex MCP Functions

#### `testDataCleanup:getDatabaseState`
- **Purpose:** Get comprehensive database state for debugging
- **Usage:** `convex.run("testDataCleanup:getDatabaseState", {})`
- **Returns:** Complete database state with counts and sample records

#### `testDataCleanup:verifyCleanupSafety`
- **Purpose:** Verify cleanup safety before executing deletion
- **Usage:** `convex.run("testDataCleanup:verifyCleanupSafety", {})`
- **Returns:** Safety verification with warnings about potential real data

#### `betaSignup:recoverDeletedUser`
- **Purpose:** Recover accidentally deleted user data
- **Usage:** `convex.run("betaSignup:recoverDeletedUser", { email, userId, name, school, subject, originalSignupDate })`
- **Returns:** Recovery result with created record IDs

### Command Line Tools

#### Database State Check
```bash
# Check current database state
node scripts/test-runner.js --cleanup
```

#### Test Data Cleanup
```bash
# Clean only test data (safe for real data)
node scripts/test-runner.js --cleanup
```

## Safety Guidelines

### Before Recovery
- [ ] Verify user identity through email confirmation
- [ ] Check if user data still exists in the system
- [ ] Confirm the user was not intentionally removed
- [ ] Backup current database state

### During Recovery
- [ ] Use recovery mutations, not direct database operations
- [ ] Set `isTestData: false` for all recovered data
- [ ] Verify each step before proceeding
- [ ] Monitor system performance

### After Recovery
- [ ] Test user access and functionality
- [ ] Verify data integrity
- [ ] Update user with recovery status
- [ ] Document the incident

## Emergency Contacts

### Development Team
- **Primary:** Development Team Lead
- **Secondary:** System Administrator
- **Escalation:** Project Manager

### Convex Support
- **Documentation:** [Convex Documentation](https://docs.convex.dev/)
- **Support:** [Convex Support](https://convex.dev/support)

## Prevention Measures

### Test Data Management
1. **Always use test fixtures** for creating test data
2. **Verify cleanup operations** before running them
3. **Use centralized cleanup functions** instead of manual deletion
4. **Check safety warnings** before proceeding with cleanup

### Data Protection
1. **Regular backups** of important data
2. **Test recovery procedures** regularly
3. **Monitor database state** during testing
4. **Train team** on proper data management

### Code Practices
1. **Use recovery mutations** instead of direct database operations
2. **Always set `isTestData` flag** appropriately
3. **Test data recovery** in development environment
4. **Document all data operations**

## Troubleshooting

### Common Issues

#### Recovery Mutation Fails
- **Cause:** User already exists or invalid parameters
- **Solution:** Check for existing records, verify parameters
- **Prevention:** Use proper duplicate checking

#### User Cannot Log In After Recovery
- **Cause:** Better Auth user not created or password issues
- **Solution:** Create Better Auth user first, then recover data
- **Prevention:** Follow complete recovery procedure

#### Data Inconsistencies
- **Cause:** Partial recovery or incorrect data
- **Solution:** Verify all related records are created
- **Prevention:** Use complete recovery procedures

### Error Messages

#### "User already exists in betaSignups table"
- **Meaning:** User data already exists, no recovery needed
- **Action:** Check if user can log in normally

#### "Failed to recover user data: [error]"
- **Meaning:** Recovery mutation failed
- **Action:** Check parameters, verify user doesn't exist, try again

#### "User must be authenticated"
- **Meaning:** Trying to use authenticated function without login
- **Action:** Use unauthenticated recovery functions instead

## Recovery Checklist

### Pre-Recovery
- [ ] User identity verified
- [ ] Recovery data gathered
- [ ] Database state checked
- [ ] Recovery plan documented

### During Recovery
- [ ] Better Auth user created (if needed)
- [ ] Beta signup data recovered
- [ ] User profile created/updated
- [ ] All data verified

### Post-Recovery
- [ ] User access tested
- [ ] Data integrity verified
- [ ] User notified
- [ ] Incident documented
- [ ] Prevention measures reviewed

## Related Documentation

- **ADR-010:** Test Data Isolation and Recovery System
- **Test Data Cleanup Protocol:** `scripts/test-data-cleanup-protocol.md`
- **Convex Schema:** `convex/schema.ts`
- **Recovery Mutations:** `convex/betaSignup.ts`
- **Cleanup System:** `convex/testDataCleanup.ts`
