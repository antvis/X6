---
title: "Custom Random Router"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/edge/router/custom-random-router/"
version: "3.x"
---

# Custom Random Router

[Live example](https://x6.antv.antgroup.com/en/examples/edge/router/custom-random-router/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
import { Graph, Point } from '@antv/x6'

Graph.registerRouter(
  'random',
  (vertices, args, view) => {
    const BOUNCES = args.bounces || 20
    const points = vertices.map((p) => Point.create(p))

    for (let i = 0; i < BOUNCES; i += 1) {
      const sourceCorner = view.sourceBBox.getCenter()
      const targetCorner = view.targetBBox.getCenter()
      const randomPoint = Point.random(
        sourceCorner.x,
        targetCorner.x,
        sourceCorner.y,
        targetCorner.y,
      )
      points.push(randomPoint)
    }

    return points
  },
  true,
)

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
  router: {
    name: 'random',
    args: {
      bounces: 3,
    },
  },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
```
