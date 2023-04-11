---
title: 撤销重做
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=在本章节中，主要介绍撤销重做相关的知识，通过阅读，你可以了解到：}

- 如何实现元素操作的撤销与重做
  :::

## 使用

我们提供了一个独立的插件包 `@antv/x6-plugin-history` 来使用撤销重做功能。

```shell
# npm
$ npm install @antv/x6-plugin-history --save

# yarn
$ yarn add @antv/x6-plugin-history
```

然后我们在代码中这样使用：

```ts
import { History } from "@antv/x6-plugin-history";

const graph = new Graph({
  background: {
    color: "#F2F7FA",
  },
});
graph.use(
  new History({
    enabled: true,
  })
);
```

## 演示

- 随意移动节点后，Undo 按钮变得可用。
- 点击 Undo 按钮，节点位置被还原，然后 Redo 按钮变得可用。
- 点击 Redo 按钮，节点位置被更新。

<code id="plugin-history" src="@/src/tutorial/plugins/history/index.tsx"></code>

## 配置

| 属性名           | 类型                            | 默认值  | 必选 | 描述                                                                                               |
|------------------|---------------------------------|---------|------|--------------------------------------------------------------------------------------------------|
| stackSize        | number                          | `0`     |      | `stackSize` 为 0 表示不限制历史记录栈的长度，如果设置为其他数字表示最多只会记录该数字长度的历史记录 |
| ignoreAdd        | boolean                         | `false` |      | `ignoreAdd` 如果为 `true`，添加添加元素不会被记录到历史记录                                         |
| ignoreRemove     | boolean                         | `false` |      | `ignoreRemove` 如果为 `true`，删除元素不会被记录到历史记录                                          |
| ignoreChange     | boolean                         | `false` |      | `ignoreChange` 如果为 `true`，元素属性变化是否被记录到历史记录                                      |
| beforeAddCommand | `(event, args) => any`          | -       |      | 当一个命令被添加到 Undo 队列前被调用，如果该方法返回 `false`，那么这个命令将不会被添加到 Undo 队列中 |
| afterAddCommand  | `(event, args, cmd) => any`     | -       |      | 当一个命令被添加到 Undo 队列后被调用                                                               |
| executeCommand   | `(cmd, revert, options) => any` | -       |      | 当命令被撤销或重做时被调用，`revert` 为 `true` 表示命令被撤销，否则表示命令被重做                    |

:::info{title=提示：}
在实际项目中，我们经常会需要将多个改变一次性撤销或者重做，X6 中提供 `batch` 的概念，可以将多个改变合并成一个历史记录。使用方式如下：
:::

```ts
// 方式一
graph.startBatch("custom-batch-name");
// 节点改变边框颜色以及修改位置会合并成一条记录，可以一次性撤销
node.attr("body/stroke", "red");
node.position(30, 30);
graph.stopBatch("custom-batch-name");

// 方式二
graph.batchUpdate(() => {
  node.prop("zIndex", 10);
  node.attr("label/text", "hello");
  node.attr("label/fill", "#ff0000");
});
```

## API

### graph.undo(...)

```ts
undo(options?: KeyValue): this
```

撤销。`options` 将被传递到事件回调中。

### graph.undoAndCancel(...)

```ts
undoAndCancel(options?: KeyValue): this
```

撤销，并且不添加到重做队列中，所以这个被撤销的命令不能被重做。`options` 将被传递到事件回调中。

### graph.redo(...)

```ts
redo(options?: KeyValue): this
```

重做。`options` 将被传递到事件回调中。

### graph.canUndo()

```ts
canUndo(): boolean
```

是否可以撤销。

### graph.canRedo()

```ts
canRedo(): boolean
```

是否可以重做。

### graph.cleanHistory(...)

```ts
cleanHistory(options?: KeyValue): this
```

清空历史队列。`options` 将被传递到事件回调中。

### graph.getHistoryStackSize(...)
```ts
getHistoryStackSize(): number
```

获取history栈的尺寸。


### graph.getUndoRemainSize(...)
```ts
getUndoRemainSize(): number
```

获取history undo栈的剩余尺寸。

### graph.getUndoStackSize(...)
```ts
getUndoStackSize(): number
```

获取history undo栈的尺寸。

### graph.getRedoStackSize(...)
```ts
getRedoStackSize(): number
```

获取history redo栈的尺寸。



### graph.isHistoryEnabled()

```ts
isHistoryEnabled(): boolean
```

是否启用了历史状态。

### graph.enableHistory()

```ts
enableHistory(): this
```

启用历史状态。

### graph.disableHistory()

```ts
disableHistory(): this
```

禁用历史状态。

### graph.toggleHistory(...)

```ts
toggleHistory(enabled?: boolean): this
```

切换历史的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用历史状态，缺省时切换历史的启用状态。 |

## 事件

| 事件名称         | 参数类型                                         | 描述                      |
|------------------|--------------------------------------------------|-------------------------|
| `history:undo`   | `{ cmds: Command[], options: KeyValue }`         | 当命令被撤销时触发        |
| `history:redo`   | `{ cmds: Command[], options: KeyValue }`         | 当命令被重做时触发        |
| `history:cancel` | `{ cmds: Command[], options: KeyValue }`         | 当命令被取消时触发        |
| `history:add`    | `{ cmds: Command[], options: KeyValue }`         | 当命令被添加到队列时触发  |
| `history:clean`  | `{ cmds: Command[] \| null, options: KeyValue }` | 当历史队列被清空时触发    |
| `history:change` | `{ cmds: Command[] \| null, options: KeyValue }` | 当历史队列改变时触发      |
| `history:batch`  | `{ cmds: Command, options: KeyValue }`           | 当接收到 batch 命令时触发 |

```ts
graph.on("history:undo", ({ cmds }) => {
  console.log(cmds);
});

// 我们也可以在插件实例上监听事件
history.on("undo", ({ cmds }) => {
  console.log(cmds);
});
```
