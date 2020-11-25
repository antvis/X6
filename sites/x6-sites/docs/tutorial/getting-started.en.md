---
title: 快速上手
order: 1
redirect_from:
  - /en/docs
  - /en/docs/tutorial
---

## 安装

通过 npm 或 yarn 命令安装 X6。

```shell
# npm
$ npm install @antv/x6 --save

# yarn
$ yarn add @antv/x6
```

安装完成之后，使用 `import` 或 `require` 进行引用。

```ts
import { Graph } from '@antv/x6';
```

如果是直接通过 `script` 标签引入，可以使用 `CDN` 地址，如果学习，可以使用最新的版本：

```html
<script src="https://unpkg.com/@antv/x6@latest/dist/x6.js"></script>
```

对于生产环境，我们推荐使用一个明确的版本号，以避免新版本造成的不可预期的破坏：

```html
<script src="https://unpkg.com/@antv/x6@1.0.3/dist/x6.js"></script>
```

## 开始使用

接下来我们就一起来创建一个最简单的 `Hello --> World` 应用。

### Step 1 创建容器

在页面中创建一个用于容纳 X6 绘图的容器，可以是一个 `div` 标签。

```html
<div id="container"></div>
```

### Step 2 准备数据

X6 支持 JSON 格式数据，该对象中需要有节点 `nodes` 和边 `edges` 字段，分别用数组表示：

```ts
const data = {
  // 节点
  nodes: [
    {
      id: 'node1', // String，可选，节点的唯一标识
      x: 40,       // Number，必选，节点位置的 x 值
      y: 40,       // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
      label: 'hello', // String，节点标签
    },
    {
      id: 'node2', // String，节点的唯一标识
      x: 160,      // Number，必选，节点位置的 x 值
      y: 180,      // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
      label: 'world', // String，节点标签
    },
  ],
  // 边
  edges: [
    {
      source: 'node1', // String，必须，起始节点 id
      target: 'node2', // String，必须，目标节点 id
    },
  ],
};
```

### Step 3 渲染画布

首先，我们需要创建一个 `Graph` 对象，并为其指定一个页面上的绘图容器，通常也会指定画布的大小。

```ts
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
});
```

然后，我们就可以使用刚刚创建的 `graph` 来渲染我们的节点和边。

```ts
graph.fromJSON(data)
```

到此，我们就得到一个最简单的 `Hello --> World` 示例，看下面的完整代码。

<iframe src="/demos/tutorial/getting-started/helloworld"></iframe>

## 画布

### 背景和网格

接下来，我们来给画布设置一个背景颜色和网格，另外还支持背景图片、网格类型等配置，点击查看完整的[背景配置](basic/background)和[网格配置](basic/grid)。

```ts
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
  background: {
    color: '#fffbe6', // 设置画布背景颜色
  },
  grid: {
    size: 10,      // 网格大小 10px
    visible: true, // 渲染网格背景
  },
});
```

<iframe src="/demos/tutorial/getting-started/background"></iframe>

### 缩放和平移

创建画布后，可以调用 `graph.scale(scaleX: number, scaleY: number)` 和 `graph.translate(tx: number, ty: number)` 来缩放和平移画布。

```ts
graph.scale(0.5, 0.5)
graph.translate(80, 40)
```

<iframe src="/demos/tutorial/getting-started/transform"></iframe>

## 节点

### 使用图形

在上面示例中，我们使用了默认图形 `rect` 来渲染节点，除此之外，我们在 X6 中也内置了 `circle`、`ellipse`、`polygon` 等[基础图形](basic/cell#内置节点)，可以通过 `shape` 属性为节点指定渲染的图形，例如： 

```ts
const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect', // 使用 rect 渲染
      x: 100,
      y: 200,
      width: 80,
      height: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'ellipse', // 使用 ellipse 渲染
      x: 300,
      y: 200,
      width: 80,
      height: 40,
      label: 'world',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
    },
  ],
};
```

<iframe src="/demos/tutorial/getting-started/node-shape"></iframe>

### 定制样式

在创建节点或准备节点数据时，我们可以通过 `attrs` 对象来配置节点样式，该对象的 Key 是节点 SVG 元素的选择器(Selector)，对应的值是应用到该 SVG 元素的 [SVG 属性值](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute)(如 [fill](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill) 和 [stroke](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke))，如果你对 SVG 属性还不熟悉，可以参考 MDN 提供的[填充和边框](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes)入门教程。

我们对 `'rect'` 图形中定义了 `'body'`(代表 `<rect>` 元素) 和 `'label'`(代表 `<text>` 元素) 两个选择器(Selector)，每种图形都有属于自己的选择器定义，X6 内置图形[参考这里](basic/cell#attrs-1)。

```ts
const data = {
  nodes: [
    {
      id: 'node1',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#2ECC71',
          stroke: '#000',
          strokeDasharray: '10,2',
        },
        label: {
          text: 'Hello',
          fill: '#333',
          fontSize: 13,
        }
      }
    },
    {
      id: 'node2',
      x: 180,
      y: 240,
      width: 100,
      height: 40,
      attrs: {
        body: {
          fill: '#F39C12',
          stroke: '#000',
          rx: 16,
          ry: 16,
        },
        label: {
          text: 'World',
          fill: '#333',
          fontSize: 18,
          fontWeight: 'bold',
          fontVariant: 'small-caps',
        },
      },
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
    },
  ],
};
```

<iframe src="/demos/tutorial/getting-started/node-style"></iframe>

## 边

### 使用图形

在上面示例中，我们使用了默认图形 `edge` 来渲染边，除此之外，在 X6 中还内置了 `double-edge` 和 `shadow-edge` 两种图形，可以通过 `shape` 属性为边指定渲染的图形，例如： 

```ts
const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'ellipse',
      x: 240,
      y: 300,
      width: 80,
      height: 40,
      label: 'world',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      shape: 'double-edge',
    },
  ],
}
```

<iframe src="/demos/tutorial/getting-started/edge-shape"></iframe>

### 定制样式

与[定制节点样式](#定制样式)一样，我们使用 `attrs` 对象来配置边的样式，默认的 `edge` 图形定义了 `'line'`（`<path>` 元素） 和 `'wrap'`（透明的 `<path>` 元素，更宽但不可见，为了方便交互）两个选择器(Selector)，我们像下面这样来定制边的样式。

```ts
const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'ellipse',
      x: 240,
      y: 300,
      width: 80,
      height: 40,
      label: 'world',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      attrs: {
        line: {
          stroke: 'orange',
        },
      },
    },
  ],
}
```

<iframe src="/demos/tutorial/getting-started/edge-style"></iframe>

## 更多

本章仅仅介绍了如何安装以及最简单的使用场景，在后续的教程中你可以了解到更多内容。

- [画布 Graph](./basic/graph)
- [基类 Cell](./basic/cell)
- [节点 Node](./basic/node)
- [边 Edge](./basic/edge)
- [群组 Group](./basic/group)
- [链接桩 Port](./basic/port)
- [画布网格 Grid](./basic/grid)
- [画布背景 Background](./basic/background)
- [剪切板 Clipboard](./basic/clipboard)
- [撤销/重做 Redo/Undo](./basic/history)
- [点选/框选 Selection](./basic/selection)
- [对齐线 Snapline](./basic/snapline)
- [滚动 Scroller](./basic/scroller)
- [小地图 Minimap](./basic/minimap)
- [拖拽 Dnd](./basic/dnd)
- [快捷键 Keyboard](./basic/keyboard)
- [鼠标滚轮缩放 MouseWheel](./basic/mousewheel)

更多教程，请参见 [进阶实战](intermediate/serialization) 和 [高级指引](advanced/animation)。

有其他任何问题都可以通过页面底部的钉钉群和我们沟通，也非常欢迎给我们提 [issues](https://github.com/antvis/X6/issues/new/choose) 或 [PR](https://github.com/antvis/X6/pulls)。
