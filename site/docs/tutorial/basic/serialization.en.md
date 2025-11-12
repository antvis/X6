---
title: Data Serialization
order: 6
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title="This chapter mainly introduces knowledge related to canvas data serialization. By reading, you can learn about"}

- How to export data
- How to import data

:::

## Export

Call `graph.toJSON()` to export nodes and edges. It returns an object like `{ cells: [] }`, where the `cells` array stores nodes and edges **in render order**.

Exported node structure:

```ts
{
  id: string,
  shape: string,
  position: {
    x: number,
    y: number
  },
  size: {
    width: number,
    height: number
  },
  attrs: object,
  zIndex: number,
}
```

Exported edge structure:

```ts
{
  id: string,
  shape: string,
  source: object,
  target: object,
  attrs: object,
  zIndex: number,
}
```

<code id="serialization-tojson" src="@/src/tutorial/basic/serialization/to-json/index.tsx"></code>

## Import

Supports an array of node/edge metadata `graph.fromJSON(cells: (Node.Metadata | Edge.Metadata)[])`.

```ts
graph.fromJSON([
  {
    id: 'node1',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'rect',
  },
  {
    id: 'node2',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'ellipse',
  },
  {
    id: 'edge1',
    source: 'node1',
    target: 'node2',
    shape: 'edge',
  },
])
```

Alternatively, provide an object containing `cells`, `nodes`, and `edges`, rendered in the order of `[...cells, ...nodes, ...edges]`.

```ts
graph.fromJSON({
  nodes: [],
  edges: [],
})
```

Typically, we render the data exported by `graph.toJSON()` using `graph.fromJSON(...)`.

:::info{title="Tip"}
When the data does not provide a `zIndex`, the rendering is done according to the order of nodes/edges in the array, meaning that nodes/edges that appear earlier have a smaller `zIndex`, resulting in a lower layer in the canvas.
:::
