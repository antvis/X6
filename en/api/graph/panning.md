---
title: "Panning"
description: "Panning"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/graph/panning/"
version: "3.x"
---

[Resource index](/llms.txt)

## Demo



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
      enabled: true,
      modifiers: [],
      eventTypes: ['leftMouseDown'],
    })
  }

  initGraph(options: any) {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      panning: {
        ...options,
      },
    })

    this.graph.addNode({
      x: 320,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
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
      x: 80,
      y: 50,
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
      x: 240,
      y: 200,
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
      <div className="panning-app">
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

A regular canvas (without the `Scroller` plugin) can support panning by the `panning` option.

```ts
const graph = new Graph({
  panning: true, // If not provided, default is also true
})

// Equivalent to
const graph = new Graph({
  panning: {
    enabled: true,
  },
})
```

The supported options are as follows:

```ts
interface Options {
  enabled?: boolean
  modifiers?: ModifierKey
  eventTypes?: ('leftMouseDown' | 'rightMouseDown' | 'mouseWheel' | 'mouseWheelDown')[]
}
```

### enabled

Whether to enable canvas panning interaction.

### modifiers

Dragging may conflict with other operations, so you can set the `modifiers` parameter to specify a modifier key that needs to be pressed along with the mouse click to trigger canvas panning.

The type definition of `ModifierKey` is as follows:

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift' | 'space')[] | null
```

It supports the following forms:

-  `alt` represents pressing the `alt` key.
-  `[alt, ctrl]` represents pressing either the `alt` or `ctrl` key.
-  `alt|ctrl` represents pressing either the `alt` or `ctrl` key.
-  `alt&ctrl` represents pressing both the `alt` and `ctrl` keys simultaneously.
-  `alt|ctrl&shift` represents pressing both the `alt` and `shift` keys simultaneously or pressing both the `ctrl` and `shift` keys simultaneously.

### eventTypes

The interaction types that trigger canvas panning. It supports four forms or their combinations:

-  `leftMouseDown`: Dragging by pressing the left mouse button
-  `rightMouseDown`: Dragging by pressing the right mouse button
-  `mouseWheel`: Dragging by scrolling the mouse wheel
-  `mouseWheelDown`: Dragging by pressing the mouse wheel

## Methods

### isPannable()

```ts
isPannable(): boolean
```

Returns whether canvas panning interaction is enabled.

### enablePanning()

```ts
enablePanning(): this
```

Enables canvas panning.

### disablePanning()

```ts
disablePanning(): this
```

Disables canvas panning.

### togglePanning(...)

```ts
togglePanning(enabled?: boolean): this
```

Toggles the enabled state of canvas panning. The parameter is as follows:

| Name    | Type    | Required | Default Value | Description                                               |
|---------|---------|:--------:|--------------|--------------------------------------------------|
| enabled | boolean |          | -            | Whether to enable canvas panning, defaults to toggling the enabled state. |
### docs/demos/api/panning/playground/index.less

```less
.panning-app {
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
}
```
### docs/demos/api/panning/playground/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Switch, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: boolean
  modifiers: string[]
  eventTypes: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    modifiers: [],
    eventTypes: ['leftMouseDown'],
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnabledChanged = (enabled: boolean) => {
    this.setState({ enabled }, () => {
      this.notifyChange()
    })
  }

  onModifiersChange = (modifiers: string[]) => {
    this.setState({ modifiers }, () => {
      this.notifyChange()
    })
  }

  onEventTypesChange = (eventTypes: string[]) => {
    this.setState({ eventTypes }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Selection Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={14}>Enabled</Col>
          <Col span={10}>
            <Switch
              checked={this.state.enabled}
              onChange={this.onEnabledChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Modifier Key</Col>
          <Col span={16}>
            <Checkbox.Group
              options={['alt', 'ctrl', 'shift']}
              value={this.state.modifiers}
              onChange={this.onModifiersChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Event Type</Col>
          <Col span={16}>
            <Checkbox.Group
              options={[
                {
                  label: '左键',
                  value: 'leftMouseDown',
                },
                {
                  label: '右键',
                  value: 'rightMouseDown',
                },
                {
                  label: '滚轮',
                  value: 'mousewheel',
                },
              ]}
              value={this.state.eventTypes}
              onChange={this.onEventTypesChange}
            />
          </Col>
        </Row>
      </Card>
    )
  }
}
```
