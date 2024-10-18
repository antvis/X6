---
title: Port Layout Algorithm
order: 11
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

The port layout algorithm is a function with the following signature, which returns the relative position of the port relative to the node. For example, if a node is located at `{ x: 30, y: 40 }` on the canvas, and the returned position of a port is `{ x: 2, y: 4 }`, then the port will be rendered at `{ x: 32, y: 44 }` on the canvas.

```ts
type Definition<T> = (
  portsPositionArgs: T[], // layout algorithm parameters specified in the port
  elemBBox: Rectangle, // bounding box of the node
  groupPositionArgs: T, // default layout algorithm parameters defined in the group
) => Result[]

interface Result {
  position: Point.PointLike // relative position to the node
  angle?: number // rotation angle
}
```

Note that when configuring the port `ports`, we can only configure the layout algorithm through the `groups` option, and provide optional layout algorithm parameters `args` in `items` to affect the layout result.

```ts
graph.addNode(
  ...,
  ports: {
    // port group
    groups: {
      group1: {
        position: {
          name: 'xxx', // layout algorithm name
          args: { },   // default parameters of the layout algorithm
        },
      },
    },

    // port definition
    items: [
      {
        groups: 'group1',
        args: { }, // override the default parameters specified in group1
      },
    ],
  },
)
```

Let's take a look at how to use the built-in port layout algorithms and how to customize and register custom layout algorithms.

## Built-in Layouts

### absolute

Absolute positioning, specifying the port position through `args`.

```ts
interface AbsoluteArgs {
  x?: string | number
  y?: string | number
  angle?: number
}
```

| Name  | Type             | Required | Default Value | Description                   |
|-------|------------------|:----:|--------|----------------------|
| x     | string \| number |      | `0`    | Relative position on the X-axis. |
| y     | string \| number |      | `0`    | Relative position on the Y-axis. |
| angle | number           |      | `0`    | Rotation angle.        |

When `x` and `y` are percentage strings or between `[0, 1]`, they represent the percentage offset in the width and height directions, otherwise, they represent absolute offsets.

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'absolute',
          args: { x: 0, y: 0 },
        },
      },
    },
    items: [
      {
        group: 'group1',
        args: {
          x: '60%',
          y: 32,
          angle: 45,
        },
      },
    ],
  },
})
```

<code id="port-layout-absolute" src="@/src/api/port-layout/absolute/index.tsx"></code>

### left, right, top, bottom

Ports are evenly distributed along the specified edge of the rectangle, and `left`, `right`, `top`, and `bottom` are four layout algorithms that are very friendly to rectangular nodes. You can set the offset and rotation angle through `args`.

```ts
interface SideArgs {
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name   | Type    | Required | Default Value  | Description                                    |
|--------|---------|:----:|---------|---------------------------------------|
| strict | boolean |      | `false` | Whether to strictly distribute evenly.                   |
| dx     | number  |      | `0`     | Offset in the X-axis direction.                    |
| dy     | number  |      | `0`     | Offset in the Y-axis direction.                    |
| angle  | number  |      | `0`     | Rotation angle.                       |
| x      | number  |      | -       | Override the calculated X-coordinate with the specified value. |
| y      | number  |      | -       | Override the calculated Y-coordinate with the specified value. |

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: 'left',
      },
    },
    items: [
      {
        group: 'group1',
        args: {
          dx: 2,
        },
      },
    ],
  },
})
```

<code id="port-layout-side" src="@/src/api/port-layout/side/index.tsx"></code>

### line

Ports are evenly distributed along the line segment.

```ts
interface LineArgs {
  start?: Point.PointLike
  end?: Point.PointLike
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name   | Type            | Required | Default Value  | Description                                    |
|--------|-----------------|:----:|---------|---------------------------------------|
| start  | Point.PointLike |      |         | Start point of the line segment.                               |
| end    | Point.PointLike |      |         | End point of the line segment.                               |
| strict | boolean         |      | `false` | Whether to strictly distribute evenly.                   |
| dx     | number          |      | `0`     | Offset in the X-axis direction.                    |
| dy     | number          |      | `0`     | Offset in the Y-axis direction.                    |
| angle  | number          |      | `0`     | Rotation angle.                       |
| x      | number          |      | -       | Override the calculated X-coordinate with the specified value. |
| y      | number          |      | -       | Override the calculated Y-coordinate with the specified value. |

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'line',
          args: {
            start: { x: 10, y: 10 },
            end: { x: 210, y: 10 },
          },
        },
      },
    },
    items: [
      {
        group: 'group1',
        args: {
          dx: 2,
        },
      },
    ],
  },
})
```

<code id="port-layout-line" src="@/src/api/port-layout/line/index.tsx"></code>

### ellipse

Ports are distributed along the ellipse, starting from the `start` angle, with a step size of `step`.

```ts
interface EllipseArgs {
  start?: number
  step?: number
  compensateRotate?: boolean
  dr?: number
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name             | Type   | Required | Default Value  | Description                                    |
|------------------|--------|:----:|---------|---------------------------------------|
| start            | number |      |         | Start angle.                               |
| step             | number |      | `20`    | Step size.                                   |
| compensateRotate | number |      | `false` | Whether to compensate for the rotation angle of the ellipse. |
| dr               | number |      | `0`     | Offset in the radial direction.                     |
| dx               | number |      | `0`     | Offset in the X-axis direction.                    |
| dy               | number |      | `0`     | Offset in the Y-axis direction.                    |
| angle            | number |      | `0`     | Rotation angle.                       |
| x                | number |      | -       | Override the calculated X-coordinate with the specified value. |
| y                | number |      | -       | Override the calculated Y-coordinate with the specified value. |

```ts
const node = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'ellipse',
          args: {
            start: 45,
          },
        },
      },
    },
  },
})

Array.from({ length: 10 }).forEach((_, index) => {
  node.addPort({
    id: `${index}`,
    group: 'group1',
    attrs: { text: { text: index } },
  })
})
```

<code id="port-layout-ellipse" src="@/src/api/port-layout/ellipse/index.tsx"></code>

### ellipseSpread

Uniformly distributes connection points along an ellipse, starting from the specified angle `start`.

```ts
interface EllipseSpreadArgs {
  start?: number
  compensateRotate?: boolean
  dr?: number
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name             | Type   | Required | Default Value | Description                                    |
|------------------|--------|:----:|---------|---------------------------------------|
| start            | number |      |         | Starting angle.                               |
| compensateRotate | number |      | `false` | Whether to adjust the rotation angle of the connection points along the arc. |
| dr               | number |      | `0`     | Offset along the radial direction.                     |
| dx               | number |      | `0`     | Offset along the X-axis direction.                    |
| dy               | number |      | `0`     | Offset along the Y-axis direction.                    |
| angle            | number |      | `0`     | Rotation angle of the connection points.                       |
| x                | number |      | -       | Override the X-coordinate of the calculated result with a specified X-coordinate. |
| y                | number |      | -       | Override the Y-coordinate of the calculated result with a specified Y-coordinate. |

```ts
const node = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'ellipseSpread',
          args: {
            start: 45,
          },
        },
      },
    },
  },
})

Array.from({ length: 36 }).forEach(function (_, index) {
  ellipse.addPort({
    group: 'group1',
    id: `${index}`,
    attrs: { text: { text: index } },
  })
})
```

<code id="port-layout-ellipse-spread" src="@/src/api/port-layout/ellipse-spread/index.tsx"></code>

## Custom Connection Point Layout

A connection point layout algorithm is a function with the following signature, which returns the relative position of each connection point relative to the node. For example, if a node is located at `{ x: 30, y: 40 }` on the canvas, and the returned position of a connection point is `{ x: 2, y: 4 }`, then the rendered position of the connection point on the canvas would be `{ x: 32, y: 44 }`.

```ts
type Definition<T> = (
  portsPositionArgs: T[], // Layout algorithm parameters specified in the connection points
  elemBBox: Rectangle, // Node bounding box
  groupPositionArgs: T, // Default layout algorithm parameters defined in the group
) => Result[]

interface Result {
  position: Point.PointLike // Relative position to the node
  angle?: number // Rotation angle
}
```

We can create a custom layout algorithm according to the above rules, for example, implementing a sine distribution layout algorithm:

```ts
function sin(portsPositionArgs, elemBBox) {
  return portsPositionArgs.map((_, index) => {
    const step = -Math.PI / 8
    const y = Math.sin(index * step) * 50
    return {
      position: {
        x: index * 12,
        y: y + elemBBox.height,
      },
      angle: 0,
    }
  })
}
```

After implementing the layout algorithm, we need to register it to the system. After registration, we can use it like the built-in layout algorithms.

```ts
Graph.registerPortLayout('sin', sin)
```

After registration, we can use it like the built-in layout algorithms:

```ts
const rect = graph.addNode({
  ports: {
    groups: {
      sin: {
        position: {
          name: 'sin',
          args: {
            start: 45,
          },
        },
        attrs: {
          rect: {
            fill: '#fe854f',
            width: 11,
          },
          text: {
            fill: '#fe854f',
          },
          circle: {
            fill: '#fe854f',
            r: 5,
            magnet: true,
          },
        },
      },
    },
  },
})

Array.from({ length: 24 }).forEach(() => {
  rect.addPort({ group: 'sin' })
})
```

<code id="port-layout-sin" src="@/src/api/port-layout/sin/index.tsx"></code>