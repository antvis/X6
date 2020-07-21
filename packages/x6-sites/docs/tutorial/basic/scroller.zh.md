---
title: 滚动 Scroller
order: 10
redirect_from:
  - /zh/docs
  - /zh/docs/tutorial
  - /zh/docs/tutorial/basic
---

Scroller 使画布具备滚动、平移、居中、缩放等能力，创建画布时，通过下面配置即可开启。

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

## 演示

<iframe
  src="https://codesandbox.io/embed/x6-playground-scroller-ph3y4?fontsize=14&hidenavigation=1&theme=light&view=preview"
  style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
  title="x6-playground-scroller"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## 选项

```ts
interface ScrollerOptions {
  enabled?: boolean
  pannable?: boolean
  className?: string
  width?: number
  height?: number
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  cursor?: string
  pageWidth?: number
  pageHeight?: number
  pageVisible?: boolean
  pageBreak?: boolean
  autoResize?: boolean
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

创建画布后，也可以调用 [graph.enablePanning()](#graphenablepanning) 和 [graph.disablePanning()](#graphdisablepanning) 来启用和禁用画布平移。

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

### cursor

画布鼠标样式，默认为空。

当 `cursor` 为空并开启拖拽时，将自动为画布设置 `grab` 鼠标样式。

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

## API

### graph.lockScroller()

禁止滚动。

### graph.unlockScroller()

启用滚动。

### graph.getScrollbarPosition()

获取滚动条位置。

### graph.setScrollbarPosition(left?: number, top?: number, options?: ScrollOptions)

设置滚动条位置。

- `left?: number` 水平滚动条的位置，缺省时表示水平方向不滚动。
- `top?: number` 垂直滚动条的位置，缺省时表示垂直方向不滚动。
- `options?: ScrollOptions` 选项。
  ```ts
  interface ScrollOptions {
      // JQuery 动画配置
      animation?: JQuery.EffectsOptions<HTMLElement>
  }
  ```

例如：

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

### graph.scrollToPoint(x?: number, y?: number, options?: ScrollOptions)
  
将 `x` 和 `y` 指定的点（相对于画布）滚动到视口中心，如果只指定了其中一个方向，则只滚动对应的方向。

该方法将尽量滚动画布，使指定的点位于视口中心，这意味着滚动后指定的点不一定位于视口中心，如指定的点位于画布的角落。

- `x` 相对一画布的 x 轴坐标。
- `y` 相对一画布的 y 轴坐标。
- `options?: ScrollOptions` 选项。
  ```ts
  interface ScrollOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
  }
  ```

例如：  

```ts
graph.scrollToPoint(100, 200)  // 滚动到 [100, 200]
graph.scrollToPoint(100)       // 滚动到 [100, null]
graph.scrollToPoint(null, 200) // 滚动到 [null, 200]

// 支持动画
graph.scrollToPoint(100, 200,  { animation: { duration: 400 }})
graph.scrollToPoint(100, null, { animation: { duration: 200, easing: 'linear' }})      
graph.scrollToPoint(null, 200, { animation: { duration: 600 }}) 
```

### graph.scrollToContent(options?: ScrollOptions)
  
滚动画布，使画布的内容中心位于画布的视口中心。

该方法将尽量滚动画布，使画布的内容中心位于画布的视口中心，这意味着滚动后内容中心不一定位于视口中心。

- `options?: ScrollOptions` 选项。
  ```ts
  interface ScrollOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
  }
  ```

例如：  

```ts
graph.scrollToContent()
graph.scrollToContent({ animation: { duration: 600 }})
```

### graph.scrollToCell(cell: Cell, options?: ScrollOptions)

滚动画布，使节点/边的中心位于画布的视口中心。

该方法将尽量滚动画布，使节点/边的中心位于视口中心，这意味着滚动后节点/边的中心不一定位于视口中心，如指定的节点/边位于画布的角落。

- `options?: ScrollOptions` 选项。
  ```ts
  interface ScrollOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
  }
  ```

例如：  

```ts
graph.scrollToCell(cell)
graph.scrollToCell(cell, { animation: { duration: 600 }})
```

### graph.center(options?: CenterOptions)

将画布中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

- `options?: CenterOptions` 选项。
  ```ts
  interface CenterOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
  }
  ```

### centerPoint(x?: number | null, y?: number | null, options?: CenterOptions)

将 `x` 和 `y` 指定的点（相对于画布）与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

- `options?: CenterOptions` 选项。
  ```ts
  interface CenterOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
  }
  ```

例如：

```ts
graph.centerPoint(100, 200)
graph.centerPoint(100, null, { padding: { left: 100 }})
graph.centerPoint(null, 200, { padding: { left: 100 }})
```

### centerContent(options?: PositionContentOptions)

将画布内容中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

- `options?: PositionContentOptions` 选项。
  ```ts
  interface PositionContentOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
      useCellGeometry?: boolean
  }
  ```

例如：

```ts
graph.centerContent()
graph.centerContent({ padding: { left: 100 }})
```

### centerCell(options?: CenterOptions)

将节点/边的中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

- `options?: CenterOptions` 选项。
  ```ts
  interface CenterOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
  }
  ```

例如：

```ts
graph.centerCell(cell)
graph.centerCell(cell, { padding: { left: 100 }})
```

### positionContent(pos: Position, options?: PositionContentOptions)

将 `pos` 代表的画布内容 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将画布内容的左下角与视口的左下角对齐。

- `pos: Position` 对齐的位置。
  ```ts
  type Position =     
      | 'center'
      | 'top'
      | 'top-right'
      | 'top-left'
      | 'right'
      | 'bottom-right'
      | 'bottom'
      | 'bottom-left'
      | 'left'
  ```
- `options?: PositionContentOptions` 对齐选项。
  ```ts
  interface PositionContentOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
      useCellGeometry?: boolean
  }
  ```

### positionCell(cell: Cell, pos: Scroller.Direction, options?: CenterOptions)

将 `pos` 代表的节点/边 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将节点/边的左下角与视口的左下角对齐。

- `cell: Cell` 被对齐的节点。
- `pos: Position` 对齐的位置。
  ```ts
  type Position =     
      | 'center'
      | 'top'
      | 'top-right'
      | 'top-left'
      | 'right'
      | 'bottom-right'
      | 'bottom'
      | 'bottom-left'
      | 'left'
  ```
- `options?: CenterOptions` 对齐选项。
  ```ts
  interface CenterOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
  }
  ```

### positionRect(rect: Rectangle.RectangleLike, pos: Scroller.Direction, options?: CenterOptions)

将 `pos` 代表的矩形位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将矩形的左下角与视口的左下角对齐。

- `rect: Rectangle.RectangleLike` 被对齐的矩形。
- `pos: Position` 对齐的位置。
  ```ts
  type Position =     
      | 'center'
      | 'top'
      | 'top-right'
      | 'top-left'
      | 'right'
      | 'bottom-right'
      | 'bottom'
      | 'bottom-left'
      | 'left'
  ```
- `options?: CenterOptions` 对齐选项。
  ```ts
  interface CenterOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
  }
  ```

### positionPoint(point: Point.PointLike, x: number | string, y: number | string options: CenterOptions = {})

将 `point` 指定的点（相对于画布）与 `x` 和 `y` 代表的画布视口位置对齐。

- `point: Point.PointLike` 被对齐的点，相对于画布
- `x: number | string` 视口 x 位置，支持百分比和负值
- `y: number | string` 视口 y 位置，支持百分比和负值
- `options?: CenterOptions` 对齐选项。
  ```ts
  interface CenterOptions {
      /**
       * JQuery 动画
       */ 
      animation?: JQuery.EffectsOptions<HTMLElement>
      /**
       * 自定义边距
       */ 
      padding?: number | {
        left?: number
        top?: number
        right?: number
        bottom?: number
      }
  }
  ```

例如：

```ts
// 将画布的左上角与视口中的点 [100, 50] 对齐
graph.positionPoint({ x: 0, y: 0 }, 100, 50)

// 将画布上的点 { x: 30, y: 80 } 与离视口左侧 25% 和离视口底部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, '25%', -40)

// 将画布上的点 { x: 30, y: 80 } 与离视口右侧 25% 和离视口顶部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, '-25%', 40)
```

### graph.zoom()

获取画布缩放比例。

### graph.zoom(factor: number, options?: ZoomOptions)

缩放画布。当 `options.absolute` 为 `true` 时，表示将画布缩放到 `factor` 代表的值，否则 `factor` 表示放大/缩小的因子，当 `factor` 为正数时表示画布放大画布，当 `factor` 为负数时表示缩小画布。

- `factor: number` 缩放比例。
- `options?: ZoomOptions` 缩放选项。
  ```ts
  interface ZoomOptions {
      absolute?: boolean
      minScale?: number
      maxScale?: number
      scaleGrid?: number
      center?: Point.PointLike
  }
  ```
  - `absolute?: boolean` 是否为绝对缩放，默认为 `false`。
  - `center?: Point.PointLike` 缩放中心。
  - `minScale?: number` 最小缩放比例。
  - `maxScale?: number` 最大缩放比例。
  - `scaleGrid?: number` 修正缩放比例为 `scaleGrid` 的整倍数。

例如：
```ts
graph.zoom(0.2, {
  minScale: 0.2,
  maxScale: 5,
  scaleGrid: 0.5,
})
```

### graph.zoomToFit(options?: ScaleContentToFitOptions)

缩放画布内容，使画布内容充满视口。

### graph.zoomToRect(rect: Rectangle.RectangleLike, options?: ScaleContentToFitOptions)

缩放和平移画布，使 `rect` 表示的矩形区域（相对于画布坐标）充满视口。


### graph.transitionToPoint(p: Point.PointLike, options?: TransitionOptions)
### graph.transitionToPoint(x: number, y: number, options?: TransitionOptions)

使用动画平移画布，将画布上指定点（相对于画布的坐标）与视口中心对齐。

- `x: number` 相对于画布的 x 坐标。
- `y: number` 相对于画布的 y 坐标。
- `options?: TransitionOptions` 动画选项。
  ```ts
    interface TransitionOptions {
        scale?: number
        duration?: string
        delay?: string
        timingFunction?: string
        onTransitionEnd?: (this: Scroller, e: TransitionEvent) => void
    }
  ```
  - `scale?: number` 目标缩放比例，设置后同时伴随着缩放动画。
  - `duration?: string` 动画持续的时长，如 `'500ms'` 或 `'2s'`。默认为 `'1s'`。
  - `delay?: string` 动画延迟多长时间后开始，默认为 `0`。
  - `timingFunction?: string` 插值方法名，默认为 `'ease'`。支持的方法名[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/common/animation/timing.ts)。
  - `onTransitionEnd?: (this: Scroller, e: TransitionEvent) => void` 动画结束时的回调。

例如：

```ts
// 平移画布，将点 { x: 100, y: 80 } 移动到视口中心
graph.transitionToPoint(100, 80)

// 平移和缩放画布，将点 { x: 100, y: 80 } 移动到视口中心，同时将画布放大 2 倍。
graph.transitionToPoint(100, 80, { scale: 2 })
```

### graph.transitionToRect(rect: Rectangle.RectangleLike, options？: TransitionToRectOptions)

使用动画缩放和平移画布，使指定的矩形（相对于画布的坐标）充满视口。

- `rect: Rectangle.RectangleLike` 目标矩形区域。
- `options？: TransitionToRectOptions` 动画选项。
  ```ts
  interface TransitionToRectOptions {
      minScale?: number
      maxScale?: number
      scaleGrid?: number
      visibility?: number
      center?: Point.PointLike
      duration?: string
      delay?: string
      timingFunction?: string
      onTransitionEnd?: (this: Scroller, e: TransitionEvent) => void
  }
  ```
  - `minScale?: number` 画布的最小缩放比例。
  - `maxScale?: number` 画布的最大缩放比例。
  - `scaleGrid?: number` 修正缩放比例为 `scaleGrid` 的整倍数。
  - `center?: Point.PointLike` 同时将指定的点移动到视口中心。
  - `visibility?: number` 矩形区域覆盖视口的比例，取值范围 [0, 1]，默认为 `1`，表示完全覆盖。如，取值为 `0.8` 时表示矩形覆盖 80% 视口区域。
  - `duration?: string` 动画持续的时长，如 `'500ms'` 或 `'2s'`。默认为 `'1s'`。
  - `delay?: string` 动画延迟多长时间后开始，默认为 `0`。
  - `timingFunction?: string` 插值方法名，默认为 `'ease'`。支持的方法名[参考这里](https://github.com/antvis/X6/blob/master/packages/x6/src/common/animation/timing.ts)。
  - `onTransitionEnd?: (this: Scroller, e: TransitionEvent) => void` 动画结束时的回调。

例如：

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


### graph.isPannable()

画布是否可被平移。

### graph.enablePanning()

启用画布平移。

### graph.disablePanning()

禁用画布平移。

### graph.togglePanning(pannable?: boolean)

切换或设置画布平移。

- `pannable?: boolean` 是否启用画布平移。

```ts
// 切换画布平移
graph.togglePanning()

// 启用画布平移
graph.enablePanning() 
// 或
graph.togglePanning(true)

// 禁用画布平移
graph.disablePanning()
// 或
graph.togglePanning(false)
```
