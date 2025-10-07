import { createRoot } from "react-dom/client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
  // Optionally pause queries until the user is authenticated
  // Set to false for now since we have public landing page
  expectAuth: false,
});

createRoot(document.getElementById("root")!).render(
  <ConvexBetterAuthProvider client={convex} authClient={authClient}>
    <App />
  </ConvexBetterAuthProvider>,
);
