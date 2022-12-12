---
title: Grid
order: 30
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/registry
---

网格是渲染/移动节点的最小单位，网格默认大小为 `10px`，网格默认不可见，创建画布时，通过下面配置来启用网格绘制。

```ts
const graph = new Graph({
  grid: true, // 网格大小 10px，并绘制网格
});

// 等同于
const graph = new Graph({
  grid: {
    size: 10, // 网格大小 10px
    type: "dot", // 指定网格类型
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
});
```

上面代码中，通过 `type` 选项来指定了网格类型，我们在 `Registry.Grid.presets` 命名空间下提供了以下几种网格类型：

- [`'dot'`](#dot) 点状网格。
- [`'fixedDot'`](#fixeddot) 固定网点大小的点状网格。
- [`'mesh'`](#mesh) 网状网格。
- [`'doubleMesh'`](#doublemesh) 双线网状网格。

下面分别介绍这几种方式的用法。

## presets

### dot

点状网格。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: "dot",
    args: {
      color: "#a0a0a0", // 网格线/点颜色
      thickness: 1, // 网格线宽度/网点大小
    },
  },
});
```

<!-- <iframe src="/demos/api/registry/grid/dot"></iframe> -->

### fixedDot

固定网点大小的点状网格。

当画布的缩放比例小于 `1` 时，网点大小随着画布缩放比例缩放，当画布缩放比例大于 `1` 时，网点大小为给定的 `thickness` 的值。

```ts
const graph = new Graph({
  container: this.container,
  grid: {
    visible: true,
    size: 10,
    type: "fixedDot",
    args: {
      color: "#a0a0a0", // 网格线/点颜色
      thickness: 2, // 网格线宽度/网点大小
    },
  },
});

graph.scale(10, 10);
```

<!-- <iframe src="/demos/api/registry/grid/fixed-dot"></iframe> -->

### mesh

网状网格。

```ts
new Graph({
  container: this.container,
  grid: {
    visible: true,
    type: "mesh",
    args: {
      color: "#ddd", // 网格线/点颜色
      thickness: 1, // 网格线宽度/网点大小
    },
  },
});
```

<!-- <iframe src="/demos/api/registry/grid/mesh"></iframe> -->

### doubleMesh

双线网状网格。

```ts
new Graph({
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

<!-- <iframe src="/demos/api/registry/grid/double-mesh"></iframe> -->

## registry

我们在 `Registry.Grid.registry` 对象上提供了 [`register`](#register) 和 [`unregister`](#unregister) 两个方法来注册和取消注册网格定义，同时也将这两个方法分别挂载为 Graph 上的两个静态方法 `Graph.registerGrid` 和 `Graph.unregisterGrid`。

### register

```sign
register(entities: { [name: string]: Definition }, force?: boolean): void
register(name: string, entity: Definition, force?: boolean): Definition
```

注册网格定义。

### unregister

```sign
unregister(name: string): Definition | null
```

取消注册网格定义。

### 示例

这里以注册一个红色点状网格为例：

```ts
Graph.registerGrid("red-dot", {
  color: "red",
  thickness: 1,
  markup: "rect",
  update(elem, options) {
    const width = options.thickness * options.sx;
    const height = options.thickness * options.sy;
    Dom.attr(elem, {
      width,
      height,
      rx: width,
      ry: height,
      fill: options.color,
    });
  },
});

const graph = new Graph({
  grid: {
    type: "red-dot",
  },
});
```
