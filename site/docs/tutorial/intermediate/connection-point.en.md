---
title: Connection Points
order: 0
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="This chapter mainly introduces knowledge related to connection points. By reading, you can learn about"}

- Concepts of anchors and connection points
- How to use anchors and connection points to customize special edges

:::

Let's start with an example:

<code id="connection-point-multi" src="@/src/tutorial/intermediate/connection-point/multi/index.tsx"></code>

When you move the node above, the edge connection points on the node remain fixed, and multiple edges keep a gap between them. This differs from the previous example. How is this achieved? Let's understand anchors and connection points with the following diagram.

## Introduction

By default, the anchor is `center` (the element center). `connectionPoint` specifies how to compute intersection points; its default is `boundary` (intersection with the element boundary). An edge is drawn by connecting a reference line from the source anchor to the target anchor. The intersection of that line with the element, computed per `connectionPoint`, becomes the edge's start/end point.

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*RhX1SYh1K-QAAAAAAAAAAAAAARQnAQ" alt="Connection Point" width="500" />

## Usage

You can configure `anchor` and `connectionPoint` globally in `connecting`, or per edge via `source` and `target`.

```ts
// Configuring in connecting
const graph = new Graph({
  connecting: {
    sourceAnchor: {
      name: 'right', // Offsets the anchor 10px upward from the center on the right side of the node
      args: {
        dy: -10,
      },
    },
    targetAnchor: {
      name: 'right', // Offsets the anchor 10px upward from the center on the right side of the node
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})

// Per-edge configuration takes precedence
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

X6 also supports a wide variety of anchor and connection point types. To customize special edges, refer to [NodeAnchor](/en/api/registry/node-anchor) and [ConnectionPoint](/en/api/registry/connection-point).
