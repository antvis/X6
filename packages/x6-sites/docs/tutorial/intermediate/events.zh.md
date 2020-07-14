---
title: 事件系统
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---


## 事件

### change:xxx

当调用 `setXxx(val, options)` 和 `removeXxx(options)` 方法，并且 `options.silent` 不为 `true` 时，都将触发对应的 chang 事件，最终触发节点/边重绘。例如：

```ts
cell.setZIndex(2)
cell.setZIndex(2, { silent: false })
cell.setZIndex(2, { anyKey: 'anyValue' })
```

将触发 Cell 上的以下事件：

- change:*
- change:zIndex

和 Graph 上的以下事件：

- cell:change:*
- node:change:*（仅当 cell 是节点时才触发）
- edge:change:*（仅当 cell 是边时才触发）
- cell:change:zIndex
- node:change:zIndex（仅当 cell 是节点时才触发）
- edge:change:zIndex（仅当 cell 是边时才触发）

可以通过如下方式监听事件：

```ts
// 当 cell 发生任何改变时都将被触发，可以通过 key 来确定改变项
cell.on('change:*', (args: {
  cell: Cell    
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值
  previous: any // 改变之前的值
  options: any  // 透传的 options
}) => { })

grapg.on('cell:change:*', (args: {
  cell: Cell    
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值，类型根据 key 指代的类型确定
  previous: any // 改变之前的值，类型根据 key 指代的类型确定
  options: any  // 透传的 options
}) => { })

// 当 cell 为节点时触发
grapg.on('node:change:*', (args: {
  cell: Cell    
  node: Node
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值，类型根据 key 指代的类型确定
  previous: any // 改变之前的值，类型根据 key 指代的类型确定
  options: any  // 透传的 options
}) => { })

// 当 cell 为边时触发
grapg.on('edge:change:*', (args: {
  cell: Cell    
  edge: Edge
  key: string   // 通过 key 来确定改变项
  current: any  // 当前值，类型根据 key 指代的类型确定
  previous: any // 改变之前的值，类型根据 key 指代的类型确定
  options: any  // 透传的 options
}) => { })

cell.on('change:zIndex', (args: {
  cell: Cell
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })

graph.on('cell:change:zIndex', (args: {
  cell: Cell
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })

// 当 cell 为节点时触发
graph.on('node:change:zIndex', (args: {
  cell: Cell
  node: Node
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })

// 当 cell 为边时触发
graph.on('edge:change:zIndex', (args: {
  cell: Cell
  edge: Edge        
  current?: number  // 当前值
  previous?: number // 改变之前的值
  options: any      // 透传的 options
}) => { })
```

