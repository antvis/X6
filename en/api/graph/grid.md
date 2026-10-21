---
title: "Grid"
description: "Grid"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/graph/grid/"
version: "3.x"
---

[Resource index](/llms.txt)

The grid is the smallest unit of rendering/moving nodes. The default grid size is `10px`. When rendering nodes, it means aligning to the grid with `10` as the minimum unit, such as a node with a position of `{ x: 24, y: 38 }` will be rendered at `{ x: 20, y: 40 }` on the canvas. When moving nodes, it means the minimum distance of each move is `10px`.

## Demo



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { Settings } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
      background: {
        color: '#F2F7FA',
      },
      mousewheel: {
        enabled: true,
        minScale: 0.2,
        maxScale: 4,
      },
    })

    const source = this.graph.addNode({
      x: 40,
      y: 40,
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
      x: 200,
      y: 180,
      width: 100,
      height: 40,
      label: 'Grid',
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

  onGridChanged = (options: any) => {
    this.graph.drawGrid(options)
  }

  onGridSizeChanged = (size: number) => {
    this.graph.setGridSize(size)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="grid-app">
        <div className="app-side">
          <Settings
            onChange={this.onGridChanged}
            onGridSizeChange={this.onGridSizeChanged}
          />
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

### size

You can set the grid size when creating the canvas through the following configuration.

```ts
const graph = new Graph({
  grid: 10,
})

// Equivalent to
const graph = new Graph({
  grid: {
    size: 10,
  },
})
```

### type

The grid is invisible by default. You can enable grid drawing when creating the canvas through the following configuration.

```ts
const graph = new Graph({
  grid: true, // Grid size is 10px and draw the grid
})

// Equivalent to
const graph = new Graph({
  grid: {
    size: 10, // Grid size is 10px
    visible: true, // Draw the grid, default is dot type
  },
})
```

We have four built-in grid types, which can be specified through the `type` option, with a default value of `dot`. You can also configure the grid style through the `args` option.

#### dot (default)

Dot grid.

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'dot',
    args: {
      color: '#a0a0a0', // Grid point color
      thickness: 1, // Grid point size
    },
  },
})
```

#### fixedDot

Fixed dot grid with a fixed point size. When the canvas zoom ratio is less than `1`, the grid point size scales with the canvas zoom ratio. When the canvas zoom ratio is greater than `1`, the grid point size is the given `thickness` value.

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    size: 10,
    type: 'fixedDot',
    args: {
      color: '#a0a0a0', // Grid point color
      thickness: 2, // Grid point size
    },
  },
})

graph.scale(10, 10)
```

#### mesh

Mesh grid.

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'mesh',
    args: {
      color: '#ddd', // Grid line color
      thickness: 1, // Grid line width
    },
  },
})
```

#### doubleMesh

Double mesh grid.

```ts
const graph = new Graph({
  grid: {
    size: 10,
    visible: true,
    type: 'doubleMesh',
    args: [
      {
        color: '#eee', // Main grid line color
        thickness: 1, // Main grid line width
      },
      {
        color: '#ddd', // Secondary grid line color
        thickness: 1, // Secondary grid line width
        factor: 4, // Main and secondary grid line interval
      },
    ],
  },
})
```

## Methods

### getGridSize()

```ts
getGridSize(): number
```

Get the grid size.

### setGridSize()

```ts
setGridSize(gridSize: number): this
```

Set the grid size.

### showGrid()

```ts
showGrid(): this
```

Show the grid.

### hideGrid()

```ts
hideGrid(): this
```

Hide the grid.

### clearGrid()

```ts
clearGrid(): this
```

Clear the grid.

### drawGrid(...)

```ts
drawGrid(options?: DrawGridOptions): this
```

Redraw the grid.

| Name | Type | Required | Default | Description |
| --- | --- | :-: | --- | --- |
| type | string |  | `dot` | Grid type. For details, please refer to [here](/en/api/graph/grid). |
| args | object |  | - | Grid parameters corresponding to the grid type. |

## Custom Grid

Here's an example of registering a red dot grid:

```ts
Graph.registerGrid('red-dot', {
  color: 'red',
  thickness: 1,
  markup: 'rect',
  update(elem, options) {
    const width = options.thickness * options.sx
    const height = options.thickness * options.sy
    Dom.attr(elem, {
      width,
      height,
      rx: width,
      ry: height,
      fill: options.color,
    })
  },
})

const graph = new Graph({
  grid: {
    type: 'red-dot',
  },
})
```
### docs/demos/api/grid/playground/index.less

```less
.grid-app {
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
### docs/demos/api/grid/playground/settings.tsx

```tsx
import React from 'react'
import { Input, Select, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onGridSizeChange: (size: number) => void
  onChange: (res: any) => void
}

export interface State {
  type: string
  size: number
  color: string
  thickness: number
  colorSecond: string
  thicknessSecond: number
  factor: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'dot',
    size: 10,
    color: '#aaaaaa',
    thickness: 1,
    colorSecond: '#888888',
    thicknessSecond: 3,
    factor: 4,
  }

  notifyChange() {
    if (this.state.type === 'doubleMesh') {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
          {
            color: this.state.colorSecond,
            thickness: this.state.thicknessSecond,
            factor: this.state.factor,
          },
        ],
      })
    } else {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
        ],
      })
    }
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.props.onGridSizeChange(this.state.size)
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onSecondaryColorChanged = (e: any) => {
    this.setState({ colorSecond: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onThicknessChanged = (thickness: number) => {
    this.setState({ thickness }, () => {
      this.notifyChange()
    })
  }

  onSecondaryThicknessChanged = (thicknessSecond: number) => {
    this.setState({ thicknessSecond }, () => {
      this.notifyChange()
    })
  }

  onFactorChanged = (factor: number) => {
    this.setState({ factor }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Grid Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={8}>Grid Type</Col>
          <Col span={13}>
            <Select
              style={{ width: '100%' }}
              value={this.state.type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="dot">Dot</Select.Option>
              <Select.Option value="fixedDot">Fixed Dot</Select.Option>
              <Select.Option value="mesh">Mesh</Select.Option>
              <Select.Option value="doubleMesh">Double Mesh</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Grid Size</Col>
          <Col span={13}>
            <Slider
              min={1}
              max={20}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        {this.state.type === 'doubleMesh' ? (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Primary Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Primary Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Secondary Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.colorSecond}
                  style={{ width: '100%' }}
                  onChange={this.onSecondaryColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Secondary Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thicknessSecond}
                  onChange={this.onSecondaryThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thicknessSecond.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Scale Factor</Col>
              <Col span={13}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={this.state.factor}
                  onChange={this.onFactorChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">{this.state.factor}</div>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Grid Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Card>
    )
  }
}
```
