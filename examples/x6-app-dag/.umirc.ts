import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: './',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  theme: {
    '@ant-prefix': 'ant',
    '@menu-item-active-bg': '#f0f5ff',
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@antv/x6-components',
        libraryDirectory: 'es',
        transformToDefaultImport: false,
        style: true,
      },
    ],
  ],
});
