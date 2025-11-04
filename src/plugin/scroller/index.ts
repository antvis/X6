import {
  Basecoat,
  CssLoader,
  Dom,
  disposable,
  isModifierKeyMatch,
  type ModifierKey,
} from '../../common'
import { Config } from '../../config'
import type { Point, Rectangle, PointLike, RectangleLike } from '../../geometry'
import type { BackgroundManager, Graph, TransformManager } from '../../graph'
import type { Cell } from '../../model'
import { ScrollerImpl, getOptions } from './scroller'
import type {
  EventArgs,
  Options as SOptions,
  PositionContentOptions,
  CenterOptions,
  Direction,
  TransitionOptions,
  TransitionToRectOptions,
} from './scroller'
import { content } from './style/raw'
import './api'

export interface ScrollerEventArgs extends EventArgs {}

interface Options extends SOptions {
  pannable?:
    | boolean
    | {
        enabled: boolean
        eventTypes: Array<'leftMouseDown' | 'rightMouseDown'>
      }
  modifiers?: string | ModifierKey[] | null // alt, ctrl, shift, meta
}

export type ScrollerOptions = Omit<Options, 'graph'>
export class Scroller
  extends Basecoat<ScrollerEventArgs>
  implements Graph.Plugin
{
  public name = 'scroller'
  public options: ScrollerOptions
  private graph: Graph
  private scrollerImpl: ScrollerImpl

  get pannable() {
    if (this.options) {
      if (typeof this.options.pannable === 'object') {
        return this.options.pannable.enabled
      }
      return !!this.options.pannable
    }

    return false
  }

  get container() {
    return this.scrollerImpl.container
  }

  constructor(options: ScrollerOptions = {}) {
    super()
    this.options = options
    CssLoader.ensure(this.name, content)
  }

  public init(graph: Graph) {
    this.graph = graph
    const options = getOptions({
      enabled: true,
      ...this.options,
      graph,
    })
    this.options = options
    this.scrollerImpl = new ScrollerImpl(options)
    this.setup()
    this.startListening()
    this.updateClassName()
    this.scrollerImpl.center()
  }

  // #region api

  resize(width?: number, height?: number) {
    this.scrollerImpl.resize(width, height)
  }

  resizePage(width?: number, height?: number) {
    this.scrollerImpl.updatePageSize(width, height)
  }

  zoom(): number
  zoom(factor: number, options?: TransformManager.ZoomOptions): this
  zoom(factor?: number, options?: TransformManager.ZoomOptions) {
    if (typeof factor === 'undefined') {
      return this.scrollerImpl.zoom()
    }
    this.scrollerImpl.zoom(factor, options)
    return this
  }

  zoomTo(
    factor: number,
    options: Omit<TransformManager.ZoomOptions, 'absolute'> = {},
  ) {
    this.scrollerImpl.zoom(factor, { ...options, absolute: true })
    return this
  }

  zoomToRect(
    rect: RectangleLike,
    options: TransformManager.ScaleContentToFitOptions &
      TransformManager.ScaleContentToFitOptions = {},
  ) {
    this.scrollerImpl.zoomToRect(rect, options)
    return this
  }

  zoomToFit(
    options: TransformManager.GetContentAreaOptions &
      TransformManager.ScaleContentToFitOptions = {},
  ) {
    this.scrollerImpl.zoomToFit(options)
    return this
  }

  center(optons?: CenterOptions) {
    return this.centerPoint(optons)
  }

  centerPoint(x: number, y: null | number, options?: CenterOptions): this
  centerPoint(x: null | number, y: number, options?: CenterOptions): this
  centerPoint(optons?: CenterOptions): this
  centerPoint(
    x?: number | null | CenterOptions,
    y?: number | null,
    options?: CenterOptions,
  ) {
    this.scrollerImpl.centerPoint(x as number, y as number, options)
    return this
  }

  centerContent(options?: PositionContentOptions) {
    this.scrollerImpl.centerContent(options)
    return this
  }

  centerCell(cell: Cell, options?: CenterOptions) {
    this.scrollerImpl.centerCell(cell, options)
    return this
  }

  positionPoint(
    point: PointLike,
    x: number | string,
    y: number | string,
    options: CenterOptions = {},
  ) {
    this.scrollerImpl.positionPoint(point, x, y, options)

    return this
  }

  positionRect(
    rect: RectangleLike,
    direction: Direction,
    options?: CenterOptions,
  ) {
    this.scrollerImpl.positionRect(rect, direction, options)
    return this
  }

  positionCell(cell: Cell, direction: Direction, options?: CenterOptions) {
    this.scrollerImpl.positionCell(cell, direction, options)
    return this
  }

  positionContent(pos: Direction, options?: PositionContentOptions) {
    this.scrollerImpl.positionContent(pos, options)
    return this
  }

  drawBackground(options?: BackgroundManager.Options, onGraph?: boolean) {
    if (this.graph.options.background == null || !onGraph) {
      this.scrollerImpl.backgroundManager.draw(options)
    }
    return this
  }

  clearBackground(onGraph?: boolean) {
    if (this.graph.options.background == null || !onGraph) {
      this.scrollerImpl.backgroundManager.clear()
    }
    return this
  }

  isPannable() {
    return this.pannable
  }

  enablePanning() {
    if (!this.pannable) {
      this.options.pannable = true
      this.updateClassName()
    }
  }

  disablePanning() {
    if (this.pannable) {
      this.options.pannable = false
      this.updateClassName()
    }
  }

  togglePanning(pannable?: boolean) {
    if (pannable == null) {
      if (this.isPannable()) {
        this.disablePanning()
      } else {
        this.enablePanning()
      }
    } else if (pannable !== this.isPannable()) {
      if (pannable) {
        this.enablePanning()
      } else {
        this.disablePanning()
      }
    }

    return this
  }

  lockScroller() {
    this.scrollerImpl.lock()
    return this
  }

  unlockScroller() {
    this.scrollerImpl.unlock()
    return this
  }

  updateScroller() {
    this.scrollerImpl.update()
    return this
  }

  getScrollbarPosition() {
    return this.scrollerImpl.scrollbarPosition()
  }

  setScrollbarPosition(left?: number, top?: number) {
    this.scrollerImpl.scrollbarPosition(left, top)
    return this
  }

  scrollToPoint(x: number | null | undefined, y: number | null | undefined) {
    this.scrollerImpl.scrollToPoint(x, y)
    return this
  }

  scrollToContent() {
    this.scrollerImpl.scrollToContent()
    return this
  }

  scrollToCell(cell: Cell) {
    this.scrollerImpl.scrollToCell(cell)
    return this
  }

  transitionToPoint(p: PointLike, options?: TransitionOptions): this
  transitionToPoint(x: number, y: number, options?: TransitionOptions): this
  transitionToPoint(
    x: number | PointLike,
    y?: number | TransitionOptions,
    options?: TransitionOptions,
  ) {
    this.scrollerImpl.transitionToPoint(x as number, y as number, options)
    return this
  }

  transitionToRect(rect: RectangleLike, options: TransitionToRectOptions = {}) {
    this.scrollerImpl.transitionToRect(rect, options)
    return this
  }

  enableAutoResize() {
    this.scrollerImpl.enableAutoResize()
  }

  disableAutoResize() {
    this.scrollerImpl.disableAutoResize()
  }

  autoScroll(clientX: number, clientY: number) {
    return this.scrollerImpl.autoScroll(clientX, clientY)
  }

  clientToLocalPoint(x: number, y: number): Point {
    return this.scrollerImpl.clientToLocalPoint(x, y)
  }

  getVisibleArea(): Rectangle {
    return this.scrollerImpl.getVisibleArea()
  }

  isCellVisible(cell: Cell, options: { strict?: boolean } = {}) {
    return this.scrollerImpl.isCellVisible(cell, options)
  }

  isPointVisible(point: PointLike) {
    return this.scrollerImpl.isPointVisible(point)
  }

  // #endregion

  protected setup() {
    this.scrollerImpl.on('*', (name, args) => {
      this.trigger(name, args)
    })
  }

  protected startListening() {
    let eventTypes = []
    const pannable = this.options.pannable
    if (typeof pannable === 'object') {
      eventTypes = pannable.eventTypes || []
    } else {
      eventTypes = ['leftMouseDown']
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.on('blank:mousedown', this.preparePanning, this)
      this.graph.on('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.on('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      this.onRightMouseDown = this.onRightMouseDown.bind(this)
      Dom.Event.on(
        this.scrollerImpl.container,
        'mousedown',
        this.onRightMouseDown,
      )
    }
  }

  protected stopListening() {
    let eventTypes = []
    const pannable = this.options.pannable
    if (typeof pannable === 'object') {
      eventTypes = pannable.eventTypes || []
    } else {
      eventTypes = ['leftMouseDown']
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.off('blank:mousedown', this.preparePanning, this)
      this.graph.off('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.off('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      Dom.Event.off(
        this.scrollerImpl.container,
        'mousedown',
        this.onRightMouseDown,
      )
    }
  }

  protected onRightMouseDown(e: Dom.MouseDownEvent) {
    if (e.button === 2 && this.allowPanning(e, true)) {
      this.updateClassName(true)
      this.scrollerImpl.startPanning(e)
      this.scrollerImpl.once('pan:stop', () => this.updateClassName(false))
    }
  }

  protected preparePanning({ e }: { e: Dom.MouseDownEvent }) {
    const allowPanning = this.allowPanning(e, true)
    const selection = this.graph.getPlugin<any>('selection')
    const allowRubberband = selection && selection.allowRubberband(e, true)
    if (allowPanning || (this.allowPanning(e) && !allowRubberband)) {
      this.updateClassName(true)
      this.scrollerImpl.startPanning(e)
      this.scrollerImpl.once('pan:stop', () => this.updateClassName(false))

      if (this.graph.panning.pannable) {
        console.warn(
          'Detected that graph.panning and scroll panning are both enabled, which may cause unexpected behavior.',
        )
      }
    }
  }

  protected allowPanning(e: Dom.MouseDownEvent, strict?: boolean) {
    return (
      this.pannable && isModifierKeyMatch(e, this.options.modifiers, strict)
    )
  }

  protected updateClassName(isPanning?: boolean) {
    const container = this.scrollerImpl.container!
    const pannable = Config.prefix('graph-scroller-pannable')
    if (this.pannable) {
      Dom.addClass(container, pannable)
      container.dataset.panning = (!!isPanning).toString() // Use dataset to control scroller panning style to avoid reflow caused by changing classList
    } else {
      Dom.removeClass(container, pannable)
    }
  }

  @disposable()
  dispose() {
    this.scrollerImpl.dispose()
    this.stopListening()
    this.off()
    CssLoader.clean(this.name)
  }
}
