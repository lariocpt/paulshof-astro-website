import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import prettier from 'eslint-config-prettier/flat';

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.agents/**',
      '.claude/**',
      '.codex/**',
      '.husky/_/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.bun },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  // Prettier owns formatting; ESLint owns code quality. Keep this last.
  prettier,
];
