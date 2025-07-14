---
title: Node Anchor
order: 8
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

When connecting to a node, you can specify the anchor point of the connected node using `NodeAnchor`, which, together with the connection point [ConnectionPoint](/en/api/registry/connection-point), determines the starting and ending points of the edge.

-  Starting point: Draw a reference line from the first path point or the center of the target node (when there is no path point) to the anchor point of the source node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/en/api/registry/connection-point), which is the starting point of the edge.
-  Ending point: Draw a reference line from the last path point or the center of the source node (when there is no path point) to the anchor point of the target node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/en/api/registry/connection-point), which is the ending point of the edge.

X6 has built-in the following anchor point definitions.

-  [center](#center) The center point of the element connected to the edge (default value).
-  [top](#top) The top center point of the element connected to the edge.
-  [bottom](#bottom) The bottom center point of the element connected to the edge.
-  [left](#left) The left center point of the element connected to the edge.
-  [right](#right) The right center point of the element connected to the edge.
-  [midSide](#midside) The center point of the nearest side of the element connected to the edge.
-  [topLeft](#topleft) The top-left corner of the element connected to the edge.
-  [topRight](#topright) The top-right corner of the element connected to the edge.
-  [bottomLeft](#bottomleft) The bottom-left corner of the element connected to the edge.
-  [bottomRight](#bottomright) The bottom-right corner of the element connected to the edge.
-  [orth](#orth) The orthogonal point.
-  [nodeCenter](#nodecenter) The center point of the node.

<code id="node-anchor-playground" src="@/src/api/node-anchor/playground/index.tsx"></code>

You can specify the anchor point when creating an edge:

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
    anchor: 'orth', // Simplified writing when there are no parameters
  },
})
```

After creation, you can modify the anchor point by calling the `edge.setSource` and `edge.setTarget` methods:

```ts
edge.setSource({
  cell: 'source-id',
  anchor: {
    name: 'midSide',
    args: {
      dx: 10,
    },
  },
})
```

When creating a canvas, you can set the global default anchor point through the `connecting` option:

```ts
new Graph({
  connecting: {
    anchor: {
      name: 'midSide',
      args: {
        dx: 10,
      },
    },
  },
})
```

Simplified writing when there are no parameters:

```ts
new Graph({
  connecting: {
    anchor: 'midSide',
  },
})
```

## Built-in Anchors

### center

The center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### top

The top center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### bottom

The bottom center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### left

The left center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### right

The right center point of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### midSide

The center point of the nearest side of the element, supporting the following parameters:

| Parameter Name | Parameter Type   | Required | Default Value | Parameter Description                                                                                 |
|---------------|------------------|:-------:|---------|--------------------------------------------------------------------------------------|
| padding       | number           |    No    | `0`     | Offset the center point by `padding` pixels, supporting absolute offset and percentage relative offset. |
| rotate        | boolean          |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |
| direction     | 'H' \| 'V'       |    No    | -       | The direction of the connection point, such as setting to `H` to only connect to the left or right center point of the node, automatically judging based on the position. |

### topLeft

The top-left corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### topRight

The top-right corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### bottomLeft

The bottom-left corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### bottomRight

The bottom-right corner of the element, supporting the following parameters:

| Parameter Name | Parameter Type         | Required | Default Value | Parameter Description                                               |
|---------------|------------------------|:-------:|---------|----------------------------------------------------|
| dx            | number \| string       |    No    | `0`     | X-axis offset, supporting absolute offset and percentage relative offset. |
| dy            | number \| string       |    No    | `0`     | Y-axis offset, supporting absolute offset and percentage relative offset. |
| rotate        | boolean                |    No    | `false` | Whether to use the element's bounding box rotated with the node, defaulting to not considering the rotation angle. |

### orth

The orthogonal point, supporting the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description    |
|---------------|----------------|:-------:|--------|---------|
| padding       | number          |    No    | `0`    | X-axis offset. |

### nodeCenter

The center point of the node, supporting the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description    |
|---------------|----------------|:-------:|--------|---------|
| dx            | number          |    No    | `0`    | X-axis offset. |
| dy            | number          |    No    | `0`    | Y-axis offset. |

## Custom Anchors

An anchor point definition is a function with the following signature, returning an anchor point.

```ts
export type Definition<T> = (
  this: EdgeView,
  nodeView: NodeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
  type: Edge.TerminalType,
) => Point
```

| Parameter Name   | Parameter Type                      | Parameter Description            |
|---------------|-------------------------------|-------------------|
| this         | EdgeView                      | The edge view.           |
| nodeView     | NodeView                      | The node view.           |
| magnet       | SVGElement                    | The magnet element.       |
| ref          | Point.PointLike \| SVGElement | The reference point/element. |
| args         | T                             | The arguments.             |
| type         | Edge.TerminalType             | The edge terminal type.    |

After completing the anchor point definition, we register the anchor point:

```ts
Graph.registerAnchor('custom-anchor', ...)
```

After registration, we can use the anchor point by name:

```ts
new Graph({
  connecting: {
    anchor: {
      name: 'custom-anchor',
    },
  },
})
```
