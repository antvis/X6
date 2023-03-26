---
title: 边上工具
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

由于边通常是一个具有较小宽度的折线/曲线，就不太方便与边进行交互。为了解决这个问题，我们一方面在渲染边的同时还渲染了一个与边同形状的 `<path>` 路径，但宽度更宽且透明的边，来方便用户与边进行交互；另外，我们也可以为边添加一些小工具来增强边的交互能力，如路径点小工具使路径点可以被移动、线段小工具使边中的线段可以被移动等。

场景一：添加指定的小工具。

```ts
// 创建边时添加小工具
graph.addEdge({
  source,
  target,
  tools: [
    { name: "vertices" },
    {
      name: "button-remove",
      args: { distance: 20 },
    },
  ],
});

// 创建边后添加小工具
edge.addTools([
  { name: "vertices" },
  {
    name: "button-remove",
    args: { distance: 20 },
  },
]);
```

场景二：鼠标动态添加/删除小工具。

```ts
graph.on("edge:mouseenter", ({ cell }) => {
  cell.addTools([
    { name: "vertices" },
    {
      name: "button-remove",
      args: { distance: 20 },
    },
  ]);
});

graph.on("edge:mouseleave", ({ cell }) => {
  if (cell.hasTool("button-remove")) {
    cell.removeTool("button-remove");
  }
});
```

在 X6 中默认提供了以下几个用于边的小工具：

- [vertices](#vertices) 路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。
- [segments](#segments) 线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。
- [boundary](#boundary) 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [button](#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
- [source-arrowhead-和-target-arrowhead](#source-arrowhead-和-target-arrowhead) 在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。
- [edge-editor](#edge-editor) 提供边上文本编辑功能。

## 内置工具

### vertices

路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。配置如下：


| 参数名             | 类型     | 默认值   | 说明                                                                                                                   |
|--------------------|----------|----------|----------------------------------------------------------------------------------------------------------------------|
| attrs              | KeyValue | `object` | 小圆点的属性。                                                                                                          |
| snapRadius         | number   | `20`     | 移动路径点过程中的吸附半径。当路径点与邻近的路径点距离在半径范围内时，将当前路径点吸附到临近路径点。                      |
| addable            | boolean  | `true`   | 在边上按下鼠标时，是否可以添加新的路径点。                                                                               |
| removable          | boolean  | `true`   | 是否可以通过双击移除路径点。                                                                                            |
| removeRedundancies | boolean  | `true`   | 是否自动移除冗余的路径点。                                                                                              |
| stopPropagation    | boolean  | `true`   | 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 `mousedown`、`mousemove` 和 `mouseup` 事件。 |

其中 `attrs` 的默认值(默认样式)为：

```ts
{
  r: 6,
  fill: '#333',
  stroke: '#fff',
  cursor: 'move',
  'stroke-width': 2,
}
```

工具使用方式如下：

```ts
// 创建 edge 时添加小工具
const edge1 = graph.addEdge({
  ...,
  tools: [
    {
      name: 'vertices',
      args: {
        attrs: { fill: '#666' },
      },
    },
  ]
})
```

<code id="api-edge-tool-vertices" src="@/src/api/edge-tool/vertices/index.tsx"></code>

### segments

线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。配置如下：

| 参数名             | 类型    | 默认值   | 说明                                                                                                                   |
|--------------------|---------|----------|----------------------------------------------------------------------------------------------------------------------|
| attrs              | object  | `object` | 元素的属性。                                                                                                            |
| precision          | number  | `0.5`    | 线段的两个端点的 X 或 Y 轴的坐标差小于 `precision` 时才渲染工具，默认 `0.5` 表示只对垂直和水平线段渲染工具。             |
| threshold          | number  | `40`     | 线段长度超过 `threshold` 时才渲染工具。                                                                                 |
| snapRadius         | number  | `10`     | 调整线段过程中的吸附半径。                                                                                              |
| removeRedundancies | boolean | `true`   | 是否自动移除冗余的路径点。                                                                                              |
| stopPropagation    | boolean | `true`   | 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 `mousedown`、`mousemove` 和 `mouseup` 事件。 |

其中 `attrs` 的默认值(默认样式)为：

```ts
{
  width: 20,
  height: 8,
  x: -10,
  y: -4,
  rx: 4,
  ry: 4,
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
}
```

工具使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [{
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  }]
})
```

<code id="api-edge-tool-segments" src="@/src/api/edge-tool/segments/index.tsx"></code>

### boundary

根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。配置如下：


| 参数名          | 类型     | 默认值   | 说明                                                                                                     |
|-----------------|----------|----------|--------------------------------------------------------------------------------------------------------|
| tagName         | string   | `rect`   | 使用何种图形渲染。                                                                                        |
| padding         | number   | `10`     | 边距。                                                                                                    |
| attrs           | KeyValue | `object` | 图形属性。                                                                                                |
| useCellGeometry | boolean  | `true`   | 是否使用几何计算的方式来计算元素包围盒，开启后会有性能上的提升，如果出现计算准度问题，请将它设置为 `false`。 |

其中 `attrs` 的默认值(默认样式)为：

```js
{
  fill: 'none',
  stroke: '#333',
  'stroke-width': 0.5,
  'stroke-dasharray': '5, 5',
  'pointer-events': 'none',
}
```

工具使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'boundary',
      args: {
        padding: 5,
        attrs: {
          fill: '#7c68fc',
          stroke: '#333',
          'stroke-width': 0.5,
          'fill-opacity': 0.2,
        },
      },
    },
  ]
})
```

<code id="api-edge-tool-boundary" src="@/src/api/edge-tool/boundary/index.tsx"></code>

### button

在指定位置处渲染一个按钮，支持自定义按钮的点击交互。配置如下：

| 参数名   | 类型                                                                 | 默认值      | 说明                          |
|----------|----------------------------------------------------------------------|-------------|-----------------------------|
| distance | number \| string                                                     | `undefined` | 偏离起点的距离或比例。         |
| offset   | number \| Point.PointLike                                            | `0`         | 在 `distance` 基础上的偏移量。 |
| rotate   | boolean                                                              | `undefined` | 是否跟随边旋转。               |
| markup   | Markup.JSONMarkup                                                    | `undefined` | 渲染按钮的 Markup 定义。       |
| onClick  | (args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void | `undefined` | 点击按钮的回调函数。           |

使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'button',
      args: {
        distance: -40,
        onClick({ view }: any) {
          //
        },
      },
    },
  ],
})
```

<code id="api-edge-tool-button" src="@/src/api/edge-tool/button/index.tsx"></code>

### button-remove

在指定的位置处，渲染一个删除按钮，点击时删除对应的边。它是上面 `button` 工具的一个特例，所以支持 `button` 的所有配置。使用方式如下：

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'button-remove',
      args: { distance: -40 },
    },
  ]
})
```

<code id="api-edge-tool-button-remove" src="@/src/api/edge-tool/button-remove/index.tsx"></code>

### source-arrowhead 和 target-arrowhead

在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。配置如下：


| 参数名  | 类型             | 默认值   | 说明                |
|---------|------------------|----------|-------------------|
| tagName | string           | `path`   | 使用何种图形来渲染。 |
| attrs   | Attr.SimpleAttrs | `object` | 图形的属性。         |

其中 `source-arrowhead` 的属性默认值为

```ts
{
  d: 'M 10 -8 -10 0 10 8 Z',
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
  cursor: 'move',
}
```

`target-arrowhead` 的属性默认值为

```ts
{
  d: 'M -10 -8 10 0 -10 8 Z',
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
  cursor: 'move',
}
```

工具使用方式如下：

```ts
graph.on("edge:mouseenter", ({ cell }) => {
  cell.addTools([
    "source-arrowhead",
    {
      name: "target-arrowhead",
      args: {
        attrs: {
          fill: "red",
        },
      },
    },
  ]);
});

graph.on("edge:mouseleave", ({ cell }) => {
  cell.removeTools();
});
```

<code id="api-edge-tool-arrowhead" src="@/src/api/edge-tool/arrowhead/index.tsx"></code>

### edge-editor

提供边上文本编辑功能。配置如下：


| 参数名                | 类型                                                        | 默认值                         | 说明                                                           |
|-----------------------|-------------------------------------------------------------|--------------------------------|--------------------------------------------------------------|
| labelAddable          | boolean                                                     | true                           | 点击非文本位置是否新建 label                                   |
| attrs/fontSize        | string                                                      | `14`                           | 编辑文本字体大小                                               |
| attrs/color           | string                                                      | `#000`                         | 编辑文本字体颜色                                               |
| attrs/fontFamily      | string                                                      | `Arial, helvetica, sans-serif` | 编辑文本的字体                                                 |
| attrs/backgroundColor | string                                                      | `#fff`                         | 编辑区域的背景色                                               |
| getText               | (this: CellView, args: {cell: Cell}) => string              | -                              | 获取原文本方法，在自定义 `markup` 场景需要自定义 `getText` 方法 |
| setText               | (this: CellView, args: {cell: Cell, value: string}) => void | -                              | 设置新文本，在自定义 `markup` 场景需要自定义 `setText` 方法     |

:::warning{title=注意：}
需要注意的是，2.8.0 版本后不需要在双击事件中去动态添加工具，也就不需要传入事件参数。
:::

```ts
// 2.8.0 版本之前使用方式
graph.on("node:dblclick", ({ node, e }) => {
  edge.addTools({
    name: "edge-editor",
    args: {
      event: e,
    },
  });
});

// 2.8.0 版本之后使用方式
edge.addTools({
  name: "edge-editor"
});
```

<code id="api-edge-tool-editor" src="@/src/api/node-tool/node-editor/index.tsx"></code>

## 自定义工具

### 方式一

继承 `ToolItem` 实现一个工具类，难度较高，要求对 [ToolItem](https://github.com/antvis/X6/blob/master/packages/x6/src/view/tool.ts) 类都有所了解，可以参考上述内置工具的源码，这里不展开叙述。

```ts
Graph.registerEdgeTool("button", Button);
```

### 方式二

继承已经注册的工具，在继承基础上修改配置。我们在 `ToolItem` 基类上提供了一个静态方法 `define` 来快速实现继承并修改配置。

```ts
import { Vertices } from "@antv/x6/es/registry/tool/vertices";

const RedVertices = Vertices.define<Vertices.Options>({
  attrs: {
    fill: "red",
  },
});

Graph.registerEdgeTool("red-vertices", RedVertices, true);
```

<code id="api-edge-tool-custom-vertices" src="@/src/api/edge-tool/custom-vertices/index.tsx"></code>


同时，我们为 `Graph.registerEdgeTool` 方法提供了一种快速继承并指定默认选项的实现：

```ts
Graph.registerEdgeTool('red-vertices', {
  inherit:'vertices', // 基类名称，使用已经注册的工具名称。
  attrs: {            // 其他选项，作为继承的类的默认选项。
    fill: 'red',
  },
})
```

通过该方法，我们可以快速定义并注册一个圆形的端点 `circle-target-arrowhead`：

```ts
Graph.registerEdgeTool("circle-target-arrowhead", {
  inherit: "target-arrowhead",
  tagName: "circle",
  attrs: {
    r: 18,
    fill: "#31d0c6",
    "fill-opacity": 0.3,
    stroke: "#fe854f",
    "stroke-width": 4,
    cursor: "move",
  },
});
```

<code id="api-edge-tool-custom-arrowhead" src="@/src/api/edge-tool/custom-arrowhead/index.tsx"></code>
