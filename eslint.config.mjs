import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Custom rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow require in tests and config
      '@typescript-eslint/triple-slash-reference': 'off', // Allow in next-env.d.ts
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '.vercel/**',
      '*.config.js',
      '*.config.ts',
      'next-env.d.ts', // Generated file
      '.lighthouseci/**',
      '.husky/**',
    ],
  },
];

export default eslintConfig;
