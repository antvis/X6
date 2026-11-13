---
title: "文本"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/native-node/text-block/"
version: "3.x"
---

# 文本

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/native-node/text-block/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  x: 160,
  y: 120,
  width: 360,
  height: 120,
  shape: 'text-block',
  text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      rx: 4,
      ry: 4,
    },
  },
})
```
