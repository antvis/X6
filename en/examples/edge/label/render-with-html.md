---
title: "Use HTML to Render Label"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/examples/edge/label/render-with-html/"
version: "3.x"
---

# Use HTML to Render Label

[Live example](https://x6.antv.antgroup.com/en/examples/edge/label/render-with-html/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
import { Graph, Markup } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  onEdgeLabelRendered: (args) => {
    const { selectors } = args
    const content = selectors.foContent as HTMLDivElement
    if (content) {
      const btn = document.createElement('button')
      btn.appendChild(document.createTextNode('HTML Button'))
      btn.style.width = '100%'
      btn.style.height = '100%'
      btn.style.lineHeight = '1'
      btn.style.borderRadius = '4px'
      btn.style.textAlign = 'center'
      btn.style.color = '#000'
      btn.style.background = '#ffd591'
      btn.style.border = '2px solid #ffa940'
      btn.addEventListener('click', () => {
        alert('clicked')
      })
      content.appendChild(btn)
    }
  },
})

graph.addEdge({
  source: [170, 160],
  target: [550, 160],
  defaultLabel: {
    markup: Markup.getForeignObjectMarkup(),
    attrs: {
      fo: {
        width: 120,
        height: 30,
        x: 60,
        y: -15,
      },
    },
  },
  label: {
    position: 0.25,
  },
  attrs: {
    line: {
      stroke: '#ccc',
    },
  },
})
```
