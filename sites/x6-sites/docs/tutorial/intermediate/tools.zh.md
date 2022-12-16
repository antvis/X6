---
title: 工具
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title=在本章节中，主要介绍工具相关的知识，通过阅读，你可以了解到：}

- 如何为节点或边增加工具
- X6 默认内置哪些常用工具
  :::

## 使用工具

创建节点/边时可以通过 [`tools`](/zh/docs/api/model/cell#工具集-tools) 选项来添加小工具：

```ts
graph.addNode({
  tools: [
    {
      name: "button-remove", // 工具名称
      args: {
        // 工具对应的参数
        x: 10,
        y: 10,
      },
    },
  ],
});

// 如果参数为空，可以简写为：
graph.addNode({
  tools: ["button-remove"],
});

graph.addEdge({
  source,
  target,
  vertices: [
    {
      x: 90,
      y: 160,
    },
    {
      x: 210,
      y: 160,
    },
  ],
  tools: ["vertices", "segments"],
});
```

<code id="tools-basic" src="@/src/tutorial/intermediate/tools/basic/index.tsx"></code>

节点/边创建后可以调用 [hasTool(name)](/zh/docs/api/model/cell#hastool)、[addTools(...)](/zh/docs/api/model/cell#addtools)、[removeTools()](/zh/docs/api/model/cell#removetools) 等方法来添加或删除工具。

<code id="tools-onhover" src="@/src/tutorial/intermediate/tools/onhover/index.tsx"></code>

## 内置工具

工具是渲染在节点/边上的小部件，用于增强节点/边的交互能力，我们分别为节点和边提供了以下内置工具：

节点：

- [button](/zh/docs/api/registry/node-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](/zh/docs/api/registry/node-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。
- [boundary](/zh/docs/api/registry/node-tool#boundary) 根据节点的包围盒渲染一个包围节点的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。

边：

- [vertices](/zh/docs/api/registry/edge-tool#vertices) 路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。
- [segments](/zh/docs/api/registry/edge-tool#segments) 线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。
- [boundary](/zh/docs/api/registry/edge-tool#boundary) 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [button](/zh/docs/api/registry/edge-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](/zh/docs/api/registry/edge-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
- [source-arrowhead 和 target-arrowhead](/zh/docs/api/registry/edge-tool#source-arrowhead-和-target-arrowhead) 在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。
