import { Route } from '../../route'
import { DomEvent } from '../../dom'
import { Point, Rectangle } from '../../geometry'
import { EdgeHandler } from './handler'

export class EdgeElbowHandler extends EdgeHandler {
  /**
   * Specifies if a double click on the middle handle should trigger flip
   *
   * Default is `true`.
   */
  flipEnabled: boolean = true

  createHandles() {
    const handles = []

    // Source
    const sourceHandle = this.createHandleShape(0)
    this.initHandle(sourceHandle)
    this.setTerminalHandle(sourceHandle)
    handles.push(sourceHandle)

    // Virtual
    handles.push(
      this.createVirtualHandle((evt: MouseEvent) => {
        if (!DomEvent.isConsumed(evt) && this.flipEnabled) {
          this.graph.flipEdge(this.state.cell)
          DomEvent.consume(evt)
        }
      }),
    )

    this.points!.push(new Point(0, 0))

    // Target
    const targetHandle = this.createHandleShape(2)
    this.initHandle(targetHandle)
    this.setTerminalHandle(targetHandle)
    handles.push(targetHandle)

    return handles
  }

  createVirtualHandle(dblClickHandler?: (evt: MouseEvent) => void) {
    const bend = this.createHandleShape()
    this.initHandle(bend, dblClickHandler)
    bend.setCursor(this.getCursorForBend())
    if (!this.graph.isCellBendable(this.state.cell)) {
      bend.elem!.style.display = 'none'
    }
    return bend
  }

  getCursorForBend() {
    const edge = this.state.style.edge as any
    return edge === Route.topToBottom ||
      edge === 'topToBottom' ||
      ((edge === Route.elbow || edge === 'elbow') &&
        this.state.style.elbow === 'vertical')
      ? 'row-resize'
      : 'col-resize'
  }

  getTooltipForNode(elem: Element) {
    let tip = null

    if (
      this.handles != null &&
      this.handles[1] != null &&
      (elem === this.handles[1]!.elem ||
        elem.parentNode === this.handles[1]!.elem)
    ) {
      tip = 'Double Click Orientation'
    }

    return tip
  }

  /**
   * Converts the given point in-place from screen to unscaled, untranslated
   * graph coordinates and applies the grid.
   */
  normalizePoint(point: Point, gridEnabled: boolean) {
    const s = this.graph.getView().getScale()
    const t = this.graph.getView().getTranslate()
    const origin = this.state.origin

    if (gridEnabled) {
      point.x = this.graph.snap(point.x)
      point.y = this.graph.snap(point.y)
    }

    point.x = Math.round(point.x / s - t.x - origin.x)
    point.y = Math.round(point.y / s - t.y - origin.y)

    return point
  }

  redrawInnerHandles(p0: Point, pe: Point) {
    const g = this.graph.model.getGeometry(this.state.cell)!
    const pts = this.state.absolutePoints
    let pt = null

    // Keeps the virtual bend on the edge shape
    if (pts.length > 1) {
      p0 = pts[1] // tslint:disable-line
      pe = pts[pts.length - 2] // tslint:disable-line
    } else if (g.points != null && g.points.length > 0) {
      pt = pts[0]
    }

    if (pt == null) {
      pt = new Point(p0.x + (pe.x - p0.x) / 2, p0.y + (pe.y - p0.y) / 2)
    } else {
      const scale = this.graph.view.scale
      const trans = this.graph.view.translate
      pt = new Point(
        scale * (pt.x + trans.x + this.state.origin.x),
        scale * (pt.y + trans.y + this.state.origin.y),
      )
    }

    if (this.handles == null) {
      return
    }

    const handle = this.handles[1]
    if (handle == null) {
      return
    }

    // Makes handle slightly bigger if the yellow  label handle
    // exists and intersects this green handle
    const b = handle.bounds
    let w = b.width
    let h = b.height
    let bounds = new Rectangle(
      Math.round(pt.x - w / 2),
      Math.round(pt.y - h / 2),
      w,
      h,
    )

    if (this.manageLabelHandle) {
      this.checkLabelHandle(bounds)
    } else if (
      this.labelHandleShape != null &&
      this.labelHandleShape.visible &&
      bounds.isIntersectWith(this.labelHandleShape.bounds)
    ) {
      w = 8 + 3
      h = 8 + 3
      bounds = new Rectangle(
        Math.floor(pt.x - w / 2),
        Math.floor(pt.y - h / 2),
        w,
        h,
      )
    }

    handle.bounds = bounds
    handle.redraw()

    if (this.manageLabelHandle) {
      this.checkLabelHandle(handle.bounds)
    }
  }
}
