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
- How to group nodes through interactive methods
- How to restrict the movement of child nodes within a group
- How to achieve the effect of automatically expanding parent nodes
- How to implement the effect of expanding and collapsing parent nodes
:::

## Group Nodes

We can implement groups through parent-child combinations and provide a series of [methods](/en/api/model/cell#parentchildren-relationship) to get and set these relationships.

<code id="group-embed-edge" src="@/src/tutorial/intermediate/group/embed-edge/index.tsx"></code>

From the example above, we can see that:

- When the parent node is moved, the child nodes will also move along with it, even if the child nodes are outside the parent node.
- By default, the common parent of the starting and ending nodes of an edge is considered the parent of the edge. When the parent node is moved, the path points of the edge will follow.

## Combining Nodes through Interaction

Sometimes we need to drag one node into another node to make it a child of the other node. In this case, we can enable the `embedding` option, which allows us to specify a method through `findParent` to return the parent node when the node is moved. For more detailed configuration, refer to the [API](/en/api/interacting/interacting#embedding).

<code id="group-embedding" src="@/src/tutorial/basic/interacting/embedding/index.tsx"></code>

## Restricting the Movement of Child Nodes

At times, we need to limit the movement range of child nodes within the parent node. This can be achieved by using the `translating.restrict` option when creating the `Graph` instance.

<code id="group-restrict" src="@/src/tutorial/intermediate/group/restrict/index.tsx"></code>

## Automatically Expanding the Parent Node

By listening to the `node:change:position` event, we can automatically expand or shrink the size of the parent node when the child node moves, ensuring that the parent node completely encompasses the child nodes. The code here is a bit complex; you can click the `CodeSandbox` link below the demo to view the detailed code.

<code id="group-expand-shrink" src="@/src/tutorial/intermediate/group/expand-shrink/index.tsx"></code>

## Expanding and Collapsing the Parent Node

First, we define a custom `Group` node, which renders an expand/collapse button in the top-left corner and sets a custom event `node:collapse` on that button:

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

Then, we listen for the `node:collapse` event on the `graph`, showing or hiding the corresponding child nodes when the parent node is expanded or collapsed:

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
