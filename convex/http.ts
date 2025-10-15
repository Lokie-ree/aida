import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { httpAction } from "./_generated/server";
import { resend } from "./email";
import { webhook as vapiWebhook } from "./vapi";
import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "./_generated/dataModel";

const http = httpRouter();

// Register Better Auth route handlers with CORS for client-side frameworks
authComponent.registerRoutes(http, createAuth, { cors: true });

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
