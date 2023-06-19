---
title: PortLabelLayout
order: 14
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

连接桩标签布局算法是一个具有如下签名的函数，返回标签相对于连接桩的位置和旋转角度。

```ts
type Definition<T> = (
  portPosition: Point, // 连接桩的位置
  elemBBox: Rectangle, // 节点的包围盒
  args: T, // 标签位置参数
) => Result

interface Result {
  position: Point.PointLike // 标签相对于位置
  angle: number // 标签的旋转角度
  attrs: Attr.CellAttrs // 标签的属性
}
```

创建连接桩时，可以在群组 `groups` 中指定该组的标签定位，也可以在 `items` 中覆盖群组中的定义：

```ts
graph.addNode(
  ...,
  ports: {
    // 连接桩分组
    groups: {
      group1: {
        label: {
          position: {      // 标签布局算法
            name: 'xxx',   // 标签布局算法名称
            args: { ... }, // 标签布局算法参数
          },
        },
      },
    },

    // 连接桩定义
    items: [
      {
        groups: 'group1',
        label: {
          position: { // 覆盖 group1 中指定的标签定位算法
            name: 'xxx',
            args: { ... },
          }
        },
      }
    ],
  },
)
```

下面我们一起来看看如何使用内置的标签布局算法，以及如何自定并注册自定义布局算法。

## presets

在 `Registry.PortLabelLayout.presets` 命令空间中提供了以下几个布局算法。

### _Side_

标签位于连接桩的某一侧。

- `'left'` 标签位于连接桩左侧。
- `'right'` 标签位于连接桩右侧。
- `'top'` 标签位于连接桩顶部。
- `'bottom'` 标签位于连接桩底部。

可以通过 `args` 来指定标签的位置和旋转角度。

```ts
interface SideArgs {
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| 名称  | 类型           | 必选 | 默认值 | 描述                                      |
|-------|----------------|:----:|--------|-----------------------------------------|
| x     | number         |      | -      | 用指定的 X 坐标替换计算结果中的 X 坐标。   |
| y     | number         |      | -      | 用指定的 Y 坐标替换计算结果中的 Y 坐标。   |
| angle | number         |      | -      | 用指定的旋转角度替换计算结果中的旋转角度。 |
| attrs | Attr.CellAttrs |      | -      | 标签属性。                                 |


```ts
label: {
  position: {
    name : 'right',
    args: {
      y: 10, // 强制指定 y 坐标为 10，替换计算结果中的 y 坐标
      attrs: {
        text: {
          fill: 'red', // 设置标签颜色为红色
        },
      },
    },
  },
}
```

<!-- <iframe src="/demos/api/registry/port-label-layout/side"></iframe> -->

### _Inside/Outside_

标签位于节点的内部或者外部，支持一下四种布局：

- `'inside'` 标签位于节点内围（靠近边线的内侧）。
- `'outside'` 标签位于节点外围（靠近边线的外侧）。
- `'insideOriented'` 标签位于节点内围，而且根据坐所在位自动调整文本的方向。
- `'outsideOriented'` 标签位于节点外围，而且根据坐所在位自动调整文本的方向。

支持通过 `args.offset` 来设置标签沿节点中到标签位置方向的偏移量。

```ts
interface InOutArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| 名称   | 类型           | 必选 | 默认值 | 描述                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `15`   | 从节点中心到标签位置的方向上的偏移量。     |
| x      | number         |      | -      | 用指定的 X 坐标替换计算结果中的 X 坐标。   |
| y      | number         |      | -      | 用指定的 Y 坐标替换计算结果中的 Y 坐标。   |
| angle  | number         |      | -      | 用指定的旋转角度替换计算结果中的旋转角度。 |
| attrs  | Attr.CellAttrs |      | -      | 标签属性。                                 |


```ts
label: {
  position: {
    name : 'outside',
  },
}
```

<!-- <iframe src="/demos/api/registry/port-label-layout/inside-outside"></iframe> -->

### _Radial_

将标签放在圆形或椭圆形节点的外围。支持一下两种布局：

- `'radial'` 标签位于圆形或椭圆形节点的外围。
- `'radialOriented'` 标签位于圆形或椭圆形节点的外围，并使标签文本自动沿圆弧方向旋转。

```ts
interface RadialArgs {
  offset?: number
  x?: number
  y?: number
  angle?: number
  attrs?: Attr.CellAttrs
}
```

| 名称   | 类型           | 必选 | 默认值 | 描述                                      |
|--------|----------------|:----:|--------|-----------------------------------------|
| offset | number         |      | `20`   | 从节点中心到标签位置的方向上的偏移量。     |
| x      | number         |      | -      | 用指定的 X 坐标替换计算结果中的 X 坐标。   |
| y      | number         |      | -      | 用指定的 Y 坐标替换计算结果中的 Y 坐标。   |
| angle  | number         |      | -      | 用指定的旋转角度替换计算结果中的旋转角度。 |
| attrs  | Attr.CellAttrs |      | -      | 标签属性。                                 |

```ts
label: {
  position: {
    name : 'radial',
  },
}
```

<!-- <iframe src="/demos/api/registry/port-label-layout/radial"></iframe> -->

## registry

连接桩标签定位是一个具有如下签名的函数，返回标签相对于连接桩的位置和旋转角度。

```ts
type Definition<T> = (
  portPosition: Point, // 连接桩的位置
  elemBBox: Rectangle, // 节点的包围盒
  args: T, // 标签位置参数
) => Result

interface Result {
  position: Point.PointLike // 标签相对于位置
  angle: number // 标签的旋转角度
  attrs: Attr.CellAttrs // 标签的属性
}
```

所以我们可以按照上面规则来创建自定义布局算法，例如，实现一个位于连接桩右下角的布局：

```ts
function bottomRight(portPosition, elemBBox, args) {
  const dx = args.dx || 10
  const dy = args.dy || 10

  return {
    position: {
     portPosition.x + dx,
     portPosition.y + dy,
    }
  }
}
```

布局算法实现后，需要注册到系统，注册后就可以像内置布局算法那样来使用。

### register

```ts
/**
 *
 */
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册自定义布局算法。

### unregister

```ts
unregister(name: string): Definition | null
```

删除注册的自定义布局算法。

实际上，我们将该命名空间的中 `register` 和 `unregister` 两个方法分别挂载为 Graph 的两个静态方法 `Graph.registerPortLabelLayout` 和 `Graph.unregisterPortLabelLayout`，所以我们可以像下面这样来注册刚刚定义的布局算法：

```ts
Graph.registerPortLabelLayout('bottomRight', bottomRight)
```

或者：

```ts
Graph.registerPortLayout('bottomRight', (portPosition, elemBBox, args) => {
  const dx = args.dx || 10
  const dy = args.dy || 10

  return {
    position: {
     portPosition.x + dx,
     portPosition.y + dy,
    }
  }
})
```

注册以后，我们就可以像内置布局算法那样来使用：

```ts
const rect = graph.addNode({
  ports: {
    groups: {
      group1: {
        position: {
          name: 'top',
        },
        label: {
          position: {
            name: 'bottomRight',
          },
        },
      },
    },

    items: [
      { id: 'port1', group: 'group1' },
      { id: 'port2', label: { position: 'bottomRight' } },
    ],
  },
})
```
