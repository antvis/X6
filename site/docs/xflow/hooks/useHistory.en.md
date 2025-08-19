---
title: useHistory 
order: 6
redirect_from:
 - /en/docs
 - /en/docs/xflow
 - /en/docs/xflow/hooks
---

A Hook for implementing canvas history tracking.
## Basic Usage

```tsx
 const { undo, redo, canUndo, canRedo } = useHistory();
```

## API

```tsx
  
const {
  undo: (options) => Graph | null,
  redo: (options) => Graph | null,
  canUndo: boolean,
  canRedo: boolean
} = useHistory();

```

## Return Values

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| undo      | Undo action; `options` will be passed to the event callback | `(options?: KeyValue) => Graph` \| `null` | - |
| redo      | Redo action; `options` will be passed to the event callback | `(options?: KeyValue) => Graph` \| `null` | - |
| canUndo   | Indicates if undo is possible | `boolean` | `false` |
| canRedo   | Indicates if redo is possible | `boolean` | `false` |

## Parameters

None
