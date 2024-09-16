---
title: Using Animation
order: 2
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/advanced
---

## Transition

### Start

We can call the [`cell.transition(...)`](/en/docs/api/model/cell#transition) method to smoothly transition the property value corresponding to the specified path `path` to the target value specified by `target`, and it returns a `stop` method that can be called to immediately stop the animation.

```ts
transition(
  path: string | string[],
  target: Animation.TargetValue,
  options: Animation.StartOptions = {},
  delim: string = '/',
): () => void
```

<span class="tag-param">Parameters<span>

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| path | string \| string[] | ✓ |  | Path. |
| target | any | ✓ |  | Target property value. |
| options.delay | number |  | `10` | Delay before the animation starts, in milliseconds. |
| options.duration | number |  | `100` | Duration of the animation, in milliseconds. |
| options.timing | Timing.Names \| (t: number) => number |  |  | Timing function. |
| options.interp | \<T\>(from: T, to: T) => (time: number) => T |  |  | Interpolation function. |
| options.start | (args: Animation.CallbackArgs) => void |  |  | Callback function when the animation starts. |
| options.progress | (args: Animation.ProgressArgs) => void |  |  | Callback function during the animation execution. |
| options.complete | (args: Animation.CallbackArgs) => void |  |  | Callback function when the animation completes. |
| options.stop | (args: Animation.CallbackArgs) => void |  |  | Callback function when the animation is stopped. |
| options.finish | (args: Animation.CallbackArgs) => void |  |  | Callback function when the animation completes or is stopped. |
| options.jumpedToEnd | boolean |  | `false` | Whether to immediately complete the animation when manually stopped. |
| delim | string |  | `'/'` | String path delimiter. |

We provide several timing functions in the `Timing` namespace. You can use built-in timing function names or provide a function with the signature `(t: number) => number`. The built-in timing functions are as follows:

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

We have built-in some interpolation functions in the `Interp` namespace, which can usually be automatically determined based on the property values along the path. The built-in interpolation functions are as follows:

- number - Numeric interpolation function.
- object - `{ [key: string]: number }` Object interpolation function.
- unit - Numeric + unit string interpolation function, such as `10px`. Supported units include: `px, em, cm, mm, in, pt, pc, %`.
- color - Hex color interpolation function.

> Click the refresh button below to see the animation effect.

<iframe src="/demos/tutorial/advanced/animation/yellow-ball"></iframe>

### Stop

After the animation starts, you can call the [`cell.stopTransition(...)`](/en/docs/api/model/cell#stoptransition) method to stop the animation on the specified path.

```ts
stopTransition(
  path: string | string[],
  options?: Animation.StopOptions<T>,
  delim: string = '/',
): this
```

<span class="tag-param">Parameters<span>

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| path | string \| string[] | ✓ |  | Path. |
| options.jumpedToEnd | boolean |  | `false` | Whether to immediately complete the animation when manually stopped. |
| options.complete | (args: Animation.CallbackArgs) => void |  |  | Callback function when the animation completes. |
| options.stop | (args: Animation.CallbackArgs) => void |  |  | Callback function when the animation is stopped. |
| options.finish | (args: Animation.CallbackArgs) => void |  |  | Callback function when the animation completes or is stopped. |
| delim | string |  | `'/'` | String path delimiter. |

<iframe src="/demos/tutorial/advanced/animation/football"></iframe>

### Events

- `'transition:start'` Triggered when the animation starts
- `'transition:progress'` Triggered during the animation
- `'transition:complete'` Triggered when the animation completes
- `'transition:stop'` Triggered when the animation is stopped
- `'transition:finish'` Triggered when the animation completes or is stopped

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

## Element Animation

You can specify the animation process of a certain property of an element through the `animate()` method on `CellView`. You need to specify the duration of the animation, as well as the initial and final values of the property. It returns a method to stop the animation.

```ts
view.animate(
  elem: SVGElement | string,
  options: Dom.AnimationOptions,
): () => void
```

<span class="tag-param">Parameters<span>

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| elem | SVGElement \| string | ✓ |  | The element or element selector moving along the edge. |
| options.start | (e) => void |  |  | Callback when the animation starts. |
| options.complete | (e) => void |  |  | Callback when the animation ends. |
| options.repeat | (e) => void |  |  | Callback when the animation repeats. |
| options.... |  |  |  | Other key-value pairs representing animation options. |

The animation options can refer to the properties of the [AnimateElement](https://www.w3.org/TR/SVG11/animate.html#AnimateElement).

<span class="tag-example">Usage<span>

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

Through the `animateTransform()` method on `CellView`, you can have more control over the movement and transformation of elements. It can specify transformations, scaling, rotation, and distortion of shapes. It returns a method to stop the animation.

```ts
view.animateTransform(
  elem: SVGElement | string,
  options: Dom.AnimationOptions,
): () => void
```

<span class="tag-param">Parameters<span>

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| elem | SVGElement \| string | ✓ |  | The element or element selector moving along the edge. |
| options.start | (e) => void |  |  | Callback when the animation starts. |
| options.complete | (e) => void |  |  | Callback when the animation ends. |
| options.repeat | (e) => void |  |  | Callback when the animation repeats. |
| options.... |  |  |  | Other key-value pairs representing animation options. |

The animation options can refer to the properties of the [AnimateTransformElement](https://www.w3.org/TR/SVG11/animate.html#AnimateTransformElement).

<span class="tag-example">Usage<span>

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

## Path Animation

### Animation Along a Path

We provide a utility method `Dom.animateAlongPath()` in the `Dom` namespace to trigger an animation that moves along an SVGPathElement path element.

```ts
Dom.animateAlongPath(
  elem: SVGElement,
  options: { [name: string]: string },
  path: SVGPathElement,
): void
```

<span class="tag-param">Parameters<span>

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| elem | SVGElement | ✓ |  | The element moving along the path. |
| options | { [name: string]: string } | ✓ |  | Animation options, please refer to [Animation Timing Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute#Animation_timing_attributes). |
| path | SVGPathElement | ✓ |  | Path element. |

You can also create a Vector object using the `Vector.create(...)` method, and then call the `animateAlongPath` method on that object to make the Vector object move along the specified path.

```ts
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

### Animation Along an Edge

We can call the `sendToken(...)` method on EdgeView to trigger an animation that moves along the edge, while returning a method to stop that animation.

```ts
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

<span class="tag-param">Parameters<span>

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| token | SVGElement \| string | ✓ |  | The element or element selector moving along the edge. |
| options.duration | number |  | `1000` | Duration of the animation, in milliseconds. |
| options.reversed | boolean |  | `false` | Whether to move in the reverse direction, i.e., from the endpoint of the edge to the starting point. |
| options.selector | string |  | `undefined` | The SVGPathElement element referenced for the animation, defaulting to moving along the edge's SVGPathElement. |
| options.start | (e) => void |  |  | Callback when the animation starts. |
| options.complete | (e) => void |  |  | Callback when the animation ends. |
| options.repeat | (e) => void |  |  | Callback when the animation repeats. |
| options.... |  |  |  | Other key-value pairs representing animation options. |
| callback | () => void |  |  | Callback function after the animation completes. |

The animation options can refer to the properties of the [AnimateMotionElement](https://www.w3.org/TR/SVG11/animate.html#AnimateMotionElement).

<span class="tag-example">Usage<span>

```ts
const view = graph.findViewByCell(edge) as EdgeView
const token = Vector.create('circle', { r: 6, fill: 'green' })
const stop = view.sendToken(token.node, 1000)

// Stop the animation after 5 seconds
setTimeout(stop, 5000)
```

<iframe src="/demos/tutorial/advanced/animation/signal"></iframe>
