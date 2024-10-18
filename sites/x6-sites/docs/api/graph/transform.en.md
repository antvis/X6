---
title: Viewport Transformation
order: 6
redirect_from:
  - /en/docs
  - /en/docs/api
  - /en/docs/api/graph
---

## Configuration

### scaling

Configure the minimum or maximum zoom level of the canvas through the scaling configuration.

```ts
new Graph({
  scaling: {
    min: 0.05, // default value is 0.01
    max: 12, // default value is 16
  },
})
```

## Methods

### resize(...)

```ts
resize(width?: number, height?: number): this
```

Set the canvas size.

| Name   | Type   | Required | Default Value | Description                           |
| ------ | ------ | :--: | ------ | ------------------------------ |
| width  | number |      |        | Canvas width, remains unchanged if not provided. |
| height | number |      |        | Canvas height, remains unchanged if not provided. |

### zoom(...)

```ts
zoom(): number
```

Get the canvas zoom ratio.

```ts
zoom(factor: number, options?: ZoomOptions): this
```

Zoom the canvas.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| factor | number | ✓ |  | Zoom ratio. |
| options.absolute | boolean |  | `false` | Whether to zoom absolutely. |
| options.minScale | number |  | - | Minimum zoom ratio. |
| options.maxScale | number |  | - | Maximum zoom ratio. |
| options.scaleGrid | number |  | - | Correct the zoom ratio to be an integer multiple of `scaleGrid`. |
| options.center | Point.PointLike |  | - | Zoom center. |

When `options.absolute` is `true`, it means zooming the canvas to the value represented by `factor`. Otherwise, `factor` represents the zoom-in or zoom-out factor. When `factor` is a positive number, it means zooming in, and when it's a negative number, it means zooming out.

### zoomTo(...)

```ts
zoomTo(factor: number, options?: ZoomOptions): this
```

Zoom the canvas to a specified ratio.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| factor | number | ✓ |  | Zoom ratio. |
| options.minScale | number |  | - | Minimum zoom ratio. |
| options.maxScale | number |  | - | Maximum zoom ratio. |
| options.scaleGrid | number |  | - | Correct the zoom ratio to be an integer multiple of `scaleGrid`. |
| options.center | Point.PointLike |  | - | Zoom center. |

### zoomToFit(...)

```ts
zoomToFit(options?: Options): this
```

Zoom the canvas content to fit the viewport.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| rect | Rectangle.RectangleLike | ✓ |  | Rectangle area. |
| options.padding | number \| `{ left: number, top: number, right: number, bottom: number }` |  | - | Margin. |
| options.contentArea | Rectangle.RectangleLike |  | - | Content area, defaults to getting the canvas content area. |
| options.viewportArea | Rectangle.RectangleLike |  | - | Viewport area, defaults to getting the canvas viewport. |
| options.scaleGrid | number |  | - | Correct the zoom ratio to be an integer multiple of `scaleGrid`. |
| options.minScale | number |  | - | Minimum zoom ratio. |
| options.maxScale | number |  | - | Maximum zoom ratio. |
| options.minScaleX | number |  | - | Minimum zoom ratio in the X-axis direction. |
| options.maxScaleX | number |  | - | Maximum zoom ratio in the X-axis direction. |
| options.minScaleY | number |  | - | Minimum zoom ratio in the Y-axis direction. |
| options.maxScaleY | number |  | - | Maximum zoom ratio in the Y-axis direction. |
| options.preserveAspectRatio | boolean |  | `false` | Whether to preserve the aspect ratio. |
| options.useCellGeometry | boolean |  | `true` | Whether to use node/edge geometry information (Model) to calculate the bounding box. |

### rotate(...)

```ts
rotate(): {
  angle: number
  cx?: number
  cy?: number
}
```

Get the canvas rotation angle and center.

```ts
rotate(angle: number, cx?: number, cy?: number): this
```

Rotate the canvas.

| Name  | Type   | Required | Default Value | Description                                |
| ----- | ------ | :--: | ------ | ----------------------------------- |
| angle | number |  ✓   |        | Rotation angle.                          |
| cx    | number |      | -      | Rotation center x-coordinate, defaults to the canvas center. |
| cy    | number |      | -      | Rotation center y-coordinate, defaults to the canvas center. |

### translate(...)

```ts
translate(): {
  tx: number
  ty: number
}
```

Get the canvas translation.

```ts
translate(tx: number, ty: number): this
```

Translate the canvas.

| Name | Type   | Required | Default Value | Description         |
| ---- | ------ | :--: | ------ | ------------ |
| tx   | number |  ✓   |        | X-axis translation. |
| ty   | number |  ✓   |        | Y-axis translation. |

### getContentArea(...)

```ts
getContentArea(options?: Transform.GetContentAreaOptions): Rectangle
```

Get the bounding box of the canvas content, represented in local coordinates.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| options.useCellGeometry | boolean |  | `true` | Whether to use node/edge geometry information (Model) to calculate the content size. |

### getContentBBox(...)

```ts
getContentBBox(options?: Transform.GetContentAreaOptions): Rectangle
```

Get the bounding box of the canvas content, represented in graph coordinates.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| options.useCellGeometry | boolean |  | `true` | Whether to use node/edge geometry information (Model) to calculate the content size. |

### center(...)

```ts
center(options?: CenterOptions): this
```

Align the canvas center with the viewport center.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |

### centerPoint(...)

```ts
centerPoint(x?: number | null, y?: number | null, options?: CenterOptions): this
```

Align the point `(x, y)` (relative to the canvas) with the viewport center.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| x | number |  | - | X-coordinate relative to the canvas. |
| y | number |  | - | Y-coordinate relative to the canvas. |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |

```ts
graph.centerPoint(100, 200)
graph.centerPoint(100, null, { padding: { left: 100 } })
graph.centerPoint(null, 200, { padding: { left: 100 } })
```

### centerContent(...)

```ts
centerContent(options?: PositionContentOptions): this
```

Align the canvas content center with the viewport center.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |
| options.useCellGeometry | boolean |  | `true` | Whether to use node/edge geometry information (Model) to calculate the content area. |

```ts
graph.centerContent()
graph.centerContent({ padding: { left: 100 } })
```

### centerCell(...)

```ts
centerCell(options?: CenterOptions): this
```

Align the node/edge center with the viewport center.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| cell | Cell | ✓ |  | Node/edge. |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |

```ts
graph.centerCell(cell)
graph.centerCell(cell, { padding: { left: 100 } })
```

### positionContent(...)

```ts
positionContent(pos: Position, options?: PositionContentOptions): this
```

Align the canvas content bounding box position with the corresponding viewport position. For example, if `pos` is `'bottom-left'`, it means aligning the bottom-left corner of the content bounding box with the bottom-left corner of the viewport.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| pos | Position | ✓ |  | Alignment position. |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |
| options.useCellGeometry | boolean |  | `true` | Whether to use node/edge geometry information (Model) to calculate the content area. |

Supported alignment positions:

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

```ts
positionCell(cell: Cell, pos: Direction, options?: CenterOptions): this
```

Align the node/edge bounding box position with the corresponding viewport position. For example, if `pos` is `'bottom-left'`, it means aligning the bottom-left corner of the node/edge bounding box with the bottom-left corner of the viewport.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| cell | Cell | ✓ |  | Node/edge. |
| pos | Position | ✓ |  | Alignment position. |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |

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

```ts
positionRect(rect: Rectangle.RectangleLike, pos: Direction, options?: CenterOptions): this
```

Align the rectangle position with the corresponding viewport position. For example, if `pos` is `'bottom-left'`, it means aligning the bottom-left corner of the rectangle with the bottom-left corner of the viewport.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| rect | Rectangle.RectangleLike | ✓ |  | Rectangle area. |
| pos | Position | ✓ |  | Alignment position. |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |

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

```ts
positionPoint(point: Point.PointLike, x: number | string, y: number | string, options?: CenterOptions): this
```

Align the point `(x, y)` (relative to the canvas) with the corresponding viewport position.

| Name | Type | Required | Default Value | Description |
| --- | --- | :-: | --- | --- |
| point | Point.PointLike | ✓ |  | Point to be aligned. |
| x | number \| string | ✓ |  | Viewport x-coordinate, supports percentage and negative values. |
| y | number \| string | ✓ |  | Viewport y-coordinate, supports percentage and negative values. |
| options.padding | number \| Padding |  | - | Margin, only effective in scroller canvas. |

```ts
// Align the top-left corner of the canvas with the point [100, 50] in the viewport
graph.positionPoint({ x: 0, y: 0 }, 100, 50)

// Align the point { x: 30, y: 80 } on the canvas with the point 25% from the left and 40px from the bottom of the viewport
graph.positionPoint({ x: 30, y: 80 }, '25%', -40)

// Align the point { x: 30, y: 80 } on the canvas with the point 25% from the right and 40px from the top of the viewport
graph.positionPoint({ x: 30, y: 80 }, '-25%', 40)
```
