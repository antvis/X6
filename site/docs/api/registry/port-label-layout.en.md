---
title: Port Label Layout
order: 12
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

The port label layout algorithm is a function with the following signature, returning the position and rotation angle of the label relative to the port.

```ts
type Definition<T> = (
  portPosition: Point, // port position
  elemBBox: Rectangle, // node bounding box
  args: T, // label position arguments
) => Result

interface Result {
  position: Point.PointLike // label position relative to port
  angle: number // label rotation angle
  attrs: Attr.CellAttrs // label attributes
}
```

When creating a port, you can specify the label layout in the `groups` or override it in `items`:

```ts
graph.addNode(
  ...,
  ports: {
    // port group
    groups: {
      group1: {
        label: {
          position: {      // label layout algorithm
            name: 'xxx',   // label layout algorithm name
            args: { ... }, // label layout algorithm arguments
          },
        },
      },
    },

    // port definition
    items: [
      {
        groups: 'group1',
        label: {
          position: { // override label layout algorithm specified in group1
            name: 'xxx',
            args: { ... },
          }
        },
      }
    ],
  },
)
```

Let's take a look at how to use built-in label layout algorithms and how to define and register custom layout algorithms.

## Built-in Port Label Layout

### Side

The label is located on one side of the port.

-  `'left'` The label is located on the left side of the port.
-  `'right'` The label is located on the right side of the port.
-  `'top'` The label is located on the top side of the port.
-  `'bottom'` The label is located on the bottom side of the port.

You can specify the label position and rotation angle through `args`.

```ts
interface SideArgs {
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| Name  | Type           | Required | Default Value | Description                                      |
|-------|----------------|:----:|--------|-----------------------------------------|
| x     | number         |      | -      | Replace the calculated X coordinate with the specified value. |
| y     | number         |      | -      | Replace the calculated Y coordinate with the specified value. |
| angle | number         |      | -      | Replace the calculated rotation angle with the specified value. |
| attrs | Attr.CellAttrs |      | -      | Label attributes.                                 |

```ts
label: {
  position: {
    name : 'right',
    args: {
      y: 10, // Force the y-coordinate to be 10, replacing the calculated y-coordinate
      attrs: {
        text: {
          fill: 'red', // Set the label color to red
        },
      },
    },
  },
}
```

<code id="port-label-layout-side" src="@/src/api/port-label-layout/side/index.tsx"></code>

### Inside/Outside

The label is located inside or outside the node, supporting the following four layouts:

-  `'inside'` The label is located inside the node, close to the edge.
-  `'outside'` The label is located outside the node, close to the edge.
-  `'insideOriented'` The label is located inside the node and automatically adjusts the text direction based on the position.
-  `'outsideOriented'` The label is located outside the node and automatically adjusts the text direction based on the position.

You can set the offset from the node center to the label position through `args.offset`.

```ts
interface InOutArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| Name   | Type           | Required | Default Value | Description                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `15`   | Offset from the node center to the label position.     |
| x      | number         |      | -      | Replace the calculated X coordinate with the specified value. |
| y      | number         |      | -      | Replace the calculated Y coordinate with the specified value. |
| angle  | number         |      | -      | Replace the calculated rotation angle with the specified value. |
| attrs  | Attr.CellAttrs |      | -      | Label attributes.                                 |

```ts
label: {
  position: {
    name : 'outside',
  },
}
```

<code id="port-label-layout-inside-outside" src="@/src/api/port-label-layout/inside-outside/index.tsx"></code>

### Radial

Place the label on the outer circle or ellipse of the node. Supports the following two layouts:

-  `'radial'` The label is located on the outer circle or ellipse of the node.
-  `'radialOriented'` The label is located on the outer circle or ellipse of the node and automatically adjusts the text direction based on the position.

```ts
interface RadialArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| Name   | Type           | Required | Default Value | Description                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `20`   | Offset from the node center to the label position.     |
| x      | number         |      | -      | Replace the calculated X coordinate with the specified value. |
| y      | number         |      | -      | Replace the calculated Y coordinate with the specified value. |
| angle  | number         |      | -      | Replace the calculated rotation angle with the specified value. |
| attrs  | Attr.CellAttrs |      | -      | Label attributes.                                 |

```ts
label: {
  position: {
    name : 'radial',
  },
}
```

<code id="port-label-layout-radial" src="@/src/api/port-label-layout/radial/index.tsx"></code>

## Custom Port Label Layout

The port label layout algorithm is a function with the following signature, returning the position and rotation angle of the label relative to the port.

```ts
type Definition<T> = (
  portPosition: Point, // port position
  elemBBox: Rectangle, // node bounding box
  args: T, // label position arguments
) => Result

interface Result {
  position: Point.PointLike // label position relative to port
  angle: number // label rotation angle
  attrs: Attr.CellAttrs // label attributes
}
```

So we can create a custom layout algorithm according to the above rules, for example, implementing a layout that is located at the bottom right of the port:

```ts
function bottomRight(portPosition, elemBBox, args) {
  const dx = args.dx || 10
  const dy = args.dy || 10

  return {
    position: {
      x: portPosition.x + dx,
      y: portPosition.y + dy,
    }
  }
}
```

After implementing the layout algorithm, we need to register it to the system. After registration, we can use it like built-in layout algorithms.

```ts
Graph.registerPortLabelLayout('bottomRight', bottomRight)
```

After registration, we can use it like built-in layout algorithms:

```ts
const rect = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'top',
        },
        label: {
          position: {
            name: 'bottomRight',
          },
        },
      },
    },

    items: [
      { id: 'port1', group: 'group1' },
      { id: 'port2', label: { position: 'bottomRight' } },
    ],
  },
})
```