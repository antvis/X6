import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setup-env.ts', './__tests__/utils/useSnapshotMatchers.ts'],
    restoreMocks: true,
    clearMocks: true,
    reporters: ['default'],
    snapshotFormat: { escapeString: false, printBasicPrototype: false },
    testTimeout: 20_000,
    hookTimeout: 20_000,
    include: ['__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})
