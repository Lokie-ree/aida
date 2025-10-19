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
 */

import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.CONVEX_URL || "https://kindly-setter-935.convex.cloud");

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
  console.log("🚀 Creating test users for Pelican AI personas...\n");

  for (const userData of testUsers) {
    try {
      console.log(`Creating user: ${userData.name} (${userData.email})`);
      
      // Step 1: Create beta signup record
      console.log("  📝 Creating beta signup record...");
      const betaSignupResult = await client.mutation("betaSignup:createBetaSignup", {
        email: userData.email,
        name: userData.name,
        school: userData.school,
        subject: userData.subject,
        status: "approved" // Pre-approve for testing
      });
      console.log(`  ✅ Beta signup created: ${betaSignupResult.id}`);

      // Step 2: Create Better Auth user and profile
      console.log("  🔐 Creating Better Auth user...");
      const authResult = await client.mutation("auth:createUserDirectly", {
        email: userData.email,
        password: userData.password,
        name: userData.name
      });
      
      if (authResult.success) {
        console.log(`  ✅ User created successfully: ${authResult.userId}`);
        
        // Step 3: Update user profile with persona-specific data
        console.log("  👤 Updating user profile...");
        await client.mutation("userProfiles:updateUserProfile", {
          userId: authResult.userId,
          school: userData.school,
          subject: userData.subject,
          gradeLevel: userData.gradeLevel,
          district: userData.district,
          role: userData.role
        });
        console.log(`  ✅ Profile updated for ${userData.persona}`);

        // Step 4: Update beta program status to active
        console.log("  🎯 Activating beta program...");
        await client.mutation("betaProgram:updateBetaStatus", {
          userId: authResult.userId,
          status: "active",
          onboardingStep: 1
        });
        console.log(`  ✅ Beta program activated for ${userData.persona}`);

        console.log(`✅ Successfully created test user: ${userData.name}\n`);
      } else {
        console.error(`❌ Failed to create user: ${authResult.message}\n`);
      }
      
    } catch (error) {
      console.error(`❌ Error creating user ${userData.name}:`, error.message);
      console.log("");
    }
  }

  console.log("🎉 Test user creation complete!");
  console.log("\n📋 Test User Credentials:");
  console.log("=" .repeat(50));
  testUsers.forEach(user => {
    console.log(`👤 ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Persona: ${user.persona}`);
    console.log(`   School: ${user.school}`);
    console.log(`   Subject: ${user.subject}`);
    console.log("");
  });
  
  console.log("🔗 Login at: http://localhost:5173");
  console.log("💡 Use these credentials to test different user personas!");
}

// Run the script
createTestUsers().catch(console.error);
