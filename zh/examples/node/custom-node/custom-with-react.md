---
title: "使用 React 自定节点"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/custom-node/custom-with-react/"
version: "3.x"
---

# 使用 React 自定节点

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/custom-node/custom-with-react/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```tsx
import React from 'react'
import { Graph, Color } from '@antv/x6'
import { register } from '@antv/x6-react-shape'

const MyComponent = ({ node }) => {
  const color = node.prop('color')
  return (
    <div
      style={{
        color: '#fff',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        lineHeight: '50px',
        borderRadius: 4,
        background: color,
      }}
    >
      {color}
    </div>
  )
}

register({
  shape: 'custom-node',
  width: 120,
  height: 50,
  effect: ['color'],
  component: MyComponent,
})

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 120,
  y: 50,
  shape: 'custom-node',
})

const target = graph.addNode({
  x: 320,
  y: 260,
  shape: 'custom-node',
})

graph.addEdge({
  source,
  target,
})

const update = () => {
  source.prop('color', Color.randomHex())
  target.prop('color', Color.randomHex())
  setTimeout(update, 1000)
}

update()
```
