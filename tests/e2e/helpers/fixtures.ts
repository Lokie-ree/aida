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

/**
 * Test alignment scorecard content data
 */
export const testAlignmentContent = {
  elaLesson: {
    content: `Lesson Plan: Character Analysis in "To Kill a Mockingbird"

Objective: Students will analyze character development and motivations.

Activities:
1. Read Chapter 3 of "To Kill a Mockingbird"
2. Complete character analysis worksheet for Atticus Finch
3. Write a paragraph explaining how Atticus demonstrates moral courage
4. Discuss in small groups: How does Atticus's character influence Scout's development?

Assessment: Students will write a 5-paragraph essay analyzing how Atticus serves as a moral compass in the novel.`,
    gradeLevel: "9",
    subject: "ela" as const,
  },
  mathQuiz: {
    content: `Algebra I Quiz: Linear Equations

1. Solve for x: 2x + 5 = 13
   a) x = 4
   b) x = 9
   c) x = 6
   d) x = 8

2. What is the slope of the line y = 3x - 2?
   a) 3
   b) -2
   c) 2
   d) -3

3. Write the equation of a line with slope 2 that passes through point (1, 3).

4. Graph the equation y = -x + 4 on the coordinate plane.`,
    gradeLevel: "9",
    subject: "math" as const,
  },
  scienceLab: {
    content: `Biology Lab: Photosynthesis Investigation

Purpose: To investigate the factors that affect the rate of photosynthesis in plants.

Materials:
- Elodea plants
- Test tubes
- Sodium bicarbonate solution
- Light source
- Thermometer

Procedure:
1. Place elodea in test tube with sodium bicarbonate solution
2. Expose to different light intensities
3. Measure oxygen production over 10 minutes
4. Record observations

Conclusion: Students will analyze how light intensity affects photosynthesis rates.`,
    gradeLevel: "10",
    subject: "science" as const,
  },
};

