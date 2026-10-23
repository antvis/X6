---
title: "网格"
description: "网格"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/graph/grid/"
version: "3.x"
---

[资料索引](/llms.txt)

网格是渲染/移动节点的最小单位。网格默认大小为 `10px`，渲染节点时表示以 `10` 为最小单位对齐到网格，如位置为 `{ x: 24, y: 38 }`的节点渲染到画布后的实际位置为 `{ x: 20, y: 40 }`， 移动节点时表示每次移动最小距离为 `10px`。

## 演示



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



## 配置

### size

创建画布时，通过下面配置来设置网格大小。

```ts
const graph = new Graph({
  grid: 10,
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10,
  },
})
```

### type

网格默认不可见，创建画布时，通过下面配置来启用网格绘制。

```ts
const graph = new Graph({
  grid: true, // 网格大小 10px，并绘制网格
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10, // 网格大小 10px
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
})
```

同时，我们内置了以下四种网格类型，通过 `type` 选项来指定网格类型，默认值为 `dot`，并支持通过 `args` 选项来配置网格样式。

#### dot (默认值)

点状网格。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'dot',
    args: {
      color: '#a0a0a0', // 网点颜色
      thickness: 1, // 网点大小
    },
  },
})
```

#### fixedDot

固定网点大小的点状网格。当画布的缩放比例小于 `1` 时，网点大小随着画布缩放比例缩放，当画布缩放比例大于 `1` 时，网点大小为给定的 `thickness` 的值。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    size: 10,
    type: 'fixedDot',
    args: {
      color: '#a0a0a0', // 网点颜色
      thickness: 2, // 网点大小
    },
  },
})

graph.scale(10, 10)
```

#### mesh

网状网格。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'mesh',
    args: {
      color: '#ddd', // 网格线颜色
      thickness: 1, // 网格线宽度
    },
  },
})
```

#### doubleMesh

双线网状网格。

```ts
const graph = new Graph({
  grid: {
    size: 10,
    visible: true,
    type: 'doubleMesh',
    args: [
      {
        color: '#eee', // 主网格线颜色
        thickness: 1, // 主网格线宽度
      },
      {
        color: '#ddd', // 次网格线颜色
        thickness: 1, // 次网格线宽度
        factor: 4, // 主次网格线间隔
      },
    ],
  },
})
```

## 方法

### getGridSize()

```ts
getGridSize(): number
```

获取网格大小。

### setGridSize()

```ts
setGridSize(gridSize: number): this
```

设置网格大小。

### showGrid()

```ts
showGrid(): this
```

显示网格。

### hideGrid()

```ts
hideGrid(): this
```

隐藏网格。

### clearGrid()

```ts
clearGrid(): this
```

清除网格。

### drawGrid(...)

```ts
drawGrid(options?: DrawGridOptions): this
```

重绘网格。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| type | string |  | `dot` | 网格类型。详情请[参考这里](/zh/api/graph/grid)。 |
| args | object |  | - | 与网格类型对应的网格参数。 |

## 自定义网格

这里以注册一个红色点状网格为例：

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
