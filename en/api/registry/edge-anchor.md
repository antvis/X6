---
title: "Edge Anchor"
description: "Edge Anchor"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/edge-anchor/"
version: "3.x"
---

[Resource index](/llms.txt)

When an edge connects to another edge, you can use EdgeAnchor to specify the anchor point on the connected edge. The anchor point, along with the connection point [ConnectionPoint](/en/api/registry/connection-point), determines the starting and ending points of the edge.

-  Starting point: Draw a reference line from the first path point or the center of the target node (if there are no path points) to the anchor point of the source node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/en/api/registry/connection-point). This intersection point is the starting point of the edge.
-  Ending point: Draw a reference line from the last path point or the center of the source node (if there are no path points) to the anchor point of the target node, and then calculate the intersection point of the reference line and the graph according to the intersection calculation method specified by [connectionPoint](/en/api/registry/connection-point). This intersection point is the ending point of the edge.

X6 provides the following built-in anchor point definitions:

-  [ratio](#ratio) The default value, where the anchor point is located at a specified proportion of the connected edge.
-  [length](#length) The anchor point is located at a specified length from the connected edge.
-  [closest](#closest) Uses the point closest to the reference point as the anchor point.
-  [orth](#orth) Orthogonal anchor point.



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



## Built-in Anchor Points

### ratio

The anchor point is located at a specified proportion of the connected edge. Supports the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description |
|---------------|----------------|---------|--------------|-----------------------|
| ratio        | number         |   No    | `0.5`        | The proportion of the edge length from the starting point, defaulting to the center of the edge length. |

### length

The anchor point is located at a specified length from the connected edge. Supports the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description |
|---------------|----------------|---------|--------------|-----------------------|
| length        | number         |   No    | `20`         | The length from the starting point of the edge, defaulting to 20px from the starting point. |

### closest

Uses the point closest to the reference point as the anchor point.

### orth

Orthogonal anchor point. Supports the following parameters:

| Parameter Name | Parameter Type | Required | Default Value | Parameter Description |
|---------------|----------------|---------|--------------|-----------------------|
| fallbackAt    | number \| string |   No    | `undefined`  | When there is no orthogonal point, use the point specified by `fallbackAt` as the anchor point.<br />When `fallbackAt` is a percentage string, it represents the proportion of the edge length from the starting point.<br />When `fallbackAt` is a number, it represents the length from the starting point of the edge. |

## Custom Anchor Points

The edge anchor point definition is a function with the following signature, which returns the anchor point.

```ts
export type Definition<T> = (
  this: EdgeView,
  view: EdgeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
) => Point
```

| Parameter Name | Parameter Type                      | Parameter Description |
|---------------|---------------------------------------|-----------------------|
| this          | EdgeView                              | The view of the edge.    |
| view          | EdgeView                              | The view of the connected edge. |
| magnet        | SVGElement                            | The element of the connected edge. |
| ref          | Point.PointLike \| SVGElement          | The reference point/element. |
| args          | T                                      | The arguments.          |

After completing the anchor point definition, we register the anchor point:

```ts
Graph.registerEdgeAnchor('custom-anchor', ...)
```

After registration, we can use the anchor point by name:

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
