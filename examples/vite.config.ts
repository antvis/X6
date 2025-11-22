import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@antv/x6-react-shape', '@antv/x6'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@antv/x6': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  server: {
    watch: {
      ignored: ['site'],
      usePolling: true,
    },
  },
})
