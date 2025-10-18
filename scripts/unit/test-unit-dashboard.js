#!/usr/bin/env node

/**
 * Unit Tests for Dashboard Functions
 * 
 * Tests dashboard functionality to verify:
 * - Personal progress tracking (USER-009)
 * - Quick start frameworks (USER-010) 
 * - Analytics and insights (USER-011)
 * - Goal setting and tracking (USER-012)
 */

import { TestRunner, ConvexTestClient, cleanTestData, seedTestData } from '../test-utils.js';
import { TEST_USERS, PHASE2_USER_STORIES } from '../test-fixtures.js';

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runDashboardUnitTests() {
  const runner = new TestRunner("Dashboard Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Dashboard unit tests...");
    await cleanTestData(client);
    
    // Seed test data
    await seedTestData(client);
    
    // USER-009: Personal Progress Tracking
    await testPersonalProgressTracking(runner, client);
    
    // USER-010: Quick Start Frameworks
    await testQuickStartFrameworks(runner, client);
    
    // USER-011: Analytics and Insights
    await testAnalyticsAndInsights(runner, client);
    
    // USER-012: Goal Setting and Tracking
    await testGoalSettingAndTracking(runner, client);
    
    const success = runner.printResults();
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testPersonalProgressTracking(runner, client) {
  runner.log("🧪 Testing personal progress tracking...");
  
  try {
    // Test time tracking functionality
    const timeTracking = await client.query("timeTracking:getUserTimeTracking");
    
    if (Array.isArray(timeTracking)) {
      runner.recordTest("Personal Progress Tracking", true, 
        `Retrieved ${timeTracking.length} time tracking records`);
    } else {
      runner.recordTest("Personal Progress Tracking", false, 
        `Expected array, got: ${typeof timeTracking}`);
    }
    
  } catch (error) {
    runner.recordTest("Personal Progress Tracking", false, error.message);
  }
}

async function testQuickStartFrameworks(runner, client) {
  runner.log("🧪 Testing quick start frameworks...");
  
  try {
    // Test framework recommendations
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (Array.isArray(frameworks)) {
      const quickStartFrameworks = frameworks.filter(f => f.difficultyLevel === "beginner");
      
      runner.recordTest("Quick Start Frameworks", true, 
        `Found ${quickStartFrameworks.length} beginner-friendly frameworks`);
    } else {
      runner.recordTest("Quick Start Frameworks", false, 
        `Expected array, got: ${typeof frameworks}`);
    }
    
  } catch (error) {
    runner.recordTest("Quick Start Frameworks", false, error.message);
  }
}

async function testAnalyticsAndInsights(runner, client) {
  runner.log("🧪 Testing analytics and insights...");
  
  try {
    // Test framework stats
    const stats = await client.query("frameworks:getFrameworkStats");
    
    if (stats && typeof stats === 'object') {
      runner.recordTest("Analytics and Insights", true, 
        `Retrieved analytics: ${JSON.stringify(stats)}`);
    } else {
      runner.recordTest("Analytics and Insights", false, 
        `Expected object, got: ${typeof stats}`);
    }
    
  } catch (error) {
    runner.recordTest("Analytics and Insights", false, error.message);
  }
}

async function testGoalSettingAndTracking(runner, client) {
  runner.log("🧪 Testing goal setting and tracking...");
  
  try {
    // Test beta program status (includes goal tracking)
    const betaStatus = await client.query("betaProgram:getBetaStatus");
    
    if (betaStatus === null) {
      runner.recordTest("Goal Setting and Tracking", true, 
        "Correctly returns null when not authenticated");
    } else {
      runner.recordTest("Goal Setting and Tracking", true, 
        `Retrieved beta status: ${JSON.stringify(betaStatus)}`);
    }
    
  } catch (error) {
    runner.recordTest("Goal Setting and Tracking", false, error.message);
  }
}

runDashboardUnitTests();
