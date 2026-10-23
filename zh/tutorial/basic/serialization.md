---
title: "数据"
description: "数据"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/basic/serialization/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍画布数据序列化相关的知识，通过阅读，你可以了解到**

- 如何导出数据
- 如何导入数据


## 导出

我们可以调用 `graph.toJSON()` 方法来导出图中的节点和边，返回一个形如 `{ cells: [] }` 的对象，其中 `cells` 数组**按渲染顺序**保存节点和边。

其中，导出的节点结构如下：

```ts
{
  id: string,
  shape: string,
  position: {
    x: number
    y: number
  },
  size: {
    width: number
    height: number
  },
  attrs: object,
  zIndex: number,
}
```

边的结构如下：

```ts
{
  id: string,
  shape: string,
  source: object,
  target: object,
  attrs: object,
  zIndex: number,
}
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'


hljs.registerLanguage('json', json)

export default class Example extends React.Component {
  private container: HTMLDivElement
  private code: HTMLElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
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

    const target = graph.addNode({
      x: 240,
      y: 180,
      width: 100,
      height: 40,
      shape: 'ellipse',
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

    graph.addEdge({
      source,
      target,
      label: 'X6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    const parse = () => {
      this.code.innerText = JSON.stringify(graph.toJSON(), null, 2)
      hljs.highlightBlock(this.code)
    }

    parse()

    graph.on('cell:change:*', parse)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refCode = (code: HTMLElement) => {
    this.code = code
  }

  render() {
    return (
      <div className="to-json-app">
        <div className="app-side">
          <pre>
            <code className="language-json" ref={this.refCode} />
          </pre>
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



## 导入

支持传入节点/边元数据数组 `graph.fromJSON(cells: (Node.Metadata | Edge.Metadata)[])`。

```ts
graph.fromJSON([
  {
    id: 'node1',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'rect',
  },
  {
    id: 'node2',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'ellipse',
  },
  {
    id: 'edge1',
    source: 'node1',
    target: 'node2',
    shape: 'edge',
  },
])
```

或者提供一个包含 `cells`、`nodes`、`edges` 的对象，按照 `[...cells, ...nodes, ...edges]` 顺序渲染。

```ts
graph.fromJSON({
  nodes: [],
  edges: [],
})
```

通常，我们通过 `graph.fromJSON(...)` 来渲染 `graph.toJSON()` 导出的数据。

> **提示**

当数据中没有提供 `zIndex` 时，则按照节点/边在数组中的顺序渲染，也就是说越靠前的节点/边，其 `zIndex` 越小，在画布中的层级就越低。
### docs/demos/tutorial/basic/serialization/to-json/index.less

```less
.to-json-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    width: 320px;
    height: 280px;
    overflow: auto;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
