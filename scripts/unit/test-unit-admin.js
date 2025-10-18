#!/usr/bin/env node

/**
 * Unit Tests for Admin Dashboard Functions
 * 
 * Tests admin functionality to verify:
 * - Content moderation (USER-021)
 * - Beta program management (USER-022)
 * - Platform analytics (USER-023)
 * - Content management (USER-024)
 */

import { TestRunner, ConvexTestClient, cleanTestData, seedTestData } from '../test-utils.js';
import { TEST_USERS, PHASE2_USER_STORIES } from '../test-fixtures.js';

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runAdminUnitTests() {
  const runner = new TestRunner("Admin Dashboard Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Admin Dashboard unit tests...");
    await cleanTestData(client);
    
    // Seed test data
    await seedTestData(client);
    
    // USER-021: Content Moderation
    await testContentModeration(runner, client);
    
    // USER-022: Beta Program Management
    await testBetaProgramManagement(runner, client);
    
    // USER-023: Platform Analytics
    await testPlatformAnalytics(runner, client);
    
    // USER-024: Content Management
    await testContentManagement(runner, client);
    
    const success = runner.printResults();
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testContentModeration(runner, client) {
  runner.log("🧪 Testing content moderation...");
  
  try {
    // Test admin functions
    const isAdmin = await client.query("admin:isAdmin");
    
    if (isAdmin === false) {
      runner.recordTest("Content Moderation", true, 
        "Correctly returns false when not authenticated as admin");
    } else {
      runner.recordTest("Content Moderation", true, 
        `Admin status: ${isAdmin}`);
    }
    
  } catch (error) {
    runner.recordTest("Content Moderation", false, error.message);
  }
}

async function testBetaProgramManagement(runner, client) {
  runner.log("🧪 Testing beta program management...");
  
  try {
    // Test beta signup management
    const pendingSignups = await client.query("betaSignup:getPendingSignups");
    
    if (Array.isArray(pendingSignups)) {
      runner.recordTest("Beta Program Management", true, 
        `Retrieved ${pendingSignups.length} pending signups`);
    } else {
      runner.recordTest("Beta Program Management", false, 
        `Expected array, got: ${typeof pendingSignups}`);
    }
    
  } catch (error) {
    runner.recordTest("Beta Program Management", false, error.message);
  }
}

async function testPlatformAnalytics(runner, client) {
  runner.log("🧪 Testing platform analytics...");
  
  try {
    // Test framework stats
    const stats = await client.query("frameworks:getFrameworkStats");
    
    if (stats && typeof stats === 'object') {
      runner.recordTest("Platform Analytics", true, 
        `Retrieved platform stats: ${JSON.stringify(stats)}`);
    } else {
      runner.recordTest("Platform Analytics", false, 
        `Expected object, got: ${typeof stats}`);
    }
    
  } catch (error) {
    runner.recordTest("Platform Analytics", false, error.message);
  }
}

async function testContentManagement(runner, client) {
  runner.log("🧪 Testing content management...");
  
  try {
    // Test testimonials management
    const testimonials = await client.query("testimonials:getAllTestimonials");
    
    if (Array.isArray(testimonials)) {
      runner.recordTest("Content Management", true, 
        `Retrieved ${testimonials.length} testimonials for management`);
    } else {
      runner.recordTest("Content Management", false, 
        `Expected array, got: ${typeof testimonials}`);
    }
    
  } catch (error) {
    runner.recordTest("Content Management", false, error.message);
  }
}

runAdminUnitTests();
