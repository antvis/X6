---
title: History
order: 4
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="This chapter mainly introduces knowledge related to undo and redo plugin. By reading, you can learn about"}

- How to implement undo and redo for element operations
- How to configure whether to record additions, removals, and property changes
- How to merge multiple changes into a single history entry

:::

## Usage

You can enable undo/redo with the `History` plugin, for example:

```ts
import { Graph, History } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new History({
    enabled: true,
  }),
)
```

## Demo

- After moving a node freely, the Undo button becomes available.
- Clicking the Undo button restores the node's position, and then the Redo button becomes available.
- Clicking the Redo button updates the node's position.

<code id="plugin-history" src="@/src/tutorial/plugins/history/index.tsx"></code>

## Configuration

| Property Name      | Type                            | Default Value | Required | Description                                                                                          |
|--------------------|---------------------------------|---------------|----------|------------------------------------------------------------------------------------------------------|
| stackSize          | number                          | `0`           |          | A `stackSize` of 0 means no limit; otherwise only that many entries are kept. |
| ignoreAdd          | boolean                         | `false`       |          | If `ignoreAdd` is `true`, adding elements will not be recorded in the history.                      |
| ignoreRemove       | boolean                         | `false`       |          | If `ignoreRemove` is `true`, removing elements will not be recorded in the history.                 |
| ignoreChange       | boolean                         | `false`       |          | If `ignoreChange` is `true`, changes to element properties will not be recorded in the history.     |
| beforeAddCommand   | `(event, args) => any`        | -             |          | Called before a command is added to the Undo queue; if this method returns `false`, the command will not be added to the Undo queue. |
| afterAddCommand    | `(event, args, cmd) => any`   | -             |          | Called after a command is added to the Undo queue.                                                  |
| executeCommand     | `(cmd, revert, options) => any` | -             |          | Called when a command is undone or redone; `revert` is `true` if the command is undone, otherwise it indicates the command is redone. |

:::info{title="Tip"}
In actual projects, we often need to undo or redo multiple changes at once. X6 provides the concept of `batch`, which allows multiple changes to be merged into a single history entry. Here’s how to use it:
:::

```ts
// Method 1
graph.startBatch('custom-batch-name')
// Changing the border color of the node and modifying its position will be merged into a single record, allowing for a single undo.
node.attr('body/stroke', 'red')
node.position(30, 30)
graph.stopBatch('custom-batch-name')

// Method 2
graph.batchUpdate(() => {
  node.prop('zIndex', 10)
  node.attr('label/text', 'hello')
  node.attr('label/fill', '#ff0000')
})
```

## API

### graph.undo(...)

```ts
undo(options?: KeyValue): this
```

Undo. `options` will be passed to the event callback.

### graph.undoAndCancel(...)

```ts
undoAndCancel(options?: KeyValue): this
```

Undo and do not add to the redo queue; the command cannot be redone. `options` will be passed to the event callback.

### graph.redo(...)

```ts
redo(options?: KeyValue): this
```

Redo. `options` will be passed to the event callback.

### graph.canUndo()

```ts
canUndo(): boolean
```

Returns whether undo is available.

### graph.canRedo()

```ts
canRedo(): boolean
```

Returns whether redo is available.

### graph.cleanHistory(...)

```ts
cleanHistory(options?: KeyValue): this
```

Clear the history queue. `options` will be passed to the event callback.

### graph.getHistoryStackSize(...)

```ts
getHistoryStackSize(): number
```

Get the size of the history stack.

### graph.getUndoRemainSize(...)

```ts
getUndoRemainSize(): number
```

Get the remaining size of the history undo stack.

### graph.getUndoStackSize(...)

```ts
getUndoStackSize(): number
```

Get the size of the history undo stack.

### graph.getRedoStackSize(...)

```ts
getRedoStackSize(): number
```

Get the size of the history redo stack.

### graph.isHistoryEnabled()

```ts
isHistoryEnabled(): boolean
```

Returns whether history is enabled.

### graph.enableHistory()

```ts
enableHistory(): this
```

Enable history state.

### graph.disableHistory()

```ts
disableHistory(): this
```

Disable history state.

### graph.toggleHistory(...)

```ts
toggleHistory(enabled?: boolean): this
```

Toggle the enabled state of history. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------|
| enabled | boolean |          | -             | Whether to enable history state; defaults to toggling the enabled state of history. |

## Events

| Event Name        | Parameter Type                                     | Description                  |
|-------------------|----------------------------------------------------|------------------------------|
| `history:undo`    | `{ cmds: Command[], options: KeyValue }`          | Triggered when a command is undone. |
| `history:redo`    | `{ cmds: Command[], options: KeyValue }`          | Triggered when a command is redone. |
| `history:cancel`  | `{ cmds: Command[], options: KeyValue }`          | Triggered when a command is canceled. |
| `history:add`     | `{ cmds: Command[], options: KeyValue }`          | Triggered when a command is added to the queue. |
| `history:clean`   | `{ cmds: Command[] \| null, options: KeyValue }` | Triggered when the history queue is cleared. |
| `history:change`  | `{ cmds: Command[] \| null, options: KeyValue }` | Triggered when the history queue changes. |
| `history:batch`   | `{ cmds: Command, options: KeyValue }`            | Triggered when a batch command is received. |

```ts
graph.on('history:undo', ({ cmds }) => {
  console.log(cmds)
})

// We can also listen to events on the plugin instance
history.on('undo', ({ cmds }) => {
  console.log(cmds)
})
```
