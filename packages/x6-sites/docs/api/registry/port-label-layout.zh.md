---
title: PortLabelLayout
order: 0
redirect_from:
  - /zh/docs/api
  - /zh/docs/api/registry
---

```ts
type Definition<T> = (
  portPosition: Point, 
  elemBBox: Rectangle, 
  args: T,
) => Result

interface Result {
  position: Point.PointLike
  angle: number
  attrs: Attr.CellAttrs
}
```
