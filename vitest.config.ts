import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "bangla-kit": new URL("./packages/core/src/index.ts", import.meta.url).pathname },
  },
  test: {
    include: ["packages/*/test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**/*.ts"],
      exclude: ["packages/mcp/src/cli.ts"],
      reporter: ["text", "lcov", "json-summary"],
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
  },
});
