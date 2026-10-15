---
title: "Image"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/node/native-node/image/"
version: "3.x"
---

# Image

[Live example](https://x6.antv.antgroup.com/en/examples/node/native-node/image/)

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
  shape: 'image',
  x: 320,
  y: 120,
  width: 94,
  height: 28,
  imageUrl:
    'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
})
```
