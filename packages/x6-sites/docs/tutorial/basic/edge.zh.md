---
title: 边 Edge
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

在[快速上手](../getting-started)案例中，我们通过 JSON 数据来快速添加两个矩形节点和一条边到画布中，并简单了解了如何定制边样式。接下来我们将学习更多创建边的方式，并了解创建边的基础选项。

## 创建边

### 方式一：构造函数

我们在 X6 的 `Shape` 命名空间中内置 `Edge`、`DoubleEdge`、`ShadowEdge` 三种边，可以使用这些边的构造函数来创建节点。

```ts
import { Shape } from '@antv/x6'

// 创建边
const edge = new Shape.Edge({
  source: rect1,
  target: rect2,
})

// 添加到画布
graph.addEdge(edge)
```

上面代码中，通过 `source` 和 `target` 选项指定了边的源节点和目标节点，然后通过 `graph.addEdge` 方法将边添加到画布，边添加到画布后将触发画布重新渲染，最后边被渲染到画布中。我们也可以先创建边，然后调用边提供的方法来设置边的源节点、目标节点、样式等。

```ts
const edge = new Shape.Edge()

edge
  .setSource(rect1)
  .setTarget(rect2)

graph.addEdge(edge)
```

### 方式二：graph.addEdge

另外，我们还可以使用 `graph.addEdge` 方法来创建边并添加边到画布，推荐大家使用这个便利的方法。

```ts
const rect = graph.addEdge({
  shape: 'edge', // 指定使用何种图形，默认值为 'edge'
  source: rect1,
  target: rect2,
})
```

这里的关键是使用 `shape` 来指定图形，默认值为 `'edge'`，其他选项与使用边构造函数创建节点一致。在 X6 内部，我们通过 `shape` 指定的图形找到对应的构造函数来初始化边，并将其添加到画布。内置边构造函数与 `shape` 名称对应关系[参考此表](./cell#内置边)。除了使用[内置边](./cell#内置边)，我们还可以使用注册的自定义边，详情请参考[自定义边]()教程。

## 选项

上面我们介绍了如何通过构造函数和 `graph.addEdge` 两种方式来创建边，并了解了 `source` 和 `target` 两个基础选项，除了[从 Cell 继承的基础选项](./cell#基础选项)外，还支持以下选项。

| 属性名       | 类型              | 默认值                                              | 描述              |
|--------------|-------------------|-----------------------------------------------------|-----------------|
| source       | TerminalData      | undefined                                           | 源节点或起始点。   |
| target       | TerminalData      | undefined                                           | 目标节点或目标点。 |
| vertices     | Point.PointLike[] | undefined                                           | 路径点。           |
| router       | RouterData        | undefined                                           | 路由。             |
| connector    | ConnectorData     | undefined                                           | 连线。             |
| labels       | Label[]           | undefined                                           | 标签。             |
| defaultLabel | Label             | [默认标签](../../intermediate/edge-labels#默认标签) | 默认标签。         |

下面分别看看这些选项如何使用。

### source/target

边的源和目标节点(点)。

```ts
graph.addEdge({
  source: rect1, // 源节点
  target: rect2, // 目标节点
})

graph.addEdge({
  source: 'rect1', // 源节点 ID
  target: 'rect2', // 目标节点 ID
})

graph.addEdge({
  source: { cell: rect1, port: 'out-port-1' },  // 源节点和链接桩 ID
  target: { cell: 'rect2', port: 'in-port-1' }, // 目标节点 ID 和链接桩 ID
})

graph.addEdge({
  source: 'rect1',            // 源节点 ID
  target: { x: 100, y: 120 }, // 目标点
})
```

需要注意的是，当源/目标是画布上的点时，需要开启 `dangling` 选项（默认已经开启）才能生效。

```ts
const graph = new Graph({
  connecting: {
    dangling: true,
  },
})
```

### vertices

路径点。边从起始点开始，按顺序经过路径点，最后到达终止点。

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 }, 
    { x: 300, y: 120 },
  ],
})
```

<iframe
     src="https://codesandbox.io/embed/x6-edge-vertices-sjzc3?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:370px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-edge-vertices"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### router

路由 `router` 将对 `vertices` 进一步处理，并在必要时添加额外的点，然后返回处理后的点。例如，经过 [orth 路由](../../intermediate/router#orth)处理后，边的每一条链接线段都是水平或垂直的。

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 }, 
    { x: 300, y: 120 },
  ],
  router: {
    name: 'orth',
    args: {},
  },
})
```

<iframe
  src="https://codesandbox.io/embed/x6-edge-orth-router-hnifl?fontsize=14&hidenavigation=1&theme=light&view=preview"
  style="width:100%; height:370px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
  title="x6-edge-orth-router"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

路由都是通过[注册的方式](../../intermediate/router#注册)注册到 X6 中，使用时只需要提供路由名称 `name` 和 参数 `args` 即可，不需要参数 `args` 时可以使用省略写法。

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 }, 
    { x: 300, y: 120 },
  ],
  router: 'orth',
  // 或
  // router: {
  //   name: 'orth',
  // },
})
```

X6 默认提供了以下几种路由，点击下面的链接查看每种路由的使用方式。

- [normal](../../intermediate/router#normal) 
- [orth](../../intermediate/router#orth)
- [oneSide](../../intermediate/router#oneside)
- [manhattan](../../intermediate/router#manhattan)
- [metro](../../intermediate/router#metro)
- [er](../../intermediate/router#er)

另外，我们也可以注册自定义路由，详情请参考[自定义路由](../../intermediate/router#自定义路由)教程。

### connector

链接器 `connector` 将路由 `router` 返回的点加工成渲染边需要的 [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)。例如，`rounded` 连接器将连线之间的倒角处理为圆弧倒角。

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 }, 
    { x: 300, y: 120 },
  ],
  router: 'orth',
  connector: {
    name: 'rounded',
    args: {},
  },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-edge-rounded-connector-40bnc?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:370px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-edge-rounded-connector"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

连接器都通过注册的方式注册到 X6 中，使用时只需要提供连接器名称 name 和 参数 args 即可，不需要参数 `args` 时可以使用省略写法：

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 }, 
    { x: 300, y: 120 },
  ],
  router: 'orth',
  connector: 'rounded',
  // 或
  // connector: {
  //   name: 'rounded',
  // },
})
```

X6 默认提供了以下几种连接器，点击下面的链接查看每种连接器的使用方式。

- [normal]()
- [rounded]()
- [smooth]()
- [jumpover]()

另外，我们也可以注册自定义连接器，详情请参考[自定义连接器]()。

### labels

标签。

用于设置标签文本、位置、样式等。通过数组形式支持多标签，`labels` 指定的每一项都将于 [defaultLabel](#defaultlabel) 进行 [merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources) 后使用。

```ts
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: [
    {
      attrs: { label: { text: 'edge' } },
    },
  ],
})
// 或
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: ['edge'], // 通过 labels 可以设置多个标签，当只设置标签文本是可以简化为此写法
})
// 或
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  label: 'edge', // 通过 label 设置单个标签，当只设置标签文本是可以简化为此写法
})
```

也可以调用 `edge.setLabels()` 和 `edge.appendLabel()` 来设置和添加标签。

```ts
// 设置标签
edge.setLabels([{
  attrs: { label: { text: 'edge' } },
}])
// 或
edge.setLabels(['edge'])

// 添加单个标签
edge.appendLabel({
  attrs: { label: { text: 'edge' } },
})
// 或
edge.appendLabel('edge')
```

<iframe
  src="https://codesandbox.io/embed/x6-edge-label-2i56q?fontsize=14&hidenavigation=1&theme=light&view=preview"
  style="width:100%; height:370px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden; marginTop: 16px;"
  title="x6-edge-label"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

完整的 Label 配置项稍微有点复杂，所以我们在[单独的教程](../../intermediate/edge-labels)中介绍。

### defaultLabel

默认标签。通默认标签可以简化标签配置项，[labels](#labels) 指定的每一项都将于 `defaultLabel` 进行 [merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources) 后使用。详情请[参考这里](../../intermediate/edge-labels#默认标签)。

## 定制样式 Attrs

我们在之前的教程中介绍了[如何通过 attrs 选项来定制样式](./cell#attrs-1)，并且学习了如何通过[选项默认值](./cell#选项默认值)来实现预设选项以及如何通过[自定义选项](./cell#自定义选项)来实现选项扩展，请结合这几个教程来学习如何定制样式。

例如，`Shape.Edge` 边定义了 `'line'`（代表 `<path>` 元素）和 `'wrap'`（代表透明的 `<path>` 元素，用于响应交互）两个选择器。我们在创建边时可以像下面这样定义边的样式。

```ts
graph.addEdge({
  source: { x: 100, y: 40 },
  target: { x: 400, y: 40 },
  attrs: {
    line: {
      stroke: "#7c68fc", // 指定 path 元素的填充色
    },
  },
})
```

<iframe
  src="https://codesandbox.io/embed/x6-edge-style-wpxik?fontsize=14&hidenavigation=1&theme=light&view=preview"
  style="width:100%; height:140px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden; marginTop: 16px;"
  title="x6-edge-style"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## 使用箭头 Marker

我们定义了 [sourceMarker]() 和 [targetMarker]() 两个特殊属性来为边定制起始和终止箭头。例如，对 `Shape.Edge` 我们可以通过 `'line'` 选择器来指定起始和终止箭头。

### 内置箭头

X6 提供了以下几种内置箭头，使用时只需要指定箭头名和参数（可省略）即可。

- [block](../../intermediate/marker#block)
- [classic](../../intermediate/marker#classic)
- [diamond](../../intermediate/marker#diamond)
- [cross](../../intermediate/marker#cross)
- [async](../../intermediate/marker#async)
- [path](../../intermediate/marker#path)
- [circle](../../intermediate/marker#circle)
- [circlePlus](../../intermediate/marker#circleplus)
- [ellipse](../../intermediate/marker#ellipse)

```ts
edge.attr({
  line: {
    sourceMarker: 'block', // 实心箭头
    targetMarker: {
      name: 'ellipse', // 椭圆
      rx: 10, // 椭圆箭头的 x 半径
      ry: 6,  // 椭圆箭头的 y 半径
    },
  },
})
```

<iframe
     src="https://codesandbox.io/embed/x6-edge-native-marker-6p2d6?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:370px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden; marginTop: 16px;"
     title="x6-edge-native-marker"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 自定义箭头

我们也可以通过 `tagName` 指定的 SVG 元素来渲染箭头，例如下面我们使用 `<path>` 元素来渲染箭头，箭头默认继承边的填充色 `fill` 和边框色 `stroke`。

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: 'path',
      d: 'M 20 -10 0 0 20 10 Z',
    },
    targetMarker: {
      tagName: 'path',
      fill: 'yellow',  // 使用自定义填充色
      stroke: 'green', // 使用自定义边框色
      strokeWidth: 2,
      d: 'M 20 -10 0 0 20 10 Z',
    },
  },
})
```
值得一提的是，我们的起始箭头和终止箭头使用了相同的 `'d'` 属性，这是因为我们会自动计算箭头方向，简单来说，我们在定义箭头时，只需要定义一个**向左指向坐标原点**的箭头即可。

<iframe
     src="https://codesandbox.io/embed/x6-edge-custom-marker-7gze4?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:370px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden; marginTop: 16px;"
     title="x6-edge-custom-marker"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

更多箭头的案例和定制技巧请参考[这篇教程](../../intermediate/marker)，我们也支持注册自定义的箭头，注册后就可以像使用内置箭头那样来使用箭头，详情请参考[注册箭头教程](../../intermediate/marker#注册箭头)。
