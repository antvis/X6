import { Point } from '../geometry'
import { Cell } from '../core/cell'
import { State } from '../core/state'

/**
 * Uses either `sideToSide` or `topToBottom` depending on the horizontal
 * flag in the cell style.
 */
export function elbow(
  edgeState: State,
  sourceState: State | null,
  targetState: State | null,
  points: Point[],
  result: Point[],
) {
  let pt = points != null && points.length > 0 ? points[0] : null
  let vertical = false
  let horizontal = false

  if (sourceState != null && targetState != null) {
    if (pt != null) {
      const left = Math.min(sourceState.bounds.x, targetState.bounds.x)
      const right = Math.max(
        sourceState.bounds.x + sourceState.bounds.width,
        targetState.bounds.x + targetState.bounds.width,
      )

      const top = Math.min(sourceState.bounds.y, targetState.bounds.y)
      const bottom = Math.max(
        sourceState.bounds.y + sourceState.bounds.height,
        targetState.bounds.y + targetState.bounds.height,
      )

      pt = edgeState.view.transformControlPoint(edgeState, pt)!

      vertical = pt.y < top || pt.y > bottom
      horizontal = pt.x < left || pt.x > right
    } else {
      const left = Math.max(sourceState.bounds.x, targetState.bounds.x)
      const right = Math.min(
        sourceState.bounds.x + sourceState.bounds.width,
        targetState.bounds.x + targetState.bounds.width,
      )

      vertical = left === right

      if (!vertical) {
        const top = Math.max(sourceState.bounds.y, targetState.bounds.y)
        const bottom = Math.min(
          sourceState.bounds.y + sourceState.bounds.height,
          targetState.bounds.y + targetState.bounds.height,
        )

        horizontal = top === bottom
      }
    }
  }

  if (!horizontal && (vertical || edgeState.style.elbow === 'vertical')) {
    topToBottom(edgeState, sourceState, targetState, points, result)
  } else {
    sideToSide(edgeState, sourceState, targetState, points, result)
  }
}

/**
 * Vertical elbow edge.
 */
export function sideToSide(
  edgeState: State,
  sourceState: State | null,
  targetState: State | null,
  points: Point[],
  result: Point[],
) {
  const view = edgeState.view
  let pt = points != null && points.length > 0 ? points[0] : null
  const pts = edgeState.absolutePoints
  const p0 = pts[0]
  const pe = pts[pts.length - 1]

  if (pt != null) {
    pt = view.transformControlPoint(edgeState, pt)
  }

  if (p0 != null) {
    // tslint:disable-next-line
    sourceState = new State(view, sourceState ? sourceState.cell : new Cell())
    sourceState.bounds.x = p0.x
    sourceState.bounds.y = p0.y
  }

  if (pe != null) {
    // tslint:disable-next-line
    targetState = new State(view, targetState ? targetState.cell : new Cell())
    targetState.bounds.x = pe.x
    targetState.bounds.y = pe.y
  }

  if (sourceState != null && targetState != null) {
    const l = Math.max(sourceState.bounds.x, targetState.bounds.x)
    const r = Math.min(
      sourceState.bounds.x + sourceState.bounds.width,
      targetState.bounds.x + targetState.bounds.width,
    )

    const x = pt != null ? pt.x : Math.round(r + (l - r) / 2)

    let y1 = view.getRoutingCenterY(sourceState)
    let y2 = view.getRoutingCenterY(targetState)

    if (pt != null) {
      if (
        pt.y >= sourceState.bounds.y &&
        pt.y <= sourceState.bounds.y + sourceState.bounds.height
      ) {
        y1 = pt.y
      }

      if (
        pt.y >= targetState.bounds.y &&
        pt.y <= targetState.bounds.y + targetState.bounds.height
      ) {
        y2 = pt.y
      }
    }

    if (
      !targetState.bounds.containsPoint(x, y1) &&
      !sourceState.bounds.containsPoint(x, y1)
    ) {
      result.push(new Point(x, y1))
    }

    if (
      !targetState.bounds.containsPoint(x, y2) &&
      !sourceState.bounds.containsPoint(x, y2)
    ) {
      result.push(new Point(x, y2))
    }

    if (result.length === 1) {
      if (pt != null) {
        if (
          !targetState.bounds.containsPoint(x, pt.y) &&
          !sourceState.bounds.containsPoint(x, pt.y)
        ) {
          result.push(new Point(x, pt.y))
        }
      } else {
        const t = Math.max(sourceState.bounds.y, targetState.bounds.y)
        const b = Math.min(
          sourceState.bounds.y + sourceState.bounds.height,
          targetState.bounds.y + targetState.bounds.height,
        )
        result.push(new Point(x, t + (b - t) / 2))
      }
    }
  }
}

/**
 * Horizontal elbow edge.
 */
export function topToBottom(
  edgeState: State,
  sourceState: State | null,
  targetState: State | null,
  points: Point[],
  result: Point[],
) {
  const view = edgeState.view
  let pt = points != null && points.length > 0 ? points[0] : null
  const pts = edgeState.absolutePoints
  const p0 = pts[0]
  const pe = pts[pts.length - 1]

  if (pt != null) {
    pt = view.transformControlPoint(edgeState, pt)
  }

  if (p0 != null) {
    // tslint:disable-next-line
    sourceState = new State(view, sourceState ? sourceState.cell : new Cell())
    sourceState.bounds.x = p0.x
    sourceState.bounds.y = p0.y
  }

  if (pe != null) {
    // tslint:disable-next-line
    targetState = new State(view, targetState ? targetState.cell : new Cell())
    targetState.bounds.x = pe.x
    targetState.bounds.y = pe.y
  }

  if (sourceState != null && targetState != null) {
    const t = Math.max(sourceState.bounds.y, targetState.bounds.y)
    const b = Math.min(
      sourceState.bounds.y + sourceState.bounds.height,
      targetState.bounds.y + targetState.bounds.height,
    )

    let x = view.getRoutingCenterX(sourceState)

    if (
      pt != null &&
      pt.x >= sourceState.bounds.x &&
      pt.x <= sourceState.bounds.x + sourceState.bounds.width
    ) {
      x = pt.x
    }

    const y = pt != null ? pt.y : Math.round(b + (t - b) / 2)

    if (
      !targetState.bounds.containsPoint(x, y) &&
      !sourceState.bounds.containsPoint(x, y)
    ) {
      result.push(new Point(x, y))
    }

    if (
      pt != null &&
      pt.x >= targetState.bounds.x &&
      pt.x <= targetState.bounds.x + targetState.bounds.width
    ) {
      x = pt.x
    } else {
      x = view.getRoutingCenterX(targetState)
    }

    if (
      !targetState.bounds.containsPoint(x, y) &&
      !sourceState.bounds.containsPoint(x, y)
    ) {
      result.push(new Point(x, y))
    }

    if (result.length === 1) {
      if (pt != null && result.length === 1) {
        if (
          !targetState.bounds.containsPoint(pt.x, y) &&
          !sourceState.bounds.containsPoint(pt.x, y)
        ) {
          result.push(new Point(pt.x, y))
        }
      } else {
        const l = Math.max(sourceState.bounds.x, targetState.bounds.x)
        const r = Math.min(
          sourceState.bounds.x + sourceState.bounds.width,
          targetState.bounds.x + targetState.bounds.width,
        )

        result.push(new Point(l + (r - l) / 2, y))
      }
    }
  }
}
