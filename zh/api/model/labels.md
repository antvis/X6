---
title: "标签"
description: "标签"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/model/labels/"
version: "3.x"
---

[资料索引](/llms.txt)

X6 中边的标签配置非常灵活，所以这里用单独的篇幅来详细介绍如何使用边的标签。

开始之前，我们先简单了解一下 Edge 实例上操作标签的几个方法。

| 方法签名                                                         | 说明                |
|------------------------------------------------------------------|-------------------|
| [edge.getLabels()](/zh/api/model/edge#getlabels)            | 获取所有标签。       |
| [edge.setLabels(...)](/zh/api/model/edge#setlabels)         | 设置标签。           |
| [edge.insertLabel(...)](/zh/api/model/edge#insertlabel)     | 在指定位置插入标签。 |
| [edge.appendLabel(...)](/zh/api/model/edge#appendlabel)     | 在末尾追加标签。     |
| [edge.setLabelAt(...)](/zh/api/model/edge#setlabelat)       | 设置指定位置的标签。 |
| [edge.getLabelAt(...)](/zh/api/model/edge#getlabelat)       | 获取指定位置的标签。 |
| [edge.removeLabelAt(...)](/zh/api/model/edge#removelabelat) | 删除指定位置的标签。 |

## 标签定义

标签包含标签 Markup、标签位置、标签样式等，完整的定义如下。

```ts
interface Label {
  markup?: Markup
  attrs?: Attr.CellAttrs
  position?:
    | number
    | {
        distance: number
        offset?:
          | number
          | {
              x?: number
              y?: number
            }
        angle?: number
        options?: {
          absoluteDistance?: boolean
          reverseDistance?: boolean
          absoluteOffset?: boolean
          keepGradient?: boolean
          ensureLegibility?: boolean
        }
      }
}
```

- `markup` 标签 Markup。
- `attrs` 标签样式。
- `position` 标签位置。当其值为 `number` 时，相当于设置 `position.distance` 的值。
  - `distance` [标签位置](#位置)。
  - `offset` [标签偏移](#偏移)。
  - `angle` [标签旋转](#旋转)。

## 默认标签

创建 Edge 时可以通过 [defaultLabel 选项](/zh/tutorial/basic/edge#defaultlabel) 来设置默认标签，其默认值如下：

```ts
{
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    text: {
      fill: '#000',
      fontSize: 14,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      pointerEvents: 'none',
    },
    rect: {
      ref: 'label',
      fill: '#fff',
      rx: 3,
      ry: 3,
      refWidth: 1,
      refHeight: 1,
      refX: 0,
      refY: 0,
    },
  },
  position: {
    distance: 0.5,
  },
}
```

该默认标签包含一个 `<text>` 元素（表示标签文本）和一个 `<rect>` 元素（表示标签背景），默认居中对齐，并拥有白色圆角背景。由于所有自定义标签都将与该默认标签进行 [merge](https://lodash.com/docs/4.17.15#merge)，所以我们可以像下面这样简单提供一个标签的文本属性来添加一个标签。

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: 'Hello Label',
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
      source: { x: 125, y: 125 },
      target: { x: 320, y: 125 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'Hello Label',
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="append-label-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 标签位置

### 位置

我们可以通过 Label 的 `position.distance` 选项来指定标签的位置，默认值为 `0.5` 表示标签位于边长度的中心位置。根据取值不同，标签位置的计算方式分下面三种情况。

- 位于 `[0, 1]` 之间时，表示标签位于**从起点开始，沿长度方向，多少相对长度（比例）的位置**。
- 正数表示标签位于**从起点开始，沿边长度方向，偏离起点多少长度的位置**。
- 负数表示标签位于**从终点开始，沿长度方向，偏离终点多少长度的位置**。

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: '0.25',
    },
  },
  position: {
    distance: 0.25,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '150',
    },
  },
  position: {
    distance: 150,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '-100',
    },
  },
  position: {
    distance: -100,
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
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '0.25',
        },
      },
      position: {
        distance: 0.25,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '150',
        },
      },
      position: {
        distance: 150,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '-100',
        },
      },
      position: {
        distance: -100,
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 80,
          'target/x': 330,
          'target/y': 80,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 30,
          'source/y': 160,
          'vertices/0/x': 230,
          'vertices/0/y': 80,
          'target/x': 430,
          'target/y': 160,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-position">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### 偏移

我们可以通过 Label 的 `position.offset` 选项来设置标签的偏移量，默认值为 `0` 表示不偏移。根据取值不同，标签偏移量的计算方式分为下面三种情况。

- 正数表示标签**沿垂直于边向下的绝对偏移量**。
- 负数表示标签**沿垂直于边向上的绝对偏移量**。
- 坐标对象 `{x: number; y: number }` 表示标签**沿 `x` 和 `y` 两个方向的绝对偏移量**。

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: 'offset: 40',
    },
  },
  position: {
    distance: 0.66,
    offset: 40,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: 'offset: -40',
    },
  },
  position: {
    distance: 0.66,
    offset: -40,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: 'offset: { x: -40, y: 80 }',
    },
  },
  position: {
    distance: 0.66,
    offset: {
      x: -40,
      y: 80,
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
      markup: [
        {
          tagName: 'path',
          selector: 'line',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelPositiveConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelNegativeConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelAbsoluteConnector',
        },
        {
          tagName: 'text',
          selector: 'offsetLabelMarker',
        },
      ],
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
    })

    edge.attr({
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 1,
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '＊',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: 40',
        },
      },
      position: {
        distance: 0.66,
        offset: 40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: -40',
        },
      },
      position: {
        distance: 0.66,
        offset: -40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: { x: -40, y: 80 }',
        },
      },
      position: {
        distance: 0.66,
        offset: {
          x: -40,
          y: 80,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 80,
          'target/x': 330,
          'target/y': 80,
          'labels/0/position/offset': 80,
          'labels/1/position/offset': -80,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 30,
          'source/y': 160,
          'vertices/0/x': 230,
          'vertices/0/y': 80,
          'target/x': 430,
          'target/y': 160,
          'labels/0/position/offset': 80,
          'labels/1/position/offset': -80,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-offset-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



### 旋转

我们可以通过 Label 的 `position.angle` 选项来设置标签沿**顺时针方向**的旋转角度，默认值为 `0` 表示不旋转。

**选项**

- 当 `position.options.keepGradient` 为 `true` 时，标签的初始旋转角度是标签所在位置的边的角度，后续设置的 `position.angle` 角度是相对于该初始角度的。
- 当 `position.options.ensureLegibility` 为 `true` 时，在必要时将为标签增加 180° 旋转量，以保证标签文本更易读。

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: '70°\nkeepGradient',
    },
  },
  position: {
    distance: 0.05,
    angle: 70,
    options: {
      keepGradient: true,
    },
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '0°\nkeepGradient',
    },
  },
  position: {
    distance: 0.3,
    options: {
      keepGradient: true,
    },
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '45°',
    },
  },
  position: {
    distance: 0.8,
    angle: 45,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '135°',
    },
  },
  position: {
    distance: 0.9,
    angle: 135,
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '270°\nkeepGradient',
    },
  },
  position: {
    distance: 0.66,
    offset: 80,
    angle: 270,
    options: {
      keepGradient: true,
    },
  },
})

edge.appendLabel({
  attrs: {
    text: {
      text: '270°\nkeepGradient\nensureLegibility',
    },
  },
  position: {
    distance: 0.66,
    offset: -80,
    angle: 270,
    options: {
      keepGradient: true,
      ensureLegibility: true,
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
      markup: [
        {
          tagName: 'path',
          selector: 'line',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelPositiveConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelNegativeConnector',
        },
        {
          tagName: 'path',
          selector: 'offsetLabelAbsoluteConnector',
        },
        {
          tagName: 'text',
          selector: 'offsetLabelMarker',
        },
      ],
      source: { x: 30, y: 120 },
      target: { x: 430, y: 120 },
      vertices: [{ x: 230, y: 200 }],
    })

    edge.attr({
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 1,
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '＊',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '70°\nkeepGradient',
        },
      },
      position: {
        distance: 0.05,
        angle: 70,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '0°\nkeepGradient',
        },
      },
      position: {
        distance: 0.3,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '45°',
        },
      },
      position: {
        distance: 0.8,
        angle: 45,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '135°',
        },
      },
      position: {
        distance: 0.9,
        angle: 135,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270°\nkeepGradient',
        },
      },
      position: {
        distance: 0.66,
        offset: 80,
        angle: 270,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270°\nkeepGradient\nensureLegibility',
        },
      },
      position: {
        distance: 0.66,
        offset: -80,
        angle: 270,
        options: {
          keepGradient: true,
          ensureLegibility: true,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 130,
          'source/y': 120,
          'target/x': 330,
          'target/y': 120,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.animate(
        {
          'source/x': 30,
          'source/y': 200,
          'vertices/0/x': 230,
          'vertices/0/y': 120,
          'target/x': 430,
          'target/y': 200,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      oscillateToggle = false
    }

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })

    contract()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-rotate-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 标签样式

我们可以通过 `markup` 和 `attrs` 两个选项来定制标签样式，并支持两个维度的定制。

**方式一**：创建 Edge 时全局覆盖默认标签的定义，影响所有标签。

```ts
const edge = graph.addEdge({
  source: { x: 100, y: 40 },
  target: { x: 400, y: 40 },
  defaultLabel: {
    markup: [
      {
        tagName: 'ellipse',
        selector: 'bg',
      },
      {
        tagName: 'text',
        selector: 'txt',
      },
    ],
    attrs: {
      txt: {
        fill: '#7c68fc',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
      bg: {
        ref: 'txt',
        refRx: '70%',
        refRy: '80%',
        stroke: '#7c68fc',
        fill: 'white',
        strokeWidth: 2,
      },
    },
  },
})

edge.appendLabel({
  attrs: {
    txt: {
      text: 'First',
    },
  },
  position: {
    distance: 0.3,
  },
})

edge.appendLabel({
  attrs: {
    txt: {
      text: 'Second',
    },
  },
  position: {
    distance: 0.7,
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
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
      defaultLabel: {
        markup: [
          {
            tagName: 'ellipse',
            selector: 'bg',
          },
          {
            tagName: 'text',
            selector: 'txt',
          },
        ],
        attrs: {
          txt: {
            fill: '#7c68fc',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
          },
          bg: {
            ref: 'txt',
            refRx: '70%',
            refRy: '80%',
            stroke: '#7c68fc',
            fill: 'white',
            strokeWidth: 2,
          },
        },
      },
    })

    edge.appendLabel({
      attrs: {
        txt: {
          text: 'First',
        },
      },
      position: {
        distance: 0.3,
      },
    })

    edge.appendLabel({
      attrs: {
        txt: {
          text: 'Second',
        },
      },
      position: {
        distance: 0.7,
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-markup-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



**方式二**：创建单个标签时覆盖默认标签的定义，影响单个标签。

```ts
edge.appendLabel({
  markup: [
    {
      tagName: 'circle',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
    {
      tagName: 'circle',
      selector: 'asteriskBody',
    },
    {
      tagName: 'text',
      selector: 'asterisk',
    },
  ],
  attrs: {
    label: {
      text: '½',
      fill: '#000',
      fontSize: 12,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      pointerEvents: 'none',
    },
    body: {
      ref: 'label',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refR: 1,
      refCx: 0,
      refCy: 0,
    },
    asterisk: {
      ref: 'label',
      text: '＊',
      fill: '#ff0000',
      fontSize: 8,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      pointerEvents: 'none',
      refX: 16.5,
      refY: -2,
    },
    asteriskBody: {
      ref: 'asterisk',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refR: 1,
      refCx: '50%',
      refCy: '50%',
      refX: 0,
      refY: 0,
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
      source: { x: 40, y: 40 },
      target: { x: 320, y: 40 },
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    edge.appendLabel({
      markup: [
        {
          tagName: 'circle',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
        {
          tagName: 'circle',
          selector: 'asteriskBody',
        },
        {
          tagName: 'text',
          selector: 'asterisk',
        },
      ],
      attrs: {
        label: {
          text: '½',
          fill: '#000',
          fontSize: 12,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
        },
        body: {
          ref: 'label',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
          refR: 1,
          refCx: 0,
          refCy: 0,
        },
        asterisk: {
          ref: 'label',
          text: '＊',
          fill: '#ff0000',
          fontSize: 8,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
          refX: 16.5,
          refY: -2,
        },
        asteriskBody: {
          ref: 'asterisk',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 1,
          refR: 1,
          refCx: '50%',
          refCy: '50%',
          refX: 0,
          refY: 0,
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="label-attrs-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 字符串标签

当通过 [`updateLabels`](#默认标签) 选项设置[默认标签](#默认标签)后，标签的添加就显得非常简单，看下面代码。

```ts
// 创建节点时指定标签
const edge = graph.addEdge({
  source,
  target,
  labels: [
    {
      attrs: { label: { text: 'edge label' } },
    },
  ],
})

// 重设标签
edge.setLabels([
  {
    attrs: { label: { text: 'edge label' } },
  },
])

// 追加标签
edge.appendLabel({
  attrs: { label: { text: 'edge label' } },
})
```

上面代码其实仅仅设置了标签的文本，但代码看起来并不简单，我们不得不提供一个嵌套很深的对象 `{ attrs: { label: { text: 'edge' } } }`，为了解决这个问题，我们提供了一个语法糖，支持直接传入字符串标签，上面代码可以进一步简化为。

```ts
const edge = graph.addEdge({
  source,
  target,
  labels: ['edge label'],
})

edge.setLabels(['edge label'])

edge.appendLabel('edge label')
```

该语法糖在 `Edge` 上定义了一个静态方法 `parseStringLabel`，该方法将字符串标签转换成了 Label 对象。默认的实现如下。

```ts
function parseStringLabel(label: string): Label {
  return {
    attrs: { label: { text: label } },
  }
}
```

需要注意的是，这个语法糖仅适用于系统的默认标签，也就是说当你通过 `defaultLabel` 选项重新定义默认标签的 `markup` 后，还需要重写 `parseStringLabel` 方法来保证字符串标签的可用性。

```ts
Edge.config({
  defaultLabel: {
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'my-label', // 这里修改了默认的 selector。
      },
    ],
  },
})

// 需要同时重新定义 parseStringLabel，来保证字符串标签的可用性。
Edge.parseStringLabel = (label: string) => {
  return {
    attrs: { 'my-label': { text: label } },
  }
}
```

## 单标签

大多数边都只拥有最多一个标签，所以我们为 `Edge` 定义了一个[自定义选项](/zh/api/model/cell#自定义选项) `label` 来支持传入单标签。

```ts
graph.addEdge({
  source,
  target,
  label: {
    attrs: { label: { text: 'edge label' } },
  },
})
```

当只需要设置标签文本是，也可以使用单标签的字符串形式。

```ts
graph.addEdge({
  source,
  target,
  label: 'edge label',
})
```
### docs/demos/api/label/append-label/index.less

```less
.append-label-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 250px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/label/label-position/index.less

```less
.label-position {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/label/label-offset/index.less

```less
.label-offset-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/label/label-rotate/index.less

```less
.label-rotate-app {
  display: flex;
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
### docs/demos/api/label/label-markup/index.less

```less
.label-markup-app {
  display: flex;
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
### docs/demos/api/label/label-attrs/index.less

```less
.label-attrs-app {
  display: flex;
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
