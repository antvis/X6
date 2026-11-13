---
title: "画布平移"
description: "画布平移"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/graph/panning/"
version: "3.x"
---

[资料索引](/llms.txt)

## 演示



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.initGraph({
      enabled: true,
      modifiers: [],
      eventTypes: ['leftMouseDown'],
    })
  }

  initGraph(options: any) {
    if (this.graph) {
      this.graph.dispose()
    }
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      panning: {
        ...options,
      },
    })

    this.graph.addNode({
      x: 320,
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
    })

    const source = this.graph.addNode({
      x: 80,
      y: 50,
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
      x: 240,
      y: 200,
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
      <div className="panning-app">
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

普通画布(未使用 `Scroller` 插件)通过 `panning` 选项来支持拖拽平移。

```ts
const graph = new Graph({
  panning: true, // 不传该选项时，默认值也为 true
})

// 等同于
const graph = new Graph({
  panning: {
    enabled: true,
  },
})
```

支持的选项如下：

```ts
interface Options {
  enabled?: boolean
  modifiers?: ModifierKey
  eventTypes?: ('leftMouseDown' | 'rightMouseDown' | 'mouseWheel' | 'mouseWheelDown')[]
}
```

### enabled

是否开启画布平移交互。

### modifiers

拖拽可能和其他操作冲突，此时可以设置 `modifiers` 参数，设置修饰键后需要按下修饰键并点击鼠标才能触发画布拖拽。

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

### eventTypes

触发画布平移的交互方式。支持三种形式或者他们之间的组合：

- `leftMouseDown`: 按下鼠标左键移动进行拖拽
- `rightMouseDown`: 按下鼠标右键移动进行拖拽
- `mouseWheel`: 使用鼠标滚轮滚动拖拽
- `mouseWheelDown`: 按下鼠标滚轮进行拖拽

## 方法

### isPannable()

```ts
isPannable(): boolean
```

返回是否启用了画布平移交互功能。

### enablePanning()

```ts
enablePanning(): this
```

启用画布平移功能。

### disablePanning()

```ts
disablePanning(): this
```

禁用画布平移功能。

### togglePanning(...)

```ts
togglePanning(enabled?: boolean): this
```

切换画布平移启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                               |
|---------|---------|:----:|--------|--------------------------------------------------|
| enabled | boolean |      | -      | 是否启用画布平移功能，缺省时切换画布平移的启用状态。 |
### docs/demos/api/panning/playground/index.less

```less
.panning-app {
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
}
```
### docs/demos/api/panning/playground/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Switch, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  enabled: boolean
  modifiers: string[]
  eventTypes: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    enabled: true,
    modifiers: [],
    eventTypes: ['leftMouseDown'],
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onEnabledChanged = (enabled: boolean) => {
    this.setState({ enabled }, () => {
      this.notifyChange()
    })
  }

  onModifiersChange = (modifiers: string[]) => {
    this.setState({ modifiers }, () => {
      this.notifyChange()
    })
  }

  onEventTypesChange = (eventTypes: string[]) => {
    this.setState({ eventTypes }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Selection Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={14}>Enabled</Col>
          <Col span={10}>
            <Switch
              checked={this.state.enabled}
              onChange={this.onEnabledChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Modifier Key</Col>
          <Col span={16}>
            <Checkbox.Group
              options={['alt', 'ctrl', 'shift']}
              value={this.state.modifiers}
              onChange={this.onModifiersChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Event Type</Col>
          <Col span={16}>
            <Checkbox.Group
              options={[
                {
                  label: '左键',
                  value: 'leftMouseDown',
                },
                {
                  label: '右键',
                  value: 'rightMouseDown',
                },
                {
                  label: '滚轮',
                  value: 'mousewheel',
                },
              ]}
              value={this.state.eventTypes}
              onChange={this.onEventTypesChange}
            />
          </Col>
        </Row>
      </Card>
    )
  }
}
```
