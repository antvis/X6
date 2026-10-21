---
title: "使用 React 渲染 Label"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/label/render-with-react/"
version: "3.x"
---

# 使用 React 渲染 Label

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/label/render-with-react/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```tsx
import { Graph, Markup } from '@antv/x6'
import React from 'react'
import { createRoot } from 'react-dom/client'

class Label extends React.Component {
  onClick = () => {
    alert('clicked')
  }

  render() {
    return (
      <button
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          color: '#000',
          background: '#ffd591',
          border: '2px solid #ffa940',
          borderRadius: 4,
        }}
        onClick={this.onClick}
      >
        React Button
      </button>
    )
  }
}

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  onEdgeLabelRendered: (args) => {
    const { selectors } = args
    const content = selectors.foContent as HTMLDivElement
    if (content) {
      createRoot(content).render(<Label />)
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
