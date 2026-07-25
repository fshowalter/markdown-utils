import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/", "coverage/", "content/", "public/", "types/"],
  },
  eslint.configs.recommended,
  eslintPluginUnicorn.configs.unopinionated,
  perfectionist.configs["recommended-natural"],
  tsEslint.configs.recommendedTypeChecked,
  {
    rules: {
      // AIDEV-NOTE: The TypeScript-syntax rules that used to live here (array-type,
      // consistent-type-definitions, consistent-type-imports, and the
      // separate-type-imports plugin) are gone: there is no TypeScript syntax left for
      // them to act on. Types now live in JSDoc, which typescript-eslint does not lint.
      // The type-aware rules from recommendedTypeChecked still apply -- they work on .js
      // under checkJs, and no-unsafe-* matters more now, not less.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "no relative imports outside current folder",
            },
          ],
        },
      ],
      "unicorn/no-array-reverse": "off",
      "unicorn/no-top-level-side-effects": "off",
      "unicorn/prefer-await": "off",
      "unicorn/prefer-minimal-ternary": "off",
      "unicorn/prefer-number-coercion": "off",
      "unicorn/require-array-sort-compare": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    files: ["src/**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
);
