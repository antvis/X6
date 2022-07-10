---
title: 点选/框选 Selection
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

创建画布时，通过以下配置开启选择交互，开启后可以通过点击或者套索框选节点。

```ts
const graph = new Graph({
  selecting: true,
})

// 等同于
const graph = new Graph({
  selecting: {
    enabled: true,
  },
})
```

创建画布后，可以调用 [graph.enableSelection()](#graphenableselection) 和 [graph.disableSelection()](#graphdisableselection) 来启用和禁用选择交互。

```ts
if (graph.isSelectionEnabled()) {
  graph.disableSelection()
} else {
  graph.enableSelection()
}
```

## 演示

- 点击选中节点。
- 启用多选，按住 Ctrl/Command 后点击节点多选。
- 启用移动，拖动选框移动节点。
- 启用框选，在画布空白位置按下鼠标左键，拖动选框来框选节点。
- 启用严格框选模式(strict)，观察对框选的影响。
- 选择与框选配合使用的修饰键，如 `alt` 键，按住 `alt` 键并画布空白位置按下鼠标左键，拖动选框来框选节点。
- 应用自定义样式名(my-selection)，选中节点的选框颜色被自定义。
- 应用自定义过滤器(排除 circle 节点)，圆形节点不能被选中。
- 应用自定义附加内容(显示选中节点个数)，选择两个及以上的节点，触发显示自定义内容。

<iframe src="/demos/tutorial/basic/selection/playground"></iframe>


## 选项

```ts
interface SelectionOptions {
  className?: string
  multiple?: boolean
  rubberband?: boolean
  rubberNode?: boolean
  rubberEdge?: boolean
  strict?: boolean
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  multipleSelectionModifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  movable?: boolean
  following?: boolean
  content?:
    | null
    | false
    | string
    | ((
        this: Graph,
        selection: Selection,
        contentElement: HTMLElement,
      ) => string)
  filter?:
    | null
    | string[]
    | ({ id: string })[]
    | ((this: Graph, cell: Cell) => boolean)
  showEdgeSelectionBox?: boolean
  showNodeSelectionBox?: boolean
  useCellGeometry?: boolean
  pointerEvents?: 'none' | 'auto'
}
```

### className

附加样式名，用于定制样式，默认为 `undefined`。

```ts
const graph = new Graph({
  selecting: {
    enabled: true,
    className: 'my-selecting',
  },
})
```

### multiple

是否启用点击多选，默认为 `true`。启用多选后默认按住 `ctrl` 或 `command` 键点击节点实现多选。和 `multipleSelectionModifiers` 配合使用。

### multipleSelectionModifiers

修饰键(`'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需按下修饰键才能触发点选多选。默认值是 `['ctrl', 'meta']`。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

### rubberband

是否启用框选，默认为 `false`。开启框选时，默认只能框选节点，如果需要自定义框选节点或者边，可以配置 `rubberNode` 和 `rubberEdge` 属性。

```ts
const graph = new Graph({
  selecting: {
    enabled: true,
    rubberband: true, // 启用框选
  },
})
```

创建画布后，可以调用 [graph.enableRubberband()](#graphenablerubberband) 和 [graph.disableRubberband()](#graphdisablerubberband) 来启用和禁用框选。

```ts
if (graph.isRubberbandEnabled()) {
  graph.disableRubberband()
} else {
  graph.enableRubberband()
}
```

### strict

启用框选时，选框完全包围节点时才选中节点，否则只需要选框与节点的包围盒(BBox)相交即可选中节点，默认为 `false`。

### modifiers

修饰键(`'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要点击鼠标并按下修饰键才能触发框选。修饰键在某些场景下非常有用，比如同时开始框选和拖拽画布时，而框选和拖拽画布的触发时机都是鼠标左键在画布空白位置按下，这时可以为框选和拖拽画布设置不一样的修饰键，达到同时开启又不冲突的效果。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

### movable

在多选情况下，选中的节点是否一起移动，设置为 `true` 时，拖动选框框选的节点一起移动，默认为 `true`。

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*MD11S4oxIJIAAAAAAAAAAAAAARQnAQ" width="600px" height="300px" alt="movable"/>

### following

在多选情况下，选中的节点是否跟随鼠标实时移动，默认为 `true`。下图是设置为 `false` 下的表现：

<img src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*nt5KQqqZHDUAAAAAAAAAAAAAARQnAQ" width="600px" height="300px" alt="following"/>

### content

设置附加显示的内容。

### filter

节点过滤器，被过滤的节点将不能被选中。支持以下三种类型：

- `string[]`  节点类型数组，指定的节点类型不参与对齐计算
- `({ id: string })[]` 节点（类节点）数组，指定的节点不参与对齐计算
- `(this: Graph, node: Node) => boolean` 返回 `true` 的节点不参与对齐计算

```ts
const graph = new Graph({
  selecting: {
    enabled: true,
    filter: ['rect'], // 'rect' 类型节点不能被选中
  },
})

// 等同于
const graph = new Graph({
  selecting: {
    enabled: true,
    filter(node) {
      return node.shape === 'rect'
    },
  },
})
```

### showNodeSelectionBox

是否显示节点的选择框，默认为 `false`，建议使用下面的样式定制方法去定制自己的选择框样式。

### showEdgeSelectionBox

是否显示边的选择框，默认为 `false`，建议使用下面的样式定制方法去定制自己的选择框样式。

### useCellGeometry
是否使用几何计算的方式计算节点包围盒，默认为 `false`，如果设置为 `true`，`selectionBox` 只会包含节点本身(不会包含连接桩)。

### pointerEvents
如果打开 `showNodeSelectionBox` 时，会在节点上方盖一层元素，导致节点的事件无法响应，此时可以配置 `pointerEvents: none` 来解决，默认值是 `auto`。

## 样式定制

上面介绍了通过 [className](#classname) 选项来定制样式，另外也可以通过覆盖以下几个 CSS 样式定义来定制，默认的样式定义[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/addon/selection/index.less)。

- x6-widget-selection
- x6-widget-selection-rubberband
- x6-widget-selection-selected
- x6-widget-selection-box
- x6-widget-selection-inner
- x6-widget-selection-content

## 事件

### cell:selected

节点/边被选中时触发。

```ts
graph.on('cell:selected', (args: { 
  cell: Cell
  options: Model.SetOptions 
}) => { 
  // code here
})
```

### node:selected

节点被选中时触发。

```ts
graph.on('node:selected', (args: { 
  cell: Cell
  node: Node 
  options: Model.SetOptions 
}) => { 
  // code here
})
```

### edge:selected 

边被选中时触发。

```ts
graph.on('edge:selected', (args: { 
  cell: Cell
  edge: Edge
  options: Model.SetOptions 
}) => { 
  // code here
})
```

### cell:unselected

节点/边被取消选中时触发。

```ts
graph.on('cell:unselected', (args: { 
  cell: Cell
  options: Model.SetOptions 
}) => { 
  // code here
})
```

### node:unselected

节点被取消选中时触发。

```ts
graph.on('node:unselected', (args: { 
  cell: Cell
  node: Node 
  options: Model.SetOptions 
}) => { 
  // code here
})
```

### edge:unselected 

边被取消选中时触发。

```ts
graph.on('edge:unselected', (args: { 
  cell: Cell
  edge: Edge
  options: Model.SetOptions 
}) => { 
  // code here
})
```

### selection:changed 

选中的节点/边发生改变(增删)时触发。

```ts
graph.on('selection:changed', (args: {
  added: Cell[]     // 新增被选中的节点/边
  removed: Cell[]   // 被取消选中的节点/边
  selected: Cell[]  // 被选中的节点/边
  options: Model.SetOptions
}) => {
  // code here
})
```

## API

### graph.select(...)

```sign
select(cells: Cell | string | (Cell | string)[]): this 
```

选中指定的节点/边。需要注意的是，该方法不会取消选中当前选中的节点/边，而是将指定的节点/边追加到选区中。如果同时需要取消选中当前选中的节点/边，请使用 [resetSelection(...)](#resetselection) 方法。

### graph.unselect(...)

```sign
unselect(cells: Cell | string | (Cell | string)[]): this 
```

取消选中指定的节点/边。

### graph.isSelected(...)

```sign
isSelected(cell: Cell | string): boolean
```

返回指定的节点/边是否被选中。

### graph.resetSelection(...)

```sign
resetSelection(cells?: Cell | string | (Cell | string)[]): this
```

先清空选区，然后选中提供的节点/边。

### graph.getSelectedCells()

```sign
getSelectedCells(): Cell[]
```

获取选中的节点/边。

### graph.cleanSelection()

```sign
cleanSelection(): this
```

清空选区。

### graph.isSelectionEmpty()

```sign
cleanSelection(): boolean
```

返回选区是否为空。

### graph.isSelectionEnabled()

```sign
isSelectionEnabled(): boolean
```

是否启用选择能力。

### graph.enableSelection()

```sign
enableSelection(): this
```

启用选择能力。

### graph.disableSelection()

```sign
disableSelection(): this
```

禁用选择能力。

### graph.toggleSelection(...)

```sign
toggleSelection(enabled?: boolean): this
```

切换选择的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用选择能力，缺省时切换选择的启用状态。 |


### graph.isMultipleSelection()

```sign
isMultipleSelection(): boolean
```

是否启用了多选。

### graph.enableMultipleSelection()

```sign
enableMultipleSelection(): this
```

启用多选。

### graph.disableMultipleSelection()

```sign
disableMultipleSelection(): this
```

禁用多选。

### graph.toggleMultipleSelection(...)

```sign
toggleMultipleSelection(multiple?: boolean): this
```

切换多选的启用状态。

<span class="tag-param">参数<span>

| 名称     | 类型    | 必选 | 默认值 | 描述                                   |
|----------|---------|:----:|--------|--------------------------------------|
| multiple | boolean |      | -      | 是否启用多选，缺省时切换多选的启用状态。 |


### graph.isSelectionMovable()

```sign
isSelectionMovable(): boolean
```

返回选中的节点/边是否可以被移动。

### graph.enableSelectionMovable()

```sign
enableSelectionMovable(): this
```

启用选中的节点/边的移动。

### graph.disableSelectionMovable()

```sign
disableSelectionMovable(): this
```

禁用选中节点/边的移动。

### graph.toggleSelectionMovable(...)

```sign
toggleSelectionMovable(enabled?: boolean): this
```

切换选中节点/边是否可以被移动。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                            |
|---------|---------|:----:|--------|-----------------------------------------------|
| enabled | boolean |      | -      | 是否启用选中的节点/边的移动，缺省时切换启用状态。 |

### graph.isRubberbandEnabled()

```sign
isRubberbandEnabled(): boolean
```

返回是否启用了框选。

### graph.enableRubberband()

```sign
enableRubberband(): this
```

启用框选。

### graph.disableRubberband()

```sign
disableRubberband(): this
```

禁用框选。

### graph.toggleRubberband(...)

```sign
toggleRubberband(enabled?: boolean): this
```

切换框选的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                             |
|---------|---------|:----:|--------|--------------------------------|
| enabled | boolean |      | -      | 是否启用框选，缺省时切换启用状态。 |


### graph.isStrictRubberband()

```sign
isStrictRubberband(): boolean
```

返回是否启用了严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。

### graph.enableStrictRubberband()

```sign
enableStrictRubberband(): this
```

启用严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。

### graph.disableStrictRubberband()

```sign
disableStrictRubberband(): this
```

禁用严格框选。禁用严格框选后，只需要选框与节点/边的包围盒相交即可选中节点/边。

### graph.toggleStrictRubberband(...)

```sign
toggleStrictRubberband(enabled?: boolean): this
```

切换严格框选的启用状态。

<span class="tag-param">参数<span>

| 名称    | 类型    | 必选 | 默认值 | 描述                                 |
|---------|---------|:----:|--------|------------------------------------|
| enabled | boolean |      | -      | 是否启用严格框选，缺省时切换启用状态。 |

### graph.setSelectionFilter(...)

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
- 当 `filter` 为 `(this: Graph, cell: Cell) => boolean` 时，返回 `false` 时节点/边不能被选中。

### graph.setRubberbandModifiers(...)

```sign
setRubberbandModifiers(modifiers?: string | ModifierKey[] | null): this
```

设置框选的修饰键，只有同时按下修饰键时才能触发框选。

### graph.setSelectionDisplayContent(...)

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
