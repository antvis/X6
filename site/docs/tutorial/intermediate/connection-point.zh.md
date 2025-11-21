---
title: 连接点
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title=在本章节中主要介绍连接点相关的知识，通过阅读，你可以了解到}

- 锚点和连接点的概念
- 如何使用锚点和连接点定制特殊连线

:::

先看一个例子：

<code id="connection-point-multi" src="@/src/tutorial/intermediate/connection-point/multi/index.tsx"></code>

当我们移动上面的节点时，会发现边与节点的连接位置保持不变，且多条边之间存在间隔。这与之前示例的现象完全不同。这是怎么实现的？下面通过一张图理解 `锚点` 和 `连接点`。

## 介绍

默认情况下，锚点为 `center`（元素中心）。连接点用于计算交点，默认值为 `boundary`（与元素边框的交点）。因此，边会以起点元素的锚点到终点元素的锚点连一条参考线；参考线与元素的交点由 `connectionPoint` 指定的计算方法得到，该交点即为边的起点/终点。

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*RhX1SYh1K-QAAAAAAAAAAAAAARQnAQ" alt="连接点" width="500" />

## 使用方式

锚点 `anchor` 和连接点 `connectionPoint` 都有两种使用方式，第一种是在 `connecting` 中配置，全局生效。第二种是在创建边时在 `source`、`target` 中指定。

```ts
// 在 connecting 中配置
const graph = new Graph({
  connecting: {
    sourceAnchor: {
      name: 'right', // 锚点会在节点右侧中心向上偏移 10px
      args: {
        dy: -10,
      },
    },
    targetAnchor: {
      name: 'right', // 锚点会在节点右侧中心向上偏移 10px
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})

// 也可以在创建连线时配置，且其优先级更高
graph.addEdge({
  source: {
    cell: source,
    anchor: {
      name: 'right',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
  target: {
    cell: target,
    anchor: {
      name: 'left',
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})
```

当然，X6 还支持丰富的锚点和连接点类型，如需定制特殊连线，可参考 [NodeAnchor](/api/registry/node-anchor) 和 [ConnectionPoint](/api/registry/connection-point)。
