---
title: "Clipboard"
description: "Clipboard"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/clipboard/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This section mainly introduces the Clipboard plugin. By reading, you will learn:**

- How to use copy and paste


## Usage

The clipboard is used for copying/pasting nodes and edges. Enable the feature via the `Clipboard` plugin:

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

## Demo

- After selecting a node, click the copy button to copy the node.
- Set different `offset` values to observe the effect on the node's position when pasting.
- After enabling `localStorage`, copy a node, refresh the page or reopen the browser, then click the paste button.



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



## Configuration

| Property Name       | Type    | Default Value | Required | Description                                                                                       |
|---------------------|---------|---------------|----------|---------------------------------------------------------------------------------------------------|
| useLocalStorage      | boolean | `false`       |          | When enabled, the copied nodes/edges are also saved to `localStorage`, allowing copy/paste to work after refreshing or reopening the browser. |

## API

### graph.copy(...)

```ts
copy(cells: Cell[], options: CopyOptions = {}): this
```

Copy nodes/edges. Parameters are as follows:

| Name                    | Type    | Required | Default Value | Description                                   |
|-------------------------|---------|:--------:|---------------|-----------------------------------------------|
| cells                   | Cell[]  |    ✓     |               | The nodes/edges to be copied.                |
| options.deep            | boolean |          | -             | Whether to recursively copy all child nodes/edges. |
| options.useLocalStorage | boolean |          | -             | Whether to save the copied nodes/edges in `localStorage`. |

### graph.cut(...)

```ts
cut(cells: Cell[], options: CopyOptions = {}): this
```

Cut nodes/edges. Parameters are as follows:

| Name                    | Type    | Required | Default Value | Description                                   |
|-------------------------|---------|:--------:|---------------|-----------------------------------------------|
| cells                   | Cell[]  |    ✓     |               | The nodes/edges to be cut.                   |
| options.deep            | boolean |          | -             | Whether to recursively copy all child nodes/edges. |
| options.useLocalStorage | boolean |          | -             | Whether to save the copied nodes/edges in `localStorage`. |

### graph.paste(...)

```ts
paste(options?: PasteOptions, graph?: Graph): Cell[]
```

Paste and return the nodes/edges pasted onto the canvas. Parameters are as follows:

| Name                    | Type                                   | Required | Default Value | Description                                 |
|-------------------------|----------------------------------------|:--------:|---------------|---------------------------------------------|
| options.useLocalStorage | boolean                                |          | -             | Whether to use nodes/edges from `localStorage`. |
| options.offset          | number \| `{ dx: number; dy: number }` |          | `20`         | The offset for the nodes/edges pasted onto the canvas. |
| options.nodeProps       | Node.Properties                        |          | -             | Additional properties for the nodes pasted onto the canvas. |
| options.edgeProps       | Edge.Properties                        |          | -             | Additional properties for the edges pasted onto the canvas. |
| graph                   | Graph                                  |          | `this`       | The target canvas for pasting, defaults to the current canvas. |

### graph.getCellsInClipboard()

```ts
getCellsInClipboard(): Cell[]
```

Get the nodes/edges in the clipboard.

### graph.cleanClipboard()

```ts
cleanClipboard(): this
```

Clear the clipboard.

### graph.isClipboardEmpty()

```ts
isClipboardEmpty(): boolean
```

Return whether the clipboard is empty.

### graph.isClipboardEnabled()

```ts
isClipboardEnabled(): boolean
```

Return whether the clipboard is enabled.

### graph.enableClipboard()

```ts
enableClipboard(): this
```

Enable the clipboard.

### graph.disableClipboard()

```ts
disableClipboard(): this
```

Disable the clipboard.

### graph.toggleClipboard(...)

```ts
toggleClipboard(enabled?: boolean): this
```

Toggle the clipboard's enabled state. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------|
| enabled | boolean |          | -             | Whether to enable the clipboard; if omitted, toggles the current enabled state. |

## Events

| Event Name            | Parameter Type            | Description                       |
|-----------------------|---------------------------|----------------------------------|
| `clipboard:changed`   | `{ cells: Cell[] }`      | Triggered when copying, cutting, or clearing the clipboard. |

```ts
graph.on('clipboard:changed', ({ cells }) => {
  console.log(cells)
})

// We can also listen to events on the plugin instance
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
