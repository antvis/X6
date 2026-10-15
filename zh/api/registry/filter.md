---
title: "滤镜"
description: "滤镜"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/registry/filter/"
version: "3.x"
---

[资料索引](/llms.txt)

我们可以使用 [filter](/zh/api/registry/attr#filter) 这个特殊属性来为元素指定 [SVG 滤镜](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Filter_effects)，像下面这样，为该元素的 `filter` 属性指定一个预定义的对象，其中 `name` 和 `args` 分别指定了滤镜名称和滤镜参数。

```ts
// 创建节点是通过 attrs 选项指定滤镜
const rect = graph.addNode({
  x: 40,
  y: 40,
  width: 80,
  height: 30,
  attrs: {
    body: {
      filter: {
        name: 'dropShadow',
        args: {
          dx: 2,
          dy: 2,
          blur: 3,
        },
      },
    },
  },
})

// 创建节点后可以通过 `attr()` 方法修改或指定元素滤镜
rect.attr('body/filter', {
  name: 'dropShadow',
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
})
```

另外，我们也可以调用 `graph.defineFilter(...)` 方法来得到一个滤镜的 ID，然后将 `filter` 属性指定为这个滤镜的 ID。

```ts
const filterId = graph.defineFilter({
  name: 'dropShadow',
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
})

rect.attr('body/filter', `#${filterId}`)
```

通过上面的简单介绍，我们了解了如何使用滤镜，下面我们就分别来看看在 X6 中预定义了哪些滤镜。

## 内置滤镜

### dropShadow

阴影滤镜。参考 [CSS drop-shadow()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) 滤镜。

| 参数名  | 类型   | 默认值 | 说明                 |
|---------|--------|--------|--------------------|
| dx      | number | `0`    | 阴影在 X 轴的偏移量。 |
| dy      | number | `0`    | 阴影在 Y 轴的偏移量。 |
| blur    | number | `0`    | 阴影的模糊半径。      |
| opacity | number | `1`    | 阴影的透明度。        |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 80,
      width: 400,
      height: 160,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `dropShadow\n\ncolor: ${args.color}\ndx: ${args.dx}        \ndy: ${args.dy}        \nblur: ${args.blur}            \nopacity: ${args.opacity}               \n`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'dropShadow',
          args: { ...args },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-drop-shadow-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### blur

高斯模糊滤镜。参考 [CSS blur()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur) 滤镜。

| 参数名 | 类型   | 默认值 | 说明                                      |
|--------|--------|--------|-----------------------------------------|
| x      | number | `2`    | X 轴方向的模糊程度。                       |
| y      | number | -      | Y 轴方向的模糊程度，缺省时与 X 轴保持一致。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 80,
      y: 80,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `blur(${args.x}${args.y > 0 ? `,${args.y}` : ''})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'blur',
          args: { x: args.x, y: args.y },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-blur-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### grayScale

灰阶滤镜。参考 [CSS grayscale()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale) 滤镜。

| 参数名 | 类型   | 默认值 | 说明                                                   |
|--------|--------|--------|------------------------------------------------------|
| amount | number | `1`    | 灰阶程度。取值从 `[0-1]`，`0` 表示没有灰度，`1` 表示全灰。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `grayScale(${args.amount})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'grayScale',
          args: { amount: args.amount },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-gray-scale-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### sepia

褐色滤镜。参考 [CSS sepia()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia) 滤镜。

| 参数名 | 类型   | 默认值 | 说明                                                           |
|--------|--------|--------|--------------------------------------------------------------|
| amount | number | `1`    | 褐色程度。取值从 `[0-1]`，`0` 表示褐色程度为 `0`，`1` 表示全褐色。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `sepia(${args.amount})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'sepia',
          args: { amount: args.amount },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-sepia-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### saturate

饱和度滤镜。参考 [CSS saturate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate) 滤镜。

| 参数名 | 类型   | 默认值 | 说明                   |
|--------|--------|--------|----------------------|
| amount | number | `1`    | 饱和度。取值从 `[0-1]`。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `saturate(${args.amount})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'saturate',
          args: { amount: args.amount },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-saturate-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### hueRotate

色相旋转滤镜。参考 [CSS hue-rotate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate) 滤镜。

| 参数名 | 类型   | 默认值 | 说明          |
|--------|--------|--------|-------------|
| angle  | number | `0`    | 色相旋转角度。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `hueRotate(${args.angle})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'hueRotate',
          args: { angle: args.angle },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-hue-rotate-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### invert

反色滤镜。参考 [CSS invert()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert) 滤镜。

| 参数名 | 类型   | 默认值 | 说明                                                     |
|--------|--------|--------|--------------------------------------------------------|
| amount | number | `1`    | 反色度。取值从 `[0-1]`，`0` 表示没有反色，`1` 表示完全反色。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `invert(${args.amount})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'invert',
          args: { amount: args.amount },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-invert-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### brightness

明亮度滤镜。参考 [CSS brightness()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness) 滤镜。

| 参数名 | 类型   | 默认值 | 说明                                             |
|--------|--------|--------|------------------------------------------------|
| amount | number | `1`    | 明亮度。取值从 `[0-1]`，`0` 表示全暗，`1` 表示全亮。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `brightness(${args.amount})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'brightness',
          args: { amount: args.amount },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-brightness-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### contrast

对比度滤镜。参考 [CSS contrast()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast) 滤镜。

| 参数名 | 类型   | 默认值 | 说明                                             |
|--------|--------|--------|------------------------------------------------|
| amount | number | `1`    | 对比度。取值从 `[0-1]`，`0` 表示全暗，`1` 表示全亮。 |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `contrast(${args.amount})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'contrast',
          args: { amount: args.amount },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-contrast-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### highlight

高亮滤镜。

| 参数名  | 类型   | 默认值 | 说明            |
|---------|--------|--------|---------------|
| color   | string | `red`  | 高亮颜色。       |
| width   | number | `1`    | 高亮外框的宽度。 |
| blur    | number | `0`    | 模糊半径。       |
| opacity | number | `1`    | 透明度。         |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 55,
      width: 400,
      height: 160,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `highlight\n\ncolor: ${args.color}\ndx: ${args.width}        \ndy: ${args.blur}        \nopacity: ${args.opacity}               \n`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'highlight',
          args: { ...args },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-highlight-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### outline

边框滤镜。

| 参数名  | 类型   | 默认值 | 说明      |
|---------|--------|--------|---------|
| color   | string | `blue` | 边框颜色。 |
| width   | number | `1`    | 边框宽度。 |
| margin  | number | `2`    | 边距。     |
| opacity | number | `1`    | 透明度。   |



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 55,
      width: 400,
      height: 160,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `outline\n\ncolor: ${args.color}\nwidth: ${args.width}              \nmargin: ${args.margin}                 \nopacity: ${args.opacity}               \n`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'outline',
          args: { ...args },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-outline-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 自定义滤镜

滤镜定义是一个具有如下签名的函数，返回 `<filter>` 标签字符串。

```ts
export type Definition<T> = (args: T) => string
```

例如，高斯模糊滤镜的定义为：

```ts
export interface BlurArgs {
  x?: number
  y?: number
}

export function blur(args: BlurArgs = {}) {
  const x = getNumber(args.x, 2)
  const stdDeviation = args.y != null && isFinite(args.y) ? [x, args.y] : x

  return `
    <filter>
      <feGaussianBlur stdDeviation="${stdDeviation}"/>
    </filter>
  `.trim()
}
```


我们可以调用 `Graph.registerFilter(...)` 方法来注册滤镜。

```ts
Graph.registerFilter('blur', blur)
```
### docs/demos/api/filter/drop-shadow/index.less

```less
.filter-drop-shadow-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/drop-shadow/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  dx: number
  dy: number
  blur: number
  opacity: number
}

export const defaults: State = {
  color: '#4943a3',
  dx: 10,
  dy: 10,
  blur: 10,
  opacity: 0.5,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
      this.notifyChange()
    })
  }

  onBlurChanged = (blur: number) => {
    this.setState({ blur }, () => {
      this.notifyChange()
    })
  }

  onOpacityChanged = (opacity: number) => {
    this.setState({ opacity }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>dx</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dx.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>dy</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dy.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>blur</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.blur}
              onChange={this.onBlurChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.blur.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>opacity</Col>
          <Col span={14}>
            <Slider
              min={0.05}
              max={1}
              step={0.05}
              value={this.state.opacity}
              onChange={this.onOpacityChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.opacity.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/blur/index.less

```less
.filter-blur-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/blur/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  x: number
  y: number
}

export const defaults: State = {
  color: '#4943a3',
  x: 10,
  y: 10,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onXChanged = (dx: number) => {
    this.setState({ x: dx }, () => {
      this.notifyChange()
    })
  }

  onYChanged = (dy: number) => {
    this.setState({ y: dy }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>x</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.x}
              onChange={this.onXChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.x.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>y</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.y}
              onChange={this.onYChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.y.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/gray-scale/index.less

```less
.filter-gray-scale-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/gray-scale/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  amount: number
}

export const defaults: State = {
  color: '#4943a3',
  amount: 0.3,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAmountChanged = (dx: number) => {
    this.setState({ amount: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>amount</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.amount}
              onChange={this.onAmountChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.amount.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/sepia/index.less

```less
.filter-sepia-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/sepia/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  amount: number
}

export const defaults: State = {
  color: '#4943a3',
  amount: 0.3,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAmountChanged = (dx: number) => {
    this.setState({ amount: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>amount</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.amount}
              onChange={this.onAmountChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.amount.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/saturate/index.less

```less
.filter-saturate-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/saturate/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  amount: number
}

export const defaults: State = {
  color: '#4943a3',
  amount: 0.3,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAmountChanged = (dx: number) => {
    this.setState({ amount: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>amount</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.amount}
              onChange={this.onAmountChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.amount.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/hue-rotate/index.less

```less
.filter-hue-rotate-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/hue-rotate/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  angle: number
}

export const defaults: State = {
  color: '#4943a3',
  angle: 0,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAngleChanged = (dx: number) => {
    this.setState({ angle: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>angle</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={this.state.angle}
              onChange={this.onAngleChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.angle.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/invert/index.less

```less
.filter-invert-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/invert/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  amount: number
}

export const defaults: State = {
  color: '#4943a3',
  amount: 0.3,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAmountChanged = (dx: number) => {
    this.setState({ amount: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>amount</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.amount}
              onChange={this.onAmountChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.amount.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/brightness/index.less

```less
.filter-brightness-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/brightness/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  amount: number
}

export const defaults: State = {
  color: '#4943a3',
  amount: 0.3,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAmountChanged = (dx: number) => {
    this.setState({ amount: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>amount</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.amount}
              onChange={this.onAmountChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.amount.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/contrast/index.less

```less
.filter-contrast-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/contrast/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  amount: number
}

export const defaults: State = {
  color: '#4943a3',
  amount: 0.3,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onAmountChanged = (dx: number) => {
    this.setState({ amount: dx }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>fill</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>amount</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.amount}
              onChange={this.onAmountChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.amount.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/highlight/index.less

```less
.filter-highlight-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/highlight/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  width: number
  blur: number
  opacity: number
}

export const defaults: State = {
  color: '#4943a3',
  width: 10,
  blur: 1,
  opacity: 0.5,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onBlurChanged = (blur: number) => {
    this.setState({ blur }, () => {
      this.notifyChange()
    })
  }

  onOpacityChanged = (opacity: number) => {
    this.setState({ opacity }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>width</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.width}
              onChange={this.onWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.width.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>blur</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.blur}
              onChange={this.onBlurChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.blur.toFixed(2)}</div>
          </Col>
        </Row>

        <Row align="middle">
          <Col span={6}>opacity</Col>
          <Col span={14}>
            <Slider
              min={0.05}
              max={1}
              step={0.05}
              value={this.state.opacity}
              onChange={this.onOpacityChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.opacity.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
### docs/demos/api/filter/outline/index.less

```less
.filter-outline-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-left {
    bottom: 0;
    width: 336px;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .slider-value {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 7px;
    color: #333;
    font-size: 12px;
    line-height: 1.25;
    background: #eee;
    border-radius: 10px;
  }
}
```
### docs/demos/api/filter/outline/settings.tsx

```tsx
import React from 'react'
import { Input, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  width: number
  margin: number
  opacity: number
}

export const defaults: State = {
  color: '#4943a3',
  width: 2,
  margin: 2,
  opacity: 0.5,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onMarginChanged = (margin: number) => {
    this.setState({ margin }, () => {
      this.notifyChange()
    })
  }

  onOpacityChanged = (opacity: number) => {
    this.setState({ opacity }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>width</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.width}
              onChange={this.onWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.width.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>margin</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.margin}
              onChange={this.onMarginChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.margin.toFixed(2)}</div>
          </Col>
        </Row>

        <Row align="middle">
          <Col span={6}>opacity</Col>
          <Col span={14}>
            <Slider
              min={0.05}
              max={1}
              step={0.05}
              value={this.state.opacity}
              onChange={this.onOpacityChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.opacity.toFixed(2)}</div>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
