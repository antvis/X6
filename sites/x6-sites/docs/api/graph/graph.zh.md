---
title: Graph
order: 0
redirect_from:
  + /zh/docs
  + /zh/docs/api
  + /zh/docs/api/graph
---

## 配置

```sign
new Graph(options: Options)
```

| 选项                                                                           | 类型                           | 必选 | 默认值                                            | 描述                                                                                              |
| ------------------------------------------------------------------------------ | ------------------------------ | :--: | ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| containers                                                             | HTMLElement                    |  ✓   |                                                   | 画布的容器。                                                                                      |
| width                                                                | number                         |      | - | 画布宽度，默认使用容器宽度。                                                                      |
| height                                                              | number                         |      | - | 画布高度，默认使用容器高度。                                                                      |
| scaling                                    | { min?: number, max?: number } |      | { min: 0.01, max: 16 } | 画布的最小最大缩放级别。                                                                     |
| [autoResize](/zh/docs/tutorial/basic/graph#画布大小)                                                      | boolean \| Element \| Document |      | `false` | 是否监听容器大小改变，并自动更新画布大小。 |
| [panning](/zh/docs/api/graph/panning)                                          | boolean \| `PanningManager.Options` |      | `false` | 画布是否可以拖拽平移，默认禁用。                                                                                  |
| [mousewheel](/zh/docs/api/graph/mousewheel)                                    | boolean \| `MouseWheel.Options` |      | `false` | 鼠标滚轮缩放，默认禁用。                                                                          |
| [grid](/zh/docs/api/graph/grid)                                                | boolean \| number \| `GridManager.Options` |      | `false` | 网格，默认使用 `10px` 的网格，但不绘制网格背景。                                                  |
| [background](/zh/docs/api/graph/background)                                    | false \| `BackgroundManager.Options` |      | `false` | 背景，默认不绘制背景。                                                                            |
| [translating](/zh/docs/api/interacting/interaction#trasnlating)                        | `Translating.Options` |      | { restrict: false }                                            | 限制节点移动。                                                                                        |
| [embedding](/zh/docs/api/interacting/interaction#embedding)                          | boolean \| `Embedding.Options` |      | `false` | 嵌套节点，默认禁用。                                                                              |
| [connecting](/zh/docs/api/interacting/interaction#connecting)                        | `Connecting.Options` |      | { snap: false, ... } | 连线选项。                                                                                        |
| [highlighting](/zh/docs/api/interacting/interaction#highlighting)                    | `Highlighting.Options` |      | {...}                                            | 高亮选项。                                                                                        |
| [interacting](/zh/docs/api/interacting/interaction#interacting)                      | `Interacting.Options` |      | { edgeLabelMovable: false } | 定制节点和边的交互行为。                                                                          |
| [magnetThreshold](/zh/docs/api/graph/view#magnetthreshold)                     | number \| 'onleave'            |      | `0` | 鼠标移动多少次后才触发连线，或者设置为 `'onleave'` 时表示鼠标移出元素时才触发连线。               |
| [moveThreshold](/zh/docs/api/graph/view#movethreshold)                         | number                         |      | `0` | 触发 `'mousemove'` 事件之前，允许鼠标移动的次数。                                                 |
| [clickThreshold](/zh/docs/api/graph/view#clickthreshold)                       | number                         |      | `0` | 当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件。                                            |
| [preventDefaultContextMenu](/zh/docs/api/graph/view#preventdefaultcontextmenu) | boolean                        |      | `true` | 是否禁用浏览器默认右键菜单。                                                                      |
| [preventDefaultBlankAction](/zh/docs/api/graph/view#preventdefaultblankaction) | boolean                        |      | `true` | 在画布空白位置响应鼠标事件时，是否禁用鼠标默认行为。                                              |
| [async](/zh/docs/api/graph/view#async)                                         | boolean                        |      | `true` | 是否异步渲染                                                                                      |
| [virtual](/zh/docs/api/graph/view#virtual)                                     | boolean                        |      | `false` | 是否只渲染可视区域内容                                                                            |
| [onPortRendered](/zh/docs/api/graph/view#onportrendered)                                     | (args: OnPortRenderedArgs) => void                        |      | - | 当某个连接桩渲染完成时触发的回调。                                                                            |
| [onEdgeLabelRendered](/zh/docs/api/graph/view#onedgelabelrendered)                                     | (args: OnEdgeLabelRenderedArgs) => void                        |      | - | 当边的文本标签渲染完成时触发的回调。                                                                            |
| [createCellView](/zh/docs/api/graph/view#createcellview)                                     | (this: Graph, cell: Cell) => CellView \| null \| undefined                        |      | - | 是自定义元素的视图。                                                                          |
