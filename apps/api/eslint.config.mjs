import pluginJs from '@eslint/js';
import pluginTypescript from 'typescript-eslint';
import pluginPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[] } **/
export default [
  {
    ignores: ['**/dist'],
  },

  pluginJs.configs.recommended,

  {
    rules: {
      'no-console': 'warn',
    },
  },

  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  ...pluginTypescript.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-refresh': pluginReactRefresh,
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
      ...pluginReact.configs.flat['recommended'].rules,
      ...pluginReact.configs.flat['jsx-runtime'].rules,
      'react-refresh/only-export-components': 'warn',
    },
  },

  pluginPrettier,
];
