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

| 选项                                                    | 类型                          | 必选 | 默认值                        | 描述                                                                                     |
|---------------------------------------------------------|-------------------------------|:----:|-------------------------------|----------------------------------------------------------------------------------------|
| [container](#container)                                 | HTMLElement                   |  ✓   |                               | 画布的容器。                                                                              |
| [model](#model)                                         | Model                         |      | `undefined`                   | 画布对应的模型，默认创建一个新模型。                                                       |
| [width](#width)                                         | number                        |      | `undefined`                   | 画布宽度，默认使用容器宽度。                                                               |
| [height](#height)                                       | number                        |      | `undefined`                   | 画布高度，默认使用容器高度。                                                               |
| [grid](#grid)                                           | boolean \| number \| object   |      | `false`                       | 网格，默认使用 `10px` 的网格，但不绘制网格背景。                                            |
| [background](#background)                               | false \| object               |      | `false`                       | 背景，默认不绘制背景。                                                                     |
| [snapline](#snapline)                                   | boolean \| object             |      | `false`                       | 对齐线，默认禁用。                                                                         |
| [scroller](#scroller)                                   | boolean \| object             |      | `false`                       | 滚动画布，默认禁用。                                                                       |
| [minimap](#minimap)                                     | boolean \| object             |      | `false`                       | 小地图，默认禁用。                                                                         |
| [history](#history)                                     | boolean \| object             |      | `false`                       | 撤销/重做，默认禁用。                                                                      |
| [clipboard](#clipboard)                                 | boolean \| object             |      | `false`                       | 剪切板，默认禁用。                                                                         |
| [keyboard](#keyboard)                                   | boolean \| object             |      | `false`                       | 键盘快捷键，默认禁用。                                                                     |
| [mousewheel](#mousewheel)                               | boolean \| object             |      | `false`                       | 鼠标滚轮缩放，默认禁用。                                                                   |
| [selecting](#selecting)                                 | boolean \| object             |      | `false`                       | 点选/框选，默认禁用。                                                                      |
| [rotating](#rotating)                                   | boolean \| object             |      | `false`                       | 旋转节点，默认禁用。                                                                       |
| [resizing](#resizing)                                   | boolean \| object             |      | `false`                       | 缩放节点，默认禁用。                                                                       |
| [translating](#translating)                             | object                        |      | object                        | 平移节点。                                                                                |
| [transforming](#transforming)                           | object                        |      | object                        | 平移和缩放节点的基础选项。                                                                |
| [embedding](#embedding)                                 | boolean \| object             |      | `false`                       | 嵌套节点，默认禁用。                                                                       |
| [connecting](#connecting)                               | object                        |      | object                        | 连线选项。                                                                                |
| [highlighting](#highlighting)                           | object                        |      | object                        | 高亮选项。                                                                                |
| [interacting](#interacting)                             | object \| function            |      | `{ edgeLabelMovable: false }` | 定制节点和边的交互行为。                                                                  |
| [sorting](#sorting)                                     | 'none' \| 'approx' \| 'exact' |      | `'exact'`                     | 节点和边视图的排序方式。                                                                  |
| [async](#async)                                         | boolean                       |      | `false`                       | 是否是异步渲染的画布。                                                                    |
| [frozen](#frozen)                                       | boolean                       |      | `false`                       | 异步渲染的画布是否处于冻结状态。                                                          |
| [checkView](#checkView)                                 | function                      |      | -                             | 返回指定的视图是否应该渲染到 DOM 中。                                                     |
| [magnetThreshold](#magnetThreshold)                     | number \| 'onleave'           |      | `0`                           | 鼠标移动多少次后才触发连线，或者设置为 `'onleave'` 时表示鼠标移出元素时才触发连线。        |
| [moveThreshold](#moveThreshold)                         | number                        |      | `0`                           | 触发 `'mousemove'` 事件之前，允许鼠标移动的次数。                                          |
| [clickThreshold](#clickThreshold)                       | number                        |      | `0`                           | 当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件。                                     |
| [preventDefaultContextMenu](#preventDefaultContextMenu) | boolean                       |      | `true`                        | 是否禁用浏览器默认右键菜单。                                                              |
| [preventDefaultBlankAction](#preventDefaultBlankAction) | boolean                       |      | `true`                        | 在画布空白位置响应鼠标事件时，是否禁用鼠标默认行为。                                       |
| [guard](#guard)                                         | function                      |      | `() => false`                 | 返回是否应该忽略某个鼠标事件，返回 `true` 时忽略指定的鼠标事件。                           |
| [allowRubberband](#allowRubberband)                     | function                      |      | `() => true`                  | 返回是否响应框选事件。                                                                    |
| [allowPanning](#allowPanning)                           | function                      |      | `() => true`                  | 返回是否响应画布平移事件。                                                                |
| [getCellView](#getCellView)                             | function                      |      | `() => null`                  | 获取节点/边的视图类。                                                                     |
| [createCellView](#createCellView)                       | function                      |      | `undefined`                   | 创建节点/边的视图，默认自动根据节点和边的 [`view`](./model/cell#view) 选项创建对应的视图。 |
| [getHTMLComponent](#getHTMLComponent)                   | function                      |      | `undefined`                   | 获取 HTML 节点的 HTML 元素，默认根据节点的 `html` 选项返回对应的 HTML 元素。               |
| [onPortRendered](#onPortRendered)                       | function                      |      | `undefined`                   | 当某个链接桩渲染完成时触发的回调。                                                        |
| [onEdgeLabelRendered](#onEdgeLabelRendered)             | function                      |      | `undefined`                   | 当边的文本标签渲染完成时触发的回调。                                                      |
| [onToolItemCreated](#onToolItemCreated)                 | function                      |      | `undefined`                   | 当工具项渲染完成时触发的回调。                                                            |


### container

画布容器。

### model

画布对应的模型，默认创建一个新模型。 

### width

画布宽度，默认使用容器宽度。创建画布后可以使用 [`resize(w, h)`](#resize) 方法来设置画布大小。 

### height

画布高度，默认使用容器高度。 创建画布后可以使用 [`resize(w, h)`](#resize) 方法来设置画布大小。 





### grid

网格是渲染/移动节点的最小单位。网格默认大小为 `10px`，渲染节点时表示以 `10` 为最小单位对齐到网格，如位置为 `{ x: 24, y: 38 }`的节点渲染到画布后的实际位置为 `{ x: 20, y: 40 }`， 移动节点时表示每次移动最小距离为 `10px`。

<iframe src="/demos/tutorial/basic/grid/playground"></iframe>

#### size

创建画布时，通过下面配置来设置网格大小。

```ts
const graph = new Graph({
  grid: 10,
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10,
  },
})
```

创建画布后，可以调用 [graph.setGridSize(gridSize: number)](#setgridsize) 方法来修改网格大小，并触发网格重绘（如果网格可见）。

```ts
graph.setGridSize(10)
```

#### type

网格默认不可见，创建画布时，通过下面配置来启用网格绘制。

```ts
const graph = new Graph({
  grid: true, // 网格大小 10px，并绘制网格
})

// 等同于
const graph = new Graph({
  grid: {
    size: 10,      // 网格大小 10px
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
})
```

同时，我们内置了以下四种网格类型，通过 `type` 选项来指定网格类型，默认值为 `'dot'`，并支持通过 `args` 选项来配置网格样式。

- dot (默认值)
- fixedDot
- mesh

  ```ts
  const graph = new Graph({
      grid: {
        size: 10,
        visible: true,
        type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
        args: { 
          color: '#a0a0a0', // 网格线/点颜色
          thickness: 1,     // 网格线宽度/网格点大小
        },
      },
  })
  ```

- doubleMesh

  ```ts
  const graph = new Graph({
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          { 
            color: '#eee', // 主网格线颜色
            thickness: 1,     // 主网格线宽度
          },
          { 
            color: '#ddd', // 次网格线颜色
            thickness: 1,     // 次网格线宽度
            factor: 4,        // 主次网格线间隔
          },
        ],
      },
  })
  ```

创建画布后，可以调用 [graph.drawGrid(options?: DrawGridOptions)](#drawgrid) 来重绘网格。

例如，使用网格颜色 `#f0f0f0` 和默认线宽绘制 `mesh` 类型网格。

```ts
graph.drawGrid({
  type: 'mesh',
  args: {
    color: '#f0f0f0'
  },
})
```

<span class="tag-param">API<span>

- [`drawGrid(...)`](#drawgrid) 重绘网格。
- [`getGridSize()`](#getgridsize) 获取网格大小。
- [`setGridSize()`](#setgridsize) 设置网格大小，并重绘网格。
- [`showGrid()`](#showgrid) 显示网格。
- [`hideGrid()`](#hidegrid) 隐藏网格。
- [`clearGrid()`](#cleargrid) 清除网格。








### background


背景用于为画布指定背景颜色或背景图片，支持[水印背景](#repeat)和[自定义背景图片的重复方式](./registry/background#registry)，背景层在 DOM 层级上位于画布的最底层。

创建画布时，通过 `background` 选项来设置画布的背景颜色或背景图片，默认值为 `false` 表示没有（透明）背景。


```ts
const graph = new Graph({
  background: false | BackgroundOptions
})
```

创建画布后，可以调用 [graph.drawBackground(options?: BackgroundOptions)](#drawbackground) 方法来重绘背景。

```ts
graph.drawBackground({
  color: '#f5f5f5',
})
```

<iframe src="/demos/tutorial/basic/background/playground"></iframe>

支持的选项如下：

```sign
interface BackgroundOptions {
  color?: string
  image?: string
  position?: CSS.BackgroundPositionProperty<{
    x: number
    y: number
  }>
  size?: CSS.BackgroundSizeProperty<{
    width: number
    height: number
  }>
  repeat?: CSS.BackgroundRepeatProperty
  opacity?: number
  quality?: number
  angle?: number
}
```

#### color

背景颜色，支持所有 [CSS background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) 属性的取值，如：
  - `'red'`
  - `'#f5f5f5'`
  - `'rgba(255, 255, 128, 0.5)'`
  - `'hsla(50, 33%, 25%, 0.75)'`
  - `'radial-gradient(ellipse at center, red, green)'`

#### image 

背景图片的 URL 地址。默认值为 `undefined`，表示没有背景图片。

#### position 

背景图片位置，支持所有 [CSS background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) 属性的取值，默认为 `'center'`。

#### size 

背景图片大小，支持所有 [CSS background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) 属性的取值，默认为 `'auto auto'`。

#### repeat 

背景图片重复方式，支持所有 [CSS background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) 属性的取值，默认为 `'no-repeat'`。

另外，还支持以下几个预定义值：

- [`'watermark'`](./registry/background#watermark) 水印效果。
- [`'flip-x'`](./api/registry/background#flip-x) 水平翻转背景图片。
- [`'flip-y'`](./api/registry/background#flip-y) 垂直翻转背景图片。
- [`'flip-xy'`](./api/registry/background#flip-xy) 水平和垂直翻转背景图片。

#### opacity 

背景透明度，取值范围 `[0, 1]`，默认值为 `1`。

#### quality 

背景图片质量，取值范围 `[0, 1]`，默认值为 `1`。

#### angle

水印旋转角度，仅当 [repeat](#repeat) 为 `'watermark'` 时有效，默认值为 `20`。


<span class="tag-param">API<span>

- [`drawBackground(...)`](#drawbackground) 绘制背景。
- [`clearBackground()`](#clearbackground) 清除背景。
- [`updateBackground()`](#updatebackground) 更新背景。















### snapline

对齐线是移动节点排版的辅助工具，默认禁用。创建画布时，通过如下配置启用。

```ts
const graph = new Graph({
  snapline: true,
})

// 等同于
const graph = new Graph({
  snapline: {
    enabled: true,
  },
})
```

创建画布后，可以调用 [graph.enableSnapline()](#enablesnapline) 和 [graph.disableSnapline()](#disablesnapline) 来启用和禁用对齐线。

```ts
if (graph.isSnaplineEnabled()) {
  graph.disableSnapline()
} else {
  graph.enableSnapline()
}
```

支持的选项如下：

```sign
interface SnaplineOptions {
  className?: string
  tolerance?: number
  sharp?: boolean
  resizing?: boolean
  clean?: boolean
  filter?: (string | { id: string })[] | ((this: Graph, node: Node) => boolean)
}
```

#### className

附加样式名，用于定制对齐线样式。默认为 `undefined`。

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    className: 'my-snapline',
  },
})
```

#### tolerance

对齐精度，即移动节点时与目标位置的距离小于 `tolerance` 时触发显示对齐线。默认为 `10`。

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    tolerance: 10,
  },
})
```

#### sharp

是否显示截断的对齐线，默认为 `false`。

#### resizing

改变节点大小时是否触发对齐线，默认为 `false`。

#### clean

当对齐线隐藏后，是否自动将其从 DOM 中移除。支持 `boolean` 或 `number` 类型，当为 `number` 类型时，表示延迟多少毫秒后从 DOM 移除，这样就可以避免移动节点时对齐线被频繁添加/移除到 DOM，又能保证停止移动节点一定时间后能清理掉对齐线。当 `clean` 为 `true` 时，相当于延迟 3000ms 后清理对齐线。 

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    clean: 5000,
  },
})
```

#### filter

节点过滤器，被过滤的节点不参与对齐计算。支持以下三种类型：

- `string[]`  节点类型数组，指定的节点类型不参与对齐计算
- `({ id: string })[]` 节点（类节点）数组，指定的节点不参与对齐计算
- `(this: Graph, node: Node) => boolean` 返回 `true` 的节点不参与对齐计算

```ts
const graph = new Graph({
  snapline: {
    enabled: true,
    filter: ['rect'],
  },
})

// 等同于
const graph = new Graph({
  snapline: {
    enabled: true,
    filter(node) {
      return node.type === 'rect'
    },
  },
})
```

<span class="tag-param">API<span>

- [`isSnaplineEnabled()`](#issnaplineenabled) 返回是否启用对齐线。
- [`enableSnapline()`](#enablesnapline) 启用对齐线。
- [`disableSnapline()`](#disablesnapline) 禁用对齐线。
- [`toggleSnapline(...)`](#togglesnapline) 切换对齐线的启用状态。
- [`hideSnapline()`](#hidesnapline) 隐藏对齐线。
- [`isSnaplineOnResizingEnabled()`](#issnaplineonresizingenabled) 调整节点大小时，是否触发对齐线。
- [`enableSnaplineOnResizing()`](#enablesnaplineonresizing) 启用调整节点大小过程中触发对齐线。
- [`disableSnaplineOnResizing()`](#disablesnaplineonresizing) 禁用调整节点大小过程中触发对齐线。
- [`toggleSnaplineOnResizing(...)`](#togglesnaplineonresizing) 切换调整节点大小过程中是否触发对齐线。
- [`isSharpSnapline()`](#issharpsnapline) 获取是否使用短款对齐线。
- [`enableSharpSnapline()`](#enablesharpsnapline) 启用短款对齐线，启用后对齐线只显示到相关节点位置处，否则显示贯穿画布的对齐线。
- [`disableSharpSnapline()`](#disablesharpsnapline) 禁用短款对齐线，对齐线将贯穿整个画布。
- [`toggleSharpSnapline(...)`](#togglesharpsnapline) 切换短款对齐线的启用状态。
- [`getSnaplineTolerance()`](#getsnaplinetolerance) 获取对齐线精度。
- [`setSnaplineTolerance(...)`](#setsnaplinetolerance) 设置对齐线精度。
- [`setSnaplineFilter(...)`](#setsnaplinefilter) 设置过滤条件，满足过滤条件的节点/边将不参与对齐线计算。












### scroller

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

#### className

附加样式名，用于定制样式。默认为 `undefined`。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
    className: 'my-scroller',
  },
})
```

#### width

Scroller 的宽度，默认为画布容器宽度。

#### height

Scroller 的高度，默认为画布容器高度。

#### pannable

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

#### modifiers

修饰键(`'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要点击鼠标并按下修饰键才能触发画布拖拽。修饰键在某些场景下非常有用，比如同时开始框选和拖拽画布时，而框选和拖拽画布的触发时机都是鼠标左键在画布空白位置按下，这时可以为框选和拖拽画布设置不一样的修饰键，达到同时开启又不冲突的效果。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

#### cursor

画布鼠标样式，默认为空。

当 `cursor` 为空并开启拖拽时，将自动为画布设置 `grab` 鼠标样式。

#### padding

设置画布四周的 padding 边距。默认根据 `minVisibleWidth` 和 `minVisibleHeight` [自动计算](https://github.com/antvis/X6/blob/master/packages/x6/src/addon/scroller/index.ts#L1081-L1088)得到，保证画布滚动时，在宽度和高度方向至少有 `minVisibleWidth` 和 `minVisibleHeight` 大小的画布可见。 

#### minVisibleWidth

当 `padding` 为空时有效，设置画布滚动时画布的最小可见宽度。

#### minVisibleHeight

当 `padding` 为空时有效，设置画布滚动时画布的最小可见高度。

#### pageVisible

是否分页，默认为 `false`。

#### pageBreak

是否显示分页符，默认为 `false`。

#### pageWidth

每一页的宽度，默认为画布容器宽度。

#### pageHeight

每一页的高度，默认为画布容器高度。

#### autoResize

是否自动扩充/缩小画布，默认为 `true`。开启后，移动节点/边时将自动计算需要的画布大小，当超出当前画布大小时，按照 `pageWidth` 和 `pageHeight` 自动扩充画布。反之，则自动缩小画布。


<span class="tag-param">API<span>

- [`zoom(...)`](#zoom) 缩放画布。
- [`zoomTo(...)`](#zoomto) 缩放画布到指定的缩放比例。
- [`zoomToFit(...)`](#zoomtofit) 缩放画布内容，使画布内容充满视口。
- [`zoomToRect(...)`](#zoomtorect) 缩放和平移画布，使 `rect` 表示的矩形区域（相对于画布坐标）充满视口。
- [`center(...)`](#center) 将画布中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。
- [`centerPoint(...)`](#centerpoint) 将 `x` 和 `y` 指定的点（相对于画布）与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。
- [`centerContent(...)`](#centercontent) 将画布内容中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。
- [`centerCell(...)`](#centercell) 将节点/边的中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。
- [`positionContent(...)`](#positioncontent) 将 `pos` 代表的画布内容 BBox 位置与对应的画布视口位置对齐。
- [`positionCell(...)`](#positioncell) 将 `pos` 代表的节点/边 BBox 位置与对应的画布视口位置对齐。
- [`positionRect(...)`](#positionrect) 将 `pos` 代表的矩形位置与对应的画布视口位置对齐。
- [`positionPoint(...)`](#positionpoint) 将 `point` 指定的点（相对于画布）与 `x` 和 `y` 代表的画布视口位置对齐。
- [`scrollToPoint(...)`](#scrolltopoint) 将 `x` 和 `y` 指定的点（相对于画布）滚动到视口中心，如果只指定了其中一个方向，则只滚动对应的方向。该方法将尽量滚动画布，使指定的点位于视口中心，这意味着滚动后指定的点不一定位于视口中心。
- [`scrollToContent(...)`](#scrolltocontent) 滚动画布，使画布的内容中心位于画布的视口中心。该方法将尽量滚动画布，使画布的内容中心位于画布的视口中心，这意味着滚动后内容中心不一定位于视口中心。
- [`scrollToCell(...)`](#scrolltocell) 滚动画布，使节点/边的中心位于画布的视口中心。该方法将尽量滚动画布，使节点/边的中心位于视口中心，这意味着滚动后节点/边的中心不一定位于视口中心。
- [`transitionToPoint(...)`](#transitiontopoint) 使用动画平移画布，将画布上指定点（相对于画布的坐标）与视口中心对齐。
- [`transitionToRect(...)`](#transitiontorect) 使用动画缩放和平移画布，使指定的矩形（相对于画布的坐标）充满视口。
- [`isPannable()`](#ispannable) 画布是否可被平移。
- [`enablePanning()`](#enablepanning) 启用画布平移。
- [`disablePanning()`](#disablepanning) 禁用画布平移。
- [`togglePanning()`](#togglepanning) 切换或设置画布平移。
- [`lockScroller()`](#lockscroller) 禁止滚动。
- [`unlockScroller()`](#unlockscroller) 启用滚动。
- [`updateScroller()`](#updatescroller)
- [`getScrollbarPosition()`](#getscrollbarposition) 获取滚动条位置。
- [`setScrollbarPosition(...)`](#setscrollbarposition) 设置滚动条位置。




















### minimap

启用 [Scroller](#scroller) 后可开启小地图，小地图是完整画布的预览，支持通过平移缩放小地图的视口来平移缩放画布。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
  },
  minimap: {
    enabled: true,
    container: minimapContainer,
  }
})
```

<iframe src="/demos/tutorial/basic/minimap/playground"></iframe>

支持的选项如下：

```sign
interface MiniMapOptions {
  enabled: boolean 
  container: HTMLElement 
  width: number   
  height: number  
  padding: number  
  scalable?: boolean 
  minScale?: number
  maxScale?: number
  graphOptions?: Graph.Options
  createGraph?: (options: Graph.Options) => Graph
}
```

#### enabled

小地图是否被启用，默认为 `false `。

#### container 
 
挂载小地图的容器，必选。

#### width

小地图的宽度，默认为 `300`。将通过 CSS 应用到小地图容器 [`container`](#container-1) 上。

#### height

小地图的高度，默认为 `200`。将通过 CSS 应用到小地图容器 [`container`](#container-1) 上。

#### padding

小地图容器的 padding 边距，默认为 `10`。将通过 CSS 应用到小地图容器 [`container`](#container-1) 上。

#### scalable

是否可缩放，默认为 `true`。

#### minScale

最小缩放比例，默认为 `0.01`。

#### maxScale

最大缩放比例，默认为 `16`。

#### graphOptions

创建小地图 Graph 的选项，默认为 `null`。

通过该选项可以定制小地图画布的表现和行为，如下面配置（在小地图中只渲染节点，并且节点的 View 被替换为指定的 View）。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
  },
  minimap: {
    enabled: true,
    container: minimapContainer,
    graphOptions: {
      async: true,
      getCellView(cell) {
        // 用指定的 View 替换节点默认的 View
        if (cell.isNode()) {
          return SimpleNodeView
        }
      },
      createCellView(cell) {
        // 在小地图中不渲染边
        if (cell.isEdge()) {
          return null
        }
      },
    }
  }
})
```

#### createGraph

创建小地图 `Graph`，默认返回默认 `Graph` 的实例。















### history

撤销/重做，默认禁用。创建画布时，通过以下配置开启画布撤销/重做能力。

```ts
const graph = new Graph({
  history: true,
})

// 等同于
const graph = new Graph({
  history: {
    enable: true,
  },
})
```

创建画布后，调用 [graph.enableHistory()](#enablehistory) 和 [graph.disableHistory()](#disablehistory) 来启用和禁用。

```ts
if (graph.isHistoryEnabled()) {
  graph.disableHistory()
} else {
  graph.enableHistory()
}
```

<iframe src="/demos/tutorial/basic/history/playground"></iframe>

支持的选项如下：

```sign
interface HistoryOptions {
  ignoreAdd?: boolean
  ignoreRemove?: boolean
  ignoreChange?: boolean
  beforeAddCommand?: <T extends ModelEvents>(
    this: HistoryManager,
    event: T,
    args: Model.EventArgs[T],
  ) => any
  afterAddCommand?: <T extends ModelEvents>(
    this: HistoryManager,
    event: T,
    args: Model.EventArgs[T],
    cmd: Command,
  ) => any
  executeCommand?: (
    this: HistoryManager,
    cmd: Command,
    revert: boolean,
    options: KeyValue,
  ) => any
  revertOptionsList?: string[]
  applyOptionsList?: string[]
}
```


#### ignoreAdd, ignoreRemove, ignoreChange

默认情况下，画布中节点/边的任何变化（添加/删除/属性变化）都将被追踪，我们提供了一些选项来控制需要追踪哪些变化：

- `ignoreAdd` 是否忽略添加，默认为 `false`。
- `ignoreRemove` 是否忽略删除，默认为 `false`。
- `ignoreChange` 是否忽略属性变化，默认为 `false`。

例如，下面配置只追踪节点和边的属性变化：

```ts
const graph = new Graph({
  history: {
    enable: true,
    ignoreAdd: true,
    ignoreRemove: true,
    ignoreChange: false,
  },
})
```

#### beforeAddCommand 

当一个命令被添加到 Undo 队列前被调用，如果该方法返回 `false`，那么这个命令将不会被添加到 Undo 队列中。

```ts
const graph = new Graph({
  history: {
    enable: true,
    beforeAddCommand(event, args) {
      if (args.options) {
        return args.options.ignore !== false
      }
    },
  },
})
```

#### afterAddCommand

当一个命令被添加到 Undo 队列后被调用。

#### executeCommand

```ts
executeCommand?: (
  this: HistoryManager,
  cmd: Command,
  revert: boolean,
  options: KeyValue,
) => any
```

当命令被撤销或重做时被调用，`revert` 为 `true` 表示命令被撤销，否则表示命令被重做。

#### revertOptionsList

传递给撤销动作的选项名数组。

```ts
const graph = new Graph({
  history: {
    enable: true,
    revertOptionsList: [ 'option1' ],
  },
})

node.prop('name', 'value', { option1: 5, option2: 6 });
graph.undo(); // -> calls node.prop('name', 'prevValue', { option1: 5 });
```

#### applyOptionsList

传递给重做动作的选项名数组。

```ts
const graph = new Graph({
  history: {
    enable: true,
    applyOptionsList: [ 'option2' ],
  },
})

node.set('name', 'value', { option1: 5, option2: 6 });
graph.undo();
graph.redo(); // -> calls node.set('name', 'value', { option2: 6 });
```

<span class="tag-param">事件<span>

- undo 当命令被撤销时触发。
  ```ts
  graph.history.on('undo', (args: {
      cmds: Command[]
      options: KeyValue
    }) => { 
      // code here
    })
  ```
- redo 当命令被重做时触发。
  ```ts
  graph.history.on('redo', (args: {
      cmds: Command[]
      options: KeyValue
    }) => { 
      // code here
    })
  ```
- cancel 当命令被取消时触发。
  ```ts
  graph.history.on('cancel', (args: {
      cmds: Command[]
      options: KeyValue
    }) => { 
      // code here
    })
  ```
- add 当命令被添加到队列时触发。
  ```ts
  graph.history.on('add', (args: {
      cmds: Command[]
      options: KeyValue
    }) => { 
      // code here
    })
  ```
- clean 当历史队列被清空时触发。
  ```ts
  graph.history.on('clean', (args: {
      cmds: Command[] | null
      options: KeyValue
    }) => { 
      // code here
    })
  ```
- change 当历史队列改变时触发。
  ```ts
  graph.history.on('change', (args: {
      cmds: Command[] | null
      options: KeyValue
    }) => { 
      // code here
    })
  ```
- batch 当接收到 batch 命令时触发。
  ```ts
  graph.history.on('batch', (args: { 
      cmd: Command 
      options: KeyValue 
    }) => { 
      // code here
    })
  ```


<span class="tag-param">API<span>

- [`undo(...)`](#undo) 撤销。 
- [`undoAndCancel(...)`](#undoandcancel) 撤销，并且不添加到重做队列中，所以这个被撤销的命令不能被重做。
- [`redo(...)`](#redo) 重做。
- [`canUndo()`](#canundo) 是否可以撤销。
- [`canRedo()`](#canredo) 是否可以重做。
- [`cleanHistory(...)`](#cleanhistory) 清空历史队列。
- [`isHistoryEnabled()`](#ishistoryenabled) 是否启用了历史状态。
- [`enableHistory()`](#enablehistory) 启用历史状态。
- [`disableHistory()`](#disablehistory) 禁用历史状态。
- [`toggleHistory(...)`](#togglehistory) 切换历史的启用状态。








### clipboard

剪切板，默认禁用。创建画布时通过以下配置启用。

```ts
const graph = new Graph({
  clipboard: true,
})

// 等同于
const graph = new Graph({
  clipboard: {
    enabled: true,
  }
})
```

创建画布后，可以调用 [graph.enableClipboard()](#enableclipboard) 和 [graph.disableClipboard()](#disableclipboard) 来启用和禁用剪贴板。

```ts
if (graph.isClipboardEnabled()) {
  graph.disableClipboard()
} else {
  graph.enableClipboard()
}
```

<iframe src="/demos/tutorial/basic/clipboard/playground"></iframe>

#### useLocalStorage

开启 `useLocalStorage` 后，被复制的节点/边同时被保存到 [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 中，浏览器刷新或者关闭后重新打开，复制/粘贴也能正常工作。

可以在创建画布时全局开启。

```ts
const graph = new Graph({
  clipboard: {
    enabled: true,
    useLocalStorage: true,
  }
})
```

也可以在调用以下三个方法时开启。

- [graph.copy(cells: Cell[], options?: CopyOptions)](#copy)
- [graph.cut(cells: Cell[], options?: CopyOptions)](#cut)
- [graph.paste(options?: PasteOptions, targetGraph?: Graph)](#paste)

例如：

```ts
graph.copy(cells, {
  useLocalStorage: true,
})
```


<span class="tag-param">API<span>


- [`copy(...)`](#copy) 复制节点/边。
- [`cut(...)`](#cut) 剪切节点/边。
- [`paste(...)`](#paste) 粘贴，返回粘贴到画布的节点/边。
- [`getCellsInClipboard()`](#getcellsinclipboard) 获取剪切板中的节点/边。
- [`cleanClipboard()`](#cleanclipboard) 清空剪切板。
- [`isClipboardEmpty()`](#isclipboardempty) 返回剪切板是否为空。
- [`isClipboardEnabled()`](#isclipboardenabled) 返回是否启用了剪切板。
- [`enableClipboard()`](#enableclipboard) 启用剪切板。
- [`disableClipboard()`](#disableclipboard) 禁用剪切板。
- [`toggleClipboard(...)`](#toggleclipboard) 切换剪切板的启用状态。



















### keyboard

键盘快捷键，默认禁用。创建画布时通过以下配置启用。

```ts
const graph = new Graph({
  keyboard: true,
})

// 等同于
const graph = new Graph({
  keyboard: {
    enabled: true,
  },
})
```

创建画布后，也可以调用 [graph.enableKeyboard()](#enablekeyboard) 和 [graph.disableKeyboard()](#disablekeyboard) 来启用和禁用键盘事件。

```ts
if (graph.isKeyboardEnabled()) {
  graph.disableKeyboard()
} else {
  graph.enableKeyboard()
}
```

> 由于示例通过 iframe 嵌入，导致快捷键失效，请点击【在新窗口中打开】按钮去体验。

<iframe src="/demos/tutorial/basic/keyboard/playground"></iframe>

支持的选项如下：

```sign
interface KeyboardOptions {
  enabled?: boolean
  global?: boolean
  format?: (this: Graph, key: string) => string
  guard?: (this: Graph, e: KeyboardEvent) => boolean
}
```

#### enabled

是否开启键盘快捷键。

#### global

是否为全局键盘事件，设置为 `true` 时键盘事件绑定在 `Document` 上，否则绑定在画布容器上。当绑定在画布容器上时，需要容器获得焦点才能触发键盘事件。默认为 `false`。

#### format

绑定或解绑键盘事件时，格式化按键字符串。

```ts
const graph = new Graph({
  keyboard: {
    enabled: true,
    format(key) { 
      return key
      .replace(/\s/g, '')
      .replace('cmd', 'command')
    },
  },
})

graph.bindKey('cmd', (e) => { })
// 被格式化后等同于 graph.bindKey('command', (e) => { })
```

#### guard

判断一个键盘事件是否应该被处理，返回 `false` 时对应的键盘事件被忽略。

```ts
const graph = new Graph({
  keyboard: {
    enabled: true,
    guard(this: Graph, e: KeyboardEvent) {
      if (e.altKey) { // 当按下 alt 键时，忽略所有键盘事件
        return false 
      }
      return true
    },
  },
})
```


<span class="tag-param">API<span>


- [`bindKey(...)`](#bindkey) 绑定快捷键。
- [`unbindKey(...)`](#unbindkey) 解绑快捷键。
- [`isKeyboardEnabled()`](#iskeyboardenabled) 获取是否启用了键盘事件。
- [`enableKeyboard()`](#enablekeyboard) 启用键盘事件。
- [`disableKeyboard()`](#disablekeyboard) 禁用键盘事件。
- [`toggleKeyboard(...)`](#togglekeyboard) 切换键盘事件的启用状态。









### mousewheel

鼠标滚轮的默认行为是滚动页面，启用 [Scroller](#scroller) 后用于滚动画布，但在某些场景下我们需要用滚轮来缩放画布，所为了避免交互冲突，通常配合修饰键来实现滚轮缩放画布，参考下面配置。

```ts
const graph = new Graph({
  scroller: {
    enabled: true,
    pannable: true,
    pageVisible: true,
    pageBreak: false,
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
})
```

> 按住 `Command` 键通过滚轮缩放画布。

<iframe src="/demos/tutorial/basic/mousewheel/playground"></iframe>

支持的选项如下：

```sign
interface MouseWheelOptions {
  enabled?: boolean
  global?: boolean
  factor?: number
  zoomAtMousePosition?: boolean
  modifiers?: string | ('alt' | 'ctrl' | 'meta' | 'shift')[] | null
  guard?: (this: Graph, e: WheelEvent) => boolean
}
```

#### enabled

是否开启滚轮缩放交互。

#### factor

滚动缩放因子。默认为 `1.2`。

#### zoomAtMousePosition

是否将鼠标位置作为中心缩放，默认为 `true`。

#### global

是否为全局事件，设置为 `true` 时滚轮事件绑定在 `Document` 上，否则绑定在画布容器上。默认为 `false`。

#### modifiers

修饰键(`'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要按下修饰键并滚动鼠标滚轮时才触发画布缩放。通过设置修饰键可以解决默认滚动行为与画布缩放冲突问题。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

#### guard

判断一个滚轮事件是否应该被处理，返回 `false` 时对应的事件被忽略。

```ts
const graph = new Graph({
  mousewheel: {
    enabled: true,
    guard(this: Graph, e: WheelEvent) {
      if (e.altKey) { // 当按下 alt 键时，忽略所有滚动事件
        return false
      }
      return true
    },
  },
})
```


<span class="tag-param">API<span>

- [`isMouseWheelEnabled()`](#ismousewheelenabled) 返回是否启用了鼠标滚轮来缩放画布。
- [`enableMouseWheel()`](#enablemousewheel) 启用鼠标滚轮缩放画布。
- [`disableMouseWheel()`](#disablemousewheel) 禁用鼠标滚轮缩放画布。
- [`toggleMouseWheel(...)`](#togglemousewheel) 切换鼠标滚轮缩放画布的启用状态。












### selecting

点选/框选，默认禁用。创建画布时，通过以下配置开启选择交互，开启后可以通过点击或者套索框选节点。

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

创建画布后，可以调用 [graph.enableSelection()](#enableselection) 和 [graph.disableSelection()](#disableselection) 来启用和禁用选择交互。

```ts
if (graph.isSelectionEnabled()) {
  graph.disableSelection()
} else {
  graph.enableSelection()
}
```

<iframe src="/demos/tutorial/basic/selection/playground"></iframe>

支持的选项如下：

```sign
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


#### className

附加样式名，用于定制样式，默认为 `undefined`。

```ts
const graph = new Graph({
  selecting: {
    enabled: true,
    className: 'my-selecting',
  },
})
```

#### multiple

是否启用点击多选，默认为 `true`。启用多选后按住 `ctrl` 或 `command` 键点击节点实现多选。

#### rubberband

是否启用框选，默认为 `false`。

```ts
const graph = new Graph({
  selecting: {
    enabled: true,
    rubberband: true, // 启用框选
  },
})
```

创建画布后，可以调用 [graph.enableRubberband()](#enablerubberband) 和 [graph.disableRubberband()](#disablerubberband) 来启用和禁用框选。

```ts
if (graph.isRubberbandEnabled()) {
  graph.disableRubberband()
} else {
  graph.enableRubberband()
}
```

#### strict

启用框选时，选框完全包围节点时才选中节点，否则只需要选框与节点的包围盒(BBox)相交即可选中节点，默认为 `false`。

#### modifiers

修饰键(`'alt'`、`'ctrl'`、`'meta'`、`'shift'`)，设置修饰键后需要点击鼠标并按下修饰键才能触发框选。修饰键在某些场景下非常有用，比如同时开始框选和拖拽画布时，而框选和拖拽画布的触发时机都是鼠标左键在画布空白位置按下，这时可以为框选和拖拽画布设置不一样的修饰键，达到同时开启又不冲突的效果。

支持配置单个（如 `'alt'`）或多个（如 `['alt', 'ctrl']`）修饰键，通过数组形式配置的多个修饰键是*或关系*，比如刚刚配置的修饰键表示按下 `'alt'` 或 `'ctrl'`，如果需要更加灵活的配置，可以使用如下这些形式：

- `'alt|ctrl'` 表示按下 `'alt'` 或 `'ctrl'`。
- `'alt&ctrl'` 表示同时按下 `'alt'` 和 `'ctrl'`。
- `'alt|ctrl&shift'` 表示同时按下 `'alt'` 和 `'shift'` 或者同时按下 `'ctrl'` 和 `'shift'`。

#### movable

选中的节点是否可以被移动，设置为 `true` 时，拖动选框触发节点移动，默认为 `true`。

#### content

设置附加显示的内容。

#### filter

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


<span class="tag-param">事件<span>

- cell:selected 节点/边被选中时触发。
- node:selected 节点被选中时触发。
- edge:selected 边被选中时触发。
- cell:unselected 节点/边被取消选中时触发。
- node:unselected 节点被取消选中时触发。
- edge:unselected 边被取消选中时触发。
- selection:changed 选中的节点/边发生改变(增删)时触发。


<span class="tag-param">API<span>

- [`select(...)`](#select) 选中指定的节点/边。需要注意的是，该方法不会取消选中当前选中的节点/边，而是将指定的节点/边追加到选区中。如果同时需要取消选中当前选中的节点/边，请使用 [resetSelection(...)](#resetselection) 方法。
- [`unselect(...)`](#unselect) 取消选中指定的节点/边。
- [`isSelected(...)`](#isselected) 返回指定的节点/边是否被选中。
- [`resetSelection(...)`](#resetselection) 先清空选区，然后选中提供的节点/边。
- [`getSelectedCells()`](#getselectedcells) 获取选中的节点/边。
- [`cleanSelection()`](#cleanselection) 清空选区。
- [`isSelectionEmpty()`](#isselectionempty) 返回选区是否为空。
- [`isSelectionEnabled()`](#isselectionenabled) 是否启用选择能力。
- [`enableSelection()`](#enableselection) 启用选择能力。
- [`disableSelection()`](#disableselection) 禁用选择能力。
- [`toggleSelection(...)`](#toggleselection) 切换选择的启用状态。
- [`isRubberbandEnabled()`](#isrubberbandenabled) 返回是否启用了框选。
- [`enableRubberband()`](#enablerubberband) 启用框选。
- [`disableRubberband()`](#disablerubberband) 禁用框选。
- [`toggleRubberband(...)`](#togglerubberband) 切换框选的启用状态。
- [`isMultipleSelection()`](#ismultipleselection) 是否启用了多选。
- [`enableMultipleSelection()`](#enablemultipleselection) 启用多选。
- [`disableMultipleSelection()`](#disablemultipleselection) 禁用多选。
- [`toggleMultipleSelection(...)`](#togglemultipleselection) 切换多选的启用状态。
- [`isSelectionMovable()`](#isselectionmovable) 返回选中的节点/边是否可以被移动。
- [`enableSelectionMovable()`](#enableselectionmovable) 启用选中的节点/边的移动。
- [`disableSelectionMovable()`](#disableselectionmovable) 禁用选中节点/边的移动。
- [`toggleSelectionMovable(...)`](#toggleselectionmovable) 切换选中节点/边是否可以被移动。
- [`isStrictRubberband()`](#isstrictrubberband) 返回是否启用了严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。
- [`enableStrictRubberband()`](#enablestrictrubberband) 启用严格框选。启用严格框选后，只有节点/边被选框完全包围时才会选中节点/边。
- [`disableStrictRubberband()`](#disablestrictrubberband) 禁用严格框选。禁用严格框选后，只需要选框与节点/边的包围盒相交即可选中节点/边。
- [`toggleStrictRubberband(...)`](#togglestrictrubberband) 切换严格框选的启用状态。
- [`setSelectionFilter(...)`](#setselectionfilter) 设置选择的过滤条件，满足过滤条件的节点/边将不能被选中。
- [`setRubberbandModifiers(...)`](#setrubberbandmodifiers) 设置框选的修饰键，只有同时按下修饰键时才能触发框选。
- [`setSelectionDisplayContent(...)`](#setselectiondisplaycontent) 设置选中节点/边的附加显示内容。

### rotating

旋转节点，默认禁用。开启后可以对节点进行旋转。

```ts
const graph = new Graph({
  rotating: true,
})

// 等同于
const graph = new Graph({
  rotating: {
    enabled: true,
    grid: 15,
  },
})
```

支持的选项如下：

```sign
export interface RotatingRaw {
  enabled?: boolean
  grid?: number
}
```

#### enabled

是否开启节点旋转，默认值为 `false`。

#### grid

每次旋转的角度，默认值为 `15`。

### resizing

缩放节点，默认禁用。开启后可以对节点进行缩放。

```ts
const graph = new Graph({
  resizing: true,
})

// 等同于
const graph = new Graph({
  resizing: {
    enabled: false,
    minWidth: 0,
    minHeight: 0,
    maxWidth: Number.MAX_SAFE_INTEGER,
    maxHeight: Number.MAX_SAFE_INTEGER,
    orthogonal: true,
    restricted: false,
    autoScroll: true,
    preserveAspectRatio: false,
  },
})
```

支持的选项如下：

```sign
export interface ResizingRaw {
  enabled?: boolean
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orthogonal?: boolean
  restricted?: boolean
  autoScroll?: boolean
  preserveAspectRatio?: boolean
}
```

#### enabled

是否开启节点缩放，默认为 `false`。

#### minWidth

缩放后的最小宽度。

#### maxWidth

缩放后的最大宽度。

#### minHeight

缩放后的最小高度。

#### maxHeight

缩放后的最大高度。

#### orthogonal

是否显示中间缩放点，默认为 `true`。

#### restricted

是否限制缩放大小为画布边缘，默认为 `false`。

#### autoScroll

是否自动滚动画布，仅当开启 Srcoller 并且 `restricted` 为 `false` 时有效，默认为 `true`。

#### preserveAspectRatio

缩放过程中是否保持节点的宽高比例，默认为 `false`。

### translating

配置节点的可移动区域，默认值为 `false`。

```ts
const graph = new Graph({
  translating: {
    restrict: true,
  }
})
```
`restrict` 支持以下两种类型：

- `boolean`  设置为 `true`，节点无法超过画布区域
- `Rectangle.RectangleLike | (arg: CellView) => Rectangle.RectangleLike` 指定节点的移动区域

### transforming

平移、缩放和旋转节点的基础选项。

```ts
const graph = new Graph({
  transforming: {
    clearAll: true,
    clearOnBlankMouseDown: true,
  }
})
```

支持的选项如下：

```sign
export interface Options {
  clearAll?: boolean
  clearOnBlankMouseDown?: boolean
}
```

#### clearAll

创建新组件的时候是否清除页面上存在的其他组件，默认为 `true`。

#### clearOnBlankMouseDown

点击空白区域的时候是否清除组件，默认为 `true`。

### embedding

通过embedding可以将一个节点拖动到另一个节点中，使其成为另一节点的子节点，默认禁用。

支持的选项如下：

```sign
export interface Embedding {
  enabled?: boolean
  findParent?:
    | 'bbox'
    | 'center'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | ((this: Graph, args: { node: Node; view: NodeView }) => Cell[])
  frontOnly?: boolean
  validate: (
    this: Graph,
    args: {
      child: Node
      parent: Node
      childView: CellView
      parentView: CellView
    },
  ) => boolean
}
```

#### enabled

是否允许节点之间嵌套，默认值为 `false`。

#### findParent

在节点被移动时通过 `findParent` 指定的方法返回父节点。默认值为 `bbox`。

#### frontOnly

如果 `frontOnly` 为 `true`，则只能嵌入显示在最前面的节点，默认值为 `true`。

#### validate

`validate` 为判断节点能否被嵌入父节点的函数，默认返回 `true`。

### connecting

配置全局的连线规则，支持的选项如下：

```sign
export interface Connecting {
  snap: boolean | { radius: number }
  dangling:
    | boolean
    | ((
        this: Graph,
        args: {
          edge: Edge
          sourceCell?: Cell | null
          targetCell?: Cell | null
          sourcePort?: string
          targetPort?: string
        },
      ) => boolean)
  multi:
    | boolean
    | ((
        this: Graph,
        args: {
          edge: Edge
          sourceCell?: Cell | null
          targetCell?: Cell | null
          sourcePort?: string
          targetPort?: string
        },
      ) => boolean)
  highlight: boolean
  anchor: NodeAnchorOptions
  sourceAnchor?: NodeAnchorOptions
  targetAnchor?: NodeAnchorOptions
  edgeAnchor: EdgeAnchorOptions
  sourceEdgeAnchor?: EdgeAnchorOptions
  targetEdgeAnchor?: EdgeAnchorOptions
  connectionPoint: ConnectionPointOptions
  sourceConnectionPoint?: ConnectionPointOptions
  targetConnectionPoint?: ConnectionPointOptions
  router: string | Router.NativeItem | Router.ManaualItem
  connector: string | Connector.NativeItem | Connector.ManaualItem
  strategy?:
    | string
    | ConnectionStrategy.NativeItem
    | ConnectionPoint.ManaualItem
    | null
  validateMagnet?: (
    this: Graph,
    args: {
      cell: Cell
      view: CellView
      magnet: Element
      e: JQuery.MouseDownEvent
    },
  ) => boolean
  createEdge?: (
    this: Graph,
    args: {
      sourceCell: Cell
      sourceView: CellView
      sourceMagnet: Element
    },
  ) => Nilable<Edge> | void
  validateEdge?: (
    this: Graph,
    args: {
      edge: Edge
      type: Edge.TerminalType
      previous: Edge.TerminalData
    },
  ) => boolean
  validateConnection: (
    this: Graph,
    args: {
      type: Edge.TerminalType
      edge?: Edge | null
      edgeView?: EdgeView
      sourceCell?: Cell | null
      sourceView?: CellView | null
      sourceMagnet?: Element | null
      targetCell?: Cell | null
      targetView?: CellView | null
      targetMagnet?: Element | null
    },
  ) => boolean
}
```

#### snap

当 `snap` 设置为 `true` 时连线的过程中距离节点或者连接桩 `50px` 时会触发自动吸附，可以通过配置 `radius` 属性自定义触发吸附的距离。当 `snap` 设置为 `false` 时不会触发自动吸附。默认值为 `false`。

```ts
const graph = new Graph({
  connecting: {
    snap: true,
  }
})
// 等价于
const graph = new Graph({
  connecting: {
    snap: {
      radius: 50,
    },
  }
})
```

#### dangling

画布上的任意一点是否作为边的起点和终点。默认值值为 `true`，如果设置为 `false`， 边的起点或者终点只能是节点或者连接桩。

#### multi

#### highlight

拖动边时，是否高亮显示所有可用的连接桩或节点，默认值为 `false`。

#### anchor

当连接到节点时，通过 [`anchor`](../api/registry/node-anchor) 来指定被连接的节点的锚点，默认值为 `center`。

#### sourceAnchor

当连接到节点时，通过 `sourceAnchor` 来指定源节点的锚点。

#### targetAnchor

当连接到节点时，通过 `targetAnchor` 来指定目标节点的锚点。

#### edgeAnchor

当连接到边时，通过 [`edgeAnchor`](../api/registry/edge-anchor) 来指定被连接的边的锚点，默认值为 `ratio`。

#### sourceEdgeAnchor

当连接到边时，通过 `sourceEdgeAnchor` 来指定源边的锚点。

#### targetEdgeAnchor

当连接到边时，通过 `targetEdgeAnchor` 来指定目标边的锚点。

#### connectionPoint

指定[连接点](../api/registry/connector)，默认值为 `boundary`。

#### sourceConnectionPoint

连接源的连接点。

#### targetConnectionPoint

连接目标的连接点。

#### router

[路由](../api/registry/router)将边的路径点 `vertices` 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点，默认值为 `normal`。

#### connector

[连接器](../api/registry/connector)将起点、路由返回的点、终点加工为 <path> 元素的 d 属性，决定了边渲染到画布后的样式，默认值为 `normal`。

#### validateMagnet

点击 `magnet` 时 根据 `validateMagnet` 返回值来判断是否新增边

#### createEdge

连接的过程中创建新的边

#### validateEdge

当停止拖动边的时候根据 `validateEdge` 返回值来判断边是否生效，如果返回 `false`, 该边会被清除。

#### validateConnection

判断连接是否有效，如果返回 `false` ，连接无效。

### highlighting

可以通过 `highlighting` 选项来指定触发某种交互时的高亮样式，如：

```ts
new Graph({
  highlighting: {
    // 当链接桩可以被链接时，在链接桩外围渲染一个 2px 宽的红色矩形框
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          'stroke-width': 2,
          stroke: 'red',
        }
      },
    },
  },
})
```

支持的 `highlighting` 配置项有：

- `'default'` 默认高亮选项，当以下几种高亮配置缺省时被使用。
- `'embedding'` 拖动节点进行嵌入操作过程中，节点可以被嵌入时被使用。
- `'nodeAvailable'` 连线过程中，节点可以被链接时被使用。
- `'magnetAvailable'` 连线过程中，链接桩可以被链接时被使用。
- `'magnetAdsorbed'` 连线过程中，自动吸附到链接桩时被使用。


另外，也可以直接使用在 [`cellView.highlight(...)`](../view/cellview#highlight) 方法中，用来高亮指定的元素。

```ts
cellView.highlight(elem, { 
  highlighter: {
    name: 'stroke',
    args: {
      padding: 4,
      attrs: {
        'stroke-width': 2,
        stroke: 'red',
      }
    },
  },
})
```

### interacting

定制节点和边的交互行为，支持以下三种类型：

- `boolean`  节点或边是否可交互
- `InteractionMap` 节点或边的交互细节，支持以下属性：
  - `'nodeMovable'` 节点是否可以被移动。
  - `'magnetConnectable'` 当在具有 `'magnet'` 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
  - `'edgeMovable'` 边是否可以被移动。
  - `'edgeLabelMovable'` 边的标签是否可以被移动。
  - `'arrowheadMovable'` 边的起始/终止箭头是否可以被移动。
  - `'vertexMovable'` 边的路径点是否可以被移动。
  - `'vertexAddable'` 是否可以添加边的路径点。
  - `'vertexDeletable'` 边的路径点是否可以被删除。
- `(this: Graph, cellView: CellView) => InteractionMap | boolean`

```ts
const graph = new Graph({
  container: this.container,
  width: 800,
  height: 1400,
  grid: 10,
  interacting: function (cellView: CellView) {
    if (cellView.cell.getProp('customLinkInteractions')) {
      return { vertexAdd: false }
    }
    return true
  },
})
```

### sorting

节点和边视图的排序方式。

原生 SVG 不支持 `z-index` 样式，所以我们在 x6 中通过代码的形式来支持节点和边的层级设置。创建节点和边时，可以通过 [`zIndex`](./model/cell#zindex) 选项来设置节点和边的层级；也可以拿到节点/边的实例后，通过 [`cell.setZIndex(z)`](./model/cell#setzindex)、[`cell.toFront()`](./model/cell#tofront) 和 [`cell.toBack()`](./model/cell#toback) 等方法来修改层级。

支持以下三种取值：

-  `'none'` 时，不进行排序，节点和边的 `zIndex` 选项失效。
-  `'exact'` 按 `zIndex` 从低到高渲染，当 `zIndex` 相同时按照添加顺序渲染。
-  `'approx'` 按 `zIndex` 从低到高渲染，当 `zIndex` 相同时渲染顺序不确定，但渲染效率更高。

### async

是否是异步渲染的画布。异步渲染不会阻塞 UI，对需要添加大量节点和边时的性能提升非常明显。但需要注意的是，一些同步操作可能会出现意外结果，比如获取某个节点的视图、获取节点/边的包围盒等，因为这些同步操作触发时异步渲染可能并没有完成，此时只能通过监听 `render:done` 事件来确保所有变更都已经生效，然后在事件回调中进行这些操作。

<iframe src="/demos/api/graph/async"></iframe>

### frozen

异步渲染的画布是否处于冻结状态，处于冻结状态的画布不会立即响应画布中节点和边的变更，直到调用 [`unfreeze(...)`](#unfreeze) 方法来解除冻结并重新渲染画布。

```ts
const graph = new Graph({
  container: this.container,
  async: true,
  frozen: true,
})

// add many nodes and edges

graph.unfreeze()
```

### checkView

```sign
(
  this: Graph,
  args: {
    view: CellView
    unmounted: boolean
  },
) => boolean
```

返回指定的视图是否应该渲染到 DOM 中。

<iframe src="/demos/api/graph/checkview"></iframe>

### magnetThreshold

鼠标移动多少次后才触发连线，或者设置为 'onleave' 时表示鼠标移出元素时才触发连线，默认为 `0`。

### moveThreshold

触发 `'mousemove'` 事件之前，允许鼠标移动的次数，默认为 `0`。

### clickThreshold

当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件，默认为 `0`。

### preventDefaultContextMenu

是否禁用画布的默认右键，默认为 `true`。

### preventDefaultBlankAction

在画布空白位置响应鼠标事件时，是否禁用鼠标默认行为，默认为 `true`。

### guard

```sign
(e: JQuery.TriggeredEvent, view?: CellView | null) => boolean
```

是否应该忽略某个鼠标事件，返回 `true` 时忽略指定的鼠标事件，否则不忽略。

### allowRubberband

```sign
(e: JQuery.MouseDownEvent) => boolean
```

返回是否响应框选事件，默认为 `() => true`。

### allowPanning

```sign
(e: JQuery.MouseDownEvent) => boolean
```

返回是否响应画布平移事件，默认为 `() => true`。

### getCellView

```sign
(this: Graph, cell: Cell) => null | undefined | typeof CellView | (new (...args: any[]) => CellView)
```

获取节点/边的视图类，默认为 `() => null`。

### createCellView

```sign
(this: Graph, cell: Cell) => CellView | null | undefined
```

创建节点/边的视图，默认自动根据节点和边的 [`view`](./model/cell#view) 选项创建对应的视图。

### getHTMLComponent

```sign
(this: Graph, node: HTML) => HTMLElement | string | null | undefined
```

获取 HTML 节点的 HTML 元素，默认根据节点的 `html` 选项返回对应的 HTML 元素。更多细节请参考[使用 HTML 节点教程](../tutorial/advanced/react#渲染-html-节点)。

```ts
const graph = new Graph({
  getHTMLComponent(node) {
    const data = node.getData()
    if (data.flag) {
      return document.createElement('div')
    }
    return document.createElement('p')
  }
})
```

### onPortRendered

```sign
(
  this: Graph, 
  args: {
    node: Node
    port: Port
    container: Element
    selectors?: Markup.Selectors
    labelContainer: Element
    labelSelectors?: Markup.Selectors
    contentContainer: Element
    contentSelectors?: Markup.Selectors
  },
) => void
```

当某个链接桩渲染完成时触发的回调。

<span class="tag-param">args 参数<span>

| 名称             | 类型             | 非空 | 描述                                    |
|------------------|------------------|:----:|---------------------------------------|
| node             | Node             |  ✓   | 节点实例。                               |
| port             | Port             |  ✓   | 链接桩选项。                             |
| container        | Element          |  ✓   | 链接桩的容器元素。                       |
| selectors        | Markup.Selectors |      | 链接桩 Markup 渲染后的选择器键值对。     |
| labelContainer   | Element          |  ✓   | 链接桩标签的容器元素。                   |
| labelSelectors   | Markup.Selectors |      | 链接桩标签 Markup 渲染后的选择器键值对。 |
| contentContainer | Element          |  ✓   | 链接桩内容的容器元素。                   |
| contentSelectors | Markup.Selectors |      | 链接桩内容 Markup 渲染后的选择器键值对。 |

<span class="tag-example">使用<span>

例如，我们可以渲染一个 React 类型的链接桩。

```tsx
const graph = new Graph({
  container: this.container,
  onPortRendered(args) {
    const selectors = args.contentSelectors
    const container = selectors && selectors.foContent
    if (container) {
      ReactDOM.render(
        <Tooltip title="port">
          <div className="my-port" />
        </Tooltip>,
        container,
      )
    }
  },
})
```

<iframe src="/demos/tutorial/advanced/react/react-port"></iframe>

### onEdgeLabelRendered

```sign
(
  this: Graph, 
  args: {
    edge: Edge
    label: Edge.Label
    container: Element
    selectors: Markup.Selectors
  },
) => void
```

当边的文本标签渲染完成时触发的回调。

<span class="tag-param">args 参数<span>

| 名称      | 类型             | 非空 | 描述                                  |
|-----------|------------------|:----:|-------------------------------------|
| edge      | Edge             |  ✓   | 边实例。                               |
| label     | Edge.Label       |  ✓   | 文本标签选项。                         |
| container | Element          |  ✓   | 文本标签容器。                         |
| selectors | Markup.Selectors |  ✓   | 文本标签 Markup 渲染后的选择器键值对。 |

<span class="tag-example">使用<span>

例如，我们可以在标签上渲染任何想要的元素。

```tsx
const graph = new Graph({
  container: this.container,
  onEdgeLabelRendered(args) {
    const { label, container, selectors } = args
    const data = label.data
    
    if (data) {
      // 在 Label 容器中渲染一个 foreignObject 来承载 HTML 元素和 React 组件
      const content = this.appendForeignObject(container)

      if (data === 1) {
        // 渲染一个 Div 元素
        const txt = document.createTextNode('text node')
        content.style.border = '1px solid #f0f0f0'
        content.style.borderRadius = '4px'
        content.appendChild(txt)
      } else if (data === 2) {
        // 渲染一个 HTML 按钮
        const btn = document.createElement('button')
        btn.appendChild(document.createTextNode('HTML Button'))
        btn.style.height = '30px'
        btn.style.lineHeight = '1'
        btn.addEventListener('click', () => {
          alert('clicked')
        })
        content.appendChild(btn)
      } else if (data === 3) {
        // 渲染一个 Atnd 的按钮
        ReactDOM.render(<Button size="small">Antd Button</Button>, content)
      }
    }
  },
})
```

<iframe src="/demos/tutorial/advanced/react/react-label-base"></iframe>

我们也可以在定义 Label 的 Markup 时添加 `<foreignObject>` 元素来支持 HTML 和 React 的渲染能力。

```tsx
const graph = new Graph({
  container: this.container,
  onEdgeLabelRendered: (args) => {
    const { selectors } = args
    const content = selectors.foContent as HTMLDivElement

    if (content) {
      content.style.display = 'flex'
      content.style.alignItems = 'center'
      content.style.justifyContent = 'center'
      ReactDOM.render(<Button size="small">Antd Button</Button>, content)
    }
  },
})
```

<iframe src="/demos/tutorial/advanced/react/react-label-markup"></iframe>

### onToolItemCreated

```sign
(
  this: Graph, 
  args: {
    name: string
    cell: Cell
    view: CellView
    tool: View
  },
) => void
```

当工具项渲染完成时触发的回调。

<span class="tag-param">args 参数<span>

| 名称 | 类型     | 非空 | 描述         |
|------|----------|:----:|------------|
| cell | Cell     |  ✓   | 节点/边实例。 |
| view | CellView |  ✓   | 节点/边视图。 |
| name | string   |  ✓   | 工具项名称。  |
| tool | View     |  ✓   | 工具视图。    |

<span class="tag-example">使用<span>

例如，我们为 `vertices` 工具设置间隔填充效果。

```ts
const graph = new Graph({
  container: this.container,
  grid: true,
  onToolItemCreated({ name, cell, tool }) {
    if (name === 'vertices' && cell === edge2) {
      const options = (tool as any).options
      if (options && options.index % 2 === 1) {
        tool.setAttrs({ fill: 'red' })
      }
    }
  },
})
```

<iframe src="/demos/api/registry/edge-tool/vertices"></iframe>


## prototype

### 模型 Model

#### isNode(...)

```sign
isNode(cell: Cell): cell is Node
```

返回指定的 Cell 是否是节点。

<span class="tag-param">参数<span>

| 名称 | 类型 | 必选 | 默认值 | 描述         |
|------|------|:----:|--------|------------|
| cell | Cell |  ✓   |        | 指定的 Cell。 |

#### isEdge(...)

```sign
isNode(cell: Cell): cell is Edge
```

返回指定的 Cell 是否是边。

<span class="tag-param">参数<span>

| 名称 | 类型 | 必选 | 默认值 | 描述         |
|------|------|:----:|--------|------------|
| cell | Cell |  ✓   |        | 指定的 Cell。 |

#### createNode(...)

```sign
createNode(metadata: Node.Metadata): Node
```

创建节点。

<span class="tag-param">参数<span>

| 名称     | 类型          | 必选 | 默认值 | 描述                                    |
|----------|---------------|:----:|--------|---------------------------------------|
| metadata | Node.Metadata |  ✓   |        | [节点元数据](./model/node#constructor)。 |

#### addNode(...)

```sign
addNode(metadata: Node.Metadata, options?: AddOptions): Node
addNode(node: Node, options?: AddOptions): Node
```

添加节点到画布，返回添加的节点。

<span class="tag-param">参数<span>

| 名称             | 类型                  | 必选 | 默认值  | 描述                                                                |
|------------------|-----------------------|:----:|---------|-------------------------------------------------------------------|
| node             | Node.Metadata \| Node |  ✓   |         | [节点元数据](./model/node#constructor)或[节点实例](./model/node)。   |
| options.silent   | boolean               |      | `false` | 为 `true` 时不触发 `'node:added'` 和 `'cell:added'` 事件和画布重绘。 |
| options.sort     | boolean               |      | `true`  | 是否按照  `zIndex` 排序。                                            |
| options...others | object                |      |         | 其他自定义键值对，可以在事件回调中使用。                              |

#### removeNode(...)

```sign
removeNode(nodeId: string, options?: RemoveOptions): Node | null
removeNode(node: Node, options?: RemoveOptions): Node | null
```

删除节点，返回删除的节点。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                    |
|------------------|----------------|:----:|---------|-----------------------------------------------------------------------|
| node             | string \| Node |  ✓   |         | 节点 ID 或[节点实例](./model/node)。                                     |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'node:removed'` 和 `'cell:removed'` 事件和画布重绘。 |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                  |

#### createEdge(...)

```sign
createNode(metadata: Edge.Metadata): Edge
```

创建边。

<span class="tag-param">参数<span>

| 名称     | 类型          | 必选 | 默认值 | 描述                                    |
|----------|---------------|:----:|--------|---------------------------------------|
| metadata | Edge.Metadata |  ✓   |        | [节点元数据](./model/edge#constructor)。 |

#### addEdge(...)

```sign
addEdge(metadata: Edge.Metadata, options?: AddOptions): Edge
addEdge(edge:Edge, options?: AddOptions): Edge
```

添加边到画布，返回添加的边。

<span class="tag-param">参数<span>

| 名称             | 类型                  | 必选 | 默认值  | 描述                                                                |
|------------------|-----------------------|:----:|---------|-------------------------------------------------------------------|
| edge             | Edge.Metadata \| Edge |  ✓   |         | [边元数据](./model/edge#constructor)或[边实例](./model/edge)。       |
| options.silent   | boolean               |      | `false` | 为 `true` 时不触发 `'edge:added'` 和 `'cell:added'` 事件和画布重绘。 |
| options.sort     | boolean               |      | `true`  | 是否按照  `zIndex` 排序。                                            |
| options...others | object                |      |         | 其他自定义键值对，可以在事件回调中使用。                              |

#### removeEdge(...)

```sign
removeEdge(edgeId: string, options?: RemoveOptions): Edge | null
removeEdge(edge: Edge, options?: RemoveOptions): Edge | null
```

删除边，返回删除的边。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                    |
|------------------|----------------|:----:|---------|-----------------------------------------------------------------------|
| edge             | string \| Edge |  ✓   |         | 边 ID 或[边实例](./model/edge)。                                         |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'edge:removed'` 和 `'cell:removed'` 事件和画布重绘。 |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                  |

#### addCell(...)

```sign
addCell(cell: Cell | Cell[], options?: AddOptions): this
```

添加节点或边到画布。

<span class="tag-param">参数<span>

| 名称             | 类型           | 必选 | 默认值  | 描述                                                                               |
|------------------|----------------|:----:|---------|----------------------------------------------------------------------------------|
| cell             | Cell \| Cell[] |  ✓   |         | [节点实例](./model/node)或[边实例](./model/edge)，支持传入数组同时添加多个节点或边。 |
| options.silent   | boolean        |      | `false` | 为 `true` 时不触发 `'cell:added'`、`'node:added'` 和 `'edge:added'` 事件和画布重绘。 |
| options.sort     | boolean        |      | `true`  | 是否按照  `zIndex` 排序。                                                           |
| options...others | object         |      |         | 其他自定义键值对，可以在事件回调中使用。                                             |

#### removeCell(...)

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

#### removeCells(...)

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

#### removeConnectedEdges(...)

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

#### disconnectConnectedEdges(...)

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

#### clearCells(...)

```sign
clearCells(options?: SetOptions): this
```

清空画布。

<span class="tag-param">参数<span>

| 名称             | 类型    | 必选 | 默认值  | 描述                                                                                      |
|------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------|
| options.silent   | boolean |      | `false` | 为 `true` 时不触发 `'cell:removed'`、`'node:removed'` 和 `'edge:removed'`  事件和画布重绘。 |
| options...others | object  |      |         | 其他自定义键值对，可以在事件回调中使用。                                                    |

#### resetCells(...)

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

#### hasCell(...)

```sign
hasCell(cellId: string): boolean
hasCell(cell: Cell): boolean
```

返回画布中是否包含指定的节点/边。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

#### getCell(...)

```sign
getCell<T extends Cell = Cell>(id: string): T
```

根据节点/边的 ID 获取节点/边。

<span class="tag-param">参数<span>

| 名称 | 类型   | 必选 | 默认值 | 描述          |
|------|--------|:----:|--------|-------------|
| cell | string |  ✓   |        | 节点/边的 ID。 |

#### getCells()

```sign
getCells(): Cell[]
```

返回画布中所有节点和边。

#### getCellCount()

```sign
getCellCount(): number
```

返回画布中所有节点和边的数量。

#### getNodes()

```sign
getNodes(): Node[]
```

返回画布中所有节点。

#### getEdges()

```sign
getEdges(): Edge[]
```

返回画布中所有边。

#### getOutgoingEdges(...)

```sign
getOutgoingEdges(cell: Cell | string): Edge[] | null
```

获取连接到节点/边的输出边，即边的起点为指定节点/边的边。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

#### getIncomingEdges(...)

```sign
getIncomingEdges(cell: Cell | string): Edge[] | null
```

获取连接到节点/边的输入边，即边的终点为指定节点/边的边。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

#### getConnectedEdges(...)

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

#### getRootNodes()

```sign
getRootNodes(): Node[]
```

获取所有根节点，即没有输入边的节点。

#### isRootNode(...)

```sign
isRootNode(cell: Cell | string): boolean
```

返回指定的节点是否是跟节点。

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

#### getLeafNodes()

```sign
getLeafNodes(): Node[]
```

返回所有叶子节点，即没有输出边的节点。

#### isLeafNode(...)

```sign
isLeafNode(cell: Cell | string): boolean
```

<span class="tag-param">参数<span>

| 名称 | 类型           | 必选 | 默认值 | 描述                  |
|------|----------------|:----:|--------|---------------------|
| cell | string \| Cell |  ✓   |        | 节点/边 ID 或节点/边。 |

#### getNeighbors(...)

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

#### isNeighbor(...)

```sign
isNeighbor(cell1: Cell, cell2: Cell, options?: GetNeighborsOptions): boolean
```

返回 `cell2` 是否是 `cell1` 的邻居， 其中 `options` 选项与 [`getNeighbors(...)`](#getneighbors) 方法的选项一致。

#### getPredecessors(...)

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

#### isPredecessor(...)

```sign
isPredecessor(cell1: Cell, cell2: Cell, options?: GetPredecessorsOptions): boolean
```

返回 `cell2` 是否是 `cell1` 的前序节点，其中 `options` 选项与 [`getPredecessors(...)`](#getpredecessors) 方法的选项一致。

<span class="tag-param">参数<span>

#### getSuccessors(...)

```sign
getSuccessors(cell: Cell, options?: GetPredecessorsOptions): Cell[]
```

获取所有后续节点，即从指定节点开始连接到叶子节点的节点。其中 `options` 选项与 [`getPredecessors(...)`](#getpredecessors) 方法的选项一致。


#### isSuccessor(...)

```sign
isSuccessor(cell1: Cell, cell2: Cell, options?: GetPredecessorsOptions): boolean
```

返回 `cell2` 是否是 `cell1` 的后续节点，其中 `options` 选项与 [`getPredecessors(...)`](#getpredecessors) 方法的选项一致。

#### getCommonAncestor(...)

```sign
getCommonAncestor(...cells: {Cell | Cell[])[]): Cell | null
```

获取指定节点的共同祖先节点。

#### getSubGraph(...)

```sign
getSubGraph(cells: Cell[], options？: GetSubgraphOptions): Cell[]
```

返回指定节点和边构成的子图。通过遍历指定的 `cells` 数组，当遇到边时，同时包含边的起始和终止节点；当遇到节点时，如果与节点相连的边的两端的节点都在 `cells` 数组中，则同时包含该条边。

<span class="tag-param">参数<span>

| 名称         | 类型    | 必选 | 默认值  | 描述                       |
|--------------|---------|:----:|---------|--------------------------|
| cells        | Cell[]  |  ✓   |         | 节点/边数组。               |
| options.deep | boolean |      | `false` | 是否递归获取所有子节点/边。 |

#### cloneCells(...)

```sign
cloneCells(cells: Cell[]): { [oldCellId: string]: Cell }
```

克隆，返回旧节点/边 ID 和克隆后节点/边的键值对。

#### cloneSubGraph(...)

```sign
cloneSubGraph(cells: Cell[], options?: GetSubgraphOptions): { [oldCellId: string]: Cell }
```

获取子图并克隆。其中 `options` 选项与 [`getSubGraph(...)`](#getsubgraph) 方法的选项一致。

#### getNodesFromPoint(...)

```sign
getNodesFromPoint(x: number, y: number): Node[]
getNodesFromPoint(p: Point.PointLike): Node[]
```

返回指定位置的节点，即返回节点的矩形区域包含了指定点的节点。

#### getNodesInArea(...)

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

#### getNodesUnderNode(...)

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

#### searchCell(...)

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

#### getShortestPath(...)

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

#### getAllCellsBBox(...)

```sign
getAllCellsBBox(): Rectangle | null
```

返回画布上所有节点和边的矩形区域。

#### getCellsBBox(...)

```sign
getCellsBBox(cells: Cell[], options?: Cell.GetCellsBBoxOptions): Rectangle | null
```

返回指定节点和边构成的矩形区域。

<span class="tag-param">参数<span>

| 名称         | 类型    | 必选 | 默认值  | 描述                      |
|--------------|---------|:----:|---------|-------------------------|
| cells        | Cell[]  |  ✓   |         | 节点和边数组。             |
| options.deep | boolean |      | `false` | 是否包含所有子孙节点和边。 |

#### toJSON(...)

```sign
toJSON(options?: ToJSONOptions): object
```

导出图中的节点和边，返回一个具有 `{ cells: [] }` 结构的对象，其中 `cells` 数组按渲染顺序保存节点和边。

<span class="tag-param">参数<span>

| 名称         | 类型 | 必选 | 默认值  | 描述                                                                                             |
|--------------|------|:----:|---------|------------------------------------------------------------------------------------------------|
| options.deep | diff |      | `false` | 是否导出节点和边的差异数据（与节点和边的[默认配置](../tutorial/basic/cell#选项默认值)不同的部分）。 |

#### parseJSON(...)

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


#### fromJSON(...)

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

当 `options.slient` 为 `true` 时，不触发 `cell:added`、`node:added` 和 `edge:added` 事件和画布重绘。

### 视图 View

#### isAsync()

```sign
isAsync(): boolean
```

返回画布是否是异步渲染模式。异步渲染不会阻塞 UI，对需要添加大量节点和边时的性能提升非常明显，异步画布的使用细节请参考 [`async`](#async) 选项。

#### isFrozen()

```sign
isFrozen(): boolean
```

返回[异步画布](#async)是否处于冻结状态。处于冻结状态的画布不会立即响应画布中节点和边的变更，直到调用 [`unfreeze(...)`](#unfreeze) 方法来解除冻结并重新渲染画布。

#### freeze(...)

```sign
freeze(options?: FreezeOptions): this
```

冻结[异步画布](#async)，处于冻结状态的画布不会立即响应画布中节点和边的变更，直到调用 [`unfreeze(...)`](#unfreeze) 方法来解除冻结并重新渲染画布。

<span class="tag-param">参数<span>

| 名称        | 类型   | 必选 | 默认值 | 描述                                                                              |
|-------------|--------|:----:|--------|---------------------------------------------------------------------------------|
| options.key | string |      | -      | 冻结状态的名称，当指定名称与当前冻结状态的名称不一致时，则不能用指定的名称冻结画布。 |

#### unfreeze(...)

```sign
unfreeze(options?: UnfreezeOptions): this
```

解除[异步画布](#async)的冻结状态，并触发画布重新渲染，使画布中的变更生效。

<span class="tag-param">参数<span>

| 名称              | 类型                                                                             | 必选 | 默认值 | 描述                                    |
|-------------------|----------------------------------------------------------------------------------|:----:|--------|---------------------------------------|
| options.key       | string                                                                           |      | -      | 冻结状态的名称。                         |
| options.batchSize | number                                                                           |      | `1000` | 每次异步进程中处理的节点和边视图的数量。 |
| options.viewport  | (this: Graph, args: { view: CellView; unmounted: boolean }) => boolean           |      | -      | 返回指定的视图是否应该渲染到 DOM 中。    |
| options.before    | (this: Graph, graph: Graph) => void                                              |      | -      | 开始异步更新前调用的函数。               |
| options.after     | (this: Graph, graph: Graph) => void                                              |      | -      | 完成异步更新时调用的函数。               |
| options.progress  | (this: Graph, args: { done: boolean; processed: number; total: number }) => void |      | -      | 每次异步进程的进度回调函数。             |

#### findView(...)

```sign
findView(ref: Cell | JQuery | Element): CellView | null
```

根据节点/边或元素查找对应的视图。

#### findViewByCell(...)

```sign
findViewByCell(cellId: string | number): CellView | null
findViewByCell(cell: Cell | null): CellView | null
```

根据节点/边 ID 或实例查找对应的视图。

#### findViewByElem(...)

```sign
findViewByElem(elem: string | JQuery | Element | undefined | null): CellView | null
```

根据元素选择器或元素对象查找对应的视图。

#### findViewsFromPoint(...)

```sign
findViewsFromPoint(x: number, y: number): CellView[]
findViewsFromPoint(p: Point.PointLike): CellView[]
```

返回节点/边的包围盒包含指定点的视图。

#### findViewsInArea(...)

```sign
findViewsInArea(
  x: number,
  y: number,
  width: number,
  height: number,
  options?: FindViewsInAreaOptions,
): CellView[]
findViewsInArea(
  rect: Rectangle.RectangleLike,
  options?: FindViewsInAreaOptions,
): CellView[]
```

返回节点/边的包围盒与指定矩形相交的视图，当 `options.strict` 为 `true` 时需要节点/边的包围盒完全包含指定的矩形。

#### findViews(...)

```sign
findViews(ref: Point.PointLike | Rectangle.RectangleLike): CellView[]
```

返回节点/边的包围盒包含指定的点或与指定的矩形相交的视图。

#### isViewMounted(...)

```sign
isViewMounted(view: CellView): boolean
```

返回指定的视图是否已经渲染到 DOM 中。

#### getMountedViews()

```sign
getMountedViews(): View[]
```

返回已经渲染到 DOM 的视图。

#### getUnmountedViews()

```sign
getUnmountedViews(): View[]
```

返回还没有渲染到 DOM 的视图。

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

```sign
matrix(): DOMMatrix
```

获取画布的变换矩阵。

```sign
matrix(mat: DOMMatrix | Dom.MatrixLike | null): this
```

<span class="tag-param">参数<span>

| 名称 | 类型                                | 必选 | 默认值 | 描述                                                                                   |
|------|-------------------------------------|:----:|--------|--------------------------------------------------------------------------------------|
| mat  | DOMMatrix \| Dom.MatrixLike \| null |  ✓   |        | 变换矩阵，参考 [DomMatrix](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMMatrix)。 |

#### resize(...)

```sign
resize(width?: number, height?: number): this
```

设置容器大小，自动根据是否开启 Scroller 来设置画布或设置 Scroller 的大小。如果需要根据浏览器窗口大小动态调整画布大小，请使用此方法。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述                         |
|--------|--------|:----:|--------|----------------------------|
| width  | number |      |        | 画布宽度，缺省时宽度保持不变。 |
| height | number |      |        | 画布高度，缺省时高度保持不变。 |

#### resizeGraph(...)

```sign
resizeGraph(width?: number, height?: number): this
```

设置画布大小。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述                         |
|--------|--------|:----:|--------|----------------------------|
| width  | number |      |        | 画布宽度，缺省时宽度保持不变。 |
| height | number |      |        | 画布高度，缺省时高度保持不变。 |

#### resizeScroller(...)

```sign
resizeScroller(width?: number, height?: number): this
```

设置 Scroller 大小，仅在启用 Scroller 后生效。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述                         |
|--------|--------|:----:|--------|----------------------------|
| width  | number |      |        | 画布宽度，缺省时宽度保持不变。 |
| height | number |      |        | 画布高度，缺省时高度保持不变。 |

#### scale(...)

```sign
scale(): {
  sx: number
  sy: number
}
```

获取画布的缩放比例。

```sign
scale(sx: number, sy?: number, cx?: number, cy?: number): this
```

设置画布的缩放比例。

<span class="tag-param">参数<span>

| 名称 | 类型   | 必选 | 默认值 | 描述                              |
|------|--------|:----:|--------|---------------------------------|
| sx   | number |  ✓   |        | X 轴方向缩放比例。                 |
| sy   | number |      | `sx`   | Y 轴方向缩放比例，缺省时使用 `sx`。 |
| cx   | number |      | `0`    | 缩放中心 x 坐标。                  |
| cy   | number |      | `0`    | 缩放中心 y 坐标。                  |

#### rotate(...)

```sign
rotate(): {
  angle: number
  cx?: number
  cy?: number
}
```

获取画布的旋转角度和旋转中心。

```sign
rotate(angle: number, cx?: number, cy?: number): this
```

旋转画布。

<span class="tag-param">参数<span>

| 名称  | 类型   | 必选 | 默认值 | 描述                              |
|-------|--------|:----:|--------|---------------------------------|
| angle | number |  ✓   |        | 旋转角度。                         |
| cx    | number |      | -      | 旋转中心 x 坐标，默认使用画布中心。 |
| cy    | number |      | -      | 旋转中心 y 坐标，默认使用画布中心。 |

#### translate(...)

```sign
translate(): {
  tx: number
  ty: number
}
```

获取画布的平移量。

```sign
translate(tx: number, ty: number): this
```

平移画布。

<span class="tag-param">参数<span>

| 名称 | 类型   | 必选 | 默认值 | 描述        |
|------|--------|:----:|--------|-----------|
| tx   | number |  ✓   |        | X 轴平移量。 |
| ty   | number |  ✓   |        | Y 轴平移量。 |

#### fitToContent(...)

```sign
fitToContent(
  gridWidth?: number,
  gridHeight?: number,
  padding?: NumberExt.SideOptions,
  options?: Transform.FitToContentOptions,
): Rectangle
fitToContent(options?: Transform.FitToContentFullOptions): Rectangle
```

通过平移和重置画布大小，使其适应画布内容，返回画布的矩形区域。

<span class="tag-param">参数<span>

| 名称                    | 类型                                    | 必选 | 默认值  | 描述                                                                                          |
|-------------------------|-----------------------------------------|:----:|---------|---------------------------------------------------------------------------------------------|
| options.gridWidth       | number                                  |      | -       | 使宽度是 `gridWidth` 的整倍数。                                                                |
| options.gridHeight      | number                                  |      | -       | 使高度是 `gridHeight` 的整倍数。                                                               |
| options.minWidth        | number                                  |      | -       | 画布最小宽度。                                                                                 |
| options.minHeight       | number                                  |      | -       | 画布最小高度。                                                                                 |
| options.maxWidth        | number                                  |      | -       | 画布最大宽度。                                                                                 |
| options.maxHeight       | number                                  |      | -       | 画布最大高度。                                                                                 |
| options.padding         | number \| Padding                       |      | `0`     | 边距。                                                                                         |
| options.contentArea     | Rectangle.RectangleLike                 |      | -       | 内容区域，默认获取画布内容区域。                                                                |
| options.useCellGeometry | boolean                                 |      | `false` | 是否使用节点/边的几何信息(Model)计算包围盒，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |
| options.allowNewOrigin  | `'negative'` \| `'positive'` \| `'any'` |      | -       | 画布左上角位置选项。                                                                           |

#### scaleContentToFit(...)

```sign
scaleContentToFit(options?: Transform.ScaleContentToFitOptions): this
```

缩放画布，使内容充满画布视口。

<span class="tag-param">参数<span>

| 名称                        | 类型                    | 必选 | 默认值  | 描述                                                                                          |
|-----------------------------|-------------------------|:----:|---------|---------------------------------------------------------------------------------------------|
| options.padding             | number                  |      | -       | 边距。                                                                                         |
| options.contentArea         | Rectangle.RectangleLike |      | -       | 内容区域，默认获取画布内容区域。                                                                |
| options.viewportArea        | Rectangle.RectangleLike |      | -       | 视口区域，默认获取画布视口。                                                                    |
| options.scaleGrid           | number                  |      | -       | 修正缩放比例为 `scaleGrid` 的整倍数。                                                          |
| options.minScale            | number                  |      | -       | 最小缩放比例。                                                                                 |
| options.maxScale            | number                  |      | -       | 最大缩放比例。                                                                                 |
| options.minScaleX           | number                  |      | -       | X 轴方向的最小缩放比例。                                                                       |
| options.maxScaleX           | number                  |      | -       | X 轴方向的最大缩放比例。                                                                       |
| options.minScaleY           | number                  |      | -       | Y 轴方向的最小缩放比例。                                                                       |
| options.maxScaleY           | number                  |      | -       | Y 轴方向的最大缩放比例。                                                                       |
| options.preserveAspectRatio | boolean                 |      | `false` | 是否保持长宽比。                                                                               |
| options.useCellGeometry     | boolean                 |      | `false` | 是否使用节点/边的几何信息(Model)计算包围盒，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |


#### getContentArea(...)

```sign
getContentArea(options?: Transform.GetContentAreaOptions): Rectangle
```

获取画布内容的矩形区域，使用[画布本地坐标](#clienttolocal)表示。

<span class="tag-param">参数<span>


| 名称                    | 类型    | 必选 | 默认值  | 描述                                                                                                  |
|-------------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------------------|
| options.useCellGeometry | boolean |      | `false` | 是否使用节点/边的几何信息(Model)来计算画布内容大小，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

#### getContentBBox(...)

```sign
getContentBBox(options?: Transform.GetContentAreaOptions): Rectangle
```

获取画布内容的矩形区域，使用[画布坐标](#localtograph)表示。

<span class="tag-param">参数<span>


| 名称                    | 类型    | 必选 | 默认值  | 描述                                                                                                  |
|-------------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------------------|
| options.useCellGeometry | boolean |      | `false` | 是否使用节点/边的几何信息(Model)来计算画布内容大小，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |






























### 坐标系 Coordinate

#### pageToLocal(...)

```sign
pageToLocal(rect: Rectangle.RectangleLike): Rectangle
pageToLocal(x: number, y: number, width: number, height: number): Rectangle
pageToLocal(p: Point.PointLike): Point
pageToLocal(x: number, y: number): Point
```

将页面坐标转换为画布本地坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

页面坐标指鼠标事件的 [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX) 和 [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY) 属性。这两个属性基于文档边缘，考虑页面水平和垂直方向滚动，例如，如果页面向右滚动 `200px` 并出现了滚动条，这部分在窗口之外，然后鼠标点击距离窗口左边 `100px` 的位置，`pageX` 所返回的值将是 `300`。

<iframe src="/demos/api/graph/coord"></iframe>

#### localToPage(...)

```sign
localToPage(rect: Rectangle.RectangleLike): Rectangle
localToPage(x: number, y: number, width: number, height: number): Rectangle
localToPage(p: Point.PointLike): Point
localToPage(x: number, y: number): Point
```

将画布本地坐标转换为页面坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

页面坐标指鼠标事件的 [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX) 和 [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY) 属性。这两个属性基于文档边缘，考虑页面水平和垂直方向滚动，例如，如果页面向右滚动 `200px` 并出现了滚动条，这部分在窗口之外，然后鼠标点击距离窗口左边 `100px` 的位置，`pageX` 所返回的值将是 `300`。

<iframe src="/demos/api/graph/coord"></iframe>

#### clientToLocal(...)

```sign
clientToLocal(rect: Rectangle.RectangleLike): Rectangle
clientToLocal(x: number, y: number, width: number, height: number): Rectangle
clientToLocal(p: Point.PointLike): Point
clientToLocal(x: number, y: number): Point
```

将页面的客户端坐标转换画布本地坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

客户端坐标指鼠标事件的 [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX) 和 [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY) 属性。例如，不论页面是否有水平滚动，当你点击客户端区域的左上角时，鼠标事件的 `clientX` 值都将为 `0`。 

<iframe src="/demos/api/graph/coord"></iframe>

#### localToClient(...)

```sign
localToClient(rect: Rectangle.RectangleLike): Rectangle
localToClient(x: number, y: number, width: number, height: number): Rectangle
localToClient(p: Point.PointLike): Point
localToClient(x: number, y: number): Point
```

将画布本地坐标转换为页面的客户端坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

客户端坐标指鼠标事件的 [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX) 和 [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY) 属性。例如，不论页面是否有水平滚动，当你点击客户端区域的左上角时，鼠标事件的 `clientX` 值都将为 `0`。 

<iframe src="/demos/api/graph/coord"></iframe>

#### localToGraph(...)

```sign
localToGraph(rect: Rectangle.RectangleLike): Rectangle
localToGraph(x: number, y: number, width: number, height: number): Rectangle
localToGraphPoint(p: Point.PointLike): Point
localToGraphPoint(x: number, y: number): Point
```

将画布本地坐标转换为画布坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

画布坐标指相对于画布左上角的坐标，不考虑画布的缩放、平移和旋转。

<iframe src="/demos/api/graph/coord"></iframe>

#### graphToLocal(...)

```sign
graphToLocal(rect: Rectangle.RectangleLike): Rectangle
graphToLocal(x: number, y: number, width: number, height: number): Rectangle
graphToLocal(p: Point.PointLike): Point
graphToLocal(x: number, y: number): Point
```

将画布坐标转换为画布本地坐标。

画布本地坐标指相对于画布并考虑画布缩放、平移和旋转的坐标。节点和画布鼠标事件回调函数参数中的 `x` 和 `y` 就是画布本地坐标。

画布坐标指相对于画布左上角的坐标，不考虑画布的缩放、平移和旋转。

<iframe src="/demos/api/graph/coord"></iframe>

#### snapToGrid(...)

```sign
snapToGrid(p: Point.PointLike): Point
snapToGrid(x: number, y: number): Point
```

将页面客户端坐标转换为画布[本地坐标](#clienttolocal)并对齐到画布网格。

























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

#### zoom(...)

```sign
zoom(): number
```

获取画布缩放比例。

```sign
zoom(factor: number, options?: ScrollerWidget.ZoomOptions): this
```

缩放画布。

<span class="tag-param">参数<span>

| 名称              | 类型            | 必选 | 默认值  | 描述                                 |
|-------------------|-----------------|:----:|---------|------------------------------------|
| factor            | number          |  ✓   |         | 缩放比例。                            |
| options.absolute  | boolean         |      | `false` | 是否为绝对缩放，                      |
| options.minScale  | number          |      | -       | 最小缩放比例。                        |
| options.maxScale  | number          |      | -       | 最大缩放比例。                        |
| options.scaleGrid | number          |      | -       | 修正缩放比例为 `scaleGrid` 的整倍数。 |
| options.center    | Point.PointLike |      | -       | 缩放中心。                            |

当 `options.absolute` 为 `true` 时，表示将画布缩放到 `factor` 代表的值，否则 `factor` 表示放大/缩小的因子，当 `factor` 为正数时表示画布放大画布，当 `factor` 为负数时表示缩小画布。

#### zoomTo(...)

```sign
zoomTo(factor: number, options?: ScrollerWidget.ZoomOptions): this
```

缩放画布到指定的比例。

<span class="tag-param">参数<span>

| 名称              | 类型            | 必选 | 默认值 | 描述                                 |
|-------------------|-----------------|:----:|--------|------------------------------------|
| factor            | number          |  ✓   |        | 缩放比例。                            |
| options.minScale  | number          |      | -      | 最小缩放比例。                        |
| options.maxScale  | number          |      | -      | 最大缩放比例。                        |
| options.scaleGrid | number          |      | -      | 修正缩放比例为 `scaleGrid` 的整倍数。 |
| options.center    | Point.PointLike |      | -      | 缩放中心。                            |


#### zoomToRect(...)

```sign
zoomToRect(rect: Rectangle.RectangleLike, options?: Options): this
```

缩放和平移画布，使 `rect` 表示的矩形区域（相对于画布坐标）充满视口。

<span class="tag-param">参数<span>

| 名称                        | 类型                    | 必选 | 默认值  | 描述                                                                                          |
|-----------------------------|-------------------------|:----:|---------|---------------------------------------------------------------------------------------------|
| rect                        | Rectangle.RectangleLike |  ✓   |         | 矩形区域。                                                                                     |
| options.padding             | number                  |      | -       | 边距。                                                                                         |
| options.contentArea         | Rectangle.RectangleLike |      | -       | 内容区域，默认获取画布内容区域。                                                                |
| options.viewportArea        | Rectangle.RectangleLike |      | -       | 视口区域，默认获取画布视口。                                                                    |
| options.scaleGrid           | number                  |      | -       | 修正缩放比例为 `scaleGrid` 的整倍数。                                                          |
| options.minScale            | number                  |      | -       | 最小缩放比例。                                                                                 |
| options.maxScale            | number                  |      | -       | 最大缩放比例。                                                                                 |
| options.minScaleX           | number                  |      | -       | X 轴方向的最小缩放比例。                                                                       |
| options.maxScaleX           | number                  |      | -       | X 轴方向的最大缩放比例。                                                                       |
| options.minScaleY           | number                  |      | -       | Y 轴方向的最小缩放比例。                                                                       |
| options.maxScaleY           | number                  |      | -       | Y 轴方向的最大缩放比例。                                                                       |
| options.preserveAspectRatio | boolean                 |      | `false` | 是否保持长宽比。                                                                               |
| options.useCellGeometry     | boolean                 |      | `false` | 是否使用节点/边的几何信息(Model)计算包围盒，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

#### zoomToFit(...)

```sign
zoomToFit(options?: Options): this
```

缩放画布内容，使画布内容充满视口。其中 `options` 选项与 [`zoomToRect(...)`](#zoomtorect) 方法的选项一致。

#### scrollToPoint(...)

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

#### scrollToContent(...)

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

#### scrollToCell(...)

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

#### center(...)

```sign
center(options?: CenterOptions): this
```

将画布中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述             |
|-------------------|-------------------|:----:|--------|----------------|
| options.padding   | number \| Padding |      |        | 边距。            |
| options.animation | object            |      |        | JQuery 动画选项。 |

#### centerPoint(...)

```sign
centerPoint(x?: number | null, y?: number | null, options?: CenterOptions): this
```

将 `x` 和 `y` 指定的点（相对于画布）与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                   |
|-------------------|-------------------|:----:|--------|----------------------|
| x                 | number            |      |        | 相对一画布的 x 轴坐标。 |
| y                 | number            |      |        | 相对一画布的 y 轴坐标。 |
| options.padding   | number \| Padding |      |        | 边距。                  |
| options.animation | object            |      |        | JQuery 动画选项。       |

<span class="tag-example">例如<span>

```ts
graph.centerPoint(100, 200)
graph.centerPoint(100, null, { padding: { left: 100 }})
graph.centerPoint(null, 200, { padding: { left: 100 }})
```

#### centerContent(...)

```sign
centerContent(options?: PositionContentOptions): this
```

将画布内容中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>


| 名称                    | 类型              | 必选 | 默认值  | 描述                                                                                            |
|-------------------------|-------------------|:----:|---------|-----------------------------------------------------------------------------------------------|
| options.padding         | number \| Padding |      | `0`     | 边距。                                                                                           |
| options.animation       | object            |      | -       | JQuery 动画选项。                                                                                |
| options.useCellGeometry | boolean           |      | `false` | 是否通过节点/边的几何信息(Model)计算内容区域，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

<span class="tag-example">例如<span>

```ts
graph.centerContent()
graph.centerContent({ padding: { left: 100 }})
```

#### centerCell(...)

```sign
centerCell(options?: CenterOptions): this
```

将节点/边的中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述             |
|-------------------|-------------------|:----:|--------|----------------|
| cell              | Cell              |  ✓   |        | 节点/边。         |
| options.padding   | number \| Padding |      | `0`    | 边距。            |
| options.animation | object            |      | -      | JQuery 动画选项。 |

<span class="tag-example">例如<span>


```ts
graph.centerCell(cell)
graph.centerCell(cell, { padding: { left: 100 }})
```

#### positionContent(...)

```sign
positionContent(pos: Position, options?: PositionContentOptions): this
```

将 `pos` 代表的画布内容 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将画布内容的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称                    | 类型              | 必选 | 默认值  | 描述                                                                                             |
|-------------------------|-------------------|:----:|---------|------------------------------------------------------------------------------------------------|
| pos                     | Position          |  ✓   |         | 对齐位置。                                                                                        |
| options.padding         | number \| Padding |      | `0`     | 边距。                                                                                            |
| options.animation       | object            |      | -       | JQuery 动画选项。                                                                                 |
| options.useCellGeometry | boolean           |      | `false` | 是否通过节点/边的几何信息(Model)计算内容区域，默认使用浏览器 API 获取每个节点和边(View)的包围盒。。 |

支持的对齐位置有：

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

#### positionCell(...)

```sign
positionCell(cell: Cell, pos: Scroller.Direction, options?: CenterOptions): this
```

将 `pos` 代表的节点/边 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将节点/边的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述             |
|-------------------|-------------------|:----:|--------|----------------|
| cell              | Cell              |  ✓   |        | 节点/边。         |
| pos               | Position          |  ✓   |        | 对齐位置。        |
| options.padding   | number \| Padding |      | `0`    | 边距。            |
| options.animation | object            |      | -      | JQuery 动画选项。 |

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

#### positionRect(...)

```sign
positionRect(rect: Rectangle.RectangleLike, pos: Scroller.Direction, options?: CenterOptions): this
```

将 `pos` 代表的矩形位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将矩形的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称              | 类型                    | 必选 | 默认值 | 描述             |
|-------------------|-------------------------|:----:|--------|----------------|
| rect              | Rectangle.RectangleLike |  ✓   |        | 矩形区域。        |
| pos               | Position                |  ✓   |        | 对齐位置。        |
| options.padding   | number \| Padding       |      |        | 边距。            |
| options.animation | object                  |      |        | JQuery 动画选项。 |

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

#### positionPoint(...)

```sign
positionPoint(point: Point.PointLike, x: number | string, y: number | string options?: CenterOptions): this
```

将 `point` 指定的点（相对于画布）与 `x` 和 `y` 代表的画布视口位置对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                          |
|-------------------|-------------------|:----:|--------|-----------------------------|
| point             | Point.PointLike   |  ✓   |        | 被对齐的点。                   |
| x                 | number \| string  |  ✓   |        | 视口 x 位置，支持百分比和负值。 |
| y                 | number \| string  |  ✓   |        | 视口 y 位置，支持百分比和负值。 |
| options.padding   | number \| Padding |      |        | 边距。                         |
| options.animation | object            |      |        | JQuery 动画选项。              |

<span class="tag-example">例如<span>

```ts
// 将画布的左上角与视口中的点 [100, 50] 对齐
graph.positionPoint({ x: 0, y: 0 }, 100, 50)

// 将画布上的点 { x: 30, y: 80 } 与离视口左侧 25% 和离视口底部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, '25%', -40)

// 将画布上的点 { x: 30, y: 80 } 与离视口右侧 25% 和离视口顶部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, '-25%', 40)
```

#### transitionToPoint(...)

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

#### transitionToRect(...)

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

#### getScrollbarPosition()

```sign
getScrollbarPosition(): {
  left: number
  top: number
}
```

获取滚动条位置。

#### setScrollbarPosition(...)

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

#### isPannable()

```sign
isPannable(): boolean
```

返回画布是否可被平移。

#### enablePanning()

```sign
enablePanning(): this
```

启用画布平移。

#### disablePanning()

```sign
disablePanning(): this
```

禁用画布平移。

#### togglePanning()

```sign
togglePanning(pannable?: boolean): this
```

切换或设置画布平移。

#### lockScroller()

```sign
lockScroller(): this
```

禁止滚动。

#### unlockScroller()

```sign
unlockScroller(): this
```

启用滚动。













































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
