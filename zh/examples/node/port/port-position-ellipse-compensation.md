---
title: "沿圆弧自动旋转的连接桩"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/port/port-position-ellipse-compensation/"
version: "3.x"
---

# 沿圆弧自动旋转的连接桩

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/port/port-position-ellipse-compensation/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const node = graph.addNode({
  x: 100,
  y: 60,
  width: 400,
  height: 200,
  shape: 'ellipse',
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
    label: {
      text: 'outside',
      fill: '#888',
      fontSize: 12,
    },
  },
  ports: {
    groups: {
      a: {
        markup: [
          {
            tagName: 'rect',
            selector: 'rect',
          },
          {
            tagName: 'circle',
            selector: 'dot',
          },
        ],
        position: {
          name: 'ellipseSpread',
          args: { start: 0, dr: 0, compensateRotate: true },
        },
        label: {
          position: 'radial',
        },
        attrs: {
          rect: {
            stroke: '#31d0c6',
            fill: '#ffffff',
            strokeWidth: 2,
            width: 20,
            height: 20,
            x: -10,
            y: -10,
          },
          dot: {
            fill: '#fe854f',
            r: 2,
          },
          text: {
            fill: '#6a6c8a',
          },
        },
      },
    },
  },
})

Array.from({ length: 24 }).forEach((_, index) => {
  node.addPort({
    group: 'a',
    id: `${index}`,
    attrs: { text: { text: index } },
  })
})

function toggle() {
  const path = 'ports/groups/a/position/args/compensateRotate'
  const current = node.prop<boolean>(path)
  node.prop('attrs/label/text', `compensateRotate: ${!current}`)
  node.prop(path, !current)

  setTimeout(toggle, 1000)
}

toggle()
```
