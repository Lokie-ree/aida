#!/usr/bin/env node

/**
 * Shared Test Utilities for Beta Authentication Testing
 * 
 * Provides common utilities for all test scripts including:
 * - TestRunner class for managing test execution and results
 * - ConvexTestClient class for interacting with Convex
 * - Helper functions for data generation and cleanup
 */

import { ConvexHttpClient } from "convex/browser";

export class TestRunner {
  constructor(name) {
    this.name = name;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
    this.startTime = Date.now();
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const prefix = type === "error" ? "❌" : type === "success" ? "✅" : type === "warning" ? "⚠️" : "ℹ️";
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  recordTest(name, passed, details = "") {
    this.results.tests.push({ name, passed, details });
    if (passed) {
      this.results.passed++;
      this.log(`PASS: ${name}`, "success");
    } else {
      this.results.failed++;
      this.log(`FAIL: ${name} - ${details}`, "error");
    }
  }

  printResults() {
    const duration = Date.now() - this.startTime;
    const total = this.results.passed + this.results.failed;
    const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;

    this.log(`\n📊 Test Results Summary for ${this.name}:`);
    this.log(`✅ Passed: ${this.results.passed}`);
    this.log(`❌ Failed: ${this.results.failed}`);
    this.log(`📈 Success Rate: ${successRate}%`);
    this.log(`⏱️  Duration: ${duration}ms`);

    if (this.results.failed > 0) {
      this.log("\n❌ Failed Tests:");
      this.results.tests.filter(t => !t.passed).forEach(test => {
        this.log(`  - ${test.name}: ${test.details}`);
      });
    }

    return this.results.failed === 0;
  }

  getResults() {
    return this.results;
  }
}

export class ConvexTestClient {
  constructor(url) {
    this.client = new ConvexHttpClient(url);
    this.url = url;
  }

  async query(path, args = {}) {
    try {
      return await this.client.query(path, args);
    } catch (error) {
      throw new Error(`Query ${path} failed: ${error.message}`);
    }
  }

  async mutation(path, args = {}) {
    try {
      return await this.client.mutation(path, args);
    } catch (error) {
      throw new Error(`Mutation ${path} failed: ${error.message}`);
    }
  }

  async action(path, args = {}) {
    try {
      return await this.client.action(path, args);
    } catch (error) {
      throw new Error(`Action ${path} failed: ${error.message}`);
    }
  }

  getUrl() {
    return this.url;
  }

  // Test User Management Methods (Architecture Compliant)
  
  /**
   * Create a test user with known credentials for QA testing.
   * Uses the proper authentication flow through Convex functions only.
   * 
   * @param {string} email - Test user email
   * @param {string} password - Test user password  
   * @param {string} name - Test user display name
   * @param {string} [school] - Optional school name
   * @param {string} [subject] - Optional subject area
   * @returns {Object} Result with success status and credentials
   */
  async createTestUser(email, password, name, school, subject) {
    try {
      return await this.mutation("testDataCleanup:createTestUser", {
        email,
        password,
        name,
        school,
        subject,
        isTestData: true
      });
    } catch (error) {
      throw new Error(`Failed to create test user: ${error.message}`);
    }
  }
  
  /**
   * Get test user credentials for QA testing.
   * Only works for users with isTestData: true.
   * 
   * @param {string} email - Test user email
   * @returns {Object|null} Credentials object or null if not found
   */
  async getTestUserCredentials(email) {
    try {
      return await this.query("testDataCleanup:getTestUserCredentials", {
        email
      });
    } catch (error) {
      throw new Error(`Failed to get test user credentials: ${error.message}`);
    }
  }
  
  /**
   * List all test users for QA management.
   * 
   * @returns {Array} List of test user information
   */
  async listTestUsers() {
    try {
      return await this.query("testDataCleanup:listTestUsers", {});
    } catch (error) {
      throw new Error(`Failed to list test users: ${error.message}`);
    }
  }
}

export function generateTestEmail(prefix = "test") {
  // Use Resend test emails with labeling for better test organization
  // See: https://resend.com/docs/dashboard/emails/send-test-emails
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits for uniqueness
  return `delivered+${prefix}-${timestamp}@resend.dev`;
}

export function generateTestPassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function generateTestName() {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

export function generateTestSchool() {
  const schools = [
    'Lafayette High School',
    'Acadiana High School',
    'Comeaux High School',
    'Carencro High School',
    'Northside High School',
    'Southside High School'
  ];
  return schools[Math.floor(Math.random() * schools.length)];
}

export function generateTestSubject() {
  const subjects = [
    'Mathematics',
    'English Language Arts',
    'Science',
    'Social Studies',
    'Foreign Language',
    'Physical Education',
    'Art',
    'Music'
  ];
  return subjects[Math.floor(Math.random() * subjects.length)];
}

/**
 * SAFE Test Data Cleanup - Only deletes records with isTestData: true
 * 
 * This function replaces the old cleanTestData() which was deleting ALL data.
 * It now uses the safe testDataCleanup system that only deletes test data.
 */
export async function cleanTestData(client) {
  const runner = new TestRunner("Safe Test Data Cleanup");
  
  try {
    runner.log("🧹 Starting SAFE test data cleanup (only isTestData: true)...");

    // First, verify cleanup safety
    runner.log("🔍 Verifying cleanup safety...");
    const safetyCheck = await client.query("testDataCleanup:verifyCleanupSafety");
    
    if (!safetyCheck.safe) {
      runner.log("⚠️  Safety warnings detected:", "warning");
      safetyCheck.warnings.forEach(warning => {
        runner.log(`   - ${warning}`, "warning");
      });
      
      // Check if there's real data that would be affected
      const hasRealData = Object.values(safetyCheck.realDataCounts).some(count => count > 0);
      if (hasRealData) {
        runner.log("❌ ABORTING: Real data detected that could be affected", "error");
        runner.log("💡 Use testDataCleanup:deleteAllTestData directly if you're sure", "info");
        runner.recordTest("Database Cleanup", false, "Aborted due to real data presence");
        return false;
      }
    }

    // Get current test data counts
    const testDataCounts = await client.query("testDataCleanup:getTestDataCounts");
    const totalTestRecords = Object.values(testDataCounts).reduce((sum, count) => sum + count, 0);
    
    if (totalTestRecords === 0) {
      runner.log("✅ No test data found to clean");
      runner.recordTest("Database Cleanup", true, "No test data to clean");
      return true;
    }

    runner.log(`📊 Found ${totalTestRecords} test records to clean:`);
    Object.entries(testDataCounts).forEach(([table, count]) => {
      if (count > 0) {
        runner.log(`   - ${table}: ${count} records`);
      }
    });

    // Perform safe cleanup using the internal mutation
    runner.log("🧹 Executing safe test data cleanup...");
    const cleanupResult = await client.mutation("testDataCleanup:deleteAllTestData");
    
    if (cleanupResult.success) {
      const totalDeleted = Object.values(cleanupResult.deletedCounts).reduce((sum, count) => sum + count, 0);
      runner.log(`✅ Safe test data cleanup completed: ${totalDeleted} test records deleted`);
      
      // Log detailed results
      Object.entries(cleanupResult.deletedCounts).forEach(([table, count]) => {
        if (count > 0) {
          runner.log(`   ✅ ${table}: ${count} test records deleted`);
        }
      });
      
      // Show any warnings
      if (cleanupResult.warnings.length > 0) {
        runner.log("⚠️  Cleanup warnings:", "warning");
        cleanupResult.warnings.forEach(warning => {
          runner.log(`   - ${warning}`, "warning");
        });
      }
      
      runner.recordTest("Database Cleanup", true, `${totalDeleted} test records deleted`);
      return true;
    } else {
      runner.log("❌ Test data cleanup failed", "error");
      cleanupResult.warnings.forEach(warning => {
        runner.log(`   - ${warning}`, "error");
      });
      runner.recordTest("Database Cleanup", false, "Cleanup failed");
      return false;
    }
    
  } catch (error) {
    runner.recordTest("Database Cleanup", false, error.message);
    runner.log(`❌ Safe test data cleanup failed: ${error.message}`, "error");
    return false;
  }
}

/**
 * LEGACY UNSAFE CLEANUP - DEPRECATED
 * 
 * This function is kept for reference but should NOT be used.
 * It deletes ALL data including production data.
 * 
 * @deprecated Use cleanTestData() instead which only deletes test data
 */
export async function cleanAllDataUnsafe(client) {
  const runner = new TestRunner("UNSAFE Database Cleanup (DEPRECATED)");
  
  runner.log("⚠️  WARNING: This function deletes ALL data including production data!", "error");
  runner.log("⚠️  This function is DEPRECATED and should not be used!", "error");
  runner.log("💡 Use cleanTestData() instead for safe test-only cleanup", "info");
  
  runner.recordTest("Database Cleanup", false, "Deprecated unsafe cleanup function called");
  return false;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function seedTestData(client) {
  const runner = new TestRunner("Test Data Seeding");
  
  try {
    runner.log("🌱 Seeding test data...");
    
    // Seed frameworks for Phase 2 testing
    await client.mutation("seedFrameworks:seedInitialFrameworks", {});
    runner.log("✅ Test data seeded successfully");
    return true;
  } catch (error) {
    runner.log(`❌ Test data seeding failed: ${error.message}`, "error");
    return false;
  }
}

export function validatePassword(password) {
  return password && password.length >= 8;
}

export function validateRequiredFields(obj, requiredFields) {
  const missing = requiredFields.filter(field => !obj[field] || obj[field] === "");
  return {
    valid: missing.length === 0,
    missing
  };
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export function truncateString(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}
