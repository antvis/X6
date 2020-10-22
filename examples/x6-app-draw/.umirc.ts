import { IConfig } from 'umi-types'

// ref: https://umijs.org/config/
const config: IConfig = {
  publicPath: './',
  treeShaking: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: false,
        title: 'Draw',
        dll: false,
        routes: {
          exclude: [/components\//],
        },
      },
    ],
  ],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@antv/x6-react-components',
        transformToDefaultImport: false,
        style: true,
      },
    ],
  ],
}

export default config
