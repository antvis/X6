---
title: 动画
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

## 添加动画
在 X6 中，为节点或边添加动画能够显著提升画布的视觉效果和交互体验。支持多种动画实现方式，包括 `animate` API、CSS 动画和 SMIL 动画等。其中，`animate` API 功能最为强大，本文将重点介绍其使用方法。以下是一个基础动画示例：

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
  // 将节点的位置从原本的位置通过动画移动到 (300, 140)
  { 'position/x': 300 },
  // 动画持续时间为 1000ms，当动画运动到终点后下次将从终点开始运动，重复次数为无穷
  { duration: 1000, direction: 'alternate', iterations: Infinity },
)
```

对于熟悉 Web Animations API 的开发者而言，可以明显看出 X6 的 `animate` API 是基于 [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) 标准实现的。因此，其使用方式与 Web Animations API 基本兼容，并实现了该标准中的大部分核心功能。

`animate` API 接收两个关键参数：
1. **关键帧配置**：指定需要添加动画效果的属性及其目标值。在本例中，通过对象形式配置，其中：
   - **key**（position/x）：表示需要添加动画的属性路径
   - **value**（300）：表示该属性的目标值，即将节点从当前位置移动到 x 坐标为 300 的位置
2. **动画配置**：控制动画行为的参数对象，包含以下主要配置项：
  - `duration` 为 1000 表示动画运行一次的时间为 1000ms
  - `direction` 为 alternate 表示动画将在起点和终点之间来回运动
  - `iterations` 为 Infinity 表示动画将无限次重复


### 动画属性
部分开发者可能对使用 `position/x` 而非直接使用 `x` 属性存在疑问，这是因为 X6 的动画系统基于 `cell.setPropByPath()` 方法实现，该方法通过属性路径来修改属性值。节点的属性结构通常如下所示（也可通过 `cell.prop()` 方法获取）：
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
所以给位置添加动画是通过 `position/x` 来设置动画效果，子属性使用 `/` 来拼接，其他动画属性同理。例如想要给节点大小添加动画，就可以这样写：
```js
// 将节点的宽度设置为 200 并且添加动画
node.animate({'size/width': 200 },1000)
```

理解了动画支持的属性机制，那么就可以给 X6 节点内置属性外的额外属性也添加动画效果，例如给自定义节点 `data` 内的 `ratio` 自定义属性添加动画效果：
```js | ob { inject: true, pin: false }
import { Dom, Graph, Shape } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    // 自定义的 HTML 节点接收一个面积数据来控制 div 大小，可以对该自定义属性添加动画效果
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
    // 对自定义节点的宽高比添加动画效果
    [{ 'data/ratio': 3 / 5 }, { duration: 1000, iterations: Infinity }],
  ],
})
```

### 配置式动画
除了通过 API 的形式来调用添加动画，`animate` API 还支持通过节点的 `animation` 配置的方式来添加动画，可以省去一个额外的步骤，在很多场景下会很实用，下面的例子将实现一个和上面的例子一样的动画：

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
  // 将动画相关配置直接写到节点的配置中，当节点被添加到画布中时，动画会自动开始
  animation: [
    [
      { 'position/x': 300 },
      { duration: 1000, direction: 'alternate', iterations: Infinity },
    ],
  ],
})
```
`animation` 配置是一个数组：
- 数组中的每一项都是一个动画参数数组（对应 `animate` 的参数）
- 节点被添加到画布中后，动画将会自动根据动画配置来开始自动播放


### 注册动画Shape
一个常见的场景是对很多节点添加相同的动画，不管是重复调用 `animate` API 还是通过配置的方式来添加动画，都需要对每一个节点进行重复的操作，而在 X6 中本身就支持通过注册 `Shape` 的方式来复用节点，同样动画也支持被注册进 `Shape` 中，来使一批节点都支持动画：
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
    // 注册 Shape 时先添加好动画效果
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

## 动画控制
X6 中的 `animate` API 基于 Web Animations API 设计，所以同样支持灵活的动画控制能力，例如暂停、恢复、取消等。下面是一个简单的动画控制例子：
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
  label: '点击我将暂停动画',
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
除了暂停动画的能力外，`animate` API 总共支持以下能力：
- `pause()` 暂停动画
- `play()` 播放/恢复动画
- `cancel()` 取消动画
- `finish()` 结束动画
- `reverse()` 反向播放动画
- `updatePlaybackRate()` 更新动画播放速度
  
## 动画事件
X6 中的动画事件支持两种风格，一种是基于 Web Animations API 的设计，例如通过设置 `onfinish` 等事件来监听动画的事件：
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
  label: '点击我将开始动画',
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

// 通过 onfinish 监听动画事件
  animation.onfinish = () => {
    console.log('动画结束')
  }
})

```
基于 Web Animations API 的设计总共支持如下事件：
- `onfinish` 动画结束
- `oncancel` 动画取消

另外一种是基于 X6 自身的设计，通过 `on` API 来监听动画事件：
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
  label: '点击我将开始动画',
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

// 通过 on 监听动画事件
graph.on('node:animation:finish', () => {
  console.log('动画结束')
})

```
基于 X6 自身的设计总共支持如下事件：
- `cell:animation:finish` 动画结束
- `cell:animation:cancel` 动画取消
  
X6 事件系统详细可见[事件](/tutorial/basic/events)。
