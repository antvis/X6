---
title: "滚动画布"
description: "滚动画布"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/plugins/scroller/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍滚动画布插件相关的知识，通过阅读，你可以了解到**

- 如何使画布具备滚动能力


> **注意**

使用 `Scroller` 插件时会默认禁用画布的 `panning` 拖拽平移能力以避免冲突。

## 使用

你可以通过插件 `Scroller` 启用画布滚动能力，示例：

```ts
import { Graph, Scroller } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  }
})
graph.use(
  new Scroller({
    enabled: true,
  }),
)
```

## 演示



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Button } from 'antd'
import { Graph, Scroller } from '@antv/x6'
import { Settings, State } from './settings.tsx'

const data = {
  hello: {
    id: 'hello',
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
  },
  world: {
    id: 'world',
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
  },
  rect: {
    id: 'rect',
    x: -60,
    y: 100,
    width: 100,
    height: 40,
    label: 'Rect',
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
  },
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.renderGraph()
  }

  renderGraph(options: State | null = null) {
    if (this.graph) {
      this.graph.dispose()
    }

    const graph = new Graph({
      container: this.container,
      panning: false,
      background: {
        color: '#F2F7FA',
      },
    })
    graph.use(
      new Scroller({
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
        ...options,
      }),
    )

    graph.fromJSON({ nodes: Object.keys(data).map((key) => data[key]) })

    graph.on('node:change:position', ({ node, current }) => {
      const item = data[node.id]
      item.x = current!.x
      item.y = current!.y
    })

    graph.centerContent()
    this.graph = graph
  }

  onSettingsChanged = (options: State) => {
    this.renderGraph(options)
  }

  onCenter = () => {
    this.graph.center()
  }

  onCenterContent = () => {
    this.graph.centerContent()
  }

  onCenterCircle = () => {
    const circle = this.graph.getCellById('world')
    if (circle) {
      this.graph.centerCell(circle)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="scroller-app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
        </div>
        <div className="app-main">
          <div className="app-btns">
            <Button onClick={this.onCenter}>Center Graph</Button>
            <Button onClick={this.onCenterContent}>Center Whole Content</Button>
            <Button onClick={this.onCenterCircle}>Center The Circle</Button>
          </div>
          <div className="app-content" ref={this.refContainer} />
        </div>
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 选项

| 属性名           | 类型                | 默认值  | 必选 | 描述                                                                                                                                                                                   |
|------------------|---------------------|---------|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pannable         | boolean             | `false` |      | 是否启用画布平移能力（在空白位置按下鼠标后拖动平移画布）                                                                                                                                 |
| className        | string              | -       |      | 附加样式名，用于定制样式                                                                                                                                                                |
| width            | number              | -       |      | `Scroller` 的宽度，默认为画布容器宽度                                                                                                                                                   |
| height           | number              | -       |      | `Scroller` 的高度，默认为画布容器高度                                                                                                                                                   |
| modifiers        | ModifierKey         | -       |      | 设置修饰键后需要点击鼠标并按下修饰键才能触发画布拖拽                                                                                                                                   |
| pageWidth        | number              | -       |      | 每一页的宽度，默认为画布容器宽度                                                                                                                                                        |
| pageHeight       | number              | -       |      | 每一页的高度，默认为画布容器高度                                                                                                                                                        |
| pageVisible      | boolean             | `false` |      | 是否分页                                                                                                                                                                               |
| pageBreak        | boolean             | `false` |      | 是否显示分页符                                                                                                                                                                         |
| autoResize       | boolean             | `true`  |      | 是否自动扩充/缩小画布。开启后，移动节点/边时将自动计算需要的画布大小，当超出当前画布大小时，按照 `pageWidth` 和 `pageHeight` 自动扩充画布。反之，则自动缩小画布                              |
| minVisibleWidth  | number              | -       |      | 当 `padding` 为空时有效，设置画布滚动时画布的最小可见宽度                                                                                                                               |
| minVisibleHeight | number              | -       |      | 当 `padding` 为空时有效，设置画布滚动时画布的最小可见高度                                                                                                                               |
| padding          | `number \| Padding` | -       |      | 设置画布四周的 padding 边距。默认根据 `minVisibleWidth` 和 `minVisibleHeight` 自动计算得到，保证画布滚动时，在宽度和高度方向至少有 `minVisibleWidth` 和 `minVisibleHeight` 大小的画布可见 |

上面的 `Padding` 类型定义如下：

```ts
type Padding = { top: number; right: number; bottom: number; left: number }
```

`ModifierKey` 的类型定义如下：

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift' | 'space')[] | null
```

支持以下几种形式：

- `alt` 表示按下 `alt`。
- `[alt, ctrl]` 表示按下 `alt` 或 `ctrl`。
- `alt|ctrl` 表示按下 `alt` 或 `ctrl`。
- `alt&ctrl` 表示同时按下 `alt` 和 `ctrl`。
- `alt|ctrl&shift` 表示同时按下 `alt` 和 `shift` 或者同时按下 `ctrl` 和 `shift`。

## API

### graph.lockScroller()

禁止滚动。

### graph.unlockScroller()

启用滚动。

### graph.getScrollbarPosition()

获取滚动条位置。

### graph.setScrollbarPosition(left?: number, top?: number)

设置滚动条位置。

- `left?: number` 水平滚动条的位置，缺省时表示水平方向不滚动。
- `top?: number` 垂直滚动条的位置，缺省时表示垂直方向不滚动。

例如：

```ts
graph.setScrollbarPosition(100)
graph.setScrollbarPosition(100, null)
graph.setScrollbarPosition(null, 200)
graph.setScrollbarPosition(100, 200)
```
### docs/demos/tutorial/plugins/scroller/index.less

```less
.scroller-app {
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

  .app-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-right: 8px;
    margin-left: 8px;

    .app-btns {
      display: flex;
      padding-top: 4px;
      padding-bottom: 12px;
    }

    .app-btns .ant-btn {
      margin-right: 16px;
    }

    .app-content {
      flex: 1;
      margin-right: 8px;
      margin-left: 8px;
    }
  }

  .x6-graph-scroller {
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
}
```
### docs/demos/tutorial/plugins/scroller/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  pannable: boolean
  pageVisible: boolean
  pageBreak: boolean
  autoResize: boolean
  minVisibleWidth: number
  minVisibleHeight: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    pannable: true,
    pageVisible: true,
    pageBreak: true,
    autoResize: true,
    minVisibleWidth: 50,
    minVisibleHeight: 50,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPanningChanged = (e: any) => {
    this.setState({ pannable: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onAutoResizeChanged = (e: any) => {
    this.setState({ autoResize: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageVisibleChanged = (e: any) => {
    this.setState({ pageVisible: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onPageBreakChanged = (e: any) => {
    this.setState({ pageBreak: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleWidthChanged = (minVisibleWidth: number) => {
    this.setState({ minVisibleWidth }, () => {
      this.notifyChange()
    })
  }

  onMinVisibleHeightChanged = (minVisibleHeight: number) => {
    this.setState({ minVisibleHeight }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Scroller Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pannable}
              onChange={this.onPanningChanged}
            >
              Enable Panning
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.autoResize}
              onChange={this.onAutoResizeChanged}
            >
              Enable Auto Resize
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageVisible}
              onChange={this.onPageVisibleChanged}
            >
              Show Page
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.pageBreak}
              onChange={this.onPageBreakChanged}
            >
              Show Page Break
            </Checkbox>
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Width
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleWidth}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleWidth}
              onChange={this.onMinVisibleWidthChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginBottom: 0,
          }}
        >
          <Col span={10} offset={1}>
            Min Visible Height
          </Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.minVisibleHeight}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: 0 }}>
          <Col span={22} offset={1}>
            <Slider
              min={10}
              max={200}
              step={1}
              value={this.state.minVisibleHeight}
              onChange={this.onMinVisibleHeightChanged}
            />
          </Col>
        </Row>
      </Card>
    )
  }
}
```
