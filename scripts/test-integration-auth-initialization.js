#!/usr/bin/env node

/**
 * Integration Tests for Authentication Initialization
 * 
 * Tests the authentication to profile initialization flow:
 * - User authentication with Better Auth
 * - Profile initialization after authentication
 * - Beta program initialization
 * - Database state consistency
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from './test-utils.js';
import { TEST_USERS } from './test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runAuthInitializationIntegrationTests() {
  const runner = new TestRunner("Auth Initialization Integration Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Auth Initialization integration tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: Authentication flow simulation
    await testAuthenticationFlowSimulation(runner, client);
    
    // Test 2: Profile initialization flow
    await testProfileInitializationFlow(runner, client);
    
    // Test 3: Beta program initialization flow
    await testBetaProgramInitializationFlow(runner, client);
    
    // Test 4: Complete initialization flow
    await testCompleteInitializationFlow(runner, client);
    
    // Test 5: Error handling in initialization
    await testInitializationErrorHandling(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Auth Initialization integration tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testAuthenticationFlowSimulation(runner, client) {
  runner.log("🧪 Testing authentication flow simulation...");
  
  try {
    // Create a beta signup first
    const testUser = TEST_USERS.validBetaUser();
    
    const signupResult = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: testUser.name,
      school: testUser.school,
      subject: testUser.subject
    });
    
    if (!signupResult.success) {
      runner.recordTest("Auth Flow Simulation", false, 
        `Failed to create beta signup: ${signupResult.message}`);
      return;
    }
    
    // Wait for user account creation
    await sleep(3000);
    
    // Test Better Auth endpoints directly
    const baseUrl = CONVEX_URL.replace('/api', '');
    const signinUrl = `${baseUrl}/api/auth/sign-in/email`;
    
    runner.log(`  Testing Better Auth signin endpoint: ${signinUrl}`);
    
    try {
      const response = await fetch(signinUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: signupResult.temporaryPassword
        })
      });
      
      if (response.ok) {
        const authData = await response.json();
        runner.recordTest("Auth Flow Simulation", true, 
          `Better Auth signin successful: ${JSON.stringify(authData)}`);
      } else {
        const errorText = await response.text();
        runner.recordTest("Auth Flow Simulation", false, 
          `Better Auth signin failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      runner.recordTest("Auth Flow Simulation", false, 
        `Better Auth signin error: ${error.message}`);
    }
    
    // Store for other tests
    runner.testUser = testUser;
    runner.testSignupId = signupResult.signupId;
    
  } catch (error) {
    runner.recordTest("Auth Flow Simulation", false, error.message);
  }
}

async function testProfileInitializationFlow(runner, client) {
  runner.log("🧪 Testing profile initialization flow...");
  
  try {
    // Test profile initialization without authentication
    // (This should fail as expected)
    const profileResult = await client.mutation("userProfiles:initializeNewUser");
    
    if (profileResult && !profileResult.success && 
        profileResult.message.includes("authenticated")) {
      runner.recordTest("Profile Initialization Flow", true, 
        `Correctly requires authentication: ${profileResult.message}`);
    } else {
      runner.recordTest("Profile Initialization Flow", false, 
        `Expected authentication error, got: ${JSON.stringify(profileResult)}`);
    }
    
    // Test that we can query profile functions
    const profile = await client.query("userProfiles:getUserProfile");
    
    if (profile === null) {
      runner.recordTest("Profile Query - Unauthenticated", true, 
        "Profile query correctly returns null when not authenticated");
    } else {
      runner.recordTest("Profile Query - Unauthenticated", false, 
        `Expected null, got: ${JSON.stringify(profile)}`);
    }
    
  } catch (error) {
    runner.recordTest("Profile Initialization Flow", false, error.message);
  }
}

async function testBetaProgramInitializationFlow(runner, client) {
  runner.log("🧪 Testing beta program initialization flow...");
  
  try {
    // Test beta program initialization without authentication
    // (This should fail as expected)
    try {
      const betaResult = await client.mutation("betaProgram:initializeBetaProgram");
      runner.recordTest("Beta Program Initialization Flow", false, 
        `Expected authentication error, got result: ${JSON.stringify(betaResult)}`);
    } catch (error) {
      const isAuthError = error.message.includes("authenticated") || 
                         error.message.includes("User must be authenticated");
      
      if (isAuthError) {
        runner.recordTest("Beta Program Initialization Flow", true, 
          `Correctly requires authentication: ${error.message}`);
      } else {
        runner.recordTest("Beta Program Initialization Flow", false, 
          `Unexpected error: ${error.message}`);
      }
    }
    
    // Test that we can query beta program functions
    const betaStatus = await client.query("betaProgram:getBetaStatus");
    
    if (betaStatus === null) {
      runner.recordTest("Beta Program Query - Unauthenticated", true, 
        "Beta program query correctly returns null when not authenticated");
    } else {
      runner.recordTest("Beta Program Query - Unauthenticated", false, 
        `Expected null, got: ${JSON.stringify(betaStatus)}`);
    }
    
  } catch (error) {
    runner.recordTest("Beta Program Initialization Flow", false, error.message);
  }
}

async function testCompleteInitializationFlow(runner, client) {
  runner.log("🧪 Testing complete initialization flow...");
  
  try {
    // Test the complete flow by checking database state
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
    
    runner.log(`  Current database state: ${JSON.stringify(state)}`);
    
    // Should have beta signups but no profiles or beta programs yet
    // (because we haven't actually authenticated)
    if (state.betaSignups > 0 && state.userProfiles === 0 && state.betaPrograms === 0) {
      runner.recordTest("Complete Initialization Flow", true, 
        `Database state is correct for unauthenticated state: ${JSON.stringify(state)}`);
    } else {
      runner.recordTest("Complete Initialization Flow", false, 
        `Unexpected database state: ${JSON.stringify(state)}`);
    }
    
  } catch (error) {
    runner.recordTest("Complete Initialization Flow", false, error.message);
  }
}

async function testInitializationErrorHandling(runner, client) {
  runner.log("🧪 Testing initialization error handling...");
  
  try {
    // Test error handling in profile initialization
    try {
      const profileResult = await client.mutation("userProfiles:createUserProfile", {
        school: "Test School",
        subject: "Test Subject"
      });
      
      runner.recordTest("Profile Error Handling", false, 
        `Expected authentication error, got result: ${JSON.stringify(profileResult)}`);
    } catch (error) {
      const isAuthError = error.message.includes("authenticated") || 
                         error.message.includes("User must be authenticated");
      
      if (isAuthError) {
        runner.recordTest("Profile Error Handling", true, 
          `Correctly handled authentication error: ${error.message}`);
      } else {
        runner.recordTest("Profile Error Handling", false, 
          `Unexpected error: ${error.message}`);
      }
    }
    
    // Test error handling in beta program initialization
    try {
      const betaResult = await client.mutation("betaProgram:updateOnboardingProgress", {
        step: 1
      });
      
      runner.recordTest("Beta Program Error Handling", false, 
        `Expected authentication error, got result: ${JSON.stringify(betaResult)}`);
    } catch (error) {
      const isAuthError = error.message.includes("authenticated") || 
                         error.message.includes("User must be authenticated");
      
      if (isAuthError) {
        runner.recordTest("Beta Program Error Handling", true, 
          `Correctly handled authentication error: ${error.message}`);
      } else {
        runner.recordTest("Beta Program Error Handling", false, 
          `Unexpected error: ${error.message}`);
      }
    }
    
  } catch (error) {
    runner.recordTest("Initialization Error Handling", false, error.message);
  }
}

// Run the tests
runAuthInitializationIntegrationTests();
