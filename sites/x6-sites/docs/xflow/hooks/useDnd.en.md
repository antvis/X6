---
title: useDnd 
order: 3
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/hooks
---

Quickly implement a hook for node dragging and dropping.

## Basic Usage

```tsx
 const { startDrag } = useDnd();
```

<code id="xflow-hooks-use-dnd" src="@/src/xflow/hooks/use-dnd/index.tsx"></code>

## API

```tsx
 const { 
  startDrag: (n, e) => void
 } = useDnd(options: Options);
```

## Return Value

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| startDrag | Function to drag nodes | (n: [NodeOptions](#use-dnd-startDrag-options), e: React.MouseEvent<Element, MouseEvent>) => void  | - |

<p id="use-dnd-startDrag-options">NodeOptions, in addition to inheriting from Node type, has two additional properties.</p>

For Node-related documentation, please refer to [Node](/api/model/node).

```tsx
interface NodeOptions extends Node {
  selected?: boolean; // Whether the node is selected
  draggable?: boolean; // Whether the node is draggable
}
```

## Parameters

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| options   | Drag configuration | [Options](#use-dnd-options) | - |

When using `useDnd` for dragging, you can configure it.

<p id="use-dnd-options">The Options type is as follows:</p>

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| scaled    | Whether the dragged node should be scaled | `boolean` | `false` |
| dndContainer | If `dndContainer` is set, releasing the mouse on `dndContainer` will not place the node, commonly used in scenarios where the `dnd` container is above the canvas | `HTMLElement` | - |
| draggingContainer | Custom dragging canvas container | `HTMLElement` | `document.body` |
| validateNode | Whether the dragged node should be validated | `(droppingNode: Node, options: ValidateNodeOptions) => boolean | Promise<boolean>` | - |
