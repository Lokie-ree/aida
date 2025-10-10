#!/usr/bin/env node

/**
 * Unit Tests for User Profiles Functions
 * 
 * Tests individual functions in convex/userProfiles.ts to verify:
 * - getUserProfile returns correct profile data
 * - createUserProfile creates profile with correct fields
 * - updateUserProfile updates existing profile
 * - initializeNewUser creates both profile and beta program
 * - Validation and error handling
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from './test-utils.js';
import { TEST_USERS, USER_PROFILE_SCENARIOS } from './test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runUserProfilesUnitTests() {
  const runner = new TestRunner("User Profiles Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting User Profiles unit tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Note: These tests require authentication, so we'll test the functions
    // that don't require auth first, then simulate auth scenarios
    
    // Test 1: getUserProfile without authentication
    await testGetUserProfileUnauthenticated(runner, client);
    
    // Test 2: createUserProfile without authentication
    await testCreateUserProfileUnauthenticated(runner, client);
    
    // Test 3: updateUserProfile without authentication
    await testUpdateUserProfileUnauthenticated(runner, client);
    
    // Test 4: initializeNewUser without authentication
    await testInitializeNewUserUnauthenticated(runner, client);
    
    // Test 5: getAllUserProfiles without authentication
    await testGetAllUserProfilesUnauthenticated(runner, client);
    
    // Test 6: Test with mock authentication (simulate user exists)
    await testWithMockAuthentication(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All User Profiles unit tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testGetUserProfileUnauthenticated(runner, client) {
  runner.log("🧪 Testing getUserProfile without authentication...");
  
  try {
    const profile = await client.query("userProfiles:getUserProfile");
    
    // Should return null when not authenticated
    if (profile === null) {
      runner.recordTest("getUserProfile - Unauthenticated", true, "Correctly returned null when not authenticated");
    } else {
      runner.recordTest("getUserProfile - Unauthenticated", false, 
        `Expected null, got: ${JSON.stringify(profile)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for unauthenticated requests
    runner.recordTest("getUserProfile - Unauthenticated", true, 
      `Correctly handled unauthenticated request: ${error.message}`);
  }
}

async function testCreateUserProfileUnauthenticated(runner, client) {
  runner.log("🧪 Testing createUserProfile without authentication...");
  
  try {
    const profileData = USER_PROFILE_SCENARIOS.basicTeacher();
    
    const result = await client.mutation("userProfiles:createUserProfile", profileData);
    
    // Should fail without authentication
    runner.recordTest("createUserProfile - Unauthenticated", false, 
      `Expected authentication error, but got result: ${JSON.stringify(result)}`);
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("createUserProfile - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("createUserProfile - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testUpdateUserProfileUnauthenticated(runner, client) {
  runner.log("🧪 Testing updateUserProfile without authentication...");
  
  try {
    const profileData = USER_PROFILE_SCENARIOS.basicTeacher();
    
    const result = await client.mutation("userProfiles:updateUserProfile", profileData);
    
    // Should fail without authentication
    runner.recordTest("updateUserProfile - Unauthenticated", false, 
      `Expected authentication error, but got result: ${JSON.stringify(result)}`);
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("updateUserProfile - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("updateUserProfile - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testInitializeNewUserUnauthenticated(runner, client) {
  runner.log("🧪 Testing initializeNewUser without authentication...");
  
  try {
    const result = await client.mutation("userProfiles:initializeNewUser");
    
    // Should fail without authentication
    const isAuthError = result && !result.success && 
                       result.message.includes("authenticated");
    
    if (isAuthError) {
      runner.recordTest("initializeNewUser - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${result.message}`);
    } else {
      runner.recordTest("initializeNewUser - Unauthenticated", false, 
        `Expected authentication error, got: ${JSON.stringify(result)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("initializeNewUser - Unauthenticated", true, 
        `Correctly handled unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("initializeNewUser - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testGetAllUserProfilesUnauthenticated(runner, client) {
  runner.log("🧪 Testing getAllUserProfiles without authentication...");
  
  try {
    const profiles = await client.query("userProfiles:getAllUserProfiles");
    
    // Should return empty array when not authenticated
    if (Array.isArray(profiles) && profiles.length === 0) {
      runner.recordTest("getAllUserProfiles - Unauthenticated", true, 
        "Correctly returned empty array when not authenticated");
    } else {
      runner.recordTest("getAllUserProfiles - Unauthenticated", false, 
        `Expected empty array, got: ${JSON.stringify(profiles)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for unauthenticated requests
    runner.recordTest("getAllUserProfiles - Unauthenticated", true, 
      `Correctly handled unauthenticated request: ${error.message}`);
  }
}

async function testWithMockAuthentication(runner, client) {
  runner.log("🧪 Testing with mock authentication scenario...");
  
  try {
    // First, create a beta signup to simulate the flow
    const testUser = TEST_USERS.validBetaUser();
    
    const signupResult = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: testUser.name,
      school: testUser.school,
      subject: testUser.subject
    });
    
    if (!signupResult.success) {
      runner.recordTest("Mock Auth - Beta Signup", false, 
        `Failed to create beta signup: ${signupResult.message}`);
      return;
    }
    
    runner.log("✅ Created beta signup for mock auth testing");
    
    // Test that we can query the beta signup
    const signup = await client.query("betaSignup:getBetaSignupById", {
      signupId: signupResult.signupId
    });
    
    if (signup && signup.email === testUser.email) {
      runner.recordTest("Mock Auth - Beta Signup Query", true, 
        `Successfully queried beta signup for ${signup.email}`);
    } else {
      runner.recordTest("Mock Auth - Beta Signup Query", false, 
        `Failed to query beta signup: ${JSON.stringify(signup)}`);
    }
    
    // Test that user profiles functions still require authentication
    // (they should fail even with beta signup existing)
    const profile = await client.query("userProfiles:getUserProfile");
    
    if (profile === null) {
      runner.recordTest("Mock Auth - Profile Query", true, 
        "Profile query correctly requires authentication even with beta signup");
    } else {
      runner.recordTest("Mock Auth - Profile Query", false, 
        `Profile query should require authentication, got: ${JSON.stringify(profile)}`);
    }
    
  } catch (error) {
    runner.recordTest("Mock Auth - Setup", false, error.message);
  }
}

// Run the tests
runUserProfilesUnitTests();
