---
title: ConnectionPoint
order: 12
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

连接点 ConnectionPoint 与锚点 [Anchor](/zh/docs/api/registry/node-anchor) 共同确定了边的起点或终点。

- 起点：从第一个路径点或目标节点的中心（没有路径点时）画一条参考线到源节点的锚点，然后根据 [connectionPoint](/zh/docs/api/model/edge#source-和-target) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的起点。
- 终点：从最后一个路径点或源节点的中心（没有路径点时）画一条参考线到目标节点的锚点，然后根据 [connectionPoint](/zh/docs/api/model/edge#source-和-target) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的终点。

我们在 `Registry.ConnectionPoint.presets` 命名空间中提供了以下几种连接点计算方法。

- [`'boundary'`](#boundary) 默认值，与链接图形的边框的交点。
- [`'bbox'`](#bbox) 与链接元素的包围盒的交点。
- [`'rect'`](#rect) 与链接元素的旋转后的矩形区域的交点。
- [`'anchor'`](#anchor) 使用锚点作为连接点。

<!-- <iframe src="/demos/api/registry/connection-point/playground"></iframe> -->

可以在创建边时指定连接点：

```ts
const edge = graph.addEdge({
  source: {
    cell: "source-id",
    connectionPoint: {
      name: "boundary",
      args: {
        sticky: true,
      },
    },
  },
  target: {
    cell: "target-id",
    connectionPoint: "boundary", // 没有参数时可以简化写法
  },
});
```

创建之后可以调用 `edge.setSource` 和 `edge.setTarget` 方法来修改连接点：

```ts
edge.setSource({
  cell: "source-id",
  connectionPoint: {
    name: "boundary",
    args: {
      sticky: true,
    },
  },
});
```

在创建画布时，可以通过 `connecting` 选项来设置全局默认的连接点：

```ts
new Graph({
  connecting: {
    connectionPoint: {
      name: "boundary",
      args: {
        sticky: true,
      },
    },
  },
});
```

没有参数时可以简化为：

```ts
new Graph({
  connecting: {
    connectionPoint: "boundary",
  },
});
```

## presets

### boundary

自动识别链接图形的边框，并计算参照点与锚点（Anchor）形成的直线与边框的交点。如 `<ellipse>` 元素将被识别为椭圆，并求椭圆与直线的交点，求得的交点为边的连接点。不能识别的元素（`text`、`<path>` 等）使用图形的包围盒代替，这与使用 `'bbox'` 求得的连接点一样。

支持的参数如下表：

| 参数名      | 参数类型                  | 是否必选 | 默认值      | 参数说明                                                                                                                    |
| ----------- | ------------------------- | :------: | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| offset      | number \| Point.PointLike |    否    | `0`         | 连接点的偏移量。                                                                                                            |
| stroked     | boolean                   |    否    | `true`      | 是否考虑图形的边框宽度。                                                                                                    |
| insideout   | boolean                   |    否    | `true`      | 当参考线位于图形内部且没有交点时，是否延长参考线求交点，默认为 `true`。                                                     |
| extrapolate | boolean                   |    否    | `false`     | 当参考线位于图形外部且没有交点时，是否延长参考线求交点，延长后也可能没有交点，默认为 `false`。此参数的优先级高于 `sticky`。 |
| sticky      | boolean                   |    否    | `false`     | 当参考线位于图形外部且没有交点时，是否使用边框上离参考线最最近的点作为交点，默认为 `false`。                                |
| precision   | number                    |    否    | `2`         | 交点计算的精度。                                                                                                            |
| selector    | string                    |    否    | `undefined` | 选择器，用于标识一个元素，使用该元素的边框来计算交点。默认使用节点中第一个不在 `<g>` 元素内的子元素。                       |

### anchor

将锚点作为连接点，支持如下参数：

| 参数名 | 参数类型                  | 是否必选 | 默认值 | 参数说明         |
| ------ | ------------------------- | :------: | ------ | ---------------- |
| offset | number \| Point.PointLike |    否    | `0`    | 连接点的偏移量。 |

### bbox

图形的包围盒与参考线的交点，支持如下参数：

| 参数名  | 参数类型                  | 是否必选 | 默认值  | 参数说明                 |
| ------- | ------------------------- | :------: | ------- | ------------------------ |
| offset  | number \| Point.PointLike |    否    | `0`     | 连接点的偏移量。         |
| stroked | boolean                   |    否    | `false` | 是否考虑图形的边框宽度。 |

### rect

图形旋转后的矩形区域与参考线的交点，支持如下参数：

| 参数名  | 参数类型                  | 是否必选 | 默认值  | 参数说明                 |
| ------- | ------------------------- | :------: | ------- | ------------------------ |
| offset  | number \| Point.PointLike |    否    | `0`     | 连接点的偏移量。         |
| stroked | boolean                   |    否    | `false` | 是否考虑图形的边框宽度。 |

## registry

连接点定义是一个具有如下签名的函数，返回连接点。

```sign
export type Definition<T> = (
  line: Line,
  view: NodeView,
  magnet: SVGElement,
  args: T,
) => Point
```

| 参数名   | 参数类型   | 参数说明             |
| -------- | ---------- | -------------------- |
| line     | Line       | 参考线。             |
| nodeView | NodeView   | 连接的节点视图。     |
| magnet   | SVGElement | 连接的节点上的元素。 |
| args     | T          | 参数。               |

并在 `Registry.ConnectionPoint.registry` 对象上提供了 [`register`](#register) 和 [`unregister`](#unregister) 两个方法来注册和取消注册连接点定义，同时也将这两个方法分别挂载为 Graph 上的两个静态方法 `Graph.registerConnectionPoint` 和 `Graph.unregisterConnectionPoint`。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册连连接点定义。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册连接点定义。
