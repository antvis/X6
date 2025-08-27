---
title: Node Tools
order: 3
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

Node tools are small components rendered on nodes that typically come with some interactive features, such as a delete button that removes the corresponding node when clicked. We can add or remove tools based on the following scenarios.

```ts
// Add tools when creating a node
graph.addNode({
  ...,
  tools: [
    {
      name: 'button-remove',
      args: { x: 10, y: 10 },
    },
  ],
})

// Add tools after creating a node
node.addTools([
  {
    name: 'button-remove',
    args: { x: 10, y: 10 },
  },
])

// Remove tool
graph.on("node:mouseleave", ({ node }) => {
  if (node.hasTool("button-remove")) {
    node.removeTool("button-remove");
  }
});
```

X6 provides the following default tools for nodes:

- [button](#button) Renders a button at a specified position, supporting custom click interactions for the button.
- [button-remove](#button-remove) Renders a delete button at a specified position, which deletes the corresponding node when clicked.
- [boundary](#boundary) Renders a rectangle surrounding the node based on the node's bounding box. Note that this tool only renders a rectangle and does not provide any interaction.
- [node-editor](#node-editor) Provides text editing functionality for the node.
## Built-in Tools

### button

Renders a button at a specified position, supporting custom click interactions. The configuration is as follows:

| Parameter Name     | Type                                                                   | Default Value | Description                                                                                             |
|--------------------|------------------------------------------------------------------------|---------------|---------------------------------------------------------------------------------------------------------|
| x                  | number \| string                                                       | `0`           | The X coordinate relative to the top-left corner of the node, with decimals and percentages indicating relative positions. |
| y                  | number \| string                                                       | `0`           | The Y coordinate relative to the top-left corner of the node, with decimals and percentages indicating relative positions. |
| offset             | number \| `{ x: number, y: number }`                                   | `0`           | The offset based on `x` and `y`.                                                                        |
| rotate             | boolean                                                                | -             | Whether to follow the rotation of the node.                                                              |
| useCellGeometry    | boolean                                                                | `true`        | Whether to use geometric calculations to compute the element's bounding box. Enabling this improves performance; if accuracy issues arise, set it to `false`. |
| markup             | Markup.JSONMarkup                                                      | -             | The Markup definition for rendering the button.                                                          |
| onClick            | `(args: {e: Dom.MouseDownEvent, cell: Cell, view: CellView }) => void` | -             | Callback function for button clicks.                                                                      |

```ts
// Add button on mouse hover
graph.on('node:mouseenter', ({ node }) => {
  node.addTools({
    name: 'button',
    args: {
      markup: ...,
      x: 0,
      y: 0,
      offset: { x: 18, y: 18 },
      onClick({ view }) { ... },
    },
  })
})

// Remove button on mouse leave
graph.on('node:mouseleave', ({ node }) => {
   node.removeTools() // Remove all tools
})
```

<code id="api-node-tool-button" src="@/src/api/node-tool/button/index.tsx"></code>

### button-remove

Renders a delete button at a specified position, which deletes the corresponding node when clicked. It is a special case of the `button` tool, so it supports all configurations of `button`.

```ts
const source = graph.addNode({
  ...,
  // Add a delete button that is always visible
  tools: [
    {
      name: 'button-remove',
      args: {
        x: '100%',
        y: 0,
        offset: { x: -10, y: 10 },
      },
    },
  ],
})
```

<code id="api-node-tool-button-remove" src="@/src/api/node-tool/button-remove/index.tsx"></code>

### boundary

Renders a rectangle surrounding the node based on its bounding box. Note that this tool only renders a rectangle without any interaction. The configuration is as follows:

| Parameter Name     | Type        | Default Value | Description                                                                                             |
|--------------------|-------------|---------------|---------------------------------------------------------------------------------------------------------|
| tagName            | string      | `rect`        | The shape used for rendering.                                                                            |
| rotate             | boolean     | -             | Whether the shape follows the rotation of the node.                                                      |
| padding            | SideOptions | `10`          | Margin.                                                                                                  |
| attrs              | KeyValue    | `object`      | Shape attributes.                                                                                        |
| useCellGeometry    | boolean     | `true`        | Whether to use geometric calculations to compute the element's bounding box. Enabling this improves performance; if accuracy issues arise, set it to `false`. |

The default values (default styles) for `attrs` are:

```ts
{
  fill: 'none',
  stroke: '#333',
  'stroke-width': 0.5,
  'stroke-dasharray': '5, 5',
  'pointer-events': 'none',
}
```

The type definition for `SideOptions` is as follows:

```typescript
type SideOptions =
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

The tool usage is as follows:

```ts
const source = graph.addNode({
  ...,
  tools: [
    {
      name: 'boundary',
      args: {
        padding: 5,
        attrs: {
          fill: '#7c68fc',
          stroke: '#333',
          'stroke-width': 1,
          'fill-opacity': 0.2,
        },
      },
    },
  ],
})
```

<code id="api-node-tool-boundary" src="@/src/api/node-tool/boundary/index.tsx"></code>

### node-editor

Provides text editing functionality on the node. The configuration is as follows:

| Parameter Name                | Type                                                                    | Default Value                     | Description                                                   |
|-------------------------------|-------------------------------------------------------------------------|----------------------------------|---------------------------------------------------------------|
| x                             | number \| string                                                        | -                                | The X coordinate relative to the top-left corner of the node, with decimals and percentages indicating relative positions. |
| y                             | number \| string                                                        | -                                | The Y coordinate relative to the top-left corner of the node, with decimals and percentages indicating relative positions. |
| attrs/fontSize                | string                                                                  | `14`                             | Font size of the edited text.                                 |
| attrs/color                   | string                                                                  | `#000`                           | Font color of the edited text.                                |
| attrs/fontFamily              | string                                                                  | `Arial, helvetica, sans-serif`  | Font of the edited text.                                      |
| attrs/backgroundColor         | string                                                                  | `#fff`                           | Background color of the editing area.                         |
| getText                       | string \| `(this: CellView, args: {cell: Cell}) => string`              | -                                | Method to get the original text; needs to customize `getText` method in custom `markup` scenarios. |
| setText                       | string \| `(this: CellView, args: {cell: Cell, value: string}) => void` | -                                | Method to set new text; needs to customize `setText` method in custom `markup` scenarios. |

:::warning{title=Note}
It is important to note that after version 2.8.0, there is no need to dynamically add tools in the double-click event, and event parameters do not need to be passed.
:::

```ts
// Usage before version 2.8.0
graph.on('node:dblclick', ({ node, e }) => {
  node.addTools({
    name: 'node-editor',
    args: {
      event: e,
    },
  })
})

// Usage after version 2.8.0
node.addTools({
  name: 'node-editor',
})
```

It is also important to note that if a custom `markup` is defined in the node, it is often necessary to customize the `getText` and `setText` methods to correctly get and set the edited text. Both configurations support both function and string forms; the function form is easier to understand, while the string form is essentially the property path of the text to be retrieved or set. Generally, it is recommended to use the string form so that the graph data can be fully serialized (since functions cannot be serialized), otherwise, issues may arise with the text editing functionality after rendering the canvas, for example:

```typescript
node.addTools({
  name: 'node-editor',
  args: {
    getText: 'a/b',
    setText: 'c/d',
  },
})
```

The above configuration indicates:

- Get edited text: `node.attr('a/b')`
- Set edited text: `node.attr('c/d', value)`

<code id="api-node-tool-editor" src="@/src/api/node-tool/node-editor/index.tsx"></code>

## Custom Tools

### Method One

Inherit from `ToolItem` to implement a tool class, which is more challenging and requires understanding of the [ToolItem](https://github.com/antvis/X6/blob/master/src/view/tool.ts) class. You can refer to the source code of the built-in tools above; this will not be elaborated here.

```ts
Graph.registerNodeTool('button', Button)
```

### Method Two

Inherit from an already registered tool and modify the configuration based on the inheritance. We provide a static method `define` on the `ToolItem` base class to quickly implement inheritance and modify configurations.

```ts
const MyButton = Button.define<Button.Options>({
  name: 'my-btn',
  markup: ...,
  onClick({ view }) { ... },
})

Graph.registerNodeTool('my-btn', MyButton, true)
```

Additionally, we provide a quick inheritance implementation for the `Graph.registerNodeTool` method to specify default options:

```ts
Graph.registerNodeTool('my-btn', {
  inherit: 'button', // Base class name, using the name of the already registered tool.
  markup: ...,
  onClick: ...,
})
```

<code id="api-node-tool-custom-button" src="@/src/api/node-tool/custom-button/index.tsx"></code>
