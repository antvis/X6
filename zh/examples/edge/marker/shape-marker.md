---
title: "使用图形元素自定义箭头"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/marker/shape-marker/"
version: "3.x"
---

# 使用图形元素自定义箭头

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/marker/shape-marker/)

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
  source: { x: 240, y: 120 },
  target: { x: 420, y: 80 },
  vertices: [{ x: 320, y: 170 }],
  connector: { name: 'rounded' },
  attrs: {
    line: {
      sourceMarker: {
        tagName: 'circle',
        r: 12,
        cx: 12,
        fill: '#ffd591',
        stroke: '#ffa940',
      },
      targetMarker: {
        tagName: 'ellipse',
        rx: 20,
        ry: 10,
        cx: 20,
        fill: '#73d13d',
        stroke: '#237804',
      },
    },
  },
})
```
