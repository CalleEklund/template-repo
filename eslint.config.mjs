import pluginJs from "@eslint/js";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import pluginPrettier from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";
import pluginReact from "eslint-plugin-react";
import pluginReachtHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import pluginTypescript from "typescript-eslint";

/** @type {import('eslint').Linter.Config[] } **/
export default [
  {
    ignores: ["**/dist", "**/vite.config.ts", "**/api-client/**/types.ts"],
  },

  pluginJs.configs.recommended,

  {
    rules: {
      "no-console": "warn",
    },
  },

  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  ...pluginTypescript.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: pluginReact,
      "react-refresh": pluginReactRefresh,
      "tanstack-query": tanstackQuery,
      "reaect-hooks": pluginReachtHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      ...pluginReact.configs.flat["recommended"].rules,
      ...pluginReact.configs.flat["jsx-runtime"].rules,
      "react-refresh/only-export-components": "warn",
    },
  },

  {
    files: ["**/*spec.ts"],
    ...pluginJest.configs["flat/recommended"],
    ...pluginJest.configs["flat/style"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...pluginJest.configs["flat/recommended"].rules,
      ...pluginJest.configs["flat/style"].rules,
    },
  },

  pluginPrettier,
];
