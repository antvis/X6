---
title: "Mini Map"
description: "Mini Map"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/minimap/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to the Mini Map plugin. By reading, you can learn about**

- How to use the Mini Map plugin


## Usage

You can enable the mini-map with the `MiniMap` plugin. Example:

```ts
import { Graph, MiniMap } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new MiniMap({
    container: document.getElementById('minimap'),
  }),
)
```

## Demo

- Move the mini-map viewport to move the canvas.
- Zoom the mini-map viewport to zoom the canvas.



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Graph, MiniMap, Scroller } from '@antv/x6'
import { Radio } from 'antd'
import { SimpleNodeView } from './simple-view.tsx'

const options = [
  { label: '简单视图', value: 'simple' },
  { label: '详细视图', value: 'detailed' },
]

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 600,
      height: 320,
      panning: false,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Scroller({
        enabled: true,
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      }),
    )
    this.graph.use(
      new MiniMap({
        container: this.minimapContainer,
        width: 200,
        height: 160,
        padding: 10,
      }),
    )

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

  onMinimapViewChange = (val: string) => {
    this.graph.disposePlugins('minimap')
    if (val === 'simple') {
      this.graph.use(
        new MiniMap({
          container: this.minimapContainer,
          width: 200,
          height: 160,
          padding: 10,
          graphOptions: {
            createCellView(cell) {
              // 可以返回三种类型数据
              // 1. null: 不渲染
              // 2. undefined: 使用 X6 默认渲染方式
              // 3. CellView: 自定义渲染
              if (cell.isEdge()) {
                return null
              }
              if (cell.isNode()) {
                return SimpleNodeView
              }
            },
          },
        }),
      )
    } else {
      this.graph.use(
        new MiniMap({
          container: this.minimapContainer,
          width: 200,
          height: 160,
          padding: 10,
        }),
      )
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div className="minimap-app">
        <div className="app-btns">
          <Radio.Group
            options={options}
            onChange={(e) => this.onMinimapViewChange(e.target.value)}
            defaultValue={'detailed'}
            optionType="button"
          />
        </div>
        <div className="app-content" ref={this.refContainer} />
        <div className="app-minimap" ref={this.refMiniMapContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Options

| Property Name | Type          | Default Value | Required | Description                      |
|---------------|---------------|---------------|----------|----------------------------------|
| container     | HTMLElement   | -             | ✓️        | The container to mount the mini-map |
| width         | number        | `300`         |          | The width of the mini-map        |
| height        | number        | `200`         |          | The height of the mini-map       |
| padding       | number        | `10`          |          | The padding margin of the mini-map container |
| scalable      | boolean       | `true`        |          | Whether scaling is enabled        |
| minScale      | number        | `0.01`        |          | The minimum scale ratio           |
| maxScale      | number        | `16`          |          | The maximum scale ratio           |
| graphOptions  | Graph.Options | `{}`          |          | Options for the internal mini-map Graph |
| createGraph   | (options: Graph.Options) => Graph | `options => new Graph(options)` |          | Custom method to create the internal mini-map Graph |
### docs/demos/tutorial/plugins/minimap/index.less

```less
.minimap-app {
  position: relative;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-btns {
    margin-bottom: 8px;
  }

  .app-minimap {
    position: absolute;
    bottom: 0;
    left: 620px;
    width: 200px;
    height: 150px;
  }

  .x6-widget-minimap-viewport {
    border: 2px solid #8f8f8f;
  }

  .x6-widget-minimap-viewport-zoom {
    border: 2px solid #8f8f8f;
  }
}
```
### docs/demos/tutorial/plugins/minimap/simple-view.tsx

```tsx
import { NodeView } from '@antv/x6'

export class SimpleNodeView extends NodeView {
  protected renderMarkup() {
    return this.renderJSONMarkup({
      tagName: 'rect',
      selector: 'body',
    })
  }

  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#8f8f8f',
      },
    })
  }
}
```
