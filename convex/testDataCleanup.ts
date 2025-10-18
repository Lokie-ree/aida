import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

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
          record.isTestData !== true && record.isTestData !== false
        );
        
        realDataCounts[tableName] = realRecords.length;
        
        if (realRecords.length > 0) {
          warnings.push(`${tableName}: ${realRecords.length} records without isTestData flag (potential real data)`);
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
