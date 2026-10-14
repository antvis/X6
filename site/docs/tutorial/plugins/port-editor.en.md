---
title: Port Editor
order: 12
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title=This chapter introduces the port editor plugin, after reading you will know}

- How to add and remove ports interactively on the canvas
- How generated ports reuse the X6 port system (wiring and JSON export come for free)
- How to configure the outline, the ids and the connection style

:::

## Usage

A port in X6 is **declarative data**: position, style and group are written when the node is
created, and at runtime only programmatic APIs such as `node.addPort` / `node.removePort`
exist. The `PortEditor` plugin adds the missing **editing action**: it lets a user point at
the canvas and say "put a port here".

```ts
import { Graph, PortEditor } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
})

const portEditor = new PortEditor({
  group: 'pin',
  outlineSelector: '.x6-node-body',
})

graph.use(portEditor)

// Enter add-pin mode: a preview follows the node outline, a click creates the port there
document.getElementById('add-pin')!.addEventListener('click', () => {
  portEditor.toggleAdding()
})
```

A pin lands on the **nearest point of the node outline**: every geometric shape of the node
markup (`rect` / `circle` / `ellipse` / `path` / `polygon` / `polyline`) is sampled by
arc length, and the pointer is projected onto the closest edge — so custom, non-rectangular
symbols (hexagons, circles, transformer symbols) stay reachable, instead of snapping to the
corners of a bounding box. The projection runs through the SVG CTM chain, so panning,
zooming and node rotation need no special casing.

The created pin is an ordinary port: you can drag a wire from it, it is included in
`graph.toJSON()`, and `graph.fromJSON()` restores it unchanged.

## Options

```ts
interface PortEditorOptions {
  // Port group used for pins; created on the node when absent
  group?: string
  // Prefix of generated pin ids: pin-1, pin-2 ...
  idPrefix?: string
  // 'local' keeps node-local pixels, 'percent' keeps the position relative to the node size
  positionUnit?: 'local' | 'percent'
  // Outline selector; defaults to every geometric shape of the markup, nearest one wins
  outlineSelector?: string
  // Max samples per outline
  sampleCount?: number
  // Create the port group when the node has none
  autoCreateGroup?: boolean
  // Group definition used by autoCreateGroup
  groupConfig?: Record<string, any>
  // Show a delete badge when hovering an existing pin
  deleteBadge?: boolean
  // Leave add-pin mode after a pin was placed
  stopAfterAdd?: boolean
  // Block node dragging while adding pins (default true)
  blockNodeMove?: boolean
  // Disable canvas panning while adding pins (default true)
  blockPanning?: boolean
}
```

`blockNodeMove` and `blockPanning` default to `true`: pressing the element body to add a pin
is also the gesture X6 uses to drag the node or pan the canvas. Both switches are scoped to
add-pin mode and are **restored item by item** when the mode ends, leaving no trace in your
graph options.

## API

```ts
// mode
portEditor.startAdding(): this
portEditor.stopAdding(): this
portEditor.toggleAdding(): this
portEditor.isAdding(): boolean

// pins
portEditor.addPin(node: Node, local: Point): string | null
portEditor.addPinAtClient(node: Node, clientX: number, clientY: number): string | null
portEditor.addPinFromDrop(clientX: number, clientY: number, node?: Node): string | null
portEditor.removePin(node: Node, portId: string): this
portEditor.clearPins(node: Node): this
portEditor.getPins(node: Node): Port[]

// drop target (to be used with the Dnd plugin)
portEditor.createDndDropValidator(options?: { isPinTemplate?: (node: Node) => boolean }): (
  droppingNode: Node,
  ctx?: { targetGraph?: Graph },
) => boolean

// hit testing
portEditor.findNodeAtClient(clientX: number, clientY: number): Node | null

portEditor.dispose(): void
```

## Working with other plugins

- **Selection**: a selection box covers the node outline, which is exactly where pins live.
  Make the box ignore pointer events, otherwise a press on the outline neither creates a pin
  nor starts a wire while the node is selected:

  ```ts
  graph.use(
    new Selection({
      showNodeSelectionBox: true,
      pointerEvents: 'none',
    }),
  )
  ```

- **Dnd**: drop a "pin template" onto a node to create a pin, and prevent the template node
  itself from being dropped:

  ```ts
  graph.use(
    new Dnd({
      target: graph,
      validateNode: portEditor.createDndDropValidator(),
    }),
  )
  ```

  By default a node is treated as a pin template when `node.getData().pinTemplate === true`
  or when its shape is `pin-dot`.

- **History**: adding and removing a pin are wrapped in `model.startBatch/stopBatch`, so one
  user action equals one undo step.
