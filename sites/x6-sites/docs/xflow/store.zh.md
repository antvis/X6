---
title: Store
order: 4
redirect_from:
 - /zh/docs
 - /zh/docs/xflow
---

xflow 对画布的数据进行了统一的管理，整个画布的数据存在一个 `store` 中，这让开发变得非常容易

你可以使用 [useGraphStore](/xflow/hooks/use-graph-store) 方便快捷的操作 `store` , 从而更新画布数据, 实现更新画布

## 初始化状态

### `initData(data, options)`

这个函数用于初始化状态管理器，设置初始的节点和边。

参数：

- `data`：一个对象，包含`nodes`和`edges`两个数组，分别存储节点和边的数据。
- `options`：一个可选的对象，当设置为`{ silent: true }`时，初始化的操作不会被记录在变动列表`changeList`中。

## 节点操作

### `addNodes(ns, options)`

添加新的节点到状态管理器中。

参数：

- `ns`：一个节点对象数组。
- `options`：一个可选的对象。当`{ silent: true }`时，添加操作不会被记录在变动列表中。

### `removeNodes(ids, options)`

通过ID数组移除节点。

参数：

- `ids`：一个包含节点ID的数组。
- `options`：一个可选的对象。当`{ silent: true }`时，移除操作不会被记录在变动列表中。

### `updateNode(id, data, options)`

通过ID更新某个节点。不允许修改节点的`id`或`shape`属性。

参数：

- `id`：要更新的节点的ID。
- `data`：一个对象或者一个函数，包含要更新的数据。
- `options`：一个可选的对象。当`{ silent: true }`时，更新操作不会被记录在变动列表中。

## 边操作

### `addEdges(es, options)`

添加新的边到状态管理器中。

参数：

- `es`：一个边对象数组。
- `options`：一个可选的对象。当`{ silent: true }`时，添加操作不会被记录在变动列表中。

### `removeEdges(ids, options)`

通过ID数组移除边。

参数：

- `ids`：一个包含边ID的数组。
- `options`：一个可选的对象。当`{ silent: true }`时，移除操作不会被记录在变动列表中。

### `updateEdge(id, data, options)`

通过ID更新某个边。不允许修改边的`id`或`shape`属性。

参数：

- `id`：要更新的边的ID。
- `data`：一个对象或者一个函数，包含要更新的数据。
- `options`：一个可选的对象。当`{ silent: true }`时，更新操作不会被记录在变动列表中。
