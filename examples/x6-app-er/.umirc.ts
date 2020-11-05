import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: './',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/apps/er', component: '@/pages/index' },
  ],
});
