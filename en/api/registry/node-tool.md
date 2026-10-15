---
title: "Node Tools"
description: "Node Tools"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/node-tool/"
version: "3.x"
---

[Resource index](/llms.txt)

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Color, NodeView } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 120,
      height: 48,
      label: 'source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: [
        {
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn A',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: '100%',
            y: '100%',
            offset: { x: -18, y: -18 },
            onClick({ view }: { view: NodeView }) {
              const node = view.cell
              const fill = Color.randomHex()
              node.attr({
                body: {
                  fill,
                },
                label: {
                  fill: Color.invert(fill, true),
                },
              })
            },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 160,
      y: 180,
      width: 120,
      height: 48,
      label: 'target',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 14,
                  stroke: '#fe854f',
                  'stroke-width': 3,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn B',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  'font-size': 8,
                  'text-anchor': 'middle',
                  'pointer-events': 'none',
                  y: '0.3em',
                },
              },
            ],
            x: 0,
            y: 0,
            offset: { x: 18, y: 18 },
            onClick({ view }: { view: NodeView }) {
              const node = view.cell
              const offset = parseInt(
                node.attr('body/strokeDashoffset') || '0',
                10,
              )
              node.attr({
                body: {
                  stroke: Color.randomHex(),
                  strokeDasharray: '5, 1',
                  strokeDashoffset: offset + 20,
                },
              })
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ cell }) => {
      if (cell === target) {
        cell.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="button-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
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

    const target = graph.addNode({
      x: 120,
      y: 160,
      width: 100,
      height: 40,
      label: 'target',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'button-remove',
          args: {
            x: 0,
            y: 0,
            offset: { x: 10, y: 10 },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ node }) => {
      if (node === target) {
        node.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="button-remove-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
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
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = graph.addNode({
      x: 120,
      y: 160,
      width: 100,
      height: 40,
      label: 'target',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('node:mouseenter', ({ node }) => {
      if (node === target) {
        node.addTools({
          name: 'boundary',
          args: {
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              'stroke-width': 1,
              'fill-opacity': 0.2,
            },
          },
        })
      }
    })

    graph.on('node:mouseleave', ({ node }) => {
      if (node === target) {
        node.removeTools()
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="boundary-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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

> **Note**

It is important to note that after version 2.8.0, there is no need to dynamically add tools in the double-click event, and event parameters do not need to be passed.

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        connector: 'smooth',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: ['node-editor'],
    })

    const target = graph.addNode({
      x: 180,
      y: 200,
      width: 100,
      height: 40,
      label: 'target',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: ['node-editor'],
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      labels: [
        {
          position: 0.3,
          attrs: {
            label: {
              text: 'edge label 1',
            },
          },
        },
        {
          position: 0.6,
          attrs: {
            label: {
              text: 'edge label 2',
            },
          },
        },
      ],
      tools: ['edge-editor'],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="node-editor-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Color, CellView } from '@antv/x6'

Graph.registerNodeTool(
  'my-btn',
  {
    inherit: 'button',
    markup: [
      {
        tagName: 'rect',
        selector: 'button',
        attrs: {
          width: 40,
          height: 20,
          rx: 4,
          ry: 4,
          fill: 'white',
          stroke: '#fe854f',
          'stroke-width': 2,
          cursor: 'pointer',
        },
      },
      {
        tagName: 'text',
        selector: 'text',
        textContent: 'btn',
        attrs: {
          fill: '#fe854f',
          'font-size': 10,
          'text-anchor': 'middle',
          'pointer-events': 'none',
          x: 20,
          y: 13,
        },
      },
    ],
    onClick({ view }: { view: CellView }) {
      const node = view.cell
      const fill = Color.randomHex()
      node.attr({
        body: {
          fill,
        },
        label: {
          fill: Color.invert(fill, true),
        },
      })
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 140,
      height: 48,
      label: 'source',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      tools: [
        {
          name: 'my-btn',
          args: {
            x: '100%',
            y: '100%',
            offset: { x: -44, y: -24 },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 160,
      y: 160,
      width: 140,
      height: 48,
      label: 'target',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="custom-button-tool-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/node-tool/button/index.less

```less
.button-tool-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/node-tool/button-remove/index.less

```less
.button-remove-tool-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/node-tool/boundary/index.less

```less
.boundary-tool-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/node-tool/node-editor/index.less

```less
.node-editor-tool-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/node-tool/custom-button/index.less

```less
.custom-button-tool-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
