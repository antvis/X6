---
title: 常见交互
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

X6 最吸引开发者的地方是具备非常完整的交互定制能力，在此基础上，我们可以实现非常多的复杂效果。下面列举常见的交互行为。

## 连线

通过配置 `connecting` 可以实现丰富的连线交互。使用方式如下：

```typescript
const graph = new Graph({
  ...,
  connecting: {
    snap: true,
  }
})
```

下面分别介绍 `connecting` 支持的配置。

### snap

```typescript
snap: boolean | { radius: number }
```

当 `snap` 设置为 `true` 或者 `false` 代表开启和关闭连线过程中自动吸附，开启时距离目标 `50px` 是触发吸附。可以通过配置 `radius` 属性来自定义吸附半径。

```ts
const graph = new Graph({
  connecting: {
    snap: true,
  },
});
// 等价于
const graph = new Graph({
  connecting: {
    snap: {
      radius: 50,
    },
  },
});
```

### allowBlank

```typescript
allowBlank: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

是否允许连接到画布空白位置的点，默认为 `true`，也支持通过函数的方式来动态调整。

```typescript
const graph = new Graph({
  connecting: {
    allowBlank() {
      // 根据条件返回 true or false
      return true
    }
  },
});
```

### allowLoop

```typescript
allowLoop: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 `true` 。

### allowNode

```typescript
allowNode: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

是否允许边连接到节点（非节点上的连接桩），默认为 `true` 。

### allowEdge

```typescript
allowEdge: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

是否允许边链接到另一个边，默认为 `true` 。

### allowPort

```typescript
allowPort: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

是否允许边链接到连接桩，默认为 `true` 。

### allowMulti

```typescript
allowMulti: boolean | 'withPort' | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

是否允许在相同的起始节点和终止之间创建多条边，默认为 `true` 。当设置为 `false` 时，在起始和终止节点之间只允许创建一条边，当设置为 `'withPort'` 时，在起始和终止节点的相同连接桩之间只允许创建一条边（即，起始和终止节点之间可以创建多条边，但必须要要链接在不同的连接桩上）。

### highlight

```typescript
highlight: boolean
```

拖动边时，是否高亮显示所有可用的连接桩或节点，默认值为 `false` 。一般都会与 [highlighting](/zh/docs/api/interacting/interacting#高亮) 联合使用。

### anchor

```typescript
anchor: NodeAnchorOptions
```

当连接到节点时，通过 [ `anchor` ](/zh/docs/api/registry/node-anchor) 来指定被连接的节点的锚点，默认值为 `center` 。

#### sourceAnchor

```typescript
sourceAnchor?: NodeAnchorOptions
```

当连接到节点时，通过 `sourceAnchor` 来指定源节点的锚点。

### targetAnchor

```typescript
targetAnchor?: NodeAnchorOptions
```

当连接到节点时，通过 `targetAnchor` 来指定目标节点的锚点。

### edgeAnchor

```typescript
edgeAnchor: EdgeAnchorOptions
```

当连接到边时，通过 [ `edgeAnchor` ](/zh/docs/api/registry/edge-anchor) 来指定被连接的边的锚点，默认值为 `ratio` 。

### sourceEdgeAnchor

```typescript
sourceEdgeAnchor?: EdgeAnchorOptions
```

当连接到边时，通过 `sourceEdgeAnchor` 来指定源边的锚点。

### targetEdgeAnchor

```typescript
targetEdgeAnchor?: EdgeAnchorOptions
```

当连接到边时，通过 `targetEdgeAnchor` 来指定目标边的锚点。

### connectNodeStrategy

```typescript
connectNodeStrategy?: 'closest'
```

连接到目标节点的策略，例如 `closest` 策略连线终端就会自动吸附到最近的节点边缘（默认是中心）。

### connectEdgeStrategy

```typescript
connectEdgeStrategy?: 'closest'
```

连接到目标边的策略，例如 `closest` 策略连线终端就会自动吸附到边上最近的点（默认是中心）。

### connectionPoint

```typescript
 connectionPoint: ConnectionPointOptions
```

指定[连接点](/zh/docs/api/registry/connector)，默认值为 `boundary` 。

### sourceConnectionPoint

```typescript
 sourceConnectionPoint?: ConnectionPointOptions
```

连接源的连接点。

### targetConnectionPoint

```typescript
 targetConnectionPoint?: ConnectionPointOptions
```

连接目标的连接点。

### router

```typescript
router: string | Router.NativeItem | Router.ManaualItem
```

[路由](/zh/docs/api/registry/router)将边的路径点 `vertices` 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点，默认值为 `normal` 。

### connector

```typescript
connector: string | Connector.NativeItem | Connector.ManaualItem
```

[连接器](/zh/docs/api/registry/connector)将起点、路由返回的点、终点加工为 <path> 元素的 d 属性，决定了边渲染到画布后的样式，默认值为 `normal` 。

### createEdge

```typescript
createEdge?: (
  this: Graph,
  args: {
    sourceCell: Cell
    sourceView: CellView
    sourceMagnet: Element
  },
) => Nilable<Edge> | void
```

通过该方法可以自定义新建的边的样式。

### validateMagnet

```typescript
validateMagnet?: (
  this: Graph,
  args: {
    cell: Cell
    view: CellView
    magnet: Element
    e: Dom.MouseDownEvent | Dom.MouseEnterEvent
  },
) => boolean
```

点击 `magnet` 时 根据 `validateMagnet` 返回值来判断是否新增边，触发时机是 `magnet` 被按下，如果返回 `false` ，则没有任何反应，如果返回 `true` ，会在当前 `magnet` 创建一条新的边。

### validateConnection

```typescript
validateConnection: (this: Graph, args: ValidateConnectionArgs) => boolean
```

在移动边的时候判断连接是否有效，如果返回 `false` ，当鼠标放开的时候，不会连接到当前元素，否则会连接到当前元素。

### validateEdge

```typescript
validateEdge?: (
  this: Graph,
  args: {
    edge: Edge
    type: Edge.TerminalType
    previous: Edge.TerminalData
  },
) => boolean
```

当停止拖动边的时候根据 `validateEdge` 返回值来判断边是否生效，如果返回 `false` , 该边会被清除。

## 组合

通过 `embedding` 可以将一个节点拖动到另一个节点中，使其成为另一节点的子节点，默认禁用。支持的配置如下：

### enabled

```typescript
enabled?: boolean
```

是否允许节点之间嵌套，默认值为 `false` 。

### findParent

```typescript
findParent?:
  | 'bbox'
  | 'center'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | ((this: Graph, args: { node: Node; view: NodeView }) => Cell[])
```

在节点被移动时通过 `findParent` 指定的方法返回父节点。默认值为 `bbox` 。

### frontOnly

```typescript
frontOnly?: boolean
```

如果 `frontOnly` 为 `true` ，则只能嵌入显示在最前面的节点，默认值为 `true` 。

### validate

```typescript
validate: (
  this: Graph,
  args: {
    child: Node
    parent: Node
    childView: CellView
    parentView: CellView
  },
) => boolean
```

`validate` 为判断节点能否被嵌入父节点的函数，默认返回 `true` 。

## 限制

限制节点和边的交互行为，`interacting` 支持的配置如下：

```typescript
export type Interacting =
  | boolean
  | InteractionMap
  | ((this: Graph, cellView: CellView) => InteractionMap | boolean)
```

* `boolean` 节点或边是否可交互
* `InteractionMap` 节点或边的交互细节，支持以下属性：
  + `'nodeMovable'` 节点是否可以被移动。
  + `'magnetConnectable'` 当在具有 `'magnet'` 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
  + `'edgeMovable'` 边是否可以被移动。
  + `'edgeLabelMovable'` 边的标签是否可以被移动。
  + `'arrowheadMovable'` 边的起始/终止箭头是否可以被移动。
  + `'vertexMovable'` 边的路径点是否可以被移动。
  + `'vertexAddable'` 是否可以添加边的路径点。
  + `'vertexDeletable'` 边的路径点是否可以被删除。
* `(this: Graph, cellView: CellView) => InteractionMap | boolean`

```ts
const graph = new Graph({
  container: this.container,
  width: 800,
  height: 1400,
  grid: 10,
  interacting: function (cellView: CellView) {
    if (cellView.cell.getProp("customLinkInteractions")) {
      return { vertexAdd: false };
    }
    return true;
  },
});
```

## 高亮

可以通过 `highlighting` 选项来指定触发某种交互时的高亮样式，如：

```ts
new Graph({
  highlighting: {
    // 当连接桩可以被链接时，在连接桩外围渲染一个 2px 宽的红色矩形框
    magnetAvailable: {
      name: "stroke",
      args: {
        padding: 4,
        attrs: {
          "stroke-width": 2,
          stroke: "red",
        },
      },
    },
  },
});
```

支持的 `highlighting` 配置项有：

* `'default'` 默认高亮选项，当以下几种高亮配置缺省时被使用。
* `'embedding'` 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用。
* `'nodeAvailable'` 连线过程中，节点可以被链接时被使用。
* `'magnetAvailable'` 连线过程中，连接桩可以被链接时被使用。
* `'magnetAdsorbed'` 连线过程中，自动吸附到连接桩时被使用。

上面 `magnetAvailable.name` 其实是高亮器的名称，X6 内置了 `stroke` 和 `className` 两种高亮器，详细信息参考 [Highlighter](/zh/docs/api/registry/highlighter)。

## 移动范围

可以在全局配置 `translating` 来限制节点的移动范围。

```ts
const graph = new Graph({
  translating: {
    restrict: true,
  },
})
```

### restrict

节点的可移动范围。支持以下两种方式：

* `boolean` 如果设置为 `true`, 节点不能移动超出画布区域
* `Rectangle.RectangleLike | (arg: CellView) => Rectangle.RectangleLike` 指定一个节点的移动范围

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
