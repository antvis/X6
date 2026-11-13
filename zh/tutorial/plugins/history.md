---
title: "撤销重做"
description: "撤销重做"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/tutorial/plugins/history/"
version: "3.x"
---

[资料索引](/llms.txt)

> **在本章节中主要介绍撤销重做插件相关的知识，通过阅读，你可以了解到**

- 如何实现元素操作的撤销与重做
- 如何设置是否记录元素添加、删除和属性更改
- 如何将多个改变合并为一条历史记录


## 使用

你可以通过插件 `History` 启用撤销重做功能，示例：

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

## 演示

- 随意移动节点后，Undo 按钮变得可用。
- 点击 Undo 按钮，节点位置被还原，然后 Redo 按钮变得可用。
- 点击 Redo 按钮，节点位置被更新。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Button } from 'antd'
import { Graph, History } from '@antv/x6'

interface Props {}

interface State {
  canUndo: boolean
  canRedo: boolean
}

export default class App extends React.Component<Props, State> {
  private container: HTMLDivElement
  private graph: Graph

  state: State = {
    canRedo: false,
    canUndo: false,
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.use(
      new History({
        enabled: true,
      }),
    )

    graph.addNode({
      x: 100,
      y: 60,
      width: 100,
      height: 40,
      label: 'Drag Me',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.on('history:change', () => {
      this.setState({
        canRedo: graph.canRedo(),
        canUndo: graph.canUndo(),
      })
    })

    this.graph = graph
  }

  onUndo = () => {
    this.graph.undo()
  }

  onRedo = () => {
    this.graph.redo()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="history-app">
        <div className="app-btns">
          <Button.Group>
            <Button onClick={this.onUndo} disabled={!this.state.canUndo}>
              Undo
            </Button>
            <Button onClick={this.onRedo} disabled={!this.state.canRedo}>
              Redo
            </Button>
          </Button.Group>
        </div>
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<App />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 配置

| 属性名           | 类型                            | 默认值  | 必选 | 描述                                                                                               |
|------------------|---------------------------------|---------|------|--------------------------------------------------------------------------------------------------|
| stackSize        | number                          | `0`     |      | `stackSize` 为 0 表示不限制历史记录栈的长度，如果设置为其他数字表示最多只会记录该数字长度的历史记录 |
| ignoreAdd        | boolean                         | `false` |      | `ignoreAdd` 如果为 `true`，添加元素不会被记录到历史记录                                         |
| ignoreRemove     | boolean                         | `false` |      | `ignoreRemove` 如果为 `true`，删除元素不会被记录到历史记录                                          |
| ignoreChange     | boolean                         | `false` |      | `ignoreChange` 如果为 `true`，元素属性变化不会被记录到历史记录                                      |
| beforeAddCommand | `(event, args) => any`          | -       |      | 当一个命令被添加到 Undo 队列前被调用，如果该方法返回 `false`，那么这个命令将不会被添加到 Undo 队列中 |
| afterAddCommand  | `(event, args, cmd) => any`     | -       |      | 当一个命令被添加到 Undo 队列后被调用                                                               |
| executeCommand   | `(cmd, revert, options) => any` | -       |      | 当命令被撤销或重做时被调用，`revert` 为 `true` 表示命令被撤销，否则表示命令被重做                    |

> **提示**

在实际项目中，我们经常会需要将多个改变一次性撤销或者重做，X6 中提供 `batch` 的概念，可以将多个改变合并成一个历史记录。使用方式如下：

```ts
// 方式一
graph.startBatch('custom-batch-name')
// 节点改变边框颜色以及修改位置会合并成一条记录，可以一次性撤销
node.attr('body/stroke', 'red')
node.position(30, 30)
graph.stopBatch('custom-batch-name')

// 方式二
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

撤销。`options` 将被传递到事件回调中。

### graph.undoAndCancel(...)

```ts
undoAndCancel(options?: KeyValue): this
```

撤销，并且不添加到重做队列中，因此该命令不能被重做。`options` 将被传递到事件回调中。

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

获取 history 栈的尺寸。

### graph.getUndoRemainSize(...)

```ts
getUndoRemainSize(): number
```

获取 history undo 栈的剩余尺寸。

### graph.getUndoStackSize(...)

```ts
getUndoStackSize(): number
```

获取 history undo 栈的尺寸。

### graph.getRedoStackSize(...)

```ts
getRedoStackSize(): number
```

获取 history redo 栈的尺寸。

### graph.isHistoryEnabled()

```ts
isHistoryEnabled(): boolean
```

返回是否启用了历史状态。

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
graph.on('history:undo', ({ cmds }) => {
  console.log(cmds)
})

// 我们也可以在插件实例上监听事件
history.on('undo', ({ cmds }) => {
  console.log(cmds)
})
```
### docs/demos/tutorial/plugins/history/index.less

```less
.history-app {
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-btns {
    bottom: 0;
    margin: 0;
    padding: 0 8px;
  }

  .app-content {
    width: 100%;
    height: 240px;
    margin: 0;
    margin-top: 16px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
