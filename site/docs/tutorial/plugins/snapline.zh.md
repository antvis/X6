---
title: 对齐线
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

:::info{title=在本章节中主要介绍对齐线插件相关的知识,通过阅读你可以了解到}

- 如何在画布中使用对齐线

:::

## 使用

对齐线是移动节点排版的辅助工具，我们提供了一个插件 `snapline` 来使用这个功能，在代码中这样使用：

```ts
import { Snapline } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Snapline({
    enabled: true,
  }),
)
```

## 演示

<code id="plugin-snapline" src="@/src/tutorial/plugins/snapline/index.tsx"></code>

## 配置

| 属性名    | 类型    | 默认值  | 必选 | 描述                                                                                           |
|-----------|---------|---------|------|----------------------------------------------------------------------------------------------|
| className | string  | -       |      | 附加样式名，用于定制对齐线样式                                                                  |
| tolerance | number  | 10      |      | 对齐精度，即移动节点时与目标位置的距离小于 `tolerance` 时触发显示对齐线                         |
| sharp     | boolean | `false` |      | 是否显示截断的对齐线                                                                           |
| resizing  | boolean | `false` |      | 改变节点大小时是否触发对齐线                                                                   |
| clean     | boolean | `true`  |      | 如果为 `true`，则在 3s 后清除对齐线，为 `false`，不会清除，如果为数字(ms)，则在指定时间后清除对齐线 |
| filter    | Filter  | -       |      | 节点过滤器                                                                                     |

上面的 Filter 类型比较复杂，支持以下三种类型：

- `string[]`： 节点 `shape` 数组，指定的节点 `shape` 才会参与对齐计算
- `({ id: string })[]`： 节点 ID 数组，指定的节点才会参与对齐计算
- `(this: Graph, node: Node) => boolean`： 返回 `true` 的节点才参与对齐计算

## API

### graph.isSnaplineEnabled()

```ts
isSnaplineEnabled(): boolean
```

返回是否启用对齐线。

### graph.enableSnapline()

```ts
enableSnapline(): this
```

启用对齐线。

### graph.disableSnapline()

```ts
disableSnapline(): this
```

禁用对齐线。

### graph.toggleSnapline(...)

```ts
toggleSnapline(enabled?: boolean): this
```

切换对齐线的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### graph.hideSnapline()

```ts
hideSnapline(): this
```

隐藏对齐线。

### graph.isSnaplineOnResizingEnabled()

```ts
isSnaplineOnResizingEnabled(): boolean
```

调整节点大小时，是否触发对齐线。

### graph.enableSnaplineOnResizing()

```ts
enableSnaplineOnResizing(): this
```

启用调整节点大小过程中触发对齐线。

### graph.disableSnaplineOnResizing()

```ts
disableSnaplineOnResizing(): this
```

禁用调整节点大小过程中触发对齐线。

### graph.toggleSnaplineOnResizing(...)

```ts
toggleSnaplineOnResizing(enabled?: boolean): this
```

切换调整节点大小过程中是否触发对齐线。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

### graph.isSharpSnapline()

```ts
isSharpSnapline(): boolean
```

是否使用短款对齐线。

### graph.enableSharpSnapline()

```ts
enableSharpSnapline(): this
```

启用短款对齐线，启用后对齐线只显示到相关节点位置处，否则显示贯穿画布的对齐线。

### graph.disableSharpSnapline()

```ts
disableSharpSnapline(): this
```

禁用短款对齐线，对齐线将贯穿整个画布。

### graph.toggleSharpSnapline()

```ts
toggleSharpSnapline(enabled?: boolean): this
```

切换短款对齐线的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                               |
|---------|---------|:----:|--------|--------------------------------------------------|
| enabled | boolean |      | -      | 是否启用短款对齐线，缺省时切换短款对齐线的启用状态。 |

### graph.getSnaplineTolerance()

```ts
getSnaplineTolerance(): number
```

获取对齐线精度。

### graph.setSnaplineTolerance(...)

```ts
setSnaplineTolerance(tolerance: number): this
```

设置对齐线精度。

### graph.setSnaplineFilter(...)

```ts
setSnaplineFilter(
  filter?:
   | null
   | (string | { id: string })[]
   | ((this: Graph, node: Node) => boolean)
): this
```

设置过滤条件，满足过滤条件的节点才会参与对齐线计算。
