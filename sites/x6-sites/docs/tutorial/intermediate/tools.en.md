---
title: 使用工具 Tools
order: 16
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/advanced
---

工具是渲染在节点/边上的小部件，用于增强节点/边的交互能力，我们分别为节点和边提供了以下内置工具：

节点

- [button](../../api/registry/node-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](../../api/registry/node-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。
- [boundary](../../api/registry/node-tool#boundary) 根据节点的包围盒渲染一个包围节点的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。

边

- [vertices](../../api/registry/edge-tool#vertices) 路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。
- [segments](../../api/registry/edge-tool#segments) 线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。
- [boundary](../../api/registry/edge-tool#boundary) 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [button](../../api/registry/edge-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](../../api/registry/edge-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
- [source-arrowhead-和-target-arrowhead](../../api/registry/edge-tool#source-arrowhead-和-target-arrowhead) 在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。

创建节点/边时可以通过 [`tools`](../../api/model/cell#tools) 选项来添加小工具：

```ts
graph.addNode({
  ...,
  tools: [
    { name: 'boundary' },
    {
      name: 'button-remove',  // 工具名称
      args: { x: 10, y: 10 }, // 工具对应的参数
    },
  ],
})
```

添加单个小工具时可以简化为：

```ts
graph.addNode({
  ...,
  tools: 'boundary' // or { name: 'boundary' },
})
```

<iframe src="/demos/tutorial/intermediate/tools/basic"></iframe>

节点/边创建后可以调用 [hasTools(name)](../../api/model/cell#hastools)、[addTools(...)](../../api/model/cell#addtools)、[removeTools()](../../api/model/cell#removetools) 等方法来添加或删除工具。

```ts
graph.on('cell:mouseenter', ({ cell }) => {
  if (cell.isNode()) {
    cell.addTools([
      {
        name: 'boundary',
        args: {
          attrs: {
            fill: '#7c68fc',
            stroke: '#333',
            'stroke-width': 1,
            'fill-opacity': 0.2,
          },
        },
      },
      {
        name: 'button-remove',
        args: {
          x: 0,
          y: 0,
          offset: { x: 10, y: 10 },
        },
      },
    ])
  } else {
    cell.addTools(['vertices', 'segments'])
  }
})

graph.on('cell:mouseleave', ({ cell }) => {
  cell.removeTools()
})
```

<iframe src="/demos/tutorial/intermediate/tools/onhover"></iframe>
