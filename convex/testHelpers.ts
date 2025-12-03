/**
 * 🧪 TEST HELPERS - For testing only
 * Functions: addTestStandards, testAlignmentScorecard, getRecentAnalyses, testRAGSearch
 */
import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { authComponent } from "./auth";

async function getAuthUserId(ctx: any): Promise<string | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}

/**
 * Add sample Louisiana Standards to RAG for testing
 * 
 * DISABLED: populateStandards module removed during cleanup
 * TODO: Re-implement if standards population is needed
 */
// export const addTestStandards = action({
//   ... removed - populateStandards module deleted
// });

/**
 * Test the full Alignment Scorecard workflow with sample content
 * 
 * DISABLED: Alignment Scorecard and RAG modules removed during cleanup
 * TODO: Re-implement if alignment scorecard functionality is needed
 */
// export const testAlignmentScorecard = action({
//   ... removed - alignmentScorecard and rag modules deleted
// });

/**
 * Get recent alignment analyses for the current user
 * 
 * DISABLED: alignmentAnalyses table removed during cleanup
 * TODO: Re-implement if alignment analyses are needed
 */
// export const getRecentAnalyses = query({
//   ... removed - alignmentAnalyses table deleted
// });

/**
 * Test RAG search for standards (without full workflow)
 * 
 * DISABLED: alignmentSteps module removed during cleanup
 * TODO: Re-implement if RAG search testing is needed
 */
// export const testRAGSearch = action({
//   ... removed - alignmentSteps module deleted
// });

/**
 * Full integration test - populates standards and tests workflow
 * 
 * DISABLED: Depends on removed modules (populateStandards, alignmentScorecard)
 * TODO: Re-implement if integration testing is needed
 */
// export const fullIntegrationTest = action({
//   ... removed - depends on deleted modules
// });

