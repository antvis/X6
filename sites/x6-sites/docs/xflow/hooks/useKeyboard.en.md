---
title: useKeyboard 
order: 7
redirect_from:
 - /en/docs
 - /en/docs/xflow
 - /en/docs/xflow/hooks
---

Implementing a Hook for Canvas Keyboard Shortcuts

## Basic Usage

```tsx
  useKeyboard('ctrl+c', () => { ... });
```

Here is a simple example of using `useKeyboard`:
`Ctrl + C` to copy a node
`Ctrl + V` to paste a node

<code id="xflow-hooks-use-key-board" src="@/src/xflow/hooks/use-key-board/index.tsx"></code>

## API

```tsx
  
useKeyboard(
   key: string | string[],
   callback: (e) => void,
   action?: 'keypress' | 'keydown' | 'keyup'
)

```

## Return Value

None

## Parameters

| Parameter | Description | Type | Default Value |
|-----------|-------------|------|---------------|
| key       | The shortcut key to bind | `string` \| `string[]` | - |
| callback  | The callback to execute on the shortcut key | `(e: KeyboardEvent) => void` | - |
| action    | The trigger type | `keypress` \| `keydown` \| `keyup` | - |
