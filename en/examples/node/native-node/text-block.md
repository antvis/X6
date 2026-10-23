---
title: "Text Block"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/node/native-node/text-block/"
version: "3.x"
---

# Text Block

[Live example](https://x6.antv.antgroup.com/en/examples/node/native-node/text-block/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  x: 160,
  y: 120,
  width: 360,
  height: 120,
  shape: 'text-block',
  text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      rx: 4,
      ry: 4,
    },
  },
})
```
