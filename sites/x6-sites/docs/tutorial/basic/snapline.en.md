---
title: 对齐线 Snapline
order: 9
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/basic
---

对齐线是移动节点排版的辅助工具，创建画布时，通过如下配置启用。

```ts
const graph = new Graph({
  snapline: true,
})

// 等同于
const graph = new Graph({
  snapline: {
    enabled: true,
  },
})
```

创建画布后，可以调用 [graph.enableSnapline()](#graphenablesnapline) 和 [graph.disableSnapline()](#graphdisablesnapline) 来启用和禁用对齐线。

```ts
if (graph.isSnaplineEnabled()) {
  graph.disableSnapline()
} else {
  graph.enableSnapline()
}
```

## 演示

<iframe src="/demos/tutorial/basic/snapline/playground"></iframe>


## 选项

```ts
interface SnaplineOptions {
  className?: string
  tolerance?: number
  // sharp?: boolean （废弃）
  resizing?: boolean
  clean?: boolean
  filter?: (string | { id: string })[] | ((this: Graph, node: Node) => boolean)
}
```

### className

附加样式名，用于定制对齐线样式。默认为 `undefined`。

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    className: 'my-snapline',
  },
})
```

### tolerance

对齐精度，即移动节点时与目标位置的距离小于 `tolerance` 时触发显示对齐线。默认为 `10`。

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    tolerance: 10,
  },
})
```

### sharp

是否显示截断的对齐线，默认为 `false`。

### resizing

改变节点大小时是否触发对齐线，默认为 `false`。

### clean

当对齐线隐藏后，是否自动将其从 DOM 中移除。支持 `boolean` 或 `number` 类型，当为 `number` 类型时，表示延迟多少毫秒后从 DOM 移除，这样就可以避免移动节点时对齐线被频繁添加/移除到 DOM，又能保证停止移动节点一定时间后能清理掉对齐线。当 `clean` 为 `true` 时，相当于延迟 3000ms 后清理对齐线。 

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    clean: 5000,
  },
})
```

### filter

节点过滤器，被过滤的节点不参与对齐计算。支持以下三种类型：

- `string[]`  节点类型数组，指定的节点类型不参与对齐计算
- `({ id: string })[]` 节点（类节点）数组，指定的节点不参与对齐计算
- `(this: Graph, node: Node) => boolean` 返回 `true` 的节点不参与对齐计算

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    filter: ['rect'],
  },
})

// 等同于
const graph = new Graph({
  snapline: {
    enabled: true,
    filter(node) {
      return node.shape === 'rect'
    },
  },
})
```

## 样式定制

上面介绍了通过 `className` 选项来定制样式，另外也可以通过覆盖以下几个 CSS 样式定义来定制，默认的样式定义[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/addon/snapline/index.less)。

- x6-widget-snapline
- x6-widget-snapline-vertical
- x6-widget-snapline-horizontal

## API

### graph.isSnaplineEnabled()

```sign
isSnaplineEnabled(): boolean
```

返回是否启用对齐线。

### graph.enableSnapline()

```sign
enableSnapline(): this
```

启用对齐线。

### graph.disableSnapline()

```sign
disableSnapline(): this
```

禁用对齐线。

### graph.toggleSnapline(...)

```sign
toggleSnapline(enabled?: boolean): this
```

切换对齐线的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### graph.hideSnapline()

```sign
hideSnapline(): this
```

隐藏对齐线。

### graph.isSnaplineOnResizingEnabled()

```sign
isSnaplineOnResizingEnabled(): boolean
```

调整节点大小时，是否触发对齐线。

### graph.enableSnaplineOnResizing()

```sign
enableSnaplineOnResizing(): this
```

启用调整节点大小过程中触发对齐线。

### graph.disableSnaplineOnResizing()

```sign
disableSnaplineOnResizing(): this
```

禁用调整节点大小过程中触发对齐线。

### graph.toggleSnaplineOnResizing(...)

```sign
toggleSnaplineOnResizing(enabled?: boolean): this
```

切换调整节点大小过程中是否触发对齐线。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### graph.isSharpSnapline()

```sign
isSharpSnapline(): boolean
```

是否使用短款对齐线。

### graph.enableSharpSnapline()

```sign
enableSharpSnapline(): this
```

启用短款对齐线，启用后对齐线只显示到相关节点位置处，否则显示贯穿画布的对齐线。

### graph.disableSharpSnapline()

```sign
disableSharpSnapline(): this
```

禁用短款对齐线，对齐线将贯穿整个画布。

### graph.toggleSharpSnapline()

```sign
toggleSharpSnapline(enabled?: boolean): this
```

切换短款对齐线的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                               |
|---------|---------|:----:|--------|--------------------------------------------------|
| enabled | boolean |      | -      | 是否启用短款对齐线，缺省时切换短款对齐线的启用状态。 |

### graph.getSnaplineTolerance()

```sign
getSnaplineTolerance(): number
```

获取对齐线精度。

### graph.setSnaplineTolerance(...)

```sign
setSnaplineTolerance(tolerance: number): this
```

设置对齐线精度。

### graph.setSnaplineFilter(...)

```sign
setSnaplineFilter(
  filter?: 
   | null
   | (string | { id: string })[]
   | ((this: Graph, cell: Cell) => boolean)
): this
```

设置过滤条件，满足过滤条件的节点/边将不参与对齐线计算。

- 当 `filter` 为 `null`、`undefined` 时，不过滤节点/边。
- 当 `filter` 为 `(string | { id: string })[]` 时，表示具有这些 ID 的节点/边不参与对齐线计算。
- 当 `filter` 为 `(this: Graph, cell: Cell) => boolean` 时，返回 `true` 时节点/边不参与对齐线计算。
