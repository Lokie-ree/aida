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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-progress',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          'animation-vendor': ['framer-motion'],
          'convex-vendor': ['convex', '@convex-dev/better-auth', '@convex-dev/rag', '@convex-dev/resend'],
          'auth-vendor': [
            'better-auth',
            'better-auth/react',
            'better-auth/client/plugins',
            '@convex-dev/better-auth/react',
            '@convex-dev/better-auth/client/plugins',
          ],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'chart-vendor': ['recharts'],
          'table-vendor': ['@tanstack/react-table'],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/modifiers', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'email-vendor': ['@react-email/components', '@react-email/render'],
          'ai-vendor': ['@ai-sdk/openai', 'openai'],
        },
      },
    },
    // Increase chunk size warning limit since we're using manual chunks
    chunkSizeWarningLimit: 1000,
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        // Preserve function names for Better Auth to prevent "a.create is not a function" errors
        keep_fnames: true,
      },
      mangle: {
        // Preserve class names and function names for Better Auth
        keep_fnames: true,
        keep_classnames: true,
      },
    },
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true,
    sourcemap: mode === 'development',
  },
}));
