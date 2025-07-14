---
title: Graph
order: 0
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title="This section mainly introduces knowledge related to the graph. By reading, you can learn about"}

- How to make the graph size responsive
- Optimizing graph style by setting background and grid
- How to make the graph draggable and resizable
- Common graph size and position manipulation APIs

:::

## Graph Size

When instantiating a `Graph` object, you can set the `width` and `height` to fix the graph size. If not set, the graph will initialize based on the size of the graph container.

In practical projects, you often encounter the following two scenarios:

- The graph container has not finished rendering (at this point, its size is 0), leading to abnormal display of the graph elements when the graph object is instantiated.
- The page's `resize` causes the graph container size to change, resulting in abnormal display of the graph elements.

We can use the `autoResize` configuration to solve the above problems.

```html
<!-- Note: When using the autoResize configuration, you need to wrap the graph container in an outer container that has a width and height of 100%. Listen for size changes on the outer container, and when the outer container size changes, the graph will automatically recalculate its width, height, and element positions. -->
<div style="width:100%; height:100%">
  <div id="container"></div>
</div>
```

```ts
const graph = new Graph({
  container: document.getElementById('container'),
  autoResize: true,
})
```

In the example below, you can drag the gray area with the mouse to change the container size. You can see through the background color that the sizes of the three graphs are adaptive.

<code id="auto-resize" src="@/src/tutorial/basic/graph/auto-resize/index.tsx"></code>

## Background and Grid

You can set the graph background and grid using the `background` and `grid` configurations.

<code id="background-grid" src="@/src/tutorial/basic/graph/background-grid/index.tsx"></code>

:::info{title="Tip"}
In X6, the grid is the minimum unit for rendering/moving nodes, with a default size of 10px. This means that a node positioned at `{ x: 24, y: 38 }` will actually render at `{ x: 20, y: 40 }` on the graph.
:::

The background supports not only colors but also background images. For detailed configurations and methods, refer to the [API](/en/api/graph/background). Additionally, the grid supports four different types and allows configuration of grid line colors and widths. For detailed configurations and methods, refer to the [API](/en/api/graph/grid).

## Zooming and Panning

Dragging and zooming the graph are also common operations. In Graph, these two functionalities are implemented through the `panning` and `mousewheel` configurations. When you press down on the graph and move the mouse, it will drag the graph, and scrolling the mouse wheel will zoom the graph.

```ts
const graph = new Graph({
  ...,
  panning: true,
  mousewheel: true
})
```

Let's experience this through an example:

<code id="panning-mousewheel" src="@/src/tutorial/basic/graph/panning-mousewheel/index.tsx"></code>

Of course, `panning` and `mousewheel` also support many other configurations, such as modifier keys (which must be pressed to trigger the corresponding behavior), zoom factors (rates), etc. We can learn more through the [API](/en/api/graph/mousewheel).

## Common APIs

In addition to the configurations mentioned above, X6 also provides a rich set of APIs for manipulating graph size and position. Here are some commonly used APIs; for more detailed content, see the [API](/en/api/graph/transform).

```ts
graph.resize(800, 600) // Resize the graph size
graph.translate(20, 20) // Translate the graph in the x and y directions
graph.zoom(0.2) // Increase the graph zoom level by 0.2 (default is 1)
graph.zoom(-0.2) // Decrease the graph zoom level by 0.2
graph.zoomTo(1.2) // Set the graph zoom level to 1.2
// Scale the elements in the graph to fit all elements, with maxScale configuration for the maximum zoom level
graph.zoomToFit({ maxScale: 1 })
graph.centerContent() // Center the elements in the graph for display
```

<code id="transform" src="@/src/tutorial/basic/graph/transform/index.tsx"></code>
