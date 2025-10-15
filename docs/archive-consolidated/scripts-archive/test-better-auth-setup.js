#!/usr/bin/env node

/**
 * Test Better Auth Setup
 * 
 * This script tests the Better Auth configuration to ensure it's working correctly.
 */

import { ConvexHttpClient } from "convex/browser";

// Configuration
const CONVEX_URL = "https://kindly-setter-935.convex.cloud";

async function testBetterAuthSetup() {
  console.log("🧪 Testing Better Auth Setup...\n");
  
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    // Test 1: Check if Better Auth functions are available
    console.log("1. Testing Better Auth functions...");
    
    try {
      const currentUser = await client.query("auth:getCurrentUser");
      console.log("   ✅ getCurrentUser function is available");
      console.log(`   Current user: ${currentUser ? 'authenticated' : 'not authenticated'}`);
    } catch (error) {
      console.log("   ❌ getCurrentUser function failed:", error.message);
    }
    
    // Test 2: Check if Better Auth endpoints are accessible
    console.log("\n2. Testing Better Auth endpoints...");
    
    const endpoints = [
      "/api/auth/session",
      "/api/auth/sign-up/email",
      "/api/auth/sign-in/email",
      "/api/auth/sign-out"
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`https://kindly-setter-935.convex.site${endpoint}`, {
          method: endpoint.includes("session") ? "GET" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: endpoint.includes("session") ? undefined : JSON.stringify({})
        });
        
        console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
      } catch (error) {
        console.log(`   ${endpoint}: Error - ${error.message}`);
      }
    }
    
    // Test 3: Check if triggers are working
    console.log("\n3. Testing triggers...");
    
    try {
      const profiles = await client.query("userProfiles:getAllUserProfiles");
      console.log(`   ✅ User profiles query working: ${profiles.length} profiles found`);
    } catch (error) {
      console.log("   ❌ User profiles query failed:", error.message);
    }
    
    console.log("\n🎉 Better Auth setup test completed!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testBetterAuthSetup();
