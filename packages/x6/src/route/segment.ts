import { Point } from '../geometry'
import { State } from '../core/state'

/**
 * Orthogonal edge style.
 */
export function segment(
  edgeState: State,
  sourceState: State | null,
  targetState: State | null,
  hints: Point[],
  result: Point[],
) {
  // Creates array of all way- and terminalpoints
  const pts = edgeState.absolutePoints
  const tol = Math.max(1, edgeState.view.scale)

  // Whether the first segment outgoing from the source end is horizontal
  let lastPushed = result.length > 0 ? result[0] : null
  let horizontal = true
  let hint = null

  // Adds waypoints only if outside of tolerance
  function pushPoint(pt: Point) {
    if (
      lastPushed == null ||
      Math.abs(lastPushed.x - pt.x) >= tol ||
      Math.abs(lastPushed.y - pt.y) >= tol
    ) {
      result.push(pt)
      lastPushed = pt
    }

    return lastPushed
  }

  let pe
  let pt = pts[0]

  if (pt == null && sourceState != null) {
    pt = new Point(
      edgeState.view.getRoutingCenterX(sourceState),
      edgeState.view.getRoutingCenterY(sourceState),
    )
  } else if (pt != null) {
    pt = pt.clone()
  }

  pt = pt!
  pt.x = Math.round(pt.x)
  pt.y = Math.round(pt.y)

  const lastInx = pts.length - 1

  // Adds the waypoints
  if (hints != null && hints.length > 0) {
    // Converts all hints and removes nulls
    const newHints = []

    for (let i = 0, ii = hints.length; i < ii; i += 1) {
      const tmp = edgeState.view.transformControlPoint(edgeState, hints[i])
      if (tmp != null) {
        tmp.x = Math.round(tmp.x)
        tmp.y = Math.round(tmp.y)
        newHints.push(tmp)
      }
    }

    if (newHints.length === 0) {
      return
    }

    // tslint:disable-next-line
    hints = newHints

    // Aligns source and target hint to fixed points
    if (pt != null && hints[0] != null) {
      if (Math.abs(hints[0].x - pt.x) < tol) {
        hints[0].x = pt.x
      }

      if (Math.abs(hints[0].y - pt.y) < tol) {
        hints[0].y = pt.y
      }
    }

    pe = pts[lastInx]

    if (pe != null && hints[hints.length - 1] != null) {
      if (Math.abs(hints[hints.length - 1].x - pe.x) < tol) {
        hints[hints.length - 1].x = pe.x
      }

      if (Math.abs(hints[hints.length - 1].y - pe.y) < tol) {
        hints[hints.length - 1].y = pe.y
      }
    }

    hint = hints[0]

    let currentTerm: State | null = sourceState
    let currentPt = pts[0]
    let hozChan = false
    let vertChan = false
    let currentHint = hint

    if (currentPt != null) {
      currentPt.x = Math.round(currentPt.x)
      currentPt.y = Math.round(currentPt.y)
      currentTerm = null
    }

    // Check for alignment with fixed points and with channels
    // at source and target segments only
    for (let i = 0; i < 2; i += 1) {
      const fixedVertAlign = currentPt != null && currentPt.x === currentHint.x
      const fixedHozAlign = currentPt != null && currentPt.y === currentHint.y

      const inHozChan =
        currentTerm != null &&
        currentHint.y >= currentTerm.bounds.y &&
        currentHint.y <= currentTerm.bounds.y + currentTerm.bounds.height
      const inVertChan =
        currentTerm != null &&
        currentHint.x >= currentTerm.bounds.x &&
        currentHint.x <= currentTerm.bounds.x + currentTerm.bounds.width

      hozChan = fixedHozAlign || (currentPt == null && inHozChan)
      vertChan = fixedVertAlign || (currentPt == null && inVertChan)

      // If the current hint falls in both the hor and vert channels in the case
      // of a floating port, or if the hint is exactly co-incident with a
      // fixed point, ignore the source and try to work out the orientation
      // from the target end
      if (
        i === 0 &&
        ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign))
      ) {
      } else {
        if (
          currentPt != null &&
          !fixedHozAlign &&
          !fixedVertAlign &&
          (inHozChan || inVertChan)
        ) {
          horizontal = inHozChan ? false : true
          break
        }

        if (vertChan || hozChan) {
          horizontal = hozChan

          if (i === 1) {
            // Work back from target end
            horizontal = hints.length % 2 === 0 ? hozChan : vertChan
          }

          break
        }
      }

      currentTerm = targetState
      currentPt = pts[lastInx]

      if (currentPt != null) {
        currentPt.x = Math.round(currentPt.x)
        currentPt.y = Math.round(currentPt.y)
        currentTerm = null
      }

      currentHint = hints[hints.length - 1]

      if (fixedVertAlign && fixedHozAlign) {
        // tslint:disable-next-line
        hints = hints.slice(1)
      }
    }

    if (
      horizontal &&
      ((pts[0] != null && pts[0]!.y !== hint.y) ||
        (pts[0] == null &&
          sourceState != null &&
          (hint.y < sourceState.bounds.y ||
            hint.y > sourceState.bounds.y + sourceState.bounds.height)))
    ) {
      pushPoint(new Point(pt.x, hint.y))
    } else if (
      !horizontal &&
      ((pts[0] != null && pts[0]!.x !== hint.x) ||
        (pts[0] == null &&
          sourceState != null &&
          (hint.x < sourceState.bounds.x ||
            hint.x > sourceState.bounds.x + sourceState.bounds.width)))
    ) {
      pushPoint(new Point(hint.x, pt.y))
    }

    if (horizontal) {
      pt.y = hint.y
    } else {
      pt.x = hint.x
    }

    for (let i = 0, ii = hints.length; i < ii; i += 1) {
      horizontal = !horizontal
      hint = hints[i]

      // 				mxLog.show();
      // 				mxLog.debug('hint', i, hint.x, hint.y);

      if (horizontal) {
        pt.y = hint.y
      } else {
        pt.x = hint.x
      }

      pushPoint(pt.clone())
    }
  } else {
    hint = pt
    // FIXME: First click in connect preview toggles orientation
    horizontal = true
  }

  // Adds the last point
  pt = pts[lastInx]

  if (pt == null && targetState != null) {
    pt = new Point(
      edgeState.view.getRoutingCenterX(targetState),
      edgeState.view.getRoutingCenterY(targetState),
    )
  }

  if (pt != null) {
    pt.x = Math.round(pt.x)
    pt.y = Math.round(pt.y)

    if (hint != null) {
      if (
        horizontal &&
        ((pts[lastInx] != null && pts[lastInx]!.y !== hint.y) ||
          (pts[lastInx] == null &&
            targetState != null &&
            (hint.y < targetState.bounds.y ||
              hint.y > targetState.bounds.y + targetState.bounds.height)))
      ) {
        pushPoint(new Point(pt.x, hint.y))
      } else if (
        !horizontal &&
        ((pts[lastInx] != null && pts[lastInx]!.x !== hint.x) ||
          (pts[lastInx] == null &&
            targetState != null &&
            (hint.x < targetState.bounds.x ||
              hint.x > targetState.bounds.x + targetState.bounds.width)))
      ) {
        pushPoint(new Point(hint.x, pt.y))
      }
    }
  }

  // Removes bends inside the source terminal for floating ports
  if (pts[0] == null && sourceState != null) {
    while (
      result.length > 1 &&
      result[1] != null &&
      sourceState.bounds.containsPoint(result[1])
    ) {
      result.splice(1, 1)
    }
  }

  // Removes bends inside the target terminal
  if (pts[lastInx] == null && targetState != null) {
    while (
      result.length > 1 &&
      result[result.length - 1] != null &&
      targetState.bounds.containsPoint(result[result.length - 1])
    ) {
      result.splice(result.length - 1, 1)
    }
  }

  // Removes last point if inside tolerance with end point
  if (
    pe != null &&
    result[result.length - 1] != null &&
    Math.abs(pe.x - result[result.length - 1].x) < tol &&
    Math.abs(pe.y - result[result.length - 1].y) < tol
  ) {
    result.splice(result.length - 1, 1)

    // Lines up second last point in result with end point
    if (result[result.length - 1] != null) {
      if (Math.abs(result[result.length - 1].x - pe.x) < tol) {
        result[result.length - 1].x = pe.x
      }

      if (Math.abs(result[result.length - 1].y - pe.y) < tol) {
        result[result.length - 1].y = pe.y
      }
    }
  }
}
