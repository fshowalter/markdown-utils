import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginSeparateTypeImports from "eslint-plugin-separate-type-imports";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/", "coverage/", "content/", "public/", "types/"],
  },
  eslint.configs.recommended,
  eslintPluginUnicorn.configs.unopinionated,
  eslintPluginSeparateTypeImports.configs.recommended,
  perfectionist.configs["recommended-natural"],
  tsEslint.configs.recommendedTypeChecked,
  {
    rules: {
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "off", // Turned off in favor of our custom rule
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
