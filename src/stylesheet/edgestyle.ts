import * as util from '../util'
import { constants } from '../common'
import { Point } from '../struct'
import { CellState } from '../core'

export namespace EdgeStyle {

  export function entityRelation(
    state: CellState,
    source: CellState,
    target: CellState,
    points: Point[],
    result,
  ) {
    const view = state.view
    const graph = view.graph
    const segment = util.getValue(state.style,
                                  constants.STYLE_SEGMENT,
                                  constants.ENTITY_SEGMENT,
    ) * view.scale

    const pts = state.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    let isSourceLeft = false

    if (p0 != null) {
      source = new CellState()
      source.x = p0.x
      source.y = p0.y
    }
    else if (source != null) {
      const constraint = util.getPortConstraints(source, state, true, constants.DIRECTION_MASK_NONE)

      if (constraint != constants.DIRECTION_MASK_NONE && constraint != constants.DIRECTION_MASK_WEST +
        constants.DIRECTION_MASK_EAST) {
        isSourceLeft = constraint == constants.DIRECTION_MASK_WEST
      }
      else {
        const sourceGeometry = graph.getCellGeometry(source.cell)

        if (sourceGeometry.relative) {
          isSourceLeft = sourceGeometry.x <= 0.5
        }
        else if (target != null) {
          isSourceLeft = target.x + target.width < source.x
        }
      }
    }
    else {
      return
    }

    let isTargetLeft = true

    if (pe != null) {
      target = new mxCellState()
      target.x = pe.x
      target.y = pe.y
    }
    else if (target != null) {
      const constraint = util.getPortConstraints(target, state, false, constants.DIRECTION_MASK_NONE)

      if (constraint != constants.DIRECTION_MASK_NONE && constraint != constants.DIRECTION_MASK_WEST +
        constants.DIRECTION_MASK_EAST) {
        isTargetLeft = constraint == constants.DIRECTION_MASK_WEST
      }
      else {
        const targetGeometry = graph.getCellGeometry(target.cell)

        if (targetGeometry.relative) {
          isTargetLeft = targetGeometry.x <= 0.5
        }
        else if (source != null) {
          isTargetLeft = source.x + source.width < target.x
        }
      }
    }

    if (source != null && target != null) {
      const x0 = (isSourceLeft) ? source.x : source.x + source.width
      const y0 = view.getRoutingCenterY(source)

      const xe = (isTargetLeft) ? target.x : target.x + target.width
      const ye = view.getRoutingCenterY(target)

      const seg = segment

      let dx = (isSourceLeft) ? -seg : seg
      const dep = new Point(x0 + dx, y0)

      dx = (isTargetLeft) ? -seg : seg
      const arr = new Point(xe + dx, ye)

      // Adds intermediate points if both go out on same side
      if (isSourceLeft == isTargetLeft) {
        const x = (isSourceLeft) ?
          Math.min(x0, xe) - segment :
          Math.max(x0, xe) + segment

        result.push(new Point(x, y0))
        result.push(new Point(x, ye))
      } else if ((dep.x < arr.x) == isSourceLeft) {
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

  /**
  * Implements a self-reference, aka. loop.
  */
  export function loop(state, source, target, points, result) {
    const pts = state.absolutePoints

    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    if (p0 != null && pe != null) {
      if (points != null && points.length > 0) {
        for (let i = 0; i < points.length; i++) {
          let pt = points[i]
          pt = state.view.transformControlPoint(state, pt)
          result.push(new Point(pt.x, pt.y))
        }
      }

      return
    }

    if (source != null) {
      const view = state.view
      const graph = view.graph
      let pt = (points != null && points.length > 0) ? points[0] : null

      if (pt != null) {
        pt = view.transformControlPoint(state, pt)

        if (util.contains(source, pt.x, pt.y)) {
          pt = null
        }
      }

      let x = 0
      let dx = 0
      let y = 0
      let dy = 0

      const seg = util.getValue(state.style, constants.STYLE_SEGMENT,
                                graph.gridSize) * view.scale
      const dir = util.getValue(state.style, constants.STYLE_DIRECTION,
                                constants.DIRECTION_WEST)

      if (dir == constants.DIRECTION_NORTH ||
        dir == constants.DIRECTION_SOUTH) {
        x = view.getRoutingCenterX(source)
        dx = seg
      }
      else {
        y = view.getRoutingCenterY(source)
        dy = seg
      }

      if (pt == null ||
        pt.x < source.x ||
        pt.x > source.x + source.width) {
        if (pt != null) {
          x = pt.x
          dy = Math.max(Math.abs(y - pt.y), dy)
        }
        else {
          if (dir == constants.DIRECTION_NORTH) {
            y = source.y - 2 * dx
          }
          else if (dir == constants.DIRECTION_SOUTH) {
            y = source.y + source.height + 2 * dx
          }
          else if (dir == constants.DIRECTION_EAST) {
            x = source.x - 2 * dy
          }
          else {
            x = source.x + source.width + 2 * dy
          }
        }
      }
      else if (pt != null) {
        x = view.getRoutingCenterX(source)
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
  export function elbowConnector(state, source, target, points, result) {
    let pt = (points != null && points.length > 0) ? points[0] : null

    let vertical = false
    let horizontal = false

    if (source != null && target != null) {
      if (pt != null) {
        const left = Math.min(source.x, target.x)
        const right = Math.max(source.x + source.width,
                               target.x + target.width)

        const top = Math.min(source.y, target.y)
        const bottom = Math.max(source.y + source.height,
                                target.y + target.height)

        pt = state.view.transformControlPoint(state, pt)

        vertical = pt.y < top || pt.y > bottom
        horizontal = pt.x < left || pt.x > right
      }
      else {
        const left = Math.max(source.x, target.x)
        const right = Math.min(source.x + source.width,
                               target.x + target.width)

        vertical = left == right

        if (!vertical) {
          const top = Math.max(source.y, target.y)
          const bottom = Math.min(source.y + source.height,
                                  target.y + target.height)

          horizontal = top == bottom
        }
      }
    }

    if (!horizontal && (vertical ||
      state.style[constants.STYLE_ELBOW] == constants.ELBOW_VERTICAL)) {
      mxEdgeStyle.TopToBottom(state, source, target, points, result)
    }
    else {
      mxEdgeStyle.SideToSide(state, source, target, points, result)
    }
  }

  /**
   * Implements a vertical elbow edge. See <EntityRelation> for a description
   * of the parameters.
   */
  export function sideToSide(state, source, target, points, result) {
    const view = state.view
    let pt = (points != null && points.length > 0) ? points[0] : null
    const pts = state.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    if (pt != null) {
      pt = view.transformControlPoint(state, pt)
    }

    if (p0 != null) {
      source = new mxCellState()
      source.x = p0.x
      source.y = p0.y
    }

    if (pe != null) {
      target = new mxCellState()
      target.x = pe.x
      target.y = pe.y
    }

    if (source != null && target != null) {
      const l = Math.max(source.x, target.x)
      const r = Math.min(source.x + source.width,
                         target.x + target.width)

      const x = (pt != null) ? pt.x : Math.round(r + (l - r) / 2)

      let y1 = view.getRoutingCenterY(source)
      let y2 = view.getRoutingCenterY(target)

      if (pt != null) {
        if (pt.y >= source.y && pt.y <= source.y + source.height) {
          y1 = pt.y
        }

        if (pt.y >= target.y && pt.y <= target.y + target.height) {
          y2 = pt.y
        }
      }

      if (!util.contains(target, x, y1) &&
        !util.contains(source, x, y1)) {
        result.push(new Point(x, y1))
      }

      if (!util.contains(target, x, y2) &&
        !util.contains(source, x, y2)) {
        result.push(new Point(x, y2))
      }

      if (result.length == 1) {
        if (pt != null) {
          if (!util.contains(target, x, pt.y) &&
            !util.contains(source, x, pt.y)) {
            result.push(new Point(x, pt.y))
          }
        }
        else {
          const t = Math.max(source.y, target.y)
          const b = Math.min(source.y + source.height,
                             target.y + target.height)

          result.push(new Point(x, t + (b - t) / 2))
        }
      }
    }
  }

  /**
   * Implements a horizontal elbow edge. See <EntityRelation> for a
   * description of the parameters.
   */
  export function topToBottom(state, source, target, points, result) {
    const view = state.view
    let pt = (points != null && points.length > 0) ? points[0] : null
    const pts = state.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    if (pt != null) {
      pt = view.transformControlPoint(state, pt)
    }

    if (p0 != null) {
      source = new mxCellState()
      source.x = p0.x
      source.y = p0.y
    }

    if (pe != null) {
      target = new mxCellState()
      target.x = pe.x
      target.y = pe.y
    }

    if (source != null && target != null) {
      const t = Math.max(source.y, target.y)
      const b = Math.min(source.y + source.height,
                         target.y + target.height)

      let x = view.getRoutingCenterX(source)

      if (pt != null &&
        pt.x >= source.x &&
        pt.x <= source.x + source.width) {
        x = pt.x
      }

      const y = (pt != null) ? pt.y : Math.round(b + (t - b) / 2)

      if (!util.contains(target, x, y) &&
        !util.contains(source, x, y)) {
        result.push(new Point(x, y))
      }

      if (pt != null &&
        pt.x >= target.x &&
        pt.x <= target.x + target.width) {
        x = pt.x
      }
      else {
        x = view.getRoutingCenterX(target)
      }

      if (!util.contains(target, x, y) &&
        !util.contains(source, x, y)) {
        result.push(new Point(x, y))
      }

      if (result.length == 1) {
        if (pt != null && result.length == 1) {
          if (!util.contains(target, pt.x, y) &&
            !util.contains(source, pt.x, y)) {
            result.push(new Point(pt.x, y))
          }
        }
        else {
          const l = Math.max(source.x, target.x)
          const r = Math.min(source.x + source.width,
                             target.x + target.width)

          result.push(new Point(l + (r - l) / 2, y))
        }
      }
    }
  }

  /**
   * Implements an orthogonal edge style. Use <mxEdgeSegmentHandler>
   * as an interactive handler for this style.
   */
  export function segmentConnector(state, source, target, hints, result) {
    // Creates array of all way- and terminalpoints
    const pts = state.absolutePoints
    const tol = Math.max(1, state.view.scale)

    // Whether the first segment outgoing from the source end is horizontal
    let lastPushed = (result.length > 0) ? result[0] : null
    let horizontal = true
    let hint = null

    // Adds waypoints only if outside of tolerance
    function pushPoint(pt) {
      if (lastPushed == null || Math.abs(lastPushed.x - pt.x) >= tol || Math.abs(lastPushed.y - pt.y) >= tol) {
        result.push(pt)
        lastPushed = pt
      }

      return lastPushed
    }

    // Adds the first point
    let pt = pts[0]

    if (pt == null && source != null) {
      pt = new Point(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source))
    }
    else if (pt != null) {
      pt = pt.clone()
    }

    pt.x = Math.round(pt.x)
    pt.y = Math.round(pt.y)

    const lastInx = pts.length - 1

    // Adds the waypoints
    if (hints != null && hints.length > 0) {
      // Converts all hints and removes nulls
      const newHints = []

      for (let i = 0; i < hints.length; i++) {
        const tmp = state.view.transformControlPoint(state, hints[i])

        if (tmp != null) {
          tmp.x = Math.round(tmp.x)
          tmp.y = Math.round(tmp.y)
          newHints.push(tmp)
        }
      }

      if (newHints.length == 0) {
        return
      }

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

      const pe = pts[lastInx]

      if (pe != null && hints[hints.length - 1] != null) {
        if (Math.abs(hints[hints.length - 1].x - pe.x) < tol) {
          hints[hints.length - 1].x = pe.x
        }

        if (Math.abs(hints[hints.length - 1].y - pe.y) < tol) {
          hints[hints.length - 1].y = pe.y
        }
      }

      hint = hints[0]

      let currentTerm = source
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
      for (let i = 0; i < 2; i++) {
        const fixedVertAlign = currentPt != null && currentPt.x == currentHint.x
        const fixedHozAlign = currentPt != null && currentPt.y == currentHint.y

        const inHozChan = currentTerm != null && (currentHint.y >= currentTerm.y &&
          currentHint.y <= currentTerm.y + currentTerm.height)
        const inVertChan = currentTerm != null && (currentHint.x >= currentTerm.x &&
          currentHint.x <= currentTerm.x + currentTerm.width)

        hozChan = fixedHozAlign || (currentPt == null && inHozChan)
        vertChan = fixedVertAlign || (currentPt == null && inVertChan)

        // If the current hint falls in both the hor and vert channels in the case
        // of a floating port, or if the hint is exactly co-incident with a
        // fixed point, ignore the source and try to work out the orientation
        // from the target end
        if (i == 0 && ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign))) {
        }
        else {
          if (currentPt != null && (!fixedHozAlign && !fixedVertAlign) && (inHozChan || inVertChan)) {
            horizontal = inHozChan ? false : true
            break
          }

          if (vertChan || hozChan) {
            horizontal = hozChan

            if (i == 1) {
              // Work back from target end
              horizontal = hints.length % 2 == 0 ? hozChan : vertChan
            }

            break
          }
        }

        currentTerm = target
        currentPt = pts[lastInx]

        if (currentPt != null) {
          currentPt.x = Math.round(currentPt.x)
          currentPt.y = Math.round(currentPt.y)
          currentTerm = null
        }

        currentHint = hints[hints.length - 1]

        if (fixedVertAlign && fixedHozAlign) {
          hints = hints.slice(1)
        }
      }

      if (horizontal && ((pts[0] != null && pts[0].y != hint.y) ||
        (pts[0] == null && source != null &&
          (hint.y < source.y || hint.y > source.y + source.height)))) {
        pushPoint(new Point(pt.x, hint.y))
      }
      else if (!horizontal && ((pts[0] != null && pts[0].x != hint.x) ||
        (pts[0] == null && source != null &&
          (hint.x < source.x || hint.x > source.x + source.width)))) {
        pushPoint(new Point(hint.x, pt.y))
      }

      if (horizontal) {
        pt.y = hint.y
      }
      else {
        pt.x = hint.x
      }

      for (let i = 0; i < hints.length; i++) {
        horizontal = !horizontal
        hint = hints[i]

        // 				mxLog.show();
        // 				mxLog.debug('hint', i, hint.x, hint.y);

        if (horizontal) {
          pt.y = hint.y
        }
        else {
          pt.x = hint.x
        }

        pushPoint(pt.clone())
      }
    }
    else {
      hint = pt
      // FIXME: First click in connect preview toggles orientation
      horizontal = true
    }

    // Adds the last point
    pt = pts[lastInx]

    if (pt == null && target != null) {
      pt = new Point(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target))
    }

    if (pt != null) {
      pt.x = Math.round(pt.x)
      pt.y = Math.round(pt.y)

      if (hint != null) {
        if (horizontal && ((pts[lastInx] != null && pts[lastInx].y != hint.y) ||
          (pts[lastInx] == null && target != null &&
            (hint.y < target.y || hint.y > target.y + target.height)))) {
          pushPoint(new Point(pt.x, hint.y))
        }
        else if (!horizontal && ((pts[lastInx] != null && pts[lastInx].x != hint.x) ||
          (pts[lastInx] == null && target != null &&
            (hint.x < target.x || hint.x > target.x + target.width)))) {
          pushPoint(new Point(hint.x, pt.y))
        }
      }
    }

    // Removes bends inside the source terminal for floating ports
    if (pts[0] == null && source != null) {
      while (result.length > 1 && result[1] != null &&
        util.contains(source, result[1].x, result[1].y)) {
        result.splice(1, 1)
      }
    }

    // Removes bends inside the target terminal
    if (pts[lastInx] == null && target != null) {
      while (result.length > 1 && result[result.length - 1] != null &&
        util.contains(target, result[result.length - 1].x, result[result.length - 1].y)) {
        result.splice(result.length - 1, 1)
      }
    }

    // Removes last point if inside tolerance with end point
    if (pe != null && result[result.length - 1] != null &&
      Math.abs(pe.x - result[result.length - 1].x) < tol &&
      Math.abs(pe.y - result[result.length - 1].y) < tol) {
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

  export const vertexSeperations = []

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

  export function getJettySize(state, source, target, points, isSource) {
    let value = util.getValue(state.style, (isSource) ? constants.STYLE_SOURCE_JETTY_SIZE :
      constants.STYLE_TARGET_JETTY_SIZE, util.getValue(state.style,
                                                       constants.STYLE_JETTY_SIZE, mxEdgeStyle.orthBuffer))

    if (value == 'auto') {
      // Computes the automatic jetty size
      const type = util.getValue(state.style, (isSource) ? constants.STYLE_STARTARROW : constants.STYLE_ENDARROW, constants.NONE)

      if (type != constants.NONE) {
        const size = util.getNumber(state.style, (isSource) ? constants.STYLE_STARTSIZE : constants.STYLE_ENDSIZE, constants.DEFAULT_MARKERSIZE)
        value = Math.max(2, Math.ceil((size + mxEdgeStyle.orthBuffer) / mxEdgeStyle.orthBuffer)) * mxEdgeStyle.orthBuffer
      }
      else {
        value = 2 * mxEdgeStyle.orthBuffer
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
  export function orthConnector(state, source, target, points, result) {
    const graph = state.view.graph
    const sourceEdge = source == null ? false : graph.getModel().isEdge(source.cell)
    const targetEdge = target == null ? false : graph.getModel().isEdge(target.cell)

    const pts = state.absolutePoints
    const p0 = pts[0]
    const pe = pts[pts.length - 1]

    let sourceX = source != null ? source.x : p0.x
    let sourceY = source != null ? source.y : p0.y
    let sourceWidth = source != null ? source.width : 0
    let sourceHeight = source != null ? source.height : 0

    let targetX = target != null ? target.x : pe.x
    let targetY = target != null ? target.y : pe.y
    let targetWidth = target != null ? target.width : 0
    let targetHeight = target != null ? target.height : 0

    let scaledSourceBuffer = state.view.scale * mxEdgeStyle.getJettySize(state, source, target, points, true)
    let scaledTargetBuffer = state.view.scale * mxEdgeStyle.getJettySize(state, source, target, points, false)

    // Workaround for loop routing within buffer zone
    if (source != null && target == source) {
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

    if (tooShort || (mxEdgeStyle.orthPointsFallback && (points != null &&
      points.length > 0)) || sourceEdge || targetEdge) {
      mxEdgeStyle.SegmentConnector(state, source, target, points, result)

      return
    }

    // Determine the side(s) of the source and target vertices
    // that the edge may connect to
    // portConstraint [source, target]
    const portConstraint = [constants.DIRECTION_MASK_ALL, constants.DIRECTION_MASK_ALL]
    let rotation = 0

    if (source != null) {
      portConstraint[0] = util.getPortConstraints(source, state, true,
                                                  constants.DIRECTION_MASK_ALL)
      rotation = util.getValue(source.style, constants.STYLE_ROTATION, 0)

      if (rotation != 0) {
        const newRect = util.getBoundingBox(new mxRectangle(sourceX, sourceY, sourceWidth, sourceHeight), rotation)
        sourceX = newRect.x
        sourceY = newRect.y
        sourceWidth = newRect.width
        sourceHeight = newRect.height
      }
    }

    if (target != null) {
      portConstraint[1] = util.getPortConstraints(target, state, false,
                                                  constants.DIRECTION_MASK_ALL)
      rotation = util.getValue(target.style, constants.STYLE_ROTATION, 0)

      if (rotation != 0) {
        const newRect = util.getBoundingBox(new mxRectangle(targetX, targetY, targetWidth, targetHeight), rotation)
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
    const geo = [[sourceX, sourceY, sourceWidth, sourceHeight],
    [targetX, targetY, targetWidth, targetHeight]]
    const buffer = [scaledSourceBuffer, scaledTargetBuffer]

    for (let i = 0; i < 2; i++) {
      mxEdgeStyle.limits[i][1] = geo[i][0] - buffer[i]
      mxEdgeStyle.limits[i][2] = geo[i][1] - buffer[i]
      mxEdgeStyle.limits[i][4] = geo[i][0] + geo[i][2] + buffer[i]
      mxEdgeStyle.limits[i][8] = geo[i][1] + geo[i][3] + buffer[i]
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
      }
      else {
        quad = 1
      }
    }
    else {
      if (dy <= 0) {
        quad = 3

        // Special case on x = 0 and negative y
        if (dx == 0) {
          quad = 2
        }
      }
    }

    // Check for connection constraints
    let currentTerm = null

    if (source != null) {
      currentTerm = p0
    }

    const constraint = [[0.5, 0.5], [0.5, 0.5]]

    for (let i = 0; i < 2; i++) {
      if (currentTerm != null) {
        constraint[i][0] = (currentTerm.x - geo[i][0]) / geo[i][2]

        if (Math.abs(currentTerm.x - geo[i][0]) <= 1) {
          dir[i] = constants.DIRECTION_MASK_WEST
        }
        else if (Math.abs(currentTerm.x - geo[i][0] - geo[i][2]) <= 1) {
          dir[i] = constants.DIRECTION_MASK_EAST
        }

        constraint[i][1] = (currentTerm.y - geo[i][1]) / geo[i][3]

        if (Math.abs(currentTerm.y - geo[i][1]) <= 1) {
          dir[i] = constants.DIRECTION_MASK_NORTH
        }
        else if (Math.abs(currentTerm.y - geo[i][1] - geo[i][3]) <= 1) {
          dir[i] = constants.DIRECTION_MASK_SOUTH
        }
      }

      currentTerm = null

      if (target != null) {
        currentTerm = pe
      }
    }

    const sourceTopDist = geo[0][1] - (geo[1][1] + geo[1][3])
    const sourceLeftDist = geo[0][0] - (geo[1][0] + geo[1][2])
    const sourceBottomDist = geo[1][1] - (geo[0][1] + geo[0][3])
    const sourceRightDist = geo[1][0] - (geo[0][0] + geo[0][2])

    mxEdgeStyle.vertexSeperations[1] = Math.max(sourceLeftDist - totalBuffer, 0)
    mxEdgeStyle.vertexSeperations[2] = Math.max(sourceTopDist - totalBuffer, 0)
    mxEdgeStyle.vertexSeperations[4] = Math.max(sourceBottomDist - totalBuffer, 0)
    mxEdgeStyle.vertexSeperations[3] = Math.max(sourceRightDist - totalBuffer, 0)

    // ==============================================================
    // Start of source and target direction determination

    // Work through the preferred orientations by relative positioning
    // of the vertices and list them in preferred and available order

    const dirPref = []
    const horPref = []
    const vertPref = []

    horPref[0] = (sourceLeftDist >= sourceRightDist) ? constants.DIRECTION_MASK_WEST
      : constants.DIRECTION_MASK_EAST
    vertPref[0] = (sourceTopDist >= sourceBottomDist) ? constants.DIRECTION_MASK_NORTH
      : constants.DIRECTION_MASK_SOUTH

    horPref[1] = util.reversePortConstraints(horPref[0])
    vertPref[1] = util.reversePortConstraints(vertPref[0])

    const preferredHorizDist = sourceLeftDist >= sourceRightDist ? sourceLeftDist
      : sourceRightDist
    const preferredVertDist = sourceTopDist >= sourceBottomDist ? sourceTopDist
      : sourceBottomDist

    const prefOrdering = [[0, 0], [0, 0]]
    let preferredOrderSet = false

    // If the preferred port isn't available, switch it
    for (let i = 0; i < 2; i++) {
      if (dir[i] != 0x0) {
        continue
      }

      if ((horPref[i] & portConstraint[i]) == 0) {
        horPref[i] = util.reversePortConstraints(horPref[i])
      }

      if ((vertPref[i] & portConstraint[i]) == 0) {
        vertPref[i] = util
          .reversePortConstraints(vertPref[i])
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
      }
      else if (((vertPref[0] & portConstraint[0]) > 0)
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

    for (let i = 0; i < 2; i++) {
      if (dir[i] != 0x0) {
        continue
      }

      if ((prefOrdering[i][0] & portConstraint[i]) == 0) {
        prefOrdering[i][0] = prefOrdering[i][1]
      }

      dirPref[i] = prefOrdering[i][0] & portConstraint[i]
      dirPref[i] |= (prefOrdering[i][1] & portConstraint[i]) << 8
      dirPref[i] |= (prefOrdering[1 - i][i] & portConstraint[i]) << 16
      dirPref[i] |= (prefOrdering[1 - i][1 - i] & portConstraint[i]) << 24

      if ((dirPref[i] & 0xF) == 0) {
        dirPref[i] = dirPref[i] << 8
      }

      if ((dirPref[i] & 0xF00) == 0) {
        dirPref[i] = (dirPref[i] & 0xF) | dirPref[i] >> 8
      }

      if ((dirPref[i] & 0xF0000) == 0) {
        dirPref[i] = (dirPref[i] & 0xFFFF)
          | ((dirPref[i] & 0xF000000) >> 8)
      }

      dir[i] = dirPref[i] & 0xF

      if (portConstraint[i] == constants.DIRECTION_MASK_WEST
        || portConstraint[i] == constants.DIRECTION_MASK_NORTH
        || portConstraint[i] == constants.DIRECTION_MASK_EAST
        || portConstraint[i] == constants.DIRECTION_MASK_SOUTH) {
        dir[i] = portConstraint[i]
      }
    }

    // ==============================================================
    // End of source and target direction determination

    let sourceIndex = dir[0] == constants.DIRECTION_MASK_EAST ? 3
      : dir[0]
    let targetIndex = dir[1] == constants.DIRECTION_MASK_EAST ? 3
      : dir[1]

    sourceIndex -= quad
    targetIndex -= quad

    if (sourceIndex < 1) {
      sourceIndex += 4
    }

    if (targetIndex < 1) {
      targetIndex += 4
    }

    const routePattern = mxEdgeStyle.routePatterns[sourceIndex - 1][targetIndex - 1]

    mxEdgeStyle.wayPoints1[0][0] = geo[0][0]
    mxEdgeStyle.wayPoints1[0][1] = geo[0][1]

    switch (dir[0]) {
      case constants.DIRECTION_MASK_WEST:
        mxEdgeStyle.wayPoints1[0][0] -= scaledSourceBuffer
        mxEdgeStyle.wayPoints1[0][1] += constraint[0][1] * geo[0][3]
        break
      case constants.DIRECTION_MASK_SOUTH:
        mxEdgeStyle.wayPoints1[0][0] += constraint[0][0] * geo[0][2]
        mxEdgeStyle.wayPoints1[0][1] += geo[0][3] + scaledSourceBuffer
        break
      case constants.DIRECTION_MASK_EAST:
        mxEdgeStyle.wayPoints1[0][0] += geo[0][2] + scaledSourceBuffer
        mxEdgeStyle.wayPoints1[0][1] += constraint[0][1] * geo[0][3]
        break
      case constants.DIRECTION_MASK_NORTH:
        mxEdgeStyle.wayPoints1[0][0] += constraint[0][0] * geo[0][2]
        mxEdgeStyle.wayPoints1[0][1] -= scaledSourceBuffer
        break
    }

    let currentIndex = 0

    // Orientation, 0 horizontal, 1 vertical
    let lastOrientation = (dir[0] & (constants.DIRECTION_MASK_EAST | constants.DIRECTION_MASK_WEST)) > 0 ? 0
      : 1
    const initialOrientation = lastOrientation
    let currentOrientation = 0

    for (let i = 0; i < routePattern.length; i++) {
      const nextDirection = routePattern[i] & 0xF

      // Rotate the index of this direction by the quad
      // to get the real direction
      let directionIndex = nextDirection == constants.DIRECTION_MASK_EAST ? 3
        : nextDirection

      directionIndex += quad

      if (directionIndex > 4) {
        directionIndex -= 4
      }

      const direction = mxEdgeStyle.dirVectors[directionIndex - 1]

      currentOrientation = (directionIndex % 2 > 0) ? 0 : 1
      // Only update the current index if the point moved
      // in the direction of the current segment move,
      // otherwise the same point is moved until there is
      // a segment direction change
      if (currentOrientation != lastOrientation) {
        currentIndex++
        // Copy the previous way point into the new one
        // We can't base the new position on index - 1
        // because sometime elbows turn out not to exist,
        // then we'd have to rewind.
        mxEdgeStyle.wayPoints1[currentIndex][0] = mxEdgeStyle.wayPoints1[currentIndex - 1][0]
        mxEdgeStyle.wayPoints1[currentIndex][1] = mxEdgeStyle.wayPoints1[currentIndex - 1][1]
      }

      const tar = (routePattern[i] & mxEdgeStyle.TARGET_MASK) > 0
      const sou = (routePattern[i] & mxEdgeStyle.SOURCE_MASK) > 0
      let side = (routePattern[i] & mxEdgeStyle.SIDE_MASK) >> 5
      side = side << quad

      if (side > 0xF) {
        side = side >> 4
      }

      const center = (routePattern[i] & mxEdgeStyle.CENTER_MASK) > 0

      if ((sou || tar) && side < 9) {
        let limit = 0
        const souTar = sou ? 0 : 1

        if (center && currentOrientation == 0) {
          limit = geo[souTar][0] + constraint[souTar][0] * geo[souTar][2]
        }
        else if (center) {
          limit = geo[souTar][1] + constraint[souTar][1] * geo[souTar][3]
        }
        else {
          limit = mxEdgeStyle.limits[souTar][side]
        }

        if (currentOrientation == 0) {
          const lastX = mxEdgeStyle.wayPoints1[currentIndex][0]
          const deltaX = (limit - lastX) * direction[0]

          if (deltaX > 0) {
            mxEdgeStyle.wayPoints1[currentIndex][0] += direction[0]
              * deltaX
          }
        }
        else {
          const lastY = mxEdgeStyle.wayPoints1[currentIndex][1]
          const deltaY = (limit - lastY) * direction[1]

          if (deltaY > 0) {
            mxEdgeStyle.wayPoints1[currentIndex][1] += direction[1]
              * deltaY
          }
        }
      }

      else if (center) {
        // Which center we're travelling to depend on the current direction
        mxEdgeStyle.wayPoints1[currentIndex][0] += direction[0]
          * Math.abs(mxEdgeStyle.vertexSeperations[directionIndex] / 2)
        mxEdgeStyle.wayPoints1[currentIndex][1] += direction[1]
          * Math.abs(mxEdgeStyle.vertexSeperations[directionIndex] / 2)
      }

      if (currentIndex > 0
        && mxEdgeStyle.wayPoints1[currentIndex][currentOrientation] == mxEdgeStyle.wayPoints1[currentIndex - 1][currentOrientation]) {
        currentIndex--
      }
      else {
        lastOrientation = currentOrientation
      }
    }

    for (let i = 0; i <= currentIndex; i++) {
      if (i == currentIndex) {
        // Last point can cause last segment to be in
        // same direction as jetty/approach. If so,
        // check the number of points is consistent
        // with the relative orientation of source and target
        // jx. Same orientation requires an even
        // number of turns (points), different requires
        // odd.
        const targetOrientation = (dir[1] & (constants.DIRECTION_MASK_EAST | constants.DIRECTION_MASK_WEST)) > 0 ? 0
          : 1
        const sameOrient = targetOrientation == initialOrientation ? 0 : 1

        // (currentIndex + 1) % 2 is 0 for even number of points,
        // 1 for odd
        if (sameOrient != (currentIndex + 1) % 2) {
          // The last point isn't required
          break
        }
      }

      result.push(new Point(Math.round(mxEdgeStyle.wayPoints1[i][0]), Math.round(mxEdgeStyle.wayPoints1[i][1])))
    }

    // Removes duplicates
    let index = 1

    while (index < result.length) {
      if (result[index - 1] == null || result[index] == null ||
        result[index - 1].x != result[index].x ||
        result[index - 1].y != result[index].y) {
        index++
      }
      else {
        result.splice(index, 1)
      }
    }
  }

  export function getRoutePattern(dir, quad, dx, dy) {
    let sourceIndex = dir[0] == constants.DIRECTION_MASK_EAST ? 3
      : dir[0]
    let targetIndex = dir[1] == constants.DIRECTION_MASK_EAST ? 3
      : dir[1]

    sourceIndex -= quad
    targetIndex -= quad

    if (sourceIndex < 1) {
      sourceIndex += 4
    }
    if (targetIndex < 1) {
      targetIndex += 4
    }

    let result = routePatterns[sourceIndex - 1][targetIndex - 1]

    if (dx == 0 || dy == 0) {
      if (inlineRoutePatterns[sourceIndex - 1][targetIndex - 1] != null) {
        result = inlineRoutePatterns[sourceIndex - 1][targetIndex - 1]
      }
    }

    return result
  }
}
