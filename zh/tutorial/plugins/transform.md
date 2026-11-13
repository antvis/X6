---
title: "图形变换"
description: "图形变换"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/plugins/transform/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍图形变换插件相关的知识，通过阅读，你可以了解到**

- 如何通过交互插件调整节点大小
- 如何通过交互插件调整节点旋转角度


## 使用

使用 `UI` 组件来调整节点尺寸和角度是常见需求。我们提供插件 `transform` 来实现该功能，代码示例如下：

```ts
import { Graph, Transform } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Transform({
    resizing: resizingOptions,
    rotating: rotatingOptions,
  }),
)
```

## 演示

首先我们体验使用交互修改节点尺寸（点击节点出现操作组件）：



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Transform } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      minWidth: 1,
      maxWidth: 200,
      minHeight: 1,
      maxHeight: 150,
      orthogonal: false,
      restrict: false,
      preserveAspectRatio: false,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Transform({
        resizing: options,
      }),
    )

    const source = this.graph.addNode({
      shape: 'rect',
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
    })

    const target = this.graph.addNode({
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

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="resizing-app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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



接下来体验使用交互修改节点旋转角度（点击节点出现操作组件）：



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Transform } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      grid: 15,
    })
  }

  initGraph = (options: State) => {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Transform({
        rotating: options,
      }),
    )

    const source = this.graph.addNode({
      x: 60,
      y: 130,
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
      shape: 'circle',
      x: 260,
      y: 120,
      width: 60,
      height: 60,
      label: 'World',
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

  onSettingChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="rotating-app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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

### 调整尺寸

| 属性名              | 类型    | 默认值     | 必选 | 描述                                         |
|---------------------|---------|------------|------|--------------------------------------------|
| enabled             | boolean | `false`    |      | 是否支持调整节点大小                         |
| minWidth            | number  | 0          |      | 最小的调整宽度                               |
| minHeight           | number  | 0          |      | 最小的调整高度                               |
| maxWidth            | number  | `Infinity` |      | 最大的调整宽度                               |
| maxHeight           | number  | `Infinity` |      | 最大的调整高度                               |
| orthogonal          | boolean | `true`     |      | 是否显示中间调整点                           |
| restrict            | boolean | `false`    |      | 调整大小边界是否可以超出画布边缘             |
| autoScroll          | boolean | `true`     |      | 拖动位置超过画布时是否自动滚动画布           |
| preserveAspectRatio | boolean | `false`    |      | 调整大小过程中是否保持节点的宽高比例         |
| allowReverse        | boolean | `true`     |      | 到达最小宽度或者高度时是否允许控制点反向拖动 |

上面的配置除了支持默认类型外，还支持使用函数的方式来动态修改：

```ts
new Transform({
  resizing: {
    enabled: true,
    orthogonal(node: Node) {
      const { enableOrthogonal } = node.getData()
      return enableOrthogonal
    },
  },
})
```

### 调整角度

| 属性名  | 类型    | 默认值  | 必选 | 描述                 |
|---------|---------|---------|------|--------------------|
| enabled | boolean | `false` |      | 是否支持调整节点角度 |
| grid    | number  | 15      |      | 每次旋转的角度       |

上面的配置除了支持默认类型外，还支持使用函数的方式来动态修改：

```ts
new Transform({
  rotating: {
    enabled: true,
    grid() {
      return 30
    },
  },
})
```

## API

### graph.createTransformWidget(node: Node)

为节点创建 transform 控件。

### graph.clearTransformWidgets()

清除所有 transform 控件。

## 事件

| 事件名称        | 参数类型                                                                      | 描述                   |
|-----------------|-------------------------------------------------------------------------------|----------------------|
| `node:resize`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }` | 开始调整节点大小时触发 |
| `node:resizing` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }` | 调整节点大小时触发     |
| `node:resized`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`   | 调整节点大小后触发     |
| `node:rotate`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }` | 开始旋转节点时触发     |
| `node:rotating` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }` | 旋转节点时触发         |
| `node:rotated`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`   | 旋转节点后触发         |

```ts
graph.on('node:rotated', ({ node }) => {
  console.log(node.angle())
})

// 我们也可以在插件实例上监听事件
transform.on('node:rotated', ({ node }) => {
  console.log(node.angle())
})
```
### docs/demos/tutorial/plugins/transform/resizing/index.less

```less
.resizing-app {
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

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0;
    border: 1px solid #239edd;
    border-radius: 6px;
  }

  .x6-widget-transform > div {
    border: 1px solid #239edd;
  }

  .x6-widget-transform > div:hover {
    background-color: #3dafe4;
  }

  .x6-widget-transform-active-handle {
    background-color: #3dafe4;
  }

  .x6-widget-transform-resize {
    border-radius: 0;
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
### docs/demos/tutorial/plugins/transform/resizing/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orthogonal?: boolean
  restrict?: boolean
  preserveAspectRatio?: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    minWidth: 1,
    maxWidth: 200,
    minHeight: 1,
    maxHeight: 150,
    orthogonal: false,
    restrict: false,
    preserveAspectRatio: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnableChanged = (e: any) => {
    this.setState({ enabled: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinWidthChanged = (minWidth: number) => {
    this.setState({ minWidth }, () => {
      this.notifyChange()
    })
  }

  onMaxWidthChanged = (maxWidth: number) => {
    this.setState({ maxWidth }, () => {
      this.notifyChange()
    })
  }

  onMinHeightChanged = (minHeight: number) => {
    this.setState({ minHeight }, () => {
      this.notifyChange()
    })
  }

  onMaxHeightChanged = (maxHeight: number) => {
    this.setState({ maxHeight }, () => {
      this.notifyChange()
    })
  }

  onOrthogonalChanged = (e: any) => {
    this.setState({ orthogonal: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onRestrictedChanged = (e: any) => {
    this.setState({ restrict: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPreserveAspectRatioChanged = (e: any) => {
    this.setState({ preserveAspectRatio: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Resizing Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.enabled}
              onChange={this.onEnableChanged}
            >
              Enabled
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minWidth</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={100}
              step={1}
              value={this.state.minWidth}
              onChange={this.onMinWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxWidth</Col>
          <Col span={14}>
            <Slider
              min={100}
              max={200}
              step={1}
              value={this.state.maxWidth}
              onChange={this.onMaxWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxWidth}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>minHeight</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={75}
              step={1}
              value={this.state.minHeight}
              onChange={this.onMinHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.minHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>maxHeight</Col>
          <Col span={14}>
            <Slider
              min={75}
              max={150}
              step={1}
              value={this.state.maxHeight}
              onChange={this.onMaxHeightChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.maxHeight}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.orthogonal}
              onChange={this.onOrthogonalChanged}
            >
              Orthogonal
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.restrict}
              onChange={this.onRestrictedChanged}
            >
              Restrict
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.preserveAspectRatio}
              onChange={this.onPreserveAspectRatioChanged}
            >
              PreserveAspectRatio
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/tutorial/plugins/transform/rotating/index.less

```less
.rotating-app {
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

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0;
    border: 1px solid #239edd;
    border-radius: 6px;
  }

  .x6-widget-transform > div {
    border: 1px solid #239edd;
  }

  .x6-widget-transform > div:hover {
    background-color: #3dafe4;
  }

  .x6-widget-transform-active-handle {
    background-color: #3dafe4;
  }

  .ant-card {
    min-height: 250px;
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
### docs/demos/tutorial/plugins/transform/rotating/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: true
  grid?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    grid: 15,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnableChanged = (e: any) => {
    this.setState({ enabled: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onGridChanged = (grid: number) => {
    this.setState({ grid }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Rotating Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.enabled}
              onChange={this.onEnableChanged}
            >
              Enabled
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>grid</Col>
          <Col span={14}>
            <Slider
              min={1}
              max={180}
              step={1}
              value={this.state.grid}
              onChange={this.onGridChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.grid}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
