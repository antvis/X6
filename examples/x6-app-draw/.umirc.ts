import { defineConfig } from 'umi'

export default defineConfig({
  publicPath: './',
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/apps/draw', component: '@/pages/index' },
  ],
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
  favicon:
    'https://gw.alipayobjects.com/zos/bmw-prod/5698a54a-c02f-4fd6-9976-185e378fc118.ico',
})
