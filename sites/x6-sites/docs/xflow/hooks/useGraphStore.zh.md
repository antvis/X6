---
title: useGraphStore 
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/hooks
---

获取当前画布 store 以及改变 store 的 Hook

## 基础用法

```tsx
  const nodes = useGraphStore((state) => state.nodes);
```

使用 `useGraphStore` 可以方便的对画布的数据进行增删改查
下面是使用 `useGraphStore` 添加节点和删除节点的简单示例
<code id="xflow-hooks-use-graph-store" src="@/src/xflow/hooks/use-graph-store/index.tsx"></code>

## API

```tsx
  
   useGraphStore<T, U>(selector: (state: U) => T): U

```

## 返回值

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| `U` | 画布store的action | [Options](#Options-参数如下) | - |

## 参数

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| selector| 获取store的action的函数 | (state: [Options](#Options-参数如下)) => [Options](#Options-参数如下) | - |

<p id="Options-参数如下">Options 参数如下</p>

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| nodes | 画布所有节点 | [NodeOptions](/api/model/node)[] | - |
| edges | 画布所有边 | [EdgeOptions](/api/model/edge)[] | - |
| changeList | store操作记录 | (`init` \| `addNodes` \| `removeNodes` \| `updateNode` \| `addEdges` \| `removeEdges` \| `updateEdge` )[] | - |
| initData | 初始化数据 |  `(data: {nodes: NodeOptions[], edges: EdgeOptions[] }, options?: {silent?: boolean}) => void` | - |
| addNodes | 添加节点 | `(ns: NodeOptions[], options?: {silent?: boolean}) => void` | - |
| removeNodes | 移除节点 | `(ids: string[], options?: {silent?: boolean}) => void` | - |
| updateNode | 更新节点 | `(id: string, data: UpdateNodeDataOrFn, options?: {silent?: boolean}) => void` | - |
| addEdges | 添加边 | `(es: EdgeOptions[], options?: {silent?: boolean}) => void` | - |
| removeEdges | 移除边 | `(ids: string[], options?: {silent?: boolean}) => void` | - |
| updateEdge | 更新边 | `(id: string, data: UpdateEdgeDataOrFn, options?: {silent?: boolean}) => void` | - |
| clearChangeList | 情况操作记录 | `() => void` | - |
