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
  password: generateTestPassword(),
  isTestData: true // NEW: Mark all test data for isolation
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
      email: "delivered+duplicate-test@resend.dev" // Fixed email for duplicate testing
    };
  },
  
  // Invalid data user for testing validation
  invalidDataUser: () => ({
    email: "invalid-email",
    name: "",
    school: "",
    subject: "",
    password: "123", // Too short
    isTestData: true // NEW: Mark all test data for isolation
  }),
  
  // Edge case user with special characters
  specialCharsUser: () => ({
    email: generateTestEmail("special"),
    name: "José María O'Connor-Smith",
    school: "St. Mary's High School",
    subject: "English Language Arts",
    password: generateTestPassword(),
    isTestData: true // NEW: Mark all test data for isolation
  }),
  
  // Long data user for testing field limits
  longDataUser: () => ({
    email: generateTestEmail("long"),
    name: "A".repeat(100), // Very long name
    school: "B".repeat(100), // Very long school name
    subject: "C".repeat(50), // Very long subject
    password: generateTestPassword(50), // Very long password
    isTestData: true // NEW: Mark all test data for isolation
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
    weeklyEngagementCount: 0,
    isTestData: true // NEW: Mark all test data for isolation
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
    weeklyEngagementCount: 2,
    isTestData: true // NEW: Mark all test data for isolation
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
    weeklyEngagementCount: 8,
    isTestData: true // NEW: Mark all test data for isolation
  })
};

// Phase 2 User Stories Test Data
export const PHASE2_USER_STORIES = {
  // USER-003: Framework Library Access
  frameworkLibraryAccess: () => ({
    storyId: "USER-003",
    title: "Framework Library Access",
    description: "As a Louisiana educator, I want to browse and access AI guidance frameworks, so that I can find relevant prompts for my specific teaching needs.",
    acceptanceCriteria: [
      "Framework library loads in <3 seconds",
      "Can filter by subject, grade level, and Louisiana standards",
      "Each framework shows clear usage instructions",
      "Platform-agnostic guidance (works with any AI tool)",
      "Louisiana-specific examples and context"
    ],
    priority: "P0",
    testData: {
      frameworks: [
        {
          id: "framework-001",
          title: "Lesson Plan Generation",
          subject: "English Language Arts",
          gradeLevel: "9-12",
          louisianaStandard: "ELA.9-12.W.1",
          description: "Generate comprehensive lesson plans aligned to Louisiana standards",
          prompt: "Create a lesson plan for [TOPIC] that aligns with Louisiana ELA standard [STANDARD]...",
          platformAgnostic: true,
          timeSaved: "15-20 minutes",
          difficulty: "beginner"
        },
        {
          id: "framework-002", 
          title: "Math Problem Creation",
          subject: "Mathematics",
          gradeLevel: "6-8",
          louisianaStandard: "6.EE.A.1",
          description: "Generate differentiated math problems for various skill levels",
          prompt: "Create 5 math problems for [TOPIC] at [SKILL_LEVEL] that align with Louisiana math standard [STANDARD]...",
          platformAgnostic: true,
          timeSaved: "10-15 minutes",
          difficulty: "intermediate"
        }
      ]
    }
  }),

  // USER-004: Community Innovation Sharing
  communityInnovationSharing: () => ({
    storyId: "USER-004",
    title: "Community Innovation Sharing",
    description: "As a Louisiana educator, I want to share my successful AI prompt innovations with other educators, so that we can learn from each other and improve our teaching practices.",
    acceptanceCriteria: [
      "Can submit innovation with title, description, and prompt",
      "Innovations are moderated before public display",
      "Can view other educators' innovations",
      "Can like and comment on innovations",
      "FERPA-compliant (no student data shared)"
    ],
    priority: "P0",
    testData: {
      innovations: [
        {
          id: "innovation-001",
          title: "Louisiana History Timeline Generator",
          description: "Creates interactive timelines for Louisiana history lessons",
          prompt: "Generate a timeline for [HISTORICAL_PERIOD] in Louisiana history...",
          subject: "Social Studies",
          gradeLevel: "4-8",
          author: "Sarah Johnson",
          school: "Jefferson Parish High School",
          likes: 12,
          comments: 3,
          isApproved: true,
          createdAt: Date.now() - 86400000 // 1 day ago
        },
        {
          id: "innovation-002",
          title: "Science Lab Report Template",
          description: "Structured prompts for student lab reports",
          prompt: "Help students write a lab report for [EXPERIMENT] following scientific method...",
          subject: "Science",
          gradeLevel: "6-12",
          author: "Dr. Lisa Rodriguez",
          school: "Baton Rouge Middle School",
          likes: 8,
          comments: 1,
          isApproved: true,
          createdAt: Date.now() - 172800000 // 2 days ago
        }
      ]
    }
  }),

  // USER-005: Testimonial Collection
  testimonialCollection: () => ({
    storyId: "USER-005",
    title: "Testimonial Collection",
    description: "As a Louisiana educator, I want to share my success stories with AI guidance, so that other educators can see the real impact and time savings.",
    acceptanceCriteria: [
      "Can submit testimonial with time saved and specific example",
      "Testimonials are displayed on public pages",
      "Can include before/after examples (anonymized)",
      "Time savings are tracked and displayed",
      "FERPA-compliant testimonials only"
    ],
    priority: "P1",
    testData: {
      testimonials: [
        {
          id: "testimonial-001",
          author: "Michael Chen",
          school: "Lafayette Elementary",
          subject: "Mathematics",
          timeSaved: 150, // 2.5 hours in minutes
          quote: "The math problem generation framework saved me 2.5 hours every week. I can now focus on teaching instead of creating worksheets.",
          specificExample: "Generated 20 differentiated word problems in 5 minutes instead of 30 minutes",
          isApproved: true,
          createdAt: Date.now() - 259200000 // 3 days ago
        },
        {
          id: "testimonial-002",
          author: "Sarah Johnson",
          school: "Jefferson Parish High School",
          subject: "English Language Arts",
          timeSaved: 90, // 1.5 hours in minutes
          quote: "The lesson plan framework helps me create more engaging and standards-aligned lessons quickly.",
          specificExample: "Created a complete Romeo and Juliet unit plan in 15 minutes",
          isApproved: true,
          createdAt: Date.now() - 345600000 // 4 days ago
        }
      ]
    }
  }),

  // USER-006: Dashboard Analytics
  dashboardAnalytics: () => ({
    storyId: "USER-006",
    title: "Dashboard Analytics",
    description: "As a Louisiana educator, I want to see my usage statistics and time savings, so that I can track my progress and demonstrate the value of AI guidance.",
    acceptanceCriteria: [
      "Shows total time saved this month",
      "Displays frameworks used most frequently",
      "Tracks weekly engagement streak",
      "Shows innovations shared count",
      "Displays progress toward goals"
    ],
    priority: "P1",
    testData: {
      userStats: {
        totalTimeSaved: 45, // hours
        frameworksUsed: 8,
        innovationsShared: 2,
        weeklyStreak: 3,
        monthlyGoal: 20, // hours
        progressPercentage: 75
      }
    }
  })
};

// Phase 2 Framework Test Data
export const FRAMEWORK_TEST_DATA = {
  // Louisiana-aligned frameworks for testing
  louisianaFrameworks: [
    {
      id: "la-ela-001",
      title: "Louisiana ELA Writing Prompts",
      subject: "English Language Arts",
      gradeLevel: "9-12",
      louisianaStandard: "ELA.9-12.W.1",
      description: "Generate writing prompts aligned to Louisiana ELA standards",
      prompt: "Create a writing prompt for [TOPIC] that aligns with Louisiana ELA standard [STANDARD] and includes [REQUIREMENTS]...",
      platformAgnostic: true,
      timeSaved: "10-15 minutes",
      difficulty: "beginner",
      tags: ["writing", "prompts", "louisiana-standards"],
      usageCount: 45,
      averageRating: 4.8
    },
    {
      id: "la-math-001",
      title: "Louisiana Math Problem Generator",
      subject: "Mathematics",
      gradeLevel: "6-8",
      louisianaStandard: "6.EE.A.1",
      description: "Generate math problems aligned to Louisiana math standards",
      prompt: "Create [NUMBER] math problems for [TOPIC] at [SKILL_LEVEL] that align with Louisiana math standard [STANDARD]...",
      platformAgnostic: true,
      timeSaved: "15-20 minutes",
      difficulty: "intermediate",
      tags: ["math", "problems", "louisiana-standards"],
      usageCount: 32,
      averageRating: 4.6
    },
    {
      id: "la-science-001",
      title: "Louisiana Science Lab Activities",
      subject: "Science",
      gradeLevel: "6-12",
      louisianaStandard: "MS-PS1-1",
      description: "Generate science lab activities aligned to Louisiana science standards",
      prompt: "Design a lab activity for [TOPIC] that aligns with Louisiana science standard [STANDARD] and includes [SAFETY_REQUIREMENTS]...",
      platformAgnostic: true,
      timeSaved: "20-25 minutes",
      difficulty: "advanced",
      tags: ["science", "labs", "louisiana-standards"],
      usageCount: 28,
      averageRating: 4.9
    }
  ],

  // Framework usage scenarios
  usageScenarios: {
    newUser: {
      frameworksTried: 0,
      favoriteFrameworks: [],
      recentActivity: [],
      recommendations: ["la-ela-001", "la-math-001"]
    },
    activeUser: {
      frameworksTried: 5,
      favoriteFrameworks: ["la-ela-001", "la-math-001"],
      recentActivity: [
        { frameworkId: "la-ela-001", usedAt: Date.now() - 3600000, timeSaved: 15 },
        { frameworkId: "la-math-001", usedAt: Date.now() - 7200000, timeSaved: 20 }
      ],
      recommendations: ["la-science-001"]
    },
    powerUser: {
      frameworksTried: 15,
      favoriteFrameworks: ["la-ela-001", "la-math-001", "la-science-001"],
      recentActivity: [
        { frameworkId: "la-science-001", usedAt: Date.now() - 1800000, timeSaved: 25 },
        { frameworkId: "la-ela-001", usedAt: Date.now() - 5400000, timeSaved: 12 },
        { frameworkId: "la-math-001", usedAt: Date.now() - 9000000, timeSaved: 18 }
      ],
      recommendations: []
    }
  }
};

// Phase 2 Community Test Data
export const COMMUNITY_TEST_DATA = {
  // Innovation submissions for testing
  innovationSubmissions: [
    {
      id: "innovation-sub-001",
      title: "Louisiana History Timeline Generator",
      description: "Creates interactive timelines for Louisiana history lessons with student engagement prompts",
      prompt: "Generate a timeline for [HISTORICAL_PERIOD] in Louisiana history with [NUMBER] key events, including [STUDENT_ACTIVITIES]...",
      subject: "Social Studies",
      gradeLevel: "4-8",
      author: "Sarah Johnson",
      school: "Jefferson Parish High School",
      district: "Jefferson Parish",
      status: "pending",
      submittedAt: Date.now() - 3600000, // 1 hour ago
      tags: ["history", "timeline", "louisiana", "interactive"]
    },
    {
      id: "innovation-sub-002",
      title: "Math Word Problem Creator",
      description: "Generates culturally relevant math word problems for Louisiana students",
      prompt: "Create [NUMBER] math word problems about [LOUISIANA_TOPIC] that require [MATH_SKILL] and include [REAL_WORLD_CONTEXT]...",
      subject: "Mathematics",
      gradeLevel: "3-5",
      author: "Michael Chen",
      school: "Lafayette Elementary",
      district: "Lafayette Parish",
      status: "approved",
      submittedAt: Date.now() - 86400000, // 1 day ago
      tags: ["math", "word-problems", "louisiana", "cultural-relevance"]
    }
  ],

  // Testimonial submissions for testing
  testimonialSubmissions: [
    {
      id: "testimonial-sub-001",
      author: "Dr. Lisa Rodriguez",
      school: "Baton Rouge Middle School",
      district: "East Baton Rouge Parish",
      subject: "Science",
      timeSaved: 180, // 3 hours in minutes
      quote: "The science lab framework transformed how I prepare experiments. Students are more engaged and I save 3 hours every week.",
      specificExample: "Created a complete chemistry lab series in 30 minutes instead of 3 hours",
      impact: "Student engagement increased by 40%",
      status: "pending",
      submittedAt: Date.now() - 7200000, // 2 hours ago
      isAnonymous: false
    },
    {
      id: "testimonial-sub-002",
      author: "Anonymous",
      school: "Lafayette High School",
      district: "Lafayette Parish",
      subject: "English Language Arts",
      timeSaved: 120, // 2 hours in minutes
      quote: "The writing prompt framework helps me create more diverse and engaging prompts for my students.",
      specificExample: "Generated 20 creative writing prompts in 10 minutes",
      impact: "Student writing quality improved significantly",
      status: "approved",
      submittedAt: Date.now() - 172800000, // 2 days ago
      isAnonymous: true
    }
  ]
};

// Resend Test Email Configuration for Phase 2
export const RESEND_TEST_CONFIG = {
  // Test email addresses for Phase 2 features (must use @resend.dev for test mode)
  testEmails: {
    frameworkNotifications: "delivered@resend.dev",
    communityUpdates: "delivered@resend.dev", 
    testimonialAlerts: "delivered@resend.dev",
    adminNotifications: "delivered@resend.dev"
  },

  // Email templates for Phase 2 features
  emailTemplates: {
    frameworkRecommendation: {
      subject: "New Framework Recommendation for You",
      template: "framework-recommendation",
      testData: {
        educatorName: "Sarah Johnson",
        frameworkTitle: "Louisiana ELA Writing Prompts",
        frameworkDescription: "Generate writing prompts aligned to Louisiana ELA standards",
        timeSaved: "10-15 minutes",
        personalization: "Based on your English Language Arts teaching"
      }
    },
    innovationApproved: {
      subject: "Your Innovation Has Been Approved!",
      template: "innovation-approved",
      testData: {
        educatorName: "Michael Chen",
        innovationTitle: "Math Word Problem Creator",
        communityImpact: "Now available to 150+ Louisiana educators"
      }
    },
    testimonialPublished: {
      subject: "Your Testimonial is Now Live",
      template: "testimonial-published",
      testData: {
        educatorName: "Dr. Lisa Rodriguez",
        timeSaved: 180, // 3 hours in minutes
        testimonialQuote: "The science lab framework transformed how I prepare experiments..."
      }
    },
    weeklyEngagement: {
      subject: "Your Weekly AI Guidance Summary",
      template: "weekly-engagement",
      testData: {
        educatorName: "Sarah Johnson",
        frameworksUsed: 3,
        timeSaved: 150, // 2.5 hours in minutes
        newFrameworks: 1,
        communityActivity: "2 innovations shared"
      }
    }
  },

  // Test scenarios for email delivery
  emailTestScenarios: {
    frameworkEmail: {
      trigger: "framework_recommendation",
      recipient: "delivered@resend.dev",
      template: "framework-recommendation",
      expectedDelivery: "< 30 seconds",
      testData: PHASE2_USER_STORIES.frameworkLibraryAccess().testData
    },
    communityEmail: {
      trigger: "innovation_approved",
      recipient: "delivered@resend.dev", 
      template: "innovation-approved",
      expectedDelivery: "< 30 seconds",
      testData: PHASE2_USER_STORIES.communityInnovationSharing().testData
    },
    testimonialEmail: {
      trigger: "testimonial_published",
      recipient: "delivered@resend.dev",
      template: "testimonial-published", 
      expectedDelivery: "< 30 seconds",
      testData: PHASE2_USER_STORIES.testimonialCollection().testData
    }
  }
};

// Test data for user profiles
export const USER_PROFILE_SCENARIOS = {
  // Basic teacher profile
  basicTeacher: () => ({
    school: generateTestSchool(),
    subject: generateTestSubject(),
    gradeLevel: "9-12",
    district: "Lafayette Parish",
    role: "teacher",
    isTestData: true // NEW: Mark all test data for isolation
  }),
  
  // Admin profile
  admin: () => ({
    school: generateTestSchool(),
    subject: "Administration",
    gradeLevel: "K-12",
    district: "Lafayette Parish",
    role: "admin",
    isTestData: true // NEW: Mark all test data for isolation
  }),
  
  // Coach profile
  coach: () => ({
    school: generateTestSchool(),
    subject: "Instructional Coaching",
    gradeLevel: "K-12",
    district: "Lafayette Parish",
    role: "coach",
    isTestData: true // NEW: Mark all test data for isolation
  }),
  
  // Minimal profile (only required fields)
  minimal: () => ({
    role: "teacher",
    isTestData: true // NEW: Mark all test data for isolation
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
    betaProgramId: "beta-v1",
    isTestData: true // NEW: Mark all test data for isolation
  }),
  
  // Approved signup
  approved: () => ({
    email: generateTestEmail("approved"),
    name: generateTestName(),
    school: generateTestSchool(),
    subject: generateTestSubject(),
    status: "approved",
    signupDate: Date.now(),
    betaProgramId: "beta-v1",
    isTestData: true // NEW: Mark all test data for isolation
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
    notes: "Incomplete application",
    isTestData: true // NEW: Mark all test data for isolation
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
