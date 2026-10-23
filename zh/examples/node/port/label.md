---
title: "连接桩标签"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/port/label/"
version: "3.x"
---

# 连接桩标签

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/port/label/)

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
  ports: {
    groups: {
      group1: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            fill: '#fff',
            strokeWidth: 2,
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'group1',
        attrs: {
          text: {
            // 标签选择器
            text: 'port1', // 标签文本
          },
        },
      },
      {
        id: 'port2',
        group: 'group1',
        attrs: {
          text: {
            // 标签选择器
            text: 'port2', // 标签文本
          },
        },
      },
    ],
  },
})

rect.addPort({
  id: 'port3',
  group: 'group1',
  attrs: {
    text: {
      // 标签选择器
      text: 'port3', // 标签文本
    },
  },
})
```
