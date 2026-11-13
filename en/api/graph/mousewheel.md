---
title: "Mousewheel"
description: "Mousewheel"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/graph/mousewheel/"
version: "3.x"
---

[Resource index](/llms.txt)

## Demonstration

> Hold down the `Command` key and use the mouse wheel to zoom in/out of the canvas.



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
      zoomAtMousePosition: true,
    })
  }

  initGraph(options: State) {
    if (this.graph) {
      this.graph.dispose()
    }

    this.graph = new Graph({
      container: this.container,
      height: 280,
      background: {
        color: '#F2F7FA',
      },
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ['ctrl', 'meta'],
        ...options,
      },
    })

    this.graph.addNode({
      x: 200,
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

  onSettingsChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="mousewheel-app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
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

You can use the `mousewheel` configuration to zoom in/out of the canvas, often used in combination with modifier keys. The usage is as follows:

```ts
const graph = new Graph({
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
})
```

Supported options are as follows:

```ts
interface MouseWheelOptions {
  enabled?: boolean
  global?: boolean
  factor?: number
  zoomAtMousePosition?: boolean
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  guard?: (this: Graph, e: WheelEvent) => boolean
}
```

### enabled

Whether to enable mouse wheel zooming interaction.

### factor

The zoom factor. Defaults to `1.2`.

### zoomAtMousePosition

Whether to zoom in/out at the mouse position. Defaults to `true`.

### global

Whether to bind the wheel event globally. If set to `true`, the wheel event is bound to the `Document`, otherwise it is bound to the canvas container. Defaults to `false`.

### modifiers

Modifier keys (`alt`, `ctrl`, `meta`, `shift`), which can be set to resolve conflicts between default wheel behavior and canvas zooming. Modifier keys support the following formats:

-  `alt` represents pressing the `alt` key.
-  `[alt, ctrl]` represents pressing either `alt` or `ctrl`.
-  `alt|ctrl` represents pressing either `alt` or `ctrl`.
-  `alt&ctrl` represents pressing both `alt` and `ctrl` simultaneously.
-  `alt|ctrl&shift` represents pressing both `alt` and `shift` simultaneously or both `ctrl` and `shift` simultaneously.

### guard

Determines whether a wheel event should be handled, returning `false` to ignore the event.

```ts
new Graph({
  mousewheel: {
    enabled: true,
    guard(e: WheelEvent) {
      if (e.altKey) {
        // Ignore all wheel events when the alt key is pressed
        return false
      }
      return true
    },
  },
})
```

## Methods

### isMouseWheelEnabled()

```ts
isMouseWheelEnabled(): boolean
```

Returns whether mouse wheel zooming is enabled.

### enableMouseWheel()

```ts
enableMouseWheel(): this
```

Enables mouse wheel zooming.

### disableMouseWheel()

```ts
disableMouseWheel(): this
```

Disables mouse wheel zooming.

### toggleMouseWheel(...)

```ts
toggleMouseWheel(enabled?: boolean): this
```

Toggles the enabled state of mouse wheel zooming.

| Name | Type | Required | Default | Description |
| --- | --- | :-: | --- | --- |
| enabled | boolean |  | - | Whether to enable mouse wheel zooming, toggles the state if not provided. |
### docs/demos/api/mousewheel/playground/index.less

```less
.mousewheel-app {
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
### docs/demos/api/mousewheel/playground/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  zoomAtMousePosition: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    zoomAtMousePosition: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onFixedChanged = (e: any) => {
    this.setState({ zoomAtMousePosition: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="MouseWheel Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.zoomAtMousePosition}
              onChange={this.onFixedChanged}
            >
              Zoom at Mouse Postion
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
