import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    setupFiles: ['./src/test-setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js', 'src/test-setup.js'],
      reporter: ['text'],
    },
  },
});
