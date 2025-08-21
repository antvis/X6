import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setup-env.ts'],
    restoreMocks: true,
    clearMocks: true,
    fakeTimers: {
      toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame'],
    },
    reporters: ['default'],
    snapshotFormat: { escapeString: false, printBasicPrototype: false },
    testTimeout: 20_000,
    hookTimeout: 20_000,
    include: ['__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})
