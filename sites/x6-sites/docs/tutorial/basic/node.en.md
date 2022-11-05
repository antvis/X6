---
title: 节点 Node
order: 1
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

In the [Quick Start](/en/docs/tutorial/getting-started) case, we quickly added two rectangular nodes and an edge to the canvas using JSON data, and briefly described how to customize the node style. Next we'll learn more about how to create nodes and understand the basic options for creating nodes.

## Create Node

### Options

Nodes all have a common base class [Cell](/en/docs/tutorial/basic/cell), which supports the following options in addition to [options inherited from Cell](/en/docs/tutorial/basic/cell#basic options).

| Property Name | Type | Default | Description                         |
|--------|--------|--------|----------------------------|
| x      | Number | 0      | The node position x-coordinate in 'px'. |
| y      | Number | 0      | The y-coordinate of the node position in 'px'.。 |
| width  | Number | 1      | The width of the node in 'px'.。        |
| height | Number | 1      | The width of the node in 'px'.        |
| angle  | Number | 0      |The node rotation angle.                |

Next, let's take a look at how to use these options to create nodes.

### Way 1: Constructor


We have some built-in base nodes in the `Shape` namespace of X6, such as `Rect`, `Circle`, `Ellipse`, etc. You can use the constructors of these nodes to create nodes.

```ts
import { Shape } from '@antv/x6'

// Create a node
const rect = new Shape.Rect({
  x: 100,
  y: 200,
  width: 80,
  height: 40,
  angle: 30,
  attrs: {
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  },
})

// Add to canvas
graph.addNode(rect)
```

Here we create a rectangle node, specify the position of the node by `x` and `y` options, the size of the node by `width` and `height` options, the rotation angle of the node by `angle`, and the [node style](#node style) by `attrs` option, then add the node to the canvas by `graph. addNode` method to add the node to the canvas, the node will trigger the canvas re-rendering after it is added to the canvas, and finally the node is rendered to the canvas.

We can also create the node first, and then call the methods provided by the node to set the size, position, rotation angle, style, etc. of the node.

```ts
const rect = new Shape.Rect()

rect
  // Set the node position
  .position(100, 200)
  // Set the node size
  .resize(80, 40)
  // Rotate the node
  .rotate(30)
  // Set the node style
  .attr({
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  })

// Add to canvas
graph.addNode(rect)
```

### Way 2: graph.addNode

Alternatively, we can use the `graph.addNode` method to create nodes and add them to the canvas, **this handy method is recommended**.

```ts
const rect = graph.addNode({
  shape: 'rect', // Specify which graph to use, the default value is 'rect'
  x: 100,
  y: 200,
  width: 80,
  height: 40,
  angle: 30,
  attrs: {
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  },
})
```

The key here is to use `shape` to specify the node graph, with a default value of `'rect'` and other options consistent with those for creating nodes using the node constructor. Internally in X6, we use the shape specified by `shape` to find the corresponding constructor to initialize the node and add it to the canvas. The built-in node constructors correspond to the `shape` names [refer to this table](/en/docs/tutorial/basic/cell#built-in nodes). In addition to using [built-in-node](/en/docs/tutorial/basic/cell#built-in-node), we can also use registered custom nodes, please refer to [custom-node](/en/docs/tutorial/intermediate/custom-node) tutorial for details.

## Custom Style Attrs

We introduced [How to customize style by attrs option](/en/docs/tutorial/basic/cell#attrs-1) in the previous tutorial, and briefly learned how to customize style by [option default](/en/docs/tutorial/basic/cell#option default) and [custom option ](/en/docs/tutorial/basic/cell#custom options) to customize nodes, please combine these tutorials to learn how to customize node styles.

For example, the `Shape.Rect` node defines two selectors `'body'` (representing the `<rect>` element) and `'label'` (representing the `<text>` element). We can define the node style like the following when creating a rectangular node.

```ts
const rect = new Shape.Rect({
  x: 100,
  y: 40,
  width: 100,
  height: 40,
  attrs: { 
    body: {
      fill: '#2ECC71', // Background color
      stroke: '#000',  // Border color
    },
    label: {
      text: 'rect',    // Text
      fill: '#333',    // Text color
      fontSize: 13,    // Text size
    },
  },
})
```

<iframe src="/demos/tutorial/basic/node/style"></iframe>
