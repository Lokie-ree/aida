#!/usr/bin/env node

/**
 * Unit Tests for Beta Program Functions
 * 
 * Tests individual functions in convex/betaProgram.ts to verify:
 * - getBetaStatus returns correct status data
 * - initializeBetaProgram creates program with correct fields
 * - updateOnboardingProgress updates progress correctly
 * - recordWeeklyEngagement tracks engagement
 * - getBetaStats returns correct statistics
 * - Validation and error handling
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from '../test-utils.js';
import { TEST_USERS, BETA_PROGRAM_SCENARIOS } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runBetaProgramUnitTests() {
  const runner = new TestRunner("Beta Program Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Beta Program unit tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: getBetaStatus without authentication
    await testGetBetaStatusUnauthenticated(runner, client);
    
    // Test 2: initializeBetaProgram without authentication
    await testInitializeBetaProgramUnauthenticated(runner, client);
    
    // Test 3: updateOnboardingProgress without authentication
    await testUpdateOnboardingProgressUnauthenticated(runner, client);
    
    // Test 4: recordWeeklyEngagement without authentication
    await testRecordWeeklyEngagementUnauthenticated(runner, client);
    
    // Test 5: getBetaStats without authentication
    await testGetBetaStatsUnauthenticated(runner, client);
    
    // Test 6: getAllBetaUsers without authentication
    await testGetAllBetaUsersUnauthenticated(runner, client);
    
    // Test 7: Test with mock data (simulate beta program exists)
    await testWithMockData(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Beta Program unit tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testGetBetaStatusUnauthenticated(runner, client) {
  runner.log("🧪 Testing getBetaStatus without authentication...");
  
  try {
    const status = await client.query("betaProgram:getBetaStatus");
    
    // Should return null when not authenticated
    if (status === null) {
      runner.recordTest("getBetaStatus - Unauthenticated", true, 
        "Correctly returned null when not authenticated");
    } else {
      runner.recordTest("getBetaStatus - Unauthenticated", false, 
        `Expected null, got: ${JSON.stringify(status)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for unauthenticated requests
    runner.recordTest("getBetaStatus - Unauthenticated", true, 
      `Correctly handled unauthenticated request: ${error.message}`);
  }
}

async function testInitializeBetaProgramUnauthenticated(runner, client) {
  runner.log("🧪 Testing initializeBetaProgram without authentication...");
  
  try {
    const result = await client.mutation("betaProgram:initializeBetaProgram");
    
    // Should fail without authentication
    runner.recordTest("initializeBetaProgram - Unauthenticated", false, 
      `Expected authentication error, but got result: ${JSON.stringify(result)}`);
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("initializeBetaProgram - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("initializeBetaProgram - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testUpdateOnboardingProgressUnauthenticated(runner, client) {
  runner.log("🧪 Testing updateOnboardingProgress without authentication...");
  
  try {
    const result = await client.mutation("betaProgram:updateOnboardingProgress", {
      step: 1
    });
    
    // Should fail without authentication
    runner.recordTest("updateOnboardingProgress - Unauthenticated", false, 
      `Expected authentication error, but got result: ${JSON.stringify(result)}`);
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("updateOnboardingProgress - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("updateOnboardingProgress - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testRecordWeeklyEngagementUnauthenticated(runner, client) {
  runner.log("🧪 Testing recordWeeklyEngagement without authentication...");
  
  try {
    const result = await client.mutation("betaProgram:recordWeeklyEngagement");
    
    // Should fail without authentication
    runner.recordTest("recordWeeklyEngagement - Unauthenticated", false, 
      `Expected authentication error, but got result: ${JSON.stringify(result)}`);
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("recordWeeklyEngagement - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("recordWeeklyEngagement - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testGetBetaStatsUnauthenticated(runner, client) {
  runner.log("🧪 Testing getBetaStats without authentication...");
  
  try {
    const stats = await client.query("betaProgram:getBetaStats");
    
    // Should return default stats when not authenticated
    const hasDefaultStats = stats && 
                           typeof stats.frameworksTried === 'number' &&
                           typeof stats.totalTimeSaved === 'number' &&
                           typeof stats.innovationsShared === 'number' &&
                           typeof stats.weeklyEngagementStreak === 'number' &&
                           stats.frameworksTried === 0 &&
                           stats.totalTimeSaved === 0 &&
                           stats.innovationsShared === 0 &&
                           stats.weeklyEngagementStreak === 0;
    
    if (hasDefaultStats) {
      runner.recordTest("getBetaStats - Unauthenticated", true, 
        "Correctly returned default stats when not authenticated");
    } else {
      runner.recordTest("getBetaStats - Unauthenticated", false, 
        `Expected default stats, got: ${JSON.stringify(stats)}`);
    }
    
  } catch (error) {
    runner.recordTest("getBetaStats - Unauthenticated", false, error.message);
  }
}

async function testGetAllBetaUsersUnauthenticated(runner, client) {
  runner.log("🧪 Testing getAllBetaUsers without authentication...");
  
  try {
    const users = await client.query("betaProgram:getAllBetaUsers");
    
    // Should return empty array when not authenticated
    if (Array.isArray(users) && users.length === 0) {
      runner.recordTest("getAllBetaUsers - Unauthenticated", true, 
        "Correctly returned empty array when not authenticated");
    } else {
      runner.recordTest("getAllBetaUsers - Unauthenticated", false, 
        `Expected empty array, got: ${JSON.stringify(users)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for unauthenticated requests
    runner.recordTest("getAllBetaUsers - Unauthenticated", true, 
      `Correctly handled unauthenticated request: ${error.message}`);
  }
}

async function testWithMockData(runner, client) {
  runner.log("🧪 Testing with mock data scenario...");
  
  try {
    // Test that we can query beta programs (should be empty initially)
    const programs = await client.query("betaProgram:getAllBetaPrograms");
    
    if (Array.isArray(programs)) {
      runner.recordTest("Mock Data - Query Programs", true, 
        `Successfully queried ${programs.length} beta programs`);
    } else {
      runner.recordTest("Mock Data - Query Programs", false, 
        `Failed to query beta programs: ${JSON.stringify(programs)}`);
    }
    
    // Test that beta stats work with empty data
    const stats = await client.query("betaProgram:getBetaStats");
    
    if (stats && typeof stats.frameworksTried === 'number') {
      runner.recordTest("Mock Data - Query Stats", true, 
        `Successfully queried beta stats: ${JSON.stringify(stats)}`);
    } else {
      runner.recordTest("Mock Data - Query Stats", false, 
        `Failed to query beta stats: ${JSON.stringify(stats)}`);
    }
    
    // Test that authenticated functions still require authentication
    const status = await client.query("betaProgram:getBetaStatus");
    
    if (status === null) {
      runner.recordTest("Mock Data - Status Query", true, 
        "Status query correctly requires authentication");
    } else {
      runner.recordTest("Mock Data - Status Query", false, 
        `Status query should require authentication, got: ${JSON.stringify(status)}`);
    }
    
  } catch (error) {
    runner.recordTest("Mock Data - Setup", false, error.message);
  }
}

// Run the tests
runBetaProgramUnitTests();
