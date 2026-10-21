---
title: "添加或移除连接桩"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/port/dynamic/"
version: "3.x"
---

# 添加或移除连接桩

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/port/dynamic/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

// 文档：https://x6.antv.antgroup.com/tutorial/basic/port

const rect = graph.addNode({
  x: 240,
  y: 60,
  width: 100,
  height: 180,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    groups: {
      group1: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            fill: '#fff',
            strokeWidth: 2,
          },
        },
      },
    },
    items: [{ group: 'group1' }, { group: 'group1' }],
  },
})

const addPort = () => {
  rect.addPort({ group: 'group1' })
}

const removePort = () => {
  const ports = rect.getPorts()
  if (ports.length) {
    rect.removePortAt(ports.length - 1)
  }
}

const count = 5
let current = 0
let adding = true

const run = () => {
  if (adding && current === count) {
    adding = false
  }

  if (!adding && current === 0) {
    adding = true
  }

  if (adding && current < count) {
    addPort()
    current += 1
  }

  if (!adding && current > 0) {
    removePort()
    current -= 1
  }

  setTimeout(run, 1000)
}

run()
```
