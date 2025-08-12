---
title: Element Attributes
order: 5
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/model
---

For native SVG attributes, there are many tutorials available online, such as the [SVG Attribute Reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) provided by MDN. Here, we will focus more on how to define and use special attributes. Special attributes provide more flexible and powerful functionality than native SVG attributes. When applying attributes, native attributes are directly passed to the corresponding element, while special attributes are further processed and converted into native attributes recognized by the browser before being passed to the corresponding element.

## Relative Size and Position

When customizing nodes or edges, setting the relative size of elements is a very common requirement. We provide a series of special attributes prefixed with `ref` in X6, which can be used to set the relative size of elements. These attributes are calculated based on the data size of nodes/edges, which means that all calculations do not rely on the browser's bbox calculation, so there are no performance issues.

-  [`refWidth`](/en/api/registry/attr#refwidth) and [`refHeight`](/en/api/registry/attr#refheight) set the element size.
-  [`refX`](/en/api/registry/attr#refx) and [`refY`](/en/api/registry/attr#refy) set the element position.
-  [`refCx`](/en/api/registry/attr#refcx) and [`refCy`](/en/api/registry/attr#refcy) set the center position of `<ellipse>` and `<circle>`.
-  [`refRx`](/en/api/registry/attr#refrx) and [`refRy`](/en/api/registry/attr#refry) set the radius of `<ellipse>`.
-  [`refR`](/en/api/registry/attr#refr) sets the radius of `<circle>`.

Let's take a look at how to use these relative attributes. In the following example, we define a red ellipse `e`, a green rectangle `r`, a blue circle `c`, and a rectangle `outline` that represents the node size.

```ts
graph.addNode({
  shape: 'custom-rect',
  x: 160,
  y: 100,
  width: 280,
  height: 120,
  attrs: {
    e: {
      refRx: '50%', // ellipse x-axis radius is half of the width
      refRy: '25%', // ellipse y-axis radius is a quarter of the height
      refCx: '50%', // ellipse center x-coordinate is half of the width
      refCy: 0, // ellipse center y-coordinate is 0
      refX: '-50%', // offset to the left by half of the width
      refY: '25%', // offset down by a quarter of the height
    },
    r: {
      refX: '100%', // rectangle x-coordinate is at the right bottom corner of the node
      refY: '100%', // rectangle y-coordinate is at the right bottom corner of the node
      refWidth: '50%', // rectangle width is half of the node width
      refHeight: '50%', // rectangle height is half of the node height
      x: -10, // offset to the left by 10px
      y: -10, // offset up by 10px
    },
    c: {
      refRCircumscribed: '50%', // circle radius is half of the larger value of node width and height
      refCx: '50%', // circle center x-coordinate is at the node center
      refCy: '50%', // circle center y-coordinate is at the node center
    },
  },
})
```

## Relative Sub-elements

The above attributes are calculated relative to the node size by default. We can also use the `ref` attribute to provide a sub-element selector, so that all calculations are relative to the element referred to by `ref`, achieving relative size and position to sub-elements.

::: warning
Note that setting `ref` will make all calculations dependent on the sub-element's bbox measurement in the browser, which may affect performance.
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

## Relative Position Along the Edge

We provide the following attributes to set the position of edges and sub-elements relative to the edge.

-  [`connection`](/en/api/registry/attr#connection) is only applicable to `<path>` elements of edges, indicating that the edge will be rendered on this element when set to `true`.
-  [`atConnectionLength`](/en/api/registry/attr#atconnectionlengthkeepgradient) is an abbreviation of `atConnectionLengthKeepGradient`, indicating that the element will be moved to the specified offset position and automatically rotated to match the slope of the edge at that position.
-  [`atConnectionRatio`](/en/api/registry/attr#atconnectionratiokeepgradient) is an abbreviation of `atConnectionRatioKeepGradient`, indicating that the element will be moved to the specified ratio `[0, 1]` position and automatically rotated to match the slope of the edge at that position.
-  [`atConnectionLengthIgnoreGradient`](/en/api/registry/attr#atconnectionlengthignoregradient) will move the element to the specified offset position, ignoring the edge's slope, without automatic rotation.
-  [`atConnectionRatioIgnoreGradient`](/en/api/registry/attr#atconnectionratioignoregradient) will move the element to the specified ratio `[0, 1]` position, ignoring the edge's slope, without automatic rotation.

```ts
graph.addEdge({
  shape: 'custom-edge',
  source: { x: 100, y: 60 },
  target: { x: 500, y: 60 },
  vertices: [{ x: 300, y: 160 }],
  attrs: {
    symbol: {
      atConnectionRatio: 0.75, // along the edge, 75% from the start point
    },
    arrowhead: {
      atConnectionLength: 100, // along the edge, 100px from the start point
    },
  },
})
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

## Using Arrows

We can use the `sourceMarker` and `targetMarker` special attributes to specify the start and end arrowheads of edges, respectively. For more information, please refer to [this tutorial](/en/api/model/marker).
