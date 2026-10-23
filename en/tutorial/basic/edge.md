---
title: "Edges"
description: "Edges"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/basic/edge/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to edges. By reading, you can learn about**

- Methods to add edges
- How to configure the shape of edges
- How to add arrows to edges
- How to customize edges
- How to modify edges through the API


## Adding Edges

Both nodes and edges share a common base class [Cell](/en/api/model/cell). In addition to inheriting properties from `Cell`, edges support the following options.

| Property Name  | Type               | Default Value                                   | Description          |
|----------------|--------------------|------------------------------------------------|----------------------|
| source         | TerminalData       | -                                              | Source node or starting point. |
| target         | TerminalData       | -                                              | Target node or endpoint. |
| vertices       | Point.PointLike[]  | -                                              | Path points.         |
| router         | RouterData         | -                                              | Router.              |
| connector      | ConnectorData      | -                                              | Connector.           |
| labels         | Label[]            | -                                              | Labels.              |
| defaultLabel   | Label              | [Default Label](/en/api/model/edge#labels-and-default-label) | Default label.       |

```ts
graph.addEdge({
  shape: 'edge',
  source: 'node1',
  target: 'node2',
})
```

## Configuring Edges

Let's take a look at how to use the configurations mentioned above.

### source/target

The source and target nodes (points) of the edge.

```ts
graph.addEdge({
  source: rect1, // Source node
  target: rect2, // Target node
})

graph.addEdge({
  source: 'rect1', // Source node ID
  target: 'rect2', // Target node ID
})

graph.addEdge({
  source: { cell: rect1, port: 'out-port-1' }, // Source node and connection port ID
  target: { cell: 'rect2', port: 'in-port-1' }, // Target node ID and connection port ID
})

graph.addEdge({
  source: 'rect1', // Source node ID
  target: { x: 100, y: 120 }, // Target point
})
```

### vertices

Path points. The edge starts from the starting point, passes through the path points in order, and finally reaches the endpoint.

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
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
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body', // 选择器
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
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
      img: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
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
      shape: 'custom-node', // 可以直接使用上面注册过的 shape
      x: 40,
      y: 40,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 220,
      label: 'world',
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
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="vertices-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### router

The `router` will further process the `vertices`, adding additional points if necessary, and then return the processed points. For example, after processing with [orth routing](/en/api/registry/router#orth), each link segment of the edge will be horizontal or vertical.

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  // If there are no args parameters, it can be simplified to router: 'orth'
  router: {
    name: 'orth',
    args: {},
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
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body', // 选择器
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
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
      img: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
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
      shape: 'custom-node', // 可以直接使用上面注册过的 shape
      x: 40,
      y: 40,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 220,
      label: 'world',
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
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      router: 'orth',
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



X6 provides the following routing options by default. Click the links below to see how each routing option is used.

- [normal](/en/api/registry/router#normal)
- [orth](/en/api/registry/router#orth)
- [oneSide](/en/api/registry/router#oneside)
- [manhattan](/en/api/registry/router#manhattan)
- [metro](/en/api/registry/router#metro)
- [er](/en/api/registry/router#er)

Additionally, we can register custom routers. For more details, please refer to the [Custom Router](/en/api/registry/router#registry) tutorial.

### connector

The `connector` processes the points returned by the `router` into the [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) needed for rendering the edge. For example, the `rounded` connector will round the corners between the lines.

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: 'orth',
  // If there are no args parameters, it can be simplified to connector: 'rounded'
  connector: {
    name: 'rounded',
    args: {},
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
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body', // 选择器
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
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
      img: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
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
      shape: 'custom-node', // 可以直接使用上面注册过的 shape
      x: 40,
      y: 40,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 220,
      label: 'world',
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
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      router: 'orth',
      connector: 'rounded',
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



X6 provides the following connector options by default. Click the links below to see how each connector is used.

- [normal](/en/api/registry/connector#normal)
- [rounded](/en/api/registry/connector#rounded)
- [smooth](/en/api/registry/connector#smooth)
- [jumpover](/en/api/registry/connector#jumpover)

Additionally, we can register custom connectors. For more details, please refer to the [Custom Connector](/en/api/registry/connector) tutorial.

### labels

Used to set label text, position, style, etc. Supports multiple labels in array form, and each item specified in `labels` will be used after being [merged](https://lodash.com/docs/4.17.15#merge) with the [defaultLabel](/en/api/model/edge#labels-and-default-label).

```ts
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: [
    {
      attrs: {
        label: {
          text: 'edge',
        },
      },
    },
  ],
})
// Or
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: ['edge'], // Multiple labels can be set through labels, and when only setting label text, this syntax can be simplified
})
// Or
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  label: 'edge', // A single label can be set through label, and when only setting label text, this syntax can be simplified
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
    inherit: 'rect', // 继承于 rect 节点
    width: 100,
    height: 40,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body', // 选择器
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
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
      img: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
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
      y: 40,
      label: 'hello',
    })

    const target = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 220,
      label: 'world',
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
          attrs: {
            label: {
              text: '40%',
              stroke: '#aaa',
            },
          },
          position: 0.4,
        },
        {
          attrs: {
            label: {
              text: '60%',
              stroke: '#aaa',
            },
          },
          position: 0.6,
        },
      ],
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="labels-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



In addition to setting text, you can also create complex shapes on the edge using Label, which we will detail in the [API](/en/api/model/labels).

### defaultLabel

Default label. The default label can simplify the label configuration items, and each item specified in `labels` will be used after being merged with `defaultLabel`.

## Using Arrows

We define two special properties, `sourceMarker` and `targetMarker`, to customize the starting and ending arrows of the edge. For example, for `Shape.Edge`, we can specify the starting and ending arrows using the `line` selector.

### Built-in Arrows

X6 provides the following built-in arrows. When using them, you only need to specify the arrow name and parameters (optional).

- [block](/en/api/model/marker#block)
- [classic](/en/api/model/marker#classic)
- [diamond](/en/api/model/marker#diamond)
- [cross](/en/api/model/marker#cross)
- [async](/en/api/model/marker#async)
- [path](/en/api/model/marker#path)
- [circle](/en/api/model/marker#circle)
- [circlePlus](/en/api/model/marker#circleplus)
- [ellipse](/en/api/model/marker#ellipse)

```ts
graph.addEdge({
  shape: 'edge',
  source: [100, 100],
  target: [500, 500],
  attrs: {
    line: {
      sourceMarker: 'block', // Solid arrow
      targetMarker: {
        name: 'ellipse', // Ellipse
        rx: 10, // X radius of the ellipse arrow
        ry: 6, // Y radius of the ellipse arrow
      },
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

const markers = [
  'block',
  'classic',
  'diamond',
  'circle',
  'circlePlus',
  'ellipse',
  'cross',
  'async',
]

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    markers.forEach((marker, i) => {
      graph.addEdge({
        sourcePoint: [120, 20 + i * 40],
        targetPoint: [400, 20 + i * 40],
        label: marker,
        attrs: {
          line: {
            sourceMarker: marker,
            targetMarker: marker,
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="native-marker-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



> **Tip**

 By default, X6 edges come with a `classic` arrow. If you want to remove it, you can set `targetMarker` to `null`.

### Custom Arrows

We can also render arrows using SVG elements specified by `tagName`. For example, below we use the `<path>` element to render the arrow, which inherits the edge's fill color `fill` and border color `stroke` by default.

```ts
graph.addEdge({
  shape: 'edge',
  source: [100, 100],
  target: [500, 500],
  attrs: {
    line: {
      sourceMarker: {
        tagName: 'path',
        d: 'M 20 -10 0 0 20 10 Z',
      },
      targetMarker: {
        tagName: 'path',
        fill: 'yellow', // Use custom fill color
        stroke: 'green', // Use custom border color
        strokeWidth: 2,
        d: 'M 20 -10 0 0 20 10 Z',
      },
    },
  },
})
```

> **Tip**

Our starting and ending arrows use the same `d` attribute because we automatically calculate the arrow direction. In simple terms, when defining the arrow, we only need to define an arrow that points **towards the origin**.



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
      source: [100, 140],
      target: [400, 140],
      label: 'custom-marker',
      attrs: {
        line: {
          sourceMarker: {
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: '#D94111',
            strokeWidth: 2,
            fill: '#90C54C',
            d: 'M 20 -10 0 0 20 10 Z',
          },
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
      <div className="custom-marker-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



For more examples and customization tips for arrows, please refer to the [API](/en/api/model/marker).

## Customizing Edges

Like nodes, we can customize the shape and style of edges using `markup` and `attrs`, and we can also register custom edges for reuse. The default edge `Shape.Edge` in X6 defines two selectors: `line` (representing the path element) and `wrap` (representing a transparent path element for interaction). We can define the style of the edge as shown below.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerEdge('double-edge', {
  inherit: 'edge',
  markup: [
    {
      tagName: 'path',
      selector: 'outline',
      attrs: {
        fill: 'none',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
      },
    },
  ],
  attrs: {
    line: {
      connection: true,
      stroke: '#dddddd',
      strokeWidth: 4,
      strokeLinejoin: 'round',
      targetMarker: {
        tagName: 'path',
        stroke: '#000000',
        d: 'M 10 -3 10 -10 -2 0 10 10 10 3',
      },
    },
    outline: {
      connection: true,
      stroke: '#000000',
      strokeWidth: 6,
      strokeLinejoin: 'round',
    },
  },
})

Graph.registerEdge('shadow-edge', {
  inherit: 'edge',
  markup: [
    {
      tagName: 'path',
      selector: 'shadow',
      attrs: {
        fill: 'none',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
      },
    },
  ],
  attrs: {
    line: {
      connection: true,
      stroke: '#dddddd',
      strokeWidth: 20,
      strokeLinejoin: 'round',
      targetMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M 0 -10 -10 0 0 10 z',
        offsetX: -5,
      },
      sourceMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
        offsetX: -5,
      },
    },
    shadow: {
      connection: true,
      refX: 3,
      refY: 6,
      stroke: '#000000',
      strokeOpacity: 0.2,
      strokeWidth: 20,
      strokeLinejoin: 'round',
      targetMarker: {
        name: 'path',
        d: 'M 0 -10 -10 0 0 10 z',
        stroke: 'none',
        offsetX: -5,
      },
      sourceMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
        offsetX: -5,
      },
    },
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
      shape: 'double-edge',
      source: [100, 100],
      target: [400, 100],
    })

    graph.addEdge({
      shape: 'shadow-edge',
      source: [100, 180],
      target: [400, 180],
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="registry-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Modifying Edges

Similar to nodes, after rendering is complete, we can modify all properties of edges through the API. We commonly use the following two methods:

- edge.prop(path, value), for detailed usage see [prop](/en/api/model/cell#node-and-edge-properties).
- edge.attr(path, value), for detailed usage see [attr](/en/api/model/cell#element-attributes-attrs).

Let's take a look at the `prop` of the default edge provided by X6.

```ts
const edge = graph.addEdge({
  source: [200, 140],
  target: [500, 140],
  label: 'edge',
})
console.log(edge.prop())

// Output
{
  "shape": "edge",
  "attrs": {
    "lines": {
      "connection": true,
      "strokeLinejoin": "round"
    },
    "wrap": {
      "strokeWidth": 10
    },
    "line": {
      "stroke": "#333",
      "strokeWidth": 2,
      "targetMarker": "classic"
    }
  },
  "id": "9d5e4f54-1ed3-429e-8d8c-a1526cff2cd8",
  "source": {
    "x": 200,
    "y": 140
  },
  "target": {
    "x": 500,
    "y": 140
  },
  "labels": [{
    "attrs": {
      "label": {
        "text": "edge"
      }
    }
  }],
  "zIndex": 1
}
```

From the output above, we can see that `prop` is a new configuration after processing, and its values can be updated through methods. After updating, the edge will immediately refresh to the latest state. To modify the edge's `attrs` more conveniently, X6 provides the `attr` method.

```ts
edge.prop('target', { x: 300, y: 300 }) // Modify the endpoint
edge.attr('line/stroke', '#ccc') // Modify the edge color, equivalent to edge.prop('attrs/line/stroke', '#ccc')
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Color } from '@antv/x6'
import { Button } from 'antd'

const commands = [
  {
    key: 'prop',
    label: 'prop',
  },
  {
    key: 'attr',
    label: 'attr',
  },
]

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      shape: 'rect',
      x: 40,
      y: 100,
      width: 100,
      height: 40,
      label: 'hello',
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
      shape: 'rect',
      x: 340,
      y: 100,
      width: 100,
      height: 40,
      label: 'hello',
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

    this.graph = graph
  }

  change = (command: string) => {
    const edges = this.graph.getEdges()
    switch (command) {
      case 'prop':
        edges.forEach((edge) => {
          const x = Math.floor(Math.random() * 600)
          const y = Math.floor(Math.random() * 200)
          edge.prop('vertices', [[x, y]])
        })
        break
      case 'attr':
        edges.forEach((edge) => {
          const color = Color.randomHex()
          edge.attr('line/stroke', color)
        })
        break
      default:
        break
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="prop-app">
        <div className="app-btns">
          <Button.Group>
            {commands.map((item) => (
              <Button onClick={() => this.change(item.key)} key={item.key}>
                {item.label}
              </Button>
            ))}
          </Button.Group>
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
### docs/demos/tutorial/basic/edge/vertices/index.less

```less
.vertices-app {
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
### docs/demos/tutorial/basic/edge/router/index.less

```less
.router-app {
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
### docs/demos/tutorial/basic/edge/connector/index.less

```less
.connector-app {
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
### docs/demos/tutorial/basic/edge/labels/index.less

```less
.labels-app {
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
### docs/demos/tutorial/basic/edge/native-marker/index.less

```less
.native-marker-app {
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
### docs/demos/tutorial/basic/edge/custom-marker/index.less

```less
.custom-marker-app {
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
### docs/demos/tutorial/basic/edge/registry/index.less

```less
.registry-app {
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
### docs/demos/tutorial/basic/edge/prop/index.less

```less
.prop-app {
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-btns {
    bottom: 0;
    margin: 0;
    padding: 0 8px;
  }

  .app-content {
    width: 100%;
    height: 240px;
    margin: 0;
    margin-top: 16px;
    border-radius: 5px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }
}
```
