---
title: "元素属性"
description: "元素属性"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/api/model/attrs/"
version: "3.x"
---

[资料索引](/llms.txt)

对于原生 SVG 属性，网上有很多教程可以参考，例如 MDN 提供的 [SVG 属性参考](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute)，这里我们将更多聚焦到如何定义和使用特殊属性。特殊属性提供了比[原生 SVG 属性](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute)更加灵活和强大的功能，在应用属性时，原生属性被直接传递给对应的元素，特殊属性则被进一步加工处理，转换为浏览器认识的原生属性后，再传递给对应的元素。

## 相对大小和相对位置

在定制节点或边时，设置元素的相对大小是一个非常常见需求，我们在 X6 中提供了一系列以 `ref` 为前缀特殊属性，可以通过这些属性来为元素设置相对大小，同时这些属性的计算都是基于节点/边的数据大小，也就是说所有计算都不依赖浏览器的 bbox 计算，所以不存在任何性能问题。

- [`refWidth`](/zh/api/registry/attr#refwidth) 和 [`refHeight`](/zh/api/registry/attr#refheight) 元素大小。
- [`refX`](/zh/api/registry/attr#refx) 和 [`refY`](/zh/api/registry/attr#refy) 元素位置。
- [`refCx`](/zh/api/registry/attr#refcx) 和 [`refCy`](/zh/api/registry/attr#refcy) 椭圆 `<ellipse>` 和圆 `<circle>` 中心位置。
- [`refRx`](/zh/api/registry/attr#refrx) 和 [`refRy`](/zh/api/registry/attr#refry) 椭圆 `<ellipse>` 半径。
- [`refR`](/zh/api/registry/attr#refr) 圆 `<circle>` 半径。

接下来我们一起来看看如何使用这些相对属性。下面案例中，我们定一个红色椭圆 `e`、一个绿色矩形 `r`、和蓝色圆形 `c` 和一个表示节点大小的矩形 `outline`。

```ts
graph.addNode({
  shape: 'custom-rect',
  x: 160,
  y: 100,
  width: 280,
  height: 120,
  attrs: {
    e: {
      refRx: '50%', // 椭圆 x 轴半径为宽度的一半
      refRy: '25%', // 椭圆 y 轴半径为高度的 1/4
      refCx: '50%', // 椭圆中心 x 坐标为宽度一半，即位于节点宽度的中心
      refCy: 0, // 椭圆中心 y 坐标为 0
      refX: '-50%', // 向左偏移宽度一半
      refY: '25%', // 向下偏移高度的 1/4
    },
    r: {
      refX: '100%', // 矩形 x 轴坐标位于节点右下角
      refY: '100%', // 矩形 y 轴坐标位于节点右下角
      refWidth: '50%', // 矩形宽度为节点宽的一半
      refHeight: '50%', // 矩形高度为节点高度的一半
      x: -10, // 向左偏移 10px
      y: -10, // 向上偏移 10px
    },
    c: {
      refRCircumscribed: '50%', // 圆半径为节点宽度/高度中较大的那个值的一半
      refCx: '50%', // 圆中心 x 坐标位于节点中心
      refCy: '50%', // 圆中心 y 坐标位于节点中心
    },
  },
})
```


```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-rect',
  {
    markup: [
      {
        tagName: 'ellipse',
        selector: 'e',
      },
      {
        tagName: 'rect',
        selector: 'r',
      },
      {
        tagName: 'circle',
        selector: 'c',
      },
      {
        tagName: 'rect',
        selector: 'outline',
      },
    ],
    attrs: {
      e: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(255,0,0,0.3)',
      },
      r: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(0,255,0,0.3)',
      },
      c: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(0,0,255,0.3)',
      },
      outline: {
        refX: 0,
        refY: 0,
        refWidth: '100%',
        refHeight: '100%',
        stroke: '#8f8f8f',
        strokeWidth: 1,
        strokeDasharray: '5 5',
        strokeDashoffset: 2.5,
        fill: 'none',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const node = graph.addNode({
      shape: 'custom-rect',
      x: 160,
      y: 100,
      width: 280,
      height: 120,
      attrs: {
        e: {
          refRx: '50%',
          refRy: '25%',
          refCx: '50%',
          refCy: 0,
          refX: '-50%',
          refY: '25%',
        },
        r: {
          refX: '100%',
          refY: '100%',
          refWidth: '50%',
          refHeight: '50%',
          x: -10, // additional x offset
          y: -10, // additional y offset
        },
        c: {
          refRCircumscribed: '50%',
          refCx: '50%',
          refCy: '50%',
        },
      },
    })

    let stretchToggle = false

    function contract() {
      node.animate(
        {
          'size/width': 40,
          'size/height': 40,
          'position/x': 280,
          'position/y': 130,
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

      stretchToggle = true
    }

    function stretch() {
      node.animate(
        {
          'size/width': 280,
          'size/height': 120,
          'position/x': 160,
          'position/y': 100,
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

      stretchToggle = false
    }

    stretch()

    node.on('animation:finish', () => {
      if (stretchToggle) {
        stretch()
      } else {
        contract()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-ref-node-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 相对子元素

上面这些属性默认相对于节点的大小进行计算，另外我们可以通过 `ref` 属性来提供一个子元素选择器，这时所有的计算都相对于 `ref` 指代的元素，从而实现相对于子元素的大小和位置。

> **注意**

需要注意的是，设置 `ref` 后，所有计算都依赖子元素在浏览器中的 bbox 测量，所以性能会比相对于节点的方式要慢。

```ts
graph.addNode({
  shape: 'custom-text',
  x: 320,
  y: 160,
  width: 280,
  height: 120,
  attrs: {
    label: {
      text: 'H',
    },
    e: {
      ref: 'label',
      refRx: '50%',
      refRy: '25%',
      refCx: '50%',
      refCy: 0,
      refX: '-50%',
      refY: '25%',
    },
    r: {
      ref: 'label',
      refX: '100%',
      refY: '100%',
      x: -10,
      y: -10,
      refWidth: '50%',
      refHeight: '50%',
    },
    c: {
      ref: 'label',
      refRCircumscribed: '50%',
    },
  },
})
```


```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerNode(
  'custom-text',
  {
    markup: [
      {
        tagName: 'ellipse',
        selector: 'e',
      },
      {
        tagName: 'rect',
        selector: 'r',
      },
      {
        tagName: 'circle',
        selector: 'c',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'rect',
        selector: 'outline',
      },
    ],
    attrs: {
      label: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontSize: 48,
      },
      e: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(255,0,0,0.3)',
      },
      r: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(0,255,0,0.3)',
      },
      c: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(0,0,255,0.3)',
      },
      outline: {
        ref: 'label',
        refX: 0,
        refY: 0,
        refWidth: '100%',
        refHeight: '100%',
        stroke: '#8f8f8f',
        strokeWidth: 1,
        strokeDasharray: '5 5',
        strokeDashoffset: 2.5,
        fill: 'none',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const node = graph.addNode({
      shape: 'custom-text',
      x: 320,
      y: 160,
      width: 280,
      height: 120,
      attrs: {
        label: {
          text: 'H',
        },
        e: {
          ref: 'label',
          refRx: '50%',
          refRy: '25%',
          refCx: '50%',
          refCy: 0,
          refX: '-50%',
          refY: '25%',
        },
        r: {
          ref: 'label',
          refX: '100%',
          refY: '100%',
          x: -10,
          y: -10,
          refWidth: '50%',
          refHeight: '50%',
        },
        c: {
          ref: 'label',
          refRCircumscribed: '50%',
        },
      },
    })

    let typeToggle = true

    function type() {
      const full = 'Hello, World!'
      const delay = 1000
      const duration = 4000
      const steps = full.length - 1
      setTimeout(() => {
        let i = 1
        const step = Math.max(1, Math.floor(duration / steps))
        const timer = setInterval(() => {
          node.attr('label/text', full.substring(0, i + 1))
          i += 1
          if (i >= full.length) {
            clearInterval(timer)
          }
        }, step)
      }, delay)

      node.animate(
        {
          'outline/strokeDashoffset': 2.5,
        },
        {
          delay,
          duration,
          easing: 'linear',
          fill: 'none',
        },
      )

      typeToggle = false
    }

    function untype() {
      const full = 'Hello, World!'
      const delay = 1000
      const duration = 4000
      const steps = full.length - 1
      setTimeout(() => {
        let i = full.length
        const step = Math.max(1, Math.floor(duration / steps))
        const timer = setInterval(() => {
          i -= 1
          node.attr('label/text', full.substring(0, Math.max(1, i)))
          if (i <= 1) {
            clearInterval(timer)
          }
        }, step)
      }, delay)

      node.animate(
        {
          'outline/strokeDashoffset': 2.5,
        },
        {
          delay,
          duration,
          easing: 'linear',
          fill: 'none',
        },
      )

      typeToggle = true
    }

    type()

    node.on('animation:finish', () => {
      if (typeToggle) {
        type()
      } else {
        untype()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-ref-elem-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 沿边长度的相对位置

我们提供了下面几个属性来设置边以及相对于边的位置。

- [`connection`](/zh/api/registry/attr#connection) 仅适用于边的 `<path>` 元素，当该属性为 `true` 时，表示将在该元素上渲染边。
- [`atConnectionLength`](/zh/api/registry/attr#atconnectionlengthkeepgradient) 是 [`atConnectionLengthKeepGradient`](/zh/api/registry/attr#atconnectionlengthkeepgradient) 属性的简称，表示将指定元素移动到指定的偏移量的位置处，并自动旋转元素，使其方向与所在位置边的斜率保持一致。
- [`atConnectionRatio`](/zh/api/registry/attr#atconnectionratiokeepgradient) 是 [`atConnectionRatioKeepGradient`](/zh/api/registry/attr#atconnectionratiokeepgradient) 属性的简称，表示将指定元素移动到指定比例 `[0, 1]` 位置处，并自动旋转元素，使其方向与所在位置边的斜率保持一致。
- [`atConnectionLengthIgnoreGradient`](/zh/api/registry/attr#atconnectionlengthignoregradient) 将指定元素移动到指定偏移量的位置处，忽略边的斜率，即不会跟随边自动旋转。
- [`atConnectionRatioIgnoreGradient`](/zh/api/registry/attr#atconnectionratioignoregradient)，将指定元素移动到指定比例 `[0, 1]` 位置处，忽略边的斜率，即不会跟随边自动旋转。

```ts
graph.addEdge({
  shape: 'custom-edge',
  source: { x: 100, y: 60 },
  target: { x: 500, y: 60 },
  vertices: [{ x: 300, y: 160 }],
  attrs: {
    symbol: {
      atConnectionRatio: 0.75, // 沿边长度方向，距离起点 75% 位置处
    },
    arrowhead: {
      atConnectionLength: 100, // 沿边长度方向，距离起点 100px 位置处
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerEdge(
  'custom-edge',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line',
      },
      {
        tagName: 'path',
        selector: 'arrowhead',
      },
      {
        tagName: 'path',
        selector: 'symbol',
      },
    ],
    attrs: {
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 1,
        sourceMarker: {
          tagName: 'circle',
          r: 4,
          fill: 'white',
          stroke: '#8f8f8f',
          strokeWidth: 2,
        },
        targetMarker: {
          tagName: 'circle',
          r: 4,
          fill: 'white',
          stroke: '#8f8f8f',
          strokeWidth: 2,
        },
      },
      arrowhead: {
        d: 'M -20 -10 0 0 -20 10 Z',
        fill: '#8f8f8f',
        stroke: 'none',
      },
      symbol: {
        d: 'M -20 -20 20 20',
        stroke: '#8f8f8f',
        targetMarker: {
          type: 'path',
          d: 'M 0 0 10 -5 10 5 Z',
          fill: '#8f8f8f',
          stroke: 'none',
        },
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const edge = graph.addEdge({
      shape: 'custom-edge',
      source: { x: 100, y: 60 },
      target: { x: 500, y: 60 },
      vertices: [{ x: 300, y: 160 }],
      attrs: {
        symbol: {
          atConnectionRatio: 0.75,
        },
        arrowhead: {
          atConnectionLength: 100,
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 200,
          'source/y': 100,
          'target/x': 400,
          'target/y': 100,
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
          'source/x': 100,
          'source/y': 200,
          'target/x': 500,
          'target/y': 200,
          'vertices/0/x': 300,
          'vertices/0/y': 60,
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

    contract()

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-edge-relative-position-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



```ts
graph.addEdge({
  shape: 'custom-edge',
  source: { x: 100, y: 60 },
  target: { x: 500, y: 60 },
  vertices: [{ x: 300, y: 160 }],
  attrs: {
    relativeLabel: {
      text: '0.25',
      atConnectionRatio: 0.25,
    },
    relativeLabelBody: {
      atConnectionRatio: 0.25,
    },

    absoluteLabel: {
      text: '150',
      atConnectionLength: 150,
    },
    absoluteLabelBody: {
      atConnectionLength: 150,
    },

    absoluteReverseLabel: {
      text: '-100',
      atConnectionLength: -100,
    },
    absoluteReverseLabelBody: {
      atConnectionLength: -100,
    },

    offsetLabelPositive: {
      y: 40,
      text: 'keepGradient: 0,40',
      atConnectionRatio: 0.66,
    },
    offsetLabelPositiveBody: {
      x: -60, // 0 + -60
      y: 30, // 40 + -10
      atConnectionRatio: 0.66,
    },

    offsetLabelNegative: {
      y: -40,
      text: 'keepGradient: 0,-40',
      atConnectionRatio: 0.66,
    },
    offsetLabelNegativeBody: {
      x: -60, // 0 + -60
      y: -50, // -40 + -10
      atConnectionRatio: 0.66,
    },

    offsetLabelAbsolute: {
      x: -40,
      y: 80,
      text: 'ignoreGradient: -40,80',
      atConnectionRatioIgnoreGradient: 0.66,
    },
    offsetLabelAbsoluteBody: {
      x: -110, // -40 + -70
      y: 70, // 80 + -10
      atConnectionRatioIgnoreGradient: 0.66,
    },
  },
})
```



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

Graph.registerEdge(
  'custom-edge',
  {
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
      {
        tagName: 'rect',
        selector: 'relativeLabelBody',
      },
      {
        tagName: 'text',
        selector: 'relativeLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteReverseLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteReverseLabel',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelPositiveBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelPositive',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelNegativeBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelNegative',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelAbsoluteBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelAbsolute',
      },
    ],
    attrs: {
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 2,
        strokeLinejoin: 'round',
        targetMarker: {
          tagName: 'path',
          d: 'M 10 -5 0 0 10 5 z',
        },
      },
      relativeLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      relativeLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteReverseLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteReverseLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelPositive: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelPositiveBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelNegative: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelNegativeBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelAbsolute: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelAbsoluteBody: {
        width: 140,
        height: 20,
        fill: 'white',
        stroke: 'black',
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
        d: 'M 0 0 0 40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const edge = graph.addEdge({
      shape: 'custom-edge',
      source: { x: 100, y: 60 },
      target: { x: 500, y: 60 },
      vertices: [{ x: 300, y: 160 }],
      attrs: {
        relativeLabel: {
          atConnectionRatio: 0.25,
          text: '0.25',
        },
        relativeLabelBody: {
          atConnectionRatio: 0.25,
        },
        absoluteLabel: {
          atConnectionLength: 150,
          text: '150',
        },
        absoluteLabelBody: {
          atConnectionLength: 150,
        },
        absoluteReverseLabel: {
          atConnectionLength: -100,
          text: '-100',
        },
        absoluteReverseLabelBody: {
          atConnectionLength: -100,
        },
        offsetLabelPositive: {
          atConnectionRatio: 0.66,
          y: 40,
          text: 'keepGradient: 0,40',
        },
        offsetLabelPositiveBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: 30, // 40 + -10
        },
        offsetLabelNegative: {
          atConnectionRatio: 0.66,
          y: -40,
          text: 'keepGradient: 0,-40',
        },
        offsetLabelNegativeBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: -50, // -40 + -10
        },
        offsetLabelAbsolute: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -40,
          y: 80,
          text: 'ignoreGradient: -40,80',
        },
        offsetLabelAbsoluteBody: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -110, // -40 + -70
          y: 70, // 80 + -10
        },
      },
    })

    let oscillateToggle = false

    function contract() {
      edge.animate(
        {
          'source/x': 200,
          'source/y': 100,
          'target/x': 400,
          'target/y': 100,
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
          'source/x': 100,
          'source/y': 200,
          'target/x': 500,
          'target/y': 200,
          'vertices/0/x': 300,
          'vertices/0/y': 60,
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

    contract()

    edge.on('animation:finish', () => {
      if (oscillateToggle) {
        oscillate()
      } else {
        contract()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-edge-subelement-labels-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## 使用箭头

我们可以使用 [`sourceMarker`](/zh/api/registry/attr#sourcemarker) 和 [`targetMarker`](/zh/api/registry/attr#targetmarker) 两个特殊属性来为边指定起始箭头和终止箭头，详情请参考[这篇教程](/zh/api/model/marker)。
### docs/demos/api/attrs/ref-node/index.less

```less
.attrs-ref-node-app {
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
### docs/demos/api/attrs/ref-elem/index.less

```less
.attrs-ref-elem-app {
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
### docs/demos/api/attrs/edge-relative-position/index.less

```less
.attrs-edge-relative-position-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 280px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
### docs/demos/api/attrs/edge-subelement-labels/index.less

```less
.attrs-edge-subelement-labels-app {
  display: flex;
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 280px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}
```
