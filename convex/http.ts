/**
 * ✅ ACTIVE - Used in production
 * HTTP routes: Better Auth routes, populateSampleStandards endpoint
 */
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { internal } from "./_generated/api";

const http = httpRouter();

// CORS handling is required for client side frameworks
authComponent.registerRoutes(http, createAuth, { cors: true });

// Admin endpoint to populate sample standards (for beta testing)
// Call via: POST /populateSampleStandards
http.route({
  path: "/populateSampleStandards",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Call the internal action
    const result = await ctx.runAction(
      internal.populateStandards.populateSampleStandards,
      {}
    );
    
    return new Response(
      JSON.stringify({
        success: result.success,
        addedCount: result.addedCount,
        errors: result.errors,
        message: `Successfully added ${result.addedCount} standards to RAG.`,
      }),
      {
        status: result.success ? 200 : 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),
});

export default http;