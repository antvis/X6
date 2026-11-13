---
title: "Connection Point"
description: "Connection Point"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/connection-point/"
version: "3.x"
---

[Resource index](/llms.txt)

The Connection Point and Anchor jointly determine the starting or ending point of an edge.

-  Starting point: Draw a reference line from the center of the first path point or target node (if there is no path point) to the anchor point of the source node, and calculate the intersection point of the reference line and the shape according to the specified connection point calculation method. This intersection point is the starting point of the edge.
-  Ending point: Draw a reference line from the center of the last path point or source node (if there is no path point) to the anchor point of the target node, and calculate the intersection point of the reference line and the shape according to the specified connection point calculation method. This intersection point is the ending point of the edge.

X6 provides the following built-in connection point calculation methods.

-  [boundary](#boundary) Default value, intersection with the boundary of the linked shape.
-  [bbox](#bbox) Intersection with the bounding box of the linked element.
-  [rect](#rect) Intersection with the rotated rectangular region of the linked element.
-  [anchor](#anchor) Use the anchor point as the connection point.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Edge, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private ellipse: Node
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const rect = graph.addNode({
      x: 160,
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

    const ellipse = graph.addNode({
      shape: 'ellipse',
      x: 460,
      y: 160,
      width: 100,
      height: 40,
      angle: 45,
      markup: [
        { tagName: 'ellipse', selector: 'body' },
        { tagName: 'rect', selector: 'outline' },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        outline: {
          refWidth: '100%',
          refHeight: '100%',
          strokeWidth: 1,
          strokeDasharray: '5 5',
          stroke: '#8f8f8f',
          fill: 'none',
        },
      },
    })

    let bbox: Node
    const updateBBox = () => {
      if (bbox) {
        bbox.remove()
      }
      const rect = ellipse.findView(graph)!.getBBox()
      bbox = graph.addNode({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        attrs: {
          body: {
            strokeWidth: 1,
            strokeDasharray: '5 5',
            stroke: '#8f8f8f',
            fill: 'none',
          },
        },
      })
    }

    ellipse.on('change:angle', updateBBox)

    updateBBox()

    const edge1 = graph.addEdge({
      source: { x: 100, y: 180 },
      target: { cell: rect.id },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 180 },
      target: { cell: ellipse.id },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      const animateEdge = (
        edge: Edge,
        origin: { x: number; y: number },
        radius: number,
        steps: number,
      ) => {
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

      const steps = 60
      animateEdge(edge1, { x: 210, y: 180 }, 120, steps)
      animateEdge(edge2, { x: 485, y: 180 }, 120, steps)
    }

    animate()

    edge1.on('animation:finish', animate)

    this.edge1 = edge1
    this.edge2 = edge2
    this.ellipse = ellipse
  }

  updateBBox() {}

  onAttrsChanged = ({ anchor, connectionPoint, angle }: State) => {
    this.edge1.prop('target/anchor', { name: anchor })
    this.edge1.prop('target/connectionPoint', { name: connectionPoint })
    this.edge2.prop('target/anchonr', { name: anchor })
    this.edge2.prop('target/connectionPoint', { name: connectionPoint })
    this.ellipse.rotate(angle, { absolute: true })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connection-point-app">
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



You can specify the connection point when creating an edge:

```ts
const edge = graph.addEdge({
  source: {
    cell: 'source-id',
    connectionPoint: {
      name: 'boundary',
      args: {
        sticky: true,
      },
    },
  },
  target: {
    cell: 'target-id',
    connectionPoint: 'boundary', // Simplified writing when there are no parameters
  },
})
```

After creation, you can modify the connection point by calling the `edge.setSource` and `edge.setTarget` methods:

```ts
edge.setSource({
  cell: 'source-id',
  connectionPoint: {
    name: 'boundary',
    args: {
      sticky: true,
    },
  },
})
```

When creating a canvas, you can set the global default connection point through the `connecting` option:

```ts
new Graph({
  connecting: {
    connectionPoint: {
      name: 'boundary',
      args: {
        sticky: true,
      },
    },
  },
})
```

Simplified writing when there are no parameters:

```ts
new Graph({
  connecting: {
    connectionPoint: 'boundary',
  },
})
```

## Built-in Connection Points

### boundary

Automatically recognize the boundary of the linked shape and calculate the intersection point of the reference line and the anchor point (Anchor). For example, an `<ellipse>` element will be recognized as an ellipse, and the intersection point of the ellipse and the reference line will be calculated. Elements that cannot be recognized (such as `text` or `<path>`) will use the bounding box of the shape as the connection point, which is the same as using `'bbox'`.

Supported parameters are as follows:

| Parameter Name      | Parameter Type                  | Required | Default Value      | Parameter Description                                                                                                               |
|--------------------|---------------------------|:-------:|-------------|--------------------------------------------------------------------------------------------------------------------|
| offset      | number \| Point.PointLike |    No    | `0`         | Offset of the connection point.                                                                                                        |
| stroked     | boolean                   |    No    | `true`      | Whether to consider the stroke width of the shape.                                                                                                |
| insideout   | boolean                   |    No    | `true`      | When the reference line is inside the shape and there is no intersection point, whether to extend the reference line to calculate the intersection point, default is `true`. |
| extrapolate | boolean                   |    No    | `false`     | When the reference line is outside the shape and there is no intersection point, whether to extend the reference line to calculate the intersection point, default is `false`. This parameter has higher priority than `sticky`. |
| sticky      | boolean                   |    No    | `false`     | When the reference line is outside the shape and there is no intersection point, whether to use the point on the boundary closest to the reference line as the connection point, default is `false`. |
| precision   | number                    |    No    | `2`         | Precision of intersection point calculation.                                                                                                        |
| selector    | string                    |    No    | `undefined` | Selector, used to identify an element, and use the boundary of the element to calculate the intersection point. Default uses the first child element that is not in the `<g>` element in the node. |

### anchor

Use the anchor point as the connection point, supporting the following parameters:

| Parameter Name | Parameter Type                  | Required | Default Value | Parameter Description        |
|---------------|---------------------------|:-------:|--------|-------------|
| offset | number \| Point.PointLike |    No    | `0`    | Offset of the connection point. |

### bbox

Intersection point of the bounding box of the linked element and the reference line, supporting the following parameters:

| Parameter Name  | Parameter Type                  | Required | Default Value  | Parameter Description                |
|---------------|---------------------------|:-------:|---------|---------------------|
| offset  | number \| Point.PointLike |    No    | `0`     | Offset of the connection point.         |
| stroked | boolean                   |    No    | `false` | Whether to consider the stroke width of the shape. |

### rect

Intersection point of the rotated rectangular region of the linked element and the reference line, supporting the following parameters:

| Parameter Name  | Parameter Type                  | Required | Default Value  | Parameter Description                |
|---------------|---------------------------|:-------:|---------|---------------------|
| offset  | number \| Point.PointLike |    No    | `0`     | Offset of the connection point.         |
| stroked | boolean                   |    No    | `false` | Whether to consider the stroke width of the shape. |

## Custom Connection Points

A connection point definition is a function with the following signature, returning the connection point.

```ts
export type Definition<T> = (
  line: Line,
  view: NodeView,
  magnet: SVGElement,
  args: T,
) => Point
```

| Parameter Name   | Parameter Type   | Parameter Description            |
|----------------|-----------------|---------------------------------|
| line     | Line       | Reference line.             |
| nodeView | NodeView   | View of the connected node.     |
| magnet   | SVGElement | Element on the connected node. |
| args     | T          | Parameters.               |

After completing the connection point definition, we register the connection point:

```ts
Graph.registerConnectionPoint('custom-connection-point', ...)
```

After registration, we can use the connection point by name:

```ts
new Graph({
  connecting: {
    connectionPoint: 'custom-connection-point'
  },
})
```
### docs/demos/api/connection-point/playground/index.less

```less
.connection-point-app {
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
### docs/demos/api/connection-point/playground/settings.tsx

```tsx
import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  anchor: string
  connectionPoint: string
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    anchor: 'center',
    connectionPoint: 'boundary',
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  onAnchorChange = (e: any) => {
    this.setState({ anchor: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onConnectionPointChange = (e: any) => {
    this.setState({ connectionPoint: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={5}>anchor</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onAnchorChange}
              value={this.state.anchor}
            >
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>connectionPoint</Col>
        </Row>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group
              onChange={this.onConnectionPointChange}
              value={this.state.connectionPoint}
            >
              <Radio value="boundary">boundary</Radio>
              <Radio value="anchor">anchor</Radio>
              <Radio value="bbox">bbox</Radio>
              <Radio value="rect">rect</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>angle</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.angle}°</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
