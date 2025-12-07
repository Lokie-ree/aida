import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";

// Validate createAuthClient is available
if (typeof createAuthClient !== 'function') {
  throw new Error(
    'createAuthClient is not a function. This may indicate a bundling issue with better-auth/react.'
  );
}

function sanitizeBaseUrl(raw?: string) {
  if (!raw) return undefined;
  const trimmed = raw.trim().replace(/\/+$/, ""); // remove trailing slash
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  // If protocol missing, assume https
  return `https://${trimmed}`;
}

// Get Convex Site URL from environment variable
// Fallback: derive from VITE_CONVEX_URL if VITE_CONVEX_SITE_URL is not set
let convexSiteUrl = sanitizeBaseUrl(import.meta.env.VITE_CONVEX_SITE_URL);

if (!convexSiteUrl) {
  const convexUrl = sanitizeBaseUrl(import.meta.env.VITE_CONVEX_URL);
  if (convexUrl) {
    // Derive site URL from Convex URL (replace .convex.cloud with .convex.site)
    convexSiteUrl = convexUrl.replace(/\.convex\.cloud$/, ".convex.site");
    console.warn(
      "VITE_CONVEX_SITE_URL not set, derived from VITE_CONVEX_URL:",
      convexSiteUrl
    );
  } else {
    console.error(
      "Neither VITE_CONVEX_SITE_URL nor VITE_CONVEX_URL is set. Please configure environment variables."
    );
    throw new Error(
      "Missing required environment variables. Please set VITE_CONVEX_SITE_URL or VITE_CONVEX_URL in your Vercel environment variables."
    );
  }
}

// Create auth client with error handling
let authClient;
try {
  console.info("Initializing Better Auth client with baseURL:", convexSiteUrl, "page:", typeof window !== "undefined" ? window.location.origin : "ssr");
  authClient = createAuthClient({
    baseURL: convexSiteUrl,
    plugins: [
      convexClient(),
      crossDomainClient(),
      magicLinkClient(),
    ],
  });
  
  // Validate the client was created successfully
  if (!authClient || typeof authClient !== 'object') {
    throw new Error('Failed to create auth client');
  }
} catch (error) {
  console.error('Error creating auth client:', error);
  throw new Error(
    `Failed to initialize Better Auth client: ${error instanceof Error ? error.message : String(error)}`
  );
}

export { authClient };
