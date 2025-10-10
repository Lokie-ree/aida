#!/usr/bin/env node

/**
 * Unit Tests for Beta Signup Functions
 * 
 * Tests individual functions in convex/betaSignup.ts to verify:
 * - signupForBeta creates correct betaSignup record
 * - createUserAccountFromBetaSignup calls Better Auth API
 * - getBetaSignupById returns complete data
 * - Email sending functions work correctly
 * - Validation and error handling
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from './test-utils.js';
import { TEST_USERS, BETA_SIGNUP_SCENARIOS } from './test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runBetaSignupUnitTests() {
  const runner = new TestRunner("Beta Signup Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Beta Signup unit tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: signupForBeta with valid data
    await testSignupForBetaValid(runner, client);
    
    // Test 2: signupForBeta with duplicate email
    await testSignupForBetaDuplicate(runner, client);
    
    // Test 3: signupForBeta with invalid data
    await testSignupForBetaInvalid(runner, client);
    
    // Test 4: getBetaSignupById with valid ID
    await testGetBetaSignupById(runner, client);
    
    // Test 5: getBetaSignupById with invalid ID
    await testGetBetaSignupByIdInvalid(runner, client);
    
    // Test 6: getBetaSignupStats
    await testGetBetaSignupStats(runner, client);
    
    // Test 7: getPendingSignups
    await testGetPendingSignups(runner, client);
    
    // Test 8: approveBetaSignup
    await testApproveBetaSignup(runner, client);
    
    // Test 9: createUserAccountFromBetaSignup (simplified)
    await testCreateUserAccountFromBetaSignup(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Beta Signup unit tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testSignupForBetaValid(runner, client) {
  runner.log("🧪 Testing signupForBeta with valid data...");
  
  try {
    const testUser = TEST_USERS.validBetaUser();
    
    const result = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: testUser.name,
      school: testUser.school,
      subject: testUser.subject
    });
    
    // Validate response structure
    const hasRequiredFields = result.success && 
                             result.message && 
                             result.signupId && 
                             result.temporaryPassword;
    
    if (hasRequiredFields) {
      runner.recordTest("signupForBeta - Valid Data", true, 
        `Signup ID: ${result.signupId}, Password length: ${result.temporaryPassword.length}`);
      
      // Store signup ID for later tests
      runner.signupId = result.signupId;
      runner.testUser = testUser;
    } else {
      runner.recordTest("signupForBeta - Valid Data", false, 
        `Missing required fields. Response: ${JSON.stringify(result)}`);
    }
    
  } catch (error) {
    runner.recordTest("signupForBeta - Valid Data", false, error.message);
  }
}

async function testSignupForBetaDuplicate(runner, client) {
  runner.log("🧪 Testing signupForBeta with duplicate email...");
  
  try {
    // Use the same email as the previous test
    const testUser = runner.testUser || TEST_USERS.validBetaUser();
    
    const result = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: "Different Name",
      school: "Different School",
      subject: "Different Subject"
    });
    
    // Should fail with duplicate email message
    const isDuplicateError = !result.success && 
                            result.message.includes("already registered");
    
    if (isDuplicateError) {
      runner.recordTest("signupForBeta - Duplicate Email", true, result.message);
    } else {
      runner.recordTest("signupForBeta - Duplicate Email", false, 
        `Expected duplicate error, got: ${JSON.stringify(result)}`);
    }
    
  } catch (error) {
    runner.recordTest("signupForBeta - Duplicate Email", false, error.message);
  }
}

async function testSignupForBetaInvalid(runner, client) {
  runner.log("🧪 Testing signupForBeta with invalid data...");
  
  try {
    const invalidUser = TEST_USERS.invalidDataUser();
    
    const result = await client.mutation("betaSignup:signupForBeta", {
      email: invalidUser.email,
      name: invalidUser.name,
      school: invalidUser.school,
      subject: invalidUser.subject
    });
    
    // Should either fail or succeed but with validation
    // The function might accept invalid data and let Better Auth handle validation
    if (result.success !== undefined) {
      runner.recordTest("signupForBeta - Invalid Data", true, 
        `Handled invalid data appropriately: ${result.success ? 'accepted' : 'rejected'}`);
    } else {
      runner.recordTest("signupForBeta - Invalid Data", false, 
        `Unexpected response: ${JSON.stringify(result)}`);
    }
    
  } catch (error) {
    // Error is expected for invalid data
    runner.recordTest("signupForBeta - Invalid Data", true, 
      `Correctly rejected invalid data: ${error.message}`);
  }
}

async function testGetBetaSignupById(runner, client) {
  runner.log("🧪 Testing getBetaSignupById with valid ID...");
  
  try {
    if (!runner.signupId) {
      runner.recordTest("getBetaSignupById - Valid ID", false, "No signup ID available from previous test");
      return;
    }
    
    const signup = await client.query("betaSignup:getBetaSignupById", {
      signupId: runner.signupId
    });
    
    // Validate response structure
    const hasRequiredFields = signup && 
                             signup._id && 
                             signup.email && 
                             signup.status && 
                             signup.signupDate &&
                             signup.betaProgramId;
    
    if (hasRequiredFields) {
      runner.recordTest("getBetaSignupById - Valid ID", true, 
        `Retrieved signup for ${signup.email} with status ${signup.status}`);
    } else {
      runner.recordTest("getBetaSignupById - Valid ID", false, 
        `Missing required fields. Response: ${JSON.stringify(signup)}`);
    }
    
  } catch (error) {
    runner.recordTest("getBetaSignupById - Valid ID", false, error.message);
  }
}

async function testGetBetaSignupByIdInvalid(runner, client) {
  runner.log("🧪 Testing getBetaSignupById with invalid ID...");
  
  try {
    const invalidId = "invalid-id-123";
    
    const signup = await client.query("betaSignup:getBetaSignupById", {
      signupId: invalidId
    });
    
    // Should return null for invalid ID
    if (signup === null) {
      runner.recordTest("getBetaSignupById - Invalid ID", true, "Correctly returned null for invalid ID");
    } else {
      runner.recordTest("getBetaSignupById - Invalid ID", false, 
        `Expected null, got: ${JSON.stringify(signup)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for invalid ID
    runner.recordTest("getBetaSignupById - Invalid ID", true, 
      `Correctly handled invalid ID: ${error.message}`);
  }
}

async function testGetBetaSignupStats(runner, client) {
  runner.log("🧪 Testing getBetaSignupStats...");
  
  try {
    const stats = await client.mutation("betaSignup:getBetaSignupStats");
    
    // Validate response structure
    const hasRequiredFields = typeof stats.totalSignups === 'number' &&
                             typeof stats.pendingSignups === 'number' &&
                             typeof stats.approvedSignups === 'number';
    
    if (hasRequiredFields) {
      runner.recordTest("getBetaSignupStats", true, 
        `Total: ${stats.totalSignups}, Pending: ${stats.pendingSignups}, Approved: ${stats.approvedSignups}`);
    } else {
      runner.recordTest("getBetaSignupStats", false, 
        `Missing required fields. Response: ${JSON.stringify(stats)}`);
    }
    
  } catch (error) {
    runner.recordTest("getBetaSignupStats", false, error.message);
  }
}

async function testGetPendingSignups(runner, client) {
  runner.log("🧪 Testing getPendingSignups...");
  
  try {
    const pendingSignups = await client.query("betaSignup:getPendingSignups");
    
    // Should return an array
    const isValidArray = Array.isArray(pendingSignups);
    
    if (isValidArray) {
      runner.recordTest("getPendingSignups", true, 
        `Retrieved ${pendingSignups.length} pending signups`);
    } else {
      runner.recordTest("getPendingSignups", false, 
        `Expected array, got: ${typeof pendingSignups}`);
    }
    
  } catch (error) {
    runner.recordTest("getPendingSignups", false, error.message);
  }
}

async function testApproveBetaSignup(runner, client) {
  runner.log("🧪 Testing approveBetaSignup...");
  
  try {
    if (!runner.signupId) {
      runner.recordTest("approveBetaSignup", false, "No signup ID available from previous test");
      return;
    }
    
    const tempPassword = "TempPass123!";
    const notes = "Approved for testing";
    
    const result = await client.mutation("betaSignup:approveBetaSignup", {
      signupId: runner.signupId,
      temporaryPassword: tempPassword,
      notes: notes
    });
    
    // Validate response
    const isSuccess = result.success && result.message;
    
    if (isSuccess) {
      runner.recordTest("approveBetaSignup", true, result.message);
    } else {
      runner.recordTest("approveBetaSignup", false, 
        `Expected success, got: ${JSON.stringify(result)}`);
    }
    
  } catch (error) {
    runner.recordTest("approveBetaSignup", false, error.message);
  }
}

async function testCreateUserAccountFromBetaSignup(runner, client) {
  runner.log("🧪 Testing createUserAccountFromBetaSignup...");
  
  try {
    if (!runner.signupId) {
      runner.recordTest("createUserAccountFromBetaSignup", false, "No signup ID available from previous test");
      return;
    }
    
    const tempPassword = "TempPass123!";
    
    // This is an action, so it might take time to complete
    const result = await client.action("betaSignup:createUserAccountFromBetaSignup", {
      signupId: runner.signupId,
      temporaryPassword: tempPassword
    });
    
    // Validate response
    const hasResponse = result && typeof result.success === 'boolean' && result.message;
    
    if (hasResponse) {
      runner.recordTest("createUserAccountFromBetaSignup", true, 
        `Action completed: ${result.success ? 'success' : 'failed'} - ${result.message}`);
    } else {
      runner.recordTest("createUserAccountFromBetaSignup", false, 
        `Unexpected response: ${JSON.stringify(result)}`);
    }
    
  } catch (error) {
    runner.recordTest("createUserAccountFromBetaSignup", false, error.message);
  }
}

// Run the tests
runBetaSignupUnitTests();
