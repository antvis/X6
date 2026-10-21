---
title: "连接器"
description: "连接器"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/connector/"
version: "3.x"
---

[资料索引](/llms.txt)

连接器将起点、路由返回的点、终点加工为 `<path>` 元素的 [`d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) 属性，决定了边渲染到画布后的样式。X6 中内置了以下几种连接器。

| 连接器   | 说明                                                                                  |
|----------|-------------------------------------------------------------------------------------|
| normal   | [简单连接器](#normal)，用直线连接起点、路由点和终点。                                    |
| smooth   | [平滑连接器](#smooth)，用三次贝塞尔曲线线连接起点、路由点和终点。                        |
| rounded  | [圆角连接器](#rounded)，用直线连接起点、路由点和终点，并在线段连接处用圆弧链接（倒圆角）。  |
| jumpover | [跳线连接器](#jumpover)，用直线连接起点、路由点和终点，并在边与边的交叉处用跳线符号链接。 |

可以为某条边设置路由：

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: {
    name: 'rounded',
    args: {
      radius: 20,
    },
  },
})
```

当没有连接器参数时，可以简化为：

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: 'rounded',
})
```

也可以调用 `edge.setConnector` 来设置连接器：

```ts
edge.setConnector('rounded', { radius: 20 })
```

在创建画布时，可以通过 `connecting` 选项来设置全局默认连接器（默认为 `'normal'`）：

```ts
new Graph({
  connecting: {
    connector: {
      name: 'rounded',
      args: {
        radius: 20,
      },
    },
  },
})
```

当路由没有参数时，也可以简化为：

```ts
new Graph({
  connecting: {
    connector: 'rounded',
  },
})
```

下面我们一起来看看如何使用内置连接器，以及如何自定并注册自定义连接器。

## 内置连接器

### normal

系统的默认连接器，将起点、路由点、终点通过直线按顺序连接。

支持的参数如下表：

| 参数名 | 参数类型 | 是否必选 | 默认值  | 参数说明                                                        |
|--------|----------|:-------:|---------|-------------------------------------------------------------|
| raw    | boolean  |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
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
      x: 300,
      y: 240,
      width: 100,
      height: 40,
      label: 'world',
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

    graph.addEdge({
      source: rect1,
      target: rect2,
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      connector: {
        name: 'normal',
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-normal-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### smooth

平滑连接器，通过三次贝塞尔链接起点、路由点和终点。

支持的参数如下表：

| 参数名    | 参数类型   | 是否必选 | 默认值  | 参数说明                                                         |
|-----------|------------|:-------:|---------|--------------------------------------------------------------|
| raw       | boolean    |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。  |
| direction | `H` \| `V` |    否    | -       | 保持水平连接或者保持垂直连接，不设置会根据起点和终点位置动态计算。 |

例如：

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: 'smooth',
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
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
      x: 300,
      y: 240,
      width: 100,
      height: 40,
      label: 'world',
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

    graph.addEdge({
      source: rect1,
      target: rect2,
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      connector: {
        name: 'smooth',
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-smooth-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### rounded

圆角连接器，将起点、路由点、终点通过直线按顺序连接，并在线段连接处通过圆弧连接（倒圆角）。

支持的参数如下表：

| 参数名 | 参数类型 | 是否必选 | 默认值  | 参数说明                                                        |
|--------|----------|:-------:|---------|-------------------------------------------------------------|
| radius | number   |    否    | `10`    | 倒角半径。                                                       |
| raw    | boolean  |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。 |

例如：

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: {
    name: 'rounded',
    args: {
      radius: 10,
    },
  },
})
```



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
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
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
      x: 300,
      y: 220,
      width: 100,
      height: 40,
      label: 'world',
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

    this.edge = graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      connector: {
        name: 'rounded',
      },
    })

    graph.centerContent()
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('rounded', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-rounded-app">
        <div className="app-left">
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



### jumpover

跳线连接器，用直线连接起点、路由点和终点，并在边与边的交叉处用跳线符号链接。

支持的参数如下表：

| 参数名 | 参数类型                  | 是否必选 | 默认值  | 参数说明                                                        |
|--------|---------------------------|:-------:|---------|-------------------------------------------------------------|
| type   | 'arc' \| 'gap' \| 'cubic' |    否    | `'arc'` | 跳线类型。                                                       |
| size   | number                    |    否    | `5`     | 跳线大小。                                                       |
| radius | number                    |    否    | `0`     | 倒角半径。                                                       |
| raw    | boolean                   |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。 |



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
    })

    const source = graph.addNode({
      x: 24,
      y: 70,
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

    const target = graph.addNode({
      x: 24,
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

    this.edge = graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 760, y: 150 },
        { x: 760, y: 240 },
      ],
      connector: {
        name: 'jumpover',
        args: {
          type: 'arc',
          size: 5,
          radius: 0,
        },
      },
    })

    const rect = graph.addNode({
      x: 160,
      y: 24,
      width: 70,
      height: 30,
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

    for (let i = 0; i < 6; i += 1) {
      const source = rect.clone().translate(i * 100, i * 10)
      graph.addNode(source)

      const target = source.clone().translate(0, 200)
      graph.addNode(target)
      graph.addEdge({
        source,
        target,
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    }
  }

  onAttrsChanged = (args: State) => {
    this.edge.setConnector('jumpover', args)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-jumpover-app">
        <div className="app-left">
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



## 自定义连接器

连接器是一个具有如下签名的函数，返回 `Path` 对象或序列化后的字符串。

```ts
export type Definition<T> = (
  this: EdgeView, // 边的视图
  sourcePoint: Point.PointLike, // 起点
  targetPoint: Point.PointLike, // 终点
  routePoints: Point.PointLike[], // 路由返回的点
  args: T, // 参数
  edgeView: EdgeView, // 边的视图
) => Path | string
```

| 参数名      | 参数类型          | 参数说明      |
|-------------|-------------------|-------------|
| this        | EdgeView          | 边的视图。     |
| sourcePoint | Point.PointLike   | 起点。         |
| targetPoint | Point.PointLike   | 终点。         |
| routePoints | Point.PointLike[] | 路由返回的点。 |
| args        | T                 | 连接器参数。   |
| edgeView    | EdgeView          | 边的视图。     |

我来定义一个 `wobble` 连接器：

```ts
export interface WobbleArgs {
  spread?: number
  raw?: boolean
}

function wobble(
  sourcePoint: Point.PointLike,
  targetPoint: Point.PointLike,
  vertices: Point.PointLike[],
  args: WobbleArgs,
) {
  const spread = args.spread || 20
  const points = [...vertices, targetPoint].map((p) => Point.create(p))
  let prev = Point.create(sourcePoint)
  const path = new Path(Path.createSegment('M', prev))

  for (let i = 0, n = points.length; i < n; i += 1) {
    const next = points[i]
    const distance = prev.distance(next)
    let d = spread

    while (d < distance) {
      const current = prev.clone().move(next, -d)
      current.translate(
        Math.floor(7 * Math.random()) - 3,
        Math.floor(7 * Math.random()) - 3,
      )
      path.appendSegment(Path.createSegment('L', current))
      d += spread
    }

    path.appendSegment(Path.createSegment('L', next))
    prev = next
  }

  return args.raw ? path : path.serialize()
}
```

然后注册连接器：

```ts
Graph.registerConnector('wobble', wobble)
```

注册以后我们就可以通过连接器名称来使用：

```ts
edge.setConnector('wobble', { spread: 16 })
```


```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Path, Point } from '@antv/x6'

export interface WobbleArgs {
  spread?: number
  raw?: boolean
}

Graph.registerConnector(
  'wobble',
  (sourcePoint, targetPoint, vertices, args: WobbleArgs) => {
    const spread = args.spread || 20
    const points = [...vertices, targetPoint].map((p) => Point.create(p))
    let prev = Point.create(sourcePoint)
    const path = new Path()
    path.appendSegment(Path.createSegment('M', prev))

    for (let i = 0, n = points.length; i < n; i += 1) {
      const next = points[i]
      const distance = prev.distance(next)
      let d = spread

      while (d < distance) {
        const current = prev.clone().move(next, -d)
        current.translate(
          Math.floor(7 * Math.random()) - 3,
          Math.floor(7 * Math.random()) - 3,
        )
        path.appendSegment(Path.createSegment('L', current))
        d += spread
      }

      path.appendSegment(Path.createSegment('L', next))
      prev = next
    }

    return path
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const rect1 = graph.addNode({
      x: 30,
      y: 30,
      width: 100,
      height: 40,
      label: 'hello',
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
      x: 300,
      y: 240,
      width: 100,
      height: 40,
      label: 'world',
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

    graph.addEdge({
      source: rect1,
      target: rect2,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      vertices: [
        { x: 100, y: 200 },
        { x: 300, y: 120 },
      ],
      connector: {
        name: 'wobble',
        args: {
          spread: 16,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="connector-wobble-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```
### docs/demos/api/connector/normal/index.less

```less
.connector-normal-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/connector/smooth/index.less

```less
.connector-smooth-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/connector/rounded/index.less

```less
.connector-rounded-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 320px;
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
### docs/demos/api/connector/rounded/settings.tsx

```tsx
import React from 'react'
import { Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    radius: 10,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.radius}
              onChange={this.onRadiusChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.radius}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/connector/jumpover/index.less

```less
.connector-jumpover-app {
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
    height: 320px;
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
### docs/demos/api/connector/jumpover/settings.tsx

```tsx
import React from 'react'
import { Slider, Radio, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
  size: number
  radius: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'arc',
    size: 5,
    radius: 0,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.notifyChange()
    })
  }

  onRadiusChanged = (radius: number) => {
    this.setState({ radius }, () => {
      this.notifyChange()
    })
  }

  onTypeChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Args" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>type</Col>
          <Col span={18}>
            <Radio.Group onChange={this.onTypeChange} value={this.state.type}>
              <Radio value={'arc'}>arc</Radio>
              <Radio value={'cubic'}>cubic</Radio>
              <Radio value={'gap'}>gap</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>size</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>radius</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={30}
              step={1}
              value={this.state.radius}
              onChange={this.onRadiusChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.radius}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/connector/wobble/index.less

```less
.connector-wobble-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
