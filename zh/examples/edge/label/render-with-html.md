---
title: "使用 HTML 渲染 Label"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/label/render-with-html/"
version: "3.x"
---

# 使用 HTML 渲染 Label

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/label/render-with-html/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

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
