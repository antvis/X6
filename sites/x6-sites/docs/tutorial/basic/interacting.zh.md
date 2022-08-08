---
title: 节点和边的交互
order: 17
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

## 调整节点大小

可以在全局配置 `resizing` 来启用调整节点大小的功能。

```ts
const graph = new Graph({
  resizing: {
    enabled: true,
  },
})
```
### 演示

<iframe src="/demos/tutorial/intermediate/interacting/resizing"></iframe>

### 选项

#### enabled

是否支持调整节点大小，默认为 `false`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### minWidth

最小的调整宽度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### maxWidth

最大的调整宽度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### minHeight

最小的调整高度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### maxHeight

最大的调整高度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### orthogonal

是否显示中间调整点，默认为 `true`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### restricted

调整大小边界是否可以超出画布边缘，默认为 `false`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### autoScroll

是否自动滚动画布，仅当开启 Srcoller 并且 `restricted` 为 `false` 时有效，默认为 `true`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### preserveAspectRatio

调整大小过程中是否保持节点的宽高比例，默认为 `false`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### allowReverse

到达最小宽度或者高度时是否允许控制点反向拖动，默认为 `true`。

## 调整节点旋转角度

可以在全局配置 `rotating` 来启用调整节点角度的功能。

```ts
const graph = new Graph({
  rotating: {
    enabled: true,
  },
})
```
### 演示

<iframe src="/demos/tutorial/intermediate/interacting/rotating"></iframe>

### 选项

#### enabled

是否支持调整节点角度，默认为 `false`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### grid

每次旋转的角度，默认值为 `15`。支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

## 限制节点移动

可以在全局配置 `translating` 来限制节点的移动范围

```ts
const graph = new Graph({
  translating: {
    restrict: true,
  },
})
```

### 选项

#### restrict

节点的可移动范围。支持以下两种方式：

- `boolean` 如果设置为 `true`, 节点不能移动超出画布区域
- `Rectangle.RectangleLike | (arg: CellView) => Rectangle.RectangleLike` 指定一个节点的移动范围

```ts
const graph = new Graph({
  translating: {
    restrict: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    }
  }
})
```

## 连线规则

我们可以在全局配置 `connecting` 来对连线过程进行控制。连线的规则很多，先看一个例子：

<iframe src="/demos/tutorial/intermediate/interacting/connecting"></iframe>

### 选项

#### snap

当 `snap` 设置为 `true` 时连线的过程中距离节点或者连接桩 `50px` 时会触发自动吸附，可以通过配置 `radius` 属性自定义触发吸附的距离。当 `snap` 设置为 `false` 时不会触发自动吸附。默认值为 `false`。

```ts
const graph = new Graph({
  connecting: {
    snap: true,
  }
})
// 等价于
const graph = new Graph({
  connecting: {
    snap: {
      radius: 50,
    },
  }
})
```

#### allowBlank

是否允许连接到画布空白位置的点，默认为 `true`。支持以下两种形式：

- `boolean`
- `((this: Graph, args: ValidateConnectionArgs) => boolean)`

#### allowMulti

是否允许在相同的起始节点和终止之间创建多条边，默认为 `true`。当设置为 `false` 时，在起始和终止节点之间只允许创建一条边，当设置为 `'withPort'` 时，在起始和终止节点的相同链接桩之间只允许创建一条边（即，起始和终止节点之间可以创建多条边，但必须要要链接在不同的链接桩上）。支持以下三种形式：

- `boolean`
- `withPort`
- `((this: Graph, args: ValidateConnectionArgs) => boolean)`

#### allowLoop

是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 `true`。支持以下两种形式：

- `boolean`
- `((this: Graph, args: ValidateConnectionArgs) => boolean)`

#### allowNode

是否允许边链接到节点（非节点上的链接桩），默认为 `true`。支持以下两种形式：

- `boolean`
- `((this: Graph, args: ValidateConnectionArgs) => boolean)`

#### allowEdge

是否允许边链接到另一个边，默认为 `true`。支持以下两种形式：

- `boolean`
- `((this: Graph, args: ValidateConnectionArgs) => boolean)`

#### allowPort

是否允许边链接到链接桩，默认为 `true`。支持以下两种形式：

- `boolean`
- `((this: Graph, args: ValidateConnectionArgs) => boolean)`

#### highlight

拖动边时，是否高亮显示所有可用的连接桩或节点，默认值为 `false`。

#### anchor

当连接到节点时，通过 [`anchor`](/zh/docs/api/registry/node-anchor) 来指定被连接的节点的锚点，默认值为 `center`。

#### sourceAnchor

当连接到节点时，通过 `sourceAnchor` 来指定源节点的锚点。

#### targetAnchor

当连接到节点时，通过 `targetAnchor` 来指定目标节点的锚点。

#### edgeAnchor

当连接到边时，通过 [`edgeAnchor`](/zh/docs/api/registry/edge-anchor) 来指定被连接的边的锚点，默认值为 `ratio`。

#### sourceEdgeAnchor

当连接到边时，通过 `sourceEdgeAnchor` 来指定源边的锚点。

#### targetEdgeAnchor

当连接到边时，通过 `targetEdgeAnchor` 来指定目标边的锚点。

#### connectionPoint

指定[连接点](/zh/docs/api/registry/connector)，默认值为 `boundary`。

#### sourceConnectionPoint

连接源的连接点。

#### targetConnectionPoint

连接目标的连接点。

#### router

[路由](/zh/docs/api/registry/router)将边的路径点 `vertices` 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点，默认值为 `normal`。

#### connector

[连接器](/zh/docs/api/registry/connector)将起点、路由返回的点、终点加工为 <path> 元素的 d 属性，决定了边渲染到画布后的样式，默认值为 `normal`。

#### createEdge

从 `magnet=true` 的元素拖拽出新的边的时候，可以自定义边的样式：

```ts
createEdge() {
  return this.createEdge({
    shape: 'edge',
    attrs: {
      line: {
        stroke: 'red'
      }
    }
  })
}
```

#### validateMagnet

点击 `magnet` 时 根据 `validateMagnet` 返回值来判断是否新增边，触发时机是 `magnet` 被按下，如果返回 `false`，则没有任何反应，如果返回 `true`，会在当前 `magnet` 创建一条新的边。

```ts
validateMagnet({ e, magnet, view, cell }) {
  return false
}
```

#### validateConnection

在移动边的时候判断连接是否有效，如果返回 `false`，当鼠标放开的时候，不会连接到当前元素，否则会连接到当前元素。

```ts
validateConnection({
  edge,
  edgeView,
  sourceView,
  targetView,
  sourcePort,
  targetPort,
  sourceMagnet,
  targetMagnet,
  sourceCell,
  targetCell,
  type 
}){
  return false
}
```

#### validateEdge

当停止拖动边的时候根据 `validateEdge` 返回值来判断边是否生效，如果返回 `false`, 该边会被清除。

```ts
validateEdge({ edge, type, previous }) {
  return false
}
```

## 定制交互行为

可以在全局配置 `interacting` 定制节点和边的交互行为，`interacting` 的类型定义如下：

```ts
const graph = new Graph({
  container: this.container,
  width: 800,
  height: 1400,
  grid: 10,
  interacting: function (cellView: CellView) {
    if (cellView.cell.getData().disableMove) {
      return { nodeMovable: false }
    }
    return true
  },
})
```

`interacting` 的配置支持下面三种方式：

- `boolean`  节点或边是否可交互
- `InteractionMap` 节点或边的交互细节，支持以下属性，每个属性支持`boolean` 和 `(this: Graph, cellView: CellView) => boolean` 两种定义：
  - `'nodeMovable'` 节点是否可以被移动。
  - `'magnetConnectable'` 当在具有 `'magnet'` 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
  - `'edgeMovable'` 边是否可以被移动。
  - `'edgeLabelMovable'` 边的标签是否可以被移动。
  - `'arrowheadMovable'` 边的起始/终止箭头是否可以被移动。
  - `'vertexMovable'` 边的路径点是否可以被移动。
  - `'vertexAddable'` 是否可以添加边的路径点。
  - `'vertexDeletable'` 边的路径点是否可以被删除。
- `(this: Graph, cellView: CellView) => InteractionMap | boolean`


