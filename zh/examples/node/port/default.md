---
title: "默认连接桩"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/port/default/"
version: "3.x"
---

# 默认连接桩

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/port/default/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

// 文档：https://x6.antv.antgroup.com/tutorial/basic/port

const rect = graph.addNode({
  x: 240,
  y: 60,
  width: 100,
  height: 180,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: [
    // 默认样式
    { id: 'port1' },
    // 自定义连接桩样式
    {
      id: 'port2',
      attrs: {
        circle: {
          magnet: true,
          r: 8,
          stroke: '#31d0c6',
          fill: '#fff',
          strokeWidth: 2,
        },
      },
    },
  ],
})

rect.addPort({
  id: 'port3',
  attrs: {
    circle: {
      r: 6,
      magnet: true,
      stroke: '#31d0c6',
      fill: '#fff',
      strokeWidth: 2,
    },
  },
})
```
