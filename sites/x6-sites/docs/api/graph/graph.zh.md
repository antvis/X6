---
title: Graph
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/graph
---

## 配置

```sign
new Graph(options: Options)
```

| 选项                                                    | 类型                          | 必选 | 默认值                        | 描述                                                                                     |
|---------------------------------------------------------|-------------------------------|:----:|-------------------------------|----------------------------------------------------------------------------------------|
| [container](#container)                                 | HTMLElement                   |  ✓   |                               | 画布的容器。
| [width](#width)                                         | number                        |      | `undefined`                   | 画布宽度，默认使用容器宽度。                                                               |
| [height](#height)                                       | number                        |      | `undefined`                   | 画布高度，默认使用容器高度。                                                       |                                                              |
| [autoResize](#autoresize)                                         | boolean \| Element \| Document                       |      | `false`                   | 是否监听容器大小改变，并自动更新画布大小。默认监听画布容器，也可以指定监听的元素，如 `Docuemnt`。                                                               |
| [grid](/zh/docs/api/graph/grid)                                           | boolean \| number \| object   |      | `false`                       | 网格，默认使用 `10px` 的网格，但不绘制网格背景。                                            |
| [background](/zh/docs/api/graph/background)                               | false \| object               |      | `false`                       | 背景，默认不绘制背景。                                                                     |
| [snapline](/zh/docs/api/graph/snapline)                                   | boolean \| object             |      | `false`                       | 对齐线，默认禁用。                                                                         |
| [scroller](/zh/docs/api/graph/scroller)                                   | boolean \| object             |      | `false`                       | 滚动画布，默认禁用。                                                                       |
| [minimap](/zh/docs/api/graph/minimap)                                     | boolean \| object             |      | `false`                       | 小地图，默认禁用。                                                                         |
| [history](/zh/docs/api/graph/history)                                     | boolean \| object             |      | `false`                       | 撤销/重做，默认禁用。                                                                      |
| [clipboard](/zh/docs/api/graph/clipboard)                                 | boolean \| object             |      | `false`                       | 剪切板，默认禁用。                                                                         |
| [keyboard](/zh/docs/api/graph/keyboard)                                   | boolean \| object             |      | `false`                       | 键盘快捷键，默认禁用。                                                                     |
| [mousewheel](/zh/docs/api/graph/mousewheel)                               | boolean \| object             |      | `false`                       | 鼠标滚轮缩放，默认禁用。                                                                   |
| [selecting](/zh/docs/api/graph/selecting)                                 | boolean \| object             |      | `false`                       | 点选/框选，默认禁用。                                                                      |
| [rotating](/zh/docs/api/graph/transform#rotating)                                   | boolean \| object             |      | `false`                       | 旋转节点，默认禁用。                                                                       |
| [resizing](/zh/docs/api/graph/transform#resizing)                                   | boolean \| object             |      | `false`                       | 缩放节点，默认禁用。                                                                       |
| [translating](/zh/docs/api/graph/transform#translating)                             | object                        |      | object                        | 平移节点。                                                                                |
| [transforming](/zh/docs/api/graph/transform#transforming)                           | object                        |      | object                        | 平移和缩放节点的基础选项。                                                                |
| [embedding](/zh/docs/api/graph/interaction#embedding)                                 | boolean \| object             |      | `false`                       | 嵌套节点，默认禁用。                                                                       |
| [connecting](/zh/docs/api/graph/interaction#connecting)                               | object                        |      | object                        | 连线选项。                                                                                |
| [highlighting](/zh/docs/api/graph/interaction#highlighting)                           | object                        |      | object                        | 高亮选项。                                                                                |
| [interacting](/zh/docs/api/graph/interaction#interacting)                             | object \| function            |      | `{ edgeLabelMovable: false }` | 定制节点和边的交互行为。                                                                  |
| [sorting](/zh/docs/api/graph/view#sorting)                                     | 'none' \| 'approx' \| 'exact' |      | `'exact'`                     | 节点和边视图的排序方式。                                                                  |
| [async](/zh/docs/api/graph/view#async)                                         | boolean                       |      | `false`                       | 是否是异步渲染的画布。                                                                    |
| [frozen](/zh/docs/api/graph/view#frozen)                                       | boolean                       |      | `false`                       | 异步渲染的画布是否处于冻结状态。                                                          |
| [checkView](/zh/docs/api/graph/view#checkView)                                 | function                      |      | -                             | 返回指定的视图是否应该渲染到 DOM 中。                                                     |
| [magnetThreshold](/zh/docs/api/graph/view#magnetThreshold)                     | number \| 'onleave'           |      | `0`                           | 鼠标移动多少次后才触发连线，或者设置为 `'onleave'` 时表示鼠标移出元素时才触发连线。        |
| [moveThreshold](/zh/docs/api/graph/view#moveThreshold)                         | number                        |      | `0`                           | 触发 `'mousemove'` 事件之前，允许鼠标移动的次数。                                          |
| [clickThreshold](/zh/docs/api/graph/view#clickThreshold)                       | number                        |      | `0`                           | 当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件。                                     |
| [preventDefaultContextMenu](/zh/docs/api/graph/view#preventDefaultContextMenu) | boolean                       |      | `true`                        | 是否禁用浏览器默认右键菜单。                                                              |
| [preventDefaultBlankAction](/zh/docs/api/graph/view#preventDefaultBlankAction) | boolean                       |      | `true`                        | 在画布空白位置响应鼠标事件时，是否禁用鼠标默认行为。                                       |
| [guard](/zh/docs/api/graph/view#guard)                                         | function                      |      | `() => false`                 | 返回是否应该忽略某个鼠标事件，返回 `true` 时忽略指定的鼠标事件。                           |
| [allowRubberband](/zh/docs/api/graph/view#allowRubberband)                     | function                      |      | `() => true`                  | 返回是否响应框选事件。                                                                    |
| [allowPanning](/zh/docs/api/graph/view#allowPanning)                           | function                      |      | `() => true`                  | 返回是否响应画布平移事件。                                                               |
| [getCellView](/zh/docs/api/graph/view#getCellView)                             | function                      |      | `() => null`                  | 获取节点/边的视图类。                                                                     |
| [createCellView](/zh/docs/api/graph/view#createCellView)                       | function                      |      | `undefined`                   | 创建节点/边的视图，默认自动根据节点和边的 [`view`](/zh/docs/api/model/cell#view) 选项创建对应的视图。 |
| [getHTMLComponent](/zh/docs/api/graph/view#getHTMLComponent)                   | function                      |      | `undefined`                   | 获取 HTML 节点的 HTML 元素，默认根据节点的 `html` 选项返回对应的 HTML 元素。               |
| [onPortRendered](/zh/docs/api/graph/view#onPortRendered)                       | function                      |      | `undefined`                   | 当某个链接桩渲染完成时触发的回调。                                                        |
| [onEdgeLabelRendered](/zh/docs/api/graph/view#onEdgeLabelRendered)             | function                      |      | `undefined`                   | 当边的文本标签渲染完成时触发的回调。                                                      |
| [onToolItemCreated](/zh/docs/api/graph/view#onToolItemCreated)                 | function                      |      | `undefined`                   | 当工具项渲染完成时触发的回调。
| [model](/zh/docs/api/graph/model)                                         | Model                         |      | `undefined`                   | 画布对应的模型，默认创建一个新模型。

### container

画布容器。

### width

画布宽度，默认使用容器宽度。创建画布后可以使用 [`resize(w, h)`](#resize) 方法来设置画布大小。

### height

画布高度，默认使用容器高度。 创建画布后可以使用 [`resize(w, h)`](#resize) 方法来设置画布大小。

### autoResize

是否监听容器大小改变，并自动更新画布大小，默认为 `false`。默认监听画布容器，也可以指定监听的元素，如 `Docuemnt`。

需要注意的是，目前仅支持 flex 布局，例如像下面这样指定画布容器及其父节点的样式：

```html
<div style="display: flex">
  <div id="container" style="flex: 1"></div>
</div>
```

使用上面 `"container"` 容器和 `autoResize` 选项初始化画布：

```ts
const graph = new Graph({
  container: document.getElementById('container'),
  autoResize: true,
})
```

拖动下面 DEMO 中的分隔条体验自动调整画布大小。

<iframe src="/demos/api/graph/auto-resize"></iframe>



## 方法

### startBatch(...)

```sign
startBatch(name: string, data?: KeyValue): this
```

开始一个指定名称事务。开始和结束事务必须成对使用，一个事务结束前的所有变更都归属于该事务。

<span class="tag-param">参数<span>

| 名称 | 类型     | 必选 | 默认值 | 描述                           |
|------|----------|:----:|--------|------------------------------|
| name | string   |  ✓   |        | 事务名称。                      |
| data | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

### stopBatch(...)

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

### batchUpdate(...)

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

```sign
batchUpdate<T>(execute: () => T, data?: KeyValue): T
```

执行一个成对的事务。事务名为 `'update'`。

<span class="tag-param">参数<span>

| 名称    | 类型     | 必选 | 默认值 | 描述                           |
|---------|----------|:----:|--------|------------------------------|
| execute | () => T  |  ✓   |        | 事务执行的函数。                |
| data    | KeyValue |      |        | 额外的数据，供事件回调函数使用。 |

<span class="tag-example">用法</span>

```ts
graph.batchUpdate(() => {
  rect.prop('zIndex', 10)
  rect.attr('label/text', 'hello')
  rect.attr('label/fill', '#ff0000')  
})
```
