---
title: 剪切板 Clipboard
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

剪切板用于节点和边的复制/粘贴，支持跨画布的复制/粘贴。剪切板默认处于禁用状态，可以在创建画布时启用。

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

创建画布后，可以调用 `graph.enableClipboard()` 和 `graph.disableClipboard()` 来启用和禁用剪贴板。

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

也可以在调用 `copy()`、`cut()` 或 `paste()` 方法时开启。

```ts
graph.copy(cells, {
  useLocalStorage: true,
})
```

## Playground

- 选中节点后复制按钮
- 设置不同的 `offset` 粘贴节点
- 启用 localStorage 后复制节点，刷新页面后直接点击粘贴按钮

<iframe
     src="https://codesandbox.io/embed/x6-playground-clipboard-ovl8v?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width: 100%; height: 500px; border: 1px solid #f0f0f0; border-radius: 4px; overflow: hidden; margin-top: 16px;"
     title="x6-playground-clipboard"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## API

- `graph.copy(cells: Cell[], options: CopyOptions = {})` 复制节点/边。
  - `cells` 被复制的节点/边。
  - `options` 复制选项。
    ```ts
      interface CopyOptions {
          deep?: boolean
          useLocalStorage?: boolean
      }
    ```
      - `deep` 是否递归复制子节点。
      - `useLocalStorage` 是否将本次复制结果存储在 localStorage 中，指定该选项后将覆盖全局 `useLocalStorage` 选项。

- `graph.cut(cells: Cell[], options: CopyOptions = {})` 剪切（复制并从原始画布中删除被复制的节点/边）。
  - `cells` 被剪切的节点/边。
  - `options` 剪切选项（同复制选项）。
  
- `graph.paste(options: PasteOptions = {}, targetGraph: Graph = this)` 粘贴。
  - `options` 粘贴选项。
  - `targetGraph` 粘贴的目标画布，默认粘贴到当前画布。
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
      - `offset` 每次粘贴时节点/边的偏移量。这个选项对同一画布的连续多次粘贴非常有用，设置一个合适偏移量，多次粘贴的节点/边就不会重叠在一起。

- `graph.isClipboardEmpty()` 剪贴板是否为空，即没有复制任何节点/边。
- `graph.getCellsInClipboard()` 获取剪贴板中的节点/边。
- `graph.cleanClipboard()` 清空剪贴板中的内容。
- `graph.isClipboardEnabled()` 剪贴板是否可用。
- `graph.enableClipboard()` 启用剪贴板。
- `graph.disableClipboard()` 禁用剪贴板。
- `graph.toggleClipboard(enabled?: boolean)` 切换剪贴板的启用状态。
