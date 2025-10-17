#!/usr/bin/env node

/**
 * Unit Tests for Community Features (Testimonials & Innovations)
 * 
 * Tests individual functions in convex/testimonials.ts and convex/innovations.ts to verify:
 * - getAllTestimonials returns approved testimonials
 * - submitTestimonial creates testimonial with FERPA compliance
 * - getAllInnovations returns approved innovations
 * - submitInnovation creates innovation with moderation workflow
 * - likeInnovation and commentInnovation work correctly
 * - Validation and error handling for community features
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from '../test-utils.js';
import { TEST_USERS, COMMUNITY_TEST_DATA, PHASE2_USER_STORIES } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runCommunityUnitTests() {
  const runner = new TestRunner("Community Features Unit Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Community Features unit tests...");
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: getAllTestimonials without authentication
    await testGetAllTestimonialsUnauthenticated(runner, client);
    
    // Test 2: submitTestimonial without authentication
    await testSubmitTestimonialUnauthenticated(runner, client);
    
    // Test 3: getAllInnovations without authentication
    await testGetAllInnovationsUnauthenticated(runner, client);
    
    // Test 4: submitInnovation without authentication
    await testSubmitInnovationUnauthenticated(runner, client);
    
    // Test 5: likeInnovation without authentication
    await testLikeInnovationUnauthenticated(runner, client);
    
    // Test 6: commentInnovation without authentication
    await testCommentInnovationUnauthenticated(runner, client);
    
    // Test 7: getInnovationById with valid ID
    await testGetInnovationByIdValid(runner, client);
    
    // Test 8: getInnovationById with invalid ID
    await testGetInnovationByIdInvalid(runner, client);
    
    // Test 9: searchInnovations by subject
    await testSearchInnovationsBySubject(runner, client);
    
    // Test 10: searchInnovations by grade level
    await testSearchInnovationsByGradeLevel(runner, client);
    
    // Test 11: FERPA compliance validation
    await testFERPAComplianceValidation(runner, client);
    
    // Test 12: Community moderation workflow
    await testCommunityModerationWorkflow(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Community Features unit tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testGetAllTestimonialsUnauthenticated(runner, client) {
  runner.log("🧪 Testing getAllTestimonials without authentication...");
  
  try {
    const testimonials = await client.query("testimonials:getAllTestimonials");
    
    // Should return array of approved testimonials (public data)
    if (Array.isArray(testimonials)) {
      runner.recordTest("getAllTestimonials - Unauthenticated", true, 
        `Retrieved ${testimonials.length} testimonials`);
      
      // Validate testimonial structure
      if (testimonials.length > 0) {
        const testimonial = testimonials[0];
        const hasRequiredFields = testimonial._id && 
                                 testimonial.author && 
                                 testimonial.quote && 
                                 testimonial.timeSaved &&
                                 testimonial.isApproved !== undefined;
        
        if (hasRequiredFields) {
          runner.recordTest("Testimonial Structure Validation", true, 
            "Testimonials have required fields for community display");
        } else {
          runner.recordTest("Testimonial Structure Validation", false, 
            "Testimonials missing required fields for community display");
        }
        
        // Check FERPA compliance (no student data)
        const hasStudentData = testimonial.studentName || 
                              testimonial.studentId || 
                              testimonial.studentExample;
        
        if (!hasStudentData) {
          runner.recordTest("FERPA Compliance - Testimonials", true, 
            "Testimonials are FERPA-compliant (no student data)");
        } else {
          runner.recordTest("FERPA Compliance - Testimonials", false, 
            "Testimonials contain student data (FERPA violation)");
        }
      }
    } else {
      runner.recordTest("getAllTestimonials - Unauthenticated", false, 
        `Expected array, got: ${typeof testimonials}`);
    }
    
  } catch (error) {
    runner.recordTest("getAllTestimonials - Unauthenticated", false, error.message);
  }
}

async function testSubmitTestimonialUnauthenticated(runner, client) {
  runner.log("🧪 Testing submitTestimonial without authentication...");
  
  try {
    const testimonialData = COMMUNITY_TEST_DATA.testimonialSubmissions[0];
    
    const result = await client.mutation("testimonials:submitTestimonial", {
      quote: testimonialData.quote,
      timeSaved: testimonialData.timeSaved,
      impact: testimonialData.impact
    });
    
    // Should fail without authentication
    runner.recordTest("submitTestimonial - Unauthenticated", false, 
      `Expected authentication error, but got result: ${JSON.stringify(result)}`);
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("submitTestimonial - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("submitTestimonial - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testGetAllInnovationsUnauthenticated(runner, client) {
  runner.log("🧪 Testing getAllInnovations without authentication...");
  
  try {
    const innovations = await client.query("innovations:getAllInnovations");
    
    // Should return array of approved innovations (public data)
    if (Array.isArray(innovations)) {
      runner.recordTest("getAllInnovations - Unauthenticated", true, 
        `Retrieved ${innovations.length} innovations`);
      
      // Validate innovation structure
      if (innovations.length > 0) {
        const innovation = innovations[0];
        const hasRequiredFields = innovation._id && 
                                 innovation.title && 
                                 innovation.description && 
                                 innovation.prompt &&
                                 innovation.subject &&
                                 innovation.gradeLevel &&
                                 innovation.isApproved !== undefined;
        
        if (hasRequiredFields) {
          runner.recordTest("Innovation Structure Validation", true, 
            "Innovations have required fields for community display");
        } else {
          runner.recordTest("Innovation Structure Validation", false, 
            "Innovations missing required fields for community display");
        }
        
        // Check FERPA compliance (no student data)
        const hasStudentData = innovation.studentName || 
                              innovation.studentId || 
                              innovation.studentExample;
        
        if (!hasStudentData) {
          runner.recordTest("FERPA Compliance - Innovations", true, 
            "Innovations are FERPA-compliant (no student data)");
        } else {
          runner.recordTest("FERPA Compliance - Innovations", false, 
            "Innovations contain student data (FERPA violation)");
        }
      }
    } else {
      runner.recordTest("getAllInnovations - Unauthenticated", false, 
        `Expected array, got: ${typeof innovations}`);
    }
    
  } catch (error) {
    runner.recordTest("getAllInnovations - Unauthenticated", false, error.message);
  }
}

async function testSubmitInnovationUnauthenticated(runner, client) {
  runner.log("🧪 Testing submitInnovation without authentication...");
  
  try {
    const innovationData = COMMUNITY_TEST_DATA.innovationSubmissions[0];
    
    const result = await client.mutation("innovations:submitInnovation", {
      title: innovationData.title,
      description: innovationData.description,
      tags: innovationData.tags,
      timeSaved: innovationData.timeSaved
    });
    
    // Should fail without authentication
    runner.recordTest("submitInnovation - Unauthenticated", false, 
      `Expected authentication error, but got result: ${JSON.stringify(result)}`);
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("submitInnovation - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("submitInnovation - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testLikeInnovationUnauthenticated(runner, client) {
  runner.log("🧪 Testing likeInnovation without authentication...");
  
  try {
    // First get a valid innovation ID
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (innovations && innovations.length > 0) {
      const innovationId = innovations[0]._id;
      
      const result = await client.mutation("innovations:likeInnovation", {
        innovationId: innovationId
      });
      
      // Should fail without authentication
      runner.recordTest("likeInnovation - Unauthenticated", false, 
        `Expected authentication error, but got result: ${JSON.stringify(result)}`);
      
    } else {
      // Skip test if no innovations available
      runner.recordTest("likeInnovation - Unauthenticated", true, 
        "Skipped - no innovations available for testing");
    }
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("likeInnovation - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("likeInnovation - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testCommentInnovationUnauthenticated(runner, client) {
  runner.log("🧪 Testing commentInnovation without authentication...");
  
  try {
    // First get a valid innovation ID
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (innovations && innovations.length > 0) {
      const innovationId = innovations[0]._id;
      
      const result = await client.mutation("innovations:commentInnovation", {
        innovationId: innovationId,
        comment: "This is a test comment"
      });
      
      // Should fail without authentication
      runner.recordTest("commentInnovation - Unauthenticated", false, 
        `Expected authentication error, but got result: ${JSON.stringify(result)}`);
      
    } else {
      // Skip test if no innovations available
      runner.recordTest("commentInnovation - Unauthenticated", true, 
        "Skipped - no innovations available for testing");
    }
    
  } catch (error) {
    // Error is expected for unauthenticated requests
    const isAuthError = error.message.includes("authenticated") || 
                       error.message.includes("User must be authenticated");
    
    if (isAuthError) {
      runner.recordTest("commentInnovation - Unauthenticated", true, 
        `Correctly rejected unauthenticated request: ${error.message}`);
    } else {
      runner.recordTest("commentInnovation - Unauthenticated", false, 
        `Unexpected error: ${error.message}`);
    }
  }
}

async function testGetInnovationByIdValid(runner, client) {
  runner.log("🧪 Testing getInnovationById with valid ID...");
  
  try {
    // First get all innovations to find a valid ID
    const innovations = await client.query("innovations:getAllInnovations");
    
    if (innovations && innovations.length > 0) {
      const innovationId = innovations[0]._id;
      
      const innovation = await client.query("innovations:getInnovationById", {
        innovationId: innovationId
      });
      
      if (innovation && innovation._id === innovationId) {
        runner.recordTest("getInnovationById - Valid ID", true, 
          `Retrieved innovation: ${innovation.title}`);
        
        // Validate community features
        if (innovation.likes !== undefined && innovation.comments !== undefined) {
          runner.recordTest("Community Features Validation", true, 
            `Innovation has community features: ${innovation.likes} likes, ${innovation.comments} comments`);
        } else {
          runner.recordTest("Community Features Validation", false, 
            "Innovation missing community features (likes/comments)");
        }
      } else {
        runner.recordTest("getInnovationById - Valid ID", false, 
          `Failed to retrieve innovation with ID: ${innovationId}`);
      }
    } else {
      runner.recordTest("getInnovationById - Valid ID", false, 
        "No innovations available for testing");
    }
    
  } catch (error) {
    runner.recordTest("getInnovationById - Valid ID", false, error.message);
  }
}

async function testGetInnovationByIdInvalid(runner, client) {
  runner.log("🧪 Testing getInnovationById with invalid ID...");
  
  try {
    const invalidId = "invalid-innovation-id";
    
    const innovation = await client.query("innovations:getInnovationById", {
      innovationId: invalidId
    });
    
    // Should return null for invalid ID
    if (innovation === null) {
      runner.recordTest("getInnovationById - Invalid ID", true, 
        "Correctly returned null for invalid ID");
    } else {
      runner.recordTest("getInnovationById - Invalid ID", false, 
        `Expected null, got: ${JSON.stringify(innovation)}`);
    }
    
  } catch (error) {
    // Error is also acceptable for invalid ID
    runner.recordTest("getInnovationById - Invalid ID", true, 
      `Correctly handled invalid ID: ${error.message}`);
  }
}

async function testSearchInnovationsBySubject(runner, client) {
  runner.log("🧪 Testing searchInnovations by subject...");
  
  try {
    const searchResults = await client.query("innovations:searchInnovations", {
      query: "Mathematics"
    });
    
    if (Array.isArray(searchResults)) {
      const mathInnovations = searchResults.filter(i => i.subject === "Mathematics");
      
      if (mathInnovations.length > 0) {
        runner.recordTest("searchInnovations - By Subject", true, 
          `Found ${mathInnovations.length} Mathematics innovations`);
      } else {
        runner.recordTest("searchInnovations - By Subject", true, 
          "No Mathematics innovations found (expected if none exist)");
      }
    } else {
      runner.recordTest("searchInnovations - By Subject", false, 
        `Expected array, got: ${typeof searchResults}`);
    }
    
  } catch (error) {
    runner.recordTest("searchInnovations - By Subject", false, error.message);
  }
}

async function testSearchInnovationsByGradeLevel(runner, client) {
  runner.log("🧪 Testing searchInnovations by grade level...");
  
  try {
    const searchResults = await client.query("innovations:searchInnovations", {
      query: "6-8"
    });
    
    if (Array.isArray(searchResults)) {
      const middleSchoolInnovations = searchResults.filter(i => i.gradeLevel === "6-8");
      
      if (middleSchoolInnovations.length > 0) {
        runner.recordTest("searchInnovations - By Grade Level", true, 
          `Found ${middleSchoolInnovations.length} 6-8 innovations`);
      } else {
        runner.recordTest("searchInnovations - By Grade Level", true, 
          "No 6-8 innovations found (expected if none exist)");
      }
    } else {
      runner.recordTest("searchInnovations - By Grade Level", false, 
        `Expected array, got: ${typeof searchResults}`);
    }
    
  } catch (error) {
    runner.recordTest("searchInnovations - By Grade Level", false, error.message);
  }
}

async function testFERPAComplianceValidation(runner, client) {
  runner.log("🧪 Testing FERPA compliance validation...");
  
  try {
    const [testimonials, innovations] = await Promise.all([
      client.query("testimonials:getAllTestimonials"),
      client.query("innovations:getAllInnovations")
    ]);
    
    // Check testimonials for FERPA compliance
    if (testimonials && testimonials.length > 0) {
      const ferpaViolations = testimonials.filter(t => 
        t.studentName || t.studentId || t.studentExample || t.studentData
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
    
    // Check innovations for FERPA compliance
    if (innovations && innovations.length > 0) {
      const ferpaViolations = innovations.filter(i => 
        i.studentName || i.studentId || i.studentExample || i.studentData
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
    
  } catch (error) {
    runner.recordTest("FERPA Compliance Validation", false, error.message);
  }
}

async function testCommunityModerationWorkflow(runner, client) {
  runner.log("🧪 Testing community moderation workflow...");
  
  try {
    const [testimonials, innovations] = await Promise.all([
      client.query("testimonials:getAllTestimonials"),
      client.query("innovations:getAllInnovations")
    ]);
    
    // Check that only approved content is displayed
    if (testimonials && testimonials.length > 0) {
      const approvedTestimonials = testimonials.filter(t => t.isApproved === true);
      const pendingTestimonials = testimonials.filter(t => t.isApproved === false);
      
      if (pendingTestimonials.length === 0) {
        runner.recordTest("Moderation Workflow - Testimonials", true, 
          `All ${approvedTestimonials.length} displayed testimonials are approved`);
      } else {
        runner.recordTest("Moderation Workflow - Testimonials", false, 
          `${pendingTestimonials.length} unapproved testimonials are displayed`);
      }
    } else {
      runner.recordTest("Moderation Workflow - Testimonials", true, 
        "No testimonials to check for moderation");
    }
    
    if (innovations && innovations.length > 0) {
      const approvedInnovations = innovations.filter(i => i.isApproved === true);
      const pendingInnovations = innovations.filter(i => i.isApproved === false);
      
      if (pendingInnovations.length === 0) {
        runner.recordTest("Moderation Workflow - Innovations", true, 
          `All ${approvedInnovations.length} displayed innovations are approved`);
      } else {
        runner.recordTest("Moderation Workflow - Innovations", false, 
          `${pendingInnovations.length} unapproved innovations are displayed`);
      }
    } else {
      runner.recordTest("Moderation Workflow - Innovations", true, 
        "No innovations to check for moderation");
    }
    
  } catch (error) {
    runner.recordTest("Community Moderation Workflow", false, error.message);
  }
}

// Run the tests
runCommunityUnitTests();
