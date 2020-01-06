import { Point } from '../geometry'
import { State } from '../core/state'

export function loop(
  edgeState: State,
  sourceState: State | null,
  targetState: State | null,
  points: Point[],
  result: Point[],
) {
  const pts = edgeState.absolutePoints
  const p0 = pts[0]
  const pe = pts[pts.length - 1]

  if (p0 != null && pe != null) {
    if (points != null && points.length > 0) {
      points.forEach(point => {
        const p = edgeState.view.transformControlPoint(edgeState, point)!
        result.push(new Point(p.x, p.y))
      })
    }

    return
  }

  if (sourceState != null) {
    const view = edgeState.view
    const graph = view.graph
    let pt = points != null && points.length > 0 ? points[0] : null
    if (pt != null) {
      pt = view.transformControlPoint(edgeState, pt)!
      if (sourceState.bounds.containsPoint(pt.x, pt.y)) {
        pt = null
      }
    }

    let x = 0
    let y = 0
    let dx = 0
    let dy = 0

    const seg = (edgeState.style.segment || graph.getGridSize()) * view.scale
    const dir = edgeState.style.direction || 'west'

    if (dir === 'north' || dir === 'south') {
      x = view.getRoutingCenterX(sourceState)
      dx = seg
    } else {
      y = view.getRoutingCenterY(sourceState)
      dy = seg
    }

    if (
      pt == null ||
      pt.x < sourceState.bounds.x ||
      pt.x > sourceState.bounds.x + sourceState.bounds.width
    ) {
      if (pt != null) {
        x = pt.x
        dy = Math.max(Math.abs(y - pt.y), dy)
      } else {
        if (dir === 'north') {
          y = sourceState.bounds.y - 2 * dx
        } else if (dir === 'south') {
          y = sourceState.bounds.y + sourceState.bounds.height + 2 * dx
        } else if (dir === 'east') {
          x = sourceState.bounds.x - 2 * dy
        } else {
          x = sourceState.bounds.x + sourceState.bounds.width + 2 * dy
        }
      }
    } else {
      // pt is not null
      x = view.getRoutingCenterX(sourceState)
      dx = Math.max(Math.abs(x - pt.x), dy)
      y = pt.y
      dy = 0
    }

    result.push(new Point(x - dx, y - dy))
    result.push(new Point(x + dx, y + dy))
  }
}
