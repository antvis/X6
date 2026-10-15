---
title: "交互"
description: "交互"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/basic/interacting/"
version: "3.x"
---

[资料索引](/llms.txt)

> **本章节主要介绍元素交互相关的知识，通过阅读，你可以了解到**

- 如何设置连线交互规则
- 节点之间怎么嵌入
- 怎么配置高亮样式
- 怎么禁止、启用一些交互动作


## 连线

连线交互规则都是通过 `connecting` 配置来完成，完整的配置参考 [API](/zh/api/model/interaction#连线)。下面介绍一些常用的功能。

### allowXXX

可以通过 `allowXXX` 配置来定义连线能否连接到对应的位置。默认支持以下项：

- `allowBlank`：是否允许连接到画布空白处，默认为 `true`。
- `allowLoop`：是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 `true`。
- `allowNode`：是否允许边连接到节点（非节点上的连接桩），默认为 `true`。
- `allowEdge`：是否允许边连接到另一个边，默认为 `true`。
- `allowPort`：是否允许边连接到连接桩，默认为 `true`。
- `allowMulti`：是否允许在相同的起始节点和终止节点之间创建多条边，默认为 `true`。

它们的值都支持以下两种类型：

```ts
new Graph({
  connecting: {
    allowNode: true, // boolean
  },
})

// 函数形式，多用于动态控制连接限制
new Graph({
  connecting: {
    allowNode(args) {
      return true
    },
  },
})
```

> **提示**

`allowMulti` 支持设置为字符串 `withPort`，代表在起始和终止节点的相同连接桩之间只允许创建一条边（即起始和终止节点之间可以创建多条边，但必须要连接在不同的连接桩上）。



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

在[边教程](/zh/tutorial/basic/edge#router)中我们知道，可以在添加边的时候指定 `router` 和 `connector`，如果整个画布中大部分边的 `router` 或者 `connector` 是一样的，我们可以直接配置在 `connecting` 中，这样就可以避免在边中重复配置。

```ts
new Graph({
  connecting: {
    router: 'orth',
    connector: 'rounded',
  },
})
```

### createEdge

在上面的 demo 中，我们可以从节点、连接桩拉出一条连线出来，那你可能会问，什么样的元素能拉出连线呢？这是 X6 设计非常巧妙的一个地方，只要具备 `magnet=true` 属性的元素，都可以拉出连线。而且在 `connecting` 中可以通过 `createEdge` 方法配置拉出连线的样式。

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

我们还可以通过 `validateXXX` 方法来定义是否能创建连线或者连线是否有效。相比 `allowXXX`，`validateXXX` 更具备灵活性。默认支持以下项：

- `validateMagnet`：点击 `magnet=true` 的元素时 根据 `validateMagnet` 返回值来判断是否新增边，触发时机是元素被按下，如果返回 `false`，则没有任何反应，如果返回 `true`，会在当前元素创建一条新的边。
- `validateConnection`：在移动边的时候判断连接是否有效，如果返回 `false`，当鼠标放开的时候，不会连接到当前元素，常常配合[高亮](/zh/tutorial/basic/interacting#高亮)功能一起使用。
- `validateEdge`：当停止拖动边的时候根据 `validateEdge` 返回值来判断边是否生效，如果返回 `false`，该边会被清除。



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



## 组合

有时候我们需要将一个节点拖动到另一个节点中，使其成为另一节点的子节点，这时我们可以通过 `embedding` 选项来开启，在节点被移动时通过 `findParent` 指定的方法返回父节点。更详细的配置参考 [API](/zh/api/model/interaction#组合)。

```ts
const graph = new Graph({
  embedding: {
    enabled: true,
    findParent({ node }) {
      // 获取移动节点的包围盒
      const bbox = node.getBBox()
      // 找到 data 中配置 { parent: true } 的节点，并且移动节点和找到的节点包围盒相交时，返回 true
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



## 高亮

可以通过 `highlighting` 选项来指定触发某种交互时的高亮样式，如：

```ts
new Graph({
  highlighting: {
    // 连接桩可以被连接时在连接桩外围渲染一个包围框
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
    // 连接桩吸附连线时在连接桩外围渲染一个包围框
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

支持的 `highlighting` 配置项有：

- `default` 默认高亮选项，当以下几种高亮配置缺省时被使用。
- `embedding` 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用。
- `nodeAvailable` 连线过程中，节点可以被链接时被使用。
- `magnetAvailable` 连线过程中，连接桩可以被链接时被使用。
- `magnetAdsorbed` 连线过程中，自动吸附到连接桩时被使用。

上面 `magnetAvailable.name` 其实是高亮器的名称，X6 内置了 `stroke` 和 `className` 两种高亮器，详细信息参考 [Highlighter](/zh/api/registry/highlighter)。



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



## 交互限制

可以通过配置 `interacting` 来启动、禁用一些元素的交互行为，如果画布上元素纯预览，不能进行任何交互，可以直接设置为 `false`。

```ts
new Graph({
  interacting: false,
})
```

如果需要更细节的定义允许哪些交互、禁用哪些交互，我们可以针对不同的属性值进行配置，支持的属性包括：

- `nodeMovable` 节点是否可以被移动。
- `magnetConnectable` 当在具有 `magnet` 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
- `edgeMovable` 边是否可以被移动。
- `edgeLabelMovable` 边的标签是否可以被移动。
- `arrowheadMovable` 边的起始/终止箭头（在使用 arrowhead 工具后）是否可以被移动。
- `vertexMovable` 边的路径点是否可以被移动。
- `vertexAddable` 是否可以添加边的路径点。
- `vertexDeletable` 边的路径点是否可以被删除。

它们的值都支持以下两种类型：

```ts
// 直接设置为 boolean 值
new Graph({
  interacting: {
    nodeMovable: false,
    edgeMovable: true,
  },
})

// 函数形式，多用于动态控制交互行为
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
