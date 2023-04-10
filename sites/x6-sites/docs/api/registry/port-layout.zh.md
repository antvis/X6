---
title: PortLayout
order: 13
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

连接桩布局算法是一个函数具有如下签名的函数，返回连接桩相对于节点的相对位置。例如，某节点在画布的位置是 `{ x: 30, y: 40 }`，如果返回的某个连接桩的位置是 `{ x: 2, y: 4 }`，那么该连接桩渲染到画布后的位置是 `{ x: 32, y: 44 }`。

```ts
type Definition<T> = (
  portsPositionArgs: T[],  // 连接桩中指定的布局算法参数
  elemBBox: Rectangle,     // 节点的包围盒
  groupPositionArgs: T,    // group 中定义的默认布局算法参数
) => Result[]

interface Result {
  position: Point.PointLike // 相对于节点的位置
  angle?: number            // 旋转角度
}
```

需要注意的是，配置连接桩 `ports` 时，我们只能通过 `groups` 选项来配置布局算法，而在 `items` 中可以提供可选的布局算法参数 `args` 来影响布局结果。

```ts
graph.addNode(
  ...,
  ports: {
    // 连接桩分组
    groups: {
      group1: {
        position: {
          name: 'xxx', // 布局算法名称
          args: { },   // 布局算法的默认参数
        },
      },
    },

    // 连接桩定义
    items: [
      {
        groups: 'group1',
        args: { }, // 覆盖 group1 中指定的默认参数
      },
    ],
  },
)
```

下面我们一起来看看如何使用内置的连接桩布局算法，以及如何自定并注册自定义布局算法。

## presets

在 `Registry.PortLayout.presets` 命名空间下提供了以下几个内置的布局算法。

### absolute

绝对定位，通过 `args` 指定连接桩的位置。

```ts
interface AbsoluteArgs {
  x?: string | number;
  y?: string | number;
  angle?: number;
}
```

<span class="tag-param">参数<span>

| 名称  | 类型             | 必选 | 默认值 | 描述                   |
|-------|------------------|:----:|--------|----------------------|
| x     | string \| number |      | `0`    | 连接桩在 X 轴相对位置。 |
| y     | string \| number |      | `0`    | 连接桩在 Y 轴相对位置。 |
| angle | number           |      | `0`    | 连接桩旋转角度。        |

当 `x` 和 `y` 为百分比字符串或位于 `[0, 1]` 之间时，表示在宽度和高度方向的百分比偏移量，否则表示绝对偏移量。

<span class="tag-example">用法</span>

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: "absolute",
          args: { x: 0, y: 0 },
        },
      },
    },
    items: [
      {
        group: "group1",
        args: {
          x: "60%",
          y: 32,
          angle: 45,
        },
      },
    ],
  },
});
```

<!-- <iframe src="/demos/api/registry/port-layout/absolute"></iframe> -->

### left, right, top, bottom

连接桩沿矩形指定边线均匀布局，`left`、`right`、`top` 和 `bottom` 四个布局对矩形形状的节点非常友好，可以通过 `args` 来设置偏移量和旋转角度。

```ts
interface SideArgs {
  dx?: number;
  dy?: number;
  angle?: number;
  x?: number;
  y?: number;
}
```

<span class="tag-param">参数<span>

| 名称   | 类型    | 必选 | 默认值  | 描述                                    |
|--------|---------|:----:|---------|---------------------------------------|
| strict | boolean |      | `false` | 是否严格等分均匀分布。                   |
| dx     | number  |      | `0`     | 沿 X 轴方向的偏移量。                    |
| dy     | number  |      | `0`     | 沿 X 轴方向的偏移量。                    |
| angle  | number  |      | `0`     | 连接桩的旋转角度。                       |
| x      | number  |      | -       | 用指定的 X 坐标覆盖计算结果中的 X 坐标。 |
| y      | number  |      | -       | 用指定的 Y 坐标覆盖计算结果中的 Y 坐标。 |

<span class="tag-example">用法</span>

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: "left",
      },
    },
    items: [
      {
        group: "group1",
        args: {
          dx: 2,
        },
      },
    ],
  },
});
```

<!-- <iframe src="/demos/api/registry/port-layout/side"></iframe> -->

### line

连接桩沿线段均匀分布。

```ts
interface LineArgs {
  start?: Point.PointLike;
  end?: Point.PointLike;
  dx?: number;
  dy?: number;
  angle?: number;
  x?: number;
  y?: number;
}
```

<span class="tag-param">参数<span>

| 名称   | 类型            | 必选 | 默认值  | 描述                                    |
|--------|-----------------|:----:|---------|---------------------------------------|
| start  | Point.PointLike |      |         | 线段起点。                               |
| end    | Point.PointLike |      |         | 线段终点。                               |
| strict | boolean         |      | `false` | 是否严格等分均匀分布。                   |
| dx     | number          |      | `0`     | 沿 X 轴方向的偏移量。                    |
| dy     | number          |      | `0`     | 沿 X 轴方向的偏移量。                    |
| angle  | number          |      | `0`     | 连接桩的旋转角度。                       |
| x      | number          |      | -       | 用指定的 X 坐标覆盖计算结果中的 X 坐标。 |
| y      | number          |      | -       | 用指定的 Y 坐标覆盖计算结果中的 Y 坐标。 |

<span class="tag-example">用法</span>

```ts
graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: "line",
          args: {
            start: { x: 10, y: 10 },
            end: { x: 210, y: 10 },
          },
        },
      },
    },
    items: [
      {
        group: "group1",
        args: {
          dx: 2,
        },
      },
    ],
  },
});
```

<!-- <iframe src="/demos/api/registry/port-layout/line/"></iframe> -->

### ellipse

沿圆弧分布的连接桩，从 `start` 指定的角度开始，以 `step` 为步长均匀分布。

```ts
interface EllipseArgs {
  start?: number;
  step?: number;
  compensateRotate?: boolean;
  dr?: number;
  dx?: number;
  dy?: number;
  angle?: number;
  x?: number;
  y?: number;
}
```

<span class="tag-param">参数<span>

| 名称             | 类型   | 必选 | 默认值  | 描述                                    |
|------------------|--------|:----:|---------|---------------------------------------|
| start            | number |      |         | 起始角度。                               |
| step             | number |      | `20`    | 步长。                                   |
| compensateRotate | number |      | `false` | 是否沿圆弧修正连接桩的旋转角度。         |
| dr               | number |      | `0`     | 沿半径方向的偏移量。                     |
| dx               | number |      | `0`     | 沿 X 轴方向的偏移量。                    |
| dy               | number |      | `0`     | 沿 X 轴方向的偏移量。                    |
| angle            | number |      | `0`     | 连接桩的旋转角度。                       |
| x                | number |      | -       | 用指定的 X 坐标覆盖计算结果中的 X 坐标。 |
| y                | number |      | -       | 用指定的 Y 坐标覆盖计算结果中的 Y 坐标。 |

<span class="tag-example">用法</span>

```ts
const node = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: "ellipse",
          args: {
            start: 45,
          },
        },
      },
    },
  },
});

Array.from({ length: 10 }).forEach((_, index) => {
  node.addPort({
    id: `${index}`,
    group: "group1",
    attrs: { text: { text: index } },
  });
});
```

<!-- <iframe src="/demos/api/registry/port-layout/ellipse"></iframe> -->

### ellipseSpread

沿椭圆均匀分布的连接桩，从 `start` 指定的角度开始均匀分布。

```ts
interface EllipseSpreadArgs {
  start?: number;
  compensateRotate?: boolean;
  dr?: number;
  dx?: number;
  dy?: number;
  angle?: number;
  x?: number;
  y?: number;
}
```

<span class="tag-param">参数<span>

| 名称             | 类型   | 必选 | 默认值  | 描述                                    |
|------------------|--------|:----:|---------|---------------------------------------|
| start            | number |      |         | 起始角度。                               |
| compensateRotate | number |      | `false` | 是否沿圆弧修正连接桩的旋转角度。         |
| dr               | number |      | `0`     | 沿半径方向的偏移量。                     |
| dx               | number |      | `0`     | 沿 X 轴方向的偏移量。                    |
| dy               | number |      | `0`     | 沿 X 轴方向的偏移量。                    |
| angle            | number |      | `0`     | 连接桩的旋转角度。                       |
| x                | number |      | -       | 用指定的 X 坐标覆盖计算结果中的 X 坐标。 |
| y                | number |      | -       | 用指定的 Y 坐标覆盖计算结果中的 Y 坐标。 |

<span class="tag-example">用法</span>

```ts
const node = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: "ellipseSpread",
          args: {
            start: 45,
          },
        },
      },
    },
  },
});

Array.from({ length: 36 }).forEach(function (_, index) {
  ellipse.addPort({
    group: "group1",
    id: `${index}`,
    attrs: { text: { text: index } },
  });
});
```

<!-- <iframe src="/demos/api/registry/port-layout/ellipse-spread"></iframe> -->

## registry

连接桩布局算法是一个函数具有如下签名的函数，返回每个连接桩相对于节点的相对位置。例如，某节点在画布的位置是 `{ x: 30, y: 40 }`，如果返回的某个连接桩的位置是 `{ x: 2, y: 4 }`，那么该连接桩渲染到画布后的位置是 `{ x: 32, y: 44 }`。

```ts
type Definition<T> = (
  portsPositionArgs: T[],  // 连接桩中指定的布局算法参数
  elemBBox: Rectangle,     // 节点的包围盒
  groupPositionArgs: T,    // group 中定义的默认布局算法参数
) => Result[]

interface Result {
  position: Point.PointLike // 相对于节点的位置
  angle?: number            // 旋转角度
}
```

所以我们可以按照上面规则来创建自定义布局算法，例如，实现一个正弦分布的布局算法：

```ts
function sin(portsPositionArgs, elemBBox) {
  return portsPositionArgs.map((_, index) => {
    const step = -Math.PI / 8;
    const y = Math.sin(index * step) * 50;
    return {
      position: {
        x: index * 12,
        y: y + elemBBox.height,
      },
      angle: 0,
    };
  });
}
```

布局算法实现后，需要注册到系统，注册后就可以像内置布局算法那样来使用。

### register

```ts
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册自定义布局算法。

### unregister

```ts
unregister(name: string): Definition | null
```

删除注册的自定义布局算法。

实际上，我们将 `registry` 的 `register` 和 `unregister` 方法分别挂载为 `Graph` 的两个静态方法 `Graph.registerPortLayout` 和 `Graph.unregisterPortLayout`，所以我们定义的正弦布局可以像下面这样注册到系统：

```ts
Graph.registerPortLayout("sin", sin);
```

或者：

```ts
Graph.registerPortLayout("sin", (portsPositionArgs, elemBBox) => {
  return portsPositionArgs.map((_, index) => {
    const step = -Math.PI / 8;
    const y = Math.sin(index * step) * 50;
    return {
      position: {
        x: index * 12,
        y: y + elemBBox.height,
      },
      angle: 0,
    };
  });
});
```

注册以后，我们就可以像内置布局算法那样来使用：

```ts
const rect = graph.addNode({
  ports: {
    groups: {
      sin: {
        position: {
          name: "sin",
          args: {
            start: 45,
          },
        },
        attrs: {
          rect: {
            fill: "#fe854f",
            width: 11,
          },
          text: {
            fill: "#fe854f",
          },
          circle: {
            fill: "#fe854f",
            r: 5,
            magnet: true,
          },
        },
      },
    },
  },
});

Array.from({ length: 24 }).forEach(() => {
  rect.addPort({ group: "sin" });
});
```

<!-- <iframe src="/demos/api/registry/port-layout/sin"></iframe> -->
