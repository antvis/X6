---
title: "对齐线"
description: "对齐线"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/plugins/snapline/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍对齐线插件相关的知识，通过阅读，你可以了解到**

- 如何在画布中使用对齐线


## 使用

对齐线是用于移动节点排版的辅助工具。你可以通过插件 `Snapline` 启用该功能，示例：

```ts
import { Graph, Snapline } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Snapline({
    enabled: true,
  }),
)
```

## 演示



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Snapline } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Snapline({
        enabled: true,
        clean: false,
      }),
    )

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Drag Me',
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
  }

  onSnaplineChanged = (options: State) => {
    this.graph.setSnaplineTolerance(options.tolerance)
    this.graph.setSnaplineFilter(options.filter)

    if (options.sharp) {
      this.graph.enableSharpSnapline()
    } else {
      this.graph.disableSharpSnapline()
    }

    if (options.resizing) {
      this.graph.enableSnaplineOnResizing()
    } else {
      this.graph.disableSnaplineOnResizing()
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="snapline-app">
        <div className="app-side">
          <Settings onChange={this.onSnaplineChanged} />
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

| 属性名    | 类型    | 默认值  | 必选 | 描述                                                                                           |
|-----------|---------|---------|------|----------------------------------------------------------------------------------------------|
| className | string  | -       |      | 附加样式名，用于定制对齐线样式                                                                  |
| tolerance | number  | 10      |      | 对齐精度，即移动节点时与目标位置的距离小于 `tolerance` 时触发显示对齐线                         |
| sharp     | boolean | `false` |      | 是否使用短款对齐线                                                                             |
| resizing  | boolean | `false` |      | 改变节点大小时是否触发对齐线                                                                   |
| clean     | boolean | `true`  |      | 如果为 `true`，则在 3 秒后清除对齐线；为 `false` 则不会清除；如果为数字（ms），则在指定时间后清除对齐线 |
| filter    | Filter  | -       |      | 节点过滤器                                                                                     |

上面的 Filter 类型比较复杂，支持以下三种类型：

- `string[]`： 节点 `shape` 数组，指定的节点 `shape` 才会参与对齐计算
- `({ id: string })[]`： 节点 ID 数组，指定的节点才会参与对齐计算
- `(this: Graph, node: Node) => boolean`： 返回 `true` 的节点才参与对齐计算

## API

### graph.isSnaplineEnabled()

```ts
isSnaplineEnabled(): boolean
```

返回是否启用对齐线。

### graph.enableSnapline()

```ts
enableSnapline(): this
```

启用对齐线。

### graph.disableSnapline()

```ts
disableSnapline(): this
```

禁用对齐线。

### graph.toggleSnapline(...)

```ts
toggleSnapline(enabled?: boolean): this
```

切换对齐线的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### graph.hideSnapline()

```ts
hideSnapline(): this
```

隐藏对齐线。

### graph.isSnaplineOnResizingEnabled()

```ts
isSnaplineOnResizingEnabled(): boolean
```

调整节点大小时，是否触发对齐线。

### graph.enableSnaplineOnResizing()

```ts
enableSnaplineOnResizing(): this
```

启用调整节点大小过程中触发对齐线。

### graph.disableSnaplineOnResizing()

```ts
disableSnaplineOnResizing(): this
```

禁用调整节点大小过程中触发对齐线。

### graph.toggleSnaplineOnResizing(...)

```ts
toggleSnaplineOnResizing(enabled?: boolean): this
```

切换调整节点大小过程中是否触发对齐线。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### graph.isSharpSnapline()

```ts
isSharpSnapline(): boolean
```

是否使用短款对齐线。

### graph.enableSharpSnapline()

```ts
enableSharpSnapline(): this
```

启用短款对齐线，启用后对齐线只显示到相关节点位置处，否则显示贯穿画布的对齐线。

### graph.disableSharpSnapline()

```ts
disableSharpSnapline(): this
```

禁用短款对齐线，对齐线将贯穿整个画布。

### graph.toggleSharpSnapline()

```ts
toggleSharpSnapline(enabled?: boolean): this
```

切换短款对齐线的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                               |
|---------|---------|:----:|--------|--------------------------------------------------|
| enabled | boolean |      | -      | 是否启用短款对齐线，缺省时切换短款对齐线的启用状态。 |

### graph.getSnaplineTolerance()

```ts
getSnaplineTolerance(): number
```

获取对齐线精度。

### graph.setSnaplineTolerance(...)

```ts
setSnaplineTolerance(tolerance: number): this
```

设置对齐线精度。

### graph.setSnaplineFilter(...)

```ts
setSnaplineFilter(
  filter?:
   | null
   | (string | { id: string })[]
   | ((this: Graph, node: Node) => boolean)
): this
```

设置过滤条件，满足过滤条件的节点才会参与对齐线计算。
### docs/demos/tutorial/plugins/snapline/index.less

```less
.snapline-app {
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
### docs/demos/tutorial/plugins/snapline/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  tolerance: number
  sharp: boolean
  resizing: boolean
  filter?: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    tolerance: 10,
    sharp: false,
    resizing: false,
  }

  tryToJSON(val: string) {
    try {
      return JSON.parse(val)
    } catch (error) {
      return val
    }
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onSharpChanged = (e: any) => {
    this.setState({ sharp: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onResingChanged = (e: any) => {
    this.setState({ resizing: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onToleranceChanged = (tolerance: number) => {
    this.setState({ tolerance }, () => {
      this.notifyChange()
    })
  }

  onFilterChanged = (e: any) => {
    this.setState(
      {
        filter: e.target.checked ? ['circle'] : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card
        title="Snapline Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Tolerance</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.tolerance}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.tolerance}
              onChange={this.onToleranceChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox checked={this.state.sharp} onChange={this.onSharpChanged}>
              Sharp Line
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.resizing}
              onChange={this.onResingChanged}
            >
              Snap on Resizing
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add Filter(only circle)
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
