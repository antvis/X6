---
title: Stencil
order: 8
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/plugins
---

:::info{title="This chapter mainly introduces knowledge related to the Stencil plugin. By reading, you can learn about"}

- How to enhance DnD with the Stencil plugin
- How to configure grouping, collapse, and search

:::

## Usage

Stencil is a further encapsulation based on Dnd, providing a sidebar-like UI component that supports grouping, collapsing, searching, and more. You can enable the stencil sidebar with the `Stencil` plugin. Example:

```ts
import { Graph, Stencil } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})

const stencil = new Stencil({
  target: graph,
  groups: [
    {
      name: 'group1',
    },
    {
      name: 'group2',
    },
  ],
})

const rect1 = graph.createNode({
  shape: 'rect',
  width: 100,
  height: 40,
})
const rect2 = rect1.clone()

// A DOM container to hold the stencil, stencilContainer
stencilContainer.appendChild(stencil.container)
stencil.load([rect1, rect2], 'group1')
```

## Demo

<code id="plugin-stencil" src="@/src/tutorial/plugins/stencil/index.tsx"></code>

## Configuration

| Option              | Type                                                        | Required | Default Value        | Description                                  |
|---------------------|-------------------------------------------------------------|:--------:|----------------------|----------------------------------------------|
| title               | string                                                      |          | `'Stencil'`          | Title.                                      |
| groups              | Group[]                                                     |    ✓️     | -                    | Group information.                           |
| search              | Filter                                                      |          | `false`              | Search option.                               |
| placeholder         | string                                                      |          | `'Search'`           | Placeholder text for the search input.      |
| notFoundText        | string                                                      |          | `'No matches found'` | Text displayed when no search results are found. |
| collapsable         | boolean                                                     |          | `false`              | Whether to show a global collapse/expand button. |
| layout              | (this: Stencil, model: Model, group?: Group \| null) => any |          | Grid layout          | Layout method for nodes in the stencil canvas. |
| layoutOptions       | any                                                         |          | -                    | Layout options.                             |
| stencilGraphWidth   | number                                                      |          | `200`                | Width of the stencil canvas.                |
| stencilGraphHeight  | number                                                      |          | `800`                | Height of the stencil canvas. Set to 0 for auto-adjustment. |
| stencilGraphPadding | number                                                      |          | `10`                 | Padding for the stencil canvas.             |
| stencilGraphOptions | Graph.Options                                               |          | -                    | Options for the stencil canvas.             |

:::info{title="Tip"}
In addition to the configurations above, Stencil also inherits all configurations from Dnd.
:::

### Grouping

When initializing, a template canvas will be rendered in each group according to the `groups` provided. The type definition for groups is as follows:

```ts
export interface Group {
  name: string // Group name
  title?: string // Group title, defaults to `name`
  collapsable?: boolean // Whether the group is collapsible, defaults to true
  collapsed?: boolean // Initial state whether it is collapsed
  nodeMovable?: boolean // Whether nodes in the stencil canvas can be dragged
  graphWidth?: number // Width of the stencil canvas
  graphHeight?: number // Height of the stencil canvas
  graphPadding?: number // Padding for the stencil canvas
  graphOptions?: Graph.Options // Options for the stencil canvas
  layout?: (this: Stencil, model: Model, group?: Group | null) => any
  layoutOptions?: any // Layout options
}
```

As you can see, some configurations within the group overlap with the outer configurations, such as `graphWidth/stencilGraphWidth` and `graphHeight/stencilGraphHeight`, with the group configurations taking higher priority.

### Layout

When adding nodes, use the group or global `layout` and `layoutOptions` to automatically layout the nodes. By default, the grid layout method is used to layout the template nodes, and the supported layout options are:

| Option        | Type                          | Default Value | Description                                                                               |
|---------------|-------------------------------|---------------|-------------------------------------------------------------------------------------------|
| columns       | number                        | `2`           | Number of columns in the grid layout, defaults to `2`. The number of rows is calculated automatically based on the number of nodes. |
| columnWidth   | number \| 'auto' \| 'compact' | `'auto'`      | Column width. `auto`: width of the widest node among all nodes, `compact`: width of the widest node in that column. |
| rowHeight     | number \| 'auto' \| 'compact' | `'auto'`      | Row height. `auto`: height of the tallest node among all nodes, `compact`: height of the tallest node in that row. |
| dx            | number                        | `10`          | Offset of the cell on the X-axis, defaults to `10`.                                     |
| dy            | number                        | `10`          | Offset of the cell on the Y-axis, defaults to `10`.                                     |
| marginX       | number                        | `0`           | Margin of the cell on the X-axis, defaults to `0`.                                      |
| marginY       | number                        | `0`           | Margin of the cell on the Y-axis, defaults to `0`.                                      |
| center        | boolean                       | `true`        | Whether the nodes are center-aligned with the grid, defaults to `true`.                  |
| resizeToFit   | boolean                       | `false`       | Whether to automatically adjust the size of the nodes to fit the grid size, defaults to `false`. |

You can also implement a custom layout according to the signature `(this: Stencil, model: Model, group?: Group | null) => any`.

### Search

Stencil also provides search capabilities.

```ts
// Only search for rect nodes
const stencil = new Stencil({
  search: (cell, keyword, groupName, stencil) => {
    if (keyword) {
      return cell.shape === 'rect'
    }
    return true
  },
})

// Search for rect nodes whose text contains the keyword
const stencil = new Stencil({
  search: (cell, keyword, groupName, stencil) => {
    if (keyword) {
      return cell.shape === 'rect' && cell.attr('text/text').includes(keyword)
    }
    return true
  },
})
```

## API

### stencil.load(...)

```ts
load(nodes: (Node | Node.Metadata)[], groupName?: string): this
```

Load nodes. Parameters are as follows:

| Name      | Type                        | Required | Default Value | Description                |
|-----------|-----------------------------|:--------:|---------------|----------------------------|
| nodes     | `(Node \| Node.Metadata)[]` |    ✓️     | -             | Nodes to load.             |
| groupName | string                      |          | -             | Name of the group to load nodes into. |

### stencil.unload(...)

```ts
unload(nodes: (Node | Node.Metadata)[], groupName?: string): this
```

Unload nodes. Parameters are as follows:

| Name      | Type                        | Required | Default Value | Description                |
|-----------|-----------------------------|:--------:|---------------|----------------------------|
| nodes     | `(Node \| Node.Metadata)[]` |    ✓️     | -             | Nodes to unload.           |
| groupName | string                      |          | -             | Name of the group to unload nodes from. |

### stencil.addGroup(...)

```ts
addGroup(group: Stencil.Group | Stencil.Group[])
```

Add a new group.

```ts
stencil.addGroup({
  name: 'group1',
  graphHeight: 100,
})
```

### stencil.removeGroup(...)

```ts
removeGroup(groupName: string | string[])
```

Remove a group.

### stencil.resizeGroup(...)

```typescript
resizeGroup(groupName: string, size: { width: number; height: number })
```

Modify the size of a group.
