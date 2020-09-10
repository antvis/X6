---
title: Graph
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## constructor

```sign
new Graph(options: Options)
```

| 选项      | 类型        | 默认值 | 必选 | 描述                         |
|-----------|-------------|--------|:----:|------------------------------|
| container | HTMLElement |        |  ✓   | 画布的容器。                  |
| model     | Model       |        |      | 画布对应的模型。              |
| x         | number      |        |      |                              |
| y         | number      |        |      |                              |
| width     | number      |        |      | 画布宽度，缺省时使用容器宽度。 |
| height    | number      |        |      | 画布高度，缺省时使用容器高度。 |

## prototype

### 模型 Model

#### isNode(...)

```sign
isNode(cell: Cell): cell is Node
```

#### isEdge(...)

```sign
isNode(cell: Cell): cell is Edge
```

#### addNode(...)
#### createNode(...)
#### removeNode(...)
#### addEdge(...)
#### createEdge(...)
#### removeEdge(...)
#### addCell(...)
#### removeCell(...)
#### removeCells(...)
#### removeConnectedEdges(...)
#### disconnectEdges(...)
#### resetCells(...)
#### clearCells(...)

#### hasCell(...)
#### getCell(...)
#### getCellById(...)
#### getCells()
#### getCellCount()
#### getNodes()
#### getEdges()
#### getOutgoingEdges(...)
#### getIncomingEdges(...)
#### getConnectedEdges(...)
#### getRootCells()
#### getLeafCells()
#### isOriginCell(...)
#### isLeafCell(...)
#### getNeighbors(...)
#### isNeighbor(...)
#### getSuccessors(...)
#### isSuccessor(...)
#### getPredecessors(...)
#### isPredecessor(...)
#### getCommonAncestor(...)
#### getSubGraph(...)
#### cloneSubGraph(...)
#### cloneCells(...)
#### getNodesFromPoint(...)
#### getNodesInArea(...)
#### getNodesUnderNode(...)
#### searchCell(...)
#### getShortestPath(...)
#### getAllCellsBBox(...)
#### getCellsBBox(...)
#### getCellsBBox(...)


#### toJSON(...)
#### fromJSON(...)
#### parseJSON(...)

### 视图 View

#### isFrozen()

#### freeze(...)

#### unfreeze(...)
#### isAsync()
#### findView(...)
#### findViews(...)
#### findViewByCell(...)
#### findViewByElem(...)
#### findViewsFromPoint(...)
#### findViewsInArea(...)
#### isViewMounted(...)
#### getMountedViews(...)
#### getUnmountedViews(...)

### 事务 Batch

事务指包含多个变更的操作的集合，

#### startBatch(...)

```sign
startBatch(name: string, data?: KeyValue): this
```

开始一个指定名称事务。开始和结束事务必须成对使用，一个事务结束前的所有变更都归属于该事务。

<span class="tag-param">参数<span>

| 名称 | 类型     | 必选 | 默认值 | 描述                           |
|------|----------|:----:|--------|------------------------------|
| name | string   |  ✓   |        | 事务名称。                      |
| data | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

#### stopBatch(...)

```sign
stopBatch(name: string, data?: KeyValue): this
```

结束指定名称事务。事开始和结束事务必须成对使用，一个事务结束前的所有变更都归属于该事务。

<span class="tag-param">参数<span>

| 名称 | 类型     | 必选 | 默认值 | 描述                           |
|------|----------|:----:|--------|------------------------------|
| name | string   |  ✓   |        | 事务名称。                      |
| data | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

<span class="tag-example">用法</span>

```ts
graph.startBatch('rename')

rect.prop('zIndex', 10)
rect.attr('label/text', 'hello')
rect.attr('label/fill', '#ff0000')

graph.stopBatch('rename')
```

#### batchUpdate(...)

```sign
batchUpdate<T>(name: string, execute: () => T, data?: KeyValue): T
```

执行一个成对的事务。

<span class="tag-param">参数<span>

| 名称    | 类型     | 必选 | 默认值 | 描述                           |
|---------|----------|:----:|--------|------------------------------|
| name    | string   |  ✓   |        | 事务名称。                      |
| execute | () => T  |  ✓   |        | 事务执行的函数。                |
| data    | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

<span class="tag-example">用法</span>

```ts
graph.batchUpdate('rename', () => {
  rect.prop('zIndex', 10)
  rect.attr('label/text', 'hello')
  rect.attr('label/fill', '#ff0000')  
})
```

### 变换 Transform

#### matrix()
#### resize(...)
#### resizeGraph(...)
#### resizeScroller(...)
#### getScale()
#### scale(...)
#### rotate(...)
#### translate(...)
#### setOrigin(...)
#### fitToContent(...)
#### scaleContentToFit(...)
#### getContentArea(...)
#### getContentBBox(...)
#### getArea(...)
#### getRestrictArea(...)

### 坐标系 Coordinate

#### getClientMatrix()
#### getClientOffset()
#### getPageOffset()
#### snapToGrid(...)
#### localToGraphPoint(...)
#### localToClientPoint(...)
#### localToPagePoint(...)

#### localToGraphRect(...)
#### localToClientRect(...)
#### localToPageRect(...)

#### graphToLocalPoint(...)
#### clientToLocalPoint(...)
#### pageToLocalPoint(...)

#### graphToLocalRect(...)
#### clientToLocalRect(...)
#### pageToLocalRect(...)

### 网格 Grid

#### getGridSize()

```sign
getGridSize(): number
```

获取网格大小。

#### setGridSize()

```sign
setGridSize(gridSize: number): this
```

设置网格大小。

#### showGrid()

```sign
showGrid(): this
```

显示网格。

#### hideGrid()

```sign
hideGrid(): this
```

隐藏网格。

#### clearGrid()

```sign
clearGrid(): this
```

清除网格。

#### drawGrid(...)

```sign
drawGrid(options?: DrawGridOptions): this
```

重绘网格。

<span class="tag-param">参数<span>

| 名称         | 类型   | 必选 | 默认值  | 描述                                             |
|--------------|--------|:----:|---------|------------------------------------------------|
| options.type | string |      | `'dot'` | 网格类型。详情请[参考这里](../api/registry/grid)。 |
| options.args | object |      | -       | 与网格类型对应的网格参数。                        |


### 背景 Background

#### drawBackground(...)

```sign
drawBackground(options?: Options): this
```

重绘背景。

<span class="tag-param">参数<span>

| 名称             | 类型   | 必选 | 默认值 | 描述              |
|------------------|--------|:----:|--------|-----------------|
| options.color    | string |      | -      | 背景颜色。         |
| options.image    | string |      | -      | 背景图片地址。     |
| options.position | string |      | -      | 背景图片位置。     |
| options.size     | string |      | -      | 背景图片大小。     |
| options.repeat   | string |      | -      | 背景图片重复方式。 |
| options.opacity  | string |      | -      | 背景图片透明度。   |

#### updateBackground()

```sign
updateBackground(): this
```

更新背景。

#### clearBackground()

```sign
clearBackground(): this
```

清除背景。

### 剪切板 Clipboard

#### copy(...)

```sign
copy(cells: Cell[], options: CopyOptions = {}): this
```

复制节点/边。

<span class="tag-param">参数<span>

| 名称                    | 类型    | 必选 | 默认值 | 描述                                       |
|-------------------------|---------|:----:|--------|------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被复制的节点/边。                           |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                 |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 localStorage 中。 |

#### cut(...)

```sign
cut(cells: Cell[], options: CopyOptions = {}): this
```

剪切节点/边。

<span class="tag-param">参数<span>

| 名称                    | 类型    | 必选 | 默认值 | 描述                                       |
|-------------------------|---------|:----:|--------|------------------------------------------|
| cells                   | Cell[]  |  ✓   |        | 被剪切的节点/边。                           |
| options.deep            | boolean |      | -      | 是否递归复制所有子节点/边。                 |
| options.useLocalStorage | boolean |      | -      | 是否将复制的节点/边保存在 localStorage 中。 |

#### paste(...)

```sign
paste(options?: PasteOptions, graph?: Graph): Cell[]
```

粘贴，返回粘贴到画布的节点/边。

<span class="tag-param">参数<span>

| 名称                    | 类型                                   | 必选 | 默认值 | 描述                               |
|-------------------------|----------------------------------------|:----:|--------|----------------------------------|
| options.useLocalStorage | boolean                                |      | -      | 是否使用 localStorage 中的节点/边。 |
| options.offset          | number \| `{ dx: number; dy: number }` |      | `20`   | 粘贴到画布的节点/边的偏移量。       |
| options.nodeProps       | Node.Properties                        |      | -      | 粘贴到画布的节点的额外属性。        |
| options.edgeProps       | Edge.Properties                        |      | -      | 粘贴到画布的边的额外属性。          |
| graph                   | Graph                                  |      | `this` | 粘贴的目标画布，默认粘贴到当前画布。 |

#### getCellsInClipboard()

```sign
getCellsInClipboard: Cell[]
```

获取剪切板中的节点/边。

#### cleanClipboard()

```sign
cleanClipboard(): this
```

清空剪切板。

#### isClipboardEmpty()

```sign
isClipboardEmpty(): boolean
```

返回剪切板是否为空。

#### isClipboardEnabled()

```sign
isClipboardEnabled(): boolean
```

返回是否启用了剪切板。

#### enableClipboard()

```sign
enableClipboard(): this
```

启用剪切板。

#### disableClipboard()

```sign
disableClipboard(): this
```

禁用剪切板。

#### toggleClipboard(...)

```sign
toggleClipboard(enabled?: boolean): this
```

切换剪切板的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用剪切板，缺省时切换剪切板的启用状态。 |

### 撤销/重做 Redo/Undo

#### undo(...)

```sign
undo(options?: KeyValue): this
```

撤销。`options` 将被传递到事件回调中。 

#### undoAndCancel(...)

```sign
undoAndCancel(options?: KeyValue): this
```

撤销，并且不添加到重做队列中，所以这个被撤销的命令不能被重做。`options` 将被传递到事件回调中。 

#### redo(...)

```sign
redo(options?: KeyValue): this
```

重做。`options` 将被传递到事件回调中。 

#### canUndo()

```sign
canUndo(): boolean
```

是否可以撤销。

#### canRedo()

```sign
canRedo(): boolean
```

是否可以重做。

#### cleanHistory(...)

```sign
cleanHistory(options?: KeyValue): this
```

清空历史状态。`options` 将被传递到事件回调中。 

#### isHistoryEnabled()

```sign
isHistoryEnabled(): boolean
```

是否启用了历史状态。

#### enableHistory()

```sign
enableHistory(): this
```

启用历史状态。

#### disableHistory()

```sign
disableHistory(): this
```

禁用历史状态。

#### toggleHistory(...)

```sign
toggleHistory(enabled?: boolean): this
```

切换历史的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用历史状态，缺省时切换历史的启用状态。 |


### 键盘 Keyboard

#### bindKey(...)

```sign
bindKey(
  keys: string | string[], 
  callback: (e: KeyboardEvent) => void, 
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

绑定键盘快捷键，请参考 [Mousetrap](https://github.com/ccampbell/mousetrap) 的使用文档。

<span class="tag-param">参数<span>

| 名称     | 类型                                     | 必选 | 默认值 | 描述      |
|----------|------------------------------------------|:----:|--------|---------|
| keys     | string \| string[]                       |  ✓   |        | 快捷键。   |
| callback | `(e: KeyboardEvent) => void`             |  ✓   |        | 回调函数。 |
| action   | `'keypress'` \| `'keydown'` \| `'keyup'` |      | -      | 触发时机。 |


#### unbindKey(...)

```sign
unbindKey(
  keys: string | string[], 
  action?: 'keypress' | 'keydown' | 'keyup',
): this
```

解绑键盘快捷键，请参考 [Mousetrap](https://github.com/ccampbell/mousetrap) 的使用文档。

<span class="tag-param">参数<span>

| 名称   | 类型                                     | 必选 | 默认值 | 描述      |
|--------|------------------------------------------|:----:|--------|---------|
| keys   | string \| string[]                       |  ✓   |        | 快捷键。   |
| action | `'keypress'` \| `'keydown'` \| `'keyup'` |      | -      | 触发时机。 |

#### isKeyboardEnabled()

```sign
isKeyboardEnabled(): boolean
```

获取是否启用了键盘事件。

#### enableKeyboard()

```sign
enableKeyboard(): this
```

启用键盘事件。

#### disableKeyboard()

```sign
disableKeyboard(): this
```

禁用键盘事件。

#### toggleKeyboard(...)

```sign
toggleKeyboard(enabled?: boolean): this
```

切换键盘事件的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                           |
|---------|---------|:----:|--------|----------------------------------------------|
| enabled | boolean |      | -      | 是否启用键盘事件，缺省时切换键盘事件的启用状态。 |

### 滚轮 Mousewheel

#### isMouseWheelEnabled()

```sign
isMouseWheelEnabled(): boolean
```

返回是否启用了鼠标滚轮来缩放画布。

#### enableMouseWheel()

```sign
enableMouseWheel(): this
```

启用鼠标滚轮缩放画布。

#### disableMouseWheel()

```sign
disableMouseWheel(): this
```

禁用鼠标滚轮缩放画布。

#### toggleMouseWheel(...)

```sign
toggleMouseWheel(enabled?: boolean): this
```

切换鼠标滚轮缩放画布的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                                           |
|---------|---------|:----:|--------|--------------------------------------------------------------|
| enabled | boolean |      | -      | 是否启用鼠标滚轮缩放画布，缺省时切换鼠标滚轮缩放画布的启用状态。 |

### 选择 Selection

#### select(...)

```sign
select(cells: Cell | string | (Cell | string)[]): this 
```

选中指定的节点/边。需要注意的是，该方法不会取消选中当前选中的节点/边，而是将指定的节点/边追加到选区中。如果同时需要取消选中当前选中的节点/边，请使用 [resetSelection(...)](#resetselection) 方法。

#### unselect(...)

```sign
unselect(cells: Cell | string | (Cell | string)[]): this 
```

取消选中指定的节点/边。

#### isSelected(...)

```sign
isSelected(cell: Cell | string): boolean
```

返回指定的节点/边是否被选中。

#### resetSelection(...)

```sign
resetSelection(cells?: Cell | string | (Cell | string)[]): this
```

先清空选区，然后选中提供的节点/边。

#### getSelectedCells()

```sign
getSelectedCells(): Cell[]
```

获取选中的节点/边。

#### cleanSelection()

```sign
cleanSelection(): this
```

清空选区。

#### isSelectionEmpty()

```sign
cleanSelection(): boolean
```

返回选区是否为空。

#### isSelectionEnabled()

```sign
isSelectionEnabled(): boolean
```

是否启用选择能力。

#### enableSelection()

```sign
enableSelection(): this
```

启用选择能力。

#### disableSelection()

```sign
disableSelection(): this
```

禁用选择能力。

#### toggleSelection(...)

```sign
toggleSelection(enabled?: boolean): this
```

切换选择的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用选择能力，缺省时切换选择的启用状态。 |


#### isMultipleSelection()

```sign
isMultipleSelection(): boolean
```

是否启用了多选。

#### enableMultipleSelection()

```sign
enableMultipleSelection(): this
```

启用多选。

#### disableMultipleSelection()

```sign
disableMultipleSelection(): this
```

禁用多选。

#### toggleMultipleSelection(...)

```sign
toggleMultipleSelection(multiple?: boolean): this
```

切换多选的启用状态。

<span class="tag-param">参数<span>

| 名称     | 类型    | 必选 | 默认值 | 描述                                   |
|----------|---------|:----:|--------|--------------------------------------|
| multiple | boolean |      | -      | 是否启用多选，缺省时切换多选的启用状态。 |


#### isSelectionMovable()

```sign
isSelectionMovable(): boolean
```

返回选中的节点/边是否可以被移动。

#### enableSelectionMovable()

```sign
enableSelectionMovable(): this
```

启用选中的节点/边的移动。

#### disableSelectionMovable()

```sign
disableSelectionMovable(): this
```

禁用选中节点/边的移动。

#### toggleSelectionMovable(...)

```sign
toggleSelectionMovable(enabled?: boolean): this
```

切换选中节点/边是否可以被移动。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                            |
|---------|---------|:----:|--------|-----------------------------------------------|
| enabled | boolean |      | -      | 是否启用选中的节点/边的移动，缺省时切换启用状态。 |

#### isRubberbandEnabled()

```sign
isRubberbandEnabled(): boolean
```

返回是否启用了框选。

#### enableRubberband()

```sign
enableRubberband(): this
```

启用框选。

#### disableRubberband()

```sign
disableRubberband(): this
```

禁用框选。

#### toggleRubberband(...)

```sign
toggleRubberband(enabled?: boolean): this
```

切换框选的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                             |
|---------|---------|:----:|--------|--------------------------------|
| enabled | boolean |      | -      | 是否启用框选，缺省时切换启用状态。 |


#### isStrictRubberband()

```sign
isStrictRubberband(): boolean
```

返回是否启用了严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。

#### enableStrictRubberband()

```sign
enableStrictRubberband(): this
```

启用严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。

#### disableStrictRubberband()

```sign
disableStrictRubberband(): this
```

禁用严格框选。禁用严格框选后，只需要选框与节点/边的包围盒相交即可选中节点/边。

#### toggleStrictRubberband(...)

```sign
toggleStrictRubberband(enabled?: boolean): this
```

切换严格框选的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                 |
|---------|---------|:----:|--------|------------------------------------|
| enabled | boolean |      | -      | 是否启用严格框选，缺省时切换启用状态。 |

#### setSelectionFilter(...)

```sign
setSelectionFilter(
  filter?: 
   | null
   | (string | { id: string })[]
   | ((this: Graph, cell: Cell) => boolean)
): this
```

设置选择的过滤条件，满足过滤条件的节点/边将不能被选中。

- 当 `filter` 为 `null`、`undefined` 时，不过滤节点/边。
- 当 `filter` 为 `(string | { id: string })[]` 时，表示具有这些 ID 的节点/边不能被选中
- 当 `filter` 为 `(this: Graph, cell: Cell) => boolean` 时，返回 `true` 时节点/边不能被选中。

#### setRubberbandModifiers(...)

```sign
setRubberbandModifiers(modifiers?: string | ModifierKey[] | null): this
```

设置框选的修饰键，只有同时按下修饰键时才能触发框选。

#### setSelectionDisplayContent(...)

```sign
setSelectionDisplayContent(
  content?: 
   | null
   | false
   | string
   | ((this: Graph, selection: Selection, contentElement: HTMLElement) => string)
): this
```

设置选中节点/边的附加显示内容。

- 当 `content` 为 `null`、`undefined`、`false` 时，不显示附加内容
- 当 `content` 为 `string` 时，显示一段文本。
- 当 `content` 为 `(this: Graph, selection: Selection, contentElement: HTMLElement) => string` 时，动态返回显示的内容。


### 对齐线 Snapline

#### isSnaplineEnabled()

```sign
isSnaplineEnabled(): boolean
```

返回是否启用对齐线。

#### enableSnapline()

```sign
enableSnapline(): this
```

启用对齐线。

#### disableSnapline()

```sign
disableSnapline(): this
```

禁用对齐线。

#### toggleSnapline(...)

```sign
toggleSnapline(enabled?: boolean): this
```

切换对齐线的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

#### hideSnapline()

```sign
hideSnapline(): this
```

隐藏对齐线。

#### isSnaplineOnResizingEnabled()

```sign
isSnaplineOnResizingEnabled(): boolean
```

调整节点大小时，是否触发对齐线。

#### enableSnaplineOnResizing()

```sign
enableSnaplineOnResizing(): this
```

启用调整节点大小过程中触发对齐线。

#### disableSnaplineOnResizing()

```sign
disableSnaplineOnResizing(): this
```

禁用调整节点大小过程中触发对齐线。

#### toggleSnaplineOnResizing(...)

```sign
toggleSnaplineOnResizing(enabled?: boolean): this
```

切换调整节点大小过程中是否触发对齐线。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用对齐线，缺省时切换对齐线的启用状态。 |

#### isSharpSnapline()

```sign
isSharpSnapline(): boolean
```

是否使用短款对齐线。

#### enableSharpSnapline()

```sign
enableSharpSnapline(): this
```

启用短款对齐线，启用后对齐线只显示到相关节点位置处，否则显示贯穿画布的对齐线。

#### disableSharpSnapline()

```sign
disableSharpSnapline(): this
```

禁用短款对齐线，对齐线将贯穿整个画布。

#### toggleSharpSnapline(...)

```sign
toggleSharpSnapline(enabled?: boolean): this
```

切换短款对齐线的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                               |
|---------|---------|:----:|--------|--------------------------------------------------|
| enabled | boolean |      | -      | 是否启用短款对齐线，缺省时切换短款对齐线的启用状态。 |

#### getSnaplineTolerance()

```sign
getSnaplineTolerance(): number
```

获取对齐线精度。

#### setSnaplineTolerance(...)

```sign
setSnaplineTolerance(tolerance: number): this
```

设置对齐线精度。

#### setSnaplineFilter(...)

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

### 滚动 Scroller

#### lockScroller()
#### unlockScroller()
#### updateScroller()
#### getScrollbarPosition()
#### setScrollbarPosition(...)
#### scrollToPoint(...)
#### scrollToContent(...)
#### scrollToCell(...)
#### center(...)
#### centerPoint(...)
#### centerContent(...)
#### centerCell(...)
#### positionContent(...)
#### positionCell(...)
#### positionRect(...)
#### positionPoint(...)
#### zoom(...)
#### zoomTo(...)
#### zoomToRect(...)
#### zoomToFit(...)
#### transitionToPoint(...)
#### transitionToRect(...)
#### isPannable()
#### enablePanning()
#### disablePanning()
#### togglePanning()

### 工具 Tools

#### removeTools()

```sign
removeTools(): this
```

删除工具。

#### hideTools()

```sign
hideTools(): this
```

隐藏工具。

#### showTools()

```sign
showTools(): this
```

显示工具。

### 定义 Defs

#### defineFilter(...)

```sign
defineFilter(options: FilterOptions): string
```

定义[滤镜](../api/registry/filter)，返回滤镜 ID。

<span class="tag-param">参数<span>

| 名称          | 类型     | 必选 | 默认值 | 描述                            |
|---------------|----------|:----:|--------|-------------------------------|
| options.name  | string   |  ✓   |        | 滤镜名称。                       |
| options.args  | string   |      | -      | 滤镜参数。                       |
| options.id    | string   |      | -      | 滤镜 ID，默认自动生成。           |
| options.attrs | KeyValue |      | -      | 添加到 `<filter>` 元素上的属性。 |


<span class="tag-example">使用<span>

```ts
const filterId = graph.defineFilter({
  name: 'dropShadow',
  args: {
    dx: 2,
    dy: 2,
    blur: 3,
  },
})

rect.attr('body/filter', `#${filterId}`)
```

#### defineGradient(...)

```sign
defineGradient(options: GradientOptions): string
```

定义渐变背景，返回背景 ID。

<span class="tag-param">参数<span>

| 名称          | 类型                                                | 必选 | 默认值 | 描述                        |
|---------------|-----------------------------------------------------|:----:|--------|---------------------------|
| options.type  | string                                              |  ✓   |        | 渐变背景元素名称。           |
| options.stops | {offset: number; color: string; opacity?: number}[] |      | -      | 渐变背景的控制点。           |
| options.id    | string                                              |      | -      | 背景 ID，默认自动生成。       |
| options.attrs | KeyValue                                            |      | -      | 添加到渐变背景元素上的属性。 |

<span class="tag-example">使用<span>

```ts
rect.attr('body/fill', `url#${graph.defineGradient(...)}`)
rect.attr('body/stroke', `url#${graph.defineGradient(...)}`)
```

#### defineMarker(...)

```sign
defineMarker(options: MarkerOptions): string
```

定义箭头或路径点的 Maker，返回 ID。

<span class="tag-param">参数<span>

| 名称                | 类型            | 必选 | 默认值             | 描述          |
|---------------------|-----------------|:----:|--------------------|---------------|
| options.id          | string          |      | -                  | 默认自动生成。 |
| options.tagName     | string          |      | `'path'`           | 元素标签名。   |
| options.markerUnits | string          |      | `'userSpaceOnUse'` |               |
| options.children    | MarkerOptions[] |      | -                  | 子元素。       |
| options.attrs       | KeyValue        |      | -                  | 元素的属性。   |
