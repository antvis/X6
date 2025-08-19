---
title: useHistory 
order: 6
redirect_from:
 - /zh/docs
 - /zh/docs/xflow
 - /zh/docs/xflow/hooks
---

用于实现画布历史记录的 Hook

## 基础用法

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

## 返回值

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| undo| 撤销 `options` 将被传递到事件回调中 | `(options?: KeyValue) => Graph` \| `null` | - |
| redo| 重做 `options` 将被传递到事件回调中| `(options?: KeyValue) => Graph` \| `null` | - |
| canUndo| 是否可以撤销 | `boolean` | `false` |
| canRedo| 是否可以重做 | `boolean` | `false` |

## 参数

无
