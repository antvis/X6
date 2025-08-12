---
title: Using UI Components
order: 6
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/advanced
---

Building a complex diagram editing application also requires UI components such as Menubar, Toolbar, Dropdown, ContextMenu, and Splitbox. We provide some of these React components in [x6-react-components](https://www.npmjs.com/package/@antv/x6-react-components), which can be used in conjunction with [antd](https://ant.design/).

## Installation

```shell
# npm
$ npm install @antv/x6-react-components --save

# yarn
$ yarn add @antv/x6-react-components
```

If you are including it directly via a `script` tag, you can use any of the following three CDNs, which will return the latest version of x6-react-components by default:

- https://unpkg.com/@antv/x6-react-components/dist/x6-react-components.js
- https://cdn.jsdelivr.net/npm/@antv/x6-react-components/dist/x6-react-components.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6-react-components/1.8.15/x6-react-components.js (does not support fetching the latest version)

For production environments, we recommend using a specific version number to avoid unexpected breakages caused by new versions:

- https://unpkg.com/@antv/x6-react-components@1.8.15/dist/x6-react-components.js
- https://cdn.jsdelivr.net/npm/@antv/x6-react-components@1.8.15/dist/x6-react-components.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6-react-components/1.8.15/x6-react-components.js

## Usage

Import the required components and their corresponding styles:

```ts
import { Menu } from '@antv/x6-react-components/es/menu'
// less
import '@antv/x6-react-components/es/menu/style'
// or css
import '@antv/x6-react-components/es/menu/style/index.css'
```

We strongly recommend using the [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) plugin to automatically import component styles. Add the following configuration in your `.babelrc` or babel-loader:

```js
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "@antv/x6-react-components",
        "libraryDirectory": "es", // es or lib
        "style": true,
        "transformToDefaultImport": true
      }
    ]
  ]
}
```

This way, when you import components, the corresponding styles will be automatically imported:

```ts
import { Menu } from '@antv/x6-react-components'
```

If you are using a `script` tag to include it, the usage is as follows:

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>X6-React-Components</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/@antv/x6-react-components/dist/index.css"
    />
  </head>
  <body>
    <div id="container"></div>
    <script src="babel.js"></script>
    <script src="react.js"></script>
    <script src="react-dom.js"></script>
    <script src="https://unpkg.com/@antv/x6-react-components/dist/x6-react-components.js"></script>
    <script type="text/babel">
      const Menu = X6ReactComponents.Menu
      const MenuItem = Menu.Item
      ReactDOM.render(
        <Menu>
          <MenuItem name="undo" hotkey="Cmd+Z" text="Undo" />
          <MenuItem name="redo" hotkey="Cmd+Shift+Z" text="Redo" />
        </Menu>,
        document.getElementById('container'),
      )
    </script>
  </body>
</html>
```

## Components

Click the links below to view the documentation for each component.

- [Menu](/en/docs/api/ui/menu) Menu
- [Dropdown](/en/docs/api/ui/dropdown) Dropdown Menu
- [ContextMenu](/en/docs/api/ui/contextmenu) Right-click Menu
- [Menubar](/en/docs/api/ui/menubar) Menu Bar
- [Toolbar](/en/docs/api/ui/toolbar) Toolbar
- [SplitBox](/en/docs/api/ui/splitbox) Split Container
- [ScrollBox](/en/docs/api/ui/scrollbox) Container with Custom Scrollbars
- [AutoScrollBox](/en/docs/api/ui/auto-scrollbox) Container that automatically adjusts and updates scrollbars based on content size
- [ColorPicker](/en/docs/api/ui/color-picker) Color Picker
