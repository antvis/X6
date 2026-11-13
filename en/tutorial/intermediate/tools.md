---
title: "Tools"
description: "Tools"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/intermediate/tools/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to tools. By reading, you can learn about**

- How to add tools for nodes or edges
- Common tools built into X6


## Using Tools

When creating nodes/edges, you can add tools through the [`tools`](/en/api/model/cell#tools) option:

```ts
graph.addNode({
  tools: [
    {
      name: 'button-remove', // Tool name
      args: {
        // Tool parameters
        x: 10,
        y: 10,
      },
    },
  ],
})

// If no parameters are needed, you can abbreviate as:
graph.addNode({
  tools: ['button-remove'],
})

graph.addEdge({
  source,
  target,
  vertices: [
    {
      x: 90,
      y: 160,
    },
    {
      x: 210,
      y: 160,
    },
  ],
  tools: ['vertices', 'segments'],
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-tools-node',
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
      shape: 'custom-tools-node',
      x: 40,
      y: 40,
      label: 'Source',
      tools: ['button-remove'],
    })

    const target = graph.addNode({
      shape: 'custom-tools-node',
      x: 160,
      y: 240,
      label: 'Target',
      tools: ['button-remove'],
    })

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 90, y: 160 },
        { x: 210, y: 160 },
      ],
      tools: ['vertices', 'segments'],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="tools-basic-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



After nodes/edges are created, you can call methods like [hasTool(name)](/en/api/model/cell#hastool), [addTools(...)](/en/api/model/cell#addtools), and [removeTools()](/en/api/model/cell#removetools) to add or remove tools.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-tools-node',
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
      shape: 'custom-tools-node',
      x: 40,
      y: 40,
      label: 'Source',
    })

    const target = graph.addNode({
      shape: 'custom-tools-node',
      x: 160,
      y: 240,
      label: 'Target',
    })

    graph.addEdge({
      source,
      target,
      vertices: [
        { x: 90, y: 160 },
        { x: 210, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.on('cell:mouseenter', ({ cell }) => {
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'boundary',
            args: {
              attrs: {
                fill: '#7c68fc',
                stroke: '#333',
                'stroke-width': 1,
                'fill-opacity': 0.2,
              },
            },
          },
          {
            name: 'button-remove',
            args: {
              x: 0,
              y: 0,
              offset: { x: 10, y: 10 },
            },
          },
        ])
      } else {
        cell.addTools(['vertices', 'segments'])
      }
    })

    graph.on('cell:mouseleave', ({ cell }) => {
      cell.removeTools()
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="tools-onhover-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Built-in Tools

Tools are widgets rendered on nodes/edges to enhance interactivity. We provide the following built-in tools for nodes and edges:

### Nodes

- [button](/en/api/registry/node-tool#button) Renders a button at a specified position; supports custom click interactions.
- [button-remove](/en/api/registry/node-tool#button-remove) Renders a delete button at a specified position; clicking deletes the node.
- [boundary](/en/api/registry/node-tool#boundary) Renders a rectangle around the node based on its bounding box. Note: visualization only; no interaction.

### Edges

- [vertices](/en/api/registry/edge-tool#vertices) Renders dots at path points. Drag to move; double-click to delete; click on the edge to add.
- [segments](/en/api/registry/edge-tool#segments) Renders a handle at each segment’s center; drag to adjust the adjacent path points.
- [boundary](/en/api/registry/edge-tool#boundary) Renders a rectangle around the edge based on its bounding box. Note: visualization only; no interaction.
- [button](/en/api/registry/edge-tool#button) Renders a button at a specified position; supports custom click interactions.
- [button-remove](/en/api/registry/edge-tool#button-remove) Renders a delete button at a specified position; clicking deletes the edge.
- [source-arrowhead and target-arrowhead](/en/api/registry/edge-tool#source-arrowhead-and-target-arrowhead) Renders a shape (arrow by default) at the source/target terminal; drag to adjust the terminal.
### docs/demos/tutorial/intermediate/tools/basic/index.less

```less
.tools-basic-app {
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
### docs/demos/tutorial/intermediate/tools/onhover/index.less

```less
.tools-onhover-app {
  display: flex;
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
