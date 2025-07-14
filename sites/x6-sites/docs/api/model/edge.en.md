---
title: Edge
order: 2
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/model
---

Edge is the base class for edges, inheriting from [Cell](/en/api/model/cell), and defines the common properties and methods for edges.

## Attributes

In addition to inheriting from Cell [attributes](/en/api/model/cell#properties), the following attributes are also supported.

| Option      | Type                     | Default Value | Required | Description                                      |
|-------------|--------------------------|---------------|:--------:|--------------------------------------------------|
| source      | TerminalData             |               |          | Starting point or source node, connection point information. |
| target      | TerminalData             |               |          | End point or target node, connection point information. |
| vertices    | Point.PointLike[]        |               |          | Path points.                                     |
| router      | RouterData               |               |          | Routing.                                         |
| connector   | ConnectorData            |               |          | Connector.                                       |
| labels      | Label[] \| string[]      |               |          | Labels.                                          |
| defaultLabel| Label                    |               |          | Default label.                                   |

### Source and Target

Setting the starting/ending point or source/target node of an edge can be categorized into the following situations:

- **Connecting to a point on the canvas**
  ```ts
  const edge = graph.addEdge({
    source: { x: 40, y: 40 },
    target: { x: 180, y: 80 },
  })
  ```
- **Connecting to nodes/edges**
  ```ts
  const edge = graph.addEdge({
    source: { cell: 'source-cell-id' },
    target: { cell: 'target-cell-id' },
  })
  ```
- **Connecting to connection points on nodes**
  ```ts
  const edge = graph.addEdge({
    source: { cell: 'source-cell-id', port: 'port-id' },
    target: { cell: 'target-cell-id', port: 'port-id' },
  })
  ```
- **Connecting to specific elements on nodes**
  ```ts
  const edge = graph.addEdge({
    source: { cell: 'source-cell-id', selector: 'some-selector' },
    target: { cell: 'target-cell-id', selector: 'some-selector' },
  })
  ```

Additionally, the edge's [anchor points](/en/api/registry/node-anchor) and [connection points](/en/api/registry/connection-point) options together determine the starting and ending points of the edge.

- Starting Point: A reference line is drawn from the first path point or the center of the target node (if there are no path points) to the anchor point of the source node. Then, based on the intersection calculation method specified by the connectionPoint, the intersection of the reference line and the shape is calculated, which becomes the starting point of the edge.
- Ending Point: A reference line is drawn from the last path point or the center of the source node (if there are no path points) to the anchor point of the target node. Then, based on the intersection calculation method specified by the connectionPoint, the intersection of the reference line and the shape is calculated, which becomes the ending point of the edge.

When creating an edge, you can specify anchor points and connection points for `source` and `target` separately.

- **Specifying Anchor Points**
  ```ts
  const edge = graph.addEdge({
    source: {
      cell: 'source-id',
      anchor: {
        name: 'midSide',
        args: {
          dx: 10,
        },
      },
    },
    target: {
      cell: 'target-id',
      anchor: 'orth', // Can be simplified when there are no parameters
    },
  })
  ```
- **Specifying Connection Points**
  ```ts
  const edge = graph.addEdge({
    source: {
      cell: 'source-id',
      connectionPoint: {
        name: 'boundary',
        args: {
          sticky: true,
        },
      },
    },
    target: {
      cell: 'target-id',
      connectionPoint: 'boundary', // Can be simplified when there are no parameters
    },
  })
  ```

### Vertices

The path points `vertices` is an array of points. The edge starts from the starting point, passes through the path points in order, and finally reaches the end point.

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
})
```

### Router

The router `router` will further process the `vertices`, adding additional points if necessary, and return the processed points (excluding the starting and ending points of the edge). For example, after processing with the [`orth`](/en/api/registry/router#orth) router, each link segment of the edge is either horizontal or vertical.

We provide the following default routers.

| Router Name | Description                                      |
|-------------|--------------------------------------------------|
| normal      | [Default router](/en/api/registry/router#normal), returns the path points as is. |
| orth        | [Orthogonal router](/en/api/registry/router#orth), consists of horizontal or vertical orthogonal segments. |
| oneSide     | [Restricted orthogonal router](/en/api/registry/router#oneside), consists of three restricted horizontal or vertical orthogonal segments. |
| manhattan   | [Smart orthogonal router](/en/api/registry/router#manhattan), consists of horizontal or vertical orthogonal segments and automatically avoids other nodes (obstacles) along the path. |
| metro       | [Smart subway line router](/en/api/registry/router#metro), consists of horizontal or vertical orthogonal segments and diagonal segments, similar to a subway map, and automatically avoids other nodes (obstacles) along the path. |
| er          | [Entity-relationship router](/en/api/registry/router#er), consists of `Z` shaped diagonal segments. |

You can specify the router name `name` and router parameters `args` like this:

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: {
    name: 'orth',
    args: {
      padding: 10,
    },
  },
})
```

When there are no router parameters `args`, it can also be simplified to:

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: 'orth',
})
```

In addition to the built-in routers mentioned above, we can also create custom routers and register them for use. For more details, please refer to the [Custom Router](/en/api/registry/router#registry) tutorial.

### Connector

The connector processes the starting point, the points returned by the router, and the ending point into the `d` attribute of the `<path>` element, which determines the style of the edge rendered on the canvas.

We provide the following default connectors.

| Connector Name | Description                                      |
|----------------|--------------------------------------------------|
| normal         | [Simple connector](/en/api/registry/connector#normal), connects the starting point, routing points, and ending point with straight lines. |
| smooth         | [Smooth connector](/en/api/registry/connector#smooth), connects the starting point, routing points, and ending point with cubic Bezier curves. |
| rounded        | [Rounded connector](/en/api/registry/connector#rounded), connects the starting point, routing points, and ending point with straight lines and uses arcs to link at the segment connections (rounded corners). |
| jumpover       | [Jump line connector](/en/api/registry/connector#jumpover), connects the starting point, routing points, and ending point with straight lines and uses jump line symbols at the intersections of edges. |

You can specify the connector name `name` and connector parameters `args` like this:

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: {
    name: 'rounded',
    args: {
      radius: 20,
    },
  },
})
```

When there are no connector parameters `args`, it can also be simplified to:

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: 'rounded',
})
```

In addition to the built-in connectors mentioned above, we can also create custom connectors and register them for use. For more details, please refer to the [Custom Connector](/en/api/registry/connector#registry) tutorial.

### Labels and Default Label

Due to the flexibility of label configuration, we provide a separate tutorial to explain how to use labels. For details, please refer to the [Using Labels](/en/api/model/labels) tutorial.

## Methods

### General

#### isEdge()

```ts
isEdge(): true
```

Determines if it is an edge; this method always returns `true`.

#### getBBox()

```ts
getBBox(): Rectangle
```

Returns the bounding box of the edge.

#### getPolyline()

```ts
getPolyline(): Polyline
```

Returns the line segments composed of endpoints and path points.

#### hasLoop(...)

```ts
hasLoop(options: { deep?: boolean }): boolean
```

Checks if it contains a loop link.

| Name         | Type    | Required | Default Value | Description               |
|--------------|---------|:--------:|---------------|---------------------------|
| options.deep | boolean |          | `false`       | Whether to perform nested checks. |

- When `options.deep` is `false`, it indicates that it is a loop connection only if the starting node and the ending node are the same node.
- When `options.deep` is `true`, it indicates that it is a loop connection if the starting node and the ending node are the same node or if there is a parent-child nesting relationship between the starting node and the ending node.

### Link Terminal

#### getSource()

```ts
getSource(): Edge.TerminalData
```

Gets the starting node/start point information of the edge.

#### getSourceCell()

```ts
getSourceCell(): Cell | null
```

Gets the starting node/edge of the edge; returns `null` if not connected to a node/edge.

#### getSourceNode()

```ts
getSourceNode(): Node | null
```

Gets the starting node of the edge; returns `null` if not connected to a node.

#### getSourceCellId()

```ts
getSourceCellId(): string | null
```

Gets the ID of the starting node/edge of the edge; returns `null` if not connected to a node/edge.

#### getSourcePortId()

```ts
getSourcePortId(): string | null
```

Gets the ID of the starting connection point; returns `null` if not connected to a connection point.

#### getSourcePoint()

```ts
getSourcePoint(): Point.PointLike | null
```

Gets the starting point linked to the canvas; returns `null` when the edge is connected to a node/edge.

#### setSource(...)

```ts
/**
 * Link to a node.
 */
setSource(
  node: Node,
  args?: Edge.SetCellTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * Link to an edge.
 */
setSource(
  edge: Edge,
  args?: Edge.SetEdgeTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * Link to a point on the canvas.
 */
setSource(
  point: Point | Point.PointLike,
  args?: Edge.SetTerminalCommonArgs,
  options?: Edge.SetOptions,
): this

/**
 * Set the starting point or starting node/edge of the edge.
 */
setSource(args: Edge.TerminalData, options?: Edge.SetOptions): this
```

#### getTarget()

```ts
getTarget(): Edge.TerminalData
```

Gets the ending node/end point information of the edge.

#### getTargetCell()

```ts
getTargetCell(): Cell | null
```

Gets the ending node/edge of the edge; returns `null` if not connected to a node/edge.

#### getTargetNode()

```ts
getTargetNode(): Node | null
```

Gets the ending node of the edge; returns `null` if not connected to a node.

#### getTargetCellId()

```ts
getTargetCellId(): string | null
```

Gets the ID of the ending node/edge of the edge; returns `null` if not connected to a node/edge.

#### getTargetPortId()

```ts
getTargetPortId(): string | null
```

Gets the ID of the ending connection point; returns `null` if not connected to a connection point.

#### getTargetPoint()

```ts
getTargetPoint(): Point.PointLike | null
```

Gets the ending point linked to the canvas; returns `null` when the edge is connected to a node/edge.

#### setTarget()

```ts
/**
 * Link to a node.
 */
setTarget(
  edge: Node,
  args?: Edge.SetCellTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * Link to an edge.
 */
setTarget(
  edge: Edge,
  args?: Edge.SetEdgeTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * Link to a point on the canvas.
 */
setTarget(
  point: Point | Point.PointLike,
  args?: Edge.SetTerminalCommonArgs,
  options?: Edge.SetOptions,
): this

/**
 * Set the ending point or ending node/edge of the edge.
 */
setTarget(args: Edge.TerminalData, options?: Edge.SetOptions): this
```

#### disconnect(...)

```ts
disconnect(options?: Edge.SetOptions)
```

Removes the link information of the edge, setting both the starting and ending points to the origin of the canvas `{ x:0, y:0 }`.

| Name | Type | Required | Default Value | Description |
|------|------|:--------:|---------------|-------------|
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:source'` and `'change:target'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

### Path Points Vertice

#### getVertices()

```ts
getVertices(): Point.PointLike[]
```

Gets the path points; returns an empty array if there are no path points.

#### setVertices(...)

```ts
setVertices(
  vertices: Point.PointLike | Point.PointLike[],
  options?: Edge.SetOptions,
): this
```

Sets the path points.

| Name | Type                     | Required | Default Value | Description       |
|------|--------------------------|:--------:|---------------|-------------------|
| vertices | Point.PointLike \| Point.PointLike[] | ✓ |               | Path points.      |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:vertices'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### insertVertex(...)

```ts
insertVertex(
  vertice: Point.PointLike,
  index?: number,
  options?: Edge.SetOptions,
): this
```

Inserts a path point at the specified position.

| Name | Type           | Required | Default Value | Description       |
|------|----------------|:--------:|---------------|-------------------|
| vertice | Point.PointLike | ✓ |               | Path point.       |
| index | number         |          |               | Insertion position, defaults to the end of the path point array. |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:vertices'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### appendVertex(...)

```ts
appendVertex(vertex: Point.PointLike, options?: Edge.SetOptions): this
```

Inserts a path point at the end of the path point array.

| Name | Type           | Required | Default Value | Description       |
|------|----------------|:--------:|---------------|-------------------|
| vertex | Point.PointLike | ✓ |               | Path point.       |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:vertices'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### getVertexAt(...)

```ts
getVertexAt(index: number): Point.PointLike | null
```

Gets the path point at the specified index.

| Name  | Type   | Required | Default Value | Description       |
|-------|--------|:--------:|---------------|-------------------|
| index | number | ✓       |               | Index position.   |

#### setVertexAt(...)

```ts
setVertexAt(
  index: number,
  vertice: Point.PointLike,
  options?: Edge.SetOptions,
): this
```

Sets the path point at the specified index.

| Name | Type           | Required | Default Value | Description       |
|------|----------------|:--------:|---------------|-------------------|
| index | number         | ✓       |               | Index position.   |
| vertice | Point.PointLike | ✓ |               | Path point.       |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:vertices'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### removeVertexAt(...)

```ts
removeVertexAt(index: number, options?: Edge.SetOptions): this
```

Removes the path point at the specified index.

| Name | Type   | Required | Default Value | Description       |
|------|--------|:--------:|---------------|-------------------|
| index | number | ✓      |               | Index position.   |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:vertices'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

### Router

#### getRouter()

```ts
getRouter(): Edge.RouterData
```

Gets the router.

#### setRouter(...)

```ts
setRouter(name: string, args?: KeyValue, options?: Edge.SetOptions): this
setRouter(router: Edge.RouterData, options?: Edge.SetOptions): this
```

Sets the router.

| Name | Type           | Required | Default Value | Description       |
|------|----------------|:--------:|---------------|-------------------|
| name | string         | ✓       |               | Router name.      |
| args | KeyValue       |          |               | Router parameters. |
| router | Edge.RouterData | ✓    |               | Router.           |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:router'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### removeRouter(...)

```ts
removeRouter(options?: Edge.SetOptions): this
```

Removes the router.

| Name | Type   | Required | Default Value | Description       |
|------|--------|:--------:|---------------|-------------------|
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:router'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

### Connector

#### getConnector()

```ts
getConnector(): Edge.ConnectorData
```

Gets the connector.

#### setConnector(...)

```ts
setConnector(name: string, args?: KeyValue, options?: Edge.SetOptions): this
setConnector(connector: Edge.ConnectorData, options?: Edge.SetOptions): this
```

Sets the connector.

| Name | Type           | Required | Default Value | Description       |
|------|----------------|:--------:|---------------|-------------------|
| name | string         | ✓       |               | Connector name.   |
| args | KeyValue       |          |               | Connector parameters. |
| connector | Edge.ConnectorData | ✓ |               | Connector.       |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:connector'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### removeConnector(...)

```ts
removeConnector(options?: Edge.SetOptions): this
```

Removes the connector.

| Name | Type   | Required | Default Value | Description       |
|------|--------|:--------:|---------------|-------------------|
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:connector'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

### Label

#### getDefaultLabel()

```ts
getDefaultLabel(): Edge.Label
```

Gets the default label.

#### getLabels()

```ts
getLabels(): Edge.Label[]
```

Gets all labels.

#### setLabels(...)

```ts
setLabels(
  labels: Edge.Label | Edge.Label[] | string | string[],
  options?: Edge.SetOptions,
): this
```

Sets the labels.

| Name | Type                                   | Required | Default Value | Description       |
|------|----------------------------------------|:--------:|---------------|-------------------|
| labels | Edge.Label \| Edge.Label[] \| string \| string[] | ✓ |               | Labels or array of labels. |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:labels'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### insertLabel(...)

```ts
insertLabel(
  label: Edge.Label | string,
  index?: number,
  options?: Edge.SetOptions,
): this
```

Inserts a label at the specified position.

| Name | Type                     | Required | Default Value | Description       |
|------|--------------------------|:--------:|---------------|-------------------|
| label | Edge.Label \| string     | ✓       |               | Label.            |
| index | number                   |          |               | Insertion position, defaults to the end of the label array. |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:labels'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### appendLabel(...)

```ts
appendLabel(label: Edge.Label | string, options?: Edge.SetOptions): this
```

Inserts a label at the end of the label array.

| Name | Type                     | Required | Default Value | Description       |
|------|--------------------------|:--------:|---------------|-------------------|
| label | Edge.Label \| string     | ✓       |               | Label.            |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:labels'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### getLabelAt(...)

```ts
getLabelAt(index: number): Edge.Label | null
```

Gets the label at the specified position.

| Name  | Type   | Required | Default Value | Description       |
|-------|--------|:--------:|---------------|-------------------|
| index | number | ✓       |               | Index position.   |

#### setLabelAt(...)

```ts
setLabelAt(
  index: number,
  label: Edge.Label | string,
  options?: Edge.SetOptions,
): this
```

Sets the label at the specified position.

| Name | Type                     | Required | Default Value | Description       |
|------|--------------------------|:--------:|---------------|-------------------|
| index | number                   | ✓       |               | Index position.   |
| label | Edge.Label \| string     | ✓       |               | Label.            |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:labels'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |

#### removeLabelAt(...)

```ts
removeLabelAt(index: number, options?: Edge.SetOptions): this
```

Removes the label at the specified position.

| Name | Type   | Required | Default Value | Description       |
|------|--------|:--------:|---------------|-------------------|
| index | number | ✓      |               | Index position.   |
| options.silent | boolean |          | `false`       | If `true`, does not trigger `'change:labels'` events and canvas redraw. |
| options...others | object |          |               | Other custom key-value pairs that can be used in event callbacks. |
