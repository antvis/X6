---
title: NodeTool
order: 24
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

节点小工具是一些渲染在节点上的一些小组件，这些小工具通常都附带一些交互功能，如删除按钮，点击按钮时删除对应的节点。我们可以根据下面的一些场景来添加或删除小工具。

场景一：添加指定的小工具。

```ts
// 创建节点时添加小工具
graph.addNode({
  ...,
  tools: [
    {
      name: 'button-remove',
      args: { x: 10, y: 10 },
    },
  ],
})

// 创建节点后添加小工具
node.addTools([
  {
    name: 'button-remove',
    args: { x: 10, y: 10 },
  },
])
```

场景二：动态添加/删除小工具。

```ts
graph.on("node:mouseenter", ({ node }) => {
  node.addTools([
    {
      name: "button-remove",
      args: { x: 10, y: 10 },
    },
  ]);
});

graph.on("node:mouseleave", ({ node }) => {
  if (node.hasTool("button-remove")) {
    node.removeTool("button-remove");
  }
});
```

在 X6 中默认提供了以下几个用于节点的小工具：

- [button](#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。
- [boundary](#boundary) 根据节点的包围盒渲染一个包围节点的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [node-editor](#node-editor) 提供节点文本编辑功能。

## presets

### button

在指定位置处渲染一个按钮，支持自定义按钮的点击交互。

<span class="tag-param">参数<span>

| 参数名  | 类型                                                                 | 默认值      | 说明                                                      |
| ------- | -------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| x       | number \| string                                                     | `0`         | 相对于节点的左上角 X 轴的坐标，小数和百分比表示相对位置。 |
| y       | number \| string                                                     | `0`         | 相对于节点的左上角 Y 轴的坐标，小数和百分比表示相对位置。 |
| offset  | number \| { x: number, y: number }                                   | `0`         | 在 `x` 和 `y` 基础上的偏移量。                            |
| rotate  | boolean                                                              | `undefined` | 是否跟随节点旋转。                                        |
| markup  | Markup.JSONMarkup                                                    | `undefined` | 渲染按钮的 Markup 定义。                                  |
| onClick | (args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void | `undefined` | 点击按钮的回调函数。                                      |

<span class="tag-example">使用</span>

```ts
const source = graph.addNode({
  ...,
  // 添加一个始终显示的按钮
  tools: [
    {
      name: 'button',
      args: {
        markup: ...,
        x: '100%',
        y: '100%',
        offset: { x: -18, y: -18 },
        onClick({ view }) { ... },
      },
    },
  ],
})

// ...

// 鼠标 Hover 时添加按钮
graph.on('node:mouseenter', ({ node }) => {
  if (node === target) {
    node.addTools({
      name: 'button',
      args: {
        markup: ...,
        x: 0,
        y: 0,
        offset: { x: 18, y: 18 },
        onClick({ view }) { ... },
      },
    })
  }
})

// 鼠标移开时删除按钮
graph.on('node:mouseleave', ({ node }) => {
  if (node === target) {
    node.removeTools()
  }
})
```

<!-- <iframe src="/demos/api/registry/node-tool/button"></iframe> -->

### button-remove

在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。

<span class="tag-param">参数<span>

| 参数名  | 类型                                                                 | 默认值      | 说明                                                      |
| ------- | -------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| x       | number \| string                                                     | `0`         | 相对于节点的左上角 X 轴的坐标，小数和百分比表示相对位置。 |
| y       | number \| string                                                     | `0`         | 相对于节点的左上角 Y 轴的坐标，小数和百分比表示相对位置。 |
| offset  | number \| { x: number, y: number }                                   | `0`         | 在 `distance` 基础上的偏移量。                            |
| rotate  | boolean                                                              | `undefined` | 是否跟随边旋转。                                          |
| markup  | Markup.JSONMarkup                                                    | `undefined` | 渲染按钮的 Markup 定义。                                  |
| onClick | (args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void | `undefined` | 点击按钮的回调函数。                                      |

<span class="tag-example">使用</span>

```ts
const source = graph.addNode({
  ...,
  // 添加一个始终显示的删除按钮
  tools: [
    {
      name: 'button-remove',
      args: {
        x: '100%',
        y: 0,
        offset: { x: -10, y: 10 },
      },
    },
  ],
})

// 鼠标 Hover 时添加删除按钮
graph.on('node:mouseenter', ({ node }) => {
  if (node === target) {
    node.addTools({
      name: 'button-remove',
      args: {
        x: 0,
        y: 0,
        offset: { x: 10, y: 10 },
      },
    })
  }
})

// 鼠标移开时删除删除按钮
graph.on('node:mouseleave', ({ node }) => {
  if (node === target) {
    node.removeTools()
  }
})
```

<!-- <iframe src="/demos/api/registry/node-tool/button-remove"></iframe> -->

### boundary

根据节点的包围盒渲染一个包围节点的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。

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
const source = graph.addNode({
  ...,
  tools: [
    {
      name: 'boundary',
      args: {
        padding: 5,
        attrs: {
          fill: '#7c68fc',
          stroke: '#333',
          'stroke-width': 1,
          'fill-opacity': 0.2,
        },
      },
    },
  ],
})
```

<!-- <iframe src="/demos/api/registry/node-tool/boundary"></iframe> -->

### node-editor

提供节点上文本编辑功能。

<span class="tag-param">参数<span>

| 参数名                | 类型                                                        | 默认值                         | 说明                                                            |
| --------------------- | ----------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------- |
| event                 | Dom.EventObject                                             | -                              | 触发文本编辑的事件参数                                          |
| attrs/fontSize        | string                                                      | `14`                           | 编辑文本字体大小                                                |
| attrs/color           | string                                                      | `#000`                         | 编辑文本字体颜色                                                |
| attrs/fontFamily      | string                                                      | `Arial, helvetica, sans-serif` | 编辑文本的字体                                                  |
| attrs/backgroundColor | string                                                      | `#fff`                         | 编辑区域的背景色                                                |
| getText               | (this: CellView, args: {cell: Cell}) => string              | -                              | 获取原文本方法，在自定义 `markup` 场景需要自定义 `getText` 方法 |
| setText               | (this: CellView, args: {cell: Cell, value: string}) => void | -                              | 设置新文本，在自定义 `markup` 场景需要自定义 `setText` 方法     |

<span class="tag-example">使用</span>

```ts
// 双击进入编辑模式
graph.on("node:dblclick", ({ node, e }) => {
  node.addTools({
    name: "node-editor",
    args: {
      event: e,
    },
  });
});
```

<!-- <iframe src="/demos/api/registry/node-tool/editor"></iframe> -->

## registry

我们在 Registry.NodeTool.registry 对象上提供了注册和取消注册工具的方法，工具实际上是一个继承自 ToolItem 的[视图](/zh/docs/api/view/view)。

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

实际上，我们将 `registry` 对象的 `register` 和 `unregister` 方法分别挂载为 `Graph` 的两个静态方法 `Graph.registerNodeTool` 和 `Graph.unregisterNodeTool`，看下面使用示例。

### 自定义工具

场景一：继承 `ToolItem` 实现一个工具类，难度较高，要求对[视图基类](/zh/docs/api/view/view)和 `ToolItem` 类都有所了解，可以参考上述内置工具的源码，这里不展开叙述。

```ts
Graph.registerNodeTool("button", Button);
```

场景二：继承已经注册的工具，为继承的工具指定默认选项或者默认样式。我们在 `ToolItem` 基类上提供了一个静态方法 `define` 来快速实现继承并配置默认选项。

```ts
const MyButton = Button.define<Button.Options>({
  name: 'my-btn', // 工具名称，可省略，指定后其大驼峰形式同时作为继承的类的类名。
  markup: ...,
  onClick({ view }) { ... },
})

Graph.registerNodeTool('my-btn', MyButton, true)
```

同时，我们为 `Graph.registerNodeTool` 方法提供了一种快速继承并指定默认选项的实现：

```ts
Graph.registerNodeTool('my-btn', {
  'my-btn',         // 工具名称，可省略，指定后其大驼峰形式同时作为继承的类的类名。
  inherit:'button', // 基类名称，使用已经注册的工具名称。
  markup: ...,
  onClick: ...,
})
```

<!-- <iframe src="/demos/api/registry/node-tool/custom-button"></iframe> -->
