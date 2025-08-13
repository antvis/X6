---
title: View
order: 7
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/mvc
---

## Configuration

### async

Whether the canvas is rendered asynchronously. Asynchronous rendering does not block the UI and significantly improves performance when adding a large number of nodes and edges. However, it's important to note that some synchronous operations may produce unexpected results, such as getting the view of a node or getting the bounding box of nodes/edges, because these synchronous operations may be triggered before the asynchronous rendering is complete.

### virtual

Whether to render only the elements in the visible area, default is `false`. If set to `true`, the initial screen load will only render elements in the current visible area. When dragging or zooming the canvas, the remaining elements will be automatically loaded based on the canvas window size. This significantly improves performance in scenarios with a large number of elements.

### magnetThreshold

The number of mouse movements required before triggering a connection, or set to 'onleave' to trigger a connection when the mouse leaves the element. Default is `0`.

### moveThreshold

The number of mouse movements allowed before triggering the 'mousemove' event, default is `0`.

### clickThreshold

When the number of mouse movements exceeds the specified number, the mouse click event will not be triggered. Default is `0`.

### preventDefaultContextMenu

Whether to disable the default right-click menu of the canvas, default is `true`.

### preventDefaultBlankAction

Whether to disable the default mouse behavior when responding to mouse events in blank areas of the canvas, default is `true`.

### onPortRendered

```ts
(
  this: Graph,
  args: {
    node: Node
    port: Port
    container: Element
    selectors?: Markup.Selectors
    labelContainer: Element
    labelSelectors?: Markup.Selectors
    contentContainer: Element
    contentSelectors?: Markup.Selectors
  },
) => void
```

Callback triggered when a port is rendered, with the following parameters:

| Name             | Type             | Required | Description                                    |
|------------------|------------------|:--------:|------------------------------------------------|
| node             | Node             |    ✓     | Node instance.                                 |
| port             | Port             |    ✓     | Port options.                                  |
| container        | Element          |    ✓     | Container element of the port.                 |
| selectors        | Markup.Selectors |          | Selector key-value pairs after port Markup rendering. |
| labelContainer   | Element          |    ✓     | Container element of the port label.           |
| labelSelectors   | Markup.Selectors |          | Selector key-value pairs after port label Markup rendering. |
| contentContainer | Element          |    ✓     | Container element of the port content.         |
| contentSelectors | Markup.Selectors |          | Selector key-value pairs after port content Markup rendering. |

For example, we can render a React-type port:

```tsx
const graph = new Graph({
  container: this.container,
  onPortRendered(args) {
    const selectors = args.contentSelectors
    const container = selectors && selectors.foContent
    if (container) {
      ReactDOM.render(
        <Tooltip title="port">
          <div className="my-port" />
        </Tooltip>,
        container,
      )
    }
  },
})
```

### onEdgeLabelRendered

```ts
type OnEdgeLabelRenderedArgs = {
  edge: Edge
  label: Edge.Label
  container: Element
  selectors: Markup.Selectors
}

(
  this: Graph,
  args: OnEdgeLabelRenderedArgs,
) => void | ((args: OnEdgeLabelRenderedArgs) => void)
```

The callback triggered when an edge label is rendered, And it can return a cleanup function, which will be executed when the label is destroyed, with the following parameters:

| Name      | Type             | Required | Description                                    |
|-----------|------------------|:--------:|------------------------------------------------|
| edge      | Edge             |    ✓     | Edge instance.                                 |
| label     | Edge.Label       |    ✓     | Text label options.                            |
| container | Element          |    ✓     | Text label container.                          |
| selectors | Markup.Selectors |    ✓     | Selector key-value pairs after text label Markup rendering. |

We can add a `<foreignObject>` element when defining the Label Markup to support HTML and React rendering capabilities.

```tsx
const graph = new Graph({
  container: this.container,
  onEdgeLabelRendered: (args) => {
    const { selectors } = args
    const content = selectors.foContent as HTMLDivElement

    if (content) {
      content.style.display = 'flex'
      content.style.alignItems = 'center'
      content.style.justifyContent = 'center'
      ReactDOM.render(<Button size="small">Antd Button</Button>, content)
    }

    //  And it can return a cleanup function, which will be executed when the label is destroyed.
    return (edgeLabelRenderedArgs: typeof args) => {
      // Remove event listeners...
    }
  },
})


// The main purpose of this code is to test the cleanup function of onEdgeLabelRendered in a specific scenario.
const edge = graph.addEdge({
  source: [170, 160],
  target: [550, 160],
  labels: [
    {
      attrs: {
        text: {
          text: "Custom Label",
        },
      },
    },
  ],
});

setTimeout(() => {
  edge.prop("labels", ["Updated Label"]);
}, 2000);
```

### createCellView

```ts
(this: Graph, cell: Cell) => CellView | null | undefined
```

Customize the view of an element. It can return a `CellView` to replace the default view. If it returns `null`, the element won't be rendered. If it returns `undefined`, the element will be rendered in the default way.

## Methods

### findView(...)

```ts
findView(ref: Cell | Element): CellView | null
```

Find the corresponding view based on the node/edge or element.

### findViewByCell(...)

```ts
findViewByCell(cellId: string | number): CellView | null
findViewByCell(cell: Cell | null): CellView | null
```

Find the corresponding view based on the node/edge ID or instance.

### findViewByElem(...)

```ts
findViewByElem(elem: string | Element | undefined | null): CellView | null
```

Find the corresponding view based on the element selector or element object.

### findViewsFromPoint(...)

```ts
findViewsFromPoint(x: number, y: number): CellView[]
findViewsFromPoint(p: Point.PointLike): CellView[]
```

Return views of nodes/edges whose bounding boxes contain the specified point.

### findViewsInArea(...)

```ts
findViewsInArea(
  x: number,
  y: number,
  width: number,
  height: number,
  options?: FindViewsInAreaOptions,
): CellView[]
findViewsInArea(
  rect: Rectangle.RectangleLike,
  options?: FindViewsInAreaOptions,
): CellView[]
```

Return views of nodes/edges whose bounding boxes intersect with the specified rectangle. When `options.strict` is `true`, the bounding box of the node/edge must completely contain the specified rectangle.

### findViews(...)

```ts
findViews(ref: Point.PointLike | Rectangle.RectangleLike): CellView[]
```

Return views of nodes/edges whose bounding boxes contain the specified point or intersect with the specified rectangle.
