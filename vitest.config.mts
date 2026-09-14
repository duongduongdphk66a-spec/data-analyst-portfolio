import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    pool: 'threads',
    globals: true,
    exclude: ['**/node_modules/**', '**/tests/e2e/**', '**/.next/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './'),
    },
  },
});
