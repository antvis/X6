---
title: 剪切板 Clipboard
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

剪切板用于复制/粘贴节点和边，并支持跨画布的复制/粘贴，创建画布时通过以下配置启用。

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

创建画布后，可以调用 [graph.enableClipboard()](#graphenableclipboard) 和 [graph.disableClipboard()](#graphdisableclipboard) 来启用和禁用剪贴板。

```ts
if (graph.isClipboardEnabled()) {
  graph.disableClipboard()
} else {
  graph.enableClipboard()
}
```

## 持久化

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

- [graph.copy(cells: Cell[], options: CopyOptions = {})](#graphcopycells-cell-options-copyoptions--)
- [graph.cut(cells: Cell[], options: CopyOptions = {})](#graphcutcells-cell-options-copyoptions--)
- [graph.paste(options: PasteOptions = {}, targetGraph: Graph = this)](#graphpasteoptions-pasteoptions---targetgraph-graph--this)

例如：

```ts
graph.copy(cells, {
  useLocalStorage: true,
})
```

## 演示

- 选中节点后，点击复制按钮复制节点。
- 设置不同的 `offset`，观察粘贴时对节点位置的影响。
- 启用 `localStorage` 后复制节点，刷新页面或重新打开浏览器后，点击粘贴按钮。

<iframe
  src="https://codesandbox.io/embed/x6-playground-clipboard-ovl8v?fontsize=14&hidenavigation=1&theme=light&view=preview"
  style="width: 100%; height: 500px; border: 1px solid #f0f0f0; border-radius: 4px; overflow: hidden; margin-top: 16px;"
  title="x6-playground-clipboard"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## API

### graph.copy(cells: Cell[], options: CopyOptions = {})

复制节点/边。

  - `cells: Cell[]` 被复制的节点/边。
  - `options?: CopyOptions` 复制选项。
    ```ts
      interface CopyOptions {
          deep?: boolean
          useLocalStorage?: boolean
      }
    ```
      - `deep` 是否递归复制子节点。
      - `useLocalStorage` 是否将本次复制结果存储在 localStorage 中，指定该选项后将覆盖全局 `useLocalStorage` 选项。

### graph.cut(cells: Cell[], options: CopyOptions = {})

剪切（复制并从原始画布中删除被复制的节点/边）。
  - `cells: Cell[]` 被剪切的节点/边。
  - `options?: CopyOptions` 剪切选项（同复制选项）。

### graph.paste(options: PasteOptions = {}, targetGraph: Graph = this)

粘贴。
  - `options?: PasteOptions` 粘贴选项。
    ```ts
      interface PasteOptions {
          useLocalStorage?: boolean
          nodeProps?: Node.Properties
          edgeProps?: Edge.Properties
          offset?: number | { dx: number; dy: number }
      }
    ```
      - `useLocalStorage` 是否从 localStorage 中获取粘贴内容，指定该选项后将覆盖全局 `useLocalStorage` 选项。
      - `nodeProps` 节点属性，应用到被粘贴的节点上，用于覆盖被粘贴节点的某些属性，如 `zIndex`。
      - `edgeProps` 边属性，应用到被粘贴的边上，用于覆盖被粘贴边的某些属性，如 `zIndex`。
      - `offset` 节点位置偏移量。这个选项对同一画布的连续多次粘贴非常有用，设置一个合适偏移量，多次粘贴的节点就不会重叠在一起。
  - `targetGraph?: Graph` 粘贴的目标画布，默认粘贴到当前画布。

### graph.isClipboardEmpty()

剪贴板是否为空，即没有复制任何节点/边。

### graph.getCellsInClipboard() 

获取剪贴板中的节点/边。

### graph.cleanClipboard()

清空剪贴板中的内容。

### graph.isClipboardEnabled()

剪贴板是否可用。

### graph.enableClipboard()

启用剪贴板。

### graph.disableClipboard()

禁用剪贴板。

### graph.toggleClipboard(enabled?: boolean)

切换或设置剪贴板的启用状态。

- `enabled?: boolean` 是否启用剪切板。

```ts
// 切换剪切板的启用状态
graph.toggleClipboard()

// 启用剪切板
graph.toggleClipboard(true)  
// 或
graph.enableClipboard()

// 禁用剪切板
graph.toggleClipboard(false) 
// 或
graph.disableClipboard()
```
