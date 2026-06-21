import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".next", "node_modules", "coverage", "next-env.d.ts"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
      eslintConfigPrettier,
    ],
    plugins: {
      "@next/next": nextPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Canonical Next.js patterns that the newest react-hooks rules over-flag:
      "react-hooks/refs": "off", // per-request store ref in StoreProvider
      "react-hooks/set-state-in-effect": "off", // post-mount hydration (theme/redux)
      // next-intl t.rich passes render callbacks that are not real components.
      "react/display-name": "off",
    },
  },
  {
    // Test mocks intentionally use plain <img> to stub next/image.
    files: ["**/*.test.{ts,tsx}", "src/test-utils.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);
