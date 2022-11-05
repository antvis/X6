---
title: Scroller
order: 4
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

Scroller 使画布具备滚动、平移、居中、缩放等能力，默认禁用。创建画布时，通过下面配置即可开启。

```ts
const graph = new Graph({
  scroller: true,
})

// 等同于
const graph = new Graph({
  scroller: {
    enabled: true,
  },
})
```

<iframe src="/demos/tutorial/basic/scroller/playground"></iframe>

支持的选项如下：

```sign
interface ScrollerOptions {
  enabled?: boolean
  pannable?: boolean
  className?: string
  width?: number
  height?: number
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  pageWidth?: number
  pageHeight?: number
  pageVisible?: boolean
  pageBreak?: boolean
  autoResize?: boolean
  resizeOptions?: TransformManager.FitToContentFullOptions | ((this: Scroller, scroller: Scroller) => TransformManager.FitToContentFullOptions)
  minVisibleWidth?: number
  minVisibleHeight?: number
  padding?: number | { top: number; right: number; bottom: number; left: number}
  background?: false | BackgroundOptions
}
```

### className

附加样式名，用于定制样式。默认为 `undefined`。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
    className: 'my-scroller',
  },
})
```

### width

Scroller 的宽度，默认为画布容器宽度。

### height

Scroller 的高度，默认为画布容器高度。

### pannable

是否启用画布平移能力（在空白位置按下鼠标后拖动平移画布），默认为 `false`。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
    pannable: true,
  },
})
```

创建画布后，也可以调用 [graph.enablePanning()](#enablepanning) 和 [graph.disablePanning()](#disablepanning) 来启用和禁用画布平移。

```ts
if (graph.isPannable()) {
  graph.disablePanning()
} else {
  graph.enablePanning()
}
```

### modifiers

修饰键(`'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要点击鼠标并按下修饰键才能触发画布拖拽。修饰键在某些场景下非常有用，比如同时开始框选和拖拽画布时，而框选和拖拽画布的触发时机都是鼠标左键在画布空白位置按下，这时可以为框选和拖拽画布设置不一样的修饰键，达到同时开启又不冲突的效果。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

### padding

设置画布四周的 padding 边距。默认根据 `minVisibleWidth` 和 `minVisibleHeight` [自动计算](https://github.com/antvis/X6/blob/master/packages/x6/src/addon/scroller/index.ts#L1081-L1088)得到，保证画布滚动时，在宽度和高度方向至少有 `minVisibleWidth` 和 `minVisibleHeight` 大小的画布可见。

### minVisibleWidth

当 `padding` 为空时有效，设置画布滚动时画布的最小可见宽度。

### minVisibleHeight

当 `padding` 为空时有效，设置画布滚动时画布的最小可见高度。

### pageVisible

是否分页，默认为 `false`。

### pageBreak

是否显示分页符，默认为 `false`。

### pageWidth

每一页的宽度，默认为画布容器宽度。

### pageHeight

每一页的高度，默认为画布容器高度。

### autoResize

是否自动扩充/缩小画布，默认为 `true`。开启后，移动节点/边时将自动计算需要的画布大小，当超出当前画布大小时，按照 `pageWidth` 和 `pageHeight` 自动扩充画布。反之，则自动缩小画布。

### autoResizeOptions

自动扩展画布的选项，支持如下选项。

```ts
interface {
  minWidth?: number  // 画布最小宽度
  minHeight?: number // 画布最小高度
  maxWidth?: number  // 画布最大宽度
  maxHeight?: number // 画布最大高度
  border?: number    // 距离画布边缘多少位置时触发自动扩展画布，例如设置为 `20` 表示当节点移动到距离画布边缘 `20px` 内时触发自动扩展画布。
  direction?: ('top' | 'right' | 'bottom' | 'left') | ('top' | 'right' | 'bottom' | 'left')[] // 画布可扩展的方向，默认四个方向都可扩展
}
```


## 方法

### scrollToPoint(...)

```sign
scrollToPoint(x?: number, y?: number, options?: ScrollOptions): this
```

将 `x` 和 `y` 指定的点（相对于画布）滚动到视口中心，如果只指定了其中一个方向，则只滚动对应的方向。

该方法将尽量滚动画布，使指定的点位于视口中心，这意味着滚动后指定的点不一定位于视口中心，如指定的点位于画布的角落。

<span class="tag-param">参数<span>

| 名称              | 类型   | 必选 | 默认值 | 描述                   |
|-------------------|--------|:----:|--------|----------------------|
| x                 | number |      |        | 相对一画布的 x 轴坐标。 |
| y                 | number |      |        | 相对一画布的 y 轴坐标。 |
| options.animation | object |      |        | JQuery 动画选项。       |

<span class="tag-example">例如<span>

```ts
graph.scrollToPoint(100, 200)  // 滚动到 [100, 200]
graph.scrollToPoint(100)       // 滚动到 [100, null]
graph.scrollToPoint(null, 200) // 滚动到 [null, 200]

// 支持动画
graph.scrollToPoint(100, 200,  { animation: { duration: 400 }})
graph.scrollToPoint(100, null, { animation: { duration: 200, easing: 'linear' }})
graph.scrollToPoint(null, 200, { animation: { duration: 600 }})
```

### scrollToContent(...)

```sign
scrollToContent(options?: ScrollOptions): this
```

滚动画布，使画布的内容中心位于画布的视口中心。

该方法将尽量滚动画布，使画布的内容中心位于画布的视口中心，这意味着滚动后内容中心不一定位于视口中心。

<span class="tag-param">参数<span>

<span class="tag-param">参数<span>

| 名称              | 类型   | 必选 | 默认值 | 描述             |
|-------------------|--------|:----:|--------|----------------|
| options.animation | object |      |        | JQuery 动画选项。 |

<span class="tag-example">例如<span>

```ts
graph.scrollToContent()
graph.scrollToContent({ animation: { duration: 600 }})
```

### scrollToCell(...)

```sign
scrollToCell(cell: Cell, options?: ScrollOptions): this
```

滚动画布，使节点/边的中心位于画布的视口中心。

该方法将尽量滚动画布，使节点/边的中心位于视口中心，这意味着滚动后节点/边的中心不一定位于视口中心，如指定的节点/边位于画布的角落。

<span class="tag-param">参数<span>

| 名称              | 类型   | 必选 | 默认值 | 描述             |
|-------------------|--------|:----:|--------|----------------|
| cell              | Cell   |  ✓   |        | 节点/边。         |
| options.animation | object |      |        | JQuery 动画选项。 |


### transitionToPoint(...)

```sign
transitionToPoint(p: Point.PointLike, options?: TransitionOptions): this
transitionToPoint(x: number, y: number, options?: TransitionOptions): this
```

使用动画平移画布，将画布上指定点（相对于画布的坐标）与视口中心对齐。

<span class="tag-param">参数<span>

| 名称                    | 类型                                         | 必选 | 默认值 | 描述                                                                                                                                    |
|-------------------------|----------------------------------------------|:----:|--------|---------------------------------------------------------------------------------------------------------------------------------------|
| x                       | number                                       |  ✓   |        | 相对于画布的 x 坐标。                                                                                                                    |
| y                       | number                                       |  ✓   |        | 相对于画布的 y 坐标。                                                                                                                    |
| options.scale           | number                                       |      |        | 目标缩放比例，设置后同时伴随着缩放动画。                                                                                                  |
| options.duration        | string                                       |      |        | 动画持续的时长，如 `'500ms'` 或 `'2s'`。默认为 `'1s'`。                                                                                    |
| options.delay           | string                                       |      |        | 动画延迟多长时间后开始，默认为 `0`。                                                                                                      |
| options.timing          | string                                       |      |        | 插值方法名，默认为 `'ease'`。支持的方法名[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/common/animation/timing.ts)。 |
| options.onTransitionEnd | (this: Scroller, e: TransitionEvent) => void |      |        | 动画结束时的回调。                                                                                                                       |

<span class="tag-example">例如<span>

```ts
// 平移画布，将点 { x: 100, y: 80 } 移动到视口中心
graph.transitionToPoint(100, 80)

// 平移和缩放画布，将点 { x: 100, y: 80 } 移动到视口中心，同时将画布放大 2 倍。
graph.transitionToPoint(100, 80, { scale: 2 })
```

### transitionToRect(...)

```sign
transitionToRect(rect: Rectangle.RectangleLike, options？: TransitionToRectOptions): this
```

使用动画缩放和平移画布，使指定的矩形（相对于画布的坐标）充满视口。

<span class="tag-param">参数<span>

| 名称                    | 类型                                         | 必选 | 默认值 | 描述                                                                                                                                    |
|-------------------------|----------------------------------------------|:----:|--------|---------------------------------------------------------------------------------------------------------------------------------------|
| rect                    | Rectangle.RectangleLike                      |  ✓   |        | 目标矩形区域。                                                                                                                           |
| options.minScale        | number                                       |      |        | 画布的最小缩放比例。                                                                                                                     |
| options.maxScale        | number                                       |      |        | 画布的最大缩放比例。                                                                                                                     |
| options.scaleGrid       | number                                       |      |        | 修正缩放比例为 `scaleGrid` 的整倍数。                                                                                                    |
| options.center          | Point.PointLike                              |      |        | 同时将指定的点移动到视口中心。                                                                                                           |
| options.visibility      | number                                       |      |        | 矩形区域覆盖视口的比例，取值范围 `[0, 1]`，默认为 `1`，表示完全覆盖。如，取值为 `0.8` 时表示矩形覆盖 `80%` 视口区域。                         |
| options.duration        | string                                       |      |        | 动画持续的时长，如 `'500ms'` 或 `'2s'`。默认为 `'1s'`。                                                                                    |
| options.delay           | string                                       |      |        | 动画延迟多长时间后开始，默认为 `0`。                                                                                                      |
| options.timing          | string                                       |      |        | 插值方法名，默认为 `'ease'`。支持的方法名[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/common/animation/timing.ts)。 |
| options.onTransitionEnd | (this: Scroller, e: TransitionEvent) => void |      |        | 动画结束时的回调。                                                                                                                       |

<span class="tag-example">例如<span>

```ts
graph.transitionToRect({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
}, {
    visibility: 0.9, // 矩形覆盖 90% 视口区域
    maxScale: 3,     // 画布最大缩放比例为 3
})

// 使 cell1, cell2, cell3 三个节点的包围盒 BBox 完全位于视口，并将 cell1 移动到视口中心
const rect = graph.getCellsBBox([cell1, cell2, cell3]);
graph.transitionToRect(rect, {
    duration: '500ms',
    center: cell1.getBBox().center()
});
```

### getScrollbarPosition()

```sign
getScrollbarPosition(): {
  left: number
  top: number
}
```

获取滚动条位置。

### setScrollbarPosition(...)

```ts
setScrollbarPosition(left?: number, top?: number, options?: ScrollOptions): this
```

设置滚动条位置。

<span class="tag-param">参数<span>

| 名称              | 类型   | 必选 | 默认值 | 描述                                       |
|-------------------|--------|:----:|--------|------------------------------------------|
| left              | number |      |        | 水平滚动条的位置，缺省时表示水平方向不滚动。 |
| top               | number |      |        | 垂直滚动条的位置，缺省时表示垂直方向不滚动。 |
| options.animation | object |      |        | JQuery 动画配置。                           |

<span class="tag-example">例如<span>

```ts
graph.setScrollbarPosition(100)
graph.setScrollbarPosition(100, null)
graph.setScrollbarPosition(null, 200)
graph.setScrollbarPosition(100, 200)

// 使用动画
graph.setScrollbarPosition(100, null, { animation: { duration: 200, easing: 'linear' }})
graph.setScrollbarPosition(null, 200, { animation: { duration: 600 }})
graph.setScrollbarPosition(100, 200,  { animation: { duration: 400 }})
```

### isPannable()

```sign
isPannable(): boolean
```

返回画布是否可被平移。

### enablePanning()

```sign
enablePanning(): this
```

启用画布平移。

### disablePanning()

```sign
disablePanning(): this
```

禁用画布平移。

### togglePanning()

```sign
togglePanning(pannable?: boolean): this
```

切换或设置画布平移。

### enableAutoResize()

```sign
enableAutoResize(): this
```

开启自动扩充/缩小画布

### disableAutoResize()

```sign
disableAutoResize(): this
```

关闭自动扩充/缩小画布

### lockScroller()

```sign
lockScroller(): this
```

禁止滚动。

### unlockScroller()

```sign
unlockScroller(): this
```

启用滚动。
