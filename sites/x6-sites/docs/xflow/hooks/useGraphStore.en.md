---
title: useGraphStore
order: 1
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/hooks
---

Get the current canvas store and a Hook to change the store.

## Basic Usage

```tsx
  const nodes = useGraphStore((state) => state.nodes);
```

Using `useGraphStore` allows for easy CRUD (Create, Read, Update, Delete) operations on the canvas data.
Below is a simple example of adding and removing nodes using `useGraphStore`.
<code id="xflow-hooks-use-graph-store" src="@/src/xflow/hooks/use-graph-store/index.tsx"></code>

## API

```tsx

   useGraphStore<T, U>(selector: (state: U) => T): U

```

## Return Value

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| `U`       | Actions of the canvas store | [Options](#Options-parameters-below) | - |

## Parameters

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| selector  | Function to get the store's actions | (state: [Options](#Options-parameters-below)) => [Options](#Options-parameters-below) | - |

<p id="Options-parameters-below">Options parameters are as follows</p>

| Parameter   | Description               | Type                                                                 | Default Value |
|-------------|---------------------------|----------------------------------------------------------------------|---------------|
| nodes       | All nodes in the canvas   | [NodeOptions](/en/api/model/node)[]                                   | -             |
| edges       | All edges in the canvas   | [EdgeOptions](/en/api/model/edge)[]                                   | -             |
| changeList  | Store operation records    | (`init` \| `addNodes` \| `removeNodes` \| `updateNode` \| `addEdges` \| `removeEdges` \| `updateEdge` )[] | -             |
| initData    | Initialize data            | `(data: {nodes: NodeOptions[], edges: EdgeOptions[] }, options?: {silent?: boolean}) => void` | -             |
| addNodes    | Add nodes                  | `(ns: NodeOptions[], options?: {silent?: boolean}) => void`       | -             |
| removeNodes | Remove nodes               | `(ids: string[], options?: {silent?: boolean}) => void`           | -             |
| updateNode  | Update node                | `(id: string, data: UpdateNodeDataOrFn, options?: {silent?: boolean}) => void` | -             |
| addEdges    | Add edges                  | `(es: EdgeOptions[], options?: {silent?: boolean}) => void`       | -             |
| removeEdges | Remove edges               | `(ids: string[], options?: {silent?: boolean}) => void`           | -             |
| updateEdge  | Update edge                | `(id: string, data: UpdateEdgeDataOrFn, options?: {silent?: boolean}) => void` | -             |
| clearChangeList | Clear operation records | `() => void`                                                      | -             |
