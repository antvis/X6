---
title: "限制子节点的移动范围"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/group/restrict-movement/"
version: "3.x"
---

# 限制子节点的移动范围

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/group/restrict-movement/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  translating: {
    restrict(view) {
      const cell = view.cell
      if (cell.isNode()) {
        const parent = cell.getParent()
        if (parent) {
          return parent.getBBox()
        }
      }

      return null
    },
  },
})

const child = graph.addNode({
  x: 120,
  y: 80,
  width: 80,
  height: 40,
  label: 'Child',
  zIndex: 10,
  attrs: {
    body: {
      stroke: 'none',
      fill: '#3199FF',
    },
    label: {
      fill: '#fff',
      fontSize: 12,
    },
  },
})

const parent = graph.addNode({
  x: 40,
  y: 40,
  width: 240,
  height: 160,
  zIndex: 1,
  label: 'Parent\n(try to move me)',
  attrs: {
    label: {
      refY: 120,
      fontSize: 12,
    },
    body: {
      fill: '#fffbe6',
      stroke: '#ffe7ba',
    },
  },
})

parent.addChild(child)
```
