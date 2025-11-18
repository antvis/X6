---
title: useClipboard 
order: 4
redirect_from:
  - /en/docs
  - /en/docs/xflow
  - /en/docs/xflow/hooks
---

A Hook for copying and pasting nodes and edges.

## Basic Usage

```tsx
 const { copy, paste, cut } = useClipboard();
```

## API

```tsx
  
const {
  copy: (ids, copyOptions) => void,
  paste: (ids, cutOptions) => void,
  cut: (pasteOptions) => void
} = useClipboard();

```

## Return Values

| Parameter | Description | Type |
|-----------|-------------|------|
| copy      | Copy elements | (ids: string[], copyOptions?: [CopyOptions](#CopyOptions-parameters-below)) => void |
| paste     | Render elements | (ids: string[], cutOptions?: [CopyOptions](#CopyOptions-parameters-below)) => void |
| cut       | Render elements | (pasteOptions?: [PasteOptions](#PasteOptions-parameters-below)) => [Cell](/en/api/model/cell#properties)[] |

<p id="CopyOptions-parameters-below">CopyOptions parameters are as follows</p>

| Parameter      | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| deep           | Whether to recursively copy all child nodes/edges. | `boolean` | - |
| useLocalStorage| Whether to save the copied nodes/edges in `localStorage` | `boolean` | - |

<p id="PasteOptions-parameters-below">PasteOptions parameters are as follows</p>

| Parameter      | Description | Type | Default Value |
|----------------|-------------|------|---------------|
| offset         | Offset for pasting nodes/edges onto the canvas | `number` \| `{ dx: number; dy: number }` | 20 |
| useLocalStorage| Whether to use nodes/edges from `localStorage` | `boolean` | - |
| nodeProps      | Additional properties for nodes pasted onto the canvas | `Node.Properties` | - |
| edgeProps      | Additional properties for edges pasted onto the canvas | `Edge.Properties` | - |

## Parameters

None
