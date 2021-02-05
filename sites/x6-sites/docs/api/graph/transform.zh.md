---
title: Transform
order: 11
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

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

### resizing

缩放节点，默认禁用。开启后可以对节点进行缩放。

```ts
const graph = new Graph({
  resizing: true,
})

// 等同于
const graph = new Graph({
  resizing: {
    enabled: true,
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
每一个配置都支持函数，比如 `enabled`:

```ts
 new graph({ 
   resizing: { 
     enabled:  (this: Graph, arg: Node<Node.Properties>) => boolean 
    }
  })
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

### translating

配置节点的可移动区域，默认值为 `false`。

```ts
const graph = new Graph({
  translating: {
    restrict: true,
  }
})
```
`restrict` 支持以下几种类型：

- `boolean` 设置为 `true`，节点移动时无法超过画布区域。
- `number` 将节点限制在画布区域扩展（正数）或收缩（负数）后的范围，通常设置为负数将节点限制在离画布边缘指定大小的区域内，如设置为 `-20` 表示将节点限制在距离画布边缘 `20px` 的区域内。
- `Rectangle.RectangleLike | (arg: CellView) => Rectangle.RectangleLike` 指定节点的移动区域。

## 方法

### matrix()

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

### resize(...)

```sign
resize(width?: number, height?: number): this
```

设置容器大小，自动根据是否开启 Scroller 来设置画布或设置 Scroller 的大小。如果需要根据浏览器窗口大小动态调整画布大小，请使用此方法。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述                         |
|--------|--------|:----:|--------|----------------------------|
| width  | number |      |        | 画布宽度，缺省时宽度保持不变。 |
| height | number |      |        | 画布高度，缺省时高度保持不变。 |

### resizeGraph(...)

```sign
resizeGraph(width?: number, height?: number): this
```

设置画布大小。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述                         |
|--------|--------|:----:|--------|----------------------------|
| width  | number |      |        | 画布宽度，缺省时宽度保持不变。 |
| height | number |      |        | 画布高度，缺省时高度保持不变。 |

### resizeScroller(...)

```sign
resizeScroller(width?: number, height?: number): this
```

设置 Scroller 大小，仅在启用 Scroller 后生效。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述                         |
|--------|--------|:----:|--------|----------------------------|
| width  | number |      |        | 画布宽度，缺省时宽度保持不变。 |
| height | number |      |        | 画布高度，缺省时高度保持不变。 |

### scale(...) <tag color="#ff4d4f" text="Deprecated"></tag>

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


### zoom(...)

```sign
zoom(): number
```

获取画布缩放比例。

```sign
zoom(factor: number, options?: ZoomOptions): this
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

### zoomTo(...)

```sign
zoomTo(factor: number, options?: ZoomOptions): this
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


### zoomToRect(...)

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

### zoomToFit(...)

```sign
zoomToFit(options?: Options): this
```

缩放画布内容，使画布内容充满视口。其中 `options` 选项与 [`zoomToRect(...)`](#zoomtorect) 方法的选项一致。

### rotate(...)

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

### translate(...)

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

### fitToContent(...)

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

### scaleContentToFit(...)

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
| options.preserveAspectRatio | boolean                 |      | `true`  | 是否保持长宽比。                                                                               |
| options.useCellGeometry     | boolean                 |      | `false` | 是否使用节点/边的几何信息(Model)计算包围盒，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |


### getContentArea(...)

```sign
getContentArea(options?: Transform.GetContentAreaOptions): Rectangle
```

获取画布内容的矩形区域，使用[画布本地坐标](#clienttolocal)表示。

<span class="tag-param">参数<span>


| 名称                    | 类型    | 必选 | 默认值  | 描述                                                                                                  |
|-------------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------------------|
| options.useCellGeometry | boolean |      | `false` | 是否使用节点/边的几何信息(Model)来计算画布内容大小，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

### getContentBBox(...)

```sign
getContentBBox(options?: Transform.GetContentAreaOptions): Rectangle
```

获取画布内容的矩形区域，使用[画布坐标](#localtograph)表示。

<span class="tag-param">参数<span>


| 名称                    | 类型    | 必选 | 默认值  | 描述                                                                                                  |
|-------------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------------------|
| options.useCellGeometry | boolean |      | `false` | 是否使用节点/边的几何信息(Model)来计算画布内容大小，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |


### center(...)

```sign
center(options?: CenterOptions): this
```

将画布中心与视口中心对齐。在 `scroller` 画布中如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                                   |
|-------------------|-------------------|:----:|--------|--------------------------------------|
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效            |
| options.animation | object            |      | -      | JQuery 动画选项，在 scroller 画布中生效 |

### centerPoint(...)

```sign
centerPoint(x?: number | null, y?: number | null, options?: CenterOptions): this
```

将 `x` 和 `y` 指定的点（相对于画布）与视口中心对齐。在 `scroller` 画布中如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                                   |
|-------------------|-------------------|:----:|--------|--------------------------------------|
| x                 | number            |      | -      | 相对一画布的 x 轴坐标。                 |
| y                 | number            |      | -      | 相对一画布的 y 轴坐标。                 |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效            |
| options.animation | object            |      | -      | JQuery 动画选项，在 scroller 画布中生效 |

<span class="tag-example">例如<span>

```ts
graph.centerPoint(100, 200)
graph.centerPoint(100, null, { padding: { left: 100 }})
graph.centerPoint(null, 200, { padding: { left: 100 }})
```

### centerContent(...)

```sign
centerContent(options?: PositionContentOptions): this
```

将画布内容中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>


| 名称                    | 类型              | 必选 | 默认值  | 描述                                                                                            |
|-------------------------|-------------------|:----:|---------|-----------------------------------------------------------------------------------------------|
| options.padding         | number \| Padding |      | -       | 边距，在 scroller 画布中生效                                                                     |
| options.animation       | object            |      | -       | JQuery 动画选项，在 scroller 画布中生效                                                          |
| options.useCellGeometry | boolean           |      | `false` | 是否通过节点/边的几何信息(Model)计算内容区域，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

<span class="tag-example">例如<span>

```ts
graph.centerContent()
graph.centerContent({ padding: { left: 100 }})
```

### centerCell(...)

```sign
centerCell(options?: CenterOptions): this
```

将节点/边的中心与视口中心对齐。在 `scroller` 画布中如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                                   |
|-------------------|-------------------|:----:|--------|--------------------------------------|
| cell              | Cell              |  ✓   |        | 节点/边。                               |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效            |
| options.animation | object            |      | -      | JQuery 动画选项，在 scroller 画布中生效 |

<span class="tag-example">例如<span>


```ts
graph.centerCell(cell)
graph.centerCell(cell, { padding: { left: 100 }})
```

### positionContent(...)

```sign
positionContent(pos: Position, options?: PositionContentOptions): this
```

将 `pos` 代表的画布内容 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将画布内容的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称                    | 类型              | 必选 | 默认值  | 描述                                                                                             |
|-------------------------|-------------------|:----:|---------|------------------------------------------------------------------------------------------------|
| pos                     | Position          |  ✓   |         | 对齐位置。                                                                                        |
| options.padding         | number \| Padding |      | -       | 边距，在 scroller 画布中生效                                                                      |
| options.animation       | object            |      | -       | JQuery 动画选项，在 scroller 画布中生效                                                           |
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

### positionCell(...)

```sign
positionCell(cell: Cell, pos: Direction, options?: CenterOptions): this
```

将 `pos` 代表的节点/边 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将节点/边的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                                   |
|-------------------|-------------------|:----:|--------|--------------------------------------|
| cell              | Cell              |  ✓   |        | 节点/边。                               |
| pos               | Position          |  ✓   |        | 对齐位置。                              |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效            |
| options.animation | object            |      | -      | JQuery 动画选项，在 scroller 画布中生效 |

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

### positionRect(...)

```sign
positionRect(rect: Rectangle.RectangleLike, pos: Direction, options?: CenterOptions): this
```

将 `pos` 代表的矩形位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将矩形的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称              | 类型                    | 必选 | 默认值 | 描述                                   |
|-------------------|-------------------------|:----:|--------|--------------------------------------|
| rect              | Rectangle.RectangleLike |  ✓   |        | 矩形区域。                              |
| pos               | Position                |  ✓   |        | 对齐位置。                              |
| options.padding   | number \| Padding       |      | -      | 边距，在 scroller 画布中生效            |
| options.animation | object                  |      | -      | JQuery 动画选项，在 scroller 画布中生效 |

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

### positionPoint(...)

```sign
positionPoint(point: Point.PointLike, x: number | string, y: number | string options?: CenterOptions): this
```

将 `point` 指定的点（相对于画布）与 `x` 和 `y` 代表的画布视口位置对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                                   |
|-------------------|-------------------|:----:|--------|--------------------------------------|
| point             | Point.PointLike   |  ✓   |        | 被对齐的点。                            |
| x                 | number \| string  |  ✓   |        | 视口 x 位置，支持百分比和负值。          |
| y                 | number \| string  |  ✓   |        | 视口 y 位置，支持百分比和负值。          |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效            |
| options.animation | object            |      | -      | JQuery 动画选项，在 scroller 画布中生效 |

<span class="tag-example">例如<span>

```ts
// 将画布的左上角与视口中的点 [100, 50] 对齐
graph.positionPoint({ x: 0, y: 0 }, 100, 50)

// 将画布上的点 { x: 30, y: 80 } 与离视口左侧 25% 和离视口底部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, '25%', -40)

// 将画布上的点 { x: 30, y: 80 } 与离视口右侧 25% 和离视口顶部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, '-25%', 40)
```
