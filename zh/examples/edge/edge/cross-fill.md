---
title: "交错背景色"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/edge/cross-fill/"
version: "3.x"
---

# 交错背景色

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/edge/cross-fill/)

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
  source: { x: 320, y: 100 },
  target: { x: 380, y: 260 },
  vertices: [{ x: 320, y: 200 }],
  connector: { name: 'rounded' },
  markup: [
    {
      tagName: 'path',
      selector: 'wrap',
      groupSelector: 'lines',
    },
    {
      tagName: 'path',
      selector: 'line1',
      groupSelector: 'lines',
    },
    {
      tagName: 'path',
      selector: 'line2',
      groupSelector: 'lines',
    },
    {
      tagName: 'path',
      selector: 'line3',
      groupSelector: 'lines',
    },
  ],
  attrs: {
    lines: {
      connection: true,
      strokeDasharray: '10,20',
      strokeLinejoin: 'round',
      fill: 'none',
    },
    line1: {
      stroke: '#fe854f',
      strokeWidth: 8,
    },
    line2: {
      stroke: '#7c68fc',
      strokeDashoffset: 10,
      strokeWidth: 8,
    },
    line3: {
      strokeWidth: 8,
      strokeDashoffset: 20,
      stroke: '#73d13d',
      targetMarker: {
        tagName: 'path',
        stroke: '#73d13d',
        strokeWidth: 2,
        d: 'M 0 -4 0 -10 -12 0 0 10 0 4',
      },
    },
  },
})
```
