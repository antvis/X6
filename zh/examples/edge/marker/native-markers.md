---
title: "内置箭头"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/marker/native-markers/"
version: "3.x"
---

# 内置箭头

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/marker/native-markers/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

// 内置箭头：https://x6.antv.vision/zh/docs/tutorial/intermediate/marker#%E5%86%85%E7%BD%AE%E7%AE%AD%E5%A4%B4

const markers = [
  ['block', { size: 6 }],
  ['classic', { size: 6 }],
  ['diamond', { size: 8 }],
  ['circle', { size: 6 }],
  ['circlePlus', { size: 6 }],
  ['ellipse', { rx: 6, ry: 4 }],
  ['cross', { size: 8, offset: 1 }],
  ['async', { size: 8, offset: 1 }],
]

markers.forEach(([marker, args], i) => {
  graph.addEdge({
    sourcePoint: [220, 30 + i * 40],
    targetPoint: [500, 30 + i * 40],
    label: marker,
    attrs: {
      line: {
        sourceMarker: {
          args,
          name: marker,
        },
        targetMarker: {
          args,
          name: marker,
        },
        strokeWidth: 1,
      },
    },
  })
})
```
