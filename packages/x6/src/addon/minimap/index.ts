import * as util from '../../util'
import { Graph } from '../../graph'
import { IMouseHandler } from '../../handler'
import { Rectangle, Point } from '../../struct'
import { Disablable, DomEvent, Disposable, MouseEventEx } from '../../common'
import { Shape, EllipseShape, RectangleShape, ImageShape } from '../../shape'
import { Options, FullOptions, getOptions } from './util'

export class MiniMap extends Disablable implements IMouseHandler {
  public source: Graph
  public outline: Graph
  public options: FullOptions
  public suspended: boolean

  private bounds: Rectangle
  private sizer: Shape
  private viewport: Shape

  private active: boolean
  private zooming: boolean
  private startX: number
  private startY: number
  private scrollLeft: number
  private scrollTop: number

  private panHandler: () => void
  private updateHandler: () => void
  private refreshHandler: () => void

  constructor(source: Graph, options: Options) {
    super()

    this.source = source
    this.options = getOptions(options)

    this.panHandler = () => {
      if (this.options.updateOnPan) {
        this.update()
      }
    }

    this.updateHandler = () => {
      if (!this.suspended && !this.active) {
        this.update()
      }
    }

    this.refreshHandler = () => {
      this.outline.refresh()
    }

    if (options.container != null) {
      this.init(options.container)
    }
  }

  enableZoom() {}

  disableZoom() {}

  refresh() {
    this.update(true)
  }

  init(container: HTMLElement) {
    this.outline = new Graph(container, {
      model: this.source.getModel(),
      folding: false,
      autoScroll: false,
      grid: false,
      pageScale: this.source.pageScale,
      pageFormat: this.source.pageFormat,
      pageVisible: this.source.pageVisible,
      backgroundColor: this.source.backgroundColor,

      labelsVisible: this.options.showLabel,
      nodeStyle: { ...this.options.nodeStyle },
      edgeStyle: { ...this.options.edgeStyle },
    })

    container.style.backgroundColor = util.getComputedStyle(
      this.source.container,
      'backgroundColor',
    )

    if (this.outline.dialect === 'svg') {
      const svg = this.outline.view.getStage()!.parentNode as SVGSVGElement
      svg.setAttribute('shape-rendering', 'optimizeSpeed')
      svg.setAttribute('image-rendering', 'optimizeSpeed')
    }

    this.source.on('pan', this.panHandler)
    this.source.on('refresh', this.refreshHandler)
    this.source.view.on('scale', this.updateHandler)
    this.source.view.on('translate', this.updateHandler)
    this.source.view.on('scaleAndTranslate', this.updateHandler)
    this.source.view.on('up', this.updateHandler)
    this.source.view.on('down', this.updateHandler)
    this.source.model.on('change', this.updateHandler)
    DomEvent.addListener(this.source.container, 'scroll', this.updateHandler)

    this.outline.disable()
    this.outline.addMouseListener(this)

    this.bounds = new Rectangle(0, 0, 0, 0)
    this.viewport = this.createViewport()
    this.sizer = this.createSizer()

    const handle = (e: MouseEvent) => {
      const target = DomEvent.getSource(e) as HTMLElement
      const move = (e: MouseEvent) => {
        this.outline.fireMouseEvent('mouseMove', new MouseEventEx(e))
      }
      const up = (e: MouseEvent) => {
        DomEvent.removeMouseListeners(target, null, move, up)
        this.outline.fireMouseEvent('mouseUp', new MouseEventEx(e))
      }

      DomEvent.addMouseListeners(target, null, move, up)
      this.outline.fireMouseEvent('mouseDown', new MouseEventEx(e))
    }

    DomEvent.addMouseListeners(this.sizer.elem!, handle)
    DomEvent.addMouseListeners(this.viewport.elem!, handle)

    this.update(false)
  }

  protected createViewport() {
    const options = this.options.viewport
    const viewport = new RectangleShape(this.bounds)
    viewport.dialect = this.outline.dialect
    viewport.init(this.outline.view.getOverlayPane())
    util.applyClassName(
      viewport,
      this.source.prefixCls,
      'minimap-viewport',
      options.className,
    )

    viewport.dashed = options.dashed
    viewport.strokeWidth = options.strokeWidth
    viewport.strokeColor = options.strokeColor
    viewport.strokeOpacity = options.strokeOpacity
    viewport.fillColor = options.fillColor
    viewport.fillOpacity = options.fillOpacity

    const style = viewport.elem!.style

    if (this.enabled) {
      style.cursor = 'move'
    }

    if (!this.options.viewport.visible) {
      style.display = 'none'
    }

    return viewport
  }

  protected createSizer() {
    let sizer: Shape
    const options = this.options.sizer
    const image = options.image
    if (image != null) {
      sizer = new ImageShape(
        new Rectangle(0, 0, image.width, image.height),
        image.src,
      )
    } else {
      const ctor = Shape.getShape(this.options.sizer.shape) || EllipseShape
      sizer = new ctor() as Shape
      sizer.bounds = new Rectangle(0, 0, options.size, options.size)
      sizer.dashed = options.dashed
      sizer.strokeWidth = options.strokeWidth
      sizer.strokeColor = options.strokeColor
      sizer.strokeOpacity = options.strokeOpacity
      sizer.fillColor = options.fillColor
      sizer.fillOpacity = options.fillOpacity
    }

    sizer.dialect = this.outline.dialect
    sizer.init(this.outline.view.getOverlayPane())
    util.applyClassName(
      sizer,
      this.source.prefixCls,
      'minimap-sizer',
      options.className,
    )

    const style = sizer.elem!.style

    if (this.enabled) {
      style.cursor = 'nwse-resize'
    }

    if (!this.options.viewport.visible || !this.options.sizer.visible) {
      style.display = 'none'
    }

    return sizer
  }

  protected getSourceGraphBounds() {
    return this.source.getGraphBounds()
  }

  protected getSourceContainerSize() {
    return {
      width: this.source.container.scrollWidth,
      height: this.source.container.scrollHeight,
    }
  }

  protected getOutlineOffset(scale: number): Point | Point.PointLike | null {
    return null
  }

  protected updateBounds() {
    const sView = this.source.view
    const oView = this.outline.view
    const sizeFactor = sView.scale / oView.scale
    const scaleFactor = 1.0 / oView.scale

    this.bounds = new Rectangle(
      (oView.translate.x - sView.translate.x - this.source.panX) / scaleFactor,
      (oView.translate.y - sView.translate.y - this.source.panY) / scaleFactor,
      this.source.container.clientWidth / sizeFactor,
      this.source.container.clientHeight / sizeFactor,
    )

    this.bounds.x += this.source.container.scrollLeft / scaleFactor
    this.bounds.y += this.source.container.scrollTop / scaleFactor
  }

  protected updateSizer(bounds: Rectangle = this.bounds) {
    const prev = this.sizer.bounds
    const next = new Rectangle(
      bounds.x + bounds.width - prev.width / 2,
      bounds.y + bounds.height - prev.height / 2,
      prev.width,
      prev.height,
    )

    if (
      prev.x !== next.x ||
      prev.y !== next.y ||
      prev.width !== next.width ||
      prev.height !== next.height
    ) {
      this.sizer.bounds = next
      this.sizer.redraw()
    }
  }

  protected updateViewport() {
    const b = this.viewport.bounds
    if (
      b.x !== this.bounds.x ||
      b.y !== this.bounds.y ||
      b.width !== this.bounds.width ||
      b.height !== this.bounds.height
    ) {
      this.viewport.bounds = this.bounds
      this.viewport.redraw()
    }
  }

  update(revalidate: boolean = false) {
    if (
      this.source != null &&
      this.source.container != null &&
      this.outline != null &&
      this.outline.container != null
    ) {
      const sView = this.source.view
      const oView = this.outline.view
      const sContainer = this.source.container
      const oContainer = this.outline.container

      const sourceScale = sView.scale
      const scaledGraphBounds = this.getSourceGraphBounds()
      const unscaledGraphBounds = new Rectangle(
        scaledGraphBounds.x / sourceScale + this.source.panX,
        scaledGraphBounds.y / sourceScale + this.source.panY,
        scaledGraphBounds.width / sourceScale,
        scaledGraphBounds.height / sourceScale,
      )

      const unscaledFinderBounds = new Rectangle(
        0,
        0,
        sContainer.clientWidth / sourceScale,
        sContainer.clientHeight / sourceScale,
      )

      const union = unscaledGraphBounds.clone()
      union.add(unscaledFinderBounds)

      // Zooms to the scrollable area if that is bigger than the graph
      const size = this.getSourceContainerSize()
      const completeWidth = Math.max(size.width / sourceScale, union.width)
      const completeHeight = Math.max(size.height / sourceScale, union.height)

      const border = this.options.border
      const availableWidth = Math.max(0, oContainer.clientWidth - border)
      const availableHeight = Math.max(0, oContainer.clientHeight - border)

      const outlineScale = Math.min(
        availableWidth / completeWidth,
        availableHeight / completeHeight,
      )

      const scale = isNaN(outlineScale)
        ? this.options.minScale
        : Math.max(this.options.minScale, outlineScale)

      if (scale > 0) {
        if (this.outline.view.scale !== scale) {
          this.outline.view.scale = scale
          revalidate = true // tslint:disable-line
        }

        if (oView.currentRoot !== sView.currentRoot) {
          oView.setCurrentRoot(sView.currentRoot)
        }

        const t = sView.translate
        let tx = t.x + this.source.panX
        let ty = t.y + this.source.panY

        const off = this.getOutlineOffset(scale)
        if (off != null) {
          tx += off.x
          ty += off.y
        }

        if (unscaledGraphBounds.x < 0) {
          tx = tx - unscaledGraphBounds.x
        }
        if (unscaledGraphBounds.y < 0) {
          ty = ty - unscaledGraphBounds.y
        }

        if (oView.translate.x !== tx || oView.translate.y !== ty) {
          oView.translate.x = tx
          oView.translate.y = ty
          revalidate = true // tslint:disable-line
        }

        this.updateBounds()
        this.updateViewport()
        this.updateSizer()

        if (revalidate) {
          this.outline.view.revalidate()
        }
      }
    }
  }

  mouseDown(e: MouseEventEx) {
    if (this.enabled && this.options.viewport.visible) {
      const tol = !DomEvent.isMouseEvent(e.getEvent())
        ? this.source.tolerance
        : 0
      const hit =
        tol > 0
          ? new Rectangle(
              e.getGraphX() - tol,
              e.getGraphY() - tol,
              2 * tol,
              2 * tol,
            )
          : null

      this.zooming =
        e.isSource(this.sizer) ||
        (hit != null && this.sizer.bounds.isIntersectWith(hit))
      this.startX = e.getClientX()
      this.startY = e.getClientY()
      this.active = true

      if (
        this.source.useScrollbarsForPanning &&
        util.hasScrollbars(this.source.container)
      ) {
        this.scrollLeft = this.source.container.scrollLeft
        this.scrollTop = this.source.container.scrollTop
      } else {
        this.scrollLeft = 0
        this.scrollTop = 0
      }
    }

    e.consume()
  }

  getDelta(e: MouseEventEx) {
    return new Point(e.getClientX() - this.startX, e.getClientY() - this.startY)
  }

  mouseMove(e: MouseEventEx) {
    if (this.active) {
      if (!this.options.viewport.visible) {
        this.viewport.elem!.style.display = 'none'
      }

      if (!this.options.viewport.visible || !this.options.sizer.visible) {
        this.sizer.elem!.style.display = 'none'
      }

      const delta = this.getDelta(e)
      let dx = delta.x
      let dy = delta.y
      let bounds = null

      if (!this.zooming) {
        bounds = new Rectangle(
          this.bounds.x + dx,
          this.bounds.y + dy,
          this.bounds.width,
          this.bounds.height,
        )
        this.viewport.bounds = bounds
        this.viewport.redraw()
        dx /= this.outline.view.scale
        dx *= this.source.view.scale
        dy /= this.outline.view.scale
        dy *= this.source.view.scale
        this.source.pan(-dx - this.scrollLeft, -dy - this.scrollTop)
      } else {
        const container = this.source.container
        const viewRatio = container.clientWidth / container.clientHeight
        dy = dx / viewRatio
        bounds = new Rectangle(
          this.bounds.x,
          this.bounds.y,
          Math.max(1, this.bounds.width + dx),
          Math.max(1, this.bounds.height + dy),
        )
        this.viewport.bounds = bounds
        this.viewport.redraw()
      }

      this.updateSizer(bounds)

      e.consume()
    }
  }

  mouseUp(e: MouseEventEx) {
    if (this.active) {
      const delta = this.getDelta(e)
      let dx = delta.x
      let dy = delta.y

      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        if (!this.zooming) {
          if (
            !this.source.useScrollbarsForPanning ||
            !util.hasScrollbars(this.source.container)
          ) {
            this.source.pan(0, 0)
            dx /= this.outline.view.scale
            dy /= this.outline.view.scale
            const t = this.source.view.translate
            this.source.view.setTranslate(t.x - dx, t.y - dy)
          }
        } else {
          const width = this.viewport.bounds.width
          const scale = this.source.view.scale
          this.source.zoomTo(
            Math.max(this.options.minScale, scale - (dx * scale) / width),
            false,
          )
        }

        this.update()
        e.consume()
      }

      this.active = false
    }
  }

  @Disposable.aop()
  dispose() {
    if (this.source != null) {
      this.source.off(null, this.panHandler)
      this.source.off(null, this.refreshHandler)
      this.source.view.off(null, this.updateHandler)
      this.source.model.off(null, this.updateHandler)
      DomEvent.removeListener(
        this.source.container,
        'scroll',
        this.updateHandler,
      )

      delete this.source
    }

    if (this.outline != null) {
      this.outline.removeMouseListener(this)
      this.outline.dispose()
      delete this.outline
    }

    if (this.viewport != null) {
      this.viewport.dispose()
      delete this.viewport
    }

    if (this.sizer != null) {
      this.sizer.dispose()
      delete this.sizer
    }
  }
}

export namespace MiniMap {}
