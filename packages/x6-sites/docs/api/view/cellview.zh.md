---
title: CellView
order: 1
redirect_from:
  - /zh/docs
  - /zh/docs/api
  - /zh/docs/api/view
---

节点和边视图的基类，继承自 [View](./view)。

## constructor

```sign
constructor(cell: Cell, options?: CellView.Options): CellView
```

创建一个节点和边视图的实例。

<span class="tag-param">参数<span>

| 参数名                 | 类型                            | 默认值 | 必选 | 描述                                  |
|------------------------|---------------------------------|--------|:----:|-------------------------------------|
| cell                   | Cell                            |        |  ✔️  | 节点或边。                             |
| options.priority       | number                          |        |      | 视图更新的优先级。                     |
| options.isSvgElement   | boolean                         |        |      | 容器元素是否是 SVG 元素。              |
| options.rootSelector   | string                          |        |      | 容器元素的选择器。                     |
| options.bootstrap      | FlagManager.Actions             |        |      | 视图初始化后执行的动作。               |
| options.actions        | KeyValue\<FlagManager.Actions\> |        |      | 视图关联的 Cell 发生变化时对应的动作。 |
| options.events         | View.Events                     |        |      | 代理/绑定到容器元素的事件。            |
| options.documentEvents | View.Events                     |        |      | 代理/绑定到 Document 的事件。          |
| options.interacting    | Interacting                     |        |      | 视图的交互设置。                       |

## prototype

### isNodeView()

```sign
isNodeView(): boolean
```

返回该视图是否是节点视图。默认返回 `false`。

### isEdgeView()

```sign
isEdgeView(): boolean
```

返回该视图是否是边视图。默认返回 `false`。

### getBBox(...)

```sign
getBBox(options?: { useCellGeometry?: boolean }): Rectangle
```

返回容器渲染到画布后的包围盒，当 `options.useCellGeometry` 为 `true` 时直接返回节点的大小和位置确定的矩形。

### highlight(...)

```sign
highlight(elem?: Element | null, options?: CellView.HighlightOptions): this
```

<span class="tag-param">参数<span>

| 参数名              | 类型                                     | 默认值           | 必选 | 描述                              |
|---------------------|------------------------------------------|------------------|:----:|---------------------------------|
| elem                | Element \| null                          | `this.container` |      | 被高亮的元素，默认为节点/边的容器。 |
| options.highlighter | string \| { name: string; args: object } |                  |      | 用指定的高亮器来高亮元素。         |

高亮指定的元素。

支持的 `options.highlighter` 有：

- [stroke](../registry/highlighter#stroke) 
- [className](../registry/highlighter#classname)

### unhighlight(...)

```sign
unhighlight(elem?: Element | null, options?: CellView.HighlightOptions): this
```

取消高亮指定的元素，参数同 [`highlight(...)`](#highlight) 方法。

### can(...)

```sign
can(feature: CellView.InteractionNames): boolean
```

返回视图是否具备某种交互行为。

### setInteracting(...)

```sign
setInteracting(interacting: CellView.Interacting): this
```

设置视图的交互行为。



