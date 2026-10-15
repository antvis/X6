---
title: "调整顶点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/tool/vertices/"
version: "3.x"
---

# 调整顶点

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/tool/vertices/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  onToolItemCreated({ name, cell, tool }) {
    if (name === 'vertices' && cell === edge2) {
      const options = (tool as any).options
      if (options && options.index % 2 === 1) {
        tool.setAttrs({ fill: 'red' })
      }
    }
  },
})

graph.addEdge({
  source: { x: 40, y: 40 },
  target: { x: 380, y: 40 },
  vertices: [
    { x: 40, y: 80 },
    { x: 200, y: 80 },
    { x: 200, y: 40 },
  ],
  attrs: {
    line: {
      stroke: '#3c4260',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
  tools: {
    name: 'vertices',
    args: {
      attrs: { fill: '#666' },
    },
  },
})

const edge2 = graph.addEdge({
  source: { x: 40, y: 160 },
  target: { x: 380, y: 160 },
  vertices: [
    { x: 40, y: 200 },
    { x: 200, y: 200 },
    { x: 200, y: 160 },
  ],
  connector: 'smooth',
  attrs: {
    line: {
      stroke: '#3c4260',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
})

graph.on('edge:mouseenter', ({ cell }) => {
  if (cell === edge2) {
    cell.addTools('vertices', 'onhover')
  }
})

graph.on('edge:mouseleave', ({ cell }) => {
  if (cell.hasTools('onhover')) {
    cell.removeTools()
  }
})
```
