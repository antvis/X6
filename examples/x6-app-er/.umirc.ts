import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: './',
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/apps/er', component: '@/pages/index' },
  ],
});
