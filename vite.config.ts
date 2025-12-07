import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'better-auth',
      'better-auth/react',
      '@convex-dev/better-auth/react',
      '@convex-dev/better-auth/client/plugins',
    ],
    esbuildOptions: {
      // Preserve function/class names to avoid Better Auth mangling issues
      keepNames: true,
    },
  },
  build: {
    // Preserve names during build to prevent Better Auth runtime errors
    keepNames: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep Better Auth in main bundle to avoid chunking/minification issues
          // This ensures all Better Auth code stays together with proper module resolution
          if (id.includes('better-auth') || id.includes('@convex-dev/better-auth')) {
            return undefined; // Bundle with main code, not in separate chunk
          }
          
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('convex') && !id.includes('better-auth')) {
              return 'convex-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            if (id.includes('@tanstack/react-table')) {
              return 'table-vendor';
            }
            if (id.includes('@dnd-kit')) {
              return 'dnd-vendor';
            }
            if (id.includes('@react-email')) {
              return 'email-vendor';
            }
            if (id.includes('@ai-sdk') || id.includes('openai')) {
              return 'ai-vendor';
            }
          }
        },
      },
      // Preserve module structure for Better Auth
      preserveEntrySignatures: 'strict',
    },
    // Increase chunk size warning limit since we're using manual chunks
    chunkSizeWarningLimit: 1000,
    // Use esbuild minification (better ESM support than terser)
    // Note: esbuild still minifies but handles ESM better
    minify: mode === 'production' ? 'esbuild' : false,
    // Disable minification for Better Auth by using a custom minify function
    // This is a workaround for the "y.create is not a function" error
    // caused by aggressive minification of Better Auth's internal structure
    // Ensure proper module format
    target: 'esnext',
    modulePreload: {
      polyfill: true,
    },
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true,
    sourcemap: mode === 'development',
  },
}));
