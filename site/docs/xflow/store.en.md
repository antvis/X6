---
title: Store
order: 4
redirect_from:
 - /en/docs
 - /en/docs/xflow
---

Xflow provides unified management of data on the canvas, with all canvas data stored in a single `store`, making development very easy.

You can conveniently manipulate the `store` using [useGraphStore]((/xflow/hooks/use-graph-store)), allowing you to update the canvas data and achieve canvas updates.
## Initialization State

### `initData(data, options)`

This function is used to initialize the state manager, setting the initial nodes and edges.

Parameters:

- `data`: An object containing two arrays, `nodes` and `edges`, which store the data for nodes and edges, respectively.
- `options`: An optional object. When set to `{ silent: true }`, the initialization operation will not be recorded in the change list `changeList`.

## Node Operations

### `addNodes(ns, options)`

Adds new nodes to the state manager.

Parameters:

- `ns`: An array of node objects.
- `options`: An optional object. When `{ silent: true }`, the add operation will not be recorded in the change list.

### `removeNodes(ids, options)`

Removes nodes by an array of IDs.

Parameters:

- `ids`: An array containing node IDs.
- `options`: An optional object. When `{ silent: true }`, the remove operation will not be recorded in the change list.

### `updateNode(id, data, options)`

Updates a node by its ID. Modifying the node's `id` or `shape` properties is not allowed.

Parameters:

- `id`: The ID of the node to be updated.
- `data`: An object or a function containing the data to be updated.
- `options`: An optional object. When `{ silent: true }`, the update operation will not be recorded in the change list.

## Edge Operations

### `addEdges(es, options)`

Adds new edges to the state manager.

Parameters:

- `es`: An array of edge objects.
- `options`: An optional object. When `{ silent: true }`, the add operation will not be recorded in the change list.

### `removeEdges(ids, options)`

Removes edges by an array of IDs.

Parameters:

- `ids`: An array containing edge IDs.
- `options`: An optional object. When `{ silent: true }`, the remove operation will not be recorded in the change list.

### `updateEdge(id, data, options)`

Updates an edge by its ID. Modifying the edge's `id` or `shape` properties is not allowed.

Parameters:

- `id`: The ID of the edge to be updated.
- `data`: An object or a function containing the data to be updated.
- `options`: An optional object. When `{ silent: true }`, the update operation will not be recorded in the change list.
