---
title: useKeyboard 
order: 7
redirect_from:
 - /zh/docs
 - /zh/docs/xflow
 - /zh/docs/xflow/hooks
---

实现画布快捷键的 Hook

## 基础用法

```tsx
  useKeyboard('ctrl+c', () => { ... });
```

下面是使用 `useKeyboard` 的简单示例
`Ctrl + C`  复制节点
`Ctrl + V`  粘贴节点

<code id="xflow-hooks-use-key-board" src="@/src/xflow/hooks/use-key-board/index.tsx"></code>

## API

```tsx
  
useKeyboard(
   key: string | string[],
   callback: (e) => void,
   action?: 'keypress' | 'keydown' | 'keyup'
)

```

## 返回值

无

## 参数

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| key | 绑定的快捷键 | `string` \| `string[]` | - |
| callback | 执行快捷键的回调 | `(e: KeyboardEvent) => void` | - |
| action | 触发类型  | `keypress` \| `keydown` \| `keyup` | - |
