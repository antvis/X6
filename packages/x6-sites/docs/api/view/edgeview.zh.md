---
title: EdgeView
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/view
---

边视图，继承自 [CellView](./cellview)。

## constructor

```sign
constructor(edge: Edge, options?: EdgeView.Options): EdgeView
```

## prototype

### isNodeView()

```sign
isNodeView(): boolean
```

返回该视图是否是节点视图。默认返回 `false`。

### isEdgeView()

```sign
isEdgeView(): boolean
```

返回该视图是否是边视图。默认返回 `true`。
