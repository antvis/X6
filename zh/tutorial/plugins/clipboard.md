---
title: "复制粘贴"
description: "复制粘贴"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/plugins/clipboard/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍剪切板插件相关的知识，通过阅读，你可以了解到**

- 如何使用复制粘贴功能


## 使用

剪切板用于复制/粘贴节点和边。你可以通过插件 `Clipboard` 启用该功能，示例：

```ts
import { Graph, Clipboard } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Clipboard({
    enabled: true,
  }),
)
```

## 演示

- 选中节点后，点击复制按钮复制节点。
- 设置不同的 `offset`，观察粘贴时对节点位置的影响。
- 启用 `localStorage` 后复制节点，刷新页面或重新打开浏览器后，点击粘贴按钮。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Button, message } from 'antd'
import { Graph, Clipboard, Selection } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private options: State

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Selection({
        enabled: true,
        showNodeSelectionBox: true,
      }),
    )

    this.graph.use(
      new Clipboard({
        enabled: true,
        useLocalStorage: true,
      }),
    )

    this.graph.addNode({
      x: 280,
      y: 80,
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
      x: 180,
      y: 160,
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

  onSettingsChanged = (options: State) => {
    this.options = { ...options }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onCopy = () => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      this.graph.copy(cells, this.options)
      message.success('复制成功')
    } else {
      message.info('请先选中节点再复制')
    }
  }

  onPaste = () => {
    if (this.graph.isClipboardEmpty()) {
      message.info('剪切板为空，不可粘贴')
    } else {
      const cells = this.graph.paste(this.options)
      this.graph.cleanSelection()
      this.graph.select(cells)
      message.success('粘贴成功')
    }
  }

  render() {
    return (
      <div className="clipboard-app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
          <div className="app-btns">
            <Button onClick={this.onCopy} type="primary">
              Copy Selected Cells
            </Button>
            <Button onClick={this.onPaste} type="ghost">
              Paste
            </Button>
          </div>
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

| 属性名          | 类型    | 默认值  | 必选 | 描述                                                                                                   |
|-----------------|---------|---------|------|------------------------------------------------------------------------------------------------------|
| useLocalStorage | boolean | `false` |      | 开启后被复制的节点/边同时被保存到 `localStorage` 中，浏览器刷新或者关闭后重新打开，复制/粘贴也能正常工作 |

## API

### graph.copy(...)

```ts
copy(cells: Cell[], options: CopyOptions = {}): this
```

复制节点/边。参数如下：

| 名称                    | 类型    | 必选 | 默认值 | 描述                                         |
|-------------------------|---------|:----:|--------|--------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被复制的节点/边。                             |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                   |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 `localStorage` 中。 |

### graph.cut(...)

```ts
cut(cells: Cell[], options: CopyOptions = {}): this
```

剪切节点/边。参数如下：

| 名称                    | 类型    | 必选 | 默认值 | 描述                                         |
|-------------------------|---------|:----:|--------|--------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被剪切的节点/边。                             |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                   |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 `localStorage` 中。 |

### graph.paste(...)

```ts
paste(options?: PasteOptions, graph?: Graph): Cell[]
```

粘贴，返回粘贴到画布的节点/边。参数如下：

| 名称                    | 类型                                   | 必选 | 默认值 | 描述                                 |
|-------------------------|----------------------------------------|:----:|--------|------------------------------------|
| options.useLocalStorage | boolean                                |      | -      | 是否使用 `localStorage` 中的节点/边。 |
| options.offset          | number \| `{ dx: number; dy: number }` |      | `20`   | 粘贴到画布的节点/边的偏移量。         |
| options.nodeProps       | Node.Properties                        |      | -      | 粘贴到画布的节点的额外属性。          |
| options.edgeProps       | Edge.Properties                        |      | -      | 粘贴到画布的边的额外属性。            |
| graph                   | Graph                                  |      | `this` | 粘贴的目标画布，默认粘贴到当前画布。   |

### graph.getCellsInClipboard()

```ts
getCellsInClipboard(): Cell[]
```

获取剪切板中的节点/边。

### graph.cleanClipboard()

```ts
cleanClipboard(): this
```

清空剪切板。

### graph.isClipboardEmpty()

```ts
isClipboardEmpty(): boolean
```

返回剪切板是否为空。

### graph.isClipboardEnabled()

```ts
isClipboardEnabled(): boolean
```

返回是否启用了剪切板。

### graph.enableClipboard()

```ts
enableClipboard(): this
```

启用剪切板。

### graph.disableClipboard()

```ts
disableClipboard(): this
```

禁用剪切板。

### graph.toggleClipboard(...)

```ts
toggleClipboard(enabled?: boolean): this
```

切换剪切板的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用剪切板，缺省时切换剪切板的启用状态。 |

## 事件

| 事件名称            | 参数类型            | 描述                       |
|---------------------|---------------------|--------------------------|
| `clipboard:changed` | `{ cells: Cell[] }` | 复制、剪切、清空剪切板时触发 |

```ts
graph.on('clipboard:changed', ({ cells }) => {
  console.log(cells)
})

// 我们也可以在插件实例上监听事件
clipboard.on('clipboard:changed', ({ cells }) => {
  console.log(cells)
})
```
### docs/demos/tutorial/plugins/clipboard/index.less

```less
.clipboard-app {
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

    .app-btns {
      display: flex;
      margin-top: 16px;
    }
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-btn {
    flex: 1;
    margin-right: 8px;
  }

  .ant-btn:last-child {
    margin-right: 0;
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

  .x6-widget-selection-box {
    border: 2px dashed #239edd;
  }

  .x6-widget-selection-inner {
    border: 1px solid #239edd;
  }
}
```
### docs/demos/tutorial/plugins/clipboard/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  offset: number
  useLocalStorage: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    offset: 30,
    useLocalStorage: true,
  }

  componentDidMount() {
    this.notifyChange()
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onUseLocalStorageChanged = (e: any) => {
    this.setState({ useLocalStorage: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Clipboard Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={8}>Paste Offset</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={10}
              max={80}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.useLocalStorage}
              onChange={this.onUseLocalStorageChanged}
            >
              Use LocalStorage
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
