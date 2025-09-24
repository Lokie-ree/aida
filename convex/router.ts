import { httpRouter } from "convex/server";
import { webhook as vapiWebhook } from "./vapi";

const http = httpRouter();

// Vapi webhook endpoint
http.route({
  path: "/api/vapi/webhook",
  method: "POST",
  handler: vapiWebhook,
});

export default http;
