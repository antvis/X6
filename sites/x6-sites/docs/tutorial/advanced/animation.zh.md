---
title: 使用动画
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/advanced
---

## Transition

### 开始

我们可以调用 [`cell.transition(...)`](../../api/model/cell#transition) 方法，来将指定路径 `path` 上对应的属性值通过平滑动画的形式过渡到 `target` 指定的目标值。

```sign
transition(
  path: string | string[],
  target: any,
  options: Animation.Options = {},
  delim: string = '/',
): number
```

<span class="tag-param">参数<span>

| 名称             | 类型                                         | 必选 | 默认值 | 描述                         |
|------------------|----------------------------------------------|:----:|--------|----------------------------|
| path             | string \| string[]                           |  ✓   |        | 路径。                        |
| target           | any                                          |  ✓   |        | 目标属性值。                  |
| options.delay    | number                                       |      | `10`   | 动画延迟多久后开始，单位毫秒。 |
| options.duration | number                                       |      | `100`  | 动画时长，单位毫秒。           |
| options.timing   | Timing.Names \| (t: number) => number        |      |        | 定时函数。                    |
| options.interp   | \<T\>(from: T, to: T) => (time: number) => T |      |        | 插值函数。                    |
| delim            | string                                       |      | `'/'`  | 字符串路径分隔符。            |

我们在 `Timing` 命名空间中提供了一些定时函数。可以使用内置的定时函数名，或提供一个具有 `(t: number) => number` 签名的函数。内置的定时函数如下：

- linear
- quad
- cubic
- inout
- exponential
- bounce
- easeInSine
- easeOutSine
- easeInOutSine
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- easeInExpo
- easeOutExpo
- easeInOutExpo
- easeInCirc
- easeOutCirc
- easeInOutCirc
- easeInBack
- easeOutBack
- easeInOutBack
- easeInElastic
- easeOutElastic
- easeInOutElastic
- easeInBounce
- easeOutBounce
- easeInOutBounce


我们在 `Interp` 命名空间上内置了一些插值函数，通常我们可以通过路径上的属性值来自动确定使用哪种插值函数。内置的插值函数如下：

- number - 数字插值函数。
- object - `{ [key: string]: number }` 对象插值函数。
- unit - 数字+单位字符串插值函数，如 `10px`。支持的单位有：`px, em, cm, mm, in, pt, pc, %`。
- color - 16 进制颜色插值函数。

> 点击下面刷新按钮，查看动画效果。

<iframe src="/demos/tutorial/advanced/animation/yellow-ball"></iframe>

### 停止

动画开始后可以调用 [`cell.stopTransition(...)`](../../api/model/cell#stoptransition) 方法来停止指定路径上的动画。

<span class="tag-param">参数<span>

| 名称  | 类型               | 必选 | 默认值 | 描述              |
|-------|--------------------|:----:|--------|-----------------|
| path  | string \| string[] |  ✓   |        | 路径。             |
| delim | string             |      | `'/'`  | 字符串路径分隔符。 |

<iframe src="/demos/tutorial/advanced/animation/football"></iframe>

### 事件

动画开始和结束时分别触发 `'transition:begin'` 和 `'transition:end'` 事件。

```ts
cell.on('transition:begin', ({ cell, path }) => {})
cell.on('transition:end', ({ cell, path }) => {})

graph.on('cell:transition:begin', ({ cell, path }) => {})
graph.on('cell:transition:end', ({ cell, path }) => {})

graph.on('node:transition:begin', ({ node, path }) => {})
graph.on('node:transition:end', ({ node, path }) => {})

graph.on('edge:transition:begin', ({ edge, path }) => {})
graph.on('edge:transition:end', ({ edge, path }) => {})
```

<iframe src="/demos/tutorial/advanced/animation/ufo"></iframe>

## 路径动画

### 沿路径运动的动画

我们在 `Dom` 命名空间中提供了一个工具方法 `Dom.animateAlongPath()` 来触发一个沿 SVGPathElement 路径元素运动的动画。

```sign
Dom.animateAlongPath(
  elem: SVGElement,
  options: { [name: string]: string },
  path: SVGPathElement,
): void
```

<span class="tag-param">参数<span>

| 名称    | 类型                       | 必选 | 默认值 | 描述                                                                                                                                   |
|---------|----------------------------|:----:|--------|--------------------------------------------------------------------------------------------------------------------------------------|
| elem    | SVGElement                 |  ✓   |        | 沿路径运动的元素。                                                                                                                      |
| options | { [name: string]: string } |  ✓   |        | 动画选项，请参考 [Animation Timing Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute#Animation_timing_attributes)。 |
| path    | SVGPathElement             |  ✓   |        | 路径元素。                                                                                                                              |

也可以使用 `Dom.createVector(...)` 方法创建一个 Vectorizer 对象，然后调用该对象上的 `animateAlongPath` 方法来使该 Vectorizer 对象沿指定的路径运动。

```sign
Vectorizer.prototype.animateAlongPath(
  options: { [name: string]: string }, 
  path: SVGPathElement
): this
```

```ts
const view = graph.findViewByCell(cylinder)
if (view) {
  const path = view.findOne('path') as SVGPathElement
  if (path) {
    const token = Dom.createVector('circle', { r: 8, fill: 'red' })
    token.animateAlongPath(
      {
        dur: '4s',
        repeatCount: 'indefinite',
      },
      path,
    )

    token.appendTo(path.parentNode as SVGGElement)
  }
}
```

<iframe src="/demos/tutorial/advanced/animation/along-path"></iframe>

### 沿边运动的动画

我们可以调用 EdgeView 上的 [`sendToken(...)`](../../api/view/edgeview#sendtoken) 方法来触发一个沿边运动的动画。 

```sign
sendToken(
  token: SVGElement | string,
  options?:
    | number
    | {
        duration?: number
        reversed?: boolean
        selector?: string
      },
  callback?: () => any,
): this
```

<span class="tag-param">参数<span>

| 名称             | 类型                 | 必选 | 默认值      | 描述                                                           |
|------------------|----------------------|:----:|-------------|--------------------------------------------------------------|
| token            | SVGElement \| string |  ✓   |             | 沿边运动的元素或元素选择器。                                    |
| options.duration | number               |      | `1000`      | 动画持续的时间，单位毫秒。                                       |
| options.reversed | boolean              |      | `false`     | 是否沿反方向运动，即从边的终点运动到起点。                       |
| options.selector | string               |      | `undefined` | 动画参照的 SVGPathElement 元素，默认沿边的 SVGPathElement 运动。 |
| callback         | () => any            |      |             | 动画执行完成后的回调函数。                                      |

```ts
const view = graph.findViewByCell(edge) as EdgeView
const token = Dom.createVector('circle', { r: 6, fill: 'green' })
view.sendToken(token.node, 1000)
```

<iframe src="/demos/tutorial/advanced/animation/signal"></iframe>
