import { Color } from '../../util'
import { DomUtil, DomEvent } from '../../dom'
import { Angle, Point, Rectangle } from '../../geometry'
import { Disposable } from '../../entity'
import { Cell } from '../../core/cell'
import { State } from '../../core/state'
import { Handle } from '../handle'
import { NodeHandler } from './handler'
import { MouseEventEx } from '../mouse-event'
import { RectangleShape } from '../../shape'
import { EdgeHandler } from '../edge/handler'
import { applyResizePreviewStyle } from './option-resize'
import { applyRotatePreviewStyle } from './option-rotation'
import {
  getSelectionPreviewCursor,
  applySelectionPreviewStyle,
} from './option-selection'

export class Preview extends Disposable {
  /**
   * Specifies if the parent should be highlighted if a child cell is selected.
   *
   * Default is `false`.
   */
  parentHighlightable: boolean

  /**
   * Specifies if the size of groups should be constrained by the children.
   *
   * Default is `true`.
   */
  constrainGroupByChildren: boolean

  /**
   * Specifies if rotation steps should be "rasterized" depening on the
   * distance to the handle.
   *
   * Default is `true`.
   */
  rotationRaster: boolean

  resizeLivePreview: boolean

  startX: number
  startY: number
  bounds: Rectangle
  protected x0: number
  protected y0: number
  protected minBounds: Rectangle | null
  protected unscaledBounds: Rectangle | null
  protected currentDeg: number | null
  protected inTolerance: boolean

  protected selectionShape: RectangleShape | null
  protected previewShape: RectangleShape | null
  protected parentHighlight: RectangleShape | null
  protected edgeHandlers: EdgeHandler[] | null

  protected childOffsetX: number
  protected childOffsetY: number
  protected parentState: State | null
  protected overlayCursor: string | null

  constructor(public master: NodeHandler) {
    super()
    this.config()
    this.init()
  }

  protected get graph() {
    return this.master.graph
  }

  protected get state() {
    return this.master.state
  }

  protected config() {
    const options = this.graph.options
    this.rotationRaster = options.rotate.rasterized
    this.resizeLivePreview = options.resize.livePreview
    this.parentHighlightable = options.selectionPreview.highlightParent
    this.constrainGroupByChildren = options.resize.constrainByChildren
  }

  protected init() {
    this.initSelectionShape()
    if (this.constrainGroupByChildren) {
      this.updateMinBounds()
    }
  }

  protected initSelectionShape() {
    this.updateBounds()
    this.selectionShape = this.createSelectionShape(this.bounds)
    this.selectionShape.pointerEvents = false
    this.selectionShape.rotation = State.getRotation(this.state)
    this.selectionShape.init(this.graph.view.getOverlayPane())

    MouseEventEx.redirectMouseEvents(
      this.selectionShape.elem,
      this.graph,
      this.state,
    )

    if (this.graph.isCellMovable(this.state.cell)) {
      const cursor = getSelectionPreviewCursor({
        graph: this.graph,
        cell: this.state.cell,
        shape: this.selectionShape,
      })
      this.selectionShape.setCursor(cursor)
    }
  }

  protected createSelectionShape(bounds: Rectangle) {
    return applySelectionPreviewStyle({
      graph: this.graph,
      cell: this.state.cell,
      shape: new RectangleShape(bounds),
    }) as RectangleShape
  }

  protected createResizePreview(bounds: Rectangle) {
    return applyResizePreviewStyle({
      graph: this.graph,
      cell: this.state.cell,
      shape: new RectangleShape(bounds),
    }) as RectangleShape
  }

  protected createRotatePreview(bounds: Rectangle) {
    return applyRotatePreviewStyle({
      graph: this.graph,
      cell: this.state.cell,
      shape: new RectangleShape(bounds),
    }) as RectangleShape
  }

  protected createParentHighlight(bounds: Rectangle) {
    return this.createSelectionShape(bounds)
  }

  protected updateParentHighlight() {
    if (this.selectionShape != null) {
      if (this.parentHighlight != null) {
        const parent = this.graph.model.getParent(this.state.cell)
        if (this.graph.model.isNode(parent)) {
          const pstate = this.graph.view.getState(parent)
          const bounds = this.parentHighlight.bounds
          if (pstate != null && !bounds.equals(pstate.bounds)) {
            this.parentHighlight.bounds = pstate.bounds.clone()
            this.parentHighlight.redraw()
          }
        } else {
          this.parentHighlight.dispose()
          this.parentHighlight = null
        }
      } else if (this.parentHighlightable) {
        const parent = this.graph.model.getParent(this.state.cell)
        if (this.graph.model.isNode(parent)) {
          const pstate = this.graph.view.getState(parent)
          if (pstate != null) {
            this.parentHighlight = this.createParentHighlight(pstate.bounds)
            this.parentHighlight.dialect = 'svg'
            this.parentHighlight.pointerEvents = false
            this.parentHighlight.rotation = State.getRotation(pstate)
            this.parentHighlight.init(this.graph.view.getOverlayPane())
          }
        }
      }
    }
  }

  protected hideSelectionShape() {
    DomUtil.hide(this.selectionShape!.elem)
  }

  protected showSelectionShape() {
    DomUtil.show(this.selectionShape!.elem)
  }

  protected updateMinBounds() {
    const children = this.graph.getVisibleChildren(this.state.cell)
    if (children.length > 0) {
      this.minBounds = this.graph.view.getBounds(children)
      if (this.minBounds != null) {
        const s = this.state.view.scale
        const t = this.state.view.translate

        this.minBounds.x -= this.state.bounds.x
        this.minBounds.y -= this.state.bounds.y
        this.minBounds.x /= s
        this.minBounds.y /= s
        this.minBounds.width /= s
        this.minBounds.height /= s

        this.x0 = this.state.bounds.x / s - t.x
        this.y0 = this.state.bounds.y / s - t.y
      }
    }
  }

  protected updateLivePreview(e: MouseEventEx) {
    const s = this.graph.view.scale
    const t = this.graph.view.translate

    // Saves current state
    const tempState = this.state.clone()

    // Temporarily changes size and origin
    this.state.bounds.update(this.bounds)
    this.state.origin = new Point(
      this.state.bounds.x / s - t.x,
      this.state.bounds.y / s - t.y,
    )

    // Needed to force update of text bounds
    this.state.unscaledWidth = null

    // Redraws cell and handles
    // const off = this.state.absoluteOffset.clone()

    // Required to store and reset absolute offset for updating label position
    this.state.absoluteOffset.x = 0
    this.state.absoluteOffset.y = 0
    const geo = this.graph.getCellGeometry(this.state.cell)

    if (geo != null) {
      const offset = geo.offset
      if (offset != null && !geo.relative) {
        this.state.absoluteOffset.x = s * offset.x
        this.state.absoluteOffset.y = s * offset.y
      }

      this.state.view.updateNodeLabelOffset(this.state)
    }

    this.redrawLivePreview()
    this.master.redrawKnobs()

    // Restores current state
    this.state.setState(tempState)
  }

  redrawLivePreview() {
    this.state.view.graph.renderer.redraw(this.state, true)
    this.state.view.invalidate(this.state.cell)
    this.state.invalid = false
    this.state.view.validate()
  }

  protected isUnapparent() {
    return (
      // returns true if the shape is transparent.
      this.state.shape != null &&
      !Color.isValid(this.state.shape.fillColor) &&
      !Color.isValid(this.state.shape.strokeColor)
    )
  }

  protected isCentered(cell: Cell, e: MouseEventEx) {
    const options = this.graph.options.resize
    if (typeof options.centered === 'function') {
      return options.centered.call(this.graph, cell, e)
    }
    return options.centered
  }

  protected roundAngle(angle: number) {
    return Math.round(angle * 10) / 10
  }

  protected union(
    bounds: Rectangle,
    dx: number,
    dy: number,
    index: number,
    gridEnabled: boolean,
    scale: number,
    tr: Point,
    constrained: boolean,
    centered: boolean,
  ) {
    if (this.master.knobs.singleResizeHandle) {
      let x = bounds.x + bounds.width + dx
      let y = bounds.y + bounds.height + dy

      if (gridEnabled) {
        x = this.graph.snap(x / scale) * scale
        y = this.graph.snap(y / scale) * scale
      }

      const rect = new Rectangle(bounds.x, bounds.y, 0, 0)
      rect.add(new Rectangle(x, y, 0, 0))

      return rect
    }

    const w0 = bounds.width
    const h0 = bounds.height
    let left = bounds.x - tr.x * scale
    let right = left + w0
    let top = bounds.y - tr.y * scale
    let bottom = top + h0

    const cx = left + w0 / 2
    const cy = top + h0 / 2

    if (index > 4) {
      bottom = bottom + dy

      if (gridEnabled) {
        bottom = this.graph.snap(bottom / scale) * scale
      }
    } else if (index < 3) {
      top = top + dy

      if (gridEnabled) {
        top = this.graph.snap(top / scale) * scale
      }
    }

    if (index === 0 || index === 3 || index === 5) {
      left += dx

      if (gridEnabled) {
        left = this.graph.snap(left / scale) * scale
      }
    } else if (index === 2 || index === 4 || index === 7) {
      right += dx

      if (gridEnabled) {
        right = this.graph.snap(right / scale) * scale
      }
    }

    let width = right - left
    let height = bottom - top

    if (constrained) {
      const geo = this.graph.getCellGeometry(this.state.cell)

      if (geo != null) {
        const aspect = geo.bounds.width / geo.bounds.height

        if (index === 1 || index === 2 || index === 7 || index === 6) {
          width = height * aspect
        } else {
          height = width / aspect
        }

        if (index === 0) {
          left = right - width
          top = bottom - height
        }
      }
    }

    if (centered) {
      width += width - w0
      height += height - h0

      const cdx = cx - (left + width / 2)
      const cdy = cy - (top + height / 2)

      left += cdx
      top += cdy
      right += cdx
      bottom += cdy
    }

    // Flips over left side
    if (width < 0) {
      left += width
      width = Math.abs(width)
    }

    // Flips over top side
    if (height < 0) {
      top += height
      height = Math.abs(height)
    }

    const result = new Rectangle(
      left + tr.x * scale,
      top + tr.y * scale,
      width,
      height,
    )

    if (this.minBounds != null) {
      result.width = Math.max(
        result.width,
        this.minBounds.x * scale +
          this.minBounds.width * scale +
          Math.max(0, this.x0 * scale - result.x),
      )

      result.height = Math.max(
        result.height,
        this.minBounds.y * scale +
          this.minBounds.height * scale +
          Math.max(0, this.y0 * scale - result.y),
      )
    }

    return result
  }

  start(startX: number, startY: number) {
    if (this.selectionShape != null) {
      this.inTolerance = true
      this.startX = startX
      this.startY = startY
      this.childOffsetX = 0
      this.childOffsetY = 0

      // Saves reference to parent state
      const model = this.state.view.graph.model
      const parent = model.getParent(this.state.cell)

      if (
        this.state.view.currentRoot !== parent &&
        (model.isNode(parent) || model.isEdge(parent))
      ) {
        this.parentState = this.graph.view.getState(parent)
      }

      return true
    }
    return false
  }

  canMove(e: MouseEventEx) {
    if (this.inTolerance && this.startX != null && this.startY != null) {
      if (
        DomEvent.isMouseEvent(e.getEvent()) ||
        Math.abs(e.getGraphX() - this.startX) > this.graph.tolerance ||
        Math.abs(e.getGraphY() - this.startY) > this.graph.tolerance
      ) {
        this.inTolerance = false
      }
    }

    return !this.inTolerance
  }

  isLivePreview() {
    return this.resizeLivePreview
  }

  ensurePreview() {
    if (this.previewShape != null) {
      return
    }

    const livePreview = this.isLivePreview()
    const index = this.master.index!
    const isRotate = Handle.isRotationHandle(index)
    const isResize =
      !isRotate && !Handle.isCustomHandle(index) && !Handle.isLabelHandle(index)

    this.hideSelectionShape()
    if (isResize && (!this.resizeLivePreview || this.isUnapparent())) {
      this.previewShape = this.createResizePreview(this.bounds)
    } else if (isRotate) {
      this.previewShape = this.createRotatePreview(this.bounds)
    }

    if (this.previewShape) {
      if (State.hasHtmlLabel(this.state)) {
        this.previewShape.dialect = 'html'
        this.previewShape.init(this.graph.container)
      } else {
        this.previewShape.dialect = 'svg'
        this.previewShape.init(this.graph.view.getOverlayPane())
      }
    }

    // Prepares the handles for live preview
    if (livePreview) {
      this.master.knobs.showActiveHandle(index)

      // Gets the array of connected edge handlers for redrawing
      this.edgeHandlers = []
      const edges = this.graph.getEdges(this.state.cell)
      for (let i = 0, ii = edges.length; i < ii; i += 1) {
        const handler = (this.graph.selectionHandler.getHandler(
          edges[i],
        ) as any) as EdgeHandler
        if (handler != null) {
          this.edgeHandlers.push(handler)
        }
      }
    }
  }

  getStateBounds() {
    return this.state.bounds.round()
  }

  updateBounds() {
    this.bounds = this.getStateBounds()
  }

  drawPreview() {
    const rotation = this.getRotationForRedraw()

    if (this.previewShape != null) {
      this.previewShape.bounds = this.bounds
      // html
      if (this.previewShape.elem!.parentNode === this.graph.container) {
        this.previewShape.bounds.width = Math.max(
          0,
          this.previewShape.bounds.width - 1,
        )
        this.previewShape.bounds.height = Math.max(
          0,
          this.previewShape.bounds.height - 1,
        )
      }

      this.previewShape.rotation = rotation
      this.previewShape.redraw()
    }

    if (this.selectionShape) {
      this.selectionShape.rotation = rotation
      this.selectionShape.bounds = this.bounds
      this.selectionShape.redraw()
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.redraw()
    }
  }

  refresh() {
    if (this.selectionShape != null) {
      this.selectionShape.rotation = State.getRotation(this.state)
    }

    if (this.edgeHandlers != null) {
      this.edgeHandlers.forEach(h => h.redraw())
    }

    this.updateParentHighlight()
  }

  rotate(e: MouseEventEx) {
    const p = new Point(e.getGraphX(), e.getGraphY())
    const dx = this.state.bounds.getCenterX() - p.x
    const dy = this.state.bounds.getCenterY() - p.y

    this.currentDeg =
      dx !== 0 ? (Math.atan(dy / dx) * 180) / Math.PI + 90 : dy < 0 ? 180 : 0

    if (dx > 0) {
      this.currentDeg -= 180
    }

    // Rotation raster
    if (this.rotationRaster && this.graph.isGridEnabledForEvent(e.getEvent())) {
      const dx = p.x - this.state.bounds.getCenterX()
      const dy = p.y - this.state.bounds.getCenterY()
      const dist = Math.abs(Math.sqrt(dx * dx + dy * dy) - 20) * 3
      const raster = Math.max(
        1,
        5 * Math.min(3, Math.max(0, Math.round(80 / Math.abs(dist)))),
      )

      this.currentDeg = Math.round(this.currentDeg / raster) * raster
    } else {
      this.currentDeg = this.roundAngle(this.currentDeg)
    }

    if (this.previewShape) {
      this.drawPreview()
    }

    this.master.redrawKnobs()
  }

  resize(e: MouseEventEx) {
    const t = this.graph.view.translate
    const s = this.graph.view.scale
    const p = e.getGraphPos()
    const c = this.state.bounds.getCenter()
    const geo = this.graph.getCellGeometry(this.state.cell)!
    const rad = Angle.toRad(State.getRotation(this.state))

    let cos = Math.cos(-rad)
    let sin = Math.sin(-rad)

    let dx = p.x - this.startX
    let dy = p.y - this.startY

    // Rotates vector for mouse gesture
    dx = cos * dx - sin * dy
    dy = sin * dx + cos * dy

    this.unscaledBounds = this.union(
      geo.bounds,
      dx / s,
      dy / s,
      this.master.index!,
      this.graph.isGridEnabledForEvent(e.getEvent()),
      1,
      new Point(0, 0),
      this.master.isConstrained(e),
      this.isCentered(this.state.cell, e),
    )

    // Keeps node within maximum graph or parent bounds
    if (!geo.relative) {
      let max = this.graph.getMaxGraphBounds()

      // Handles child cells
      if (max != null && this.parentState != null) {
        max = max.clone()
        max.x -= this.parentState.bounds.x / s - t.x
        max.y -= this.parentState.bounds.y / s - t.y
      }

      if (this.graph.isConstrainChild(this.state.cell)) {
        let tmp = this.graph.sizeManager.getCellContainmentArea(this.state.cell)
        if (tmp != null) {
          const overlap = this.graph.getOverlap(this.state.cell)

          if (overlap > 0) {
            tmp = tmp.clone()

            tmp.x -= tmp.width * overlap
            tmp.y -= tmp.height * overlap
            tmp.width += 2 * tmp.width * overlap
            tmp.height += 2 * tmp.height * overlap
          }

          if (max == null) {
            max = tmp
          } else {
            max = max.intersect(tmp)
          }
        }
      }

      if (max != null) {
        if (this.unscaledBounds.x < max.x) {
          this.unscaledBounds.width -= max.x - this.unscaledBounds.x
          this.unscaledBounds.x = max.x
        }

        if (this.unscaledBounds.y < max.y) {
          this.unscaledBounds.height -= max.y - this.unscaledBounds.y
          this.unscaledBounds.y = max.y
        }

        if (
          this.unscaledBounds.x + this.unscaledBounds.width >
          max.x + max.width
        ) {
          this.unscaledBounds.width -=
            this.unscaledBounds.x +
            this.unscaledBounds.width -
            max.x -
            max.width
        }

        if (
          this.unscaledBounds.y + this.unscaledBounds.height >
          max.y + max.height
        ) {
          this.unscaledBounds.height -=
            this.unscaledBounds.y +
            this.unscaledBounds.height -
            max.y -
            max.height
        }
      }
    }

    this.bounds = new Rectangle(
      (this.parentState != null ? this.parentState.bounds.x : t.x * s) +
        this.unscaledBounds.x * s,
      (this.parentState != null ? this.parentState.bounds.y : t.y * s) +
        this.unscaledBounds.y * s,
      this.unscaledBounds.width * s,
      this.unscaledBounds.height * s,
    )

    if (geo.relative && this.parentState != null) {
      this.bounds.x += this.state.bounds.x - this.parentState.bounds.x
      this.bounds.y += this.state.bounds.y - this.parentState.bounds.y
    }

    cos = Math.cos(rad)
    sin = Math.sin(rad)

    const c2 = this.bounds.getCenter()

    dx = c2.x - c.x
    dy = c2.y - c.y

    const dx2 = cos * dx - sin * dy
    const dy2 = sin * dx + cos * dy

    const dx3 = dx2 - dx
    const dy3 = dy2 - dy

    const dx4 = this.bounds.x - this.state.bounds.x
    const dy4 = this.bounds.y - this.state.bounds.y

    const dx5 = cos * dx4 - sin * dy4
    const dy5 = sin * dx4 + cos * dy4

    this.bounds.x += dx3
    this.bounds.y += dy3

    // Rounds unscaled bounds to int
    this.unscaledBounds.x = this.master.round(this.unscaledBounds.x + dx3 / s)
    this.unscaledBounds.y = this.master.round(this.unscaledBounds.y + dy3 / s)
    this.unscaledBounds.width = this.master.round(this.unscaledBounds.width)
    this.unscaledBounds.height = this.master.round(this.unscaledBounds.height)

    // Shifts the children according to parent offset
    if (
      !this.graph.isCellCollapsed(this.state.cell) &&
      (dx3 !== 0 || dy3 !== 0)
    ) {
      this.childOffsetX = this.state.bounds.x - this.bounds.x + dx5
      this.childOffsetY = this.state.bounds.y - this.bounds.y + dy5
    } else {
      this.childOffsetX = 0
      this.childOffsetY = 0
    }

    if (this.resizeLivePreview) {
      this.updateLivePreview(e)
    }

    if (this.previewShape) {
      this.drawPreview()
    }

    this.updateOverlayCursor(e)
  }

  protected updateOverlayCursor(e: MouseEventEx) {
    if (this.overlayCursor == null) {
      this.overlayCursor = this.master.getMaskCursor()
    }

    const oldBounds = this.getStateBounds()
    const curBounds = this.bounds.round()

    let cursor = this.overlayCursor
    if (cursor === 'nw-resize') {
      const fixedX = curBounds.x === oldBounds.x + oldBounds.width
      const fixedY = curBounds.y === oldBounds.y + oldBounds.height
      if (fixedX && fixedY) {
        cursor = 'se-resize'
      } else if (fixedX) {
        cursor = 'ne-resize'
      } else if (fixedY) {
        cursor = 'sw-resize'
      } else {
        cursor = 'nw-resize'
      }
    } else if (cursor === 'n-resize') {
      const fixedY = curBounds.y === oldBounds.y + oldBounds.height
      if (fixedY) {
        cursor = 's-resize'
      } else {
        cursor = 'n-resize'
      }
    } else if (cursor === 'ne-resize') {
      const fixedX = curBounds.x + curBounds.width === oldBounds.x
      const fixedY = curBounds.y === oldBounds.y + oldBounds.height
      if (fixedX && fixedY) {
        cursor = 'sw-resize'
      } else if (fixedX) {
        cursor = 'nw-resize'
      } else if (fixedY) {
        cursor = 'se-resize'
      } else {
        cursor = 'ne-resize'
      }
    } else if (cursor === 'e-resize') {
      const fixedX = curBounds.x + curBounds.width === oldBounds.x
      if (fixedX) {
        cursor = 'w-resize'
      } else {
        cursor = 'e-resize'
      }
    } else if (cursor === 'se-resize') {
      const fixedX = curBounds.x + curBounds.width === oldBounds.x
      const fixedY = curBounds.y + curBounds.height === oldBounds.y
      if (fixedX && fixedY) {
        cursor = 'nw-resize'
      } else if (fixedX) {
        cursor = 'sw-resize'
      } else if (fixedY) {
        cursor = 'ne-resize'
      } else {
        cursor = 'se-resize'
      }
    } else if (cursor === 's-resize') {
      const fixedY = curBounds.y + curBounds.height === oldBounds.y
      if (fixedY) {
        cursor = 'n-resize'
      } else {
        cursor = 's-resize'
      }
    } else if (cursor === 'sw-resize') {
      const fixedX = curBounds.x === oldBounds.x + oldBounds.width
      const fixedY = curBounds.y + curBounds.height === oldBounds.y
      if (fixedX && fixedY) {
        cursor = 'ne-resize'
      } else if (fixedX) {
        cursor = 'se-resize'
      } else if (fixedY) {
        cursor = 'nw-resize'
      } else {
        cursor = 'sw-resize'
      }
    } else if (cursor === 'w-resize') {
      const fixedX = curBounds.x === oldBounds.x + oldBounds.width
      if (fixedX) {
        cursor = 'e-resize'
      } else {
        cursor = 'w-resize'
      }
    }

    this.master.setMaskCursor(cursor)
  }

  hasRotated() {
    return this.currentDeg != null
  }

  getRotationForRedraw() {
    return this.currentDeg == null
      ? State.getRotation(this.state)
      : this.currentDeg
  }

  getRotation() {
    if (this.currentDeg != null) {
      return this.currentDeg - State.getRotation(this.state)
    }
    return 0
  }

  getOrigin() {
    return new Point(this.startX, this.startY)
  }

  getUnscaledBounds() {
    return this.unscaledBounds
  }

  getChildOffset() {
    return [this.childOffsetX, this.childOffsetY]
  }

  resetShape() {
    this.inTolerance = false
    this.currentDeg = null
    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.selectionShape != null) {
      this.showSelectionShape()
      this.updateBounds()
      this.drawPreview()
    }
  }

  reset() {
    this.edgeHandlers = null
    this.unscaledBounds = null
    this.overlayCursor = null
  }

  @Disposable.dispose()
  dispose() {
    if (this.selectionShape != null) {
      this.selectionShape.dispose()
      this.selectionShape = null
    }

    if (this.previewShape != null) {
      this.previewShape.dispose()
      this.previewShape = null
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.dispose()
      this.parentHighlight = null
    }
  }
}
