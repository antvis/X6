---
title: "Connector"
description: "Connector"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/connector/"
version: "3.x"
---

[Resource index](/llms.txt)

The connector processes the start point, route return point, and end point into a `<path>` element's `d` attribute, determining the style of the edge rendering on the canvas. X6 has several built-in connectors.

| Connector   | Description                                                                                  |
|----------|-------------------------------------------------------------------------------------|
| normal   | [Simple Connector](#normal), connects the start point, route point, and end point with a straight line.                                    |
| smooth   | [Smooth Connector](#smooth), connects the start point, route point, and end point with a cubic Bezier curve.                        |
| rounded  | [Rounded Connector](#rounded), connects the start point, route point, and end point with a straight line and uses an arc to connect the line segments (fillet).  |
| jumpover | [Jumpover Connector](#jumpover), connects the start point, route point, and end point with a straight line and uses a jump symbol to connect the intersecting edges. |

You can set a route for a specific edge:

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: {
    name: 'rounded',
    args: {
      radius: 20,
    },
  },
})
```

When there is no connector parameter, it can be simplified to:

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: 'rounded',
})
```

You can also call `edge.setConnector` to set the connector:

```ts
edge.setConnector('rounded', { radius: 20 })
```

When creating a canvas, you can set the global default connector (default is `'normal'`) through the `connecting` option:

```ts
new Graph({
  connecting: {
    connector: {
      name: 'rounded',
      args: {
        radius: 20,
      },
    },
  },
})
```

When there is no route parameter, it can be simplified to:

```ts
new Graph({
  connecting: {
    connector: 'rounded',
  },
})
```

Let's take a look at how to use built-in connectors and how to customize and register custom connectors.

## Built-in Connectors

### normal

The system's default connector, connects the start point, route point, and end point in sequence with a straight line.

Supported parameters are as follows:

| Parameter Name | Parameter Type | Required | Default Value  | Parameter Description                                                        |
|---------------|---------------|:-------:|---------|-------------------------------------------------------------|
| raw          | boolean       |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string. |



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

    graph.addEdge({
      source: rect1,
      target: rect2,
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      connector: {
        name: 'normal',
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-normal-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### smooth

A smooth connector, connects the start point, route point, and end point with a cubic Bezier curve.

Supported parameters are as follows:

| Parameter Name    | Parameter Type   | Required | Default Value  | Parameter Description                                                         |
|-----------------|-----------------|----------|---------|--------------------------------------------------------------|
| raw             | boolean         |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string.  |
| direction       | `H` \| `V`      |    No    | -       | Keep horizontal connection or keep vertical connection, not set will dynamically calculate based on the start and end points. |

For example:

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: 'smooth',
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

    graph.addEdge({
      source: rect1,
      target: rect2,
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      connector: {
        name: 'smooth',
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-smooth-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### rounded

A rounded connector, connects the start point, route point, and end point with a straight line and uses an arc to connect the line segments (fillet).

Supported parameters are as follows:

| Parameter Name | Parameter Type | Required | Default Value  | Parameter Description                                                        |
|---------------|---------------|:-------:|---------|-------------------------------------------------------------|
| radius        | number         |    No    | `10`    | Fillet radius.                                                       |
| raw          | boolean       |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string. |

For example:

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: {
    name: 'rounded',
    args: {
      radius: 10,
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings.tsx'

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
      y: 220,
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
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      connector: {
        name: 'rounded',
      },
    })

    graph.centerContent()
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('rounded', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-rounded-app">
        <div className="app-left">
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



### jumpover

A jumpover connector, connects the start point, route point, and end point with a straight line and uses a jump symbol to connect the intersecting edges.

Supported parameters are as follows:

| Parameter Name | Parameter Type                  | Required | Default Value  | Parameter Description                                                        |
|---------------|-------------------------------|:-------:|---------|-------------------------------------------------------------|
| type         | 'arc' \| 'gap' \| 'cubic' |    No    | `'arc'` | Jump type.                                                       |
| size         | number                    |    No    | `5`     | Jump size.                                                       |
| radius       | number                    |    No    | `0`     | Fillet radius.                                                       |
| raw          | boolean                   |    No    | `false` | Whether to return a `Path` object, default value is `false` returns a serialized string. |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings.tsx'

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

    const source = graph.addNode({
      x: 24,
      y: 70,
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
    })

    const target = graph.addNode({
      x: 24,
      y: 160,
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
    })

    this.edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 760, y: 150 },
        { x: 760, y: 240 },
      ],
      connector: {
        name: 'jumpover',
        args: {
          type: 'arc',
          size: 5,
          radius: 0,
        },
      },
    })

    const rect = graph.addNode({
      x: 160,
      y: 24,
      width: 70,
      height: 30,
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

    for (let i = 0; i < 6; i += 1) {
      const source = rect.clone().translate(i * 100, i * 10)
      graph.addNode(source)

      const target = source.clone().translate(0, 200)
      graph.addNode(target)
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
    }
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('jumpover', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-jumpover-app">
        <div className="app-left">
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



## Custom Connectors

A connector is a function with the following signature, returning a `Path` object or a serialized string.

```ts
export type Definition<T> = (
  this: EdgeView, // Edge view
  sourcePoint: Point.PointLike, // Start point
  targetPoint: Point.PointLike, // End point
  routePoints: Point.PointLike[], // Route return points
  args: T, // Connector parameters
  edgeView: EdgeView, // Edge view
) => Path | string
```

| Parameter Name      | Parameter Type          | Parameter Description      |
|--------------------|-------------------------|-------------------------|
| this               | EdgeView               | Edge view.              |
| sourcePoint        | Point.PointLike        | Start point.            |
| targetPoint        | Point.PointLike        | End point.              |
| routePoints        | Point.PointLike[]      | Route return points.     |
| args               | T                       | Connector parameters.   |
| edgeView           | EdgeView               | Edge view.              |

I'll define a `wobble` connector:

```ts
export interface WobbleArgs {
  spread?: number
  raw?: boolean
}

function wobble(
  sourcePoint: Point.PointLike,
  targetPoint: Point.PointLike,
  vertices: Point.PointLike[],
  args: WobbleArgs,
) {
  const spread = args.spread || 20
  const points = [...vertices, targetPoint].map((p) => Point.create(p))
  let prev = Point.create(sourcePoint)
  const path = new Path(Path.createSegment('M', prev))

  for (let i = 0, n = points.length; i < n; i += 1) {
    const next = points[i]
    const distance = prev.distance(next)
    let d = spread

    while (d < distance) {
      const current = prev.clone().move(next, -d)
      current.translate(
        Math.floor(7 * Math.random()) - 3,
        Math.floor(7 * Math.random()) - 3,
      )
      path.appendSegment(Path.createSegment('L', current))
      d += spread
    }

    path.appendSegment(Path.createSegment('L', next))
    prev = next
  }

  return args.raw ? path : path.serialize()
}
```

Then register the connector:

```ts
Graph.registerConnector('wobble', wobble)
```

After registration, we can use it by connector name:

```ts
edge.setConnector('wobble', { spread: 16 })
```


```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Path, Point } from '@antv/x6'

export interface WobbleArgs {
  spread?: number
  raw?: boolean
}

Graph.registerConnector(
  'wobble',
  (sourcePoint, targetPoint, vertices, args: WobbleArgs) => {
    const spread = args.spread || 20
    const points = [...vertices, targetPoint].map((p) => Point.create(p))
    let prev = Point.create(sourcePoint)
    const path = new Path()
    path.appendSegment(Path.createSegment('M', prev))

    for (let i = 0, n = points.length; i < n; i += 1) {
      const next = points[i]
      const distance = prev.distance(next)
      let d = spread

      while (d < distance) {
        const current = prev.clone().move(next, -d)
        current.translate(
          Math.floor(7 * Math.random()) - 3,
          Math.floor(7 * Math.random()) - 3,
        )
        path.appendSegment(Path.createSegment('L', current))
        d += spread
      }

      path.appendSegment(Path.createSegment('L', next))
      prev = next
    }

    return path
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
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      connector: {
        name: 'wobble',
        args: {
          spread: 16,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-wobble-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/connector/normal/index.less

```less
.connector-normal-app {
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
### docs/demos/api/connector/smooth/index.less

```less
.connector-smooth-app {
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
### docs/demos/api/connector/rounded/index.less

```less
.connector-rounded-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 320px;
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
### docs/demos/api/connector/rounded/settings.tsx

```tsx
import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    radius: 10,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.radius}
              onChange={this.onRadiusChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.radius}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/connector/jumpover/index.less

```less
.connector-jumpover-app {
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
    height: 320px;
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
### docs/demos/api/connector/jumpover/settings.tsx

```tsx
import React from 'react'
import { Slider, Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
  size: number
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'arc',
    size: 5,
    radius: 0,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.notifyChange()
    })
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  onTypeChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>type</Col>
          <Col span={18}>
            <Radio.Group onChange={this.onTypeChange} value={this.state.type}>
              <Radio value={'arc'}>arc</Radio>
              <Radio value={'cubic'}>cubic</Radio>
              <Radio value={'gap'}>gap</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>size</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={30}
              step={1}
              value={this.state.radius}
              onChange={this.onRadiusChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.radius}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/connector/wobble/index.less

```less
.connector-wobble-app {
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
