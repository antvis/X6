---
title: "Keyboard"
description: "Keyboard"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/keyboard/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This section mainly introduces the Keyboard plugin. By reading, you will learn:**

- How to bind keyboard shortcuts on the canvas


## Usage

Enable keyboard shortcuts via the `Keyboard` plugin:

```ts
import { Graph, Keyboard } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Keyboard({
    enabled: true,
  }),
)
```

## Demo



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Graph, Clipboard, Keyboard, Selection } from '@antv/x6'

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
      new Clipboard({
        enabled: true,
      }),
    )
    this.graph.use(
      new Selection({
        enabled: true,
        showNodeSelectionBox: true,
      }),
    )
    this.graph.use(
      new Keyboard({
        enabled: true,
        global: true,
      }),
    )

    this.graph.addNode({
      x: 280,
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

    this.graph.bindKey('ctrl+c', () => {
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.copy(cells)
      }
      return false
    })

    this.graph.bindKey('ctrl+v', () => {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 32 })
        this.graph.cleanSelection()
        this.graph.select(cells)
      }
      return false
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="keyboard-app">
        <div className="app-info">
          <p>
            <span>Ctrl + C</span>Copy Cell
            <span style={{ marginLeft: 24 }}>Ctrl + V</span>Paste Cell
          </p>
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

| Property Name | Type                                      | Default Value | Required | Description                                                                                                                                       |
|---------------|-------------------------------------------|---------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| global        | boolean                                   | `false`       |          | Whether to use global keyboard events. When set to `true`, keyboard events are bound to `document`; otherwise they are bound to the canvas container. When bound to the canvas container, it must be focused to trigger keyboard events. |
| format        | `(this: Graph, key: string) => string`    | -             |          | Format the key string when binding or unbinding keyboard events.                                                                                   |
| guard         | `(this: Graph, e: KeyboardEvent) => boolean` | -          |          | Determine whether a keyboard event should be processed. If it returns `false`, the corresponding keyboard event is ignored.                       |

The `format` and `guard` configurations are used as follows:

```ts
graph.use(
  new Keyboard({
    enabled: true,
    format(key) {
      return key.replace(/\s/g, '').replace('cmd', 'command')
    },
  }),
)
// The statement below is equivalent to graph.bindKey('command', (e) => { })
graph.bindKey('cmd', (e) => {})

graph.use(
  new Keyboard({
    enabled: true,
    guard(this: Graph, e: KeyboardEvent) {
      if (e.altKey) {
        // Ignore all keyboard events when the alt key is pressed
        return false
      }
      return true
    },
  }),
)
```

## API

### graph.bindKey(...)

```ts
bindKey(
  keys: string | string[],
  callback: (e: KeyboardEvent) => void,
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

Bind keyboard shortcuts.

### graph.unbindKey(...)

```ts
unbindKey(
  keys: string | string[],
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

Unbind keyboard shortcuts.

### graph.clearKeys()

```ts
clearKeys(): this
```

Clear all keyboard shortcuts.

### graph.triggerKey()

```ts
triggerKey(
  keys: string,
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

Manually trigger keyboard shortcuts.

### graph.isKeyboardEnabled()

```ts
isKeyboardEnabled(): boolean
```

Returns whether keyboard events are enabled.

### graph.enableKeyboard()

```ts
enableKeyboard(): this
```

Enable keyboard events.

### graph.disableKeyboard()

```ts
disableKeyboard(): this
```

Disable keyboard events.

### graph.toggleKeyboard(...)

```ts
toggleKeyboard(enabled?: boolean): this
```

Toggle the enabled state of keyboard events. The parameters are as follows:

| Name     | Type    | Required | Default Value | Description                                           |
|----------|---------|:--------:|---------------|------------------------------------------------------|
| enabled  | boolean |          | -             | Whether to enable keyboard events; if omitted, toggles the current enabled state. |
### docs/demos/tutorial/plugins/keyboard/index.less

```less
.keyboard-app {
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-info {
    bottom: 0;
    margin: 0;
    padding: 0 8px;
  }

  .app-info span {
    display: inline-block;
    margin-right: 8px;
    padding: 2px 8px;
    font-size: 12px;
    line-height: 18px;
    background: #e9e9e9;
    border-radius: 4px;
  }

  .app-content {
    width: 100%;
    height: 280px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .x6-widget-selection-box {
    border: 2px dashed #239edd;
  }

  .x6-widget-selection-inner {
    border: 1px solid #239edd;
  }
}
```
