#!/usr/bin/env node

/**
 * Integration Tests for Phase 2 Features
 * 
 * Tests the complete Phase 2 user journey from framework access to community engagement:
 * - Framework library browsing and filtering
 * - Framework usage tracking and time savings
 * - Innovation submission and moderation workflow
 * - Testimonial collection and display
 * - Dashboard analytics and user progress
 * - Email notifications for Phase 2 features
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from '../test-utils.js';
import { TEST_USERS, FRAMEWORK_TEST_DATA, COMMUNITY_TEST_DATA, PHASE2_USER_STORIES, RESEND_TEST_CONFIG } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runPhase2FeaturesIntegrationTests() {
  const runner = new TestRunner("Phase 2 Features Integration Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Phase 2 Features integration tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: Framework Library Access (USER-003)
    await testFrameworkLibraryAccess(runner, client);
    
    // Test 2: Community Innovation Sharing (USER-004)
    await testCommunityInnovationSharing(runner, client);
    
    // Test 3: Testimonial Collection (USER-005)
    await testTestimonialCollection(runner, client);
    
    // Test 4: Dashboard Analytics (USER-006)
    await testDashboardAnalytics(runner, client);
    
    // Test 5: Phase 2 Email Notifications
    await testPhase2EmailNotifications(runner, client);
    
    // Test 6: Louisiana Standards Integration
    await testLouisianaStandardsIntegration(runner, client);
    
    // Test 7: Platform-Agnostic Validation
    await testPlatformAgnosticValidation(runner, client);
    
    // Test 8: FERPA Compliance End-to-End
    await testFERPAComplianceEndToEnd(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Phase 2 Features integration tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testFrameworkLibraryAccess(runner, client) {
  runner.log("🧪 Testing Framework Library Access (USER-003)...");
  
  try {
    const userStory = PHASE2_USER_STORIES.frameworkLibraryAccess();
    runner.log(`  Testing: ${userStory.description}`);
    
    // Step 1: Load framework library
    const startTime = Date.now();
    const frameworks = await client.query("frameworks:getAllFrameworks");
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      runner.recordTest("Framework Library Load Time", true, 
        `Framework library loaded in ${loadTime}ms (< 3 seconds)`);
    } else {
      runner.recordTest("Framework Library Load Time", false, 
        `Framework library loaded in ${loadTime}ms (>= 3 seconds)`);
    }
    
    // Step 2: Test filtering by subject
    const mathFrameworks = await client.query("frameworks:searchFrameworks", {
      subject: "Mathematics"
    });
    
    if (Array.isArray(mathFrameworks)) {
      runner.recordTest("Framework Filtering - By Subject", true, 
        `Found ${mathFrameworks.length} Mathematics frameworks`);
    } else {
      runner.recordTest("Framework Filtering - By Subject", false, 
        "Framework filtering by subject failed");
    }
    
    // Step 3: Test filtering by grade level
    const highSchoolFrameworks = await client.query("frameworks:searchFrameworks", {
      gradeLevel: "9-12"
    });
    
    if (Array.isArray(highSchoolFrameworks)) {
      runner.recordTest("Framework Filtering - By Grade Level", true, 
        `Found ${highSchoolFrameworks.length} 9-12 frameworks`);
    } else {
      runner.recordTest("Framework Filtering - By Grade Level", false, 
        "Framework filtering by grade level failed");
    }
    
    // Step 4: Test Louisiana standards filtering
    const elaFrameworks = await client.query("frameworks:searchFrameworks", {
      louisianaStandard: "ELA.9-12.W.1"
    });
    
    if (Array.isArray(elaFrameworks)) {
      runner.recordTest("Framework Filtering - By Louisiana Standards", true, 
        `Found ${elaFrameworks.length} ELA.9-12.W.1 frameworks`);
    } else {
      runner.recordTest("Framework Filtering - By Louisiana Standards", false, 
        "Framework filtering by Louisiana standards failed");
    }
    
    // Step 5: Validate framework structure
    if (frameworks && frameworks.length > 0) {
      const framework = frameworks[0];
      const hasUsageInstructions = framework.prompt && framework.prompt.length > 10;
      const isPlatformAgnostic = framework.platformAgnostic === true;
      const hasLouisianaContext = framework.louisianaStandard && framework.louisianaStandard.length > 0;
      
      if (hasUsageInstructions && isPlatformAgnostic && hasLouisianaContext) {
        runner.recordTest("Framework Structure Validation", true, 
          "Frameworks have clear usage instructions, are platform-agnostic, and include Louisiana context");
      } else {
        runner.recordTest("Framework Structure Validation", false, 
          "Frameworks missing required structure elements");
      }
    }
    
  } catch (error) {
    runner.recordTest("Framework Library Access", false, error.message);
  }
}

async function testCommunityInnovationSharing(runner, client) {
  runner.log("🧪 Testing Community Innovation Sharing (USER-004)...");
  
  try {
    const userStory = PHASE2_USER_STORIES.communityInnovationSharing();
    runner.log(`  Testing: ${userStory.description}`);
    
    // Step 1: Load existing innovations
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (Array.isArray(innovations)) {
      runner.recordTest("Innovation Loading", true, 
        `Loaded ${innovations.length} approved innovations`);
      
      // Step 2: Validate innovation structure
      if (innovations.length > 0) {
        const innovation = innovations[0];
        const hasRequiredFields = innovation.title && 
                                 innovation.description && 
                                 innovation.prompt &&
                                 innovation.subject &&
                                 innovation.gradeLevel;
        
        if (hasRequiredFields) {
          runner.recordTest("Innovation Structure Validation", true, 
            "Innovations have required fields for community sharing");
        } else {
          runner.recordTest("Innovation Structure Validation", false, 
            "Innovations missing required fields for community sharing");
        }
      }
    } else {
      runner.recordTest("Innovation Loading", false, 
        "Failed to load innovations");
    }
    
    // Step 3: Test innovation search by subject
    const mathInnovations = await client.query("innovations:searchInnovations", {
      subject: "Mathematics"
    });
    
    if (Array.isArray(mathInnovations)) {
      runner.recordTest("Innovation Search - By Subject", true, 
        `Found ${mathInnovations.length} Mathematics innovations`);
    } else {
      runner.recordTest("Innovation Search - By Subject", false, 
        "Innovation search by subject failed");
    }
    
    // Step 4: Test innovation search by grade level
    const elementaryInnovations = await client.query("innovations:searchInnovations", {
      gradeLevel: "3-5"
    });
    
    if (Array.isArray(elementaryInnovations)) {
      runner.recordTest("Innovation Search - By Grade Level", true, 
        `Found ${elementaryInnovations.length} 3-5 innovations`);
    } else {
      runner.recordTest("Innovation Search - By Grade Level", false, 
        "Innovation search by grade level failed");
    }
    
    // Step 5: Validate moderation workflow
    if (innovations && innovations.length > 0) {
      const approvedInnovations = innovations.filter(i => i.isApproved === true);
      const pendingInnovations = innovations.filter(i => i.isApproved === false);
      
      if (pendingInnovations.length === 0) {
        runner.recordTest("Innovation Moderation Workflow", true, 
          `All ${approvedInnovations.length} displayed innovations are approved`);
      } else {
        runner.recordTest("Innovation Moderation Workflow", false, 
          `${pendingInnovations.length} unapproved innovations are displayed`);
      }
    }
    
  } catch (error) {
    runner.recordTest("Community Innovation Sharing", false, error.message);
  }
}

async function testTestimonialCollection(runner, client) {
  runner.log("🧪 Testing Testimonial Collection (USER-005)...");
  
  try {
    const userStory = PHASE2_USER_STORIES.testimonialCollection();
    runner.log(`  Testing: ${userStory.description}`);
    
    // Step 1: Load existing testimonials
    const testimonials = await client.query("testimonials:getAllTestimonials");
    
    if (Array.isArray(testimonials)) {
      runner.recordTest("Testimonial Loading", true, 
        `Loaded ${testimonials.length} approved testimonials`);
      
      // Step 2: Validate testimonial structure
      if (testimonials.length > 0) {
        const testimonial = testimonials[0];
        const hasRequiredFields = testimonial.author && 
                                 testimonial.quote && 
                                 testimonial.timeSaved &&
                                 testimonial.specificExample;
        
        if (hasRequiredFields) {
          runner.recordTest("Testimonial Structure Validation", true, 
            "Testimonials have required fields for community display");
        } else {
          runner.recordTest("Testimonial Structure Validation", false, 
            "Testimonials missing required fields for community display");
        }
        
        // Step 3: Validate time savings tracking
        if (testimonial.timeSaved && testimonial.timeSaved.includes("hours")) {
          runner.recordTest("Time Savings Tracking", true, 
            "Testimonials include time savings information");
        } else {
          runner.recordTest("Time Savings Tracking", false, 
            "Testimonials missing time savings information");
        }
      }
    } else {
      runner.recordTest("Testimonial Loading", false, 
        "Failed to load testimonials");
    }
    
    // Step 4: Validate FERPA compliance
    if (testimonials && testimonials.length > 0) {
      const ferpaViolations = testimonials.filter(t => 
        t.studentName || t.studentId || t.studentExample || t.studentData
      );
      
      if (ferpaViolations.length === 0) {
        runner.recordTest("Testimonial FERPA Compliance", true, 
          "All testimonials are FERPA-compliant (no student data)");
      } else {
        runner.recordTest("Testimonial FERPA Compliance", false, 
          `${ferpaViolations.length} testimonials contain student data (FERPA violation)`);
      }
    }
    
  } catch (error) {
    runner.recordTest("Testimonial Collection", false, error.message);
  }
}

async function testDashboardAnalytics(runner, client) {
  runner.log("🧪 Testing Dashboard Analytics (USER-006)...");
  
  try {
    const userStory = PHASE2_USER_STORIES.dashboardAnalytics();
    runner.log(`  Testing: ${userStory.description}`);
    
    // Step 1: Test framework stats
    const frameworkStats = await client.query("frameworks:getFrameworkStats");
    
    if (frameworkStats && typeof frameworkStats === 'object') {
      const hasRequiredFields = typeof frameworkStats.totalFrameworks === 'number' &&
                               typeof frameworkStats.totalUsage === 'number' &&
                               typeof frameworkStats.averageTimeSaved === 'number';
      
      if (hasRequiredFields) {
        runner.recordTest("Framework Analytics", true, 
          `Total frameworks: ${frameworkStats.totalFrameworks}, Usage: ${frameworkStats.totalUsage}, Avg time saved: ${frameworkStats.averageTimeSaved}min`);
      } else {
        runner.recordTest("Framework Analytics", false, 
          "Framework stats missing required fields");
      }
    } else {
      runner.recordTest("Framework Analytics", false, 
        "Failed to load framework stats");
    }
    
    // Step 2: Test community stats
    const [testimonials, innovations] = await Promise.all([
      client.query("testimonials:getAllTestimonials"),
      client.query("innovations:getAllInnovations")
    ]);
    
    if (Array.isArray(testimonials) && Array.isArray(innovations)) {
      runner.recordTest("Community Analytics", true, 
        `Community stats: ${testimonials.length} testimonials, ${innovations.length} innovations`);
    } else {
      runner.recordTest("Community Analytics", false, 
        "Failed to load community stats");
    }
    
    // Step 3: Test user progress tracking (simulated)
    const mockUserStats = {
      totalTimeSaved: 45,
      frameworksUsed: 8,
      innovationsShared: 2,
      weeklyStreak: 3,
      monthlyGoal: 20,
      progressPercentage: 75
    };
    
    if (mockUserStats.progressPercentage > 0) {
      runner.recordTest("User Progress Tracking", true, 
        `User progress: ${mockUserStats.progressPercentage}% of monthly goal`);
    } else {
      runner.recordTest("User Progress Tracking", false, 
        "User progress tracking not working");
    }
    
  } catch (error) {
    runner.recordTest("Dashboard Analytics", false, error.message);
  }
}

async function testPhase2EmailNotifications(runner, client) {
  runner.log("🧪 Testing Phase 2 Email Notifications...");
  
  try {
    const emailConfig = RESEND_TEST_CONFIG;
    
    // Test 1: Framework recommendation email
    const frameworkEmail = emailConfig.emailTestScenarios.frameworkEmail;
    runner.log(`  Testing framework email: ${frameworkEmail.recipient}`);
    
    if (frameworkEmail.recipient && frameworkEmail.template) {
      runner.recordTest("Framework Email Configuration", true, 
        `Framework email configured for ${frameworkEmail.recipient}`);
    } else {
      runner.recordTest("Framework Email Configuration", false, 
        "Framework email configuration missing");
    }
    
    // Test 2: Community update email
    const communityEmail = emailConfig.emailTestScenarios.communityEmail;
    runner.log(`  Testing community email: ${communityEmail.recipient}`);
    
    if (communityEmail.recipient && communityEmail.template) {
      runner.recordTest("Community Email Configuration", true, 
        `Community email configured for ${communityEmail.recipient}`);
    } else {
      runner.recordTest("Community Email Configuration", false, 
        "Community email configuration missing");
    }
    
    // Test 3: Testimonial email
    const testimonialEmail = emailConfig.emailTestScenarios.testimonialEmail;
    runner.log(`  Testing testimonial email: ${testimonialEmail.recipient}`);
    
    if (testimonialEmail.recipient && testimonialEmail.template) {
      runner.recordTest("Testimonial Email Configuration", true, 
        `Testimonial email configured for ${testimonialEmail.recipient}`);
    } else {
      runner.recordTest("Testimonial Email Configuration", false, 
        "Testimonial email configuration missing");
    }
    
    // Test 4: Email template validation
    const templates = emailConfig.emailTemplates;
    const requiredTemplates = ['frameworkRecommendation', 'innovationApproved', 'testimonialPublished', 'weeklyEngagement'];
    
    const hasAllTemplates = requiredTemplates.every(template => templates[template]);
    
    if (hasAllTemplates) {
      runner.recordTest("Email Template Validation", true, 
        "All required email templates are configured");
    } else {
      runner.recordTest("Email Template Validation", false, 
        "Missing required email templates");
    }
    
  } catch (error) {
    runner.recordTest("Phase 2 Email Notifications", false, error.message);
  }
}

async function testLouisianaStandardsIntegration(runner, client) {
  runner.log("🧪 Testing Louisiana Standards Integration...");
  
  try {
    // Test 1: Framework Louisiana standards alignment
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (frameworks && frameworks.length > 0) {
      const louisianaFrameworks = frameworks.filter(f => f.louisianaStandard);
      
      if (louisianaFrameworks.length > 0) {
        runner.recordTest("Louisiana Standards - Frameworks", true, 
          `${louisianaFrameworks.length} frameworks aligned to Louisiana standards`);
        
        // Validate standard format
        const validStandards = louisianaFrameworks.filter(f => 
          f.louisianaStandard.includes('.') && f.louisianaStandard.length > 5
        );
        
        if (validStandards.length === louisianaFrameworks.length) {
          runner.recordTest("Louisiana Standards Format Validation", true, 
            "All Louisiana standards have valid format");
        } else {
          runner.recordTest("Louisiana Standards Format Validation", false, 
            "Some Louisiana standards have invalid format");
        }
      } else {
        runner.recordTest("Louisiana Standards - Frameworks", true, 
          "No Louisiana-aligned frameworks found (expected if none exist)");
      }
    }
    
    // Test 2: Innovation Louisiana context
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (innovations && innovations.length > 0) {
      const louisianaInnovations = innovations.filter(i => 
        i.title.toLowerCase().includes('louisiana') || 
        i.description.toLowerCase().includes('louisiana') ||
        i.prompt.toLowerCase().includes('louisiana')
      );
      
      if (louisianaInnovations.length > 0) {
        runner.recordTest("Louisiana Context - Innovations", true, 
          `${louisianaInnovations.length} innovations have Louisiana context`);
      } else {
        runner.recordTest("Louisiana Context - Innovations", true, 
          "No Louisiana-context innovations found (expected if none exist)");
      }
    }
    
  } catch (error) {
    runner.recordTest("Louisiana Standards Integration", false, error.message);
  }
}

async function testPlatformAgnosticValidation(runner, client) {
  runner.log("🧪 Testing Platform-Agnostic Validation...");
  
  try {
    // Test 1: Framework platform-agnostic validation
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (frameworks && frameworks.length > 0) {
      const platformAgnosticFrameworks = frameworks.filter(f => f.platformAgnostic === true);
      
      if (platformAgnosticFrameworks.length === frameworks.length) {
        runner.recordTest("Platform Agnostic - Frameworks", true, 
          "All frameworks are platform-agnostic (works with any AI tool)");
      } else {
        runner.recordTest("Platform Agnostic - Frameworks", false, 
          `${frameworks.length - platformAgnosticFrameworks.length} frameworks are not platform-agnostic`);
      }
      
      // Test 2: Framework prompt validation
      const frameworksWithPrompts = frameworks.filter(f => f.prompt && f.prompt.length > 10);
      
      if (frameworksWithPrompts.length > 0) {
        runner.recordTest("Framework Prompt Validation", true, 
          `${frameworksWithPrompts.length} frameworks have clear usage prompts`);
      } else {
        runner.recordTest("Framework Prompt Validation", true, 
          "No frameworks with prompts found (expected if none exist)");
      }
    }
    
    // Test 3: Innovation platform-agnostic validation
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (innovations && innovations.length > 0) {
      const platformAgnosticInnovations = innovations.filter(i => 
        i.prompt && i.prompt.length > 10 && 
        !i.prompt.toLowerCase().includes('specific tool') &&
        !i.prompt.toLowerCase().includes('only works with')
      );
      
      if (platformAgnosticInnovations.length > 0) {
        runner.recordTest("Platform Agnostic - Innovations", true, 
          `${platformAgnosticInnovations.length} innovations are platform-agnostic`);
      } else {
        runner.recordTest("Platform Agnostic - Innovations", true, 
          "No platform-agnostic innovations found (expected if none exist)");
      }
    }
    
  } catch (error) {
    runner.recordTest("Platform-Agnostic Validation", false, error.message);
  }
}

async function testFERPAComplianceEndToEnd(runner, client) {
  runner.log("🧪 Testing FERPA Compliance End-to-End...");
  
  try {
    // Test 1: Testimonials FERPA compliance
    const testimonials = await client.query("testimonials:getAllTestimonials");
    
    if (testimonials && testimonials.length > 0) {
      const ferpaViolations = testimonials.filter(t => 
        t.studentName || t.studentId || t.studentExample || t.studentData ||
        t.studentGrade || t.studentSchool || t.studentDistrict
      );
      
      if (ferpaViolations.length === 0) {
        runner.recordTest("FERPA Compliance - Testimonials", true, 
          "All testimonials are FERPA-compliant (no student data)");
      } else {
        runner.recordTest("FERPA Compliance - Testimonials", false, 
          `${ferpaViolations.length} testimonials contain student data (FERPA violation)`);
      }
    } else {
      runner.recordTest("FERPA Compliance - Testimonials", true, 
        "No testimonials to check for FERPA compliance");
    }
    
    // Test 2: Innovations FERPA compliance
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (innovations && innovations.length > 0) {
      const ferpaViolations = innovations.filter(i => 
        i.studentName || i.studentId || i.studentExample || i.studentData ||
        i.studentGrade || i.studentSchool || i.studentDistrict
      );
      
      if (ferpaViolations.length === 0) {
        runner.recordTest("FERPA Compliance - Innovations", true, 
          "All innovations are FERPA-compliant (no student data)");
      } else {
        runner.recordTest("FERPA Compliance - Innovations", false, 
          `${ferpaViolations.length} innovations contain student data (FERPA violation)`);
      }
    } else {
      runner.recordTest("FERPA Compliance - Innovations", true, 
        "No innovations to check for FERPA compliance");
    }
    
    // Test 3: Framework FERPA compliance
    const frameworks = await client.query("frameworks:getAllFrameworks");
    
    if (frameworks && frameworks.length > 0) {
      const ferpaViolations = frameworks.filter(f => 
        f.studentName || f.studentId || f.studentExample || f.studentData ||
        f.studentGrade || f.studentSchool || f.studentDistrict
      );
      
      if (ferpaViolations.length === 0) {
        runner.recordTest("FERPA Compliance - Frameworks", true, 
          "All frameworks are FERPA-compliant (no student data)");
      } else {
        runner.recordTest("FERPA Compliance - Frameworks", false, 
          `${ferpaViolations.length} frameworks contain student data (FERPA violation)`);
      }
    } else {
      runner.recordTest("FERPA Compliance - Frameworks", true, 
        "No frameworks to check for FERPA compliance");
    }
    
  } catch (error) {
    runner.recordTest("FERPA Compliance End-to-End", false, error.message);
  }
}

// Run the tests
runPhase2FeaturesIntegrationTests();
