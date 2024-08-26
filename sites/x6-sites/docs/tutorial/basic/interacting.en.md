---
title: Interaction
order: 4
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title="In this chapter, we will mainly introduce the knowledge related to element interaction. After reading, you can understand"}

-  How to set connection interaction rules
-  How to embed nodes
-  How to configure highlight styles
-  How to disable or enable some interaction actions

:::

## Connection

Connection interaction rules are all completed through the `connecting` configuration. For a complete configuration, refer to [API](/en/docs/api/interacting/interacting#connection). Below, we introduce some commonly used functions.

### allowXXX

You can use the `allowXXX` configuration to define whether a connection can be connected to a corresponding position. The default supports the following items:

-  `allowBlank`: Whether to allow connection to a blank position on the canvas, default is `true`.
-  `allowLoop`: Whether to allow creating a loop connection, i.e., the starting node and ending node are the same node, default is `true`.
-  `allowNode`: Whether to allow connection to a node (non-node connection point), default is `true`.
-  `allowEdge`: Whether to allow connection to another edge, default is `true`.
-  `allowPort`: Whether to allow connection to a connection point, default is `true`.
-  `allowMulti`: Whether to allow creating multiple edges between the same starting node and ending node, default is `true`.

Their values all support the following two types:

```ts
new Graph({
  connecting: {
    allowNode: true, // boolean
  },
})

// Function form, often used for dynamic control of connection restrictions
new Graph({
  connecting: {
    allowNode(args) {
      return true
    },
  },
})
```

:::info{title="Tip"}
`allowMulti` supports being set to the string `withPort`, representing that only one edge can be created between the same connection points of the starting and ending nodes (i.e., multiple edges can be created between the starting and ending nodes, but they must be connected to different connection points).
:::

<code id="interacting-connection" src="@/src/tutorial/basic/interacting/connecting/index.tsx"></code>

### router/connector

In the [edge tutorial](/en/docs/tutorial/basic/edge#router), we know that we can specify `router` and `connector` when adding an edge. If most edges in the entire canvas have the same `router` or `connector`, we can configure them directly in `connecting`, which can avoid repeated configuration in the edge.

```ts
new Graph({
  connecting: {
    router: 'orth',
    connector: 'rounded',
  },
})
```

### createEdge

In the above demo, we can drag out a connection from a node or connection point. Then you may ask, what kind of elements can drag out a connection? This is a clever design of X6, where any element with the `magnet=true` property can drag out a connection. Moreover, in `connecting`, we can configure the style of the dragged-out connection through the `createEdge` method.

```ts
new Graph({
  connecting: {
    createEdge() {
      return this.createEdge({
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    },
  },
})
```

### validateXXX

We can also define whether to create a connection or whether the connection is valid through the `validateXXX` method. Compared to `allowXXX`, `validateXXX` is more flexible. The default supports the following items:

-  `validateMagnet`: When clicking on an element with `magnet=true`, judge whether to create a new edge according to the return value of `validateMagnet`. If it returns `false`, there will be no reaction; if it returns `true`, a new edge will be created at the current element.
-  `validateConnection`: When moving an edge, judge whether the connection is valid according to the return value of `validateConnection`. If it returns `false`, the connection will not be connected to the current element when the mouse is released.
-  `validateEdge`: When stopping the edge drag, judge whether the edge is valid according to the return value of `validateEdge`. If it returns `false`, the edge will be cleared.

<code id="interacting-validate" src="@/src/tutorial/basic/interacting/validate/index.tsx"></code>

## Embedding

Sometimes we need to drag a node into another node, making it a child node of the other node. At this time, we can enable embedding through the `embedding` option, and specify the parent node through the `findParent` method when the node is moved. For more detailed configuration, refer to [API](/en/docs/api/interacting/interacting#embedding).

```ts
const graph = new Graph({
  embedding: {
    enabled: true,
    findParent({ node }) {
      // Get the bounding box of the moved node
      const bbox = node.getBBox()
      // Find the node with `parent: true` in the data and intersect with the moved node's bounding box
      return this.getNodes().filter((node) => {
        const data = node.getData<{ parent: boolean }>()
        if (data && data.parent) {
          const targetBBox = node.getBBox()
          return bbox.isIntersectWithRect(targetBBox)
        }
        return false
      })
    },
  },
})
```

<code id="interacting-embedding" src="@/src/tutorial/basic/interacting/embedding/index.tsx"></code>

## Highlighting

We can specify the highlighting style when triggering certain interactions through the `highlighting` option, such as:

```ts
new Graph({
  highlighting: {
    // When the connection point can be connected, render a surrounding box around the connection point
    magnetAvailable: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#A4DEB1',
          strokeWidth: 4,
        },
      },
    },
    // When the connection point is adsorbed to the edge, render a surrounding box around the connection point
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#31d0c6',
          strokeWidth: 4,
        },
      },
    },
  },
})
```

Supported `highlighting` configuration items include:

-  `default` Default highlighting option, used when the following highlighting configurations are missing.
-  `embedding` Highlighting option used when dragging a node to embed it into another node.
-  `nodeAvailable` Highlighting option used when a node can be connected during the connection process.
-  `magnetAvailable` Highlighting option used when a connection point can be connected during the connection process.
-  `magnetAdsorbed` Highlighting option used when the connection point is automatically adsorbed to the edge during the connection process.

The `magnetAvailable.name` above is actually the name of the highlighter, and X6 has built-in `stroke` and `className` highlighters. For more information, refer to [Highlighter](/en/docs/api/registry/highlighter).

<code id="interacting-highlighting" src="@/src/tutorial/basic/interacting/highlighting/index.tsx"></code>

## Interaction Limitation

We can enable or disable some interaction behaviors of elements through the `interacting` configuration. If the elements on the canvas are purely for preview and cannot be interacted with, we can set it to `false` directly.

```ts
new Graph({
  interacting: false,
})
```

If we need to define more detailed interaction limitations, we can configure them according to different property values. Supported properties include:

-  `nodeMovable` Whether nodes can be moved.
-  `magnetConnectable` Whether to trigger connection interaction when clicking on an element with the `magnet` property.
-  `edgeMovable` Whether edges can be moved.
-  `edgeLabelMovable` Whether edge labels can be moved.
-  `arrowheadMovable` Whether edge arrowheads (after using the arrowhead tool) can be moved.
-  `vertexMovable` Whether edge vertices can be moved.
-  `vertexAddable` Whether edge vertices can be added.
-  `vertexDeletable` Whether edge vertices can be deleted.

Their values all support the following two types:

```ts
// Directly set to a boolean value
new Graph({
  interacting: {
    nodeMovable: false,
    edgeMovable: true,
  },
})

// Function form, often used for dynamic control of interaction behaviors
new Graph({
  interacting: {
    nodeMovable(view) {
      const node = view.cell
      const { enableMove } = node.getData()
      return enableMove
    },
  },
})
```

<code id="interacting-interacting" src="@/src/tutorial/basic/interacting/interacting/index.tsx"></code>
