---
title: 画布
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中主要介绍画布相关的知识,通过阅读,你可以了解到}

- 画布大小如何做到自适应
- 通过设置背景和网格优化画布样式
- 怎样才能使画布可拖拽可缩放
- 常用的画布尺寸和位置操作 API :::

## 画布大小

在实例化 `Graph` 对象的时候，可以通过设置 `width` 和 `height` 固定画布大小，如果不设置，就会以画布容器大小初始化画布。

在项目实践中，经常会遇到下面两种场景：

- 画布容器还没有渲染完成（此时尺寸为 0），就实例化画布对象，导致画布元素显示异常。
- 页面的 `resize` 导致画布容器大小改变，导致画布元素显示异常。

我们可以使用 `autoResize` 配置来解决上述问题。

```html
<!-- 注意，使用 autoResize 配置时，需要在画布容器外面再套一层宽高都是 100% 的外层容器，在外层容器上监听尺寸改变，当外层容器大小改变时，画布自动重新计算宽高以及元素位置。 -->
<div style="width=100%; height=100%">
  <div id="container"></div>
</div>
```

```ts
const graph = new Graph({
  container: document.getElementById('container'),
  autoResize: true,
})
```

在下面的示例中，我们可以用鼠标拖动灰色的区域，来改变容器大小，可以通过背景颜色看到，三块画布的大小是自适应的。

<code id="auto-resize" src="@/src/tutorial/basic/graph/auto-resize/index.tsx"></code>

## 背景与网格

可以通过 `background` 和 `grid` 两个配置来设置画布的背景以及网格。

<code id="background-grid" src="@/src/tutorial/basic/graph/background-grid/index.tsx"></code>

:::info{title=提示} 在 X6 中，网格是渲染/移动节点的最小单位，默认是 10px ，也就是说位置为 `{ x: 24, y: 38 }` 的节点渲染到画布后的实际位置为 `{ x: 20, y: 40 }` :::

背景不仅支持颜色，还支持背景图片，详细的配置与方法参考 [API](/zh/docs/api/graph/background)。同时，网格支持四种不同类型，并且能配置网格线的颜色以及宽度，详细的配置与方法参考 [API](/zh/docs/api/graph/grid)。

## 缩放与平移

画布的拖拽、缩放也是常用操作，Graph 中通过 `panning` 和 `mousewheel` 配置来实现这两个功能，鼠标按下画布后移动时会拖拽画布，滚动鼠标滚轮会缩放画布。

```ts
const graph = new Graph({
  ...,
  panning: true,
  mousewheel: true
})
```

下面通过一个例子体验一下：

<code id="panning-mousewheel" src="@/src/tutorial/basic/graph/panning-mousewheel/index.tsx"></code>

当然，`panning` 和 `mousewheel` 也支持很多其他的配置，比如修饰键（按下修饰键才能触发相应的行为）、缩放因子(速率)等等，我们可以通过 [API](/zh/docs/api/graph/mousewheel) 了解更多内容。

## 常用 API

除了上述的一些配置，X6 还有丰富的 API 对画布尺寸、位置进行操作，下面列举一些常用的 API，更详细的内容见 [API](/zh/docs/api/graph/transform)。

```ts
graph.resize(800, 600) // resize 画布大小
graph.translate(20, 20) // 在 x、y 方向上平移画布
graph.zoom(0.2) // 将画布缩放级别增加 0.2（默认为1）
graph.zoom(-0.2) // 将画布缩放级别减少 0.2
graph.zoomTo(1.2) // 将画布缩放级别设置为 1.2
// 将画布中元素缩小或者放大一定级别，让画布正好容纳所有元素，可以通过 maxScale 配置最大缩放级别
graph.zoomToFit({ maxScale: 1 })
graph.centerContent() // 将画布中元素居中展示
```

<code id="transform" src="@/src/tutorial/basic/graph/transform/index.tsx"></code>
