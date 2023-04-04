---
title: NodeAnchor
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

当连接到节点时，可以通过 NodeAnchor 来指定被连接的节点的锚点，锚点与连接点 [ConnectionPoint](/zh/docs/api/registry/connection-point) 共同确定了边的起点和终点。

- 起点：从第一个路径点或目标节点的中心（没有路径点时）画一条参考线到源节点的锚点，然后根据 [connectionPoint](/zh/docs/api/model/edge#source-和-target) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的起点。
- 终点：从最后一个路径点或源节点的中心（没有路径点时）画一条参考线到目标节点的锚点，然后根据 [connectionPoint](/zh/docs/api/model/edge#source-和-target) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的终点。

我们在 `Registry.NodeAnchor.presets` 命名空间中提供了以下几种锚点定义。

- [center](#center) 边链接的元素的中心点（默认值）。
- [top](#top) 边链接的元素的顶部中心点。
- [bottom](#bottom) 边链接的元素的底部中心点。
- [left](#left) 边链接的元素的左侧中心点。
- [right](#right) 边链接的元素的右侧中心点。
- [midSide](#midside) 边链接的元素的最近侧中心点。
- [topLeft](#topleft) 边链接的元素的左上角。
- [topRight](#topright) 边链接的元素的右上角。
- [bottomLeft](#bottomleft) 边链接的元素的左下角。
- [bottomRight](#bottomright) 边链接的元素的右下角。
- [orth](#orth) 正交点。
- [nodeCenter](#nodecenter) 节点的中心点。

<!-- <iframe src="/demos/api/registry/node-anchor/playground"></iframe> -->

可以在创建边时指定锚点：

```ts
const edge = graph.addEdge({
  source: {
    cell: "source-id",
    anchor: {
      name: "midSide",
      args: {
        dx: 10,
      },
    },
  },
  target: {
    cell: "target-id",
    anchor: "orth", // 没有参数时可以简化写法
  },
});
```

创建之后可以调用 `edge.setSource` 和 `edge.setTarget` 方法来修改锚点：

```ts
edge.setSource({
  cell: "source-id",
  anchor: {
    name: "midSide",
    args: {
      dx: 10,
    },
  },
});
```

在创建画布时，可以通过 `connecting` 选项来设置全局默认的锚点：

```ts
new Graph({
  connecting: {
    anchor: {
      name: "midSide",
      args: {
        dx: 10,
      },
    },
  },
});
```

没有参数时可以简化为：

```ts
new Graph({
  connecting: {
    anchor: "midSide",
  },
});
```

## presets

### center

元素中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### top

元素顶部中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### bottom

元素底部中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### left

元素左侧中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### right

元素右侧中心点，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### midSide

最靠近边的那一侧中心点，支持如下参数：

| 参数名    | 参数类型   | 是否必选 | 默认值  | 参数说明                                                                                 |
|-----------|------------|:-------:|---------|--------------------------------------------------------------------------------------|
| padding   | number     |    否    | `0`     | 通过放大元素的包围盒 `padding` 像素，来偏移中心点。                                        |
| rotate    | boolean    |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。                                   |
| direction | 'H' \| 'V' |    否    | -       | 连接点的方向，比如如果设置为 `H`，只能连接到节点的左侧或者右侧的中心点，会根据位置自动判断。 |

### topLeft

元素左上角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### topRight

元素右上角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### bottomLeft

元素左下角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### bottomRight

元素右下角，支持如下参数：

| 参数名 | 参数类型         | 是否必选 | 默认值  | 参数说明                                               |
|--------|------------------|:-------:|---------|----------------------------------------------------|
| dx     | number \| string |    否    | `0`     | X 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| dy     | number \| string |    否    | `0`     | Y 轴偏移量，支持数字绝对偏移量和百分比相对偏移量。       |
| rotate | boolean          |    否    | `false` | 是否使用元素跟随节点旋转后的包围盒，默认不考虑旋转角度。 |

### orth

正交点，支持如下参数：

| 参数名  | 参数类型 | 是否必选 | 默认值 | 参数说明    |
|---------|----------|:-------:|--------|---------|
| padding | number   |    否    | `0`    | X 轴偏移量。 |

### nodeCenter

节点的中心，支持如下参数：

| 参数名 | 参数类型 | 是否必选 | 默认值 | 参数说明    |
|--------|----------|:-------:|--------|---------|
| dx     | number   |    否    | `0`    | X 轴偏移量。 |
| dy     | number   |    否    | `0`    | Y 轴偏移量。 |

## registry

锚点定义是一个具有如下签名的函数，返回锚点。

```sign
export type Definition<T> = (
  this: EdgeView,
  nodeView: NodeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
  type: Edge.TerminalType,
) => Point
```

| 参数名   | 参数类型                      | 参数说明            |
|----------|-------------------------------|-------------------|
| this     | EdgeView                      | 边的视图。           |
| nodeView | NodeView                      | 连接的节点视图。     |
| magnet   | SVGElement                    | 连接的节点上的元素。 |
| ref      | Point.PointLike \| SVGElement | 参照点/元素。        |
| args     | T                             | 参数。               |
| type     | Edge.TerminalType             | 边的终端类型。       |

并在 `Registry.NodeAnchor.registry` 对象上提供了 [`register`](#register) 和 [`unregister`](#unregister) 两个方法来注册和取消注册锚点定义，同时也将这两个方法分别挂载为 Graph 上的两个静态方法 `Graph.registerAnchor` 和 `Graph.unregisterAnchor`。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册连锚点定义。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册锚点定义。
