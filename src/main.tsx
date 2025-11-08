import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexReactClient } from "convex/react";
import {ConvexBetterAuthProvider} from "@convex-dev/better-auth/react";
import {authClient} from "@/lib/auth-client";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
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
