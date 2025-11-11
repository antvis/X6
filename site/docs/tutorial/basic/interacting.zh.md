---
title: 交互
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=本章节主要介绍元素交互相关的知识，通过阅读，你可以了解到}

- 如何设置连线交互规则
- 节点之间怎么嵌入
- 怎么配置高亮样式
- 怎么禁止、启用一些交互动作

:::

## 连线

连线交互规则都是通过 `connecting` 配置来完成，完整的配置参考 [API](/api/model/interaction#连线)。下面介绍一些常用的功能。

### allowXXX

可以通过 `allowXXX` 配置来定义连线能否连接到对应的位置。默认支持以下项：

- `allowBlank`：是否允许连接到画布空白处，默认为 `true`。
- `allowLoop`：是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 `true`。
- `allowNode`：是否允许边连接到节点（非节点上的连接桩），默认为 `true`。
- `allowEdge`：是否允许边连接到另一个边，默认为 `true`。
- `allowPort`：是否允许边连接到连接桩，默认为 `true`。
- `allowMulti`：是否允许在相同的起始节点和终止节点之间创建多条边，默认为 `true`。

它们的值都支持以下两种类型：

```ts
new Graph({
  connecting: {
    allowNode: true, // boolean
  },
})

// 函数形式，多用于动态控制连接限制
new Graph({
  connecting: {
    allowNode(args) {
      return true
    },
  },
})
```

:::info{title=提示}
`allowMulti` 支持设置为字符串 `withPort`，代表在起始和终止节点的相同连接桩之间只允许创建一条边（即起始和终止节点之间可以创建多条边，但必须要连接在不同的连接桩上）。
:::

<code id="interacting-connection" src="@/src/tutorial/basic/interacting/connecting/index.tsx"></code>

### router/connector

在[边教程](/tutorial/basic/edge#router)中我们知道，可以在添加边的时候指定 `router` 和 `connector`，如果整个画布中大部分边的 `router` 或者 `connector` 是一样的，我们可以直接配置在 `connecting` 中，这样就可以避免在边中重复配置。

```ts
new Graph({
  connecting: {
    router: 'orth',
    connector: 'rounded',
  },
})
```

### createEdge

在上面的 demo 中，我们可以从节点、连接桩拉出一条连线出来，那你可能会问，什么样的元素能拉出连线呢？这是 X6 设计非常巧妙的一个地方，只要具备 `magnet=true` 属性的元素，都可以拉出连线。而且在 `connecting` 中可以通过 `createEdge` 方法配置拉出连线的样式。

```ts
new Graph({
  connecting: {
    createEdge() {
      return this.createEdge({
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    },
  },
})
```

### validateXXX

我们还可以通过 `validateXXX` 方法来定义是否能创建连线或者连线是否有效。相比 `allowXXX`，`validateXXX` 更具备灵活性。默认支持以下项：

- `validateMagnet`：点击 `magnet=true` 的元素时 根据 `validateMagnet` 返回值来判断是否新增边，触发时机是元素被按下，如果返回 `false`，则没有任何反应，如果返回 `true`，会在当前元素创建一条新的边。
- `validateConnection`：在移动边的时候判断连接是否有效，如果返回 `false`，当鼠标放开的时候，不会连接到当前元素，常常配合[高亮](/tutorial/basic/interacting#高亮)功能一起使用。
- `validateEdge`：当停止拖动边的时候根据 `validateEdge` 返回值来判断边是否生效，如果返回 `false`，该边会被清除。

<code id="interacting-validate" src="@/src/tutorial/basic/interacting/validate/index.tsx"></code>

## 组合

有时候我们需要将一个节点拖动到另一个节点中，使其成为另一节点的子节点，这时我们可以通过 `embedding` 选项来开启，在节点被移动时通过 `findParent` 指定的方法返回父节点。更详细的配置参考 [API](/api/model/interaction#组合)。

```ts
const graph = new Graph({
  embedding: {
    enabled: true,
    findParent({ node }) {
      // 获取移动节点的包围盒
      const bbox = node.getBBox()
      // 找到 data 中配置 { parent: true } 的节点，并且移动节点和找到的节点包围盒相交时，返回 true
      return this.getNodes().filter((node) => {
        const data = node.getData<{ parent: boolean }>()
        if (data && data.parent) {
          const targetBBox = node.getBBox()
          return bbox.isIntersectWithRect(targetBBox)
        }
        return false
      })
    },
  },
})
```

<code id="interacting-embedding" src="@/src/tutorial/basic/interacting/embedding/index.tsx"></code>

## 高亮

可以通过 `highlighting` 选项来指定触发某种交互时的高亮样式，如：

```ts
new Graph({
  highlighting: {
    // 连接桩可以被连接时在连接桩外围渲染一个包围框
    magnetAvailable: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#A4DEB1',
          strokeWidth: 4,
        },
      },
    },
    // 连接桩吸附连线时在连接桩外围渲染一个包围框
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#31d0c6',
          strokeWidth: 4,
        },
      },
    },
  },
})
```

支持的 `highlighting` 配置项有：

- `default` 默认高亮选项，当以下几种高亮配置缺省时被使用。
- `embedding` 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用。
- `nodeAvailable` 连线过程中，节点可以被链接时被使用。
- `magnetAvailable` 连线过程中，连接桩可以被链接时被使用。
- `magnetAdsorbed` 连线过程中，自动吸附到连接桩时被使用。

上面 `magnetAvailable.name` 其实是高亮器的名称，X6 内置了 `stroke` 和 `className` 两种高亮器，详细信息参考 [Highlighter](/api/registry/highlighter)。

<code id="interacting-highlighting" src="@/src/tutorial/basic/interacting/highlighting/index.tsx"></code>

## 交互限制

可以通过配置 `interacting` 来启动、禁用一些元素的交互行为，如果画布上元素纯预览，不能进行任何交互，可以直接设置为 `false`。

```ts
new Graph({
  interacting: false,
})
```

如果需要更细节的定义允许哪些交互、禁用哪些交互，我们可以针对不同的属性值进行配置，支持的属性包括：

- `nodeMovable` 节点是否可以被移动。
- `magnetConnectable` 当在具有 `magnet` 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
- `edgeMovable` 边是否可以被移动。
- `edgeLabelMovable` 边的标签是否可以被移动。
- `arrowheadMovable` 边的起始/终止箭头（在使用 arrowhead 工具后）是否可以被移动。
- `vertexMovable` 边的路径点是否可以被移动。
- `vertexAddable` 是否可以添加边的路径点。
- `vertexDeletable` 边的路径点是否可以被删除。

它们的值都支持以下两种类型：

```ts
// 直接设置为 boolean 值
new Graph({
  interacting: {
    nodeMovable: false,
    edgeMovable: true,
  },
})

// 函数形式，多用于动态控制交互行为
new Graph({
  interacting: {
    nodeMovable(view) {
      const node = view.cell
      const { enableMove } = node.getData()
      return enableMove
    },
  },
})
```

<code id="interacting-interacting" src="@/src/tutorial/basic/interacting/interacting/index.tsx"></code>
