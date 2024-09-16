---
title: Attributes
order: 13
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

X6 provides a wide range of built-in attributes as well as methods for custom attributes.

## Built-in Attributes

### ref

Specifies a selector pointing to an element, which serves as the reference element.

```typescript
graph.addNode({
  ...,
  markup: [
    {
      tagName: 'rect',
      selector: 'body,'
    },
    {
      tagName: 'rect',
      selector: 'custom,'
    }
  ],
  attrs: {
    body: {
      width: 100,
      height: 50,
    },
    // The length and width of the custom element are half of the body
    custom: {
      ref: 'body',
      refWidth: 0.5,
      refHeight: 0.5,
    }
  }
})
```

### refX

Sets the `x` coordinate of the element. The target `x` coordinate is relative to the `x` coordinate of the top-left corner of the element referenced by [`ref`](#ref).

- When its value is between `[0, 1]` or a percentage (e.g., `50%`), it represents the relative offset of the target `x` coordinate as a percentage of the reference element's width from the reference `x` coordinate. For example, `refX: 0.5` means the target `x` coordinate is offset to the right by 50% of the reference width from the reference `x` coordinate.
- When its value is `<0` or `>1`, it represents the absolute offset of the target `x` coordinate from the reference `x` coordinate. For example, `refX: 20` means the target `x` coordinate is offset 20px to the right from the reference `x` coordinate.

### refX2

Same as [`refX`](#refx), used when both relative and absolute offsets need to be specified simultaneously.

```ts
{
  refX: '50%',
  refX2: 20,
}
```

The above code indicates that the target `x` coordinate is offset 50% of the reference element's width to the right from the reference `x` coordinate, plus an additional 20px.

### refY

Sets the `y` coordinate of the element. The target `y` coordinate is relative to the `y` coordinate of the top-left corner of the element referenced by [`ref`](#ref) (reference `y` coordinate).

- When its value is between `[0, 1]` or a percentage (e.g., `50%`), it represents the relative offset of the target `y` coordinate as a percentage of the reference element's height from the reference `y` coordinate. For example, `refY: 0.5` means the target `y` coordinate is offset downward by 50% of the reference height from the reference `y` coordinate.
- When its value is `<0` or `>1`, it represents the absolute offset of the target `y` coordinate from the reference `y` coordinate. For example, `refY: 20` means the target `y` coordinate is offset 20px downward from the reference `y` coordinate.

### refY2

Same as [`refY`](#refy), used when both relative and absolute offsets need to be specified simultaneously.

```ts
{
  refY: '50%',
  refY2: 20,
}
```

The above code indicates that the target `y` coordinate is offset 50% of the reference element's height downward from the reference `y` coordinate, plus an additional 20px.

### refDx

Sets the `x` coordinate of the element. The target `x` coordinate is relative to the `x` coordinate of the bottom-right corner of the element referenced by [`ref`](#ref) (reference `x` coordinate).

- When its value is between `[0, 1]` or a percentage (e.g., `50%`), it represents the relative offset of the target `x` coordinate as a percentage of the reference element's width from the reference `x` coordinate. For example, `refDx: 0.5` means the target `x` coordinate is offset to the right by 50% of the reference width from the reference `x` coordinate.
- When its value is `<0` or `>1`, it represents the absolute offset of the target `x` coordinate from the reference `x` coordinate. For example, `refDx: 20` means the target `x` coordinate is offset 20px to the right from the reference `x` coordinate.

### refDy

Sets the `y` coordinate of the element. The target `y` coordinate is relative to the `y` coordinate of the bottom-right corner of the element referenced by [`ref`](#ref) (reference `y` coordinate).

- When its value is between `[0, 1]` or a percentage (e.g., `50%`), it represents the relative offset of the target `y` coordinate as a percentage of the reference element's height from the reference `y` coordinate. For example, `refDy: 0.5` means the target `y` coordinate is offset downward by 50% of the reference height from the reference `y` coordinate.
- When its value is `<0` or `>1`, it represents the absolute offset of the target `y` coordinate from the reference `y` coordinate. For example, `refDy: 20` means the target `y` coordinate is offset 20px downward from the reference `y` coordinate.

### refWidth

Sets the width of the element. The width is calculated relative to the width of the element referenced by [`ref`](#ref) (reference width).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents the element's width as a percentage of the reference width. For example, `refWidth: 0.75` means the element's width is 75% of the reference width.
- When its value is `<0` or `>1`, it represents how much the element's width is decreased or increased based on the reference width. For example, `refWidth: 20` means the element is 20px wider than the reference element.

:::warning{title=Note}
This attribute only applies to elements that support width and height, such as the `<rect>` element.
:::

### refWidth2

Same as [`refWidth`](#refwidth), used when both absolute and relative widths need to be specified simultaneously.

```ts
{
  refWidth: '75%',
  refWidth2: 20,
}
```

The above code indicates that the target width is 75% of the reference width plus an additional 20px.

### refHeight

Sets the height of the element. The height is calculated relative to the height of the element referenced by [`ref`](#ref) (reference height).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents the element's height as a percentage of the reference height. For example, `refHeight: 0.75` means the element's height is 75% of the reference height.
- When its value is `<0` or `>1`, it represents how much the element's height is decreased or increased based on the reference height. For example, `refHeight: 20` means the element is 20px taller than the reference element.

:::warning{title=Note}
This attribute only applies to elements that support width and height, such as the `<rect>` element.
:::

### refHeight2

Same as [`refHeight`](#refheight), used when both absolute and relative heights need to be specified simultaneously.

```ts
{
  refHeight: '75%',
  refHeight2: 20,
}
```

The above code indicates that the target height is 75% of the reference height plus an additional 20px.

### refCx

Sets the center `x` coordinate of the element, i.e., the [native `cx` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/cx). The target value is calculated relative to the width of the element referenced by [`ref`](#ref) (reference width).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents the element's `cx` as a percentage of the reference width. For example, `refCx: 0.75` means the element's center `x` coordinate is at 75% of the reference width.
- When its value is `<0` or `>1`, it represents how much the element's `cx` is decreased or increased based on the reference width. For example, `refCx: 20` means the element's center `x` coordinate is at the reference width plus 20px.

:::warning{title=Note}
This attribute only applies to elements that support `cx` and `cy` attributes, such as the `<ellipse>` element.
:::

### refCy

Sets the center `y` coordinate of the element, i.e., the [native `cy` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/cy). The target value is calculated relative to the height of the element referenced by [`ref`](#ref) (reference height).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents the element's `cy` as a percentage of the reference height. For example, `refCy: 0.75` means the element's center `y` coordinate is at 75% of the reference height.
- When its value is `<0` or `>1`, it represents how much the element's `cy` is decreased or increased based on the reference height. For example, `refCy: 20` means the element's center `y` coordinate is at the reference height plus 20px.

:::warning{title=Note}
This attribute only applies to elements that support `cx` and `cy` attributes, such as the `<ellipse>` element.
:::

### refRx

Sets the [`rx` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/rx) of the element. The target value is calculated relative to the width of the element referenced by [`ref`](#ref) (reference width).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents the element's `rx` as a percentage of the reference width. For example, `refRx: 0.75` means the element's `rx` is 75% of the reference width.
- When its value is `<0` or `>1`, it represents how much the element's `rx` is decreased or increased based on the reference width. For example, `refRx: 20` means the element's `rx` is the reference width plus 20px.

:::warning{title=Note}
This attribute only applies to elements that support `rx` and `ry` attributes, such as the `<rect>` element.
:::

### refRy

Sets the [`ry` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/ry) of the element. The target value is calculated relative to the height of the element referenced by [`ref`](#ref) (reference height).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents the element's `ry` as a percentage of the reference height. For example, `refRy: 0.75` means the element's `ry` is 75% of the reference height.
- When its value is `<0` or `>1`, it represents how much the element's `ry` is decreased or increased based on the reference height. For example, `refRy: 20` means the element's `ry` is the reference height plus 20px.

:::warning{title=Note}
This attribute only applies to elements that support `rx` and `ry` attributes, such as the `<rect>` element.
:::

### refRCircumscribed

Sets the [`r` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/r) of the element. The target value is relative to the **diagonal length** of the element referenced by [`ref`](#ref) (reference length).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents `r` as a percentage of the reference length. For example, `refRCircumscribed: 0.75` means `r` is 75% of the reference length.
- When its value is `<0` or `>1`, it represents how much `r` is decreased or increased based on the reference length. For example, `refRCircumscribed: 20` means `r` is the reference length plus 20px.

:::warning{title=Note}
This attribute only applies to elements that support the `r` attribute, such as the `<rect>` element.
:::

### refRInscribed

_Alias_: **`refR`**

Sets the [`r` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/r) of the element. The target value is relative to the **minimum of the width and height** of the element referenced by [`ref`](#ref) (reference length).

- When its value is between `[0, 1]` or a percentage (e.g., `75%`), it represents `r` as a percentage of the reference length. For example, `refRInscribed: 0.75` means `r` is 75% of the reference length.
- When its value is `<0` or `>1`, it represents how much `r` is decreased or increased based on the reference length. For example, `refRInscribed: 20` means `r` is the reference length plus 20px.

:::warning{title=Note}
This attribute only applies to elements that support the `r` attribute, such as the `<rect>` element.
:::

### refDKeepOffset

Sets the [`d` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) of the `<path>` element. It scales the original pathData to make the target `<path>` element the same size as the element referenced by [`ref`](#ref), and translates the original pathData to align the starting point of the target `<path>` element with the starting point of the element referenced by [`ref`](#ref).

At the same time, the offset of the provided pathData will be preserved, which means that if the top-left corner of the provided pathData is not at the coordinate origin `0, 0`, this offset will be preserved when the `<path>` element is rendered on the canvas.

```ts
import { Graph, Node } from '@antv/x6'

const Path = Node.define({
  markup: [{ tagName: 'path' }],
  attrs: {
    path: {
      refDKeepOffset: 'M 10 10 30 10 30 30 z', // path offset is 10,10
      fill: 'red',
      stroke: 'black',
    },
  },
})

const container = document.getElementById('container')!
const graph = new Graph({
  container,
  width: 800,
  height: 80,
  grid: true,
})

const path = new Path().resize(40, 40).addTo(graph)
const view = graph.findView(path)
console.log(view.findOne('path').getAttribute('d'))
// 'M 10 10 50 10 50 50 z'
```

### refDResetOffset

_Alias_: **`refD`**

Sets the [`d` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) of the `<path>` element. It scales the original pathData to make the target `<path>` element the same size as the element referenced by [`ref`](#ref), and translates the original pathData to align the starting point of the target `<path>` element with the starting point of the element referenced by [`ref`](#ref).

At the same time, the offset of the provided pathData will be removed, which means that if the top-left corner of the provided pathData is not at the coordinate origin `0, 0`, it will also be translated to the origin, and when the `<path>` element is rendered on the canvas, it will be strictly aligned with the reference element.

```ts
import { Graph, Node } from '@antv/x6'

const Path = Node.define({
  markup: [{ tagName: 'path' }],
  attrs: {
    path: {
      refDResetOffset: 'M 10 10 30 10 30 30 z', // path offset is 10,10
      fill: 'red',
      stroke: 'black',
    },
  },
})

const container = document.getElementById('container')!
const graph = new Graph({
  container,
  width: 800,
  height: 80,
  grid: true,
})

const path = new Path().resize(40, 40).addTo(graph)
const view = graph.findView(path)
console.log(view.findOne('path').getAttribute('d'))
// 'M 0 0 40 0 40 40 z'
```

### resetOffset

When the `resetOffset` property value is `true`, the point matrix will be translated so that the top-left corner of the matrix is at the origin.

```ts
path.attr({
  path: {
    d: 'M 10 10 20 20',
    resetOffset: true, // The d attribute value after translation is "M 0 0 10 10"
  },
})
```

### refPointsKeepOffset

Sets the [points attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/points) of `<polygon>` or `<polyline>` elements by scaling the original point matrix to make the target element the same size as the reference element specified by [`ref`](#ref), and translating the original point matrix to align the starting coordinates of the target element with the starting coordinates of the reference element specified by [`ref`](#ref).

At the same time, the offset of the point matrix will be preserved, which means that if the top-left corner of the point matrix is not at the coordinate origin `0, 0`, this offset will be preserved when the element is rendered on the canvas.

```ts
import { Graph, Node } from '@antv/x6'

const Polygon = Node.define({
  markup: [{ tagName: 'polygon' }],
  attrs: {
    polygon: {
      refPointsKeepOffset: '10,10 30,10 30,30', // points offset is 10,10
      fill: 'red',
      stroke: 'black',
    },
  },
})

const container = document.getElementById('container')!
const graph = new Graph({
  container,
  width: 800,
  height: 80,
  grid: true,
})

const polygon = new Polygon().resize(40, 40).addTo(graph)
const view = graph.findView(polygon)
console.log(view.findOne('polygon').getAttribute('points'))
// '10,10 50,10 50,50'
```

### refPointsResetOffset

_Alias_: **`refPoints`**

Sets the [points attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/points) of `<polygon>` or `<polyline>` elements by scaling the original point matrix to make the target element the same size as the reference element specified by [`ref`](#ref), and translating the original point matrix to align the starting coordinates of the target element with the starting coordinates of the reference element specified by [`ref`](#ref).

At the same time, the offset of the point matrix will be removed, which means that if the top-left corner of the point matrix is not at the coordinate origin `0, 0`, it will be translated to the origin simultaneously. When the `<path>` element is rendered on the canvas, it will be strictly aligned with the reference element.

```ts
import { Graph, Node } from '@antv/x6'

const Polygon = Node.define({
  markup: [{ tagName: 'polygon' }],
  attrs: {
    polygon: {
      refPointsResetOffset: '10,10 30,10 30,30', // points offset is 10,10
      fill: 'red',
      stroke: 'black',
    },
  },
})

const container = document.getElementById('container')!
const graph = new Graph({
  container,
  width: 800,
  height: 80,
  grid: true,
})

const polygon = new Polygon().resize(40, 40).addTo(graph)
const view = graph.findView(polygon)
console.log(view.findOne('polygon').getAttribute('points'))
// '100,0 40,0 40,40'
```

### xAlign

The horizontal alignment of the element with its `x` coordinate.

- `'left'` The left side of the target element aligns with `x`.
- `'middle'` The center of the target element aligns with `x`.
- `'right'` The right side of the target element aligns with `x`.

### yAlign

The vertical alignment of the element with its `y` coordinate.

- `'top'` The top of the target element aligns with `y`.
- `'middle'` The center of the target element aligns with `y`.
- `'bottom'` The bottom of the target element aligns with `y`.

<code id="attrs-x-align" src="@/src/api/attrs/x-align/index.tsx"></code>

### fill

When the provided `fill` attribute value is an object, it indicates using a gradient fill; otherwise, it uses a string color fill.

```ts
rect.attr('body/fill', {
  type: 'linearGradient',
  stops: [
    { offset: '0%', color: '#E67E22' },
    { offset: '20%', color: '#D35400' },
    { offset: '40%', color: '#E74C3C' },
    { offset: '60%', color: '#C0392B' },
    { offset: '80%', color: '#F39C12' },
  ],
})
```

### filter

When the provided `filter` attribute value is an object, it indicates using a custom filter; otherwise, it uses the native string form (e.g., `"url(#myfilter)"`).

```ts
rect.attr('body/filter', {
  name: 'dropShadow',
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
})
```

### stroke

When the provided `stroke` attribute value is an object, it indicates using a gradient fill; otherwise, it uses a string color fill. The usage is the same as the [fill](#fill) attribute.

### style

Applies inline CSS styles to the specified element using jQuery's [`css()`](https://api.jquery.com/css) method.

### html

Sets the innerHTML of the specified element using jQuery's [`html()`](https://api.jquery.com/html) method.

### title

Adds a `<title>` child element to the specified element. The `<title>` element does not affect the rendering result but only adds a descriptive explanation.

```ts
rect.attr('body/title', 'Description of the rectangle')
```

### text

Only applicable to `<text>` elements, used to set the text content. If the provided text is a single line (does not contain newline characters `'\n'`), the text is directly set as the content of the `<text>` element; otherwise, a `<tspan>` element is created for each line of text and then added to the `<text>` element.

### textWrap

Only applicable to `<text>` elements, used to set the text content. Unlike the [`text`](#text) attribute, this attribute automatically adds line breaks to the text, making the provided text completely enclosed within the bounding box of the reference element.

Its attribute value is a simple object, specifying the text content through `text`. Optional `width` and `height` options can be provided to adjust the size of the element. When negative, it indicates reducing the corresponding width or height (equivalent to setting a padding margin for the text); when positive, it increases the corresponding width or height; when a percentage, it indicates how much percentage of the reference element's width or height.

When the provided text exceeds the display range, the text will be automatically truncated. If the `ellipsis` option is set to `true`, an ellipsis `...` will be added at the end of the truncated text.

By default, English words will be truncated. If you don't want a complete word to be truncated, you can set `breakWord: false`. In this case, to display the complete word, the text may exceed the width range.

```ts
textWrap: {
  text: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
  width: -10,      // Width reduced by 10px
  height: '50%',   // Height is half of the reference element's height
  ellipsis: true,  // Automatically add ellipsis when text exceeds display range
  breakWord: true, // Whether to truncate words
}
```

<code id="attrs-text-wrap" src="@/src/api/attrs/text-wrap/index.tsx"></code>

### textPath

Only applicable to `<text>` elements, used to render text along a path.

When the provided attribute value is a string, it indicates that the text is rendered along the path represented by the string (pathData).

When the provided attribute value is an object, you can specify the rendering path of the text through the `d` option, or specify an SVGPathElement element in a node/edge through the `selector` option, supporting CSS selectors and selectors defined in [Markup](). You can also specify the position of the text on the path through the `startOffset` option, for example, `50%` indicates that the text is at 50% along the path, and `20` indicates that the text is 20px offset from the start of the path.

### lineHeight

Only applicable to `<text>` elements, used to specify the [line height](https://www.w3.org/TR/SVG/text.html#LineHeightProperty) of the text.

### textVerticalAnchor

Only applicable to `<text>` elements, the vertical alignment of the element with its `y` coordinate.

- `'top'` The top of the target element aligns with `y`.
- `'middle'` The center of the target element aligns with `y`.
- `'bottom'` The bottom of the target element aligns with `y`.

<code id="attrs-text-anchor" src="@/src/api/attrs/text-anchor/index.tsx"></code>

### connection

Only applicable to the `<path>` element of edges. When this attribute is `true`, it indicates that the edge will be rendered on this element, i.e., setting the [`d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) of this element to the pathData of the edge.

```ts
edge.attr('pathSelector', {
  connection: true,
  stroke: 'red',
  fill: 'none',
})
```

It also supports an object with `stubs` and `reserve` options.

- When `reverse` is `false`:

  - When `stubs` is positive, it indicates the length of the rendered start and end portions. For example, `connection: { stubs: 20 }` means only the first `20px` and last `20px` of the connection are rendered, and the rest is not rendered.
  - When `stubs` is negative, it indicates the length of the middle missing (not rendered) portion. For example, `connection: { stubs: -20 }` means there is a `20px` gap in the middle of the connection that is not rendered.

- When `reverse` is `true`:
  - When `stubs` is positive, it indicates the length of the start and end portions that are not rendered. For example, `connection: { stubs: 20 }` means the first `20px` and last `20px` are not rendered.
  - When `stubs` is negative, it indicates the length of the middle portion. For example, `connection: { stubs: -20 }` means only the middle `20px` is rendered.

```ts
edge.attr('pathSelector', {
  connection: { stubs: -20, reverse: true },
})
```

### atConnectionLengthKeepGradient

_Alias_: **`atConnectionLength`**

Moves the specified element in the edge to the position at the specified offset and automatically rotates the element so that its direction is consistent with the slope of the edge at that position.

- When positive, it indicates the offset from the start point of the edge.
- When negative, it indicates the offset from the end point of the edge.

```ts
edge.attr('rectSelector', {
  atConnectionLengthKeepGradient: 30,
  // atConnectionLength: 30,
  width: 10,
  height: 10,
  fill: 'red',
})
```

### atConnectionLengthIgnoreGradient

Move the specified element in the edge to the position at the specified offset, ignoring the direction of the edge. This means it will not automatically rotate the element like the [`atConnectionLengthKeepGradient`](#atconnectionlengthkeepgradient) property.

- When positive, it represents the offset from the start point of the edge.
- When negative, it represents the offset from the end point of the edge.

```ts
edge.attr('rectSelector', {
  atConnectionLengthIgnoreGradient: 30,
  width: 10,
  height: 10,
  fill: 'red',
})
```

### atConnectionRatioKeepGradient

_Alias_: **`atConnectionRatio`**

Moves the specified element in the edge to the specified ratio position `[0, 1]`, and automatically rotates the element to keep its direction consistent with the slope of the edge at that position.

```ts
edge.attr('rectSelector', {
  atConnectionRatioKeepGradient: 0.5,
  // atConnectionRatio: 0.5,
  width: 10,
  height: 10,
  fill: 'red',
})
```

### atConnectionRatioIgnoreGradient

Moves the specified element in the edge to the specified ratio position `[0, 1]`, ignoring the direction of the edge, i.e., it will not automatically rotate the element like the [`atConnectionRatioKeepGradient`](#atconnectionratiokeepgradient) property.

```ts
edge.attr('rectSelector', {
  atConnectionRatioIgnoreGradient: 0.5,
  width: 10,
  height: 10,
  fill: 'red',
})
```

### sourceMarker

Applicable to all `<path>` elements, adds an SVG element (such as a start arrow) at the start point of the path and automatically rotates the element to keep it consistent with the path direction. For more details, please refer to [this tutorial](/api/model/marker).

```ts
edge.attr('connection/sourceMarker', {
  tagName: 'circle',
  fill: '#666',
  stroke: '#333',
  r: 5,
  cx: 5,
})
```

### targetMarker

Applicable to all `<path>` elements, adds an SVG element (such as an end arrow) at the end point of the path and automatically rotates the element to keep it consistent with the path direction. For more details, please refer to [this tutorial](/api/model/marker).

:::warning{title=Note}
This element is initially rotated by `180` degrees, and then the rotation angle is automatically adjusted to be consistent with the direction of the path. For example, for a horizontal straight line, if we specify a left-pointing arrow for its start point, we can also specify the same arrow for its end point, and this arrow will automatically point to the right side (automatically rotated by `180` degrees).
:::

### vertexMarker

Applicable to all `<path>` elements, used in the same way as [`sourceMarker`](#sourcemarker), adds additional elements at all vertex positions of the `<path>` element.

### magnet

When the `magnet` attribute is `true`, it indicates that the element can be connected, i.e., it can be used as the start or end point of a connection during the connection process, similar to a connection port.

### port

Specifies a port ID for elements marked as [`magnet`](#magnet). When an edge connects to this element, this ID will be saved in the `source` or `target` of the edge.

- If it's a string, the string will be used as the port ID.
- If it's an object, the `id` property value of the object will be used as the port ID.

### event

Customizes a click event on the specified element, and then you can add a callback for this event on the Graph.

```ts
node.attr({
  // Represents a delete button, clicking it will delete the node
  image: {
    event: 'node:delete',
    xlinkHref: 'trash.png',
    width: 20,
    height: 20,
  },
})

// Bind event callback, delete the node when triggered
graph.on('node:delete', ({ view, e }) => {
  e.stopPropagation()
  view.cell.remove()
})
```

### xlinkHref

Alias for the [`xlink:href`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:href) attribute, for example:

```ts
node.attr({
  image: {
    xlinkHref: 'xxx.png',
  },
})
```

### xlinkShow

Alias for the [`xlink:show`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:show) attribute.

### xlinkType

Alias for the [`xlink:type`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:type) attribute.

### xlinkTitle

Alias for the [`xlink:title`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:title) attribute.

### xlinkArcrole

Alias for the [`xlink:arcrole`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:arcrole) attribute.

### xmlSpace

Alias for the [`xml:space`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xml:space) attribute.

### xmlBase

Alias for the [`xml:base`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xml:base) attribute.

### xmlLang

Alias for the [`xml:lang`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xml:lang) attribute.

## registry

We provide two methods, [`register`](#register) and [`unregister`](#unregister), on the `registry` object to register and delete special attributes.

### register

```ts
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

Registers custom attributes.

### unregister

```ts
unregister(name: string): Definition | null
```

Deletes registered attributes.

At the same time, we mount the [`register`](#register) and [`unregister`](#unregister) methods as two static methods of `Graph`: `Graph.registerAttr` and `Graph.unregisterAttr`. It is recommended to use these two static methods to register and delete special attributes.

### Definition

In the internal implementation, we convert special attributes into attributes that the browser can recognize, so theoretically, the value of special attributes can be of any type, and the definition of special attributes also supports multiple forms.

#### String

Defines aliases for native attributes. For example, the definition of the special attribute `xlinkHref` is actually defining a more easily written alias for the [`xlink:href`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:href) attribute.

```ts
// Definition
Graph.registerAttr('xlinkHref', 'xlink:href')

// Usage
node.attr({
  image: {
    xlinkHref: 'xxx.png',
  },
})
```

Before continuing to introduce attribute definitions, let's understand the attribute qualification `qualify` function. Only attribute values that pass the qualification function's judgment will be processed by special attributes. For example, the [`stroke`](#stroke) attribute is only treated as a special attribute (using gradient color to fill the border) when its value is of `Object` type. Let's look at the definition of the qualification function.

```ts
type QualifyFucntion = (
  this: CellView, // View of the node/edge
  val: ComplexAttrValue, // Current attribute value
  options: {
    elem: Element // Element to which the current attribute is applied
    attrs: ComplexAttrs // Key-value pairs of attributes applied to this element
    cell: Cell // Node/edge
    view: CellView // View of the node/edge
  },
) => boolean // Returns true if it passes the qualification function's judgment
```

For example, the definition of the [`stroke`](#stroke) attribute is as follows:

```ts
export const stroke: Attr.Definition = {
  qualify(val) {
    // Only trigger special attribute processing logic when the attribute value is an object.
    return ObjectExt.isPlainObject(val)
  },
  set(stroke, { view }) {
    return `url(#${view.graph.defineGradient(stroke as any)})`
  },
}
```

#### set

Sets the attribute definition, suitable for most scenarios.

```ts
export interface SetDefinition {
  qualify?: QualifyFucntion // Qualification function
  set: (
    this: CellView, // View of the node/edge
    val: ComplexAttrValue, // Current attribute value
    options: {
      refBBox: Rectangle // Bounding box of the reference element, or a rectangle representing the position and size of the node when there is no reference element
      elem: Element // Element to which the current attribute is applied
      attrs: ComplexAttrs // Key-value pairs of attributes applied to this element
      cell: Cell // Node/edge
      view: CellView // View of the node/edge
    },
  ) => SimpleAttrValue | SimpleAttrs | void
}
```

When the `set` method returns a `string` or `number`, it means to use the return value as the value of the special attribute. This approach is usually used to extend the definition of native attributes, such as the [`stroke`](#stroke) and [`fill`](#fill) attributes that support gradient color filling.

```ts
// stroke attribute definition
export const stroke: Attr.SetDefinition = {
  qualify: ObjectExt.isPlainObject,
  set(stroke, { view }) {
    // Returns a string, the return value is used as the attribute value of the stroke attribute.
    return `url(#${view.graph.defineGradient(stroke as any)})`
  },
}

// Using the stroke attribute
node.attr({
  rect: {
    stroke: {...},
  },
})
```

When the `set` method returns a simple object, this object is applied to the corresponding element as attribute key-value pairs, such as the [`sourceMarker`](#sourcemarker) and [`targetMarker`](#targetmarker) attributes.

```ts
export const sourceMarker: Attr.SetDefinition = {
  qualify: ObjectExt.isPlainObject,
  set(marker: string | JSONObject, { view, attrs }) {
    // Returns a simple object, the return value is applied to the corresponding element as attribute key-value pairs.
    return {
      'marker-start': createMarker(marker, view, attrs),
    }
  },
}
```

When the `set` method doesn't have a return value, it indicates that the property assignment is completed within the method itself, such as the [`html`](#html) attribute.

```ts
export const html: Attr.Definition = {
  set(html, { view, elem }) {
    // No return value, property assignment is completed within the method
    view.$(elem).html(`${html}`)
  },
}
```

#### offset

Offset property definition.

```ts
export interface OffsetDefinition {
  qualify?: QualifyFucntion // Qualification function
  offset: (
    this: CellView, // View of the node/edge
    val: ComplexAttrValue, // Current attribute value
    options: {
      refBBox: Rectangle // Bounding box of the reference element, if no reference element, use the rectangle represented by the node's position and size
      elem: Element // Element to which the current attribute is applied
      attrs: ComplexAttrs // Key-value pairs of attributes applied to the element
      cell: Cell // Node/edge
      view: CellView // View of the node/edge
    },
  ) => Point.PointLike // Returns absolute offset
}
```

Returns a `Point.PointLike` object representing absolute offsets in `x` and `y` directions, like the [`xAlign`](#xalign) attribute.

```ts
export const xAlign: Attr.OffsetDefinition = {
  offset(alignment, { refBBox }) {
    ...
    // Returns the absolute offset on the x-axis
    return { x, y: 0 }
  },
}
```

#### position

Position attribute definition.

```ts
export interface PositionDefinition {
  qualify?: QualifyFucntion // Qualification function
  offset: (
    this: CellView, // View of the node/edge
    val: ComplexAttrValue, // Current attribute value
    options: {
      refBBox: Rectangle // Bounding box of the reference element, if no reference element, use the rectangle represented by the node's position and size
      elem: Element // Element to which the current attribute is applied
      attrs: ComplexAttrs // Key-value pairs of attributes applied to the element
      cell: Cell // Node/edge
      view: CellView // View of the node/edge
    },
  ) => Point.PointLike // Returns absolute positioning coordinates
}
```

Returns absolute positioning coordinates relative to the node, like the [`refX`](#refx) and [`refDx`](#refdx) attributes.

```ts
export const refX: Attr.PositionDefinition = {
  position(val, { refBBox }) {
    ...
    // Returns the absolute positioning on the x-axis
    return { x, y: 0 }
  },
}
```
