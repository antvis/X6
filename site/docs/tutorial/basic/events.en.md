---
title: Events
order: 5
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title="This chapter mainly introduces knowledge related to events. By reading, you can learn about"}

- Which event categories you can listen to
- How to listen to events

:::

## View Interaction Events

Events triggered when interacting with the application through mouse, keyboard, or various interactive components.

### Mouse Events

| Event      | Cell                | Node              | Port                      | Edge              | Graph              |
|------------|---------------------|-------------------|---------------------------|-------------------|--------------------|
| Click      | `cell:click`         | `node:click`        | `node:port:click`         | `edge:click`       | `blank:click`       |
| Double Click | `cell:dblclick`    | `node:dblclick`     | `node:port:dblclick`      | `edge:dblclick`    | `blank:dblclick`    |
| Right Click | `cell:contextmenu`  | `node:contextmenu`  | `node:port:contextmenu`   | `edge:contextmenu` | `blank:contextmenu` |
| Mouse Down | `cell:mousedown`     | `node:mousedown`     | `node:port:mousedown`     | `edge:mousedown`    | `blank:mousedown`    |
| Mouse Move | `cell:mousemove`     | `node:mousemove`     | `node:port:mousemove`     | `edge:mousemove`    | `blank:mousemove`    |
| Mouse Up   | `cell:mouseup`       | `node:mouseup`       | `node:port:mouseup`       | `edge:mouseup`      | `blank:mouseup`      |
| Mouse Wheel| `cell:mousewheel`    | `node:mousewheel`    | -                          | `edge:mousewheel`   | `blank:mousewheel`   |
| Mouse Enter| `cell:mouseenter`     | `node:mouseenter`    | `node:port:mouseenter`    | `edge:mouseenter`   | `graph:mouseenter`   |
| Mouse Leave| `cell:mouseleave`     | `node:mouseleave`    | `node:port:mouseleave`    | `edge:mouseleave`   | `graph:mouseleave`   |

:::warning{title=Note}
It is important to note that the `mousemove` event here differs from the usual mouse move event; it requires the mouse to be moved after being pressed down to trigger.
:::

Except for `mouseenter` and `mouseleave`, the parameters of the event callback functions include the mouse position relative to the canvas `x`, `y`, and the mouse event object `e`, among other parameters.

```ts
graph.on('cell:click', ({ e, x, y, cell, view }) => {})
graph.on('node:click', ({ e, x, y, node, view }) => {})
graph.on('edge:click', ({ e, x, y, edge, view }) => {})
graph.on('blank:click', ({ e, x, y }) => {})

graph.on('cell:mouseenter', ({ e, cell, view }) => {})
graph.on('node:mouseenter', ({ e, node, view }) => {})
graph.on('edge:mouseenter', ({ e, edge, view }) => {})
graph.on('graph:mouseenter', ({ e }) => {})
```

### Custom Click Events

We can add custom attributes `event` or `data-event` to the DOM elements of nodes/edges to listen for click events on that element, for example:

```ts
node.attr({
  // Represents a delete button, which deletes the node when clicked
  image: {
    event: 'node:delete',
    xlinkHref: 'trash.png',
    width: 20,
    height: 20,
  },
})
```

You can listen for the bound event name `node:delete` or the generic `cell:customevent`, `node:customevent`, `edge:customevent` event names.

```ts
graph.on('node:delete', ({ view, e }) => {
  e.stopPropagation()
  view.cell.remove()
})

graph.on('node:customevent', ({ name, view, e }) => {
  if (name === 'node:delete') {
    e.stopPropagation()
    view.cell.remove()
  }
})
```

<code id="event-custom-click" src="@/src/tutorial/basic/event/custom-click/index.tsx"></code>

### Canvas Zoom/Pan

| Event Name  | Callback Parameters                                      | Description                                                   |
|-------------|----------------------------------------------------------|---------------------------------------------------------------|
| `scale`     | `{ sx: number; sy: number; ox: number; oy: number }`   | Triggered when zooming the canvas; `sx` and `sy` are the scale factors, `ox` and `oy` are the zoom center. |
| `resize`    | `{ width: number; height: number }`                     | Triggered when changing the canvas size; `width` and `height` are the canvas dimensions. |
| `translate` | `{ tx: number; ty: number }`                            | Triggered when panning the canvas; `tx` and `ty` are the offsets on the X and Y axes. |

```ts
graph.on('scale', ({ sx, sy, ox, oy }) => {})
graph.on('resize', ({ width, height }) => {})
graph.on('translate', ({ tx, ty }) => {})
```

### Node/Edge Movement

| Event Name    | Callback Parameters                                                                 | Description                |
|---------------|-------------------------------------------------------------------------------------|----------------------------|
| `node:move`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }`    | Triggered when starting to move a node. |
| `node:moving` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }`    | Triggered while moving a node. |
| `node:moved`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`      | Triggered after moving a node. |
| `edge:move`   | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView }`    | Triggered when starting to move an edge. |
| `edge:moving` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView }`    | Triggered while moving an edge. |
| `edge:moved`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView }`      | Triggered after moving an edge. |

The `x` and `y` parameters are the coordinates of the mouse relative to the canvas.

```ts
graph.on('node:moved', ({ e, x, y, node, view }) => {})
```

### Node Embedding

| Event Name       | Callback Parameters                                                                                                                  | Description                           |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| `node:embed`     | `{ e: Dom.MouseDownEvent; x: number; y: number; node: Node; view: NodeView, currentParent: Node }`                                 | Triggered when starting to embed a node. |
| `node:embedding` | `{ e: Dom.MouseMoveEvent; x: number; y: number; node: Node; view: NodeView, currentParent: Node, candidateParent: Node }`          | Triggered while searching for the target node. |
| `node:embedded`  | `{ e: Dom.MouseUpEvent; x: number; y: number; node: Node; view: NodeView, previousParent: Node, currentParent: Node }`              | Triggered after completing node embedding. |

### Edge Connection/Disconnection

The `edge:connected` event fires when dragging an edge terminal to connect/disconnect it to/from a node or edge. The callback parameters are as follows.

```ts
interface Args {
  e: Dom.MouseUpEvent // Mouse event object
  edge: Edge // Edge
  view: EdgeView // Edge view
  isNew: boolean // Whether it is a newly created edge
  type: Edge.TerminalType // Whether the operation is on the source or target arrow ('source' | 'target')

  previousCell?: Cell | null // The node/edge connected before the interaction
  previousView?: CellView | null // The view of the node/edge connected before the interaction
  previousPort?: string | null // The port ID connected before the interaction
  previousPoint?: Point.PointLike | null // The point connected before the interaction (records the position of the start terminal when dragging the edge terminal from blank to node/edge)
  previousMagnet?: Element | null // The element connected before the interaction

  currentCell?: Cell | null // The node/edge connected after the interaction
  currentView?: CellView | null // The view of the node/edge connected after the interaction
  currentPort?: string | null // The port ID connected after the interaction
  currentPoint?: Point.PointLike | null // The point connected after the interaction (records the position of the terminal after dragging from node/edge to blank)
  currentMagnet?: Element | null // The element connected after the interaction
}
```

We can use `isNew` to determine whether the corresponding edge is newly created after the connection is completed. For example, if an edge is created starting from a port and connected to another node/port, `isNew` will be `true`.

```ts
graph.on('edge:connected', ({ isNew, edge }) => {
  if (isNew) {
    // Perform database insertion or other persistence operations for the newly created edge
  }
})
```

It is particularly important to note that the `previous...` parameters record the state of the terminal before the connection/disconnection operation, and do not refer to `sourceCell`. When obtaining `sourceCell` after creating a new edge, do not use `previousCell`; the correct usage is:

```ts
graph.on('edge:connected', ({ isNew, edge }) => {
  if (isNew) {
    const source = edge.getSourceCell()
  }
})
```

## Node/Edge

### Add/Delete/Modify

When a node/edge is added to the canvas, the following events are triggered:

- `added`
- `cell:added`
- `node:added` (only triggered when the cell is a node)
- `edge:added` (only triggered when the cell is an edge)

When a node/edge is removed, the following events are triggered:

- `removed`
- `cell:removed`
- `node:removed` (only triggered when the cell is a node)
- `edge:removed` (only triggered when the cell is an edge)

When a node/edge undergoes any changes, the following events are triggered:

- `changed`
- `cell:changed`
- `node:changed` (only triggered when the cell is a node)
- `edge:changed` (only triggered when the cell is an edge)

You can listen on the node/edge:

```ts
cell.on('added', ({ cell, index, options }) => {})
cell.on('removed', ({ cell, index, options }) => {})
cell.on('changed', ({ cell, options }) => {})
```

Or listen on the Graph:

```ts
graph.on('cell:added', ({ cell, index, options }) => {})
graph.on('cell:removed', ({ cell, index, options }) => {})
graph.on('cell:changed', ({ cell, options }) => {})

graph.on('node:added', ({ node, index, options }) => {})
graph.on('node:removed', ({ node, index, options }) => {})
graph.on('node:changed', ({ node, options }) => {})

graph.on('edge:added', ({ edge, index, options }) => {})
graph.on('edge:removed', ({ edge, index, options }) => {})
graph.on('edge:changed', ({ edge, options }) => {})
```

### change:xxx

When calling `setXxx(val, options)` and `removeXxx(options)` methods to change the data of a node/edge, and `options.silent` is not `true`, the corresponding `change` event will be triggered, and the node/edge will be redrawn. For example:

```ts
cell.setZIndex(2)
cell.setZIndex(2, { silent: false })
cell.setZIndex(2, { anyKey: 'anyValue' })
```

This will trigger the following events on the Cell:

- `change:*`
- `change:zIndex`

And the following events on the Graph:

- `cell:change:*`
- `node:change:*` (only triggered when the cell is a node)
- `edge:change:*` (only triggered when the cell is an edge)
- `cell:change:zIndex`
- `node:change:zIndex` (only triggered when the cell is a node)
- `edge:change:zIndex` (only triggered when the cell is an edge)

You can listen on the node/edge:

```ts
// Triggered when any change occurs on the cell, can determine the changed item through key
cell.on(
  'change:*',
  (args: {
    cell: Cell
    key: string // Determine the changed item through key
    current: any // Current value
    previous: any // Value before change
    options: any // Pass-through options
  }) => {
    if (key === 'zIndex') {
      //
    }
  },
)

cell.on(
  'change:zIndex',
  (args: {
    cell: Cell
    current?: number // Current value
    previous?: number // Value before change
    options: any // Pass-through options
  }) => {},
)
```

Or listen on the Graph:

```ts
graph.on(
  'cell:change:zIndex',
  (args: {
    cell: Cell
    current?: number // Current value
    previous?: number // Value before change
    options: any // Pass-through options
  }) => {},
)

// Triggered when the cell is a node
graph.on(
  'node:change:zIndex',
  (args: {
    cell: Cell
    node: Node
    current?: number // Current value
    previous?: number // Value before change
    options: any // Pass-through options
  }) => {},
)

// Triggered when the cell is an edge
graph.on(
  'edge:change:zIndex',
  (args: {
    cell: Cell
    edge: Edge
    current?: number // Current value
    previous?: number // Value before change
    options: any // Pass-through options
  }) => {},
)
```

Other `change` events are listed below, and the callback function parameters have the same structure as the parameters mentioned for `change:zIndex`.

- Cell
  - `change:*`
  - `change:attrs`
  - `change:zIndex`
  - `change:markup`
  - `change:visible`
  - `change:parent`
  - `change:children`
  - `change:tools`
  - `change:view`
  - `change:data`
- Node
  - `change:size`
  - `change:angle`
  - `change:position`
  - `change:ports`
  - `change:portMarkup`
  - `change:portLabelMarkup`
  - `change:portContainerMarkup`
  - `ports:added`
  - `ports:removed`
- Edge
  - `change:source`
  - `change:target`
  - `change:terminal`
  - `change:router`
  - `change:connector`
  - `change:vertices`
  - `change:labels`
  - `change:defaultLabel`
  - `vertexs:added`
  - `vertexs:removed`
  - `labels:added`
  - `labels:removed`

In addition to the built-in keys mentioned above, we also support listening to custom keys, for example:

```ts
cell.on('change:custom', ({ cell, current, previous, options }) => {
  console.log(current)
})
```

When modifying the value of the `custom` property using the `cell.prop('custom', 'any data')` method, the `change:custom` event will be triggered.

### Animation
The animation system supports the following events：
- `cell:animation:finish` Triggered when the animation finish.
- `cell:animation:cancel` Triggered when the animation cancel.
- `node:animation:finish` Triggered when the animation finish. (only triggered when the cell is a node)
- `node:animation:cancel` Triggered when the animation cancel. (only triggered when the cell is a node)
- `edge:animation:finish` Triggered when the animation finish. (only triggered when the cell is a edge)
- `edge:animation:cancel` Triggered when the animation cancel. (only triggered when the cell is a edge)
  
## View

Since X6 implements an asynchronous rendering scheduling algorithm, adding a node does not necessarily mean it is mounted on the canvas. Separate events are triggered when a node is mounted to or unmounted from the canvas.

| Event Name       | Callback Parameters         | Description                      |
|------------------|-----------------------------|----------------------------------|
| `view:mounted`   | `{ view: CellView }`        | Triggered when a node is mounted to the canvas. |
| `view:unmounted` | `{ view: CellView }`        | Triggered when a node is unmounted from the canvas. |

```ts
graph.on('view:mounted', ({ view }) => {})
graph.on('view:unmounted', ({ view }) => {})
```

You may also often need to listen for the completion of rendering events after calling `fromJSON` or `resetCells`. In this case, you can use the `render:done` event to listen (added in version 2.15.1).

```typescript
graph.on('render:done', () => {
  // pass
})

graph.fromJSON([...])
```
