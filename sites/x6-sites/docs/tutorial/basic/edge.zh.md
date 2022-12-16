---
title: 边
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic/basic
---

:::info{title=在本章节中，主要介绍边相关的知识，通过阅读，你可以了解到：}

- 添加边的方法
- 如何配置边的形状
- 如何在边上增加箭头
- 如何自定义边
- 如何通过 API 修改边
  :::

## 添加边

节点和边都有共同的基类 [Cell](/zh/docs/api/model/cell)，除了从 `Cell` 继承属性外，还支持以下选项。

| 属性名       | 类型              | 默认值                                         | 描述               |
| ------------ | ----------------- | ---------------------------------------------- | ------------------ |
| source       | TerminalData      | -                                              | 源节点或起始点。   |
| target       | TerminalData      | -                                              | 目标节点或目标点。 |
| vertices     | Point.PointLike[] | -                                              | 路径点。           |
| router       | RouterData        | -                                              | 路由。             |
| connector    | ConnectorData     | -                                              | 连接器。           |
| labels       | Label[]           | -                                              | 标签。             |
| defaultLabel | Label             | [默认标签](/zh/docs/api/model/labels#默认标签) | 默认标签。         |

```ts
graph.addEdge({
  shape: "edge",
  source: "node1",
  target: "node2",
});
```

## 配置边

下面分别看下上面的配置如何使用。

### source/target

边的源和目标节点(点)。

```ts
graph.addEdge({
  source: rect1, // 源节点
  target: rect2, // 目标节点
});

graph.addEdge({
  source: "rect1", // 源节点 ID
  target: "rect2", // 目标节点 ID
});

graph.addEdge({
  source: { cell: rect1, port: "out-port-1" }, // 源节点和连接桩 ID
  target: { cell: "rect2", port: "in-port-1" }, // 目标节点 ID 和连接桩 ID
});

graph.addEdge({
  source: "rect1", // 源节点 ID
  target: { x: 100, y: 120 }, // 目标点
});
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
});
```

<code id="edge-vertices" src="@/src/tutorial/basic/edge/vertices/index.tsx"></code>

### router

路由 `router` 将对 `vertices` 进一步处理，并在必要时添加额外的点，然后返回处理后的点。例如，经过 [orth 路由](/zh/docs/api/registry/router#orth)处理后，边的每一条链接线段都是水平或垂直的。

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  // 如果没有 args 参数，可以简写为 router: 'orth'
  router: {
    name: "orth",
    args: {},
  },
});
```

<code id="edge-router" src="@/src/tutorial/basic/edge/router/index.tsx"></code>

X6 默认提供了以下几种路由，点击下面的链接查看每种路由的使用方式。

- [normal](/zh/docs/api/registry/router#normal)
- [orth](/zh/docs/api/registry/router#orth)
- [oneSide](/zh/docs/api/registry/router#oneside)
- [manhattan](/zh/docs/api/registry/router#manhattan)
- [metro](/zh/docs/api/registry/router#metro)
- [er](/zh/docs/api/registry/router#er)

另外，我们也可以注册自定义路由，详情请参考[自定义路由](/zh/docs/api/registry/router#registry)教程。

### connector

连接器 `connector` 将路由 `router` 返回的点加工成渲染边所需要的 [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)。例如，`rounded` 连接器将连线之间的倒角处理为圆弧倒角。

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: "orth",
  // 如果没有 args 参数，可以简写写 connector: 'rounded'
  connector: {
    name: "rounded",
    args: {},
  },
});
```

<code id="edge-connector" src="@/src/tutorial/basic/edge/connector/index.tsx"></code>

X6 默认提供了以下几种连接器，点击下面的链接查看每种连接器的使用方式。

- [normal](/zh/docs/api/registry/connector#normal)
- [rounded](/zh/docs/api/registry/connector#rounded)
- [smooth](/zh/docs/api/registry/connector#smooth)
- [jumpover](/zh/docs/api/registry/connector#jumpover)

另外，我们也可以注册自定义连接器，详情请参考[自定义连接器](/zh/docs/api/registry/connector#register)。

### labels

用于设置标签文本、位置、样式等。通过数组形式支持多标签，`labels` 指定的每一项都将与 [defaultLabel](/zh/docs/api/model/labels#默认标签) 进行 [merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources) 后使用。

```ts
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: [
    {
      attrs: {
        label: {
          text: "edge",
        },
      },
    },
  ],
});
// 或
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: ["edge"], // 通过 labels 可以设置多个标签，当只设置标签文本是可以简化为此写法
});
// 或
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  label: "edge", // 通过 label 设置单个标签，当只设置标签文本是可以简化为此写法
});
```

<code id="edge-labels" src="@/src/tutorial/basic/edge/labels/index.tsx"></code>

除了设置文本，还可以使用 Label 在边上创建一些复杂图形，我们在 [API](/zh/docs/api/model/labels) 中会详细介绍。

### defaultLabel

默认标签。默认标签可以简化标签配置项，`labels` 指定的每一项都将与 `defaultLabel` 进行 merge 后使用。

## 使用箭头

我们定义了 `sourceMarker` 和 `targetMarker` 两个特殊属性来为边定制起始和终止箭头。例如，对 `Shape.Edge` 我们可以通过 `line` 选择器来指定起始和终止箭头。

### 内置箭头

X6 提供了以下几种内置箭头，使用时只需要指定箭头名和参数（可省略）即可。

- [block](/zh/docs/api/model/marker#block)
- [classic](/zh/docs/api/model/marker#classic)
- [diamond](/zh/docs/api/model/marker#diamond)
- [cross](/zh/docs/api/model/marker#cross)
- [async](/zh/docs/api/model/marker#async)
- [path](/zh/docs/api/model/marker#path)
- [circle](/zh/docs/api/model/marker#circle)
- [circlePlus](/zh/docs/api/model/marker#circleplus)
- [ellipse](/zh/docs/api/model/marker#ellipse)

```ts
graph.addEdge({
  shape: "edge",
  sourece: [100, 100],
  target: [500, 500],
  attrs: {
    line: {
      sourceMarker: "block", // 实心箭头
      targetMarker: {
        name: "ellipse", // 椭圆
        rx: 10, // 椭圆箭头的 x 半径
        ry: 6, // 椭圆箭头的 y 半径
      },
    },
  },
});
```

<code id="edge-native-marker" src="@/src/tutorial/basic/edge/native-marker/index.tsx"></code>

:::info{title=提示：}
X6 中边默认自带 `classic` 箭头，如果要去掉，可以将 `targetMarker` 设置为 `null`。
:::

### 自定义箭头

我们也可以通过 `tagName` 指定的 SVG 元素来渲染箭头，例如下面我们使用 `<path>` 元素来渲染箭头，箭头默认继承边的填充色 `fill` 和边框色 `stroke`。

```ts
graph.addEdge({
  shape: "edge",
  sourece: [100, 100],
  target: [500, 500],
  attrs: {
    line: {
      sourceMarker: {
        tagName: "path",
        d: "M 20 -10 0 0 20 10 Z",
      },
      targetMarker: {
        tagName: "path",
        fill: "yellow", // 使用自定义填充色
        stroke: "green", // 使用自定义边框色
        strokeWidth: 2,
        d: "M 20 -10 0 0 20 10 Z",
      },
    },
  },
});
```

:::info{title=提示：}
我们的起始箭头和终止箭头使用了相同的 `d` 属性，这是因为我们会自动计算箭头方向，简单来说，我们在定义箭头时，只需要定义一个**向左指向坐标原点**的箭头即可。
:::

<code id="edge-custom-marker" src="@/src/tutorial/basic/edge/custom-marker/index.tsx"></code>

更多箭头的案例和定制技巧请参考 [API](/zh/docs/api/model/marker)。

## 定制边

和节点一样，我们可以通过 `markup` 和 `attrs` 来定制边的形状和样式，也可以注册自定义边来达到复用效果。X6 默认的边 `Shape.Edge` 中定义了 `line`（代表 path 元素）和 `wrap`（代表透明的 path 元素，用于响应交互）两个选择器。我们在创建边时可以像下面这样定义边的样式。

<code id="edge-registry" src="@/src/tutorial/basic/edge/registry/index.tsx"></code>

## 修改边

和节点类似，在渲染完成之后，我们还可以通过 API 修改边的所有属性。我们会常用到下面两个方法：

- edge.prop(path, value)，详细使用见 [prop](/zh/docs/api/model/cell#节点和边的属性-properties)。
- edge.attr(path, value)，详细使用见 [attr](/zh/docs/api/model/cell#元素属性-attrs)。

下面我们看一下 X6 默认提供的边的 `prop`。

```ts
const edge = graph.addEdge({
  source: [200, 140],
  target: [500, 140],
  label: 'edge',
})
console.log(edge.prop())

// 输出结果
{
  "shape": "edge",
  "attrs": {
    "lines": {
      "connection": true,
      "strokeLinejoin": "round"
    },
    "wrap": {
      "strokeWidth": 10
    },
    "line": {
      "stroke": "#333",
      "strokeWidth": 2,
      "targetMarker": "classic"
    }
  },
  "id": "9d5e4f54-1ed3-429e-8d8c-a1526cff2cd8",
  "source": {
    "x": 200,
    "y": 140
  },
  "target": {
    "x": 500,
    "y": 140
  },
  "labels": [{
    "attrs": {
      "label": {
        "text": "edge"
      }
    }
  }],
  "zIndex": 1
}
```

从上面结果可以看到，`prop` 是处理后的一份新的配置，它的值可以通过方法进行更新，更新之后，边会立即刷新到最新状态。为了更快捷的修改边的 `attrs`，X6 提供了 `attr` 方法。

```ts
edge.prop("target", { x: 300, y: 300 }); // 修改终点
edge.attr("line/stroke", "#ccc"); // 修改边颜色，等价于 edge.prop('attrs/line/stroke', '#ccc')
```

<code id="edge-prop" src="@/src/tutorial/basic/edge/prop/index.tsx"></code>
