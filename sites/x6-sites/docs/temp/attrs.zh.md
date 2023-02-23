---
title: 特殊属性
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

在之前教程中我们介绍了[如何通过 `attrs` 定制样式](/zh/docs/tutorial/basic/cell#attrs-1)，同时在[使用箭头教程](/zh/docs/tutorial/basic/edge#使用箭头-marker)中看到了 `sourceMarker` 和 `targetMarker` 两个特殊属性的强大作用，并了解到 `attrs` 在[节点样式](/zh/docs/tutorial/basic/node#定制样式-attrs)、[边样式](/zh/docs/tutorial/basic/edge#定制样式-attrs)、[标签样式](/zh/docs/tutorial/intermediate/edge-labels#标签样式)等多处被广泛使用，所以有必要对属性相关概念作更详细的介绍。

对于原生 SVG 属性，网上有很多教程可以参考，例如 MDN 提供的 [SVG 属性参考](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute)，这里我们将更多聚焦到如何定义和使用特殊属性。特殊属性提供了比[原生 SVG 属性](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute)更加灵活和强大的功能，在应用属性时，原生属性被直接传递给对应的元素，特殊属性则被进一步加工处理，转换为浏览器认识的原生属性后，再传递给对应的元素。

## 相对大小和相对位置

在定制节点或边时，设置元素的相对大小是一个非常常见需求，我们在 X6 中提供了一系列以 `ref` 为前缀特殊属性，可以通过这些属性来为元素设置相对大小，同时这些属性的计算都是基于节点/边的数据大小，也就是说所有计算都不依赖浏览器的 bbox 计算，所以不存在任何性能问题。

- [`refWidth`](/zh/docs/api/registry/attr#refwidth) 和 [`refHeight`](/zh/docs/api/registry/attr#refheight) 元素大小。
- [`refX`](/zh/docs/api/registry/attr#refx) 和 [`refY`](/zh/docs/api/registry/attr#refy) 元素位置。
- [`refCx`](/zh/docs/api/registry/attr#refcx) 和 [`refCy`](/zh/docs/api/registry/attr#refcy) 椭圆 `<ellipse>` 和圆 `<circle>` 中心位置。
- [`refRx`](/zh/docs/api/registry/attr#refrx) 和 [`refRy`](/zh/docs/api/registry/attr#refry) 椭圆 `<ellipse>` 半径。
- [`refR`](/zh/docs/api/registry/attr#refr) 圆 `<circle>` 半径。

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
      refCy: 0,     // 椭圆中心 y 坐标为 0
      refX: '-50%', // 向左偏移宽度一半
      refY: '25%',  // 向下偏移高度的 1/4
    },
    r: {
      refX: '100%',     // 矩形 x 轴坐标位于节点右下角
      refY: '100%',     // 矩形 y 轴坐标位于节点右下角
      refWidth: '50%',  // 矩形宽度为节点宽的一半
      refHeight: '50%', // 矩形高度为节点高度的一半
      x: -10,           // 向左偏移 10px
      y: -10,           // 向上偏移 10px
    },
    c: {
      refRCircumscribed: '50%', // 圆半径为节点宽度/高度中较大的那个值的一半
      refCx: '50%', // 圆中心 x 坐标位于节点中心
      refCy: '50%', // 圆中心 y 坐标位于节点中心
    },
  },
})
```

<iframe src="/demos/tutorial/intermediate/attrs/ref-node"></iframe>

## 相对子元素

上面这些属性默认相对于节点的大小进行计算，另外我们可以通过 `ref` 属性来提供一个子元素选择器，这时所有的计算都相对于 `ref` 指代的元素，从而实现相对于子元素的大小和位置。

:::warning{title=注意：}
| 需要注意的是，设置 `ref` 后，所有计算都依赖子元素在浏览器中的 bbox 测量，所以性能会比相对于节点的方式要慢。
:::

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

<iframe src="/demos/tutorial/intermediate/attrs/ref-elem"></iframe>

## 沿边长度的相对位置

我们提供了下面几个属性来设置边以及相对于边的位置。

- [`connection`](/zh/docs/api/registry/attr#connection) 仅适用于边的 `<path>` 元素，当该属性为 `true` 时，表示将在该元素上渲染边。
- [`atConnectionLength`](/zh/docs/api/registry/attr#atconnectionlengthkeepgradient) 是 [`atConnectionLengthKeepGradient`](/zh/docs/api/registry/attr#atconnectionlengthkeepgradient) 属性的简称，表示将指定元素移动到指定的偏移量的位置处，并自动旋转元素，使其方向与所在位置边的斜率保持一致。
- [`atConnectionRatio`](/zh/docs/api/registry/attr#atconnectionratiokeepgradient) 是 [`atConnectionRatioKeepGradient`](/zh/docs/api/registry/attr#atconnectionratiokeepgradient) 属性的简称，表示将指定元素移动到指定比例 `[0, 1]` 位置处，并自动旋转元素，使其方向与所在位置边的斜率保持一致。
- [`atConnectionLengthIgnoreGradient`](/zh/docs/api/registry/attr#atconnectionlengthignoregradient) 将指定元素移动到指定偏移量的位置处，忽略边的斜率，即不会跟随边自动旋转。
- [`atConnectionRatioIgnoreGradient`](/zh/docs/api/registry/attr#atconnectionratioignoregradient)，将指定元素移动到指定比例 `[0, 1]` 位置处，忽略边的斜率，即不会跟随边自动旋转。

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

<iframe src="/demos/tutorial/intermediate/attrs/edge-relative-position"></iframe>

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
      y: 30,  // 40 + -10
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
      y: 70,   // 80 + -10
      atConnectionRatioIgnoreGradient: 0.66,
    },
  },
})
```

<iframe src="/demos/tutorial/intermediate/attrs/edge-subelement-labels"></iframe>

## 使用箭头

我们可以使用 [`sourceMarker`](/zh/docs/api/registry/attr#sourcemarker) 和 [`targetMarker`](/zh/docs/api/registry/attr#targetmarker) 两个特殊属性来为边指定起始箭头和终止箭头，详情请参考[这篇教程](/zh/docs/tutorial/intermediate/marker)。
