---
title: "Circular"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/layout/general/circle/"
version: "3.x"
---

# Circular

[Live example](https://x6.antv.antgroup.com/en/examples/layout/general/circle/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
import { Graph, Model } from '@antv/x6'
import { CircularLayout } from '@antv/layout'

const data: Model.FromJSONData = {
  nodes: [],
}

for (let i = 1; i <= 16; i++) {
  data.nodes!.push({
    id: `${i}`,
    shape: 'circle',
    width: 30,
    height: 30,
    label: `${i}`,
    attrs: {
      body: {
        stroke: 'transparent',
        fill: '#5F95FF',
      },
      label: {
        fill: '#fff',
      },
    },
  })
}

const graph = new Graph({
  container: document.getElementById('container')!,
})

const circularLayout = new CircularLayout({
  type: 'circular',
  center: [350, 250],
})
const model = circularLayout.layout(data)

graph.fromJSON(model)
```
