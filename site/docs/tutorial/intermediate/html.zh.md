---
title: HTML 节点
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title="在本章节中主要介绍 HTML 节点相关的知识，通过阅读，你可以了解到"}

- 如何使用 HTML 来渲染节点内容
- 如何更新节点内容

:::

## 渲染节点

X6 默认内置 `HTML` 渲染能力，使用方法也非常简单：

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

下面例子中，在 `HTML` 标签上加上悬浮动画效果，使用 `SVG` 实现起来会非常复杂。

<code id="html-basic" src="@/src/tutorial/intermediate/html/basic/index.tsx"></code>

## 更新节点

在注册节点时，提供 `effect` 字段（当前节点的 `prop` 数组）。当 `effect` 中任一 `prop` 发生变化时，会重新执行 `html` 方法，返回新的 DOM，从而更新节点内容。

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
