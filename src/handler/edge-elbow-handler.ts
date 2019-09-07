import { Rectangle, Point, EdgeType } from '../struct'
import { constants, DomEvent } from '../common'
import { EdgeStyle } from '../stylesheet'
import { EdgeHandler } from './edge-handler'

export class EdgeElbowHandler extends EdgeHandler {
  /**
   * Specifies if a double click on the middle handle should trigger flip
   *
   * Default is `true`.
   */
  flipEnabled: boolean = true

  createBends() {
    const bends = []

    // Source
    let bend = this.createHandleShape(0)
    this.initHandle(bend)
    bend.setCursor(constants.CURSOR_TERMINAL_HANDLE)
    bends.push(bend)

    // Virtual
    bends.push(this.createVirtualBend((evt: MouseEvent) => {
      if (!DomEvent.isConsumed(evt) && this.flipEnabled) {
        this.graph.flipEdge(this.state.cell)
        DomEvent.consume(evt)
      }
    }))

    this.points!.push(new Point(0, 0))

    // Target
    bend = this.createHandleShape(2)
    this.initHandle(bend)
    bend.setCursor(constants.CURSOR_TERMINAL_HANDLE)
    bends.push(bend)

    return bends
  }

  createVirtualBend(dblClickHandler?: (evt: MouseEvent) => void) {
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
    return (
      edge === EdgeStyle.topToBottom ||
      edge === EdgeType.topToBottom ||
      (
        (edge === EdgeStyle.elbowConnector ||
          edge === EdgeType.elbow
        ) &&
        this.state.style.elbow === 'vertical')
    )
      ? 'row-resize'
      : 'col-resize'
  }

  getTooltipForNode(elem: Element) {
    let tip = null

    if (
      this.bends != null &&
      this.bends[1] != null &&
      (
        elem === this.bends[1]!.elem ||
        elem.parentNode === this.bends[1]!.elem
      )
    ) {
      tip = 'doubleClickOrientation'
      // tip = this.doubleClickOrientationResource
      // tip = mxResources.get(tip) || tip // translate
    }

    return tip
  }

  /**
   * Converts the given point in-place from screen to unscaled, untranslated
   * graph coordinates and applies the grid.
   */
  convertPoint(point: Point, gridEnabled: boolean) {
    const scale = this.graph.getView().getScale()
    const tr = this.graph.getView().getTranslate()
    const origin = this.state.origin

    if (gridEnabled) {
      point.x = this.graph.snap(point.x)
      point.y = this.graph.snap(point.y)
    }

    point.x = Math.round(point.x / scale - tr.x - origin.x)
    point.y = Math.round(point.y / scale - tr.y - origin.y)

    return point
  }

  redrawInnerBends(p0: Point, pe: Point) {
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

    // Makes handle slightly bigger if the yellow  label handle
    // exists and intersects this green handle
    const b = this.bends![1]!.bounds
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
      this.handleImage == null &&
      this.labelShape != null &&
      this.labelShape.visible &&
      bounds.isIntersectWith(this.labelShape.bounds)
    ) {
      w = constants.HANDLE_SIZE + 3
      h = constants.HANDLE_SIZE + 3
      bounds = new Rectangle(
        Math.floor(pt.x - w / 2),
        Math.floor(pt.y - h / 2),
        w,
        h,
      )
    }

    this.bends![1]!.bounds = bounds
    this.bends![1]!.redraw()

    if (this.manageLabelHandle) {
      this.checkLabelHandle(this.bends![1]!.bounds)
    }
  }

}
