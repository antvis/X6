---
title: 基类 Cell
order: 0
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

In the [Quick Start](/en/docs/tutorial/getting-started) case, we added two rectangle nodes and an edge to the canvas via JSON data, in addition to that, we built some basic shapes in X6's `Shape` namespace, such as `Rect`, `Edge`, `Circle` etc. These shapes end up with a common base class `Cell` that defines node and edge common properties and methods such as property styles, visibility, business data, etc. and have the same behavior in terms of instantiation, customizing styles, configuring default options, etc. See the inheritance relationship below.

```
                                     ┌──────────────────┐
                                 ┌──▶│ Shape.Rect       │
                                 │   └──────────────────┘
                                 │   ┌──────────────────┐
                                 ├──▶│ Shape.Circle     │
                     ┌────────┐  │   └──────────────────┘
                  ┌─▶│  Node  │──┤   ┌──────────────────┐
                  │  └────────┘  ├──▶│ Shape.Ellipse    │
                  │              │   └──────────────────┘
                  │              │   ┌──────────────────┐
                  │              └──▶│ Shape.Xxx...     │
      ┌────────┐  │                  └──────────────────┘
      │  Cell  │──┤                                      
      └────────┘  │                  ┌──────────────────┐
                  │              ┌──▶│ Shape.Edge       │
                  │              │   └──────────────────┘
                  │  ┌────────┐  │   ┌──────────────────┐
                  └─▶│  Edge  │──┼──▶│ Shape.DoubleEdge │
                     └────────┘  │   └──────────────────┘
                                 │   ┌──────────────────┐
                                 └──▶│ Shape.ShadowEdge │
                                     └──────────────────┘
```

We can use the constructors of these graphs to create nodes/edges and then call the [graph.addNode]() or [graph.addEdge]() methods to add them to the canvas.

```ts
import { Shape } from '@antv/x6'

const rect = new Shape.Rect({
  id: 'node1',
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  label: 'rect', 
  zIndex: 2,
})

const circle = new Shape.Circle({
  id: 'node2',
  x: 280,
  y: 200,
  width: 60,
  height: 60,
  label: 'circle', 
  zIndex: 2,
})

const edge = new Shape.Edge({
  id: 'edge1',
  source: rect,
  target: circle,
  zIndex: 1,
})

graph.addNode(rect)
graph.addNode(circle)
graph.addEdge(edge)
```

These constructors all have some base options from `Cell`, such as `id`, `attrs`, `zIndex`, etc. Let's look at the meaning of each of these base options.

## Basic Options

| Option Name | Type | Default | Description                                                  |
|----------|----------|-----------|------------------------------------------------------|
| id | String | undefined | The unique identifier of the node/edge, the default is the automatically generated UUID. | markup | Markup | undefined | The SVG/HTML fragment of the node/edge.
| markup | markup | undefined | The SVG/HTML fragment of the node/edge.                               |markup
| attrs | Object | { } | The node/edge property style.                                       | attrs
| shape | String | undefined | Render the node/edge's graphics.                                     | view
| view | String | undefined | Renders the view of the node/edge.                                     | view
| zIndex | Number | undefined | The level of the node/edge in the canvas, determined automatically by default based on the node/edge addition order. |zIndex
| visible | Boolean | true | If or not the node/edge is visible.                                       | parent
| parent | String | undefined | The parent of the node.                                                | children
| children | String[] | undefined | The children's nodes/edges.                                             | children
| data | any | undefined | The business data associated with the node/edge.                                 | data


### id

`id` is the unique identifier of the node/edge, it is recommended to use an ID with business meaning, the default is the automatically generated UUID.

### markup

`markup` specifies the SVG/HTML fragment to be used when rendering the node/edge, described in `JSON` format. For example, the `markup` definition for the `Shape.

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
}
```

means that the node contains `<rect>` and `<text>` SVG elements inside the node. After rendering to the page, the node's corresponding SVG element looks like the following.

```html
<g data-cell-id="c2e1dd06-15c6-43a4-987a-712a664b8f85" class="x6-cell x6-node" transform="translate(40,40)">
  <rect fill="#fff" stroke="#000" stroke-width="2" fill-opacity="0.5" width="100" height="40"></rect>
  <text font-size="14" xml:space="preserve" fill="#333" text-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,50,20)">
    <tspan dy="0.3em" class="v-line">rect</tspan>
  </text>
</g>
```

Through the above introduction, we have a general understanding of the structure of `Markup`, and in the following we will introduce the `Markup` definition in detail.

```ts
interface Markup {
  tagName: string
  ns?: string
  selector?: string
  groupSelector?: string | string[]
  attrs?: { [key: string]: string | number }
  style?: { [key: string]: string | number }
  className?: string | string[]
  textContent?: string
  children?: Markup[]
}
```

#### tagName

SVG/HTML element tag name.

#### ns
 
The element namespace corresponding to `tagName` uses the SVG element namespace `"http://www.w3.org/2000/svg"` by default, and when the tag specified by `tagName` is an HTML element, you need to use the HTML element namespace `"http://www.w3.org/1999/xhtml"`.

#### selector

A unique identifier for an SVG/HTML element by which to specify [attribute style](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes) for that element. For example, specifying the attribute style for the `<rect>` and `<text>` elements for the `Shape.

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    // Specify the style of the rect element
    body: { 
      stroke: '#000', // border color
      fill: '#fff', // fill color
    },
    // Specify the style of the text element
    label: { 
      text: 'rect', // text
      fill: '#333', // text color
    },
  },
})
```

#### groupSelector

A group selector allows you to specify styles for multiple elements corresponding to the group. For example, the two `<rect>`s in the definition below have the same `groupSelector` value `'group1'`.

```ts
{
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
      groupSelector: 'group1',
    }, 
    {
      tagName: 'rect',
      selector: 'wrap',
      groupSelector: 'group1',
    }, 
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
}
```

When creating a node, we can specify the group style like this

```ts
new SomeNode({
  attrs: { 
    group1: {
      fill: '#2ECC71',
    },
  },
})
```

#### attrs

The default attribute key-value pairs for this SVG/HTML element are typically used to define those invariant generic attributes, and these default styles can also be overridden when the node is instantiated. Note that the `attrs` attribute of `markup` only supports native SVG attributes, which means that X6's [custom attributes]() are not available here. 

For example, we specify the following default style for the `<rect>` and `<text>` elements of the `Shape.

```js
{
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
      attrs: {
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
      }
    }, 
    {
      tagName: 'text',
      selector: 'label',
      attrs: {
        fill: '#333',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      }
    },
  ],
}
```

#### style

The in-line style key-value pair for this SVG/HTML element.

#### className

The CSS style name of the SVG/HTML element.

#### textContent

The text content of the SVG/HTML element.

#### children

Nested child elements.

### attrs

In [Quick Start](/en/docs/tutorial/getting-started), we briefly described how to customize node styles using the `attrs` option, which is a complex object whose Key is the Selector of the SVG element in the node, and whose corresponding value is the [SVG attribute value]() applied to that SVG attribute value](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute) applied to that SVG element (e.g. [fill](https://developer.mozilla.org/zh-CN/docs/Web/) SVG/Attribute/fill) and [stroke](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke)). If you are not familiar with SVG attributes, you can refer to the [fill and border]( https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes) for a tutorial to get started.

Selector is determined by the node's `markup`, e.g. the `Shape.Rect` node defines the `'body'` (representing the `<rect>` element) and `'label'` (representing the `<text>` element) selectors.

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: { 
    body: {
      fill: '#2ECC71',
      stroke: '#000',
    },
    label: {
      text: 'rect',
      fill: '#333',
      fontSize: 13,
    },
  },
})
```

The DOM structure of the node after it is rendered to the canvas looks like the following.

```html
<g data-cell-id="3ee1452c-6d75-478d-af22-88e03c6d513b" class="x6-cell x6-node" transform="translate(40,40)">
  <rect fill="#2ECC71" stroke="#000" stroke-width="2" width="100" height="40"></rect>
  <text font-size="13" xml:space="preserve" fill="#333" text-anchor="middle" font-family="Arial, helvetica, sans-serif" transform="matrix(1,0,0,1,50,20)">
    <tspan dy="0.3em" class="v-line">
      rect
    </tspan>
  </text>
</g>
```

Alternatively, we can use CSS selectors to specify node styles so that we don't have to remember the intended selector name and can simply define the style based on the rendered DOM structure. When using CSS selectors, it is important to note that multiple elements may be selected by the specified CSS selector, and the corresponding property styles will be applied to multiple elements at the same time.

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: { 
    rect: { // Use the rect css selector instead of the predefined body selector
      fill: '#2ECC71',
      stroke: '#000',
    },
    text: { // Use the text css selector instead of the predefined label selector
      text: 'rect',
      fill: '#333',
      fontSize: 13,
    },
  },
})
```

It is worth mentioning that property names in camelCase format, such as `'fontSize'`, are supported, which avoids the trouble of writing property names like `'font-size'` in quotes when they are used as object keys.

In addition to the standard [SVG attributes](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute), we have defined a series of special attributes in X6, please refer to [How to use special attributes](/en/docs/tutorial/ intermediate/attrs) and [How to customize attributes](/en/docs/api/registry/attr#definition). Also, we can use [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) to customize the styles. Nodes and edges are rendered to the canvas with `'x6-node'` and `'x6-edge'` style names, respectively, and the default style definitions [refer here]( https://github.com/antvis/X6/blob/master/packages/x6/src/index.less#L26-L156). For example, we can specify the style of the `<rect>` element in a node like this.

```css
.x6-node rect {
  fill: #2ECC71;
  stroke: #000;
}
```

After creating the node/edge, we can call the `attr()` method on the instance to modify the node attribute style. Look at the following code, the style is modified by the `/` split path, the `label` selector corresponds to the `<text>` element, `text` is the attribute name of the element, and `'hello'` is the new attribute value.

```ts
rect.attr('label/text', 'hello')

// Equivalent to
rect.attr('label', {
  text: 'hello'
})

// Equivalent to
rect.attr({
  label: {
    text: 'hello'
  }
})
```

The property can be removed when the value passed in is `null`.

```ts
rect.attr('label/text', null)
```

### shape

The graph of a node/edge, similar to a Model in the MVC pattern, determines the data logic of the node/edge and is usually used in conjunction with the `graph.addNode` and `graph.addEdge` methods. In fact, `graph` also provides two convenient methods `graph.addNode` and `graph.addEdge` to create nodes/edges and add them to the canvas.

```ts
const rect = graph.addNode({
  shape: 'rect',
  x: 100,
  y: 200,
  width: 80,
  height: 40,
  label: 'rect', 
})

const circle = graph.addNode({
  shape: 'circle',
  x: 280,
  y: 200,
  width: 60,
  height: 60,
  label: 'circle', 
  zIndex: 2,
})

const edge = graph.addEdge({
  shape: 'edge',
  source: rect,
  target: circle,
})
```

The key here is the use of `shape` to specify the graph of the node/edge. The default value of `shape` in the `graph.addNode` method is `'rect'`, the default value of `shape` in the `graph.addEdge` method is `'edge'`, and the other options are the same as using the constructor to create the node/edge. In the X6 internal implementation, we initialize nodes/edges and add them to the canvas by finding the corresponding constructor for the graph specified by `shape`.

#### Built-in Nodes

The built-in node constructors correspond to the `shape` names in the following table.

| constructor          | shape name      | description                                  |
|----------------------|-----------------|-----------------------------------------------|
| Shape.Rect           | rect            | Rectangle.                                      |
| Shape.Circle         | circle          | Circle.                                           |
| Shape.Ellipse        | ellipse         | Ellipse.                                           |
| Shape.Polygon        | polygon         | polygon.                                         |
| Shape.Polyline       | polyline        | Polyline.                                         |
| Shape.Path           | path            | path.                                           |
| Shape.Image          | image           | Image.                                           |
| Shape.HTML           | html            | HTML node that uses `foreignObject` to render HTML fragments.   |
| Shape.TextBlock      | text-block      | Text node, use `foreignObject` to render the text.       |
| Shape.BorderedImage  | image-bordered  | Pictures with borders.                              |
| Shape.EmbeddedImage  | image-embedded  | Image with the embedded rectangle.           |
| Shape.InscribedImage | image-inscribed | Embedded ellipse image.                               |
| Shape.Cylinder       | cylinder        | Cylinders.                                           |


#### Built-in side

The built-in edge constructors correspond to the `shape` names in the following table.

| constructor | shape name | description |
|------------------|-------------|--------|
| Shape.Edge       | edge        | Side.     |
| Shape.DoubleEdge | double-edge | Double line edge. |
| Shape.ShadowEdge | shadow-edge | Shaded edges. |

Besides using X6's built-in nodes/edges, we can also register custom nodes/edges and use them. To learn more, please refer to the [custom-node](/en/docs/tutorial/intermediate/custom-node) and [custom-edge](/en/docs/tutorial/intermediate/custom-edge) tutorials.

### view

Specify the view used to render the node/edge. The concept of view is the same as View in MVC pattern, which we will introduce in detail in [custom-node](/en/docs/tutorial/intermediate/custom-node) and [custom-edge](/en/docs/tutorial/intermediate/custom-edge) tutorials.

### zIndex

The node/edge hierarchy in the canvas is automatically determined by default based on the order in which the nodes/edges are added. The value of `zIndex` can be obtained or set by `cell.getZIndex()` and `cell.setZIndex(z: number)` after the node/edge is rendered to the canvas, and it can also be moved to the top or bottom layer by calling `cell.toFront()` and `cell.toBack()`.

### visible

If or not the node/edge is visible.

### parent

The parent node ID.

### children

ID array of children/edges.

### data

The business data associated with a node/edge. For example, we usually store some business data on the `data` of the node/edge when we use it in practice.

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  data: { 
    bizID: 125,
    date: '20200630',
    price: 89.00,
  }
})
```

## Option default value

The Cell class provides a static method `Cell.config(options)` to configure the option defaults. The option defaults are very friendly to custom nodes/edges and can specify pre-defined defaults for our custom nodes/edges. For example, when we define a rectangular node, we specify the default Markup, default size and default style for it.

```ts
Shape.Rect.config({
  width: 80,
  height: 40,
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
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 2,
    },
    label: {
      fontSize: 14,
      fill: '#333',
      fontFamily: 'Arial, helvetica, sans-serif',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    }
  },
})
```

The default option simplifies our code for adding nodes, for example, by simply specifying the location and text of the rectangle node to add a rectangle to the canvas.

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  attrs: {
    label: {
      text: 'rect',
    },
  },
})
```

Each call to `config(options)` is a [depth merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources) with the current preset, for example, the following code changes the default color of the border of the rectangle to red and the default text The final effect is a superposition of the two.

```ts
// Change only the default color of the border
Shape.Rect.config({
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})

// Change only the default text color
Shape.Rect.config({
  attrs: {
    label: {
      fill: 'blue',
      // Override the red defined above
      stroke: '#000',
    },
  },
})
```

## Customization Options

You may have noticed that in the previous code that created the rectangle, we used the `label` option to set the label text of the rectangle.

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  label: 'rect',
})
```

This is not new magic, we just consume custom options by defining `propHooks` hooks when defining rectangles, see the implementation details of `label` option hooks below.

```ts
Shape.Rect.config({
  // Apply the label to the 'attrs/text/text' attribute via a hook
  propHooks(metadata) {
    const { label, ...others } = metadata
    if (label) {
      ObjectExt.setByPath(others, 'attrs/text/text', label)
    }
    return others
  },
})
```

With the `propHooks` hook, we can easily extend some custom options. For example, we can define certain styles as options for nodes, which not only reduces nesting, but also makes the code for creating nodes more semantic.

Look at the following code to define `rx` and `ry` customization options for rectangles.

```ts
Shape.Rect.config({
  propHooks: {
    rx(metadata) { 
      const { rx, ...others } = metadata
      if (rx != null) {
        ObjectExt.setByPath(others, 'attrs/body/rx', rx)
      }
      return others
    },
    ry(metadata) { 
      const { ry, ...others } = metadata
      if (ry != null) {
        ObjectExt.setByPath(others, 'attrs/body/ry', ry)
      }
      return others
    },
  },
})
```

This way, we can easily add rounded rectangles.

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  rx: 5,
  ry: 10,
  label: 'rect',
})
```
