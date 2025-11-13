import { v } from "convex/values";
import { query, action } from "./_generated/server";
import { authComponent } from "./auth";
import { components, internal } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";
import { workflow } from "./workflows";

/**
 * Helper function to get the authenticated user ID
 * Returns the user's _id if authenticated, null otherwise
 */
async function getAuthUserId(ctx: any): Promise<string | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}

// Initialize RAG with comprehensive filters for standards
const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  embeddingDimension: 1536,
  filterNames: [
    "contentType",      // "louisiana_standard", "framework", "user_content"
    "subject",          // "ela", "math", "science", "social_studies"
    "gradeLevel",       // "K", "1", "2", ... "12"
    "standardCode",     // Parsed standard identifier
    "cognitiveDepth",   // "recall", "application", "synthesis"
    "userId",           // For user-specific content
      ],
    });

// Export RAG instance for use in other files
export { rag };

/**
 * Public API: Analyze content alignment against Louisiana Standards
 * 
 * Starts a workflow to analyze AI-generated content (quiz, lesson plan, etc.)
 * against Louisiana Student Standards and returns a workflow ID for status tracking.
 */
export const analyzeContentAlignment = action({
  args: {
    content: v.string(),
    gradeLevel: v.string(),
    subject: v.union(
      v.literal("ela"),
      v.literal("math"),
      v.literal("science"),
      v.literal("social_studies")
    ),
    standardCodes: v.optional(v.array(v.string())),
  },
  returns: v.object({
    workflowId: v.string(),
  }),
  handler: async (ctx, args): Promise<{ workflowId: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Start the workflow
    const workflowId = await workflow.start(
      ctx,
      internal.alignmentScorecard.analyzeContentAlignment,
      {
        userId,
        ...args,
      }
    );

    return { workflowId: workflowId as string };
  },
});

/**
 * Public API: Get workflow status for alignment analysis
 * 
 * Allows frontend to reactively subscribe to workflow progress
 */
export const getAlignmentStatus = query({
  args: { workflowId: v.string() },
  handler: async (ctx, args) => {
    return await workflow.status(ctx, args.workflowId as any);
  },
});
