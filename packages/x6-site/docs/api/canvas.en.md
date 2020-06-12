---
title: Canvas
order: 2
redirect_from:
  - /en/docs/api
---

## 属性

### [元素属性](/zh/docs/api/general/element#属性)

### [容器属性](/zh/docs/api/general/container#属性)

### width: number

- 画布宽度；

### height: number

- 画布高度；

### container: number | HTMLElement

- 画布容器，可以是容器 `id` 或者 DOM 元素；

### renderer: Renderer (只读属性)

> ⚠️ 注意，该属性为只读属性，不能动态修改。

- 当前使用的渲染引擎，其中 `Renderer` 的类型为:

```ts
export type Renderer = 'canvas' | 'svg';
```

### pixelRatio: number

- 画布大小和所占 DOM 宽高的比例，一般可以使用 `window.devicePixelRatio`，通常情况下无需手动设置该属性；

### cursor: Cursor

- 画布的 cursor 样式，其中 `Cursor` 为样式类型，可参考 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)。

## 方法

### [元素方法](/zh/docs/api/general/element#方法)

### [容器方法](/zh/docs/api/general/container#方法)

## getRenderer(): Renderer

- 获取渲染引擎，其中 `Renderer` 的类型为:

```ts
export type Renderer = 'canvas' | 'svg';
```

## getCursor(): Cursor

- 获取画布的 cursor 样式，其中 `Cursor` 为样式类型，可参考 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)。

## setCursor(cursor: Cursor)

- 设置画布的 cursor 样式，其中 `Cursor` 为样式类型，可参考 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)。

### changeSize(width: number, height: number)

- 修改画布大小；

### getPointByEvent(ev: Event): Point

- 根据事件对象获取画布坐标，返回类型为 `{ x: number, y: number }`；

### getClientByEvent(ev: Event): Point

- 根据事件对象获取窗口坐标，返回类型为 `{ x: number, y: number }`；

### getPointByClient(clientX: number, clientY: number)

- 根据窗口坐标，获取对应的画布坐标，返回类型为 `{ x: number, y: number }`；

### getClientByPoint(x: number, y: number)

- 根据画布坐标，获取对应的窗口坐标，返回类型为 `{ x: number, y: number }`；

### draw()

- 绘制方法，在 `自动渲染` 模式下无需手动调用，在 `手动渲染` 模式下需要手动调用；
