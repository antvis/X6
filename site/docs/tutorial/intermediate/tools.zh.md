---
title: 工具
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title=在本章节中主要介绍工具相关的知识，通过阅读，你可以了解到}

- 如何为节点或边添加工具
- X6 默认内置哪些常用工具

:::

## 使用工具

创建节点/边时可以通过 [`tools`](/api/model/cell#工具集-tools) 选项来添加工具：

```ts
graph.addNode({
  tools: [
    {
      name: 'button-remove', // 工具名称
      args: {
        // 工具参数
        x: 10,
        y: 10,
      },
    },
  ],
})

// 如果无需参数，可以简写为：
graph.addNode({
  tools: ['button-remove'],
})

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
  tools: ['vertices', 'segments'],
})
```

<code id="tools-basic" src="@/src/tutorial/intermediate/tools/basic/index.tsx"></code>

节点/边创建后可以调用 [hasTool(name)](/api/model/cell#hastool)、[addTools(...)](/api/model/cell#addtools)、[removeTools()](/api/model/cell#removetools) 等方法以添加或移除工具。

<code id="tools-onhover" src="@/src/tutorial/intermediate/tools/onhover/index.tsx"></code>

## 内置工具

工具是渲染在节点/边上的小部件，用于增强交互能力。我们分别为节点和边提供以下内置工具：

### 节点

- [button](/api/registry/node-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](/api/registry/node-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的节点。
- [boundary](/api/registry/node-tool#boundary) 根据节点的包围盒渲染一个包围节点的矩形。注意：该工具仅用于可视化，不带任何交互。

### 边

- [vertices](/api/registry/edge-tool#vertices) 在路径点位置渲染小圆点；拖动小圆点可修改位置，双击可删除；在边上单击可添加路径点。
- [segments](/api/registry/edge-tool#segments) 在线段中心渲染一个工具条；拖动工具条可调整线段两端路径点的位置。
- [boundary](/api/registry/edge-tool#boundary) 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
- [button](/api/registry/edge-tool#button) 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
- [button-remove](/api/registry/edge-tool#button-remove) 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
- [source-arrowhead 和 target-arrowhead](/api/registry/edge-tool#source-arrowhead-和-target-arrowhead) 在边的起点或终点渲染一个图形（默认箭头）；可拖动该图形修改边的起点/终点。
