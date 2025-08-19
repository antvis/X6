---
title: Coordinate Systems
order: 7
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/graph
---

## Demo

<code id="api-graph-coord" src="@/src/api/coord/playground/index.tsx"></code>

In position calculations, we often need to perform coordinate conversions. In X6, there are two coordinate systems: the local canvas coordinate system `local` and the graph coordinate system `graph`. Sometimes, we also need to involve the browser coordinate system. Here's a unified explanation:

-  `local`: The local canvas coordinate system, which defaults to being consistent with the `graph` coordinate system but will change with canvas scaling and translation. All node coordinates in the canvas are based on the `local` coordinate system.
-  `graph`: The graph coordinate system, which is the canvas viewport we see and will not change with canvas scaling and translation.
-  `client`: The browser coordinate system, where `e.clientX` and `e.clientY` in mouse events are relative to the browser coordinate system.
-  `page`: The page coordinate system, which considers page horizontal and vertical scrolling compared to `client`. `e.pageX` and `e.pageY` in mouse events are relative to the page coordinate system.

## Methods

### pageToLocal(...)

```ts
pageToLocal(rect: Rectangle.RectangleLike): Rectangle
pageToLocal(x: number, y: number, width: number, height: number): Rectangle
pageToLocal(p: Point.PointLike): Point
pageToLocal(x: number, y: number): Point
```

Converts page coordinates to local canvas coordinates.

### localToPage(...)

```ts
localToPage(rect: Rectangle.RectangleLike): Rectangle
localToPage(x: number, y: number, width: number, height: number): Rectangle
localToPage(p: Point.PointLike): Point
localToPage(x: number, y: number): Point
```

Converts local canvas coordinates to page coordinates.

### clientToLocal(...)

```ts
clientToLocal(rect: Rectangle.RectangleLike): Rectangle
clientToLocal(x: number, y: number, width: number, height: number): Rectangle
clientToLocal(p: Point.PointLike): Point
clientToLocal(x: number, y: number): Point
```

Converts browser coordinates to local canvas coordinates.

### localToClient(...)

```ts
localToClient(rect: Rectangle.RectangleLike): Rectangle
localToClient(x: number, y: number, width: number, height: number): Rectangle
localToClient(p: Point.PointLike): Point
localToClient(x: number, y: number): Point
```

Converts local canvas coordinates to browser coordinates.

### localToGraph(...)

```ts
localToGraph(rect: Rectangle.RectangleLike): Rectangle
localToGraph(x: number, y: number, width: number, height: number): Rectangle
localToGraphPoint(p: Point.PointLike): Point
localToGraphPoint(x: number, y: number): Point
```

Converts local canvas coordinates to graph coordinates.

### graphToLocal(...)

```ts
graphToLocal(rect: Rectangle.RectangleLike): Rectangle
graphToLocal(x: number, y: number, width: number, height: number): Rectangle
graphToLocal(p: Point.PointLike): Point
graphToLocal(x: number, y: number): Point
```

Converts graph coordinates to local canvas coordinates.

### snapToGrid(...)

```ts
snapToGrid(p: Point.PointLike): Point
snapToGrid(x: number, y: number): Point
```

Convert browser coordinates to canvas [local coordinates](#clienttolocal) and align to the canvas grid.
