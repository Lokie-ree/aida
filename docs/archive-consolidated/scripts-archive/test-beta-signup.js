#!/usr/bin/env node

/**
 * Minimal Beta Signup Test Script
 * 
 * This script tests just the beta signup flow to avoid authentication issues.
 * 
 * Usage:
 *   node scripts/test-beta-signup.js
 */

import { ConvexHttpClient } from "convex/browser";

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_NAME = "Test User";
const TEST_SCHOOL = "Test School";
const TEST_SUBJECT = "Mathematics";

// Initialize Convex client
const client = new ConvexHttpClient(CONVEX_URL);

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility functions
function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  const prefix = type === "error" ? "❌" : type === "success" ? "✅" : type === "warning" ? "⚠️" : "ℹ️";
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function recordTest(name, passed, details = "") {
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
    log(`PASS: ${name}`, "success");
  } else {
    testResults.failed++;
    log(`FAIL: ${name} - ${details}`, "error");
  }
}

// Test functions
async function testBetaSignup() {
  log("🧪 Testing beta signup...");
  
  try {
    const result = await client.mutation("betaSignup:signupForBeta", {
      email: TEST_EMAIL,
      name: TEST_NAME,
      school: TEST_SCHOOL,
      subject: TEST_SUBJECT
    });

    if (result.success && result.signupId && result.temporaryPassword) {
      recordTest("Beta Signup", true, `Signup ID: ${result.signupId}`);
      return { signupId: result.signupId, temporaryPassword: result.temporaryPassword };
    } else {
      recordTest("Beta Signup", false, result.message || "Unknown error");
      return null;
    }
  } catch (error) {
    recordTest("Beta Signup", false, error.message);
    return null;
  }
}

async function testUserAccountCreation(signupId, temporaryPassword) {
  log("🧪 Testing user account creation...");
  
  try {
    // Wait a moment for the scheduled action to run
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if user was created by trying to get the beta signup
    const signup = await client.query("betaSignup:getBetaSignupById", { signupId });
    
    if (signup && signup.status === "approved") {
      recordTest("User Account Creation", true, `Beta signup approved for ${signup.email}`);
      return signup;
    } else {
      recordTest("User Account Creation", false, `Beta signup status: ${signup?.status || 'not found'}`);
      return null;
    }
  } catch (error) {
    recordTest("User Account Creation", false, error.message);
    return null;
  }
}

async function testDatabaseState() {
  log("🧪 Testing database state...");
  
  try {
    const betaSignups = await client.query("betaSignup:getAllBetaSignups");
    
    const state = {
      betaSignups: betaSignups?.length || 0
    };
    
    log(`Database State: Beta Signups: ${state.betaSignups}`);
    
    // Check if beta signup exists
    const betaSignupExists = state.betaSignups > 0;
    
    if (betaSignupExists) {
      recordTest("Database State", true, `Beta signup created: ${state.betaSignups}`);
    } else {
      recordTest("Database State", false, `No beta signups found`);
    }
    
    return state;
  } catch (error) {
    recordTest("Database State", false, error.message);
    return null;
  }
}

// Main test runner
async function runTests() {
  log("🚀 Starting minimal beta signup tests...");
  log(`📧 Using test email: ${TEST_EMAIL}`);
  
  try {
    // Test 1: Beta Signup
    const signupResult = await testBetaSignup();
    if (!signupResult) {
      log("❌ Beta signup failed, stopping tests", "error");
      return;
    }
    
    // Test 2: User Account Creation (simplified check)
    const userResult = await testUserAccountCreation(signupResult.signupId, signupResult.temporaryPassword);
    
    // Test 3: Final Database State
    const dbState = await testDatabaseState();
    
    // Print results
    log("\n📊 Test Results Summary:");
    log(`✅ Passed: ${testResults.passed}`);
    log(`❌ Failed: ${testResults.failed}`);
    log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
      log("\n❌ Failed Tests:");
      testResults.tests.filter(t => !t.passed).forEach(test => {
        log(`  - ${test.name}: ${test.details}`);
      });
    }
    
    // Additional debugging info
    log("\n🔍 Debug Information:");
    log(`Test Email: ${TEST_EMAIL}`);
    log(`Temporary Password: ${signupResult?.temporaryPassword || 'Not generated'}`);
    log(`Signup ID: ${signupResult?.signupId || 'Not created'}`);
    
  } catch (error) {
    log(`💥 Test runner error: ${error.message}`, "error");
  }
}

// Run the tests
runTests().then(() => {
  process.exit(testResults.failed > 0 ? 1 : 0);
});
