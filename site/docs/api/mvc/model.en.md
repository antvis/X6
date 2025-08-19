---
title: Model
order: 1
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/mvc
---

## Configuration

### model

The model corresponding to the canvas, by default creates a new model.

## Methods

### isNode(...)

```ts
isNode(cell: Cell): cell is Node
```

Returns whether the specified Cell is a node.

| Name | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| cell | Cell |    ✓     |         | The specified Cell. |

### isEdge(...)

```ts
isEdge(cell: Cell): cell is Edge
```

Returns whether the specified Cell is an edge.

| Name | Type | Required | Default | Description |
|------|------|:--------:|---------|-------------|
| cell | Cell |    ✓     |         | The specified Cell. |

### createNode(...)

```ts
createNode(metadata: Node.Metadata): Node
```

Creates a node.

| Name     | Type          | Required | Default | Description |
|----------|---------------|:--------:|---------|-------------|
| metadata | Node.Metadata |    ✓     |         | Node metadata. |

### addNode(...)

```ts
addNode(metadata: Node.Metadata, options?: AddOptions): Node
addNode(node: Node, options?: AddOptions): Node
```

Adds a node to the canvas, returns the added node.

| Name             | Type                  | Required | Default | Description |
|------------------|-----------------------|:--------:|---------|-------------|
| node             | Node.Metadata \| Node |    ✓     |         | Node metadata or node instance. |
| options.silent   | boolean               |          | `false` | If `true`, does not trigger `'node:added'` and `'cell:added'` events and canvas redraw. |
| options.sort     | boolean               |          | `true`  | Whether to sort by `zIndex`. |
| options...others | object                |          |         | Other custom key-value pairs that can be used in event callbacks. |

### addNodes(...)

```ts
addNodes(nodes: (Node.Metadata | Node)[], options?: AddOptions): Graph
```

Adds multiple nodes to the canvas, returns the graph. When adding nodes in batch, it's recommended to use this method for better performance compared to multiple addNode calls.

| Name             | Type                      | Required | Default | Description |
|------------------|---------------------------|:--------:|---------|-------------|
| nodes            | (Node.Metadata \| Node)[] |    ✓     |         | Array of node metadata or node instances. |
| options.silent   | boolean                   |          | `false` | If `true`, does not trigger `'node:added'` and `'cell:added'` events and canvas redraw. |
| options.sort     | boolean                   |          | `true`  | Whether to sort by `zIndex`. |
| options...others | object                    |          |         | Other custom key-value pairs that can be used in event callbacks. |

### removeNode(...)

```ts
removeNode(nodeId: string, options?: RemoveOptions): Node | null
removeNode(node: Node, options?: RemoveOptions): Node | null
```

Removes a node, returns the removed node.

| Name             | Type           | Required | Default | Description |
|------------------|----------------|:--------:|---------|-------------|
| node             | string \| Node |    ✓     |         | Node ID or node instance. |
| options.silent   | boolean        |          | `false` | If `true`, does not trigger `'node:removed'` and `'cell:removed'` events and canvas redraw. |
| options...others | object         |          |         | Other custom key-value pairs that can be used in event callbacks. |

### createEdge(...)

```ts
createEdge(metadata: Edge.Metadata): Edge
```

Creates an edge.

| Name     | Type          | Required | Default | Description |
|----------|---------------|:--------:|---------|-------------|
| metadata | Edge.Metadata |    ✓     |         | Edge metadata. |

### addEdge(...)

```ts
addEdge(metadata: Edge.Metadata, options?: AddOptions): Edge
addEdge(edge:Edge, options?: AddOptions): Edge
```

Adds an edge to the canvas, returns the added edge.

| Name             | Type                  | Required | Default | Description |
|------------------|-----------------------|:--------:|---------|-------------|
| edge             | Edge.Metadata \| Edge |    ✓     |         | Edge metadata or edge instance. |
| options.silent   | boolean               |          | `false` | If `true`, does not trigger `'edge:added'` and `'cell:added'` events and canvas redraw. |
| options.sort     | boolean               |          | `true`  | Whether to sort by `zIndex`. |
| options...others | object                |          |         | Other custom key-value pairs that can be used in event callbacks. |

### addEdges(...)

```ts
addEdges(edges: (Edge.Metadata | Edge)[], options?: AddOptions): Graph
```

Adds multiple edges to the canvas, returns the graph.

| Name             | Type                      | Required | Default | Description |
|------------------|---------------------------|:--------:|---------|-------------|
| edges            | (Edge.Metadata \| Edge)[] |    ✓     |         | Array of edge metadata or edge instances. |
| options.silent   | boolean                   |          | `false` | If `true`, does not trigger `'edge:added'` and `'cell:added'` events and canvas redraw. |
| options.sort     | boolean                   |          | `true`  | Whether to sort by `zIndex`. |
| options...others | object                    |          |         | Other custom key-value pairs that can be used in event callbacks. |

### removeEdge(...)

```ts
removeEdge(edgeId: string, options?: RemoveOptions): Edge | null
removeEdge(edge: Edge, options?: RemoveOptions): Edge | null
```

Removes an edge, returns the removed edge.

| Name             | Type           | Required | Default | Description |
|------------------|----------------|:--------:|---------|-------------|
| edge             | string \| Edge |    ✓     |         | Edge ID or edge instance. |
| options.silent   | boolean        |          | `false` | If `true`, does not trigger `'edge:removed'` and `'cell:removed'` events and canvas redraw. |
| options...others | object         |          |         | Other custom key-value pairs that can be used in event callbacks. |

### addCell(...)

```ts
addCell(cell: Cell | Cell[], options?: AddOptions): this
```

Adds a node or edge to the canvas.

| Name             | Type           | Required | Default | Description |
|------------------|----------------|:--------:|---------|-------------|
| cell             | Cell \| Cell[] |    ✓     |         | Node instance or edge instance, supports passing an array to add multiple nodes or edges at once. |
| options.silent   | boolean        |          | `false` | If `true`, does not trigger `'cell:added'`, `'node:added'`, and `'edge:added'` events and canvas redraw. |
| options.sort     | boolean        |          | `true`  | Whether to sort by `zIndex`. |
| options...others | object         |          |         | Other custom key-value pairs that can be used in event callbacks. |

### removeCell(...)

```ts
removeCell(cellId: string, options?: RemoveOptions): Cell | null
removeCell(cell: Cell, options?: RemoveOptions): Cell | null
```

Removes a node or edge, returns the removed node or edge.

| Name             | Type           | Required | Default | Description |
|------------------|----------------|:--------:|---------|-------------|
| cell             | string \| Cell |    ✓     |         | Node/edge ID or node/edge instance. |
| options.silent   | boolean        |          | `false` | If `true`, does not trigger `'cell:removed'`, `'node:removed'`, and `'edge:removed'` events and canvas redraw. |
| options...others | object         |          |         | Other custom key-value pairs that can be used in event callbacks. |

### removeCells(...)

```ts
removeCells(cells: (Cell | string)[], options?: RemoveOptions): Cell[]
```

Removes multiple nodes/edges, returns an array of removed nodes or edges.

| Name             | Type               | Required | Default | Description |
|------------------|--------------------|:--------:|---------|-------------|
| cell             | (string \| Cell)[] |    ✓     |         | Array of node/edge IDs or node/edge instances. |
| options.silent   | boolean            |          | `false` | If `true`, does not trigger `'cell:removed'`, `'node:removed'`, and `'edge:removed'` events and canvas redraw. |
| options...others | object             |          |         | Other custom key-value pairs that can be used in event callbacks. |

### removeConnectedEdges(...)

```ts
removeConnectedEdges(cell: Cell | string, options?: RemoveOptions): Edge[]
```

Removes edges connected to the node/edge, returns an array of removed edges.

| Name             | Type           | Required | Default | Description |
|------------------|----------------|:--------:|---------|-------------|
| cell             | string \| Cell |    ✓     |         | Node/edge ID or node/edge. |
| options.silent   | boolean        |          | `false` | If `true`, does not trigger `'cell:removed'` and `'edge:removed'` events and canvas redraw. |
| options...others | object         |          |         | Other custom key-value pairs that can be used in event callbacks. |

### disconnectConnectedEdges(...)

```ts
disconnectConnectedEdges(cell: Cell | string, options?: Edge.SetOptions): this
```

Sets the source and target of edges connected to the node/edge to the origin `{x: 0, y: 0}`, effectively disconnecting them.

| Name             | Type           | Required | Default | Description |
|------------------|----------------|:--------:|---------|-------------|
| cell             | string \| Cell |    ✓     |         | Node/edge ID or node/edge. |
| options.silent   | boolean        |          | `false` | If `true`, does not trigger `'edge:change:source'` and `'edge:change:target'` events and canvas redraw. |
| options...others | object         |          |         | Other custom key-value pairs that can be used in event callbacks. |

### clearCells(...)

```ts
clearCells(options?: SetOptions): this
```

Clears the canvas.

| Name             | Type    | Required | Default | Description |
|------------------|---------|:--------:|---------|-------------|
| options.silent   | boolean |          | `false` | If `true`, does not trigger `'cell:removed'`, `'node:removed'`, and `'edge:removed'` events and canvas redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

### resetCells(...)

```ts
resetCells(cells: Cell[], options?: SetOptions): this
```

Clears the canvas and adds the specified nodes/edges.

| Name             | Type    | Required | Default | Description |
|------------------|---------|:--------:|---------|-------------|
| cell             | Cell[]  |    ✓     |         | Array of nodes/edges. |
| options.silent   | boolean |          | `false` | If `true`, does not trigger `'cell:added'`, `'node:added'`, `'edge:added'`, `'cell:removed'`, `'node:removed'`, and `'edge:removed'` events and canvas redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

### hasCell(...)

```ts
hasCell(cellId: string): boolean
hasCell(cell: Cell): boolean
```

Returns whether the canvas contains the specified node/edge.

| Name | Type           | Required | Default | Description |
|------|----------------|:--------:|---------|-------------|
| cell | string \| Cell |    ✓     |         | Node/edge ID or node/edge. |

### getCellById(...)

```ts
getCellById(id: string)
```

Gets a node/edge by its ID.

| Name | Type   | Required | Default | Description |
|------|--------|:--------:|---------|-------------|
| id   | string |    ✓     |         | ID of the node/edge. |

### updateCellId(...)

```ts
updateCellId(cell: Cell, newId: string)
```

Updates the ID of a node or edge, returns the newly created node/edge.

| Name  | Type   | Required | Default | Description |
|-------|--------|:--------:|---------|-------------|
| cell  | Cell   |    ✓     |         | Node/edge. |
| newId | string |    ✓     |         | New ID. |

### getCells()

```ts
getCells(): Cell[]
```

Returns all nodes and edges in the canvas.

### getCellCount()

```ts
getCellCount(): number
```

Returns the count of all nodes and edges in the canvas.

### getNodes()

```ts
getNodes(): Node[]
```

Returns all nodes in the canvas.

### getEdges()

```ts
getEdges(): Edge[]
```

Returns all edges in the canvas.

### getOutgoingEdges(...)

```ts
getOutgoingEdges(cell: Cell | string): Edge[] | null
```

Gets the outgoing edges connected to the node/edge, i.e., edges whose source is the specified node/edge.

| Name | Type           | Required | Default | Description |
|------|----------------|:--------:|---------|-------------|
| cell | string \| Cell |    ✓     |         | Node/edge ID or node/edge. |

### getIncomingEdges(...)

```ts
getIncomingEdges(cell: Cell | string): Edge[] | null
```

Gets the incoming edges connected to the node/edge, i.e., edges whose target is the specified node/edge.

| Name | Type           | Required | Default | Description |
|------|----------------|:--------:|---------|-------------|
| cell | string \| Cell |    ✓     |         | Node/edge ID or node/edge. |

### getConnectedEdges(...)

```ts
getConnectedEdges(cell: Cell | string, options?: GetConnectedEdgesOptions): Edge[]
```

Get the edges connected to a node/edge.

| Name             | Type           | Required | Default | Description                                                                                                                |
|------------------|----------------|:--------:|---------|---------------------------------------------------------------------------------------------------------------------------|
| cell             | string \| Cell |    ✓     |         | Node/Edge ID or Node/Edge.                                                                                                  |
| options.incoming | boolean        |          | -       | Whether to include incoming edges. By default, returns all incoming and outgoing edges. When `incoming` is `true`, only returns incoming edges. |
| options.outgoing | boolean        |          | -       | Whether to include outgoing edges. By default, returns all incoming and outgoing edges. When `outgoing` is `true`, only returns outgoing edges. |
| options.deep     | boolean        |          | `false` | Whether to recursively get edges for all child nodes/edges. When `true`, it will also return edges connected to all descendant nodes/edges. |
| options.enclosed | boolean        |          | `false` | Whether to include edges connecting descendant nodes.                                                                       |
| options.indirect | boolean        |          | `false` | Whether to include indirectly connected edges, i.e., edges connected to input or output edges.                              |

```ts
const edges = graph.getConnectedEdges(node) // Returns incoming and outgoing edges
const edges = graph.getConnectedEdges(node, { incoming: true, outgoing: true }) // Returns incoming and outgoing edges

const edges = graph.getConnectedEdges(node, { incoming: true }) // Returns incoming edges
const edges = graph.getConnectedEdges(node, {
  incoming: true,
  outgoing: false,
}) // Returns incoming edges

const edges = graph.getConnectedEdges(node, { outgoing: true }) // Returns outgoing edges
const edges = graph.getConnectedEdges(node, {
  incoming: false,
  outgoing: true,
}) // Returns outgoing edges

const edges = graph.getConnectedEdges(node, { deep: true }) // Returns incoming and outgoing edges, including those connected to all descendant nodes/edges
const edges = graph.getConnectedEdges(node, { deep: true, incoming: true }) // Returns incoming edges, including those connected to all descendant nodes/edges
const edges = graph.getConnectedEdges(node, { deep: true, enclosed: true }) // Returns incoming and outgoing edges, including edges connecting descendant nodes/edges

const edges = graph.getConnectedEdges(node, { indirect: true }) // Returns incoming and outgoing edges, including indirectly connected edges
```

### getRootNodes()

```ts
getRootNodes(): Node[]
```

Get all root nodes, i.e., nodes without incoming edges.

### isRootNode(...)

```ts
isRootNode(cell: Cell | string): boolean
```

Returns whether the specified node is a root node.

| Name | Type           | Required | Default | Description                |
|------|----------------|:--------:|---------|----------------------------|
| cell | string \| Cell |    ✓     |         | Node/Edge ID or Node/Edge. |

### getLeafNodes()

```ts
getLeafNodes(): Node[]
```

Returns all leaf nodes, i.e., nodes without outgoing edges.

### isLeafNode(...)

```ts
isLeafNode(cell: Cell | string): boolean
```

Returns whether the specified node is a leaf node.

| Name | Type           | Required | Default | Description                |
|------|----------------|:--------:|---------|----------------------------|
| cell | string \| Cell |    ✓     |         | Node/Edge ID or Node/Edge. |

### getNeighbors(...)

```ts
getNeighbors(cell: Cell, options?: GetNeighborsOptions): Cell[]
```

Get neighboring nodes.

| Name             | Type    | Required | Default | Description                                                                                                                                  |
|------------------|---------|:--------:|---------|----------------------------------------------------------------------------------------------------------------------------------------------|
| cell             | Cell    |    ✓     |         | Node/Edge.                                                                                                                                    |
| options.incoming | boolean |          | -       | Whether to include incoming neighboring nodes. By default, includes both incoming and outgoing nodes. When `incoming` is `true`, only returns incoming nodes. |
| options.outgoing | boolean |          | -       | Whether to include outgoing neighboring nodes. By default, includes both incoming and outgoing nodes. When `outgoing` is `true`, only returns outgoing nodes. |
| options.deep     | boolean |          | `false` | Whether to recursively get all child nodes/edges. When `true`, it will also return neighboring nodes of all descendant nodes/edges.           |
| options.indirect | boolean |          | `false` | Whether to include indirectly connected neighboring nodes, i.e., neighbors connected through multiple edges (edge-to-edge connections).       |

### isNeighbor(...)

```ts
isNeighbor(cell1: Cell, cell2: Cell, options?: GetNeighborsOptions): boolean
```

Returns whether `cell2` is a neighbor of `cell1`. The `options` are the same as those in the [`getNeighbors(...)`](#getneighbors) method.

### getPredecessors(...)

```ts
getPredecessors(cell: Cell, options?: GetPredecessorsOptions): Cell[]
```

Returns the predecessor nodes of a node, i.e., nodes connected from the root node to the specified node.

| Name                 | Type                                                  | Required | Default | Description                                                                                                   |
|----------------------|-------------------------------------------------------|:--------:|---------|---------------------------------------------------------------------------------------------------------------|
| cell                 | Cell                                                  |    ✓     |         | Node/Edge.                                                                                                    |
| options.breadthFirst | boolean                                               |          | `false` | Whether to use breadth-first search algorithm. By default, uses depth-first search algorithm.                |
| options.deep         | boolean                                               |          | `false` | Whether to recursively get all child nodes/edges. When `true`, it will also return predecessors of all descendant nodes/edges. |
| options.distance     | number \| number[] \| ((distance: number) => boolean) |          | -       | Get predecessors at a specified distance. The number of edges between nodes is considered as 1 distance unit. |

### isPredecessor(...)

```ts
isPredecessor(cell1: Cell, cell2: Cell, options?: GetPredecessorsOptions): boolean
```

Returns whether `cell2` is a predecessor of `cell1`. The `options` are the same as those in the [`getPredecessors(...)`](#getpredecessors) method.

### getSuccessors(...)

```ts
getSuccessors(cell: Cell, options?: GetPredecessorsOptions): Cell[]
```

Get all successor nodes, i.e., nodes connected from the specified node to leaf nodes. The `options` are the same as those in the [`getPredecessors(...)`](#getpredecessors) method.

### isSuccessor(...)

```ts
isSuccessor(cell1: Cell, cell2: Cell, options?: GetPredecessorsOptions): boolean
```

Returns whether `cell2` is a successor of `cell1`. The `options` are the same as those in the [`getPredecessors(...)`](#getpredecessors) method.

### getCommonAncestor(...)

```ts
getCommonAncestor(...cells: {Cell | Cell[])[]): Cell | null
```

Get the common ancestor node of the specified nodes.

### getSubGraph(...)

```ts
getSubGraph(cells: Cell[], options？: GetSubgraphOptions): Cell[]
```

Returns a subgraph consisting of the specified nodes and edges. It traverses the given `cells` array, including the source and target nodes when encountering an edge; when encountering a node, it includes the edge if both nodes connected by the edge are in the `cells` array.

| Name         | Type    | Required | Default | Description                                    |
|--------------|---------|:--------:|---------|------------------------------------------------|
| cells        | Cell[]  |    ✓     |         | Array of nodes/edges.                          |
| options.deep | boolean |          | `false` | Whether to recursively get all child nodes/edges. |

### cloneCells(...)

```ts
cloneCells(cells: Cell[]): { [oldCellId: string]: Cell }
```

Clone cells, returning a key-value pair of old node/edge IDs and cloned nodes/edges.

### cloneSubGraph(...)

```ts
cloneSubGraph(cells: Cell[], options?: GetSubgraphOptions): { [oldCellId: string]: Cell }
```

Get and clone a subgraph. The `options` are the same as those in the [`getSubGraph(...)`](#getsubgraph) method.

### getNodesFromPoint(...)

```ts
getNodesFromPoint(x: number, y: number): Node[]
getNodesFromPoint(p: Point.PointLike): Node[]
```

Returns nodes at the specified position, i.e., nodes whose rectangular area contains the specified point.

### getNodesInArea(...)

```ts
getNodesInArea(
  x: number,
  y: number,
  w: number,
  h: number,
  options?: Model.GetCellsInAreaOptions,
): Node[]
getNodesInArea(
  rect: Rectangle.RectangleLike,
  options?: Model.GetCellsInAreaOptions,
): Node[]
```

Returns nodes in the specified rectangular area. When `options.strict` is `true`, it requires the node's rectangular area to be completely contained within the specified rectangle; otherwise, intersection is sufficient.

### getNodesUnderNode(...)

```ts
getNodesUnderNode(
  node: Node,
  options？: {
    by?: 'bbox' | Rectangle.KeyPoint
  },
): Node[]
```

Returns nodes at the position of the specified node. The `options.by` option specifies the method of retrieval, including:

- `null` or `bbox`: Returns nodes that intersect with the specified node's rectangular area
- `Rectangle.KeyPoint`: Returns nodes that contain a specific key point of the rectangle, where `Rectangle.KeyPoint` can be one of:
  - `"center"`
  - `"origin"`
  - `"corner"`
  - `"topLeft"`
  - `"topCenter"`
  - `"topRight"`
  - `"bottomLeft"`
  - `"bottomCenter"`
  - `"bottomRight"`
  - `"leftMiddle"`
  - `"rightMiddle"`

### searchCell(...)

```ts
searchCell(cell: Cell, iterator: SearchIterator, options?: SearchOptions): this
```

Traverse starting from the specified node/edge.

| Name                 | Type                                  | Required | Default | Description                                                                                                                                  |
|----------------------|---------------------------------------|:--------:|---------|----------------------------------------------------------------------------------------------------------------------------------------------|
| cell                 | Cell                                  |    ✓     |         | Node/Edge.                                                                                                                                    |
| iterator             | (cell: Cell, distance: number) => any |    ✓     |         | Traversal method.                                                                                                                             |
| options.breadthFirst | boolean                               |          | `false` | Whether to use breadth-first search algorithm. By default, uses depth-first search algorithm.                                                |
| options.incoming     | boolean                               |          | -       | Whether to traverse incoming neighboring nodes. By default, traverses both incoming and outgoing nodes. When `incoming` is `true`, only traverses incoming nodes. |
| options.outgoing     | boolean                               |          | -       | Whether to traverse outgoing neighboring nodes. By default, traverses both incoming and outgoing nodes. When `outgoing` is `true`, only traverses outgoing nodes. |
| options.deep         | boolean                               |          | `false` | Whether to recursively traverse all child nodes/edges. When `true`, it will also traverse neighboring nodes of all descendant nodes/edges.   |
| options.indirect     | boolean                               |          | `false` | Whether to traverse indirectly connected neighboring nodes, i.e., neighbors connected through multiple edges (edge-to-edge connections).     |

### getShortestPath(...)

```ts
getShortestPath(
  source: Cell | string,
  target: Cell | string,
  options?: GetShortestPathOptions,
): string[]
```

Get the shortest path between nodes, returning the node IDs on the shortest path.

| Name             | Type                             | Required | Default        | Description                                                                                                   |
|------------------|----------------------------------|:--------:|----------------|---------------------------------------------------------------------------------------------------------------|
| source           | Cell \| string                   |    ✓     |                | Start node/edge.                                                                                               |
| target           | Cell \| string                   |    ✓     |                | End node/edge.                                                                                                 |
| options.directed | boolean                          |          | `false`        | Whether to consider directionality. When `true`, the path must follow the direction from start node to end node. |
| options.weight   | (u: string, v: string) => number |          | `(u, v) => 1`  | Distance weight algorithm. `u` and `v` are adjacent nodes, default distance is `1`.                           |

### getAllCellsBBox(...)

```ts
getAllCellsBBox(): Rectangle | null
```

Returns the rectangular area of all nodes and edges on the canvas.

### getCellsBBox(...)

```ts
getCellsBBox(cells: Cell[], options?: Cell.GetCellsBBoxOptions): Rectangle | null
```

Returns the rectangular area formed by the specified nodes and edges.

| Name         | Type    | Required | Default | Description                                        |
|--------------|---------|:--------:|---------|----------------------------------------------------|
| cells        | Cell[]  |    ✓     |         | Array of nodes and edges.                          |
| options.deep | boolean |          | `false` | Whether to include all descendant nodes and edges. |

### toJSON(...)

```ts
toJSON(options?: ToJSONOptions): object
```

Export nodes and edges in the graph, returning an object with a `{ cells: [] }` structure, where the `cells` array stores nodes and edges in rendering order.

| Name         | Type | Required | Default | Description                                                                                                                   |
|--------------|------|:--------:|---------|-------------------------------------------------------------------------------------------------------------------------------|
| options.deep | diff |          | `false` | Whether to export differential data of nodes and edges (parts that differ from the [default configuration](/en/api/model/cell#default-options) of nodes and edges). |

### parseJSON(...)

Convert specified data to nodes and edges.

Supports an array of node/edge metadata, returning created nodes and edges in array order.

```ts
parseJSON(cells: (Node.Metadata | Edge.Metadata)[]): (Node | Edge)[]
```

Or provide an object containing `cells`, `nodes`, `edges`, creating and returning nodes and edges in the order of `[...cells, ...nodes, ...edges]`.

```ts
parseJSON({
  cells?: (Node.Metadata | Edge.Metadata)[],
  nodes?: Node.Metadata[],
  edges?: Edge.Metadata[],
}): (Node | Edge)[]
```

### fromJSON(...)

Render nodes and edges according to the specified JSON data.

Supports an array of node/edge metadata, rendering nodes and edges in array order.

```ts
fromJSON(data: (Node.Metadata | Edge.Metadata)[], options?: FromJSONOptions): this
```

Or provide an object containing `cells`, `nodes`, `edges`, rendering in the order of `[...cells, ...nodes, ...edges]`.

```ts
fromJSON(
  data: {
    cells?: (Node.Metadata | Edge.Metadata)[],
    nodes?: Node.Metadata[],
    edges?: Edge.Metadata[],
  },
  options?: FromJSONOptions,
): this
```

When `options.silent` is `true`, it does not trigger `cell:added`, `node:added`, and `edge:added` events or canvas redrawing.
