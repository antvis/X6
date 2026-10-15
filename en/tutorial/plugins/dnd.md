---
title: "Dnd"
description: "Dnd"
language: "en"
canonical: "https://x6.antv.antgroup.com/en/tutorial/plugins/dnd/"
version: "3.x"
---

[Resource index](/llms.txt)

> **This chapter mainly introduces knowledge related to the Dnd plugin. By reading, you can learn about**

- How to add nodes via drag-and-drop
- How to customize the dragged and dropped nodes


## Usage

We often need to add nodes to the canvas through drag-and-drop interactions, such as in process graph editing scenarios, where we drag and drop components from the process graph component library onto the canvas. You can enable drag-and-drop with the `Dnd` plugin. Example:

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



```ts
import './index.less'
import { createRoot } from 'react-dom/client'
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Graph, Dnd, Snapline } from '@antv/x6'

export default class Example extends React.Component {
  private graph: Graph
  private container: HTMLDivElement
  private dndContainer: HTMLDivElement
  private dnd: Dnd

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      }),
    )

    const source = graph.addNode({
      x: 130,
      y: 30,
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

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      label: 'World',
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

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
    graph.centerContent()

    this.dnd = new Dnd({
      target: graph,
      scaled: false,
      dndContainer: this.dndContainer,
    })
    this.graph = graph
  }

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget
    const type = target.getAttribute('data-type')
    const node =
      type === 'rect'
        ? this.graph.createNode({
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
        : this.graph.createNode({
            width: 60,
            height: 60,
            shape: 'circle',
            label: 'Circle',
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          })

    this.dnd.start(node, e.nativeEvent as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  dndContainerRef = (container: HTMLDivElement) => {
    this.dndContainer = container
  }

  render() {
    return (
      <div className="dnd-app">
        <div className="dnd-wrap" ref={this.dndContainerRef}>
          <div
            data-type="rect"
            className="dnd-rect"
            onMouseDown={this.startDrag}
          >
            Rect
          </div>
          <div
            data-type="circle"
            className="dnd-circle"
            onMouseDown={this.startDrag}
          >
            Circle
          </div>
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

| Option              | Type                                                                                | Required | Default Value          | Description                                                                                                  |
|-------------------|-------------------------------------------------------------------------------------|:----:|-----------------|-----------------------------------------------------------------------------------------------------|
| target            | Graph                                                                               |  ✓️   |                 | The target canvas.                                                                                             |
| getDragNode       | (sourceNode: Node, options: GetDragNodeOptions) => Node                             |      |                 | Get the node being dragged when dragging starts, default to cloning the node passed to `dnd.start`. |
| getDropNode       | (draggingNode: Node, options: GetDropNodeOptions) => Node                           |      |                 | Get the node to be placed on the target canvas when dragging ends, default to cloning the dragged node. |
| validateNode      | (droppingNode: Node, options: ValidateNodeOptions) => boolean \| Promise\<boolean\> |      |                 | Validate whether the node can be placed on the target canvas when dragging ends. |
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
### docs/demos/tutorial/plugins/dnd/index.less

```less
.dnd-app {
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 16px 8px;
  font-family: sans-serif;

  .app-content {
    flex: 1;
    height: 240px;
    margin-right: 8px;
    margin-left: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }

  .dnd-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    user-select: none;

    .dnd-rect {
      width: 100px;
      height: 40px;
      margin: 16px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #8f8f8f;
      border-radius: 6px;
      cursor: move;
    }

    .dnd-circle {
      width: 60px;
      height: 60px;
      margin: 16px;
      line-height: 60px;
      text-align: center;
      border: 1px solid #8f8f8f;
      border-radius: 100%;
      cursor: move;
    }
  }
}
```
