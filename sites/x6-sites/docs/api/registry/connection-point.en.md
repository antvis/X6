---
title: Connection Point
order: 10
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

The Connection Point and Anchor jointly determine the starting or ending point of an edge.

-  Starting point: Draw a reference line from the center of the first path point or target node (if there is no path point) to the anchor point of the source node, and calculate the intersection point of the reference line and the shape according to the specified connection point calculation method. This intersection point is the starting point of the edge.
-  Ending point: Draw a reference line from the center of the last path point or source node (if there is no path point) to the anchor point of the target node, and calculate the intersection point of the reference line and the shape according to the specified connection point calculation method. This intersection point is the ending point of the edge.

X6 provides the following built-in connection point calculation methods.

-  [boundary](#boundary) Default value, intersection with the boundary of the linked shape.
-  [bbox](#bbox) Intersection with the bounding box of the linked element.
-  [rect](#rect) Intersection with the rotated rectangular region of the linked element.
-  [anchor](#anchor) Use the anchor point as the connection point.

<code id="connection-point" src="@/src/api/connection-point/playground/index.tsx"></code>

You can specify the connection point when creating an edge:

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
    connectionPoint: 'boundary', // Simplified writing when there are no parameters
  },
})
```

After creation, you can modify the connection point by calling the `edge.setSource` and `edge.setTarget` methods:

```ts
edge.setSource({
  cell: 'source-id',
  connectionPoint: {
    name: 'boundary',
    args: {
      sticky: true,
    },
  },
})
```

When creating a canvas, you can set the global default connection point through the `connecting` option:

```ts
new Graph({
  connecting: {
    connectionPoint: {
      name: 'boundary',
      args: {
        sticky: true,
      },
    },
  },
})
```

Simplified writing when there are no parameters:

```ts
new Graph({
  connecting: {
    connectionPoint: 'boundary',
  },
})
```

## Built-in Connection Points

### boundary

Automatically recognize the boundary of the linked shape and calculate the intersection point of the reference line and the anchor point (Anchor). For example, an `<ellipse>` element will be recognized as an ellipse, and the intersection point of the ellipse and the reference line will be calculated. Elements that cannot be recognized (such as `text` or `<path>`) will use the bounding box of the shape as the connection point, which is the same as using `'bbox'`.

Supported parameters are as follows:

| Parameter Name      | Parameter Type                  | Required | Default Value      | Parameter Description                                                                                                               |
|--------------------|---------------------------|:-------:|-------------|--------------------------------------------------------------------------------------------------------------------|
| offset      | number \| Point.PointLike |    No    | `0`         | Offset of the connection point.                                                                                                        |
| stroked     | boolean                   |    No    | `true`      | Whether to consider the stroke width of the shape.                                                                                                |
| insideout   | boolean                   |    No    | `true`      | When the reference line is inside the shape and there is no intersection point, whether to extend the reference line to calculate the intersection point, default is `true`. |
| extrapolate | boolean                   |    No    | `false`     | When the reference line is outside the shape and there is no intersection point, whether to extend the reference line to calculate the intersection point, default is `false`. This parameter has higher priority than `sticky`. |
| sticky      | boolean                   |    No    | `false`     | When the reference line is outside the shape and there is no intersection point, whether to use the point on the boundary closest to the reference line as the connection point, default is `false`. |
| precision   | number                    |    No    | `2`         | Precision of intersection point calculation.                                                                                                        |
| selector    | string                    |    No    | `undefined` | Selector, used to identify an element, and use the boundary of the element to calculate the intersection point. Default uses the first child element that is not in the `<g>` element in the node. |

### anchor

Use the anchor point as the connection point, supporting the following parameters:

| Parameter Name | Parameter Type                  | Required | Default Value | Parameter Description        |
|---------------|---------------------------|:-------:|--------|-------------|
| offset | number \| Point.PointLike |    No    | `0`    | Offset of the connection point. |

### bbox

Intersection point of the bounding box of the linked element and the reference line, supporting the following parameters:

| Parameter Name  | Parameter Type                  | Required | Default Value  | Parameter Description                |
|---------------|---------------------------|:-------:|---------|---------------------|
| offset  | number \| Point.PointLike |    No    | `0`     | Offset of the connection point.         |
| stroked | boolean                   |    No    | `false` | Whether to consider the stroke width of the shape. |

### rect

Intersection point of the rotated rectangular region of the linked element and the reference line, supporting the following parameters:

| Parameter Name  | Parameter Type                  | Required | Default Value  | Parameter Description                |
|---------------|---------------------------|:-------:|---------|---------------------|
| offset  | number \| Point.PointLike |    No    | `0`     | Offset of the connection point.         |
| stroked | boolean                   |    No    | `false` | Whether to consider the stroke width of the shape. |

## Custom Connection Points

A connection point definition is a function with the following signature, returning the connection point.

```ts
export type Definition<T> = (
  line: Line,
  view: NodeView,
  magnet: SVGElement,
  args: T,
) => Point
```

| Parameter Name   | Parameter Type   | Parameter Description            |
|----------------|-----------------|---------------------------------|
| line     | Line       | Reference line.             |
| nodeView | NodeView   | View of the connected node.     |
| magnet   | SVGElement | Element on the connected node. |
| args     | T          | Parameters.               |

After completing the connection point definition, we register the connection point:

```ts
Graph.registerConnectionPoint('custom-connection-point', ...)
```

After registration, we can use the connection point by name:

```ts
new Graph({
  connecting: {
    connectionPoint: 'custom-connection-point'
  },
})
```
