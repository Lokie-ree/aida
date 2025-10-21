#!/usr/bin/env node

/**
 * Create Test Users for Pelican AI Personas
 * 
 * This script creates test users for each persona defined in the PRD:
 * - Sarah Johnson (High School English Teacher, Jefferson Parish)
 * - Michael Chen (Elementary Math Teacher, Lafayette) 
 * - Dr. Lisa Rodriguez (Middle School Science Teacher, Baton Rouge)
 * 
 * Each user gets:
 * - Better Auth account with secure password
 * - User profile with persona-specific data
 * - Beta program enrollment
 * - Sample beta signup record
 * 
 * **Architecture Compliance:** Uses ConvexTestClient methods only, no direct DB access.
 */

import { ConvexTestClient, TestRunner } from "./test-utils.js";

const client = new ConvexTestClient(process.env.CONVEX_URL || "https://kindly-setter-935.convex.cloud");

const testUsers = [
  {
    // Sarah Johnson - High School English Teacher, Jefferson Parish
    // Pain Points: Overwhelmed by AI tools, lacks time for lesson planning, ethical concerns
    // Tech Comfort: Moderate - uses district-provided tools
    email: "sarah.johnson@jefferson.k12.la.us",
    password: "SecurePassword123!",
    name: "Sarah Johnson",
    school: "Jefferson Parish High School",
    subject: "English Language Arts",
    gradeLevel: "9-12",
    district: "Jefferson Parish",
    role: "teacher",
    persona: "sarah-johnson"
  },
  {
    // Michael Chen - Elementary Math Teacher, Lafayette
    // Pain Points: Struggles with AI prompt writing, wants Louisiana-specific guidance
    // Tech Comfort: High - early adopter of new tools
    email: "michael.chen@lafayette.k12.la.us", 
    password: "SecurePassword123!",
    name: "Michael Chen",
    school: "Lafayette Elementary School",
    subject: "Mathematics",
    gradeLevel: "3-5",
    district: "Lafayette Parish",
    role: "teacher",
    persona: "michael-chen"
  },
  {
    // Dr. Lisa Rodriguez - Middle School Science Teacher, Baton Rouge
    // Pain Points: Needs standards-aligned content, wants to share innovations
    // Tech Comfort: High - tech-savvy educator
    email: "lisa.rodriguez@eastbatonrouge.k12.la.us",
    password: "SecurePassword123!",
    name: "Dr. Lisa Rodriguez", 
    school: "Baton Rouge Middle School",
    subject: "Science",
    gradeLevel: "6-8",
    district: "East Baton Rouge Parish",
    role: "teacher",
    persona: "lisa-rodriguez"
  }
];

async function createTestUsers() {
  const runner = new TestRunner("Test User Creation");
  runner.log("🚀 Creating test users for Pelican AI personas...\n");

  for (const userData of testUsers) {
    try {
      runner.log(`Creating user: ${userData.name} (${userData.email})`);
      
      // Use the new architecture-compliant test user creation method
      const result = await client.createTestUser(
        userData.email,
        userData.password,
        userData.name,
        userData.school,
        userData.subject
      );
      
      if (result.success) {
        runner.log(`✅ Successfully created test user: ${userData.name}`, "success");
        runner.recordTest(`Create ${userData.persona}`, true, `User ID: ${result.userId}`);
      } else {
        runner.log(`❌ Failed to create user: ${result.message}`, "error");
        runner.recordTest(`Create ${userData.persona}`, false, result.message);
      }
      
    } catch (error) {
      runner.log(`❌ Error creating user ${userData.name}: ${error.message}`, "error");
      runner.recordTest(`Create ${userData.persona}`, false, error.message);
    }
  }

  runner.log("🎉 Test user creation complete!");
  runner.log("\n📋 Test User Credentials:");
  runner.log("=" .repeat(50));
  testUsers.forEach(user => {
    runner.log(`👤 ${user.name}`);
    runner.log(`   Email: ${user.email}`);
    runner.log(`   Password: ${user.password}`);
    runner.log(`   Persona: ${user.persona}`);
    runner.log(`   School: ${user.school}`);
    runner.log(`   Subject: ${user.subject}`);
    runner.log("");
  });
  
  runner.log("🔗 Login at: http://localhost:5173");
  runner.log("💡 Use these credentials to test different user personas!");
  
  // Print test results
  runner.printResults();
}

// Run the script
createTestUsers().catch(console.error);
