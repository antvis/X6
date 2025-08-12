---
title: Connector
order: 6
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

The connector processes the start point, route return point, and end point into a `<path>` element's `d` attribute, determining the style of the edge rendering on the canvas. X6 has several built-in connectors.

| Connector   | Description                                                                                  |
|----------|-------------------------------------------------------------------------------------|
| normal   | [Simple Connector](#normal), connects the start point, route point, and end point with a straight line.                                    |
| smooth   | [Smooth Connector](#smooth), connects the start point, route point, and end point with a cubic Bezier curve.                        |
| rounded  | [Rounded Connector](#rounded), connects the start point, route point, and end point with a straight line and uses an arc to connect the line segments (fillet).  |
| jumpover | [Jumpover Connector](#jumpover), connects the start point, route point, and end point with a straight line and uses a jump symbol to connect the intersecting edges. |

You can set a route for a specific edge:

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: {
    name: 'rounded',
    args: {
      radius: 20,
    },
  },
})
```

When there is no connector parameter, it can be simplified to:

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: 'rounded',
})
```

You can also call `edge.setConnector` to set the connector:

```ts
edge.setConnector('rounded', { radius: 20 })
```

When creating a canvas, you can set the global default connector (default is `'normal'`) through the `connecting` option:

```ts
new Graph({
  connecting: {
    connector: {
      name: 'rounded',
      args: {
        radius: 20,
      },
    },
  },
})
```

When there is no route parameter, it can be simplified to:

```ts
new Graph({
  connecting: {
    connector: 'rounded',
  },
})
```

Let's take a look at how to use built-in connectors and how to customize and register custom connectors.

## Built-in Connectors

### normal

The system's default connector, connects the start point, route point, and end point in sequence with a straight line.

Supported parameters are as follows:

| Parameter Name | Parameter Type | Required | Default Value  | Parameter Description                                                        |
|---------------|---------------|:-------:|---------|-------------------------------------------------------------|
| raw          | boolean       |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string. |

<code id="connector-normal" src="@/src/api/connector/normal/index.tsx"></code>

### smooth

A smooth connector, connects the start point, route point, and end point with a cubic Bezier curve.

Supported parameters are as follows:

| Parameter Name    | Parameter Type   | Required | Default Value  | Parameter Description                                                         |
|-----------------|-----------------|----------|---------|--------------------------------------------------------------|
| raw             | boolean         |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string.  |
| direction       | `H` \| `V`      |    No    | -       | Keep horizontal connection or keep vertical connection, not set will dynamically calculate based on the start and end points. |

For example:

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: 'smooth',
})
```

<code id="connector-smooth" src="@/src/api/connector/smooth/index.tsx"></code>

### rounded

A rounded connector, connects the start point, route point, and end point with a straight line and uses an arc to connect the line segments (fillet).

Supported parameters are as follows:

| Parameter Name | Parameter Type | Required | Default Value  | Parameter Description                                                        |
|---------------|---------------|:-------:|---------|-------------------------------------------------------------|
| radius        | number         |    No    | `10`    | Fillet radius.                                                       |
| raw          | boolean       |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string. |

For example:

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: {
    name: 'rounded',
    args: {
      radius: 10,
    },
  },
})
```

<code id="connector-rounded" src="@/src/api/connector/rounded/index.tsx"></code>

### jumpover

A jumpover connector, connects the start point, route point, and end point with a straight line and uses a jump symbol to connect the intersecting edges.

Supported parameters are as follows:

| Parameter Name | Parameter Type                  | Required | Default Value  | Parameter Description                                                        |
|---------------|-------------------------------|:-------:|---------|-------------------------------------------------------------|
| type         | 'arc' \| 'gap' \| 'cubic' |    No    | `'arc'` | Jump type.                                                       |
| size         | number                    |    No    | `5`     | Jump size.                                                       |
| radius       | number                    |    No    | `0`     | Fillet radius.                                                       |
| raw          | boolean                   |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string. |

<code id="connector-jumpover" src="@/src/api/connector/jumpover/index.tsx"></code>

## Custom Connectors

A connector is a function with the following signature, returning a `Path` object or a serialized string.

```ts
export type Definition<T> = (
  this: EdgeView, // Edge view
  sourcePoint: Point.PointLike, // Start point
  targetPoint: Point.PointLike, // End point
  routePoints: Point.PointLike[], // Route return points
  args: T, // Connector parameters
  edgeView: EdgeView, // Edge view
) => Path | string
```

| Parameter Name      | Parameter Type          | Parameter Description      |
|--------------------|-------------------------|-------------------------|
| this               | EdgeView               | Edge view.              |
| sourcePoint        | Point.PointLike        | Start point.            |
| targetPoint        | Point.PointLike        | End point.              |
| routePoints        | Point.PointLike[]      | Route return points.     |
| args               | T                       | Connector parameters.   |
| edgeView           | EdgeView               | Edge view.              |

I'll define a `wobble` connector:

```ts
export interface WobbleArgs {
  spread?: number
  raw?: boolean
}

function wobble(
  sourcePoint: Point.PointLike,
  targetPoint: Point.PointLike,
  vertices: Point.PointLike[],
  args: WobbleArgs,
) {
  const spread = args.spread || 20
  const points = [...vertices, targetPoint].map((p) => Point.create(p))
  let prev = Point.create(sourcePoint)
  const path = new Path(Path.createSegment('M', prev))

  for (let i = 0, n = points.length; i < n; i += 1) {
    const next = points[i]
    const distance = prev.distance(next)
    let d = spread

    while (d < distance) {
      const current = prev.clone().move(next, -d)
      current.translate(
        Math.floor(7 * Math.random()) - 3,
        Math.floor(7 * Math.random()) - 3,
      )
      path.appendSegment(Path.createSegment('L', current))
      d += spread
    }

    path.appendSegment(Path.createSegment('L', next))
    prev = next
  }

  return args.raw ? path : path.serialize()
}
```

Then register the connector:

```ts
Graph.registerConnector('wobble', wobble)
```

After registration, we can use it by connector name:

```ts
edge.setConnector('wobble', { spread: 16 })
```
<code id="connector-wobble" src="@/src/api/connector/wobble/index.tsx"></code>
