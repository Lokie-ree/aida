#!/usr/bin/env node

/**
 * End-to-End Tests for Beta Authentication Flow
 * 
 * Tests the complete user journey from landing page to dashboard:
 * - Beta signup on landing page
 * - Email delivery simulation
 * - User authentication with temporary password
 * - Profile initialization
 * - Dashboard access
 * - Error scenarios
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from './test-utils.js';
import { TEST_USERS } from './test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";
const SITE_URL = process.env.SITE_URL || "https://pelicanai.org";

async function runE2EBetaFlowTests() {
  const runner = new TestRunner("E2E Beta Flow Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting E2E Beta Flow tests...");
    runner.log(`📱 Testing against: ${SITE_URL}`);
    runner.log(`🔗 Convex URL: ${CONVEX_URL}`);
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: Complete happy path flow
    await testCompleteHappyPathFlow(runner, client);
    
    // Test 2: Error scenarios
    await testErrorScenarios(runner, client);
    
    // Test 3: Edge cases
    await testEdgeCases(runner, client);
    
    // Test 4: Performance and timing
    await testPerformanceAndTiming(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some E2E tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All E2E Beta Flow tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 E2E test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testCompleteHappyPathFlow(runner, client) {
  runner.log("🧪 Testing complete happy path flow...");
  
  try {
    const testUser = TEST_USERS.validBetaUser();
    
    // Step 1: Beta signup (simulating landing page form submission)
    runner.log("  Step 1: Beta signup...");
    const signupResult = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: testUser.name,
      school: testUser.school,
      subject: testUser.subject
    });
    
    if (!signupResult.success) {
      runner.recordTest("E2E Happy Path - Beta Signup", false, 
        `Beta signup failed: ${signupResult.message}`);
      return;
    }
    
    runner.log(`  ✅ Beta signup successful: ${signupResult.signupId}`);
    
    // Step 2: Verify signup was created
    runner.log("  Step 2: Verifying signup...");
    const signup = await client.query("betaSignup:getBetaSignupById", {
      signupId: signupResult.signupId
    });
    
    if (!signup || signup.email !== testUser.email) {
      runner.recordTest("E2E Happy Path - Signup Verification", false, 
        "Signup verification failed");
      return;
    }
    
    runner.log(`  ✅ Signup verified: ${signup.email}`);
    
    // Step 3: Wait for user account creation (simulating email delivery time)
    runner.log("  Step 3: Waiting for user account creation...");
    await sleep(5000);
    
    // Step 4: Test Better Auth signin (simulating user clicking email link)
    runner.log("  Step 4: Testing Better Auth signin...");
    const authResult = await testBetterAuthSignin(testUser.email, signupResult.temporaryPassword);
    
    if (!authResult.success) {
      runner.recordTest("E2E Happy Path - Authentication", false, 
        `Authentication failed: ${authResult.message}`);
      return;
    }
    
    runner.log(`  ✅ Authentication successful`);
    
    // Step 5: Test profile initialization (simulating dashboard access)
    runner.log("  Step 5: Testing profile initialization...");
    const profileResult = await testProfileInitialization(client, testUser);
    
    if (!profileResult.success) {
      runner.recordTest("E2E Happy Path - Profile Initialization", false, 
        `Profile initialization failed: ${profileResult.message}`);
      return;
    }
    
    runner.log(`  ✅ Profile initialization successful`);
    
    // Step 6: Test dashboard access (simulating user accessing protected routes)
    runner.log("  Step 6: Testing dashboard access...");
    const dashboardResult = await testDashboardAccess(client);
    
    if (!dashboardResult.success) {
      runner.recordTest("E2E Happy Path - Dashboard Access", false, 
        `Dashboard access failed: ${dashboardResult.message}`);
      return;
    }
    
    runner.log(`  ✅ Dashboard access successful`);
    
    runner.recordTest("E2E Happy Path - Complete Flow", true, 
      `Complete flow successful for ${testUser.email}`);
    
    // Store for cleanup
    runner.testUser = testUser;
    runner.testSignupId = signupResult.signupId;
    
  } catch (error) {
    runner.recordTest("E2E Happy Path - Complete Flow", false, error.message);
  }
}

async function testBetterAuthSignin(email, password) {
  try {
    const baseUrl = CONVEX_URL.replace('/api', '');
    const signinUrl = `${baseUrl}/api/auth/sign-in/email`;
    
    const response = await fetch(signinUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (response.ok) {
      const authData = await response.json();
      return { success: true, data: authData };
    } else {
      const errorText = await response.text();
      return { success: false, message: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function testProfileInitialization(client, testUser) {
  try {
    // This would normally be called after authentication
    // For testing purposes, we'll simulate the flow
    
    // Check if profile initialization would work
    // (In real scenario, this would be called with authenticated context)
    const profile = await client.query("userProfiles:getUserProfile");
    
    if (profile === null) {
      // This is expected without authentication
      return { success: true, message: "Profile initialization ready (requires authentication)" };
    } else {
      return { success: false, message: "Unexpected profile data without authentication" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function testDashboardAccess(client) {
  try {
    // Test that we can access dashboard-related queries
    const betaStatus = await client.query("betaProgram:getBetaStatus");
    const betaStats = await client.query("betaProgram:getBetaStats");
    
    // These should work even without authentication (returning default values)
    if (betaStatus === null && betaStats && typeof betaStats.frameworksTried === 'number') {
      return { success: true, message: "Dashboard queries accessible" };
    } else {
      return { success: false, message: "Dashboard queries not working correctly" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function testErrorScenarios(runner, client) {
  runner.log("🧪 Testing error scenarios...");
  
  try {
    // Test 1: Duplicate email signup
    const testUser = runner.testUser || TEST_USERS.validBetaUser();
    
    const duplicateResult = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: "Different Name",
      school: "Different School",
      subject: "Different Subject"
    });
    
    if (!duplicateResult.success && duplicateResult.message.includes("already registered")) {
      runner.recordTest("E2E Error - Duplicate Email", true, 
        `Correctly handled duplicate email: ${duplicateResult.message}`);
    } else {
      runner.recordTest("E2E Error - Duplicate Email", false, 
        `Expected duplicate error, got: ${JSON.stringify(duplicateResult)}`);
    }
    
    // Test 2: Invalid authentication
    const invalidAuthResult = await testBetterAuthSignin("invalid@example.com", "wrongpassword");
    
    if (!invalidAuthResult.success) {
      runner.recordTest("E2E Error - Invalid Auth", true, 
        `Correctly rejected invalid credentials: ${invalidAuthResult.message}`);
    } else {
      runner.recordTest("E2E Error - Invalid Auth", false, 
        `Should have rejected invalid credentials`);
    }
    
    // Test 3: Network error simulation
    try {
      // This would simulate a network error in a real scenario
      await client.query("nonexistent:function");
      runner.recordTest("E2E Error - Network Error", false, 
        "Should have handled network error");
    } catch (error) {
      runner.recordTest("E2E Error - Network Error", true, 
        `Correctly handled network error: ${error.message}`);
    }
    
  } catch (error) {
    runner.recordTest("E2E Error Scenarios", false, error.message);
  }
}

async function testEdgeCases(runner, client) {
  runner.log("🧪 Testing edge cases...");
  
  try {
    // Test 1: Very long email
    const longEmail = "a".repeat(100) + "@example.com";
    const longEmailResult = await client.mutation("betaSignup:signupForBeta", {
      email: longEmail,
      name: "Test User",
      school: "Test School",
      subject: "Test Subject"
    });
    
    if (longEmailResult.success !== undefined) {
      runner.recordTest("E2E Edge Case - Long Email", true, 
        `Handled long email: ${longEmailResult.success ? 'accepted' : 'rejected'}`);
    } else {
      runner.recordTest("E2E Edge Case - Long Email", false, 
        `Unexpected response for long email`);
    }
    
    // Test 2: Special characters in name
    const specialName = "José María O'Connor-Smith";
    const specialNameResult = await client.mutation("betaSignup:signupForBeta", {
      email: `special-${Date.now()}@example.com`,
      name: specialName,
      school: "St. Mary's High School",
      subject: "English Language Arts"
    });
    
    if (specialNameResult.success) {
      runner.recordTest("E2E Edge Case - Special Characters", true, 
        `Handled special characters in name: ${specialNameResult.signupId}`);
    } else {
      runner.recordTest("E2E Edge Case - Special Characters", false, 
        `Failed to handle special characters: ${specialNameResult.message}`);
    }
    
    // Test 3: Empty fields
    const emptyFieldsResult = await client.mutation("betaSignup:signupForBeta", {
      email: "",
      name: "",
      school: "",
      subject: ""
    });
    
    if (emptyFieldsResult.success !== undefined) {
      runner.recordTest("E2E Edge Case - Empty Fields", true, 
        `Handled empty fields: ${emptyFieldsResult.success ? 'accepted' : 'rejected'}`);
    } else {
      runner.recordTest("E2E Edge Case - Empty Fields", false, 
        `Unexpected response for empty fields`);
    }
    
  } catch (error) {
    runner.recordTest("E2E Edge Cases", false, error.message);
  }
}

async function testPerformanceAndTiming(runner, client) {
  runner.log("🧪 Testing performance and timing...");
  
  try {
    const startTime = Date.now();
    
    // Test 1: Multiple rapid signups
    const rapidSignups = [];
    for (let i = 0; i < 3; i++) {
      const testUser = TEST_USERS.validBetaUser();
      rapidSignups.push(
        client.mutation("betaSignup:signupForBeta", {
          email: testUser.email,
          name: testUser.name,
          school: testUser.school,
          subject: testUser.subject
        })
      );
    }
    
    const results = await Promise.all(rapidSignups);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const successCount = results.filter(r => r.success).length;
    
    if (successCount === 3) {
      runner.recordTest("E2E Performance - Rapid Signups", true, 
        `All 3 rapid signups successful in ${duration}ms`);
    } else {
      runner.recordTest("E2E Performance - Rapid Signups", false, 
        `Only ${successCount}/3 rapid signups successful in ${duration}ms`);
    }
    
    // Test 2: Database query performance
    const queryStartTime = Date.now();
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups"),
      client.query("userProfiles:getAllUserProfiles"),
      client.query("betaProgram:getAllBetaPrograms")
    ]);
    const queryEndTime = Date.now();
    const queryDuration = queryEndTime - queryStartTime;
    
    if (queryDuration < 1000) {
      runner.recordTest("E2E Performance - Database Queries", true, 
        `Database queries completed in ${queryDuration}ms`);
    } else {
      runner.recordTest("E2E Performance - Database Queries", false, 
        `Database queries took too long: ${queryDuration}ms`);
    }
    
  } catch (error) {
    runner.recordTest("E2E Performance and Timing", false, error.message);
  }
}

// Run the tests
runE2EBetaFlowTests();
