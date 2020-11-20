---
title: NodeView
order: 2
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/view
---

节点视图，继承自 [CellView](./cellview)。

## constructor

```sign
constructor(node: Node, options?: NodeView.Options): NodeView
```

## prototype

### isNodeView()

```sign
isNodeView(): boolean
```

返回该视图是否是节点视图。默认返回 `true`。

### isEdgeView()

```sign
isEdgeView(): boolean
```

返回该视图是否是边视图。默认返回 `false`。
