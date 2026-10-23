---
title: "Selection"
description: "Selection"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/selection/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to selection and rubberband plugin. By reading, you can learn about**

- How to enable selection and rubberband
- How to configure multi-selection and strict rubberband
- How to set modifier keys and trigger events (`eventTypes`)


## Usage

You can enable selection and rubberband with the `Selection` plugin, for example:

```ts
import { Graph, Selection } from '@antv/x6'

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Selection } from '@antv/x6'
import { Settings, State } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      }),
    )

    this.graph.addNode({
      x: 320,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const source = this.graph.addNode({
      x: 80,
      y: 50,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 240,
      y: 200,
      width: 60,
      height: 60,
      label: 'World',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    })

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
  }

  onSettingChanged = (options: State) => {
    this.graph.toggleMultipleSelection(options.multiple)
    this.graph.toggleSelectionMovable(options.movable)
    this.graph.toggleRubberband(options.rubberband)
    this.graph.toggleStrictRubberband(options.strict)
    this.graph.setSelectionFilter(options.filter)
    this.graph.setRubberbandModifiers(options.modifiers as any)
    this.graph.setSelectionDisplayContent(
      options.content
        ? (selection) => {
            return `${selection.length} node${
              selection.length > 1 ? 's' : ''
            } selected.`
          }
        : null,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="selection-app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })
```



## Configuration

| Property Name            | Type                 | Default Value                          | Required | Description                                                                                                                                    |
|-------------------------|----------------------|---------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| enabled                 | boolean              | `true`                                |          | Whether to enable the Selection plugin                                                                                                         |
| className               | string               | -                                     |          | Additional style name for customizing styles                                                                                                   |
| multiple                | boolean              | `true`                                |          | Whether to enable multi-selection; when enabled, hold down the `ctrl` or `command` key to click nodes for multi-selection                      |
| multipleSelectionModifiers | ModifierKey        | `['ctrl', 'meta']`                   |          | Used to set the modifier keys for multi-selection                                                                                              |
| rubberband              | boolean              | `false`                               |          | Whether to enable the rubberband selection feature                                                                                             |
| rubberNode              | boolean              | `true`                                |          | Whether nodes are included in rubberband hit testing                                                                                           |
| rubberEdge              | boolean              | `false`                               |          | Whether edges are included in rubberband hit testing                                                                                           |
| modifiers               | ModifierKey          | -                                     |          | Used to set the modifier keys for rubberband selection                                                                                         |
| strict                  | boolean              | `false`                               |          | Whether the selection box needs to completely enclose nodes to select them                                                                      |
| movable                 | boolean              | `true`                                |          | Whether the selected nodes move together when dragging the selection box                                                                        |
| content                 | string               | -                                     |          | Set additional display content                                                                                                                 |
| filter                  | Filter               | -                                     |          | Node filter                                                                                                                                     |
| showNodeSelectionBox    | boolean              | `false`                               |          | Whether to show the selection box for nodes                                                                                                    |
| showEdgeSelectionBox    | boolean              | `false`                               |          | Whether to show the selection box for edges                                                                                                    |
| pointerEvents           | `'none' \| 'auto'`   | `auto`                                |          | When `showNodeSelectionBox` is enabled, an element overlays the node and its events may not respond; set `pointerEvents: none` to resolve this. Default is `auto`. |
| eventTypes              | SelectionEventType[] | `['leftMouseDown', 'mouseWheelDown']` |          | Used to set the trigger event types for rubberband selection                                                                                   |
| movingRouterFallback    | string               | -                                     |          | During batch dragging of multiple nodes, temporarily downgrade the routing of edges connected to the selected nodes to the specified router, and automatically restore to the original routers after idle (recommended to set `'orth'` when dragging many nodes and edges originally use `'manhattan'` to improve dragging smoothness) |

The type definition for `Filter` is as follows:

```ts
type Filter = string[] | { id: string }[] | (this: Graph, cell: Cell) => boolean
```

- `string[]`: An array of node shapes; only specified node/edge shapes can be selected.
- `({ id: string })[]`: An array of node IDs; only specified nodes/edges can be selected.
- `(this: Graph, cell: Cell) => boolean`: Only nodes/edges that return true can be selected.

The type definition for `ModifierKey` is as follows:

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift' | 'space')[] | null
```

The modifier keys in X6 include `alt`, `ctrl`, `meta`, `shift`, and `space`. When modifiers are configured, clicking the mouse while holding a modifier triggers the corresponding behavior. If rubberband selection and canvas panning have identical triggers (same `eventTypes` and same `modifiers`), rubberband selection takes precedence and the default panning is disabled; if they differ, they work independently. When both start on `leftMouseDown` over blank areas, configure different modifiers for selection and panning to avoid conflicts. You can configure a single key (e.g., `alt`) or multiple keys (e.g., `['alt', 'ctrl']`). Multiple keys in an array are treated as OR. For more flexible configurations, use the following forms:

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
isSelectionEmpty(): boolean
```

Returns whether the selection is empty.

### graph.isSelectionEnabled()

```ts
isSelectionEnabled(): boolean
```

Returns whether selection is enabled.

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

Returns whether multi-selection is enabled.

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

When `filter` is enabled, the `nodes` and `edges` returned by `box:mousemove` and `box:mouseup` during blank-area rubberband selection also apply the same filtering rule, so the preview result stays consistent with the final selection.

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
| `box:mousedown`       | `{ e: Dom.MouseDownEvent; view: CellView \| null; cell: Cell \| null; x: number; y: number; nodes: Node[]; edges: Edge[] }` | Triggered when pressing a selection box, or when starting rubberband selection on a blank area |
| `box:mousemove`       | `{ e: Dom.MouseMoveEvent; view: CellView \| null; cell: Cell \| null; x: number; y: number; nodes: Node[]; edges: Edge[] }` | Triggered while dragging a selection box, or continuously during rubberband selection |
| `box:mouseup`         | `{ e: Dom.MouseUpEvent; view: CellView \| null; cell: Cell \| null; x: number; y: number; nodes: Node[]; edges: Edge[] }` | Triggered when finishing selection-box dragging, or when finishing rubberband selection |
| `selection:changed`   | `{added: Cell[]; removed: Cell[]; selected: Cell[]; options: Model.SetOptions}`     | Triggered when the selected nodes/edges change (add/remove) |

The parameters of `box:*` events are:

- `x` and `y`: the current graph coordinates of the pointer.
- `nodes` and `edges`: the current node/edge collection represented by the box.
- `view` and `cell`: the related view and cell; they can be `null` during blank-area rubberband interactions.

`nodes` and `edges` mean slightly different things depending on the interaction mode:

- During blank-area rubberband selection, `nodes` and `edges` are the nodes and edges currently hit by the rubberband box in real time. The `strict` and `filter` options affect this result.
- During selection-box dragging, `nodes` and `edges` are the nodes and edges currently contained in the selection.

```ts
graph.on('node:selected', ({ node }) => {
  console.log(node)
})

graph.on('box:mousemove', ({ nodes, edges, cell }) => {
  console.log(nodes, edges, cell)
})

// We can also listen to events on the plugin instance
selection.on('node:selected', ({ node }) => {
  console.log(node)
})
```
### docs/demos/tutorial/plugins/selection/index.less

```less
.selection-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-side {
    bottom: 0;
    padding: 0 8px;
  }

  .app-content {
    flex: 1;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card {
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .ant-card-head-title {
    text-align: center;
  }

  .ant-row {
    margin: 16px 0;
    text-align: left;
  }

  .x6-widget-selection-box {
    border: 2px dashed #239edd;
  }

  .x6-widget-selection-inner {
    border: 1px solid #239edd;
  }
}
```
### docs/demos/tutorial/plugins/selection/settings.tsx

```tsx
import React from 'react'
import { Checkbox, Switch, Card, Row, Col } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  multiple: boolean
  rubberband: boolean
  strict: boolean
  movable: boolean
  modifiers: string[]
  filter?: string[]
  content: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    multiple: true,
    rubberband: true,
    movable: true,
    strict: false,
    modifiers: [],
    content: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onMultipleChanged = (multiple: boolean) => {
    this.setState({ multiple }, () => {
      this.notifyChange()
    })
  }

  onMovableChanged = (movable: boolean) => {
    this.setState({ movable }, () => {
      this.notifyChange()
    })
  }

  onRubberbandChanged = (rubberband: boolean) => {
    this.setState({ rubberband }, () => {
      this.notifyChange()
    })
  }

  onStrictChanged = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onModifiersChange = (modifiers: string[]) => {
    this.setState({ modifiers }, () => {
      this.notifyChange()
    })
  }

  onFilterChanged = (e: CheckboxChangeEvent) => {
    this.setState(
      {
        filter: e.target.checked ? ['circle'] : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onContentChanged = (e: CheckboxChangeEvent) => {
    this.setState({ content: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Selection Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={14}>Enable Multiple Select</Col>
          <Col span={10}>
            <Switch
              checked={this.state.multiple}
              onChange={this.onMultipleChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Selection Movable</Col>
          <Col span={10}>
            <Switch
              checked={this.state.movable}
              onChange={this.onMovableChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={14}>Enable Rubberband</Col>
          <Col span={10}>
            <Switch
              checked={this.state.rubberband}
              onChange={this.onRubberbandChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Is Strict Contains</Col>
          <Col span={10}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Modifier Key</Col>
          <Col span={16}>
            <Checkbox.Group
              options={['alt', 'ctrl', 'shift']}
              value={this.state.modifiers}
              onChange={this.onModifiersChange}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add filter (only circle)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.content}
              onChange={this.onContentChanged}
            >
              Add content(display selected count)
            </Checkbox>
          </Col>
        </Row>
      </Card>
    )
  }
}
```
