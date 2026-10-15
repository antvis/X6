---
title: "智能路由"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/router/manhattan/"
version: "3.x"
---

# 智能路由

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/router/manhattan/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph, Node, Edge, EdgeView } from '@antv/x6'

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

const obstacles: Node[] = []
const obstacle = graph.addNode({
  x: 240,
  y: 120,
  width: 80,
  height: 30,
  attrs: {
    body: {
      fill: '#ffd591',
      stroke: '#ffa940',
    },
  },
})

let edge: Edge

const update = () => {
  const edgeView = graph.findViewByCell(edge) as EdgeView
  edgeView.update()
}

obstacles.push(obstacle)
obstacles.push(graph.addNode(obstacle.clone().translate(100, 80)))
obstacles.push(graph.addNode(obstacle.clone().translate(-100, 140)))
obstacles.forEach((obstacle) => obstacle.on('change:position', update))

edge = graph.addEdge({
  source,
  target,
  router: {
    name: 'manhattan',
    args: {
      startDirections: ['bottom'],
      endDirections: ['top'],
    },
  },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})

update()

graph.translate(50, 0)
```
