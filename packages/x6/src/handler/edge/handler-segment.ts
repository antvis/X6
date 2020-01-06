import { Point, Rectangle } from '../../geometry'
import { Cell } from '../../core/cell'
import { State } from '../../core/state'
import { MouseEventEx } from '../mouse-event'
import { EdgeElbowHandler } from './handler-elbow'

export class EdgeSegmentHandler extends EdgeElbowHandler {
  getCurrentPoints() {
    let pts = this.state.absolutePoints
    if (pts != null) {
      // Special case for straight edges where we add a
      // virtual middle handle for moving the edge
      const tol = Math.max(1, this.graph.view.scale)

      if (
        pts.length === 2 ||
        (pts.length === 3 &&
          ((Math.abs(pts[0].x - pts[1].x) < tol &&
            Math.abs(pts[1].x - pts[2].x) < tol) ||
            (Math.abs(pts[0].y - pts[1].y) < tol &&
              Math.abs(pts[1].y - pts[2].y) < tol)))
      ) {
        const cx = pts[0].x + (pts[pts.length - 1].x - pts[0].x) / 2
        const cy = pts[0].y + (pts[pts.length - 1].y - pts[0].y) / 2

        pts = [
          pts[0],
          new Point(cx, cy),
          new Point(cx, cy),
          pts[pts.length - 1],
        ]
      }
    }

    return pts
  }

  getPreviewPoints(point: Point, e: MouseEventEx) {
    if (this.isSourceHandle || this.isTargetHandle) {
      return super.getPreviewPoints(point, e)
    }

    const pts = this.getCurrentPoints()
    let last = this.normalizePoint(pts[0].clone(), false)
    point = this.normalizePoint(point.clone(), false) // tslint:disable-line
    let result: Point[] = []

    for (let i = 1, ii = pts.length; i < ii; i += 1) {
      const pt = this.normalizePoint(pts[i].clone(), false)

      if (i === this.index) {
        if (Math.round(last.x - pt.x) === 0) {
          last.x = point.x
          pt.x = point.x
        }

        if (Math.round(last.y - pt.y) === 0) {
          last.y = point.y
          pt.y = point.y
        }
      }

      if (i < pts.length - 1) {
        result.push(pt)
      }

      last = pt
    }

    // Replaces single point that intersects with source or target
    if (result.length === 1) {
      const source = this.state.getVisibleTerminalState(true)!
      const target = this.state.getVisibleTerminalState(false)!
      const scale = this.state.view.getScale()
      const tr = this.state.view.getTranslate()

      const x = result[0].x * scale + tr.x
      const y = result[0].y * scale + tr.y

      if (
        (source != null && source.bounds.containsPoint(x, y)) ||
        (target != null && target.bounds.containsPoint(x, y))
      ) {
        result = [point, point]
      }
    }

    return result
  }

  updatePreviewState(
    edge: State,
    point: Point,
    terminalState: State | null,
    e: MouseEventEx,
  ) {
    super.updatePreviewState(edge, point, terminalState, e)

    // Checks and corrects preview by running edge style again
    if (!this.isSourceHandle && !this.isTargetHandle) {
      point = this.normalizePoint(point.clone(), false) // tslint:disable-line
      const pts = edge.absolutePoints
      let pt0 = pts[0]
      let pt1 = pts[1]

      let result = []

      for (let i = 2, ii = pts.length; i < ii; i += 1) {
        const pt2 = pts[i]

        // Merges adjacent segments only if more than 2 to allow for straight edges
        if (
          (Math.round(pt0.x - pt1.x) !== 0 ||
            Math.round(pt1.x - pt2.x) !== 0) &&
          (Math.round(pt0.y - pt1.y) !== 0 || Math.round(pt1.y - pt2.y) !== 0)
        ) {
          result.push(this.normalizePoint(pt1.clone(), false))
        }

        pt0 = pt1
        pt1 = pt2
      }

      const source = this.state.getVisibleTerminalState(true)
      const target = this.state.getVisibleTerminalState(false)
      const rpts = this.state.absolutePoints

      // A straight line is represented by 3 handles
      if (
        result.length === 0 &&
        (Math.round(pts[0].x - pts[pts.length - 1].x) === 0 ||
          Math.round(pts[0].y - pts[pts.length - 1].y) === 0)
      ) {
        result = [point, point]
      } else if (
        pts.length === 5 &&
        result.length === 2 &&
        source != null &&
        target != null &&
        rpts != null &&
        Math.round(rpts[0].x - rpts[rpts.length - 1].x) === 0
      ) {
        // Handles special case of transitions from straight vertical to routed
        const view = this.graph.getView()
        const scale = view.getScale()
        const tr = view.getTranslate()

        let y0 = view.getRoutingCenterY(source) / scale - tr.y

        // Use fixed connection point y-coordinate if one exists
        const sc = this.graph.getConnectionAnchor(edge, source, true)

        if (sc != null) {
          const pt = this.graph.view.getConnectionPoint(source, sc)

          if (pt != null) {
            this.normalizePoint(pt, false)
            y0 = pt.y
          }
        }

        let ye = view.getRoutingCenterY(target) / scale - tr.y

        // Use fixed connection point y-coordinate if one exists
        const tc = this.graph.getConnectionAnchor(edge, target, false)

        if (tc) {
          const pt = this.graph.view.getConnectionPoint(target, tc)

          if (pt != null) {
            this.normalizePoint(pt, false)
            ye = pt.y
          }
        }

        result = [new Point(point.x, y0), new Point(point.x, ye)]
      }

      this.points = result

      // LATER: Check if points and result are different
      edge.view.updateFixedTerminalPoints(edge, source!, target!)
      edge.view.updateRouterPoints(edge, this.points, source!, target!)
      edge.view.updateFloatingTerminalPoints(edge, source!, target!)
    }
  }

  connect(
    edge: Cell,
    terminal: Cell,
    isSource: boolean,
    clone: boolean,
    e: MouseEventEx,
  ) {
    const model = this.graph.getModel()
    const geo = model.getGeometry(edge)
    let result: Point[] | null = null

    // Merges adjacent edge segments
    if (geo != null && geo.points != null && geo.points.length > 0) {
      const pts = this.absolutePoints
      let pt0 = pts[0]
      let pt1 = pts[1]
      result = []

      for (let i = 2, ii = pts.length; i < ii; i += 1) {
        const pt2 = pts[i]

        // Merges adjacent segments only if more than 2 to allow for straight edges
        if (
          (Math.round(pt0.x - pt1.x) !== 0 ||
            Math.round(pt1.x - pt2.x) !== 0) &&
          (Math.round(pt0.y - pt1.y) !== 0 || Math.round(pt1.y - pt2.y) !== 0)
        ) {
          result.push(this.normalizePoint(pt1.clone(), false))
        }

        pt0 = pt1
        pt1 = pt2
      }
    }

    this.graph.batchUpdate(() => {
      if (result != null) {
        let geo = model.getGeometry(edge)

        if (geo != null) {
          geo = geo.clone()
          geo.points = result

          model.setGeometry(edge, geo)
        }
      }

      edge = super.connect(edge, terminal, isSource, clone, e) // tslint:disable-line
    })

    return edge
  }

  getTooltipForNode(elem: Element) {
    return null
  }

  start(x: number, y: number, index: number) {
    super.start(x, y, index)
    const bend = this.handles && this.handles[index]
    if (bend != null && !this.isSourceHandle && !this.isTargetHandle) {
      bend.elem!.style.opacity = '100'
    }
  }

  createHandles() {
    const handles = []

    // Source
    let handle = this.createHandleShape(0)
    this.initHandle(handle)
    handles.push(handle)

    const pts = this.getCurrentPoints()

    // Waypoints (segment handles)
    if (this.graph.isCellBendable(this.state.cell)) {
      if (this.points == null) {
        this.points = []
      }

      for (let i = 0; i < pts.length - 1; i += 1) {
        handle = this.createVirtualHandle()
        handles.push(handle)
        let horizontal = Math.round(pts[i].x - pts[i + 1].x) === 0

        // Special case where dy is 0 as well
        if (Math.round(pts[i].y - pts[i + 1].y) === 0 && i < pts.length - 2) {
          horizontal = Math.round(pts[i].x - pts[i + 2].x) === 0
        }

        handle.setCursor(horizontal ? 'col-resize' : 'row-resize')
        this.points.push(new Point(0, 0))
      }
    }

    // Target
    handle = this.createHandleShape(pts.length)
    this.initHandle(handle)
    handles.push(handle)

    return handles
  }

  redraw() {
    this.refresh()
    super.redraw()
  }

  redrawInnerHandles(p0: Point, pe: Point) {
    if (this.graph.isCellBendable(this.state.cell)) {
      const pts = this.getCurrentPoints()
      if (pts != null && pts.length > 1) {
        let straight = false

        // Puts handle in the center of straight edges
        if (
          pts.length === 4 &&
          Math.round(pts[1].x - pts[2].x) === 0 &&
          Math.round(pts[1].y - pts[2].y) === 0
        ) {
          straight = true

          if (Math.round(pts[0].y - pts[pts.length - 1].y) === 0) {
            const cx = pts[0].x + (pts[pts.length - 1].x - pts[0].x) / 2
            pts[1] = new Point(cx, pts[1].y)
            pts[2] = new Point(cx, pts[2].y)
          } else {
            const cy = pts[0].y + (pts[pts.length - 1].y - pts[0].y) / 2
            pts[1] = new Point(pts[1].x, cy)
            pts[2] = new Point(pts[2].x, cy)
          }
        }

        for (let i = 0; i < pts.length - 1; i += 1) {
          const bend = this.handles && this.handles[i + 1]
          if (bend != null) {
            const p0 = pts[i]
            const pe = pts[i + 1]
            const pt = new Point(
              p0.x + (pe.x - p0.x) / 2,
              p0.y + (pe.y - p0.y) / 2,
            )
            const b = bend.bounds
            bend.bounds = new Rectangle(
              Math.floor(pt.x - b.width / 2),
              Math.floor(pt.y - b.height / 2),
              b.width,
              b.height,
            )
            bend.redraw()

            if (this.manageLabelHandle) {
              this.checkLabelHandle(bend.bounds)
            }
          }
        }

        if (straight) {
          if (this.handles) {
            // this.handles[1]!.elem!.style.opacity = `${this.virtualHandleOpacity}`
            // this.handles[3]!.elem!.style.opacity = `${this.virtualHandleOpacity}`
          }
        }
      }
    }
  }
}
