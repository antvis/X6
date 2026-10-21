---
title: "Routing"
description: "Routing"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/router/"
version: "3.x"
---

[Resource index](/llms.txt)

Routing further processes the edge's waypoints [vertices](/en/tutorial/basic/edge#vertices), adding additional points when necessary, and then returns the processed points (excluding the start and end points of the edge). For example, after [`orth`](#orth) routing, each segment of the edge is a horizontal or vertical orthogonal segment.

X6 has the following built-in routing options.

| Routing Name | Description                                                                                                   |
|--------------|---------------------------------------------------------------------------------------------------------------|
| normal       | [Default routing](#normal), returns the waypoints as they are.                                               |
| orth         | [Orthogonal routing](#orth), composed of horizontal or vertical orthogonal segments.                         |
| oneSide      | [Restricted orthogonal routing](#oneside), composed of three restricted horizontal or vertical orthogonal segments. |
| manhattan    | [Smart orthogonal routing](#manhattan), composed of horizontal or vertical orthogonal segments that automatically avoid other nodes (obstacles) on the path. |
| metro        | [Smart subway line routing](#metro), composed of horizontal or vertical orthogonal segments and diagonal segments, similar to a subway map, and automatically avoids other nodes (obstacles) on the path. |
| er           | [Entity-relationship routing](#er), composed of zigzag diagonal segments.                                     |

When using, you can set the routing for an edge:

```ts
const edge = graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: {
      side: 'right',
    },
  },
})
```

When the router has no parameters, it can also be simplified to:

```ts
const edge = graph.addEdge({
  source,
  target,
  router: 'oneSide',
})
```

You can also call the [`edge.setRouter`]() method to set the routing:

```ts
edge.setRouter('oneSide', { side: 'right' })
```

When creating a canvas, you can set a global default routing through the `connecting` option (the default routing for the canvas is `'normal'`):

```ts
new Graph({
  connecting: {
    router: {
      name: 'oneSide',
      args: {
        side: 'right',
      },
    },
  },
})
```

When the router has no parameters, it can also be simplified to:

```ts
new Graph({
  connecting: {
    router: 'orth',
  },
})
```

Now let's take a look at how to use the built-in routing and how to define and register custom routing.

## Built-in Routing

### normal

The system's default routing, which returns the input `vertices` path points as is.

### orth

Orthogonal routing, which adds extra points along the path to ensure that each line segment of the edge is horizontally or vertically orthogonal.

The supported parameters are as follows:

| Parameter Name | Parameter Type | Required | Default Value | Description                                   |
|----------------|----------------|:--------:|---------------|-----------------------------------------------|
| padding        | SideOptions    |    No    | 20            | Sets the minimum distance from the anchor point to the corner. |

`SideOptions` is defined as follows:

```ts
export type SideOptions =
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

For example:

```ts
graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: {
    name: 'orth',
    args: {
      padding: {
        left: 50,
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

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
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

    const rect2 = graph.addNode({
      x: 300,
      y: 240,
      width: 100,
      height: 40,
      label: 'world',
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

    graph.addNode({
      shape: 'circle',
      x: 80 - 5,
      y: 200 - 5,
      width: 10,
      height: 10,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    })

    graph.addNode({
      shape: 'circle',
      x: 300 - 5,
      y: 120 - 5,
      width: 10,
      height: 10,
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
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 80, y: 200 },
        { x: 300, y: 120 },
      ],
      router: {
        name: 'orth',
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="orth-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### oneSide

The `oneSide` routing is a restricted version of the orthogonal routing `orth`, which generates a strict three-segment route: starting from the `side` side of the starting node, passing through the middle segment, and ending at the `side` side of the target node. It is important to note that when using this routing, do not specify `vertices` at the same time, as it will result in poor routing performance.

The supported parameters are as follows:

| Parameter Name | Parameter Type                                       | Required | Default Value | Description                                   |
|----------------|------------------------------------------------------|:--------:|---------------|-----------------------------------------------|
| side           | `'left'` \| `'right'` \| `'top'` \| `'bottom'`     |    No    | `'bottom'`    | The starting/ending direction of the route, default is `'bottom'`. |
| padding        | SideOptions                                          |    No    | 20            | Sets the minimum distance from the anchor point to the corner. |

For example:

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: { side: 'right' },
  },
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

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
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

    const rect2 = graph.addNode({
      x: 200,
      y: 200,
      width: 100,
      height: 40,
      label: 'world',
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
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'oneSide',
        args: { side: 'right', padding: 50 },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="oneside-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### manhattan

The Manhattan routing `manhattan` is an intelligent version of the orthogonal routing `orth`, consisting of horizontal or vertical orthogonal line segments that automatically avoid other nodes (obstacles) along the path.

We provide a rich set of options for this routing algorithm:

| Parameter Name      | Parameter Type                 | Required | Default Value                               | Description                                                    |
|---------------------|-------------------------------|:--------:|---------------------------------------------|---------------------------------------------------------------|
| step                | number                        |    No    | `10`                                       | The step length of the routing algorithm; smaller values increase computation. It is recommended to use the canvas grid size. |
| excludeTerminals    | ('source' \| 'target')[]     |    No    | `[]`                                       | Ignore starting or ending nodes; ignored nodes will not be considered as obstacles. |
| excludeShapes       | string[]                      |    No    | `[]`                                       | Ignore specified shape nodes; ignored nodes will not be considered as obstacles. |
| excludeNodes        | (Node \| string)[]           |    No    | `[]`                                       | Nodes to ignore; ignored nodes will not be considered as obstacles. |
| startDirections     | string[]                      |    No    | `['top', 'right', 'bottom', 'left']`     | Supported directions to start routing.                         |
| endDirections       | string[]                      |    No    | `['top', 'right', 'bottom', 'left']`     | Supported directions to end routing.                           |
| padding             | SideOptions                   |    No    | -                                           | Sets the minimum distance from the anchor point to the corner. |
| fallbackRouter      | Router                        |    No    | `routerPresets.orth`                       | In scenarios where obstacles cannot be avoided, downgrade to the specified routing. |

For example, import `routerPresets` from `@antv/x6` to set the fallback explicitly:

```ts
import { routerPresets } from '@antv/x6'

graph.addEdge({
  source,
  target,
  router: {
    name: 'manhattan',
    args: {
      fallbackRouter: routerPresets.orth,
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```

When using the `manhattan` router together with the `Selection` plugin, if batch dragging multiple nodes causes performance lag, it is recommended to enable temporary routing downgrade in the `Selection` configuration by setting `movingRouterFallback: 'orth'`. This temporarily switches edges connected to the selected nodes to the lightweight `orth` router during dragging, reduces frequent path recalculations, and restores the original routers after idle:

```ts
graph.use(
  new Selection({
    // Switch router during dragging to orth
    movingRouterFallback: 'orth',
  }),
)
```

> **Note**

The characteristic of the manhattan routing is to automatically avoid obstacles in the path. If an unavoidable situation arises, it will automatically downgrade to the orth routing. In this case, to help developers identify the issue, a warning will be logged in the console: Unable to execute manhattan algorithm, use orth instead.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'

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
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      label: 'Source',
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

    const target = graph.addNode(
      source.clone().translate(460, 230).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 200,
      y: 150,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(280, -110)))
    obstacles.push(graph.addNode(obstacle.clone().translate(180, 10)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
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
      <div className="manhattan-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### metro

The metro routing `metro` is a variant of the Manhattan routing `manhattan`, consisting of horizontal or vertical orthogonal line segments and diagonal segments, similar to a subway map, and automatically avoids other nodes (obstacles) along the path. Its options are the same as [manhattan](#manhattan), but the default value of `maxDirectionChange` is `45`, indicating that the maximum slope angle of the routing line segment is `45` degrees.

For example:

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'metro',
    args: {
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Edge, EdgeView } from '@antv/x6'

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
      x: 80,
      y: 40,
      width: 120,
      height: 50,
      label: 'Source',
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

    const target = graph.addNode(
      source.clone().translate(460, 230).setAttrByPath('label/text', 'Target'),
    )

    const obstacles: Node[] = []
    const obstacle = graph.addNode({
      x: 200,
      y: 150,
      width: 120,
      height: 50,
      label: 'Obstacle',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    let edge: Edge

    const update = () => {
      const edgeView = graph.findViewByCell(edge) as EdgeView
      edgeView.update()
    }

    obstacles.push(obstacle)
    obstacles.push(graph.addNode(obstacle.clone().translate(280, -110)))
    obstacles.push(graph.addNode(obstacle.clone().translate(180, 10)))
    obstacles.forEach((obstacle) => obstacle.on('change:position', update))

    edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'metro',
        args: {
          startDirections: ['top'],
          endDirections: ['bottom'],
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
      <div className="metro-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### er

The entity-relationship routing `er` consists of zigzag diagonal segments, commonly used to represent connections between entities in an ER diagram.

The supported parameters are as follows:

| Parameter Name | Parameter Type                                 | Required | Default Value | Description                                                                                        |
|----------------|-----------------------------------------------|:--------:|---------------|----------------------------------------------------------------------------------------------------|
| offset         | number \| 'center'                           | No       | `32`          | The distance between the first and last points of the route and the nodes. When set to `'center'`, the center of the node is used as the route point coordinate. |
| min            | number                                        | No       | `16`          | The minimum distance between the first and last points of the route and the nodes.                |
| direction       | `'T'` \| `'B'` \| `'L'` \| `'R'` \| `'H'` \| `'V'` | No       | -              | The routing direction; if omitted, the optimal direction will be automatically selected.          |

For example:

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'er',
    args: {
      offset: 24,
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Edge, Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 40,
      y: 30,
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

    const rect2 = graph.addNode({
      x: 240,
      y: 150,
      width: 100,
      height: 40,
      label: 'world',
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

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'er',
        args: this.getERArgs(defaults),
      },
    })

    graph.centerContent()
  }

  getERArgs(state: State) {
    const { center, offset, min, direction } = state
    return {
      min,
      direction: direction || undefined,
      offset: center ? 'center' : offset,
    }
  }

  updateConnection = (state: State) => {
    this.edge.prop('router/args', this.getERArgs(state))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="er-router-app">
        <div className="app-left">
          <Settings onChange={this.updateConnection} />
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Custom Routing

In addition to built-in routing, we can also create custom routing according to certain rules, for example, implementing random routing:

```ts
// Routing parameters
interface RandomRouterArgs {
  bounces?: number
}

function randomRouter(
  vertices: Point.PointLike[],
  args: RandomRouterArgs,
  view: EdgeView,
) {
  const bounces = args.bounces || 20
  const points = vertices.map((p) => Point.create(p))

  for (var i = 0; i < bounces; i++) {
    const sourceCorner = view.sourceBBox.getCenter()
    const targetCorner = view.targetBBox.getCenter()
    const randomPoint = Point.random(
      sourceCorner.x,
      targetCorner.x,
      sourceCorner.y,
      targetCorner.y,
    )
    points.push(randomPoint)
  }

  return points
}

Graph.registerRouter('random', randomRouter)
edge.setRouter('random', { bounces: 3 })
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Point } from '@antv/x6'

Graph.registerRouter(
  'random',
  (vertices, args, view) => {
    const BOUNCES = args.bounces || 20
    const points = vertices.map((p) => Point.create(p))

    for (let i = 0; i < BOUNCES; i += 1) {
      const sourceCorner = view.sourceBBox.getCenter()
      const targetCorner = view.targetBBox.getCenter()
      const randomPoint = Point.random(
        sourceCorner.x,
        targetCorner.x,
        sourceCorner.y,
        targetCorner.y,
      )
      points.push(randomPoint)
    }

    return points
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
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'Source',
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

    const target = graph.addNode(
      source.clone().translate(300, 200).attr('label/text', 'Target'),
    )

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      router: {
        name: 'random',
        args: {
          bounces: 3,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="random-router-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/router/orth/index.less

```less
.orth-router-app {
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
### docs/demos/api/router/oneside/index.less

```less
.oneside-router-app {
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
### docs/demos/api/router/manhattan/index.less

```less
.manhattan-router-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 380px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/router/metro/index.less

```less
.metro-router-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 380px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/router/er/index.less

```less
.er-router-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
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
### docs/demos/api/router/er/settings.tsx

```tsx
import React from 'react'
import { Switch, Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  offset: number
  min: number
  center: boolean
  direction: '' | 'T' | 'B' | 'L' | 'R' | 'H' | 'V'
}

export const defaults: State = {
  offset: 32,
  min: 16,
  center: false,
  direction: '',
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCenterChanged = (center: boolean) => {
    this.setState({ center }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onMinChanged = (min: number) => {
    this.setState({ min }, () => {
      this.notifyChange()
    })
  }

  onDirectionChanged = (e: any) => {
    const direction = e.target.value
    this.setState({ direction }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Options"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>offset</Col>
          <Col span={14}>
            <Switch
              checkedChildren="center"
              unCheckedChildren="number"
              checked={this.state.center}
              onChange={this.onCenterChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}></Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              disabled={this.state.center}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>min</Col>
          <Col span={14}>
            <Slider
              min={8}
              max={64}
              step={1}
              value={this.state.min}
              onChange={this.onMinChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.min}</div>
          </Col>
        </Row>
        <Row align="top">
          <Col span={6}>direction</Col>
          <Col span={14}>
            <Radio.Group
              name="direction"
              value={this.state.direction}
              onChange={this.onDirectionChanged}
            >
              <Radio value="" style={{ display: 'block', marginBottom: 8 }}>
                NONE
              </Radio>
              <Radio value="L" style={{ marginBottom: 8 }}>
                L
              </Radio>
              <Radio value="R">R</Radio>
              <Radio value="H">H</Radio>
              <Radio value="T">T</Radio>
              <Radio value="B">B</Radio>
              <Radio value="V">V</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/router/random/index.less

```less
.random-router-app {
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
