---
title: Connection Points
order: 0
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="In this chapter, we mainly introduce knowledge related to connection points. By reading, you can learn about"}

- The concepts of anchor points and connection points
- How to use anchor points and connection points to customize special connections

:::

Let's start with an example:

<code id="connection-point-multi" src="@/src/tutorial/intermediate/connection-point/multi/index.tsx"></code>

When we move the node above, we will notice that the connection points of the edges and the node remain unchanged, and there is a gap between multiple edges. This is completely different from the phenomenon in the previous example. How is this achieved? Let's understand `anchor points` and `connection points` through the following diagram.

## Introduction

By default, the anchor point is set to `center`, which means it is located at the center of the element. The connection point is a method for calculating intersection points, with the default set to `boundary`, meaning it calculates the intersection with the element's border. Therefore, the edge is drawn as a reference line from the anchor point of the starting element to the anchor point of the target element. The intersection point between the reference line and the element is determined by the calculation method specified by the `connectionPoint`, and this intersection point serves as the starting and ending point of the edge.

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*RhX1SYh1K-QAAAAAAAAAAAAAARQnAQ" alt="Connection Point" width="500" />

## Usage

Both the anchor point `anchor` and the connection point `connectionPoint` have two usage methods. The first method is to configure them in `connecting`, which applies globally. The second method is to specify them when creating an edge in `source` and `target`.

```ts
// Configuring in connecting
const graph = new Graph({
  connecting: {
    sourceAnchor: {
      name: 'right', // The anchor point will be offset 10px upwards from the center of the right side of the node
      args: {
        dy: -10,
      },
    },
    targetAnchor: {
      name: 'right', // The anchor point will be offset 10px upwards from the center of the right side of the node
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})

// You can also configure it when creating the edge, which takes higher priority
graph.addEdge({
  source: {
    cell: source,
    anchor: {
      name: 'right',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
  target: {
    cell: target,
    anchor: {
      name: 'left',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})
```

Of course, X6 also supports a wide variety of anchor and connection point types. If you want to customize special connection edges, you can refer to [NodeAnchor](/api/registry/node-anchor) and [ConnectionPoint](/api/registry/connection-point).
