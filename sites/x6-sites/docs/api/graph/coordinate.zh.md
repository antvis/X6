---
title: 坐标系
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 方法

### pageToLocal(...)

```ts
pageToLocal(rect: Rectangle.RectangleLike): Rectangle
pageToLocal(x: number, y: number, width: number, height: number): Rectangle
pageToLocal(p: Point.PointLike): Point
pageToLocal(x: number, y: number): Point
```

将页面坐标转换为画布本地坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

页面坐标指鼠标事件的 [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX) 和 [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY) 属性。这两个属性基于文档边缘，考虑页面水平和垂直方向滚动，例如，如果页面向右滚动 `200px` 并出现了滚动条，这部分在窗口之外，然后鼠标点击距离窗口左边 `100px` 的位置，`pageX` 所返回的值将是 `300`。

<!-- <iframe src="/demos/api/graph/coord"></iframe> -->

### localToPage(...)

```ts
localToPage(rect: Rectangle.RectangleLike): Rectangle
localToPage(x: number, y: number, width: number, height: number): Rectangle
localToPage(p: Point.PointLike): Point
localToPage(x: number, y: number): Point
```

将画布本地坐标转换为页面坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

页面坐标指鼠标事件的 [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX) 和 [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY) 属性。这两个属性基于文档边缘，考虑页面水平和垂直方向滚动，例如，如果页面向右滚动 `200px` 并出现了滚动条，这部分在窗口之外，然后鼠标点击距离窗口左边 `100px` 的位置，`pageX` 所返回的值将是 `300`。

<!-- <iframe src="/demos/api/graph/coord"></iframe> -->

### clientToLocal(...)

```ts
clientToLocal(rect: Rectangle.RectangleLike): Rectangle
clientToLocal(x: number, y: number, width: number, height: number): Rectangle
clientToLocal(p: Point.PointLike): Point
clientToLocal(x: number, y: number): Point
```

将页面的客户端坐标转换画布本地坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

客户端坐标指鼠标事件的 [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX) 和 [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY) 属性。例如，不论页面是否有水平滚动，当你点击客户端区域的左上角时，鼠标事件的 `clientX` 值都将为 `0`。

<!-- <iframe src="/demos/api/graph/coord"></iframe> -->

### localToClient(...)

```ts
localToClient(rect: Rectangle.RectangleLike): Rectangle
localToClient(x: number, y: number, width: number, height: number): Rectangle
localToClient(p: Point.PointLike): Point
localToClient(x: number, y: number): Point
```

将画布本地坐标转换为页面的客户端坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

客户端坐标指鼠标事件的 [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX) 和 [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY) 属性。例如，不论页面是否有水平滚动，当你点击客户端区域的左上角时，鼠标事件的 `clientX` 值都将为 `0`。

<!-- <iframe src="/demos/api/graph/coord"></iframe> -->

### localToGraph(...)

```ts
localToGraph(rect: Rectangle.RectangleLike): Rectangle
localToGraph(x: number, y: number, width: number, height: number): Rectangle
localToGraphPoint(p: Point.PointLike): Point
localToGraphPoint(x: number, y: number): Point
```

将画布本地坐标转换为画布坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

画布坐标指相对于画布左上角的坐标，不考虑画布的缩放、平移和旋转。

<!-- <iframe src="/demos/api/graph/coord"></iframe> -->

### graphToLocal(...)

```ts
graphToLocal(rect: Rectangle.RectangleLike): Rectangle
graphToLocal(x: number, y: number, width: number, height: number): Rectangle
graphToLocal(p: Point.PointLike): Point
graphToLocal(x: number, y: number): Point
```

将画布坐标转换为画布本地坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

画布坐标指相对于画布左上角的坐标，不考虑画布的缩放、平移和旋转。

<!-- <iframe src="/demos/api/graph/coord"></iframe> -->

### snapToGrid(...)

```ts
snapToGrid(p: Point.PointLike): Point
snapToGrid(x: number, y: number): Point
```

将页面客户端坐标转换为画布[本地坐标](#clienttolocal)并对齐到画布网格。
