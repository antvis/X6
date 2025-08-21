---
title: Graphic Transformations
order: 0
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="In this chapter, we mainly introduce the graphic transformation plugin. By reading, you can learn about"}

- How to adjust node size using the interactive plugin
- How to adjust node rotation angle using the interactive plugin

:::

## Usage

Using `UI` components to adjust node size and angle is a common requirement. We provide a plugin `transform` to utilize this functionality, we can use it in our code like this:

```ts
import { Transform } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Transform({
    resizing: resizingOptions,
    rotating: rotatingOptions,
  }),
)
```

## Demo

First, let's experience interactive resizing of nodes (clicking on a node brings up the operation component):

<code id="plugin-transform-resizing" src="@/src/tutorial/plugins/transform/resizing/index.tsx"></code>

Next, let's experience interactive rotation of nodes (clicking on a node brings up the operation component):

<code id="plugin-transform-rotating" src="@/src/tutorial/plugins/transform/rotating/index.tsx"></code>

## Configuration

### Resizing

| Property Name       | Type    | Default Value | Required | Description                                   |
|---------------------|---------|---------------|----------|-----------------------------------------------|
| enabled             | boolean | `false`       |          | Whether resizing of nodes is supported        |
| minWidth            | number  | 0             |          | Minimum resizing width                         |
| minHeight           | number  | 0             |          | Minimum resizing height                        |
| maxWidth            | number  | `Infinity`    |          | Maximum resizing width                         |
| maxHeight           | number  | `Infinity`    |          | Maximum resizing height                        |
| orthogonal          | boolean | `true`        |          | Whether to show intermediate resizing points   |
| restrict            | boolean | `false`       |          | Whether resizing boundaries can exceed canvas edges |
| autoScroll          | boolean | `true`        |          | Whether to automatically scroll the canvas when dragging exceeds its bounds |
| preserveAspectRatio | boolean | `false`       |          | Whether to maintain the aspect ratio during resizing |
| allowReverse        | boolean | `true`        |          | Whether to allow control points to drag in reverse when reaching minimum width or height |

The above configuration supports dynamic modification using functions as well:

```ts
new Transform({
  resizing: {
    enabled: true,
    orthogonal(node: Node) {
      const { enableOrthogonal } = node.getData()
      return enableOrthogonal
    },
  },
})
```

### Rotating

| Property Name | Type    | Default Value | Required | Description                     |
|---------------|---------|---------------|----------|---------------------------------|
| enabled       | boolean | `false`       |          | Whether rotating of nodes is supported |
| grid          | number  | 15            |          | Angle of rotation per step      |

The above configuration also supports dynamic modification using functions:

```ts
new Transform({
  rotating: {
    enabled: true,
    grid() {
      return 30
    },
  },
})
```

## API

### graph.createTransformWidget(node: Node)

Creates a transform control for the node.

### graph.clearTransformWidgets()

Clears all transform controls.

## Events

| Event Name        | Parameter Type                                                                      | Description                   |
|-------------------|-------------------------------------------------------------------------------------|-------------------------------|
| `node:resize`     | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered when resizing starts |
| `node:resizing`   | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered during resizing     |
| `node:resized`    | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`       | Triggered after resizing      |
| `node:rotate`     | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered when rotation starts |
| `node:rotating`   | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered during rotation     |
| `node:rotated`    | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`       | Triggered after rotation      |

```ts
graph.on('node:rotated', ({ node }) => {
  console.log(node.angle())
})

// We can also listen to events on the plugin instance
transform.on('node:rotated', ({ node }) => {
  console.log(node.angle())
})
```
