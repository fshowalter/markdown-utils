/// <reference types="vitest/config" />

export default {
  test: {
    coverage: {
      include: ["src/**/*.{ts,js}"],
      provider: "v8",
    },
    globals: true, // needed for testing-library teardown
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/**/*.spec.ts"],
          name: "node",
        },
      },
    ],
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
  },
};
