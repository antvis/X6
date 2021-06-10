/* eslint-disable no-underscore-dangle */

import { Point, Line, Path } from '../../geometry'
import { Edge } from '../../model'
import { EdgeView } from '../../view'
import { Connector } from './index'

// takes care of math. error for case when jump is too close to end of line
const CLOSE_PROXIMITY_PADDING = 1
const F13 = 1 / 3
const F23 = 2 / 3

function setupUpdating(view: EdgeView) {
  let updateList = (view.graph as any)._jumpOverUpdateList

  // first time setup for this paper
  if (updateList == null) {
    updateList = (view.graph as any)._jumpOverUpdateList = []

    /**
     * Handler for a batch:stop event to force
     * update of all registered links with jump over connector
     */
    view.graph.on('cell:mouseup', () => {
      const list = (view.graph as any)._jumpOverUpdateList
      for (let i = 0; i < list.length; i += 1) {
        list[i].update()
      }
    })

    view.graph.on('model:reseted', () => {
      updateList = (view.graph as any)._jumpOverUpdateList = []
    })
  }

  // add this link to a list so it can be updated when some other link is updated
  if (updateList.indexOf(view) < 0) {
    updateList.push(view)

    // watch for change of connector type or removal of link itself
    // to remove the link from a list of jump over connectors
    const clean = () => updateList.splice(updateList.indexOf(view), 1)
    view.cell.once('change:connector', clean)
    view.cell.once('removed', clean)
  }
}

function createLines(
  sourcePoint: Point.PointLike,
  targetPoint: Point.PointLike,
  route: Point.PointLike[] = [],
) {
  const points = [sourcePoint, ...route, targetPoint]
  const lines: Line[] = []

  points.forEach((point, idx) => {
    const next = points[idx + 1]
    if (next != null) {
      lines.push(new Line(point, next))
    }
  })

  return lines
}

function findLineIntersections(line: Line, crossCheckLines: Line[]) {
  const intersections: Point[] = []
  crossCheckLines.forEach((crossCheckLine) => {
    const intersection = line.intersectsWithLine(crossCheckLine)
    if (intersection) {
      intersections.push(intersection)
    }
  })
  return intersections
}

function getDistence(p1: Point, p2: Point) {
  return new Line(p1, p2).squaredLength()
}

/**
 * Split input line into multiple based on intersection points.
 */
function createJumps(line: Line, intersections: Point[], jumpSize: number) {
  return intersections.reduce<Line[]>((memo, point, idx) => {
    // skipping points that were merged with the previous line
    // to make bigger arc over multiple lines that are close to each other
    if (skippedPoints.includes(point)) {
      return memo
    }

    // always grab the last line from buffer and modify it
    const lastLine = memo.pop() || line

    // calculate start and end of jump by moving by a given size of jump
    const jumpStart = Point.create(point).move(lastLine.start, -jumpSize)
    let jumpEnd = Point.create(point).move(lastLine.start, +jumpSize)

    // now try to look at the next intersection point
    const nextPoint = intersections[idx + 1]
    if (nextPoint != null) {
      const distance = jumpEnd.distance(nextPoint)
      if (distance <= jumpSize) {
        // next point is close enough, move the jump end by this
        // difference and mark the next point to be skipped
        jumpEnd = nextPoint.move(lastLine.start, distance)
        skippedPoints.push(nextPoint)
      }
    } else {
      // this block is inside of `else` as an optimization so the distance is
      // not calculated when we know there are no other intersection points
      const endDistance = jumpStart.distance(lastLine.end)
      // if the end is too close to possible jump, draw remaining line instead of a jump
      if (endDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
        memo.push(lastLine)
        return memo
      }
    }

    const startDistance = jumpEnd.distance(lastLine.start)
    if (startDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
      // if the start of line is too close to jump, draw that line instead of a jump
      memo.push(lastLine)
      return memo
    }

    // finally create a jump line
    const jumpLine = new Line(jumpStart, jumpEnd)
    // it's just simple line but with a `isJump` property
    jumppedLines.push(jumpLine)

    memo.push(
      new Line(lastLine.start, jumpStart),
      jumpLine,
      new Line(jumpEnd, lastLine.end),
    )

    return memo
  }, [])
}

function buildPath(
  lines: Line[],
  jumpSize: number,
  jumpType: JumpType,
  radius: number,
) {
  const path = new Path()
  let segment

  // first move to the start of a first line
  segment = Path.createSegment('M', lines[0].start)
  path.appendSegment(segment)

  lines.forEach((line, index) => {
    if (jumppedLines.includes(line)) {
      let angle
      let diff

      let control1
      let control2

      if (jumpType === 'arc') {
        // approximates semicircle with 2 curves
        angle = -90
        // determine rotation of arc based on difference between points
        diff = line.start.diff(line.end)
        // make sure the arc always points up (or right)
        const xAxisRotate = diff.x < 0 || (diff.x === 0 && diff.y < 0)
        if (xAxisRotate) {
          angle += 180
        }

        const center = line.getCenter()
        const centerLine = new Line(center, line.end).rotate(angle, center)

        let halfLine

        // first half
        halfLine = new Line(line.start, center)
        control1 = halfLine.pointAt(2 / 3).rotate(angle, line.start)
        control2 = centerLine.pointAt(1 / 3).rotate(-angle, centerLine.end)

        segment = Path.createSegment('C', control1, control2, centerLine.end)
        path.appendSegment(segment)

        // second half
        halfLine = new Line(center, line.end)

        control1 = centerLine.pointAt(1 / 3).rotate(angle, centerLine.end)
        control2 = halfLine.pointAt(1 / 3).rotate(-angle, line.end)

        segment = Path.createSegment('C', control1, control2, line.end)
        path.appendSegment(segment)
      } else if (jumpType === 'gap') {
        segment = Path.createSegment('M', line.end)
        path.appendSegment(segment)
      } else if (jumpType === 'cubic') {
        // approximates semicircle with 1 curve
        angle = line.start.theta(line.end)

        const xOffset = jumpSize * 0.6
        let yOffset = jumpSize * 1.35

        // determine rotation of arc based on difference between points
        diff = line.start.diff(line.end)
        // make sure the arc always points up (or right)
        const xAxisRotate = diff.x < 0 || (diff.x === 0 && diff.y < 0)
        if (xAxisRotate) {
          yOffset *= -1
        }

        control1 = new Point(
          line.start.x + xOffset,
          line.start.y + yOffset,
        ).rotate(angle, line.start)
        control2 = new Point(line.end.x - xOffset, line.end.y + yOffset).rotate(
          angle,
          line.end,
        )

        segment = Path.createSegment('C', control1, control2, line.end)
        path.appendSegment(segment)
      }
    } else {
      const nextLine = lines[index + 1]
      if (radius === 0 || !nextLine || jumppedLines.includes(nextLine)) {
        segment = Path.createSegment('L', line.end)
        path.appendSegment(segment)
      } else {
        buildRoundedSegment(radius, path, line.end, line.start, nextLine.end)
      }
    }
  })

  return path
}

function buildRoundedSegment(
  offset: number,
  path: Path,
  curr: Point,
  prev: Point,
  next: Point,
) {
  const prevDistance = curr.distance(prev) / 2
  const nextDistance = curr.distance(next) / 2

  const startMove = -Math.min(offset, prevDistance)
  const endMove = -Math.min(offset, nextDistance)

  const roundedStart = curr.clone().move(prev, startMove).round()
  const roundedEnd = curr.clone().move(next, endMove).round()

  const control1 = new Point(
    F13 * roundedStart.x + F23 * curr.x,
    F23 * curr.y + F13 * roundedStart.y,
  )
  const control2 = new Point(
    F13 * roundedEnd.x + F23 * curr.x,
    F23 * curr.y + F13 * roundedEnd.y,
  )

  let segment
  segment = Path.createSegment('L', roundedStart)
  path.appendSegment(segment)

  segment = Path.createSegment('C', control1, control2, roundedEnd)
  path.appendSegment(segment)
}

export type JumpType = 'arc' | 'gap' | 'cubic'

export interface JumpoverConnectorOptions extends Connector.BaseOptions {
  size?: number
  radius?: number
  type?: JumpType
  ignoreConnectors?: string[]
}

let jumppedLines: Line[]
let skippedPoints: Point[]

export const jumpover: Connector.Definition<JumpoverConnectorOptions> =
  function (sourcePoint, targetPoint, routePoints, options = {}) {
    jumppedLines = []
    skippedPoints = []

    setupUpdating(this)

    const jumpSize = options.size || 5
    const jumpType = options.type || 'arc'
    const radius = options.radius || 0
    // list of connector types not to jump over.
    const ignoreConnectors = options.ignoreConnectors || ['smooth']

    const graph = this.graph
    const model = graph.model
    const allLinks = model.getEdges() as Edge[]

    // there is just one link, draw it directly
    if (allLinks.length === 1) {
      return buildPath(
        createLines(sourcePoint, targetPoint, routePoints),
        jumpSize,
        jumpType,
        radius,
      )
    }

    const edge = this.cell
    const thisIndex = allLinks.indexOf(edge)
    const defaultConnector = graph.options.connecting.connector || {}

    // not all links are meant to be jumped over.
    const edges = allLinks.filter((link, idx) => {
      const connector = link.getConnector() || (defaultConnector as any)

      // avoid jumping over links with connector type listed in `ignored connectors`.
      if (ignoreConnectors.includes(connector.name)) {
        return false
      }
      // filter out links that are above this one and  have the same connector type
      // otherwise there would double hoops for each intersection
      if (idx > thisIndex) {
        return connector.name !== 'jumpover'
      }
      return true
    })

    // find views for all links
    const linkViews = edges.map((edge) => {
      return graph.renderer.findViewByCell(edge) as EdgeView
    })

    // create lines for this link
    const thisLines = createLines(sourcePoint, targetPoint, routePoints)

    // create lines for all other links
    const linkLines = linkViews.map((linkView) => {
      if (linkView == null) {
        return []
      }
      if (linkView === this) {
        return thisLines
      }
      return createLines(
        linkView.sourcePoint,
        linkView.targetPoint,
        linkView.routePoints,
      )
    })

    // transform lines for this link by splitting with jump lines at
    // points of intersection with other links
    const jumpingLines: Line[] = []

    thisLines.forEach((line) => {
      // iterate all links and grab the intersections with this line
      // these are then sorted by distance so the line can be split more easily

      const intersections = edges
        .reduce<Point[]>((memo, link, i) => {
          // don't intersection with itself
          if (link !== edge) {
            const lineIntersections = findLineIntersections(line, linkLines[i])
            memo.push(...lineIntersections)
          }
          return memo
        }, [])
        .sort((a, b) => getDistence(line.start, a) - getDistence(line.start, b))

      if (intersections.length > 0) {
        // split the line based on found intersection points
        jumpingLines.push(...createJumps(line, intersections, jumpSize))
      } else {
        // without any intersection the line goes uninterrupted
        jumpingLines.push(line)
      }
    })

    const path = buildPath(jumpingLines, jumpSize, jumpType, radius)

    jumppedLines = []
    skippedPoints = []

    return options.raw ? path : path.serialize()
  }
