---
title: "Interaction"
description: "Interaction"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/basic/interacting/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to element interaction. By reading, you can learn about**

- How to set connection rules
- How to embed nodes
- How to configure highlight styles
- How to disable or enable interactions


## Connection

Connection interaction rules are all completed through the `connecting` configuration. For a complete configuration, refer to [API](/en/api/model/interaction#connecting). Below, we introduce some commonly used functions.

### allowXXX

You can use the `allowXXX` configuration to define whether a connection can be connected to a corresponding position. The default supports the following items:

- `allowBlank`: Whether to allow connection to a blank position on the canvas, default is `true`.
- `allowLoop`: Whether to allow creating a loop connection, i.e., the starting node and ending node are the same node, default is `true`.
- `allowNode`: Whether to allow connecting to a node (non-port region), default is `true`.
- `allowEdge`: Whether to allow connection to another edge, default is `true`.
- `allowPort`: Whether to allow connection to a connection point, default is `true`.
- `allowMulti`: Whether to allow creating multiple edges between the same starting node and ending node, default is `true`.

Each accepts either a boolean or a function:

```ts
new Graph({
  connecting: {
    allowNode: true, // boolean
  },
})

// Function form, often used for dynamic control of connection restrictions
new Graph({
  connecting: {
    allowNode(args) {
      return true
    },
  },
})
```

> **Tip**

`allowMulti` supports being set to the string `withPort`, representing that only one edge can be created between the same connection points of the starting and ending nodes (i.e., multiple edges can be created between the starting and ending nodes, but they must be connected to different connection points).



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      allowBlank: true,
      allowMulti: true,
      allowLoop: true,
      allowNode: true,
      allowEdge: true,
      allowPort: true,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 300,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        ...options,
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
      },
    })

    graph.addNode({
      x: 60,
      y: 50,
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
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addNode({
      x: 160,
      y: 200,
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
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addEdge({
      source: [320, 80],
      target: [500, 200],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    this.graph = graph
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connecting-app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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



### router/connector

In the [edge tutorial](/en/tutorial/basic/edge#router), we know that we can specify `router` and `connector` when adding an edge. If most edges in the entire canvas have the same `router` or `connector`, we can configure them directly in `connecting`, which can avoid repeated configuration in the edge.

```ts
new Graph({
  connecting: {
    router: 'orth',
    connector: 'rounded',
  },
})
```

### createEdge

In the above demo, we can drag out a connection from a node or port. You may ask: what elements can start a connection? In X6, any element with `magnet: true` can initiate a connection. Moreover, in `connecting`, we can configure the style of the new connection through the `createEdge` method.

```ts
new Graph({
  connecting: {
    createEdge() {
      return this.createEdge({
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    },
  },
})
```

### validateXXX

We can also define whether to create a connection or whether the connection is valid through the `validateXXX` method. Compared to `allowXXX`, `validateXXX` is more flexible. The default supports the following items:

- `validateMagnet`: When clicking on an element with `magnet=true`, judge whether to create a new edge according to the return value of `validateMagnet`. If it returns `false`, there will be no reaction; if it returns `true`, a new edge will be created at the current element.
- `validateConnection`: When moving an edge, judge whether the connection is valid according to the return value of `validateConnection`. If it returns `false`, the connection will not be connected to the current element when the mouse is released.
- `validateEdge`: When stopping the edge drag, judge whether the edge is valid according to the return value of `validateEdge`. If it returns `false`, the edge will be cleared.



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
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
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
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        allowNode: false,
        allowBlank: false,
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
          // 节点上方的连接桩无法创建连线
          return magnet.getAttribute('port-group') !== 'top'
        },
        validateConnection({
          sourceCell,
          targetCell,
          sourceMagnet,
          targetMagnet,
        }) {
          // 不能连接自身
          if (sourceCell === targetCell) {
            return false
          }

          // 只能从 bottom 连接桩开始连接，连接到 top 连接桩
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'top'
          ) {
            return false
          }
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'top'
          ) {
            return false
          }

          // 不能重复连线
          const edges = this.getEdges()
          const portId = targetMagnet.getAttribute('port')
          if (edges.find((edge) => edge.getTargetPortId() === portId)) {
            return false
          }

          return true
        },
      },
      highlighting: {
        // 连接桩可以被连接时在连接桩外围围渲染一个包围框
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#A4DEB1',
              strokeWidth: 4,
            },
          },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
    })

    graph.addNode({
      shape: 'custom-node-with-port',
      x: 40,
      y: 40,
      label: 'hello',
      ports: {
        items: [
          {
            id: 'port_1',
            group: 'top',
          },
          {
            id: 'port_2',
            group: 'top',
          },
          {
            id: 'port_3',
            group: 'bottom',
          },
          {
            id: 'port_4',
            group: 'bottom',
          },
        ],
      },
    })

    graph.addNode({
      shape: 'custom-node-with-port',
      x: 160,
      y: 180,
      label: 'world',
      ports: {
        items: [
          {
            id: 'port_5',
            group: 'top',
          },
          {
            id: 'port_6',
            group: 'top',
          },
          {
            id: 'port_7',
            group: 'bottom',
          },
          {
            id: 'port_8',
            group: 'bottom',
          },
        ],
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="validate-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Embedding

Sometimes we need to drag a node into another node, making it a child node of the other node. At this time, we can enable embedding through the `embedding` option, and specify the parent node through the `findParent` method when the node is moved. For more detailed configuration, refer to [API](/en/api/model/interaction#embedding).

```ts
const graph = new Graph({
  embedding: {
    enabled: true,
    findParent({ node }) {
      // Get the bounding box of the moved node
      const bbox = node.getBBox()
      // Find the node with `parent: true` in the data and intersect with the moved node's bounding box
      return this.getNodes().filter((node) => {
        const data = node.getData<{ parent: boolean }>()
        if (data && data.parent) {
          const targetBBox = node.getBBox()
          return bbox.isIntersectWithRect(targetBBox)
        }
        return false
      })
    },
  },
})
```



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
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            const data = node.getData<{ parent: boolean }>()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
    })

    graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 140,
      width: 120,
      height: 60,
      label: 'Child\n(unembed)',
      zIndex: 10,
    })

    graph.addNode({
      shape: 'custom-node',
      x: 500,
      y: 100,
      width: 120,
      height: 60,
      label: 'Child\n(unembed)',
      zIndex: 10,
    })

    graph.addNode({
      shape: 'custom-node',
      x: 200,
      y: 80,
      width: 240,
      height: 160,
      zIndex: 1,
      label: 'Parent',
      data: {
        parent: true,
      },
    })

    graph.on('node:change:parent', ({ node }) => {
      node.attr({
        label: {
          text: 'Child\n(embed)',
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="embedding-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Highlighting

We can specify the highlighting style when triggering certain interactions through the `highlighting` option, such as:

```ts
new Graph({
  highlighting: {
    // When the connection point can be connected, render a surrounding box around the connection point
    magnetAvailable: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#A4DEB1',
          strokeWidth: 4,
        },
      },
    },
    // When the connection point is adsorbed to the edge, render a surrounding box around the connection point
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#31d0c6',
          strokeWidth: 4,
        },
      },
    },
  },
})
```

Supported `highlighting` configuration items include:

- `default` Default highlighting option, used when the following highlighting configurations are missing.
- `embedding` Highlighting option used when dragging a node to embed it into another node.
- `nodeAvailable` Highlighting option used when a node can be connected during the connection process.
- `magnetAvailable` Highlighting option used when a connection point can be connected during the connection process.
- `magnetAdsorbed` Highlighting option used when the connection point is automatically adsorbed to the edge during the connection process.

The `magnetAvailable.name` above is actually the name of the highlighter, and X6 has built-in `stroke` and `className` highlighters. For more information, refer to [Highlighter](/en/api/registry/highlighter).



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
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
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
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      connecting: {
        allowNode: false,
        allowBlank: false,
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
      },
      highlighting: {
        // 连接桩可以被连接时在连接桩外围围渲染一个包围框
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#A4DEB1',
              strokeWidth: 4,
            },
          },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
    })

    graph.addNode({
      shape: 'custom-node-with-port',
      x: 40,
      y: 40,
      label: 'hello',
      ports: {
        items: [
          {
            id: 'port_1',
            group: 'bottom',
          },
          {
            id: 'port_2',
            group: 'bottom',
          },
        ],
      },
    })

    graph.addNode({
      shape: 'custom-node-with-port',
      x: 160,
      y: 180,
      label: 'world',
      ports: {
        items: [
          {
            id: 'port_3',
            group: 'top',
          },
          {
            id: 'port_4',
            group: 'top',
          },
        ],
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="highlighting-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Interaction Limitation

We can enable or disable some interaction behaviors of elements through the `interacting` configuration. If the elements on the canvas are purely for preview and cannot be interacted with, we can set it to `false` directly.

```ts
new Graph({
  interacting: false,
})
```

If we need to define more detailed interaction limitations, we can configure them according to different property values. Supported properties include:

- `nodeMovable` Whether nodes can be moved.
- `magnetConnectable` Whether to trigger connection interaction when clicking on an element with the `magnet` property.
- `edgeMovable` Whether edges can be moved.
- `edgeLabelMovable` Whether edge labels can be moved.
- `arrowheadMovable` Whether edge arrowheads (after using the arrowhead tool) can be moved.
- `vertexMovable` Whether edge vertices can be moved.
- `vertexAddable` Whether edge vertices can be added.
- `vertexDeletable` Whether edge vertices can be deleted.

Their values all support the following two types:

```ts
// Directly set to a boolean value
new Graph({
  interacting: {
    nodeMovable: false,
    edgeMovable: true,
  },
})

// Function form, often used for dynamic control of interaction behaviors
new Graph({
  interacting: {
    nodeMovable(view) {
      const node = view.cell
      const { enableMove } = node.getData()
      return enableMove
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      nodeMovable: false,
      magnetConnectable: false,
      edgeMovable: false,
      edgeLabelMovable: false,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 300,
      background: {
        color: '#F2F7FA',
      },
      interacting: {
        ...options,
      },
      connecting: {
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
      },
    })

    graph.addNode({
      x: 60,
      y: 50,
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
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addNode({
      x: 160,
      y: 200,
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
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port2',
            group: 'in',
          },
          {
            id: 'port3',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          },
          {
            id: 'port5',
            group: 'out',
          },
        ],
      },
    })

    graph.addEdge({
      source: [320, 80],
      target: [500, 200],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      label: 'Move Me',
    })

    this.graph = graph
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="interacting-app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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
### docs/demos/tutorial/basic/interacting/connecting/index.less

```less
.connecting-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    height: 100%;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-top: 0;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/tutorial/basic/interacting/connecting/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  allowBlank: boolean
  allowMulti: boolean
  allowLoop: boolean
  allowNode: boolean
  allowEdge: boolean
  allowPort: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    allowBlank: true,
    allowMulti: true,
    allowLoop: true,
    allowNode: true,
    allowEdge: true,
    allowPort: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onAllowTypeChanged = (type: string, flag: boolean) => {
    const s = { [type]: flag } as any
    this.setState(s, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Connecting Settings"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowBlank}
              onChange={(e) =>
                this.onAllowTypeChanged('allowBlank', e.target.checked)
              }
            >
              AllowBlank
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowMulti}
              onChange={(e) =>
                this.onAllowTypeChanged('allowMulti', e.target.checked)
              }
            >
              AllowMulti
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowLoop}
              onChange={(e) =>
                this.onAllowTypeChanged('allowLoop', e.target.checked)
              }
            >
              AllowLoop
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowNode}
              onChange={(e) =>
                this.onAllowTypeChanged('allowNode', e.target.checked)
              }
            >
              AllowNode
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowEdge}
              onChange={(e) =>
                this.onAllowTypeChanged('allowEdge', e.target.checked)
              }
            >
              AllowEdge
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.allowPort}
              onChange={(e) =>
                this.onAllowTypeChanged('allowPort', e.target.checked)
              }
            >
              AllowPort
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/tutorial/basic/interacting/validate/index.less

```less
.validate-app {
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
### docs/demos/tutorial/basic/interacting/embedding/index.less

```less
.embedding-app {
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
### docs/demos/tutorial/basic/interacting/highlighting/index.less

```less
.highlighting-app {
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
### docs/demos/tutorial/basic/interacting/interacting/index.less

```less
.interacting-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    height: 100%;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-top: 0;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}

.ant-card {
  min-height: 250px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.ant-card-head-title {
  text-align: center;
}

.ant-row {
  margin: 16px 0;
  text-align: left;
}

.slider-value {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 7px;
  color: #333;
  font-size: 12px;
  line-height: 1.25;
  background: #eee;
  border-radius: 10px;
}
```
### docs/demos/tutorial/basic/interacting/interacting/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  nodeMovable: boolean
  magnetConnectable: boolean
  edgeMovable: boolean
  edgeLabelMovable: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    nodeMovable: false,
    magnetConnectable: false,
    edgeMovable: false,
    edgeLabelMovable: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onAllowTypeChanged = (type: string, flag: boolean) => {
    const s = { [type]: flag } as any
    this.setState(s, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Connecting Settings"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.nodeMovable}
              onChange={(e) =>
                this.onAllowTypeChanged('nodeMovable', e.target.checked)
              }
            >
              nodeMovable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.magnetConnectable}
              onChange={(e) =>
                this.onAllowTypeChanged('magnetConnectable', e.target.checked)
              }
            >
              magnetConnectable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.edgeMovable}
              onChange={(e) =>
                this.onAllowTypeChanged('edgeMovable', e.target.checked)
              }
            >
              edgeMovable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.edgeLabelMovable}
              onChange={(e) =>
                this.onAllowTypeChanged('edgeLabelMovable', e.target.checked)
              }
            >
              edgeLabelMovable
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
