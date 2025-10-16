import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { httpAction } from "./_generated/server";
import { resend } from "./email";
import { webhook as vapiWebhook } from "./vapi";

const http = httpRouter();

// Register Better Auth route handlers manually
console.log("Registering Better Auth routes...");
try {
  // Register individual auth routes manually
  http.route({
    path: "/api/auth/session",
    method: "GET",
    handler: httpAction(async (ctx, req) => {
      const auth = createAuth(ctx);
      const result = await auth.api.getSession({
        headers: req.headers,
      });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
      });
    }),
  });

  http.route({
    path: "/api/auth/sign-up/email",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
      const auth = createAuth(ctx);
      const body = await req.json();
      const result = await auth.api.signUpEmail({
        body,
        headers: req.headers,
      });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
      });
    }),
  });

  http.route({
    path: "/api/auth/sign-in/email",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
      const auth = createAuth(ctx);
      const body = await req.json();
      const result = await auth.api.signInEmail({
        body,
        headers: req.headers,
      });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
      });
    }),
  });

  http.route({
    path: "/api/auth/sign-out",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
      try {
        const auth = createAuth(ctx);
        const result = await auth.api.signOut({
          headers: req.headers,
        });
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          },
        });
      } catch (error) {
        // Handle case where there's no session to sign out
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("Failed to get session") || errorMessage.includes("No session found")) {
          return new Response(JSON.stringify({ success: true, message: "No active session to sign out" }), {
            status: 200,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            },
          });
        }
        
        // Re-throw other errors
        throw error;
      }
    }),
  });

  console.log("Better Auth routes registered successfully");
} catch (error) {
  console.error("Error registering Better Auth routes:", error);
}

// Vapi webhook endpoint
http.route({
  path: "/api/vapi/webhook",
  method: "POST",
  handler: vapiWebhook,
});

// Add Resend webhook route
http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req);
  }),
});

export default http;
