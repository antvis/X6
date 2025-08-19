---
title: Interaction
order: 6
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/model
---

One of the most appealing aspects of X6 for developers is its comprehensive interaction customization capabilities, which allow us to achieve a wide range of complex effects. Below are some common interactive behaviors.

## Connecting

By configuring `connecting`, you can achieve rich connection interactions. The usage is as follows:

```typescript
const graph = new Graph({
  ...,
  connecting: {
    snap: true,
  }
})
```

Below are the configurations supported by `connecting`.

### snap

```typescript
snap: boolean | { radius: number, anchor: 'center' | 'bbox' }
```

When `snap` is set to `true` or `false`, it represents enabling or disabling automatic snapping during the connection process. When enabled, a distance of `50px` from the target will trigger the snap. You can customize the snap radius by configuring the `radius` property.

```ts
const graph = new Graph({
  connecting: {
    snap: true,
  },
})
// Equivalent to
const graph = new Graph({
  connecting: {
    snap: {
      radius: 50,
    },
  },
})
```

When calculating the distance to determine if it snaps to a node, it defaults to the center of the node. You can change this to calculate the distance based on the bounding box of the node by configuring `anchor` to `bbox`.

### allowBlank

```typescript
allowBlank: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

Whether to allow connections to blank areas of the canvas. The default is `true`, and it also supports dynamic adjustment through a function.

```typescript
const graph = new Graph({
  connecting: {
    allowBlank() {
      // Return true or false based on conditions
      return true
    },
  },
})
```

### allowLoop

```typescript
allowLoop: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

Whether to allow the creation of loop connections, where the starting and ending nodes are the same. The default is `true`.

### allowNode

```typescript
allowNode: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

Whether to allow edges to connect to nodes (not connection ports on nodes). The default is `true`.

### allowEdge

```typescript
allowEdge: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

Whether to allow edges to connect to other edges. The default is `true`.

### allowPort

```typescript
allowPort: boolean | ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

Whether to allow edges to connect to connection ports. The default is `true`.

### allowMulti

```typescript
allowMulti: boolean |
  'withPort' |
  ((this: Graph, args: ValidateConnectionArgs) => boolean)
```

Whether to allow multiple edges to be created between the same starting and ending nodes. The default is `true`. When set to `false`, only one edge is allowed between the starting and ending nodes. When set to `'withPort'`, only one edge is allowed between the same connection ports of the starting and ending nodes (i.e., multiple edges can be created between the starting and ending nodes, but they must connect at different ports).

### highlight

```typescript
highlight: boolean
```

Whether to highlight all available connection ports or nodes while dragging an edge. The default value is `false`. This is generally used in conjunction with [highlighting](/en/api/interacting/interacting#highlighting)highlighting
### anchor

```typescript
anchor: NodeAnchorOptions
```

When connecting to a node, the anchor point of the connected node is specified through [ `anchor` ](/en/api/registry/node-anchor), with the default value being `center`.

#### sourceAnchor

```typescript
sourceAnchor?: NodeAnchorOptions
```

When connecting to a node, the anchor point of the source node is specified through `sourceAnchor`.

### targetAnchor

```typescript
targetAnchor?: NodeAnchorOptions
```

When connecting to a node, the anchor point of the target node is specified through `targetAnchor`.

### edgeAnchor

```typescript
edgeAnchor: EdgeAnchorOptions
```

When connecting to an edge, the anchor point of the connected edge is specified through [ `edgeAnchor` ](/en/api/registry/edge-anchor), with the default value being `ratio`.

### sourceEdgeAnchor

```typescript
sourceEdgeAnchor?: EdgeAnchorOptions
```

When connecting to an edge, the anchor point of the source edge is specified through `sourceEdgeAnchor`.

### targetEdgeAnchor

```typescript
targetEdgeAnchor?: EdgeAnchorOptions
```

When connecting to an edge, the anchor point of the target edge is specified through `targetEdgeAnchor`.

### connectionPoint

```typescript
connectionPoint: ConnectionPointOptions
```

Specifies the [connection point](/en/api/registry/connector), with the default value being `boundary`.

### sourceConnectionPoint

```typescript
sourceConnectionPoint?: ConnectionPointOptions
```

The connection point of the source.

### targetConnectionPoint

```typescript
targetConnectionPoint?: ConnectionPointOptions
```

The connection point of the target.

### router

```typescript
router: string | Router.NativeItem | Router.ManaualItem
```

The [router](/en/api/registry/router) further processes the edge's path points `vertices`, adding extra points if necessary, and returns the processed points. The default value is `normal`.

### connector

```typescript
connector: string | Connector.NativeItem | Connector.ManaualItem
```

The [connector](/en/api/registry/connector) processes the starting point, the points returned by the router, and the endpoint into the `d` attribute of the `path` element, determining the style of the edge after rendering on the canvas. The default value is `normal`.

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

This method allows you to customize the style of the newly created edge.

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

When clicking on a `magnet`, the return value of `validateMagnet` determines whether to add a new edge. The trigger occurs when the `magnet` is pressed. If it returns `false`, there is no response; if it returns `true`, a new edge will be created at the current `magnet`.

### validateConnection

```typescript
validateConnection: (this: Graph, args: ValidateConnectionArgs) => boolean
```

When moving an edge, this checks if the connection is valid. If it returns `false`, the edge will not connect to the current element when the mouse is released; otherwise, it will connect.

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

When stopping the drag of an edge, this checks if the edge is valid based on the return value of `validateEdge`. If it returns `false`, the edge will be removed.

## Embedding

By using `embedding`, you can drag a node into another node, making it a child of the other node. This feature is disabled by default. The supported configurations are as follows:

### enabled

```typescript
enabled?: boolean
```

Whether to allow nesting between nodes. The default value is `false`.

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

When a node is moved, the method specified by `findParent` returns the parent node. The default value is `bbox`.

### frontOnly

```typescript
frontOnly?: boolean
```

If `frontOnly` is `true`, only nodes displayed in the front can be embedded. The default value is `true`.

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

`validate` is a function that determines whether a node can be embedded in a parent node. The default return value is `true`.

## Restrictions

Limit the interaction behavior of nodes and edges. The `interacting` configuration supports the following:

```typescript
export type Interacting =
  | boolean
  | InteractionMap
  | ((this: Graph, cellView: CellView) => InteractionMap | boolean)
```

- `boolean`: Whether the node or edge is interactive.
- `InteractionMap`: Interaction details for the node or edge, supporting the following properties:
  - `'nodeMovable'`: Whether the node can be moved.
  - `'magnetConnectable'`: Whether to trigger connection interactions when dragging starts on elements with the `'magnet'` attribute.
  - `'edgeMovable'`: Whether the edge can be moved.
  - `'edgeLabelMovable'`: Whether the edge's label can be moved.
  - `'arrowheadMovable'`: Whether the starting/ending arrow of the edge can be moved.
  - `'vertexMovable'`: Whether the path points of the edge can be moved.
  - `'vertexAddable'`: Whether path points can be added to the edge.
  - `'vertexDeletable'`: Whether path points can be deleted from the edge.
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

## Highlighting

You can specify the highlighting style triggered by certain interactions through the `highlighting` option, such as:

```ts
new Graph({
  highlighting: {
    // When connection ports are available for linking, render a 2px wide red rectangle around the port
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          'stroke-width': 2,
          stroke: 'red',
        },
      },
    },
  },
})
```

The supported `highlighting` configuration options include:

- `'default'`: Default highlighting options used when the following highlighting configurations are absent.
- `'embedding'`: Used when a node can be embedded during the drag operation.
- `'nodeAvailable'`: Used when a node can be linked during the connection process.
- `'magnetAvailable'`: Used when connection ports can be linked during the connection process.
- `'magnetAdsorbed'`: Used when automatically snapping to connection ports during the connection process.

The `magnetAvailable.name` above is actually the name of the highlighter. X6 has built-in highlighters `stroke` and `className`. For more details, refer to [Highlighter](/en/api/registry/highlighter).

## Movement Range

You can globally configure `translating` to limit the movement range of nodes.

```ts
const graph = new Graph({
  translating: {
    restrict: true,
  },
})
```

### restrict

The movable range of nodes. Supports the following two methods:

- `boolean`: If set to `true`, nodes cannot move outside the canvas area.
- `Rectangle.RectangleLike | (arg: CellView) => Rectangle.RectangleLike`: Specify a node's movement range.

```ts
const graph = new Graph({
  translating: {
    restrict: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },
})
```
