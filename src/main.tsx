import React, { startTransition } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { ConvexReactClient } from "convex/react";
import {ConvexBetterAuthProvider} from "@convex-dev/better-auth/react";
import {authClient} from "@/lib/auth-client";

// Validate environment variable
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error(
    "VITE_CONVEX_URL is not set. Please configure it in your environment variables."
  );
  throw new Error(
    "Missing required environment variable: VITE_CONVEX_URL. Please check your Vercel environment variables."
  );
}

// Create Convex client with optimized settings
const convex = new ConvexReactClient(convexUrl, {
  // Allow unauthenticated mutations (like beta signup) while still requiring auth for protected queries
  expectAuth: false,
  verbose: false, // Disable verbose logging in production for better performance
  // Use WebSocket for real-time updates, but don't block initial render
  unsavedChangesWarning: false,
});

// Defer Convex connection initialization to improve initial page load
// The connection will be established after the initial render
startTransition(() => {
  // Connection is lazy - it will be established when first query/mutation is called
  // This allows the page to render before establishing the WebSocket connection
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <App />
      </ConvexBetterAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
