---
title: "渐变背景色"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/edge/gradient/"
version: "3.x"
---

# 渐变背景色

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/edge/gradient/)

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
  markup: [
    {
      tagName: 'path',
      selector: 'stroke',
    },
    {
      tagName: 'path',
      selector: 'fill',
    },
  ],
  connector: { name: 'rounded' },
  attrs: {
    fill: {
      connection: true,
      strokeWidth: 12,
      strokeLinecap: 'round',
      fill: 'none',
      // 渐变使用教程：https://x6.antv.vision/zh/docs/api/registry/attr#fill
      stroke: {
        type: 'linearGradient',
        stops: [
          { offset: '0%', color: '#ccc' },
          { offset: '50%', color: '#73d13d' },
          { offset: '100%', color: '#ccc' },
        ],
      },
    },
    stroke: {
      fill: 'none',
      stroke: '#237804',
      connection: true,
      strokeWidth: 14,
      strokeLinecap: 'round',
    },
  },
})
```
