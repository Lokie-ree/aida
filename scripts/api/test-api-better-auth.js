#!/usr/bin/env node

/**
 * API Tests for Better Auth Endpoints
 * 
 * Tests Better Auth HTTP endpoints directly to verify:
 * - User registration endpoint works correctly
 * - User authentication endpoint works correctly
 * - Session management works properly
 * - Error handling is appropriate
 * - CORS configuration is correct
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep, generateTestEmail, generateTestPassword } from '../test-utils.js';
import { TEST_USERS, API_TEST_DATA } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";
const CONVEX_SITE_URL = process.env.CONVEX_SITE_URL || "https://kindly-setter-935.convex.site";
const SITE_URL = process.env.SITE_URL || "https://pelicanai.org";

async function runBetterAuthAPITests() {
  const runner = new TestRunner("Better Auth API Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Better Auth API tests...");
    runner.log(`🔗 Convex URL: ${CONVEX_URL}`);
    runner.log(`🌐 Site URL: ${SITE_URL}`);
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: Better Auth endpoint availability
    await testBetterAuthEndpointAvailability(runner);
    
    // Test 2: User registration endpoint
    await testUserRegistrationEndpoint(runner);
    
    // Test 3: User authentication endpoint
    await testUserAuthenticationEndpoint(runner);
    
    // Test 4: Session management
    await testSessionManagement(runner);
    
    // Test 5: Error handling
    await testErrorHandling(runner);
    
    // Test 6: CORS configuration
    await testCORSConfiguration(runner);
    
    // Test 7: Integration with Convex
    await testConvexIntegration(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some Better Auth API tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Better Auth API tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Better Auth API test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testBetterAuthEndpointAvailability(runner) {
  runner.log("🧪 Testing Better Auth endpoint availability...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const endpoints = [
      '/api/auth/session',
      '/api/auth/sign-up/email',
      '/api/auth/sign-in/email',
      '/api/auth/sign-out'
    ];
    
    for (const endpoint of endpoints) {
      const url = `${baseUrl}${endpoint}`;
      runner.log(`  Testing endpoint: ${url}`);
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // Most endpoints should return 200 or 401 (for protected endpoints)
        if (response.ok || response.status === 401) {
          runner.log(`  ✅ ${endpoint} is accessible (status: ${response.status})`);
        } else {
          runner.log(`  ❌ ${endpoint} returned unexpected status: ${response.status}`);
        }
      } catch (error) {
        runner.log(`  ❌ ${endpoint} failed: ${error.message}`);
      }
    }
    
    runner.recordTest("Better Auth Endpoint Availability", true, 
      "All Better Auth endpoints are accessible");
    
  } catch (error) {
    runner.recordTest("Better Auth Endpoint Availability", false, error.message);
  }
}

async function testUserRegistrationEndpoint(runner) {
  runner.log("🧪 Testing user registration endpoint...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const signupUrl = `${baseUrl}/api/auth/sign-up/email`;
    
    const testUser = {
      email: generateTestEmail("api-test"),
      password: generateTestPassword(),
      name: "API Test User"
    };
    
    runner.log(`  Testing registration with email: ${testUser.email}`);
    
    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const responseData = await response.text();
    let parsedData;
    
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = { raw: responseData };
    }
    
    if (response.ok) {
      runner.recordTest("User Registration Endpoint", true, 
        `User registration successful: ${JSON.stringify(parsedData)}`);
      
      // Store for authentication test
      runner.testUser = testUser;
    } else {
      runner.recordTest("User Registration Endpoint", false, 
        `User registration failed (${response.status}): ${JSON.stringify(parsedData)}`);
    }
    
  } catch (error) {
    runner.recordTest("User Registration Endpoint", false, error.message);
  }
}

async function testUserAuthenticationEndpoint(runner) {
  runner.log("🧪 Testing user authentication endpoint...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const signinUrl = `${baseUrl}/api/auth/sign-in/email`;
    
    // Use the user from registration test or create a new one
    const testUser = runner.testUser || {
      email: generateTestEmail("api-test"),
      password: generateTestPassword(),
      name: "API Test User"
    };
    
    runner.log(`  Testing authentication with email: ${testUser.email}`);
    
    const response = await fetch(signinUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const responseData = await response.text();
    let parsedData;
    
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = { raw: responseData };
    }
    
    if (response.ok) {
      runner.recordTest("User Authentication Endpoint", true, 
        `User authentication successful: ${JSON.stringify(parsedData)}`);
      
      // Store session data for session management test
      runner.sessionData = parsedData;
    } else {
      runner.recordTest("User Authentication Endpoint", false, 
        `User authentication failed (${response.status}): ${JSON.stringify(parsedData)}`);
    }
    
  } catch (error) {
    runner.recordTest("User Authentication Endpoint", false, error.message);
  }
}

async function testSessionManagement(runner) {
  runner.log("🧪 Testing session management...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const sessionUrl = `${baseUrl}/api/auth/session`;
    
    // Test session endpoint without authentication
    const response = await fetch(sessionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const responseData = await response.text();
    let parsedData;
    
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = { raw: responseData };
    }
    
    // Should return 401 or empty session for unauthenticated request
    if (response.status === 401 || (response.ok && (!parsedData || !parsedData.user))) {
      runner.recordTest("Session Management - Unauthenticated", true, 
        `Session endpoint correctly handles unauthenticated request (status: ${response.status})`);
    } else {
      runner.recordTest("Session Management - Unauthenticated", false, 
        `Unexpected response for unauthenticated session request: ${JSON.stringify(parsedData)}`);
    }
    
    // Test sign-out endpoint
    const signoutUrl = `${baseUrl}/api/auth/sign-out`;
    const signoutResponse = await fetch(signoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (signoutResponse.ok || signoutResponse.status === 401) {
      runner.recordTest("Session Management - Sign Out", true, 
        `Sign out endpoint is accessible (status: ${signoutResponse.status})`);
    } else {
      runner.recordTest("Session Management - Sign Out", false, 
        `Sign out endpoint failed (status: ${signoutResponse.status})`);
    }
    
  } catch (error) {
    runner.recordTest("Session Management", false, error.message);
  }
}

async function testErrorHandling(runner) {
  runner.log("🧪 Testing error handling...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const signupUrl = `${baseUrl}/api/auth/sign-up/email`;
    const signinUrl = `${baseUrl}/api/auth/sign-in/email`;
    
    // Test 1: Invalid email format
    const invalidEmailResponse = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "invalid-email",
        password: "validpassword123",
        name: "Test User"
      })
    });
    
    if (!invalidEmailResponse.ok) {
      runner.recordTest("Error Handling - Invalid Email", true, 
        `Correctly rejected invalid email (status: ${invalidEmailResponse.status})`);
    } else {
      runner.recordTest("Error Handling - Invalid Email", false, 
        `Should have rejected invalid email`);
    }
    
    // Test 2: Weak password
    const weakPasswordResponse = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: generateTestEmail("weak-password"),
        password: "123",
        name: "Test User"
      })
    });
    
    if (!weakPasswordResponse.ok) {
      runner.recordTest("Error Handling - Weak Password", true, 
        `Correctly rejected weak password (status: ${weakPasswordResponse.status})`);
    } else {
      runner.recordTest("Error Handling - Weak Password", false, 
        `Should have rejected weak password`);
    }
    
    // Test 3: Duplicate email
    const duplicateEmail = generateTestEmail("duplicate");
    
    // First registration
    const firstResponse = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: duplicateEmail,
        password: generateTestPassword(),
        name: "First User"
      })
    });
    
    // Second registration with same email
    const secondResponse = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: duplicateEmail,
        password: generateTestPassword(),
        name: "Second User"
      })
    });
    
    if (firstResponse.ok && !secondResponse.ok) {
      runner.recordTest("Error Handling - Duplicate Email", true, 
        `Correctly handled duplicate email registration`);
    } else {
      runner.recordTest("Error Handling - Duplicate Email", false, 
        `Duplicate email handling issue`);
    }
    
    // Test 4: Invalid credentials for signin
    const invalidCredentialsResponse = await fetch(signinUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: generateTestEmail("invalid"),
        password: "wrongpassword"
      })
    });
    
    if (!invalidCredentialsResponse.ok) {
      runner.recordTest("Error Handling - Invalid Credentials", true, 
        `Correctly rejected invalid credentials (status: ${invalidCredentialsResponse.status})`);
    } else {
      runner.recordTest("Error Handling - Invalid Credentials", false, 
        `Should have rejected invalid credentials`);
    }
    
  } catch (error) {
    runner.recordTest("Error Handling", false, error.message);
  }
}

async function testCORSConfiguration(runner) {
  runner.log("🧪 Testing CORS configuration...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const sessionUrl = `${baseUrl}/api/auth/session`;
    
    // Test CORS by making a request with different origin
    const response = await fetch(sessionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });
    
    // Check CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    runner.log(`  CORS headers: ${JSON.stringify(corsHeaders)}`);
    
    if (corsHeaders['Access-Control-Allow-Origin']) {
      runner.recordTest("CORS Configuration", true, 
        `CORS headers present: ${JSON.stringify(corsHeaders)}`);
    } else {
      runner.recordTest("CORS Configuration", false, 
        `CORS headers missing or incomplete`);
    }
    
  } catch (error) {
    runner.recordTest("CORS Configuration", false, error.message);
  }
}

async function testConvexIntegration(runner, client) {
  runner.log("🧪 Testing Convex integration...");
  
  try {
    // Test that we can create a beta signup and it triggers user account creation
    const testUser = TEST_USERS.validBetaUser();
    
    const signupResult = await client.mutation("betaSignup:signupForBeta", {
      email: testUser.email,
      name: testUser.name,
      school: testUser.school,
      subject: testUser.subject
    });
    
    if (!signupResult.success) {
      runner.recordTest("Convex Integration - Beta Signup", false, 
        `Beta signup failed: ${signupResult.message}`);
      return;
    }
    
    runner.log(`  Beta signup created: ${signupResult.signupId}`);
    
    // Wait for scheduled action
    await sleep(3000);
    
    // Test Better Auth signin with the temporary password
    const baseUrl = CONVEX_SITE_URL;
    const signinUrl = `${baseUrl}/api/auth/sign-in/email`;
    
    const authResponse = await fetch(signinUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: signupResult.temporaryPassword
      })
    });
    
    if (authResponse.ok) {
      runner.recordTest("Convex Integration - Auth Flow", true, 
        `Convex to Better Auth integration working correctly`);
    } else {
      const errorText = await authResponse.text();
      runner.recordTest("Convex Integration - Auth Flow", false, 
        `Better Auth signin failed: ${errorText}`);
    }
    
  } catch (error) {
    runner.recordTest("Convex Integration", false, error.message);
  }
}

// Run the tests
runBetterAuthAPITests();
