import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.stylisticTypeChecked,
    ...tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ),
  {
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },
  {
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "no-alert": "warn",
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    ignores: [
      "docs/**/*",
      "**/dist",
      "**/coverage",
      "**/eslint.config.js",
      ".github",
      ".vscode",
      ".yarn",
      "vitest.config.ts",
      "vitest.workspace.ts",
      "**/migrations",
      "packages/keycloakify/**/*",
      "**/*.js",
      "**/tailwind.config.js",
      "**/vite.config.ts",
      "**/postcss.config.js",
      "**/lib/api-client/**/*",
      "apps/**/vitest.config.*ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-extraneous-class": "off",
    },
    files: ["**/*.module.ts"],
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  eslintConfigPrettier,
];
