#!/usr/bin/env node

/**
 * Create Admin Test User
 * 
 * This script creates an admin user for testing the admin dashboard.
 * The user will be created through the Better Auth signup endpoint.
 * 
 * After running this script, you need to:
 * 1. Go to the Convex dashboard (https://dashboard.convex.dev)
 * 2. Navigate to your deployment (kindly-setter-935)
 * 3. Find the `user` table in the Better Auth component
 * 4. Locate the user with email: rplapointjr+reset@gmail.com
 * 5. Edit the user and add a `role` field with value "admin"
 * 
 * Usage:
 *   node scripts/create-admin-user.js
 */

const CONVEX_SITE_URL = process.env.VITE_CONVEX_SITE_URL || 'https://kindly-setter-935.convex.site';
const ADMIN_EMAIL = 'delivered@resend.dev';
const ADMIN_PASSWORD = 'TestAdmin123!'; // Change this after first login
const ADMIN_NAME = 'Admin User';

async function createAdminUser() {
  console.log('🚀 Creating admin test user...\n');
  console.log('Configuration:');
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Name: ${ADMIN_NAME}`);
  console.log(`  Convex Site URL: ${CONVEX_SITE_URL}\n`);

  try {
    // Call Better Auth signup endpoint
    const signupUrl = `${CONVEX_SITE_URL}/api/auth/sign-up/email`;
    console.log(`📡 Calling signup endpoint: ${signupUrl}`);

    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
      }),
    });

    const responseText = await response.text();
    console.log(`\n📥 Response status: ${response.status}`);
    console.log(`📥 Response body: ${responseText}\n`);

    if (!response.ok) {
      console.error('❌ Failed to create user');
      console.error(`Status: ${response.status}`);
      console.error(`Body: ${responseText}`);
      process.exit(1);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse response as JSON');
      console.error('Response was:', responseText);
      process.exit(1);
    }

    console.log('✅ User created successfully!\n');
    console.log('📋 User details:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n⚠️  IMPORTANT: Next steps to make this user an admin:\n');
    console.log('1. Go to Convex Dashboard: https://dashboard.convex.dev/d/kindly-setter-935');
    console.log('2. Navigate to Data > betterAuth component > user table');
    console.log(`3. Find the user with email: ${ADMIN_EMAIL}`);
    console.log('4. Click on the user to edit');
    console.log('5. Add a field: role = "admin"');
    console.log('6. Save the changes');
    console.log('\n🔐 Login credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n🌐 Admin dashboard: http://localhost:5173/admin');
    console.log('\n✨ Done!');

  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();

