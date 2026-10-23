---
title: "拖入/拖出父节点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/group/embedding-by-dnd/"
version: "3.x"
---

# 拖入/拖出父节点

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/group/embedding-by-dnd/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  embedding: {
    enabled: true,
    findParent({ node }) {
      const bbox = node.getBBox()
      return this.getNodes().filter((node) => {
        const data = node.getData<any>()
        if (data && data.parent) {
          const targetBBox = node.getBBox()
          return bbox.isIntersectWithRect(targetBBox)
        }
        return false
      })
    },
  },
  highlighting: {
    embedding: {
      name: 'stroke',
      args: {
        padding: -1,
        attrs: {
          stroke: '#73d13d',
        },
      },
    },
  },
})

graph.addNode({
  x: 40,
  y: 140,
  width: 100,
  height: 50,
  label: 'Child\n(unembed)',
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

graph.addNode({
  x: 500,
  y: 100,
  width: 100,
  height: 50,
  label: 'Child\n(unembed)',
  zIndex: 10,
  attrs: {
    body: {
      stroke: 'none',
      fill: '#47C769',
    },
    label: {
      fill: '#fff',
      fontSize: 12,
    },
  },
})

graph.addNode({
  x: 200,
  y: 80,
  width: 240,
  height: 160,
  zIndex: 1,
  label: 'Parent',
  attrs: {
    body: {
      fill: '#fffbe6',
      stroke: '#ffe7ba',
    },
    label: {
      fontSize: 12,
    },
  },
  data: {
    parent: true,
  },
})

graph.on('node:change:parent', ({ node }) => {
  node.attr({
    label: {
      text: 'Child\n(embed)',
    },
  })
})
```
