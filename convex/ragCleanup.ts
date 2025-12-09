/**
 * RAG Cleanup Utilities
 *
 * Functions to clear RAG namespaces before re-ingestion.
 * This ensures clean, duplicate-free data.
 *
 * IMPORTANT: Must delete all entries before deleting namespace.
 */
import { action } from "./_generated/server";
import { components } from "./_generated/api";
import { rag } from "./rag";

/**
 * All namespaces used by Pelican AI RAG
 */
const ALL_NAMESPACES = {
  standards: [
    "louisiana_standards_ela",
    "louisiana_standards_math",
    "louisiana_standards_science",
    "louisiana_standards_social_studies",
  ],
  rubric: [
    "louisiana_rubric_system",
    "louisiana_rubric_instruction",
    "louisiana_rubric_planning",
    "louisiana_rubric_environment",
    "louisiana_rubric_professionalism",
    "louisiana_rubric_coaching",
  ],
};

/**
 * Helper to get all existing namespaces from RAG
 */
async function getAllExistingNamespaces(ctx: any) {
  const namespaces: Array<{
    namespace: string;
    namespaceId: string;
    status: "pending" | "ready" | "replaced";
  }> = [];

  // Get ready namespaces
  let cursor: string | null = null;
  let isDone = false;
  
  while (!isDone) {
    const result: {
      page: Array<{
        namespace: string;
        namespaceId: string;
        status: "pending" | "ready" | "replaced";
      }>;
      continueCursor: string;
      isDone: boolean;
    } = await ctx.runQuery(components.rag.namespaces.list, {
      paginationOpts: { cursor, numItems: 100 },
      status: "ready",
    });
    
    namespaces.push(...result.page.map((ns) => ({
      namespace: ns.namespace,
      namespaceId: ns.namespaceId,
      status: ns.status,
    })));
    
    cursor = result.continueCursor;
    isDone = result.isDone;
  }

  // Also get pending namespaces
  cursor = null;
  isDone = false;
  
  while (!isDone) {
    const result: {
      page: Array<{
        namespace: string;
        namespaceId: string;
        status: "pending" | "ready" | "replaced";
      }>;
      continueCursor: string;
      isDone: boolean;
    } = await ctx.runQuery(components.rag.namespaces.list, {
      paginationOpts: { cursor, numItems: 100 },
      status: "pending",
    });
    
    namespaces.push(...result.page.map((ns) => ({
      namespace: ns.namespace,
      namespaceId: ns.namespaceId,
      status: ns.status,
    })));
    
    cursor = result.continueCursor;
    isDone = result.isDone;
  }

  return namespaces;
}

/**
 * Helper to delete all entries in a namespace
 */
async function deleteAllEntriesInNamespace(
  ctx: any,
  namespaceId: string
): Promise<{ entriesDeleted: number; errors: string[] }> {
  let entriesDeleted = 0;
  const errors: string[] = [];
  let isDone = false;

  // Keep deleting until no more entries
  while (!isDone) {
    // List entries in this namespace
    const result = await rag.list(ctx, {
      namespaceId: namespaceId as any,
      limit: 100,
      order: "desc",
      status: "ready",
    });

    // Delete each entry
    for (const entry of result.page) {
      try {
        await rag.delete(ctx, { entryId: entry.entryId });
        entriesDeleted++;
      } catch (error) {
        errors.push(`Entry ${entry.entryId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    isDone = result.isDone;
  }

  return { entriesDeleted, errors };
}

/**
 * Clear all RAG namespaces (full reset)
 *
 * Use before a fresh ingestion to avoid duplicates.
 * Properly deletes all entries first, then the namespace.
 */
export const clearAllNamespaces = action({
  args: {},
  handler: async (ctx) => {
    const results: Array<{
      namespace: string;
      status: "deleted" | "not_found" | "error";
      entriesDeleted?: number;
      error?: string;
    }> = [];
    const targetNamespaces = [...ALL_NAMESPACES.standards, ...ALL_NAMESPACES.rubric];

    // Get all existing namespaces
    const existingNamespaces = await getAllExistingNamespaces(ctx);

    for (const targetNs of targetNamespaces) {
      const existing = existingNamespaces.find(ns => ns.namespace === targetNs);

      if (existing) {
        try {
          // Step 1: Delete all entries first
          const { entriesDeleted, errors: entryErrors } = await deleteAllEntriesInNamespace(
            ctx,
            existing.namespaceId
          );

          if (entryErrors.length > 0) {
            console.warn(`Warnings deleting entries in ${targetNs}:`, entryErrors);
          }

          // Step 2: Now delete the namespace
          await ctx.runMutation(components.rag.namespaces.deleteNamespace, {
            namespaceId: existing.namespaceId,
          });

          results.push({ namespace: targetNs, status: "deleted", entriesDeleted });
        } catch (error) {
          results.push({
            namespace: targetNs,
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      } else {
        results.push({ namespace: targetNs, status: "not_found" });
      }
    }

    const deleted = results.filter((r) => r.status === "deleted").length;
    const notFound = results.filter((r) => r.status === "not_found").length;
    const errors = results.filter((r) => r.status === "error").length;
    const totalEntriesDeleted = results.reduce((sum, r) => sum + (r.entriesDeleted || 0), 0);

    return {
      summary: {
        deleted,
        notFound,
        errors,
        total: targetNamespaces.length,
        totalEntriesDeleted,
      },
      details: results,
    };
  },
});

/**
 * Clear only standards namespaces
 */
export const clearStandardsNamespaces = action({
  args: {},
  handler: async (ctx) => {
    const results: Array<{
      namespace: string;
      status: "deleted" | "not_found" | "error";
      entriesDeleted?: number;
      error?: string;
    }> = [];

    const existingNamespaces = await getAllExistingNamespaces(ctx);

    for (const targetNs of ALL_NAMESPACES.standards) {
      const existing = existingNamespaces.find(ns => ns.namespace === targetNs);

      if (existing) {
        try {
          const { entriesDeleted } = await deleteAllEntriesInNamespace(ctx, existing.namespaceId);
          await ctx.runMutation(components.rag.namespaces.deleteNamespace, {
            namespaceId: existing.namespaceId,
          });
          results.push({ namespace: targetNs, status: "deleted", entriesDeleted });
        } catch (error) {
          results.push({
            namespace: targetNs,
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      } else {
        results.push({ namespace: targetNs, status: "not_found" });
      }
    }

    return { results };
  },
});

/**
 * Clear only rubric namespaces (includes coaching)
 */
export const clearRubricNamespaces = action({
  args: {},
  handler: async (ctx) => {
    const results: Array<{
      namespace: string;
      status: "deleted" | "not_found" | "error";
      entriesDeleted?: number;
      error?: string;
    }> = [];

    const existingNamespaces = await getAllExistingNamespaces(ctx);

    for (const targetNs of ALL_NAMESPACES.rubric) {
      const existing = existingNamespaces.find(ns => ns.namespace === targetNs);

      if (existing) {
        try {
          const { entriesDeleted } = await deleteAllEntriesInNamespace(ctx, existing.namespaceId);
          await ctx.runMutation(components.rag.namespaces.deleteNamespace, {
            namespaceId: existing.namespaceId,
          });
          results.push({ namespace: targetNs, status: "deleted", entriesDeleted });
        } catch (error) {
          results.push({
            namespace: targetNs,
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      } else {
        results.push({ namespace: targetNs, status: "not_found" });
      }
    }

    return { results };
  },
});

/**
 * List all RAG namespaces and their status
 */
export const listNamespaces = action({
  args: {},
  handler: async (ctx) => {
    const targetNamespaces = [...ALL_NAMESPACES.standards, ...ALL_NAMESPACES.rubric];
    const existingNamespaces = await getAllExistingNamespaces(ctx);
    
    const results = targetNamespaces.map(targetNs => {
      const existing = existingNamespaces.find(ns => ns.namespace === targetNs);
      return {
        namespace: targetNs,
        exists: !!existing,
        status: existing?.status,
        namespaceId: existing?.namespaceId,
      };
    });

    return {
      namespaces: results,
      existingCount: results.filter((r) => r.exists).length,
      totalExpected: targetNamespaces.length,
      // Also include any unexpected namespaces
      unexpectedNamespaces: existingNamespaces
        .filter(ns => !targetNamespaces.includes(ns.namespace))
        .map(ns => ns.namespace),
    };
  },
});
