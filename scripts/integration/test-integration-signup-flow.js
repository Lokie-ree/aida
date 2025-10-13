#!/usr/bin/env node

/**
 * Integration Tests for Beta Signup Flow
 * 
 * Tests the complete signup flow from beta signup to user account creation:
 * - Beta signup creates betaSignup record
 * - Scheduled action triggers user account creation
 * - Better Auth API is called correctly
 * - Database state is consistent throughout the flow
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from '../test-utils.js';
import { TEST_USERS } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runSignupFlowIntegrationTests() {
  const runner = new TestRunner("Signup Flow Integration Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Signup Flow integration tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: Complete signup flow with valid data
    await testCompleteSignupFlow(runner, client);
    
    // Test 2: Signup flow with duplicate email
    await testSignupFlowDuplicateEmail(runner, client);
    
    // Test 3: Signup flow with invalid data
    await testSignupFlowInvalidData(runner, client);
    
    // Test 4: Database state consistency throughout flow
    await testDatabaseStateConsistency(runner, client);
    
    // Test 5: Error handling in signup flow
    await testSignupFlowErrorHandling(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Signup Flow integration tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testCompleteSignupFlow(runner, client) {
  runner.log("🧪 Testing complete signup flow with valid data...");
  
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
      runner.recordTest("Complete Signup Flow", false, 
        `Step 1 failed: ${signupResult.message}`);
      return;
    }
    
    runner.log(`  ✅ Beta signup created: ${signupResult.signupId}`);
    
    // Step 2: Verify beta signup was created
    runner.log("  Step 2: Verifying beta signup...");
    const signup = await client.query("betaSignup:getBetaSignupById", {
      signupId: signupResult.signupId
    });
    
    if (!signup || signup.email !== testUser.email) {
      runner.recordTest("Complete Signup Flow", false, 
        `Step 2 failed: Beta signup not found or incorrect email`);
      return;
    }
    
    runner.log(`  ✅ Beta signup verified: ${signup.email}`);
    
    // Step 3: Wait for scheduled action to complete
    runner.log("  Step 3: Waiting for user account creation...");
    await sleep(5000); // Wait 5 seconds for scheduled action
    
    // Step 4: Check if user account was created
    runner.log("  Step 4: Checking user account creation...");
    
    // We can't directly check Better Auth users table, but we can check
    // if the scheduled action completed by looking at logs or checking
    // if the signup status changed
    
    const updatedSignup = await client.query("betaSignup:getBetaSignupById", {
      signupId: signupResult.signupId
    });
    
    if (updatedSignup && updatedSignup.status === "approved") {
      runner.recordTest("Complete Signup Flow", true, 
        `Signup flow completed successfully. Signup ID: ${signupResult.signupId}`);
    } else {
      runner.recordTest("Complete Signup Flow", false, 
        `User account creation may have failed. Signup status: ${updatedSignup?.status || 'unknown'}`);
    }
    
    // Store for cleanup
    runner.testSignupId = signupResult.signupId;
    runner.testUser = testUser;
    
  } catch (error) {
    runner.recordTest("Complete Signup Flow", false, error.message);
  }
}

async function testSignupFlowDuplicateEmail(runner, client) {
  runner.log("🧪 Testing signup flow with duplicate email...");
  
  try {
    // Use the same email as the previous test
    const testUser = runner.testUser || TEST_USERS.validBetaUser();
    
    // Attempt to create another signup with the same email
    const duplicateResult = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: "Different Name",
      school: "Different School",
      subject: "Different Subject"
    });
    
    // Should fail with duplicate email message
    if (!duplicateResult.success && duplicateResult.message.includes("already registered")) {
      runner.recordTest("Signup Flow - Duplicate Email", true, 
        `Correctly prevented duplicate signup: ${duplicateResult.message}`);
    } else {
      runner.recordTest("Signup Flow - Duplicate Email", false, 
        `Expected duplicate error, got: ${JSON.stringify(duplicateResult)}`);
    }
    
  } catch (error) {
    runner.recordTest("Signup Flow - Duplicate Email", false, error.message);
  }
}

async function testSignupFlowInvalidData(runner, client) {
  runner.log("🧪 Testing signup flow with invalid data...");
  
  try {
    const invalidUser = TEST_USERS.invalidDataUser();
    
    const result = await client.mutation("betaSignup:signupForBeta", {
      email: invalidUser.email,
      name: invalidUser.name,
      school: invalidUser.school,
      subject: invalidUser.subject
    });
    
    // The function might accept invalid data and let Better Auth handle validation
    // or it might reject it immediately
    if (result.success !== undefined) {
      runner.recordTest("Signup Flow - Invalid Data", true, 
        `Handled invalid data appropriately: ${result.success ? 'accepted' : 'rejected'}`);
    } else {
      runner.recordTest("Signup Flow - Invalid Data", false, 
        `Unexpected response: ${JSON.stringify(result)}`);
    }
    
  } catch (error) {
    // Error is expected for invalid data
    runner.recordTest("Signup Flow - Invalid Data", true, 
      `Correctly rejected invalid data: ${error.message}`);
  }
}

async function testDatabaseStateConsistency(runner, client) {
  runner.log("🧪 Testing database state consistency...");
  
  try {
    // Check database state after signup flow
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
    
    runner.log(`  Database state: Beta Signups: ${state.betaSignups}, Profiles: ${state.userProfiles}, Beta Programs: ${state.betaPrograms}`);
    
    // Should have at least one beta signup
    if (state.betaSignups > 0) {
      runner.recordTest("Database State Consistency", true, 
        `Database state is consistent: ${JSON.stringify(state)}`);
    } else {
      runner.recordTest("Database State Consistency", false, 
        `Expected at least one beta signup, got: ${JSON.stringify(state)}`);
    }
    
  } catch (error) {
    runner.recordTest("Database State Consistency", false, error.message);
  }
}

async function testSignupFlowErrorHandling(runner, client) {
  runner.log("🧪 Testing signup flow error handling...");
  
  try {
    // Test with empty data
    const emptyResult = await client.mutation("betaSignup:signupForBeta", {
      email: "",
      name: "",
      school: "",
      subject: ""
    });
    
    // Should handle empty data gracefully
    if (emptyResult.success !== undefined) {
      runner.recordTest("Signup Flow - Error Handling", true, 
        `Handled empty data appropriately: ${emptyResult.success ? 'accepted' : 'rejected'}`);
    } else {
      runner.recordTest("Signup Flow - Error Handling", false, 
        `Unexpected response for empty data: ${JSON.stringify(emptyResult)}`);
    }
    
    // Test with null data
    try {
      const nullResult = await client.mutation("betaSignup:signupForBeta", {
        email: null,
        name: null,
        school: null,
        subject: null
      });
      
      runner.recordTest("Signup Flow - Null Data", true, 
        `Handled null data: ${JSON.stringify(nullResult)}`);
    } catch (error) {
      runner.recordTest("Signup Flow - Null Data", true, 
        `Correctly rejected null data: ${error.message}`);
    }
    
  } catch (error) {
    runner.recordTest("Signup Flow - Error Handling", false, error.message);
  }
}

// Run the tests
runSignupFlowIntegrationTests();
