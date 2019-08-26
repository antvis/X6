import * as util from '../util'
import { constants } from '../common'
import { CellState } from '../core'
import { Point, Rectangle, DirectionMask, EdgeType } from '../struct'

export namespace EdgeStyle {

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
  export function entityRelation(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    points: Point[],
    result: Point[],
  ) {
    const view = edgeState.view
    const graph = view.graph
    const segment = (edgeState.style.segment || constants.ENTITY_SEGMENT)
      * view.scale

    const pts = edgeState.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    let isSourceLeft = false

    if (p0 != null) {
      // tslint:disable-next-line
      sourceState = new CellState(sourceState.view, sourceState.cell)
      sourceState.bounds.x = p0.x
      sourceState.bounds.y = p0.y
    } else if (sourceState != null) {
      const constraint = util.getPortConstraints(
        sourceState,
        edgeState,
        true,
        DirectionMask.none,
      )
      if (
        constraint !== DirectionMask.none &&
        constraint !== DirectionMask.west + DirectionMask.east
      ) {
        isSourceLeft = constraint === DirectionMask.west
      } else {
        const sourceGeometry = graph.getCellGeometry(sourceState.cell)!
        if (sourceGeometry.relative) {
          isSourceLeft = sourceGeometry.bounds.x <= 0.5
        } else if (targetState != null) {
          isSourceLeft = targetState.bounds.x + targetState.bounds.width < sourceState.bounds.x
        }
      }
    } else {
      return
    }

    let isTargetLeft = true

    if (pe != null) {
      // tslint:disable-next-line
      targetState = new CellState(targetState.view, targetState.cell)
      targetState.bounds.x = pe.x
      targetState.bounds.y = pe.y
    } else if (targetState != null) {
      const constraint = util.getPortConstraints(
        targetState,
        edgeState,
        false,
        DirectionMask.none,
      )

      if (
        constraint !== DirectionMask.none &&
        constraint !== DirectionMask.west + DirectionMask.east
      ) {
        isTargetLeft = constraint === DirectionMask.west
      } else {
        const targetGeometry = graph.getCellGeometry(targetState.cell)!
        if (targetGeometry.relative) {
          isTargetLeft = targetGeometry.bounds.x <= 0.5
        } else if (sourceState != null) {
          isTargetLeft = sourceState.bounds.x + sourceState.bounds.width < targetState.bounds.x
        }
      }
    }

    if (sourceState != null && targetState != null) {
      const x0 = isSourceLeft
        ? sourceState.bounds.x
        : sourceState.bounds.x + sourceState.bounds.width
      const y0 = view.getRoutingCenterY(sourceState)

      const xe = isTargetLeft
        ? targetState.bounds.x
        : targetState.bounds.x + targetState.bounds.width
      const ye = view.getRoutingCenterY(targetState)

      const seg = segment

      let dx = (isSourceLeft) ? -seg : seg
      const dep = new Point(x0 + dx, y0)

      dx = (isTargetLeft) ? -seg : seg
      const arr = new Point(xe + dx, ye)

      // Adds intermediate points if both go out on same side
      if (isSourceLeft === isTargetLeft) {
        const x = (isSourceLeft) ?
          Math.min(x0, xe) - segment :
          Math.max(x0, xe) + segment

        result.push(new Point(x, y0))
        result.push(new Point(x, ye))
      } else if ((dep.x < arr.x) === isSourceLeft) {
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

  export function loop(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    points: Point[],
    result: Point[],
  ) {
    const pts = edgeState.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    if (p0 != null && pe != null) {
      if (points != null && points.length > 0) {
        points.forEach((point) => {
          const p = edgeState.view.transformControlPoint(edgeState, point)!
          result.push(new Point(p.x, p.y))
        })
      }

      return
    }

    if (sourceState != null) {
      const view = edgeState.view
      const graph = view.graph
      let pt = (points != null && points.length > 0) ? points[0] : null
      if (pt != null) {
        pt = view.transformControlPoint(edgeState, pt)!
        if (util.contains(sourceState.bounds, pt.x, pt.y)) {
          pt = null
        }
      }

      let x = 0
      let y = 0
      let dx = 0
      let dy = 0

      const seg = (edgeState.style.segment || graph.gridSize) * view.scale
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
      } else if (pt != null) {
        x = view.getRoutingCenterX(sourceState)
        dx = Math.max(Math.abs(x - pt.x), dy)
        y = pt.y
        dy = 0
      }

      result.push(new Point(x - dx, y - dy))
      result.push(new Point(x + dx, y + dy))
    }
  }

  /**
   * Uses either <SideToSide> or <TopToBottom> depending on the horizontal
   * flag in the cell style. <SideToSide> is used if horizontal is true or
   * unspecified. See <EntityRelation> for a description of the
   * parameters.
   */
  export function elbowConnector(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    points: Point[],
    result: Point[],
  ) {
    let pt = (points != null && points.length > 0) ? points[0] : null
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

    if (!horizontal && (
      vertical ||
      edgeState.style.elbow === EdgeType.vertical)
    ) {
      topToBottom(edgeState, sourceState, targetState, points, result)
    } else {
      sideToSide(edgeState, sourceState, targetState, points, result)
    }
  }

  /**
   * Implements a vertical elbow edge.
   */
  export function sideToSide(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    points: Point[],
    result: Point[],
  ) {
    const view = edgeState.view
    let pt = (points != null && points.length > 0) ? points[0] : null
    const pts = edgeState.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    if (pt != null) {
      pt = view.transformControlPoint(edgeState, pt)
    }

    if (p0 != null) {
      // tslint:disable-next-line
      sourceState = new CellState(sourceState.view, sourceState.cell)
      sourceState.bounds.x = p0.x
      sourceState.bounds.y = p0.y
    }

    if (pe != null) {
      // tslint:disable-next-line
      targetState = new CellState(targetState.view, targetState.cell)
      targetState.bounds.x = pe.x
      targetState.bounds.y = pe.y
    }

    if (sourceState != null && targetState != null) {
      const l = Math.max(sourceState.bounds.x, targetState.bounds.x)
      const r = Math.min(
        sourceState.bounds.x + sourceState.bounds.width,
        targetState.bounds.x + targetState.bounds.width,
      )

      const x = (pt != null) ? pt.x : Math.round(r + (l - r) / 2)

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
        !util.contains(targetState.bounds, x, y1) &&
        !util.contains(sourceState.bounds, x, y1)
      ) {
        result.push(new Point(x, y1))
      }

      if (
        !util.contains(targetState.bounds, x, y2) &&
        !util.contains(sourceState.bounds, x, y2)
      ) {
        result.push(new Point(x, y2))
      }

      if (result.length === 1) {
        if (pt != null) {
          if (
            !util.contains(targetState.bounds, x, pt.y) &&
            !util.contains(sourceState.bounds, x, pt.y)
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
   * Implements a horizontal elbow edge.
   */
  export function topToBottom(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    points: Point[],
    result: Point[],
  ) {
    const view = edgeState.view
    let pt = (points != null && points.length > 0) ? points[0] : null
    const pts = edgeState.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    if (pt != null) {
      pt = view.transformControlPoint(edgeState, pt)
    }

    if (p0 != null) {
      // tslint:disable-next-line
      sourceState = new CellState(sourceState.view, sourceState.cell)
      sourceState.bounds.x = p0.x
      sourceState.bounds.y = p0.y
    }

    if (pe != null) {
      // tslint:disable-next-line
      targetState = new CellState(sourceState.view, sourceState.cell)
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

      const y = (pt != null) ? pt.y : Math.round(b + (t - b) / 2)

      if (
        !util.contains(targetState.bounds, x, y) &&
        !util.contains(sourceState.bounds, x, y)
      ) {
        result.push(new Point(x, y))
      }

      if (pt != null &&
        pt.x >= targetState.bounds.x &&
        pt.x <= targetState.bounds.x + targetState.bounds.width) {
        x = pt.x
      } else {
        x = view.getRoutingCenterX(targetState)
      }

      if (
        !util.contains(targetState.bounds, x, y) &&
        !util.contains(sourceState.bounds, x, y)
      ) {
        result.push(new Point(x, y))
      }

      if (result.length === 1) {
        if (pt != null && result.length === 1) {
          if (
            !util.contains(targetState.bounds, pt.x, y) &&
            !util.contains(sourceState.bounds, pt.x, y)
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

  /**
   * Implements an orthogonal edge style.
   */
  export function segmentConnector(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    hints: Point[],
    result: Point[],
  ) {
    // Creates array of all way- and terminalpoints
    const pts = edgeState.absolutePoints
    const tol = Math.max(1, edgeState.view.scale)

    // Whether the first segment outgoing from the source end is horizontal
    let lastPushed = (result.length > 0) ? result[0] : null
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

      let currentTerm: CellState | null = sourceState
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

        const inHozChan = currentTerm != null && (
          currentHint.y >= currentTerm.bounds.y &&
          currentHint.y <= currentTerm.bounds.y + currentTerm.bounds.height
        )
        const inVertChan = currentTerm != null && (
          currentHint.x >= currentTerm.bounds.x &&
          currentHint.x <= currentTerm.bounds.x + currentTerm.bounds.width
        )

        hozChan = fixedHozAlign || (currentPt == null && inHozChan)
        vertChan = fixedVertAlign || (currentPt == null && inVertChan)

        // If the current hint falls in both the hor and vert channels in the case
        // of a floating port, or if the hint is exactly co-incident with a
        // fixed point, ignore the source and try to work out the orientation
        // from the target end
        if (i === 0 && ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign))) {
        } else {
          if (
            currentPt != null &&
            (!fixedHozAlign && !fixedVertAlign) &&
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

      if (horizontal && (
        (pts[0] != null && pts[0]!.y !== hint.y) ||
        (
          pts[0] == null && sourceState != null &&
          (
            hint.y < sourceState.bounds.y ||
            hint.y > sourceState.bounds.y + sourceState.bounds.height
          )
        )
      )) {

        pushPoint(new Point(pt.x, hint.y))

      } else if (!horizontal && (
        (pts[0] != null && pts[0]!.x !== hint.x) ||
        (
          pts[0] == null && sourceState != null &&
          (
            hint.x < sourceState.bounds.x ||
            hint.x > sourceState.bounds.x + sourceState.bounds.width
          )
        )
      )) {
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
        if (horizontal && (
          (pts[lastInx] != null && pts[lastInx]!.y !== hint.y) ||
          (
            pts[lastInx] == null && targetState != null && (
              hint.y < targetState.bounds.y ||
              hint.y > targetState.bounds.y + targetState.bounds.height
            )
          )
        )) {

          pushPoint(new Point(pt.x, hint.y))

        } else if (!horizontal && (
          (pts[lastInx] != null && pts[lastInx]!.x !== hint.x) ||
          (
            pts[lastInx] == null && targetState != null && (
              hint.x < targetState.bounds.x ||
              hint.x > targetState.bounds.x + targetState.bounds.width
            )
          )
        )) {

          pushPoint(new Point(hint.x, pt.y))
        }
      }
    }

    // Removes bends inside the source terminal for floating ports
    if (pts[0] == null && sourceState != null) {
      while (
        result.length > 1 &&
        result[1] != null &&
        util.contains(sourceState.bounds, result[1].x, result[1].y)
      ) {
        result.splice(1, 1)
      }
    }

    // Removes bends inside the target terminal
    if (pts[lastInx] == null && targetState != null) {
      while (
        result.length > 1 &&
        result[result.length - 1] != null &&
        util.contains(targetState.bounds, result[result.length - 1].x, result[result.length - 1].y)
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

  export const orthBuffer = 10
  export const orthPointsFallback = true

  export const dirVectors = [
    [-1, 0], [0, -1], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 0],
  ]

  export const wayPoints1 = [
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
  ]

  export const routePatterns = [
    [
      [513, 2308, 2081, 2562],
      [513, 1090, 514, 2184, 2114, 2561],
      [513, 1090, 514, 2564, 2184, 2562],
      [513, 2308, 2561, 1090, 514, 2568, 2308],
    ],
    [
      [514, 1057, 513, 2308, 2081, 2562],
      [514, 2184, 2114, 2561],
      [514, 2184, 2562, 1057, 513, 2564, 2184],
      [514, 1057, 513, 2568, 2308, 2561],
    ],
    [
      [1090, 514, 1057, 513, 2308, 2081, 2562],
      [2114, 2561],
      [1090, 2562, 1057, 513, 2564, 2184],
      [1090, 514, 1057, 513, 2308, 2561, 2568],
    ],
    [
      [2081, 2562],
      [1057, 513, 1090, 514, 2184, 2114, 2561],
      [1057, 513, 1090, 514, 2184, 2562, 2564],
      [1057, 2561, 1090, 514, 2568, 2308],
    ],
  ]

  export const inlineRoutePatterns = [
    [null, [2114, 2568], null, null],
    [null, [514, 2081, 2114, 2568], null, null],
    [null, [2114, 2561], null, null],
    [[2081, 2562], [1057, 2114, 2568], [2184, 2562], null],
  ]

  export const vertexSeperations: number[] = []

  export const limits = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]

  export const LEFT_MASK = 32
  export const TOP_MASK = 64
  export const RIGHT_MASK = 128
  export const BOTTOM_MASK = 256
  export const SIDE_MASK = 480

  export const LEFT = 1
  export const TOP = 2
  export const RIGHT = 4
  export const BOTTOM = 8

  export const CENTER_MASK = 512
  export const SOURCE_MASK = 1024
  export const TARGET_MASK = 2048
  export const VERTEX_MASK = 3072

  export function getJettySize(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    points: Point[],
    isSource?: boolean,
  ) {
    let value = (isSource
      ? edgeState.style.sourceJettySize
      : edgeState.style.targetJettySize
    ) || edgeState.style.jettySize || orthBuffer

    if ((value as any) === 'auto') {
      // Computes the automatic jetty size
      const type = (isSource
        ? edgeState.style.startArrow
        : edgeState.style.endArrow
      ) || constants.NONE

      if (type !== constants.NONE) {
        const size = (isSource
          ? edgeState.style.startSize
          : edgeState.style.endSize
        ) || constants.DEFAULT_MARKERSIZE

        value = Math.max(2, Math.ceil((size + orthBuffer) / orthBuffer)) * orthBuffer

      } else {
        value = 2 * orthBuffer
      }
    }

    return value
  }

  /**
   * Implements a local orthogonal router between the given
   * cells.
   *
   * Parameters:
   *
   * state - <mxCellState> that represents the edge to be updated.
   * source - <mxCellState> that represents the source terminal.
   * target - <mxCellState> that represents the target terminal.
   * points - List of relative control points.
   * result - Array of <Points> that represent the actual points of the
   * edge.
   *
   */
  export function orthConnector(
    edgeState: CellState,
    sourceState: CellState,
    targetState: CellState,
    points: Point[],
    result: Point[],
  ) {
    const graph = edgeState.view.graph
    const sourceEdge = sourceState == null ? false : graph.getModel().isEdge(sourceState.cell)
    const targetEdge = targetState == null ? false : graph.getModel().isEdge(targetState.cell)

    const pts = edgeState.absolutePoints
    const p0 = pts[0]!
    const pe = pts[pts.length - 1]!

    let sourceX = sourceState != null ? sourceState.bounds.x : p0.x
    let sourceY = sourceState != null ? sourceState.bounds.y : p0.y
    let sourceWidth = sourceState != null ? sourceState.bounds.width : 0
    let sourceHeight = sourceState != null ? sourceState.bounds.height : 0

    let targetX = targetState != null ? targetState.bounds.x : pe.x
    let targetY = targetState != null ? targetState.bounds.y : pe.y
    let targetWidth = targetState != null ? targetState.bounds.width : 0
    let targetHeight = targetState != null ? targetState.bounds.height : 0

    let scaledSourceBuffer = edgeState.view.scale *
      (getJettySize(edgeState, sourceState, targetState, points, true) as number)

    let scaledTargetBuffer = edgeState.view.scale *
      (getJettySize(edgeState, sourceState, targetState, points, false) as number)

    // Workaround for loop routing within buffer zone
    if (sourceState != null && targetState === sourceState) {
      scaledTargetBuffer = Math.max(scaledSourceBuffer, scaledTargetBuffer)
      scaledSourceBuffer = scaledTargetBuffer
    }

    const totalBuffer = scaledTargetBuffer + scaledSourceBuffer
    let tooShort = false

    // Checks minimum distance for fixed points and falls back to segment connector
    if (p0 != null && pe != null) {
      const dx = pe.x - p0.x
      const dy = pe.y - p0.y

      tooShort = dx * dx + dy * dy < totalBuffer * totalBuffer
    }

    if (
      tooShort ||
      (orthPointsFallback && (points != null && points.length > 0)) ||
      sourceEdge || targetEdge
    ) {
      segmentConnector(edgeState, sourceState, targetState, points, result)
      return
    }

    // Determine the side(s) of the source and target vertices
    // that the edge may connect to
    // portConstraint [source, target]
    const portConstraint = [DirectionMask.all, DirectionMask.all]
    let rotation = 0

    if (sourceState != null) {
      portConstraint[0] = util.getPortConstraints(
        sourceState, edgeState, true, DirectionMask.all,
      )
      rotation = sourceState.style.rotation || 0
      if (rotation !== 0) {
        const newRect = util.getBoundingBox(
          new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
          rotation,
        )
        sourceX = newRect.x
        sourceY = newRect.y
        sourceWidth = newRect.width
        sourceHeight = newRect.height
      }
    }

    if (targetState != null) {
      portConstraint[1] = util.getPortConstraints(
        targetState, edgeState, false, DirectionMask.all,
      )
      rotation = targetState.style.rotation || 0
      if (rotation !== 0) {
        const newRect = util.getBoundingBox(
          new Rectangle(targetX, targetY, targetWidth, targetHeight),
          rotation,
        )
        targetX = newRect.x
        targetY = newRect.y
        targetWidth = newRect.width
        targetHeight = newRect.height
      }
    }

    // Avoids floating point number errors
    sourceX = Math.round(sourceX * 10) / 10
    sourceY = Math.round(sourceY * 10) / 10
    sourceWidth = Math.round(sourceWidth * 10) / 10
    sourceHeight = Math.round(sourceHeight * 10) / 10

    targetX = Math.round(targetX * 10) / 10
    targetY = Math.round(targetY * 10) / 10
    targetWidth = Math.round(targetWidth * 10) / 10
    targetHeight = Math.round(targetHeight * 10) / 10

    const dir = [0, 0]

    // Work out which faces of the vertices present against each other
    // in a way that would allow a 3-segment connection if port constraints
    // permitted.
    // geo -> [source, target] [x, y, width, height]
    const geo = [
      [sourceX, sourceY, sourceWidth, sourceHeight],
      [targetX, targetY, targetWidth, targetHeight],
    ]
    const buffer = [scaledSourceBuffer, scaledTargetBuffer]

    for (let i = 0; i < 2; i += 1) {
      limits[i][1] = geo[i][0] - buffer[i]
      limits[i][2] = geo[i][1] - buffer[i]
      limits[i][4] = geo[i][0] + geo[i][2] + buffer[i]
      limits[i][8] = geo[i][1] + geo[i][3] + buffer[i]
    }

    // Work out which quad the target is in
    const sourceCenX = geo[0][0] + geo[0][2] / 2.0
    const sourceCenY = geo[0][1] + geo[0][3] / 2.0
    const targetCenX = geo[1][0] + geo[1][2] / 2.0
    const targetCenY = geo[1][1] + geo[1][3] / 2.0

    const dx = sourceCenX - targetCenX
    const dy = sourceCenY - targetCenY

    let quad = 0

    if (dx < 0) {
      if (dy < 0) {
        quad = 2
      } else {
        quad = 1
      }
    } else {
      if (dy <= 0) {
        quad = 3

        // Special case on x = 0 and negative y
        if (dx === 0) {
          quad = 2
        }
      }
    }

    // Check for connection constraints
    let currentTerm = null

    if (sourceState != null) {
      currentTerm = p0
    }

    const constraint = [[0.5, 0.5], [0.5, 0.5]]

    for (let i = 0; i < 2; i += 1) {
      if (currentTerm != null) {
        constraint[i][0] = (currentTerm.x - geo[i][0]) / geo[i][2]

        if (Math.abs(currentTerm.x - geo[i][0]) <= 1) {
          dir[i] = DirectionMask.west
        } else if (Math.abs(currentTerm.x - geo[i][0] - geo[i][2]) <= 1) {
          dir[i] = DirectionMask.east
        }

        constraint[i][1] = (currentTerm.y - geo[i][1]) / geo[i][3]

        if (Math.abs(currentTerm.y - geo[i][1]) <= 1) {
          dir[i] = DirectionMask.north
        } else if (Math.abs(currentTerm.y - geo[i][1] - geo[i][3]) <= 1) {
          dir[i] = DirectionMask.south
        }
      }

      currentTerm = null

      if (targetState != null) {
        currentTerm = pe
      }
    }

    const sourceTopDist = geo[0][1] - (geo[1][1] + geo[1][3])
    const sourceLeftDist = geo[0][0] - (geo[1][0] + geo[1][2])
    const sourceBottomDist = geo[1][1] - (geo[0][1] + geo[0][3])
    const sourceRightDist = geo[1][0] - (geo[0][0] + geo[0][2])

    vertexSeperations[1] = Math.max(sourceLeftDist - totalBuffer, 0)
    vertexSeperations[2] = Math.max(sourceTopDist - totalBuffer, 0)
    vertexSeperations[4] = Math.max(sourceBottomDist - totalBuffer, 0)
    vertexSeperations[3] = Math.max(sourceRightDist - totalBuffer, 0)

    // ==============================================================
    // Start of source and target direction determination

    // Work through the preferred orientations by relative positioning
    // of the vertices and list them in preferred and available order

    const dirPref = []
    const horPref = []
    const vertPref = []

    horPref[0] = (sourceLeftDist >= sourceRightDist)
      ? DirectionMask.west
      : DirectionMask.east
    vertPref[0] = (sourceTopDist >= sourceBottomDist)
      ? DirectionMask.north
      : DirectionMask.south

    horPref[1] = util.reversePortConstraints(horPref[0])
    vertPref[1] = util.reversePortConstraints(vertPref[0])

    const preferredHorizDist = sourceLeftDist >= sourceRightDist ? sourceLeftDist
      : sourceRightDist
    const preferredVertDist = sourceTopDist >= sourceBottomDist ? sourceTopDist
      : sourceBottomDist

    const prefOrdering = [[0, 0], [0, 0]]
    let preferredOrderSet = false

    // If the preferred port isn't available, switch it
    for (let i = 0; i < 2; i += 1) {
      if (dir[i] !== 0x0) {
        continue
      }

      if ((horPref[i] & portConstraint[i]) === 0) {
        horPref[i] = util.reversePortConstraints(horPref[i])
      }

      if ((vertPref[i] & portConstraint[i]) === 0) {
        vertPref[i] = util.reversePortConstraints(vertPref[i])
      }

      prefOrdering[i][0] = vertPref[i]
      prefOrdering[i][1] = horPref[i]
    }

    if (preferredVertDist > 0
      && preferredHorizDist > 0) {
      // Possibility of two segment edge connection
      if (((horPref[0] & portConstraint[0]) > 0)
        && ((vertPref[1] & portConstraint[1]) > 0)) {
        prefOrdering[0][0] = horPref[0]
        prefOrdering[0][1] = vertPref[0]
        prefOrdering[1][0] = vertPref[1]
        prefOrdering[1][1] = horPref[1]
        preferredOrderSet = true
      } else if (((vertPref[0] & portConstraint[0]) > 0)
        && ((horPref[1] & portConstraint[1]) > 0)) {
        prefOrdering[0][0] = vertPref[0]
        prefOrdering[0][1] = horPref[0]
        prefOrdering[1][0] = horPref[1]
        prefOrdering[1][1] = vertPref[1]
        preferredOrderSet = true
      }
    }

    if (preferredVertDist > 0 && !preferredOrderSet) {
      prefOrdering[0][0] = vertPref[0]
      prefOrdering[0][1] = horPref[0]
      prefOrdering[1][0] = vertPref[1]
      prefOrdering[1][1] = horPref[1]
      preferredOrderSet = true

    }

    if (preferredHorizDist > 0 && !preferredOrderSet) {
      prefOrdering[0][0] = horPref[0]
      prefOrdering[0][1] = vertPref[0]
      prefOrdering[1][0] = horPref[1]
      prefOrdering[1][1] = vertPref[1]
      preferredOrderSet = true
    }

    // The source and target prefs are now an ordered list of
    // the preferred port selections
    // It the list can contain gaps, compact it

    for (let i = 0; i < 2; i += 1) {
      if (dir[i] !== 0x0) {
        continue
      }

      if ((prefOrdering[i][0] & portConstraint[i]) === 0) {
        prefOrdering[i][0] = prefOrdering[i][1]
      }

      dirPref[i] = prefOrdering[i][0] & portConstraint[i]
      dirPref[i] |= (prefOrdering[i][1] & portConstraint[i]) << 8
      dirPref[i] |= (prefOrdering[1 - i][i] & portConstraint[i]) << 16
      dirPref[i] |= (prefOrdering[1 - i][1 - i] & portConstraint[i]) << 24

      if ((dirPref[i] & 0xF) === 0) {
        dirPref[i] = dirPref[i] << 8
      }

      if ((dirPref[i] & 0xF00) === 0) {
        dirPref[i] = (dirPref[i] & 0xF) | dirPref[i] >> 8
      }

      if ((dirPref[i] & 0xF0000) === 0) {
        dirPref[i] = (dirPref[i] & 0xFFFF)
          | ((dirPref[i] & 0xF000000) >> 8)
      }

      dir[i] = dirPref[i] & 0xF

      if (
        portConstraint[i] === DirectionMask.west ||
        portConstraint[i] === DirectionMask.north ||
        portConstraint[i] === DirectionMask.east ||
        portConstraint[i] === DirectionMask.south
      ) {
        dir[i] = portConstraint[i]
      }
    }

    // ==============================================================
    // End of source and target direction determination

    let sourceIndex = dir[0] === DirectionMask.east ? 3 : dir[0]
    let targetIndex = dir[1] === DirectionMask.east ? 3 : dir[1]

    sourceIndex -= quad
    targetIndex -= quad

    if (sourceIndex < 1) {
      sourceIndex += 4
    }

    if (targetIndex < 1) {
      targetIndex += 4
    }

    const routePattern = routePatterns[sourceIndex - 1][targetIndex - 1]

    wayPoints1[0][0] = geo[0][0]
    wayPoints1[0][1] = geo[0][1]

    switch (dir[0]) {
      case DirectionMask.west:
        wayPoints1[0][0] -= scaledSourceBuffer
        wayPoints1[0][1] += constraint[0][1] * geo[0][3]
        break
      case DirectionMask.south:
        wayPoints1[0][0] += constraint[0][0] * geo[0][2]
        wayPoints1[0][1] += geo[0][3] + scaledSourceBuffer
        break
      case DirectionMask.east:
        wayPoints1[0][0] += geo[0][2] + scaledSourceBuffer
        wayPoints1[0][1] += constraint[0][1] * geo[0][3]
        break
      case DirectionMask.north:
        wayPoints1[0][0] += constraint[0][0] * geo[0][2]
        wayPoints1[0][1] -= scaledSourceBuffer
        break
    }

    let currentIndex = 0

    // Orientation, 0 horizontal, 1 vertical
    let lastOrientation = (
      dir[0] & (DirectionMask.east | DirectionMask.west)
    ) > 0 ? 0
      : 1
    const initialOrientation = lastOrientation
    let currentOrientation = 0

    for (let i = 0; i < routePattern.length; i += 1) {
      const nextDirection = routePattern[i] & 0xF

      // Rotate the index of this direction by the quad
      // to get the real direction
      let directionIndex = nextDirection === DirectionMask.east
        ? 3
        : nextDirection

      directionIndex += quad

      if (directionIndex > 4) {
        directionIndex -= 4
      }

      const direction = dirVectors[directionIndex - 1]

      currentOrientation = (directionIndex % 2 > 0) ? 0 : 1
      // Only update the current index if the point moved
      // in the direction of the current segment move,
      // otherwise the same point is moved until there is
      // a segment direction change
      if (currentOrientation !== lastOrientation) {
        currentIndex += 1
        // Copy the previous way point into the new one
        // We can't base the new position on index - 1
        // because sometime elbows turn out not to exist,
        // then we'd have to rewind.
        wayPoints1[currentIndex][0] = wayPoints1[currentIndex - 1][0]
        wayPoints1[currentIndex][1] = wayPoints1[currentIndex - 1][1]
      }

      const tar = (routePattern[i] & TARGET_MASK) > 0
      const sou = (routePattern[i] & SOURCE_MASK) > 0
      let side = (routePattern[i] & SIDE_MASK) >> 5
      side = side << quad

      if (side > 0xF) {
        side = side >> 4
      }

      const center = (routePattern[i] & CENTER_MASK) > 0

      if ((sou || tar) && side < 9) {
        let limit = 0
        const souTar = sou ? 0 : 1

        if (center && currentOrientation === 0) {
          limit = geo[souTar][0] + constraint[souTar][0] * geo[souTar][2]
        } else if (center) {
          limit = geo[souTar][1] + constraint[souTar][1] * geo[souTar][3]
        } else {
          limit = limits[souTar][side]
        }

        if (currentOrientation === 0) {
          const lastX = wayPoints1[currentIndex][0]
          const deltaX = (limit - lastX) * direction[0]

          if (deltaX > 0) {
            wayPoints1[currentIndex][0] += direction[0] * deltaX
          }
        } else {
          const lastY = wayPoints1[currentIndex][1]
          const deltaY = (limit - lastY) * direction[1]

          if (deltaY > 0) {
            wayPoints1[currentIndex][1] += direction[1]
              * deltaY
          }
        }

      } else if (center) {

        // Which center we're travelling to depend on the current direction
        wayPoints1[currentIndex][0] += direction[0]
          * Math.abs(vertexSeperations[directionIndex] / 2)
        wayPoints1[currentIndex][1] += direction[1]
          * Math.abs(vertexSeperations[directionIndex] / 2)
      }

      if (
        currentIndex > 0 && (
          wayPoints1[currentIndex][currentOrientation] ===
          wayPoints1[currentIndex - 1][currentOrientation]
        )
      ) {
        currentIndex -= 1
      } else {
        lastOrientation = currentOrientation
      }
    }

    for (let i = 0; i <= currentIndex; i += 1) {
      if (i === currentIndex) {
        // Last point can cause last segment to be in
        // same direction as jetty/approach. If so,
        // check the number of points is consistent
        // with the relative orientation of source and target
        // jx. Same orientation requires an even
        // number of turns (points), different requires
        // odd.
        const targetOrientation = (
          dir[1] & (DirectionMask.east | DirectionMask.west)
        ) > 0 ? 0 : 1

        const sameOrient = targetOrientation === initialOrientation ? 0 : 1

        // (currentIndex + 1) % 2 is 0 for even number of points,
        // 1 for odd
        if (sameOrient !== (currentIndex + 1) % 2) {
          // The last point isn't required
          break
        }
      }

      result.push(new Point(Math.round(wayPoints1[i][0]), Math.round(wayPoints1[i][1])))
    }

    // Removes duplicates
    let index = 1

    while (index < result.length) {
      if (
        result[index - 1] == null ||
        result[index] == null ||
        result[index - 1].x !== result[index].x ||
        result[index - 1].y !== result[index].y
      ) {
        index += 1
      } else {
        result.splice(index, 1)
      }
    }
  }

  export function getRoutePattern(
    dir: DirectionMask[],
    quad: number,
    dx: number,
    dy: number,
  ) {
    let sourceIndex = dir[0] === DirectionMask.east ? 3 : dir[0]
    let targetIndex = dir[1] === DirectionMask.east ? 3 : dir[1]

    sourceIndex -= quad
    targetIndex -= quad

    if (sourceIndex < 1) {
      sourceIndex += 4
    }
    if (targetIndex < 1) {
      targetIndex += 4
    }

    let result = routePatterns[sourceIndex - 1][targetIndex - 1]

    if (dx === 0 || dy === 0) {
      if (inlineRoutePatterns[sourceIndex - 1][targetIndex - 1] != null) {
        result = inlineRoutePatterns[sourceIndex - 1][targetIndex - 1]!
      }
    }

    return result
  }
}
