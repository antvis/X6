---
title: 边的锚点
order: 9
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

当边连接到边时，可以通过 EdgeAnchor 来指定被连接的边上的锚点，锚点与连接点 [ConnectionPoint](/zh/docs/api/registry/connection-point) 共同确定了边的起点和终点。

- 起点：从第一个路径点或目标节点的中心（没有路径点时）画一条参考线到源节点的锚点，然后根据 [connectionPoint](/zh/docs/api/registry/connection-point) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的起点。
- 终点：从最后一个路径点或源节点的中心（没有路径点时）画一条参考线到目标节点的锚点，然后根据 [connectionPoint](/zh/docs/api/registry/connection-point) 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的终点。

X6 内置了以下几种锚点定义。

- [ratio](#ratio) 默认值，锚点位于被连接的边的指定比例处。
- [length](#length) 锚点位于被连接的边的指定长度处。
- [closest](#closest) 使用距离参照点最近的点作为锚点。
- [orth](#orth) 正交锚点。

<code id="edge-anchor-playground" src="@/src/api/edge-anchor/playground/index.tsx"></code>

## 内置锚点

### ratio

锚点位于被连接的边的指定比例处。支持如下参数：

| 参数名 | 参数类型 | 是否必选 | 默认值 | 参数说明                                       |
|--------|----------|:-------:|--------|--------------------------------------------|
| ratio  | number   |    否    | `0.5`  | 距离边起点多少比例位置处，默认位于边长度的中心。 |

### length

锚点位于被连接的边的指定长度处。支持如下参数：

| 参数名 | 参数类型 | 是否必选 | 默认值 | 参数说明                                               |
|--------|----------|:-------:|--------|----------------------------------------------------|
| length | number   |    否    | `20`   | 距离边的起点多少长度位置处，默认位于偏离起点 `20px` 处。 |

### closest

距离参照点最近的点作为锚点。

### orth

正交锚点。支持如下参数：

| 参数名     | 参数类型         | 是否必选 | 默认值      | 参数说明                                                                                                                                                                                     |
|------------|------------------|:-------:|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fallbackAt | number \| string |    否    | `undefined` | 当没有正交点时，使用 `fallbackAt` 指定的点作为锚点。<br>当 `fallbackAt` 为百分比字符串时，表示锚点位于距离起点多少比例位置处。 <br> 当 `fallbackAt` 为数字时，表示锚点位于距离起点多少长度位置处。 |

## 自定义锚点

边的锚点定义是一个具有如下签名的函数，返回锚点。

```ts
export type Definition<T> = (
  this: EdgeView,
  view: EdgeView,
  magnet: SVGElement,
  ref: Point.PointLike | SVGElement,
  args: T,
) => Point
```

| 参数名 | 参数类型                      | 参数说明        |
|--------|-------------------------------|---------------|
| this   | EdgeView                      | 边的视图。       |
| view   | EdgeView                      | 连接的边的视图。 |
| magnet | SVGElement                    | 连接的边的元素。 |
| ref    | Point.PointLike \| SVGElement | 参照点/元素。    |
| args   | T                             | 参数。           |

完成锚点定义后，我们先注册锚点：

```ts
Graph.registerEdgeAnchor('custom-anchor', ...)
```

注册以后我们就可以通过锚点名称来使用：

```ts
new Graph({
  connecting: {
    edgeAnchor: {
      name: 'custom-anchor',
    },
  },
})
```