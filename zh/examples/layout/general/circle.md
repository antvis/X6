---
title: "环形布局"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/layout/general/circle/"
version: "3.x"
---

# 环形布局

[运行示例](https://x6.antv.antgroup.com/zh/examples/layout/general/circle/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph, Model } from '@antv/x6'
import { CircularLayout } from '@antv/layout'

const data: Model.FromJSONData = {
  nodes: [],
}

for (let i = 1; i <= 16; i++) {
  data.nodes!.push({
    id: `${i}`,
    shape: 'circle',
    width: 30,
    height: 30,
    label: `${i}`,
    attrs: {
      body: {
        stroke: 'transparent',
        fill: '#5F95FF',
      },
      label: {
        fill: '#fff',
      },
    },
  })
}

const graph = new Graph({
  container: document.getElementById('container')!,
})

const circularLayout = new CircularLayout({
  type: 'circular',
  center: [350, 250],
})
const model = circularLayout.layout(data)

graph.fromJSON(model)
```
