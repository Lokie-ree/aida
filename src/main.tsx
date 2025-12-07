import React from "react";
import ReactDOM from "react-dom/client";
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

const convex = new ConvexReactClient(convexUrl, {
  // Allow unauthenticated mutations (like beta signup) while still requiring auth for protected queries
  expectAuth: false,
  verbose: true,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <App />
    </ConvexBetterAuthProvider>
  </React.StrictMode>
);
