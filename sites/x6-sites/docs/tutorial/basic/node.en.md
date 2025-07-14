---
title: Nodes
order: 1
redirect_from:
  - /en/docs
  - /en/docs/tutorial/basic
  - /en/docs/tutorial/basic/basic
---

:::info{title="In this chapter, we mainly introduce knowledge related to nodes. By reading, you can learn about"}

- Node rendering methods supported by X6
- Methods for adding nodes
- Built-in node types in X6
- How to customize nodes
- How to modify nodes through the API

:::

## Node Rendering Method

X6 is based on an `SVG` rendering engine, which allows for rendering nodes and edges using different SVG elements, making it particularly suitable for scenarios where node content is relatively simple. For more complex nodes, there is a special `foreignObject` element in `SVG` that can embed any XHTML elements. This element can be used to render HTML, React/Vue/Angular components at the desired location, greatly facilitating project development.

When choosing a rendering method, we recommend:

- If the node content is relatively simple and the requirements are fixed, use `SVG` nodes.
- For other scenarios, it is recommended to use the framework currently employed in the project to render nodes.

:::warning{title=Note}
The React/Vue/HTML rendering methods also have some limitations. Due to browser compatibility issues, there may occasionally be some abnormal rendering behaviors, primarily manifested as incomplete node content display or flickering of node content. This can be mitigated by avoiding the use of `position:absolute`, `position:relative`, `transform`, and `opacity` in the CSS styles of internal elements of the node.
:::

The following introduction is based on `SVG` nodes, but the usage of other rendering forms is very similar, and we will revisit this in the advanced tutorial.

## Adding Nodes

Both nodes and edges share a common base class [Cell](/api/model/cell). In addition to inheriting properties from `Cell`, they also support the following options.

| Property Name | Type   | Default Value | Description                       |
|---------------|--------|---------------|-----------------------------------|
| x             | number | 0             | Node position x coordinate, in px. |
| y             | number | 0             | Node position y coordinate, in px. |
| width         | number | 1             | Node width, in px.                |
| height        | number | 1             | Node height, in px.               |
| angle         | number | 0             | Node rotation angle.               |

```ts
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 40,
  width: 100,
  height: 40,
})
```

## Built-in Nodes

The above example uses `shape` to specify the node's graphic, with the default value of `shape` being `rect`. The correspondence between X6 built-in nodes and `shape` names is as follows:

| Constructor       | Shape Name | Description                                           |
|-------------------|------------|-----------------------------------------------------|
| Shape.Rect        | rect       | Rectangle.                                          |
| Shape.Circle      | circle     | Circle.                                            |
| Shape.Ellipse     | ellipse    | Ellipse.                                          |
| Shape.Polygon     | polygon    | Polygon.                                          |
| Shape.Polyline    | polyline   | Polyline.                                         |
| Shape.Path        | path       | Path.                                            |
| Shape.Image       | image      | Image.                                           |
| Shape.HTML        | html       | HTML node, uses `foreignObject` to render HTML fragments. |

<code id="node-shapes" src="@/src/tutorial/basic/node/shapes/index.tsx"></code>

## Customizing Nodes

We can customize the shape and style of nodes using `markup` and `attrs`, where `markup` is analogous to `HTML` and `attrs` is analogous to `CSS`. It is strongly recommended to read the documentation on [markup](/api/model/cell#markup) and [attrs](/api/model/cell#attrs) carefully.

Next, we may encounter a problem: if the customized content needs to be used by multiple nodes, do we need to redefine it for each node? The answer is no. X6 provides a convenient way to allow different nodes to reuse configurations.

<code id="node-registry" src="@/src/tutorial/basic/node/registry/index.tsx"></code>

## Modifying Nodes

After rendering is complete, we can also modify all properties of a node through the API. The two methods we commonly use are:

- node.prop(path, value), for detailed usage see [prop](/api/model/cell#node-and-edge-properties-properties).
- node.attr(path, value), for detailed usage see [attr](/api/model/cell#element-attributes-attrs).

First, let's look at `prop`. We will directly print the `prop` values of the default rect node in X6.

```ts
const node = graph.addNode({
  shape: 'rect',
  width: 100,
  height: 40,
  x: 100,
  y: 100,
  label: 'edge',
})
console.log(node.prop())

// Result
{
  "angle": 0,
  "position": {
    "x": 100,
    "y": 100
  },
  "size": {
    "width": 100,
    "height": 40
  },
  "attrs": {
    "text": {
      "fontSize": 14,
      "fill": "#000000",
      "refX": 0.5,
      "refY": 0.5,
      "textAnchor": "middle",
      "textVerticalAnchor": "middle",
      "fontFamily": "Arial, helvetica, sans-serif",
      "text": "node"
    },
    "rect": {
      "fill": "#ffffff",
      "stroke": "#333333",
      "strokeWidth": 2
    },
    "body": {
      "refWidth": "100%",
      "refHeight": "100%"
    }
  },
  "visible": true,
  "shape": "rect",
  "id": "ab47cadc-4104-457c-971f-50fbb077508a",
  "zIndex": 1
}
```

From the above result, we can see that `prop` is a new configuration after processing, and its values can be updated through methods. After updating, the node will immediately refresh to the latest state. To modify the node's `attrs` more conveniently, X6 provides the `attr` method.

```ts
source.prop('size', { width: 120, height: 50 }) // Modify x coordinate
source.attr('rect/fill', '#ccc') // Modify fill color, equivalent to source.prop('attrs/rect/fill', '#ccc')
```

<code id="node-prop" src="@/src/tutorial/basic/node/prop/index.tsx"></code>

In the above JSON output, we can see that some properties like `refWidth` and `refHeight` are not native SVG properties. They are actually special properties built into X6, such as `refWidth`, which represents relative width. For more detailed special properties, refer to [attrs](/api/model/attrs).
