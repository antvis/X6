---
title: 撤销/重做 Redo/Undo
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

通过以下配置就可以开启画布历史追踪，并提供撤销/重做能力。

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

也可以调用 `graph.enableHistory()` 和 `graph.disableHistory()` 来启用和禁用历史追踪。

```ts
if (graph.isHistoryEnabled()) {
  graph.disableHistory()
} else {
  graph.enableHistory()
}
```

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
  addCommand?: <T extends ModelEvents>(
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

默认情况下，画布中节点/边的任何变化（添加/删除/属性变化）都将被追踪。另外我们提供了一些选项来控制需要追踪哪些变化：

- `ignoreAdd` 是否忽略添加
- `ignoreRemove` 是否忽略删除
- `ignoreChange` 是否忽略属性变化

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

```ts
beforeAddCommand<T extends ModelEvents>(
  this: HistoryManager,
  event: T,
  args: Model.EventArgs[T],
) => any
```

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

### addCommand

```ts
addCommand<T extends ModelEvents>(
  this: HistoryManager,
  event: T,
  args: Model.EventArgs[T],
  cmd: Command,
) => any
```

当一个命令被添加到 Undo 队列后被调用。

### executeCommand

```ts
executeCommand: (
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

- `undo` 当命令被撤销时触发
- `redo` 当命令被重做时触发
- `cancel` 当命令被取消时触发
- `add` 当命令被添加到队列时触发
- `clean` 当历史队列被清空时触发
- `change` 当历史队列改变时触发
- `batch` 当接收到 batch 命令时触发

```ts
interface Args<T = never> {
  cmds: Command[] | T
  options: KeyValue
}

graph.history.on('undo', (args: Args) => { })
graph.history.on('redo', (args: Args) => { })
graph.history.on('cancel', (args: Args) => { })
graph.history.on('add', (args: Args) => { })
graph.history.on('clean', (args: Args<null>) => { })
graph.history.on('change', (args: Args<numm>) => { })
graph.history.on('batch', (args: { cmd: Command; options: KeyValue }) => { })
```

## Playground

<iframe
     src="https://codesandbox.io/embed/x6-playground-history-i5b6q?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-playground-history"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## API
 
- `graph.undo(options?: KeyValue)` 撤销。
- `graph.undoAndCancel(options?: KeyValue)` 撤销，并且不添加到重做队列中，所以这个被撤销的命令不能被重做。
- `graph.redo(options?: KeyValue)` 重做。
- `graph.canUndo()` 是否可以撤销。
- `graph.canRedo()` 是否可以重做。
- `graph.cleanHistory()` 清空历史状态。
- `graph.isHistoryEnabled()` 是否启用历史追踪。
- `graph.enableHistory()` 启用历史追踪。
- `graph.disableHistory()` 禁用历史追踪。
- `graph.toggleHistory(enabled?: boolean)` 切换历史追踪的启用状态。
