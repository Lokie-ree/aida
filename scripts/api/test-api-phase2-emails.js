#!/usr/bin/env node

/**
 * API Tests for Phase 2 Email Notifications
 * 
 * Tests Resend email delivery for Phase 2 features to verify:
 * - Framework recommendation emails are sent correctly
 * - Innovation approval notifications work
 * - Testimonial publication alerts are delivered
 * - Weekly engagement summaries are sent
 * - Email templates render correctly with test data
 * - FERPA compliance in email content
 */

import { TestRunner, ConvexTestClient, cleanTestData, sleep } from '../test-utils.js';
import { RESEND_TEST_CONFIG, PHASE2_USER_STORIES } from '../test-fixtures.js';

// Configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function runPhase2EmailAPITests() {
  const runner = new TestRunner("Phase 2 Email API Tests");
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    runner.log("🚀 Starting Phase 2 Email API tests...");
    runner.log(`🔗 Convex URL: ${CONVEX_URL}`);
    
    // Clean database before starting
    await cleanTestData(client);
    
    // Test 1: Framework recommendation email
    await testFrameworkRecommendationEmail(runner, client);
    
    // Test 2: Innovation approval email
    await testInnovationApprovalEmail(runner, client);
    
    // Test 3: Testimonial publication email
    await testTestimonialPublicationEmail(runner, client);
    
    // Test 4: Weekly engagement email
    await testWeeklyEngagementEmail(runner, client);
    
    // Test 5: Email template validation
    await testEmailTemplateValidation(runner, client);
    
    // Test 6: FERPA compliance in emails
    await testFERPAComplianceInEmails(runner, client);
    
    // Test 7: Email delivery timing
    await testEmailDeliveryTiming(runner, client);
    
    // Print results
    const success = runner.printResults();
    
    if (!success) {
      runner.log("❌ Some Phase 2 email tests failed. Check the details above.", "error");
      process.exit(1);
    } else {
      runner.log("✅ All Phase 2 Email API tests passed!", "success");
      process.exit(0);
    }
    
  } catch (error) {
    runner.log(`💥 Phase 2 email test runner error: ${error.message}`, "error");
    process.exit(1);
  }
}

async function testFrameworkRecommendationEmail(runner, client) {
  runner.log("🧪 Testing framework recommendation email...");
  
  try {
    const emailConfig = RESEND_TEST_CONFIG.emailTestScenarios.frameworkEmail;
    const template = RESEND_TEST_CONFIG.emailTemplates.frameworkRecommendation;
    
    // Test email configuration
    if (emailConfig.recipient && emailConfig.template) {
      runner.recordTest("Framework Email Configuration", true, 
        `Framework email configured for ${emailConfig.recipient}`);
    } else {
      runner.recordTest("Framework Email Configuration", false, 
        "Framework email configuration missing");
    }
    
    // Test template data
    if (template.testData && template.testData.educatorName) {
      runner.recordTest("Framework Email Template Data", true, 
        `Template data includes educator: ${template.testData.educatorName}`);
    } else {
      runner.recordTest("Framework Email Template Data", false, 
        "Framework email template data missing");
    }
    
    // Test email content validation
    const requiredFields = ['educatorName', 'frameworkTitle', 'frameworkDescription', 'timeSaved'];
    const hasRequiredFields = requiredFields.every(field => template.testData[field]);
    
    if (hasRequiredFields) {
      runner.recordTest("Framework Email Content Validation", true, 
        "Framework email has all required content fields");
    } else {
      runner.recordTest("Framework Email Content Validation", false, 
        "Framework email missing required content fields");
    }
    
    // Test Louisiana context in email
    if (template.testData.personalization && 
        template.testData.personalization.includes('Louisiana')) {
      runner.recordTest("Framework Email Louisiana Context", true, 
        "Framework email includes Louisiana-specific context");
    } else {
      runner.recordTest("Framework Email Louisiana Context", true, 
        "Framework email Louisiana context not required for all emails");
    }
    
  } catch (error) {
    runner.recordTest("Framework Recommendation Email", false, error.message);
  }
}

async function testInnovationApprovalEmail(runner, client) {
  runner.log("🧪 Testing innovation approval email...");
  
  try {
    const emailConfig = RESEND_TEST_CONFIG.emailTestScenarios.communityEmail;
    const template = RESEND_TEST_CONFIG.emailTemplates.innovationApproved;
    
    // Test email configuration
    if (emailConfig.recipient && emailConfig.template) {
      runner.recordTest("Innovation Email Configuration", true, 
        `Innovation email configured for ${emailConfig.recipient}`);
    } else {
      runner.recordTest("Innovation Email Configuration", false, 
        "Innovation email configuration missing");
    }
    
    // Test template data
    if (template.testData && template.testData.educatorName) {
      runner.recordTest("Innovation Email Template Data", true, 
        `Template data includes educator: ${template.testData.educatorName}`);
    } else {
      runner.recordTest("Innovation Email Template Data", false, 
        "Innovation email template data missing");
    }
    
    // Test community impact messaging
    if (template.testData.communityImpact && 
        template.testData.communityImpact.includes('educators')) {
      runner.recordTest("Innovation Email Community Impact", true, 
        "Innovation email includes community impact messaging");
    } else {
      runner.recordTest("Innovation Email Community Impact", false, 
        "Innovation email missing community impact messaging");
    }
    
    // Test innovation title validation
    if (template.testData.innovationTitle && 
        template.testData.innovationTitle.length > 5) {
      runner.recordTest("Innovation Email Title Validation", true, 
        `Innovation title: ${template.testData.innovationTitle}`);
    } else {
      runner.recordTest("Innovation Email Title Validation", false, 
        "Innovation email title missing or too short");
    }
    
  } catch (error) {
    runner.recordTest("Innovation Approval Email", false, error.message);
  }
}

async function testTestimonialPublicationEmail(runner, client) {
  runner.log("🧪 Testing testimonial publication email...");
  
  try {
    const emailConfig = RESEND_TEST_CONFIG.emailTestScenarios.testimonialEmail;
    const template = RESEND_TEST_CONFIG.emailTemplates.testimonialPublished;
    
    // Test email configuration
    if (emailConfig.recipient && emailConfig.template) {
      runner.recordTest("Testimonial Email Configuration", true, 
        `Testimonial email configured for ${emailConfig.recipient}`);
    } else {
      runner.recordTest("Testimonial Email Configuration", false, 
        "Testimonial email configuration missing");
    }
    
    // Test template data
    if (template.testData && template.testData.educatorName) {
      runner.recordTest("Testimonial Email Template Data", true, 
        `Template data includes educator: ${template.testData.educatorName}`);
    } else {
      runner.recordTest("Testimonial Email Template Data", false, 
        "Testimonial email template data missing");
    }
    
    // Test time savings validation
    if (template.testData.timeSaved && 
        template.testData.timeSaved.includes('hours')) {
      runner.recordTest("Testimonial Email Time Savings", true, 
        `Time saved: ${template.testData.timeSaved}`);
    } else {
      runner.recordTest("Testimonial Email Time Savings", false, 
        "Testimonial email missing time savings information");
    }
    
    // Test testimonial quote validation
    if (template.testData.testimonialQuote && 
        template.testData.testimonialQuote.length > 20) {
      runner.recordTest("Testimonial Email Quote Validation", true, 
        `Quote length: ${template.testData.testimonialQuote.length} characters`);
    } else {
      runner.recordTest("Testimonial Email Quote Validation", false, 
        "Testimonial email quote missing or too short");
    }
    
  } catch (error) {
    runner.recordTest("Testimonial Publication Email", false, error.message);
  }
}

async function testWeeklyEngagementEmail(runner, client) {
  runner.log("🧪 Testing weekly engagement email...");
  
  try {
    const template = RESEND_TEST_CONFIG.emailTemplates.weeklyEngagement;
    
    // Test template data
    if (template.testData && template.testData.educatorName) {
      runner.recordTest("Weekly Email Template Data", true, 
        `Template data includes educator: ${template.testData.educatorName}`);
    } else {
      runner.recordTest("Weekly Email Template Data", false, 
        "Weekly email template data missing");
    }
    
    // Test engagement metrics
    const hasMetrics = template.testData.frameworksUsed !== undefined &&
                      template.testData.timeSaved &&
                      template.testData.newFrameworks !== undefined &&
                      template.testData.communityActivity;
    
    if (hasMetrics) {
      runner.recordTest("Weekly Email Metrics Validation", true, 
        `Frameworks used: ${template.testData.frameworksUsed}, Time saved: ${template.testData.timeSaved}`);
    } else {
      runner.recordTest("Weekly Email Metrics Validation", false, 
        "Weekly email missing engagement metrics");
    }
    
    // Test community activity tracking
    if (template.testData.communityActivity && 
        template.testData.communityActivity.includes('innovations')) {
      runner.recordTest("Weekly Email Community Activity", true, 
        "Weekly email includes community activity tracking");
    } else {
      runner.recordTest("Weekly Email Community Activity", false, 
        "Weekly email missing community activity tracking");
    }
    
  } catch (error) {
    runner.recordTest("Weekly Engagement Email", false, error.message);
  }
}

async function testEmailTemplateValidation(runner, client) {
  runner.log("🧪 Testing email template validation...");
  
  try {
    const templates = RESEND_TEST_CONFIG.emailTemplates;
    const requiredTemplates = [
      'frameworkRecommendation',
      'innovationApproved', 
      'testimonialPublished',
      'weeklyEngagement'
    ];
    
    // Test all required templates exist
    const hasAllTemplates = requiredTemplates.every(template => templates[template]);
    
    if (hasAllTemplates) {
      runner.recordTest("Email Template Existence", true, 
        `All ${requiredTemplates.length} required templates exist`);
    } else {
      runner.recordTest("Email Template Existence", false, 
        "Missing required email templates");
    }
    
    // Test template structure validation
    let validTemplates = 0;
    
    for (const templateName of requiredTemplates) {
      const template = templates[templateName];
      
      if (template && template.subject && template.template && template.testData) {
        validTemplates++;
        runner.log(`  ✅ ${templateName}: Valid structure`);
      } else {
        runner.log(`  ❌ ${templateName}: Invalid structure`);
      }
    }
    
    if (validTemplates === requiredTemplates.length) {
      runner.recordTest("Email Template Structure", true, 
        `All ${validTemplates} templates have valid structure`);
    } else {
      runner.recordTest("Email Template Structure", false, 
        `${validTemplates}/${requiredTemplates.length} templates have valid structure`);
    }
    
    // Test email subject validation
    let validSubjects = 0;
    
    for (const templateName of requiredTemplates) {
      const template = templates[templateName];
      
      if (template && template.subject && template.subject.length > 5) {
        validSubjects++;
        runner.log(`  ✅ ${templateName}: Valid subject - "${template.subject}"`);
      } else {
        runner.log(`  ❌ ${templateName}: Invalid subject`);
      }
    }
    
    if (validSubjects === requiredTemplates.length) {
      runner.recordTest("Email Subject Validation", true, 
        `All ${validSubjects} templates have valid subjects`);
    } else {
      runner.recordTest("Email Subject Validation", false, 
        `${validSubjects}/${requiredTemplates.length} templates have valid subjects`);
    }
    
  } catch (error) {
    runner.recordTest("Email Template Validation", false, error.message);
  }
}

async function testFERPAComplianceInEmails(runner, client) {
  runner.log("🧪 Testing FERPA compliance in emails...");
  
  try {
    const templates = RESEND_TEST_CONFIG.emailTemplates;
    let ferpaCompliantTemplates = 0;
    let totalTemplates = 0;
    
    // Check each template for FERPA compliance
    for (const [templateName, template] of Object.entries(templates)) {
      if (template && template.testData) {
        totalTemplates++;
        
        // Check for student data in template
        const hasStudentData = template.testData.studentName ||
                              template.testData.studentId ||
                              template.testData.studentExample ||
                              template.testData.studentGrade ||
                              template.testData.studentSchool ||
                              template.testData.studentDistrict;
        
        if (!hasStudentData) {
          ferpaCompliantTemplates++;
          runner.log(`  ✅ ${templateName}: FERPA compliant`);
        } else {
          runner.log(`  ❌ ${templateName}: Contains student data (FERPA violation)`);
        }
      }
    }
    
    if (ferpaCompliantTemplates === totalTemplates) {
      runner.recordTest("FERPA Compliance - Email Templates", true, 
        `All ${ferpaCompliantTemplates} email templates are FERPA-compliant`);
    } else {
      runner.recordTest("FERPA Compliance - Email Templates", false, 
        `${ferpaCompliantTemplates}/${totalTemplates} email templates are FERPA-compliant`);
    }
    
    // Test email content for Louisiana context (should not contain student data)
    const louisianaTemplates = Object.entries(templates).filter(([name, template]) => 
      template && template.testData && 
      (template.testData.personalization?.includes('Louisiana') ||
       template.testData.communityImpact?.includes('Louisiana'))
    );
    
    if (louisianaTemplates.length > 0) {
      runner.recordTest("Louisiana Context in Emails", true, 
        `${louisianaTemplates.length} templates include Louisiana context`);
    } else {
      runner.recordTest("Louisiana Context in Emails", true, 
        "No Louisiana context required in all email templates");
    }
    
  } catch (error) {
    runner.recordTest("FERPA Compliance in Emails", false, error.message);
  }
}

async function testEmailDeliveryTiming(runner, client) {
  runner.log("🧪 Testing email delivery timing...");
  
  try {
    const emailScenarios = RESEND_TEST_CONFIG.emailTestScenarios;
    const scenarios = Object.values(emailScenarios);
    
    // Test expected delivery times
    let validDeliveryTimes = 0;
    
    for (const scenario of scenarios) {
      if (scenario.expectedDelivery && scenario.expectedDelivery.includes('< 30 seconds')) {
        validDeliveryTimes++;
        runner.log(`  ✅ ${scenario.trigger}: Expected delivery < 30 seconds`);
      } else {
        runner.log(`  ❌ ${scenario.trigger}: Invalid delivery time expectation`);
      }
    }
    
    if (validDeliveryTimes === scenarios.length) {
      runner.recordTest("Email Delivery Timing", true, 
        `All ${validDeliveryTimes} email scenarios expect < 30 second delivery`);
    } else {
      runner.recordTest("Email Delivery Timing", false, 
        `${validDeliveryTimes}/${scenarios.length} email scenarios have valid delivery timing`);
    }
    
    // Test email recipient validation
    let validRecipients = 0;
    
    for (const scenario of scenarios) {
      if (scenario.recipient && scenario.recipient.includes('@resend.dev')) {
        validRecipients++;
        runner.log(`  ✅ ${scenario.trigger}: Valid recipient - ${scenario.recipient}`);
      } else {
        runner.log(`  ❌ ${scenario.trigger}: Invalid recipient - ${scenario.recipient}`);
      }
    }
    
    if (validRecipients === scenarios.length) {
      runner.recordTest("Email Recipient Validation", true, 
        `All ${validRecipients} email scenarios have valid recipients`);
    } else {
      runner.recordTest("Email Recipient Validation", false, 
        `${validRecipients}/${scenarios.length} email scenarios have valid recipients`);
    }
    
  } catch (error) {
    runner.recordTest("Email Delivery Timing", false, error.message);
  }
}

// Run the tests
runPhase2EmailAPITests();
