---
title: 边
order: 2
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/model
---

Edge 是边的基类，继承自 [Cell](/zh/docs/api/model/cell)，并定义了边的通用属性和方法。

## 属性

除了从 Cell 继承[属性](/zh/docs/api/model/cell#属性)外，还支持以下属性。

| 选项 | 类型 | 默认值 | 必选 | 描述 |
| --- | --- | --- | :-: | --- |
| source | TerminalData |  |  | 起点或起始节点、连接桩信息。 |
| target | TerminalData |  |  | 终点或终止节点、连接桩信息。 |
| vertices | Point.PointLike[] |  |  | 路径点。 |
| router | RouterData |  |  | 路由。 |
| connector | ConnectorData |  |  | 连接器。 |
| labels | Label[] \| string[] |  |  | 标签。 |
| defaultLabel | Label |  |  | 默认标签。 |

### source 和 target

设置边的起点/终点或起始节点/终止节点，可以分为一下几种情况：

- **连接到画布上的点**
  ```ts
  const edge = graph.addEdge({
    source: { x: 40, y: 40 },
    target: { x: 180, y: 80 },
  })
  ```
- **连接到节点/边**
  ```ts
  const edge = graph.addEdge({
    source: { cell: 'source-cell-id' },
    target: { cell: 'target-cell-id' },
  })
  ```
- **连接到节点上的连接桩**
  ```ts
  const edge = graph.addEdge({
    source: { cell: 'source-cell-id', port: 'port-id' },
    target: { cell: 'target-cell-id', port: 'port-id' },
  })
  ```
- **连接到节点上的某个元素**
  ```ts
  const edge = graph.addEdge({
    source: { cell: 'source-cell-id', selector: 'some-selector' },
    target: { cell: 'target-cell-id', selector: 'some-selector' },
  })
  ```

另外，边的[锚点 anchor](/zh/docs/api/registry/node-anchor) 和[连接点 ConnectionPoint](/zh/docs/api/registry/connection-point) 选项共同确定了边的起点和终点。

- 起点：从第一个路径点或目标节点的中心（没有路径点时）画一条参考线到源节点的锚点，然后根据 connectionPoint 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的起点。
- 终点：从最后一个路径点或源节点的中心（没有路径点时）画一条参考线到目标节点的锚点，然后根据 connectionPoint 指定的交点计算方法，计算参考线与图形的交点，该交点就是边的终点。

创建边时可以分别为 `source` 和 `target` 指定锚点和连接点。

- **指定锚点**
  ```ts
  const edge = graph.addEdge({
    source: {
      cell: 'source-id',
      anchor: {
        name: 'midSide',
        args: {
          dx: 10,
        },
      },
    },
    target: {
      cell: 'target-id',
      anchor: 'orth', // 没有参数时可以简化写法
    },
  })
  ```
- **指定连接点**
  ```ts
  const edge = graph.addEdge({
    source: {
      cell: 'source-id',
      connectionPoint: {
        name: 'boundary',
        args: {
          sticky: true,
        },
      },
    },
    target: {
      cell: 'target-id',
      connectionPoint: 'boundary', // 没有参数时可以简化写法
    },
  })
  ```

### vertices

路径点 `vertices` 是一个点的数组。边从起点开始，按顺序经过路径点，最后到达终点。

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
})
```

### router

路由 `router` 将对 `vertices` 进一步处理，并在必要时添加额外的点，然后返回处理后的点（不包含边的起点和终点）。例如，经过 [`orth`](/zh/docs/api/registry/router#orth) 路由处理后，边的每一条链接线段都是水平或垂直的。

我们默认提供了以下几种路由。

| 路由名称 | 说明 |
| --- | --- |
| normal | [默认路由](/zh/docs/api/registry/router#normal)，原样返回路径点。 |
| orth | [正交路由](/zh/docs/api/registry/router#orth)，由水平或垂直的正交线段组成。 |
| oneSide | [受限正交路由](/zh/docs/api/registry/router#oneside)，由受限的三段水平或垂直的正交线段组成。 |
| manhattan | [智能正交路由](/zh/docs/api/registry/router#manhattan)，由水平或垂直的正交线段组成，并自动避开路径上的其他节点（障碍）。 |
| metro | [智能地铁线路由](/zh/docs/api/registry/router#metro)，由水平或垂直的正交线段和斜角线段组成，类似地铁轨道图，并自动避开路径上的其他节点（障碍）。 |
| er | [实体关系路由](/zh/docs/api/registry/router#er)，由 `Z` 字形的斜角线段组成。 |

可以这样指定路由名称 `name` 和路由参数 `args`：

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: {
    name: 'orth',
    args: {
      padding: 10,
    },
  },
})
```

当没有路由参数 `args` 时，也可以简化为：

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  router: 'orth',
})
```

除了上面几种内置路由，我们还可以创建自定义路由，并注册使用，更多细节请参考[自定义路由](/zh/docs/api/registry/router#registry)教程。

### connector

连接器将起点、路由返回的点、终点加工为 `<path>` 元素的 [`d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) 属性，决定了边渲染到画布后的样式。

我们默认提供了以下几种连接器。

| 连接器名称 | 说明 |
| --- | --- |
| normal | [简单连接器](/zh/docs/api/registry/connector#normal)，用直线连接起点、路由点和终点。 |
| smooth | [平滑连接器](/zh/docs/api/registry/connector#smooth)，用三次贝塞尔曲线线连接起点、路由点和终点。 |
| rounded | [圆角连接器](/zh/docs/api/registry/connector#rounded)，用直线连接起点、路由点和终点，并在线段连接处用圆弧链接（倒圆角）。 |
| jumpover | [跳线连接器](/zh/docs/api/registry/connector#jumpover)，用直线连接起点、路由点和终点，并在边与边的交叉处用跳线符号链接。 |

可以这样指定连接器名称 `name` 和路由参数 `args`：

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: {
    name: 'rounded',
    args: {
      radius: 20,
    },
  },
})
```

当没有连接器参数 `args` 时，也可以简化为：

```ts
const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 100, y: 200 },
    { x: 300, y: 120 },
  ],
  connector: 'rounded',
})
```

除了上面几种内置连接器，我们还可以创建自定义连接器，并注册使用，更多细节请参考[自定义连接器](/zh/docs/api/registry/connector#registry)教程。

### labels 和 defaultLabel

由于标签配置非常灵活，所以我们提供了单独的教程来介绍如何使用标签，详情请参考[使用标签](/zh/docs/api/model/labels)教程。

## 方法

### 通用

#### isEdge()

```ts
isEdge(): true
```

判断是不是边，该方法始终返回 `true`。

#### getBBox()

```ts
getBBox(): Rectangle
```

返回边的包围盒。

#### getPolyline()

```ts
getPolyline(): Polyline
```

返回由端点和路径点组成的线段。

#### hasLoop(...)

```ts
hasLoop(options: { deep?: boolean }): boolean
```

是否包含循环链接。

| 名称         | 类型    | 必选 | 默认值  | 描述               |
| ------------ | ------- | :--: | ------- | ------------------ |
| options.deep | boolean |      | `false` | 是否进行嵌套检查。 |

- 当 `options.deep` 为 `false` 时，表示仅当起始节点和终止节点为同一节点时才是循环连接。
- 当 `options.deep` 为 `true` 时，表示当起始节点和终止节点为同一节点或起始节点与终止节点有父子嵌套关系时都是循环连接。

### 链接 Terminal

#### getSource()

```ts
getSource(): Edge.TerminalData
```

获取边的起始节点/起始点信息。

#### getSourceCell()

```ts
getSourceCell(): Cell | null
```

获取边的起始节点/边，没有连接到节点/边时返回 `null`。

#### getSourceNode()

```ts
getSourceNode(): Node | null
```

获取边的起始节点，没有连接到节点时返回 `null`。

#### getSourceCellId()

```ts
getSourceCellId(): string | null
```

获取边的起始节点/边的 ID，没有连接到节点/边时返回 `null`。

#### getSourcePortId()

```ts
getSourcePortId(): string | null
```

获取边的起始连接桩 ID，没有连接到连接桩时返回 `null`。

#### getSourcePoint()

```ts
getSourcePoint(): Point.PointLike | null
```

获取边链接到画布的起始点，当边连接到节点/边时返回 `null`。

#### setSource(...)

```ts
/**
 * 链接到节点。
 */
setSource(
  node: Node,
  args?: Edge.SetCellTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * 链接到边。
 */
setSource(
  edge: Edge,
  args?: Edge.SetEdgeTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * 链接到画布上的点。
 */
setSource(
  point: Point | Point.PointLike,
  args?: Edge.SetTerminalCommonArgs,
  options?: Edge.SetOptions,
): this

/**
 * 设置边的起点或起始节点/边。
 */
setSource(args: Edge.TerminalData, options?: Edge.SetOptions): this
```

#### getTarget()

```ts
getTarget(): Edge.TerminalData
```

获取边的终止节点/终止点信息。

#### getTargetCell()

```ts
getTargetCell(): Cell | null
```

获取边的终止节点/边，没有连接到节点/边时返回 `null`。

#### getTargetNode()

```ts
getTargetNode(): Node | null
```

获取边的终止节点，没有连接到节点时返回 `null`。

#### getTargetCellId()

```ts
getTargetCellId(): string | null
```

获取边的终止节点/边的 ID，没有连接到节点/边时返回 `null`。

#### getTargetPortId()

```ts
getTargetPortId(): string | null
```

获取边的终止连接桩 ID，没有连接到连接桩时返回 `null`。

#### getTargetPoint()

```ts
getTargetPoint(): Point.PointLike | null
```

获取边链接到画布的终止点，当边连接到节点/边时返回 `null`。

#### setTarget()

```ts
/**
 * 链接到节点。
 */
setTarget(
  edge: Node,
  args?: Edge.SetCellTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * 链接到边。
 */
setTarget(
  edge: Edge,
  args?: Edge.SetEdgeTerminalArgs,
  options?: Edge.SetOptions,
): this

/**
 * 链接到画布上的点。
 */
setTarget(
  point: Point | Point.PointLike,
  args?: Edge.SetTerminalCommonArgs,
  options?: Edge.SetOptions,
): this

/**
 * 设置边的终点或终止节点/边。
 */
setTarget(args: Edge.TerminalData, options?: Edge.SetOptions): this
```

#### disconnect(...)

```ts
disconnect(options?: Edge.SetOptions)
```

删除边的链接信息，即将边的起点和终点都设置为画布的原点 `{ x:0, y:0 }`。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:source'` 和 `'change:target'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

### 路径点 Vertice

#### getVertices()

```ts
getVertices(): Point.PointLike[]
```

获取路径点，当没有路径点时返回空数组。

#### setVertices(...)

```ts
setVertices(
  vertices: Point.PointLike | Point.PointLike[],
  options?: Edge.SetOptions,
): this
```

设置路径点。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| vertices | Point.PointLike \| Point.PointLike[] | ✓ |  | 路径点。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:vertices'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### insertVertex(...)

```ts
insertVertex(
  vertice: Point.PointLike,
  index?: number,
  options?: Edge.SetOptions,
): this
```

在指定位置插入一个路径点。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| vertice | Point.PointLike | ✓ |  | 路径点。 |
| index | number |  |  | 插入位置，默认插入到路径点数组的末尾。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:vertices'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### appendVertex(...)

```ts
appendVertex(vertex: Point.PointLike, options?: Edge.SetOptions): this
```

在路径点数组的末尾插入一个路径点。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| vertex | Point.PointLike | ✓ |  | 路径点。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:vertices'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### getVertexAt(...)

```ts
getVertexAt(index: number): Point.PointLike | null
```

获取指定索引位置的路径点。

| 名称  | 类型   | 必选 | 默认值 | 描述       |
| ----- | ------ | :--: | ------ | ---------- |
| index | number |  ✓   |        | 索引位置。 |

#### setVertexAt(...)

```ts
setVertexAt(
  index: number,
  vertice: Point.PointLike,
  options?: Edge.SetOptions,
): this
```

设置指定索引位置的路径点。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| index | number | ✓ |  | 索引位置。 |
| vertice | Point.PointLike | ✓ |  | 路径点。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:vertices'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### removeVertexAt(...)

```ts
removeVertexAt(index: number, options?: Edge.SetOptions): this
```

删除指定索引位置的路径点。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| index | number | ✓ |  | 索引位置。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:vertices'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

### 路由 Router

#### getRouter()

```ts
getRouter(): Edge.RouterData
```

获取路由。

#### setRouter(...)

```ts
setRouter(name: string, args?: KeyValue, options?: Edge.SetOptions): this
setRouter(router: Edge.RouterData, options?: Edge.SetOptions): this
```

设置路由。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| name | string | ✓ |  | 路由名称。 |
| args | KeyValue |  |  | 路由参数。 |
| router | Edge.RouterData | ✓ |  | 路由。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:router'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### removeRouter(...)

```ts
removeRouter(options?: Edge.SetOptions): this
```

删除路由。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:router'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

### 连接器 Connector

#### getConnector()

```ts
getConnector(): Edge.ConnectorData
```

获取连接器。

#### setConnector(...)

```ts
setConnector(name: string, args?: KeyValue, options?: Edge.SetOptions): this
setConnector(connector: Edge.ConnectorData, options?: Edge.SetOptions): this
```

设置连接器。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| name | string | ✓ |  | 连接器名称。 |
| args | KeyValue |  |  | 连接器参数。 |
| connector | Edge.ConnectorData | ✓ |  | 连接器。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:connector'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### removeConnector(...)

```ts
removeConnector(options?: Edge.SetOptions): this
```

删除连接器。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:connector'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

### 标签 Label

#### getDefaultLabel()

```ts
getDefaultLabel(): Edge.Label
```

获取默认标签。

#### getLabels()

```ts
getLabels(): Edge.Label[]
```

获取所有标签。

#### setLabels(...)

```ts
setLabels(
  labels: Edge.Label | Edge.Label[] | string | string[],
  options?: Edge.SetOptions,
): this
```

设置标签。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| labels | Edge.Label \| Edge.Label[] \| string \| string[] | ✓ |  | 标签或标签数组。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:labels'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### insertLabel(...)

```ts
insertLabel(
  label: Edge.Label | string,
  index?: number,
  options?: Edge.SetOptions,
): this
```

在指定位置插入标签。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| label | Edge.Label \| string | ✓ |  | 标签。 |
| index | number |  |  | 插入的位置，缺省时插入到标签数组的末尾。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:labels'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### appendLabel(...)

```ts
appendLabel(label: Edge.Label | string, options?: Edge.SetOptions): this
```

在标签数组末尾插入标签。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| label | Edge.Label \| string | ✓ |  | 标签。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:labels'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### getLabelAt(...)

```ts
getLabelAt(index: number): Edge.Label | null
```

获取指定位置的标签。

| 名称  | 类型   | 必选 | 默认值 | 描述       |
| ----- | ------ | :--: | ------ | ---------- |
| index | number |  ✓   |        | 索引位置。 |

#### setLabelAt(...)

```ts
setLabelAt(
  index: number,
  label: Edge.Label | string,
  options?: Edge.SetOptions,
): this
```

设置指定位置的标签。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| index | number | ✓ |  | 索引位置。 |
| label | Edge.Label \| string | ✓ |  | 标签。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:labels'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |

#### removeLabelAt(...)

```ts
removeLabelAt(index: number, options?: Edge.SetOptions): this
```

删除指定位置的标签。

| 名称 | 类型 | 必选 | 默认值 | 描述 |
| --- | --- | :-: | --- | --- |
| index | number | ✓ |  | 索引位置。 |
| options.silent | boolean |  | `false` | 为 `true` 时不触发 `'change:labels'` 事件和画布重绘。 |
| options...others | object |  |  | 其他自定义键值对，可以在事件回调中使用。 |
