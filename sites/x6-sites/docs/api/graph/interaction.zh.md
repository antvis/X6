---
title: Interaction
order: 11
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

### connecting

配置全局的连线规则，支持的选项如下：

```sign
export interface Connecting {
  snap: boolean | { radius: number }
  allowBlank: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
  allowMulti: boolean | 'withPort' | ((this: Graph, args: ValidateConnectionArgs) => boolean)
  allowLoop: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
  allowNode: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
  allowEdge: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
  allowPort: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
  highlight: boolean
  anchor: NodeAnchorOptions
  sourceAnchor?: NodeAnchorOptions
  targetAnchor?: NodeAnchorOptions
  edgeAnchor: EdgeAnchorOptions
  sourceEdgeAnchor?: EdgeAnchorOptions
  targetEdgeAnchor?: EdgeAnchorOptions
  connectionPoint: ConnectionPointOptions
  sourceConnectionPoint?: ConnectionPointOptions
  targetConnectionPoint?: ConnectionPointOptions
  router: string | Router.NativeItem | Router.ManaualItem
  connector: string | Connector.NativeItem | Connector.ManaualItem
  strategy?:
    | string
    | ConnectionStrategy.NativeItem
    | ConnectionPoint.ManaualItem
    | null
  validateMagnet?: (
    this: Graph,
    args: {
      cell: Cell
      view: CellView
      magnet: Element
      e: JQuery.MouseDownEvent
    },
  ) => boolean
  createEdge?: (
    this: Graph,
    args: {
      sourceCell: Cell
      sourceView: CellView
      sourceMagnet: Element
    },
  ) => Nilable<Edge> | void
  validateEdge?: (
    this: Graph,
    args: {
      edge: Edge
      type: Edge.TerminalType
      previous: Edge.TerminalData
    },
  ) => boolean
  validateConnection: (this: Graph, args: ValidateConnectionArgs) => boolean
}
```

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

是否允许连接到画布空白位置的点，默认为 `true`。

#### allowMulti

是否允许在相同的起始节点和终止之间创建多条边，默认为 `true`。当设置为 `false` 时，在起始和终止节点之间只允许创建一条边，当设置为 `'withPort'` 时，在起始和终止节点的相同链接桩之间只允许创建一条边（即，起始和终止节点之间可以创建多条边，但必须要要链接在不同的链接桩上）。

#### allowLoop

是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 `true`。

#### allowNode

是否允许边链接到节点（非节点上的链接桩），默认为 `true`。

#### allowEdge

是否允许边链接到另一个边，默认为 `true`。

#### allowPort

是否允许边链接到链接桩，默认为 `true`。

#### highlight

拖动边时，是否高亮显示所有可用的连接桩或节点，默认值为 `false`。

#### anchor

当连接到节点时，通过 [`anchor`](../registry/node-anchor) 来指定被连接的节点的锚点，默认值为 `center`。

#### sourceAnchor

当连接到节点时，通过 `sourceAnchor` 来指定源节点的锚点。

#### targetAnchor

当连接到节点时，通过 `targetAnchor` 来指定目标节点的锚点。

#### edgeAnchor

当连接到边时，通过 [`edgeAnchor`](../registry/edge-anchor) 来指定被连接的边的锚点，默认值为 `ratio`。

#### sourceEdgeAnchor

当连接到边时，通过 `sourceEdgeAnchor` 来指定源边的锚点。

#### targetEdgeAnchor

当连接到边时，通过 `targetEdgeAnchor` 来指定目标边的锚点。

#### connectionPoint

指定[连接点](../registry/connector)，默认值为 `boundary`。

#### sourceConnectionPoint

连接源的连接点。

#### targetConnectionPoint

连接目标的连接点。

#### router

[路由](../registry/router)将边的路径点 `vertices` 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点，默认值为 `normal`。

#### connector

[连接器](../registry/connector)将起点、路由返回的点、终点加工为 <path> 元素的 d 属性，决定了边渲染到画布后的样式，默认值为 `normal`。

#### validateMagnet

点击 `magnet` 时 根据 `validateMagnet` 返回值来判断是否新增边

#### createEdge

连接的过程中创建新的边

#### validateEdge

当停止拖动边的时候根据 `validateEdge` 返回值来判断边是否生效，如果返回 `false`, 该边会被清除。

#### validateConnection

判断连接是否有效，如果返回 `false` ，连接无效。


### embedding

通过embedding可以将一个节点拖动到另一个节点中，使其成为另一节点的子节点，默认禁用。

支持的选项如下：

```sign
export interface Embedding {
  enabled?: boolean
  findParent?:
    | 'bbox'
    | 'center'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | ((this: Graph, args: { node: Node; view: NodeView }) => Cell[])
  frontOnly?: boolean
  validate: (
    this: Graph,
    args: {
      child: Node
      parent: Node
      childView: CellView
      parentView: CellView
    },
  ) => boolean
}
```

#### enabled

是否允许节点之间嵌套，默认值为 `false`。

#### findParent

在节点被移动时通过 `findParent` 指定的方法返回父节点。默认值为 `bbox`。

#### frontOnly

如果 `frontOnly` 为 `true`，则只能嵌入显示在最前面的节点，默认值为 `true`。

#### validate

`validate` 为判断节点能否被嵌入父节点的函数，默认返回 `true`。

### interacting

定制节点和边的交互行为，支持以下三种类型：

- `boolean`  节点或边是否可交互
- `InteractionMap` 节点或边的交互细节，支持以下属性：
  - `'nodeMovable'` 节点是否可以被移动。
  - `'magnetConnectable'` 当在具有 `'magnet'` 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
  - `'edgeMovable'` 边是否可以被移动。
  - `'edgeLabelMovable'` 边的标签是否可以被移动。
  - `'arrowheadMovable'` 边的起始/终止箭头是否可以被移动。
  - `'vertexMovable'` 边的路径点是否可以被移动。
  - `'vertexAddable'` 是否可以添加边的路径点。
  - `'vertexDeletable'` 边的路径点是否可以被删除。
- `(this: Graph, cellView: CellView) => InteractionMap | boolean`

```ts
const graph = new Graph({
  container: this.container,
  width: 800,
  height: 1400,
  grid: 10,
  interacting: function (cellView: CellView) {
    if (cellView.cell.getProp('customLinkInteractions')) {
      return { vertexAdd: false }
    }
    return true
  },
})
```

### highlighting

可以通过 `highlighting` 选项来指定触发某种交互时的高亮样式，如：

```ts
new Graph({
  highlighting: {
    // 当链接桩可以被链接时，在链接桩外围渲染一个 2px 宽的红色矩形框
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          'stroke-width': 2,
          stroke: 'red',
        }
      },
    },
  },
})
```

支持的 `highlighting` 配置项有：

- `'default'` 默认高亮选项，当以下几种高亮配置缺省时被使用。
- `'embedding'` 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用。
- `'nodeAvailable'` 连线过程中，节点可以被链接时被使用。
- `'magnetAvailable'` 连线过程中，链接桩可以被链接时被使用。
- `'magnetAdsorbed'` 连线过程中，自动吸附到链接桩时被使用。


另外，也可以直接使用在 [`cellView.highlight(...)`](../view/cellview#highlight) 方法中，用来高亮指定的元素。

```ts
cellView.highlight(elem, { 
  highlighter: {
    name: 'stroke',
    args: {
      padding: 4,
      attrs: {
        'stroke-width': 2,
        stroke: 'red',
      }
    },
  },
})
```
