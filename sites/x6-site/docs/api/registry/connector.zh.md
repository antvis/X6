---
title: Connector
order: 18
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

连接器将起点、路由返回的点、终点加工为 `<path>` 元素的 [`d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) 属性，决定了边渲染到画布后的样式。我们在 `Registry.Connector.presets` 命名空间中提供了以下几种连接器。

| 连接器   | 说明                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| normal   | [简单连接器](#normal)，用直线连接起点、路由点和终点。                                      |
| smooth   | [平滑连接器](#smooth)，用三次贝塞尔曲线线连接起点、路由点和终点。                          |
| rounded  | [圆角连接器](#rounded)，用直线连接起点、路由点和终点，并在线段连接处用圆弧链接（倒圆角）。 |
| jumpover | [跳线连接器](#jumpover)，用直线连接起点、路由点和终点，并在边与边的交叉处用跳线符号链接。  |

可以为某条边设置路由：

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: {
    name: "rounded",
    args: {
      radius: 20,
    },
  },
});
```

当没有连接器参数时，可以简化为：

```ts
const edge = graph.addEdge({
  source,
  target,
  connector: "rounded",
});
```

也可以调用 `edge.setConnector` 来设置连接器：

```ts
edge.setConnector("rounded", { radius: 20 });
```

在创建画布时，可以通过 `connecting` 选项来设置全局默认连接器（默认为 `'normal'`）：

```ts
new Graph({
  connecting: {
    connector: {
      name: "rounded",
      args: {
        radius: 20,
      },
    },
  },
});
```

当路由没有参数时，也可以简化为：

```ts
new Graph({
  connecting: {
    connector: "rounded",
  },
});
```

下面我们一起来看看如何使用内置连接器，以及如何自定并注册自定义连接器。

## presets

### normal

系统的默认连接器，将起点、路由点、终点通过直线按顺序连接。

支持的参数如下表：

| 参数名 | 参数类型 | 是否必选 | 默认值  | 参数说明                                                          |
| ------ | -------- | :------: | ------- | ----------------------------------------------------------------- |
| raw    | boolean  |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。 |

<!-- <iframe src="/demos/api/registry/connector/normal"></iframe> -->

### smooth

平滑连接器，通过三次贝塞尔链接起点、路由点和终点。

支持的参数如下表：

| 参数名    | 参数类型   | 是否必选 | 默认值  | 参数说明                                                           |
| --------- | ---------- | :------: | ------- | ------------------------------------------------------------------ |
| raw       | boolean    |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。  |
| direction | `H` \| `V` |    否    | -       | 保持水平连接或者保持垂直连接，不设置会根据起点和终点位置动态计算。 |

例如：

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: "smooth",
});
```

<!-- <iframe src="/demos/api/registry/connector/smooth"></iframe> -->

### rounded

圆角连接器，将起点、路由点、终点通过直线按顺序连接，并在线段连接处通过圆弧连接（倒圆角）。

支持的参数如下表：

| 参数名 | 参数类型 | 是否必选 | 默认值  | 参数说明                                                          |
| ------ | -------- | :------: | ------- | ----------------------------------------------------------------- |
| radius | number   |    否    | `10`    | 倒角半径。                                                        |
| raw    | boolean  |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。 |

例如：

```ts
graph.addEdge({
  source: rect1,
  target: rect2,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: {
    name: "rounded",
    args: {
      radius: 10,
    },
  },
});
```

<!-- <iframe src="/demos/api/registry/connector/rounded"></iframe> -->

### jumpover

跳线连接器，用直线连接起点、路由点和终点，并在边与边的交叉处用跳线符号链接。

支持的参数如下表：

| 参数名 | 参数类型                  | 是否必选 | 默认值  | 参数说明                                                          |
| ------ | ------------------------- | :------: | ------- | ----------------------------------------------------------------- |
| type   | 'arc' \| 'gap' \| 'cubic' |    否    | `'arc'` | 跳线类型。                                                        |
| size   | number                    |    否    | `5`     | 跳线大小。                                                        |
| radius | number                    |    否    | `0`     | 倒角半径。                                                        |
| raw    | boolean                   |    否    | `false` | 是否返回一个 `Path` 对象，默认值为 `false` 返回序列化后的字符串。 |

<!-- <iframe src="/demos/api/registry/connector/jumpover"></iframe> -->

## registry

连接器是一个具有如下签名的函数，返回 `Path` 对象或序列化后的字符串。

```sign
export type Definition<T> = (
  this: EdgeView,                 // 边的视图
  sourcePoint: Point.PointLike,   // 起点
  targetPoint: Point.PointLike,   // 终点
  routePoints: Point.PointLike[], // 路由返回的点
  args: T,                        // 参数
  edgeView: EdgeView,             // 边的视图
) => Path | string
```

| 参数名      | 参数类型          | 参数说明       |
| ----------- | ----------------- | -------------- |
| this        | EdgeView          | 边的视图。     |
| sourcePoint | Point.PointLike   | 起点。         |
| targetPoint | Point.PointLike   | 终点。         |
| routePoints | Point.PointLike[] | 路由返回的点。 |
| args        | T                 | 连接器参数。   |
| edgeView    | EdgeView          | 边的视图。     |

并在 `Registry.Connector.registry` 对象上提供了 [`register`](#register) 和 [`unregister`](#unregister) 两个方法来注册和取消注册连接器。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册连接器。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册连接器。

### 自定义连接器

按照上面的规则，我来定义一个 `wobble` 连接器：

```ts
export interface WobbleArgs {
  spread?: number;
  raw?: boolean;
}

function wobble(
  sourcePoint: Point.PointLike,
  targetPoint: Point.PointLike,
  routePoints: Point.PointLike[],
  args: WobbleArgs
) {
  const spread = args.spread || 20;
  const points = [...vertices, targetPoint].map((p) => Point.create(p));
  let prev = Point.create(sourcePoint);
  const path = new Path(Path.createSegment("M", prev));

  for (let i = 0, n = points.length; i < n; i += 1) {
    const next = points[i];
    const distance = prev.distance(next);
    let d = spread;

    while (d < distance) {
      const current = prev.clone().move(next, -d);
      current.translate(
        Math.floor(7 * Math.random()) - 3,
        Math.floor(7 * Math.random()) - 3
      );
      path.appendSegment(Path.createSegment("L", current));
      d += spread;
    }

    path.appendSegment(Path.createSegment("L", next));
    prev = next;
  }

  return args.raw ? path : path.serialize();
}
```

实际上，我们将 `Registry.Connector.registry` 对象的 `register` 和 `unregister` 方法分别挂载为 `Graph` 的两个静态方法 `Graph.registerConnector` 和 `Graph.unregisterConnector`，所以我们可以像下面这样来注册连接器：

```ts
Graph.registerConnector("wobble", wobble);
```

注册以后我们就可以通过连接器名称来使用：

```ts
edge.setConnector("wobble", { spread: 16 });
```

<!-- <iframe src="/demos/api/registry/connector/wobble"></iframe> -->
