---
title: Animation
order: 7
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

## Adding Animations
In X6, adding animations to nodes or edges can significantly enhance the visual effects and interactive experience of the canvas. It supports multiple animation implementations including the `animate` API, CSS animations, and SMIL animations. Among these, the `animate` API is the most powerful, and this article will focus on its usage. Here's a basic animation example:

```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

const node = graph.addNode({
  shape: 'rect',
  label: 'hello X6',
  x: 100,
  y: 140,
  width: 100,
  height: 50,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
  },
})

node.animate(
  // Move the node's position from its original location to (300, 140) via animation
  { 'position/x': 300 },
  // Animation duration is 1000ms, when reaching the end point it will alternate back, with infinite iterations
  { duration: 1000, direction: 'alternate', iterations: Infinity },
)
```

For developers familiar with the Web Animations API, it's clear that X6's `animate` API is based on the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) standard. Therefore, its usage is largely compatible with the Web Animations API and implements most of its core features.

The `animate` API accepts two key parameters:
1. **Keyframe configuration**: Specifies the properties to animate and their target values. In this example, configured as an object where:
   - **key** (position/x): The property path to animate
   - **value** (300): The target value, moving the node from its current position to x-coordinate 300
2. **Animation configuration**: Parameters controlling animation behavior, including:
  - `duration`: 1000 means each animation cycle lasts 1000ms
  - `direction`: 'alternate' means the animation will alternate between start and end points
  - `iterations`: Infinity means the animation will repeat indefinitely


### Animation Properties
Some developers might wonder why we use `position/x` instead of directly using the `x` property. This is because X6's animation system is implemented based on the `cell.setPropByPath()` method, which modifies property values via property paths. A node's property structure typically looks like this (can also be obtained via `cell.prop()` method):
```js
{
  // ...
  position: {x: 370, y: 180},
  size: {width: 100, height: 60},
  attrs: {
    // ...
  }
}
```
Therefore, animating the position is done through `position/x`, with child properties concatenated using `/`. Other animation properties follow the same pattern. For example, to animate node size:
```js
// Set node width to 200 with animation
node.animate({'size/width': 200 },1000)
```

Understanding this property mechanism means you can animate not just built-in node properties but also custom properties. For example, animating a custom `ratio` property in the node's `data`:
```js | ob { inject: true, pin: false }
import { Dom, Graph, Shape } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    // Custom HTML node receives an area ratio to control div size, which can be animated
    const { ratio } = cell.getData() ?? {}
    const div = document.createElement('div')
    const area = 12000
    const width = Math.sqrt(area / ratio)
    const height = width * ratio
    Dom.css(div, {
      width,
      height,
      background: '#fff',
      borderRadius: 10,
      border: "1px solid #000"
    })

    return div
  },
})

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

graph.addNode({
  shape: 'custom-html',
  x: 80,
  y: 80,
  data: { ratio: 1 },
  animation: [
    // Animate the custom node's aspect ratio
    [{ 'data/ratio': 3 / 5 }, { duration: 1000, iterations: Infinity }],
  ],
})
```

### Declarative Animation
Besides using the API to add animations, the `animate` API also supports adding animations through node's `animation` configuration, eliminating an extra step which can be practical in many scenarios. The following example achieves the same animation as above:

```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

graph.addNode({
  shape: 'rect',
  label: 'hello X6',
  x: 100,
  y: 140,
  width: 100,
  height: 50,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
  },
  // Write animation configuration directly in node config, animation starts automatically when node is added to canvas
  animation: [
    [
      { 'position/x': 300 },
      { duration: 1000, direction: 'alternate', iterations: Infinity },
    ],
  ],
})
```
The `animation` configuration is an array:
- Each item is an animation parameter array (corresponding to `animate` parameters)
- After the node is added to the canvas, animations will automatically play according to the configuration


### Registering Animated Shapes
A common scenario is adding the same animation to multiple nodes. Whether through repeated `animate` API calls or configuration, each node requires repetitive operations. X6 inherently supports reusing nodes by registering `Shape`, and animations can also be registered into `Shape` to enable animations for a group of nodes:
```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

Graph.registerNode(
  'animated-rect',
  {
    inherit: 'rect',
    width: 150,
    height: 60,
    attrs: {
      body: {
        strokeWidth: 1,
        rx: 6,
        ry: 6,
      },
    },
    // Pre-configure animation when registering Shape
    animation: [
      [
        { 'position/x': 300 },
        { duration: 1000, direction: 'alternate', iterations: Infinity },
      ],
    ],
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

graph.addNode({
  shape: 'animated-rect',
  x: 100,
  y: 50,
  label: "hello X6"
})

graph.addNode({
  shape: 'animated-rect',
  x: 100,
  y: 150,
  label: "hello Animation"
})
```

## Animation Control
X6's `animate` API is designed based on the Web Animations API, so it similarly supports flexible animation control capabilities like pause, resume, cancel, etc. Here's a simple animation control example:
```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

const node = graph.addNode({
  shape: 'rect',
  label: 'Click me to pause',
  x: 100,
  y: 140,
  width: 150,
  height: 60,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
  },
  animation: [
    [
      { 'position/x': 300 },
      { duration: 1000, direction: 'alternate', iterations: Infinity },
    ],
  ],
})

graph.on('node:click', ({ cell }) => {
  if (cell === node) {
    const [animation] = cell.getAnimations()
    animation.pause()
  }
})
```
Besides pausing animations, the `animate` API supports the following capabilities:
- `pause()` Pause animation
- `play()` Play/resume animation
- `cancel()` Cancel animation
- `finish()` Finish animation
- `reverse()` Play animation in reverse
- `updatePlaybackRate()` Update animation playback speed
  
## Animation Events
X6 supports two styles of animation events. One is based on Web Animations API design, such as setting `onfinish` to listen for animation events:
```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

const node = graph.addNode({
  shape: 'rect',
  label: 'Click me to start',
  x: 100,
  y: 140,
  width: 150,
  height: 60,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
  },
})

graph.on('node:click', ({ cell }) => {
  if (cell !== node) return

  const animation = node.animate(
    { 'position/x': [100, 300] },
    { duration: 1000, direction: 'alternate', iterations: 1 },
  )

// Listen to animation events via onfinish
  animation.onfinish = () => {
    console.log('Animation finished')
  }
})

```
Web Animations API style supports these events:
- `onfinish` Animation finished
- `oncancel` Animation canceled

The other style is based on X6's own design, using the `on` API to listen for animation events:
```js | ob { inject: true, pin: false }
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  height: 300,
  background: {
    color: '#F2F7FA',
  },
})

const node = graph.addNode({
  shape: 'rect',
  label: 'Click me to start',
  x: 100,
  y: 140,
  width: 150,
  height: 60,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
  },
})

graph.on('node:click', ({ cell }) => {
  if (cell !== node) return

  node.animate(
    { 'position/x': [100, 300] },
    { duration: 1000, direction: 'alternate', iterations: 1 },
  )
})

// Listen to animation events via on
graph.on('node:animation:finish', () => {
  console.log('Animation finished')
})

```
X6's native event system supports these events:
- `cell:animation:finish` Animation finished
- `cell:animation:cancel` Animation canceled
  
For detailed X6 event system, see [Events](/tutorial/basic/events).
