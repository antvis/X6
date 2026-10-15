---
title: "调整线段"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/tool/segments/"
version: "3.x"
---

# 调整线段

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/tool/segments/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
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
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  },
})

graph.addEdge({
  source: { x: 40, y: 160 },
  target: { x: 380, y: 160 },
  vertices: [
    { x: 40, y: 200 },
    { x: 200, y: 200 },
    { x: 200, y: 160 },
  ],
  attrs: {
    line: {
      stroke: '#3c4260',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
  connector: 'smooth',
  tools: {
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  },
})
```
