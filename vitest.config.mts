import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { 
      deps: { inline: ["convex-test"] } 
    },
    globals: true,
    // Explicitly include only Convex backend tests
    include: ["convex/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Exclude E2E tests (they use browser environment)
    exclude: ["tests/e2e/**/*", "node_modules/**/*", "dist/**/*"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["convex/**/*.ts"],
      exclude: [
        "convex/**/*.test.ts",
        "convex/_generated/**",
        "convex/schema.ts",
      // Exclude non-runtime/helper or config modules from coverage
      "convex/convex.config.ts",
      "convex/router.ts",
      "convex/http.ts",
      "convex/seedFrameworks.ts",
      "convex/emailEvents.ts",
      "convex/rag.ts",
      "convex/vapi.ts",
      // External integration glue; covered via higher-level tests
      "convex/auth.ts",
      "convex/auth.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/tests": path.resolve(__dirname, "./tests"),
    },
  },
});

