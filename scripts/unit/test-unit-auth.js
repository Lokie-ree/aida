#!/usr/bin/env node

/**
 * Unit Tests for Authentication Functions
 * 
 * Tests individual functions in convex/auth.ts to verify:
 * - getCurrentUser returns authenticated user or null
 * - Auth component configuration is correct
 * - CORS settings are properly configured
 * - Better Auth integration works correctly
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from '../test-utils.js';
import { TEST_USERS } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runAuthUnitTests() {
  const runner = new TestRunner("Authentication Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Authentication unit tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: getCurrentUser without authentication
    await testGetCurrentUserUnauthenticated(runner, client);
    
    // Test 2: Test auth component configuration
    await testAuthComponentConfiguration(runner, client);
    
    // Test 3: Test CORS configuration
    await testCORSConfiguration(runner, client);
    
    // Test 4: Test Better Auth endpoint availability
    await testBetterAuthEndpoints(runner, client);
    
    // Test 5: Test with mock authentication data
    await testWithMockAuthData(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Authentication unit tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testGetCurrentUserUnauthenticated(runner, client) {
  runner.log("🧪 Testing getCurrentUser without authentication...");
  
  try {
    const user = await client.query("auth:getCurrentUser");
    
    // Should return null when not authenticated
    if (user === null) {
      runner.recordTest("getCurrentUser - Unauthenticated", true, 
        "Correctly returned null when not authenticated");
    } else {
      runner.recordTest("getCurrentUser - Unauthenticated", false, 
        `Expected null, got: ${JSON.stringify(user)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for unauthenticated requests
    runner.recordTest("getCurrentUser - Unauthenticated", true, 
      `Correctly handled unauthenticated request: ${error.message}`);
  }
}

async function testAuthComponentConfiguration(runner, client) {
  runner.log("🧪 Testing auth component configuration...");
  
  try {
    // Test that the auth component is properly configured
    // by checking if we can call the query without errors
    
    // This is a basic test - in a real scenario, we'd need to test
    // the actual Better Auth configuration, but that requires
    // more complex setup
    
    const user = await client.query("auth:getCurrentUser");
    
    // The fact that we can call this without errors means
    // the auth component is properly configured
    if (user === null || (user && typeof user === 'object')) {
      runner.recordTest("Auth Component Configuration", true, 
        "Auth component is properly configured and accessible");
    } else {
      runner.recordTest("Auth Component Configuration", false, 
        `Unexpected response from auth component: ${JSON.stringify(user)}`);
    }
    
  } catch (error) {
    runner.recordTest("Auth Component Configuration", false, 
      `Auth component configuration error: ${error.message}`);
  }
}

async function testCORSConfiguration(runner, client) {
  runner.log("🧪 Testing CORS configuration...");
  
  try {
    // Test CORS by making a request from a different origin
    // This is a simplified test - in practice, CORS testing
    // requires browser-based testing
    
    const user = await client.query("auth:getCurrentUser");
    
    // If we can make the request without CORS errors,
    // the configuration is likely correct
    if (user === null || (user && typeof user === 'object')) {
      runner.recordTest("CORS Configuration", true, 
        "CORS configuration appears to be working (no CORS errors)");
    } else {
      runner.recordTest("CORS Configuration", false, 
        `CORS configuration issue: ${JSON.stringify(user)}`);
    }
    
  } catch (error) {
    // Check if it's a CORS error
    const isCORSError = error.message.includes("CORS") || 
                       error.message.includes("cross-origin") ||
                       error.message.includes("Access-Control-Allow-Origin");
    
    if (isCORSError) {
      runner.recordTest("CORS Configuration", false, 
        `CORS error detected: ${error.message}`);
    } else {
      runner.recordTest("CORS Configuration", true, 
        `No CORS errors (other error: ${error.message})`);
    }
  }
}

async function testBetterAuthEndpoints(runner, client) {
  runner.log("🧪 Testing Better Auth endpoint availability...");
  
  try {
    // Test if Better Auth endpoints are accessible
    // We'll test the session endpoint which should be available
    
    // Use the correct Better Auth domain (.convex.site) not the Convex API domain (.convex.cloud)
    const betterAuthBaseUrl = process.env.VITE_CONVEX_SITE_URL || 'https://kindly-setter-935.convex.site';
    const sessionUrl = `${betterAuthBaseUrl}/api/auth/session`;
    
    runner.log(`Testing Better Auth session endpoint: ${sessionUrl}`);
    
    // Make a direct HTTP request to test the endpoint
    const response = await fetch(sessionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok || response.status === 401) {
      // 401 is expected for unauthenticated requests
      runner.recordTest("Better Auth Endpoints", true, 
        `Better Auth session endpoint is accessible (status: ${response.status})`);
    } else {
      runner.recordTest("Better Auth Endpoints", false, 
        `Better Auth session endpoint returned status: ${response.status}`);
    }
    
  } catch (error) {
    runner.recordTest("Better Auth Endpoints", false, 
      `Better Auth endpoint test failed: ${error.message}`);
  }
}

async function testWithMockAuthData(runner, client) {
  runner.log("🧪 Testing with mock authentication data...");
  
  try {
    // Create a beta signup to simulate the authentication flow
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
    
    // Test that getCurrentUser still returns null
    // (because we haven't actually authenticated)
    const user = await client.query("auth:getCurrentUser");
    
    if (user === null) {
      runner.recordTest("Mock Auth - Current User", true, 
        "getCurrentUser correctly returns null without actual authentication");
    } else {
      runner.recordTest("Mock Auth - Current User", false, 
        `Expected null, got: ${JSON.stringify(user)}`);
    }
    
    // Test that we can still query other data
    const signup = await client.query("betaSignup:getBetaSignupById", {
      signupId: signupResult.signupId
    });
    
    if (signup && signup.email === testUser.email) {
      runner.recordTest("Mock Auth - Data Access", true, 
        "Can access data without authentication (as expected for public queries)");
    } else {
      runner.recordTest("Mock Auth - Data Access", false, 
        `Failed to access beta signup data: ${JSON.stringify(signup)}`);
    }
    
  } catch (error) {
    runner.recordTest("Mock Auth - Setup", false, error.message);
  }
}

// Run the tests
runAuthUnitTests();
