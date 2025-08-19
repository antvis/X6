---
title: Clipboard
order: 2
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="This chapter mainly introduces knowledge related to the clipboard. By reading, you can learn about"}

- How to use the copy and paste function

:::

## Usage

The clipboard is used for copying/pasting nodes and edges. We provide a plugin named `clipboard` to utilize this feature, we use it in the code like this:

```ts
import { Clipboard } from '@antv/x6'

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

## Demo

- After selecting a node, click the copy button to copy the node.
- Set different `offset` values to observe the effect on the node's position when pasting.
- After enabling `localStorage`, copy a node, refresh the page or reopen the browser, then click the paste button.

<code id="plugin-clipboard-resizing" src="@/src/tutorial/plugins/clipboard/index.tsx"></code>

## Configuration

| Property Name       | Type    | Default Value | Required | Description                                                                                       |
|---------------------|---------|---------------|----------|---------------------------------------------------------------------------------------------------|
| useLocalStorage      | boolean | `false`       |          | When enabled, the copied nodes/edges are also saved to `localStorage`, allowing copy/paste to work after refreshing or reopening the browser. |

## API

### graph.copy(...)

```ts
copy(cells: Cell[], options: CopyOptions = {}): this
```

Copy nodes/edges. Parameters are as follows:

| Name                    | Type    | Required | Default Value | Description                                   |
|-------------------------|---------|:--------:|---------------|-----------------------------------------------|
| cells                   | Cell[]  |    ✓     |               | The nodes/edges to be copied.                |
| options.deep            | boolean |          | -             | Whether to recursively copy all child nodes/edges. |
| options.useLocalStorage | boolean |          | -             | Whether to save the copied nodes/edges in `localStorage`. |

### graph.cut(...)

```ts
cut(cells: Cell[], options: CopyOptions = {}): this
```

Cut nodes/edges. Parameters are as follows:

| Name                    | Type    | Required | Default Value | Description                                   |
|-------------------------|---------|:--------:|---------------|-----------------------------------------------|
| cells                   | Cell[]  |    ✓     |               | The nodes/edges to be cut.                   |
| options.deep            | boolean |          | -             | Whether to recursively copy all child nodes/edges. |
| options.useLocalStorage | boolean |          | -             | Whether to save the copied nodes/edges in `localStorage`. |

### graph.paste(...)

```ts
paste(options?: PasteOptions, graph?: Graph): Cell[]
```

Paste and return the nodes/edges pasted onto the canvas. Parameters are as follows:

| Name                    | Type                                   | Required | Default Value | Description                                 |
|-------------------------|----------------------------------------|:--------:|---------------|---------------------------------------------|
| options.useLocalStorage | boolean                                |          | -             | Whether to use nodes/edges from `localStorage`. |
| options.offset          | number \| `{ dx: number; dy: number }` |          | `20`         | The offset for the nodes/edges pasted onto the canvas. |
| options.nodeProps       | Node.Properties                        |          | -             | Additional properties for the nodes pasted onto the canvas. |
| options.edgeProps       | Edge.Properties                        |          | -             | Additional properties for the edges pasted onto the canvas. |
| graph                   | Graph                                  |          | `this`       | The target canvas for pasting, defaults to the current canvas. |

### graph.getCellsInClipboard()

```ts
getCellsInClipboard: Cell[]
```

Get the nodes/edges in the clipboard.

### graph.cleanClipboard()

```ts
cleanClipboard(): this
```

Clear the clipboard.

### graph.isClipboardEmpty()

```ts
isClipboardEmpty(): boolean
```

Return whether the clipboard is empty.

### graph.isClipboardEnabled()

```ts
isClipboardEnabled(): boolean
```

Return whether the clipboard is enabled.

### graph.enableClipboard()

```ts
enableClipboard(): this
```

Enable the clipboard.

### graph.disableClipboard()

```ts
disableClipboard(): this
```

Disable the clipboard.

### graph.toggleClipboard(...)

```ts
toggleClipboard(enabled?: boolean): this
```

Toggle the clipboard's enabled state. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------|
| enabled | boolean |          | -             | Whether to enable the clipboard; defaults to toggling the clipboard's enabled state. |

## Events

| Event Name            | Parameter Type            | Description                       |
|-----------------------|---------------------------|----------------------------------|
| `clipboard:changed`   | `{ cells: Cell[] }`      | Triggered when copying, cutting, or clearing the clipboard. |

```ts
graph.on('clipboard:changed', ({ cells }) => {
  console.log(cells)
})

// We can also listen to events on the plugin instance
clipboard.on('clipboard:changed', ({ cells }) => {
  console.log(cells)
})
```
