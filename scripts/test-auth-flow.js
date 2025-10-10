#!/usr/bin/env node

/**
 * Authentication Flow Test Script
 * 
 * This script automates testing of the beta signup and authentication flow
 * to help debug authentication issues without manual testing.
 * 
 * Usage:
 *   node scripts/test-auth-flow.js
 *   node scripts/test-auth-flow.js --clean-only
 *   node scripts/test-auth-flow.js --test-only
 */

const { ConvexHttpClient } = require("convex/browser");

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";
const TEST_EMAIL = "test@example.com";
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

// Database cleanup functions
async function cleanDatabase() {
  log("🧹 Cleaning database...");
  
  try {
    // Get all records
    const [betaSignups, users, userProfiles, betaPrograms, sessions] = await Promise.all([
      client.query("api:betaSignup/getAllBetaSignups"),
      client.query("api:auth/getAllUsers"),
      client.query("api:userProfiles/getAllUserProfiles"),
      client.query("api:betaProgram/getAllBetaPrograms"),
      client.query("api:auth/getAllSessions")
    ]);

    // Delete all records
    const deletePromises = [];

    // Delete beta signups
    for (const signup of betaSignups || []) {
      deletePromises.push(client.mutation("api:betaSignup/deleteBetaSignup", { signupId: signup._id }));
    }

    // Delete user profiles
    for (const profile of userProfiles || []) {
      deletePromises.push(client.mutation("api:userProfiles/deleteUserProfile", { profileId: profile._id }));
    }

    // Delete beta programs
    for (const program of betaPrograms || []) {
      deletePromises.push(client.mutation("api:betaProgram/deleteBetaProgram", { programId: program._id }));
    }

    // Note: We can't delete Better Auth users/sessions directly through mutations
    // They need to be deleted through Better Auth API or will be cleaned up automatically

    await Promise.all(deletePromises);
    log(`Database cleaned: ${deletePromises.length} records deleted`, "success");
    
  } catch (error) {
    log(`Error cleaning database: ${error.message}`, "error");
    throw error;
  }
}

// Test functions
async function testBetaSignup() {
  log("🧪 Testing beta signup...");
  
  try {
    const result = await client.mutation("api:betaSignup/signupForBeta", {
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if user was created in Better Auth
    const users = await client.query("api:auth/getAllUsers");
    const userExists = users && users.length > 0;
    
    if (userExists) {
      recordTest("User Account Creation", true, `User created: ${users[0].email}`);
      return users[0];
    } else {
      recordTest("User Account Creation", false, "No user found in Better Auth users table");
      return null;
    }
  } catch (error) {
    recordTest("User Account Creation", false, error.message);
    return null;
  }
}

async function testProfileInitialization(user) {
  log("🧪 Testing profile initialization...");
  
  try {
    // Wait a moment for auto-initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const [userProfile, betaProgram] = await Promise.all([
      client.query("api:userProfiles/getUserProfile", { userId: user._id }),
      client.query("api:betaProgram/getBetaStatus", { userId: user._id })
    ]);
    
    const profileExists = userProfile !== null;
    const betaProgramExists = betaProgram !== null;
    
    if (profileExists && betaProgramExists) {
      recordTest("Profile Initialization", true, "Both user profile and beta program created");
      return { userProfile, betaProgram };
    } else {
      recordTest("Profile Initialization", false, 
        `Profile: ${profileExists ? 'exists' : 'missing'}, Beta Program: ${betaProgramExists ? 'exists' : 'missing'}`);
      return null;
    }
  } catch (error) {
    recordTest("Profile Initialization", false, error.message);
    return null;
  }
}

async function testAuthenticationFlow(temporaryPassword) {
  log("🧪 Testing authentication flow...");
  
  try {
    // Test sign-in
    const signInResult = await client.mutation("api:auth/signIn", {
      email: TEST_EMAIL,
      password: temporaryPassword
    });
    
    if (signInResult.success) {
      recordTest("Authentication Flow", true, "Sign-in successful");
      return signInResult;
    } else {
      recordTest("Authentication Flow", false, signInResult.message || "Sign-in failed");
      return null;
    }
  } catch (error) {
    recordTest("Authentication Flow", false, error.message);
    return null;
  }
}

async function testDatabaseState() {
  log("🧪 Testing database state...");
  
  try {
    const [betaSignups, users, userProfiles, betaPrograms] = await Promise.all([
      client.query("api:betaSignup/getAllBetaSignups"),
      client.query("api:auth/getAllUsers"),
      client.query("api:userProfiles/getAllUserProfiles"),
      client.query("api:betaProgram/getAllBetaPrograms")
    ]);
    
    const state = {
      betaSignups: betaSignups?.length || 0,
      users: users?.length || 0,
      userProfiles: userProfiles?.length || 0,
      betaPrograms: betaPrograms?.length || 0
    };
    
    log(`Database State: Beta Signups: ${state.betaSignups}, Users: ${state.users}, Profiles: ${state.userProfiles}, Beta Programs: ${state.betaPrograms}`);
    
    // Check if all expected records exist
    const allExist = state.betaSignups > 0 && state.users > 0 && state.userProfiles > 0 && state.betaPrograms > 0;
    
    if (allExist) {
      recordTest("Database State", true, "All expected records exist");
    } else {
      recordTest("Database State", false, `Missing records: ${JSON.stringify(state)}`);
    }
    
    return state;
  } catch (error) {
    recordTest("Database State", false, error.message);
    return null;
  }
}

// Main test runner
async function runTests() {
  log("🚀 Starting authentication flow tests...");
  
  try {
    // Clean database first
    await cleanDatabase();
    
    // Test 1: Beta Signup
    const signupResult = await testBetaSignup();
    if (!signupResult) {
      log("❌ Beta signup failed, stopping tests", "error");
      return;
    }
    
    // Test 2: User Account Creation
    const user = await testUserAccountCreation(signupResult.signupId, signupResult.temporaryPassword);
    if (!user) {
      log("❌ User account creation failed, stopping tests", "error");
      return;
    }
    
    // Test 3: Profile Initialization
    const profileResult = await testProfileInitialization(user);
    
    // Test 4: Authentication Flow
    const authResult = await testAuthenticationFlow(signupResult.temporaryPassword);
    
    // Test 5: Final Database State
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
    
  } catch (error) {
    log(`💥 Test runner error: ${error.message}`, "error");
  }
}

// Command line argument handling
const args = process.argv.slice(2);

if (args.includes("--clean-only")) {
  cleanDatabase().then(() => {
    log("✅ Database cleanup completed");
    process.exit(0);
  }).catch(error => {
    log(`❌ Database cleanup failed: ${error.message}`, "error");
    process.exit(1);
  });
} else if (args.includes("--test-only")) {
  runTests().then(() => {
    process.exit(testResults.failed > 0 ? 1 : 0);
  });
} else {
  runTests().then(() => {
    process.exit(testResults.failed > 0 ? 1 : 0);
  });
}
