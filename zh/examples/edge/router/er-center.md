---
title: "关系路由"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/router/er-center/"
version: "3.x"
---

# 关系路由

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/router/er-center/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 120,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const target = graph.addNode({
  x: 400,
  y: 260,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

graph.addEdge({
  source,
  target,
  // https://x6.antv.antgroup.com/api/registry/router#er
  router: {
    name: 'er',
    args: {
      offset: 'center',
    },
  },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
```
