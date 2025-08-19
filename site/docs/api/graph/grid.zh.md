---
title: 网格
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

网格是渲染/移动节点的最小单位。网格默认大小为 `10px`，渲染节点时表示以 `10` 为最小单位对齐到网格，如位置为 `{ x: 24, y: 38 }`的节点渲染到画布后的实际位置为 `{ x: 20, y: 40 }`， 移动节点时表示每次移动最小距离为 `10px`。

## 演示

<code id="api-graph-grid" src="@/src/api/grid/playground/index.tsx"></code>

## 配置

### size

创建画布时，通过下面配置来设置网格大小。

```ts
const graph = new Graph({
  grid: 10,
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10,
  },
})
```

### type

网格默认不可见，创建画布时，通过下面配置来启用网格绘制。

```ts
const graph = new Graph({
  grid: true, // 网格大小 10px，并绘制网格
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10, // 网格大小 10px
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
})
```

同时，我们内置了以下四种网格类型，通过 `type` 选项来指定网格类型，默认值为 `dot`，并支持通过 `args` 选项来配置网格样式。

#### dot (默认值)

点状网格。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'dot',
    args: {
      color: '#a0a0a0', // 网点颜色
      thickness: 1, // 网点大小
    },
  },
})
```

#### fixedDot

固定网点大小的点状网格。当画布的缩放比例小于 `1` 时，网点大小随着画布缩放比例缩放，当画布缩放比例大于 `1` 时，网点大小为给定的 `thickness` 的值。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    size: 10,
    type: 'fixedDot',
    args: {
      color: '#a0a0a0', // 网点颜色
      thickness: 2, // 网点大小
    },
  },
})

graph.scale(10, 10)
```

#### mesh

网状网格。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: 'mesh',
    args: {
      color: '#ddd', // 网格线颜色
      thickness: 1, // 网格线宽度
    },
  },
})
```

#### doubleMesh

双线网状网格。

```ts
const graph = new Graph({
  grid: {
    size: 10,
    visible: true,
    type: 'doubleMesh',
    args: [
      {
        color: '#eee', // 主网格线颜色
        thickness: 1, // 主网格线宽度
      },
      {
        color: '#ddd', // 次网格线颜色
        thickness: 1, // 次网格线宽度
        factor: 4, // 主次网格线间隔
      },
    ],
  },
})
```

## 方法

### getGridSize()

```ts
getGridSize(): number
```

获取网格大小。

### setGridSize()

```ts
setGridSize(gridSize: number): this
```

设置网格大小。

### showGrid()

```ts
showGrid(): this
```

显示网格。

### hideGrid()

```ts
hideGrid(): this
```

隐藏网格。

### clearGrid()

```ts
clearGrid(): this
```

清除网格。

### drawGrid(...)

```ts
drawGrid(options?: DrawGridOptions): this
```

重绘网格。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| type | string |  | `dot` | 网格类型。详情请[参考这里](/api/registry/grid)。 |
| args | object |  | - | 与网格类型对应的网格参数。 |

## 自定义网格

这里以注册一个红色点状网格为例：

```ts
Graph.registerGrid('red-dot', {
  color: 'red',
  thickness: 1,
  markup: 'rect',
  update(elem, options) {
    const width = options.thickness * options.sx
    const height = options.thickness * options.sy
    Dom.attr(elem, {
      width,
      height,
      rx: width,
      ry: height,
      fill: options.color,
    })
  },
})

const graph = new Graph({
  grid: {
    type: 'red-dot',
  },
})
```
