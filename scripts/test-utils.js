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
}

export function generateTestEmail(prefix = "test") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
}

export function generateTestPassword(length = 12) {
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

export async function cleanTestData(client) {
  const runner = new TestRunner("Database Cleanup");
  
  try {
    runner.log("🧹 Starting database cleanup...");

    // Get all records
    const [betaSignups, userProfiles, betaPrograms] = await Promise.all([
      client.query("betaSignup:getAllBetaSignups").catch(() => []),
      client.query("userProfiles:getAllUserProfiles").catch(() => []),
      client.query("betaProgram:getAllBetaPrograms").catch(() => [])
    ]);

    const deletePromises = [];

    // Delete beta signups
    for (const signup of betaSignups || []) {
      deletePromises.push(
        client.mutation("betaSignup:deleteBetaSignup", { signupId: signup._id })
          .catch(error => runner.log(`Warning: Failed to delete beta signup ${signup._id}: ${error.message}`, "warning"))
      );
    }

    // Delete user profiles
    for (const profile of userProfiles || []) {
      deletePromises.push(
        client.mutation("userProfiles:deleteUserProfile", { profileId: profile._id })
          .catch(error => runner.log(`Warning: Failed to delete user profile ${profile._id}: ${error.message}`, "warning"))
      );
    }

    // Delete beta programs
    for (const program of betaPrograms || []) {
      deletePromises.push(
        client.mutation("betaProgram:deleteBetaProgram", { programId: program._id })
          .catch(error => runner.log(`Warning: Failed to delete beta program ${program._id}: ${error.message}`, "warning"))
      );
    }

    await Promise.all(deletePromises);
    
    const totalDeleted = deletePromises.length;
    runner.recordTest("Database Cleanup", true, `${totalDeleted} records deleted`);
    runner.log(`✅ Database cleanup completed: ${totalDeleted} records deleted`);
    
    return true;
  } catch (error) {
    runner.recordTest("Database Cleanup", false, error.message);
    runner.log(`❌ Database cleanup failed: ${error.message}`, "error");
    return false;
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
