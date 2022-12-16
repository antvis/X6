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

我们可以调用 [`cell.transition(...)`](/zh/docs/api/model/cell#transition) 方法，来将指定路径 `path` 上对应的属性值通过平滑动画的形式过渡到 `target` 指定的目标值，并返回 `stop` 方法，调用该方法时立即停止该动画。

```sign
transition(
  path: string | string[],
  target: Animation.TargetValue,
  options: Animation.StartOptions = {},
  delim: string = '/',
): () => void
```

<span class="tag-param">参数<span>

| 名称                | 类型                                         | 必选 | 默认值  | 描述                               |
|---------------------|----------------------------------------------|:----:|---------|----------------------------------|
| path                | string \| string[]                           |  ✓   |         | 路径。                              |
| target              | any                                          |  ✓   |         | 目标属性值。                        |
| options.delay       | number                                       |      | `10`    | 动画延迟多久后开始，单位毫秒。       |
| options.duration    | number                                       |      | `100`   | 动画时长，单位毫秒。                 |
| options.timing      | Timing.Names \| (t: number) => number        |      |         | 定时函数。                          |
| options.interp      | \<T\>(from: T, to: T) => (time: number) => T |      |         | 插值函数。                          |
| options.start       | (args: Animation.CallbackArgs) => void       |      |         | 动画开始执行时的回调函数。          |
| options.progress    | (args: Animation.ProgressArgs) => void       |      |         | 动画执行过程中的回调函数。          |
| options.complete    | (args: Animation.CallbackArgs) => void       |      |         | 动画执行完成时的回调函数。          |
| options.stop        | (args: Animation.CallbackArgs) => void       |      |         | 动画被停止时的回调函数。            |
| options.finish      | (args: Animation.CallbackArgs) => void       |      |         | 动画执行完成或被停止时的回调函数。  |
| options.jumpedToEnd | boolean                                      |      | `false` | 手动停止动画时，是否立即将动画完成。 |
| delim               | string                                       |      | `'/'`   | 字符串路径分隔符。                  |

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

动画开始后可以调用 [`cell.stopTransition(...)`](/zh/docs/api/model/cell#stoptransition) 方法来停止指定路径上的动画。

```sign
stopTransition(
  path: string | string[],
  options?: Animation.StopOptions<T>,
  delim: string = '/',
): this
```

<span class="tag-param">参数<span>

| 名称                | 类型                                   | 必选 | 默认值  | 描述                               |
|---------------------|----------------------------------------|:----:|---------|----------------------------------|
| path                | string \| string[]                     |  ✓   |         | 路径。                              |
| options.jumpedToEnd | boolean                                |      | `false` | 手动停止动画时，是否立即将动画完成。 |
| options.complete    | (args: Animation.CallbackArgs) => void |      |         | 动画执行完成时的回调函数。          |
| options.stop        | (args: Animation.CallbackArgs) => void |      |         | 动画被停止时的回调函数。            |
| options.finish      | (args: Animation.CallbackArgs) => void |      |         | 动画执行完成或被停止时的回调函数。  |
| delim               | string                                 |      | `'/'`   | 字符串路径分隔符。                  |

<iframe src="/demos/tutorial/advanced/animation/football"></iframe>

### 事件

- `'transition:start'` 动画开始时触发
- `'transition:progress'` 动画过程中触发
- `'transition:complete'` 动画完成时触发
- `'transition:stop'` 动画被停止时触发
- `'transition:finish'` 动画完成或被停止时触发

```ts
cell.on('transition:start', (args: Animation.CallbackArgs) => {})
cell.on('transition:progress', (args: Animation.ProgressArgs) => {})
cell.on('transition:complete', (args: Animation.CallbackArgs) => {})
cell.on('transition:stop', (args: Animation.StopArgs) => {})
cell.on('transition:finish', (args: Animation.CallbackArgs) => {})

graph.on('cell:transition:start', (args: Animation.CallbackArgs) => {})
graph.on('cell:transition:progress', (args: Animation.ProgressArgs) => {})
graph.on('cell:transition:complete', (args: Animation.CallbackArgs) => {})
graph.on('cell:transition:stop', (args: Animation.StopArgs) => {})
graph.on('cell:transition:finish', (args: Animation.CallbackArgs) => {})

graph.on('node:transition:start', (args: Animation.CallbackArgs) => {})
graph.on('node:transition:progress', (args: Animation.ProgressArgs) => {})
graph.on('node:transition:complete', (args: Animation.CallbackArgs) => {})
graph.on('node:transition:stop', (args: Animation.StopArgs) => {})
graph.on('node:transition:finish', (args: Animation.CallbackArgs) => {})

graph.on('edge:transition:start', (args: Animation.CallbackArgs) => {})
graph.on('edge:transition:progress', (args: Animation.ProgressArgs) => {})
graph.on('edge:transition:complete', (args: Animation.CallbackArgs) => {})
graph.on('edge:transition:stop', (args: Animation.StopArgs) => {})
graph.on('edge:transition:finish', (args: Animation.CallbackArgs) => {})
```

<iframe src="/demos/tutorial/advanced/animation/ufo"></iframe>

## 元素动画

可以通过 `CellView` 上的 `animate()` 方法指定元素的某个属性动画变化过程，我们需要制定动画的持续时间，以及属性值的初始值和变化后的值。返回停止该动画的方法。

```sign
view.animate(
  elem: SVGElement | string,
  options: Dom.AnimationOptions,
): () => void
```

<span class="tag-param">参数<span>

| 名称             | 类型                 | 必选 | 默认值 | 描述                        |
|------------------|----------------------|:----:|--------|---------------------------|
| elem             | SVGElement \| string |  ✓   |        | 沿边运动的元素或元素选择器。 |
| options.start    | (e) => void          |      |        | 动画开始时的回调。           |
| options.complete | (e) => void          |      |        | 动画结束时的回调。           |
| options.repeat   | (e) => void          |      |        | 动画重复执行时的回调。       |
| options....      |                      |      |        | 其他键值对，表示动画选项。    |

其中，动画选项可以参考 [AnimateElement](https://www.w3.org/TR/SVG11/animate.html#AnimateElement) 元素的属性。

<span class="tag-example">使用<span>

```ts
const rect = graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
})

const view = graph.findView(rect)
if (view) {
  view.animate('rect', {
    attributeType: 'XML',
    attributeName: 'x',
    from: 40,
    to: 120,
    dur: '1s',
    repeatCount: 'indefinite',
  })
}
```

<iframe src="/demos/tutorial/advanced/animation/animate"></iframe>

通过 `CellView` 上的 `animateTransform()` 方法对元素的运动和变换有更多的控制，它可以指定图形的变换、缩放、旋转和扭曲等。返回停止该动画的方法。

```sign
view.animateTransform(
  elem: SVGElement | string,
  options: Dom.AnimationOptions,
): () => void
```

<span class="tag-param">参数<span>

| 名称             | 类型                 | 必选 | 默认值 | 描述                        |
|------------------|----------------------|:----:|--------|---------------------------|
| elem             | SVGElement \| string |  ✓   |        | 沿边运动的元素或元素选择器。 |
| options.start    | (e) => void          |      |        | 动画开始时的回调。           |
| options.complete | (e) => void          |      |        | 动画结束时的回调。           |
| options.repeat   | (e) => void          |      |        | 动画重复执行时的回调。       |
| options....      |                      |      |        | 其他键值对，表示动画选项。    |

其中，动画选项可以参考 [AnimateTransformElement](https://www.w3.org/TR/SVG11/animate.html#AnimateTransformElement) 元素的属性。

<span class="tag-example">使用<span>

```ts
const rect = graph.addNode({
  x: 60,
  y: 60,
  width: 30,
  height: 30,
})

const view = graph.findView(rect)
if (view) {
  view.animateTransform('rect', {
    attributeType: 'XML',
    attributeName: 'transform',
    type: 'rotate',
    from: '0 0 0',
    to: '360 0 0',
    dur: '3s',
    repeatCount: 'indefinite',
  })
}
```

<iframe src="/demos/tutorial/advanced/animation/animate-transform"></iframe>

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

也可以使用 `Vector.create(...)` 方法创建一个 Vector 对象，然后调用该对象上的 `animateAlongPath` 方法来使该 Vector 对象沿指定的路径运动。

```sign
Vector.prototype.animateAlongPath(
  options: { [name: string]: string }, 
  path: SVGPathElement
): () => void
```

```ts
const view = graph.findViewByCell(cylinder)
if (view) {
  const path = view.findOne('path') as SVGPathElement
  if (path) {
    const token = Vector.create('circle', { r: 8, fill: 'red' })
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

我们可以调用 EdgeView 上的 [`sendToken(...)`](/zh/docs/api/view/edgeview#sendtoken) 方法来触发一个沿边运动的动画，同时返回一个停止该动画的方法。

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
  callback?: () => void,
): () => void
```

<span class="tag-param">参数<span>

| 名称             | 类型                 | 必选 | 默认值      | 描述                                                           |
|------------------|----------------------|:----:|-------------|--------------------------------------------------------------|
| token            | SVGElement \| string |  ✓   |             | 沿边运动的元素或元素选择器。                                    |
| options.duration | number               |      | `1000`      | 动画持续的时间，单位毫秒。                                       |
| options.reversed | boolean              |      | `false`     | 是否沿反方向运动，即从边的终点运动到起点。                       |
| options.selector | string               |      | `undefined` | 动画参照的 SVGPathElement 元素，默认沿边的 SVGPathElement 运动。 |
| options.start    | (e) => void          |      |             | 动画开始时的回调。                                              |
| options.complete | (e) => void          |      |             | 动画结束时的回调。                                              |
| options.repeat   | (e) => void          |      |             | 动画重复执行时的回调。                                          |
| options....      |                      |      |             | 其他键值对，表示动画选项。                                       |
| callback         | () => void           |      |             | 动画执行完成后的回调函数。                                      |

其中，动画选项可以参考 [AnimateMotionElement](https://www.w3.org/TR/SVG11/animate.html#AnimateMotionElement) 元素的属性。

<span class="tag-example">使用<span>

```ts
const view = graph.findViewByCell(edge) as EdgeView
const token = Vector.create('circle', { r: 6, fill: 'green' })
const stop = view.sendToken(token.node, 1000)

// 5s 后停止该动画
setTimeout(stop, 5000)
```

<iframe src="/demos/tutorial/advanced/animation/signal"></iframe>
