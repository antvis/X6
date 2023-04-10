---
title: Transform
order: 3
redirect_from:
  - /zh/docs
  - /zh/docs/api
---

## 配置

### scaling

通过 scaling 配置画布的最小或最大缩放级别。

```ts
new Graph({
  scaling: {
    min: 0.05, // 默认值为 0.01
    max: 12, // 默认值为 16
  },
});
```

## 方法

### resize(...)

```ts
resize(width?: number, height?: number): this
```

设置容器大小，自动根据是否开启 Scroller 来设置画布或设置 Scroller 的大小。如果需要根据浏览器窗口大小动态调整画布大小，请使用此方法。

<span class="tag-param">参数<span>

| 名称   | 类型   | 必选 | 默认值 | 描述                         |
|--------|--------|:----:|--------|----------------------------|
| width  | number |      |        | 画布宽度，缺省时宽度保持不变。 |
| height | number |      |        | 画布高度，缺省时高度保持不变。 |

### scale(...) <tag color="#ff4d4f" text="Deprecated"></tag>

```ts
scale(): {
  sx: number
  sy: number
}
```

获取画布的缩放比例。

```ts
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

```ts
zoom(): number
```

获取画布缩放比例。

```ts
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

```ts
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

```ts
zoomToRect(rect: Rectangle.RectangleLike, options?: Options): this
```

缩放和平移画布，使 `rect` 表示的矩形区域（相对于画布坐标）充满视口。

<span class="tag-param">参数<span>

| 名称                        | 类型                                                                   | 必选 | 默认值  | 描述                                                                                          |
|-----------------------------|------------------------------------------------------------------------|:----:|---------|---------------------------------------------------------------------------------------------|
| rect                        | Rectangle.RectangleLike                                                |  ✓   |         | 矩形区域。                                                                                     |
| options.padding             | number \| { left: number, top: number, right: number, bottom: number } |      | -       | 边距。                                                                                         |
| options.contentArea         | Rectangle.RectangleLike                                                |      | -       | 内容区域，默认获取画布内容区域。                                                                |
| options.viewportArea        | Rectangle.RectangleLike                                                |      | -       | 视口区域，默认获取画布视口。                                                                    |
| options.scaleGrid           | number                                                                 |      | -       | 修正缩放比例为 `scaleGrid` 的整倍数。                                                          |
| options.minScale            | number                                                                 |      | -       | 最小缩放比例。                                                                                 |
| options.maxScale            | number                                                                 |      | -       | 最大缩放比例。                                                                                 |
| options.minScaleX           | number                                                                 |      | -       | X 轴方向的最小缩放比例。                                                                       |
| options.maxScaleX           | number                                                                 |      | -       | X 轴方向的最大缩放比例。                                                                       |
| options.minScaleY           | number                                                                 |      | -       | Y 轴方向的最小缩放比例。                                                                       |
| options.maxScaleY           | number                                                                 |      | -       | Y 轴方向的最大缩放比例。                                                                       |
| options.preserveAspectRatio | boolean                                                                |      | `false` | 是否保持长宽比。                                                                               |
| options.useCellGeometry     | boolean                                                                |      | `false` | 是否使用节点/边的几何信息(Model)计算包围盒，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

### zoomToFit(...)

```ts
zoomToFit(options?: Options): this
```

缩放画布内容，使画布内容充满视口。其中 `options` 选项与 [`zoomToRect(...)`](#zoomtorect) 方法的选项一致。

### rotate(...)

```ts
rotate(): {
  angle: number
  cx?: number
  cy?: number
}
```

获取画布的旋转角度和旋转中心。

```ts
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

```ts
translate(): {
  tx: number
  ty: number
}
```

获取画布的平移量。

```ts
translate(tx: number, ty: number): this
```

平移画布。

<span class="tag-param">参数<span>

| 名称 | 类型   | 必选 | 默认值 | 描述        |
|------|--------|:----:|--------|-----------|
| tx   | number |  ✓   |        | X 轴平移量。 |
| ty   | number |  ✓   |        | Y 轴平移量。 |

### fitToContent(...)

```ts
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

```ts
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

```ts
getContentArea(options?: Transform.GetContentAreaOptions): Rectangle
```

获取画布内容的矩形区域，使用[画布本地坐标](#clienttolocal)表示。

<span class="tag-param">参数<span>

| 名称                    | 类型    | 必选 | 默认值  | 描述                                                                                                  |
|-------------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------------------|
| options.useCellGeometry | boolean |      | `false` | 是否使用节点/边的几何信息(Model)来计算画布内容大小，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

### getContentBBox(...)

```ts
getContentBBox(options?: Transform.GetContentAreaOptions): Rectangle
```

获取画布内容的矩形区域，使用[画布坐标](#localtograph)表示。

<span class="tag-param">参数<span>

| 名称                    | 类型    | 必选 | 默认值  | 描述                                                                                                  |
|-------------------------|---------|:----:|---------|-----------------------------------------------------------------------------------------------------|
| options.useCellGeometry | boolean |      | `false` | 是否使用节点/边的几何信息(Model)来计算画布内容大小，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

### center(...)

```ts
center(options?: CenterOptions): this
```

将画布中心与视口中心对齐。在 `scroller` 画布中如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                            |
|-------------------|-------------------|:----:|--------|-------------------------------|
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效     |
| options.animation | object            |      | -      | 动画选项，在 scroller 画布中生效 |

### centerPoint(...)

```ts
centerPoint(x?: number | null, y?: number | null, options?: CenterOptions): this
```

将 `x` 和 `y` 指定的点（相对于画布）与视口中心对齐。在 `scroller` 画布中如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                            |
|-------------------|-------------------|:----:|--------|-------------------------------|
| x                 | number            |      | -      | 相对一画布的 x 轴坐标。          |
| y                 | number            |      | -      | 相对一画布的 y 轴坐标。          |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效     |
| options.animation | object            |      | -      | 动画选项，在 scroller 画布中生效 |

<span class="tag-example">例如<span>

```ts
graph.centerPoint(100, 200);
graph.centerPoint(100, null, { padding: { left: 100 } });
graph.centerPoint(null, 200, { padding: { left: 100 } });
```

### centerContent(...)

```ts
centerContent(options?: PositionContentOptions): this
```

将画布内容中心与视口中心对齐。如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称                    | 类型              | 必选 | 默认值  | 描述                                                                                            |
|-------------------------|-------------------|:----:|---------|-----------------------------------------------------------------------------------------------|
| options.padding         | number \| Padding |      | -       | 边距，在 scroller 画布中生效                                                                     |
| options.animation       | object            |      | -       | 动画选项，在 scroller 画布中生效                                                                 |
| options.useCellGeometry | boolean           |      | `false` | 是否通过节点/边的几何信息(Model)计算内容区域，默认使用浏览器 API 获取每个节点和边(View)的包围盒。 |

<span class="tag-example">例如<span>

```ts
graph.centerContent();
graph.centerContent({ padding: { left: 100 } });
```

### centerCell(...)

```ts
centerCell(options?: CenterOptions): this
```

将节点/边的中心与视口中心对齐。在 `scroller` 画布中如果不能通过滚动来对齐，则自动为 Scroller 的容器增加一定的 `padding` 边距来强制对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                            |
|-------------------|-------------------|:----:|--------|-------------------------------|
| cell              | Cell              |  ✓   |        | 节点/边。                        |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效     |
| options.animation | object            |      | -      | 动画选项，在 scroller 画布中生效 |

<span class="tag-example">例如<span>

```ts
graph.centerCell(cell);
graph.centerCell(cell, { padding: { left: 100 } });
```

### positionContent(...)

```ts
positionContent(pos: Position, options?: PositionContentOptions): this
```

将 `pos` 代表的画布内容 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将画布内容的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称                    | 类型              | 必选 | 默认值  | 描述                                                                                             |
|-------------------------|-------------------|:----:|---------|------------------------------------------------------------------------------------------------|
| pos                     | Position          |  ✓   |         | 对齐位置。                                                                                        |
| options.padding         | number \| Padding |      | -       | 边距，在 scroller 画布中生效                                                                      |
| options.animation       | object            |      | -       | 动画选项，在 scroller 画布中生效                                                                  |
| options.useCellGeometry | boolean           |      | `false` | 是否通过节点/边的几何信息(Model)计算内容区域，默认使用浏览器 API 获取每个节点和边(View)的包围盒。。 |

支持的对齐位置有：

```ts
type Position =
  | "center"
  | "top"
  | "top-right"
  | "top-left"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";
```

### positionCell(...)

```ts
positionCell(cell: Cell, pos: Direction, options?: CenterOptions): this
```

将 `pos` 代表的节点/边 BBox 位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将节点/边的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                            |
|-------------------|-------------------|:----:|--------|-------------------------------|
| cell              | Cell              |  ✓   |        | 节点/边。                        |
| pos               | Position          |  ✓   |        | 对齐位置。                       |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效     |
| options.animation | object            |      | -      | 动画选项，在 scroller 画布中生效 |

```ts
type Position =
  | "center"
  | "top"
  | "top-right"
  | "top-left"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";
```

### positionRect(...)

```ts
positionRect(rect: Rectangle.RectangleLike, pos: Direction, options?: CenterOptions): this
```

将 `pos` 代表的矩形位置与对应的画布视口位置对齐。如 `pos` 为 `'bottom-left'` 时，表示将矩形的左下角与视口的左下角对齐。

<span class="tag-param">参数<span>

| 名称              | 类型                    | 必选 | 默认值 | 描述                            |
|-------------------|-------------------------|:----:|--------|-------------------------------|
| rect              | Rectangle.RectangleLike |  ✓   |        | 矩形区域。                       |
| pos               | Position                |  ✓   |        | 对齐位置。                       |
| options.padding   | number \| Padding       |      | -      | 边距，在 scroller 画布中生效     |
| options.animation | object                  |      | -      | 动画选项，在 scroller 画布中生效 |

```ts
type Position =
  | "center"
  | "top"
  | "top-right"
  | "top-left"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";
```

### positionPoint(...)

```ts
positionPoint(point: Point.PointLike, x: number | string, y: number | string options?: CenterOptions): this
```

将 `point` 指定的点（相对于画布）与 `x` 和 `y` 代表的画布视口位置对齐。

<span class="tag-param">参数<span>

| 名称              | 类型              | 必选 | 默认值 | 描述                            |
|-------------------|-------------------|:----:|--------|-------------------------------|
| point             | Point.PointLike   |  ✓   |        | 被对齐的点。                     |
| x                 | number \| string  |  ✓   |        | 视口 x 位置，支持百分比和负值。   |
| y                 | number \| string  |  ✓   |        | 视口 y 位置，支持百分比和负值。   |
| options.padding   | number \| Padding |      | -      | 边距，在 scroller 画布中生效     |
| options.animation | object            |      | -      | 动画选项，在 scroller 画布中生效 |

<span class="tag-example">例如<span>

```ts
// 将画布的左上角与视口中的点 [100, 50] 对齐
graph.positionPoint({ x: 0, y: 0 }, 100, 50);

// 将画布上的点 { x: 30, y: 80 } 与离视口左侧 25% 和离视口底部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, "25%", -40);

// 将画布上的点 { x: 30, y: 80 } 与离视口右侧 25% 和离视口顶部 40px 的位置对齐
graph.positionPoint({ x: 30, y: 80 }, "-25%", 40);
```
