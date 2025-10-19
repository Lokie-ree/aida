import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Register Better Auth route handlers using the official method
console.log("Registering Better Auth routes...");
try {
  // Use authComponent.registerRoutes() as per official documentation
  authComponent.registerRoutes(http, createAuth, { cors: true });
  console.log("✅ Better Auth routes registered successfully");
} catch (error) {
  console.error("❌ Failed to register Better Auth routes:", error);
}

// Register Resend webhook for email events
http.route({
  path: "/api/webhooks/resend",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.text();
    console.log("Resend webhook received:", body);
    return new Response("OK", { status: 200 });
  }),
});

// Register Vapi webhook for voice events
http.route({
  path: "/api/webhooks/vapi",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.text();
    console.log("Vapi webhook received:", body);
    return new Response("OK", { status: 200 });
  }),
});

export default http;