---
title: 撤销/重做 Redo/Undo
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

创建画布时，通过以下配置开启画布撤销/重做能力。

```ts
const graph = new Graph({
  history: true,
})

// 等同于
const graph = new Graph({
  history: {
    enable: true,
  },
})
```

创建画布后，调用 [graph.enableHistory()](#graphenablehistory) 和 [graph.disableHistory()](#graphdisablehistory) 来启用和禁用。

```ts
if (graph.isHistoryEnabled()) {
  graph.disableHistory()
} else {
  graph.enableHistory()
}
```

## 演示

- 随意移动节点后，Undo 按钮变得可用。
- 点击 Undo 按钮，节点位置被还原，然后 Redo 按钮变得可用。
- 点击 Redo 按钮，节点位置被更新。

<iframe src="/demos/tutorial/basic/history/playground"></iframe>

## 选项

```ts
interface HistoryOptions {
  ignoreAdd?: boolean
  ignoreRemove?: boolean
  ignoreChange?: boolean
  beforeAddCommand?: <T extends ModelEvents>(
    this: HistoryManager,
    event: T,
    args: Model.EventArgs[T],
  ) => any
  afterAddCommand?: <T extends ModelEvents>(
    this: HistoryManager,
    event: T,
    args: Model.EventArgs[T],
    cmd: Command,
  ) => any
  executeCommand?: (
    this: HistoryManager,
    cmd: Command,
    revert: boolean,
    options: KeyValue,
  ) => any
  revertOptionsList?: string[]
  applyOptionsList?: string[]
}
```

### ignoreAdd, ignoreRemove, ignoreChange

默认情况下，画布中节点/边的任何变化（添加/删除/属性变化）都将被追踪，我们提供了一些选项来控制需要追踪哪些变化：

- `ignoreAdd` 是否忽略添加，默认为 `false`。
- `ignoreRemove` 是否忽略删除，默认为 `false`。
- `ignoreChange` 是否忽略属性变化，默认为 `false`。

例如，下面配置只追踪节点和边的属性变化：

```ts
const graph = new Graph({
  history: {
    enable: true,
    ignoreAdd: true,
    ignoreRemove: true,
    ignoreChange: false,
  },
})
```

### beforeAddCommand 

当一个命令被添加到 Undo 队列前被调用，如果该方法返回 `false`，那么这个命令将不会被添加到 Undo 队列中。

```ts
const graph = new Graph({
  history: {
    enable: true,
    beforeAddCommand(event, args) {
      if (args.options) {
        return args.options.ignore !== false
      }
    },
  },
})
```

### afterAddCommand

当一个命令被添加到 Undo 队列后被调用。

### executeCommand

```ts
executeCommand?: (
  this: HistoryManager,
  cmd: Command,
  revert: boolean,
  options: KeyValue,
) => any
```

当命令被撤销或重做时被调用，`revert` 为 `true` 表示命令被撤销，否则表示命令被重做。

### revertOptionsList

传递给撤销动作的选项名数组。

```ts
const graph = new Graph({
  history: {
    enable: true,
    revertOptionsList: [ 'option1' ],
  },
})

node.prop('name', 'value', { option1: 5, option2: 6 });
graph.undo(); // -> calls node.prop('name', 'prevValue', { option1: 5 });
```

### applyOptionsList

传递给重做动作的选项名数组。

```ts
const graph = new Graph({
  history: {
    enable: true,
    applyOptionsList: [ 'option2' ],
  },
})

node.set('name', 'value', { option1: 5, option2: 6 });
graph.undo();
graph.redo(); // -> calls node.set('name', 'value', { option2: 6 });
```

## 事件

### undo

当命令被撤销时触发。

```ts
graph.history.on('undo', (args: {
  cmds: Command[]
  options: KeyValue
}) => { 
  // code here
})
```

### redo 

当命令被重做时触发。

```ts
graph.history.on('redo', (args: {
  cmds: Command[]
  options: KeyValue
}) => { 
  // code here
})
```

### cancel

当命令被取消时触发。

```ts
graph.history.on('cancel', (args: {
  cmds: Command[]
  options: KeyValue
}) => { 
  // code here
})
```

### add

当命令被添加到队列时触发。

```ts
graph.history.on('add', (args: {
  cmds: Command[]
  options: KeyValue
}) => { 
  // code here
})
```

### clean

当历史队列被清空时触发。

```ts
graph.history.on('clean', (args: {
  cmds: Command[] | null
  options: KeyValue
}) => { 
  // code here
})
```

### change

当历史队列改变时触发。

```ts
graph.history.on('change', (args: {
  cmds: Command[] | null
  options: KeyValue
}) => { 
  // code here
})
```

### batch

当接收到 batch 命令时触发。

```ts
graph.history.on('batch', (args: { 
  cmd: Command 
  options: KeyValue 
}) => { 
  // code here
})
```

## API
 
### graph.undo(...)

```sign
undo(options?: KeyValue): this
```

撤销。`options` 将被传递到事件回调中。 

### graph.undoAndCancel(...)

```sign
undoAndCancel(options?: KeyValue): this
```

撤销，并且不添加到重做队列中，所以这个被撤销的命令不能被重做。`options` 将被传递到事件回调中。 

### graph.redo(...)

```sign
redo(options?: KeyValue): this
```

重做。`options` 将被传递到事件回调中。 

### graph.canUndo()

```sign
canUndo(): boolean
```

是否可以撤销。

### graph.canRedo()

```sign
canRedo(): boolean
```

是否可以重做。

### graph.cleanHistory(...)

```sign
cleanHistory(options?: KeyValue): this
```

清空历史状态。`options` 将被传递到事件回调中。 

### graph.isHistoryEnabled()

```sign
isHistoryEnabled(): boolean
```

是否启用了历史状态。

### graph.enableHistory()

```sign
enableHistory(): this
```

启用历史状态。

### graph.disableHistory()

```sign
disableHistory(): this
```

禁用历史状态。

### graph.toggleHistory(...)

```sign
toggleHistory(enabled?: boolean): this
```

切换历史的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用历史状态，缺省时切换历史的启用状态。 |

