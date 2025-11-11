---
title: 数据
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中主要介绍画布数据序列化相关的知识，通过阅读，你可以了解到}

- 如何导出数据
- 如何导入数据

:::

## 导出

我们可以调用 `graph.toJSON()` 方法来导出图中的节点和边，返回一个形如 `{ cells: [] }` 的对象，其中 `cells` 数组**按渲染顺序**保存节点和边。

其中，导出的节点结构如下：

```ts
{
  id: string,
  shape: string,
  position: {
    x: number
    y: number
  },
  size: {
    width: number
    height: number
  },
  attrs: object,
  zIndex: number,
}
```

边的结构如下：

```ts
{
  id: string,
  shape: string,
  source: object,
  target: object,
  attrs: object,
  zIndex: number,
}
```

<code id="serialization-tojson" src="@/src/tutorial/basic/serialization/to-json/index.tsx"></code>

## 导入

支持传入节点/边元数据数组 `graph.fromJSON(cells: (Node.Metadata | Edge.Metadata)[])`。

```ts
graph.fromJSON([
  {
    id: 'node1',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'rect',
  },
  {
    id: 'node2',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'Hello',
    shape: 'ellipse',
  },
  {
    id: 'edge1',
    source: 'node1',
    target: 'node2',
    shape: 'edge',
  },
])
```

或者提供一个包含 `cells`、`nodes`、`edges` 的对象，按照 `[...cells, ...nodes, ...edges]` 顺序渲染。

```ts
graph.fromJSON({
  nodes: [],
  edges: [],
})
```

通常，我们通过 `graph.fromJSON(...)` 来渲染 `graph.toJSON()` 导出的数据。

:::info{title=提示}
当数据中没有提供 `zIndex` 时，则按照节点/边在数组中的顺序渲染，也就是说越靠前的节点/边，其 `zIndex` 越小，在画布中的层级就越低。
:::
