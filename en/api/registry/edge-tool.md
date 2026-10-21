---
title: "Edge Tools"
description: "Edge Tools"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/edge-tool/"
version: "3.x"
---

[Resource index](/llms.txt)

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

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'vertices',
          args: {
            attrs: { fill: '#8f8f8f' },
          },
        },
      ],
    })

    const edge2 = graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools({
          name: 'vertices',
          args: {
            attrs: { fill: '#8f8f8f' },
          },
        })
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell === edge2) {
        if (cell.hasTool('vertices')) {
          cell.removeTool('vertices')
        }
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-vertices-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'segments',
          args: {
            snapRadius: 20,
            attrs: {
              fill: '#8f8f8f',
            },
          },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: [
        {
          name: 'segments',
          args: {
            snapRadius: 20,
            attrs: {
              fill: '#8f8f8f',
            },
          },
        },
      ],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-segments-app">
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

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: ['boundary'],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: [
        {
          name: 'boundary',
          args: {
            padding: 5,
            useCellGeometry: false,
            attrs: {
              fill: '#7c68fc',
              stroke: '#333',
              strokeWidth: 0.5,
              fillOpacity: 0.2,
            },
          },
        },
      ],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-boundary-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, EdgeView } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
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
                  r: 18,
                  stroke: '#fe854f',
                  strokeWidth: 2,
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
                  fontSize: 10,
                  textAnchor: 'middle',
                  pointerEvents: 'none',
                  y: '0.3em',
                },
              },
            ],
            distance: -40,
            onClick({ view }: { view: EdgeView }) {
              const edge = view.cell
              const source = edge.getSource()
              const target = edge.getTarget()
              edge.setSource(target)
              edge.setTarget(source)
            },
          },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: {
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 18,
                stroke: '#fe854f',
                strokeWidth: 2,
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
                fontSize: 10,
                textAnchor: 'middle',
                pointerEvents: 'none',
                y: '0.3em',
              },
            },
          ],
          distance: -100,
          offset: { x: 0, y: 0 },
          onClick({ view }: { view: EdgeView }) {
            const edge = view.cell
            const offset = parseInt(
              edge.attr('line/strokeDashoffset') || '0',
              10,
            )
            edge.attr({
              line: {
                strokeDasharray: '5, 10',
                strokeDashoffset: offset + 20,
              },
            })
          },
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
      <div className="edge-tool-button-app ">
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

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'button-remove',
          args: { distance: -40 },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: [
        {
          name: 'button-remove',
          args: { distance: -40 },
        },
      ],
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-button-remove-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-node-with-port',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        padding: 3,
        attrs: {
          strokeWidth: 3,
          stroke: '#52c41a',
        },
      },
    }

    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,

        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
              },
            },
          })
        },

        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },

        validateConnection({ sourceMagnet, targetMagnet }) {
          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          return true
        },
      },
    })

    const source = graph.addNode({
      shape: 'custom-node-with-port',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'source',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    const target = graph.addNode({
      shape: 'custom-node-with-port',
      x: 140,
      y: 240,
      width: 100,
      height: 40,
      label: 'target',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addNode({
      shape: 'custom-node-with-port',
      x: 320,
      y: 120,
      width: 100,
      height: 40,
      label: 'hello',
      ports: [
        { id: 'in-1', group: 'in' },
        { id: 'in-2', group: 'in' },
        { id: 'out-1', group: 'out' },
        { id: 'out-2', group: 'out' },
      ],
    })

    graph.addEdge({
      source: { cell: source.id, port: 'out-2' },
      target: { cell: target.id, port: 'in-1' },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'source-arrowhead',
        },
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

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-arrowhead-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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

> **Note**

Note that after version 2.8.0, there is no need to dynamically add tools in the double-click event, so event parameters do not need to be passed.

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerEdgeTool(
  'red-vertices',
  {
    inherit: 'vertices',
    attrs: {
      fill: 'red',
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

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: ['red-vertices'],
    })

    const edge2 = graph.addEdge({
      source: { x: 60, y: 140 },
      target: { x: 380, y: 140 },
      vertices: [
        { x: 40, y: 180 },
        { x: 200, y: 140 },
        { x: 240, y: 180 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      if (cell === edge2) {
        cell.addTools([{ name: 'red-vertices' }])
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell === edge2) {
        if (cell.hasTool('red-vertices')) {
          cell.removeTool('red-vertices')
        }
      }
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-custom-vertices-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

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

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: null,
        },
      },
      tools: 'circle-target-arrowhead',
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-custom-arrowhead-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/edge-tool/vertices/index.less

```less
.edge-tool-vertices-app {
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
### docs/demos/api/edge-tool/segments/index.less

```less
.edge-tool-segments-app {
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
### docs/demos/api/edge-tool/boundary/index.less

```less
.edge-tool-boundary-app {
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
### docs/demos/api/edge-tool/button/index.less

```less
.edge-tool-button-app {
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
### docs/demos/api/edge-tool/button-remove/index.less

```less
.edge-tool-button-remove-app {
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
### docs/demos/api/edge-tool/arrowhead/index.less

```less
.edge-tool-arrowhead-app {
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
### docs/demos/api/edge-tool/custom-vertices/index.less

```less
.edge-tool-custom-vertices-app {
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
### docs/demos/api/edge-tool/custom-arrowhead/index.less

```less
.edge-tool-custom-arrowhead-app {
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
