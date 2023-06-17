---
title: 画布
order: 0
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/graph
---

## 配置

```ts
new Graph(options: Options)
```

| 选项 | 类型 | 必选 | 描述 | 默认值 |
| --- | --- | :-: | --- | --- |
| containers | `HTMLElement` | ✓ | 画布的容器。 |  |
| width | `number` |  | 画布宽度，默认使用容器宽度。 | - |
| height | `number` |  | 画布高度，默认使用容器高度。 | - |
| scaling | `{ min?: number, max?: number }` |  | 画布的最小最大缩放级别。 | `{ min: 0.01, max: 16 }` |
| [autoResize](/zh/docs/tutorial/basic/graph#画布大小) | `boolean \| Element \| Document` |  | 是否监听容器大小改变，并自动更新画布大小。 | `false` |
| [panning](/zh/docs/api/graph/panning) | `boolean \| PanningManager.Options` |  | 画布是否可以拖拽平移，默认禁用。 | `false` |
| [mousewheel](/zh/docs/api/graph/mousewheel) | `boolean \| MouseWheel.Options` |  | 鼠标滚轮缩放，默认禁用。 | `false` |
| [grid](/zh/docs/api/graph/grid) | `boolean \| number \| GridManager.Options` |  | 网格，默认使用 `10px` 的网格，但不绘制网格背景。 | `false` |
| [background](/zh/docs/api/graph/background) | `false \| BackgroundManager.Options` |  | 背景，默认不绘制背景。 | `false` |
| [translating](/zh/docs/api/interacting/interaction#移动范围) | `Translating.Options` |  | 限制节点移动。 | `{ restrict: false }` |
| [embedding](/zh/docs/api/interacting/interaction#组合) | `boolean \| Embedding.Options` |  | 嵌套节点，默认禁用。 | `false` |
| [connecting](/zh/docs/api/interacting/interaction#connecting) | `Connecting.Options` |  | 连线选项。 | `{ snap: false, ... }` |
| [highlighting](/zh/docs/api/interacting/interaction#高亮) | `Highlighting.Options` |  | 高亮选项。 | `{...}` |
| [interacting](/zh/docs/api/interacting/interaction#限制) | `Interacting.Options` |  | 定制节点和边的交互行为。 | `{ edgeLabelMovable: false }` |
| [magnetThreshold](/zh/docs/api/graph/view#magnetthreshold) | `number \| onleave` |  | 鼠标移动多少次后才触发连线，或者设置为 `onleave` 时表示鼠标移出元素时才触发连线。 | `0` |
| [moveThreshold](/zh/docs/api/graph/view#movethreshold) | `number` |  | 触发 `mousemove` 事件之前，允许鼠标移动的次数。 | `0` |
| [clickThreshold](/zh/docs/api/graph/view#clickthreshold) | `number` |  | 当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件。 | `0` |
| [preventDefaultContextMenu](/zh/docs/api/graph/view#preventdefaultcontextmenu) | `boolean` |  | 是否禁用浏览器默认右键菜单。 | `true` |
| [preventDefaultBlankAction](/zh/docs/api/graph/view#preventdefaultblankaction) | `boolean` |  | 在画布空白位置响应鼠标事件时，是否禁用鼠标默认行为。 | `true` |
| [async](/zh/docs/api/graph/view#async) | `boolean` |  | 是否异步渲染 | `true` |
| [virtual](/zh/docs/api/graph/view#virtual) | `boolean` |  | 是否只渲染可视区域内容 | `false` |
| [onPortRendered](/zh/docs/api/graph/view#onportrendered) | `(args: OnPortRenderedArgs) => void` |  | 当某个连接桩渲染完成时触发的回调。 | - |
| [onEdgeLabelRendered](/zh/docs/api/graph/view#onedgelabelrendered) | `(args: OnEdgeLabelRenderedArgs) => void` |  | 当边的文本标签渲染完成时触发的回调。 | - |
| [createCellView](/zh/docs/api/graph/view#createcellview) | `(cell: Cell) => CellView \| null \| undefined` |  | 是自定义元素的视图。 | - |
