---
title: HTML Nodes
order: 7
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="In this chapter, you will learn"}

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

## Node Updates

You might be curious about how to dynamically update the content of a node if it is rendered dynamically. It's actually quite simple. When registering the node, you provide an `effect` field, which is an array of the current node's `prop`. When any of the `prop` included in the `effect` changes, the `html` method will be re-executed, returning a new DOM element to update the node's content.

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
