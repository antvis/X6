---
title: 序列化/反序列化
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

我们提供了 `graph.toJSON()` 和 `graph.fromJSON` 两个方法来序列化和反序列化图，下面分别介绍这两个方法。

## 序列化

我们可以调用 `graph.toJSON()` 方法来导出图中的节点和边，返回一个具有 `{ cells: [] }` 结构的对象，其中 `cells` 数组**按渲染顺序**保存节点和边。

<iframe src="/demos/tutorial/intermediate/serialization/to-json"></iframe>

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

另外，我们可以 `diff` 参数 `graph.toJSON({ diff: true })` 来导出节点和边的差异数据（与节点和边的[默认配置](../basic/cell#选项默认值)不同的部分）。

例如，我们先为矩形和椭圆设置一些默认值：

```ts
// 设置矩形的默认位置和大小
Shape.Rect.config({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
})

// 设置椭圆的默认位置和大小
Shape.Ellipse.config({
  x: 240,
  y: 180,
  width: 100,
  height: 40,
})
```

当移动节点或改变节点大小后，才会导出节点的位置或大小信息。

<iframe src="/demos/tutorial/intermediate/serialization/to-json-diff"></iframe>

## 反序列化

支持节点/边元数据数组 `graph.fromJSON(cells: (Node.Metadata | Edge.Metadata)[])`。

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
  }
])
```

或者提供一个包含 `cells`、`nodes`、`edges` 的对象，按照 `[...cells, ...nodes, ...edges]` 顺序渲染。

```ts
graph.fromJSON({
  cells?: [],
  nodes?: [],
  edges?: [],
})
```

通常，我们通过 `graph.fromJSON({ cells: [...] })` 来渲染 `graph.toJSON()` 导出的数据。

[[warning]]
| 需要注意的是，当数据中没有提供 `zIndex` 时，则按照节点/边在数组中的顺序渲染，也就是说越靠前的节点/边，其 `zIndex` 越小，在画布中的层级就越低。
