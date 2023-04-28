---
title: 坐标系
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/graph
---

## 演示

<code id="api-graph-coord" src="@/src/api/coord/playground/index.tsx"></code>

在位置计算中，我们经常需要做坐标转换，在 X6 中，存在两个坐标系，一个是画布本地坐标系 `local`，一个是画布坐标系 `graph`，有时候还要涉及到浏览器坐标系，这里统一做一个解释：

- `local`：画布本地坐标系，默认情况下和 `graph` 坐标系一致，但是会随着画布的缩放和平移发生改变。画布中所有节点的坐标都是以 `local` 坐标系为准。
- `graph`：画布坐标系，也就是我们看到的画布视口，它不会随着画布缩放和平移而改变。
- `client`：浏览器坐标系，鼠标事件中的 `e.clinetX`、`e.clientY` 就是相对于浏览器坐标系。
- `page`：页面坐标系，与 `client` 相比，`page` 会考虑页面水平和垂直方向滚动。鼠标事件中的 `e.pageX`、`e.pageY` 就是相对于页面坐标系。

## 方法

### pageToLocal(...)

```ts
pageToLocal(rect: Rectangle.RectangleLike): Rectangle
pageToLocal(x: number, y: number, width: number, height: number): Rectangle
pageToLocal(p: Point.PointLike): Point
pageToLocal(x: number, y: number): Point
```

将页面坐标转换为画布本地坐标。

### localToPage(...)

```ts
localToPage(rect: Rectangle.RectangleLike): Rectangle
localToPage(x: number, y: number, width: number, height: number): Rectangle
localToPage(p: Point.PointLike): Point
localToPage(x: number, y: number): Point
```

将画布本地坐标转换为页面坐标。

### clientToLocal(...)

```ts
clientToLocal(rect: Rectangle.RectangleLike): Rectangle
clientToLocal(x: number, y: number, width: number, height: number): Rectangle
clientToLocal(p: Point.PointLike): Point
clientToLocal(x: number, y: number): Point
```

将页面的浏览器坐标转换画布本地坐标。

### localToClient(...)

```ts
localToClient(rect: Rectangle.RectangleLike): Rectangle
localToClient(x: number, y: number, width: number, height: number): Rectangle
localToClient(p: Point.PointLike): Point
localToClient(x: number, y: number): Point
```

将画布本地坐标转换为浏览器坐标。


### localToGraph(...)

```ts
localToGraph(rect: Rectangle.RectangleLike): Rectangle
localToGraph(x: number, y: number, width: number, height: number): Rectangle
localToGraphPoint(p: Point.PointLike): Point
localToGraphPoint(x: number, y: number): Point
```

将画布本地坐标转换为画布坐标。

### graphToLocal(...)

```ts
graphToLocal(rect: Rectangle.RectangleLike): Rectangle
graphToLocal(x: number, y: number, width: number, height: number): Rectangle
graphToLocal(p: Point.PointLike): Point
graphToLocal(x: number, y: number): Point
```

将画布坐标转换为画布本地坐标。


### snapToGrid(...)

```ts
snapToGrid(p: Point.PointLike): Point
snapToGrid(x: number, y: number): Point
```

将浏览器坐标转换为画布[本地坐标](#clienttolocal)并对齐到画布网格。
