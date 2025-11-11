---
title: 群组
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中主要介绍组合相关的知识，通过阅读，你可以了解到}

- 如何组合节点
- 如何通过交互方式组合节点
- 如何在群组内限制子节点移动
- 如何自动扩展父节点
- 如何实现父节点的展开/折叠
:::

## 组合节点

我们可以通过父子关系来实现群组，并提供了一系列用于获取与设置组合关系的[方法](/api/model/cell#父子关系-parentchildren)。

<code id="group-embed-edge" src="@/src/tutorial/intermediate/group/embed-edge/index.tsx"></code>

从上述示例可以看出：

- 当移动父节点时子节点也会跟着移动，即便子节点位于父节点外部。
- 默认将边的起点和终点的共同父节点视为边的父节点。移动父节点时，边的路径点将跟随移动。

## 通过交互组合节点

有时需要将一个节点拖入另一个节点，使其成为后者的子节点。此时可以开启 `embedding` 选项，并在节点移动时通过 `findParent` 指定的方法返回父节点。详细配置参见 [API](/api/interacting/interacting#组合)。

<code id="group-embedding" src="@/src/tutorial/basic/interacting/embedding/index.tsx"></code>

## 限制子节点的移动

需要将子节点的移动范围限制在父节点内时，可在创建 `Graph` 实例时通过 `translating.restrict` 选项实现。

<code id="group-restrict" src="@/src/tutorial/intermediate/group/restrict/index.tsx"></code>

## 自动扩展父节点

监听 `node:change:position` 事件，在子节点移动时自动扩展/收缩父节点的尺寸，使父节点完全包围子节点。该示例代码略复杂，可通过下方 Demo 的 `CodeSandbox` 链接查看完整代码。

<code id="group-expand-shrink" src="@/src/tutorial/intermediate/group/expand-shrink/index.tsx"></code>

## 展开与折叠父节点

首先，我们自定义一个 `Group` 节点，在左上角渲染展开/折叠按钮，并为该按钮设置自定义事件 `node:collapse`：

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

随后，在 `graph` 上监听 `node:collapse` 事件，根据父节点的展开/折叠状态显示或隐藏对应的子节点：

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
