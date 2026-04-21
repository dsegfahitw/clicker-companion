import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Standalone Vitest config — kept separate from vite.config.ts to avoid
// the TanStack Start / Cloudflare SSR plugins running inside the test env.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/game/**", "src/components/game/**"],
      exclude: ["**/*.test.*", "**/__tests__/**", "src/test/**"],
    },
  },
});
