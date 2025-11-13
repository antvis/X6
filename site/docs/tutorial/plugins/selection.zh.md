---
title: 框选
order: 5
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/plugins
---

:::info{title=在本章节中主要介绍框选插件相关的知识，通过阅读，你可以了解到}

- 如何启用选择与框选
- 如何配置多选与严格框选
- 如何设置修饰键与触发事件（eventTypes）

:::

## 使用

你可以通过插件 `Selection` 启用选择与框选功能，示例：

```ts
import { Graph, Selection } from '@antv/x6'

const graph = new Graph({
  background: {
    color: '#F2F7FA',
  },
})
graph.use(
  new Selection({
    enabled: true,
  }),
)
```

## 演示

- 点击选中节点。
- 启用多选，按住 Ctrl/Command 后点击节点多选。
- 启用移动，拖动选框移动节点。
- 启用框选，在画布空白位置按下鼠标左键，拖动选框来框选节点。
- 启用严格框选（strict）模式，观察其对框选的影响。
- 选择与框选配合使用的修饰键，如 `alt`；按住 `alt` 键，在画布空白处按下鼠标左键并拖动选框来框选节点。
- 应用自定义过滤器（排除 circle 节点），圆形节点不能被选中。
- 应用自定义附加内容（显示选中节点个数），选择两个及以上的节点，触发显示自定义内容。

<code id="plugin-selection" src="@/src/tutorial/plugins/selection/index.tsx"></code>

## 配置

| 属性名                     | 类型                 | 默认值                                | 必选 | 描述                                                                                                                                           |
| -------------------------- | -------------------- | ------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| className                  | string               | -                                     |      | 附加样式名，用于定制样式                                                                                                                       |
| multiple                   | boolean              | `true`                                |      | 是否启用点击多选，启用后按住 `ctrl` 或 `command` 键点击节点实现多选                                                                            |
| multipleSelectionModifiers | ModifierKey          | `['ctrl', 'meta']`                    |      | 用于设置上面点击多选配套的修饰键                                                                                                               |
| rubberband                 | boolean              | `false`                               |      | 是否启用框选节点功能                                                                                                                           |
| modifiers                  | ModifierKey          | -                                     |      | 用于设置上面框选配套的修饰键                                                                                                                   |
| strict                     | boolean              | `false`                               |      | 选框是否需要完全包围节点时才选中节点                                                                                                           |
| movable                    | boolean              | `true`                                |      | 拖动选框时框选的节点是否一起移动                                                                                                               |
| content                    | string               | -                                     |      | 设置附加显示的内容                                                                                                                             |
| filter                     | Filter               | -                                     |      | 节点过滤器                                                                                                                                     |
| showNodeSelectionBox       | boolean              | `false`                               |      | 是否显示节点的选择框                                                                                                                           |
| showEdgeSelectionBox       | boolean              | `false`                               |      | 是否显示边的选择框                                                                                                                             |
| pointerEvents              | `'none' \| 'auto'`   | `auto`                                |      | 如果打开 `showNodeSelectionBox` 时，会在节点上方盖一层元素，导致节点的事件无法响应，此时可以配置 `pointerEvents: none` 来解决，默认值是 `auto` |
| eventTypes                 | SelectionEventType[] | `['leftMouseDown', 'mouseWheelDown']` |      | 用于设置框选的触发事件类型                                                                                                                     |

`Filter` 的类型定义如下：

```ts
type Filter = string[] | { id: string }[] | (this: Graph, cell: Cell) => boolean
```

- `string[]`： 节点 shape 数组，指定的节点/边 shape 才能被选中
- `({ id: string })[]`： 节点 ID 数组，指定的节点/边才能被选中
- `(this: Graph, cell: Cell) => boolean`： 返回 true 的节点/边才能被选中

`ModifierKey` 的类型定义如下：

```ts
type ModifierKey = string | ('alt' | 'ctrl' | 'meta' | 'shift' | 'space')[] | null
```

X6 中修饰键包括 `alt`、`ctrl`、`meta`、`shift`、`space` 五个，设置修饰键后点击鼠标并按下修饰键即可触发相应的行为。如果框选和画布拖拽平移的触发条件完全相同时，即相同事件类型（eventTypes）和修饰键（modifiers），框选的优先级更高（禁用默认的画布拖拽平移）；如果触发条件不同，则互不影响。因此在同时开始框选和拖拽画布时，修饰键就非常有用，比如框选和拖拽画布的触发时机都是鼠标左键在画布空白位置按下（leftMouseDown），这时可以为框选和拖拽画布设置不一样的修饰键，达到同时开启又不冲突的效果。支持配置单个（如 `alt`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是或关系，比如刚刚配置的修饰键表示按下 `alt` 或 `ctrl`，如果需要更加灵活的配置，可以使用如下这些形式：

- `alt` 表示按下 `alt`。
- `[alt, ctrl]`, 表示按下 `alt` 或 `ctrl`。
- `alt|ctrl` 表示按下 `alt` 或 `ctrl`。
- `alt&ctrl` 表示同时按下 `alt` 和 `ctrl`。
- `alt|ctrl&shift` 表示同时按下 `alt` 和 `shift` 或者同时按下 `ctrl` 和 `shift`。

`SelectionEventType` 的类型定义如下：

```ts
type SelectionEventType = 'leftMouseDown' | 'mouseWheelDown';
```

触发框选的交互方式。支持2种形式或者他们之间的组合：

- `leftMouseDown`: 按下鼠标左键移动进行拖拽
- `mouseWheelDown`: 按下鼠标滚轮进行拖拽

## API

### graph.select(...)

```ts
select(cells: Cell | string | (Cell | string)[]): this
```

选中指定的节点/边。需要注意的是，该方法不会取消选中当前选中的节点/边，而是将指定的节点/边追加到选区中。如果同时需要取消选中当前选中的节点/边，请使用 [resetSelection(...)](#graphresetselection) 方法。

### graph.unselect(...)

```ts
unselect(cells: Cell | string | (Cell | string)[]): this
```

取消选中指定的节点/边。

### graph.isSelected(...)

```ts
isSelected(cell: Cell | string): boolean
```

返回指定的节点/边是否被选中。

### graph.resetSelection(...)

```ts
resetSelection(cells?: Cell | string | (Cell | string)[]): this
```

先清空选区，然后选中提供的节点/边。

### graph.getSelectedCells()

```ts
getSelectedCells(): Cell[]
```

获取选中的节点/边。

### graph.cleanSelection()

```ts
cleanSelection(): this
```

清空选区。

### graph.isSelectionEmpty()

```ts
isSelectionEmpty(): boolean
```

返回选区是否为空。

### graph.isSelectionEnabled()

```ts
isSelectionEnabled(): boolean
```

返回是否启用选择能力。

### graph.enableSelection()

```ts
enableSelection(): this
```

启用选择能力。

### graph.disableSelection()

```ts
disableSelection(): this
```

禁用选择能力。

### graph.toggleSelection(...)

```ts
toggleSelection(enabled?: boolean): this
```

切换选择的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                       |
|---------|---------|:----:|--------|------------------------------------------|
| enabled | boolean |      | -      | 是否启用选择能力，缺省时切换选择的启用状态。 |

### graph.isMultipleSelection()

```ts
isMultipleSelection(): boolean
```

返回是否启用了多选。

### graph.enableMultipleSelection()

```ts
enableMultipleSelection(): this
```

启用多选。

### graph.disableMultipleSelection()

```ts
disableMultipleSelection(): this
```

禁用多选。

### graph.toggleMultipleSelection(...)

```ts
toggleMultipleSelection(multiple?: boolean): this
```

切换多选的启用状态。参数如下：

| 名称     | 类型    | 必选 | 默认值 | 描述                                   |
|----------|---------|:----:|--------|--------------------------------------|
| multiple | boolean |      | -      | 是否启用多选，缺省时切换多选的启用状态。 |

### graph.isSelectionMovable()

```ts
isSelectionMovable(): boolean
```

返回选中的节点/边是否可以被移动。

### graph.enableSelectionMovable()

```ts
enableSelectionMovable(): this
```

启用选中的节点/边的移动。

### graph.disableSelectionMovable()

```ts
disableSelectionMovable(): this
```

禁用选中节点/边的移动。

### graph.toggleSelectionMovable(...)

```ts
toggleSelectionMovable(enabled?: boolean): this
```

切换选中节点/边是否可以被移动。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                            |
|---------|---------|:----:|--------|-----------------------------------------------|
| enabled | boolean |      | -      | 是否启用选中的节点/边的移动，缺省时切换启用状态。 |

### graph.isRubberbandEnabled()

```ts
isRubberbandEnabled(): boolean
```

返回是否启用了框选。

### graph.enableRubberband()

```ts
enableRubberband(): this
```

启用框选。

### graph.disableRubberband()

```ts
disableRubberband(): this
```

禁用框选。

### graph.toggleRubberband(...)

```ts
toggleRubberband(enabled?: boolean): this
```

切换框选的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                             |
|---------|---------|:----:|--------|--------------------------------|
| enabled | boolean |      | -      | 是否启用框选，缺省时切换启用状态。 |

### graph.isStrictRubberband()

```ts
isStrictRubberband(): boolean
```

返回是否启用了严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。

### graph.enableStrictRubberband()

```ts
enableStrictRubberband(): this
```

启用严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。

### graph.disableStrictRubberband()

```ts
disableStrictRubberband(): this
```

禁用严格框选。禁用严格框选后，只需要选框与节点/边的包围盒相交即可选中节点/边。

### graph.toggleStrictRubberband(...)

```ts
toggleStrictRubberband(enabled?: boolean): this
```

切换严格框选的启用状态。参数如下：

| 名称    | 类型    | 必选 | 默认值 | 描述                                 |
|---------|---------|:----:|--------|------------------------------------|
| enabled | boolean |      | -      | 是否启用严格框选，缺省时切换启用状态。 |

### graph.setSelectionFilter(...)

```ts
setSelectionFilter(
  filter?:
   | null
   | (string | { id: string })[]
   | ((this: Graph, cell: Cell) => boolean)
): this
```

设置选择的过滤条件，满足过滤条件的节点/边才能被选中。

### graph.setRubberbandModifiers(...)

```ts
setRubberbandModifiers(modifiers?: string | ModifierKey[] | null): this
```

设置框选的修饰键，只有同时按下修饰键时才能触发框选。

### graph.setSelectionDisplayContent(...)

```ts
setSelectionDisplayContent(
  content?:
   | null
   | false
   | string
   | ((this: Graph, selection: Selection, contentElement: HTMLElement) => string)
): this
```

设置选中节点/边的附加显示内容。

## 事件

| 事件名称            | 参数类型                                                                        | 描述                              |
|---------------------|---------------------------------------------------------------------------------|---------------------------------|
| `cell:selected`     | `{ cell: Cell; options: Model.SetOptions }`                                     | 节点/边被选中时触发               |
| `node:selected`     | `{ node: Node; options: Model.SetOptions }`                                     | 节点被选中时触发                  |
| `edge:selected`     | `{ edge: Edge; options: Model.SetOptions }`                                     | 边被选中时触发                    |
| `cell:unselected`   | `{ cell: Cell; options: Model.SetOptions }`                                     | 节点/边被取消选中时触发           |
| `node:unselected`   | `{ node: Node; options: Model.SetOptions }`                                     | 节点被取消选中时触发              |
| `edge:unselected`   | `{ edge: Edge; options: Model.SetOptions }`                                     | 边被取消选中时触发                |
| `selection:changed` | `{added: Cell[]; removed: Cell[]; selected: Cell[]; options: Model.SetOptions}` | 选中的节点/边发生改变(增删)时触发 |

```ts
graph.on('node:selected', ({ node }) => {
  console.log(node)
})

// 我们也可以在插件实例上监听事件
selection.on('node:selected', ({ node }) => {
  console.log(node)
})
```
