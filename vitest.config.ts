import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // `server-only` throws outside RSC; stub it so server modules are testable.
      "server-only": fileURLToPath(
        new URL("./test/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test-utils.tsx",
        "src/setupTests.ts",
        "src/**/*.d.ts",
        "src/types/**",
        "src/interfaces/**",
        "src/i18n/**",
        "src/proxy.ts",
        // Route-entry composition (integration, exercised by `next build`/e2e):
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
        "src/app/**/not-found.tsx",
        "src/app/StoreProvider.tsx",
      ],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
