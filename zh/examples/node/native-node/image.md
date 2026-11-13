---
title: "Image"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/node/native-node/image/"
version: "3.x"
---

# Image

[运行示例](https://x6.antv.antgroup.com/zh/examples/node/native-node/image/)

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
  shape: 'image',
  x: 320,
  y: 120,
  width: 94,
  height: 28,
  imageUrl:
    'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
})
```
