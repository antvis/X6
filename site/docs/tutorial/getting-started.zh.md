---
title: 快速上手
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
---

## 安装

通过 npm 或 yarn 命令安装 X6。

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

如果使用 `umd` 包，可以使用下面三个 CDN 中的任何一个，默认使用 X6 的最新版：

- https://unpkg.com/@antv/x6/dist/index.js
- https://cdn.jsdelivr.net/npm/@antv/x6/dist/index.js
- https://cdnjs.cloudflare.com/ajax/libs/antv-x6/2.0.0/index.js

## 开始使用

在开始之前，推荐先学习 [SVG 基础知识](https://codepen.io/HunorMarton/full/PoGbgqj)，在有一些基础 SVG 知识储备下，我们以一个简单的例子开始体验 X6。

### 1. 初始化画布

在页面中创建一个画布容器，然后初始化画布对象，可以通过配置设置画布的样式，比如背景颜色。

```html
<div id="container"></div>
```

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
  background: {
    color: '#F2F7FA',
  },
})
```

### 2. 渲染节点和边

X6 支持 JSON 格式数据，该对象中 `nodes` 代表节点数据，`edges` 代表边数据，可以使用 `attrs` 属性来定制节点和边的样式（可以类比 CSS）。

<code id="helloworld" src="@/src/tutorial/getting-started/helloworld/index.tsx"></code>

### 3. 使用 React 节点

X6 支持使用 `SVG`、`HTML` 来渲染节点内容，在此基础上，我们还可以使用 `React`、`Vue` 组件来渲染节点，这样在开发过程中会非常便捷。在拿到设计稿之后，你就需要权衡一下使用哪一种渲染方式，可以参考下面的一些建议：

- 如果节点内容比较简单，而且需求比较固定，使用 `SVG` 节点
- 其他场景，都推荐使用当前项目所使用的框架来渲染节点

例如：在上面节点基础上，我们有一个新的需求：给节点加上右键菜单。如果使用 `SVG` 来实现会比较复杂，我们直接使用 `React` 来渲染节点。这里我们使用 X6 配套的 React 渲染包 `@antv-x6-react-shape`。

<code id="react-shape" src="@/src/tutorial/getting-started/react-shape/index.tsx"></code>

### 4. 使用插件

除了基本的元素渲染能力，X6 还内置了大量的图编辑配套插件，使用这些成熟的插件，能很大程度上降低开发成本。下面为画布增加对齐线功能，当移动的节点与其他节点对齐时，会自动出现对齐线，可以方便用户进行位置排版。

```ts
import { Snapline } from '@antv/x6'

graph.use(
  new Snapline({
    enabled: true,
  }),
)
```

<code id="use-plugin" src="@/src/tutorial/getting-started/use-plugin/index.tsx"></code>

### 5. 数据导出

在上面的步骤 2 `渲染节点和边` 中可以看到，可以使用 `fromJSON` 将 `JSON` 数据渲染到画布中，当然，也支持将画布中的数据导出成 `JSON`，这样我们就可以将画布数据序列化后存储到服务端。

```ts
graph.toJSON()
```

我们的演示 demo 就到这里了，想继续了解 X6 的一些能力，可以从[基础教程](/tutorial/basic/graph)开始阅读。
