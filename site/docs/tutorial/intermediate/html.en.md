---
title: HTML Nodes
order: 7
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="This chapter mainly introduces knowledge related to HTML nodes. By reading, you can learn"}

- How to use HTML to render node content
- How to update node content

:::

## Rendering Nodes

X6 comes with built-in `HTML` rendering capabilities, and it's very easy to use:

```ts
import { Shape } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  html() {
    const div = document.createElement('div')
    div.className = 'custom-html'
    return div
  },
})

graph.addNode({
  shape: 'custom-html',
  x: 60,
  y: 100,
})
```

In the example below, we add a hover animation effect to the `HTML` element, which would be quite complex to implement using `SVG`.

<code id="html-basic" src="@/src/tutorial/intermediate/html/basic/index.tsx"></code>

## Updating Nodes

When registering the node, provide an `effect` field—the array of the node’s `props`. When any listed prop changes, the `html` method runs again and returns a new DOM to update the node content.

```ts
Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    const { color } = cell.getData()
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.style.background = color
    return div
  },
})
```

<code id="html-update" src="@/src/tutorial/intermediate/html/update/index.tsx"></code>
