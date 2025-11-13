---
title: 复制粘贴
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=在本章节中主要介绍剪切板插件相关的知识，通过阅读，你可以了解到}

- 如何使用复制粘贴功能

:::

## 使用

剪切板用于复制/粘贴节点和边。你可以通过插件 `Clipboard` 启用该功能，示例：

```ts
import { Graph, Clipboard } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Clipboard({
    enabled: true,
  }),
)
```

## 演示

- 选中节点后，点击复制按钮复制节点。
- 设置不同的 `offset`，观察粘贴时对节点位置的影响。
- 启用 `localStorage` 后复制节点，刷新页面或重新打开浏览器后，点击粘贴按钮。

<code id="plugin-clipboard-resizing" src="@/src/tutorial/plugins/clipboard/index.tsx"></code>

## 配置

| 属性名          | 类型    | 默认值  | 必选 | 描述                                                                                                   |
|-----------------|---------|---------|------|------------------------------------------------------------------------------------------------------|
| useLocalStorage | boolean | `false` |      | 开启后被复制的节点/边同时被保存到 `localStorage` 中，浏览器刷新或者关闭后重新打开，复制/粘贴也能正常工作 |

## API

### graph.copy(...)

```ts
copy(cells: Cell[], options: CopyOptions = {}): this
```

复制节点/边。参数如下：

| 名称                    | 类型    | 必选 | 默认值 | 描述                                         |
|-------------------------|---------|:----:|--------|--------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被复制的节点/边。                             |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                   |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 `localStorage` 中。 |

### graph.cut(...)

```ts
cut(cells: Cell[], options: CopyOptions = {}): this
```

剪切节点/边。参数如下：

| 名称                    | 类型    | 必选 | 默认值 | 描述                                         |
|-------------------------|---------|:----:|--------|--------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被剪切的节点/边。                             |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                   |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 `localStorage` 中。 |

### graph.paste(...)

```ts
paste(options?: PasteOptions, graph?: Graph): Cell[]
```

粘贴，返回粘贴到画布的节点/边。参数如下：

| 名称                    | 类型                                   | 必选 | 默认值 | 描述                                 |
|-------------------------|----------------------------------------|:----:|--------|------------------------------------|
| options.useLocalStorage | boolean                                |      | -      | 是否使用 `localStorage` 中的节点/边。 |
| options.offset          | number \| `{ dx: number; dy: number }` |      | `20`   | 粘贴到画布的节点/边的偏移量。         |
| options.nodeProps       | Node.Properties                        |      | -      | 粘贴到画布的节点的额外属性。          |
| options.edgeProps       | Edge.Properties                        |      | -      | 粘贴到画布的边的额外属性。            |
| graph                   | Graph                                  |      | `this` | 粘贴的目标画布，默认粘贴到当前画布。   |

### graph.getCellsInClipboard()

```ts
getCellsInClipboard(): Cell[]
```

获取剪切板中的节点/边。

### graph.cleanClipboard()

```ts
cleanClipboard(): this
```

清空剪切板。

### graph.isClipboardEmpty()

```ts
isClipboardEmpty(): boolean
```

返回剪切板是否为空。

### graph.isClipboardEnabled()

```ts
isClipboardEnabled(): boolean
```

返回是否启用了剪切板。

### graph.enableClipboard()

```ts
enableClipboard(): this
```

启用剪切板。

### graph.disableClipboard()

```ts
disableClipboard(): this
```

禁用剪切板。

### graph.toggleClipboard(...)

```ts
toggleClipboard(enabled?: boolean): this
```

切换剪切板的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用剪切板，缺省时切换剪切板的启用状态。 |

## 事件

| 事件名称            | 参数类型            | 描述                       |
|---------------------|---------------------|--------------------------|
| `clipboard:changed` | `{ cells: Cell[] }` | 复制、剪切、清空剪切板时触发 |

```ts
graph.on('clipboard:changed', ({ cells }) => {
  console.log(cells)
})

// 我们也可以在插件实例上监听事件
clipboard.on('clipboard:changed', ({ cells }) => {
  console.log(cells)
})
```
