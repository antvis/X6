---
title: EdgeTool
order: 26
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

由于边通常是一个具有较小宽度的折线/曲线，就不太方便与边进行交互。为了解决这个问题，我们一方面在渲染边的同时还渲染了一个与边同形状的 `<path>` 路径，但宽度更宽且透明的边，来方便用户与边进行交互；另外，我们也可以为边添加一些小工具来增强边的交互能力，如路径点小工具使路径点可以被移动、线段小工具使边中的线段可以被移动等。我们在 `Registry.EdgeTool.presets` 命名空间中提供了一些边的小工具，可以在下面这些场景使用。

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

## presets

### vertices

路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。

<span class="tag-param">参数<span>

| 参数名             | 类型     | 默认值      | 说明                                                                                                                                               |
| ------------------ | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| attrs              | KeyValue | `undefined` | 小圆点的属性。                                                                                                                                     |
| snapRadius         | number   | `20`        | 移动路径点过程中的吸附半径。当路径点与邻近的路径点的某个坐标 `(x, y)` 距离在半径范围内时，将当前路径点的对应坐标 `(x, y)` 吸附到邻居路径的路径点。 |
| addable            | boolean  | `true`      | 在边上按下鼠标时，是否可以添加新的路径点。                                                                                                         |
| removable          | boolean  | `true`      | 是否可以通过双击移除路径点。                                                                                                                       |
| removeRedundancies | boolean  | `true`      | 是否自动移除冗余的路径点。                                                                                                                         |
| stopPropagation    | boolean  | `true`      | 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 `mousedown`、`mousemove` 和 `mouseup` 事件。                          |

<span class="tag-example">使用</span>

```ts
// 创建 edge 时添加小工具
const edge1 = graph.addEdge({
  ...,
  tools: {
    items: [
      {
        name: 'vertices',
        args: {
          attrs: { fill: '#666' },
        },
      },
    ],
  },
})

// 鼠标 Hover 时添加小工具
graph.on('edge:mouseenter', ({ cell }) => {
  if (cell === edge2) {
    cell.setTools({
      name: 'onhover',
      tools: ['vertices'],
    })
  }
})

graph.on('edge:mouseleave', ({ cell }) => {
  if (cell.hasTools('onhover')) {
    cell.removeTools()
  }
})
```

<!-- <iframe src="/demos/api/registry/edge-tool/vertices"></iframe> -->

### segments

线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。

<span class="tag-param">参数<span>

| 参数名             | 类型    | 默认值                                                                                               | 说明                                                                                                                      |
| ------------------ | ------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| attrs              | object  | `{width: 20, height: 8, x: -10, y: -4, rx: 4, ry: 4, fill: '#333', stroke: '#fff', stroke-width: 2}` | 元素的属性。                                                                                                              |
| precision          | number  | `0.5`                                                                                                | 线段的两个端点的 X 或 Y 轴的坐标差小于 `precision` 时才渲染工具，默认 `0.5` 表示只对垂直和水平线段渲染工具。              |
| threshold          | number  | `40`                                                                                                 | 线段长度超过 `threshold` 时才渲染工具。                                                                                   |
| snapRadius         | number  | `10`                                                                                                 | 调整线段过程中的吸附半径。                                                                                                |
| removeRedundancies | boolean | `true`                                                                                               | 是否自动移除冗余的路径点。                                                                                                |
| stopPropagation    | boolean | `true`                                                                                               | 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 `mousedown`、`mousemove` 和 `mouseup` 事件。 |

<span class="tag-example">使用</span>

```ts
graph.addEdge({
  ...,
  tools: {
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  },
})
```

<!-- <iframe src="/demos/api/registry/edge-tool/segments"></iframe> -->

### boundary

根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。

<span class="tag-param">参数<span>

| 参数名  | 类型     | 默认值   | 说明               |
| ------- | -------- | -------- | ------------------ |
| tagName | string   | `rect`   | 使用何种图形渲染。 |
| padding | number   | `10`     | 边距。             |
| attrs   | KeyValue | `object` | 图形属性。         |

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

<span class="tag-example">使用</span>

```ts
graph.addEdge({
  ...,
  tools: {
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
})
```

<!-- <iframe src="/demos/api/registry/edge-tool/boundary"></iframe> -->

### button

在指定位置处渲染一个按钮，支持自定义按钮的点击交互。

<span class="tag-param">参数<span>

| 参数名   | 类型                                                                 | 默认值      | 说明                           |
| -------- | -------------------------------------------------------------------- | ----------- | ------------------------------ |
| distance | number                                                               | `undefined` | 偏离起点的距离或比例。         |
| offset   | number \| Point.PointLike                                            | `0`         | 在 `distance` 基础上的偏移量。 |
| rotate   | boolean                                                              | `undefined` | 是否跟随边旋转。               |
| markup   | Markup.JSONMarkup                                                    | `undefined` | 渲染按钮的 Markup 定义。       |
| onClick  | (args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void | `undefined` | 点击按钮的回调函数。           |

<span class="tag-example">使用</span>

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'button',
      args: {
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attrs: {
              r: 18,
              stroke: '#fe854f',
              'stroke-width': 2,
              fill: 'white',
              cursor: 'pointer',
            },
          },
          {
            tagName: 'text',
            textContent: 'Btn B',
            selector: 'icon',
            attrs: {
              fill: '#fe854f',
              'font-size': 10,
              'text-anchor': 'middle',
              'pointer-events': 'none',
              y: '0.3em',
            },
          },
        ],
        distance: -40,
        onClick({ view }: any) {
          const edge = view.cell
          const source = edge.getSource()
          const target = edge.getTarget()
          edge.setSource(target)
          edge.setTarget(source)
        },
      },
    },
    {
      name: 'button',
      args: {
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attrs: {
              r: 18,
              stroke: '#fe854f',
              'stroke-width': 2,
              fill: 'white',
              cursor: 'pointer',
            },
          },
          {
            tagName: 'text',
            textContent: 'Btn A',
            selector: 'icon',
            attrs: {
              fill: '#fe854f',
              'font-size': 10,
              'text-anchor': 'middle',
              'pointer-events': 'none',
              y: '0.3em',
            },
          },
        ],
        distance: -100,
        offset: { x: 0, y: 20 },
        onClick({ view }: any) {
          const edge = view.cell
          edge.attr({
            line: {
              strokeDasharray: '5, 1',
              strokeDashoffset:
                (edge.attr('line/strokeDashoffset') | 0) + 20,
            },
          })
        },
      },
    },
  ],
})
```

<!-- <iframe src="/demos/api/registry/edge-tool/button"></iframe> -->

### button-remove

在指定的位置处，渲染一个删除按钮，点击时删除对应的边。

<span class="tag-param">参数<span>

| 参数名   | 类型                                                                 | 默认值      | 说明                           |
| -------- | -------------------------------------------------------------------- | ----------- | ------------------------------ |
| distance | number                                                               | `60`        | 偏离起点的距离或比例。         |
| offset   | number \| Point.PointLike                                            | `0`         | 在 `distance` 基础上的偏移量。 |
| rotate   | boolean                                                              | `undefined` | 是否跟随边旋转。               |
| markup   | Markup.JSONMarkup                                                    | `undefined` | 渲染按钮的 Markup 定义。       |
| onClick  | (args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void | `undefined` | 点击按钮的回调函数。           |

<span class="tag-example">使用</span>

```ts
graph.addEdge({
  ...,
  tools: {
    name: 'button-remove',
    args: { distance: -40 },
  },
})
```

<!-- <iframe src="/demos/api/registry/edge-tool/button-remove"></iframe> -->

### source-arrowhead 和 target-arrowhead

在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。

<span class="tag-param">参数<span>

| 参数名  | 类型             | 默认值   | 说明                 |
| ------- | ---------------- | -------- | -------------------- |
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

<span class="tag-example">使用</span>

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

<!-- <iframe src="/demos/api/registry/edge-tool/arrowhead"></iframe> -->

### edge-editor

提供边上文本编辑功能。

<span class="tag-param">参数<span>

| 参数名                | 类型                                                        | 默认值                         | 说明                                                            |
| --------------------- | ----------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------- |
| event                 | Dom.EventObject                                             | -                              | 触发文本编辑的事件参数                                          |
| labelAddable          | boolean                                                     | true                           | 点击非文本位置是否新建 label                                    |
| attrs/fontSize        | string                                                      | `14`                           | 编辑文本字体大小                                                |
| attrs/color           | string                                                      | `#000`                         | 编辑文本字体颜色                                                |
| attrs/fontFamily      | string                                                      | `Arial, helvetica, sans-serif` | 编辑文本的字体                                                  |
| attrs/backgroundColor | string                                                      | `#fff`                         | 编辑区域的背景色                                                |
| getText               | (this: CellView, args: {cell: Cell}) => string              | -                              | 获取原文本方法，在自定义 `markup` 场景需要自定义 `getText` 方法 |
| setText               | (this: CellView, args: {cell: Cell, value: string}) => void | -                              | 设置新文本，在自定义 `markup` 场景需要自定义 `setText` 方法     |

<span class="tag-example">使用</span>

```ts
// 双击进入编辑模式
graph.on("edge:dblclick", ({ cell, e }) => {
  cell.addTools({
    name: "edge-editor",
    args: {
      event: e,
    },
  });
});
```

<!-- <iframe src="/demos/api/registry/node-tool/editor"></iframe> -->

## registry

我们在 Registry.EdgeTool.registry 对象上提供了注册和取消注册工具的方法，工具实际上是一个继承自 ToolItem 的[视图](/zh/docs/api/view/view)。

```ts
export type Definition =
  | typeof ToolItem
  | (new (options: ToolItem.Options) => ToolItem);
```

例如，上面提到的 `'button'` 工具的对应的定义为

```ts
export class Button extends ToolsView.ToolItem<EdgeView | NodeView, Button.Options> {
  protected onRender() { ... }
  protected onMouseDown() { ... }
}
```

创建工具类之后就可以使用下面的 `register` 方法来注册到系统中。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册工具。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册工具。

实际上，我们将 `registry` 对象的 `register` 和 `unregister` 方法分别挂载为 `Graph` 的两个静态方法 `Graph.registerEdgeTool` 和 `Graph.unregisterEdgeTool`，看下面使用示例。

### 自定义工具

场景一：继承 `ToolItem` 实现一个工具类，难度较高，要求对[视图基类](/zh/docs/api/view/view)和 `ToolItem` 类都有所了解，可以参考上述内置工具的源码，这里不展开叙述。

```ts
Graph.registerEdgeTool("button", Button);
```

场景二：继承已经注册的工具，为继承的工具指定默认选项或者默认样式。我们在 `ToolItem` 基类上提供了一个静态方法 `define` 来快速实现继承并配置默认选项。

```ts
import { Vertices } from "@antv/x6/es/registry/tool/vertices";

const RedVertices = Vertices.define<Vertices.Options>({
  name: "red-vertices", // 工具名称，可省略，指定后其大驼峰形式同时作为继承的类的类名。
  attrs: {
    fill: "red",
  },
});

Graph.registerEdgeTool("red-vertices", RedVertices, true);
```

<!-- <iframe src="/demos/api/registry/edge-tool/custom-vertices"></iframe> -->

同时，我们为 `Graph.registerEdgeTool` 方法提供了一种快速继承并指定默认选项的实现：

```ts
Graph.registerEdgeTool('red-vertices', {
  'red-vertices',     // 工具名称，可省略，指定后其大驼峰形式同时作为继承的类的类名。
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

<!-- <iframe src="/demos/api/registry/edge-tool/custom-arrowhead"></iframe> -->
