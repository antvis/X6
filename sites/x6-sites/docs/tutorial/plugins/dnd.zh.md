---
title: Dnd
order: 7
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=通过阅读本章节，你可以了解到：}

- 如何通过拖拽交互往画布中添加节点
  :::

## 使用

我们经常需要通过拖拽交互往画布中添加节点，如流程图编辑场景，从流程图组件库中拖拽组件到画布中。我们提供了一个独立的插件包 `@antv/x6-plugin-dnd` 来使用这个功能。

```shell
# npm
$ npm install @antv/x6-plugin-dnd --save

# yarn
$ yarn add @antv/x6-plugin-dnd
```

然后我们在代码中这样使用：

```ts
import { Dnd } from "@antv/x6-plugin-dnd";

const graph = new Graph({
  background: {
    color: "#F2F7FA",
  },
});

const dnd = new Dnd({
  target: graph,
});
```

当开始拖拽时，需要调用 `dnd.start(node, e)` 方法，在 `React` 中这样使用：

```tsx
export default () => {
  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 该 node 为拖拽的节点，默认也是放置到画布上的节点，可以自定义任何属性
    const node = graph.createNode({
      shape: "rect",
      width: 100,
      height: 40,
    });
    dnd.start(node, e.nativeEvent);
  };

  return (
    <ul>
      <li onMouseDown={startDrag}></li>
    </ul>
  );
};
```

## 演示

<code id="plugin-dnd" src="@/src/tutorial/plugins/dnd/index.tsx"></code>

## 配置

| 选项              | 类型                                                                                | 必选 | 默认值          | 说明                                                                                                  |
|-------------------|-------------------------------------------------------------------------------------|:----:|-----------------|-----------------------------------------------------------------------------------------------------|
| target            | Graph                                                                               |  ✓️  |                 | 目标画布。                                                                                             |
| getDragNode       | (sourceNode: Node, options: GetDragNodeOptions) => Node                             |      |                 | 拖拽开始时，获取被拖拽的节点，默认克隆 `dnd.start` 传入的节点。                                          |
| getDropNode       | (draggingNode: Node, options: GetDropNodeOptions) => Node                           |      |                 | 拖拽结束时，获取放置到目标画布的节点，默认克隆被拖拽的节点。                                             |
| validateNode      | (droppingNode: Node, options: ValidateNodeOptions) => boolean \| Promins\<boolean\> |      |                 | 拖拽结束时，验证节点是否可以放置到目标画布中。                                                          |
| dndContainer      | HTMLElement                                                                         |      |                 | 如果设置 `dndContainer`，在 `dndContainer` 上放开鼠标不会放置节点，常用于 `dnd` 容器处于画布上面的场景。 |
| draggingContainer | HTMLElement                                                                         |      | `document.body` | 自定义拖拽画布容器。                                                                                   |

## 常见问题

1. 为什么拖拽节点到画布后，ID 发生了改变

根据上面的拖拽细节我们会发现整体拖拽流程是：源节点 -> 拖拽节点 -> 放置节点，默认是将源节点克隆一份变为拖拽节点，拖拽节点克隆一份变为放置节点，在克隆的过程中会重置节点 ID，如果想保持原来节点 ID，可以进行以下操作：

```ts
// 这样放置到画布上的节点 ID 和 dnd start 传入的 node ID 一致
const dnd = new Dnd({
  getDragNode: (node) => node.clone({ keepId: true }),
  getDropNode: (node) => node.clone({ keepId: true }),
});
```

2.怎么自定义拖拽节点的样式？

```ts
const dnd = new Dnd({
  getDragNode(node) {
    // 这里返回一个新的节点作为拖拽节点
    return graph.createNode({
      width: 100,
      height: 100,
      shape: "rect",
      attrs: {
        body: {
          fill: "#ccc",
        },
      },
    });
  },
});
```

3.怎么自定义放置到画布上的节点样式？

```ts
const dnd = new Addon.Dnd({
  getDropNode(node) {
    const { width, height } = node.size();
    // 返回一个新的节点作为实际放置到画布上的节点
    return node.clone().size(width * 3, height * 3);
  },
});
```

4.怎么获取放置到画布上节点的位置？

```ts
graph.on("node:added", ({ node }) => {
  const { x, y } = node.position();
});
```

5. 怎么设置放置到画布上节点的 zIndex？
```ts
graph.on("node:added", ({ node }) => {
  node.setZIndex(5)
});
```