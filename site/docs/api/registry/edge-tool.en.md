---
title: Edge Tools
order: 4
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

Since edges are typically narrow lines or curves, interacting with them can be inconvenient. To address this issue, we render a transparent `<path>` shape that matches the edge's shape but is wider, allowing users to interact with the edge more easily. Additionally, we can add small tools to edges to enhance their interactivity, such as vertex tools that allow path points to be moved, and segment tools that enable the movement of segments within the edge.

**Scenario 1: Adding specified tools.**

```ts
// Add tools when creating an edge
graph.addEdge({
  source,
  target,
  tools: [
    { name: 'vertices' },
    {
      name: 'button-remove',
      args: { distance: 20 },
    },
  ],
})

// Add tools after creating an edge
edge.addTools([
  { name: 'vertices' },
  {
    name: 'button-remove',
    args: { distance: 20 },
  },
])
```

**Scenario 2: Dynamically adding/removing tools with the mouse.**

```ts
graph.on('edge:mouseenter', ({ cell }) => {
  cell.addTools([
    { name: 'vertices' },
    {
      name: 'button-remove',
      args: { distance: 20 },
    },
  ])
})

graph.on('edge:mouseleave', ({ cell }) => {
  if (cell.hasTool('button-remove')) {
    cell.removeTool('button-remove')
  }
})
```

In X6, the following tools for edges are provided by default:

- [vertices](#vertices) Vertex tool, renders a small dot at the position of the path point. Dragging the dot modifies the position of the path point, double-clicking the dot deletes the path point, and clicking on the edge adds a path point.
- [segments](#segments) Segment tool. Renders a tool bar at the center of each segment of the edge, allowing the tool bar to be dragged to adjust the positions of the path points at both ends of the segment.
- [boundary](#boundary) Renders a rectangle surrounding the edge based on its bounding box. Note that this tool only renders a rectangle without any interactivity.
- [button](#button) Renders a button at a specified position, supporting custom click interactions for the button.
- [button-remove](#button-remove) Renders a delete button at a specified position, which deletes the corresponding edge when clicked.
- [source-arrowhead and target-arrowhead](#source-arrowhead-and-target-arrowhead) Renders a shape (default is an arrow) at the start or end of the edge, allowing the shape to be dragged to modify the start or end of the edge.
- [edge-editor](#edge-editor) Provides text editing functionality on the edge.

## Built-in Tools

### vertices

The path point tool renders a small dot at the position of the path point. You can drag the dot to modify the path point's position, double-click the dot to delete the path point, and click on the edge to add a new path point. The configuration is as follows:

| Parameter Name       | Type                      | Default Value | Description                                                                                                           |
|----------------------|---------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------|
| attrs                | KeyValue                  | `object`      | Attributes of the small dot.                                                                                         |
| snapRadius           | number                    | `20`          | The snap radius during the movement of the path point. When the path point is within the radius of a neighboring path point, it will snap to that point. |
| addable              | boolean                   | `true`        | Whether new path points can be added by clicking the mouse on the edge.                                              |
| removable            | boolean                   | `true`        | Whether path points can be removed by double-clicking.                                                                |
| removeRedundancies   | boolean                   | `true`        | Whether to automatically remove redundant path points.                                                                |
| stopPropagation      | boolean                   | `true`        | Whether to prevent mouse events on the tool from bubbling up to the edge view. If prevented, mouse interactions with the tool will not trigger the edge's `mousedown`, `mousemove`, and `mouseup` events. |
| modifiers            | `string \| ModifierKey[]` | -             | Keys that must be pressed to add path points, which can resolve the overlap of interactions for adding path points and clicking on edges. |

The default value (default style) for `attrs` is:

```ts
{
  r: 6,
  fill: '#333',
  stroke: '#fff',
  cursor: 'move',
  'stroke-width': 2,
}
```

The tool is used as follows:

```ts
// Add the small tool when creating an edge
const edge1 = graph.addEdge({
  ...,
  tools: [
    {
      name: 'vertices',
      args: {
        attrs: { fill: '#666' },
      },
    },
  ]
})
```

<code id="api-edge-tool-vertices" src="@/src/api/edge-tool/vertices/index.tsx"></code>

### segments

The line segment tool renders a tool bar at the center of each line segment of the edge, allowing you to drag the tool bar to adjust the positions of the path points at both ends of the segment. The configuration is as follows:

| Parameter Name       | Type    | Default Value | Description                                                                                                           |
|----------------------|---------|---------------|-----------------------------------------------------------------------------------------------------------------------|
| attrs                | object  | `object`      | Attributes of the element.                                                                                            |
| precision            | number  | `0.5`         | The tool is rendered only when the coordinate difference of the X or Y axis of the two endpoints of the segment is less than `precision`. The default `0.5` means the tool is rendered only for vertical and horizontal segments. |
| threshold            | number  | `40`          | The tool is rendered only when the segment length exceeds `threshold`.                                               |
| snapRadius           | number  | `10`          | The snap radius during the adjustment of the segment.                                                                |
| removeRedundancies   | boolean | `true`        | Whether to automatically remove redundant path points.                                                                |
| stopPropagation      | boolean | `true`        | Whether to prevent mouse events on the tool from bubbling up to the edge view. If prevented, mouse interactions with the tool will not trigger the edge's `mousedown`, `mousemove`, and `mouseup` events. |

The default value (default style) for `attrs` is:

```ts
{
  width: 20,
  height: 8,
  x: -10,
  y: -4,
  rx: 4,
  ry: 4,
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
}
```

The tool is used as follows:

```ts
graph.addEdge({
  ...,
  tools: [{
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  }]
})
```

<code id="api-edge-tool-segments" src="@/src/api/edge-tool/segments/index.tsx"></code>

### boundary

Renders a rectangle surrounding the edge based on its bounding box. Note that this tool only renders a rectangle and does not provide any interaction. The configuration is as follows:

| Parameter Name      | Type     | Default Value | Description                                                                                                           |
|---------------------|----------|---------------|-----------------------------------------------------------------------------------------------------------------------|
| tagName             | string   | `rect`        | The type of shape to render.                                                                                         |
| padding             | number   | `10`          | Margin.                                                                                                              |
| attrs               | KeyValue | `object`      | Shape attributes.                                                                                                    |
| useCellGeometry     | boolean  | `true`        | Whether to use geometric calculations to compute the element's bounding box. Enabling this will improve performance, but if there are accuracy issues, set it to `false`. |

The default value (default style) for `attrs` is:

```js
{
  fill: 'none',
  stroke: '#333',
  'stroke-width': 0.5,
  'stroke-dasharray': '5, 5',
  'pointer-events': 'none',
}
```

The tool is used as follows:

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'boundary',
      args: {
        padding: 5,
        attrs: {
          fill: '#7c68fc',
          stroke: '#333',
          'stroke-width': 0.5,
          'fill-opacity': 0.2,
        },
      },
    },
  ]
})
```

<code id="api-edge-tool-boundary" src="@/src/api/edge-tool/boundary/index.tsx"></code>

### button

Renders a button at a specified position, supporting custom click interactions. The configuration is as follows:

| Parameter Name | Type                                                                   | Default Value | Description                          |
|----------------|------------------------------------------------------------------------|---------------|--------------------------------------|
| distance        | number \| string                                                       | `undefined`   | Distance or ratio from the start point. |
| offset          | number \| Point.PointLike                                              | `0`           | Offset based on `distance`.         |
| rotate          | boolean                                                                | `undefined`   | Whether to rotate with the edge.    |
| markup          | Markup.JSONMarkup                                                      | `undefined`   | Markup definition for rendering the button. |
| onClick         | `(args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void` | `undefined`   | Callback function for button click. |

The usage is as follows:

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'button',
      args: {
        distance: -40,
        onClick({ view }: any) {
          //
        },
      },
    },
  ],
})
```

<code id="api-edge-tool-button" src="@/src/api/edge-tool/button/index.tsx"></code>

### button-remove

Renders a delete button at a specified position, which deletes the corresponding edge when clicked. It is a special case of the `button` tool above, so it supports all configurations of `button`. The usage is as follows:

```ts
graph.addEdge({
  ...,
  tools: [
    {
      name: 'button-remove',
      args: { distance: -40 },
    },
  ]
})
```

<code id="api-edge-tool-button-remove" src="@/src/api/edge-tool/button-remove/index.tsx"></code>

### source-arrowhead and target-arrowhead

Renders a shape (default is an arrow) at the start or end of the edge, allowing you to drag the shape to modify the start or end of the edge. The configuration is as follows:

| Parameter Name | Type             | Default Value | Description                |
|----------------|------------------|---------------|----------------------------|
| tagName        | string           | `path`        | The type of shape to render. |
| attrs          | Attr.SimpleAttrs | `object`      | Attributes of the shape.    |

The default value for `source-arrowhead` attributes is:

```ts
{
  d: 'M 10 -8 -10 0 10 8 Z',
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
  cursor: 'move',
}
```

The default value for `target-arrowhead` attributes is:

```ts
{
  d: 'M -10 -8 10 0 -10 8 Z',
  fill: '#333',
  stroke: '#fff',
  'stroke-width': 2,
  cursor: 'move',
}
```

The tool is used as follows:

```ts
graph.on('edge:mouseenter', ({ cell }) => {
  cell.addTools([
    'source-arrowhead',
    {
      name: 'target-arrowhead',
      args: {
        attrs: {
          fill: 'red',
        },
      },
    },
  ])
})

graph.on('edge:mouseleave', ({ cell }) => {
  cell.removeTools()
})
```

<code id="api-edge-tool-arrowhead" src="@/src/api/edge-tool/arrowhead/index.tsx"></code>

### edge-editor

Provides text editing functionality on the edge. The configuration is as follows:

| Parameter Name                | Type                                                                    | Default Value                     | Description                                                       |
|-------------------------------|-------------------------------------------------------------------------|----------------------------------|------------------------------------------------------------------|
| labelAddable                  | boolean                                                                 | true                             | Whether to create a new label by clicking on a non-text position. |
| attrs/fontSize                | string                                                                  | `14`                             | Font size for editing text.                                      |
| attrs/color                   | string                                                                  | `#000`                           | Font color for editing text.                                      |
| attrs/fontFamily              | string                                                                  | `Arial, helvetica, sans-serif`   | Font for editing text.                                           |
| attrs/backgroundColor         | string                                                                  | `#fff`                           | Background color for the editing area.                           |
| getText                       | string \| `(this: CellView, args: {cell: Cell}) => string`              | -                                | Method to get the original text; needs to be customized in custom `markup` scenarios. |
| setText                       | string \| `(this: CellView, args: {cell: Cell, value: string}) => void` | -                                | Method to set new text; needs to be customized in custom `markup` scenarios. |

:::warning{title=Note}
Note that after version 2.8.0, there is no need to dynamically add tools in the double-click event, so event parameters do not need to be passed.
:::

```ts
// Usage before version 2.8.0
graph.on('node:dblclick', ({ node, e }) => {
  edge.addTools({
    name: 'edge-editor',
    args: {
      event: e,
    },
  })
})

// Usage after version 2.8.0
edge.addTools({
  name: 'edge-editor',
})
```

It is also important to note that if a custom `markup` is defined in the edge, it is often necessary to customize the `getText` and `setText` methods to correctly get and set the edited text. Both configurations support function and string forms; the function is straightforward, while the string is the property path of the text to get or set. Generally, it is recommended to use the string form so that the graph data can be fully serialized (since functions cannot be serialized), otherwise, issues may arise with the text editing functionality after rendering the canvas. For example:

```typescript
edge.addTools({
  name: 'edge-editor',
  args: {
    getText: 'a/b',
    setText: 'c/d',
  },
})
```

The above configuration indicates:

- Get edited text: `edge.attr('a/b')`
- Set edited text: `edge.attr('c/d', value)`

<code id="api-edge-tool-editor" src="@/src/api/node-tool/node-editor/index.tsx"></code>

## Custom Tools

### Method One

Inherit from `ToolItem` to implement a tool class, which is more complex and requires understanding of the [ToolItem](https://github.com/antvis/X6/blob/master/src/view/tool.ts) class. You can refer to the source code of the built-in tools above; this will not be elaborated here.

```ts
Graph.registerEdgeTool('button', Button)
```

### Method Two

Inherit from an already registered tool and modify the configuration based on that. We provide a static method `define` on the `ToolItem` base class to quickly implement inheritance and modify configurations.

```ts
import { Vertices } from '@antv/x6/es/registry/tool/vertices'

const RedVertices = Vertices.define<Vertices.Options>({
  attrs: {
    fill: 'red',
  },
})

Graph.registerEdgeTool('red-vertices', RedVertices, true)
```

<code id="api-edge-tool-custom-vertices" src="@/src/api/edge-tool/custom-vertices/index.tsx"></code>

Additionally, we provide a quick way to inherit and specify default options for the `Graph.registerEdgeTool` method:

```ts
Graph.registerEdgeTool('red-vertices', {
  inherit: 'vertices', // Base class name, using the name of the already registered tool.
  attrs: {
    // Other options, as default options for the inherited class.
    fill: 'red',
  },
})
```

Using this method, we can quickly define and register a circular endpoint `circle-target-arrowhead`:

```ts
Graph.registerEdgeTool('circle-target-arrowhead', {
  inherit: 'target-arrowhead',
  tagName: 'circle',
  attrs: {
    r: 18,
    fill: '#31d0c6',
    'fill-opacity': 0.3,
    stroke: '#fe854f',
    'stroke-width': 4,
    cursor: 'move',
  },
})
```

<code id="api-edge-tool-custom-arrowhead" src="@/src/api/edge-tool/custom-arrowhead/index.tsx"></code>
