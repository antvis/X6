import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: './',

  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/apps/svg-to-shape', component: '@/pages/index' },
  ],
})
