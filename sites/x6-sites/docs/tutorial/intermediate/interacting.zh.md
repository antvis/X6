---
title: 节点和边的交互
order: 17
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/advanced
---

## 调整节点大小

可以在全局配置 `resizing` 来启用调整节点大小的功能。

```ts
const graph = new Graph({
  resizing: {
    enabled: true,
  },
})
```
### 演示

<iframe src="/demos/tutorial/intermediate/interacting/resizing"></iframe>

### 选项

#### enabled

是否支持调整节点大小，默认为 `false`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### minWidth

最小的调整宽度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### maxWidth

最大的调整宽度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### minHeight

最小的调整高度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### maxHeight

最大的调整高度，支持以下两种方式：

- `number`
- `(this: Graph, node: Node) => number`

#### orthogonal

是否显示中间调整点，默认为 `true`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### restricted

调整大小边界是否可以超出画布边缘，默认为 `false`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### autoScroll

是否自动滚动画布，仅当开启 Srcoller 并且 `restricted` 为 `false` 时有效，默认为 `true`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

#### preserveAspectRatio

调整大小过程中是否保持节点的宽高比例，默认为 `false`。支持以下两种方式：

- `boolean`
- `(this: Graph, node: Node) => boolean`

## 调整节点旋转角度

## 限制节点移动

## 连线规则

## 定制交互行为

