/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  // parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['svelte3', '@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  rules: {
    'global-require': 0,
    'import/no-extraneous-dependencies': 0,
  },
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
};
