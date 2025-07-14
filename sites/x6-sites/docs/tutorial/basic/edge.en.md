---
title: Edges
order: 2
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic/basic
---

:::info{title="In this chapter, we mainly introduce knowledge related to edges. By reading, you can learn about"}

- Methods to add edges
- How to configure the shape of edges
- How to add arrows to edges
- How to customize edges
- How to modify edges through the API

:::

## Adding Edges

Both nodes and edges share a common base class [Cell](/api/model/cell). In addition to inheriting properties from `Cell`, edges support the following options.

| Property Name  | Type               | Default Value                                   | Description          |
|----------------|--------------------|------------------------------------------------|----------------------|
| source         | TerminalData       | -                                              | Source node or starting point. |
| target         | TerminalData       | -                                              | Target node or endpoint. |
| vertices       | Point.PointLike[]  | -                                              | Path points.         |
| router         | RouterData         | -                                              | Router.              |
| connector      | ConnectorData      | -                                              | Connector.           |
| labels         | Label[]            | -                                              | Labels.              |
| defaultLabel   | Label              | [Default Label](/api/model/labels#default-label) | Default label.       |

```ts
graph.addEdge({
  shape: 'edge',
  source: 'node1',
  target: 'node2',
})
```

## Configuring Edges

Let's take a look at how to use the configurations mentioned above.

### source/target

The source and target nodes (points) of the edge.

```ts
graph.addEdge({
  source: rect1, // Source node
  target: rect2, // Target node
})

graph.addEdge({
  source: 'rect1', // Source node ID
  target: 'rect2', // Target node ID
})

graph.addEdge({
  source: { cell: rect1, port: 'out-port-1' }, // Source node and connection port ID
  target: { cell: 'rect2', port: 'in-port-1' }, // Target node ID and connection port ID
})

graph.addEdge({
  source: 'rect1', // Source node ID
  target: { x: 100, y: 120 }, // Target point
})
```

### vertices

Path points. The edge starts from the starting point, passes through the path points in order, and finally reaches the endpoint.

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
})
```

<code id="edge-vertices" src="@/src/tutorial/basic/edge/vertices/index.tsx"></code>

### router

The `router` will further process the `vertices`, adding additional points if necessary, and then return the processed points. For example, after processing with [orth routing](/api/registry/router#orth), each link segment of the edge will be horizontal or vertical.

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  // If there are no args parameters, it can be simplified to router: 'orth'
  router: {
    name: 'orth',
    args: {},
  },
})
```

<code id="edge-router" src="@/src/tutorial/basic/edge/router/index.tsx"></code>

X6 provides the following routing options by default. Click the links below to see how each routing option is used.

- [normal](/api/registry/router#normal)
- [orth](/api/registry/router#orth)
- [oneSide](/api/registry/router#oneside)
- [manhattan](/api/registry/router#manhattan)
- [metro](/api/registry/router#metro)
- [er](/api/registry/router#er)

Additionally, we can register custom routers. For more details, please refer to the [Custom Router](/api/registry/router#registry) tutorial.

### connector

The `connector` processes the points returned by the `router` into the [pathData](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) needed for rendering the edge. For example, the `rounded` connector will round the corners between the lines.

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: 'orth',
  // If there are no args parameters, it can be simplified to connector: 'rounded'
  connector: {
    name: 'rounded',
    args: {},
  },
})
```

<code id="edge-connector" src="@/src/tutorial/basic/edge/connector/index.tsx"></code>

X6 provides the following connector options by default. Click the links below to see how each connector is used.

- [normal](/api/registry/connector#normal)
- [rounded](/api/registry/connector#rounded)
- [smooth](/api/registry/connector#smooth)
- [jumpover](/api/registry/connector#jumpover)

Additionally, we can register custom connectors. For more details, please refer to the [Custom Connector](/api/registry/connector#register) tutorial.

### labels

Used to set label text, position, style, etc. Supports multiple labels in array form, and each item specified in `labels` will be used after being [merged](https://www.lodashjs.com/docs/latest#_mergeobject-sources) with the [defaultLabel](/api/model/labels#default-label).

```ts
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: [
    {
      attrs: {
        label: {
          text: 'edge',
        },
      },
    },
  ],
})
// Or
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  labels: ['edge'], // Multiple labels can be set through labels, and when only setting label text, this syntax can be simplified
})
// Or
const edge = graph.addEdge({
  source: rect1,
  target: rect2,
  label: 'edge', // A single label can be set through label, and when only setting label text, this syntax can be simplified
})
```

<code id="edge-labels" src="@/src/tutorial/basic/edge/labels/index.tsx"></code>

In addition to setting text, you can also create complex shapes on the edge using Label, which we will detail in the [API](/api/model/labels).

### defaultLabel

Default label. The default label can simplify the label configuration items, and each item specified in `labels` will be used after being merged with `defaultLabel`.

## Using Arrows

We define two special properties, `sourceMarker` and `targetMarker`, to customize the starting and ending arrows of the edge. For example, for `Shape.Edge`, we can specify the starting and ending arrows using the `line` selector.

### Built-in Arrows

X6 provides the following built-in arrows. When using them, you only need to specify the arrow name and parameters (optional).

- [block](/api/model/marker#block)
- [classic](/api/model/marker#classic)
- [diamond](/api/model/marker#diamond)
- [cross](/api/model/marker#cross)
- [async](/api/model/marker#async)
- [path](/api/model/marker#path)
- [circle](/api/model/marker#circle)
- [circlePlus](/api/model/marker#circleplus)
- [ellipse](/api/model/marker#ellipse)

```ts
graph.addEdge({
  shape: 'edge',
  source: [100, 100],
  target: [500, 500],
  attrs: {
    line: {
      sourceMarker: 'block', // Solid arrow
      targetMarker: {
        name: 'ellipse', // Ellipse
        rx: 10, // X radius of the ellipse arrow
        ry: 6, // Y radius of the ellipse arrow
      },
    },
  },
})
```

<code id="edge-native-marker" src="@/src/tutorial/basic/edge/native-marker/index.tsx"></code>

:::info{title="Tip"}
 By default, X6 edges come with a `classic` arrow. If you want to remove it, you can set `targetMarker` to `null`.
:::

### Custom Arrows

We can also render arrows using SVG elements specified by `tagName`. For example, below we use the `<path>` element to render the arrow, which inherits the edge's fill color `fill` and border color `stroke` by default.

```ts
graph.addEdge({
  shape: 'edge',
  source: [100, 100],
  target: [500, 500],
  attrs: {
    line: {
      sourceMarker: {
        tagName: 'path',
        d: 'M 20 -10 0 0 20 10 Z',
      },
      targetMarker: {
        tagName: 'path',
        fill: 'yellow', // Use custom fill color
        stroke: 'green', // Use custom border color
        strokeWidth: 2,
        d: 'M 20 -10 0 0 20 10 Z',
      },
    },
  },
})
```

:::info{title="Tip"}
Our starting and ending arrows use the same `d` attribute because we automatically calculate the arrow direction. In simple terms, when defining the arrow, we only need to define an arrow that points **towards the origin**.
:::

<code id="edge-custom-marker" src="@/src/tutorial/basic/edge/custom-marker/index.tsx"></code>

For more examples and customization tips for arrows, please refer to the [API](/api/model/marker).

## Customizing Edges

Like nodes, we can customize the shape and style of edges using `markup` and `attrs`, and we can also register custom edges for reuse. The default edge `Shape.Edge` in X6 defines two selectors: `line` (representing the path element) and `wrap` (representing a transparent path element for interaction). We can define the style of the edge as shown below.

<code id="edge-registry" src="@/src/tutorial/basic/edge/registry/index.tsx"></code>

## Modifying Edges

Similar to nodes, after rendering is complete, we can modify all properties of edges through the API. We commonly use the following two methods:

- edge.prop(path, value), for detailed usage see [prop](/api/model/cell#node-and-edge-properties-properties).
- edge.attr(path, value), for detailed usage see [attr](/api/model/cell#element-attributes-attrs).

Let's take a look at the `prop` of the default edge provided by X6.

```ts
const edge = graph.addEdge({
  source: [200, 140],
  target: [500, 140],
  label: 'edge',
})
console.log(edge.prop())

// Output
{
  "shape": "edge",
  "attrs": {
    "lines": {
      "connection": true,
      "strokeLinejoin": "round"
    },
    "wrap": {
      "strokeWidth": 10
    },
    "line": {
      "stroke": "#333",
      "strokeWidth": 2,
      "targetMarker": "classic"
    }
  },
  "id": "9d5e4f54-1ed3-429e-8d8c-a1526cff2cd8",
  "source": {
    "x": 200,
    "y": 140
  },
  "target": {
    "x": 500,
    "y": 140
  },
  "labels": [{
    "attrs": {
      "label": {
        "text": "edge"
      }
    }
  }],
  "zIndex": 1
}
```

From the output above, we can see that `prop` is a new configuration after processing, and its values can be updated through methods. After updating, the edge will immediately refresh to the latest state. To modify the edge's `attrs` more conveniently, X6 provides the `attr` method.

```ts
edge.prop('target', { x: 300, y: 300 }) // Modify the endpoint
edge.attr('line/stroke', '#ccc') // Modify the edge color, equivalent to edge.prop('attrs/line/stroke', '#ccc')
```

<code id="edge-prop" src="@/src/tutorial/basic/edge/prop/index.tsx"></code>
