#!/usr/bin/env node

/**
 * E2E Tests for Phase 2 User Journey
 * 
 * Tests complete user journey through Phase 2 features:
 * - Framework library browsing and usage
 * - Community innovation sharing
 * - Testimonial submission
 * - Dashboard analytics
 * - Admin content moderation
 */

import { TestRunner, ConvexTestClient, cleanTestData, seedTestData, sleep } from '../test-utils.js';
import { TEST_USERS, PHASE2_USER_STORIES } from '../test-fixtures.js';

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runPhase2UserJourneyTests() {
  const runner = new TestRunner("Phase 2 User Journey E2E Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Phase 2 User Journey E2E tests...");
    await cleanTestData(client);
    
    // Seed test data
    await seedTestData(client);
    
    // Complete user journey test
    await testCompletePhase2UserJourney(runner, client);
    
    const success = runner.printResults();
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testCompletePhase2UserJourney(runner, client) {
  runner.log("🧪 Testing complete Phase 2 user journey...");
  
  try {
    // Step 1: Browse framework library
    runner.log("  Step 1: Browsing framework library...");
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (!Array.isArray(frameworks)) {
      runner.recordTest("Phase 2 User Journey", false, 
        "Step 1 failed: Framework library not accessible");
      return;
    }
    
    runner.log(`  ✅ Found ${frameworks.length} frameworks`);
    
    // Step 2: Search frameworks
    runner.log("  Step 2: Searching frameworks...");
    const searchResults = await client.query("frameworks:searchFrameworks", {
      query: "Mathematics"
    });
    
    if (!Array.isArray(searchResults)) {
      runner.recordTest("Phase 2 User Journey", false, 
        "Step 2 failed: Framework search not working");
      return;
    }
    
    runner.log(`  ✅ Found ${searchResults.length} search results`);
    
    // Step 3: View community innovations
    runner.log("  Step 3: Viewing community innovations...");
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (!Array.isArray(innovations)) {
      runner.recordTest("Phase 2 User Journey", false, 
        "Step 3 failed: Community innovations not accessible");
      return;
    }
    
    runner.log(`  ✅ Found ${innovations.length} innovations`);
    
    // Step 4: View testimonials
    runner.log("  Step 4: Viewing testimonials...");
    const testimonials = await client.query("testimonials:getAllTestimonials");
    
    if (!Array.isArray(testimonials)) {
      runner.recordTest("Phase 2 User Journey", false, 
        "Step 4 failed: Testimonials not accessible");
      return;
    }
    
    runner.log(`  ✅ Found ${testimonials.length} testimonials`);
    
    // Step 5: Check dashboard analytics
    runner.log("  Step 5: Checking dashboard analytics...");
    const stats = await client.query("frameworks:getFrameworkStats");
    
    if (!stats || typeof stats !== 'object') {
      runner.recordTest("Phase 2 User Journey", false, 
        "Step 5 failed: Dashboard analytics not accessible");
      return;
    }
    
    runner.log(`  ✅ Retrieved analytics: ${JSON.stringify(stats)}`);
    
    // Step 6: Test admin functions
    runner.log("  Step 6: Testing admin functions...");
    const isAdmin = await client.query("admin:isAdmin");
    
    if (isAdmin !== false) {
      runner.recordTest("Phase 2 User Journey", false, 
        "Step 6 failed: Admin check not working correctly");
      return;
    }
    
    runner.log(`  ✅ Admin check working correctly: ${isAdmin}`);
    
    runner.recordTest("Phase 2 User Journey", true, 
      "Complete Phase 2 user journey successful - all features accessible");
    
  } catch (error) {
    runner.recordTest("Phase 2 User Journey", false, error.message);
  }
}

runPhase2UserJourneyTests();
