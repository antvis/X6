---
title: "节点的锚点"
description: "节点的锚点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/node-anchor/"
version: "3.x"
---

[资料索引](/llms.txt)

当连接到节点时，可以通过 `NodeAnchor` 来指定被连接的节点的锚点，锚点与连接点 [ConnectionPoint](/zh/api/registry/connection-point) 共同确定了边的起点和终点。

- 起点：从第一个路径点或目标节点的中心（没有路径点时）画一条参考线到源节点的锚点，然后根据 [connectionPoint](/zh/api/registry/connection-point) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的起点。
- 终点：从最后一个路径点或源节点的中心（没有路径点时）画一条参考线到目标节点的锚点，然后根据 [connectionPoint](/zh/api/registry/connection-point) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的终点。

X6 内置了以下几种锚点定义。

- [center](#center) 边链接的元素的中心点（默认值）。
- [top](#top) 边链接的元素的顶部中心点。
- [bottom](#bottom) 边链接的元素的底部中心点。
- [left](#left) 边链接的元素的左侧中心点。
- [right](#right) 边链接的元素的右侧中心点。
- [midSide](#midside) 边链接的元素的最近侧中心点。
- [topLeft](#topleft) 边链接的元素的左上角。
- [topRight](#topright) 边链接的元素的右上角。
- [bottomLeft](#bottomleft) 边链接的元素的左下角。
- [bottomRight](#bottomright) 边链接的元素的右下角。
- [orth](#orth) 正交点。
- [nodeCenter](#nodecenter) 节点的中心点。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
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

    const rect1 = graph.addNode({
      x: 160,
      y: 80,
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

    const rect2 = graph.addNode({
      x: 460,
      y: 80,
      width: 100,
      height: 40,
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'rect', selector: 'port' },
      ],
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
        port: {
          x: 10,
          y: 10,
          width: 30,
          height: 10,
          strokeWidth: 1,
          stroke: '#fe8550',
        },
      },
    })

    const edge1 = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect1.id },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 100 },
      target: { cell: rect2, selector: 'port' },
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
            iterations: Infinity,
          },
        )
      }

      const steps = 60
      animateEdge(edge1, { x: 210, y: 100 }, 140, steps)
      animateEdge(edge2, { x: 485, y: 95 }, 120, steps)
    }

    animate()

    edge1.on('animation:finish', animate)

    this.edge1 = edge1
    this.edge2 = edge2
  }

  onAttrsChanged = ({ type }: State) => {
    this.edge1.prop('target/anchor', { name: type })
    this.edge2.prop('target/anchor', { name: type })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="node-anchor-app">
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



可以在创建边时指定锚点：

```ts
const edge = graph.addEdge({
  source: {
    cell: 'source-id',
    anchor: {
      name: 'midSide',
      args: {
        dx: 10,
      },
    },
  },
  target: {
    cell: 'target-id',
    anchor: 'orth', // 没有参数时可以简化写法
  },
})
```

创建之后可以调用 `edge.setSource` 和 `edge.setTarget` 方法来修改锚点：

```ts
edge.setSource({
  cell: 'source-id',
  anchor: {
    name: 'midSide',
    args: {
      dx: 10,
    },
  },
})
```

在创建画布时，可以通过 `connecting` 选项来设置全局默认的锚点：

```ts
new Graph({
  connecting: {
    anchor: {
      name: 'midSide',
      args: {
        dx: 10,
      },
    },
  },
})
```

没有参数时可以简化为：

```ts
new Graph({
  connecting: {
    anchor: 'midSide',
  },
})
```

## 内置锚点

### center

元素中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### top

元素顶部中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### bottom

元素底部中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### left

元素左侧中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### right

元素右侧中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### midSide

最靠近边的那一侧中心点，支持如下参数：

| 参数名    | 参数类型   | 是否必选 | 默认值  | 参数说明                                                                                 |
|-----------|------------|:-------:|---------|--------------------------------------------------------------------------------------|
| padding   | number     |    否    | `0`     | 通过放大元素的包围盒 `padding` 像素，来偏移中心点。                                        |
| rotate    | boolean    |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。                                   |
| direction | 'H' \| 'V' |    否    | -       | 连接点的方向，比如如果设置为 `H`，只能连接到节点的左侧或者右侧的中心点，会根据位置自动判断。 |

### topLeft

元素左上角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### topRight

元素右上角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### bottomLeft

元素左下角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### bottomRight

元素右下角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### orth

正交点，支持如下参数：

| 参数名  | 参数类型 | 是否必选 | 默认值 | 参数说明    |
|---------|----------|:-------:|--------|---------|
| padding | number   |    否    | `0`    | X 轴偏移量。 |

### nodeCenter

节点的中心，支持如下参数：

| 参数名 | 参数类型 | 是否必选 | 默认值 | 参数说明    |
|--------|----------|:-------:|--------|---------|
| dx     | number   |    否    | `0`    | X 轴偏移量。 |
| dy     | number   |    否    | `0`    | Y 轴偏移量。 |

## 自定义锚点

锚点定义是一个具有如下签名的函数，返回锚点。

```ts
export type Definition<T> = (
  this: EdgeView,
  nodeView: NodeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
  type: Edge.TerminalType,
) => Point
```

| 参数名   | 参数类型                      | 参数说明            |
|----------|-------------------------------|-------------------|
| this     | EdgeView                      | 边的视图。           |
| nodeView | NodeView                      | 连接的节点视图。     |
| magnet   | SVGElement                    | 连接的节点上的元素。 |
| ref      | Point.PointLike \| SVGElement | 参照点/元素。        |
| args     | T                             | 参数。               |
| type     | Edge.TerminalType             | 边的终端类型。       |

完成锚点定义后，我们先注册锚点：

```ts
Graph.registerAnchor('custom-anchor', ...)
```

注册以后我们就可以通过锚点名称来使用：

```ts
new Graph({
  connecting: {
    anchor: {
      name: 'custom-anchor',
    },
  },
})
```
### docs/demos/api/node-anchor/playground/index.less

```less
.node-anchor-app {
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
### docs/demos/api/node-anchor/playground/settings.tsx

```tsx
import React from 'react'
import { Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'center',
  }

  notifyChange() {
    this.props.onChange(this.state)
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
      </Card>
    )
  }
}
```
