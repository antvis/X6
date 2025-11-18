---
title: useClipboard 
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/hooks
---

用于复制粘贴节点和边的 Hook

## 基础用法

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

## 返回值

| 参数 | 描述 | 类型 |
|--------|------|------|
| copy | 复制元素 | (ids: string[], copyOptions?: [CopyOptions](#CopyOptions-参数如下)) => void |
| paste | 渲染元素 |  (ids: string[], cutOptions?: [CopyOptions](#CopyOptions-参数如下)) => void |
| cut | 渲染元素 |  (pasteOptions?: [PasteOptions](#PasteOptions-参数如下)) => [Cell](/api/model/cell#属性)[] |

<p id="CopyOptions-参数如下">CopyOptions 参数如下</p>

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| deep | 是否递归复制所有子节点/边。 | `boolean` | - |
| useLocalStorage | 是否将复制的节点/边保存在 `localStorage` 中 |  `boolean` | - |

<p id="PasteOptions-参数如下">PasteOptions 参数如下</p>

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| offset | 粘贴到画布的节点/边的偏移量 | `number` \| `{ dx: number; dy: number }` | 20 |
| useLocalStorage | 是否使用 `localStorage` 中的节点/边 |  `boolean` | - |
| nodeProps | 粘贴到画布的节点的额外属性 | `Node.Properties` | - |
| edgeProps | 粘贴到画布的边的额外属性 | `Edge.Properties` | - |

## 参数

无
