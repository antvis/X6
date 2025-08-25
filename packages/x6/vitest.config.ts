import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // environment: 'jsdom',
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      // at least one instance is required
      instances: [{ browser: 'chromium' }],
    },
    globals: true,
    setupFiles: ['./setup-env.ts', './__tests__/utils/useSnapshotMatchers.ts'],
    restoreMocks: true,
    clearMocks: true,
    reporters: ['default'],
    snapshotFormat: { escapeString: false, printBasicPrototype: false },
    testTimeout: 20_000,
    hookTimeout: 20_000,
    include: ['__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    // include: ['__tests__/graph/graph.spec.ts'],
  },
})
