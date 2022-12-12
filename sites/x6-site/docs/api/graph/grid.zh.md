---
title: Grid
order: 6
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

网格是渲染/移动节点的最小单位。网格默认大小为 `10px`，渲染节点时表示以 `10` 为最小单位对齐到网格，如位置为 `{ x: 24, y: 38 }`的节点渲染到画布后的实际位置为 `{ x: 20, y: 40 }`， 移动节点时表示每次移动最小距离为 `10px`。

<!-- <iframe src="/demos/tutorial/basic/grid/playground"></iframe> -->

## 配置

### size

创建画布时，通过下面配置来设置网格大小。

```ts
const graph = new Graph({
  grid: 10,
});

// 等同于
const graph = new Graph({
  grid: {
    size: 10,
  },
});
```

创建画布后，可以调用 [graph.setGridSize(gridSize: number)](#setgridsize) 方法来修改网格大小，并触发网格重绘（如果网格可见）。

```ts
graph.setGridSize(10);
```

### type

网格默认不可见，创建画布时，通过下面配置来启用网格绘制。

```ts
const graph = new Graph({
  grid: true, // 网格大小 10px，并绘制网格
});

// 等同于
const graph = new Graph({
  grid: {
    size: 10, // 网格大小 10px
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
});
```

同时，我们内置了以下四种网格类型，通过 `type` 选项来指定网格类型，默认值为 `'dot'`，并支持通过 `args` 选项来配置网格样式。

- dot (默认值)
- fixedDot
- mesh

  ```ts
  const graph = new Graph({
    grid: {
      size: 10,
      visible: true,
      type: "dot", // 'dot' | 'fixedDot' | 'mesh'
      args: {
        color: "#a0a0a0", // 网格线/点颜色
        thickness: 1, // 网格线宽度/网格点大小
      },
    },
  });
  ```

- doubleMesh

  ```ts
  const graph = new Graph({
    grid: {
      size: 10,
      visible: true,
      type: "doubleMesh",
      args: [
        {
          color: "#eee", // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: "#ddd", // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4, // 主次网格线间隔
        },
      ],
    },
  });
  ```

创建画布后，可以调用 [graph.drawGrid(options?: DrawGridOptions)](#drawgrid) 来重绘网格。

例如，使用网格颜色 `#f0f0f0` 和默认线宽绘制 `mesh` 类型网格。

```ts
graph.drawGrid({
  type: "mesh",
  args: {
    color: "#f0f0f0",
  },
});
```

## 方法

### getGridSize()

```sign
getGridSize(): number
```

获取网格大小。

### setGridSize()

```sign
setGridSize(gridSize: number): this
```

设置网格大小。

### showGrid()

```sign
showGrid(): this
```

显示网格。

### hideGrid()

```sign
hideGrid(): this
```

隐藏网格。

### clearGrid()

```sign
clearGrid(): this
```

清除网格。

### drawGrid(...)

```sign
drawGrid(options?: DrawGridOptions): this
```

重绘网格。

<span class="tag-param">参数<span>

| 名称         | 类型   | 必选 | 默认值  | 描述                                                     |
| ------------ | ------ | :--: | ------- | -------------------------------------------------------- |
| options.type | string |      | `'dot'` | 网格类型。详情请[参考这里](/zh/docs/api/registry/grid)。 |
| options.args | object |      | -       | 与网格类型对应的网格参数。                               |
