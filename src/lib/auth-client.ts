import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";

// Get Convex Site URL from environment variable
// Fallback: derive from VITE_CONVEX_URL if VITE_CONVEX_SITE_URL is not set
let convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

if (!convexSiteUrl) {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
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

export const authClient = createAuthClient({
  baseURL: convexSiteUrl,
  plugins: [
    convexClient(),
    crossDomainClient(),
    magicLinkClient(),
  ],
});
