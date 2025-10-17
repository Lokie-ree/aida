#!/usr/bin/env node

/**
 * Environment Configuration Tests
 * 
 * Tests environment variables and configuration to verify:
 * - Required environment variables are set
 * - URLs are correctly formatted
 * - Configuration values are valid
 * - CORS settings are appropriate
 */

import { readFileSync } from 'fs';
import { TestRunner, ConvexTestClient, cleanTestData } from '../test-utils.js';
import { ENV_CONFIG } from '../test-fixtures.js';

// Load environment variables from .env and .env.local
const envFiles = ['.env', '.env.local'];
for (const envFile of envFiles) {
  try {
    const envContent = readFileSync(envFile, 'utf8');
    const envLines = envContent.split('\n');
    for (const line of envLines) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    console.log(`✅ Loaded environment variables from ${envFile}`);
  } catch (error) {
    console.log(`⚠️ Could not load ${envFile} file`);
  }
}

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";
const CONVEX_SITE_URL = process.env.VITE_CONVEX_SITE_URL || "https://kindly-setter-935.convex.site";
const SITE_URL = process.env.SITE_URL || "http://localhost:5173";

async function runEnvironmentConfigTests() {
  const runner = new TestRunner("Environment Configuration Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Environment Configuration tests...");
    runner.log(`🔗 Convex URL: ${CONVEX_URL}`);
    runner.log(`🌐 Site URL: ${SITE_URL}`);
    
    // Test 1: Required environment variables
    await testRequiredEnvironmentVariables(runner);
    
    // Test 2: URL format validation
    await testURLFormatValidation(runner);
    
    // Test 3: Convex deployment connectivity
    await testConvexDeploymentConnectivity(runner, client);
    
    // Test 4: Better Auth configuration
    await testBetterAuthConfiguration(runner);
    
    // Test 5: CORS configuration
    await testCORSConfiguration(runner);
    
    // Test 6: Database connectivity
    await testDatabaseConnectivity(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some environment configuration tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Environment Configuration tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Environment configuration test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testRequiredEnvironmentVariables(runner) {
  runner.log("🧪 Testing required environment variables...");
  
  try {
    const missingVars = [];
    const presentVars = [];
    
    // Check required environment variables (local and Convex deployment vars)
    const localRequiredVars = ['VITE_CONVEX_SITE_URL', 'SITE_URL', 'BETTER_AUTH_SECRET'];
    
    for (const varName of localRequiredVars) {
      let value;
      if (varName === 'VITE_CONVEX_SITE_URL') {
        value = process.env.VITE_CONVEX_SITE_URL;
      } else if (varName === 'SITE_URL') {
        value = process.env.SITE_URL;
      } else if (varName === 'BETTER_AUTH_SECRET') {
        value = process.env.BETTER_AUTH_SECRET;
      } else {
        value = process.env[varName];
      }
      
      if (!value) {
        missingVars.push(varName);
      } else {
        presentVars.push(varName);
        // Don't log the actual secret value for security
        const displayValue = varName === 'BETTER_AUTH_SECRET' ? '[HIDDEN]' : value;
        runner.log(`  ✅ ${varName}: ${displayValue}`);
      }
    }
    
    // Check optional environment variables
    const optionalVars = [];
    for (const varName of ENV_CONFIG.optional) {
      const value = process.env[varName];
      if (value) {
        optionalVars.push(varName);
        runner.log(`  ℹ️  ${varName}: ${value}`);
      }
    }
    
    if (missingVars.length === 0) {
      runner.recordTest("Required Environment Variables", true, 
        `All required variables present: ${presentVars.join(', ')}`);
    } else {
      runner.recordTest("Required Environment Variables", false, 
        `Missing required variables: ${missingVars.join(', ')}`);
    }
    
    if (optionalVars.length > 0) {
      runner.log(`  ℹ️  Optional variables present: ${optionalVars.join(', ')}`);
    }
    
  } catch (error) {
    runner.recordTest("Required Environment Variables", false, error.message);
  }
}

async function testURLFormatValidation(runner) {
  runner.log("🧪 Testing URL format validation...");
  
  try {
    const urlTests = [
      {
        name: "CONVEX_SITE_URL",
        value: CONVEX_URL,
        pattern: ENV_CONFIG.urlPatterns.convexSiteUrl
      },
      {
        name: "SITE_URL",
        value: SITE_URL,
        pattern: ENV_CONFIG.urlPatterns.localhost // localhost is valid for SITE_URL
      }
    ];
    
    let allValid = true;
    
    for (const urlTest of urlTests) {
      const isValid = urlTest.pattern.test(urlTest.value);
      
      if (isValid) {
        runner.log(`  ✅ ${urlTest.name}: ${urlTest.value} (valid format)`);
      } else {
        runner.log(`  ❌ ${urlTest.name}: ${urlTest.value} (invalid format)`);
        allValid = false;
      }
    }
    
    // Test localhost URLs for development
    const localhostUrls = [
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    
    for (const localhostUrl of localhostUrls) {
      const isValid = ENV_CONFIG.urlPatterns.localhost.test(localhostUrl);
      if (isValid) {
        runner.log(`  ✅ Localhost URL: ${localhostUrl} (valid format)`);
      } else {
        runner.log(`  ❌ Localhost URL: ${localhostUrl} (invalid format)`);
        allValid = false;
      }
    }
    
    if (allValid) {
      runner.recordTest("URL Format Validation", true, 
        "All URLs have valid formats");
    } else {
      runner.recordTest("URL Format Validation", false, 
        "Some URLs have invalid formats");
    }
    
  } catch (error) {
    runner.recordTest("URL Format Validation", false, error.message);
  }
}

async function testConvexDeploymentConnectivity(runner, client) {
  runner.log("🧪 Testing Convex deployment connectivity...");
  
  try {
    // Test basic Convex connectivity
    const testQuery = await client.query("auth:getCurrentUser");
    
    // Should return null for unauthenticated user, but the query should work
    if (testQuery === null) {
      runner.recordTest("Convex Deployment Connectivity", true, 
        "Convex deployment is accessible and responding");
    } else {
      runner.recordTest("Convex Deployment Connectivity", true, 
        `Convex deployment is accessible (unexpected response: ${JSON.stringify(testQuery)})`);
    }
    
    // Test deployment URL format
    const convexUrlPattern = /^https:\/\/[a-z0-9-]+\.convex\.(cloud|site)$/;
    const isConvexUrlValid = convexUrlPattern.test(CONVEX_URL);
    
    if (isConvexUrlValid) {
      runner.log(`  ✅ Convex URL format is valid: ${CONVEX_URL}`);
    } else {
      runner.log(`  ❌ Convex URL format is invalid: ${CONVEX_URL}`);
      runner.recordTest("Convex URL Format", false, 
        `Invalid Convex URL format: ${CONVEX_URL}`);
    }
    
  } catch (error) {
    runner.recordTest("Convex Deployment Connectivity", false, 
      `Convex connectivity error: ${error.message}`);
  }
}

async function testBetterAuthConfiguration(runner) {
  runner.log("🧪 Testing Better Auth configuration...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const authEndpoints = [
      { path: '/api/auth/session', method: 'GET', expectSuccess: true },
      { path: '/api/auth/sign-up/email', method: 'POST', expectSuccess: false }, // May fail due to email validation or user exists
      { path: '/api/auth/sign-in/email', method: 'POST', expectSuccess: false }, // Will fail with test credentials
      { path: '/api/auth/sign-out', method: 'POST', expectSuccess: true }
    ];
    
    let accessibleEndpoints = 0;
    
    for (const endpoint of authEndpoints) {
      const url = `${baseUrl}${endpoint.path}`;
      runner.log(`  Testing endpoint: ${url}`);
      
      try {
        const options = {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          }
        };
        
        // Add body for POST requests
        if (endpoint.method === 'POST') {
          // Use unique email for each test to avoid "user already exists" errors
          const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}@resend.dev`;
          options.body = JSON.stringify({
            email: uniqueEmail,
            password: 'testpassword123456' // Valid password length for Better Auth
          });
        }
        
        const response = await fetch(url, options);
        
        // Check if response is expected
        const isExpected = endpoint.expectSuccess ? 
          (response.ok || response.status === 401) : 
          (response.status >= 400 && response.status < 600); // Any error status (400-599) is expected for validation
        
        if (isExpected) {
          accessibleEndpoints++;
          runner.log(`  ✅ ${endpoint.path} is accessible (status: ${response.status})`);
        } else {
          runner.log(`  ❌ ${endpoint.path} returned unexpected status: ${response.status}`);
        }
      } catch (error) {
        runner.log(`  ❌ ${endpoint.path} failed: ${error.message}`);
      }
    }
    
    if (accessibleEndpoints === authEndpoints.length) {
      runner.recordTest("Better Auth Configuration", true, 
        `All Better Auth endpoints are accessible (${accessibleEndpoints}/${authEndpoints.length})`);
    } else {
      runner.recordTest("Better Auth Configuration", false, 
        `Only ${accessibleEndpoints}/${authEndpoints.length} Better Auth endpoints are accessible`);
    }
    
  } catch (error) {
    runner.recordTest("Better Auth Configuration", false, error.message);
  }
}

async function testCORSConfiguration(runner) {
  runner.log("🧪 Testing CORS configuration...");
  
  try {
    const baseUrl = CONVEX_SITE_URL;
    const sessionUrl = `${baseUrl}/api/auth/session`;
    
    // Test CORS with different origins
    const testOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://pelicanai.org',
      'https://www.pelicanai.org'
    ];
    
    let corsWorking = 0;
    
    for (const origin of testOrigins) {
      try {
        const response = await fetch(sessionUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': origin
          }
        });
        
        const corsHeaders = {
          'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
          'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
          'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        };
        
        if (corsHeaders['Access-Control-Allow-Origin']) {
          corsWorking++;
          runner.log(`  ✅ CORS working for origin: ${origin}`);
        } else {
          runner.log(`  ❌ CORS not working for origin: ${origin}`);
        }
      } catch (error) {
        runner.log(`  ❌ CORS test failed for origin ${origin}: ${error.message}`);
      }
    }
    
    if (corsWorking === testOrigins.length) {
      runner.recordTest("CORS Configuration", true, 
        `CORS is working for all test origins (${corsWorking}/${testOrigins.length})`);
    } else {
      runner.recordTest("CORS Configuration", false, 
        `CORS is working for only ${corsWorking}/${testOrigins.length} test origins`);
    }
    
  } catch (error) {
    runner.recordTest("CORS Configuration", false, error.message);
  }
}

async function testDatabaseConnectivity(runner, client) {
  runner.log("🧪 Testing database connectivity...");
  
  try {
    // Test database connectivity by running a simple query
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups").catch(() => []),
      client.query("userProfiles:getAllUserProfiles").catch(() => []),
      client.query("betaProgram:getAllBetaPrograms").catch(() => [])
    ]);
    
    const dbState = {
      betaSignups: betaSignups?.length || 0,
      userProfiles: userProfiles?.length || 0,
      betaPrograms: betaPrograms?.length || 0
    };
    
    runner.log(`  Database state: ${JSON.stringify(dbState)}`);
    
    // Test that we can create a record
    const testUser = {
      email: `delivered@resend.dev`,
      name: "Test User",
      school: "Test School",
      subject: "Test Subject"
    };
    
    const signupResult = await client.mutation("betaSignup:signupForBeta", testUser);
    
    if (signupResult.success) {
      runner.log(`  ✅ Database write test successful: ${signupResult.signupId}`);
      
      // Clean up test data
      await client.mutation("betaSignup:deleteBetaSignup", {
        signupId: signupResult.signupId
      });
      
      runner.recordTest("Database Connectivity", true, 
        "Database is accessible for both read and write operations");
    } else {
      runner.recordTest("Database Connectivity", false, 
        `Database write test failed: ${signupResult.message}`);
    }
    
  } catch (error) {
    runner.recordTest("Database Connectivity", false, error.message);
  }
}

// Run the tests
runEnvironmentConfigTests();
