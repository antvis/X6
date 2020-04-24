import { v } from '../../../v'
import { Point, Rectangle } from '../../../geometry'
import { Platform, NumberExt, ObjectExt } from '../../../util'
import { Cell } from '../../core/cell'
import { View } from '../../core/view'
import { Graph } from '../../core/graph'

export class Scroller extends View {
  public readonly options: Scroller.Options
  public readonly container: HTMLDivElement
  public readonly $container: JQuery<HTMLElement>
  public readonly $background: JQuery<HTMLElement>

  protected clientX: number
  protected clientY: number
  protected sx: number
  protected sy: number
  protected padding = { left: 0, top: 0, right: 0, bottom: 0 }
  protected centerPoint: Point.PointLike | null
  protected scrollLeftBeforePrint: number | null
  protected scrollTopBeforePrint: number | null
  protected delegatedHandlers: { [name: string]: Function }

  protected readonly containerClassName = 'graph-scroller'
  protected readonly transitionClassName = 'transition-in-progress'
  protected readonly transitionEventName: 'transitionend.paper-scroller-transition'

  get graph() {
    return this.options.graph
  }

  get model() {
    return this.graph.model
  }

  constructor(options: Scroller.Options) {
    super()

    this.options = ObjectExt.merge({}, Scroller.defaultOptions, options)

    const graph = this.graph
    if (this.options.baseWidth == null) {
      this.options.baseWidth = graph.options.width
    }
    if (this.options.baseHeight == null) {
      this.options.baseHeight = graph.options.height
    }

    const scale = this.graph.getScale()
    this.sx = scale.sx
    this.sy = scale.sy

    this.container = document.createElement('div')
    this.$container = this.$(this.container).addClass(
      this.prefixClassName(this.containerClassName),
    )
    this.$background = this.$('<div/>')
      .addClass(this.prefixClassName(`${this.containerClassName}-background`))
      .css({
        width: graph.options.width,
        height: graph.options.height,
      })
      .append(graph.container)
      .appendTo(this.container)

    this.startListening()
    this.setCursor(this.options.cursor)
  }

  protected startListening() {
    const graph = this.graph
    const model = this.model

    graph.on('scale', this.onScale, this)
    graph.on('resize', this.onResize, this)
    graph.on('beforeprint', this.storeScrollPosition, this)
    graph.on('beforeexport', this.storeScrollPosition, this)
    graph.on('afterprint', this.restoreScrollPosition, this)
    graph.on('afterexport', this.restoreScrollPosition, this)

    if (this.options.autoResizePaper) {
      if (graph.isAsync()) {
        graph.on('render:done', this.onPaperRenderDone, this)
      } else {
        model.on('reseted', this.adjustPaper, this)
        model.on('cell:added', this.adjustPaper, this)
        model.on('cell:removed', this.adjustPaper, this)
        model.on('cell:changed', this.adjustPaper, this)
      }
    }
    this.delegateBackgroundEvents()
  }

  protected stopListening() {
    const graph = this.graph
    const model = this.model

    graph.off('scale', this.onScale, this)
    graph.off('resize', this.onResize, this)
    graph.off('beforeprint', this.storeScrollPosition, this)
    graph.off('beforeexport', this.storeScrollPosition, this)
    graph.off('afterprint', this.restoreScrollPosition, this)
    graph.off('afterexport', this.restoreScrollPosition, this)

    graph.off('render:done', this.onPaperRenderDone, this)

    model.off('reseted', this.adjustPaper, this)
    model.off('cell:added', this.adjustPaper, this)
    model.off('cell:removed', this.adjustPaper, this)
    model.off('cell:changed', this.adjustPaper, this)
    this.undelegateBackgroundEvents()
  }

  protected delegateBackgroundEvents(events?: View.Events) {
    const evts = events || Graph.events

    this.delegatedHandlers = Object.keys(evts).reduce<{
      [name: string]: Function
    }>((memo, name) => {
      const handler = evts[name]
      if (name.indexOf(' ') === -1) {
        memo[name] =
          typeof handler === 'function' ? handler : (this.graph as any)[handler]
      }
      return memo
    }, {})

    this.onBackgroundEvent = this.onBackgroundEvent.bind(this)
    Object.keys(this.delegatedHandlers).forEach(name => {
      this.delegateEvent(
        name,
        {
          guarded: false,
        },
        this.onBackgroundEvent,
      )
    })
  }

  protected undelegateBackgroundEvents() {
    Object.keys(this.delegatedHandlers).forEach(name => {
      this.undelegateEvent(name, this.onBackgroundEvent)
    })
  }

  protected onBackgroundEvent(e: JQuery.TriggeredEvent) {
    if (this.$background.is(e.target)) {
      const handler = this.delegatedHandlers[e.type]
      if (typeof handler === 'function') {
        handler.apply(this.graph, arguments)
      }
    }
  }

  protected onPaperRenderDone({ stats }: Graph.EventArgs['render:done']) {
    if (stats.priority < 2) {
      this.adjustPaper()
    }
  }

  protected onResize() {
    if (this.centerPoint) {
      this.center(this.centerPoint.x, this.centerPoint.y)
    }
  }

  protected onScale({ sx, sy, ox, oy }: Graph.EventArgs['scale']) {
    this.adjustScale(sx, sy)
    this.sx = sx
    this.sy = sy
    if (ox || oy) {
      this.center(ox, oy)
    }

    if (typeof this.options.contentOptions === 'function') {
      this.adjustPaper()
    }
  }

  protected storeScrollPosition() {
    this.scrollLeftBeforePrint = this.container.scrollLeft
    this.scrollTopBeforePrint = this.container.scrollTop
  }

  protected restoreScrollPosition() {
    this.container.scrollLeft = this.scrollLeftBeforePrint!
    this.container.scrollTop = this.scrollTopBeforePrint!
    this.scrollLeftBeforePrint = null
    this.scrollTopBeforePrint = null
  }

  protected beforeManipulation() {
    if (Platform.IS_IE || Platform.IS_EDGE) {
      this.$container.css('visibility', 'hidden')
    }
  }

  protected afterManipulation() {
    if (Platform.IS_IE || Platform.IS_EDGE) {
      this.$container.css('visibility', 'visible')
    }
  }

  protected adjustPaper() {
    const size = this.getClientSize()
    this.centerPoint = this.clientToLocalPoint(size.width / 2, size.height / 2)
    let contentOptions = this.options.contentOptions
    if (typeof contentOptions === 'function') {
      contentOptions = contentOptions.call(this, this)
    }
    const options: Graph.FitToContentFullOptions = {
      gridWidth: this.options.baseWidth,
      gridHeight: this.options.baseHeight,
      allowNewOrigin: 'negative',
      ...contentOptions,
    }
    this.graph.fitToContent(this.transformContentOptions(options))
  }

  protected transformContentOptions(options: Graph.FitToContentFullOptions) {
    const sx = this.sx
    const sy = this.sy

    options.gridWidth && (options.gridWidth *= sx)
    options.gridHeight && (options.gridHeight *= sy)
    options.minWidth && (options.minWidth *= sx)
    options.minHeight && (options.minHeight *= sy)

    if (typeof options.padding === 'object') {
      options.padding = {
        left: (options.padding.left || 0) * sx,
        right: (options.padding.right || 0) * sx,
        top: (options.padding.top || 0) * sy,
        bottom: (options.padding.bottom || 0) * sy,
      }
    } else if (typeof options.padding === 'number') {
      options.padding = options.padding * sx
    }

    return options
  }

  protected adjustScale(sx: number, sy: number) {
    const options = this.graph.options
    const dx = sx / this.sx
    const dy = sy / this.sy
    this.graph.setOrigin(options.origin.x * dx, options.origin.y * dy)
    this.graph.resize(options.width * dx, options.height * dy)
  }

  /**
   * Try to scroll to ensure that the position (x,y) on the graph (in local
   * coordinates) is at the center of the viewport. If only one of the
   * coordinates is specified, only scroll in the specified dimension and
   * keep the other coordinate unchanged.
   */
  scroll(
    x: number | null | undefined,
    y: number | null | undefined,
    options?: Scroller.ScrollOptions,
  ) {
    const size = this.getClientSize()
    const ctm = this.graph.getMatrix()
    const prop: { [key: string]: number } = {}

    if (typeof x === 'number') {
      prop.scrollLeft = x - size.width / 2 + ctm.e + (this.padding.left || 0)
    }

    if (typeof y === 'number') {
      prop.scrollTop = y - size.height / 2 + ctm.f + (this.padding.top || 0)
    }

    if (options && options.animation) {
      this.$container.animate(prop, options.animation)
    } else {
      this.$container.prop(prop)
    }

    return this
  }

  scrollToPoint(p: Point.PointLike, options?: Scroller.ScrollOptions): this
  scrollToPoint(x: number, y: number, options?: Scroller.ScrollOptions): this
  scrollToPoint(
    x: number | Point.PointLike,
    y?: number | Scroller.ScrollOptions,
    options?: Scroller.ScrollOptions,
  ) {
    const sx = this.sx
    const sy = this.sy
    if (typeof x === 'number') {
      return this.scroll(x * sx, (y as number) * sy, options)
    }
    return this.scroll(x.x * sx, x.y * sy, y as Scroller.ScrollOptions)
  }

  /**
   * Try to scroll to ensure that the center of graph
   * content is at the center of the viewport.
   */
  scrollToContent(options?: Scroller.ScrollOptions) {
    return this.scrollToPoint(this.graph.getContentArea().getCenter())
  }

  /**
   * Try to scroll to ensure that the center of cell
   * is at the center of the viewport.
   */
  scrollToCell(cell: Cell, options?: Scroller.ScrollOptions) {
    return this.scrollToPoint(cell.getBBox().getCenter())
  }

  /**
   * The center methods are more aggressive than the scroll methods. These
   * methods position the graph so that a specific point on the graph lies
   * at the center of the viewport, adding paddings around the paper if
   * necessary (e.g. if the requested point lies in a corner of the paper).
   * This means that the requested point will always move into the center
   * of the viewport. (Use the scroll functions to avoid adding paddings
   * and only scroll the viewport as far as the graph boundary.)
   */

  /**
   * Position the point (x,y) on the graph (in local coordinates) to the
   * center of the viewport. If only one of the coordinates is specified,
   * only center along the specified dimension and keep the other coordinate
   * unchanged.
   */
  center(x: number, y: null | number, options?: Scroller.CenterOptions): this
  center(x: null | number, y: number, options?: Scroller.CenterOptions): this
  /**
   * Position the center of graph to the center of the viewport.
   */
  center(optons?: Scroller.CenterOptions): this
  center(
    x?: number | null | Scroller.CenterOptions,
    y?: number | null,
    options?: Scroller.CenterOptions,
  ) {
    const ctm = this.graph.getMatrix()
    const sx = ctm.a
    const sy = ctm.d
    const tx = -ctm.e
    const ty = -ctm.f
    const tWidth = tx + this.graph.options.width
    const tHeight = ty + this.graph.options.height

    let localOptions: Scroller.CenterOptions | null | undefined

    if (typeof x === 'number' || typeof y === 'number') {
      localOptions = options
      const visibleCenter = this.getVisibleArea().getCenter()
      if (typeof x === 'number') {
        x = x * sx // tslint:disable-line
      } else {
        x = visibleCenter.x // tslint:disable-line
      }

      if (typeof y === 'number') {
        y = y * sy // tslint:disable-line
      } else {
        y = visibleCenter.y // tslint:disable-line
      }
    } else {
      localOptions = x
      x = (tx + tWidth) / 2 // tslint:disable-line
      y = (ty + tHeight) / 2 // tslint:disable-line
    }

    const padding = this.getPadding()
    const clientSize = this.getClientSize()
    const cx = clientSize.width / 2
    const cy = clientSize.height / 2
    const left = cx - padding.left - x + tx
    const right = cx - padding.right + x - tWidth
    const top = cy - padding.top - y + ty
    const bottom = cy - padding.bottom + y - tHeight

    this.addPadding(
      Math.max(left, 0),
      Math.max(right, 0),
      Math.max(top, 0),
      Math.max(bottom, 0),
    )

    return this.scroll(x, y, localOptions || undefined)
  }

  centerContent(options?: Scroller.PositionContentOptions) {
    return this.positionContent('center', options)
  }

  centerCell(cell: Cell, options?: Scroller.CenterOptions) {
    return this.positionCell(cell, 'center', options)
  }

  /**
   * The position methods are a more general version of the center methods.
   * They position the graph so that a specific point on the graph lies at
   * requested coordinates inside the viewport.
   */

  /**
   *
   */
  positionContent(
    direction: Scroller.Direction,
    options?: Scroller.PositionContentOptions,
  ) {
    const rect = this.graph.getContentArea(options)
    return this.positionRect(rect, direction, options)
  }

  positionCell(
    cell: Cell,
    direction: Scroller.Direction,
    options?: Scroller.CenterOptions,
  ) {
    const bbox = cell.getBBox()
    return this.positionRect(bbox, direction, options)
  }

  positionRect(
    bbox: Rectangle,
    direction: Scroller.Direction,
    options?: Scroller.CenterOptions,
  ) {
    switch (direction) {
      case 'center':
        return this.positionPoint(bbox.getCenter(), '50%', '50%', options)
      case 'top':
        return this.positionPoint(bbox.getTopCenter(), '50%', 0, options)
      case 'top-right':
        return this.positionPoint(bbox.getTopRight(), '100%', 0, options)
      case 'right':
        return this.positionPoint(bbox.getRightMiddle(), '100%', '50%', options)
      case 'bottom-right':
        return this.positionPoint(
          bbox.getBottomRight(),
          '100%',
          '100%',
          options,
        )
      case 'bottom':
        return this.positionPoint(
          bbox.getBottomCenter(),
          '50%',
          '100%',
          options,
        )
      case 'bottom-left':
        return this.positionPoint(bbox.getBottomLeft(), 0, '100%', options)
      case 'left':
        return this.positionPoint(bbox.getLeftMiddle(), 0, '50%', options)
      case 'top-left':
        return this.positionPoint(bbox.getTopLeft(), 0, 0, options)
      default:
        return this
    }
  }

  positionPoint(
    point: Point,
    x: number | string,
    y: number | string,
    options: Scroller.CenterOptions = {},
  ) {
    const padding = NumberExt.normalizeSides(options.padding)
    const clientRect = Rectangle.fromSize(this.getClientSize())
    const targetRect = clientRect.clone().moveAndExpand({
      x: padding.left,
      y: padding.top,
      width: -padding.right - padding.left,
      height: -padding.top - padding.bottom,
    })

    // tslint:disable-next-line
    x = NumberExt.normalizePercentage(x, Math.max(0, targetRect.width))
    if (x < 0) {
      x = targetRect.width + x // tslint:disable-line
    }

    // tslint:disable-next-line
    y = NumberExt.normalizePercentage(y, Math.max(0, targetRect.height))
    if (y < 0) {
      y = targetRect.height + y // tslint:disable-line
    }

    const origin = targetRect.getTopLeft().translate(x, y)
    const diff = clientRect.getCenter().diff(origin)
    const scale = this.zoom()
    const rawDiff = diff.scale(1 / scale, 1 / scale)
    const result = point.clone().translate(rawDiff)
    return this.center(result.x, result.y, options)
  }

  zoom(): number
  zoom(scale: number, options?: Scroller.ZoomOptions): this
  zoom(scale?: number, options?: Scroller.ZoomOptions) {
    if (scale == null) {
      return this.sx
    }

    options = options || {} // tslint:disable-line

    let cx
    let cy
    const clientSize = this.getClientSize()
    const center = this.clientToLocalPoint(
      clientSize.width / 2,
      clientSize.height / 2,
    )

    let sx = scale
    let sy = scale

    if (!options.absolute) {
      sx = sx + this.sx
      sy = sy + this.sy
    }

    if (options.grid) {
      sx = Math.round(sx / options.grid) * options.grid
      sy = Math.round(sy / options.grid) * options.grid
    }

    if (options.max) {
      sx = Math.min(options.max, sx)
      sy = Math.min(options.max, sy)
    }

    if (options.min) {
      sx = Math.max(options.min, sx)
      sy = Math.max(options.min, sy)
    }

    if (options.ox == null || options.oy == null) {
      cx = center.x
      cy = center.y
    } else {
      const zx = sx / this.sx
      const zy = sy / this.sy
      cx = options.ox - (options.ox - center.x) / zx
      cy = options.oy - (options.oy - center.y) / zy
    }

    this.beforeManipulation()
    this.graph.scale(sx, sy)
    this.center(cx, cy)
    this.afterManipulation()

    return this
  }

  zoomToRect(
    rect: Rectangle.RectangleLike,
    options: Graph.ScaleContentToFitOptions = {},
  ) {
    const area = Rectangle.create(rect)
    const graph = this.graph
    const origin = { ...graph.options.origin }

    options.contentArea = area
    if (options.fittingBBox == null) {
      options.fittingBBox = {
        ...origin,
        width: this.$container.width()!,
        height: this.$container.height()!,
      }
    }

    this.beforeManipulation()
    graph.scaleContentToFit(options)
    const center = area.getCenter()
    this.center(center.x, center.y)
    this.afterManipulation()

    return this
  }

  zoomToFit(
    options: Graph.GetContentAreaOptions & Graph.ScaleContentToFitOptions = {},
  ) {
    return this.zoomToRect(this.graph.getContentArea(options), options)
  }

  transitionToPoint(
    p: Point.PointLike,
    options?: Scroller.TransitionOptions,
  ): this
  transitionToPoint(
    x: number,
    y: number,
    options?: Scroller.TransitionOptions,
  ): this
  transitionToPoint(
    x: number | Point.PointLike,
    y?: number | Scroller.TransitionOptions,
    options?: Scroller.TransitionOptions,
  ) {
    if (typeof x === 'object') {
      options = y as Scroller.TransitionOptions // tslint:disable-line
      y = x.y // tslint:disable-line
      x = x.x // tslint:disable-line
    } else {
      y = y as number // tslint:disable-line
    }

    if (options == null) {
      options = {} // tslint:disable-line
    }

    let transform
    let transformOrigin
    const scale = this.sx
    const targetScale = Math.max(options.scale || scale, 0.000001)
    const clientSize = this.getClientSize()
    const targetPoint = new Point(x, y)
    const localPoint = this.clientToLocalPoint(
      clientSize.width / 2,
      clientSize.height / 2,
    )

    if (scale === targetScale) {
      const translate = localPoint
        .diff(targetPoint)
        .scale(scale, scale)
        .round()
      transform = `translate(${translate.x}px,${translate.y}px)`
    } else {
      const delta =
        (targetScale / (scale - targetScale)) * targetPoint.distance(localPoint)
      const range = localPoint.clone().move(targetPoint, delta)
      const origin = this.localToBackgroundPoint(range).round()
      transform = `scale(${targetScale / scale})`
      transformOrigin = `${origin.x}px ${origin.y}px`
    }

    const onTransitionEnd = options.onTransitionEnd
    this.$container.addClass(this.transitionClassName)
    this.$background
      .off(this.transitionEventName)
      .on(this.transitionEventName, e => {
        this.syncTransition(targetScale, { x: x as number, y: y as number })
        if (typeof onTransitionEnd === 'function') {
          onTransitionEnd.call(this, e)
        }
      })
      .css({
        transform,
        transformOrigin,
        transition: 'transform',
        transitionDuration: options.duration || '1s',
        transitionDelay: options.delay,
        transitionTimingFunction: options.timingFunction,
      } as JQuery.PlainObject<string>)

    return this
  }

  syncTransition(scale: number, p: Point.PointLike) {
    this.beforeManipulation()
    this.graph.scale(scale)
    this.removeTransition().center(p.x, p.y)
    this.afterManipulation()
    return this
  }

  removeTransition() {
    this.$container.removeClass(this.transitionClassName)
    this.$background.off(this.transitionEventName).css({
      transform: '',
      transformOrigin: '',
      transition: '',
      transitionDuration: '',
      transitionDelay: '',
      transitionTimingFunction: '',
    })
    return this
  }

  transitionToRect(
    rectangle: Rectangle.RectangleLike,
    options: Scroller.TransitionToRectOptions = {},
  ) {
    const rect = Rectangle.create(rectangle)
    const maxScale = options.maxScale || Infinity
    const minScale = options.minScale || Number.MIN_VALUE
    const scaleGrid = options.scaleGrid || null
    const PIXEL_SIZE = options.visibility || 1
    const center = options.center
      ? Point.create(options.center)
      : rect.getCenter()
    const clientSize = this.getClientSize()
    const w = clientSize.width * PIXEL_SIZE
    const h = clientSize.height * PIXEL_SIZE
    let scale = new Rectangle(
      center.x - w / 2,
      center.y - h / 2,
      w,
      h,
    ).maxRectUniformScaleToFit(rect, center)

    scale = Math.min(scale, maxScale)
    if (scaleGrid) {
      scale = Math.floor(scale / scaleGrid) * scaleGrid
    }
    scale = Math.max(minScale, scale)

    return this.transitionToPoint(center, {
      scale,
      ...options,
    })
  }

  startPanning(evt: JQuery.MouseDownEvent) {
    const e = this.normalizeEvent(evt)
    this.clientX = e.clientX!
    this.clientY = e.clientY!
    this.$container.addClass('is-panning')
    this.trigger('pan:start', { e })
    this.$(document.body).on({
      'mousemove.panning touchmove.panning': this.pan.bind(this),
      'mouseup.panning touchend.panning': this.stopPanning.bind(this),
    })
    this.$(window).on('mouseup.panning', this.stopPanning.bind(this))
  }

  pan(evt: JQuery.MouseMoveEvent) {
    const e = this.normalizeEvent(evt)
    const dx = e.clientX! - this.clientX
    const dy = e.clientY! - this.clientY
    this.container.scrollTop -= dy
    this.container.scrollLeft -= dx
    this.clientX = e.clientX!
    this.clientY = e.clientY!
  }

  stopPanning(e: JQuery.MouseUpEvent) {
    this.$(document.body).off('.panning')
    this.$(window).off('.panning')
    this.$container.removeClass('is-panning')
    this.trigger('pan:stop', { e })
  }

  clientToLocalPoint(p: Point.PointLike): Point
  clientToLocalPoint(x: number, y: number): Point
  clientToLocalPoint(x: number | Point.PointLike, y?: number) {
    if (typeof x === 'object') {
      y = x.y // tslint:disable-line
      x = x.x // tslint:disable-line
    } else {
      y = y as number // tslint:disable-line
    }

    const ctm = this.graph.getMatrix()
    const xx = x + (this.container.scrollLeft - this.padding.left - ctm.e)
    const yy = y + (this.container.scrollTop - this.padding.top - ctm.f)
    return new Point(xx / ctm.a, yy / ctm.d)
  }

  localToBackgroundPoint(p: Point.PointLike): Point
  localToBackgroundPoint(x: number, y: number): Point
  localToBackgroundPoint(x: number | Point.PointLike, y?: number) {
    const p = typeof x === 'object' ? Point.create(x) : new Point(x, y)
    const ctm = this.graph.getMatrix()
    const padding = this.padding
    return v.transformPoint(p, ctm).translate(padding.left, padding.top)
  }

  getClientSize() {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    }
  }

  protected addPadding(
    left?: number,
    right?: number,
    top?: number,
    bottom?: number,
  ) {
    let padding = this.getPadding()
    this.padding = {
      left: Math.round(padding.left + (left || 0)),
      top: Math.round(padding.top + (top || 0)),
      bottom: Math.round(padding.bottom + (bottom || 0)),
      right: Math.round(padding.right + (right || 0)),
    }

    padding = this.padding

    this.$background.css({
      width: padding.left + this.graph.options.width + padding.right,
      height: padding.top + this.graph.options.height + padding.bottom,
    })

    const container = this.graph.container
    container.style.left = `${this.padding.left}`
    container.style.top = `${this.padding.top}`

    return this
  }

  protected getPadding() {
    const padding = this.options.padding
    if (typeof padding === 'function') {
      return NumberExt.normalizeSides(padding.call(this))
    }

    return NumberExt.normalizeSides(padding)
  }

  /**
   * Returns the untransformed size and origin of the current viewport.
   */
  getVisibleArea() {
    const ctm = this.graph.getMatrix()
    const size = this.getClientSize()
    const box = {
      x: this.container.scrollLeft || 0,
      y: this.container.scrollTop || 0,
      width: size.width,
      height: size.height,
    }
    const area = v.transformRect(box, ctm.inverse())
    area.x -= (this.padding.left || 0) / this.sx
    area.y -= (this.padding.top || 0) / this.sy
    return area
  }

  isCellVisible(cell: Cell, options: { strict?: boolean } = {}) {
    const bbox = cell.getBBox()
    const area = this.getVisibleArea()
    return options.strict ? area.containsRect(bbox) : area.isIntersectWith(bbox)
  }

  isPointVisible(point: Point.PointLike) {
    return this.getVisibleArea().containsPoint(point)
  }

  /**
   * Lock the current viewport by disabling user scrolling.
   */
  lock() {
    this.$container.css('overflow', 'hidden')
    return this
  }

  /**
   * Enable user scrolling if previously locked.
   */
  unlock() {
    this.$container.css('overflow', 'scroll')
    return this
  }

  setCursor(value?: string) {
    switch (value) {
      case 'grab':
        this.$container.css('cursor', '')
        break
      default:
        this.$container.css('cursor', value || '')
    }
    this.$container.attr('data-cursor', value || '')
    this.options.cursor = value
  }
}

export namespace Scroller {
  export interface Options {
    graph: Graph
    width: number
    height: number
    minVisiblePaperSize?: number
    autoResizePaper?: boolean
    baseWidth?: number
    baseHeight?: number
    cursor?: string
    contentOptions?:
      | Graph.FitToContentFullOptions
      | ((this: Scroller, scroller: Scroller) => Graph.FitToContentFullOptions)
    padding?:
      | NumberExt.SideOptions
      | ((this: Scroller) => NumberExt.SideOptions)
  }

  export interface ScrollOptions {
    animation?: JQuery.EffectsOptions<HTMLElement>
  }

  export interface CenterOptions extends ScrollOptions {
    padding?: NumberExt.SideOptions
  }

  export interface ZoomOptions {
    absolute?: boolean
    grid?: number
    ox?: number
    oy?: number
    min?: number
    max?: number
  }

  export type PositionContentOptions = Graph.GetContentAreaOptions &
    Scroller.CenterOptions

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

  export interface TransitionOptions {
    /**
     * The zoom level to reach at the end of the transition.
     */
    scale?: number
    duration?: string
    delay?: string
    timingFunction?: string
    onTransitionEnd?: (this: Scroller, e: TransitionEvent) => void
  }

  export interface TransitionToRectOptions extends TransitionOptions {
    maxScale?: number
    minScale?: number
    scaleGrid?: number
    visibility?: number
    center?: Point.PointLike
  }

  export const defaultOptions: Partial<Options> = {
    padding() {
      const size = this.getClientSize()
      const min = Math.max(this.options.minVisiblePaperSize || 0, 1) || 1
      const left = Math.max(size.width - min, 0)
      const top = Math.max(size.height - min, 0)
      return { left, top, right: left, bottom: top }
    },
    minVisiblePaperSize: 50,
    autoResizePaper: false,
    cursor: 'default',
  }
}
