import { defineConfig } from 'umi'

export default defineConfig({
  publicPath: './',
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/apps/dag', component: '@/pages/index' },
  ],
  theme: {
    '@ant-prefix': 'ant',
    '@menu-item-active-bg': '#f0f5ff',
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@antv/x6-react-components',
        libraryDirectory: 'es',
        transformToDefaultImport: false,
        style: true,
      },
    ],
  ],
})
