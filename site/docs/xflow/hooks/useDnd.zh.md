---
title: useDnd 
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/xflow
  - /zh/docs/xflow/hooks
---

快速实现节点拖拽的 Hook

## 基础用法

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

## 返回值

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-----|
| startDrag | 拖拽节点函数 | (n: [NodeOptions](#use-dnd-startDrag-options), e: React.MouseEvent<Element, MouseEvent>) => void  |-|

<p id="use-dnd-startDrag-options">NodeOptions 除了继承 Node 类型之外，还拥有两个属性 </p>

Node相关文档请参考 [Node](/api/model/node)

```tsx
interface NodeOptions extends Node {
  selected?: boolean; // 是否被选中
  draggable?: boolean; // 是否可拖拽
}
```

## 参数

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-------|
| options| 拖拽配置 | [Options](#use-dnd-options) | - |

使用 `useDnd` 进行拖拽的时候，可以对其进行配置

<p id="use-dnd-options">Options 类型如下:</p>

| 参数 | 描述 | 类型 | 默认值 |
|--------|------|------|-----|
| scaled | 是否应该缩放拖动节点 | `boolean` | `false` |
| dndContainer | 如果设置 `dndContainer`，在 `dndContainer` 上放开鼠标不会放置节点，常用于 `dnd` 容器处于画布上面的场景 | `HTMLElement` | - |
| draggingContainer | 自定义拖拽画布容器 | `HTMLElement` | `document.body` |
| validateNode | 是否应该缩放拖动节点 |  `(droppingNode: Node, options: ValidateNodeOptions) => boolean ｜ Promins<boolean>` | - |
