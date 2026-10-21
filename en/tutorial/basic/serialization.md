---
title: "Data Serialization"
description: "Data Serialization"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/basic/serialization/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to canvas data serialization. By reading, you can learn about**

- How to export data
- How to import data


## Export

Call `graph.toJSON()` to export nodes and edges. It returns an object like `{ cells: [] }`, where the `cells` array stores nodes and edges **in render order**.

Exported node structure:

```ts
{
  id: string,
  shape: string,
  position: {
    x: number,
    y: number
  },
  size: {
    width: number,
    height: number
  },
  attrs: object,
  zIndex: number,
}
```

Exported edge structure:

```ts
{
  id: string,
  shape: string,
  source: object,
  target: object,
  attrs: object,
  zIndex: number,
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'


hljs.registerLanguage('json', json)

export default class Example extends React.Component {
  private container: HTMLDivElement
  private code: HTMLElement

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
      label: 'Hello',
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
      x: 240,
      y: 180,
      width: 100,
      height: 40,
      shape: 'ellipse',
      label: 'World',
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
      label: 'X6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    const parse = () => {
      this.code.innerText = JSON.stringify(graph.toJSON(), null, 2)
      hljs.highlightBlock(this.code)
    }

    parse()

    graph.on('cell:change:*', parse)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refCode = (code: HTMLElement) => {
    this.code = code
  }

  render() {
    return (
      <div className="to-json-app">
        <div className="app-side">
          <pre>
            <code className="language-json" ref={this.refCode} />
          </pre>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Import

Supports an array of node/edge metadata `graph.fromJSON(cells: (Node.Metadata | Edge.Metadata)[])`.

```ts
graph.fromJSON([
  {
    id: 'node1',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'rect',
  },
  {
    id: 'node2',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'ellipse',
  },
  {
    id: 'edge1',
    source: 'node1',
    target: 'node2',
    shape: 'edge',
  },
])
```

Alternatively, provide an object containing `cells`, `nodes`, and `edges`, rendered in the order of `[...cells, ...nodes, ...edges]`.

```ts
graph.fromJSON({
  nodes: [],
  edges: [],
})
```

Typically, we render the data exported by `graph.toJSON()` using `graph.fromJSON(...)`.

> **Tip**

When the data does not provide a `zIndex`, the rendering is done according to the order of nodes/edges in the array, meaning that nodes/edges that appear earlier have a smaller `zIndex`, resulting in a lower layer in the canvas.
### docs/demos/tutorial/basic/serialization/to-json/index.less

```less
.to-json-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    width: 320px;
    height: 280px;
    overflow: auto;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
