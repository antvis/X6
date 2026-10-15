---
title: "Restrict the Movement of Child Nodes"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/node/group/restrict-movement/"
version: "3.x"
---

# Restrict the Movement of Child Nodes

[Live example](https://x6.antv.antgroup.com/en/examples/node/group/restrict-movement/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

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
