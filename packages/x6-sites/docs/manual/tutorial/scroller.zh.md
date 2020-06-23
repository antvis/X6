---
title: 滚动 Scroller
order: 10
redirect_from:
  - /zh/docs
  - /zh/docs/manual
  - /zh/docs/manual/tutorial
---

创建画布时，通过下面配置即可开启画布滚动能力。

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

## 选项

```ts
interface ScrollerOptions {
  enabled?: boolean
  className?: string
  width?: number
  height?: number
  panning?: boolean
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

附加样式名，用于定制样式。默认为空。

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

### panning

是否启用画布平移能力（在空白位置按下鼠标后拖动平移画布），默认为 `false`。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
    panning: true,
  },
})
```

创建画布后，也可以调用 `graph.enablePanning()` 和 `graph.disablePanning()` 来启用和禁用画布平移。

```ts
if (graph.isPanningEnabled()) {
  graph.disablePanning()
} else {
  graph.enablePanning()
}
```

### modifiers

修饰键(如 `'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要点击鼠标并按下修饰键才能触发画布拖拽。修饰键在某些场景下非常有用，比如同时开始框选和拖拽画布时，而框选和拖拽画布的触发时机都是鼠标左键在画布空白位置按下，这时可以为框选和拖拽画布设置不一样的修饰键，达到同时开启又不冲突的效果。

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

### pageWidth

每一页的宽度，默认为画布容器宽度。

### pageHeight

每一页的高度，默认为画布容器高度。

### pageVisible

是否显示分页，默认为 `false`。

### pageBreak

是否显示分页符，默认为 `false`。

### autoResize

是否自动扩充/缩小画布，默认为 `true`。开启后，移动节点/边时将自动计算需要的画布大小，当超出当前画布大小时，按照 `pageWidth` 和 `pageHeight` 自动扩充画布。反之，则自动缩小画布。

## Playground



<iframe
     src="https://codesandbox.io/embed/x6-playground-scroller-ph3y4?fontsize=14&hidenavigation=1&theme=light&view=preview"
     style="width:100%; height:500px; border:1px solid #f0f0f0; border-radius: 4px; overflow:hidden;"
     title="x6-playground-scroller"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## API

禁止/启用滚动

```ts
graph.lockScroller()   // 禁止滚动
graph.unlockScroller() // 启用滚动
```

获取/设置滚动条位置
```ts
// 获取滚动条位置
graph.getScroll()

// 设置滚动条位置
graph.setScroll(100) 
graph.setScroll(null, 200) 
graph.setScroll(100, 200) 

// 使用动画
graph.setScroll(100, 200, { animation: { duration: 400 }})
graph.setScroll(100, null, { animation: { duration: 200, easing: 'linear' }})      
graph.setScroll(null, 200, { animation: { duration: 600 }}) 

// 获取滚动条位置
graph.scroll() 

// 设置滚动条位置
graph.scroll(100) 
graph.scroll(null, 200) 
graph.scroll(100, 200) 

// 使用动画
graph.scroll(100, 200, { animation: { duration: 400 }})
graph.scroll(100, null, { animation: { duration: 200, easing: 'linear' }})      
graph.scroll(null, 200, { animation: { duration: 600 }}) 
```

下面几个方法尝试滚动画布，使指定的点位于视口中心，这几个方法将尽量（比如指定的点位于画布的角落）滚动画布，这意味着滚动后指定的点不一定就能出现在视口中心。

- `graph.scrollTo(x?: number, y?: number, options?: ScrollOptions)`
  
  将 `x` 和 `y` 指定的相对于画布的位置滚动到画布中心，如果只指定的其中一个方向的位置，则只滚动对应的方向。

  ```ts
  graph.scrollTo(100, 200)  // 滚动到 [100, 200]
  graph.scrollTo(100)       // 滚动到 [100, null]
  graph.scrollTo(null, 200) // 滚动到 [null, 200]

  // 支持动画
  graph.scrollTo(100, 200, { animation: { duration: 400 }})
  graph.scrollTo(100, null, { animation: { duration: 200, easing: 'linear' }})      
  graph.scrollTo(null, 200, { animation: { duration: 600 }}) 
  ```

- `graph.scrollToContent(options?: ScrollOptions)`
  
  滚动画布使画布的内容中心位于画布的视口中心。

  ```ts
  graph.scrollToContent()
  graph.scrollToContent({ animation: { duration: 600 }})
  ```

- `graph.scrollToCell(cell: Cell, options?: ScrollOptions)`

  滚动画布使节点/边的中心位于画布的视口中心。

  ```ts
  graph.scrollToCell(cell)
  graph.scrollToCell(cell, { animation: { duration: 600 }})
  ```

下面几个方法强制将指定的点与视口中心对齐，如果指定的点不能通过滚动画布来位于视口中心（如位于画布角落的点），则通过给画布增加 padding 的方式来将该点强制与视口中心对齐。

```ts
// 将画布中心与视口中心对齐
graph.center()
graph.center({ padding: { left: 100 }})

// 将指定的点与视口中心对齐
graph.center(100, 200, { padding: { left: 100 }})
graph.center(100, null, { padding: { left: 100 }})
graph.center(null, 200, { padding: { left: 100 }})

// 将画布内容中心与视口中心对齐
graph.centerContent()
graph.centerContent({ padding: { left: 100 }})

// 将节点/边中心与视口中心对齐
graph.centerCell(cell)
graph.centerCell(cell, { padding: { left: 100 }})
```

画布缩放。

- `graph.zoom()` 获取画布缩放。
- `graph.zoom(scale: number, options?: ZoomOptions)` 设置画布缩放。
- `graph.zoomToRect(rect: Rectangle.RectangleLike, options?: ScaleContentToFitOptions)`
- `graph.zoomToFit(options?: ScaleContentToFitOptions)`

画布平移。

- `graph.isPanningEnabled()` 画布是否可被平移。
- `graph.enablePanning()` 启用画布平移。
- `graph.disablePanning()` 禁用画布平移。
- `graph.togglePanning()` 切换画布平移。
