---
title: 使用 UI 组件
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/advanced
---

搭建一个复杂的图编辑应用还需要用到 Menubar、Toolbar、Dropdown、ContextMenu、Splitbox 等 UI 组件，我们在 [x6-components](https://www.npmjs.com/package/@antv/x6-components) 中提供了一些这样的 React 组件，可以搭配 [antd](https://ant.design/) 使用。

## 安装

```shell
# npm
$ npm install @antv/x6-components --save

# yarn
$ yarn add @antv/x6-components
```

## 使用

引入需要的组件和对应的样式：

```ts
import { Menu } from '@antv/x6-components/es/menu'
// less
import '@antv/x6-components/es/menu/style'
// or css
import '@antv/x6-components/es/menu/style/index.css'
```

我们强烈建议使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 插件来自动引用组件样式，在 `.babelrc` 或 babel-loader 中添加如下配置：

```js
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "@antv/x6-components",
        "libraryDirectory": "es", // es or lib
        "style": true,
        "transformToDefaultImport": true
      }
    ]
  ]
}
```

这样我们引入组件时就会自动引入对应的样式：

```ts
import { Menu } from '@antv/x6-components'
```

## 组件

点击下面链接查看每个组件的使用文档。

- [Menu](../../api/ui/menu) 菜单
- [Dropdown](../../api/ui/dropdown) 下拉菜单
- [ContextMenu](../../api/ui/contextmenu) 右键菜单
- [Menubar](../../api/ui/menubar) 菜单栏
- [Toolbar](../../api/ui/toolbar) 工具栏
- [SplitBox](../../api/ui/splitbox) 分割容器
- [ScrollBox](../../api/ui/scrollbox) 自定义滚动条的容器
- [AutoScrollBox](../../api/ui/auto-scrollbox) 自动根据内容大小设置和更新容器的滚动条
- [ColorPicker](../../api/ui/color-picker) 颜色选择器
