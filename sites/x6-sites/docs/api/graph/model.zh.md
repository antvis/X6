---
title: Model
order: 14
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

### model

画布对应的模型，默认创建一个新模型。 

## 方法

### isNode(...)

```sign
isNode(cell: Cell): cell is Node
```

返回指定的 Cell 是否是节点。

<span class="tag-param">参数<span>

| 名称 | 类型 | 必选 | 默认值 | 描述         |
|------|------|:----:|--------|------------|
| cell | Cell |  ✓   |        | 指定的 Cell。 |

### isEdge(...)

```sign
isEdge(cell: Cell): cell is Edge
```

返回指定的 Cell 是否是边。

<span class="tag-param">参数<span>

| 名称 | 类型 | 必选 | 默认值 | 描述         |
|------|------|:----:|--------|------------|
| cell | Cell |  ✓   |        | 指定的 Cell。 |

### createNode(...)

```sign
createNode(metadata: Node.Metadata): Node
```

创建节点。

<span class="tag-param">参数<span>

| 名称     | 类型          | 必选 | 默认值 | 描述                                    |
|----------|---------------|:----:|--------|---------------------------------------|
| metadata | Node.Metadata |  ✓   |        | [节点元数据](/zh/docs/api/model/node#constructor)。 |

### addNode(...)

```sign
addNode(metadata: Node.Metadata, options?: AddOptions): Node
addNode(node: Node, options?: AddOptions): Node
```

添加节点到画布，返回添加的节点。

<span class="tag-param">参数<span>

| 名称             | 类型                  | 必选 | 默认值  | 描述                                                                |
|------------------|-----------------------|:----:|---------|-------------------------------------------------------------------|
| node             | Node.Metadata \| Node |  ✓   |         | [节点元数据](/zh/docs/api/model/node#constructor)或[节点实例](/zh/docs/api/model/node)。   |
| options.silent   | boolean               |      | `false` | 为 `true` 时不触发 `'node:added'` 和 `'cell:added'` 事件和画布重绘。 |
| options.sort     | boolean               |      | `true`  | 是否按照  `zIndex` 排序。                                            |
| options...others | object                |      |         | 其他自定义键值对，可以在事件回调中使用。                              |

### addNodes(...)

```sign
addNodes(nodes: (Node.Metadata | Node)[], options?: AddOptions): Graph
```

添加多个节点到画布，返回该画布。批量添加节点的时候，推荐使用这个方法，相比多次 addNode，它具备更好的性能。

<span class="tag-param">参数<span>

| 名称             | 类型                  | 必选 | 默认值  | 描述                                                                |
|------------------|-----------------------|:----:|---------|-------------------------------------------------------------------|
| nodes             | (Node.Metadata \| Node)[] |  ✓   |         | [节点元数据](/en/docs/api/model/node#constructor)或[节点实例](/en/docs/api/model/node)数组。   |
| options.silent   | boolean               |      | `false` | 为 `true` 时不触发 `'node:added'` 和 `'cell:added'` 事件和画布重绘。 |
| options.sort     | boolean               |      | `true`  | 是否按照  `zIndex` 排序。                                            |
| options...others | object                |      |         | 其他自定义键值对，可以在事件回调中使用。                              |

### removeNode(...)

```sign
removeNode(nodeId: string, options?: RemoveOptions): Node | null
removeNode(node: Node, options?: RemoveOptions): Node | null
```

删除节点，返回删除的节点。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                    |
|------------------|----------------|:----:|---------|-----------------------------------------------------------------------|
| node             | string \| Node |  ✓   |         | 节点 ID 或[节点实例](/zh/docs/api/model/node)。                                     |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'node:removed'` 和 `'cell:removed'` 事件和画布重绘。 |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                  |

### createEdge(...)

```sign
createEdge(metadata: Edge.Metadata): Edge
```

创建边。

<span class="tag-param">参数<span>

| 名称     | 类型          | 必选 | 默认值 | 描述                                    |
|----------|---------------|:----:|--------|---------------------------------------|
| metadata | Edge.Metadata |  ✓   |        | [节点元数据](/zh/docs/api/model/edge#constructor)。 |

### addEdge(...)

```sign
addEdge(metadata: Edge.Metadata, options?: AddOptions): Edge
addEdge(edge:Edge, options?: AddOptions): Edge
```

添加边到画布，返回添加的边。

<span class="tag-param">参数<span>

| 名称             | 类型                  | 必选 | 默认值  | 描述                                                                |
|------------------|-----------------------|:----:|---------|-------------------------------------------------------------------|
| edge             | Edge.Metadata \| Edge |  ✓   |         | [边元数据](/zh/docs/api/model/edge#constructor)或[边实例](/zh/docs/api/model/edge)。       |
| options.silent   | boolean               |      | `false` | 为 `true` 时不触发 `'edge:added'` 和 `'cell:added'` 事件和画布重绘。 |
| options.sort     | boolean               |      | `true`  | 是否按照  `zIndex` 排序。                                            |
| options...others | object                |      |         | 其他自定义键值对，可以在事件回调中使用。                              |

### addEdges(...)

```sign
addEdges(edges: (Edge.Metadata | Edge)[], options?: AddOptions): Graph
```

添加多条边到画布，返回该画布。

<span class="tag-param">参数<span>

| 名称             | 类型                  | 必选 | 默认值  | 描述                                                                |
|------------------|-----------------------|:----:|---------|-------------------------------------------------------------------|
| edges             | (Edge.Metadata \| Edge)[] |  ✓   |         | [边元数据](/en/docs/api/model/edge#constructor)或[边实例](/en/docs/api/model/edge)数组。       |
| options.silent   | boolean               |      | `false` | 为 `true` 时不触发 `'edge:added'` 和 `'cell:added'` 事件和画布重绘。 |
| options.sort     | boolean               |      | `true`  | 是否按照  `zIndex` 排序。                                            |
| options...others | object                |      |         | 其他自定义键值对，可以在事件回调中使用。                              |

### removeEdge(...)

```sign
removeEdge(edgeId: string, options?: RemoveOptions): Edge | null
removeEdge(edge: Edge, options?: RemoveOptions): Edge | null
```

删除边，返回删除的边。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                    |
|------------------|----------------|:----:|---------|-----------------------------------------------------------------------|
| edge             | string \| Edge |  ✓   |         | 边 ID 或[边实例](/zh/docs/api/model/edge)。                                         |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'edge:removed'` 和 `'cell:removed'` 事件和画布重绘。 |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                  |

### addCell(...)

```sign
addCell(cell: Cell | Cell[], options?: AddOptions): this
```

添加节点或边到画布。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                               |
|------------------|----------------|:----:|---------|----------------------------------------------------------------------------------|
| cell             | Cell \| Cell[] |  ✓   |         | [节点实例](/zh/docs/api/model/node)或[边实例](/zh/docs/api/model/edge)，支持传入数组同时添加多个节点或边。 |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'cell:added'`、`'node:added'` 和 `'edge:added'` 事件和画布重绘。 |
| options.sort     | boolean        |      | `true`  | 是否按照  `zIndex` 排序。                                                           |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                             |

### removeCell(...)

```sign
removeCell(cellId: string, options?: RemoveOptions): Cell | null
removeCell(cell: Cell, options?: RemoveOptions): Cell | null
```

删除节点或边，返回删除的节点或边。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                                      |
|------------------|----------------|:----:|---------|-----------------------------------------------------------------------------------------|
| cell             | string \| Cell |  ✓   |         | 节点/边 ID 或节点/边的实例。                                                               |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'cell:removed'`、`'node:removed'` 和 `'edge:removed'`  事件和画布重绘。 |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                                    |

### removeCells(...)

```sign
removeCells(cells: (Cell | string)[], options?: RemoveOptions): Cell[]
```

删除多个节点/边，返回删除的节点或边的数组。

<span class="tag-param">参数<span>

| 名称             | 类型               | 必选 | 默认值  | 描述                                                                                      |
|------------------|--------------------|:----:|---------|-----------------------------------------------------------------------------------------|
| cell             | (string \| Cell)[] |  ✓   |         | 节点/边 ID 或节点/边数组。                                                                 |
| options.silent   | boolean            |      | `false` | 为 `true` 时不触发 `'cell:removed'`、`'node:removed'` 和 `'edge:removed'`  事件和画布重绘。 |
| options...others | object             |      |         | 其他自定义键值对，可以在事件回调中使用。                                                    |

### removeConnectedEdges(...)

```sign
removeConnectedEdges(cell: Cell | string, options?: RemoveOptions): Edge[]
```

删除连接到节点/边的边，返回被删除边的数组。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                     |
|------------------|----------------|:----:|---------|------------------------------------------------------------------------|
| cell             | string \| Cell |  ✓   |         | 节点/边 ID 或节点/边。                                                    |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'cell:removed'` 和 `'edge:removed'`  事件和画布重绘。 |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                   |

### disconnectConnectedEdges(...)

```sign
disconnectConnectedEdges(cell: Cell | string, options?: Edge.SetOptions): this
```

将链接到节点/边的边的起点和终点设置为原点 `{x: 0, y: 0}`，即断开连接。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                                 |
|------------------|----------------|:----:|---------|------------------------------------------------------------------------------------|
| cell             | string \| Cell |  ✓   |         | 节点/边 ID 或节点/边。                                                                |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'edge:change:source'` 和 `'edge:change:target'`  事件和画布重绘。 |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                               |

### clearCells(...)

```sign
clearCells(options?: SetOptions): this
```

清空画布。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                                                      |
|------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------|
| options.silent   | boolean |      | `false` | 为 `true` 时不触发 `'cell:removed'`、`'node:removed'` 和 `'edge:removed'`  事件和画布重绘。 |
| options...others | object  |      |         | 其他自定义键值对，可以在事件回调中使用。                                                    |

### resetCells(...)

```sign
resetCells(cells: Cell[], options?: SetOptions): this
```

清空画布并添加用指定的节点/边。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                                                                                                   |
|------------------|---------|:----:|---------|--------------------------------------------------------------------------------------------------------------------------------------|
| cell             | Cell[]  |  ✓   |         | 节点/边数组。                                                                                                                           |
| options.silent   | boolean |      | `false` | 为 `true` 时不触发 `'cell:added'`、`'node:added'`、`'edge:added'`、`'cell:removed'`、`'node:removed'` 和 `'edge:removed'`  事件和画布重绘。 |
| options...others | object  |      |         | 其他自定义键值对，可以在事件回调中使用。                                                                                                 |

### hasCell(...)

```sign
hasCell(cellId: string): boolean
hasCell(cell: Cell): boolean
```

返回画布中是否包含指定的节点/边。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

### getCellById(...)

```sign
getCellById(id: string)
```

根据节点/边的 ID 获取节点/边。

<span class="tag-param">参数<span>

| 名称 | 类型   | 必选 | 默认值 | 描述          |
|------|--------|:----:|--------|-------------|
| id | string |  ✓   |        | 节点/边的 ID。 |

### updateCellId(...)

```sign
updateCellId(cell: Cell, newId: string)
```

更新节点或者边的 ID，会返回新创建的节点/边。

<span class="tag-param">参数<span>

| 名称 | 类型   | 必选 | 默认值 | 描述          |
|------|--------|:----:|--------|-------------|
| cell | Cell   |  ✓   |        | 节点/边。 |
| newId |string |  ✓   |        | 新的 ID。 |

### getCells()

```sign
getCells(): Cell[]
```

返回画布中所有节点和边。

### getCellCount()

```sign
getCellCount(): number
```

返回画布中所有节点和边的数量。

### getNodes()

```sign
getNodes(): Node[]
```

返回画布中所有节点。

### getEdges()

```sign
getEdges(): Edge[]
```

返回画布中所有边。

### getOutgoingEdges(...)

```sign
getOutgoingEdges(cell: Cell | string): Edge[] | null
```

获取连接到节点/边的输出边，即边的起点为指定节点/边的边。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

### getIncomingEdges(...)

```sign
getIncomingEdges(cell: Cell | string): Edge[] | null
```

获取连接到节点/边的输入边，即边的终点为指定节点/边的边。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

### getConnectedEdges(...)

```sign
getConnectedEdges(cell: Cell | string, options?: GetConnectedEdgesOptions): Edge[]
```

获取与节点/边相连接的边。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                                                                |
|------------------|----------------|:----:|---------|-------------------------------------------------------------------------------------------------------------------|
| cell             | string \| Cell |  ✓   |         | 节点/边 ID 或节点/边。                                                                                               |
| options.incoming | boolean        |      | -       | 是否包含输入边，默认返回所有输入和输出边，`incoming` 和 `outgoing` 两个选项中，当 `incoming` 为 `true` 时只返回输入边。 |
| options.outgoing | boolean        |      | -       | 是否包含输出边，默认返回所有输入和输出边，`incoming` 和 `outgoing` 两个选项中，当 `outgoing` 为 `true` 时只返回输出边。 |
| options.deep     | boolean        |      | `false` | 是否递归获取所有子节点/边，为 `true` 时将同时返回链接到所有子孙节点/边的边。                                          |
| options.enclosed | boolean        |      | `false` | 是否包含子孙节点之间相连接的边。                                                                                     |
| options.indirect | boolean        |      | `false` | 是否包含哪些间接连接的边，即连接到输入或输出边上的边。                                                                |

<span class="tag-example">使用<span>

```ts
const edges = graph.getConnectedEdges(node) // 返回输入和输出边
const edges = graph.getConnectedEdges(node, { incoming: true, outgoing: true }) // 返回输入和输出边

const edges = graph.getConnectedEdges(node, { incoming: true }) // 返回输入边
const edges = graph.getConnectedEdges(node, { incoming: true, outgoing: false }) // 返回输入边

const edges = graph.getConnectedEdges(node, { outgoing: true }) // 返回输出边
const edges = graph.getConnectedEdges(node, { incoming:false, outgoing: true }) // 返回输出边

const edges = graph.getConnectedEdges(node, { deep: true }) // 返回输入和输出边，包含链接到所有子孙节点/边的输入和输出边
const edges = graph.getConnectedEdges(node, { deep: true, incoming: true }) // 返回输入边，包含链接到所有子孙节点/边的输入边
const edges = graph.getConnectedEdges(node, { deep: true, enclosed: true }) // 返回输入和输出边，同时包含子孙节点/边之间相连的边

const edges = graph.getConnectedEdges(node, { indirect: true }) // 返回输入和输出边，包含间接连接的边
```

### getRootNodes()

```sign
getRootNodes(): Node[]
```

获取所有根节点，即没有输入边的节点。

### isRootNode(...)

```sign
isRootNode(cell: Cell | string): boolean
```

返回指定的节点是否是根节点。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

### getLeafNodes()

```sign
getLeafNodes(): Node[]
```

返回所有叶子节点，即没有输出边的节点。

### isLeafNode(...)

```sign
isLeafNode(cell: Cell | string): boolean
```

返回指定的节点是否是叶子节点

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

### getNeighbors(...)

```sign
getNeighbors(cell: Cell, options?: GetNeighborsOptions): Cell[]
```

获取邻居节点。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                                                                                                  |
|------------------|---------|:----:|---------|-------------------------------------------------------------------------------------------------------------------------------------|
| cell             | Cell    |  ✓   |         | 节点/边。                                                                                                                              |
| options.incoming | boolean |      | -       | 是否包含输入侧的邻居节点，默认包含输入和输出侧的节点，`incoming` 和 `outgoing` 两个选项中，当 `incoming` 为 `true` 时只返回输入侧的节点。 |
| options.outgoing | boolean |      | -       | 是否包含输出侧的邻居节点，默认包含输入和输出侧的节点，`incoming` 和 `outgoing` 两个选项中，当 `outgoing` 为 `true` 时只返回输出侧的节点。 |
| options.deep     | boolean |      | `false` | 是否递归获取所有子节点/边，为 `true` 时将同时返回所有子孙节点/边的邻居节点。                                                            |
| options.indirect | boolean |      | `false` | 是否包含哪些间接连接的邻居节点，即中间包含多条边(边与边连接)的邻居。                                                                    |

### isNeighbor(...)

```sign
isNeighbor(cell1: Cell, cell2: Cell, options?: GetNeighborsOptions): boolean
```

返回 `cell2` 是否是 `cell1` 的邻居， 其中 `options` 选项与 [`getNeighbors(...)`](#getneighbors) 方法的选项一致。

### getPredecessors(...)

```sign
getPredecessors(cell: Cell, options?: GetPredecessorsOptions): Cell[]
```

返回节点的前序节点，即从根节点开始连接到指定节点的节点。

<span class="tag-param">参数<span>

| 名称                 | 类型                                                  | 必选 | 默认值  | 描述                                                                       |
|----------------------|-------------------------------------------------------|:----:|---------|--------------------------------------------------------------------------|
| cell                 | Cell                                                  |  ✓   |         | 节点/边。                                                                   |
| options.breadthFirst | boolean                                               |      | `false` | 是否使用广度优先搜索算法，默认使用深度优先搜索算法。                         |
| options.deep         | boolean                                               |      | `false` | 是否递归获取所有子节点/边，为 `true` 时将同时返回所有子孙节点/边的前序节点。 |
| options.distance     | number \| number[] \| ((distance: number) => boolean) |      | -       | 距获取指定距离的前序节点，节点和节点之间相隔的边的数量为 `1` 个距离单位。    |

### isPredecessor(...)

```sign
isPredecessor(cell1: Cell, cell2: Cell, options?: GetPredecessorsOptions): boolean
```

返回 `cell2` 是否是 `cell1` 的前序节点，其中 `options` 选项与 [`getPredecessors(...)`](#getpredecessors) 方法的选项一致。


### getSuccessors(...)

```sign
getSuccessors(cell: Cell, options?: GetPredecessorsOptions): Cell[]
```

获取所有后续节点，即从指定节点开始连接到叶子节点的节点。其中 `options` 选项与 [`getPredecessors(...)`](#getpredecessors) 方法的选项一致。


### isSuccessor(...)

```sign
isSuccessor(cell1: Cell, cell2: Cell, options?: GetPredecessorsOptions): boolean
```

返回 `cell2` 是否是 `cell1` 的后续节点，其中 `options` 选项与 [`getPredecessors(...)`](#getpredecessors) 方法的选项一致。

### getCommonAncestor(...)

```sign
getCommonAncestor(...cells: {Cell | Cell[])[]): Cell | null
```

获取指定节点的共同祖先节点。

### getSubGraph(...)

```sign
getSubGraph(cells: Cell[], options？: GetSubgraphOptions): Cell[]
```

返回指定节点和边构成的子图。通过遍历指定的 `cells` 数组，当遇到边时，同时包含边的起始和终止节点；当遇到节点时，如果与节点相连的边的两端的节点都在 `cells` 数组中，则同时包含该条边。

<span class="tag-param">参数<span>

| 名称         | 类型    | 必选 | 默认值  | 描述                       |
|--------------|---------|:----:|---------|--------------------------|
| cells        | Cell[]  |  ✓   |         | 节点/边数组。               |
| options.deep | boolean |      | `false` | 是否递归获取所有子节点/边。 |

### cloneCells(...)

```sign
cloneCells(cells: Cell[]): { [oldCellId: string]: Cell }
```

克隆，返回旧节点/边 ID 和克隆后节点/边的键值对。

### cloneSubGraph(...)

```sign
cloneSubGraph(cells: Cell[], options?: GetSubgraphOptions): { [oldCellId: string]: Cell }
```

获取子图并克隆。其中 `options` 选项与 [`getSubGraph(...)`](#getsubgraph) 方法的选项一致。

### getNodesFromPoint(...)

```sign
getNodesFromPoint(x: number, y: number): Node[]
getNodesFromPoint(p: Point.PointLike): Node[]
```

返回指定位置的节点，即返回节点的矩形区域包含了指定点的节点。

### getNodesInArea(...)

```sign
getNodesInArea(
  x: number,
  y: number,
  w: number,
  h: number,
  options?: Model.GetCellsInAreaOptions,
): Node[]
getNodesInArea(
  rect: Rectangle.RectangleLike,
  options?: Model.GetCellsInAreaOptions,
): Node[]
```

返回指定矩形区域的节点，当 `options.strict` 为 `true` 时，要求节点的矩形区域完全包含指定的矩形，否则只需要相交即可。

### getNodesUnderNode(...)

```sign
getNodesUnderNode(
  node: Node,
  options？: {
    by?: 'bbox' | Rectangle.KeyPoint
  },
): Node[]
```

返回与指定节点位置的节点，通过 `options.by` 选项来指定获取方式，包含：

- `null` 或 `bbox`：返回与指定的节点矩形区域相交的节点
- `Rectangle.KeyPoint`：返回包含矩形的某个关键点的节点，其中 `Rectangle.KeyPoint` 的取值为：
  - `"center"` 
  - `"origin"`
  - `"corner"` 
  - `"topLeft"` 
  - `"topCenter"` 
  - `"topRight"` 
  - `"bottomLeft"` 
  - `"bottomCenter"` 
  - `"bottomRight"` 
  - `"leftMiddle"`
  - `"rightMiddle"` 

### searchCell(...)

```sign
searchCell(cell: Cell, iterator: SearchIterator, options?: SearchOptions): this
```

从指定的节点/边开始进行遍历。

<span class="tag-param">参数<span>

| 名称                 | 类型                                  | 必选 | 默认值  | 描述                                                                                                                                  |
|----------------------|---------------------------------------|:----:|---------|-------------------------------------------------------------------------------------------------------------------------------------|
| cell                 | Cell                                  |  ✓   |         | 节点/边。                                                                                                                              |
| iterator             | (cell: Cell, distance: number) => any |  ✓   |         | 遍历方法。                                                                                                                             |
| options.breadthFirst | boolean                               |      | `false` | 是否使用广度优先搜索算法，默认使用深度优先搜索算法。                                                                                    |
| options.incoming     | boolean                               |      | -       | 是否遍历输入侧的邻居节点，默认遍历输入和输出侧的节点，`incoming` 和 `outgoing` 两个选项中，当 `incoming` 为 `true` 时只遍历输入侧的节点。 |
| options.outgoing     | boolean                               |      | -       | 是否遍历输出侧的邻居节点，默认遍历输入和输出侧的节点，`incoming` 和 `outgoing` 两个选项中，当 `outgoing` 为 `true` 时只遍历输出侧的节点。 |
| options.deep         | boolean                               |      | `false` | 是否递归遍历所有子节点/边，为 `true` 时将同时遍历所有子孙节点/边的邻居节点。                                                            |
| options.indirect     | boolean                               |      | `false` | 是否遍历哪些间接连接的邻居节点，即中间包含多条边(边与边连接)的邻居。                                                                    |

### getShortestPath(...)

```sign
getShortestPath(
  source: Cell | string,
  target: Cell | string,
  options?: GetShortestPathOptions,
): string[]
```

获取节点之间的最短路径，返回最短路径上的节点 ID。

<span class="tag-param">参数<span>

| 名称             | 类型                             | 必选 | 默认值        | 描述                                                           |
|------------------|----------------------------------|:----:|---------------|--------------------------------------------------------------|
| source           | Cell \| string                   |  ✓   |               | 起始节点/边。                                                   |
| source           | Cell \| string                   |  ✓   |               | 终止节点/边。                                                   |
| options.directed | boolean                          |      | `false`       | 是否考虑方向性，为 `true` 时需要路径沿开始节点到终止节点的方向。 |
| options.weight   | (u: string, v: string) => number |      | `(u, v) => 1` | 距离权重算法，`u` 和 `v` 为相邻的两个节点，默认距离为 `1`。       |

### getAllCellsBBox(...)

```sign
getAllCellsBBox(): Rectangle | null
```

返回画布上所有节点和边的矩形区域。

### getCellsBBox(...)

```sign
getCellsBBox(cells: Cell[], options?: Cell.GetCellsBBoxOptions): Rectangle | null
```

返回指定节点和边构成的矩形区域。

<span class="tag-param">参数<span>

| 名称         | 类型    | 必选 | 默认值  | 描述                      |
|--------------|---------|:----:|---------|-------------------------|
| cells        | Cell[]  |  ✓   |         | 节点和边数组。             |
| options.deep | boolean |      | `false` | 是否包含所有子孙节点和边。 |

### toJSON(...)

```sign
toJSON(options?: ToJSONOptions): object
```

导出图中的节点和边，返回一个具有 `{ cells: [] }` 结构的对象，其中 `cells` 数组按渲染顺序保存节点和边。

<span class="tag-param">参数<span>

| 名称         | 类型 | 必选 | 默认值  | 描述                                                                                             |
|--------------|------|:----:|---------|------------------------------------------------------------------------------------------------|
| options.deep | diff |      | `false` | 是否导出节点和边的差异数据（与节点和边的[默认配置](/zh/docs/tutorial/basic/cell#选项默认值)不同的部分）。 |

### parseJSON(...)

将指定的数据转换为节点和边。

支持节点/边元数据数组，按照数组顺序返回创建的节点和边。

```sign
parseJSON(cells: (Node.Metadata | Edge.Metadata)[]): (Node | Edge)[]
```

或者提供一个包含 `cells`、`nodes`、`edges` 的对象，按照 `[...cells, ...nodes, ...edges]` 顺序创建节点和边并返回。

```sign
parseJSON({
  cells?: (Node.Metadata | Edge.Metadata)[],
  nodes?: Node.Metadata[],
  edges?: Edge.Metadata[],
}): (Node | Edge)[]
```


### fromJSON(...)

按照指定的 JSON 数据渲染节点和边。


支持节点/边元数据数组，按照数组顺序渲染节点和边。

```sign
fromJSON(data: (Node.Metadata | Edge.Metadata)[], options?: FromJSONOptions): this
```

或者提供一个包含 `cells`、`nodes`、`edges` 的对象，按照 `[...cells, ...nodes, ...edges]` 顺序渲染。

```sign
fromJSON(
  data: {
    cells?: (Node.Metadata | Edge.Metadata)[],
    nodes?: Node.Metadata[],
    edges?: Edge.Metadata[],
  }, 
  options?: FromJSONOptions,
): this
```

当 `options.silent` 为 `true` 时，不触发 `cell:added`、`node:added` 和 `edge:added` 事件和画布重绘。
