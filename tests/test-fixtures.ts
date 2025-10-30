/**
 * Test Data Fixtures
 * 
 * Reusable test data factories for consistent test data generation.
 * These replace the JavaScript test-fixtures.js functions.
 */

/**
 * Creates a valid beta user object for testing
 */
export function createValidBetaUser(): {
  email: string;
  name: string;
  school: string;
  subject: string;
} {
  return {
    email: `test-${Date.now()}@example.com`,
    name: "Test Teacher",
    school: "Test School",
    subject: "Mathematics",
  };
}

/**
 * Creates an invalid user data object for testing validation
 */
export function createInvalidUser(): {
  email: string;
  name: string;
  school: string;
  subject: string;
} {
  return {
    email: "invalid-email", // Invalid email format
    name: "", // Empty name
    school: "Test School",
    subject: "Math",
  };
}

/**
 * Creates a test user profile data object
 */
export function createTestUserProfile(): {
  school: string;
  subject: string;
  gradeLevel: string;
  role: "teacher" | "admin" | "coach";
} {
  return {
    school: "Test School District",
    subject: "Science",
    gradeLevel: "6-8",
    role: "teacher",
  };
}

/**
 * Creates a test framework data object
 */
export function createTestFrameworkData(): {
  title: string;
  module: "ai-basics-hub" | "instructional-expert-hub";
  category: string;
  tags: string[];
  difficultyLevel: "beginner" | "intermediate" | "advanced";
} {
  return {
    title: "Effective AI Prompting Techniques",
    module: "ai-basics-hub",
    category: "Prompt Engineering",
    tags: ["prompting", "basics", "chatgpt"],
    difficultyLevel: "beginner",
  };
}

/**
 * Creates test beta program scenarios
 */
export const betaProgramScenarios = {
  newUser: {
    status: "invited" as const,
    onboardingStep: 0,
    onboardingCompleted: false,
    frameworksTried: 0,
    totalTimeSaved: 0,
    innovationsShared: 0,
    weeklyEngagementCount: 0,
  },
  activeUser: {
    status: "active" as const,
    onboardingStep: 3,
    onboardingCompleted: true,
    frameworksTried: 5,
    totalTimeSaved: 120,
    innovationsShared: 2,
    weeklyEngagementCount: 3,
  },
  powerUser: {
    status: "active" as const,
    onboardingStep: 5,
    onboardingCompleted: true,
    frameworksTried: 15,
    totalTimeSaved: 600,
    innovationsShared: 8,
    weeklyEngagementCount: 10,
  },
};

