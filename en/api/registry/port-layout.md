---
title: "Port Layout Algorithm"
description: "Port Layout Algorithm"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/port-layout/"
version: "3.x"
---

[Resource index](/llms.txt)

The port layout algorithm is a function with the following signature, which returns the relative position of the port relative to the node. For example, if a node is located at `{ x: 30, y: 40 }` on the canvas, and the returned position of a port is `{ x: 2, y: 4 }`, then the port will be rendered at `{ x: 32, y: 44 }` on the canvas.

```ts
type Definition<T> = (
  portsPositionArgs: T[], // layout algorithm parameters specified in the port
  elemBBox: Rectangle, // bounding box of the node
  groupPositionArgs: T, // default layout algorithm parameters defined in the group
) => Result[]

interface Result {
  position: Point.PointLike // relative position to the node
  angle?: number // rotation angle
}
```

Note that when configuring the port `ports`, we can only configure the layout algorithm through the `groups` option, and provide optional layout algorithm parameters `args` in `items` to affect the layout result.

```ts
graph.addNode(
  ...,
  ports: {
    // port group
    groups: {
      group1: {
        position: {
          name: 'xxx', // layout algorithm name
          args: { },   // default parameters of the layout algorithm
        },
      },
    },

    // port definition
    items: [
      {
        groups: 'group1',
        args: { }, // override the default parameters specified in group1
      },
    ],
  },
)
```

Let's take a look at how to use the built-in port layout algorithms and how to customize and register custom layout algorithms.

## Built-in Layouts

### absolute

Absolute positioning, specifying the port position through `args`.

```ts
interface AbsoluteArgs {
  x?: string | number
  y?: string | number
  angle?: number
}
```

| Name  | Type             | Required | Default Value | Description                   |
|-------|------------------|:----:|--------|----------------------|
| x     | string \| number |      | `0`    | Relative position on the X-axis. |
| y     | string \| number |      | `0`    | Relative position on the Y-axis. |
| angle | number           |      | `0`    | Rotation angle.        |

When `x` and `y` are percentage strings or between `[0, 1]`, they represent the percentage offset in the width and height directions, otherwise, they represent absolute offsets.

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'absolute',
          args: { x: 0, y: 0 },
        },
      },
    },
    items: [
      {
        group: 'group1',
        args: {
          x: '60%',
          y: 32,
          angle: 45,
        },
      },
    ],
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 48,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            position: {
              name: 'absolute',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
            args: { x: 0, y: 60 },
            attrs: {
              text: { text: '{ x: 0, y: 60 }' },
            },
          },
          {
            id: 'port2',
            group: 'group1',
            args: { x: 0.6, y: 32, angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            zIndex: 10,
            attrs: {
              path: {
                d: 'M -6 -8 L 0 8 L 6 -8 Z',
                magnet: true,
                fill: '#8f8f8f',
              },
              text: { text: '{ x: 0.6, y: 32, angle: 45 }', fill: '#888' },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: { x: '100%', y: '100%' },
            attrs: {
              text: { text: "{ x: '100%', y: '100%' }" },
            },
            label: {
              position: {
                name: 'right',
              },
            },
          },
        ],
      },
    })
  }

  onAttrsChanged = (args: State) => {
    this.node.portProp('port2', {
      args,
      attrs: {
        text: { text: `{ x: ${args.x}, y: ${args.y}, angle: ${args.angle} }` },
      },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-absolute-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
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



### left, right, top, bottom

Ports are evenly distributed along the specified edge of the rectangle, and `left`, `right`, `top`, and `bottom` are four layout algorithms that are very friendly to rectangular nodes. You can set the offset and rotation angle through `args`.

```ts
interface SideArgs {
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name   | Type    | Required | Default Value  | Description                                    |
|--------|---------|:----:|---------|---------------------------------------|
| strict | boolean |      | `false` | Whether to strictly distribute evenly.                   |
| dx     | number  |      | `0`     | Offset in the X-axis direction.                    |
| dy     | number  |      | `0`     | Offset in the Y-axis direction.                    |
| angle  | number  |      | `0`     | Rotation angle.                       |
| x      | number  |      | -       | Override the calculated X-coordinate with the specified value. |
| y      | number  |      | -       | Override the calculated Y-coordinate with the specified value. |

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: 'left',
      },
    },
    items: [
      {
        group: 'group1',
        args: {
          dx: 2,
        },
      },
    ],
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 160,
      y: 110,
      width: 280,
      height: 120,
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        label: { text: 'left', fill: '#888' },
      },
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            position: {
              name: 'left',
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
          {
            id: 'port2',
            group: 'group1',
            args: { angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            attrs: {
              path: {
                d: 'M -6 -8 L 0 8 L 6 -8 Z',
                magnet: true,
                fill: '#8f8f8f',
              },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: {},
          },
        ],
      },
    })
  }

  onAttrsChanged = ({ position, strict, ...args }: State) => {
    this.node.prop('ports/groups/group1/position', {
      name: position,
      args: { strict },
    })
    this.node.attr('label/text', position)
    this.node.portProp('port2', { args } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-side-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
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



### line

Ports are evenly distributed along the line segment.

```ts
interface LineArgs {
  start?: Point.PointLike
  end?: Point.PointLike
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name   | Type            | Required | Default Value  | Description                                    |
|--------|-----------------|:----:|---------|---------------------------------------|
| start  | Point.PointLike |      |         | Start point of the line segment.                               |
| end    | Point.PointLike |      |         | End point of the line segment.                               |
| strict | boolean         |      | `false` | Whether to strictly distribute evenly.                   |
| dx     | number          |      | `0`     | Offset in the X-axis direction.                    |
| dy     | number          |      | `0`     | Offset in the Y-axis direction.                    |
| angle  | number          |      | `0`     | Rotation angle.                       |
| x      | number          |      | -       | Override the calculated X-coordinate with the specified value. |
| y      | number          |      | -       | Override the calculated Y-coordinate with the specified value. |

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'line',
          args: {
            start: { x: 10, y: 10 },
            end: { x: 210, y: 10 },
          },
        },
      },
    },
    items: [
      {
        group: 'group1',
        args: {
          dx: 2,
        },
      },
    ],
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 160,
      y: 80,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'path',
          selector: 'line',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        line: {
          d: 'M 0 0 280 120',
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
      },
      ports: {
        groups: {
          group1: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 2,
                fill: '#fff',
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            position: {
              name: 'line',
              args: {
                start: { x: 0, y: 0 },
                end: { x: 280, y: 120 },
              },
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'group1',
          },
          {
            id: 'port2',
            group: 'group1',
            args: { angle: 45 },
            markup: [
              {
                tagName: 'path',
                selector: 'path',
              },
            ],
            attrs: {
              path: {
                d: 'M -6 -8 L 0 8 L 6 -8 Z',
                magnet: true,
                fill: '#8f8f8f',
              },
            },
          },
          {
            id: 'port3',
            group: 'group1',
            args: {},
          },
        ],
      },
    })
  }

  onAttrsChanged = ({ strict, ...args }: State) => {
    this.node.prop('ports/groups/group1/position', {
      name: 'line',
      args: { strict },
    })
    this.node.portProp('port2', { args } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-line-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
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



### ellipse

Ports are distributed along the ellipse, starting from the `start` angle, with a step size of `step`.

```ts
interface EllipseArgs {
  start?: number
  step?: number
  compensateRotate?: boolean
  dr?: number
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name             | Type   | Required | Default Value  | Description                                    |
|------------------|--------|:----:|---------|---------------------------------------|
| start            | number |      |         | Start angle.                               |
| step             | number |      | `20`    | Step size.                                   |
| compensateRotate | number |      | `false` | Whether to compensate for the rotation angle of the ellipse. |
| dr               | number |      | `0`     | Offset in the radial direction.                     |
| dx               | number |      | `0`     | Offset in the X-axis direction.                    |
| dy               | number |      | `0`     | Offset in the Y-axis direction.                    |
| angle            | number |      | `0`     | Rotation angle.                       |
| x                | number |      | -       | Override the calculated X-coordinate with the specified value. |
| y                | number |      | -       | Override the calculated Y-coordinate with the specified value. |

```ts
const node = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'ellipse',
          args: {
            start: 45,
          },
        },
      },
    },
  },
})

Array.from({ length: 10 }).forEach((_, index) => {
  node.addPort({
    id: `${index}`,
    group: 'group1',
    attrs: { text: { text: index } },
  })
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Point } from '@antv/x6'
import { Settings, State } from './settings.tsx'

function getPathData(deg: number) {
  const center = new Point(180, 100)
  const start = new Point(180, 0)
  const ratio = center.x / center.y
  const p = start
    .clone()
    .rotate(90 - deg, center)
    .scale(ratio, 1, center)
  return `M ${center.x} ${center.y} ${p.x} ${p.y}`
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 90,
      width: 360,
      height: 200,
      shape: 'ellipse',
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'text', selector: 'label' },
        { tagName: 'path', selector: 'line' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        line: {
          d: getPathData(45),
          stroke: '#8f8f8f',
          strokeDasharray: '5 5',
        },
      },
      ports: {
        groups: {
          group1: {
            markup: [
              {
                tagName: 'rect',
                selector: 'rect',
              },
              {
                tagName: 'circle',
                selector: 'dot',
              },
            ],
            attrs: {
              rect: {
                magnet: true,
                stroke: '#8f8f8f',
                fill: 'rgba(255,255,255,0.8)',
                strokeWidth: 1,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
              },
              dot: {
                fill: '#8f8f8f',
                r: 2,
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            label: {
              position: 'radial',
            },
            position: {
              name: 'ellipse',
              args: {
                start: 45,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({
        id: `${index}`,
        group: 'group1',
        attrs: { text: { text: index } },
      })
    })

    this.node.portProp('0', {
      attrs: {
        rect: { stroke: '#8f8f8f' },
        dot: { fill: '#8f8f8f' },
      },
    })
  }

  onAttrsChanged = ({ start, step, compensateRotate, ...args }: State) => {
    this.node.prop('ports/groups/group1/position/args', {
      start,
      step,
      compensateRotate,
    })

    this.node.attr({
      line: { d: getPathData(start) },
    })

    this.node.portProp('0', {
      args,
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-ellipse-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
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



### ellipseSpread

Uniformly distributes connection points along an ellipse, starting from the specified angle `start`.

```ts
interface EllipseSpreadArgs {
  start?: number
  compensateRotate?: boolean
  dr?: number
  dx?: number
  dy?: number
  angle?: number
  x?: number
  y?: number
}
```

| Name             | Type   | Required | Default Value | Description                                    |
|------------------|--------|:----:|---------|---------------------------------------|
| start            | number |      |         | Starting angle.                               |
| compensateRotate | number |      | `false` | Whether to adjust the rotation angle of the connection points along the arc. |
| dr               | number |      | `0`     | Offset along the radial direction.                     |
| dx               | number |      | `0`     | Offset along the X-axis direction.                    |
| dy               | number |      | `0`     | Offset along the Y-axis direction.                    |
| angle            | number |      | `0`     | Rotation angle of the connection points.                       |
| x                | number |      | -       | Override the X-coordinate of the calculated result with a specified X-coordinate. |
| y                | number |      | -       | Override the Y-coordinate of the calculated result with a specified Y-coordinate. |

```ts
const node = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'ellipseSpread',
          args: {
            start: 45,
          },
        },
      },
    },
  },
})

Array.from({ length: 36 }).forEach(function (_, index) {
  ellipse.addPort({
    group: 'group1',
    id: `${index}`,
    attrs: { text: { text: index } },
  })
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      x: 120,
      y: 90,
      width: 360,
      height: 200,
      shape: 'ellipse',

      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          group1: {
            markup: [
              {
                tagName: 'rect',
                selector: 'rect',
              },
              {
                tagName: 'circle',
                selector: 'dot',
              },
            ],
            attrs: {
              rect: {
                magnet: true,
                stroke: '#8f8f8f',
                fill: 'rgba(255,255,255,0.8)',
                strokeWidth: 1,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
              },
              dot: {
                fill: '#8f8f8f',
                r: 2,
              },
              text: {
                fontSize: 12,
                fill: '#888',
              },
            },
            label: {
              position: 'radial',
            },
            position: {
              name: 'ellipseSpread',
              args: {
                start: 45,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({
        id: `${index}`,
        group: 'group1',
        attrs: { text: { text: index } },
      })
    })

    this.node.portProp('0', {
      attrs: {
        rect: { stroke: '#8f8f8f' },
        dot: { fill: '#8f8f8f' },
      },
    })
  }

  onAttrsChanged = ({ start, compensateRotate, ...args }: State) => {
    this.node.prop('ports/groups/group1/position/args', {
      start,
      compensateRotate,
    })

    this.node.portProp('0', {
      args,
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-ellipse-spread-app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
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



## Custom Connection Point Layout

A connection point layout algorithm is a function with the following signature, which returns the relative position of each connection point relative to the node. For example, if a node is located at `{ x: 30, y: 40 }` on the canvas, and the returned position of a connection point is `{ x: 2, y: 4 }`, then the rendered position of the connection point on the canvas would be `{ x: 32, y: 44 }`.

```ts
type Definition<T> = (
  portsPositionArgs: T[], // Layout algorithm parameters specified in the connection points
  elemBBox: Rectangle, // Node bounding box
  groupPositionArgs: T, // Default layout algorithm parameters defined in the group
) => Result[]

interface Result {
  position: Point.PointLike // Relative position to the node
  angle?: number // Rotation angle
}
```

We can create a custom layout algorithm according to the above rules, for example, implementing a sine distribution layout algorithm:

```ts
function sin(portsPositionArgs, elemBBox) {
  return portsPositionArgs.map((_, index) => {
    const step = -Math.PI / 8
    const y = Math.sin(index * step) * 50
    return {
      position: {
        x: index * 12,
        y: y + elemBBox.height,
      },
      angle: 0,
    }
  })
}
```

After implementing the layout algorithm, we need to register it to the system. After registration, we can use it like the built-in layout algorithms.

```ts
Graph.registerPortLayout('sin', sin)
```

After registration, we can use it like the built-in layout algorithms:

```ts
const rect = graph.addNode({
  ports: {
    groups: {
      sin: {
        position: {
          name: 'sin',
          args: {
            start: 45,
          },
        },
        attrs: {
          rect: {
            fill: '#fe854f',
            width: 11,
          },
          text: {
            fill: '#fe854f',
          },
          circle: {
            fill: '#fe854f',
            r: 5,
            magnet: true,
          },
        },
      },
    },
  },
})

Array.from({ length: 24 }).forEach(() => {
  rect.addPort({ group: 'sin' })
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerPortLayout(
  'sin',
  (portsPositionArgs, elemBBox) => {
    return portsPositionArgs.map((_, index) => {
      const step = -Math.PI / 8
      const y = Math.sin(index * step) * 50
      return {
        position: {
          x: index * 12,
          y: y + elemBBox.height,
        },
        angle: 0,
      }
    })
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

    const rect = graph.addNode({
      x: 120,
      y: 40,
      width: 280,
      height: 120,
      attrs: {
        body: {
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          sin: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fe854f',
              },
            },
            position: 'sin',
          },
        },
      },
    })

    Array.from({ length: 24 }).forEach(() => {
      rect.addPort({ group: 'sin' })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-sin-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/port-layout/absolute/index.less

```less
.port-absolute-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
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
}
```
### docs/demos/api/port-layout/absolute/settings.tsx

```tsx
import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  x: number
  y: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    x: 0.6,
    y: 32,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onXChanged = (x: number) => {
    this.setState({ x }, () => {
      this.notifyChange()
    })
  }

  onYChanged = (y: number) => {
    this.setState({ y }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            x
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.x}
              onChange={this.onXChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.x}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            y
          </Col>
          <Col span={14}>
            <Slider
              min={-20}
              max={140}
              step={1}
              value={this.state.y}
              onChange={this.onYChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.y}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-layout/side/index.less

```less
.port-side-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
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
}
```
### docs/demos/api/port-layout/side/settings.tsx

```tsx
import React from 'react'
import { Radio, Switch, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  strict: boolean
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'left',
    strict: false,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  onStrictChange = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            position
          </Col>
          <Col span={12}>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio value={'left'}>left</Radio>
              <Radio value={'right'}>right</Radio>
              <Radio value={'top'}>top</Radio>
              <Radio value={'bottom'}>bottom</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            strict
          </Col>
          <Col span={14}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            dx
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            dy
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dy}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-layout/line/index.less

```less
.port-line-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
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
}
```
### docs/demos/api/port-layout/line/settings.tsx

```tsx
import React from 'react'
import { Slider, Switch, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  strict: boolean
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    strict: false,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onStrictChange = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            strict
          </Col>
          <Col span={14}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            dx
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            dy
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dy}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} style={{ textAlign: 'right', paddingRight: 16 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-layout/ellipse/index.less

```less
.port-ellipse-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
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
}
```
### docs/demos/api/port-layout/ellipse/settings.tsx

```tsx
import React from 'react'
import { Slider, Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  start: number
  step: number
  compensateRotate: boolean
  dr: number
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    start: 45,
    step: 20,
    compensateRotate: false,
    dr: 0,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onStartChanged = (start: number) => {
    this.setState({ start }, () => {
      this.notifyChange()
    })
  }

  onStepChanged = (step: number) => {
    this.setState({ step }, () => {
      this.notifyChange()
    })
  }

  onCompensateRotateChange = (e: any) => {
    this.setState({ compensateRotate: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDrChanged = (dr: number) => {
    this.setState({ dr }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            start
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.start}
              onChange={this.onStartChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.start}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            step
          </Col>
          <Col span={14}>
            <Slider
              min={10}
              max={36}
              step={1}
              value={this.state.step}
              onChange={this.onStepChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.step}</div>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={19} offset={5}>
            <Checkbox
              onChange={this.onCompensateRotateChange}
              checked={this.state.compensateRotate}
            >
              compensateRotate
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dr
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dr}
              onChange={this.onDrChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dr}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dx
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dy
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dy}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-layout/ellipse-spread/index.less

```less
.port-ellipse-spread-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
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
}
```
### docs/demos/api/port-layout/ellipse-spread/settings.tsx

```tsx
import React from 'react'
import { Slider, Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  start: number
  compensateRotate: boolean
  dr: number
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    start: 45,
    compensateRotate: false,
    dr: 0,
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onStartChanged = (start: number) => {
    this.setState({ start }, () => {
      this.notifyChange()
    })
  }

  onCompensateRotateChange = (e: any) => {
    this.setState({ compensateRotate: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDrChanged = (dr: number) => {
    this.setState({ dr }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            start
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.start}
              onChange={this.onStartChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.start}</div>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 24 }}
        >
          <Col span={19} offset={5}>
            <Checkbox
              onChange={this.onCompensateRotateChange}
              checked={this.state.compensateRotate}
            >
              compensateRotate
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dr
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dr}
              onChange={this.onDrChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dr}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dx
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            dy
          </Col>
          <Col span={14}>
            <Slider
              min={-10}
              max={10}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.dy}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 8 }}>
            angle
          </Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-layout/sin/index.less

```less
.port-sin-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
