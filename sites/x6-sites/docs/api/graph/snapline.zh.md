---
title: Snapline
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

对齐线是移动节点排版的辅助工具，默认禁用。创建画布时，通过如下配置启用。

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

创建画布后，可以调用 [graph.enableSnapline()](#enablesnapline) 和 [graph.disableSnapline()](#disablesnapline) 来启用和禁用对齐线。

```ts
if (graph.isSnaplineEnabled()) {
  graph.disableSnapline()
} else {
  graph.enableSnapline()
}
```

支持的选项如下：

```sign
interface SnaplineOptions {
  className?: string
  tolerance?: number
  sharp?: boolean
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
      return node.type === 'rect'
    },
  },
})
```

## 方法

### isSnaplineEnabled()

```sign
isSnaplineEnabled(): boolean
```

返回是否启用对齐线。

### enableSnapline()

```sign
enableSnapline(): this
```

启用对齐线。

### disableSnapline()

```sign
disableSnapline(): this
```

禁用对齐线。

### toggleSnapline(...)

```sign
toggleSnapline(enabled?: boolean): this
```

切换对齐线的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### hideSnapline()

```sign
hideSnapline(): this
```

隐藏对齐线。

### isSnaplineOnResizingEnabled()

```sign
isSnaplineOnResizingEnabled(): boolean
```

调整节点大小时，是否触发对齐线。

### enableSnaplineOnResizing()

```sign
enableSnaplineOnResizing(): this
```

启用调整节点大小过程中触发对齐线。

### disableSnaplineOnResizing()

```sign
disableSnaplineOnResizing(): this
```

禁用调整节点大小过程中触发对齐线。

### toggleSnaplineOnResizing(...)

```sign
toggleSnaplineOnResizing(enabled?: boolean): this
```

切换调整节点大小过程中是否触发对齐线。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### isSharpSnapline()

```sign
isSharpSnapline(): boolean
```

是否使用短款对齐线。

### enableSharpSnapline()

```sign
enableSharpSnapline(): this
```

启用短款对齐线，启用后对齐线只显示到相关节点位置处，否则显示贯穿画布的对齐线。

### disableSharpSnapline()

```sign
disableSharpSnapline(): this
```

禁用短款对齐线，对齐线将贯穿整个画布。

### toggleSharpSnapline(...)

```sign
toggleSharpSnapline(enabled?: boolean): this
```

切换短款对齐线的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                               |
|---------|---------|:----:|--------|--------------------------------------------------|
| enabled | boolean |      | -      | 是否启用短款对齐线，缺省时切换短款对齐线的启用状态。 |

### getSnaplineTolerance()

```sign
getSnaplineTolerance(): number
```

获取对齐线精度。

### setSnaplineTolerance(...)

```sign
setSnaplineTolerance(tolerance: number): this
```

设置对齐线精度。

### setSnaplineFilter(...)

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