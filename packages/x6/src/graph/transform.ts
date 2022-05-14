import { Dom, NumberExt } from '../util'
import { Point, Rectangle } from '../geometry'
import { Transform } from '../addon/transform'
import { Node } from '../model/node'
import { Cell } from '../model/cell'
import { EventArgs } from './events'
import { Base } from './base'

export class TransformManager extends Base {
  protected widgets: Map<Node, Transform> = new Map()

  protected viewportMatrix: DOMMatrix | null

  protected viewportTransformString: string | null

  protected get container() {
    return this.graph.view.container
  }

  protected get viewport() {
    return this.graph.view.viewport
  }

  protected get isSelectionEnabled() {
    return this.options.selecting.enabled === true
  }

  protected init() {
    this.startListening()
    this.resize()
  }

  protected startListening() {
    this.graph.on('node:mouseup', this.onNodeMouseUp, this)
    this.graph.on('node:selected', this.onNodeSelected, this)
    this.graph.on('node:unselected', this.onNodeUnSelected, this)
  }

  protected stopListening() {
    this.graph.off('node:mouseup', this.onNodeMouseUp, this)
    this.graph.off('node:selected', this.onNodeSelected, this)
    this.graph.off('node:unselected', this.onNodeUnSelected, this)
  }

  protected onNodeMouseUp({ node }: EventArgs['node:mouseup']) {
    if (!this.isSelectionEnabled) {
      const widget = this.graph.hook.createTransform(node, { clearAll: true })
      if (widget) {
        this.widgets.set(node, widget)
      }
    }
  }

  protected onNodeSelected({ node }: EventArgs['node:selected']) {
    if (this.isSelectionEnabled) {
      const widget = this.graph.hook.createTransform(node, { clearAll: false })
      if (widget) {
        this.widgets.set(node, widget)
      }
    }
  }

  protected onNodeUnSelected({ node }: EventArgs['node:unselected']) {
    if (this.isSelectionEnabled) {
      const widget = this.widgets.get(node)
      if (widget) {
        widget.dispose()
      }
      this.widgets.delete(node)
    }
  }

  /**
   * Returns the current transformation matrix of the graph.
   */
  getMatrix() {
    const transform = this.viewport.getAttribute('transform')
    if (transform !== this.viewportTransformString) {
      // `getCTM`: top-left relative to the SVG element
      // `getScreenCTM`: top-left relative to the document
      this.viewportMatrix = this.viewport.getCTM()
      this.viewportTransformString = transform
    }

    // Clone the cached current transformation matrix.
    // If no matrix previously stored the identity matrix is returned.
    return Dom.createSVGMatrix(this.viewportMatrix)
  }

  /**
   * Sets new transformation with the given `matrix`
   */
  setMatrix(matrix: DOMMatrix | Dom.MatrixLike | null) {
    const ctm = Dom.createSVGMatrix(matrix)
    const transform = Dom.matrixToTransformString(ctm)
    this.viewport.setAttribute('transform', transform)
    this.viewportMatrix = ctm
    this.viewportTransformString = transform
  }

  resize(width?: number, height?: number) {
    let w = width === undefined ? this.options.width : width
    let h = height === undefined ? this.options.height : height

    this.options.width = w
    this.options.height = h

    if (typeof w === 'number') {
      w = Math.round(w)
    }
    if (typeof h === 'number') {
      h = Math.round(h)
    }

    this.container.style.width = w == null ? '' : `${w}px`
    this.container.style.height = h == null ? '' : `${h}px`

    const size = this.getComputedSize()
    this.graph.trigger('resize', { ...size })
    return this
  }

  getComputedSize() {
    let w = this.options.width
    let h = this.options.height
    if (!NumberExt.isNumber(w)) {
      w = this.container.clientWidth
    }
    if (!NumberExt.isNumber(h)) {
      h = this.container.clientHeight
    }
    return { width: w, height: h }
  }

  getScale() {
    return Dom.matrixToScale(this.getMatrix())
  }

  scale(
    sx: number,
    sy: number = sx,
    ox = 0,
    oy = 0,
    options: TransformManager.TransformOptions = {},
  ) {
    sx = this.clampScale(sx) // eslint-disable-line
    sy = this.clampScale(sy) // eslint-disable-line

    if (ox || oy) {
      const ts = this.getTranslation()
      const tx = ts.tx - ox * (sx - 1)
      const ty = ts.ty - oy * (sy - 1)
      if (tx !== ts.tx || ty !== ts.ty) {
        this.translate(tx, ty)
      }
    }

    const matrix = this.getMatrix()
    matrix.a = sx
    matrix.d = sy

    this.setMatrix(matrix)
    this.graph.trigger('scale', { sx, sy, ox, oy, ...options })
    return this
  }

  clampScale(scale: number) {
    const range = this.graph.options.scaling
    return NumberExt.clamp(scale, range.min || 0.01, range.max || 16)
  }

  getZoom() {
    return this.getScale().sx
  }

  zoom(
    factor: number,
    options?: TransformManager.ZoomOptions & TransformManager.TransformOptions,
  ) {
    options = options || {} // eslint-disable-line

    let sx = factor
    let sy = factor
    const scale = this.getScale()
    const clientSize = this.getComputedSize()
    let cx = clientSize.width / 2
    let cy = clientSize.height / 2

    if (!options.absolute) {
      sx += scale.sx
      sy += scale.sy
    }

    if (options.scaleGrid) {
      sx = Math.round(sx / options.scaleGrid) * options.scaleGrid
      sy = Math.round(sy / options.scaleGrid) * options.scaleGrid
    }

    if (options.maxScale) {
      sx = Math.min(options.maxScale, sx)
      sy = Math.min(options.maxScale, sy)
    }

    if (options.minScale) {
      sx = Math.max(options.minScale, sx)
      sy = Math.max(options.minScale, sy)
    }

    if (options.center) {
      cx = options.center.x
      cy = options.center.y
    }

    sx = this.clampScale(sx)
    sy = this.clampScale(sy)

    if (cx || cy) {
      const ts = this.getTranslation()
      const tx = cx - (cx - ts.tx) * (sx / scale.sx)
      const ty = cy - (cy - ts.ty) * (sy / scale.sy)
      if (tx !== ts.tx || ty !== ts.ty) {
        this.translate(tx, ty, { ui: options.ui })
      }
    }

    this.scale(sx, sy, 0, 0, { ui: options.ui })

    return this
  }

  getRotation() {
    return Dom.matrixToRotation(this.getMatrix())
  }

  rotate(angle: number, cx?: number, cy?: number) {
    if (cx == null || cy == null) {
      const bbox = Dom.getBBox(this.graph.view.stage)
      cx = bbox.width / 2 // eslint-disable-line
      cy = bbox.height / 2 // eslint-disable-line
    }

    const ctm = this.getMatrix()
      .translate(cx, cy)
      .rotate(angle)
      .translate(-cx, -cy)
    this.setMatrix(ctm)
    return this
  }

  getTranslation() {
    return Dom.matrixToTranslation(this.getMatrix())
  }

  translate(
    tx: number,
    ty: number,
    options: TransformManager.TransformOptions = {},
  ) {
    const matrix = this.getMatrix()
    matrix.e = tx || 0
    matrix.f = ty || 0
    this.setMatrix(matrix)
    const ts = this.getTranslation()
    this.options.x = ts.tx
    this.options.y = ts.ty
    this.graph.trigger('translate', { ...ts, ...options })
    return this
  }

  setOrigin(ox?: number, oy?: number) {
    return this.translate(ox || 0, oy || 0)
  }

  fitToContent(
    gridWidth?: number | TransformManager.FitToContentFullOptions,
    gridHeight?: number,
    padding?: NumberExt.SideOptions,
    options?: TransformManager.FitToContentOptions,
  ) {
    if (typeof gridWidth === 'object') {
      const opts = gridWidth
      gridWidth = opts.gridWidth || 1 // eslint-disable-line
      gridHeight = opts.gridHeight || 1 // eslint-disable-line
      padding = opts.padding || 0 // eslint-disable-line
      options = opts // eslint-disable-line
    } else {
      gridWidth = gridWidth || 1 // eslint-disable-line
      gridHeight = gridHeight || 1 // eslint-disable-line
      padding = padding || 0 // eslint-disable-line
      if (options == null) {
        options = {} // eslint-disable-line
      }
    }

    const paddings = NumberExt.normalizeSides(padding)
    const border = options.border || 0
    const contentArea = options.contentArea
      ? Rectangle.create(options.contentArea)
      : this.getContentArea(options)

    if (border > 0) {
      contentArea.inflate(border)
    }

    const scale = this.getScale()
    const translate = this.getTranslation()
    const sx = scale.sx
    const sy = scale.sy

    contentArea.x *= sx
    contentArea.y *= sy
    contentArea.width *= sx
    contentArea.height *= sy

    let width =
      Math.max(Math.ceil((contentArea.width + contentArea.x) / gridWidth), 1) *
      gridWidth

    let height =
      Math.max(
        Math.ceil((contentArea.height + contentArea.y) / gridHeight),
        1,
      ) * gridHeight

    let tx = 0
    let ty = 0

    if (
      (options.allowNewOrigin === 'negative' && contentArea.x < 0) ||
      (options.allowNewOrigin === 'positive' && contentArea.x >= 0) ||
      options.allowNewOrigin === 'any'
    ) {
      tx = Math.ceil(-contentArea.x / gridWidth) * gridWidth
      tx += paddings.left
      width += tx
    }

    if (
      (options.allowNewOrigin === 'negative' && contentArea.y < 0) ||
      (options.allowNewOrigin === 'positive' && contentArea.y >= 0) ||
      options.allowNewOrigin === 'any'
    ) {
      ty = Math.ceil(-contentArea.y / gridHeight) * gridHeight
      ty += paddings.top
      height += ty
    }

    width += paddings.right
    height += paddings.bottom

    // Make sure the resulting width and height are greater than minimum.
    width = Math.max(width, options.minWidth || 0)
    height = Math.max(height, options.minHeight || 0)

    // Make sure the resulting width and height are lesser than maximum.
    width = Math.min(width, options.maxWidth || Number.MAX_SAFE_INTEGER)
    height = Math.min(height, options.maxHeight || Number.MAX_SAFE_INTEGER)

    const size = this.getComputedSize()
    const sizeChanged = width !== size.width || height !== size.height
    const originChanged = tx !== translate.tx || ty !== translate.ty

    // Change the dimensions only if there is a size discrepency or an origin change
    if (originChanged) {
      this.translate(tx, ty)
    }

    if (sizeChanged) {
      this.resize(width, height)
    }

    return new Rectangle(-tx / sx, -ty / sy, width / sx, height / sy)
  }

  scaleContentToFit(options: TransformManager.ScaleContentToFitOptions = {}) {
    this.scaleContentToFitImpl(options)
  }

  scaleContentToFitImpl(
    options: TransformManager.ScaleContentToFitOptions = {},
    translate = true,
  ) {
    let contentBBox
    let contentLocalOrigin
    if (options.contentArea) {
      const contentArea = options.contentArea
      contentBBox = this.graph.localToGraph(contentArea)
      contentLocalOrigin = Point.create(contentArea)
    } else {
      contentBBox = this.getContentBBox(options)
      contentLocalOrigin = this.graph.graphToLocal(contentBBox)
    }

    if (!contentBBox.width || !contentBBox.height) {
      return
    }

    const padding = NumberExt.normalizeSides(options.padding)
    const minScale = options.minScale || 0
    const maxScale = options.maxScale || Number.MAX_SAFE_INTEGER
    const minScaleX = options.minScaleX || minScale
    const maxScaleX = options.maxScaleX || maxScale
    const minScaleY = options.minScaleY || minScale
    const maxScaleY = options.maxScaleY || maxScale

    let fittingBox
    if (options.viewportArea) {
      fittingBox = options.viewportArea
    } else {
      const computedSize = this.getComputedSize()
      const currentTranslate = this.getTranslation()
      fittingBox = {
        x: currentTranslate.tx,
        y: currentTranslate.ty,
        width: computedSize.width,
        height: computedSize.height,
      }
    }

    fittingBox = Rectangle.create(fittingBox).moveAndExpand({
      x: padding.left,
      y: padding.top,
      width: -padding.left - padding.right,
      height: -padding.top - padding.bottom,
    })

    const currentScale = this.getScale()

    let newSX = (fittingBox.width / contentBBox.width) * currentScale.sx
    let newSY = (fittingBox.height / contentBBox.height) * currentScale.sy

    if (options.preserveAspectRatio !== false) {
      newSX = newSY = Math.min(newSX, newSY)
    }

    // snap scale to a grid
    const gridSize = options.scaleGrid
    if (gridSize) {
      newSX = gridSize * Math.floor(newSX / gridSize)
      newSY = gridSize * Math.floor(newSY / gridSize)
    }

    // scale min/max boundaries
    newSX = NumberExt.clamp(newSX, minScaleX, maxScaleX)
    newSY = NumberExt.clamp(newSY, minScaleY, maxScaleY)

    this.scale(newSX, newSY)

    if (translate) {
      const origin = this.options
      const newOX = fittingBox.x - contentLocalOrigin.x * newSX - origin.x
      const newOY = fittingBox.y - contentLocalOrigin.y * newSY - origin.y
      this.translate(newOX, newOY)
    }
  }

  getContentArea(options: TransformManager.GetContentAreaOptions = {}) {
    if (options.useCellGeometry) {
      return this.model.getAllCellsBBox() || new Rectangle()
    }

    return Dom.getBBox(this.graph.view.stage)
  }

  getContentBBox(options: TransformManager.GetContentAreaOptions = {}) {
    return this.graph.localToGraph(this.getContentArea(options))
  }

  getGraphArea() {
    const rect = Rectangle.fromSize(this.getComputedSize())
    return this.graph.graphToLocal(rect)
  }

  zoomToRect(
    rect: Rectangle.RectangleLike,
    options: TransformManager.ScaleContentToFitOptions = {},
  ) {
    const area = Rectangle.create(rect)
    const graph = this.graph

    options.contentArea = area
    if (options.viewportArea == null) {
      options.viewportArea = {
        x: graph.options.x,
        y: graph.options.y,
        width: this.options.width,
        height: this.options.height,
      }
    }

    this.scaleContentToFitImpl(options, false)
    const center = area.getCenter()
    this.centerPoint(center.x, center.y)

    return this
  }

  zoomToFit(
    options: TransformManager.GetContentAreaOptions &
      TransformManager.ScaleContentToFitOptions = {},
  ) {
    return this.zoomToRect(this.getContentArea(options), options)
  }

  centerPoint(x?: number, y?: number) {
    const clientSize = this.getComputedSize()
    const scale = this.getScale()
    const ts = this.getTranslation()
    const cx = clientSize.width / 2
    const cy = clientSize.height / 2

    x = typeof x === 'number' ? x : cx // eslint-disable-line
    y = typeof y === 'number' ? y : cy // eslint-disable-line

    x = cx - x * scale.sx // eslint-disable-line
    y = cy - y * scale.sy // eslint-disable-line

    if (ts.tx !== x || ts.ty !== y) {
      this.translate(x, y)
    }
  }

  centerContent(options?: TransformManager.GetContentAreaOptions) {
    const rect = this.graph.getContentArea(options)
    const center = rect.getCenter()
    this.centerPoint(center.x, center.y)
  }

  centerCell(cell: Cell) {
    return this.positionCell(cell, 'center')
  }

  positionPoint(
    point: Point.PointLike,
    x: number | string,
    y: number | string,
  ) {
    const clientSize = this.getComputedSize()

    // eslint-disable-next-line
    x = NumberExt.normalizePercentage(x, Math.max(0, clientSize.width))
    if (x < 0) {
      x = clientSize.width + x // eslint-disable-line
    }

    // eslint-disable-next-line
    y = NumberExt.normalizePercentage(y, Math.max(0, clientSize.height))
    if (y < 0) {
      y = clientSize.height + y // eslint-disable-line
    }

    const ts = this.getTranslation()
    const scale = this.getScale()
    const dx = x - point.x * scale.sx
    const dy = y - point.y * scale.sy

    if (ts.tx !== dx || ts.ty !== dy) {
      this.translate(dx, dy)
    }
  }

  positionRect(rect: Rectangle.RectangleLike, pos: TransformManager.Direction) {
    const bbox = Rectangle.create(rect)
    switch (pos) {
      case 'center':
        return this.positionPoint(bbox.getCenter(), '50%', '50%')
      case 'top':
        return this.positionPoint(bbox.getTopCenter(), '50%', 0)
      case 'top-right':
        return this.positionPoint(bbox.getTopRight(), '100%', 0)
      case 'right':
        return this.positionPoint(bbox.getRightMiddle(), '100%', '50%')
      case 'bottom-right':
        return this.positionPoint(bbox.getBottomRight(), '100%', '100%')
      case 'bottom':
        return this.positionPoint(bbox.getBottomCenter(), '50%', '100%')
      case 'bottom-left':
        return this.positionPoint(bbox.getBottomLeft(), 0, '100%')
      case 'left':
        return this.positionPoint(bbox.getLeftMiddle(), 0, '50%')
      case 'top-left':
        return this.positionPoint(bbox.getTopLeft(), 0, 0)
      default:
        return this
    }
  }

  positionCell(cell: Cell, pos: TransformManager.Direction) {
    const bbox = cell.getBBox()
    return this.positionRect(bbox, pos)
  }

  positionContent(
    pos: TransformManager.Direction,
    options?: TransformManager.GetContentAreaOptions,
  ) {
    const rect = this.graph.getContentArea(options)
    return this.positionRect(rect, pos)
  }

  @TransformManager.dispose()
  dispose() {
    this.widgets.forEach((widget) => widget.dispose())
    this.widgets.clear()
    this.stopListening()
  }
}

export namespace TransformManager {
  export interface TransformOptions {
    ui?: boolean
  }
  export interface FitToContentOptions extends GetContentAreaOptions {
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    contentArea?: Rectangle | Rectangle.RectangleLike
    border?: number
    allowNewOrigin?: 'negative' | 'positive' | 'any'
  }

  export interface FitToContentFullOptions extends FitToContentOptions {
    gridWidth?: number
    gridHeight?: number
    padding?: NumberExt.SideOptions
  }

  export interface ScaleContentToFitOptions extends GetContentAreaOptions {
    padding?: NumberExt.SideOptions
    minScale?: number
    maxScale?: number
    minScaleX?: number
    minScaleY?: number
    maxScaleX?: number
    maxScaleY?: number
    scaleGrid?: number
    contentArea?: Rectangle.RectangleLike
    viewportArea?: Rectangle.RectangleLike
    preserveAspectRatio?: boolean
  }

  export interface GetContentAreaOptions {
    useCellGeometry?: boolean
  }

  export interface ZoomOptions {
    absolute?: boolean
    minScale?: number
    maxScale?: number
    scaleGrid?: number
    center?: Point.PointLike
  }

  export type Direction =
    | 'center'
    | 'top'
    | 'top-right'
    | 'top-left'
    | 'right'
    | 'bottom-right'
    | 'bottom'
    | 'bottom-left'
    | 'left'
}
