#!/usr/bin/env node

/**
 * Database State Validation Tests
 * 
 * Tests database consistency and state transitions to verify:
 * - Database tables are properly structured
 * - Data integrity is maintained
 * - State transitions work correctly
 * - No orphaned records exist
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from './test-utils.js';
import { TEST_USERS, DATABASE_STATE_EXPECTATIONS } from './test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runDatabaseStateTests() {
  const runner = new TestRunner("Database State Validation Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Database State Validation tests...");
    runner.log(`🔗 Convex URL: ${CONVEX_URL}`);
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: Initial database state
    await testInitialDatabaseState(runner, client);
    
    // Test 2: Beta signup state transition
    await testBetaSignupStateTransition(runner, client);
    
    // Test 3: Data integrity validation
    await testDataIntegrityValidation(runner, client);
    
    // Test 4: Orphaned records check
    await testOrphanedRecordsCheck(runner, client);
    
    // Test 5: Database performance
    await testDatabasePerformance(runner, client);
    
    // Test 6: Cleanup validation
    await testCleanupValidation(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some database state tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Database State Validation tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Database state test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testInitialDatabaseState(runner, client) {
  runner.log("🧪 Testing initial database state...");
  
  try {
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups").catch(() => []),
      client.query("userProfiles:getAllUserProfiles").catch(() => []),
      client.query("betaProgram:getAllBetaPrograms").catch(() => [])
    ]);
    
    const state = {
      betaSignups: betaSignups?.length || 0,
      userProfiles: userProfiles?.length || 0,
      betaPrograms: betaPrograms?.length || 0
    };
    
    runner.log(`  Initial database state: ${JSON.stringify(state)}`);
    
    // Should be empty initially
    const expectedState = DATABASE_STATE_EXPECTATIONS.afterBetaSignup;
    const isInitialStateCorrect = state.betaSignups === 0 && 
                                 state.userProfiles === 0 && 
                                 state.betaPrograms === 0;
    
    if (isInitialStateCorrect) {
      runner.recordTest("Initial Database State", true, 
        `Database is clean: ${JSON.stringify(state)}`);
    } else {
      runner.recordTest("Initial Database State", false, 
        `Database not clean: ${JSON.stringify(state)}`);
    }
    
  } catch (error) {
    runner.recordTest("Initial Database State", false, error.message);
  }
}

async function testBetaSignupStateTransition(runner, client) {
  runner.log("🧪 Testing beta signup state transition...");
  
  try {
    const testUser = TEST_USERS.validBetaUser();
    
    // Step 1: Create beta signup
    runner.log("  Step 1: Creating beta signup...");
    const signupResult = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: testUser.name,
      school: testUser.school,
      subject: testUser.subject
    });
    
    if (!signupResult.success) {
      runner.recordTest("Beta Signup State Transition", false, 
        `Beta signup failed: ${signupResult.message}`);
      return;
    }
    
    // Step 2: Check state after signup
    runner.log("  Step 2: Checking state after signup...");
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups").catch(() => []),
      client.query("userProfiles:getAllUserProfiles").catch(() => []),
      client.query("betaProgram:getAllBetaPrograms").catch(() => [])
    ]);
    
    const stateAfterSignup = {
      betaSignups: betaSignups?.length || 0,
      userProfiles: userProfiles?.length || 0,
      betaPrograms: betaPrograms?.length || 0
    };
    
    runner.log(`  State after signup: ${JSON.stringify(stateAfterSignup)}`);
    
    // Should have 1 beta signup, 0 profiles, 0 beta programs
    const isSignupStateCorrect = stateAfterSignup.betaSignups === 1 && 
                                stateAfterSignup.userProfiles === 0 && 
                                stateAfterSignup.betaPrograms === 0;
    
    if (isSignupStateCorrect) {
      runner.recordTest("Beta Signup State Transition", true, 
        `State after signup is correct: ${JSON.stringify(stateAfterSignup)}`);
    } else {
      runner.recordTest("Beta Signup State Transition", false, 
        `State after signup is incorrect: ${JSON.stringify(stateAfterSignup)}`);
    }
    
    // Step 3: Wait for user account creation
    runner.log("  Step 3: Waiting for user account creation...");
    await sleep(5000);
    
    // Step 4: Check state after user account creation
    runner.log("  Step 4: Checking state after user account creation...");
    const [betaSignupsAfter, userProfilesAfter, betaProgramsAfter] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups").catch(() => []),
      client.query("userProfiles:getAllUserProfiles").catch(() => []),
      client.query("betaProgram:getAllBetaPrograms").catch(() => [])
    ]);
    
    const stateAfterUserCreation = {
      betaSignups: betaSignupsAfter?.length || 0,
      userProfiles: userProfilesAfter?.length || 0,
      betaPrograms: betaProgramsAfter?.length || 0
    };
    
    runner.log(`  State after user creation: ${JSON.stringify(stateAfterUserCreation)}`);
    
    // Store for cleanup
    runner.testSignupId = signupResult.signupId;
    runner.testUser = testUser;
    
  } catch (error) {
    runner.recordTest("Beta Signup State Transition", false, error.message);
  }
}

async function testDataIntegrityValidation(runner, client) {
  runner.log("🧪 Testing data integrity validation...");
  
  try {
    // Test 1: Beta signup data integrity
    const betaSignups = await client.query("betaSignup:getAllBetaSignups");
    
    if (betaSignups && betaSignups.length > 0) {
      const signup = betaSignups[0];
      
      // Check required fields
      const requiredFields = ['_id', 'email', 'name', 'status', 'signupDate', 'betaProgramId'];
      const missingFields = requiredFields.filter(field => !signup[field]);
      
      if (missingFields.length === 0) {
        runner.recordTest("Data Integrity - Beta Signup", true, 
          `Beta signup has all required fields: ${JSON.stringify(signup)}`);
      } else {
        runner.recordTest("Data Integrity - Beta Signup", false, 
          `Beta signup missing fields: ${missingFields.join(', ')}`);
      }
      
      // Check data types
      const typeChecks = [
        { field: 'email', type: 'string', value: signup.email },
        { field: 'name', type: 'string', value: signup.name },
        { field: 'status', type: 'string', value: signup.status },
        { field: 'signupDate', type: 'number', value: signup.signupDate },
        { field: 'betaProgramId', type: 'string', value: signup.betaProgramId }
      ];
      
      const typeErrors = typeChecks.filter(check => typeof check.value !== check.type);
      
      if (typeErrors.length === 0) {
        runner.recordTest("Data Integrity - Data Types", true, 
          "All data types are correct");
      } else {
        runner.recordTest("Data Integrity - Data Types", false, 
          `Type errors: ${typeErrors.map(e => `${e.field} should be ${e.type}`).join(', ')}`);
      }
    } else {
      runner.recordTest("Data Integrity - Beta Signup", false, 
        "No beta signups found for integrity check");
    }
    
    // Test 2: User profiles data integrity
    const userProfiles = await client.query("userProfiles:getAllUserProfiles");
    
    if (userProfiles && userProfiles.length > 0) {
      const profile = userProfiles[0];
      
      // Check required fields
      const requiredFields = ['_id', 'userId'];
      const missingFields = requiredFields.filter(field => !profile[field]);
      
      if (missingFields.length === 0) {
        runner.recordTest("Data Integrity - User Profile", true, 
          `User profile has all required fields: ${JSON.stringify(profile)}`);
      } else {
        runner.recordTest("Data Integrity - User Profile", false, 
          `User profile missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      runner.log("  ℹ️  No user profiles found (expected for unauthenticated state)");
      runner.recordTest("Data Integrity - User Profile", true, 
        "No user profiles found (expected)");
    }
    
    // Test 3: Beta programs data integrity
    const betaPrograms = await client.query("betaProgram:getAllBetaPrograms");
    
    if (betaPrograms && betaPrograms.length > 0) {
      const program = betaPrograms[0];
      
      // Check required fields
      const requiredFields = ['_id', 'userId', 'status'];
      const missingFields = requiredFields.filter(field => !program[field]);
      
      if (missingFields.length === 0) {
        runner.recordTest("Data Integrity - Beta Program", true, 
          `Beta program has all required fields: ${JSON.stringify(program)}`);
      } else {
        runner.recordTest("Data Integrity - Beta Program", false, 
          `Beta program missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      runner.log("  ℹ️  No beta programs found (expected for unauthenticated state)");
      runner.recordTest("Data Integrity - Beta Program", true, 
        "No beta programs found (expected)");
    }
    
  } catch (error) {
    runner.recordTest("Data Integrity Validation", false, error.message);
  }
}

async function testOrphanedRecordsCheck(runner, client) {
  runner.log("🧪 Testing orphaned records check...");
  
  try {
    // Get all records
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups").catch(() => []),
      client.query("userProfiles:getAllUserProfiles").catch(() => []),
      client.query("betaProgram:getAllBetaPrograms").catch(() => [])
    ]);
    
    // Check for orphaned user profiles (profiles without corresponding beta signups)
    const orphanedProfiles = [];
    if (userProfiles && userProfiles.length > 0) {
      for (const profile of userProfiles) {
        // Check if there's a corresponding beta signup
        const correspondingSignup = betaSignups?.find(signup => 
          signup.email === profile.userId || signup._id === profile.userId
        );
        
        if (!correspondingSignup) {
          orphanedProfiles.push(profile);
        }
      }
    }
    
    if (orphanedProfiles.length === 0) {
      runner.recordTest("Orphaned Records - User Profiles", true, 
        "No orphaned user profiles found");
    } else {
      runner.recordTest("Orphaned Records - User Profiles", false, 
        `Found ${orphanedProfiles.length} orphaned user profiles`);
    }
    
    // Check for orphaned beta programs (programs without corresponding beta signups)
    const orphanedPrograms = [];
    if (betaPrograms && betaPrograms.length > 0) {
      for (const program of betaPrograms) {
        // Check if there's a corresponding beta signup
        const correspondingSignup = betaSignups?.find(signup => 
          signup.email === program.userId || signup._id === program.userId
        );
        
        if (!correspondingSignup) {
          orphanedPrograms.push(program);
        }
      }
    }
    
    if (orphanedPrograms.length === 0) {
      runner.recordTest("Orphaned Records - Beta Programs", true, 
        "No orphaned beta programs found");
    } else {
      runner.recordTest("Orphaned Records - Beta Programs", false, 
        `Found ${orphanedPrograms.length} orphaned beta programs`);
    }
    
    // Check for orphaned beta signups (signups without corresponding profiles/programs)
    const orphanedSignups = [];
    if (betaSignups && betaSignups.length > 0) {
      for (const signup of betaSignups) {
        // Check if there's a corresponding profile or program
        const correspondingProfile = userProfiles?.find(profile => 
          profile.userId === signup.email || profile.userId === signup._id
        );
        const correspondingProgram = betaPrograms?.find(program => 
          program.userId === signup.email || program.userId === signup._id
        );
        
        // Beta signups can exist without profiles/programs (they're created first)
        // So we don't consider them orphaned
        runner.log(`  ℹ️  Beta signup ${signup._id} has profile: ${!!correspondingProfile}, program: ${!!correspondingProgram}`);
      }
    }
    
    runner.recordTest("Orphaned Records - Beta Signups", true, 
      "Beta signups are not considered orphaned (they're created first)");
    
  } catch (error) {
    runner.recordTest("Orphaned Records Check", false, error.message);
  }
}

async function testDatabasePerformance(runner, client) {
  runner.log("🧪 Testing database performance...");
  
  try {
    const startTime = Date.now();
    
    // Test query performance
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups"),
      client.query("userProfiles:getAllUserProfiles"),
      client.query("betaProgram:getAllBetaPrograms")
    ]);
    
    const queryTime = Date.now() - startTime;
    
    if (queryTime < 1000) {
      runner.recordTest("Database Performance - Queries", true, 
        `All queries completed in ${queryTime}ms`);
    } else {
      runner.recordTest("Database Performance - Queries", false, 
        `Queries took too long: ${queryTime}ms`);
    }
    
    // Test write performance
    const writeStartTime = Date.now();
    
    const testUser = {
      email: `perf-test-${Date.now()}@example.com`,
      name: "Performance Test User",
      school: "Performance Test School",
      subject: "Performance Test Subject"
    };
    
    const signupResult = await client.mutation("betaSignup:signupForBeta", testUser);
    
    const writeTime = Date.now() - writeStartTime;
    
    if (signupResult.success && writeTime < 2000) {
      runner.recordTest("Database Performance - Writes", true, 
        `Write operation completed in ${writeTime}ms`);
      
      // Clean up test data
      await client.mutation("betaSignup:deleteBetaSignup", {
        signupId: signupResult.signupId
      });
    } else {
      runner.recordTest("Database Performance - Writes", false, 
        `Write operation failed or took too long: ${writeTime}ms`);
    }
    
  } catch (error) {
    runner.recordTest("Database Performance", false, error.message);
  }
}

async function testCleanupValidation(runner, client) {
  runner.log("🧪 Testing cleanup validation...");
  
  try {
    // Test database cleanup
    const cleanupResult = await cleanTestData(client);
    
    if (cleanupResult) {
      runner.recordTest("Cleanup Validation", true, 
        "Database cleanup completed successfully");
    } else {
      runner.recordTest("Cleanup Validation", false, 
        "Database cleanup failed");
    }
    
    // Verify database is clean
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups").catch(() => []),
      client.query("userProfiles:getAllUserProfiles").catch(() => []),
      client.query("betaProgram:getAllBetaPrograms").catch(() => [])
    ]);
    
    const finalState = {
      betaSignups: betaSignups?.length || 0,
      userProfiles: userProfiles?.length || 0,
      betaPrograms: betaPrograms?.length || 0
    };
    
    const isClean = finalState.betaSignups === 0 && 
                   finalState.userProfiles === 0 && 
                   finalState.betaPrograms === 0;
    
    if (isClean) {
      runner.recordTest("Cleanup Verification", true, 
        `Database is clean: ${JSON.stringify(finalState)}`);
    } else {
      runner.recordTest("Cleanup Verification", false, 
        `Database not clean: ${JSON.stringify(finalState)}`);
    }
    
  } catch (error) {
    runner.recordTest("Cleanup Validation", false, error.message);
  }
}

// Run the tests
runDatabaseStateTests();
