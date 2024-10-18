---
title: Highlighter
order: 14
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

Node/edge highlighters used to highlight specified elements. X6 includes the following types of highlighters.

| Name      | Description                                               |
|-----------|----------------------------------------------------------|
| stroke    | [Stroke Highlighter](#stroke), renders a highlighted border around the bounding box of the element. |
| className | [Class Name Highlighter](#classname), highlights elements by adding additional class names. |

When creating a Graph, you can specify the highlighting style triggered by certain interactions through the `highlighting` option, such as:

```ts
new Graph({
  highlighting: {
    // When a magnet is available for linking, render a 2px wide red rectangle around the magnet
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          'stroke-width': 2,
          stroke: 'red',
        },
      },
    },
  },
})
```

Supported `highlighting` configuration options include:

- `'default'` Default highlighting option, used when the following highlighting configurations are not specified.
- `'embedding'` Used when dragging a node for embedding and the node can be embedded.
- `'nodeAvailable'` Used during the linking process when a node can be linked.
- `'magnetAvailable'` Used during the linking process when a magnet can be linked.
- `'magnetAdsorbed'` Used during the linking process when automatically snapping to a magnet.
## Built-in Highlighters

### Stroke

The border highlighter renders a highlighted border along the bounding box of the element.

| Parameter Name | Type    | Default Value                               | Description      |
|----------------|---------|---------------------------------------------|------------------|
| rx             | number  | `0`                                         | Border radius.   |
| ry             | number  | `0`                                         | Border radius.   |
| padding        | number  | `3`                                         | Padding.         |
| attrs          | object  | `{ 'stroke-width': 3, stroke: '#FEB663' }` | Border element attributes. |

### ClassName

The style name highlighter highlights elements by adding an additional style name.

| Parameter Name | Type    | Default Value       | Description  |
|----------------|---------|---------------------|--------------|
| className      | string  | `x6-highlighted`    | Style name.  |

## Custom Highlighters

A highlighter is an object with the following signature, containing two methods: `highlight` and `unhighlight`, which are used to highlight and unhighlight elements, respectively.

```ts
export interface Definition<T> {
  highlight: (cellView: CellView, magnet: Element, options: T) => void
  unhighlight: (cellView: CellView, magnet: Element, options: T) => void
}
```

| Parameter Name | Type     | Default Value | Description          |
|----------------|----------|---------------|-----------------------|
| cellView       | CellView |               | View.                 |
| magnet         | Element  |               | The highlighted element. |
| options        | T        |               | Highlight options.     |


Now, let's define a highlighter named `opacity`, which adds a `'highlight-opacity'` style name to the element.

```ts
export interface OpacityHighlighterOptions {}

const className = 'highlight-opacity'

export const opacity: Highlighter.Definition<OpacityHighlighterOptions> = {
  highlight(cellView, magnet) {
    Dom.addClass(magnet, className)
  },

  unhighlight(cellView, magnetEl) {
    Dom.removeClass(magnetEl, className)
  },
}
```

After defining it, we can register our highlighter:

```ts
Graph.registerHighlighter('opacity', opacity, true)
```

Then we can use this highlighter with the string `opacity`:

```ts
new Graph({
  highlighting: {
    magnetAvailable: {
      name: 'opacity',
    },
  },
})
```
