---
title: Routing
order: 5
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

Routing further processes the edge's waypoints [vertices](/tutorial/basic/edge#vertices), adding additional points when necessary, and then returns the processed points (excluding the start and end points of the edge). For example, after [`orth`](#orth) routing, each segment of the edge is a horizontal or vertical orthogonal segment.

X6 has the following built-in routing options.

| Routing Name | Description                                                                                                   |
|--------------|---------------------------------------------------------------------------------------------------------------|
| normal       | [Default routing](#normal), returns the waypoints as they are.                                               |
| orth         | [Orthogonal routing](#orth), composed of horizontal or vertical orthogonal segments.                         |
| oneSide      | [Restricted orthogonal routing](#oneside), composed of three restricted horizontal or vertical orthogonal segments. |
| manhattan    | [Smart orthogonal routing](#manhattan), composed of horizontal or vertical orthogonal segments that automatically avoid other nodes (obstacles) on the path. |
| metro        | [Smart subway line routing](#metro), composed of horizontal or vertical orthogonal segments and diagonal segments, similar to a subway map, and automatically avoids other nodes (obstacles) on the path. |
| er           | [Entity-relationship routing](#er), composed of zigzag diagonal segments.                                     |

When using, you can set the routing for an edge:

```ts
const edge = graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: {
      side: 'right',
    },
  },
})
```

When the router has no parameters, it can also be simplified to:

```ts
const edge = graph.addEdge({
  source,
  target,
  router: 'oneSide',
})
```

You can also call the [`edge.setRouter`]() method to set the routing:

```ts
edge.setRouter('oneSide', { side: 'right' })
```

When creating a canvas, you can set a global default routing through the `connecting` option (the default routing for the canvas is `'normal'`):

```ts
new Graph({
  connecting: {
    router: {
      name: 'oneSide',
      args: {
        side: 'right',
      },
    },
  },
})
```

When the router has no parameters, it can also be simplified to:

```ts
new Graph({
  connecting: {
    router: 'orth',
  },
})
```

Now let's take a look at how to use the built-in routing and how to define and register custom routing.
## Built-in Routing

### normal

The system's default routing, which returns the input `vertices` path points as is.

### orth

Orthogonal routing, which adds extra points along the path to ensure that each line segment of the edge is horizontally or vertically orthogonal.

The supported parameters are as follows:

| Parameter Name | Parameter Type | Required | Default Value | Description                                   |
|----------------|----------------|:--------:|---------------|-----------------------------------------------|
| padding        | SideOptions    |    No    | 20            | Sets the minimum distance from the anchor point to the corner. |

`SideOptions` is defined as follows:

```ts
export type SideOptions =
  | number
  | {
      vertical?: number
      horizontal?: number
      left?: number
      top?: number
      right?: number
      bottom?: number
    }
```

For example:

```ts
graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: {
    name: 'orth',
    args: {
      padding: {
        left: 50,
      },
    },
  },
})
```

<code id="api-orth-router" src="@/src/api/router/orth/index.tsx"></code>

### oneSide

The `oneSide` routing is a restricted version of the orthogonal routing `orth`, which generates a strict three-segment route: starting from the `side` side of the starting node, passing through the middle segment, and ending at the `side` side of the target node. It is important to note that when using this routing, do not specify `vertices` at the same time, as it will result in poor routing performance.

The supported parameters are as follows:

| Parameter Name | Parameter Type                                       | Required | Default Value | Description                                   |
|----------------|------------------------------------------------------|:--------:|---------------|-----------------------------------------------|
| side           | `'left'` \| `'right'` \| `'top'` \| `'bottom'`     |    No    | `'bottom'`    | The starting/ending direction of the route, default is `'bottom'`. |
| padding        | SideOptions                                          |    No    | 20            | Sets the minimum distance from the anchor point to the corner. |

For example:

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: { side: 'right' },
  },
})
```

<code id="api-oneside-router" src="@/src/api/router/oneside/index.tsx"></code>

### manhattan

The Manhattan routing `'manhattan'` is an intelligent version of the orthogonal routing `'orth'`, consisting of horizontal or vertical orthogonal line segments that automatically avoid other nodes (obstacles) along the path.

We provide a rich set of options for this routing algorithm:

| Parameter Name      | Parameter Type                 | Required | Default Value                               | Description                                                    |
|---------------------|-------------------------------|:--------:|---------------------------------------------|---------------------------------------------------------------|
| step                | number                        |    No    | `10`                                       | The step length of the routing algorithm; smaller values increase computation. It is recommended to use the canvas grid size. |
| excludeTerminals    | ('source' \| 'target')[]     |    No    | `[]`                                       | Ignore starting or ending nodes; ignored nodes will not be considered as obstacles. |
| excludeShapes       | string[]                      |    No    | `[]`                                       | Ignore specified shape nodes; ignored nodes will not be considered as obstacles. |
| excludeNodes        | (Node \| string)[]           |    No    | `[]`                                       | Nodes to ignore; ignored nodes will not be considered as obstacles. |
| startDirections     | string[]                      |    No    | `['top', 'right', 'bottom', 'left']`     | Supported directions to start routing.                         |
| endDirections       | string[]                      |    No    | `['top', 'right', 'bottom', 'left']`     | Supported directions to end routing.                           |
| padding             | SideOptions                   |    No    | -                                           | Sets the minimum distance from the anchor point to the corner. |
| fallbackRouter      | Router                        |    No    | `Registry.Router.presets.orth`             | In scenarios where obstacles cannot be avoided, downgrade to the specified routing. |

For example:

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'manhattan',
    args: {
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```

:::warning{title=Note}
The characteristic of the manhattan routing is to automatically avoid obstacles in the path. If an unavoidable situation arises, it will automatically downgrade to the orth routing. In this case, to help developers identify the issue, a warning will be logged in the console: Unable to execute manhattan algorithm, use orth instead.
:::

<code id="api-manhattan-router" src="@/src/api/router/manhattan/index.tsx"></code>

### metro

The metro routing `metro` is a variant of the Manhattan routing `manhattan`, consisting of horizontal or vertical orthogonal line segments and diagonal segments, similar to a subway map, and automatically avoids other nodes (obstacles) along the path. Its options are the same as [manhattan](#manhattan), but the default value of `maxDirectionChange` is `45`, indicating that the maximum slope angle of the routing line segment is `45` degrees.

For example:

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'metro',
    args: {
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```

<code id="api-metro-router" src="@/src/api/router/metro/index.tsx"></code>

### er

The entity-relationship routing `er` consists of zigzag diagonal segments, commonly used to represent connections between entities in an ER diagram.

The supported parameters are as follows:

| Parameter Name | Parameter Type                                 | Required | Default Value | Description                                                                                        |
|----------------|-----------------------------------------------|:--------:|---------------|----------------------------------------------------------------------------------------------------|
| offset         | number \| 'center'                           | No       | `32`          | The distance between the first and last points of the route and the nodes. When set to `'center'`, the center of the node is used as the route point coordinate. |
| min            | number                                        | No       | `16`          | The minimum distance between the first and last points of the route and the nodes.                |
| direction       | `'T'` \| `'B'` \| `'L'` \| `'R'` \| `'H'` \| `'V'` | No       | -              | The routing direction; if omitted, the optimal direction will be automatically selected.          |

For example:

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'er',
    args: {
      offset: 24,
    },
  },
})
```

<code id="api-er-router" src="@/src/api/router/er/index.tsx"></code>

## Custom Routing

In addition to built-in routing, we can also create custom routing according to certain rules, for example, implementing random routing:

```ts
// Routing parameters
interface RandomRouterArgs {
  bounces?: number
}

function randomRouter(
  vertices: Point.PointLike[],
  args: RandomRouterArgs,
  view: EdgeView,
) {
  const bounces = args.bounces || 20
  const points = vertices.map((p) => Point.create(p))

  for (var i = 0; i < bounces; i++) {
    const sourceCorner = view.sourceBBox.getCenter()
    const targetCorner = view.targetBBox.getCenter()
    const randomPoint = Point.random(
      sourceCorner.x,
      targetCorner.x,
      sourceCorner.y,
      targetCorner.y,
    )
    points.push(randomPoint)
  }

  return points
}

Graph.registerRouter('random', randomRouter)
edge.setRouter('random', { bounces: 3 })
```

<code id="api-random-router" src="@/src/api/router/random/index.tsx"></code>
