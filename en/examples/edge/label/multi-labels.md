---
title: "Render Multiple Labels"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/edge/label/multi-labels/"
version: "3.x"
---

# Render Multiple Labels

[Live example](https://x6.antv.antgroup.com/en/examples/edge/label/multi-labels/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addEdge({
  source: [170, 160],
  target: [550, 160],
  attrs: {
    line: {
      stroke: '#ccc',
    },
  },
  labels: [
    // label1
    {
      markup: [
        {
          tagName: 'rect',
          selector: 'labelBody',
        },
        {
          tagName: 'text',
          selector: 'labelText',
        },
      ],
      attrs: {
        labelText: {
          text: 'Label 1',
          fill: '#ffa940',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
        },
        labelBody: {
          ref: 'labelText',
          refX: -8,
          refY: -5,
          refWidth: '100%',
          refHeight: '100%',
          refWidth2: 16,
          refHeight2: 10,
          stroke: '#ffa940',
          fill: '#fff',
          strokeWidth: 2,
          rx: 5,
          ry: 5,
        },
      },
      position: {
        distance: 0.3,
        args: {
          keepGradient: true,
          ensureLegibility: true,
        },
      },
    },
    // label 2
    {
      markup: [
        {
          tagName: 'ellipse',
          selector: 'labelBody',
        },
        {
          tagName: 'text',
          selector: 'labelText',
        },
      ],
      attrs: {
        labelText: {
          text: 'Label 2',
          fill: '#31d0c6',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
        },
        labelBody: {
          ref: 'labelText',
          refRx: '80%',
          refRy: '80%',
          stroke: '#31d0c6',
          fill: '#fff',
          strokeWidth: 2,
        },
      },
      position: {
        distance: 0.7,
        angle: 45,
      },
    },
  ],
})
```
