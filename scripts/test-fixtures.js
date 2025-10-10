#!/usr/bin/env node

/**
 * Test Data Fixtures for Beta Authentication Testing
 * 
 * Provides reusable test data for all test scripts to ensure consistency
 * and make it easy to update test data across all tests.
 */

import { generateTestEmail, generateTestPassword, generateTestName, generateTestSchool, generateTestSubject } from './test-utils.js';

// Base test data - these will be generated fresh for each test run
export const createTestUser = (prefix = "test") => ({
  email: generateTestEmail(prefix),
  name: generateTestName(),
  school: generateTestSchool(),
  subject: generateTestSubject(),
  password: generateTestPassword()
});

// Specific test scenarios
export const TEST_USERS = {
  // Valid beta user for normal flow testing
  validBetaUser: () => createTestUser("valid"),
  
  // Duplicate email user for testing duplicate prevention
  duplicateEmailUser: () => {
    const baseUser = createTestUser("duplicate");
    return {
      ...baseUser,
      email: "duplicate-test@example.com" // Fixed email for duplicate testing
    };
  },
  
  // Invalid data user for testing validation
  invalidDataUser: () => ({
    email: "invalid-email",
    name: "",
    school: "",
    subject: "",
    password: "123" // Too short
  }),
  
  // Edge case user with special characters
  specialCharsUser: () => ({
    email: generateTestEmail("special"),
    name: "José María O'Connor-Smith",
    school: "St. Mary's High School",
    subject: "English Language Arts",
    password: generateTestPassword()
  }),
  
  // Long data user for testing field limits
  longDataUser: () => ({
    email: generateTestEmail("long"),
    name: "A".repeat(100), // Very long name
    school: "B".repeat(100), // Very long school name
    subject: "C".repeat(50), // Very long subject
    password: generateTestPassword(50) // Very long password
  })
};

// Test data for different beta program scenarios
export const BETA_PROGRAM_SCENARIOS = {
  // New user with no existing data
  newUser: () => ({
    status: "invited",
    onboardingStep: 0,
    onboardingCompleted: false,
    frameworksTried: 0,
    totalTimeSaved: 0,
    innovationsShared: 0,
    officeHoursAttended: 0,
    weeklyEngagementCount: 0
  }),
  
  // Active user with some progress
  activeUser: () => ({
    status: "active",
    onboardingStep: 2,
    onboardingCompleted: false,
    frameworksTried: 3,
    totalTimeSaved: 45,
    innovationsShared: 1,
    officeHoursAttended: 1,
    weeklyEngagementCount: 2
  }),
  
  // Completed user
  completedUser: () => ({
    status: "completed",
    onboardingStep: 4,
    onboardingCompleted: true,
    frameworksTried: 10,
    totalTimeSaved: 120,
    innovationsShared: 5,
    officeHoursAttended: 3,
    weeklyEngagementCount: 8
  })
};

// Test data for user profiles
export const USER_PROFILE_SCENARIOS = {
  // Basic teacher profile
  basicTeacher: () => ({
    school: generateTestSchool(),
    subject: generateTestSubject(),
    gradeLevel: "9-12",
    district: "Lafayette Parish",
    role: "teacher"
  }),
  
  // Admin profile
  admin: () => ({
    school: generateTestSchool(),
    subject: "Administration",
    gradeLevel: "K-12",
    district: "Lafayette Parish",
    role: "admin"
  }),
  
  // Coach profile
  coach: () => ({
    school: generateTestSchool(),
    subject: "Instructional Coaching",
    gradeLevel: "K-12",
    district: "Lafayette Parish",
    role: "coach"
  }),
  
  // Minimal profile (only required fields)
  minimal: () => ({
    role: "teacher"
  })
};

// Test data for beta signup scenarios
export const BETA_SIGNUP_SCENARIOS = {
  // Pending signup
  pending: () => ({
    email: generateTestEmail("pending"),
    name: generateTestName(),
    school: generateTestSchool(),
    subject: generateTestSubject(),
    status: "pending",
    signupDate: Date.now(),
    betaProgramId: "beta-v1"
  }),
  
  // Approved signup
  approved: () => ({
    email: generateTestEmail("approved"),
    name: generateTestName(),
    school: generateTestSchool(),
    subject: generateTestSubject(),
    status: "approved",
    signupDate: Date.now(),
    betaProgramId: "beta-v1"
  }),
  
  // Rejected signup
  rejected: () => ({
    email: generateTestEmail("rejected"),
    name: generateTestName(),
    school: generateTestSchool(),
    subject: generateTestSubject(),
    status: "rejected",
    signupDate: Date.now(),
    betaProgramId: "beta-v1",
    notes: "Incomplete application"
  })
};

// Test data for API endpoints
export const API_TEST_DATA = {
  // Better Auth signup request
  betterAuthSignup: (user) => ({
    email: user.email,
    password: user.password,
    name: user.name || user.email.split('@')[0]
  }),
  
  // Better Auth signin request
  betterAuthSignin: (user) => ({
    email: user.email,
    password: user.password
  }),
  
  // Expected Better Auth response structure
  betterAuthUser: (user) => ({
    id: expect.any(String),
    email: user.email,
    name: user.name,
    emailVerified: false,
    image: null,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number)
  })
};

// Test data for error scenarios
export const ERROR_SCENARIOS = {
  // Network errors
  networkError: {
    type: "network",
    message: "Failed to fetch",
    code: "NETWORK_ERROR"
  },
  
  // Validation errors
  validationError: {
    type: "validation",
    message: "Invalid email format",
    code: "VALIDATION_ERROR"
  },
  
  // Authentication errors
  authError: {
    type: "auth",
    message: "Invalid credentials",
    code: "AUTH_ERROR"
  },
  
  // Database errors
  databaseError: {
    type: "database",
    message: "Database connection failed",
    code: "DATABASE_ERROR"
  }
};

// Test data for environment configuration
export const ENV_CONFIG = {
  // Required environment variables
  required: [
    'VITE_CONVEX_SITE_URL',
    'SITE_URL',
    'BETTER_AUTH_SECRET'
  ],
  
  // Optional environment variables
  optional: [
    'BETTER_AUTH_URL',
    'RESEND_API_KEY',
    'VAPI_API_KEY'
  ],
  
  // Expected URL patterns
  urlPatterns: {
    convexSiteUrl: /^https:\/\/[a-z0-9-]+\.convex\.(cloud|site)$/,
    siteUrl: /^https?:\/\/[a-z0-9.-]+(\.[a-z]{2,})?$/,
    localhost: /^http:\/\/localhost:\d+$/
  }
};

// Test data for database state validation
export const DATABASE_STATE_EXPECTATIONS = {
  // Expected tables after successful beta signup
  afterBetaSignup: {
    betaSignups: 1,
    users: 0, // User not created yet
    userProfiles: 0,
    betaProgram: 0,
    sessions: 0
  },
  
  // Expected tables after user account creation
  afterUserCreation: {
    betaSignups: 1,
    users: 1, // User created in Better Auth
    userProfiles: 0, // Profile not created yet
    betaProgram: 0, // Beta program not created yet
    sessions: 0 // Session not created yet
  },
  
  // Expected tables after complete initialization
  afterCompleteInit: {
    betaSignups: 1,
    users: 1,
    userProfiles: 1,
    betaProgram: 1,
    sessions: 1 // Active session
  }
};

// Helper function to create test data with specific overrides
export function createTestData(baseData, overrides = {}) {
  return { ...baseData, ...overrides };
}

// Helper function to create multiple test users
export function createMultipleTestUsers(count, prefix = "test") {
  return Array.from({ length: count }, (_, index) => 
    createTestUser(`${prefix}-${index}`)
  );
}

// Helper function to create test data for specific test scenarios
export function createScenarioData(scenario, userType = "validBetaUser") {
  const user = TEST_USERS[userType]();
  const scenarioData = BETA_PROGRAM_SCENARIOS[scenario] || BETA_PROGRAM_SCENARIOS.newUser();
  
  return {
    user,
    betaProgram: scenarioData,
    profile: USER_PROFILE_SCENARIOS.basicTeacher()
  };
}
