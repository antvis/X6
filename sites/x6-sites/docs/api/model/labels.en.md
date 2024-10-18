---
title: Labels
order: 3
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/model
---

The label configuration for edges in X6 is very flexible, so we dedicate a separate section to detail how to use edge labels.

Before we begin, let's briefly understand a few methods for manipulating labels on an Edge instance.

| Method Signature                                                   | Description          |
|-------------------------------------------------------------------|---------------------|
| [edge.getLabels()](/en/docs/api/model/edge#getlabels)            | Get all labels.     |
| [edge.setLabels(...)](/en/docs/api/model/edge#setlabels)         | Set labels.         |
| [edge.insertLabel(...)](/en/docs/api/model/edge#insertlabel)     | Insert a label at a specified position. |
| [edge.appendLabel(...)](/en/docs/api/model/edge#appendlabel)     | Append a label at the end. |
| [edge.setLabelAt(...)](/en/docs/api/model/edge#setlabelat)       | Set a label at a specified position. |
| [edge.getLabelAt(...)](/en/docs/api/model/edge#getlabelat)       | Get a label at a specified position. |
| [edge.removeLabelAt(...)](/en/docs/api/model/edge#removelabelat) | Remove a label at a specified position. |

## Label Definition

A label includes label markup, label position, label style, etc. The complete definition is as follows.

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

- `markup`: Label markup.
- `attrs`: Label style.
- `position`: Label position. When its value is a `number`, it is equivalent to setting the value of `position.distance`.
  - `distance`: [Label position](#position).
  - `offset`: [Label offset](#offset).
  - `angle`: [Label rotation](#rotation).

## Default Label

When creating an Edge, you can set the default label using the [defaultLabel option](/en/docs/tutorial/basic/edge#defaultlabel), with the default value as follows:

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

This default label includes a `<text>` element (representing the label text) and a `<rect>` element (representing the label background), which is centered by default and has a white rounded background. Since all custom labels will be [merged](https://www.lodashjs.com/docs/latest#_mergeobject-sources) with this default label, we can simply provide a text attribute for a label as shown below.

```ts
edge.appendLabel({
  attrs: {
    text: {
      text: 'Hello Label',
    },
  },
})
```

<code id="append-label" src="@/src/api/label/append-label/index.tsx"></code>

## Label Position

### Position

We can specify the label's position using the `position.distance` option of the Label, with a default value of `0.5`, indicating that the label is positioned at the center of the edge's length. Depending on the value, the calculation of the label's position can be categorized into three cases.

- When it is between `[0, 1]`, it indicates that the label is positioned at a relative length (proportion) from the starting point along the length direction.
- A positive number indicates that the label is positioned at a distance from the starting point along the edge's length.
- A negative number indicates that the label is positioned at a distance from the endpoint along the length direction.

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

<code id="label-position" src="@/src/api/label/label-position/index.tsx"></code>

### Offset

We can set the label's offset using the `position.offset` option of the Label, with a default value of `0`, indicating no offset. Depending on the value, the calculation of the label's offset can be categorized into three cases.

- A positive number indicates an **absolute offset downwards perpendicular to the edge**.
- A negative number indicates an **absolute offset upwards perpendicular to the edge**.
- A coordinate object `{x: number; y: number }` indicates an **absolute offset in both `x` and `y` directions**.

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

<code id="label-offset" src="@/src/api/label/label-offset/index.tsx"></code>

### Rotation

We can set the label's rotation angle in the **clockwise direction** using the `position.angle` option of the Label, with a default value of `0`, indicating no rotation.

**Options**

- When `position.options.keepGradient` is `true`, the initial rotation angle of the label is the angle of the edge at the label's position, and subsequent `position.angle` settings are relative to that initial angle.
- When `position.options.ensureLegibility` is `true`, an additional 180° rotation will be applied to the label if necessary to ensure the label text is more readable.

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

<code id="label-rotate" src="@/src/api/label/label-rotate/index.tsx"></code>

## Label Style

We can customize the label style using the `markup` and `attrs` options, supporting customization in two dimensions.

**Method 1**: Globally override the default label definition when creating an Edge, affecting all labels.

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

<code id="label-markup" src="@/src/api/label/label-markup/index.tsx"></code>

**Method 2**: Override the default label definition when creating a single label, affecting only that label.

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

<code id="label-attrs" src="@/src/api/label/label-attrs/index.tsx"></code>

## String Labels

When setting the [default label](#default-label) using the [`updateLabels`](#default-label) option, adding labels becomes very simple, as shown in the following code.

```ts
// Specify label when creating a node
const edge = graph.addEdge({
  source,
  target,
  labels: [
    {
      attrs: { label: { text: 'edge label' } },
    },
  ],
})

// Reset labels
edge.setLabels([
  {
    attrs: { label: { text: 'edge label' } },
  },
])

// Append label
edge.appendLabel({
  attrs: { label: { text: 'edge label' } },
})
```

The above code only sets the label text, but it looks complicated as we have to provide a deeply nested object `{ attrs: { label: { text: 'edge' } } }`. To simplify this, we provide a syntax sugar that allows direct input of string labels, making the above code even simpler.

```ts
const edge = graph.addEdge({
  source,
  target,
  labels: ['edge label'],
})

edge.setLabels(['edge label'])

edge.appendLabel('edge label')
```

This syntax sugar defines a static method `parseStringLabel` on `Edge`, which converts string labels into Label objects. The default implementation is as follows.

```ts
function parseStringLabel(label: string): Label {
  return {
    attrs: { label: { text: label } },
  }
}
```

It is important to note that this syntax sugar only applies to the system's default labels. This means that if you redefine the default label's `markup` using the `defaultLabel` option, you will also need to rewrite the `parseStringLabel` method to ensure the usability of string labels.

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
        selector: 'my-label', // Here the default selector is modified.
      },
    ],
  },
})

// You also need to redefine parseStringLabel to ensure the usability of string labels.
Edge.parseStringLabel = (label: string) => {
  return {
    attrs: { 'my-label': { text: label } },
  }
}
```

## Single Label

Most edges only have at most one label, so we define a [custom option](/en/docs/tutorial/basic/cell#custom-options) `label` for `Edge` to support passing a single label.

```ts
graph.addEdge({
  source,
  target,
  label: {
    attrs: { label: { text: 'edge label' } },
  },
})
```

When only setting the label text, you can also use the string form of a single label.

```ts
graph.addEdge({
  source,
  target,
  label: 'edge label',
})
```
