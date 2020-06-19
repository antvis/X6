---
title: 节点 Node
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

在[快速上手](../getting-started)案例中，我们通过 JSON 数据来快速添加两个矩形节点到画布中，接下来我们将学习**如何创建节点**以及**如何定制节点外观**。

## 创建节点

### graph.fromJSON



### graph.addNode



### 方式三 数据

```ts
import { StandardShape } from '@antv/x6'

const rect = new StandardShape.Rect()

rect.position(100, 200)
  .resize(80, 40)
  .attr({
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  })
  .addTo(graph)


const rect = new StandardShape.Rect({
  size: { width: 80, height: 40 },
  position: { x: 100, y: 200 },
  attrs: { 
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  },
})

const rect = new StandardShape.Rect({
  x: 100, 
  y: 200,
  width: 80, 
  height: 40,
  attrs: { 
    body: {
      fill: 'blue',
    },
    label: {
      text: 'Hello',
      fill: 'white',
    },
  },
})

```




## 节点样式

