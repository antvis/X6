---
title: useGraphEvent 
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/hooks
---

画布事件监听的 Hook

## 基础用法

```tsx
 useGraphEvent('blank:click', () => { ... });
```

下面是使用 `useGraphEvent` 的简单示例
监听节点点击事件，随机改变节点颜色
<code id="xflow-hooks-use-graph-event" src="@/src/xflow/hooks/use-graph-event/index.tsx"></code>

## API

```tsx
 useGraphEvent<T extends keyof EventArgs>(
  name:T, 
  callback: (args: EventArgs[T]) => void
);
```

## 返回值

无

## 参数

具体监听的事件类型请参考 [X6-事件](/tutorial/basic/events)
| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| name| 监听的事件 | `T` | - |
| callback| 监听事件的回调 | `(args: EventArgs[T]) => void` | - |

