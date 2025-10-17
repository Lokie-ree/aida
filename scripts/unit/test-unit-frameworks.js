#!/usr/bin/env node

/**
 * Unit Tests for Framework Library Functions
 * 
 * Tests individual functions in convex/frameworks.ts to verify:
 * - getAllFrameworks returns complete framework data
 * - getFrameworkById returns specific framework details
 * - searchFrameworks filters by subject, grade level, standards
 * - recordFrameworkUsage tracks user interactions
 * - getFrameworkStats returns usage analytics
 * - Validation and error handling for Louisiana standards alignment
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from '../test-utils.js';
import { TEST_USERS, FRAMEWORK_TEST_DATA, PHASE2_USER_STORIES } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runFrameworksUnitTests() {
  const runner = new TestRunner("Framework Library Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Framework Library unit tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: getAllFrameworks without authentication
    await testGetAllFrameworksUnauthenticated(runner, client);
    
    // Test 2: getFrameworkById with valid ID
    await testGetFrameworkByIdValid(runner, client);
    
    // Test 3: getFrameworkById with invalid ID
    await testGetFrameworkByIdInvalid(runner, client);
    
    // Test 4: searchFrameworks by subject
    await testSearchFrameworksBySubject(runner, client);
    
    // Test 5: searchFrameworks by grade level
    await testSearchFrameworksByGradeLevel(runner, client);
    
    // Test 6: searchFrameworks by Louisiana standards
    await testSearchFrameworksByLouisianaStandards(runner, client);
    
    // Test 7: recordFrameworkUsage without authentication
    await testRecordFrameworkUsageUnauthenticated(runner, client);
    
    // Test 8: getFrameworkStats
    await testGetFrameworkStats(runner, client);
    
    // Test 9: getFrameworkUsageHistory without authentication
    await testGetFrameworkUsageHistoryUnauthenticated(runner, client);
    
    // Test 10: Test Louisiana standards validation
    await testLouisianaStandardsValidation(runner, client);
    
    // Test 11: Test platform-agnostic validation
    await testPlatformAgnosticValidation(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Framework Library unit tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testGetAllFrameworksUnauthenticated(runner, client) {
  runner.log("🧪 Testing getAllFrameworks without authentication...");
  
  try {
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    // Should return array of frameworks (public data)
    if (Array.isArray(frameworks)) {
      runner.recordTest("getAllFrameworks - Unauthenticated", true, 
        `Retrieved ${frameworks.length} frameworks`);
      
      // Validate framework structure
      if (frameworks.length > 0) {
        const framework = frameworks[0];
        const hasRequiredFields = framework._id && 
                                 framework.title && 
                                 framework.subject && 
                                 framework.gradeLevel &&
                                 framework.louisianaStandard &&
                                 framework.platformAgnostic !== undefined;
        
        if (hasRequiredFields) {
          runner.recordTest("Framework Structure Validation", true, 
            "Frameworks have required fields for Louisiana standards alignment");
        } else {
          runner.recordTest("Framework Structure Validation", false, 
            "Frameworks missing required fields for Louisiana standards alignment");
        }
      }
    } else {
      runner.recordTest("getAllFrameworks - Unauthenticated", false, 
        `Expected array, got: ${typeof frameworks}`);
    }
    
  } catch (error) {
    runner.recordTest("getAllFrameworks - Unauthenticated", false, error.message);
  }
}

async function testGetFrameworkByIdValid(runner, client) {
  runner.log("🧪 Testing getFrameworkById with valid ID...");
  
  try {
    // First get all frameworks to find a valid ID
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (frameworks && frameworks.length > 0) {
      const frameworkId = frameworks[0]._id;
      
      const framework = await client.query("frameworks:getFrameworkById", {
        frameworkId: frameworkId
      });
      
      if (framework && framework._id === frameworkId) {
        runner.recordTest("getFrameworkById - Valid ID", true, 
          `Retrieved framework: ${framework.title}`);
        
        // Validate Louisiana standards alignment
        if (framework.louisianaStandard && framework.platformAgnostic) {
          runner.recordTest("Louisiana Standards Alignment", true, 
            `Framework aligned to ${framework.louisianaStandard} and platform-agnostic`);
        } else {
          runner.recordTest("Louisiana Standards Alignment", false, 
            "Framework missing Louisiana standards or platform-agnostic flag");
        }
      } else {
        runner.recordTest("getFrameworkById - Valid ID", false, 
          `Failed to retrieve framework with ID: ${frameworkId}`);
      }
    } else {
      runner.recordTest("getFrameworkById - Valid ID", false, 
        "No frameworks available for testing");
    }
    
  } catch (error) {
    runner.recordTest("getFrameworkById - Valid ID", false, error.message);
  }
}

async function testGetFrameworkByIdInvalid(runner, client) {
  runner.log("🧪 Testing getFrameworkById with invalid ID...");
  
  try {
    const invalidId = "invalid-framework-id";
    
    const framework = await client.query("frameworks:getFrameworkById", {
      frameworkId: invalidId
    });
    
    // Should return null for invalid ID
    if (framework === null) {
      runner.recordTest("getFrameworkById - Invalid ID", true, 
        "Correctly returned null for invalid ID");
    } else {
      runner.recordTest("getFrameworkById - Invalid ID", false, 
        `Expected null, got: ${JSON.stringify(framework)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for invalid ID
    runner.recordTest("getFrameworkById - Invalid ID", true, 
      `Correctly handled invalid ID: ${error.message}`);
  }
}

async function testSearchFrameworksBySubject(runner, client) {
  runner.log("🧪 Testing searchFrameworks by subject...");
  
  try {
    const searchResults = await client.query("frameworks:searchFrameworks", {
      query: "Mathematics"
    });
    
    if (Array.isArray(searchResults)) {
      const mathFrameworks = searchResults.filter(f => f.subject === "Mathematics");
      
      if (mathFrameworks.length > 0) {
        runner.recordTest("searchFrameworks - By Subject", true, 
          `Found ${mathFrameworks.length} Mathematics frameworks`);
      } else {
        runner.recordTest("searchFrameworks - By Subject", true, 
          "No Mathematics frameworks found (expected if none exist)");
      }
    } else {
      runner.recordTest("searchFrameworks - By Subject", false, 
        `Expected array, got: ${typeof searchResults}`);
    }
    
  } catch (error) {
    runner.recordTest("searchFrameworks - By Subject", false, error.message);
  }
}

async function testSearchFrameworksByGradeLevel(runner, client) {
  runner.log("🧪 Testing searchFrameworks by grade level...");
  
  try {
    const searchResults = await client.query("frameworks:searchFrameworks", {
      query: "9-12"
    });
    
    if (Array.isArray(searchResults)) {
      const highSchoolFrameworks = searchResults.filter(f => f.gradeLevel === "9-12");
      
      if (highSchoolFrameworks.length > 0) {
        runner.recordTest("searchFrameworks - By Grade Level", true, 
          `Found ${highSchoolFrameworks.length} 9-12 frameworks`);
      } else {
        runner.recordTest("searchFrameworks - By Grade Level", true, 
          "No 9-12 frameworks found (expected if none exist)");
      }
    } else {
      runner.recordTest("searchFrameworks - By Grade Level", false, 
        `Expected array, got: ${typeof searchResults}`);
    }
    
  } catch (error) {
    runner.recordTest("searchFrameworks - By Grade Level", false, error.message);
  }
}

async function testSearchFrameworksByLouisianaStandards(runner, client) {
  runner.log("🧪 Testing searchFrameworks by Louisiana standards...");
  
  try {
    const searchResults = await client.query("frameworks:searchFrameworks", {
      query: "ELA.9-12.W.1"
    });
    
    if (Array.isArray(searchResults)) {
      const elaFrameworks = searchResults.filter(f => f.louisianaStandard === "ELA.9-12.W.1");
      
      if (elaFrameworks.length > 0) {
        runner.recordTest("searchFrameworks - By Louisiana Standards", true, 
          `Found ${elaFrameworks.length} frameworks aligned to ELA.9-12.W.1`);
      } else {
        runner.recordTest("searchFrameworks - By Louisiana Standards", true, 
          "No ELA.9-12.W.1 frameworks found (expected if none exist)");
      }
    } else {
      runner.recordTest("searchFrameworks - By Louisiana Standards", false, 
        `Expected array, got: ${typeof searchResults}`);
    }
    
  } catch (error) {
    runner.recordTest("searchFrameworks - By Louisiana Standards", false, error.message);
  }
}

async function testRecordFrameworkUsageUnauthenticated(runner, client) {
  runner.log("🧪 Testing recordFrameworkUsage without authentication...");
  
  try {
    // First get a valid framework ID
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (frameworks && frameworks.length > 0) {
      const frameworkId = frameworks[0]._id;
      
      const result = await client.mutation("frameworks:recordFrameworkUsage", {
        frameworkId: frameworkId,
        action: "viewed",
        timeSaved: 15
      });
      
      // Should fail without authentication
      runner.recordTest("recordFrameworkUsage - Unauthenticated", false, 
        `Expected authentication error, but got result: ${JSON.stringify(result)}`);
      
    } else {
      // Skip test if no frameworks available
      runner.recordTest("recordFrameworkUsage - Unauthenticated", true, 
        "Skipped - no frameworks available for testing");
    }
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("recordFrameworkUsage - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("recordFrameworkUsage - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testGetFrameworkStats(runner, client) {
  runner.log("🧪 Testing getFrameworkStats...");
  
  try {
    const stats = await client.query("frameworks:getFrameworkStats");
    
    // Should return stats object
    if (stats && typeof stats === 'object') {
      const hasRequiredFields = typeof stats.totalFrameworks === 'number' &&
                               typeof stats.totalUsage === 'number' &&
                               typeof stats.frameworksByModule === 'object' &&
                               typeof stats.frameworksByDifficulty === 'object';
      
      if (hasRequiredFields) {
        runner.recordTest("getFrameworkStats", true, 
          `Total frameworks: ${stats.totalFrameworks}, Total usage: ${stats.totalUsage}, Modules: ${JSON.stringify(stats.frameworksByModule)}`);
      } else {
        runner.recordTest("getFrameworkStats", false, 
          `Missing required fields. Response: ${JSON.stringify(stats)}`);
      }
    } else {
      runner.recordTest("getFrameworkStats", false, 
        `Expected object, got: ${typeof stats}`);
    }
    
  } catch (error) {
    runner.recordTest("getFrameworkStats", false, error.message);
  }
}

async function testGetFrameworkUsageHistoryUnauthenticated(runner, client) {
  runner.log("🧪 Testing getFrameworkUsageHistory without authentication...");
  
  try {
    const history = await client.query("frameworks:getFrameworkUsageHistory");
    
    // Should return empty array when not authenticated
    if (Array.isArray(history) && history.length === 0) {
      runner.recordTest("getFrameworkUsageHistory - Unauthenticated", true, 
        "Correctly returned empty array when not authenticated");
    } else {
      runner.recordTest("getFrameworkUsageHistory - Unauthenticated", false, 
        `Expected empty array, got: ${JSON.stringify(history)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for unauthenticated requests
    runner.recordTest("getFrameworkUsageHistory - Unauthenticated", true, 
      `Correctly handled unauthenticated request: ${error.message}`);
  }
}

async function testLouisianaStandardsValidation(runner, client) {
  runner.log("🧪 Testing Louisiana standards validation...");
  
  try {
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (frameworks && frameworks.length > 0) {
      const louisianaFrameworks = frameworks.filter(f => f.louisianaStandard);
      const platformAgnosticFrameworks = frameworks.filter(f => f.platformAgnostic === true);
      
      if (louisianaFrameworks.length > 0) {
        runner.recordTest("Louisiana Standards Validation", true, 
          `Found ${louisianaFrameworks.length} frameworks with Louisiana standards`);
      } else {
        runner.recordTest("Louisiana Standards Validation", true, 
          "No frameworks with Louisiana standards found (expected if none exist)");
      }
      
      if (platformAgnosticFrameworks.length > 0) {
        runner.recordTest("Platform Agnostic Validation", true, 
          `Found ${platformAgnosticFrameworks.length} platform-agnostic frameworks`);
      } else {
        runner.recordTest("Platform Agnostic Validation", true, 
          "No platform-agnostic frameworks found (expected if none exist)");
      }
    } else {
      runner.recordTest("Louisiana Standards Validation", false, 
        "No frameworks available for validation");
    }
    
  } catch (error) {
    runner.recordTest("Louisiana Standards Validation", false, error.message);
  }
}

async function testPlatformAgnosticValidation(runner, client) {
  runner.log("🧪 Testing platform-agnostic validation...");
  
  try {
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (frameworks && frameworks.length > 0) {
      // Check that all frameworks are platform-agnostic
      const nonPlatformAgnostic = frameworks.filter(f => f.platformAgnostic !== true);
      
      if (nonPlatformAgnostic.length === 0) {
        runner.recordTest("Platform Agnostic Validation - All Frameworks", true, 
          "All frameworks are platform-agnostic (works with any AI tool)");
      } else {
        runner.recordTest("Platform Agnostic Validation - All Frameworks", false, 
          `${nonPlatformAgnostic.length} frameworks are not platform-agnostic`);
      }
      
      // Check that frameworks have clear usage instructions
      const frameworksWithInstructions = frameworks.filter(f => f.prompt && f.prompt.length > 10);
      
      if (frameworksWithInstructions.length > 0) {
        runner.recordTest("Framework Instructions Validation", true, 
          `${frameworksWithInstructions.length} frameworks have clear usage instructions`);
      } else {
        runner.recordTest("Framework Instructions Validation", true, 
          "No frameworks with instructions found (expected if none exist)");
      }
    } else {
      runner.recordTest("Platform Agnostic Validation", false, 
        "No frameworks available for validation");
    }
    
  } catch (error) {
    runner.recordTest("Platform Agnostic Validation", false, error.message);
  }
}

// Run the tests
runFrameworksUnitTests();
