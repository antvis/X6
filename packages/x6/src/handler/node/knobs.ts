import { NumberExt } from '../../util'
import { DomUtil, DomEvent } from '../../dom'
import { Angle, Point, Rectangle } from '../../geometry'
import { Disposable } from '../../entity'
import { State } from '../../core'
import { Shape } from '../../shape'
import { Handle } from '../handle'
import { NodeHandler } from './handler'
import { MouseEventEx } from '../mouse-event'
import {
  createLabelHandle,
  getLabelHandleCursor,
  getLabelHandleOffset,
} from './option-label'
import {
  createResizeHandle,
  isResizeHandleVisible,
  updateResizeHandleCalssName,
} from './option-resize'
import {
  createRotationHandle,
  getRotationHandleCursor,
  getRotationHandleOffset,
} from './option-rotation'

export class Knobs extends Disposable {
  tolerance: number
  manageHandles: boolean
  singleResizeHandle: boolean

  protected handles: Shape[] | null
  protected labelShape: Shape | null
  protected rotationShape: Shape | null
  protected customHandles: Handle[] | null

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

  protected get bounds() {
    return this.master.preview.bounds
  }

  protected config() {
    const options = this.graph.options
    const resizeHandle = options.resizeHandle
    this.tolerance = resizeHandle.tolerance
    this.manageHandles = resizeHandle.adaptive
    this.singleResizeHandle = resizeHandle.single
  }

  protected init() {
    this.handles = []

    const max = this.graph.options.maxCellCountForHandle || 0
    if (max > 0 && this.graph.getSelecedCellCount() > max) {
      return
    }

    if (this.canRenderResizeHandle()) {
      let i = 0

      if (!this.singleResizeHandle) {
        this.handles.push(this.createHandle(i))
        i += 1
        this.handles.push(this.createHandle(i))
        i += 1
        this.handles.push(this.createHandle(i))
        i += 1
        this.handles.push(this.createHandle(i))
        i += 1
        this.handles.push(this.createHandle(i))
        i += 1
        this.handles.push(this.createHandle(i))
        i += 1
        this.handles.push(this.createHandle(i))
        i += 1
      }

      this.handles.push(this.createHandle(i))
    }

    if (this.canRenderLabelHandle()) {
      this.labelShape = this.createHandle(Handle.getLabelHandle())
      this.handles.push(this.labelShape)
    }

    if (this.canRenderRotationHandle()) {
      this.rotationShape = this.createHandle(Handle.getRotationHandle())
      this.handles.push(this.rotationShape)
    }

    this.customHandles = this.createCustomHandles()
  }

  protected canRenderResizeHandle() {
    return (
      this.master.isEnabled() && this.graph.isCellResizable(this.state.cell)
    )
  }

  protected canRenderLabelHandle() {
    if (
      this.master.isEnabled() &&
      this.graph.isLabelMovable(this.state.cell) &&
      !this.graph.isSwimlane(this.state.cell)
    ) {
      const label = this.graph.getLabel(this.state.cell)
      if (
        label != null &&
        (DomUtil.isHtmlElement(label) || (label as string).length > 0)
      ) {
        const geo = this.state.cell.getGeometry()
        if (geo && !geo.relative) {
          return true
        }
      }
    }

    return false
  }

  protected canRenderRotationHandle() {
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

  protected createHandle(index: number) {
    let handle: Shape
    let cursor: string | null = null
    const args = {
      graph: this.graph,
      cell: this.state.cell,
    }

    if (Handle.isLabelHandle(index)) {
      handle = createLabelHandle(args)
      cursor = getLabelHandleCursor({ ...args, shape: handle })
    } else if (Handle.isRotationHandle(index)) {
      handle = createRotationHandle(args)
      cursor = getRotationHandleCursor({ ...args, shape: handle })
    } else {
      handle = createResizeHandle({ ...args, index })
      handle.visible = this.isResizeHandleVisible(index)
    }

    if (handle.isHtmlAllowed() && State.hasHtmlLabel(this.state)) {
      handle.bounds.width -= 1
      handle.bounds.height -= 1
      handle.dialect = 'html'
      handle.init(this.graph.container)
    } else {
      handle.dialect = 'svg'
      handle.init(this.graph.view.getOverlayPane())
    }

    MouseEventEx.redirectMouseEvents(handle.elem, this.graph, this.state)

    if (this.graph.isEnabled() && cursor != null) {
      handle.setCursor(cursor)
    }

    return handle
  }

  protected moveHandleTo(handle: Shape, x: number, y: number) {
    if (handle != null) {
      handle.bounds.x = Math.floor(x - handle.bounds.width / 2)
      handle.bounds.y = Math.floor(y - handle.bounds.height / 2)
      if (DomUtil.isVisible(handle.elem)) {
        handle.redraw()
      }
    }
  }

  protected isCustomHandleEvent(e: MouseEventEx) {
    return true
  }

  protected getTolerance(e: MouseEventEx) {
    return DomEvent.isMouseEvent(e.getEvent()) ? 1 : this.tolerance
  }

  getHandle(e: MouseEventEx) {
    const tol = this.getTolerance(e)
    if (this.master.isValid(e) && (tol > 0 || e.getState() === this.state)) {
      return this.getHandleForEvent(e)
    }
    return null
  }

  getHandleForEvent(e: MouseEventEx) {
    const tol = this.getTolerance(e)
    const hit =
      tol > 0
        ? new Rectangle(
            e.getGraphX() - tol,
            e.getGraphY() - tol,
            2 * tol,
            2 * tol,
          )
        : null

    const checkShape = (shape: Shape | null) => {
      // prettier-ignore
      return (
        shape != null &&
        (
          e.isSource(shape) ||
          (
            hit != null &&
            shape.bounds.isIntersectWith(hit) &&
            DomUtil.isVisible(shape.elem)
          )
        )
      )
    }

    if (this.customHandles != null && this.isCustomHandleEvent(e)) {
      // Inverse loop order to match display order
      for (let i = this.customHandles.length - 1; i >= 0; i -= 1) {
        const shape = this.customHandles[i].shape
        if (checkShape(shape)) {
          return {
            index: Handle.getCustomHandle(i),
            cursor: shape.cursor,
          }
        }
      }
    }

    if (checkShape(this.rotationShape)) {
      return {
        index: Handle.getRotationHandle(),
        cursor: this.rotationShape!.cursor,
      }
    }

    if (checkShape(this.labelShape)) {
      return {
        index: Handle.getLabelHandle(),
        cursor: this.labelShape!.cursor,
      }
    }

    if (this.handles != null) {
      for (let i = 0, ii = this.handles.length; i < ii; i += 1) {
        if (checkShape(this.handles[i])) {
          return {
            index: i,
            cursor: this.handles[i].cursor,
          }
        }
      }
    }

    return null
  }

  processCustomHandle(e: MouseEventEx, index: number) {
    if (this.customHandles != null) {
      const i = Handle.getCustomHandle(index)
      this.customHandles[i].processEvent(e)
      this.customHandles[i].active = true
    }
  }

  executeCustomHandle(index: number) {
    if (this.customHandles != null) {
      const i = Handle.getCustomHandle(index)
      this.customHandles[i].active = false
      this.customHandles[i].execute()
    }
  }

  moveLabel(e: MouseEventEx) {
    const t = this.graph.view.translate
    const s = this.graph.view.scale
    const p = e.getGraphPos()

    if (this.graph.isGridEnabledForEvent(e.getEvent())) {
      p.x = (this.graph.snap(p.x / s - t.x) + t.x) * s
      p.y = (this.graph.snap(p.y / s - t.y) + t.y) * s
    }

    if (this.handles) {
      const index =
        this.rotationShape != null
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
      const index = this.master.index
      const handle = index != null ? this.handles[index] : null
      if (handle != null && DomUtil.isHidden(handle.elem)) {
        DomUtil.show(handle.elem)
      }

      if (this.master.preview.isLivePreview()) {
        this.handles.forEach(h => h && DomUtil.show(h.elem))
      }
    }

    if (this.customHandles != null) {
      this.customHandles.forEach(customHandle => {
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
    const tol = this.tolerance
    let bounds = this.bounds

    if (this.handles != null && this.handles.length > 0 && this.handles[0]) {
      if (
        this.master.index == null &&
        this.manageHandles &&
        this.handles.length >= 8
      ) {
        const padding = this.getHandlePadding()
        const offsetX = padding.x
        const offsetY = padding.y

        if (offsetX !== 0 || offsetY !== 0) {
          bounds = bounds.clone()
          bounds.x -= offsetX / 2
          bounds.width += offsetX
          bounds.y -= offsetY / 2
          bounds.height += offsetY
        }

        const idxs = [0, 2, 5, 7]
        if (
          bounds.width < 2 * this.handles[0].bounds.width + 2 * tol ||
          bounds.height < 2 * this.handles[0].bounds.height + 2 * tol
        ) {
          idxs.forEach(i => DomUtil.hide(this.handles![i].elem))
        } else {
          idxs.forEach(i => DomUtil.show(this.handles![i].elem))
        }
      }

      const ct = bounds.getCenter()
      const right = bounds.x + bounds.width
      const bottom = bounds.y + bounds.height
      const rad = Angle.toRad(State.getRotation(this.state))
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)
      let pt = new Point()

      const draw = (index: number, handle?: Shape) => {
        const cursor = this.getCurosr(index)
        const shape = handle || this.handles![index]
        pt = Point.rotateEx(pt, cos, sin, ct)
        this.moveHandleTo(shape, pt.x, pt.y)
        if (this.graph.isEnabled()) {
          shape.setCursor(cursor)
        }

        updateResizeHandleCalssName({
          index,
          shape,
          cursor,
          graph: this.graph,
          cell: this.state.cell,
        })
      }

      if (this.singleResizeHandle) {
        pt = bounds.getCorner()
        draw(7, this.handles[0])
      } else {
        if (this.handles.length >= 8) {
          pt = bounds.getOrigin()
          draw(0)

          pt.x = ct.x
          pt.y = bounds.y
          draw(1)

          pt = bounds.getTopRight()
          draw(2)

          pt.x = bounds.x
          pt.y = ct.y
          draw(3)

          pt.x = right
          pt.y = ct.y
          draw(4)

          pt = bounds.getBottomLeft()
          draw(5)

          pt.x = ct.x
          pt.y = bottom
          draw(6)

          pt = bounds.getCorner()
          draw(7)
        }
      }
    }

    if (this.labelShape != null) {
      const cx = bounds.getCenterX()
      const cy = bounds.getCenterY()
      const offset = getLabelHandleOffset({
        graph: this.graph,
        cell: this.state.cell,
        shape: this.labelShape,
      })
      this.moveHandleTo(
        this.labelShape,
        cx + this.state.absoluteOffset.x + offset.x,
        cy + this.state.absoluteOffset.y + offset.y,
      )
    }

    if (this.rotationShape != null) {
      const rot = this.master.preview.getRotationForRedraw()
      const ct = this.state.bounds.getCenter()
      const pt = Point.rotate(this.getRotationHandlePosition(), rot, ct)
      const elem = this.rotationShape.elem
      if (elem != null) {
        this.moveHandleTo(this.rotationShape, pt.x, pt.y)
        // Hides rotation handle during text editing
        elem.style.visibility = this.graph.isEditing() ? 'hidden' : ''
      }
    }

    if (this.customHandles != null) {
      this.customHandles.forEach(customHandle => {
        const elem = customHandle.shape.elem!
        const temp = elem.style.display
        customHandle.redraw()
        elem.style.display = temp
        // Hides custom handles during text editing
        elem.style.visibility = this.graph.isEditing() ? 'hidden' : ''
      })
    }
  }

  getCurosr(index: number) {
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

    const indexMap: { [key: number]: number } = {
      0: 0,
      1: 1,
      2: 2,
      3: 7,
      4: 3,
      5: 6,
      6: 5,
      7: 4,
    }

    const rad = Angle.toRad(State.getRotation(this.state))
    const da = Math.round((rad * 4) / Math.PI)
    return cursors[NumberExt.mod(indexMap[index] + da, cursors.length)]
  }

  protected getHandlePadding() {
    const result = new Point()
    let tol = this.tolerance

    if (
      this.handles &&
      this.handles.length > 0 &&
      this.handles[0] &&
      (this.bounds.width < 2 * this.handles[0].bounds.width + 2 * tol ||
        this.bounds.height < 2 * this.handles[0].bounds.height + 2 * tol)
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
      shape: this.rotationShape!,
    })

    return new Point(
      this.bounds.x + this.bounds.width / 2 + offset.x,
      this.bounds.y + offset.y,
    )
  }

  protected setHandlesVisible(visible: boolean) {
    this.handles &&
      this.handles.forEach(handle =>
        visible ? DomUtil.show(handle.elem) : DomUtil.hide(handle.elem),
      )

    this.customHandles &&
      this.customHandles.forEach(handle => handle.setVisible(visible))
  }

  showActiveHandle(index: number) {
    this.setHandlesVisible(false)

    if (Handle.isRotationHandle(index) && this.rotationShape != null) {
      DomUtil.show(this.rotationShape.elem)
    } else if (Handle.isLabelHandle(index) && this.labelShape != null) {
      DomUtil.show(this.labelShape.elem)
    } else if (this.handles != null && this.handles[index] != null) {
      DomUtil.show(this.handles[index].elem)
    } else if (Handle.isCustomHandle(index) && this.customHandles != null) {
      this.customHandles[Handle.getCustomHandle(index)].setVisible(true)
    }
  }

  @Disposable.dispose()
  dispose() {
    if (this.handles != null) {
      this.handles.forEach(h => h.dispose())
    }

    if (this.labelShape != null) {
      this.labelShape.dispose()
    }

    if (this.rotationShape != null) {
      this.rotationShape.dispose()
    }

    if (this.customHandles != null) {
      this.customHandles.forEach(h => h.dispose())
    }

    this.handles = null
    this.labelShape = null
    this.rotationShape = null
    this.customHandles = null
  }
}
