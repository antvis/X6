---
title: "边的锚点"
description: "边的锚点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/edge-anchor/"
version: "3.x"
---

[资料索引](/llms.txt)

当边连接到边时，可以通过 EdgeAnchor 来指定被连接的边上的锚点，锚点与连接点 [ConnectionPoint](/zh/api/registry/connection-point) 共同确定了边的起点和终点。

- 起点：从第一个路径点或目标节点的中心（没有路径点时）画一条参考线到源节点的锚点，然后根据 [connectionPoint](/zh/api/registry/connection-point) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的起点。
- 终点：从最后一个路径点或源节点的中心（没有路径点时）画一条参考线到目标节点的锚点，然后根据 [connectionPoint](/zh/api/registry/connection-point) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的终点。

X6 内置了以下几种锚点定义。

- [ratio](#ratio) 默认值，锚点位于被连接的边的指定比例处。
- [length](#length) 锚点位于被连接的边的指定长度处。
- [closest](#closest) 使用距离参照点最近的点作为锚点。
- [orth](#orth) 正交锚点。



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
      interacting: false,
    })

    const rect = graph.addEdge({
      source: { x: 40, y: 80 },
      target: { x: 360, y: 80 },
      vertices: [
        { x: 120, y: 120 },
        { x: 200, y: 40 },
        { x: 280, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    const edge = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect.id },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      const origin = { x: 200, y: 100 }
      const radius = 140
      const steps = 60
      const p = edge.getSourcePoint()
      const start = Math.atan2(p.y - origin.y, p.x - origin.x)
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = start + (2 * Math.PI * i) / steps
        xs.push(origin.x + radius * Math.cos(theta))
        ys.push(origin.y + radius * Math.sin(theta))
      }
      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          duration: 5000,
          easing: 'linear',
          fill: 'forwards',
        },
      )
    }

    animate()

    edge.on('animation:finish', animate)

    this.edge = edge
  }

  onAttrsChanged = ({ type, value }: State) => {
    const anchor =
      type === 'ratio' || type === 'length'
        ? {
            name: type,
            args: {
              [type]: value,
            },
          }
        : { name: type }
    this.edge.prop('target/anchor', anchor)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-anchor-app">
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



## 内置锚点

### ratio

锚点位于被连接的边的指定比例处。支持如下参数：

| 参数名 | 参数类型 | 是否必选 | 默认值 | 参数说明                                       |
|--------|----------|:-------:|--------|--------------------------------------------|
| ratio  | number   |    否    | `0.5`  | 距离边起点多少比例位置处，默认位于边长度的中心。 |

### length

锚点位于被连接的边的指定长度处。支持如下参数：

| 参数名 | 参数类型 | 是否必选 | 默认值 | 参数说明                                               |
|--------|----------|:-------:|--------|----------------------------------------------------|
| length | number   |    否    | `20`   | 距离边的起点多少长度位置处，默认位于偏离起点 `20px` 处。 |

### closest

距离参照点最近的点作为锚点。

### orth

正交锚点。支持如下参数：

| 参数名     | 参数类型         | 是否必选 | 默认值      | 参数说明                                                                                                                                                                                     |
|------------|------------------|:-------:|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fallbackAt | number \| string |    否    | `undefined` | 当没有正交点时，使用 `fallbackAt` 指定的点作为锚点。<br />当 `fallbackAt` 为百分比字符串时，表示锚点位于距离起点多少比例位置处。 <br /> 当 `fallbackAt` 为数字时，表示锚点位于距离起点多少长度位置处。 |

## 自定义锚点

边的锚点定义是一个具有如下签名的函数，返回锚点。

```ts
export type Definition<T> = (
  this: EdgeView,
  view: EdgeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
) => Point
```

| 参数名 | 参数类型                      | 参数说明        |
|--------|-------------------------------|---------------|
| this   | EdgeView                      | 边的视图。       |
| view   | EdgeView                      | 连接的边的视图。 |
| magnet | SVGElement                    | 连接的边的元素。 |
| ref    | Point.PointLike \| SVGElement | 参照点/元素。    |
| args   | T                             | 参数。           |

完成锚点定义后，我们先注册锚点：

```ts
Graph.registerEdgeAnchor('custom-anchor', ...)
```

注册以后我们就可以通过锚点名称来使用：

```ts
new Graph({
  connecting: {
    edgeAnchor: {
      name: 'custom-anchor',
    },
  },
})
```
### docs/demos/api/edge-anchor/playground/index.less

```less
.edge-anchor-app {
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
### docs/demos/api/edge-anchor/playground/settings.tsx

```tsx
import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
  value: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'ratio',
    value: 50,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (value: number) => {
    this.setState({ value }, () => {
      this.notifyChange()
    })
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="ratio">ratio</Radio>
              <Radio value="length">length</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="closest">closest</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {(this.state.type === 'ratio' || this.state.type === 'length') && (
          <Row align="middle">
            <Col span={5}>
              {this.state.type === 'ratio' ? 'ratio' : 'length'}
            </Col>
            <Col span={14}>
              <Slider
                min={0}
                max={100}
                step={1}
                value={this.state.value}
                onChange={this.onAngleChanged}
              />
            </Col>
            <Col span={1} offset={1}>
              <div className="slider-value">
                {this.state.value}
                {this.state.type === 'ratio' ? '%' : ''}
              </div>
            </Col>
          </Row>
        )}
      </Card>
    )
  }
}
```
