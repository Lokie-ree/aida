#!/usr/bin/env node

/**
 * Quick script to send a missed welcome email to a beta user
 * Usage: node scripts/send-missed-welcome.js user@example.com "User Name" "School Name"
 */

import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function sendMissedWelcomeEmail(email, name, school) {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log(`📧 Sending welcome email to ${email}...`);
    
    const result = await client.action("email:sendBetaWelcomeEmail", {
      email: email,
      name: name || "Educator",
      school: school || "Your School"
    });
    
    if (result.success) {
      console.log(`✅ Welcome email sent successfully!`);
      console.log(`📧 Email ID: ${result.emailId}`);
      console.log(`👤 Recipient: ${email}`);
      console.log(`📝 Name: ${name || "Educator"}`);
      console.log(`🏫 School: ${school || "Your School"}`);
    } else {
      console.log(`❌ Failed to send welcome email`);
    }
    
  } catch (error) {
    console.error(`💥 Error sending welcome email: ${error.message}`);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("Usage: node scripts/send-missed-welcome.js <email> [name] [school]");
  console.log("Example: node scripts/send-missed-welcome.js teacher@school.edu \"Jane Smith\" \"Lincoln High\"");
  process.exit(1);
}

const [email, name, school] = args;

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error("❌ Invalid email address format");
  process.exit(1);
}

sendMissedWelcomeEmail(email, name, school);
