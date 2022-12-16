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

| 选项                                                                           | 类型                           | 必选 | 默认值                                            | 描述                                                                                              |
| ------------------------------------------------------------------------------ | ------------------------------ | :--: | ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [container](#container)                                                        | HTMLElement                    |  ✓   |                                                   | 画布的容器。                                                                                      |
| [width](#width)                                                                | number                         |      | `undefined`                                       | 画布宽度，默认使用容器宽度。                                                                      |
| [height](#height)                                                              | number                         |      | `undefined`                                       | 画布高度，默认使用容器高度。                                                                      |
| [autoResize](#autoresize)                                                      | boolean \| Element \| Document |      | `false`                                           | 是否监听容器大小改变，并自动更新画布大小。默认监听画布容器，也可以指定监听的元素，如 `Document`。 |
| [panning](/zh/docs/api/graph/panning)                                          | object                         |      | { enabled: false, eventTypes: ['leftMouseDown'],} | 画布是否可以拖动                                                                                  |
| [grid](/zh/docs/api/graph/grid)                                                | boolean \| number \| object    |      | `false`                                           | 网格，默认使用 `10px` 的网格，但不绘制网格背景。                                                  |
| [background](/zh/docs/api/graph/background)                                    | false \| object                |      | `false`                                           | 背景，默认不绘制背景。                                                                            |
| [mousewheel](/zh/docs/api/graph/mousewheel)                                    | boolean \| object              |      | `false`                                           | 鼠标滚轮缩放，默认禁用。                                                                          |
| [translating](/zh/docs/api/graph/transform#translating)                        | object                         |      | object                                            | 平移节点。                                                                                        |
| [embedding](/zh/docs/api/graph/interaction#embedding)                          | boolean \| object              |      | `false`                                           | 嵌套节点，默认禁用。                                                                              |
| [connecting](/zh/docs/api/graph/interaction#connecting)                        | object                         |      | object                                            | 连线选项。                                                                                        |
| [highlighting](/zh/docs/api/graph/interaction#highlighting)                    | object                         |      | object                                            | 高亮选项。                                                                                        |
| [interacting](/zh/docs/api/graph/interaction#interacting)                      | object \| function             |      | `{ edgeLabelMovable: false }`                     | 定制节点和边的交互行为。                                                                          |
| [magnetThreshold](/zh/docs/api/graph/view#magnetThreshold)                     | number \| 'onleave'            |      | `0`                                               | 鼠标移动多少次后才触发连线，或者设置为 `'onleave'` 时表示鼠标移出元素时才触发连线。               |
| [moveThreshold](/zh/docs/api/graph/view#moveThreshold)                         | number                         |      | `0`                                               | 触发 `'mousemove'` 事件之前，允许鼠标移动的次数。                                                 |
| [clickThreshold](/zh/docs/api/graph/view#clickThreshold)                       | number                         |      | `0`                                               | 当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件。                                            |
| [preventDefaultContextMenu](/zh/docs/api/graph/view#preventDefaultContextMenu) | boolean                        |      | `true`                                            | 是否禁用浏览器默认右键菜单。                                                                      |
| [preventDefaultBlankAction](/zh/docs/api/graph/view#preventDefaultBlankAction) | boolean                        |      | `true`                                            | 在画布空白位置响应鼠标事件时，是否禁用鼠标默认行为。                                              |
| [guard](/zh/docs/api/graph/view#guard)                                         | function                       |      | `() => false`                                     | 返回是否应该忽略某个鼠标事件，返回 `true` 时忽略指定的鼠标事件。                                  |
| [async](/zh/docs/api/graph/view#async)                                         | boolean                        |      | `true`                                            | 是否异步渲染                                                                                      |
| [virtual](/zh/docs/api/graph/view#virtual)                                     | boolean                        |      | `false`                                           | 是否只渲染可视区域内容                                                                            |
