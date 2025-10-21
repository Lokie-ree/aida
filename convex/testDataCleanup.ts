import { internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * Test Data Cleanup System
 * 
 * Centralized system for managing test data isolation and cleanup.
 * All functions operate on records with isTestData: true flag.
 * 
 * **Safety Features:**
 * - Only deletes records with isTestData: true
 * - Provides verification before cleanup
 * - Returns detailed counts and warnings
 * 
 * **Usage:**
 * - Pre-test: Clean existing test data
 * - Post-test: Clean test data created during current run
 * - Emergency: Manual cleanup with verification
 */

/**
 * Delete all test data across all application tables.
 * 
 * **Safety:** Only deletes records with isTestData: true
 * **Use:** Pre-test cleanup, post-test cleanup, emergency cleanup
 * 
 * @returns {Object} Result containing:
 *   - deletedCounts: Record of table names and deletion counts
 *   - success: Boolean indicating overall success
 *   - warnings: Array of any warnings encountered
 */
export const deleteAllTestData = internalMutation({
  args: {},
  returns: v.object({
    deletedCounts: v.record(v.string(), v.number()),
    success: v.boolean(),
    warnings: v.array(v.string()),
  }),
  handler: async (ctx) => {
    const deletedCounts: Record<string, number> = {};
    const warnings: string[] = [];
    
    try {
      console.log('🧹 Starting test data cleanup...');
      
      // Define all application tables that need cleanup
      const tables = [
        'betaSignups',
        'userProfiles', 
        'betaProgram',
        'frameworks',
        'frameworkUsage',
        'testimonials',
        'innovations',
        'innovationInteractions',
        'timeTracking'
      ];
      
      // Clean each table
      for (const tableName of tables) {
        try {
          const allRecords = await ctx.db.query(tableName as any).collect();
          const testRecords = allRecords.filter((record: any) => record.isTestData === true);
          
          let deletedCount = 0;
          for (const record of testRecords) {
            await ctx.db.delete(record._id);
            deletedCount++;
          }
          
          deletedCounts[tableName] = deletedCount;
          console.log(`✅ Cleaned ${deletedCount} test records from ${tableName}`);
          
        } catch (error) {
          console.error(`❌ Error cleaning ${tableName}:`, error);
          warnings.push(`Failed to clean ${tableName}: ${error}`);
        }
      }
      
      // Check for any records without isTestData flag (potential real data)
      const realDataWarnings = await checkForRealData(ctx);
      warnings.push(...realDataWarnings);
      
      const totalDeleted = Object.values(deletedCounts).reduce((sum, count) => sum + count, 0);
      console.log(`✅ Test data cleanup completed. Total records deleted: ${totalDeleted}`);
      
      return {
        deletedCounts,
        success: warnings.length === 0,
        warnings,
      };
      
    } catch (error) {
      console.error('❌ Test data cleanup failed:', error);
      return {
        deletedCounts,
        success: false,
        warnings: [...warnings, `Cleanup failed: ${error}`],
      };
    }
  },
});

/**
 * Get counts of test data in all application tables.
 * 
 * **Use:** Verify cleanup state, monitor test data accumulation
 * 
 * @returns {Object} Record of table names and test data counts
 */
export const getTestDataCounts = query({
  args: {},
  returns: v.record(v.string(), v.number()),
  handler: async (ctx) => {
    const counts: Record<string, number> = {};
    
    const tables = [
      'betaSignups',
      'userProfiles', 
      'betaProgram',
      'frameworks',
      'frameworkUsage',
      'testimonials',
      'innovations',
      'innovationInteractions',
      'timeTracking'
    ];
    
    for (const tableName of tables) {
      try {
        const allRecords = await ctx.db.query(tableName as any).collect();
        const testRecords = allRecords.filter((record: any) => record.isTestData === true);
        counts[tableName] = testRecords.length;
      } catch (error) {
        console.error(`Error counting test data in ${tableName}:`, error);
        counts[tableName] = -1; // Indicate error
      }
    }
    
    return counts;
  },
});

/**
 * Verify cleanup safety before executing deletion.
 * 
 * **Safety Check:** Identifies records without isTestData flag that might be real data
 * **Use:** Pre-cleanup verification, safety audit
 * 
 * @returns {Object} Safety verification result with warnings
 */
export const verifyCleanupSafety = query({
  args: {},
  returns: v.object({
    safe: v.boolean(),
    warnings: v.array(v.string()),
    realDataCounts: v.record(v.string(), v.number()),
  }),
  handler: async (ctx) => {
    const warnings: string[] = [];
    const realDataCounts: Record<string, number> = {};
    
    const tables = [
      'betaSignups',
      'userProfiles', 
      'betaProgram',
      'frameworks',
      'frameworkUsage',
      'testimonials',
      'innovations',
      'innovationInteractions',
      'timeTracking'
    ];
    
    for (const tableName of tables) {
      try {
        const allRecords = await ctx.db.query(tableName as any).collect();
        const realRecords = allRecords.filter((record: any) => 
          record.isTestData === false // Only flag explicitly marked as real data
        );
        
        realDataCounts[tableName] = realRecords.length;
        
        if (realRecords.length > 0) {
          warnings.push(`${tableName}: ${realRecords.length} records explicitly marked as real data (isTestData: false)`);
        }
        
      } catch (error) {
        console.error(`Error verifying safety for ${tableName}:`, error);
        warnings.push(`${tableName}: Error during safety check - ${error}`);
      }
    }
    
    const hasWarnings = warnings.length > 0;
    
    return {
      safe: !hasWarnings,
      warnings,
      realDataCounts,
    };
  },
});

/**
 * Get comprehensive database state for debugging.
 * 
 * **Use:** Debug test data issues, verify cleanup results
 * 
 * @returns {Object} Complete database state with counts and sample records
 */
export const getDatabaseState = query({
  args: {},
  returns: v.object({
    totalCounts: v.record(v.string(), v.number()),
    testDataCounts: v.record(v.string(), v.number()),
    realDataCounts: v.record(v.string(), v.number()),
    sampleRecords: v.record(v.string(), v.array(v.any())),
  }),
  handler: async (ctx) => {
    const totalCounts: Record<string, number> = {};
    const testDataCounts: Record<string, number> = {};
    const realDataCounts: Record<string, number> = {};
    const sampleRecords: Record<string, any[]> = {};
    
    const tables = [
      'betaSignups',
      'userProfiles', 
      'betaProgram',
      'frameworks',
      'frameworkUsage',
      'testimonials',
      'innovations',
      'innovationInteractions',
      'timeTracking'
    ];
    
    for (const tableName of tables) {
      try {
        const allRecords = await ctx.db.query(tableName as any).collect();
        const testRecords = allRecords.filter((record: any) => record.isTestData === true);
        const realRecords = allRecords.filter((record: any) => record.isTestData !== true);
        
        totalCounts[tableName] = allRecords.length;
        testDataCounts[tableName] = testRecords.length;
        realDataCounts[tableName] = realRecords.length;
        
        // Get sample records (first 3 of each type)
        sampleRecords[tableName] = [
          ...testRecords.slice(0, 3),
          ...realRecords.slice(0, 3),
        ];
        
      } catch (error) {
        console.error(`Error getting state for ${tableName}:`, error);
        totalCounts[tableName] = -1;
        testDataCounts[tableName] = -1;
        realDataCounts[tableName] = -1;
        sampleRecords[tableName] = [];
      }
    }
    
    return {
      totalCounts,
      testDataCounts,
      realDataCounts,
      sampleRecords,
    };
  },
});

/**
 * Helper function to check for records without isTestData flag.
 * 
 * @param {Context} ctx - Convex context
 * @returns {string[]} Array of warning messages
 */
async function checkForRealData(ctx: any): Promise<string[]> {
  const warnings: string[] = [];
  
  const tables = [
    'betaSignups',
    'userProfiles', 
    'betaProgram',
    'frameworks',
    'frameworkUsage',
    'testimonials',
    'innovations',
    'innovationInteractions',
    'timeTracking'
  ];
  
  for (const tableName of tables) {
    try {
      const allRecords = await ctx.db.query(tableName as any).collect();
      const recordsWithoutFlag = allRecords.filter((record: any) => 
        record.isTestData !== true && record.isTestData !== false
      );
      
      if (recordsWithoutFlag.length > 0) {
        warnings.push(`${tableName}: ${recordsWithoutFlag.length} records without isTestData flag`);
      }
      
    } catch (error) {
      warnings.push(`${tableName}: Error checking for real data - ${error}`);
    }
  }
  
  return warnings;
}

/**
 * Create a test user with known credentials for QA testing.
 * 
 * This function creates a test user through the proper authentication flow
 * and marks all related records with isTestData: true for easy cleanup.
 * 
 * **Architecture Compliance:** Only calls Convex functions, no direct DB access.
 * 
 * @param {string} args.email - Test user email
 * @param {string} args.password - Test user password
 * @param {string} args.name - Test user display name
 * @param {string} [args.school] - Optional school name
 * @param {string} [args.subject] - Optional subject area
 * @param {boolean} args.isTestData - Must be true for test users
 * 
 * @returns {Object} Result with success status, userId, and credentials
 */
export const createTestUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    isTestData: v.boolean()
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.optional(v.string()),
    message: v.string(),
    credentials: v.optional(v.object({
      email: v.string(),
      password: v.string(),
      name: v.string()
    }))
  }),
  handler: async (ctx, args): Promise<{
    success: boolean;
    userId?: string;
    message: string;
    credentials?: {
      email: string;
      password: string;
      name: string;
    };
  }> => {
    try {
      // Validate that this is test data
      if (!args.isTestData) {
        return {
          success: false,
          message: "This function can only create test users (isTestData must be true)"
        };
      }

      console.log(`🧪 Creating test user: ${args.email}`);

      // Create beta signup first (required for user creation flow)
      const signupResult: any = await ctx.runMutation(api.betaSignup.signupForBeta, {
        email: args.email,
        name: args.name,
        school: args.school,
        subject: args.subject,
        isTestData: true
      });

      if (!signupResult.success) {
        return {
          success: false,
          message: `Failed to create beta signup: ${signupResult.message}`
        };
      }

      // Approve the signup and create user account
      const userResult: any = await ctx.runMutation(api.betaSignup.approveBetaSignup, {
        signupId: signupResult.signupId,
        temporaryPassword: args.password
      });

      if (!userResult.success) {
        return {
          success: false,
          message: `Failed to create user account: ${userResult.message}`
        };
      }

      console.log(`✅ Test user created successfully: ${args.email}`);

      return {
        success: true,
        userId: userResult.userId,
        message: "Test user created successfully",
        credentials: {
          email: args.email,
          password: args.password,
          name: args.name
        }
      };

    } catch (error) {
      console.error("Error creating test user:", error);
      return {
        success: false,
        message: `Failed to create test user: ${error}`
      };
    }
  }
});

/**
 * Get test user credentials for QA testing.
 * 
 * Retrieves credentials for test users created through the proper flow.
 * Only works for users with isTestData: true.
 * 
 * @param {string} args.email - Test user email
 * @returns {Object|null} Credentials object or null if not found
 */
export const getTestUserCredentials = query({
  args: { email: v.string() },
  returns: v.union(v.object({
    email: v.string(),
    name: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    userId: v.string(),
    isTestData: v.boolean()
  }), v.null()),
  handler: async (ctx, args): Promise<{
    email: string;
    name: string;
    school?: string;
    subject?: string;
    userId: string;
    isTestData: boolean;
  } | null> => {
    try {
      // Find beta signup by email
      const signup = await ctx.db
        .query("betaSignups")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (!signup || !signup.isTestData) {
        return null;
      }

      // Find user profile by email since signup doesn't have userId yet
      const profile = await ctx.db
        .query("userProfiles")
        .filter((q) => q.eq(q.field("authId"), signup.email))
        .first();

      if (!profile) {
        return null;
      }

      return {
        email: signup.email,
        name: signup.name || "Unknown",
        school: signup.school,
        subject: signup.subject,
        userId: profile.userId,
        isTestData: true
      };

    } catch (error) {
      console.error("Error getting test user credentials:", error);
      return null;
    }
  }
});

/**
 * List all test users for QA management.
 * 
 * @returns {Array} List of test user information
 */
export const listTestUsers = query({
  args: {},
  returns: v.array(v.object({
    email: v.string(),
    name: v.string(),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    userId: v.string(),
    signupDate: v.number(),
    status: v.string()
  })),
  handler: async (ctx): Promise<{
    email: string;
    name: string;
    school?: string;
    subject?: string;
    userId: string;
    signupDate: number;
    status: string;
  }[]> => {
    try {
      const testSignups = await ctx.db
        .query("betaSignups")
        .filter((q) => q.eq(q.field("isTestData"), true))
        .collect();

      const testUsers = [];

      for (const signup of testSignups) {
        // Find user profile by email since signup doesn't have userId yet
        const profile = await ctx.db
          .query("userProfiles")
          .filter((q) => q.eq(q.field("authId"), signup.email))
          .first();

        if (profile) {
          testUsers.push({
            email: signup.email,
            name: signup.name || "Unknown",
            school: signup.school,
            subject: signup.subject,
            userId: profile.userId,
            signupDate: signup.signupDate,
            status: signup.status
          });
        }
      }

      return testUsers;

    } catch (error) {
      console.error("Error listing test users:", error);
      return [];
    }
  }
});
