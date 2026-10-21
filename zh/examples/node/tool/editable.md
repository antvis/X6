---
title: "文本编辑"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/tool/editable/"
version: "3.x"
---

# 文本编辑

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/tool/editable/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const container = document.getElementById('container')!
const graph = new Graph({
  container,
  grid: true,
})

const source = graph.addNode({
  x: 180,
  y: 60,
  width: 100,
  height: 40,
  attrs: {
    body: {
      stroke: '#5F95FF',
      fill: '#EFF4FF',
      strokeWidth: 1,
    },
  },
  tools: [
    {
      name: 'node-editor',
      args: {
        attrs: {
          backgroundColor: '#EFF4FF',
        },
      },
    },
  ],
})

const target = graph.addNode({
  x: 320,
  y: 250,
  width: 100,
  height: 40,
  attrs: {
    body: {
      stroke: '#5F95FF',
      fill: '#EFF4FF',
      strokeWidth: 1,
    },
  },
  tools: [
    {
      name: 'node-editor',
      args: {
        attrs: {
          backgroundColor: '#EFF4FF',
        },
      },
    },
  ],
})

graph.addEdge({
  source,
  target,
  attrs: {
    line: {
      stroke: '#A2B1C3',
      strokeWidth: 2,
    },
  },
  tools: [
    {
      name: 'edge-editor',
      args: {
        attrs: {
          backgroundColor: '#fff',
        },
      },
    },
  ],
})
```
