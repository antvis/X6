---
title: "多条光滑曲线"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/edge/connector/multiple-smooth-edges/"
version: "3.x"
---

# 多条光滑曲线

[运行示例](https://x6.antv.antgroup.com/zh/examples/edge/connector/multiple-smooth-edges/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { Graph, Line, Path, Curve } from '@antv/x6'

Graph.registerConnector(
  'multi-smooth',
  (
    sourcePoint,
    targetPoint,
    routePoints,
    options: { raw?: boolean; index?: number; total?: number; gap?: number },
  ) => {
    const { index = 0, total = 1, gap = 12 } = options
    const line = new Line(sourcePoint, targetPoint)
    const centerIndex = (total - 1) / 2
    const dist = index - centerIndex
    const diff = Math.abs(dist)
    const factor = diff === 0 ? 1 : diff / dist
    const vertice = line
      .pointAtLength(line.length() / 2 + gap * factor * Math.ceil(diff))
      .rotate(90, line.getCenter())

    const points = [sourcePoint, vertice, targetPoint]
    const curves = Curve.throughPoints(points)
    const path = new Path(curves)
    return options.raw ? path : path.serialize()
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 120,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const target = graph.addNode({
  x: 400,
  y: 260,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const total = 15
for (let i = 0; i < total; i += 1) {
  graph.addEdge({
    source,
    target,
    connector: {
      name: 'multi-smooth',
      args: {
        total,
        index: i,
      },
    },
    attrs: {
      line: {
        stroke: '#722ed1',
        strokeWidth: 1,
        targetMarker: null,
      },
    },
  })
}
```
