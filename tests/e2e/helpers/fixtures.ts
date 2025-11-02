/**
 * E2E Test Fixtures
 * 
 * Provides test data and helper functions for creating test scenarios
 */

/**
 * Test user credentials
 * 
 * Note: Uses @resend.dev addresses to prevent email bounces in development.
 * Resend's test domain accepts all emails without bouncing.
 */
export const testUsers = {
  regular: {
    email: "test-user@resend.dev",
    name: "Test Teacher",
    school: "Test School",
    subject: "Mathematics",
  },
  admin: {
    email: "admin@resend.dev",
    name: "Admin User",
    school: "Test School District",
    subject: "Administration",
  },
  // Note: newUser is not currently used - TC-DASHBOARD-009 uses regular user instead
  // If you need a dedicated onboarding test user, create "onboarding-test-user@resend.dev"
  newUser: {
    email: "onboarding-test-user@resend.dev", // Fixed email - create this user if needed
    name: "New Teacher",
    school: "New School",
    subject: "Science",
  },
};

/**
 * Test framework data
 */
export const testFrameworks = {
  aiBasics: {
    title: "Effective AI Prompting Techniques",
    module: "ai-basics-hub",
    category: "Prompt Engineering",
    difficulty: "beginner",
  },
  instructional: {
    title: "Differentiated Instruction with AI",
    module: "instructional-expert-hub",
    category: "Differentiation",
    difficulty: "intermediate",
  },
};

/**
 * Test innovation data
 */
export const testInnovations = {
  basic: {
    title: "Test Innovation",
    description: "This is a test innovation description",
    subject: "Mathematics",
    gradeLevel: "6-8",
    aiTool: "ChatGPT",
  },
};

/**
 * Test testimonial data
 */
export const testTestimonials = {
  basic: {
    quote: "This platform has saved me hours each week!",
    school: "Louisiana Test School",
    subject: "Mathematics",
    impact: "Time saved",
    timeSaved: "5 hours per week",
  },
};

