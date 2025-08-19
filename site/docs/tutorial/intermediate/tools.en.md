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
- What common tools are built into X6 by default

:::

## Using Tools

When creating nodes/edges, you can add tools through the [`tools`](/en/api/model/cell#tools) option:

```ts
graph.addNode({
  tools: [
    {
      name: 'button-remove', // Tool name
      args: {
        // Parameters corresponding to the tool
        x: 10,
        y: 10,
      },
    },
  ],
})

// If the parameters are empty, it can be abbreviated as:
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

Tools are widgets rendered on nodes/edges to enhance their interactivity. We provide the following built-in tools for nodes and edges:

### Nodes:

- [button](/en/api/registry/node-tool#button) Renders a button at a specified position, supporting custom click interactions for the button.
- [button-remove](/en/api/registry/node-tool#button-remove) Renders a delete button at a specified position, which deletes the corresponding node when clicked.
- [boundary](/en/api/registry/node-tool#boundary) Renders a rectangle surrounding the node based on its bounding box. Note that this tool only renders a rectangle without any interaction.

### Edges:

- [vertices](/en/api/registry/edge-tool#vertices) Path point tool that renders a small dot at the path point position. You can drag the dot to modify the path point position, double-click the dot to delete the path point, and click on the edge to add a path point.
- [segments](/en/api/registry/edge-tool#segments) Segment tool that renders a toolbar at the center of each line segment of the edge. You can drag the toolbar to adjust the positions of the path points at both ends of the segment.
- [boundary](/en/api/registry/edge-tool#boundary) Renders a rectangle surrounding the edge based on its bounding box. Note that this tool only renders a rectangle without any interaction.
- [button](/en/api/registry/edge-tool#button) Renders a button at a specified position, supporting custom click interactions for the button.
- [button-remove](/en/api/registry/edge-tool#button-remove) Renders a delete button at a specified position, which deletes the corresponding edge when clicked.
- [source-arrowhead and target-arrowhead](/en/api/registry/edge-tool#source-arrowhead-and-target-arrowhead) Renders a shape (default is an arrow) at the start or end of the edge, allowing you to drag the shape to modify the start or end of the edge.
