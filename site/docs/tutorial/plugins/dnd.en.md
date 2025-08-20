---
title: Dnd
order: 7
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="By reading this chapter, you can learn about"}

-  How to add nodes to the canvas through drag-and-drop interactions

:::

## Usage

We often need to add nodes to the canvas through drag-and-drop interactions, such as in process graph editing scenarios, where we drag and drop components from the process graph component library onto the canvas. We provide a separate plugin `dnd` to use this feature, we use it in our code like this:

```ts
import { Graph, Dnd } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})

const dnd = new Dnd({
  target: graph,
})
```

When starting to drag, we need to call the `dnd.start(node, e)` method. In React, we use it like this:

```tsx
export default () => {
  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // The node is the node being dragged, which is also the node placed on the canvas by default, and can be customized with any properties
    const node = graph.createNode({
      shape: 'rect',
      width: 100,
      height: 40,
    })
    dnd.start(node, e.nativeEvent)
  }

  return (
    <ul>
      <li onMouseDown={startDrag}></li>
    </ul>
  )
}
```

## Demo

<code id="plugin-dnd" src="@/src/tutorial/plugins/dnd/index.tsx"></code>

## Configuration

| Option              | Type                                                                                | Required | Default Value          | Description                                                                                                  |
|-------------------|-------------------------------------------------------------------------------------|:----:|-----------------|-----------------------------------------------------------------------------------------------------|
| target            | Graph                                                                               |  ✓️  |                 | The target canvas.                                                                                             |
| getDragNode       | (sourceNode: Node, options: GetDragNodeOptions) => Node                             |      |                 | Get the node being dragged when dragging starts, default to cloning the node passed to `dnd.start`. |
| getDropNode       | (draggingNode: Node, options: GetDropNodeOptions) => Node                           |      |                 | Get the node to be placed on the target canvas when dragging ends, default to cloning the dragged node. |
| validateNode      | (droppingNode: Node, options: ValidateNodeOptions) => boolean \| Promins\<boolean\> |      |                 | Validate whether the node can be placed on the target canvas when dragging ends. |
| dndContainer      | HTMLElement                                                                         |      |                 | If `dndContainer` is set, releasing the mouse on `dndContainer` will not place the node, commonly used in scenarios where the `dnd` container is above the canvas. |
| draggingContainer | HTMLElement                                                                         |      | `document.body` | Customize the dragging canvas container.                                                                           |

## Frequently Asked Questions

1. Why does the node ID change after dragging and dropping it onto the canvas?

According to the dragging details above, we can see that the overall dragging process is: source node -> dragging node -> dropped node. By default, we clone the source node to get the dragging node, and clone the dragging node to get the dropped node. During the cloning process, the node ID will be reset. If you want to keep the original node ID, you can do the following:

```ts
// This way, the ID of the node placed on the canvas will be the same as the ID of the node passed to `dnd.start`.
const dnd = new Dnd({
  getDragNode: (node) => node.clone({ keepId: true }),
  getDropNode: (node) => node.clone({ keepId: true }),
})
```

2. How to customize the style of the dragged node?

```ts
const dnd = new Dnd({
  getDragNode(node) {
    // Return a new node as the dragged node
    return graph.createNode({
      width: 100,
      height: 100,
      shape: 'rect',
      attrs: {
        body: {
          fill: '#ccc',
        },
      },
    })
  },
})
```

3. How to customize the style of the node placed on the canvas?

```ts
const dnd = new Dnd({
  getDropNode(node) {
    const { width, height } = node.size()
    // Return a new node as the node placed on the canvas
    return node.clone().size(width * 3, height * 3)
  },
})
```

4. How to get the position of the node placed on the canvas?

```ts
graph.on('node:added', ({ node }) => {
  const { x, y } = node.position()
})
```

5. How to set the zIndex of the node placed on the canvas?

```ts
graph.on('node:added', ({ node }) => {
  node.setZIndex(5)
})
```
