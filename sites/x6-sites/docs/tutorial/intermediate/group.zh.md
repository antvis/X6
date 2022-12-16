---
title: 群组
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中，主要介绍组合相关的知识，通过阅读，你可以了解到：}

- 怎么组合节点
- 怎么通过交互方式组合节点
- 在群组内怎么限制子节点移动
- 怎么实现自动扩展父节点的效果
- 怎么实现展开、折叠父节点的效果
  :::

## 组合节点

我们可以通过父子组合来实现群组，并提供了一系列获取和设置组合关系的[方法](/zh/docs/api/model/cell#父子关系-parentchildren)。

<code id="group-embed-edge" src="@/src/tutorial/intermediate/group/embed-edge/index.tsx"></code>

从上面例子可以看出：

- 当移动父节点时子节点也会跟着移动，即便子节点位于父节点外部。
- 默认将边起始节点和终止节点的共同父节点作为边的父节点。移动父节点时，边的路径点将跟随移动

## 通过交互组合节点

有时候我们需要将一个节点拖动到另一个节点中，使其成为另一节点的子节点，这时我们可以通过 `embedding` 选项来开启，在节点被移动时通过 `findParent` 指定的方法返回父节点。更详细的配置参考 [API](/zh/docs/api/interacting/interacting#embedding)。

<code id="group-embedding" src="@/src/tutorial/basic/interacting/embedding/index.tsx"></code>

## 限制子节点的移动

有时候需要将子节点的移动范围限制在父节点内，可以在创建 `Graph` 实例时通过 `translating.restrict` 选项来实现。

<code id="group-restrict" src="@/src/tutorial/intermediate/group/restrict/index.tsx"></code>

## 自动扩展父节点

通过监听 `node:change:position` 事件，当节点移动时自动扩展/收缩父节点的大小，使父节点完全包围住子节点。这里代码稍微有些复杂，可以通过点击下面 demo 上的 `CodeSandbox` 链接打开查看详细代码。

<code id="group-expand-shrink" src="@/src/tutorial/intermediate/group/expand-shrink/index.tsx"></code>

## 展开与折叠父节点

首先，我们自定义了一个 `Group` 节点，该节点的左上角渲染了一个展开与折叠按钮，并在该按钮上设置了自定义事件 `node:collapse`：

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

然后，在 `graph` 上监听 `node:collapse` 事件，当父节点展开、折叠时显示、隐藏对应的子节点：

```ts
graph.on("node:collapse", ({ node }: { node: Group }) => {
  node.toggleCollapse();
  const collapsed = node.isCollapsed();
  const cells = node.getDescendants();
  cells.forEach((node) => {
    if (collapsed) {
      node.hide();
    } else {
      node.show();
    }
  });
});
```

<code id="group-collapsable" src="@/src/tutorial/intermediate/group/collapsable/index.tsx"></code>
