import * as util from '../../util'
import { Handle } from '../handle'
import { Graph } from '../../core'
import { Shape } from '../../shape'
import { NodeHandler } from './handler'
import { Rectangle, Point } from '../../struct'
import { detector, Disposable, DomEvent, MouseEventEx } from '../../common'
import {
  createLabelHandle,
  getLabelHandleCursor,
  getLabelHandleOffset,
} from './label-option'
import {
  ResizeHandleOptions,
  createResizeHandle,
  isResizeHandleVisible,
} from './resize-option'
import {
  createRotationHandle,
  getRotationHandleCursor,
  getRotationHandleOffset,
} from './rotation-option'

export class Knobs extends Disposable {
  checkHandleBounds: boolean = true
  singleResizeHandle: boolean
  manageHandles: boolean

  /**
   * Optional tolerance for hit-detection.
   *
   * Default is `0`.
   */
  tolerance: number = 0

  protected handles: (Shape)[] | null
  protected labelShape: Shape | null
  protected rotationShape: Shape
  protected customHandles: Handle[] | null
  protected horizontalOffset: number = 0
  protected verticalOffset: number = 0
  protected currentAlpha: number | null

  constructor(
    public graph: Graph,
    public handler: NodeHandler,
  ) {
    super()
    this.config()
    this.init()
  }

  protected get state() {
    return this.handler.state
  }

  protected get bounds() {
    return this.handler.preview.bounds
  }

  protected config() {
    const options = this.graph.options
    const resizeHandle = options.resizeHandle as ResizeHandleOptions
    this.manageHandles = resizeHandle.adaptive
    this.singleResizeHandle = resizeHandle.single
  }

  protected init() {
    this.handles = []

    // Adds the sizer handles
    const max = this.graph.options.maxCellCountForHandle || 0
    if (max <= 0 || this.graph.getSelecedCellCount() < max) {
      const resizable = this.graph.isCellResizable(this.state.cell)
      const labelMovable = this.graph.isLabelMovable(this.state.cell)

      if (resizable || (
        labelMovable &&
        this.state.bounds.width >= 2 &&
        this.state.bounds.height >= 2
      )) {
        let i = 0

        if (resizable) {
          if (!this.singleResizeHandle) {
            this.handles.push(this.createHandle(i, 'nw-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'n-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'ne-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'w-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'e-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 'sw-resize'))
            i += 1
            this.handles.push(this.createHandle(i, 's-resize'))
            i += 1
          }

          this.handles.push(this.createHandle(i, 'se-resize'))
        }

        const geo = this.state.cell.getGeometry()

        if (
          geo != null &&
          !geo.relative &&
          !this.graph.isSwimlane(this.state.cell) &&
          labelMovable
        ) {
          this.labelShape = this.createHandle(DomEvent.getLabelHandle())
          this.handles.push(this.labelShape)
        }
      } else if (
        !resizable &&
        this.graph.isCellMovable(this.state.cell) &&
        this.state.bounds.width < 2 &&
        this.state.bounds.height < 2
      ) {
        this.labelShape = this.createHandle(DomEvent.getLabelHandle())
        this.handles.push(this.labelShape)
      }
    }

    // Adds the rotation handler
    if (this.isRotationHandleVisible()) {
      this.rotationShape = this.createHandle(DomEvent.getRotationHandle())
      this.handles.push(this.rotationShape)
    }

    this.customHandles = this.createCustomHandles()
  }

  protected isRotationHandleVisible() {
    return (
      this.graph.isEnabled() &&
      this.graph.isCellRotatable(this.state.cell) &&
      this.state.bounds.width >= 2 &&
      this.state.bounds.height >= 2
    )
  }

  protected isResizeHandleVisible(index: number) {
    return isResizeHandleVisible({
      index,
      graph: this.graph,
      cell: this.state.cell,
    })
  }

  protected createCustomHandles() {
    return null
  }

  protected createHandle(index: number, cursor?: string) {
    let handle
    const args = {
      graph: this.graph,
      cell: this.state.cell,
    }

    if (DomEvent.isLabelHandle(index)) {
      handle = createLabelHandle(args)
      // tslint:disable-next-line
      cursor = getLabelHandleCursor({ ...args, shape: handle })
    } else if (DomEvent.isRotationHandle(index)) {
      handle = createRotationHandle(args)
      // tslint:disable-next-line
      cursor = getRotationHandleCursor({ ...args, shape: handle })
    } else {
      handle = createResizeHandle({ ...args, index, cursor: cursor! })
    }

    if (
      handle.isHtmlAllowed() &&
      this.state.text &&
      this.state.text.elem &&
      this.state.text.elem.parentNode === this.graph.container
    ) {
      handle.bounds.width -= 1
      handle.bounds.height -= 1
      handle.dialect = 'html'
      handle.init(this.graph.container)
    } else {
      handle.dialect = 'svg'
      handle.init(this.graph.view.getOverlayPane())
    }

    MouseEventEx.redirectMouseEvents(handle.elem, this.graph, this.state)

    if (this.graph.isEnabled()) {
      handle.setCursor(cursor)
    }

    if (!this.isResizeHandleVisible(index)) {
      handle.visible = false
    }

    return handle
  }

  protected moveHandleTo(shape: Shape, x: number, y: number) {
    if (shape != null) {
      shape.bounds.x = Math.floor(x - shape.bounds.width / 2)
      shape.bounds.y = Math.floor(y - shape.bounds.height / 2)
      if (util.isVisible(shape.elem)) {
        shape.redraw()
      }
    }
  }

  protected isCustomHandleEvent(e: MouseEventEx) {
    return true
  }

  getHandle(e: MouseEventEx) {
    const tol = DomEvent.isMouseEvent(e.getEvent()) ? 1 : this.tolerance
    if (
      this.handler.isValid(e) &&
      (tol > 0 || e.getState() === this.state)
    ) {
      return this.getHandleForEvent(e)
    }
    return null
  }

  getHandleForEvent(e: MouseEventEx) {
    // Connection highlight may consume events before they reach sizer handle
    const tol = DomEvent.isMouseEvent(e.getEvent()) ? 1 : this.tolerance
    const hit = (this.checkHandleBounds && (detector.IS_IE || tol > 0))
      ? new Rectangle(
        e.getGraphX() - tol,
        e.getGraphY() - tol,
        2 * tol,
        2 * tol,
      )
      : null

    const checkShape = (shape: Shape | null) => {
      return (
        shape != null &&
        (
          e.isSource(shape) ||
          (
            hit != null &&
            shape.bounds.isIntersectWith(hit) &&
            util.isVisible(shape.elem)
          )
        )
      )
    }

    if (this.customHandles != null && this.isCustomHandleEvent(e)) {
      // Inverse loop order to match display order
      for (let i = this.customHandles.length - 1; i >= 0; i -= 1) {
        if (checkShape(this.customHandles[i].shape)) {
          return DomEvent.getCustomHandle(i)
        }
      }
    }

    if (checkShape(this.rotationShape)) {
      return DomEvent.getRotationHandle()
    }

    if (checkShape(this.labelShape)) {
      return DomEvent.getLabelHandle()
    }

    if (this.handles != null) {
      for (let i = 0, ii = this.handles.length; i < ii; i += 1) {
        if (checkShape(this.handles[i])) {
          return i
        }
      }
    }

    return null
  }

  processCustomHandle(e: MouseEventEx, index: number) {
    if (this.customHandles != null) {
      const idx = DomEvent.getCustomHandle(index)
      this.customHandles[idx].processEvent(e)
      this.customHandles[idx].active = true
    }
  }

  executeCustomHandle(index: number) {
    if (this.customHandles != null) {
      const idx = DomEvent.getCustomHandle(index)
      this.customHandles[idx].active = false
      this.customHandles[idx].execute()
    }
  }

  moveLabel(e: MouseEventEx) {
    const p = new Point(e.getGraphX(), e.getGraphY())
    const t = this.graph.view.translate
    const s = this.graph.view.scale

    if (this.graph.isGridEnabledForEvent(e.getEvent())) {
      p.x = (this.graph.snap(p.x / s - t.x) + t.x) * s
      p.y = (this.graph.snap(p.y / s - t.y) + t.y) * s
    }

    if (this.handles) {
      const index = (this.rotationShape != null)
        ? this.handles.length - 2
        : this.handles.length - 1

      this.moveHandleTo(this.handles[index], p.x, p.y)
    }
  }

  getLabelCenter() {
    return this.labelShape!.bounds.getCenter()
  }

  reset() {
    if (this.handles != null) {
      const index = this.handler.index
      const knob = index != null ? this.handles[index] : null
      if (knob != null && util.isHiddenElement(knob.elem)) {
        util.showElement(knob.elem)
      }

      if (this.handler.preview.isLivePreview()) {
        this.handles.forEach(h => h && util.showElement(h.elem))
      }
    }

    if (this.customHandles != null) {
      this.customHandles.forEach((customHandle) => {
        if (customHandle.active) {
          customHandle.active = false
          customHandle.reset()
        } else {
          customHandle.setVisible(true)
        }
      })
    }
  }

  redraw() {
    this.verticalOffset = 0
    this.horizontalOffset = 0

    const tol = this.tolerance
    let bounds = this.bounds

    if (this.handles && this.handles.length > 0 && this.handles[0]) {
      if (
        this.handler.index == null &&
        this.manageHandles &&
        this.handles.length >= 8
      ) {
        const padding = this.getHandlePadding()
        this.horizontalOffset = padding.x
        this.verticalOffset = padding.y

        if (this.horizontalOffset !== 0 || this.verticalOffset !== 0) {
          bounds = bounds.clone()
          bounds.x -= this.horizontalOffset / 2
          bounds.width += this.horizontalOffset
          bounds.y -= this.verticalOffset / 2
          bounds.height += this.verticalOffset
        }

        if (this.handles.length >= 8) {
          if (
            (bounds.width < 2 * this.handles[0].bounds.width + 2 * tol) ||
            (bounds.height < 2 * this.handles[0].bounds.height + 2 * tol)
          ) {
            this.handles[0].elem!.style.display = 'none'
            this.handles[2].elem!.style.display = 'none'
            this.handles[5].elem!.style.display = 'none'
            this.handles[7].elem!.style.display = 'none'
          } else {
            this.handles[0].elem!.style.display = ''
            this.handles[2].elem!.style.display = ''
            this.handles[5].elem!.style.display = ''
            this.handles[7].elem!.style.display = ''
          }
        }
      }

      const right = bounds.x + bounds.width
      const bottom = bounds.y + bounds.height

      if (this.singleResizeHandle) {
        this.moveHandleTo(this.handles[0], right, bottom)
      } else {
        const cx = bounds.x + bounds.width / 2
        const cy = bounds.y + bounds.height / 2

        // resizable
        if (this.handles.length >= 8) {
          const cursors = [
            'nw-resize',
            'n-resize',
            'ne-resize',
            'e-resize',
            'se-resize',
            's-resize',
            'sw-resize',
            'w-resize',
          ]

          const alpha = util.toRad(util.getRotation(this.state))
          const cos = Math.cos(alpha)
          const sin = Math.sin(alpha)
          const da = Math.round(alpha * 4 / Math.PI)

          const ct = bounds.getCenter()
          let pt = new Point(bounds.x, bounds.y)
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[0], pt.x, pt.y)
          this.handles[0].setCursor(cursors[util.mod(0 + da, cursors.length)])

          pt.x = cx
          pt.y = bounds.y
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[1], pt.x, pt.y)
          this.handles[1].setCursor(cursors[util.mod(1 + da, cursors.length)])

          pt.x = right
          pt.y = bounds.y
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[2], pt.x, pt.y)
          this.handles[2].setCursor(cursors[util.mod(2 + da, cursors.length)])

          pt.x = bounds.x
          pt.y = cy
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[3], pt.x, pt.y)
          this.handles[3].setCursor(cursors[util.mod(7 + da, cursors.length)])

          pt.x = right
          pt.y = cy
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[4], pt.x, pt.y)
          this.handles[4].setCursor(cursors[util.mod(3 + da, cursors.length)])

          pt.x = bounds.x
          pt.y = bottom
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[5], pt.x, pt.y)
          this.handles[5].setCursor(cursors[util.mod(6 + da, cursors.length)])

          pt.x = cx
          pt.y = bottom
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[6], pt.x, pt.y)
          this.handles[6].setCursor(cursors[util.mod(5 + da, cursors.length)])

          pt.x = right
          pt.y = bottom
          pt = util.rotatePointEx(pt, cos, sin, ct)
          this.moveHandleTo(this.handles[7], pt.x, pt.y)
          this.handles[7].setCursor(cursors[util.mod(4 + da, cursors.length)])

          const offset = getLabelHandleOffset({
            graph: this.graph,
            cell: this.state.cell,
            shape: this.labelShape!,
          })
          this.moveHandleTo(
            this.handles[8], // labelShape
            cx + this.state.absoluteOffset.x + offset.x,
            cy + this.state.absoluteOffset.y + offset.y,
          )
        } else if (
          this.state.bounds.width >= 2 &&
          this.state.bounds.height >= 2
        ) {
          const offset = getLabelHandleOffset({
            graph: this.graph,
            cell: this.state.cell,
            shape: this.labelShape!,
          })
          this.moveHandleTo(
            this.handles[0], // labelShape
            cx + this.state.absoluteOffset.x + offset.x,
            cy + this.state.absoluteOffset.y + offset.y,
          )
        } else {
          this.moveHandleTo(
            this.handles[0],
            this.state.bounds.x,
            this.state.bounds.y,
          )
        }
      }
    }

    if (this.rotationShape != null) {
      const rot = this.currentAlpha != null
        ? this.currentAlpha
        : util.getRotation(this.state)
      const ct = this.state.bounds.getCenter()
      const pt = util.rotatePoint(this.getRotationHandlePosition(), rot, ct)
      if (this.rotationShape.elem != null) {
        this.moveHandleTo(this.rotationShape, pt.x, pt.y)

        // Hides rotation handle during text editing
        this.rotationShape.elem.style.visibility =
          this.graph.isEditing() ? 'hidden' : ''
      }
    }

    if (this.customHandles != null) {
      for (let i = 0; i < this.customHandles.length; i += 1) {
        const temp = this.customHandles[i].shape.elem!.style.display
        this.customHandles[i].redraw()
        this.customHandles[i].shape.elem!.style.display = temp

        // Hides custom handles during text editing
        this.customHandles[i].shape.elem!.style.visibility =
          this.graph.isEditing() ? 'hidden' : ''
      }
    }
  }

  protected getHandlePadding() {
    const result = new Point(0, 0)
    let tol = this.tolerance

    if (
      this.handles && this.handles.length > 0 && this.handles[0] &&
      (
        this.bounds.width < 2 * this.handles[0].bounds.width + 2 * tol ||
        this.bounds.height < 2 * this.handles[0].bounds.height + 2 * tol
      )
    ) {
      tol /= 2

      result.x = this.handles[0].bounds.width + tol
      result.y = this.handles[0].bounds.height + tol
    }

    return result
  }

  protected getRotationHandlePosition() {
    const offset = getRotationHandleOffset({
      graph: this.graph,
      cell: this.state.cell,
      shape: this.rotationShape,
    })

    return new Point(
      this.bounds.x + this.bounds.width / 2 + offset.x,
      this.bounds.y + offset.y,
    )
  }

  protected setHandlesVisible(visible: boolean) {
    this.handles && this.handles.forEach(
      handle => (handle.elem!.style.display = visible ? '' : 'none'),
    )

    this.customHandles && this.customHandles.forEach(
      handle => handle.setVisible(visible),
    )
  }

  showActiveKnob(index: number) {
    this.setHandlesVisible(false)

    if (DomEvent.isRotationHandle(index)) {
      util.showElement(this.rotationShape.elem)
    } else if (DomEvent.isLabelHandle(index)) {
      util.showElement(this.labelShape!.elem)
    } else if (this.handles != null && this.handles[index] != null) {
      util.showElement(this.handles[index].elem)
    } else if (
      DomEvent.isCustomHandle(index) &&
      this.customHandles != null
    ) {
      this.customHandles[DomEvent.getCustomHandle(index)].setVisible(true)
    }
  }

  @Disposable.aop()
  dispose() {
    this.labelShape = null

    this.handles && this.handles.forEach(h => h.dispose())
    this.handles = null

    this.customHandles && this.customHandles.forEach(h => h.dispose())
    this.customHandles = null
  }
}
