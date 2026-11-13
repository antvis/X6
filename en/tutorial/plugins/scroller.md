---
title: "Scroller"
description: "Scroller"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/scroller/"
version: "3.x"
---

[Resource index](/llms.txt)

> **In this chapter, we mainly introduce knowledge related to the scroller plugin. By reading, you can learn about**

- How to enable scrolling capabilities for the canvas


> **Note**

The `Scroller` plugin disables the graph's built-in `panning` by default to avoid interaction conflicts.

## Usage

You can enable canvas scrolling with the `Scroller` plugin. For example:

```ts
import { Graph, Scroller } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  }
})
graph.use(
  new Scroller({
    enabled: true,
  }),
)
```

## Demo



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Button } from 'antd'
import { Graph, Scroller } from '@antv/x6'
import { Settings, State } from './settings.tsx'

const data = {
  hello: {
    id: 'hello',
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
  },
  world: {
    id: 'world',
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
  },
  rect: {
    id: 'rect',
    x: -60,
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
  },
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.renderGraph()
  }

  renderGraph(options: State | null = null) {
    if (this.graph) {
      this.graph.dispose()
    }

    const graph = new Graph({
      container: this.container,
      panning: false,
      background: {
        color: '#F2F7FA',
      },
    })
    graph.use(
      new Scroller({
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
        ...options,
      }),
    )

    graph.fromJSON({ nodes: Object.keys(data).map((key) => data[key]) })

    graph.on('node:change:position', ({ node, current }) => {
      const item = data[node.id]
      item.x = current!.x
      item.y = current!.y
    })

    graph.centerContent()
    this.graph = graph
  }

  onSettingsChanged = (options: State) => {
    this.renderGraph(options)
  }

  onCenter = () => {
    this.graph.center()
  }

  onCenterContent = () => {
    this.graph.centerContent()
  }

  onCenterCircle = () => {
    const circle = this.graph.getCellById('world')
    if (circle) {
      this.graph.centerCell(circle)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="scroller-app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
        </div>
        <div className="app-main">
          <div className="app-btns">
            <Button onClick={this.onCenter}>Center Graph</Button>
            <Button onClick={this.onCenterContent}>Center Whole Content</Button>
            <Button onClick={this.onCenterCircle}>Center The Circle</Button>
          </div>
          <div className="app-content" ref={this.refContainer} />
        </div>
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Options

| Property Name     | Type                | Default  | Required | Description                                                                                                                                                                           |
|-------------------|---------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pannable           | boolean             | `false`  |          | Whether to enable canvas panning capability (dragging the canvas after pressing the mouse on a blank area)                                                                           |
| className          | string              | -        |          | Additional class name for custom styling                                                                                                                                              |
| width              | number              | -        |          | Width of the `Scroller`, defaults to the width of the canvas container                                                                                                               |
| height             | number              | -        |          | Height of the `Scroller`, defaults to the height of the canvas container                                                                                                             |
| modifiers          | ModifierKey         | -        |          | Set modifier keys that need to be pressed along with the mouse click to trigger canvas dragging                                                                                      |
| pageWidth          | number              | -        |          | Width of each page, defaults to the width of the canvas container                                                                                                                    |
| pageHeight         | number              | -        |          | Height of each page, defaults to the height of the canvas container                                                                                                                  |
| pageVisible        | boolean             | `false`  |          | Whether to enable pagination                                                                                                                                                          |
| pageBreak          | boolean             | `false`  |          | Whether to show page breaks                                                                                                                                                          |
| autoResize         | boolean             | `true`   |          | Whether to automatically expand/shrink the canvas. When enabled, moving nodes/edges will automatically calculate the required canvas size, expanding it according to `pageWidth` and `pageHeight` when exceeding the current size, and shrinking it otherwise. |
| minVisibleWidth    | number              | -        |          | Effective when `padding` is empty, sets the minimum visible width of the canvas during scrolling                                                                                     |
| minVisibleHeight   | number              | -        |          | Effective when `padding` is empty, sets the minimum visible height of the canvas during scrolling                                                                                    |
| padding            | `number \| Padding` | -        |          | Sets the padding around the canvas. Defaults to being automatically calculated based on `minVisibleWidth` and `minVisibleHeight`, ensuring that at least `minVisibleWidth` and `minVisibleHeight` of the canvas is visible during scrolling. |

The `Padding` type is defined as follows:

```ts
type Padding = { top: number; right: number; bottom: number; left: number }
```

The `ModifierKey` type is defined as follows:

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift' | 'space')[] | null
```

Supports the following forms:

- `alt` means pressing `alt`.
- `[alt, ctrl]` means pressing either `alt` or `ctrl`.
- `alt|ctrl` means pressing either `alt` or `ctrl`.
- `alt&ctrl` means pressing both `alt` and `ctrl` simultaneously.
- `alt|ctrl&shift` means pressing both `alt` and `shift` simultaneously or both `ctrl` and `shift` simultaneously.

## API

### graph.lockScroller()

Disables scrolling.

### graph.unlockScroller()

Enables scrolling.

### graph.getScrollbarPosition()

Gets the scrollbar position.

### graph.setScrollbarPosition(left?: number, top?: number)

Sets the scrollbar position.

- `left?: number` The position of the horizontal scrollbar; defaults to no horizontal scrolling.
- `top?: number` The position of the vertical scrollbar; defaults to no vertical scrolling.

For example:

```ts
graph.setScrollbarPosition(100)
graph.setScrollbarPosition(100, null)
graph.setScrollbarPosition(null, 200)
graph.setScrollbarPosition(100, 200)
```
### docs/demos/tutorial/plugins/scroller/index.less

```less
.scroller-app {
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

  .app-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-right: 8px;
    margin-left: 8px;

    .app-btns {
      display: flex;
      padding-top: 4px;
      padding-bottom: 12px;
    }

    .app-btns .ant-btn {
      margin-right: 16px;
    }

    .app-content {
      flex: 1;
      margin-right: 8px;
      margin-left: 8px;
    }
  }

  .x6-graph-scroller {
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
### docs/demos/tutorial/plugins/scroller/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  pannable: boolean
  pageVisible: boolean
  pageBreak: boolean
  autoResize: boolean
  minVisibleWidth: number
  minVisibleHeight: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    pannable: true,
    pageVisible: true,
    pageBreak: true,
    autoResize: true,
    minVisibleWidth: 50,
    minVisibleHeight: 50,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPanningChanged = (e: any) => {
    this.setState({ pannable: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onAutoResizeChanged = (e: any) => {
    this.setState({ autoResize: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageVisibleChanged = (e: any) => {
    this.setState({ pageVisible: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageBreakChanged = (e: any) => {
    this.setState({ pageBreak: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleWidthChanged = (minVisibleWidth: number) => {
    this.setState({ minVisibleWidth }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleHeightChanged = (minVisibleHeight: number) => {
    this.setState({ minVisibleHeight }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Scroller Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pannable}
              onChange={this.onPanningChanged}
            >
              Enable Panning
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.autoResize}
              onChange={this.onAutoResizeChanged}
            >
              Enable Auto Resize
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageVisible}
              onChange={this.onPageVisibleChanged}
            >
              Show Page
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageBreak}
              onChange={this.onPageBreakChanged}
            >
              Show Page Break
            </Checkbox>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Width
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleWidth}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleWidth}
              onChange={this.onMinVisibleWidthChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Height
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleHeight}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleHeight}
              onChange={this.onMinVisibleHeightChanged}
            />
          </Col>
        </Row>
      </Card>
    )
  }
}
```
