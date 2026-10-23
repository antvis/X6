---
title: "画布缩放"
description: "画布缩放"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/graph/mousewheel/"
version: "3.x"
---

[资料索引](/llms.txt)

## 演示

> 按住 `Command` 键通过滚轮缩放画布。



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
      zoomAtMousePosition: true,
    })
  }

  initGraph(options: State) {
    if (this.graph) {
      this.graph.dispose()
    }

    this.graph = new Graph({
      container: this.container,
      height: 280,
      background: {
        color: '#F2F7FA',
      },
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ['ctrl', 'meta'],
        ...options,
      },
    })

    this.graph.addNode({
      x: 200,
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

  onSettingsChanged = (options: State) => {
    this.initGraph(options)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="mousewheel-app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
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

可以使用 `mousewheel` 配置来对画布进行缩放，经常和修饰键配合使用，使用方式如下。

```ts
const graph = new Graph({
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
})
```

支持的选项如下：

```ts
interface MouseWheelOptions {
  enabled?: boolean
  global?: boolean
  factor?: number
  zoomAtMousePosition?: boolean
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  guard?: (this: Graph, e: WheelEvent) => boolean
}
```

### enabled

是否开启滚轮缩放交互。

### factor

滚动缩放因子。默认为 `1.2`。

### zoomAtMousePosition

是否将鼠标位置作为中心缩放，默认为 `true`。

### global

是否为全局事件，设置为 `true` 时滚轮事件绑定在 `Document` 上，否则绑定在画布容器上。默认为 `false`。

### modifiers

修饰键(`alt`、`ctrl`、`meta`、`shift`)，设置修饰键后需要按下修饰键并滚动鼠标滚轮时才触发画布缩放。通过设置修饰键可以解决默认滚动行为与画布缩放冲突问题。修饰键支持以下几种形式：

- `alt` 表示按下 `alt`。
- `[alt, ctrl]` 表示按下 `alt` 或 `ctrl`。
- `alt|ctrl` 表示按下 `alt` 或 `ctrl`。
- `alt&ctrl` 表示同时按下 `alt` 和 `ctrl`。
- `alt|ctrl&shift` 表示同时按下 `alt` 和 `shift` 或者同时按下 `ctrl` 和 `shift`。

### guard

判断一个滚轮事件是否应该被处理，返回 `false` 时对应的事件被忽略。

```ts
new Graph({
  mousewheel: {
    enabled: true,
    guard(e: WheelEvent) {
      if (e.altKey) {
        // 当按下 alt 键时，忽略所有滚动事件
        return false
      }
      return true
    },
  },
})
```

## 方法

### isMouseWheelEnabled()

```ts
isMouseWheelEnabled(): boolean
```

返回是否启用了鼠标滚轮来缩放画布。

### enableMouseWheel()

```ts
enableMouseWheel(): this
```

启用鼠标滚轮缩放画布。

### disableMouseWheel()

```ts
disableMouseWheel(): this
```

禁用鼠标滚轮缩放画布。

### toggleMouseWheel(...)

```ts
toggleMouseWheel(enabled?: boolean): this
```

切换鼠标滚轮缩放画布的启用状态。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| enabled | boolean |  | - | 是否启用鼠标滚轮缩放画布，缺省时切换鼠标滚轮缩放画布的启用状态。 |
### docs/demos/api/mousewheel/playground/index.less

```less
.mousewheel-app {
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
### docs/demos/api/mousewheel/playground/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  zoomAtMousePosition: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    zoomAtMousePosition: true,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onFixedChanged = (e: any) => {
    this.setState({ zoomAtMousePosition: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="MouseWheel Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.zoomAtMousePosition}
              onChange={this.onFixedChanged}
            >
              Zoom at Mouse Postion
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
