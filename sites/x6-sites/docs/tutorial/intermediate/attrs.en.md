---
title: 特殊属性
order: 6
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

In the previous tutorial we introduced [How to customize styles with `attrs`](/en/docs/tutorial/basic/cell#attrs-1), and also saw in [Using arrows tutorial](/en/docs/tutorial/basic/edge#Using arrow-marker) the power of `sourceMarker` and `targetMarker` special attributes in [Node styles](/en/docs/tutorial/basic/cell#attrs-1). sourceMarker `and` `targetMarker`, and learned about the power of `attrs` in [node style](/en/docs/tutorial/basic/node#custom-style-attrs), [edge-style](/en/docs/tutorial/basic/ edge#custom styles-attrs), [label styles](/en/docs/tutorial/intermediate/edge-labels#label styles), and many other places are widely used, so it is necessary to introduce attribute-related concepts in more detail.

For native SVG attributes, there are many tutorials available online, such as the [SVG Attribute Reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) provided by MDN, but here we will focus more on how to define and use special attributes. Special attributes provide more flexibility and power than [native SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute). When applying attributes, native attributes are passed directly to the corresponding element, while special attributes are further processed and converted to native attributes recognized by the browser and then passed to the corresponding element.

## Relative size and relative position

Setting the relative size of an element is a very common requirement when customizing nodes or edges. We provide a series of special attributes prefixed with `ref` in X6, which can be used to set the relative size of an element, and the calculation of these attributes is based on the data size of the node/edge, which means that all calculations do not rely on the browser's bbox calculation, so there is no performance problem.

- [`refWidth`](/en/docs/api/registry/attr#refwidth) and [`refHeight`](/en/docs/api/registry/attr#refheight) Element size.
- [`refX`](/en/docs/api/registry/attr#refx) and [`refY`](/en/docs/api/registry/attr#refy) Element position.
- [`refCx`](/en/docs/api/registry/attr#refcx) and [`refCy`](/en/docs/api/registry/attr#refcy) Oval `<ellipse>` and round `<circle>` Center position.
- [`refRx`](/en/docs/api/registry/attr#refrx) and [`refRy`](/en/docs/api/registry/attr#refry) Oval `<ellipse>` Radius.
- [`refR`](/en/docs/api/registry/attr#refr) Round `<circle>` Radius.

Let's take a look at how to use these relative properties. In the following case, we have a red ellipse `e`, a green rectangle `r`, and a blue circle `c` and a rectangle indicating the size of the node `outline`.

```ts
graph.addNode({
  shape: 'custom-rect',
  x: 160,
  y: 100,
  width: 280,
  height: 120,
  attrs: {
    e: {
      refRx: '50%', // the radius of the ellipse's x-axis is half of the width
      refRy: '25%', // the radius of the y-axis of the ellipse is 1/4 of the height
      refCx: '50%', // the center x coordinate of the ellipse is half of the width, i.e. at the center of the node width
      refCy: 0, // the y-coordinate of the center of the ellipse is 0
      refX: '-50%', // shift left by half the width
      refY: '25%', // offset down by 1/4 of the height
    },
    r: {
      refX: '100%', // the x-axis of the rectangle is located at the bottom right corner of the node
      refY: '100%', // the y-axis of the rectangle is at the bottom-right corner of the node
      refWidth: '50%', // the width of the rectangle is half of the node width
      refHeight: '50%', // the height of the rectangle is half of the node's height
      x: -10, // shift 10px to the left
      y: -10, // offset up by 10px
    },
    c: {
      refRCircumscribed: '50%', // the radius of the circle is half of the larger of the node's width/height
      refCx: '50%', // center of circle x-coordinate is at the center of the node
      refCy: '50%', // the center of the circle y-coordinate is at the center of the node
    },
  },
})
```

<iframe src="/demos/tutorial/intermediate/attrs/ref-node"></iframe>

## Relative child elements

These attributes above are calculated relative to the size of the node by default, in addition we can provide a child element selector via the `ref` attribute, where all calculations are relative to the element referred to by `ref`, thus achieving size and position relative to the child element.

[[warning]]
| Note that with `ref` set, all calculations rely on the child element's bbox measurement in the browser, so performance will be slower than the relative-to-node approach.

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

## Relative position along the length of the edge

We provide the following properties to set the edge and its position relative to the edge.

- [`connection`](/en/docs/api/registry/attr#connection) is only applicable to the `<path>` element of the edge, when this attribute is `true`, it means the edge will be rendered on that element.
- [`atConnectionLength`](/en/docs/api/registry/attr#atconnectionlengthkeepgradient) is [`atConnectionLengthKeepGradient`](/en/docs/api/registry/attr#atconnectionlengthkeepgradient) attribute, which indicates that the specified element is moved to the position of the specified offset and the element is automatically rotated so that its direction is consistent with the slope of the edge at its location.
- [`atConnectionRatio`](/en/docs/api/registry/attr#atconnectionratiokeepgradient) is [`atConnectionRatioKeepGradient`](/en/docs/api/registry/attr#atconnectionratiokeepgradient) attribute, which means that the specified element will be moved to the specified scale `[0, 1]` position and automatically rotated so that its direction is consistent with the slope of the edge where it is located.
- [`atConnectionLengthIgnoreGradient`](/en/docs/api/registry/attr#atconnectionlengthignoregradient) Moves the specified element to the position with the specified offset, ignoring the slope of the edge, i.e. it will not follow the edge Auto-rotate.
- [`atConnectionRatioIgnoreGradient`](/en/docs/api/registry/attr#atconnectionratioignoregradient) Move the specified element to the position with the specified ratio `[0, 1]`, ignoring the slope of the edge, i.e. it will not follow the automatic rotation of the edge.

```ts
graph.addEdge({
  shape: 'custom-edge',
  source: { x: 100, y: 60 },
  target: { x: 500, y: 60 },
  vertices: [{ x: 300, y: 160 }],
  attrs: {
    symbol: {
      atConnectionRatio: 0.75, // along the length of the edge, at 75% from the starting point
    },
    arrowhead: {
      atConnectionLength: 100, // Along the length of the edge, at 100px from the starting point
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

## Using arrows

We can use [`sourceMarker`](/en/docs/api/registry/attr#sourcemarker) and [`targetMarker`](/en/docs/api/registry/attr#targetmarker) two special attributes to Specify start arrow and end arrow, please refer to [this tutorial](/en/docs/tutorial/intermediate/marker) for details.
