import { Point } from '../geometry'
import { Cell } from '../core/cell'
import { State } from '../core/state'
import { globals } from '../option'
import { DirectionMask } from '../enum'

/**
 * Implements an entity relation style for edges (as used in database
 * schema diagrams).
 *
 * At the time the function is called, the result array contains a
 * placeholder (null) for the first absolute point, that is, the
 * point where the edge and source terminal are connected. The
 * implementation of the style then adds all intermediate waypoints
 * except for the last point, that is, the connection point between
 * the edge and the target terminal. The first and the last point in
 * the result array are then replaced with `Point`s that take into
 * account the terminal's perimeter and next point on the edge.
 *
 * @param edgeState The state of edge to be updated.
 * @param sourceState The source terminal state.
 * @param targetState the target terminal state.
 * @param points List of relative control points.
 * @param result The actual points of the edge.
 */
export function er(
  edgeState: State,
  sourceState: State | null,
  targetState: State | null,
  points: Point[],
  result: Point[],
) {
  const view = edgeState.view
  const graph = view.graph
  const segment =
    edgeState.style.segment || globals.defaultSegmentLength * view.scale

  const pts = edgeState.absolutePoints
  const p0 = pts[0]
  const pe = pts[pts.length - 1]

  let isSourceLeft = false

  if (p0 != null) {
    // tslint:disable-next-line
    sourceState = new State(view, sourceState ? sourceState.cell : new Cell())
    sourceState.bounds.x = p0.x
    sourceState.bounds.y = p0.y
  } else if (sourceState != null) {
    const dir = State.getPortConstraints(
      sourceState,
      edgeState,
      true,
      DirectionMask.none,
    )
    if (
      dir !== DirectionMask.none &&
      dir !== DirectionMask.west + DirectionMask.east
    ) {
      isSourceLeft = dir === DirectionMask.west
    } else {
      const sourceGeometry = graph.getCellGeometry(sourceState.cell)!
      if (sourceGeometry.relative) {
        isSourceLeft = sourceGeometry.bounds.x <= 0.5
      } else if (targetState != null) {
        isSourceLeft =
          targetState.bounds.x + targetState.bounds.width < sourceState.bounds.x
      }
    }
  } else {
    return
  }

  let isTargetLeft = true

  if (pe != null) {
    // tslint:disable-next-line
    targetState = new State(view, targetState ? targetState.cell : new Cell())
    targetState.bounds.x = pe.x
    targetState.bounds.y = pe.y
  } else if (targetState != null) {
    const dir = State.getPortConstraints(
      targetState,
      edgeState,
      false,
      DirectionMask.none,
    )

    if (
      dir !== DirectionMask.none &&
      dir !== DirectionMask.west + DirectionMask.east
    ) {
      isTargetLeft = dir === DirectionMask.west
    } else {
      const targetGeometry = graph.getCellGeometry(targetState.cell)!
      if (targetGeometry.relative) {
        isTargetLeft = targetGeometry.bounds.x <= 0.5
      } else {
        isTargetLeft =
          sourceState.bounds.x + sourceState.bounds.width < targetState.bounds.x
      }
    }
  }

  if (sourceState && targetState) {
    const x0 = isSourceLeft
      ? sourceState.bounds.x
      : sourceState.bounds.x + sourceState.bounds.width
    const y0 = view.getRoutingCenterY(sourceState)

    const xe = isTargetLeft
      ? targetState.bounds.x
      : targetState.bounds.x + targetState.bounds.width
    const ye = view.getRoutingCenterY(targetState)

    const seg = segment

    let dx = isSourceLeft ? -seg : seg
    const dep = new Point(x0 + dx, y0)

    dx = isTargetLeft ? -seg : seg
    const arr = new Point(xe + dx, ye)

    // Adds intermediate points if both go out on same side
    if (isSourceLeft === isTargetLeft) {
      const x = isSourceLeft
        ? Math.min(x0, xe) - segment
        : Math.max(x0, xe) + segment

      result.push(new Point(x, y0))
      result.push(new Point(x, ye))
    } else if (dep.x < arr.x === isSourceLeft) {
      const midY = y0 + (ye - y0) / 2

      result.push(dep)
      result.push(new Point(dep.x, midY))
      result.push(new Point(arr.x, midY))
      result.push(arr)
    } else {
      result.push(dep)
      result.push(arr)
    }
  }
}
