---
title: "ER Center Router"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/edge/router/er-center/"
version: "3.x"
---

# ER Center Router

[Live example](https://x6.antv.antgroup.com/en/examples/edge/router/er-center/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

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
