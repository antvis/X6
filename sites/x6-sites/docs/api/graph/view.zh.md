---
title: View
order: 13
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

### sorting

节点和边视图的排序方式。

原生 SVG 不支持 `z-index` 样式，所以我们在 x6 中通过代码的形式来支持节点和边的层级设置。创建节点和边时，可以通过 [`zIndex`](../model/cell#zindex) 选项来设置节点和边的层级；也可以拿到节点/边的实例后，通过 [`cell.setZIndex(z)`](../model/cell#setzindex)、[`cell.toFront()`](../model/cell#tofront) 和 [`cell.toBack()`](../model/cell#toback) 等方法来修改层级。

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

创建节点/边的视图，默认自动根据节点和边的 [`view`](../model/cell#view) 选项创建对应的视图。

### getHTMLComponent

```sign
(this: Graph, node: HTML) => HTMLElement | string | null | undefined
```

获取 HTML 节点的 HTML 元素，默认根据节点的 `html` 选项返回对应的 HTML 元素。更多细节请参考[使用 HTML 节点教程](../../tutorial/advanced/react#渲染-html-节点)。

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

## 方法

### isAsync()

```sign
isAsync(): boolean
```

返回画布是否是异步渲染模式。异步渲染不会阻塞 UI，对需要添加大量节点和边时的性能提升非常明显，异步画布的使用细节请参考 [`async`](#async) 选项。

### isFrozen()

```sign
isFrozen(): boolean
```

返回[异步画布](#async)是否处于冻结状态。处于冻结状态的画布不会立即响应画布中节点和边的变更，直到调用 [`unfreeze(...)`](#unfreeze) 方法来解除冻结并重新渲染画布。

### freeze(...)

```sign
freeze(options?: FreezeOptions): this
```

冻结[异步画布](#async)，处于冻结状态的画布不会立即响应画布中节点和边的变更，直到调用 [`unfreeze(...)`](#unfreeze) 方法来解除冻结并重新渲染画布。

<span class="tag-param">参数<span>

| 名称        | 类型   | 必选 | 默认值 | 描述                                                                              |
|-------------|--------|:----:|--------|---------------------------------------------------------------------------------|
| options.key | string |      | -      | 冻结状态的名称，当指定名称与当前冻结状态的名称不一致时，则不能用指定的名称冻结画布。 |

### unfreeze(...)

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

### findView(...)

```sign
findView(ref: Cell | JQuery | Element): CellView | null
```

根据节点/边或元素查找对应的视图。

### findViewByCell(...)

```sign
findViewByCell(cellId: string | number): CellView | null
findViewByCell(cell: Cell | null): CellView | null
```

根据节点/边 ID 或实例查找对应的视图。

### findViewByElem(...)

```sign
findViewByElem(elem: string | JQuery | Element | undefined | null): CellView | null
```

根据元素选择器或元素对象查找对应的视图。

### findViewsFromPoint(...)

```sign
findViewsFromPoint(x: number, y: number): CellView[]
findViewsFromPoint(p: Point.PointLike): CellView[]
```

返回节点/边的包围盒包含指定点的视图。

### findViewsInArea(...)

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

### findViews(...)

```sign
findViews(ref: Point.PointLike | Rectangle.RectangleLike): CellView[]
```

返回节点/边的包围盒包含指定的点或与指定的矩形相交的视图。

### isViewMounted(...)

```sign
isViewMounted(view: CellView): boolean
```

返回指定的视图是否已经渲染到 DOM 中。

### getMountedViews()

```sign
getMountedViews(): View[]
```

返回已经渲染到 DOM 的视图。

### getUnmountedViews()

```sign
getUnmountedViews(): View[]
```

返回还没有渲染到 DOM 的视图。