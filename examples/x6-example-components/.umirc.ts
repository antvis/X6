import { IConfig } from "umi-types"

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  /**
   * 调试时直接引用了 packages/x6-components 中的样式文件，
   * 所以需要禁用 css modules
   */
  disableCSSModules: true,
  plugins: [
    [
      "umi-plugin-react",
      {
        antd: true,
        dva: false,
        dynamicImport: false,
        title: "x6 Components",
        dll: false,
        routes: {
          exclude: [/components\//]
        }
      }
    ]
  ],
  extraBabelPlugins: [
    [
      "import",
      {
        libraryName: "@antv/x6-components",
        libraryDirectory: "es",
        transformToDefaultImport: false,
        style: true
      }
    ]
  ],
}

export default config
