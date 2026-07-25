import eslint from "@eslint/js";
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
      //
      // AIDEV-NOTE: node:test's describe/it return promises that are not meant to be
      // awaited, so every test in the suite would otherwise trip no-floating-promises.
      // allowForKnownSafeCalls is the rule's own option for this case -- it narrows the
      // exemption to those two imports from node:test, so a genuinely floating promise
      // anywhere else (including inside a test body) is still an error.
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          allowForKnownSafeCalls: [
            { from: "package", name: ["describe", "it"], package: "node:test" },
          ],
        },
      ],
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
);
