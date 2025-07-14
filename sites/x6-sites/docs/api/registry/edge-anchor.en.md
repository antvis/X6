---
title: Edge Anchor
order: 9
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

When an edge connects to another edge, you can use EdgeAnchor to specify the anchor point on the connected edge. The anchor point, along with the connection point [ConnectionPoint](/api/registry/connection-point), determines the starting and ending points of the edge.

-  Starting point: Draw a reference line from the first path point or the center of the target node (if there are no path points) to the anchor point of the source node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/api/registry/connection-point). This intersection point is the starting point of the edge.
-  Ending point: Draw a reference line from the last path point or the center of the source node (if there are no path points) to the anchor point of the target node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/api/registry/connection-point). This intersection point is the ending point of the edge.

X6 provides the following built-in anchor point definitions:

-  [ratio](#ratio) The default value, where the anchor point is located at a specified proportion of the connected edge.
-  [length](#length) The anchor point is located at a specified length from the connected edge.
-  [closest](#closest) Uses the point closest to the reference point as the anchor point.
-  [orth](#orth) Orthogonal anchor point.

<code id="edge-anchor-playground" src="@/src/api/edge-anchor/playground/index.tsx"></code>

## Built-in Anchor Points

### ratio

The anchor point is located at a specified proportion of the connected edge. Supports the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description |
|---------------|----------------|---------|--------------|-----------------------|
| ratio        | number         |   No    | `0.5`        | The proportion of the edge length from the starting point, defaulting to the center of the edge length. |

### length

The anchor point is located at a specified length from the connected edge. Supports the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description |
|---------------|----------------|---------|--------------|-----------------------|
| length        | number         |   No    | `20`         | The length from the starting point of the edge, defaulting to 20px from the starting point. |

### closest

Uses the point closest to the reference point as the anchor point.

### orth

Orthogonal anchor point. Supports the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description |
|---------------|----------------|---------|--------------|-----------------------|
| fallbackAt    | number \| string |   No    | `undefined`  | When there is no orthogonal point, use the point specified by `fallbackAt` as the anchor point.<br>When `fallbackAt` is a percentage string, it represents the proportion of the edge length from the starting point.<br>When `fallbackAt` is a number, it represents the length from the starting point of the edge. |

## Custom Anchor Points

The edge anchor point definition is a function with the following signature, which returns the anchor point.

```ts
export type Definition<T> = (
  this: EdgeView,
  view: EdgeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
) => Point
```

| Parameter Name | Parameter Type                      | Parameter Description |
|---------------|---------------------------------------|-----------------------|
| this          | EdgeView                              | The view of the edge.    |
| view          | EdgeView                              | The view of the connected edge. |
| magnet        | SVGElement                            | The element of the connected edge. |
| ref          | Point.PointLike \| SVGElement          | The reference point/element. |
| args          | T                                      | The arguments.          |

After completing the anchor point definition, we register the anchor point:

```ts
Graph.registerEdgeAnchor('custom-anchor', ...)
```

After registration, we can use the anchor point by name:

```ts
new Graph({
  connecting: {
    edgeAnchor: {
      name: 'custom-anchor',
    },
  },
})
```
