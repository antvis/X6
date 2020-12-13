---
title: Clipboard
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

剪切板，默认禁用。创建画布时通过以下配置启用。

```ts
const graph = new Graph({
  clipboard: true,
})

// 等同于
const graph = new Graph({
  clipboard: {
    enabled: true,
  }
})
```

创建画布后，可以调用 [graph.enableClipboard()](#enableclipboard) 和 [graph.disableClipboard()](#disableclipboard) 来启用和禁用剪贴板。

```ts
if (graph.isClipboardEnabled()) {
  graph.disableClipboard()
} else {
  graph.enableClipboard()
}
```

<iframe src="/demos/tutorial/basic/clipboard/playground"></iframe>

### useLocalStorage

开启 `useLocalStorage` 后，被复制的节点/边同时被保存到 [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 中，浏览器刷新或者关闭后重新打开，复制/粘贴也能正常工作。

可以在创建画布时全局开启。

```ts
const graph = new Graph({
  clipboard: {
    enabled: true,
    useLocalStorage: true,
  }
})
```

也可以在调用以下三个方法时开启。

- [graph.copy(cells: Cell[], options?: CopyOptions)](#copy)
- [graph.cut(cells: Cell[], options?: CopyOptions)](#cut)
- [graph.paste(options?: PasteOptions, targetGraph?: Graph)](#paste)

例如：

```ts
graph.copy(cells, {
  useLocalStorage: true,
})
```

## 方法

### copy(...)

```sign
copy(cells: Cell[], options: CopyOptions = {}): this
```

复制节点/边。

<span class="tag-param">参数<span>

| 名称                    | 类型    | 必选 | 默认值 | 描述                                       |
|-------------------------|---------|:----:|--------|------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被复制的节点/边。                           |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                 |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 localStorage 中。 |

### cut(...)

```sign
cut(cells: Cell[], options: CopyOptions = {}): this
```

剪切节点/边。

<span class="tag-param">参数<span>

| 名称                    | 类型    | 必选 | 默认值 | 描述                                       |
|-------------------------|---------|:----:|--------|------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被剪切的节点/边。                           |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                 |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 localStorage 中。 |

### paste(...)

```sign
paste(options?: PasteOptions, graph?: Graph): Cell[]
```

粘贴，返回粘贴到画布的节点/边。

<span class="tag-param">参数<span>

| 名称                    | 类型                                   | 必选 | 默认值 | 描述                               |
|-------------------------|----------------------------------------|:----:|--------|----------------------------------|
| options.useLocalStorage | boolean                                |      | -      | 是否使用 localStorage 中的节点/边。 |
| options.offset          | number \| `{ dx: number; dy: number }` |      | `20`   | 粘贴到画布的节点/边的偏移量。       |
| options.nodeProps       | Node.Properties                        |      | -      | 粘贴到画布的节点的额外属性。        |
| options.edgeProps       | Edge.Properties                        |      | -      | 粘贴到画布的边的额外属性。          |
| graph                   | Graph                                  |      | `this` | 粘贴的目标画布，默认粘贴到当前画布。 |

### getCellsInClipboard()

```sign
getCellsInClipboard: Cell[]
```

获取剪切板中的节点/边。

### cleanClipboard()

```sign
cleanClipboard(): this
```

清空剪切板。

### isClipboardEmpty()

```sign
isClipboardEmpty(): boolean
```

返回剪切板是否为空。

### isClipboardEnabled()

```sign
isClipboardEnabled(): boolean
```

返回是否启用了剪切板。

### enableClipboard()

```sign
enableClipboard(): this
```

启用剪切板。

### disableClipboard()

```sign
disableClipboard(): this
```

禁用剪切板。

### toggleClipboard(...)

```sign
toggleClipboard(enabled?: boolean): this
```

切换剪切板的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用剪切板，缺省时切换剪切板的启用状态。 |