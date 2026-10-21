---
title: "连接桩标签布局"
description: "连接桩标签布局"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/port-label-layout/"
version: "3.x"
---

[资料索引](/llms.txt)

连接桩标签布局算法是一个具有如下签名的函数，返回标签相对于连接桩的位置和旋转角度。

```ts
type Definition<T> = (
  portPosition: Point, // 连接桩的位置
  elemBBox: Rectangle, // 节点的包围盒
  args: T, // 标签位置参数
) => Result

interface Result {
  position: Point.PointLike // 标签相对于位置
  angle: number // 标签的旋转角度
  attrs: Attr.CellAttrs // 标签的属性
}
```

创建连接桩时，可以在群组 `groups` 中指定该组的标签定位，也可以在 `items` 中覆盖群组中的定义：

```ts
graph.addNode(
  ...,
  ports: {
    // 连接桩分组
    groups: {
      group1: {
        label: {
          position: {      // 标签布局算法
            name: 'xxx',   // 标签布局算法名称
            args: { ... }, // 标签布局算法参数
          },
        },
      },
    },

    // 连接桩定义
    items: [
      {
        groups: 'group1',
        label: {
          position: { // 覆盖 group1 中指定的标签定位算法
            name: 'xxx',
            args: { ... },
          }
        },
      }
    ],
  },
)
```

下面我们一起来看看如何使用内置的标签布局算法，以及如何自定并注册自定义布局算法。

## 内置连接桩标签布局

### Side

标签位于连接桩的某一侧。

- `'left'` 标签位于连接桩左侧。
- `'right'` 标签位于连接桩右侧。
- `'top'` 标签位于连接桩顶部。
- `'bottom'` 标签位于连接桩底部。

可以通过 `args` 来指定标签的位置和旋转角度。

```ts
interface SideArgs {
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| 名称  | 类型           | 必选 | 默认值 | 描述                                      |
|-------|----------------|:----:|--------|-----------------------------------------|
| x     | number         |      | -      | 用指定的 X 坐标替换计算结果中的 X 坐标。   |
| y     | number         |      | -      | 用指定的 Y 坐标替换计算结果中的 Y 坐标。   |
| angle | number         |      | -      | 用指定的旋转角度替换计算结果中的旋转角度。 |
| attrs | Attr.CellAttrs |      | -      | 标签属性。                                 |


```ts
label: {
  position: {
    name : 'right',
    args: {
      y: 10, // 强制指定 y 坐标为 10，替换计算结果中的 y 坐标
      attrs: {
        text: {
          fill: 'red', // 设置标签颜色为红色
        },
      },
    },
  },
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      shape: 'rect',
      x: 80,
      y: 68,
      width: 240,
      height: 80,
      attrs: {
        label: {
          text: 'left',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      ports: {
        groups: {
          a: {
            position: {
              name: 'top',
              args: {
                dr: 0,
                dx: 0,
                dy: -10,
              },
            },
            label: {
              position: {
                name: 'left',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
              },
              text: {
                fill: '#6a6c8a',
              },
            },
          },
        },
      },
    })

    Array.from({ length: 3 }).forEach((_, index) => {
      const label =
        index === 2
          ? {
              position: { args: { x: 20, y: -20 } },
            }
          : {}
      const stroke = index === 2 ? { stroke: 'red' } : {}
      const fill = index === 2 ? { fill: 'red' } : {}
      this.node.addPort({
        label,
        group: 'a',
        attrs: {
          circle: { magnet: true, ...stroke },
          text: { text: `P${index}`, ...fill },
        },
      })
    })
  }

  onAttrsChanged = ({ position }: State) => {
    this.node.prop('ports/groups/a/label/position/name', position)
    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-side-app">
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



### Inside/Outside

标签位于节点的内部或者外部，支持一下四种布局：

- `'inside'` 标签位于节点内围（靠近边线的内侧）。
- `'outside'` 标签位于节点外围（靠近边线的外侧）。
- `'insideOriented'` 标签位于节点内围，而且根据坐所在位自动调整文本的方向。
- `'outsideOriented'` 标签位于节点外围，而且根据坐所在位自动调整文本的方向。

支持通过 `args.offset` 来设置标签沿节点中到标签位置方向的偏移量。

```ts
interface InOutArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| 名称   | 类型           | 必选 | 默认值 | 描述                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `15`   | 从节点中心到标签位置的方向上的偏移量。     |
| x      | number         |      | -      | 用指定的 X 坐标替换计算结果中的 X 坐标。   |
| y      | number         |      | -      | 用指定的 Y 坐标替换计算结果中的 Y 坐标。   |
| angle  | number         |      | -      | 用指定的旋转角度替换计算结果中的旋转角度。 |
| attrs  | Attr.CellAttrs |      | -      | 标签属性。                                 |


```ts
label: {
  position: {
    name : 'outside',
  },
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      shape: 'ellipse',
      x: 70,
      y: 85,
      width: 260,
      height: 100,
      attrs: {
        label: {
          text: 'outside',
          fill: '#888',
          fontSize: 12,
        },
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      ports: {
        groups: {
          a: {
            position: {
              name: 'ellipseSpread',
              args: {
                compensateRotate: true,
              },
            },
            label: {
              position: {
                name: 'outside',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
                fontSize: 12,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({ attrs: { text: { text: `P ${index}` } }, group: 'a' })
    })
  }

  onAttrsChanged = ({ position, offset }: State) => {
    this.node.prop('ports/groups/a/label/position', {
      name: position,
      args: { offset },
    })

    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-inside-outside-app">
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



### Radial

将标签放在圆形或椭圆形节点的外围。支持一下两种布局：

- `'radial'` 标签位于圆形或椭圆形节点的外围。
- `'radialOriented'` 标签位于圆形或椭圆形节点的外围，并使标签文本自动沿圆弧方向旋转。

```ts
interface RadialArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| 名称   | 类型           | 必选 | 默认值 | 描述                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `20`   | 从节点中心到标签位置的方向上的偏移量。     |
| x      | number         |      | -      | 用指定的 X 坐标替换计算结果中的 X 坐标。   |
| y      | number         |      | -      | 用指定的 Y 坐标替换计算结果中的 Y 坐标。   |
| angle  | number         |      | -      | 用指定的旋转角度替换计算结果中的旋转角度。 |
| attrs  | Attr.CellAttrs |      | -      | 标签属性。                                 |

```ts
label: {
  position: {
    name : 'radial',
  },
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = graph.addNode({
      shape: 'ellipse',
      x: 70,
      y: 50,
      width: 260,
      height: 100,
      attrs: {
        label: {
          text: 'outside',
          fill: '#888',
          fontSize: 12,
        },
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
      ports: {
        groups: {
          a: {
            position: {
              name: 'ellipseSpread',
              args: {
                compensateRotate: true,
              },
            },
            label: {
              position: {
                name: 'outside',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
                fontSize: 12,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({ attrs: { text: { text: `P ${index}` } }, group: 'a' })
    })
  }

  onAttrsChanged = ({ position, offset }: State) => {
    this.node.prop('ports/groups/a/label/position', {
      name: position,
      args: { offset },
    })

    this.node.attr('label/text', position)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="port-label-radial-app">
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



## 自定义连接桩标签布局

连接桩标签定位是一个具有如下签名的函数，返回标签相对于连接桩的位置和旋转角度。

```ts
type Definition<T> = (
  portPosition: Point, // 连接桩的位置
  elemBBox: Rectangle, // 节点的包围盒
  args: T, // 标签位置参数
) => Result

interface Result {
  position: Point.PointLike // 标签相对于位置
  angle: number // 标签的旋转角度
  attrs: Attr.CellAttrs // 标签的属性
}
```

所以我们可以按照上面规则来创建自定义布局算法，例如，实现一个位于连接桩右下角的布局：

```ts
function bottomRight(portPosition, elemBBox, args) {
  const dx = args.dx || 10
  const dy = args.dy || 10

  return {
    position: {
     portPosition.x + dx,
     portPosition.y + dy,
    }
  }
}
```

布局算法实现后，需要注册到系统，注册后就可以像内置布局算法那样来使用。

```ts
Graph.registerPortLabelLayout('bottomRight', bottomRight)
```

注册以后，我们就可以像内置布局算法那样来使用：

```ts
const rect = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'top',
        },
        label: {
          position: {
            name: 'bottomRight',
          },
        },
      },
    },

    items: [
      { id: 'port1', group: 'group1' },
      { id: 'port2', label: { position: 'bottomRight' } },
    ],
  },
})
```
### docs/demos/api/port-label-layout/side/index.less

```less
.port-label-side-app {
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
### docs/demos/api/port-label-layout/side/settings.tsx

```tsx
import React from 'react'
import { Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  dx: number
  dy: number
  angle: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'left',
    dx: 0,
    dy: 0,
    angle: 45,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (angle: number) => {
    this.setState({ angle }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row align="middle" justify="center">
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'left'}>
                left
              </Radio>
              <Radio style={radioStyle} value={'right'}>
                right
              </Radio>
              <Radio style={radioStyle} value={'top'}>
                top
              </Radio>
              <Radio style={radioStyle} value={'bottom'}>
                bottom
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-label-layout/inside-outside/index.less

```less
.port-label-inside-outside-app {
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
### docs/demos/api/port-label-layout/inside-outside/settings.tsx

```tsx
import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  offset: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'outside',
    offset: 15,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row
          align="middle"
          justify="center"
          style={{
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'inside'}>
                inside
              </Radio>
              <Radio style={radioStyle} value={'outside'}>
                outside
              </Radio>
              <Radio style={radioStyle} value={'insideOriented'}>
                insideOriented
              </Radio>
              <Radio style={radioStyle} value={'outsideOriented'}>
                outsideOriented
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 16 }}>
            offset
          </Col>
          <Col span={14}>
            <Slider
              min={-30}
              max={30}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/port-label-layout/radial/index.less

```less
.port-label-radial-app {
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
### docs/demos/api/port-label-layout/radial/settings.tsx

```tsx
import React from 'react'
import { Radio, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  offset: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'radial',
    offset: 20,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row
          align="middle"
          justify="center"
          style={{
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'radial'}>
                radial
              </Radio>
              <Radio style={radioStyle} value={'radialOriented'}>
                radialOriented
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 16 }}>
            offset
          </Col>
          <Col span={14}>
            <Slider
              min={-30}
              max={50}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
