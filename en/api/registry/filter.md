---
title: "Filter"
description: "Filter"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/api/registry/filter/"
version: "3.x"
---

[Resource index](/llms.txt)

We can use the special attribute [filter](/en/api/registry/attr#filter) to specify [SVG filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Filter_effects) for elements. For example, we can define a predefined object for the `filter` attribute of the element, where `name` and `args` specify the filter name and filter parameters, respectively.

```ts
// Create a node by specifying the filter through the attrs option
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

// After creating the node, we can modify or specify the element's filter using the `attr()` method
rect.attr('body/filter', {
  name: 'dropShadow',
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
})
```

Additionally, we can call the `graph.defineFilter(...)` method to obtain a filter ID, and then set the `filter` attribute to this filter ID.

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

Through this brief introduction, we have learned how to use filters. Next, let's take a look at the predefined filters available in X6.
## Built-in Filters

### dropShadow

Shadow filter. Refer to [CSS drop-shadow()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) filter.

| Parameter Name | Type   | Default Value | Description                     |
|----------------|--------|---------------|---------------------------------|
| dx             | number | `0`           | Shadow offset on the X-axis.   |
| dy             | number | `0`           | Shadow offset on the Y-axis.   |
| blur           | number | `0`           | Shadow blur radius.            |
| opacity        | number | `1`           | Shadow opacity.                |



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

Gaussian blur filter. Refer to [CSS blur()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur) filter.

| Parameter Name | Type   | Default Value | Description                                   |
|----------------|--------|---------------|-----------------------------------------------|
| x              | number | `2`           | Blur amount in the X direction.              |
| y              | number | -             | Blur amount in the Y direction; defaults to X. |



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

Grayscale filter. Refer to [CSS grayscale()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale) filter.

| Parameter Name | Type   | Default Value | Description                                      |
|----------------|--------|---------------|--------------------------------------------------|
| amount         | number | `1`           | Grayscale amount. Ranges from `[0-1]`, where `0` means no grayscale and `1` means full grayscale. |



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

Sepia filter. Refer to [CSS sepia()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia) filter.

| Parameter Name | Type   | Default Value | Description                                         |
|----------------|--------|---------------|-----------------------------------------------------|
| amount         | number | `1`           | Sepia amount. Ranges from `[0-1]`, where `0` means no sepia and `1` means full sepia. |



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

Saturation filter. Refer to [CSS saturate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate) filter.

| Parameter Name | Type   | Default Value | Description                   |
|----------------|--------|---------------|-------------------------------|
| amount         | number | `1`           | Saturation. Ranges from `[0-1]`. |



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

Hue rotation filter. Refer to [CSS hue-rotate()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate) filter.

| Parameter Name | Type   | Default Value | Description            |
|----------------|--------|---------------|------------------------|
| angle          | number | `0`           | Hue rotation angle.    |



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

Invert filter. Refer to [CSS invert()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert) filter.

| Parameter Name | Type   | Default Value | Description                                         |
|----------------|--------|---------------|-----------------------------------------------------|
| amount         | number | `1`           | Inversion amount. Ranges from `[0-1]`, where `0` means no inversion and `1` means full inversion. |



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

Brightness filter. Refer to [CSS brightness()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness) filter.

| Parameter Name | Type   | Default Value | Description                                      |
|----------------|--------|---------------|--------------------------------------------------|
| amount         | number | `1`           | Brightness. Ranges from `[0-1]`, where `0` means completely dark and `1` means completely bright. |



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

Contrast filter. Refer to [CSS contrast()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast) filter.

| Parameter Name | Type   | Default Value | Description                                      |
|----------------|--------|---------------|--------------------------------------------------|
| amount         | number | `1`           | Contrast. Ranges from `[0-1]`, where `0` means completely dark and `1` means completely bright. |



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

Highlight filter.

| Parameter Name | Type   | Default Value | Description            |
|----------------|--------|---------------|------------------------|
| color          | string | `red`         | Highlight color.       |
| width          | number | `1`           | Width of the highlight border. |
| blur           | number | `0`           | Blur radius.          |
| opacity        | number | `1`           | Opacity.              |



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

Outline filter.

| Parameter Name | Type   | Default Value | Description      |
|----------------|--------|---------------|------------------|
| color          | string | `blue`        | Outline color.   |
| width          | number | `1`           | Outline width.   |
| margin         | number | `2`           | Margin.          |
| opacity        | number | `1`           | Opacity.         |



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



## Custom Filters

A filter definition is a function with the following signature that returns a `<filter>` tag string.

```ts
export type Definition<T> = (args: T) => string
```

For example, the definition of the Gaussian blur filter is:

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

We can register a filter by calling the `Graph.registerFilter(...)` method.

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
