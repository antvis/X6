---
title: "Graphic Transformations"
description: "Graphic Transformations"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/transform/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to the graphic transformation plugin. By reading, you can learn about**

- How to adjust node size using the interactive plugin
- How to adjust a node’s rotation angle using the interactive plugin


## Usage

Using interactive UI components to adjust node size and angle is a common requirement. We provide the `transform` plugin to implement this. Use it like this:

```ts
import { Graph, Transform } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Transform({
    resizing: resizingOptions,
    rotating: rotatingOptions,
  }),
)
```

## Demo

First, let's experience interactive resizing of nodes (clicking on a node brings up the operation component):



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Transform } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      minWidth: 1,
      maxWidth: 200,
      minHeight: 1,
      maxHeight: 150,
      orthogonal: false,
      restrict: false,
      preserveAspectRatio: false,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Transform({
        resizing: options,
      }),
    )

    const source = this.graph.addNode({
      shape: 'rect',
      x: 32,
      y: 32,
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

    const target = this.graph.addNode({
      shape: 'circle',
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    })

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    this.graph.centerContent()
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="resizing-app">
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



Next, let's experience interactive rotation of nodes (clicking on a node brings up the operation component):



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Transform } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      grid: 15,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Transform({
        rotating: options,
      }),
    )

    const source = this.graph.addNode({
      x: 60,
      y: 130,
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

    const target = this.graph.addNode({
      shape: 'circle',
      x: 260,
      y: 120,
      width: 60,
      height: 60,
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

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    this.graph.centerContent()
  }

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="rotating-app">
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



## Configuration

### Resizing

| Property Name       | Type    | Default Value | Required | Description                                   |
|---------------------|---------|---------------|----------|-----------------------------------------------|
| enabled             | boolean | `false`       |          | Whether resizing of nodes is supported        |
| minWidth            | number  | 0             |          | Minimum resizing width                         |
| minHeight           | number  | 0             |          | Minimum resizing height                        |
| maxWidth            | number  | `Infinity`    |          | Maximum resizing width                         |
| maxHeight           | number  | `Infinity`    |          | Maximum resizing height                        |
| orthogonal          | boolean | `true`        |          | Whether to show intermediate resizing points   |
| restrict            | boolean | `false`       |          | Whether resizing boundaries can exceed canvas edges |
| autoScroll          | boolean | `true`        |          | Whether to automatically scroll the canvas when dragging exceeds its bounds |
| preserveAspectRatio | boolean | `false`       |          | Whether to maintain the aspect ratio during resizing |
| allowReverse        | boolean | `true`        |          | Whether to allow control points to drag in reverse when reaching minimum width or height |

The above configuration supports dynamic modification using functions as well:

```ts
new Transform({
  resizing: {
    enabled: true,
    orthogonal(node: Node) {
      const { enableOrthogonal } = node.getData()
      return enableOrthogonal
    },
  },
})
```

### Rotating

| Property Name | Type    | Default Value | Required | Description                     |
|---------------|---------|---------------|----------|---------------------------------|
| enabled       | boolean | `false`       |          | Whether rotating of nodes is supported |
| grid          | number  | 15            |          | Angle of rotation per step      |

The above configuration also supports dynamic modification using functions:

```ts
new Transform({
  rotating: {
    enabled: true,
    grid() {
      return 30
    },
  },
})
```

## API

### graph.createTransformWidget(node: Node)

Creates a transform control for the node.

### graph.clearTransformWidgets()

Clears all transform controls.

## Events

| Event Name        | Parameter Type                                                                      | Description                   |
|-------------------|-------------------------------------------------------------------------------------|-------------------------------|
| `node:resize`     | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered when resizing starts |
| `node:resizing`   | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered during resizing     |
| `node:resized`    | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`       | Triggered after resizing      |
| `node:rotate`     | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered when rotation starts |
| `node:rotating`   | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }`     | Triggered during rotation     |
| `node:rotated`    | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`       | Triggered after rotation      |

```ts
graph.on('node:rotated', ({ node }) => {
  console.log(node.angle())
})

// We can also listen to events on the plugin instance
transform.on('node:rotated', ({ node }) => {
  console.log(node.angle())
})
```
### docs/demos/tutorial/plugins/transform/resizing/index.less

```less
.resizing-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;

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

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0;
    border: 1px solid #239edd;
    border-radius: 6px;
  }

  .x6-widget-transform > div {
    border: 1px solid #239edd;
  }

  .x6-widget-transform > div:hover {
    background-color: #3dafe4;
  }

  .x6-widget-transform-active-handle {
    background-color: #3dafe4;
  }

  .x6-widget-transform-resize {
    border-radius: 0;
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
}
```
### docs/demos/tutorial/plugins/transform/resizing/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orthogonal?: boolean
  restrict?: boolean
  preserveAspectRatio?: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    minWidth: 1,
    maxWidth: 200,
    minHeight: 1,
    maxHeight: 150,
    orthogonal: false,
    restrict: false,
    preserveAspectRatio: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnableChanged = (e: any) => {
    this.setState({ enabled: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinWidthChanged = (minWidth: number) => {
    this.setState({ minWidth }, () => {
      this.notifyChange()
    })
  }

  onMaxWidthChanged = (maxWidth: number) => {
    this.setState({ maxWidth }, () => {
      this.notifyChange()
    })
  }

  onMinHeightChanged = (minHeight: number) => {
    this.setState({ minHeight }, () => {
      this.notifyChange()
    })
  }

  onMaxHeightChanged = (maxHeight: number) => {
    this.setState({ maxHeight }, () => {
      this.notifyChange()
    })
  }

  onOrthogonalChanged = (e: any) => {
    this.setState({ orthogonal: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onRestrictedChanged = (e: any) => {
    this.setState({ restrict: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPreserveAspectRatioChanged = (e: any) => {
    this.setState({ preserveAspectRatio: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Resizing Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.enabled}
              onChange={this.onEnableChanged}
            >
              Enabled
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minWidth</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={this.state.minWidth}
              onChange={this.onMinWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxWidth</Col>
          <Col span={14}>
            <Slider
              min={100}
              max={200}
              step={1}
              value={this.state.maxWidth}
              onChange={this.onMaxWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minHeight</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={75}
              step={1}
              value={this.state.minHeight}
              onChange={this.onMinHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxHeight</Col>
          <Col span={14}>
            <Slider
              min={75}
              max={150}
              step={1}
              value={this.state.maxHeight}
              onChange={this.onMaxHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.orthogonal}
              onChange={this.onOrthogonalChanged}
            >
              Orthogonal
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.restrict}
              onChange={this.onRestrictedChanged}
            >
              Restrict
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.preserveAspectRatio}
              onChange={this.onPreserveAspectRatioChanged}
            >
              PreserveAspectRatio
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/tutorial/plugins/transform/rotating/index.less

```less
.rotating-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;

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

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0;
    border: 1px solid #239edd;
    border-radius: 6px;
  }

  .x6-widget-transform > div {
    border: 1px solid #239edd;
  }

  .x6-widget-transform > div:hover {
    background-color: #3dafe4;
  }

  .x6-widget-transform-active-handle {
    background-color: #3dafe4;
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
}
```
### docs/demos/tutorial/plugins/transform/rotating/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  grid?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    grid: 15,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnableChanged = (e: any) => {
    this.setState({ enabled: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onGridChanged = (grid: number) => {
    this.setState({ grid }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Rotating Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.enabled}
              onChange={this.onEnableChanged}
            >
              Enabled
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>grid</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={180}
              step={1}
              value={this.state.grid}
              onChange={this.onGridChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.grid}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
