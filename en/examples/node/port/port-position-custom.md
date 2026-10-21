---
title: "Custom the Position of Ports"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/node/port/port-position-custom/"
version: "3.x"
---

# Custom the Position of Ports

[Live example](https://x6.antv.antgroup.com/en/examples/node/port/port-position-custom/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
import { Graph } from '@antv/x6'

Graph.registerPortLayout(
  'sin',
  (portsPositionArgs, elemBBox) => {
    return portsPositionArgs.map((_, index) => {
      const step = -Math.PI / 8
      const y = Math.sin(index * step) * 50
      return {
        position: {
          x: index * 12,
          y: y + elemBBox.height,
        },
        angle: 0,
      }
    })
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const rect = graph.addNode({
  x: 100,
  y: 60,
  width: 280,
  height: 120,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    groups: {
      sin: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
        position: 'sin',
      },
    },
  },
})

Array.from({ length: 24 }).forEach(() => {
  rect.addPort({ group: 'sin' })
})
```
