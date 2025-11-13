import { httpRouter } from "convex/server";
// TODO: Re-enable when vapi.ts webhook is implemented
// import { webhook as vapiWebhook } from "./vapi";

const http = httpRouter();

// Vapi webhook endpoint
// TODO: Uncomment when vapi.ts webhook is implemented
// http.route({
//   path: "/api/vapi/webhook",
//   method: "POST",
//   handler: vapiWebhook,
// });

export default http;
