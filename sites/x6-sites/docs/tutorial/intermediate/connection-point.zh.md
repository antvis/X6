---
title: 连接点
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/intermediate
---

:::info{title=在本章节中主要介绍连接点相关的知识,通过阅读,你可以了解到}

- 锚点和连接点的概念
- 如何使用锚点和连接点定制一些特殊连线 :::

我们从一个例子出发：

<code id="connection-point-multi" src="@/src/tutorial/intermediate/connection-point/multi/index.tsx"></code>

当我们移动上面的节点时，会发现边和节点的连接位置一直保持不变，而且多条边之间还有间隔，这和之前例子中的现象完全不一样，这个是怎么实现的呢？下面通过一张图来了解`锚点`和`连接点`。

## 介绍

默认情况下，锚点为 `center`，也就是在元素中心，连接点是一种计算交点的方式，默认为 `boundary`，也就是计算与元素边框的交点。所以说边就是从起始元素的锚点向目标元素的锚点引一条参考线，参考线与元素之间通过`连接点`指定的计算方法求得交点，这个交点就是边的起点和终点。

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*RhX1SYh1K-QAAAAAAAAAAAAAARQnAQ" alt="连接点" width="500" />

## 使用方式

锚点 `anchor` 和连接点 `connectionPoint` 都有两种使用方式，第一种是在 `connecting` 中配置，全局生效。第二种是在创建边时在 `source`、`target` 中指定。

```ts
// 在 connecting 中配置
const graph = new Graph({
  connecting: {
    sourceAnchor: {
      name: 'right', // 锚点会在节点右侧中心往上偏移 10px
      args: {
        dy: -10,
      },
    },
    targetAnchor: {
      name: 'right', // 锚点会在节点右侧中心往上偏移 10px
      args: {
        dy: -10,
      },
    },
    connectionPoint: 'anchor',
  },
})

// 也可以在创建连线的时候配置，优先级更高
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

当然，X6 还支持非常多的锚点和连接点类型，如果要定制特殊的连接边，可以参考 [NodeAnchor](/zh/docs/api/registry/node-anchor) 和 [ConnectionPoint](/zh/docs/api/registry/connection-point)。
