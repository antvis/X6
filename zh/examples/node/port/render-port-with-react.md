---
title: "使用 React 渲染连接桩"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/port/render-port-with-react/"
version: "3.x"
---

# 使用 React 渲染连接桩

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/port/render-port-with-react/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```tsx
import { Graph, Markup } from '@antv/x6'
import { Tooltip } from 'antd'
import insertCss from 'insert-css'
import React from 'react'
import { createRoot } from 'react-dom/client'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  onPortRendered(args) {
    const selectors = args.contentSelectors
    const container = selectors && selectors.foContent
    if (container) {
      createRoot(container as HTMLElement).render(
        (
          <Tooltip title="port">
            <div className="my-port" />
          </Tooltip>
        ) as any,
      )
    }
  },
})

graph.addNode({
  x: 100,
  y: 60,
  width: 280,
  height: 120,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  portMarkup: [Markup.getForeignObjectMarkup()],
  ports: {
    items: [
      { group: 'in', id: 'in1' },
      { group: 'in', id: 'in2' },
      { group: 'out', id: 'out1' },
      { group: 'out', id: 'out2' },
    ],
    groups: {
      in: {
        position: { name: 'top' },
        attrs: {
          fo: {
            width: 12,
            height: 12,
            x: -6,
            y: -6,
            magnet: 'true',
          },
        },
        zIndex: 1,
      },
      out: {
        position: { name: 'bottom' },
        attrs: {
          fo: {
            width: 12,
            height: 12,
            x: -6,
            y: -6,
            magnet: 'true',
          },
        },
        zIndex: 1,
      },
    },
  },
})

insertCss(`
  .my-port {
    width: 100%;
    height: 100%;
    border: 2px solid #31d0c6;
    border-radius: 100%;
    background: #fff;
  }
`)
```
