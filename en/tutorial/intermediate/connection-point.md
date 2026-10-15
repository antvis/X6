---
title: "Connection Points"
description: "Connection Points"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/intermediate/connection-point/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to connection points. By reading, you can learn about**

- Concepts of anchors and connection points
- How to use anchors and connection points to customize special edges


Let's start with an example:



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-node',
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
      shape: 'custom-node',
      x: 40,
      y: 200,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 80,
      label: 'world',
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: -10,
          },
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
        },
        connectionPoint: 'anchor',
      },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: {
        cell: source,
        anchor: {
          name: 'right',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
      target: {
        cell: target,
        anchor: {
          name: 'left',
          args: {
            dy: 10,
          },
        },
        connectionPoint: 'anchor',
      },
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
      <div className="multi-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



When you move the node above, the edge connection points on the node remain fixed, and multiple edges keep a gap between them. This differs from the previous example. How is this achieved? Let's understand anchors and connection points with the following diagram.

## Introduction

By default, the anchor is `center` (the element center). `connectionPoint` specifies how to compute intersection points; its default is `boundary` (intersection with the element boundary). An edge is drawn by connecting a reference line from the source anchor to the target anchor. The intersection of that line with the element, computed per `connectionPoint`, becomes the edge's start/end point.

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*RhX1SYh1K-QAAAAAAAAAAAAAARQnAQ" alt="Connection Point" width="500" />

## Usage

You can configure `anchor` and `connectionPoint` globally in `connecting`, or per edge via `source` and `target`.

```ts
// Configuring in connecting
const graph = new Graph({
  connecting: {
    sourceAnchor: {
      name: 'right', // Offsets the anchor 10px upward from the center on the right side of the node
      args: {
        dy: -10,
      },
    },
    targetAnchor: {
      name: 'right', // Offsets the anchor 10px upward from the center on the right side of the node
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})

// Per-edge configuration takes precedence
graph.addEdge({
  source: {
    cell: source,
    anchor: {
      name: 'right',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
  target: {
    cell: target,
    anchor: {
      name: 'left',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})
```

X6 also supports a wide variety of anchor and connection point types. To customize special edges, refer to [NodeAnchor](/en/api/registry/node-anchor) and [ConnectionPoint](/en/api/registry/connection-point).
### docs/demos/tutorial/intermediate/connection-point/multi/index.less

```less
.multi-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 280px;
    margin-right: 8px;
    margin-left: 8px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }
}
```
