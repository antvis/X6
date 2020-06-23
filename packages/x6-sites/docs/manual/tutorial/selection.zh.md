---
title: 点选/框选 Selection
order: 8
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
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

创建画布后，可以调用 `graph.enableSelection()` 和 `graph.disableSelection()` 来启用和禁用选择交互。

```ts
if (graph.isSelectionEnabled()) {
  graph.disableSelection()
} else {
  graph.enableSelection()
}
```

## 选项

```ts
interface SelectionOptions {
  className?: string
  multiple?: boolean
  rubberband?: boolean
  strict?: boolean
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  movable?: boolean
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
    | (string 
    | { id: string })[] 
    | ((this: Graph, cell: Cell) => boolean)
}
```

### className

附加样式名，用于定制样式，默认为空。

```ts
const graph = new Graph({
  selecting: {
    enabled: true,
    className: 'my-selecting',
  },
})
```

### multiple

是否启用点击多选，默认为 `true`。启用多选后按住 `ctrl` 或 `command` 键点击节点实现多选。

### rubberband

是否启用框选，默认为 `false`。

```ts
const graph = new Graph({
  selecting: {
    enabled: true,
    rubberband: true, // 启用框选
  },
})
```

创建画布后，可以调用 `graph.enableRubberband()` 和 `graph.disableRubberband()` 来启用和禁用框选。

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

修饰键(如 `'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要点击鼠标并按下修饰键才能触发框选。修饰键在某些场景下非常有用，比如同时开始框选和拖拽画布时，而框选和拖拽画布的触发时机都是鼠标左键在画布空白位置按下，这时可以为框选和拖拽画布设置不一样的修饰键，达到同时开启又不冲突的效果。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

### movable

选中的节点是否可以被移动，设置为 `true` 时，拖动选框触发节点移动，默认为 `true`。

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
      return node.type === 'rect'
    },
  },
})
```

## 样式定制

上面介绍了通过 `className` 选项来定制样式，另外也可以通过覆盖以下几个 CSS 样式定义来定制，默认的样式定义[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/addon/selection/index.less)。

- x6-widget-selection
- x6-widget-selection-lasso
- x6-widget-selection-selected
- x6-widget-selection-box
- x6-widget-selection-inner
- x6-widget-selection-content

## Playground

- 点击选中节点；
- 启用多选，按住 Ctrl/Command 点击节点多选；
- 启用移动，拖动选框移动节点；
- 启用框选，在画布空白位置按下鼠标左键，拖动选框来框选节点；
- 启用严格框选模式(strict)，观察对框选的影响；
- 选择与框选配合使用的修饰键，如 `alt` 键，按住 `alt` 键并画布空白位置按下鼠标左键，拖动选框来框选节点；
- 应用自定义样式名(my-selection)，选中节点的选框颜色被自定义；
- 应用自定义过滤器(排除 circle 节点)，圆形节点不能被选中；
- 应用自定义附加内容(显示选中节点个数)，选择两个及以上的节点，触发显示自定义内容。

<iframe
     src="https://codesandbox.io/embed/x6-playground-selection-1pvnm?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden; margin-top: 16px;"
     title="x6-playground-selection"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 事件

支持如下事件：

- `cell:selected` 节点/边被选中时触发。
- `node:selected` 节点被选中时触发。
- `edge:selected` 边被选中时触发。
- `cell:unselected` 节点/边被取消选中时触发。
- `node:unselected` 节点被取消选中时触发。
- `edge:unselected` 边被取消选中时触发。
- `selection:changed` 选中的节点/边发生改变(增删)时触发。

事件回调函数对应的参数如下：

```ts
interface SelectionEventArgs {
  'cell:selected': { cell: Cell; options: Model.SetOptions }
  'node:selected': { cell: Cell; node: Node; options: Model.SetOptions }
  'edge:selected': { cell: Cell; edge: Edge; options: Model.SetOptions }
  'cell:unselected': { cell: Cell; options: Model.SetOptions }
  'node:unselected': { cell: Cell; node: Node; options: Model.SetOptions }
  'edge:unselected': { cell: Cell; edge: Edge; options: Model.SetOptions }
  'selection:changed': {
    added: Cell[]
    removed: Cell[]
    selected: Cell[]
    options: Model.SetOptions
  }
}
```

例如，监听节点被选中事件：

```ts
graph.on('node:selected', ({cell, node, options}) => {
  // code here
})
```

## API

- `graph.select(cells: Cell | Cell[])` 选中节点/边。
- `graph.unselect(cells: Cell | Cell[])` 取消选中节点/边。
- `graph.isSelected(cell: Cell | string)` 节点/边是否被选中。
- `graph.getSelectedCells()` 获取选中的节点/边。
- `graph.getSelectedCellCount()` 获取选中的节点/边的数量。
- `graph.isSelectionEmpty()` 选区是否为空。
- `graph.cleanSelection()` 清空选区。
- `graph.setSelectionFilter(filter?: Selection.Filter)` 设置过滤器。
- `graph.setSelectionDisplayContent(content?: Selection.Content)` 设置附加显示内容。
- `graph.setRubberbandModifiers(modifiers?: string | ModifierKey[] | null)` 设置框选修饰键。

- `graph.isSelectionEnabled()` 是否启用选中交互。
- `graph.enableSelection()` 启用选中交互。
- `graph.disableSelection()` 禁用选中交互。
- `graph.toggleSelection(enabled?: boolean)` 切换是否启用选中交互。

- `graph.isMultipleSelection()`  是否支持点击多选。
- `graph.enableMultipleSelection()` 开启点击多选，开启后按下 `ctrl` 或 `command` 键点击节点多选 。
- `graph.disableMultipleSelection()` 禁用点击多选。
- `graph.toggleMultipleSelection(multiple?: boolean)` 切换点击多选。

- `graph.isRubberbandEnabled()` 是否启用框选。
- `graph.enableRubberband()` 启用框选。
- `graph.disableRubberband()` 禁用框选。
- `graph.toggleRubberband(enabled?: boolean)` 切换是否启用框选。

- `graph.isStrictRubberband()` 是否启用严格框选，启用后节点完全位于选框中时才会被选中。
- `graph.enableStrictRubberband()` 启用严格框选。
- `graph.disableStrictRubberband()` 禁用严格框选。
- `graph.toggleStrictRubberband(strict?: boolean)` 切换严格框选。

- `graph.isSelectionMovable()` 选中的节点是否可以被移动。
- `graph.enableSelectionMovable()` 开启选中的节点被移动。
- `graph.disableSelectionMovable()` 禁止选中的节点被移动。
- `graph.toggleSelectionMovable(movable?: boolean)` 切换选中节点是否可以被移动。
