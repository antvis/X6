---
title: 群组 Group
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

## 基础嵌套

我们可以通过父子嵌套来实现群组，并提供了一系列获取和设置嵌套关系的[方法](../../api/model/cell#父子关系-parentchildren)。

```ts
const child = graph.addNode({
  x: 120,
  y: 80,
  width: 120,
  height: 60,
  zIndex: 10,
  label: 'Child\n(embedded)',
  attrs: {
    body: {
      fill: 'green',
    },
    label: {
      fill: '#fff',
    },
  },
})

const parent = graph.addNode({
  x: 80,
  y: 40,
  width: 320,
  height: 240,
  zIndex: 1,
  label: 'Parent\n(try to move me)',
})

parent.addChild(child)
```

<iframe src="/demos/tutorial/basic/group/inside"></iframe>

需要注意的是，子节点的位置是相对画布左上角的位置，我们并没有提供相对父节点的相对定位方法。在上面例子中，我们通过绝对定位和 `zIndex` 使子节点看起来像位于父节点内部一样，当移动父节点时子节点也会跟着移动。实际上，即便子节点位于父节点外部，移动父节点时子节点也将跟着移动。

<iframe src="/demos/tutorial/basic/group/outside"></iframe>

创建边时，默认将起始节点和终止节点的共同父节点作为边的父节点。移动父节点时，边的路径点将跟随移动。

```ts
parent.addChild(source)
parent.addChild(target)

graph.addEdge({
  source,
  target,
  vertices: [
    { x: 120, y: 60 },
    { x: 200, y: 100 },
  ],
})
```

<iframe src="/demos/tutorial/basic/group/embed-edge"></iframe>

## 通过交互创建嵌套

有时候我们需要将一个节点拖动到另一个节点中，使其成为另一节点的子节点，这时我们可以通过 `embedding` 选项来开启，在节点被移动时通过 `findParent` 指定的方法返回父节点。

```ts
new Graph({
  embedding: {
    enabled: true,
    findParent({ node }) {
      const bbox = node.getBBox()
      return this.getNodes().filter((node) => {
        // 只有 data.parent 为 true 的节点才是父节点
        const data = node.getData<any>()
        if (data && data.parent) {
          const targetBBox = node.getBBox()
          return bbox.intersect(targetBBox)
        }
        return false
      })
    }
  }
})
```

<iframe src="/demos/tutorial/basic/group/embedding"></iframe>

## 限制子节点的移动

有时候需要将子节点的移动范围限制在父节点内，可以在创建 `Graph` 实例时通过 `translating.restrict` 选项来实现。

```ts
const graph = new Graph({
  container: this.container,
  translating: {
    restrict(view) {
      const cell = view.cell
      if (cell.isNode()) {
        const parent = cell.getParent()
        if (parent) {
          return parent.getBBox()
        }
      }

      return null
    },
  },
})
```

<iframe src="/demos/tutorial/basic/group/restrict"></iframe>

## 自动扩展父节点

通过监听 `node:change:position` 事件，当节点移动时自动扩展/收缩父节点的大小，使父节点完全包围住字节点。

```ts
graph.on('node:change:size', ({ node, options }) => {
  if (options.skipParentHandler) {
    return
  }

  const children = node.getChildren()
  if (children && children.length) {
    node.prop('originSize', node.getSize())
  }
})

graph.on('node:change:position', ({ node, options }) => {
  if (options.skipParentHandler) {
    return
  }

  const children = node.getChildren()
  if (children && children.length) {
    node.prop('originPosition', node.getPosition())
  }

  const parent = node.getParent()
  if (parent && parent.isNode()) {
    let originSize = parent.prop('originSize')
    if (originSize == null) {
      parent.prop('originSize', parent.getSize())
    }
    originSize = parent.prop('originSize')

    let originPosition = parent.prop('originPosition')
    if (originPosition == null) {
      parent.prop('originPosition', parent.getPosition())
    }
    originPosition = parent.prop('originPosition')

    let x = originPosition.x
    let y = originPosition.y
    let cornerX = originPosition.x + originSize.width
    let cornerY = originPosition.y + originSize.height
    let hasChange = false

    const children = parent.getChildren()
    if (children) {
      children.forEach((child) => {
        const bbox = child.getBBox()
        const corner = bbox.getCorner()

        if (bbox.x < x) {
          x = bbox.x
          hasChange = true
        }

        if (bbox.y < y) {
          y = bbox.y
          hasChange = true
        }

        if (corner.x > cornerX) {
          cornerX = corner.x
          hasChange = true
        }

        if (corner.y > cornerY) {
          cornerY = corner.y
          hasChange = true
        }
      })
    }


    if (hasChange) {
      parent.prop(
        {
          position: { x, y },
          size: { width: cornerX - x, height: cornerY - y },
        },
        // Note that we also pass a flag so that we know we shouldn't 
        // adjust the `originPosition` and `originSize` in our handlers.
        { skipParentHandler: true },
      )
    }
  }
})
```

<iframe src="/demos/tutorial/basic/group/expand-shrink"></iframe>

## 展开/折叠父节点

首先，我们自定义了一个 `Group` 节点，该节点的左上角渲染了一个展开/折叠按钮，并在该按钮上设置了自定义事件 `'node:collapse'`：

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
      // 自定义事件
      event: 'node:collapse',
    },
    buttonSign: { ... },
  },
})
```

然后，在 `graph` 上监听 `node:collapse` 事件，当父节点展开/折叠时显示/隐藏对应的子节点：

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

<iframe src="/demos/tutorial/basic/group/collapsable"></iframe>
