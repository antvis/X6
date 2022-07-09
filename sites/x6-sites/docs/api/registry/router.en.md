---
title: Router
order: 16
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/registry
---

路由将边的路径点 [vertices](/en/docs/tutorial/basic/edge#vertices) 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点（不包含边的起点和终点）。例如，经过 [`orth`](#orth) 路由处理后，边的每一条线段都是水平或垂直的正交线段。

我们在 `Registry.Router.presets` 命名空间中提供了以下几种路由。

| 路由名称  | 说明                                                                                                           |
|-----------|--------------------------------------------------------------------------------------------------------------|
| normal    | [默认路由](#normal)，原样返回路径点。                                                                            |
| orth      | [正交路由](#orth)，由水平或垂直的正交线段组成。                                                                  |
| oneSide   | [受限正交路由](#oneside)，由受限的三段水平或垂直的正交线段组成。                                                 |
| manhattan | [智能正交路由](#manhattan)，由水平或垂直的正交线段组成，并自动避开路径上的其他节点（障碍）。                        |
| metro     | [智能地铁线路由](#metro)，由水平或垂直的正交线段和斜角线段组成，类似地铁轨道图，并自动避开路径上的其他节点（障碍）。 |
| er        | [实体关系路由](#er)，由 `Z` 字形的斜角线段组成。                                                                 |

在使用时，可以为边设置路由：

```ts
const edge = graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: {
      side: 'right',
    },
  },
})
```

当路由没有参数时，也可以简化为：

```ts
const edge = graph.addEdge({
  source,
  target,
  router: 'oneSide',
})
```

也可以调用 [`edge.setRouter`]() 方法来设置路由：

```ts
edge.setRouter('oneSide', { side: 'right' })
```

在创建画布时，可以通过 `connecting` 选项来设置全局默认路由（画布的默认路由是 `'normal'`）:

```ts
new Graph({
  connecting: {
    router: { 
      name: 'oneSide',
      args: {
        side: 'right',
      },
    },
  },
})
```

当路由没有参数时，也可以简化为：

```ts
new Graph({
  connecting: {
    router: 'orth',
  },
})
```

下面我们一起来看看如何使用内置路由，以及如何自定并注册自定义路由。


## presets

### normal

系统的默认路由，该路由原样返回传入的 `vertices` 路径点。

### orth

正交路由，该路由在路径上添加额外的一些点，使边的每一条线段都水平或垂直正交。

支持的参数如下表：

| 参数名  | 参数类型    | 是否必选 | 默认值 | 参数说明                    |
|---------|-------------|:-------:|--------|-------------------------|
| padding | SideOptions |    否    | 20     | 设置锚点距离转角的最小距离。 |

`SideOptions` 定义如下：

```ts
export type SideOptions =
  | number
  | {
      vertical?: number
      horizontal?: number
      left?: number
      top?: number
      right?: number
      bottom?: number
    }
```

例如：

```ts
graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 }, 
    { x: 300, y: 120 },
  ],
  router: {
    name: 'orth',
    args: {
      padding: {
        left: 50,
      }
    }
  },
});
```

<iframe src="/demos/api/registry/router/orth"></iframe>

### oneSide

`'oneSide'` 路由是正交路由 `'orth'` 的受限版本，该路生成一个严格的三段路由：从起始节点的 `side` 侧开始，经过中间段，再从终止节点的 `side` 侧结束路由。需要特别注意的是，使用该路由时请不要同时指定 `vertices`，否则路由效果会非常差。

支持的参数如下表：

| 参数名  | 参数类型                                       | 是否必选 | 默认值     | 参数说明                                 |
|---------|------------------------------------------------|:-------:|------------|--------------------------------------|
| side    | `'left'` \| `'right'` \| `'top'` \| `'bottom'` |    否    | `'bottom'` | 路由的起始/结束方向，默认值为 `'bottom'`。 |
| padding | SideOptions                                    |    否    | 20         | 设置锚点距离转角的最小距离。              |


例如：

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'oneSide',
    args: { side: 'right' },
  },
})
```

<iframe src="/demos/api/registry/router/oneside"></iframe>

### manhattan

曼哈顿路由 `'manhattan'` 路由是正交路由 `'orth'` 的智能版本，该路由由水平或垂直的正交线段组成，并自动避开路径上的其他节点（障碍）。 

我们为该路由算法提供了丰富的选项：

| 参数名             | 参数类型                 | 是否必选 | 默认值                               | 参数说明                                                                                   |
|--------------------|--------------------------|:-------:|--------------------------------------|----------------------------------------------------------------------------------------|
| step               | number                   |    否    | `10`                                 | 路由算法步进步长，其值越小计算量越大。<br>推荐使用画布的网格大小（`graph.options.grid.size`）。 |
| excludeTerminals   | ('source' \| 'target')[] |    否    | `[]`                                 | 忽略起始或终止节点，忽略后不参与障碍物计算。                                                 |
| excludeShapes      | string[]                 |    否    | `[]`                                 | 忽略指定形状的节点，忽略后不参与障碍物计算。                                               |
| excludeNodes      | Node[]                 |    否    | `[]`                                 | 忽略的节点，忽略后不参与障碍物计算。                                               |
| excludeHiddenNodes | boolean                  |    否    | `false`                              | 忽略隐藏的节点，忽略后不参与障碍物计算。                                               |
| startDirections    | string[]                 |    否    | `['top', 'right', 'bottom', 'left']` | 支持从哪些方向开始路由。                                                                    |
| endDirections      | string[]                 |    否    | `['top', 'right', 'bottom', 'left']` | 支持从哪些方向结束路由。                                                                    |
| padding      | SideOptions                 |    否    | 20 | 设置锚点距离转角的最小距离，和 orth 路由配置一致。                                                                |


例如：

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'manhattan',
    args: { 
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```

<iframe src="/demos/api/registry/router/manhattan"></iframe>

### metro

地铁路由 `'metro'` 是曼哈顿路由 `manhattan` 的一个变种，它由水平或垂直的正交线段和斜角线段组成，类似地铁轨道图，并自动避开路径上的其他节点（障碍）。其选项与 [manhattan 路由](#manhattan)一样，但 `maxDirectionChange` 的默认值为 `45`，表示路由线段的最大倾斜角度为 `45` 度。

例如：

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'metro',
    args: { 
      startDirections: ['top'],
      endDirections: ['bottom'],
    },
  },
})
```

<iframe src="/demos/api/registry/router/metro"></iframe>

### er

实体关系路由 `'er'` 由 Z 字形的斜角线段组成，常用于表示 ER 图中的实体之间的连线。

支持的参数如下表：

| 参数名    | 参数类型                            | 是否必选 | 默认值    | 参数说明                                                                                        |
|-----------|-------------------------------------|:-------:|-----------|---------------------------------------------------------------------------------------------|
| offset    | number \| 'center'                  |    否    | `32`      | 路由的第一个点和最后一个点与节点之间的距离。当取值为 `'center'` 时，节点距离的中心作为路由点坐标。 |
| min       | number                              |    否    | `16`      | 路由的第一个点和最后一个点与节点之间的最小距离。                                                 |
| direction | `'T' | 'B' | 'L' | 'R' | 'H' | 'V'` |    否    | undefined | 路由方向，缺省时将自动选择最优方向。                                                              |

例如：

```ts
graph.addEdge({
  source,
  target,
  router: {
    name: 'er',
    args: {
      offset: 24,
    },
  },
})
```

<iframe src="/demos/api/registry/router/er"></iframe>


## registry

路由实际上是一个具有如下签名的函数，返回加工后的点。

```sign
export type Definition<T> = (
  this: EdgeView,
  vertices: Point.PointLike[],
  args: T,
  edgeView: EdgeView,
) => Point.PointLike[]
```

| 参数名   | 参数类型          | 参数说明    |
|----------|-------------------|---------|
| this     | EdgeView          | 边的视图。   |
| vertices | Point.PointLike[] | 边的路径点。 |
| args     | T                 | 路由参数。   |
| edgeView | EdgeView          | 边的视图。   |

并在 `Registry.Router.registry` 对象上提供了 [`register`](#register) 和 [`unregister`](#unregister) 两个方法来注册和删除路由。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册路由。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册路由。

### 自定义路由

我们可以按照上面规则来创建自定义路由，例如，实现随机走线的路由：

```ts
// 路由参数
interface RandomRouterArgs {
  bounces?: number
}

function randomRouter(vertices: Point.PointLike[], args: RandomRouterArgs, view: EdgeView) {
  const bounces = args.bounces || 20
  const points = vertices.map((p) => Point.create(p))

  for (var i = 0; i < bounces; i++) {
    const sourceCorner = view.sourceBBox.getCenter()
    const targetCorner = view.targetBBox.getCenter()
    const randomPoint = Point.random(
      sourceCorner.x,
      targetCorner.x,
      sourceCorner.y,
      targetCorner.y,
    )
    points.push(randomPoint)
  }

  return points
}
```

实际上，我们将 `Registry.Router.registry`  对象的 `register` 和 `unregister` 方法分别挂载为 `Graph` 的两个静态方法 `Graph.registerRouter` 和 `Graph.unregisterRouter`，所以我们可以像下面这样来注册路由：

```ts
Graph.registerRouter('random', randomRouter)
```

注册以后我们就可以通过路由名称来使用：

```ts
edge.setRouter('random', { bounces: 3 })
```

<iframe src="/demos/api/registry/router/random"></iframe>
