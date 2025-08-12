---
title: Cell
order: 0
redirect_from:
  - /docs
  - /docs/api
  - /docs/api/model
---

Cell is the base class for [Node](/en/api/model/node) and [Edge](/en/api/model/edge), containing common property and method definitions for nodes and edges, such as attribute styles, visibility, business data, etc. It also exhibits the same behavior in terms of instantiation, style customization, default options, and custom options.

## Properties

| Option   | Type                            | Default | Required | Description                                                                                    |
|----------|---------------------------------|---------|:--------:|------------------------------------------------------------------------------------------------|
| id       | string                          |         |          | Unique identifier for the node/edge. It's recommended to use an ID with business meaning. By default, a UUID is automatically generated. |
| markup   | Markup                          |         |          | SVG/HTML fragment for the node/edge.                                                           |
| attrs    | Attr.CellAttrs                  |         |          | Attribute styles for the node/edge.                                                             |
| shape    | string                          |         |          | Shape used to render the node/edge. Default value for nodes is `rect`, for edges is `edge`.    |
| view     | string                          |         |          | View used to render the node/edge.                                                              |
| zIndex   | number                          |         |          | Layer level of the node/edge in the canvas. By default, it's automatically determined based on the order of node/edge addition. |
| visible  | boolean                         | `true`  |          | Whether the node/edge is visible.                                                               |
| parent   | string                          |         |          | Parent node.                                                                                    |
| children | string[]                        |         |          | Child nodes/edges.                                                                              |
| tools    | ToolItem \| ToolItem[] \| Tools |         |          | Tool options.                                                                                   |
| data     | any                             |         |          | Business data associated with the node/edge.                                                    |

### id

`id` is the unique identifier for the node/edge. It's recommended to use an ID with business meaning. By default, a UUID is automatically generated.

### markup

`markup` specifies the SVG/HTML fragment used to render the node/edge, described in JSON format. For example, the `markup` definition for the built-in node `Shape.Rect` is as follows:

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

This indicates that the node internally contains two SVG elements: `<rect>` and `<text>`. After rendering to the page, the SVG element corresponding to the node looks like this:

```html
<g
  data-cell-id="c2e1dd06-15c6-43a4-987a-712a664b8f85"
  class="x6-cell x6-node"
  transform="translate(40,40)"
>
  <rect
    fill="#fff"
    stroke="#000"
    stroke-width="2"
    fill-opacity="0.5"
    width="100"
    height="40"
  ></rect>
  <text
    font-size="14"
    xml:space="preserve"
    fill="#333"
    text-anchor="middle"
    font-family="Arial, helvetica, sans-serif"
    transform="matrix(1,0,0,1,50,20)"
  >
    <tspan dy="0.3em" class="v-line">rect</tspan>
  </text>
</g>
```

From the above introduction, we have a general understanding of the `Markup` structure. Now, let's detail the `Markup` definition.

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

| Option        | Type             | Default                        | Required | Description                                                                                    |
|---------------|------------------|--------------------------------|:--------:|------------------------------------------------------------------------------------------------|
| tagName       | string           |                                |    ✓     | SVG/HTML element tag name.                                                                      |
| ns            | string           | `"http://www.w3.org/2000/svg"` |          | SVG/HTML element namespace.                                                                     |
| selector      | string           | -                              |          | Unique selector for the element, used to locate the element or specify attribute styles for it. |
| groupSelector | string           | -                              |          | Group selector for the element, can be used to specify styles for multiple elements in the group simultaneously. |
| attrs         | Attr.SimpleAttrs | -                              |          | Default attribute key-value pairs for the element.                                              |
| style         | KeyValue         | -                              |          | Inline style key-value pairs for the element.                                                   |
| className     | string           | -                              |          | CSS class name for the element.                                                                 |
| textContent   | string           | -                              |          | Text content of the element.                                                                    |
| children      | Markup[]         | -                              |          | Nested child elements.                                                                          |

#### tagName

Specifies which type of SVG/HTML element to create through `tagName`.

#### ns

The namespace of the element. It should correspond to the element type specified by `tagName`. By default, it uses the SVG element namespace `"http://www.w3.org/2000/svg"`.

- SVG element namespace is `"http://www.w3.org/2000/svg"`
- HTML element namespace is `"http://www.w3.org/1999/xhtml"`

#### selector

The unique selector for the element, used to specify [attribute styles](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes) for the element. For example, to specify attribute styles for `<rect>` and `<text>` elements of the built-in node `Shape.Rect`:

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    // Specify styles for the rect element
    body: {
      stroke: '#000', // Border color
      fill: '#fff', // Fill color
    },
    // Specify styles for the text element
    label: {
      text: 'rect', // Text content
      fill: '#333', // Text color
    },
  },
})
```

#### groupSelector

The group selector for the element. Through the group selector, styles can be specified for multiple elements associated with the group. For example, in the following Markup, two `<rect>` elements have the same `groupSelector` value `group1`:

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

When creating a node, we can specify group styles like this:

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

Default attribute key-value pairs for the element, typically used to define unchanging common attributes. These default attributes can also be overridden when instantiating the node. Note that the `attrs` property in `markup` only supports native SVG attributes, meaning X6's [custom attributes]() are not available here.

For example, we specified the following default attributes for the `<rect>` and `<text>` elements of the built-in node `Shape.Rect`:

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

Inline style key-value pairs for the element.

#### className

CSS class name for the element.

#### textContent

Text content of the element.

#### children

Nested child elements.

### attrs

The attribute option `attrs` is a complex object. The keys of this object are the selectors ([selector](#selector)) of elements defined in the node's Markup, and the corresponding values are [SVG attribute values](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) (such as [fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill) and [stroke](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke)) applied to that SVG element. If you're not familiar with SVG attributes yet, you can refer to the beginner's tutorial on [Fills and Strokes](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes) provided by MDN.

For example, the Markup of the built-in node `Shape.Rect` defines two selectors: `body` (representing the `<rect>` element) and `label` (representing the `<text>` element). We can specify attribute styles for elements in this node like this:

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

After the node is rendered to the canvas, the DOM structure looks like this:

```html
<g
  data-cell-id="3ee1452c-6d75-478d-af22-88e03c6d513b"
  class="x6-cell x6-node"
  transform="translate(40,40)"
>
  <rect
      fill="#2ECC71"
      stroke="#000"
      stroke-width="2"
      width="100"
      height="40"
  ></rect>
  <text
      font-size="13"
      xml:space="preserve"
      fill="#333"
      text-anchor="middle"
      font-family="Arial, helvetica, sans-serif"
      transform="matrix(1,0,0,1,50,20)"
  >
    <tspan dy="0.3em" class="v-line"> rect </tspan>
  </text>
</g>
```

Additionally, we can use CSS selectors to specify node styles, so we don't have to remember predefined selector names. We can simply define styles based on the rendered DOM structure. When using CSS selectors, it's important to note that the specified CSS selector may match multiple elements, in which case the corresponding attribute styles will be applied to multiple elements simultaneously.

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    rect: {
      // Use the 'rect' CSS selector instead of the predefined 'body' selector
      fill: '#2ECC71',
      stroke: '#000',
    },
    text: {
      // Use the 'text' CSS selector instead of the predefined 'label' selector
      text: 'rect',
      fill: '#333',
      fontSize: 13,
    },
  },
})
```

It's worth mentioning that camelCase format for property names is supported, such as `fontSize`. This avoids the hassle of having to add quotes to property names like `font-size` when used as object keys.

In addition to standard SVG attributes, we have defined a series of special attributes in X6. For details, please refer to [Special Attributes](/en/api/model/attrs) and [Custom Attributes](/en/api/model/cell/#custom-attributes). Furthermore, we can use CSS to customize styles. Nodes and edges rendered on the canvas have the class names `x6-node` and `x6-edge` respectively. The default style definitions can be [referenced here](https://github.com/antvis/X6/blob/master/packages/x6/src/style/index.less). For example, we can specify the style of the `<rect>` element in nodes like this:

```css
.x6-node rect {
  fill: #2ecc71;
  stroke: #000;
}
```

After creating nodes/edges, we can call the `attr()` method on the instance to modify node attribute styles. In the code below, the path separated by `/` modifies the style. The `label` selector corresponds to the `<text>` element, `text` is the attribute name of that element, and `hello` is the new attribute value.

```ts
rect.attr('label/text', 'hello')

// Equivalent to
rect.attr('label', {
  text: 'hello',
})

// Equivalent to
rect.attr({
  label: {
    text: 'hello',
  },
})
```

When the attribute value passed in is `null`, that attribute can be removed.

```ts
rect.attr('label/text', null)
```

### shape

The shape of the node/edge, similar to the Model in the MVC pattern, determines the structured data of the node/edge. This option is typically used when adding nodes and edges with the `graph.addNode` and `graph.addEdge` methods.

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
})

const edge = graph.addEdge({
  shape: 'edge',
  source: rect,
  target: circle,
})
```

In X6's internal implementation, we use the shape specified by `shape` to find the corresponding constructor to initialize the node/edge and add it to the canvas.

The default values for this option are:

- The default value of `shape` in the `graph.addNode` method is `rect`
- The default value of `shape` in the `graph.addEdge` method is `edge`

At the same time, we have built-in a series of nodes and edges in X6.

| Constructor   | shape name | Description                                      |
|---------------|------------|--------------------------------------------------|
| Shape.Rect    | rect       | Rectangle.                                       |
| Shape.Circle  | circle     | Circle.                                          |
| Shape.Ellipse | ellipse    | Ellipse.                                         |
| Shape.Polygon | polygon    | Polygon.                                         |
| Shape.Polyline| polyline   | Polyline.                                        |
| Shape.Path    | path       | Path.                                            |
| Shape.Image   | image      | Image.                                           |
| Shape.HTML    | html       | HTML node, renders HTML fragment using `foreignObject`. |

### view

Specifies the view used to render the node/edge. The concept of view is consistent with the View in the MVC pattern. Generally, there's no need to set the view field, as X6's built-in view is used by default.

### zIndex

The layer level of the node/edge in the canvas, automatically determined by the order of node/edge addition by default. After the node/edge is rendered to the canvas, you can use `cell.getZIndex()` and `cell.setZIndex(z: number)` to get or set the `zIndex` value, or call `cell.toFront()` and `cell.toBack()` to move it to the top or bottom layer.

### visible

Whether the node/edge is visible, visible by default.

### parent

Parent node ID.

### children

Array of child node/edge IDs.

### tools

Tools for nodes/edges. Tools can enhance the interaction capabilities of nodes/edges. We provide the following built-in tools for nodes and edges respectively:

Nodes

- [button](/en/api/registry/node-tool#button) Renders a button at the specified position, supports customizing button click interactions.
- [button-remove](/en/api/registry/node-tool#button-remove) Renders a delete button at the specified position, deletes the corresponding node when clicked.
- [boundary](/en/api/registry/node-tool#boundary) Renders a rectangle surrounding the node based on the node's bounding box. Note that this tool only renders a rectangle without any interaction.
- [node-editor](/en/api/registry/node-tool#node-editor) Provides text editing functionality on the node.

Edges

- [vertices](/en/api/registry/edge-tool#vertices) Path point tool, renders a small dot at the path point position, drag the dot to modify the path point position, double-click the dot to delete the path point, click on the edge to add a path point.
- [segments](/en/api/registry/edge-tool#segments) Segment tool. Renders a toolbar at the center of each edge segment, which can be dragged to adjust the positions of the path points at both ends of the segment.
- [boundary](/en/api/registry/edge-tool#boundary) Renders a rectangle surrounding the edge based on the edge's bounding box. Note that this tool only renders a rectangle without any interaction.
- [button](/en/api/registry/edge-tool#button) Renders a button at the specified position, supports customizing button click interactions.
- [button-remove](/en/api/registry/edge-tool#button-remove) Renders a delete button at the specified position, deletes the corresponding edge when clicked.
- [source-arrowhead-and-target-arrowhead](/en/api/registry/edge-tool#source-arrowhead-and-target-arrowhead) Renders a shape (arrow by default) at the start or end point of the edge, drag the shape to modify the start or end point of the edge.
- [edge-editor](/en/api/registry/edge-tool#edge-editor) Provides text editing functionality on the edge.

You can specify a single tool:

```ts
graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  tools: 'button-remove', // or { name: 'button-remove' }
})
```

Also, you can specify the parameter options for the tool like this:

```ts
graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  tools: {
    name: 'button-remove',
    args: {
      x: 10, // x coordinate of the button, relative to the top-left corner of the node
      y: 10, // y coordinate of the button, relative to the top-left corner of the node
    },
  },
})
```

You can also specify multiple tools at the same time:

```ts
graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  tools: [
    'button-remove',
    {
      name: 'boundary',
      args: {
        padding: 5,
      },
    },
  ],
})
```

### data

Business data associated with the node/edge. For example, in actual use, we usually store certain business data on the `data` of the node/edge.

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  data: {
    bizID: 125,
    date: '20200630',
    price: 89.0,
  },
})
```

## Methods

### General

#### get shape

Get the shape of the node/edge, returns the name of the shape registered to X6.

```ts
if (node.shape === 'rect') {
  // do something if the node is a 'rect' node.
}
```

#### get view

Get the view of the node/edge, returns the name of the view registered to X6.

```ts
if (node.view === 'rect') {
  // do something if the node is a 'rect' view.
}
```

#### isNode()

```ts
isNode(): boolean
```

Checks if the instance is a [Node](/en/api/model/node) instance. Returns `true` if it's a [Node](/en/api/model/node) instance, otherwise returns `false`. All nodes inheriting from [Node](/en/api/model/node) return `true`.

```ts
if (cell.isNode()) {
  // do something if the cell is a node.
}
```

#### isEdge()

```ts
isEdge(): boolean
```

Checks if the instance is an [Edge](/en/api/model/edge) instance. Returns `true` if it's an [Edge](/en/api/model/edge) instance, otherwise returns `false`. All edges inheriting from [Edge](/en/api/model/edge) return `true`.

```ts
if (cell.isEdge()) {
  // do something if the cell is an edge.
}
```

#### toJSON(...)

```ts
toJSON(options?: Cell.ToJSONOptions): Object
```

Converts the structured data of the node/edge to JSON data for persistent storage (usually we call `graph.toJSON` to export the data of the entire canvas).

| Option       | Type    | Default | Required | Description                                    |
|--------------|---------|---------|:--------:|------------------------------------------------|
| options.diff | boolean | `false` |          | Whether to return data that differs from the default values (still exports data for the entire canvas). |

- When `options.diff` is `false`, returns complete data.
- When `options.diff` is `true`, returns differential data (removes default values of properties).

#### clone(...)

```ts
clone(options?: Cell.CloneOptions): Cell | Node | Edge | { [id:string]: Node | Edge }
```

Clone the node/edge.

| Option       | Type    | Default | Required | Description                                                |
|--------------|---------|---------|:--------:|------------------------------------------------------------|
| options.deep | boolean | `false` |          | Whether to clone descendant nodes and edges, default is `false` which means only cloning itself. |

- When `options.deep` is `false`, returns the newly created node/edge by cloning.
- When `options.deep` is `true`, returns an object where the Key is the ID of the cloned node/edge, and the Value is the cloned node/edge.

#### on(...)

```ts
on(name: string, handler: Events.Handler, context?: any): this
```

Listen to events.

| Option  | Type           | Default | Required | Description                  |
|---------|----------------|--------|:----:|----------------------------------|
| name    | string         |        |  ✓   | Event name.                      |
| handler | Events.Handler |        |  ✓   | Callback function.               |
| context | any            |        |      | Calling context of the callback. |

#### once(...)

```ts
once(name: string, handler: Events.Handler, context?: any): this
```

Listen to an event once, automatically remove the listener after the event is triggered.

| Option  | Type           | Default | Required | Description                           |
|---------|----------------|---------|:--------:|---------------------------------------|
| name    | string         |         |    ✓     | Event name.                           |
| handler | Events.Handler |         |    ✓     | Callback function.                    |
| context | any            |         |          | Calling context of callback function. |

#### off(...)

```ts
/**
 * Remove all event listeners.
 */
off(): this

/**
 * Remove all event listeners for the specified name.
 */
off(name: string): this

/**
 * Remove the event listener corresponding to the specified handler.
 */
off(name: null, handler: Events.Handler): this

/**
 * Remove the event listener for the specified name and handler.
 */
off(name: string, handler: Events.Handler, context?: any): this
```

Remove event listeners.

#### trigger(...)

```ts
trigger(name: string, ...args?: any[]): boolean | Promise<boolean>
```

Trigger an event.

| Option  | Type   | Default | Required | Description                               |
|---------|--------|---------|:--------:|-------------------------------------------|
| name    | string |         |    ✓     | Event name.                               |
| ...args | any[]  |         |          | Parameters passed to callback functions.  |

- When all callback functions are synchronous, it returns `false` if any callback function returns `false`, otherwise returns `true`.
- When there are asynchronous functions among the callbacks, it returns `Promise<boolean>` based on the same logic as synchronous callbacks.

#### dispose()

```ts
dispose(): void
```

Destroy and remove the node/edge from its parent.

### Element Structure markup

Specifies the SVG/HTML structure used to render nodes/edges, described in [JSON format](#markup), usually set through the [`config`]() method when defining nodes/edges to be shared by all instances. When modifying `markup`, it will trigger the `change:markup` event and canvas redraw.

#### get markup

Get `markup`.

```ts
const markup = cell.markup
```

#### set markup

Set `markup`, and trigger the `change:markup` event and canvas redraw.

```ts
cell.markup = markup
```

#### getMarkup()

```ts
getMarkup(): Markup
```

Get `markup`.

```ts
const markup = cell.getMarkup()
```

#### setMarkup(...)

```ts
setMarkup(markup: Markup, options?: Cell.SetOptions): this
```

Set `markup`. By default, it triggers the `change:markup` event and canvas redraw. When `options.silent` is `true`, it does not trigger the `change:markup` event and canvas redraw.

| Name             | Type              | Required | Default | Description                                                          |
|------------------|-------------------|:--------:|---------|----------------------------------------------------------------------|
| markup           | [Markup](#markup) |    ✓     |         |                                                                      |
| options.silent   | boolean           |          | `false` | When `true`, do not trigger `change:markup` event and canvas redraw. |
| options...others | object            |          |         | Other custom key-value pairs that can be used in event callbacks.    |

#### removeMarkup(...)

```ts
removeMarkup(options?: Cell.SetOptions): this
```

Remove `markup`. By default, it triggers the `change:markup` event and canvas redraw. When `options.silent` is `true`, it does not trigger the `change:markup` event and canvas redraw.

| Name             | Type    | Required | Default | Description                                                          |
|------------------|---------|----------|---------|----------------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, do not trigger `change:markup` event and canvas redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.    |

### Element Attributes attrs

The `attrs` property is a [complex object](#attrs-1). When modifying `attrs`, it will trigger the `change:attrs` event and canvas redraw.

#### get attrs

Get attributes.

```ts
const atts = cell.attrs
```

#### set attrs

Set attributes, and trigger the `change:attrs` event and canvas redraw.

```ts
cell.atts = attrs
```

#### getAttrs()

```ts
getAttrs(): Attr.CellAttrs
```

Get attributes.

```ts
const atts = cell.getAttrs()
```

#### setAttrs(...)

```ts
setAttrs(attrs: Attr.CellAttrs, options?: Cell.SetAttrOptions): this
```

Set attributes. By default, it triggers the `change:attrs` event and canvas redraw.

| Name              | Type                                | Required | Default | Description                                                                                                                |
|-------------------|-------------------------------------|:--------:|---------|--------------------------------------------------------------------------------------------------------------------------|
| attrs             | Attr.CellAttrs \| null \| undefined |    ✓     |         |                                                                                                                            |
| options.overwrite | boolean                             |          | `false` | When `true`, replace existing attributes; otherwise, perform deep or shallow merge based on the `options.deep` option.    |
| options.deep      | boolean                             |          | `true`  | Effective when `options.overwrite` is `false`. When `true`, perform deep merge; otherwise, perform shallow merge.         |
| options.silent    | boolean                             |          | `false` | When `true`, do not trigger `change:attrs` event and canvas redraw.                                                        |
| options...others  | object                              |          |         | Other custom key-value pairs that can be used in event callbacks.                                                          |

By default, the specified attributes will be [deeply merged](https://www.lodashjs.com/docs/latest#_mergeobject-sources) with the old attributes:

```ts
console.log(cell.getAttrs())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }

cell.setAttrs({
  body: { fill: '#f5f5f5' },
  label: { text: 'My Label' },
})

console.log(cell.getAttrs())
// {
//   body: { fill: '#f5f5f5' },
//   label: { fill: '#333333', text: 'My Label' },
// }
```

When `options.deep` is `false`, perform shallow merge:

```ts
console.log(cell.getAttrs())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }

cell.setAttrs({ label: { text: 'My Label' } }, { deep: false })

console.log(cell.getAttrs())
// {
//   body: { fill: '#ffffff' },
//   label: { text: 'My Label' },
// }
```

When `options.overwrite` is `true`, directly replace old attributes:

```ts
console.log(cell.getAttrs())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }

cell.setAttrs({ label: { text: 'My Label' } }, { overwrite: true })

console.log(cell.getAttrs())
// {
//   label: { text: 'My Label' },
// }
```

#### replaceAttrs(...)

```ts
replaceAttrs(attrs: Attr.CellAttrs, options: Cell.SetOptions = {}): this
```

Replace original attributes with given attributes, equivalent to calling `setAttrs(attrs, { ...options, overwrite: true })`.

| Name             | Type                                | Required | Default | Description                                                       |
|------------------|-------------------------------------|:--------:|---------|-------------------------------------------------------------------|
| attrs            | Attr.CellAttrs \| null \| undefined |    ✓     |         |                                                                   |
| options.silent   | boolean                             |          | `false` | When `true`, do not trigger `change:attrs` event and canvas redraw. |
| options...others | object                              |          |         | Other custom key-value pairs that can be used in event callbacks.  |

#### updateAttrs(...)

```ts
updateAttrs(attrs: Attr.CellAttrs, options: Cell.SetOptions = {}): this
```

Update attributes using shallow merge, equivalent to calling `setAttrs(attrs, { ...options, deep: false })`.

| Name             | Type                                | Required | Default | Description                                                       |
|------------------|-------------------------------------|:----:|---------|---------------------------------------------------|
| attrs            | Attr.CellAttrs \| null \| undefined |  ✓   |         |                                                   |
| options.silent   | boolean                             |      | `false` | When `true`, it doesn't trigger the `change:attrs` event and canvas redraw. |
| options...others | object                              |      |         | Other custom key-value pairs that can be used in event callbacks. |

#### removeAttrs(...)

```ts
removeAttrs(options?: Cell.SetOptions): this
```

Remove attributes.

| Name             | Type    | Required | Default | Description                                                                      |
|------------------|---------|:--------:|---------|----------------------------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, it won't trigger the `change:attrs` event and canvas redraw.        |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.                |

#### getAttrByPath(...)

```ts
getAttrByPath<T>(path?: string | string[]): T
```

Get attribute value by attribute path.

| Name | Type               | Required | Default | Description                                                                                                                                                    |
|------|--------------------|:--------:|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| path | string \| string[] |          |         | Attribute path. When `path` is of type `string`, the path is a string separated by `\`. When `path` is of type `string[]`, the path is an array of keys on the attribute object path. |

The attribute value of a certain node is as follows:

```ts
console.log(cell.getAttrs())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }
```

When the path is empty, it returns all attributes:

```ts
console.log(cell.getAttrByPath())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }
```

Get attribute value through string path:

```ts
console.log(cell.getAttrByPath('body'))
// { fill: '#ffffff' }

console.log(cell.getAttrByPath('body/fill'))
// '#ffffff'

console.log(cell.getAttrByPath('unknown'))
// undefined

console.log(cell.getAttrByPath('body/unknown'))
// undefined
```

Get attribute value through a path composed of an array of keys of the attribute object:

```ts
console.log(cell.getAttrByPath(['body']))
// { fill: '#ffffff' }

console.log(cell.getAttrByPath(['body', 'fill']))
// '#ffffff'

console.log(cell.getAttrByPath(['unknown']))
// undefined

console.log(cell.getAttrByPath(['body', 'unknown']))
// undefined
```

#### setAttrByPath(...)

```ts
setAttrByPath(path: string | string[], value: Attr.ComplexAttrValue, options?: Cell.SetOptions): this
```

Set attribute value by attribute path.

| Name             | Type                  | Required | Default | Description                                                                                                                                                    |
|------------------|-----------------------|:--------:|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| path             | string \| string[]    |    ✓     |         | Attribute path. When `path` is of type `string`, the path is a string separated by `\`. When `path` is of type `string[]`, the path is an array of keys on the attribute object path. |
| value            | Attr.ComplexAttrValue |    ✓     |         | New attribute value.                                                                                                                                            |
| options.silent   | boolean               |          | `false` | When `true`, it won't trigger the `change:attrs` event and canvas redraw.                                                                                      |
| options...others | object                |          |         | Other custom key-value pairs that can be used in event callbacks.                                                                                              |

The initial attribute value of a certain node is as follows:

```ts
console.log(cell.getAttrs())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }
```

Set attribute value through string path:

```ts
cell.setAttrByPath('body', { stroke: '#000000' }) // Replace body attribute value
console.log(cell.getAttrs())
// {
//   body: { stroke: '#000000' },
//   label: { fill: '#333333' },
// }

cell.setAttrByPath('body/fill', '#f5f5f5') // Set body.fill attribute value
console.log(cell.getAttrs())
// {
//   body: { stroke: '#000000', fill: '#f5f5f5' },
//   label: { fill: '#333333' },
// }
```

Or set attribute value through a path composed of an array of keys of the attribute object:

```ts
cell.setAttrByPath(['body'], { stroke: '#000000' }) // Replace body attribute value
console.log(cell.getAttrs())
// {
//   body: { stroke: '#000000' },
//   label: { fill: '#333333' },
// }

cell.setAttrByPath(['body', 'fill'], '#f5f5f5') // Set body.fill attribute value
console.log(cell.getAttrs())
// {
//   body: { stroke: '#000000', fill: '#f5f5f5' },
//   label: { fill: '#333333' },
// }
```

#### removeAttrByPath(...)

```ts
removeAttrByPath(path: string | string[], options?: Cell.SetOption ): this
```

Remove attribute value at the specified path.

| Name             | Type               | Required | Default | Description                                                                                                                                                    |
|------------------|--------------------|:--------:|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| path             | string \| string[] |    ✓     |         | Attribute path. When `path` is of type `string`, the path is a string separated by `\`. When `path` is of type `string[]`, the path is an array of keys on the attribute object path. |
| options.silent   | boolean            |          | `false` | When `true`, it won't trigger the `change:attrs` event and canvas redraw.                                                                                      |
| options...others | object             |          |         | Other custom key-value pairs that can be used in event callbacks.                                                                                              |

The initial attribute value of a certain node is as follows:

```ts
console.log(cell.getAttrs())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }
```

Remove attribute value through string path:

```ts
cell.removeAttrByPath('body/fill')
console.log(cell.getAttrs())
// {
//   body: { },
//   label: { fill: '#333333' },
// }

cell.removeAttrByPath('body')
console.log(cell.getAttrs())
// {
//   label: { fill: '#333333' },
// }
```

Or remove attribute value through a path composed of an array of keys of the attribute object:

```ts
cell.removeAttrByPath(['body', 'fill'])
console.log(cell.getAttrs())
// {
//   body: { },
//   label: { fill: '#333333' },
// }

cell.removeAttrByPath(['body'])
console.log(cell.getAttrs())
// {
//   label: { fill: '#333333' },
// }
```

#### attr(...)

```ts
/**
 * Get attributes.
 */
attr(): Cell.CellAttrs

/**
 * Get attribute value at the specified path.
 */
attr<T>(path: string | string[]): T

/**
 * Set attribute value at the specified path.
 */
attr(path: string | string[], value: Attr.ComplexAttrValue | null, options?: Cell.SetOptions): this

/**
 * Set attribute values, the passed attributes are deeply merged with the old attributes.
 */
attr(attrs: Attr.CellAttrs, options?: Cell.SetOptions): this
```

This method is an integration of [`getAttrByPath`](#getattrbypath), [`setAttrByPath`](#setattrbypath), and [`setAttrs`](#setattrs) methods, providing the above four function signatures, making it a very practical method.

Get all attribute values:

```ts
console.log(cell.attr())
// {
//   body: { fill: '#ffffff' },
//   label: { fill: '#333333' },
// }
```

Get attribute value at the specified path:

```ts
console.log(cell.attr('body/fill'))
// '#ffffff'
```

Set attribute value at the specified path:

```ts
cell.attr('body/fill', '#f5f5f5')
console.log(cell.attr())
// {
//   body: { fill: '#f5f5f5' },
//   label: { fill: '#333333' },
// }
```

Set attribute values through the attribute object, and perform a [deep merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources) with the existing attribute object.

```ts
cell.attr({
  body: { stroke: '#000000' },
  label: { fill: 'blue', text: 'my label' },
})
console.log(cell.attr())
// {
//   body: { fill: '#f5f5f5', stroke: '#000000' },
//   label: { fill: 'blue', text: 'my label' },
// }
```

### Hierarchy zIndex

`zIndex` is the layer level of a node/edge in the canvas, which is automatically determined based on the order of node/edge addition by default. When modifying `zIndex`, it will trigger the `change:zIndex` event and canvas redraw.

#### get zIndex

Get the `zIndex`.

```ts
const z = cell.zIndex
```

#### set zIndex

Set the `zIndex`, triggering the `change:zIndex` event and canvas redraw.

```ts
cell.zIndex = 2
```

#### getZIndex()

```ts
getZIndex(): number
```

Get the `zIndex`.

```ts
const z = cell.getZIndex()
```

#### setZIndex(...)

```ts
setZIndex(zIndex: number, options?: Cell.SetOptions): this
```

Set the `zIndex`. By default, it triggers the `change:zIndex` event and canvas redraw. When `options.silent` is `true`, it doesn't trigger the `change:zIndex` event and canvas redraw.

| Name             | Type    | Required | Default | Description                                                    |
|------------------|---------|:--------:|---------|----------------------------------------------------------------|
| zIndex           | number  |    ✓     |         |                                                                |
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:zIndex` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

#### removeZIndex(...)

```ts
removeZIndex(options?: Cell.SetOptions): this
```

Remove the `zIndex`. By default, it triggers the `change:zIndex` event and canvas redraw. When `options.silent` is `true`, it doesn't trigger the `change:zIndex` event and canvas redraw.

| Name             | Type    | Required | Default | Description                                                    |
|------------------|---------|----------|---------|----------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:zIndex` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

#### toFront(...)

```ts
toFront(options?: Cell.ToFrontOptions): this
```

Move the node/edge to the topmost layer.

| Name             | Type    | Required | Default | Description                                                    |
|------------------|---------|----------|---------|----------------------------------------------------------------|
| options.deep     | boolean |          | `false` | When `true`, also updates the hierarchy of all child nodes/edges. |
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:zIndex` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

#### toBack(...)

```ts
toBack(options?: Cell.ToBackOptions): this
```

Move the node/edge to the bottommost layer.

| Name             | Type    | Required | Default | Description                                                    |
|------------------|---------|----------|---------|----------------------------------------------------------------|
| options.deep     | boolean |          | `false` | When `true`, also updates the hierarchy of all child nodes/edges. |
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:zIndex` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

By default, updating `zIndex` triggers the `change:zIndex` event and canvas redraw:

```ts
cell.toBack()
```

When `options.deep` is `true`, it also updates the hierarchy of all child nodes/edges:

```ts
cell.toBack({ deep: true })
```

### Visibility Visible

#### get visible

Returns whether the node/edge is visible.

```ts
if (cell.visible) {
  // do something
}
```

#### set visible

Sets whether the node/edge is visible and triggers the `change:visible` event and canvas redraw.

#### show(...)

```ts
show(options?: Cell.SetOptions): this
```

Show the node/edge.

| Name             | Type    | Required | Default | Description                                                     |
|------------------|---------|:--------:|---------|-----------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:visible` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

#### hide(...)

```ts
hide(options?: Cell.SetOptions): this
```

Hide the node/edge.

| Name             | Type    | Required | Default | Description                                                     |
|------------------|---------|:--------:|---------|-----------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:visible` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

:::info{title="Note"}
X6 2.x implements element hiding by adding `display: none` to the node label.
:::

#### isVisible()

```ts
isVisible(): boolean
```

Returns whether the node/edge is visible.

#### setVisible(...)

```ts
setVisible(visible: boolean, options?: Cell.SetOptions): this
```

Set the visibility of the node/edge. By default, it triggers the `change:visible` event and canvas redraw. When `options.silent` is `true`, it doesn't trigger the `change:visible` event and canvas redraw.

| Name             | Type    | Required | Default | Description                                                     |
|------------------|---------|:--------:|---------|-----------------------------------------------------------------|
| visible          | boolean |    ✓     |         |                                                                 |
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:visible` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

#### toggleVisible(...)

```ts
toggleVisible(options?: Cell.SetOptions): this
```

Toggle the visibility of the node/edge. By default, it triggers the `change:visible` event and canvas redraw. When `options.silent` is `true`, it doesn't trigger the `change:visible` event and canvas redraw.

| Name             | Type    | Required | Default | Description                                                     |
|------------------|---------|:--------:|---------|-----------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, doesn't trigger `change:visible` event and redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks. |

### Business Data

Business data associated with nodes/edges. For example, in practical use, we often store certain business data on the data property of nodes/edges.

```ts
const rect = new Shape.Rect({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  data: {
    bizID: 125,
    date: '20200630',
    price: 89.0,
  },
})
```

#### get data

Get the associated data.

#### set data

Set the associated data and trigger the `change:data` event and canvas redraw.

#### getData()

```ts
getData(): any
```

Get the associated data.

#### setData(...)

```ts
setData(data: any, options?: Cell.SetDataOptions): this
```

Set the associated business data. By default, it triggers the `change:data` event and canvas redraw. When `options.silent` is `true`, it doesn't trigger the `change:data` event and canvas redraw.

| Name              | Type    | Required | Default | Description                                                                                   |
|-------------------|---------|:--------:|---------|-----------------------------------------------------------------------------------------------|
| data              | any     |    ✓     |         |                                                                                               |
| options.overwrite | boolean |          | `false` | When `true`, replaces existing values; otherwise, performs deep or shallow merge based on `options.deep`. |
| options.deep      | boolean |          | `true`  | Effective when `options.overwrite` is `false`. When `true`, performs deep merge; otherwise, shallow merge. |
| options.silent    | boolean |          | `false` | When `true`, doesn't trigger `change:data` event and redraw.                                   |
| options...others  | object  |          |         | Other custom key-value pairs that can be used in event callbacks.                              |

By default, it performs a [deep merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources) with the original data and triggers the `change:data` event and canvas redraw:

```ts
cell.setData(data)
```

When `options.overwrite` is `true`, it replaces the old data:

```ts
cell.setData(data, { overwrite: true })
```

When `options.deep` is `false`, it performs a shallow merge with the original data:

```ts
cell.setData(data, { deep: false })
```

:::info{title="Note"}
The `setData` method uses shallow comparison to determine if the data has been updated, thus deciding whether to trigger node redraw.
:::

```ts
const obj = { name: 'x6', star: true }
node.setData(obj) // This will trigger a node redraw

obj.star = false
node.setData(obj) // Note: At this point, no deep comparison is performed. The object is considered unchanged, so it won't trigger a node redraw

node.setData({
  ...obj,
  star: false,
}) // This will trigger a node redraw
```

#### replaceData(...)

```ts
replaceData(data: any, options: Cell.SetOptions = {}): this
```

Replace the original data with the specified data, equivalent to calling `setData(data, { ...options, overwrite: true })`.

| Name             | Type    | Required | Default | Description                                                                   |
|------------------|---------|:--------:|---------|-------------------------------------------------------------------------------|
| data             | any     |    ✓     |         |                                                                               |
| options.silent   | boolean |          | `false` | When `true`, does not trigger the `change:data` event and canvas redrawing.   |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.             |

#### updateData(...)

```ts
updateData(data: any, options: Cell.SetOptions = {}): this
```

Update data using shallow merge, equivalent to calling `setData(data, { ...options, deep: false })`.

| Name             | Type    | Required | Default | Description                                                                   |
|------------------|---------|:--------:|---------|-------------------------------------------------------------------------------|
| data             | any     |    ✓     |         |                                                                               |
| options.silent   | boolean |          | `false` | When `true`, does not trigger the `change:data` event and canvas redrawing.   |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.             |

#### removeData(...)

```ts
removeData(options: Cell.SetOptions): this
```

Remove data. By default, it triggers the `change:data` event and canvas redrawing. When `options.silent` is `true`, it does not trigger the `change:data` event and canvas redrawing.

| Name             | Type    | Required | Default | Description                                                                   |
|------------------|---------|----------|---------|-------------------------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, does not trigger the `change:data` event and canvas redrawing.   |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.             |

### Parent/Children Relationship

#### get parent

Get the parent node.

#### getParent()

```ts
getParent(): Cell | null
```

Get the parent node. Returns the parent node if it exists, otherwise returns `null`.

#### setParent(...)

```ts
setParent(parent: Cell | null, options?: Cell.SetOptions): this
```

Set the parent node.

| Name             | Type         | Required | Default | Description                                                                        |
|------------------|--------------|:--------:|---------|------------------------------------------------------------------------------------|
| parent           | Cell \| null |    ✓     |         | Parent node or `null`. When `parent` is `null`, it removes the parent node.        |
| options.silent   | boolean      |          | `false` | When `true`, does not trigger the `change:parent` event and canvas redrawing.      |
| options...others | object       |          |         | Other custom key-value pairs that can be used in event callbacks.                  |

#### getParentId()

```ts
getParentId(): string | undefined
```

Get the ID of the parent node. Returns the parent node's ID if it exists, otherwise returns `undefined`.

#### hasParent()

```ts
hasParent(): boolean
```

Check if the node/edge has a parent node.

#### get children

Get all child nodes/edges.

#### getChildren()

```ts
getChildren(): Cell[] | null
```

Get all child nodes/edges.

#### setChildren()

```ts
setChildren(children: Cell[] | null, options?: Cell.SetOptions)
```

Set child nodes/edges.

| Name             | Type           | Required | Default | Description                                                                            |
|------------------|----------------|:--------:|---------|----------------------------------------------------------------------------------------|
| children         | Cell[] \| null |    ✓     |         | Array of child nodes/edges or `null`. When `children` is `null`, it clears all children. |
| options.silent   | boolean        |          | `false` | When `true`, does not trigger the `change:children` event and canvas redrawing.        |
| options...others | object         |          |         | Other custom key-value pairs that can be used in event callbacks.                      |

#### isParentOf(...)

```ts
isParentOf(child: Cell | null): boolean
```

Returns whether the current node is the parent of the specified Cell.

| Name  | Type         | Required | Default | Description |
|-------|--------------|:--------:|---------|-------------|
| child | Cell \| null |    ✓     |         |             |

#### isChildOf(...)

```ts
isChildOf(parent: Cell | null): boolean
```

Returns whether the current node/edge is a child of the specified node.

| Name   | Type         | Required | Default | Description |
|--------|--------------|:--------:|---------|-------------|
| parent | Cell \| null |    ✓     |         |             |

#### eachChild(...)

```ts
eachChild(iterator: (child: Cell, index: number, children: Cell[]) => void, context?: any): this
```

Iterate through child nodes.

| Name     | Type                                                   | Required | Default | Description                            |
|----------|--------------------------------------------------------|:--------:|---------|----------------------------------------|
| iterator | (child: Cell, index: number, children: Cell[]) => void |    ✓     |         | Iterator function.                     |
| context  | any                                                    |          |         | Execution context of iterator function. |

#### filterChild(...)

```ts
filterChild(iterator: (child: Cell, index: number, children: Cell[]) => boolean, context?: any): Cell[]
```

Filter child nodes.

| Name     | Type                                                      | Required | Default | Description                            |
|----------|-----------------------------------------------------------|:--------:|---------|----------------------------------------|
| iterator | (child: Cell, index: number, children: Cell[]) => boolean |    ✓     |         | Filter function.                       |
| context  | any                                                       |          |         | Execution context of filter function.   |

#### getChildCount()

```ts
getChildCount(): number
```

Get the number of child nodes/edges.

#### getChildIndex(...)

```ts
getChildIndex(child: Cell): number
```

Get the index of a child node/edge.

| Name  | Type | Required | Default | Description |
|-------|------|:--------:|---------|-------------|
| child | Cell |    ✓     |         |             |

#### getChildAt(...)

```ts
getChildAt(index: number): Cell | null
```

Get the child node/edge at the specified index.

| Name  | Type   | Required | Default | Description |
|-------|--------|:--------:|---------|-------------|
| index | number |    ✓     |         | Index position. |

#### getAncestors(...)

```ts
getAncestors(options?: { deep?: boolean }): Cell[]
```

Get all ancestor nodes.

| Name         | Type    | Required | Default | Description                                                                                   |
|--------------|---------|:--------:|---------|-----------------------------------------------------------------------------------------------|
| options.deep | boolean |          | `true`  | By default, recursively gets all ancestor nodes. Set to `false` to only return the parent node. |

#### getDescendants(...)

```ts
getDescendants(options?: Cell.GetDescendantsOptions): Cell[]
```

Get all descendant nodes.

| Name                 | Type    | Required | Default | Description                                                                                     |
|----------------------|---------|:--------:|---------|-------------------------------------------------------------------------------------------------|
| options.deep         | boolean |          | `true`  | By default, recursively gets all descendant nodes. Set to `false` to only return child nodes/edges. |
| options.breadthFirst | boolean |          | `false` | By default, uses depth-first algorithm. Set to `true` to use breadth-first search algorithm.     |

Returns an array of descendant nodes/edges.

#### isDescendantOf(...)

```ts
isDescendantOf(ancestor: Cell | null, options?: { deep?: boolean }): boolean
```

Returns whether the current node/edge is a descendant of the specified node.

| Name         | Type         | Required | Default | Description                                                                                                |
|--------------|--------------|:--------:|---------|------------------------------------------------------------------------------------------------------------|
| ancestor     | Cell \| null |    ✓     |         | Specified node.                                                                                             |
| options.deep | boolean      |          | `true`  | By default, recursively checks all descendants of the specified node. Set to `false` to only check children. |

#### isAncestorOf(...)

```ts
isAncestorOf(descendant: Cell | null, options?: { deep?: boolean }): boolean
```

Returns whether the current node is an ancestor of the specified node/edge.

| Name         | Type         | Required | Default | Description                                                                                                |
|--------------|--------------|:--------:|---------|------------------------------------------------------------------------------------------------------------|
| descendant   | Cell \| null |    ✓     |         | Specified node/edge.                                                                                        |
| options.deep | boolean      |          | `true`  | By default, recursively checks all descendants of the specified node. Set to `false` to only check children. |

#### getCommonAncestor(...)

```ts
getCommonAncestor(...cells: (Cell | null | undefined)[]): Cell | null
```

Get the common ancestor nodes of the given nodes/edges.

| Name     | Type                          | Required | Default | Description         |
|----------|-------------------------------|:--------:|---------|---------------------|
| ...cells | (Cell \| null \| undefined)[] |    ✓     |         | Specified nodes/edges. |

#### addChild(...)

```ts
addChild(child: Cell, options?: Cell.SetOptions): this
```

Adds the specified node/edge to the end of the current node's children.

| Name             | Type    | Required | Default | Description                                                                |
|------------------|---------|:--------:|---------|----------------------------------------------------------------------------|
| child            | Cell    |    ✓     |         | The specified node/edge.                                                   |
| options.silent   | boolean |          | `false` | When `true`, does not trigger the `change:children` event and canvas redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.          |

#### removeChild(...)

```ts
removeChild(child: Cell, options?: Cell.RemoveOptions): Cell | null
```

Removes the specified child node/edge.

| Name             | Type    | Required | Default | Description                                                                                                |
|------------------|---------|:--------:|---------|-----------------------------------------------------------------------------------------------------------|
| child            | Cell    |    ✓     |         | The specified node/edge.                                                                                   |
| options.deep     | boolean |          | `true`  | By default, recursively removes all child nodes/edges. Set to `false` to only remove the current node/edge. |
| options.silent   | boolean |          | `false` | When `true`, does not trigger the `change:children` event and canvas redraw.                                 |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.                                          |

#### remove(...)

```ts
remove(options?: Cell.RemoveOptions): this
```

First removes the current node/edge from its parent node, then removes it from the canvas.

### Node and Edge Properties

The basic options introduced above such as `markup`, `attrs`, `zIndex`, `data`, as well as node options like `size`, `position`, `angle`, `ports`, and edge options like `source`, `target`, `labels`, along with any additional key-value pairs provided when creating nodes/edges, are all called properties.

```ts
const rect = new Shape.Rect({
  x: 30,
  y: 30,
  width: 100,
  height: 40,
  attrs: {...},
  data: {...},
  zIndex: 10,
  sale: {...},
  product: {
    id: '1234',
    name: 'apple',
    price: 3.99,
  },
})
```

For example, in the code above, `attrs`, `data`, `zIndex` are standard properties, while `x` and `y` are a pair of [custom options](#custom-options) that are converted to the `position` property during node initialization. Similarly, `width` and `height` are another pair of [custom options](#custom-options) converted to the `size` property during node initialization. The remaining `sale` and `product` objects are non-standard properties.

We've introduced some standard properties and methods to operate (get/set) these standard properties above. Now let's introduce a few more general methods that apply to both standard and non-standard properties.

#### getProp(...)

Gets the value of the specified property.

```ts
getProp<T>(key: string, defaultValue?: T): T
```

| Name         | Type   | Required | Default | Description                                                      |
|--------------|--------|:--------:|---------|------------------------------------------------------------------|
| key          | string |    ✓     |         | Property name.                                                   |
| defaultValue | T      |          | -       | Default value, returned when the specified property doesn't exist. |

```ts
// Get standard properties
const zIndex = rect.getProp<number>('zIndex')
const position = rect.getProp<{ x: number; y: number }>('position')

// Get non-standard properties
const product = rect.getProp('product')
```

#### setProp(...)

Sets the specified property. By default, it triggers the corresponding `change:xxx` event and canvas redraw. When `options.silent` is `true`, it doesn't trigger.

```ts
// Set a specific property
setProp(key: string, value: any, options?: Cell.SetOptions): this
// Batch set properties, deeply merging the provided properties with the original properties. Note that using this method will trigger propHooks calls
setProp(props: Partial<Properties>, options?: Cell.SetOptions): this
```

| Name             | Type                  | Required | Default | Description                                                                                                   |
|------------------|-----------------------|:--------:|---------|---------------------------------------------------------------------------------------------------------------|
| key              | string                |    ✓     |         | Property name.                                                                                                |
| value            | any                   |    ✓     |         | Property value.                                                                                               |
| props            | `Partial<Properties>` |    ✓     |         | Property key-value pairs, which will be [deeply merged](https://lodash.com/docs/4.17.15#merge) with existing properties. |
| options.silent   | boolean               |          | `false` | When `true`, does not trigger the `change:markup` event and canvas redraw.                                     |
| options...others | object                |          |         | Other custom key-value pairs that can be used in event callbacks.                                             |

```ts
// Set a single property:
rect.setProp('size', { width: 100, height: 30 })
rect.setProp('zIndex', 10)

// Set multiple properties simultaneously
rect.setProp({
  size: {
    width: 100,
    height: 30,
  },
  zIndex: 10,
})
```

#### removeProp(...)

Removes the property at the specified path. By default, it triggers the corresponding `change:xxx` event and canvas redraw. When `options.silent` is `true`, it doesn't trigger.

```ts
removeProp(path: string | string[], options?: Cell.SetOptions): this
```

| Name             | Type               | Required | Default | Description                                                                |
|------------------|--------------------|:--------:|---------|----------------------------------------------------------------------------|
| path             | string \| string[] |    ✓     |         | Property path.                                                             |
| options.silent   | boolean            |          | `false` | When `true`, does not trigger the `change:markup` event and canvas redraw. |
| options...others | object             |          |         | Other custom key-value pairs that can be used in event callbacks.          |

```ts
rect.removeProp('zIndex')
rect.removeProp('product/id')
```

#### prop(...)

This method integrates the above methods and provides four function signatures, making it a very practical method.

```ts
prop(): Properties // Get all properties.
prop<T>(path: string | string[]): T // Get the property value at the specified path.
prop(path: string | string[], value: any, options?: Cell.SetOptions): this // Set the property value at the specified path, deeply merging with existing properties on the path.
prop(props: Partial<Properties>, options?: Cell.SetOptions): this // Set properties, deeply merging with existing properties.
```

```ts
// Get properties:
rect.prop()
rect.prop('zIndex')
rect.prop('product/price')

// Set properties:
rect.prop('zIndex', 10)
rect.prop('product/price', 5.99)
rect.prop({
  product: {
    id: '234',
    name: 'banana',
    price: 3.99,
  },
})
```

#### hasChanged(...)

```ts
hasChanged(key: string | undefined | null): boolean
```

Returns whether the specified property or all properties have changed.

| Name | Type                        | Required | Default | Description                                                    |
|------|-----------------------------|:--------:|---------|----------------------------------------------------------------|
| key  | string \| undefined \| null |          |         | Property name. When omitted, it checks all properties. |

#### previous(...)

```ts
previous<T>(name: string): T | undefined
```

After a specified property has changed, get the property value before the change.

| Name | Type   | Required | Default | Description    |
|------|--------|:--------:|---------|----------------|
| key  | string |    ✓     |         | Property name. |

### Tools

#### addTools(...)

```ts
addTools(
  items: Cell.ToolItem | Cell.ToolItem[],
  options?: Cell.AddToolOptions,
): this
addTools(
  items: Cell.ToolItem | Cell.ToolItem[],
  name: string,
  options?: Cell.AddToolOptions,
): this
```

Add tools.

| Name             | Type                             | Required | Default | Description                                                                                                                                                                                |
|------------------|----------------------------------|:--------:|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| items            | Cell.ToolItem \| Cell.ToolItem[] |          |         | Tools defined in [NodeTool](/en/api/registry/node-tool#presets) or [EdgeTool](/en/api/registry/edge-tool#presets).                                                               |
| name             | string                           |          | `null`  | Define an alias for this group of tools, which can be used as a parameter for `hasTools(name)`                                                                                             |
| options.reset    | boolean                          |          | `false` | Whether to clear the tool set. By default, tools are appended to the tool set.                                                                                                             |
| options.local    | boolean                          |          | `false` | Whether the tool is rendered in the node/edge container. By default, it's `false`, and all tools are rendered under `x6-graph-svg-decorator`. Only takes effect when `options.reset` is `true` |
| options.silent   | boolean                          |          | `false` | When `true`, does not trigger the `change:tools` event and tool redraw.                                                                                                                    |
| options...others | object                           |          |         | Other custom key-value pairs that can be used in event callbacks.                                                                                                                          |

#### getTools()

```ts
getTools(): Cell.Tools | null
```

Get the tool set.

#### removeTools(...)

```ts
removeTools(options?: Cell.SetOptions): this
```

Remove all tools.

| Name             | Type    | Required | Default | Description                                                             |
|------------------|---------|:--------:|---------|-------------------------------------------------------------------------|
| options.silent   | boolean |          | `false` | When `true`, does not trigger the `change:tools` event and tool redraw. |
| options...others | object  |          |         | Other custom key-value pairs that can be used in event callbacks.       |

#### hasTool(...)

```ts
hasTool(name: string): boolean
```

Check if a tool with the specified name exists.

#### removeTool(...)

```ts
removeTool(name: string, options?: Cell.SetOptions): this
removeTool(index: number, options?: Cell.SetOptions): this
```

Removes a tool with the specified name.

| Name             | Type             | Required | Default | Description                                                                      |
|------------------|------------------|:--------:|---------|----------------------------------------------------------------------------------|
| nameOrIndex      | string \| number |    ✓     |         | The name or index of the tool.                                                   |
| options.silent   | boolean          |          | `false` | If `true`, doesn't trigger the `change:tools` event and tool redraw.             |
| options...others | object           |          |         | Other custom key-value pairs that can be used in event callbacks.                |

### Animation Transition

#### transition(...)

```ts
transition(
  path: string | string[],
  target: Animation.TargetValue,
  options: Animation.StartOptions = {},
  delim: string = '/',
): () => void
```

Smoothly transitions the property value at the specified `path` to the target value specified by `target`, and returns a `stop` method. When called, this method immediately stops the animation.

| Name                | Type                                         | Required | Default | Description                                                    |
|---------------------|----------------------------------------------|:--------:|---------|----------------------------------------------------------------|
| path                | string \| string[]                           |    ✓     |         | Path.                                                          |
| target              | any                                          |    ✓     |         | Target property value.                                         |
| options.delay       | number                                       |          | `10`    | Delay before the animation starts, in milliseconds.            |
| options.duration    | number                                       |          | `100`   | Animation duration, in milliseconds.                           |
| options.timing      | Timing.Names \| (t: number) => number        |          |         | Timing function.                                               |
| options.interp      | \<T\>(from: T, to: T) => (time: number) => T |          |         | Interpolation function.                                        |
| options.start       | (args: Animation.CallbackArgs) => void       |          |         | Callback function when the animation starts.                   |
| options.progress    | (args: Animation.ProgressArgs) => void       |          |         | Callback function during the animation execution.              |
| options.complete    | (args: Animation.CallbackArgs) => void       |          |         | Callback function when the animation completes.                |
| options.stop        | (args: Animation.CallbackArgs) => void       |          |         | Callback function when the animation is stopped.               |
| options.finish      | (args: Animation.CallbackArgs) => void       |          |         | Callback function when the animation completes or is stopped.  |
| options.jumpedToEnd | boolean                                      |          | `false` | Whether to immediately complete the animation when stopped manually. |
| delim               | string                                       |          | `/`     | String path delimiter.                                         |

We provide some timing functions in the `Timing` namespace. You can use built-in timing function names or provide a function with the signature `(t: number) => number`. The built-in timing functions are as follows:

- linear
- quad
- cubic
- inout
- exponential
- bounce
- easeInSine
- easeOutSine
- easeInOutSine
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- easeInExpo
- easeOutExpo
- easeInOutExpo
- easeInCirc
- easeOutCirc
- easeInOutCirc
- easeInBack
- easeOutBack
- easeInOutBack
- easeInElastic
- easeOutElastic
- easeInOutElastic
- easeInBounce
- easeOutBounce
- easeInOutBounce

We have built-in some interpolation functions in the `Interp` namespace. Usually, we can automatically determine which interpolation function to use based on the property value on the path. The built-in interpolation functions are as follows:

- number - Number interpolation function.
- object - `{ [key: string]: number }` object interpolation function.
- unit - Number + unit string interpolation function, such as `10px`. Supported units are: `px, em, cm, mm, in, pt, pc, %`.
- color - Hexadecimal color interpolation function.

```ts
import { Timing, Interp } from '@antv/x6'

rect.transition('attrs/label/font-size', '1em', {
  interp: Interp.unit,
  timing: 'bounce', // Timing.bounce
})
```

#### stopTransition(...)

```ts
stopTransition(
  path: string | string[],
  options?: Animation.StopOptions<T>,
  delim: string = '/',
): this
```

Stops the animation corresponding to the specified `path`.

| Name                | Type                                   | Required | Default | Description                                                    |
|---------------------|----------------------------------------|:--------:|---------|----------------------------------------------------------------|
| path                | string \| string[]                     |    ✓     |         | Path.                                                          |
| options.jumpedToEnd | boolean                                |          | `false` | Whether to immediately complete the animation when stopped manually. |
| options.complete    | (args: Animation.CallbackArgs) => void |          |         | Callback function when the animation completes.                |
| options.stop        | (args: Animation.CallbackArgs) => void |          |         | Callback function when the animation is stopped.               |
| options.finish      | (args: Animation.CallbackArgs) => void |          |         | Callback function when the animation completes or is stopped.  |
| delim               | string                                 |          | `/`     | String path delimiter.                                         |

```ts
rect.stopTransition('attrs/label/font-size')
```

#### getTransitions()

```ts
getTransitions(): string[]
```

Gets all active animations and returns the paths of active animations.

```ts
// Stop all animations
rect.getTransitions().forEach((path) => rect.stopTransition(path))
```

## config(...)

```ts
config<C extends Cell.Config = Cell.Config>(presets: C): void
```

Sets the default values for node/edge options.

| Name              | Type                   | Required | Default | Description                                                                                           |
|-------------------|------------------------|:--------:|---------|-------------------------------------------------------------------------------------------------------|
| options.propHooks | Cell.PropHooks\<M, C\> |          |         | Custom options.                                                                                       |
| options.attrHooks | Attr.Definitions       |          |         | Custom attribute key-value pairs. Key is the name of the custom attribute, Value is the custom attribute object (including methods for attribute checking, applying attributes, etc.). |
| options...others  | object                 |          |         | Other options, properties of nodes/edges.                                                             |

### Default Option Values

This method is very friendly for custom nodes/edges, making it convenient for us to set some preset options for our nodes/edges. For example, when defining a rectangle node, we specified the default Markup, default size, and default style for it.

```ts
Shape.Rect.config({
  width: 80,
  height: 40,
  markup: ...,
  attrs: ...,
})
```

Our code for creating rectangles can be very simple:

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

Each call to `config(presets)` performs a [deep merge](https://www.lodashjs.com/docs/latest#_mergeobject-sources) with the current preset values. For example, the following code modifies the default border color of the rectangle to red and the default text color to blue, respectively. The final effect is the combination of both:

```ts
// Only modify the default border color
Shape.Rect.config({
  attrs: {
    body: {
      stroke: 'red',
    },
  },
})

// Only modify the default text color
Shape.Rect.config({
  attrs: {
    label: {
      fill: 'blue',
      // Override the 'red' defined above
      stroke: '#000',
    },
  },
})
```

### Custom Options

When creating a rectangle, we can use `label` to set the label text of the rectangle:

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  label: 'rect',
})
```

We didn't define the `label` option for the rectangle, so how is this `label` applied to `attrs/label/text`? This is where the `propHooks` hook comes in. We can define `propHooks` hooks to consume these non-standard options.

Let's look at the implementation details of the `label` option hook:

```ts
Shape.Rect.config({
  // Apply 'label' to the 'attrs/text/text' property through the hook
  propHooks(metadata) {
    const { label, ...others } = metadata
    if (label) {
      ObjectExt.setByPath(others, 'attrs/text/text', label)
    }
    return others
  },
})
```

Through the `propHooks` hook, we can easily extend some custom options. For example, we can define certain styles as options for the node, which not only reduces nesting but also makes the code for creating nodes more semantic.

Look at the following code, which defines custom `rx` and `ry` options for rectangles:

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

This way, we can easily add rounded rectangles:

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  rx: 5,
  ry: 10,
  label: 'rect',
})
```

### Custom Attributes

Custom attributes refer to non-standard SVG/HTML attributes, such as built-in system attributes like `refWidth`, `refHeight`, `sourceMarker`, `targetMarker`, etc. These attributes are globally shared, and we can use the `attrHooks` hook to define **exclusive** custom attributes for nodes/edges.

For example:

```ts
import { Shape, Color } from '@antv/x6'

Shape.Rect.config({
  attrHooks: {
    fill: {
      set(val) {
        return Color.invert(val) // Automatically invert the fill color
      },
    },
    theme: {
      set(val) {
        // Set both fill color and border color simultaneously
        return {
          fill: val,
          stroke: Color.invert(val),
        }
      },
    },
  },
})
```

We can use the `fill` and `theme` attributes defined above like this:

```ts
const rect = graph.addNode({
  x: 100,
  y: 100,
  rx: 5,
  ry: 10,
  label: 'rect',
  attrs: {
    body: {
      theme: '#f5f5f5',
    },
    label: {
      fill: '#fff',
    },
  },
})
```
