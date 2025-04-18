import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginPrettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import prettierConfig from './.prettierrc.cjs';

export default [
  {ignores: ['dist', 'node_modules', '*.config.*']},
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {jsx: true},
        sourceType: 'module',
      },
    },
    settings: {react: {version: '18.3'}},
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': 'off',
      'react/display-name': 'off',
      'prettier/prettier': ['warn', prettierConfig],
    },
  },
  ...pluginQuery.configs['flat/recommended'],
];
