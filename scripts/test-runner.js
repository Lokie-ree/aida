#!/usr/bin/env node

/**
 * Main Test Runner for Beta Authentication Testing
 * 
 * Orchestrates all test suites and provides a unified interface for running tests.
 * Supports running individual test suites or all tests together.
 */

import { spawn } from 'child_process';
import { TestRunner, cleanTestData } from './test-utils.js';
import { ConvexTestClient } from './test-utils.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

// Test suites configuration
const TEST_SUITES = {
  unit: [
    'unit/test-unit-beta-signup.js',
    'unit/test-unit-user-profiles.js',
    'unit/test-unit-beta-program.js',
    'unit/test-unit-auth.js',
    'unit/test-unit-frameworks.js',
    'unit/test-unit-community.js',
    'unit/test-unit-dashboard.js',
    'unit/test-unit-admin.js'
  ],
  integration: [
    'integration/test-integration-signup-flow.js',
    'integration/test-integration-auth-initialization.js',
    'integration/test-integration-phase2-features.js'
  ],
  e2e: [
    'e2e/test-e2e-phase2-user-journey.js'
  ],
  api: [
    'api/test-api-better-auth.js',
    'api/test-api-phase2-emails.js'
  ],
  diagnostic: [
    'diagnostic/test-environment-config.js',
    'diagnostic/test-database-state.js'
  ],
  phase2: [
    'unit/test-unit-frameworks.js',
    'unit/test-unit-community.js',
    'unit/test-unit-dashboard.js',
    'unit/test-unit-admin.js',
    'integration/test-integration-phase2-features.js',
    'e2e/test-e2e-phase2-user-journey.js',
    'api/test-api-phase2-emails.js'
  ]
};

async function runTestRunner() {
  const args = process.argv.slice(2);
  const suite = args.find(arg => arg.startsWith('--suite='))?.split('=')[1] || 
                args.find(arg => arg === '--suite') ? args[args.indexOf('--suite') + 1] : null;
  const cleanup = args.includes('--cleanup');
  const help = args.includes('--help') || args.includes('-h');
  const force = args.includes('--force'); // Add force flag to bypass safety checks
  
  if (help) {
    printHelp();
    process.exit(0);
  }
  
  const runner = new TestRunner("Beta Auth Test Suite");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Beta Authentication Test Suite...");
    runner.log(`🔗 Convex URL: ${CONVEX_URL}`);
    
    // PRODUCTION DATA SAFETY CHECK
    if (!force) {
      runner.log("🔍 Checking for production data safety...");
      try {
        const safetyCheck = await client.query("testDataCleanup:verifyCleanupSafety");
        
        if (!safetyCheck.safe) {
          runner.log("⚠️  PRODUCTION DATA DETECTED!", "error");
          runner.log("📊 Real data counts:", "warning");
          Object.entries(safetyCheck.realDataCounts).forEach(([table, count]) => {
            if (count > 0) {
              runner.log(`   - ${table}: ${count} records`, "warning");
            }
          });
          
          runner.log("", "error");
          runner.log("🛡️  SAFETY PROTOCOL ACTIVATED", "error");
          runner.log("❌ Tests are ABORTED to protect production data", "error");
          runner.log("", "error");
          runner.log("💡 To run tests anyway (NOT RECOMMENDED):", "info");
          runner.log("   npm run test:unit:frameworks -- --force", "info");
          runner.log("", "error");
          runner.log("🔧 RECOMMENDED SOLUTIONS:", "info");
          runner.log("   1. Use a separate test environment", "info");
          runner.log("   2. Mark production data with isTestData: false", "info");
          runner.log("   3. Use testDataCleanup:getDatabaseState to inspect data", "info");
          
          process.exit(1);
        } else {
          runner.log("✅ Production data safety check passed");
        }
      } catch (error) {
        runner.log(`⚠️  Could not verify production data safety: ${error.message}`, "warning");
        runner.log("💡 Consider using --force flag if you're sure it's safe", "info");
        if (!force) {
          process.exit(1);
        }
      }
    } else {
      runner.log("⚠️  FORCE MODE: Bypassing production data safety checks", "warning");
    }
    
    if (cleanup) {
      runner.log("🧹 Running cleanup only...");
      await runCleanup(runner, client);
      return;
    }
    
    // Clean database before starting tests
    runner.log("🧹 Cleaning database before tests...");
    await runCentralizedCleanup(runner, client);
    
    if (suite) {
      await runTestSuite(runner, suite);
    } else {
      await runAllTestSuites(runner);
    }
    
    // Print final results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function runTestSuite(runner, suiteName) {
  if (!TEST_SUITES[suiteName]) {
    runner.log(`❌ Unknown test suite: ${suiteName}`, "error");
    runner.log(`Available suites: ${Object.keys(TEST_SUITES).join(', ')}`);
    process.exit(1);
  }
  
  runner.log(`🧪 Running ${suiteName} test suite...`);
  
  const tests = TEST_SUITES[suiteName];
  let passed = 0;
  let failed = 0;
  
  for (const testFile of tests) {
    runner.log(`  Running ${testFile}...`);
    
    try {
      const result = await runSingleTest(testFile);
      if (result.success) {
        passed++;
        runner.log(`  ✅ ${testFile} passed`);
      } else {
        failed++;
        runner.log(`  ❌ ${testFile} failed: ${result.error}`);
      }
    } catch (error) {
      failed++;
      runner.log(`  ❌ ${testFile} error: ${error.message}`);
    }
  }
  
  runner.log(`📊 ${suiteName} suite results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    runner.recordTest(`${suiteName} Suite`, false, `${failed} tests failed`);
  } else {
    runner.recordTest(`${suiteName} Suite`, true, `All ${passed} tests passed`);
  }
}

async function runAllTestSuites(runner) {
  runner.log("🧪 Running all test suites...");
  
  const suites = Object.keys(TEST_SUITES);
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const suiteName of suites) {
    runner.log(`\n📋 Running ${suiteName} suite...`);
    
    const tests = TEST_SUITES[suiteName];
    let suitePassed = 0;
    let suiteFailed = 0;
    
    for (const testFile of tests) {
      runner.log(`  Running ${testFile}...`);
      
      try {
        const result = await runSingleTest(testFile);
        if (result.success) {
          suitePassed++;
          totalPassed++;
          runner.log(`  ✅ ${testFile} passed`);
        } else {
          suiteFailed++;
          totalFailed++;
          runner.log(`  ❌ ${testFile} failed: ${result.error}`);
        }
      } catch (error) {
        suiteFailed++;
        totalFailed++;
        runner.log(`  ❌ ${testFile} error: ${error.message}`);
      }
    }
    
    runner.log(`  📊 ${suiteName}: ${suitePassed} passed, ${suiteFailed} failed`);
    
    if (suiteFailed > 0) {
      runner.recordTest(`${suiteName} Suite`, false, `${suiteFailed} tests failed`);
    } else {
      runner.recordTest(`${suiteName} Suite`, true, `All ${suitePassed} tests passed`);
    }
  }
  
  runner.log(`\n📊 Overall results: ${totalPassed} passed, ${totalFailed} failed`);
}

async function runSingleTest(testFile) {
  return new Promise((resolve) => {
    const child = spawn('node', [`scripts/${testFile}`], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({
        success: code === 0,
        error: stderr || `Exit code: ${code}`,
        stdout,
        stderr
      });
    });
    
    child.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
        stdout,
        stderr
      });
    });
  });
}

async function runCentralizedCleanup(runner, client) {
  try {
    runner.log("🧹 Starting centralized test data cleanup...");
    
    // Use new centralized cleanup system
    const result = await client.mutation("testDataCleanup:deleteAllTestData", {});
    
    if (result.success) {
      runner.log(`✅ Cleanup completed successfully`);
      runner.log(`📊 Deleted records:`, "info");
      Object.entries(result.deletedCounts).forEach(([table, count]) => {
        runner.log(`  ${table}: ${count} records`, "info");
      });
      
      if (result.warnings.length > 0) {
        runner.log("⚠️ Cleanup warnings:", "warn");
        result.warnings.forEach(warning => {
          runner.log(`  ${warning}`, "warn");
        });
      }
      
      return true;
    } else {
      runner.log(`❌ Cleanup failed with warnings:`, "error");
      result.warnings.forEach(warning => {
        runner.log(`  ${warning}`, "error");
      });
      return false;
    }
  } catch (error) {
    runner.log(`❌ Cleanup error: ${error.message}`, "error");
    return false;
  }
}

async function runCleanup(runner, client) {
  try {
    const result = await runCentralizedCleanup(runner, client);
    if (result) {
      runner.recordTest("Database Cleanup", true, "Database cleaned successfully");
    } else {
      runner.recordTest("Database Cleanup", false, "Database cleanup failed");
    }
    
    const success = runner.printResults();
    process.exit(success ? 0 : 1);
  } catch (error) {
    runner.log(`❌ Cleanup error: ${error.message}`, "error");
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Beta Authentication Test Suite

Usage:
  node scripts/test-runner.js [options]

Options:
  --suite <name>     Run specific test suite (unit, integration, e2e, api, diagnostic)
  --cleanup          Run database cleanup only
  --force            Bypass production data safety checks (NOT RECOMMENDED)
  --help, -h         Show this help message

🛡️  PRODUCTION DATA SAFETY:
  The test suite now includes automatic production data protection:
  - Automatically detects production data in the database
  - Prevents accidental deletion of real user data
  - Only cleans test data marked with isTestData: true
  - Aborts tests if production data is detected (use --force to override)

Test Suites:
  unit               Unit tests for individual functions
  integration        Integration tests for cross-component flows
  e2e                End-to-end tests for complete user journey
  api                API tests for Better Auth endpoints
  diagnostic         Diagnostic tests for environment and database
  phase2             Phase 2 feature tests (frameworks, community, analytics)

Examples:
  node scripts/test-runner.js                    # Run all tests
  node scripts/test-runner.js --suite unit       # Run unit tests only
  node scripts/test-runner.js --suite phase2     # Run Phase 2 feature tests only
  node scripts/test-runner.js --suite e2e        # Run E2E tests only
  node scripts/test-runner.js --cleanup          # Clean test data only
  node scripts/test-runner.js --force            # Bypass safety checks (DANGEROUS)

Individual Test Scripts:
  npm run test:unit:beta-signup                  # Run beta signup unit tests
  npm run test:integration:signup-flow           # Run signup flow integration tests
  npm run test:e2e:automated                     # Run automated E2E tests
  npm run test:api:better-auth                   # Run Better Auth API tests
  npm run test:diagnostic:env                    # Run environment config tests
  npm run test:diagnostic:db                     # Run database state tests

🔧 SAFE TESTING RECOMMENDATIONS:
  1. Use a separate test environment for development
  2. Mark production data with isTestData: false
  3. Use testDataCleanup:getDatabaseState to inspect data
  4. Never use --force unless absolutely necessary

Environment Variables:
  VITE_CONVEX_URL    Convex deployment URL (default: https://kindly-setter-935.convex.cloud)
  SITE_URL           Site URL for CORS testing (default: https://pelicanai.org)
  BETTER_AUTH_SECRET Better Auth secret key
  RESEND_API_KEY     Resend API key for email testing
`);
}

// Run the test runner
runTestRunner();
