---
title: Group
order: 3
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

:::info{title="This chapter mainly introduces knowledge related to grouping. By reading, you can learn about"}

- How to group nodes
- How to group nodes via interaction
- How to restrict child node movement in a group
- How to automatically expand the parent node
- How to expand and collapse the parent node
:::

## Group Nodes

You can build groups via parent–child relationships, with [methods](/en/api/model/cell#parentchildren-relationship) to get and set them.

<code id="group-embed-edge" src="@/src/tutorial/intermediate/group/embed-edge/index.tsx"></code>

From the example above:

- Moving the parent node also moves its children, even if they are outside.
- By default, the edge’s parent is the common parent of its terminals. Moving the parent moves the edge’s vertices.

## Group via Interaction

Sometimes you need to drag one node into another to make it a child. Enable `embedding` and implement `findParent` to return the parent on move. See the [API](/en/api/interacting/interacting#embedding) for details.

<code id="group-embedding" src="@/src/tutorial/basic/interacting/embedding/index.tsx"></code>

## Restrict Child Movement

Limit the movement range of child nodes within the parent by using the `translating.restrict` option when creating the `Graph` instance.

<code id="group-restrict" src="@/src/tutorial/intermediate/group/restrict/index.tsx"></code>

## Auto-expand Parent Node

Listen to `node:change:position` to automatically expand/shrink the parent when a child moves, ensuring it fully encompasses the children. The example code is a bit involved; click the demo’s `CodeSandbox` link to view the full implementation.

<code id="group-expand-shrink" src="@/src/tutorial/intermediate/group/expand-shrink/index.tsx"></code>

## Expand/Collapse Parent Node

First, define a custom `Group` node that renders an expand/collapse button at the top-left corner and sets a custom event `node:collapse` on that button:

```ts
import { Node } from '@antv/x6'

export class Group extends Node {
  private collapsed: boolean = false
  private expandSize: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      this.resize(100, 32)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this.collapsed = target
  }
}

Group.config({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
        },
      ],
    },
  ],
  attrs: {
    body: { ... },
    label: { ... },
    buttonGroup: { ... },
    button: {
      ...
      // Custom event
      event: 'node:collapse',
    },
    buttonSign: { ... },
  },
})
```

Then listen for `node:collapse` on the `graph`, and show/hide the corresponding child nodes when the parent node is expanded/collapsed:

```ts
graph.on('node:collapse', ({ node }: { node: Group }) => {
  node.toggleCollapse()
  const collapsed = node.isCollapsed()
  const cells = node.getDescendants()
  cells.forEach((node) => {
    if (collapsed) {
      node.hide()
    } else {
      node.show()
    }
  })
})
```

<code id="group-collapsable" src="@/src/tutorial/intermediate/group/collapsable/index.tsx"></code>
