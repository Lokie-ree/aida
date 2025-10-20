#!/usr/bin/env node

/**
 * Mark Production Data Script
 * 
 * This script marks existing production data with isTestData: false
 * to prevent accidental deletion during test cleanup.
 * 
 * Usage:
 *   node scripts/mark-production-data.js
 */

import { ConvexTestClient } from './test-utils.js';

const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://kindly-setter-935.convex.cloud";

async function markProductionData() {
  console.log("🏷️  Marking Production Data Script");
  console.log(`🔗 Convex URL: ${CONVEX_URL}`);
  
  const client = new ConvexTestClient(CONVEX_URL);
  
  try {
    console.log("🔍 Checking current database state...");
    const dbState = await client.query("testDataCleanup:getDatabaseState");
    
    console.log("\n📊 Current Database State:");
    console.log("=" .repeat(50));
    
    let totalRecords = 0;
    let recordsToMark = 0;
    
    Object.entries(dbState.totalCounts).forEach(([table, count]) => {
      const testCount = dbState.testDataCounts[table] || 0;
      const realCount = dbState.realDataCounts[table] || 0;
      
      console.log(`\n📋 ${table}:`);
      console.log(`   Total: ${count} records`);
      console.log(`   Test Data: ${testCount} records`);
      console.log(`   Real Data: ${realCount} records`);
      
      totalRecords += count;
      recordsToMark += realCount;
      
      if (realCount > 0) {
        console.log(`   ⚠️  ${realCount} records need isTestData: false flag`);
      }
    });
    
    console.log("\n" + "=" .repeat(50));
    console.log(`📈 Summary: ${totalRecords} total records, ${recordsToMark} need marking`);
    
    if (recordsToMark === 0) {
      console.log("✅ All records are already properly marked!");
      return;
    }
    
    console.log("\n⚠️  WARNING: This will modify production data!");
    console.log("💡 This script marks existing records with isTestData: false");
    console.log("🛡️  This prevents accidental deletion during test cleanup");
    
    // In a real implementation, you would add confirmation here
    console.log("\n🔧 IMPLEMENTATION NEEDED:");
    console.log("   Add confirmation prompt and update logic here");
    console.log("   This script is a template for marking production data");
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
markProductionData();
