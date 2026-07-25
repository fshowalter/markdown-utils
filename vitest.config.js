import process from "node:process";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.js"],
      provider: "v8",
    },
    globals: true, // needed for testing-library teardown
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/**/*.test.js"],
          name: "node",
        },
      },
    ],
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
  },
});
