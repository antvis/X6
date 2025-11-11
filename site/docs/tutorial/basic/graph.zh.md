---
title: 画布
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

## 简介

X6 中的**画布(Graph)**是一个**容器**，用来渲染和管理节点(Node)、边(Edge)以及其他图形元素等等内容，画布本身也包含很多功能(缩放、网格、平移等等)。

在 X6 中，画布是通过 `Graph` 类来实例化的，同时可以指定[一系列选项](/api/graph/graph)来配置画布：

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  // 指定画布挂载的容器
  container: document.getElementById('container'),
  // ...其他配置
})
```

## 画布大小

在实例化 `Graph` 对象的时候，X6 支持多种方式来设置画布大小：

1. **固定画布大小**：设置 `width` 和 `height` 的固定数值方式来设置画布大小，例如 `width: 800`、`height: 500`，来将画布大小设置为 `800 x 500`。

```js
const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 500,
})
```

2. **容器大小**：不设置 `width` 和 `height`，默认就会以画布容器大小初始化画布，例如容器大小为 `800 x 500`，画布大小也会是 `800 x 500`。

```js
const graph = new Graph({
  container: document.getElementById('container'),
  // 不设置 width 和 height，默认以容器大小初始化画布
  // width: 800, 
  // height: 500,
})
```

3. **自适应容器大小**：通过设置 `autoResize: true` 来开启自适应容器大小，以容器大小作为画布大小，当画布容器大小改变时，画布大小也会自动重新计算。

```js
const graph = new Graph({
  container: document.getElementById('container'),
  autoResize: true,
})
```

使用 `autoResize` 还可以解决以下两个问题：

- 画布容器还没有渲染完成（此时尺寸为 0），并且没有通过 `width` 和 `height` 配置画布大小，就实例化画布对象，导致渲染不出画布。
- 设置了画布大小，但是页面的 `resize`（例如用户改变浏览器窗口大小）导致画布容器大小改变，但是画布大小并没有跟着一起改变。

:::info{title=提示}
使用 `autoResize` 配置时，需要在画布容器外面再套一层宽高都是 100% 的外层容器，在外层容器上监听尺寸改变，当外层容器大小改变时，画布自动重新计算宽高以及元素位置

```html
<div style="width:100%; height:100%">
  <div id="container"></div>
</div>
```

:::

## 背景与网格

一个常见的需求是设置画布的背景颜色以及给画布添加网格，在 X6 画布中可以直接通过 `background` 以及 `grid` 配置来实现效果：

```js
import { Graph } from '@antv/x6'

const graph = new Graph({
  // ...其他配置
  background: { color: "#F2F7FA" },
  grid: 10
})
```

这是一个完整的例子，注意背景颜色以及背景上的网格：

```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA', // 背景颜色
  },
  grid: {
    visible: true,
    type: 'doubleMesh',
    args: [
      {
        color: '#eee', // 主网格线颜色
        thickness: 1, // 主网格线宽度
      },
      {
        color: '#ddd', // 次网格线颜色
        thickness: 1, // 次网格线宽度
        factor: 4, // 主次网格线间隔
      },
    ],
  },
})

graph.addNode({
  shape: 'rect',
  label: "hello X6",
  width: 100,
  height: 50,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
},
})

graph.centerContent() // 居中显示
```

:::info{title=提示}
在 X6 中，网格是渲染/移动节点的最小单位，默认是 10px ，也就是说位置为 `{ x: 24, y: 38 }` 的节点渲染到画布后的实际位置为 `{ x: 20, y: 40 }`，最小移动单位可以通过 grid 配置中的 `size` [属性](/api/graph/grid#配置)来设置。
:::

背景不仅支持颜色，还支持背景图片，网格也支持四种不同类型，并且能配置网格线的颜色以及宽度，详细的配置与方法可见：

- [背景配置](/api/graph/background)
- [网格配置](/api/graph/grid)

## 缩放与平移

画布的拖拽、缩放也是常用操作，Graph 中通过 `panning` 和 `mousewheel` 配置来实现这两个功能，鼠标按下画布后移动时会拖拽画布，滚动鼠标滚轮会缩放画布。

```ts {5-6}
import { Graph } from '@antv/x6'

const graph = new Graph({
  // ...其他配置
  panning: true,
  mousewheel: true
})
```

这是一个完整的例子，按住鼠标可以拖动画布，滚动鼠标滚轮可以缩放画布：

```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
  panning: true,
  mousewheel: true,
})

graph.addNode({
  shape: 'rect',
  label: "hello X6",
  width: 100,
  height: 50,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
},
})

graph.centerContent() // 居中显示
```

当然，`panning` 和 `mousewheel` 也支持很多其他的配置，比如修饰键（按下修饰键才能触发相应的行为）、缩放因子（速率）等等，详细的配置与方法可见：

- [画布平移](/api/graph/panning)
- [画布缩放](/api/graph/mousewheel)

## 画布插件

画布除了支持 网格、背景、缩放等功能之外，还通过插件支持了很多其他实用的功能，例如 滚动画布、对齐线等，可以按需来引入和使用：

```ts
import { Graph, Scroller, Snapline } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  width:800,
})

// Snapline 插件可以使节点在拖动过程中显示与其他节点的对齐线
graph.use(
  new Snapline({
    enabled: true,
  }),
)
// Scroller 插件可以使画布支持滚动
graph.use(
  new Scroller({
    enabled: true,
    pannable: true,
  }),
)
```

这是一个完整的例子，使用 `Scroller` 插件后画布可以进行滚动了，使用 `Snapline` 插件后拖动节点靠近其他节点会出现对齐线：

```js | ob { inject: true, pin: false }
import { Graph, Scroller, Snapline } from '@antv/x6'

const data = {
  // 表示节点
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 160,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
}

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA', // 背景颜色
  },
})

graph.use(
  new Snapline({
    enabled: true,
  }),
)

graph.use(
  new Scroller({
    enabled: true,
    pannable: true,
  }),
)

graph.fromJSON(data) // 渲染元素
graph.centerContent() // 居中显示
```

更多使用插件和详细功能可见：

- [对齐线](/tutorial/plugins/snapline)
- [滚动画布](/tutorial/plugins/scroller)

## 常用 API

除了上述的一些配置，X6 还有丰富的 API 对画布尺寸、位置进行操作，下面列举一些常用的 API：

```ts
graph.resize(800, 600) // resize 画布大小
graph.translate(20, 20) // 在 x、y 方向上平移画布
graph.zoom(0.2) // 将画布缩放级别增加 0.2（默认为1）
graph.zoom(-0.2) // 将画布缩放级别减少 0.2
graph.zoomTo(1.2) // 将画布缩放级别设置为 1.2
// 将画布中元素缩小或者放大一定级别，让画布正好容纳所有元素，可以通过 maxScale 配置最大缩放级别
graph.zoomToFit({ maxScale: 1 })
graph.centerContent() // 将画布中元素居中展示
```

<code id="transform" src="@/src/tutorial/basic/graph/transform/index.tsx"></code>

以上是一些常用的 API，更多 API 可见：

- [配置项](/api/graph/graph)
- [网格](/api/graph/grid)
- [背景](/api/graph/background)
- [画布平移](/api/graph/panning)
- [画布缩放](/api/graph/mousewheel)
- [视口变换](/api/graph/transform)
- [坐标系](/api/graph/coordinate)
