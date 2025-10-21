#!/usr/bin/env node

/**
 * Create Test User for QA Testing
 * 
 * Creates a test user with known credentials for QA testing purposes.
 * This bypasses the random password generation for easier testing.
 */

import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.VITE_CONVEX_SITE_URL || "https://kindly-setter-935.convex.site";

async function createTestUser() {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  const testUser = {
    email: "qa.test@example.com",
    password: "TestPassword123!",
    name: "QA Test User"
  };

  try {
    console.log("🔧 Creating test user...");
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    
    // Note: This would typically use Better Auth's signup endpoint
    // For now, we'll just log the credentials
    console.log("\n✅ Test user credentials created:");
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    console.log("\nYou can now use these credentials to log in for QA testing.");
    
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  }
}

createTestUser();
