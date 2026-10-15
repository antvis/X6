---
title: "箭头"
description: "箭头"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/model/marker/"
version: "3.x"
---

[资料索引](/llms.txt)

在之前的[教程](/zh/tutorial/basic/edge#使用箭头)中，我们简单介绍了如何使用 [`sourceMarker`](/zh/api/registry/attr#sourcemarker) 和 [`targetMarker`](/zh/api/registry/attr#targetmarker) 两个特殊属性来为边指定起始箭头和终止箭头，并演示了如何使用内置箭头和自定义箭头，接下来我们先列举了每个内置箭头的参数项，然后详细介绍如何使用各种 SVG 元素来自定义箭头，最后介绍如何将自定义箭头注册为内置箭头。

## 内置箭头

内置箭头是将一些常用的箭头参数化，使用内置箭头时只需要指定箭头名 `name` 和对应的参数即可，填充颜色 `fill` 和边框颜色 `stroke` 默认继承自边，可以通过指定 `fill` 和 `stroke` 属性来覆盖。

```ts
edge.attr({
  line: {
    sourceMarker: 'block',
    targetMarker: {
      name: 'ellipse',
      rx: 10, // 椭圆箭头的 x 半径
      ry: 6, // 椭圆箭头的 y 半径
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private edge: Edge

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.edge = this.graph.addEdge({
      source: [80, 160],
      target: [480, 160],
      attrs: {
        line: {
          sourceMarker: 'block',
          targetMarker: 'block',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
  }

  onMarkerChange = ({ type, ...args }: State) => {
    this.edge.attr({
      line: {
        sourceMarker: { args, name: type },
        targetMarker: { args, name: type },
      },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-native-app">
        <div className="app-side">
          <Settings onChange={this.onMarkerChange} />
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



每种内置箭头都有对应的参数，下面将分别介绍。

### block

实心箭头。

| 参数名   | 类型    | 默认值 | 说明                                                                                 |
|----------|---------|--------|------------------------------------------------------------------------------------|
| size     | Number  | 10     | 箭头大小。                                                                            |
| width    | Number  | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number  | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number  | 0      | 沿边方向的绝对偏移量。                                                                |
| open     | Boolean | false  | 非封闭箭头。                                                                          |
| ...attrs | Object  | &#123; &#125;    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### classic

经典箭头。

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | &#123; &#125;    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### diamond

菱形箭头。

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | &#123; &#125;    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### cross

交叉箭头。

| 参数名   | 类型   | 默认值 | 说明                                                                                 |
|----------|--------|--------|------------------------------------------------------------------------------------|
| size     | Number | 10     | 箭头大小。                                                                            |
| width    | Number | size   | 箭头宽度，当宽高一样时可以直接使用 `size` 替代。                                       |
| height   | Number | size   | 箭头高度，当宽高一样时可以直接使用 `size` 替代。                                       |
| offset   | Number | 0      | 沿边方向的绝对偏移量。                                                                |
| ...attrs | Object | &#123; &#125;    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### async

| 参数名   | 类型    | 默认值 | 说明                                                                                 |
|----------|---------|--------|------------------------------------------------------------------------------------|
| width    | Number  | 10     | 箭头宽度。                                                                            |
| height   | Number  | 6      | 箭头高度。                                                                            |
| offset   | Number  | 0      | 沿边方向的绝对偏移量。                                                                |
| open     | Boolean | false  | 非封闭箭头。                                                                          |
| flip     | Boolean | false  | 是否翻转箭头。                                                                        |
| ...attrs | Object  | &#123; &#125;    | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### path

自定义 [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) 的箭头。

| 参数名   | 类型   | 默认值    | 说明                                                                                                                                               |
|----------|--------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| d        | string | undefined | `<path>` 元素的 [d 属性值](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)，被 `Util.normalizeMarker` 标准化后应用到 `<path>` 元素上。 |
| offsetX  | Number | 0         | x 方向偏移量。                                                                                                                                      |
| offsetY  | Number | 0         | y 方向偏移量。                                                                                                                                      |
| ...attrs | Object | &#123; &#125;       | 其他参数都将作为箭头 `<path>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。                                                               |

```ts
graph.addEdge({
  source: { x: 100, y: 40 },
  target: { x: 400, y: 40 },
  attrs: {
    line: {
      stroke: '#31d0c6',
      sourceMarker: {
        name: 'path',
        d: 'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
      },
      targetMarker: {
        name: 'path',
        offsetX: 10,
        d: 'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z',
      },
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: {
            name: 'path',
            d: 'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
          },
          targetMarker: {
            name: 'path',
            offsetX: 10,
            d: 'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z',
          },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-path-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### circle

圆形箭头。

| 参数名   | 类型   | 默认值 | 说明                                                                                   |
|----------|--------|--------|--------------------------------------------------------------------------------------|
| r        | Number | 5      | 圆半径。                                                                                |
| ...attrs | Object | &#123; &#125;    | 其他参数都将作为箭头 `<circle>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### circlePlus

圆形和加号箭头。

| 参数名   | 类型   | 默认值 | 说明                                                                                       |
|----------|--------|--------|------------------------------------------------------------------------------------------|
| r        | Number | 5      | 圆半径。                                                                                    |
| ...attrs | Object | &#123; &#125;    | 其他参数都将作为箭头 `<path>` 元素（加号）的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |

### ellipse

椭圆箭头。

| 参数名   | 类型   | 默认值 | 说明                                                                                    |
|----------|--------|--------|---------------------------------------------------------------------------------------|
| rx       | Number | 5      | 椭圆 x 轴半径。                                                                          |
| ry       | Number | 5      | 椭圆 y 轴半径。                                                                          |
| ...attrs | Object | &#123; &#125;    | 其他参数都将作为箭头 `<ellipse>` 元素的属性，例如可以指定 `‘fill’` 和 `'stroke'` 等属性。 |


## 自定义箭头

我们可以通过 `tagName` 来指定使用哪种 SVG 元素来渲染箭头，例如下面我们通过 `tagName` 来指定使用 `<path>` 元素来渲染箭头，除 `tagName` 外的其他选项都将作为属性被添加到创建出来的 `<path>` 元素上。箭头的填充颜色 `fill` 和边框颜色 `stroke` 默认继承自边，可以通过指定 `fill` 和 `stroke` 属性来覆盖。

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: 'path',
      d: 'M 20 -10 0 0 20 10 Z',
    },
    targetMarker: {
      tagName: 'path',
      fill: 'yellow', // 使用自定义填充色
      stroke: 'green', // 使用自定义边框色
      strokeWidth: 2,
      d: 'M 20 -10 0 0 20 10 Z',
    },
  },
})
```

看上面代码，值得注意的是，我们的起始箭头和终止箭头使用了相同的 `'d'` 属性值，这是因为我们会自动计算箭头方向，简单来说，我们只需要定义**向左指向坐标原点**的箭头即可。



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: {
            tagName: 'path',
            d: 'M 20 -10 0 0 20 10 Z',
          },
          targetMarker: {
            tagName: 'path',
            stroke: '#873bf4',
            strokeWidth: 2,
            fill: 'yellow',
            d: 'M 20 -10 0 0 20 10 Z',
          },
        },
      },
    })

    function hourHand() {
      const originX = 300
      const originY = 150
      const radius = 140 / 1.618
      const steps = 60
      const offset = (10 + 9.36 / 60) / 12
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          delay: 1000,
          duration: 19000,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    function minuteHand() {
      const originX = 300
      const originY = 150
      const radius = 140
      const steps = 60
      const offset = 9.36 / 60
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'target/x': xs,
          'target/y': ys,
        },
        {
          delay: 1000,
          duration: 19000 / 12,
          iterations: 12,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    let currentAnimations = 0

    function run() {
      currentAnimations = 2
      hourHand()
      minuteHand()
    }

    run()

    edge.on('animation:finish', () => {
      currentAnimations -= 1
      if (currentAnimations === 0) {
        run()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-custom-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



有时候，我们获取到的 path 元素的 `d` 的坐标可能并不标准，如果直接将其作为箭头来使用就可能出现位置偏离，所以我们在 `Util` 命名空间中提供了 `normalizeMarker` 这个工具方法来标准化 `d` 的坐标。

**方法签名**

```ts
Registry.Marker.normalize(d: string, offset: { x?: number; y?: number }): string
Registry.Marker.normalize(d: string, offsetX?: number, offsetY?: number): string
```

| 参数名  | 类型                       | 说明                        |
|---------|----------------------------|-----------------------------|
| d       | string                     |                             |
| offset  | &#123; x?: number; y?: number &#125; | 相对于坐标原点的偏移量      |
| offsetX | number                     | 相对于坐标原点的 x 轴偏移量 |
| offsetY | number                     | 相对于坐标原点的 y 轴偏移量 |

对比下面的起始和终止箭头，很明显起始箭头出现了一定的偏移，使用 `normalizeMarker` 处理后终止箭头的位置就正常了。

```ts
const d =
  'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z'

graph.addEdge({
  source: { x: 160, y: 40 },
  target: { x: 420, y: 40 },
  attrs: {
    line: {
      stroke: '#31d0c6',
      sourceMarker: {
        d,
        tagName: 'path',
      },
      targetMarker: {
        tagName: 'path',
        d: Util.normalizeMarker(d),
      },
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Util } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const d =
      'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z'
    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: {
            d,
            tagName: 'path',
          },
          targetMarker: {
            tagName: 'path',
            d: Util.normalizeMarker(d),
          },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-normalize-path-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



除了 `<path>` 我们还可以使用 `<circle>`、`<image>`、`<ellipse>`、`<rect>`、`<polyline>`、`<polygon>` 等元素来定义箭头，只需要通过 `tagName` 指定标签名，并设置元素其他必要属性。例如，使用图片来定制箭头也很简单，首先我们把 `tagName` 设置为 `image`，并通过 `xlink:href` 属性指定图片的 URL，并通过 `width` 和 `height` 属性指定图片的大小，然后调节 `y` 属性来使图片居中对齐。

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: 'image',
      'xlink:href':
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      width: 24,
      height: 24,
      y: -12,
    },
    targetMarker: {
      tagName: 'image',
      'xlink:href':
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      width: 24,
      height: 24,
      y: -12,
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const marker = {
      tagName: 'image',
      // https://www.iconfinder.com/icons/15539/arrow_left_previos_icon
      'xlink:href':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFMklEQVRYR+2WaWxUVRiGnzt3lntnptPOdGba6ZRS7ALUsFY2g7SyhKWA0ALKHrBgWBRqQioQKJZdVpHdH5jKokGBgopoBCpbIkvYJIoIspUudGEYmHY6c8eMLCHIojVATLjJ+XfP9z75znve7wg84094xvo8B/jfd8AsQZMq2AP4a+On/9KBZqmyvPpnj+enUhhTG/HgnloB6GFU/8YJM40Gg/mjA0dHK7DiaQHEN0CYkzmke8ao+SOYmTk/MGvrj12A7540gDEE+neJi80ZO/0tZ7v+rwOVZMSkuTddvNIKOPWkAV4a1jBu/3sLummi6xmpqizh/O8VZI3e8UeB60ZroPhJAOiA6juFW5vlrV99k9lDY5BAFDm2+wyjx205dNLnG2AymRJdLtevwJl7QGQguEyACqgCKgDPvbAPMqEzCkY6NdpOB2u8fYHLgKZnXJ19+Wc+bQFBLpk9679k8rsfX7e+3MZrMBrD9+Xnr/W4XMcjjVJilD08tq4zMiY03GTTaWVtQPELJUVlyuWzhZeOFhYVXERZDRy5/xY0jYIBHRvEDewz/NWoUJuRqZPW7T10pXRzS4u5w8ylmd3a9G8D1X7Qacib9AknTonkfr6OJYsXUT/iJimpzTHHRgABwAWuIryuMnzVHnw1ApWlHvZvP8GGlQWVWyuuDQG2CREwPNFoHNa1S6OWKV2StInJDkJC/Cg1XorOlXPxTCUxDevgiLdzo+IqNdfKELwlrFpwmMjkMYyYNY0ZM6bx5tAEHFFq3L8c4dql01Rdr0AjmZBCLaj1JrSGUDSSjE6vpiD/HJPHrT27z+NuFTyCVxJFMXvMoLZpaekRhJo8uCt9+Lw1CHjRaDQoiPj8IKol1JIOQ5jEqnlHCU3sxdD3c8jJzmJAiwtY9T4EKQSjIw5DZCxanRFkAyjgdRXjdZVjtEaD3kBWxyks3nui310PqGB8rzrWKeOyUy3J7euhlqz4FQMBRSEQ8COogj4S8N6oxO8+zcoPjqB/oTudR2WyYtFcsnpL2BwOVDrDrXjz3+piTc1NqsqKCfi9mOomIVscqIUq5o1dw8SNB7LuN2GjeEHMGdYzKSN9UALRCTEIchwIOqrdZfg9blQ6CcF3gSW5uxCdnWiakc6OTWvITtdhDNHj94sEVEGjiqAIBEQBtU6PWjbi93sRUOG7fp4lU75m5s6zfwO4Y8zBaZGm3IG9bHWTW8iExaWgtTVBo9WhUmtwnd7C0tk7uWpuT6u+vfn+szWBpOqTQp1oPXaHCZvDhMlqRh9mxRBuRyOF4PepUNChxsPpfRtZNPs31l9yjX3ULIirhzBncIq9z2v9HMQmp2KMCaauSNnxPJbN2Myuy9HlSZ1TLMcOHjp78PDhhWEQHymKjZ2y2CDSoolwOnRiRIQOq02L3WnBEWPD5ykl/4vz7D+s1Pzgrmz/uGGk0sDbfeuZc9/IkEzNU1rjbDsV9+UCFr+Ty/Sd5XMFWS4ON5uTCwsLB9++f1rACsSroGkYNI4U1UkOvTYxVBYssloreKq07C0vziuBkY8DuBNa7doapeVDu6pf7NivDbb6HViW/SFTtl+Z44WJt9PuJuB7SCTrATvQUA/NvODzQR5Q9E8BgnWj6wvi8mGdQnr0Tjfw7Q6FCZuvzPfChNrOgdq8B3QWmD0+1ZJlCtEwaVvxspsw9mkC/KUlw/jeDvvC3cVXNxQqysCnDhAUlGCkXaVqcUFRRj3i7B/L9m888KBiDqAM8D5W6SE//FeA2ure3fcc4HkH/gSNF7Qt0mUkowAAAABJRU5ErkJggg==',
      width: 32,
      height: 32,
      x: -16,
      y: -16,
    }

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: { ...marker },
          targetMarker: { ...marker },
        },
      },
    })

    function hourHand() {
      const originX = 300
      const originY = 150
      const radius = 140 / 1.618
      const steps = 60
      const offset = (10 + 9.36 / 60) / 12
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          delay: 1000,
          duration: 19000,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    function minuteHand() {
      const originX = 300
      const originY = 150
      const radius = 140
      const steps = 60
      const offset = 9.36 / 60
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'target/x': xs,
          'target/y': ys,
        },
        {
          delay: 1000,
          duration: 19000 / 12,
          iterations: 12,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    let currentAnimations = 0

    function run() {
      currentAnimations = 2
      hourHand()
      minuteHand()
    }

    run()

    edge.on('animation:finish', () => {
      currentAnimations -= 1
      if (currentAnimations === 0) {
        run()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-image-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



需要注意的是，当使用 `<circle>` 和 `<ellipse>` 来定制箭头时，可以通过设置其 `cx` 属性为对应的轴半径，以避免箭头溢出边的边界；其他元素可以通过 `y` 属性来调节箭头的垂直位置，以便使其垂直居中。

```ts
edge.attr({
  line: {
    sourceMarker: {
      tagName: 'ellipse',
      rx: 20,
      ry: 10,
      cx: 20,
      fill: 'rgba(255,0,0,0.3)',
    },
    targetMarker: {
      tagName: 'circle',
      r: 12,
      cx: 12,
      fill: 'rgba(0,255,0,0.3)',
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const edge = graph.addEdge({
      source: [228.84550125020417, 100.76702664502545],
      target: [416.2834258874138, 72.03741369165368],
      vertices: [{ x: 300, y: 150 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          sourceMarker: {
            tagName: 'ellipse',
            rx: 20,
            ry: 10,
            cx: 20,
            fill: 'rgba(255,0,0,0.3)',
          },
          targetMarker: {
            tagName: 'circle',
            r: 12,
            cx: 12,
            fill: 'rgba(0,255,0,0.3)',
          },
        },
      },
    })

    function hourHand() {
      const originX = 300
      const originY = 150
      const radius = 140 / 1.618
      const steps = 60
      const offset = (10 + 9.36 / 60) / 12
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'source/x': xs,
          'source/y': ys,
        },
        {
          delay: 1000,
          duration: 19000,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    function minuteHand() {
      const originX = 300
      const originY = 150
      const radius = 140
      const steps = 60
      const offset = 9.36 / 60
      const xs: number[] = []
      const ys: number[] = []
      for (let i = 0; i < steps; i += 1) {
        const theta = 2 * Math.PI * (i / steps + offset) - Math.PI / 2
        xs.push(originX + radius * Math.cos(theta))
        ys.push(originY + radius * Math.sin(theta))
      }

      edge.animate(
        {
          'target/x': xs,
          'target/y': ys,
        },
        {
          delay: 1000,
          duration: 19000 / 12,
          iterations: 12,
          easing: 'linear',
          fill: 'none',
        },
      )
    }

    let currentAnimations = 0

    function run() {
      currentAnimations = 2
      hourHand()
      minuteHand()
    }

    run()

    edge.on('animation:finish', () => {
      currentAnimations -= 1
      if (currentAnimations === 0) {
        run()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="marker-tagname-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 注册箭头

注册是指将生成箭头的方法注册到 X6 体系中，该方法我们称为箭头工厂方法，注册后就可以像使用内置箭头那样来使用箭头。

那么什么时候需要注册箭头呢？

- 经典箭头的统一抽象，并提取出关键参数，通过参数来影响箭头的渲染，实现多场景复用。如上面介绍的[内置箭头](#内置箭头)。
- 复杂箭头的统一定义，实现一次定义多处复用，如具有复杂属性和样式配置的箭头。
- 通过语义化的箭头名和参数名，增强代码的可读性。例如我们可以将 `<image>` 箭头的 `xlink:href` 属性使用 `'imageUrl'` 参数名代替，使其更具有语义性。
- 等等...

继续之前，我们先看看箭头工厂方法的定义。

```ts
type Factory<T extends KeyValue = KeyValue> = (args: T) => Result

type Result = Attr.SimpleAttrs & {
  tagName?: string
  children?: Result[]
}
```

箭头工厂方法只有一个参数 `args`，在配置箭头时传入。例如：

```ts
edge.attr({
  line: {
    sourceMarker: 'block',
    targetMarker: {
      name: 'ellipse',
      rx: 10,
      ry: 6,
    },
  },
})
```

上面的配置被解析后，分别得到起始和终止箭头的箭头名称和箭头参数。

| 箭头类型     | 箭头名称 name | 箭头参数 args     |
|--------------|---------------|-------------------|
| sourceMarker | block         | &#123; &#125;               |
| targetMarker | ellipse       | &#123; rx: 10, ry: 6 &#125; |

在 X6 内部我们通过箭头名称找到对应的工厂方法，并根据提供参数 `args` 调用该方法，然后返回调用结果。结果 `Result` 的结构与上面介绍的自定义箭头的结构一样，通过 `tagName` 来指定使用哪种 SVG 元素渲染箭头，剩余的键值对则作为该元素的属性附加到元素上，并支持通过 `children` 来实现元素嵌套。

了解清楚工厂方法的原理后，我们就可以通过 Graph 提供的静态方法 `registerMarker` 来注册工厂方法。

```
Graph.registerMarker(name: string, factory: Factory, overwrite?: boolean)
```

| 参数名    | 参数类型 | 默认值 | 说明                                                        |
|-----------|----------|--------|-----------------------------------------------------------|
| name      | String   |        | 箭头名。                                                     |
| factory   | Factory  |        | 箭头工厂方法。                                               |
| overwrite | Boolean  | false  | 遇到重名时是否覆盖旧工厂方法，设置为 `true` 时覆盖，否则报错。 |

最后，我们来注册一个 image 箭头。

```ts
/**
 * 参数定义
 */
interface ImageMarkerArgs extends Attr.SimpleAttrs {
  imageUrl: string
  imageWidth?: number
  imageHeight?: number
}

Graph.registerMarker('image', (args: ImageMarkerArgs) => {
  const { imageUrl, imageWidth, imageHeight, ...attrs } = args
  return {
    ...attrs, // 原样返回非特殊涵义的参数
    tagName: 'image', // 使用 <image> 标签渲染箭头，其余键值对都将作为该元素的属性。
    width: imageWidth,
    height: imageHeight,
    'xlink:href': imageUrl,
  }
})
```

注册之后，我们可以这样来使用 image 箭头。

```ts
edge.attr({
  line: {
    sourceMarker: {
      name: 'image',
      imageUrl:
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    },
    targetMarker: {
      name: 'image',
      imageUrl:
        'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
      imageWidth: 24,
      imageHeight: 24,
      y: -12,
    },
  },
})
```
### docs/demos/api/marker/native/index.less

```less
.marker-native-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
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
### docs/demos/api/marker/native/settings.tsx

```tsx
import React from 'react'
import { Input, Switch, Checkbox, Select, Slider, Card, Row, Col } from 'antd'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  type: string
  r?: number
  rx?: number
  ry?: number
  width?: number
  height?: number
  offset?: number
  custom?: boolean
  fill?: string
  stroke?: string
  open?: boolean
  flip?: boolean
  strokeWidth?: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'block',
    r: 5,
    rx: 5,
    ry: 5,
    width: 10,
    height: 10,
    offset: 0,
    custom: false,
    strokeWidth: 1,
  }

  notifyChange() {
    const {
      custom,
      type,
      r,
      rx,
      ry,
      width,
      height,
      offset,
      open,
      flip,
      ...others
    } = this.state

    if (others.stroke == null) {
      delete others.strokeWidth
    }

    let state: State

    if (type === 'block') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        ...others,
      }
    } else if (type === 'classic' || type === 'diamond' || type === 'cross') {
      state = {
        type,
        width,
        height,
        offset,
        ...others,
      }
    } else if (type === 'async') {
      state = {
        type,
        width,
        height,
        offset,
        open,
        flip,
        ...others,
      }
    } else if (type === 'circle' || type === 'circlePlus') {
      state = {
        type,
        r,
        ...others,
      }
    } else if (type === 'ellipse') {
      state = {
        type,
        rx,
        ry,
        ...others,
      }
    }

    this.props.onChange(state!)
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onRChanged = (r: number) => {
    this.setState({ r }, () => {
      this.notifyChange()
    })
  }

  onRxChanged = (rx: number) => {
    this.setState({ rx }, () => {
      this.notifyChange()
    })
  }

  onRyChanged = (ry: number) => {
    this.setState({ ry }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onHeightChanged = (height: number) => {
    this.setState({ height }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onCustomChanged = (e: any) => {
    this.setState({ custom: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onFillChanged = (e: any) => {
    this.setState({ fill: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeChanged = (e: any) => {
    this.setState({ stroke: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onStrokeWidthChanged = (strokeWidth: number) => {
    this.setState({ strokeWidth }, () => {
      this.notifyChange()
    })
  }

  onOpenChanged = (open: boolean) => {
    this.setState({ open }, () => {
      this.notifyChange()
    })
  }

  onFlipChanged = (flip: boolean) => {
    this.setState({ flip }, () => {
      this.notifyChange()
    })
  }

  render() {
    const type = this.state.type

    return (
      <Card
        title="Marker Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Type</Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="block">Block</Select.Option>
              <Select.Option value="classic">Classic</Select.Option>
              <Select.Option value="diamond">Diamond</Select.Option>
              <Select.Option value="cross">Cross</Select.Option>
              <Select.Option value="async">Async</Select.Option>
              <Select.Option value="circle">Circle</Select.Option>
              <Select.Option value="circlePlus">Circle Plus</Select.Option>
              <Select.Option value="ellipse">Ellipse</Select.Option>
            </Select>
          </Col>
        </Row>
        {(type === 'circle' || type === 'circlePlus') && (
          <Row align="middle">
            <Col span={6}>Radius</Col>
            <Col span={14}>
              <Slider
                min={0}
                max={50}
                step={1}
                value={this.state.r}
                onChange={this.onRChanged}
              />
            </Col>
            <Col span={2} offset={1}>
              <div className="slider-value">{this.state.r}</div>
            </Col>
          </Row>
        )}
        {type === 'ellipse' && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Radius X</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.rx}
                  onChange={this.onRxChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.rx}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Radius Y</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.ry}
                  onChange={this.onRyChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.ry}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}

        {(type === 'block' ||
          type === 'classic' ||
          type === 'diamond' ||
          type === 'async' ||
          type === 'cross') && (
          <React.Fragment>
            <Row align="middle">
              <Col span={6}>Width</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.width}
                  onChange={this.onWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.width}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Height</Col>
              <Col span={14}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={this.state.height}
                  onChange={this.onHeightChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.height}</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>Offset</Col>
              <Col span={14}>
                <Slider
                  min={-50}
                  max={50}
                  step={1}
                  value={this.state.offset}
                  onChange={this.onOffsetChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.offset}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {(type === 'block' || type === 'async') && (
          <Row align="middle">
            <Col span={4}>Open</Col>
            <Col span={18}>
              <Switch checked={this.state.open} onChange={this.onOpenChanged} />
            </Col>
          </Row>
        )}

        {type === 'async' && (
          <Row align="middle">
            <Col span={4}>Flip</Col>
            <Col span={18}>
              <Switch checked={this.state.flip} onChange={this.onFlipChanged} />
            </Col>
          </Row>
        )}

        <Row
          align="middle"
          style={{ borderTop: '1px solid #e9e9e9', paddingTop: 12 }}
        >
          <Col>
            <div>
              <Checkbox
                checked={this.state.custom}
                onChange={this.onCustomChanged}
              >
                Custom fill and stroke color
              </Checkbox>
            </div>
          </Col>
        </Row>
        {this.state.custom && (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Fill Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.fill}
                  style={{ width: '100%' }}
                  onChange={this.onFillChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Color</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={this.state.stroke}
                  style={{ width: '100%' }}
                  onChange={this.onStrokeChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Stroke Width</Col>
              <Col span={12}>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={this.state.strokeWidth}
                  onChange={this.onStrokeWidthChanged}
                />
              </Col>
              <Col span={2} offset={1}>
                <div className="slider-value">{this.state.strokeWidth}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Card>
    )
  }
}
```
### docs/demos/api/marker/path/index.less

```less
.marker-path-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 80px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/custom/index.less

```less
.marker-custom-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/normalize-path/index.less

```less
.marker-normalize-path-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 100px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/image/index.less

```less
.marker-image-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/marker/tagname/index.less

```less
.marker-tagname-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 320px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
