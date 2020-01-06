import { NumberExt } from '../../util'
import { DomUtil, DomEvent } from '../../dom'
import { Point, Rectangle } from '../../geometry'
import { Disablable } from '../../entity'
import { Graph } from '../../graph'
import { IMouseHandler, MouseEventEx } from '../../handler'
import { Shape, EllipseShape, RectangleShape, ImageShape } from '../../shape'
import { PartialOptions, FullOptions, getOptions } from './option'
import { MiniMapRenderder } from './renderer'

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
  private minX: number
  private minY: number
  private maxX: number
  private maxY: number

  private panHandler = () => {
    if (this.options.updateOnPan) {
      this.update()
    }
  }

  private updateHandler = () => {
    if (!this.suspended && !this.active) {
      this.update()
    }
  }

  private refreshHandler = () => {
    this.outline.refresh()
  }

  constructor(source: Graph, options: MiniMap.Options) {
    super()
    this.source = source
    this.options = getOptions(options)
    if (options.container != null) {
      this.init(options.container)
    }
  }

  init(container: HTMLElement) {
    const showEdge = this.options.showEdge
    const nodeStyle = this.options.nodeStyle
    const edgeStyle = this.options.edgeStyle
    const getCellStyle = this.options.getCellStyle

    this.outline = new Graph(container, {
      model: this.source.getModel(),
      grid: false,
      folding: false,
      autoScroll: false,
      pageScale: this.source.pageScale,
      pageFormat: this.source.pageFormat,
      pageVisible: this.source.pageVisible,
      labelsVisible: this.options.showLabel,
      backgroundColor:
        this.options.backgroundColor || this.source.backgroundColor,

      createRenderer: () => new MiniMapRenderder(),

      getCellStyle(cell) {
        if (cell != null) {
          const raw = this.model.getStyle(cell)
          const preset = this.model.isEdge(cell) ? edgeStyle : nodeStyle
          const fix = getCellStyle ? getCellStyle.call(this, cell) : null
          return {
            ...raw,
            ...preset,
            ...fix,
          }
        }

        return {}
      },

      isCellVisible(cell) {
        if (cell != null && cell.isEdge()) {
          return showEdge ? this.getNativeValue() : false
        }
      },
    })

    container.style.overflow = 'hidden'
    container.style.backgroundColor = DomUtil.getComputedStyle(
      this.source.container,
      'backgroundColor',
    )

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
    this.outline.addHandler(this)

    this.bounds = new Rectangle(0, 0, 0, 0)
    this.viewport = this.createViewport()
    this.sizer = this.createSizer()

    const handle = (e: MouseEvent) => {
      const target = DomEvent.getSource(e) as HTMLElement
      const move = (e: MouseEvent) => {
        this.outline.dispatchMouseEvent('mouseMove', new MouseEventEx(e))
      }
      const up = (e: MouseEvent) => {
        DomEvent.removeMouseListeners(target, null, move, up)
        DomEvent.removeMouseListeners(document, null, move, up)
        this.outline.dispatchMouseEvent('mouseUp', new MouseEventEx(e))
      }

      DomEvent.addMouseListeners(target, null, move, up)
      DomEvent.addMouseListeners(document, null, move, up)
      this.outline.dispatchMouseEvent('mouseDown', new MouseEventEx(e))
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
    Shape.applyClassName(
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
    Shape.applyClassName(
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

  protected updateConstraint() {
    const sView = this.source.view
    const oView = this.outline.view
    const factor = oView.scale / sView.scale
    const sContainer = this.source.container

    this.minX =
      (oView.translate.x - sView.translate.x - this.source.panX) * oView.scale
    this.minY =
      (oView.translate.y - sView.translate.y - this.source.panY) * oView.scale

    this.maxX =
      this.minX + (sContainer.scrollWidth - sContainer.clientWidth) * factor
    this.maxY =
      this.minY + (sContainer.scrollHeight - sContainer.clientHeight) * factor

    if (this.viewport.dialect === 'svg') {
      const adjust = this.options.viewport.strokeWidth / 2
      this.minX += adjust
      this.maxX -= adjust
      this.minY += adjust
      this.maxY -= adjust
    }
  }

  protected updateBounds() {
    const sView = this.source.view
    const oView = this.outline.view
    const factor = oView.scale / sView.scale

    this.bounds.x = 0
    this.bounds.y = 0
    const pos = this.getPosition(
      (oView.translate.x - sView.translate.x - this.source.panX) * oView.scale +
        this.source.container.scrollLeft * factor,
      (oView.translate.y - sView.translate.y - this.source.panY) * oView.scale +
        this.source.container.scrollTop * factor,
    )

    this.bounds = new Rectangle(
      pos.x,
      pos.y,
      this.source.container.clientWidth * factor,
      this.source.container.clientHeight * factor,
    )
  }

  protected getPosition(dx: number, dy: number) {
    let x = this.bounds.x + dx
    let y = this.bounds.y + dy
    if (this.options.constrained) {
      x = NumberExt.clamp(x, this.minX, this.maxX)
      y = NumberExt.clamp(y, this.minY, this.maxY)
    }

    return { x, y }
  }

  protected updateViewport(bounds: Rectangle = this.bounds) {
    if (!this.viewport.bounds.equals(bounds)) {
      this.viewport.bounds = bounds
      this.viewport.redraw()
    }
  }

  protected updateSizer(bounds: Rectangle = this.bounds) {
    const old = this.sizer.bounds
    const next = new Rectangle(
      bounds.x + bounds.width - old.width / 2,
      bounds.y + bounds.height - old.height / 2,
      old.width,
      old.height,
    )

    if (!old.equals(next)) {
      this.sizer.bounds = next
      this.sizer.redraw()
    }
  }

  protected getDelta(e: MouseEventEx) {
    return {
      dx: e.getClientX() - this.startX,
      dy: e.getClientY() - this.startY,
    }
  }

  enableZoom() {
    this.options.sizer.visible = true
    this.sizer.elem!.style.display = ''
  }

  disableZoom() {
    this.options.sizer.visible = false
    this.sizer.elem!.style.display = 'none'
  }

  refresh() {
    this.update(true)
  }

  update(revalidate: boolean = false) {
    if (
      this.source != null &&
      this.outline != null &&
      this.source.container != null &&
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

      const size = this.getSourceContainerSize()
      const completeWidth = Math.max(size.width / sourceScale, union.width)
      const completeHeight = Math.max(size.height / sourceScale, union.height)
      const availableWidth = Math.max(0, oContainer.clientWidth)
      const availableHeight = Math.max(0, oContainer.clientHeight)

      let outlineScale = Math.min(
        availableWidth / completeWidth,
        availableHeight / completeHeight,
      )

      outlineScale = isNaN(outlineScale)
        ? this.options.minScale
        : Math.max(this.options.minScale, outlineScale)

      if (outlineScale > 0) {
        if (this.outline.view.scale !== outlineScale) {
          this.outline.view.scale = outlineScale
          revalidate = true // tslint:disable-line
        }

        if (oView.currentRoot !== sView.currentRoot) {
          oView.setCurrentRoot(sView.currentRoot)
        }

        const t = sView.translate
        let tx = t.x + this.source.panX
        let ty = t.y + this.source.panY

        const offset = this.getOutlineOffset(outlineScale)
        if (offset != null) {
          tx += offset.x
          ty += offset.y
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

        this.updateConstraint()
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
        DomUtil.hasScrollbars(this.source.container)
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

  mouseMove(e: MouseEventEx) {
    if (!this.active) {
      return
    }

    if (!this.options.viewport.visible) {
      this.viewport.elem!.style.display = 'none'
    }

    if (!this.options.viewport.visible || !this.options.sizer.visible) {
      this.sizer.elem!.style.display = 'none'
    }

    const delta = this.getDelta(e)
    let dx = delta.dx
    let dy = delta.dy
    let bounds = null

    if (this.zooming) {
      const container = this.source.container
      const viewRatio = container.clientWidth / container.clientHeight
      dy = dx / viewRatio
      bounds = new Rectangle(
        this.bounds.x,
        this.bounds.y,
        Math.max(1, this.bounds.width + dx),
        Math.max(1, this.bounds.height + dy),
      )
    } else {
      const pos = this.getPosition(dx, dy)
      bounds = new Rectangle(
        pos.x,
        pos.y,
        this.bounds.width,
        this.bounds.height,
      )
      const factor = this.source.view.scale / this.outline.view.scale
      dx *= factor
      dy *= factor
      this.source.pan(this.scrollLeft + dx, this.scrollTop + dy)
    }

    this.updateViewport(bounds)
    this.updateSizer(bounds)

    e.consume()
  }

  mouseUp(e: MouseEventEx) {
    if (!this.active) {
      return
    }

    const delta = this.getDelta(e)
    let dx = delta.dx
    let dy = delta.dy

    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      if (this.zooming) {
        const scale = this.source.view.scale
        const width = this.viewport.bounds.width
        this.source.zoomTo(
          Math.max(this.options.minScale, scale - (dx * scale) / width),
          false,
        )
      } else {
        if (
          !this.source.useScrollbarsForPanning ||
          !DomUtil.hasScrollbars(this.source.container)
        ) {
          this.source.pan(0, 0)
          dx /= this.outline.view.scale
          dy /= this.outline.view.scale
          const t = this.source.view.translate
          this.source.view.setTranslate(t.x - dx, t.y - dy)
        }
      }

      this.update()
      e.consume()
    }

    this.active = false
  }

  @Disablable.dispose()
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
      this.outline.removeHandler(this)
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

export namespace MiniMap {
  export interface Options extends PartialOptions {}
}
