---
title: Selection Box
order: 5
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="This chapter mainly introduces knowledge related to the selection box plugin. By reading, you can learn about"}

- How to enable selection interaction

:::

## Usage

We provide a standalone plugin package `@antv/x6-plugin-selection` to use the selection feature.

```shell
# npm
$ npm install @antv/x6-plugin-selection --save

# yarn
$ yarn add @antv/x6-plugin-selection
```

Then we use it in the code like this:

```ts
import { Selection } from '@antv/x6-plugin-selection'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Selection({
    enabled: true,
  }),
)
```

## Demo

- Click to select nodes.
- Enable multi-selection by holding down Ctrl/Command and clicking on nodes.
- Enable moving by dragging the selection box to move nodes.
- Enable rubberband selection by pressing the left mouse button on a blank area of the canvas and dragging the selection box to select nodes.
- Enable strict rubberband mode and observe its effect on selection.
- Use modifier keys in conjunction with selection, such as the `alt` key. Hold down the `alt` key and press the left mouse button on a blank area of the canvas to drag the selection box to select nodes.
- Apply a custom filter (exclude circle nodes), so that circular nodes cannot be selected.
- Apply custom additional content (display the number of selected nodes). Select two or more nodes to trigger the display of custom content.

<code id="plugin-selection" src="@/src/tutorial/plugins/selection/index.tsx"></code>

## Configuration

| Property Name            | Type                 | Default Value                          | Required | Description                                                                                                                                    |
|-------------------------|----------------------|---------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| className               | string               | -                                     |          | Additional style name for customizing styles                                                                                                   |
| multiple                | boolean              | `true`                                |          | Whether to enable multi-selection; when enabled, hold down the `ctrl` or `command` key to click nodes for multi-selection                      |
| multipleSelectionModifiers | ModifierKey        | `['ctrl', 'meta']`                   |          | Used to set the modifier keys for multi-selection                                                                                              |
| rubberband              | boolean              | `false`                               |          | Whether to enable the rubberband selection feature                                                                                             |
| modifiers               | ModifierKey          | -                                     |          | Used to set the modifier keys for rubberband selection                                                                                         |
| strict                  | boolean              | `false`                               |          | Whether the selection box needs to completely enclose nodes to select them                                                                      |
| movable                 | boolean              | `true`                                |          | Whether the selected nodes move together when dragging the selection box                                                                        |
| content                 | string               | -                                     |          | Set additional display content                                                                                                                 |
| filter                  | Filter               | -                                     |          | Node filter                                                                                                                                     |
| showNodeSelectionBox    | boolean              | `false`                               |          | Whether to show the selection box for nodes                                                                                                    |
| showEdgeSelectionBox    | boolean              | `false`                               |          | Whether to show the selection box for edges                                                                                                    |
| pointerEvents           | `node \| auto`       | `auto`                                |          | When `showNodeSelectionBox` is enabled, an element will overlay on top of the node, causing the node's events to be unresponsive; you can set `pointerEvents: none` to resolve this, default is `auto` |
| eventTypes              | SelectionEventType[] | `['leftMouseDown', 'mouseWheelDown']` |          | Used to set the trigger event types for rubberband selection                                                                                   |

The type definition for `Filter` is as follows:

```ts
type Filter = string[] | { id: string }[] | (this: Graph, cell: Cell) => boolean
```

- `string[]`: An array of node shapes; only specified node/edge shapes can be selected.
- `({ id: string })[]`: An array of node IDs; only specified nodes/edges can be selected.
- `(this: Graph, cell: Cell) => boolean`: Only nodes/edges that return true can be selected.

The type definition for `ModifierKey` is as follows:

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
```

The modifier keys in X6 include `alt`, `ctrl`, `meta`, and `shift`. After setting the modifier keys, you need to click the mouse and press the modifier keys to trigger the corresponding behavior. Modifier keys are very useful in certain scenarios, such as starting rubberband selection and dragging the canvas simultaneously, where both actions are triggered by pressing the left mouse button on a blank area of the canvas. You can set different modifier keys for rubberband selection and dragging the canvas to achieve simultaneous activation without conflict. You can configure a single (e.g., `alt`) or multiple (e.g., `['alt', 'ctrl']`) modifier keys. Multiple modifier keys configured in array form are treated as an OR relationship. For example, the configured modifier keys indicate pressing `alt` or `ctrl`. If you need more flexible configurations, you can use the following forms:

- `alt` indicates pressing `alt`.
- `[alt, ctrl]` indicates pressing `alt` or `ctrl`.
- `alt|ctrl` indicates pressing `alt` or `ctrl`.
- `alt&ctrl` indicates pressing `alt` and `ctrl` simultaneously.
- `alt|ctrl&shift` indicates pressing `alt` and `shift` simultaneously or pressing `ctrl` and `shift` simultaneously.

The type definition for `SelectionEventType` is as follows:

```ts
type SelectionEventType = 'leftMouseDown' | 'mouseWheelDown';
```
Interaction methods that trigger rubberband selection. Supports two forms or combinations of them:

- `leftMouseDown`: Pressing the left mouse button to drag.
- `mouseWheelDown`: Pressing the mouse wheel to drag.


## API

### graph.select(...)

```ts
select(cells: Cell | string | (Cell | string)[]): this
```

Selects the specified nodes/edges. Note that this method does not unselect currently selected nodes/edges; it appends the specified nodes/edges to the selection. If you also need to unselect currently selected nodes/edges, please use the [resetSelection(...)](#graphresetselection) method.

### graph.unselect(...)

```ts
unselect(cells: Cell | string | (Cell | string)[]): this
```

Unselects the specified nodes/edges.

### graph.isSelected(...)

```ts
isSelected(cell: Cell | string): boolean
```

Returns whether the specified node/edge is selected.

### graph.resetSelection(...)

```ts
resetSelection(cells?: Cell | string | (Cell | string)[]): this
```

Clears the selection first, then selects the provided nodes/edges.

### graph.getSelectedCells()

```ts
getSelectedCells(): Cell[]
```

Gets the selected nodes/edges.

### graph.cleanSelection()

```ts
cleanSelection(): this
```

Clears the selection.

### graph.isSelectionEmpty()

```ts
cleanSelection(): boolean
```

Returns whether the selection is empty.

### graph.isSelectionEnabled()

```ts
isSelectionEnabled(): boolean
```

Whether selection capability is enabled.

### graph.enableSelection()

```ts
enableSelection(): this
```

Enables selection capability.

### graph.disableSelection()

```ts
disableSelection(): this
```

Disables selection capability.

### graph.toggleSelection(...)

```ts
toggleSelection(enabled?: boolean): this
```

Toggles the enabled state of selection. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                   |
|---------|---------|:--------:|---------------|-----------------------------------------------|
| enabled | boolean |          | -             | Whether to enable selection capability; defaults to toggling the enabled state. |

### graph.isMultipleSelection()

```ts
isMultipleSelection(): boolean
```

Whether multi-selection is enabled.

### graph.enableMultipleSelection()

```ts
enableMultipleSelection(): this
```

Enables multi-selection.

### graph.disableMultipleSelection()

```ts
disableMultipleSelection(): this
```

Disables multi-selection.

### graph.toggleMultipleSelection(...)

```ts
toggleMultipleSelection(multiple?: boolean): this
```

Toggles the enabled state of multi-selection. Parameters are as follows:

| Name     | Type    | Required | Default Value | Description                                   |
|----------|---------|:--------:|---------------|-----------------------------------------------|
| multiple | boolean |          | -             | Whether to enable multi-selection; defaults to toggling the enabled state. |

### graph.isSelectionMovable()

```ts
isSelectionMovable(): boolean
```

Returns whether the selected nodes/edges can be moved.

### graph.enableSelectionMovable()

```ts
enableSelectionMovable(): this
```

Enables moving of selected nodes/edges.

### graph.disableSelectionMovable()

```ts
disableSelectionMovable(): this
```

Disables moving of selected nodes/edges.

### graph.toggleSelectionMovable(...)

```ts
toggleSelectionMovable(enabled?: boolean): this
```

Toggles whether selected nodes/edges can be moved. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                            |
|---------|---------|:--------:|---------------|-------------------------------------------------------|
| enabled | boolean |          | -             | Whether to enable moving of selected nodes/edges; defaults to toggling the enabled state. |

### graph.isRubberbandEnabled()

```ts
isRubberbandEnabled(): boolean
```

Returns whether rubberband selection is enabled.

### graph.enableRubberband()

```ts
enableRubberband(): this
```

Enables rubberband selection.

### graph.disableRubberband()

```ts
disableRubberband(): this
```

Disables rubberband selection.

### graph.toggleRubberband(...)

```ts
toggleRubberband(enabled?: boolean): this
```

Toggles the enabled state of rubberband selection. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                             |
|---------|---------|:--------:|---------------|----------------------------------------|
| enabled | boolean |          | -             | Whether to enable rubberband selection; defaults to toggling the enabled state. |

### graph.isStrictRubberband()

```ts
isStrictRubberband(): boolean
```

Returns whether strict rubberband selection is enabled. When strict rubberband selection is enabled, only nodes/edges that are completely enclosed by the selection box will be selected.

### graph.enableStrictRubberband()

```ts
enableStrictRubberband(): this
```

Enables strict rubberband selection. When strict rubberband selection is enabled, only nodes/edges that are completely enclosed by the selection box will be selected.

### graph.disableStrictRubberband()

```ts
disableStrictRubberband(): this
```

Disables strict rubberband selection. When strict rubberband selection is disabled, nodes/edges can be selected as long as the selection box intersects with their bounding box.

### graph.toggleStrictRubberband(...)

```ts
toggleStrictRubberband(enabled?: boolean): this
```

Toggles the enabled state of strict rubberband selection. Parameters are as follows:

| Name    | Type    | Required | Default Value | Description                                 |
|---------|---------|:--------:|---------------|---------------------------------------------|
| enabled | boolean |          | -             | Whether to enable strict rubberband selection; defaults to toggling the enabled state. |

### graph.setSelectionFilter(...)

```ts
setSelectionFilter(
  filter?:
   | null
   | (string | { id: string })[]
   | ((this: Graph, cell: Cell) => boolean)
): this
```

Sets the filtering criteria for selection; only nodes/edges that meet the filtering criteria can be selected.

### graph.setRubberbandModifiers(...)

```ts
setRubberbandModifiers(modifiers?: string | ModifierKey[] | null): this
```

Sets the modifier keys for rubberband selection; rubberband selection can only be triggered when the modifier keys are pressed simultaneously.

### graph.setSelectionDisplayContent(...)

```ts
setSelectionDisplayContent(
  content?:
   | null
   | false
   | string
   | ((this: Graph, selection: Selection, contentElement: HTMLElement) => string)
): this
```

Sets additional display content for selected nodes/edges.

## Events

| Event Name            | Parameter Type                                                                        | Description                              |
|-----------------------|---------------------------------------------------------------------------------------|------------------------------------------|
| `cell:selected`       | `{ cell: Cell; options: Model.SetOptions }`                                          | Triggered when a node/edge is selected   |
| `node:selected`       | `{ node: Node; options: Model.SetOptions }`                                          | Triggered when a node is selected        |
| `edge:selected`       | `{ edge: Edge; options: Model.SetOptions }`                                          | Triggered when an edge is selected       |
| `cell:unselected`     | `{ cell: Cell; options: Model.SetOptions }`                                          | Triggered when a node/edge is unselected |
| `node:unselected`     | `{ node: Node; options: Model.SetOptions }`                                          | Triggered when a node is unselected      |
| `edge:unselected`     | `{ edge: Edge; options: Model.SetOptions }`                                          | Triggered when an edge is unselected     |
| `selection:changed`   | `{added: Cell[]; removed: Cell[]; selected: Cell[]; options: Model.SetOptions}`     | Triggered when the selected nodes/edges change (add/remove) |

```ts
graph.on('node:selected', ({ node }) => {
  console.log(node)
})

// We can also listen to events on the plugin instance
selection.on('node:selected', ({ node }) => {
  console.log(node)
})
```
