---
title: 拖拽 Dnd
order: 12
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

We often need to add nodes to the canvas through drag-and-drop interactions, such as flowchart editing scenarios, where we drag and drop components from the flowchart component library to the canvas.

## Dnd

Dnd is an add-in in the `Addon` namespace that provides basic drag-and-drop capabilities, follow the two steps below to use it.

### Step 1 Initialization

First, an instance of Dnd is created and some options are provided to customize the dragging behavior.

```ts
import { Addon } from '@antv/x6'

const dnd = new Addon.Dnd(options)
```

|  Options | Type | Required | Default | Description                                                                                                                                                                                                                                              |
|------------------------------|-------------------------------------------------------------------------------------|:----:|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| options.target               | Graph                                                                               |  ✓️  |         | Target canvas.                                                                                                                                                                                                                                         |
| options.delegateGraphOptions | Graph.Options                                                                       |      |         | The option to create a proxy canvas at the start of the drag and drop.                                                                                                                                                                                                                    |
| options.getDragNode          | (sourceNode: Node, options: GetDragNodeOptions) => Node                             |      |         | Get the proxy node (the actual node being dragged) at the start of the drag, and clone the incoming node by default.                                                                                                                                                                                     |
| options.getDropNode          | (draggingNode: Node, options: GetDropNodeOptions) => Node                           |      |         | Get the node placed to the target canvas at the end of the drag and drop, and clone the proxy node by default.                                                                                                                                                                                             |
| options.validateNode         | (droppingNode: Node, options: ValidateNodeOptions) => boolean \| Promins\<boolean\> |      |         | At the end of the drag and drop, verify that the node can be placed into the target canvas.                                                                                                                                                                                                      |
| options.animation            | boolean \| { duration?: number; easing?: string }                                   |      | `false` | Whether to use animation to move the proxy canvas to the start of the drag when the drag ends and the target node cannot be added to the target canvas. The options `duration` and `easing` correspond to parameters in JQuery's [.animate( properties [, duration ] [, easing ] [, complete ] )](https://api.jquery.com/animate/) method. |
| options.dndContainer         | HTMLElement                                                                         |      |         | The container where the Dnd toolbox is located, the dropNode proxy node is not created when the drag and drop does not leave the container area. |

### Step 2 Start dragging and dropping

The following method is called when the mouse is pressed to start the drag and drop.

```ts
dnd.start(node, e)
```

| Options | Type | Description            |
|------|-------------------------------------|---------------|
| node | Node                                | The node to start dragging and dropping. |
| e    | MouseEvent \| JQuery.MouseDownEvent | Mouse events.       |

### Drag and drop details

- When dragging is started, a proxy canvas is created based on the `options.delegateGraphOptions` option, then a proxy node (default clone) is returned using the `node` provided by `start` as an argument to the `options.getDragNode` method, and the proxy node is added to the proxy canvas.
- During the dragging process, the absolute position of the proxy canvas in the page is updated in real time according to the mouse position.
- At the end of the drag, the proxy node is used as an argument to the `options.getDropNode` method, which returns a target node (default clone proxy node) to be placed in the target canvas, and then the `options.validateNode` method is called to verify that the node can be added to the target canvas, which supports asynchronous validation, such as sending an interface to the remote validation or inserting the new node into the database. If it passes the validation, the target node is added to the target canvas, otherwise the proxy canvas is moved to the starting dragging position according to the `options.animation` option, and finally the proxy canvas is destroyed.

<iframe src="/demos/tutorial/basic/dnd/dnd"></iframe>

### Frequently Asked Questions

1. Why did the ID change after dragging the node to the canvas?

According to the above drag and drop details, we will find that the overall drag and drop process is: Source node -> Drag node -> Place node, the default is to clone a copy of the source node into a drag node and a copy of the drag node into a place node, the node ID will be reset during the cloning process, if you want to keep the original node ID, you can do the following.

```ts
const dnd = new Addon.Dnd({
  getDragNode: (node) => node.clone({ keepId: true }),
  getDropNode: (node) => node.clone({ keepId: true }),
})
```

2. How to customize the style of drag and drop nodes?

```ts
const dnd = new Addon.Dnd({
  getDragNode(node) {
    // A new node is returned here as the drag node
    return graph.createNode({
      width: 100,
      height: 100,
      shape: 'rect',
      attrs: {
        body: {
          fill: '#ccc'
        }
      }
    })
  }
})
```

3. How to customize the style of the nodes placed on the canvas?

```ts
const dnd = new Addon.Dnd({
  getDropNode(node) {
    const { width, height } = node.size()
    // return a new node as the one actually placed on the canvas
    return node.clone().size(width * 3, height * 3)
  }
})
```

4. How to get the position of the node placed on the canvas?

```ts
graph.on('node:added', ({ node }) => {
  const { x, y } = node.position()
})
```

## Stencil

Stencil is an add-on in the `Addon` namespace, a further wrapper on top of Dnd, providing a sidebar-like UI component with support for grouping, collapsing, searching and other capabilities.

### Step 1 Initialization

First, create an instance of Stencil with some options to customize the UI and drag-and-drop behavior

```ts
import { Addon } from '@antv/x6'

const stencil = new Addon.Stencil(options)
```

The options for creating Stencil are inherited from [Options for creating Dnd](#step-1-initialize), and the following options are also supported.


| Options                     | Type                                                       | Required | Default          | Description                           |
|-----------------------------|-------------------------------------------------------------|:----:|----------------------|------------------------------|
| options.title               | string                                                      |      | `'Stencil'`          | Title.                          |
| options.groups              | Group[]                                                     |  ✓️  |                      | Grouping information.                      |
| options.search              | Filter                                                      |      | `false`              | Search options.                      |
| options.placeholder         | string                                                      |      | `'Search'`           | Search the placeholder text of the text box. |
| options.notFoundText        | string                                                      |      | `'No matches found'` | The text of the prompt when the search result is not matched.  |
| options.collapsable         | boolean                                                     |      | `false`              | Indicates if the global collapse/expand button is displayed.     |
| options.layout              | (this: Stencil, model: Model, group?: Group \| null) => any |      | Grid layout             | The layout method of the nodes in the template canvas.      |
| options.layoutOptions       | any                                                         |      |                      | Layout options.                      |
| options.stencilGraphWidth   | number                                                      |      | `200`                | The width of the template canvas.                  |
| options.stencilGraphHeight  | number                                                      |      | `800`                | The height of the template canvas.                  |
| options.stencilGraphPadding | number                                                      |      | `10`                 | Template canvas margin.                  |
| options.stencilGraphOptions | Graph.Options                                               |      |                      | Template canvas option.                  |

where a group is defined as an option provided in a group that has a higher priority than the same option in `options`.

```ts
export interface Group {
  name: string     // Subgroup Name
  title?: string   // Group title, by default `name` is used
  collapsable?: boolean // Whether the group is collapsible or not, default is true
  collapsed?: boolean   // Whether the initial state is collapsed or not
  graphWidth?: number          // Template Canvas Width
  graphHeight?: number         // Template Canvas Width
  graphPadding?: number        // Template Canvas Margins
  graphOptions?: Graph.Options // Template Canvas Below the Line
  layout?: (this: Stencil, model: Model, group?: Group | null) => any
  layoutOptions?: any // Layout Options
}
```

On initialization, a template canvas is rendered in each grouping as per the grouping provided by `options.groups`.

### Step 2 Mount to the page

Mount the UI component to a suitable location on the page, for example, in the following case, we mount the component to the sidebar.

```ts
this.stencilContainer.appendChild(stencil.container)
```

### Step 3 Load Template Nodes

We have rendered a template canvas in each grouping, next we need to add some template nodes to these template canvases.

```ts
// Create some template nodes.
const r1 = new Rect(...)
const c1 = new Circle(...)
const r2 = new Rect(...)
const c2 = new Circle(...)
const r3 = new Rect(...)
const c3 = new Circle(...)

// Add the template node to the specified group.
stencil.load([r1, c1, c2, r2.clone()], 'group1')
stencil.load([c2.clone(), r2, r3, c3], 'group2')
```

When adding nodes, use the grouped or global `layout` and `layoutOptions` to automatically layout the nodes. By default, the grid layout method is used to layout the template nodes, and the supported layout options are

| Options     | Type                          | Default  | Description                                                                     |
|-------------|-------------------------------|----------|----------------------------------------------------------------------------------|
| columns     | number                        | `2`      | The number of columns in the grid layout, default is `2`. The number of rows is calculated automatically based on the number of nodes.                                  |
| columnWidth | number \| 'auto' \| 'compact' | `'auto'` | Column width. auto: the width of the widest node in all nodes as the column width, compact: the width of the widest node in the column as the column width. |
| rowHeight   | number \| 'auto' \| 'compact' | `'auto'` | Row height. auto: the height of the highest node in all nodes as the row height, compact: the height of the highest node in the row as the row height. |
| dx          | number                        | `10`     | The cell offset on the X-axis, default is `10`.                                                 |
| dy          | number                        | `10`     | The offset of the cell on the Y-axis, default is `10`.                                                 |
| marginX     | number                        | `0`      | The cell margin on the X-axis, default is `0`.                                                    |
| marginY     | number                        | `0`      | The margin of the cell on the Y-axis, default is `0`.                                                    |
| center      | boolean                       | `true`   | If or not the node is centered to the grid, default is `true`.                                              |
| resizeToFit | boolean                       | `false`  | Whether to automatically resize the nodes to fit the grid size, default is `false`.                               |

It is also possible to customize the layout according to `(this: Stencil, model: Model, group?: Group | null) => any` signature.

### Step 4 Drag and drop

When we press the mouse on a template node to start dragging, it is the same as calling the [dnd.start(node, e)](#step-2-start-dragging) method with that node to trigger the dragging. For more customization options, please refer to the previous section [Dnd Usage Tutorial](#dnd).

<iframe src="/demos/tutorial/basic/dnd/stencil"></iframe>

### Other functions

#### Search

Stencil also provides powerful search capabilities.

The first way is to customize the search function.

```ts
// Search for rect nodes only
const stencil = new Addon.Stencil({
  search: (cell, keyword, groupName, stencil) => {
    if (keyword) {
      return cell.shape === 'rect'
    }
    return true
  }
})
```

There is also a quicker way to provide key-value pairs for `shape` and search criteria, where `shape` can use the wildcard `*` for all types of nodes.

```ts
// Search for rect nodes only
const stencil = new Addon.Stencil({
  search: {
    rect: true,
  }
})
```

It also supports searching by node attribute values, for which a comparison is made below.

```ts
// Search for rect nodes whose text contains keywords
const stencil = new Addon.Stencil({
  search: (cell, keyword, groupName, stencil) => {
    if (keyword) {
      return cell.shape === 'rect' && cell.attr('text/text').includes(keyword)
    }
    return true
  }
})

const stencil = new Addon.Stencil({
  search: {
    rect: 'attrs/text/text', // The attribute paths also support an array format, so as long as one item meets the criteria it can be searched
  }
})
```

#### dynamically modifies group size

We can dynamically modify the size of the group with the ``resizeGroup`` provided by stencil.

```ts
// The first parameter is the name of the group
stencil.resizeGroup('group1', { width: 200, height: 200 })
```
