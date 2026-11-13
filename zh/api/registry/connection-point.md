---
title: "连接点"
description: "连接点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/connection-point/"
version: "3.x"
---

[资料索引](/llms.txt)

连接点 ConnectionPoint 与锚点 [Anchor](/zh/api/registry/node-anchor) 共同确定了边的起点或终点。

- 起点：从第一个路径点或目标节点的中心（没有路径点时）画一条参考线到源节点的锚点，然后根据 `connectionPoint` 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的起点。
- 终点：从最后一个路径点或源节点的中心（没有路径点时）画一条参考线到目标节点的锚点，然后根据 `connectionPoint` 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的终点。

X6 内置了以下几种连接点计算方法。

- [boundary](#boundary) 默认值，与链接图形的边框的交点。
- [bbox](#bbox) 与链接元素的包围盒的交点。
- [rect](#rect) 与链接元素的旋转后的矩形区域的交点。
- [anchor](#anchor) 使用锚点作为连接点。



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



可以在创建边时指定连接点：

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
    connectionPoint: 'boundary', // 没有参数时可以简化写法
  },
})
```

创建之后可以调用 `edge.setSource` 和 `edge.setTarget` 方法来修改连接点：

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

在创建画布时，可以通过 `connecting` 选项来设置全局默认的连接点：

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

没有参数时可以简化为：

```ts
new Graph({
  connecting: {
    connectionPoint: 'boundary',
  },
})
```

## 内置连接点

### boundary

自动识别链接图形的边框，并计算参照点与锚点（Anchor）形成的直线与边框的交点。如 `<ellipse>` 元素将被识别为椭圆，并求椭圆与直线的交点，求得的交点为边的连接点。不能识别的元素（`text`、`<path>` 等）使用图形的包围盒代替，这与使用 `'bbox'` 求得的连接点一样。

支持的参数如下表：

| 参数名      | 参数类型                  | 是否必选 | 默认值      | 参数说明                                                                                                               |
|-------------|---------------------------|:-------:|-------------|--------------------------------------------------------------------------------------------------------------------|
| offset      | number \| Point.PointLike |    否    | `0`         | 连接点的偏移量。                                                                                                        |
| stroked     | boolean                   |    否    | `true`      | 是否考虑图形的边框宽度。                                                                                                |
| insideout   | boolean                   |    否    | `true`      | 当参考线位于图形内部且没有交点时，是否延长参考线求交点，默认为 `true`。                                                   |
| extrapolate | boolean                   |    否    | `false`     | 当参考线位于图形外部且没有交点时，是否延长参考线求交点，延长后也可能没有交点，默认为 `false`。此参数的优先级高于 `sticky`。 |
| sticky      | boolean                   |    否    | `false`     | 当参考线位于图形外部且没有交点时，是否使用边框上离参考线最最近的点作为交点，默认为 `false`。                              |
| precision   | number                    |    否    | `2`         | 交点计算的精度。                                                                                                        |
| selector    | string                    |    否    | `undefined` | 选择器，用于标识一个元素，使用该元素的边框来计算交点。默认使用节点中第一个不在 `<g>` 元素内的子元素。                      |

### anchor

将锚点作为连接点，支持如下参数：

| 参数名 | 参数类型                  | 是否必选 | 默认值 | 参数说明        |
|--------|---------------------------|:-------:|--------|-------------|
| offset | number \| Point.PointLike |    否    | `0`    | 连接点的偏移量。 |

### bbox

图形的包围盒与参考线的交点，支持如下参数：

| 参数名  | 参数类型                  | 是否必选 | 默认值  | 参数说明                |
|---------|---------------------------|:-------:|---------|---------------------|
| offset  | number \| Point.PointLike |    否    | `0`     | 连接点的偏移量。         |
| stroked | boolean                   |    否    | `false` | 是否考虑图形的边框宽度。 |

### rect

图形旋转后的矩形区域与参考线的交点，支持如下参数：

| 参数名  | 参数类型                  | 是否必选 | 默认值  | 参数说明                |
|---------|---------------------------|:-------:|---------|---------------------|
| offset  | number \| Point.PointLike |    否    | `0`     | 连接点的偏移量。         |
| stroked | boolean                   |    否    | `false` | 是否考虑图形的边框宽度。 |

## 自定义连接点

连接点定义是一个具有如下签名的函数，返回连接点。

```ts
export type Definition<T> = (
  line: Line,
  view: NodeView,
  magnet: SVGElement,
  args: T,
) => Point
```

| 参数名   | 参数类型   | 参数说明            |
|----------|------------|-------------------|
| line     | Line       | 参考线。             |
| nodeView | NodeView   | 连接的节点视图。     |
| magnet   | SVGElement | 连接的节点上的元素。 |
| args     | T          | 参数。               |

完成连接点定义后，我们先注册连接点：

```ts
Graph.registerConnectionPoint('custom-connection-point', ...)
```

注册以后我们就可以通过连接点名称来使用：

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
