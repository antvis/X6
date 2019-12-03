import fs from 'fs'
import path from 'path'
import lessToJs from 'less-vars-to-js'
import { IConfig } from 'umi-types'

const getVariables = (filename: string) => {
  const content = fs.readFileSync(
    path.join(__dirname, `./src/style/${filename}`),
    'utf8'
  )
  return lessToJs(content)
}

const theme = {
  ...getVariables('antd/12px.less'),
}

const config: IConfig = {
  theme,
  treeShaking: true,
  disableCSSModules: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: false,
        dll: false,
        title: 'x6',

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
        libraryName: '@antv/x6-components',
        libraryDirectory: 'es',
        transformToDefaultImport: false,
        style: true,
      },
    ],
  ],
}

export default config
