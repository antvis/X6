---
title: "Snapline"
description: "Snapline"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/snapline/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This section mainly introduces the Snapline plugin. By reading, you will learn:**

- How to use snaplines on the canvas


## Usage

Snaplines help align moving nodes. Enable the feature via the `Snapline` plugin:

```ts
import { Graph, Snapline } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Snapline({
    enabled: true,
  }),
)
```

## Demo



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Snapline } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Snapline({
        enabled: true,
        clean: false,
      }),
    )

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Drag Me',
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

    const source = this.graph.addNode({
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
  }

  onSnaplineChanged = (options: State) => {
    this.graph.setSnaplineTolerance(options.tolerance)
    this.graph.setSnaplineFilter(options.filter)

    if (options.sharp) {
      this.graph.enableSharpSnapline()
    } else {
      this.graph.disableSharpSnapline()
    }

    if (options.resizing) {
      this.graph.enableSnaplineOnResizing()
    } else {
      this.graph.disableSnaplineOnResizing()
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="snapline-app">
        <div className="app-side">
          <Settings onChange={this.onSnaplineChanged} />
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

| Property Name | Type    | Default Value | Required | Description                                                                                               |
|---------------|---------|---------------|----------|-----------------------------------------------------------------------------------------------------------|
| className     | string  | -             |          | Additional class name to customize snapline styles                                                         |
| tolerance     | number  | 10            |          | Snapline precision; a snapline is shown when the distance to the target position is less than `tolerance` |
| sharp         | boolean | `false`       |          | Whether to use short snaplines (truncated)                                                                 |
| resizing      | boolean | `false`       |          | Whether to trigger snaplines when resizing nodes                                                            |
| clean         | boolean | `true`        |          | If `true`, snaplines are cleared after 3 seconds; if `false`, they are not cleared; if a number (ms), they are cleared after the specified duration |
| filter        | Filter  | -             |          | Node filter                                                                                                 |

The above Filter type is relatively flexible and supports the following forms:

- `string[]`: An array of node `shape`s; only nodes with those shapes participate in snapline calculations
- `({ id: string })[]`: An array of node IDs; only the specified nodes participate in snapline calculations
- `(this: Graph, node: Node) => boolean`: Only nodes for which the function returns `true` participate in snapline calculations

## API

### graph.isSnaplineEnabled()

```ts
isSnaplineEnabled(): boolean
```

Returns whether snaplines are enabled.

### graph.enableSnapline()

```ts
enableSnapline(): this
```

Enables snaplines.

### graph.disableSnapline()

```ts
disableSnapline(): this
```

Disables snaplines.

### graph.toggleSnapline(...)

```ts
toggleSnapline(enabled?: boolean): this
```

Toggles whether snaplines are enabled. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                                                                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------------------------------------------------------------------------|
| enabled | boolean |          | -             | Whether to enable snaplines; if omitted, toggles the current enabled state.                                     |

### graph.hideSnapline()

```ts
hideSnapline(): this
```

Hides snaplines.

### graph.isSnaplineOnResizingEnabled()

```ts
isSnaplineOnResizingEnabled(): boolean
```

Whether to trigger snaplines when resizing nodes.

### graph.enableSnaplineOnResizing()

```ts
enableSnaplineOnResizing(): this
```

Enables triggering snaplines during node resizing.

### graph.disableSnaplineOnResizing()

```ts
disableSnaplineOnResizing(): this
```

Disables triggering snaplines during node resizing.

### graph.toggleSnaplineOnResizing(...)

```ts
toggleSnaplineOnResizing(enabled?: boolean): this
```

Toggles whether to trigger snaplines during node resizing. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                                                                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------------------------------------------------------------------------|
| enabled | boolean |          | -             | Whether to enable snaplines; if omitted, toggles the current enabled state.                                     |

### graph.isSharpSnapline()

```ts
isSharpSnapline(): boolean
```

Whether to use short snaplines.

### graph.enableSharpSnapline()

```ts
enableSharpSnapline(): this
```

Enables short snaplines; when enabled, snaplines are truncated at relevant node positions; otherwise they span across the canvas.

### graph.disableSharpSnapline()

```ts
disableSharpSnapline(): this
```

Disables short snaplines; snaplines span the entire canvas.

### graph.toggleSharpSnapline()

```ts
toggleSharpSnapline(enabled?: boolean): this
```

Toggles whether short snaplines are enabled. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                                                                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------------------------------------------------------------------------|
| enabled | boolean |          | -             | Whether to enable short snaplines; if omitted, toggles the current enabled state.                                |

### graph.getSnaplineTolerance()

```ts
getSnaplineTolerance(): number
```

Gets snapline precision.

### graph.setSnaplineTolerance(...)

```ts
setSnaplineTolerance(tolerance: number): this
```

Sets snapline precision.

### graph.setSnaplineFilter(...)

```ts
setSnaplineFilter(
  filter?:
   | null
   | (string | { id: string })[]
   | ((this: Graph, node: Node) => boolean)
): this
```

Sets the filter; only nodes that meet the condition participate in snapline calculations.
### docs/demos/tutorial/plugins/snapline/index.less

```less
.snapline-app {
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
### docs/demos/tutorial/plugins/snapline/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  tolerance: number
  sharp: boolean
  resizing: boolean
  filter?: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    tolerance: 10,
    sharp: false,
    resizing: false,
  }

  tryToJSON(val: string) {
    try {
      return JSON.parse(val)
    } catch (error) {
      return val
    }
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onSharpChanged = (e: any) => {
    this.setState({ sharp: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onResingChanged = (e: any) => {
    this.setState({ resizing: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onToleranceChanged = (tolerance: number) => {
    this.setState({ tolerance }, () => {
      this.notifyChange()
    })
  }

  onFilterChanged = (e: any) => {
    this.setState(
      {
        filter: e.target.checked ? ['circle'] : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card
        title="Snapline Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Tolerance</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.tolerance}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.tolerance}
              onChange={this.onToleranceChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox checked={this.state.sharp} onChange={this.onSharpChanged}>
              Sharp Line
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.resizing}
              onChange={this.onResingChanged}
            >
              Snap on Resizing
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add Filter(only circle)
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
