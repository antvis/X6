---
title: Graph
order: 0
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/graph
---

## Configuration

```ts
new Graph(options: Options)
```

| Option | Type | Required | Description | Default Value |
| --- | --- | :-: | --- | --- |
| container | `HTMLElement` | ✓ | The container of the canvas. |  |
| width | `number` |  | The width of the canvas, defaults to the container width. | - |
| height | `number` |  | The height of the canvas, defaults to the container height. | - |
| scaling | `{ min?: number, max?: number }` |  | The minimum and maximum zoom levels of the canvas. | `{ min: 0.01, max: 16 }` |
| [autoResize](/tutorial/basic/graph#canvas-size) | `boolean \| Element \| Document` |  | Whether to listen to container size changes and automatically update the canvas size. | `false` |
| [panning](/api/graph/panning) | `boolean \| PanningManager.Options` |  | Whether the canvas can be panned, defaults to disabled. | `false` |
| [mousewheel](/api/graph/mousewheel) | `boolean \| MouseWheel.Options` |  | Whether the mouse wheel can zoom, defaults to disabled. | `false` |
| [grid](/api/graph/grid) | `boolean \| number \| GridManager.Options` |  | The grid, defaults to a 10px grid but does not draw the grid background. | `false` |
| [background](/api/graph/background) | `false \| BackgroundManager.Options` |  | The background, defaults to not drawing the background. | `false` |
| [translating](/api/interacting/interaction#moving-range) | `Translating.Options` |  | Restricts node movement. | `{ restrict: false }` |
| [embedding](/api/interacting/interaction#embedding) | `boolean \| Embedding.Options` |  | Whether to enable nested nodes, defaults to disabled. | `false` |
| [connecting](/api/interacting/interaction#connecting) | `Connecting.Options` |  | The connection options. | `{ snap: false, ... }` |
| [highlighting](/api/interacting/interaction#highlighting) | `Highlighting.Options` |  | The highlighting options. | `{...}` |
| [interacting](/api/interacting/interaction#restrictions) | `Interacting.Options` |  | Customizes the interaction behavior of nodes and edges. | `{ edgeLabelMovable: false }` |
| [magnetThreshold](/api/graph/view#magnetthreshold) | `number \| onleave` |  | The number of times the mouse can move before triggering a connection, or set to `onleave` to trigger a connection when the mouse leaves an element. | `0` |
| [moveThreshold](/api/graph/view#movethreshold) | `number` |  | The number of times the mouse can move before triggering a `mousemove` event. | `0` |
| [clickThreshold](/api/graph/view#clickthreshold) | `number` |  | When the mouse moves more than the specified number of times, the mouse click event will not be triggered. | `0` |
| [preventDefaultContextMenu](/api/graph/view#preventdefaultcontextmenu) | `boolean` |  | Whether to disable the browser's default right-click menu. | `true` |
| [preventDefaultBlankAction](/api/graph/view#preventdefaultblankaction) | `boolean` |  | Whether to disable the default mouse behavior when clicking on a blank area of the canvas. | `true` |
| [async](/api/graph/view#async) | `boolean` |  | Whether to render asynchronously. | `true` |
| [virtual](/api/graph/view#virtual) | `boolean` |  | Whether to only render the visible area of the canvas. | `false` |
| [onPortRendered](/api/graph/view#onportrendered) | `(args: OnPortRenderedArgs) => void` |  | The callback triggered when a port is rendered. | - |
| [onEdgeLabelRendered](/api/graph/view#onedgelabelrendered) | `(args: OnEdgeLabelRenderedArgs) => void` |  | The callback triggered when an edge label is rendered. | - |
| [createCellView](/api/graph/view#createcellview) | `(cell: Cell) => CellView \| null \| undefined` |  | Customizes the view of a cell. | - |
