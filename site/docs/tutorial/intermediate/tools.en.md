---
title: Tools
order: 2
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="This chapter mainly introduces knowledge related to tools. By reading, you can learn about"}

- How to add tools for nodes or edges
- Common tools built into X6

:::

## Using Tools

When creating nodes/edges, you can add tools through the [`tools`](/en/api/model/cell#tools) option:

```ts
graph.addNode({
  tools: [
    {
      name: 'button-remove', // Tool name
      args: {
        // Tool parameters
        x: 10,
        y: 10,
      },
    },
  ],
})

// If no parameters are needed, you can abbreviate as:
graph.addNode({
  tools: ['button-remove'],
})

graph.addEdge({
  source,
  target,
  vertices: [
    {
      x: 90,
      y: 160,
    },
    {
      x: 210,
      y: 160,
    },
  ],
  tools: ['vertices', 'segments'],
})
```

<code id="tools-basic" src="@/src/tutorial/intermediate/tools/basic/index.tsx"></code>

After nodes/edges are created, you can call methods like [hasTool(name)](/en/api/model/cell#hastool), [addTools(...)](/en/api/model/cell#addtools), and [removeTools()](/en/api/model/cell#removetools) to add or remove tools.

<code id="tools-onhover" src="@/src/tutorial/intermediate/tools/onhover/index.tsx"></code>

## Built-in Tools

Tools are widgets rendered on nodes/edges to enhance interactivity. We provide the following built-in tools for nodes and edges:

### Nodes

- [button](/en/api/registry/node-tool#button) Renders a button at a specified position; supports custom click interactions.
- [button-remove](/en/api/registry/node-tool#button-remove) Renders a delete button at a specified position; clicking deletes the node.
- [boundary](/en/api/registry/node-tool#boundary) Renders a rectangle around the node based on its bounding box. Note: visualization only; no interaction.

### Edges

- [vertices](/en/api/registry/edge-tool#vertices) Renders dots at path points. Drag to move; double-click to delete; click on the edge to add.
- [segments](/en/api/registry/edge-tool#segments) Renders a handle at each segment’s center; drag to adjust the adjacent path points.
- [boundary](/en/api/registry/edge-tool#boundary) Renders a rectangle around the edge based on its bounding box. Note: visualization only; no interaction.
- [button](/en/api/registry/edge-tool#button) Renders a button at a specified position; supports custom click interactions.
- [button-remove](/en/api/registry/edge-tool#button-remove) Renders a delete button at a specified position; clicking deletes the edge.
- [source-arrowhead and target-arrowhead](/en/api/registry/edge-tool#source-arrowhead-and-target-arrowhead) Renders a shape (arrow by default) at the source/target terminal; drag to adjust the terminal.
