import { Point, Path } from '../../geometry'
import { ConnectorOptions } from './util'

const JUMP_SIZE = 5
const RADIUS = 0

// takes care of math. error for case when jump is too close to end of line
const CLOSE_PROXIMITY_PADDING = 1

// list of connector types not to jump over.
const IGNORED_CONNECTORS = ['smooth']

const f13 = 1 / 3
const f23 = 2 / 3

/**
 * Transform start/end and route into series of lines
 * @param {g.point} sourcePoint start point
 * @param {g.point} targetPoint end point
 * @param {g.point[]} route optional list of route
 * @return {g.line[]} [description]
 */
function createLines(sourcePoint, targetPoint, route) {
  // make a flattened array of all points
  const points = [].concat(sourcePoint, route, targetPoint)
  return points.reduce(function(resultLines, point, idx) {
    // if there is a next point, make a line with it
    const nextPoint = points[idx + 1]
    if (nextPoint != null) {
      resultLines[idx] = g.line(point, nextPoint)
    }
    return resultLines
  }, [])
}

function setupUpdating(jumpOverLinkView) {
  let updateList = jumpOverLinkView.paper._jumpOverUpdateList

  // first time setup for this paper
  if (updateList == null) {
    updateList = jumpOverLinkView.paper._jumpOverUpdateList = []
    jumpOverLinkView.paper.on('cell:pointerup', updateJumpOver)
    jumpOverLinkView.paper.model.on('reset', function() {
      updateList = jumpOverLinkView.paper._jumpOverUpdateList = []
    })
  }

  // add this link to a list so it can be updated when some other link is updated
  if (updateList.indexOf(jumpOverLinkView) < 0) {
    updateList.push(jumpOverLinkView)

    // watch for change of connector type or removal of link itself
    // to remove the link from a list of jump over connectors
    jumpOverLinkView.listenToOnce(
      jumpOverLinkView.model,
      'change:connector remove',
      function() {
        updateList.splice(updateList.indexOf(jumpOverLinkView), 1)
      },
    )
  }
}

/**
 * Handler for a batch:stop event to force
 * update of all registered links with jump over connector
 * @param {object} batchEvent optional object with info about batch
 */
function updateJumpOver() {
  const updateList = this._jumpOverUpdateList
  for (let i = 0; i < updateList.length; i++) {
    updateList[i].update()
  }
}

/**
 * Utility function to collect all intersection poinst of a single
 * line against group of other lines.
 * @param {g.line} line where to find points
 * @param {g.line[]} crossCheckLines lines to cross
 * @return {g.point[]} list of intersection points
 */
function findLineIntersections(line, crossCheckLines) {
  return util.toArray(crossCheckLines).reduce(function(res, crossCheckLine) {
    const intersection = line.intersection(crossCheckLine)
    if (intersection) {
      res.push(intersection)
    }
    return res
  }, [])
}

/**
 * Sorting function for list of points by their distance.
 * @param {g.point} p1 first point
 * @param {g.point} p2 second point
 * @return {number} squared distance between points
 */
function sortPoints(p1, p2) {
  return g.line(p1, p2).squaredLength()
}

/**
 * Split input line into multiple based on intersection points.
 * @param {g.line} line input line to split
 * @param {g.point[]} intersections poinst where to split the line
 * @param {number} jumpSize the size of jump arc (length empty spot on a line)
 * @return {g.line[]} list of lines being split
 */
function createJumps(line, intersections, jumpSize) {
  return intersections.reduce(function(resultLines, point, idx) {
    // skipping points that were merged with the previous line
    // to make bigger arc over multiple lines that are close to each other
    if (point.skip === true) {
      return resultLines
    }

    // always grab the last line from buffer and modify it
    const lastLine = resultLines.pop() || line

    // calculate start and end of jump by moving by a given size of jump
    const jumpStart = g.point(point).move(lastLine.start, -jumpSize)
    let jumpEnd = g.point(point).move(lastLine.start, +jumpSize)

    // now try to look at the next intersection point
    const nextPoint = intersections[idx + 1]
    if (nextPoint != null) {
      const distance = jumpEnd.distance(nextPoint)
      if (distance <= jumpSize) {
        // next point is close enough, move the jump end by this
        // difference and mark the next point to be skipped
        jumpEnd = nextPoint.move(lastLine.start, distance)
        nextPoint.skip = true
      }
    } else {
      // this block is inside of `else` as an optimization so the distance is
      // not calculated when we know there are no other intersection points
      const endDistance = jumpStart.distance(lastLine.end)
      // if the end is too close to possible jump, draw remaining line instead of a jump
      if (endDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
        resultLines.push(lastLine)
        return resultLines
      }
    }

    const startDistance = jumpEnd.distance(lastLine.start)
    if (startDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
      // if the start of line is too close to jump, draw that line instead of a jump
      resultLines.push(lastLine)
      return resultLines
    }

    // finally create a jump line
    const jumpLine = g.line(jumpStart, jumpEnd)
    // it's just simple line but with a `isJump` property
    jumpLine.isJump = true

    resultLines.push(
      g.line(lastLine.start, jumpStart),
      jumpLine,
      g.line(jumpEnd, lastLine.end),
    )
    return resultLines
  }, [])
}

/**
 * Assemble `D` attribute of a SVG path by iterating given lines.
 * @param {g.line[]} lines source lines to use
 * @param {number} jumpSize the size of jump arc (length empty spot on a line)
 * @param {number} radius the radius
 * @return {string}
 */
function buildPath(lines, jumpSize, jumpType, radius) {
  const path = new g.Path()
  let segment

  // first move to the start of a first line
  segment = g.Path.createSegment('M', lines[0].start)
  path.appendSegment(segment)

  // make a paths from lines
  util.toArray(lines).forEach(function(line, index) {
    if (line.isJump) {
      let angle, diff

      let control1, control2

      if (jumpType === 'arc') {
        // approximates semicircle with 2 curves
        angle = -90
        // determine rotation of arc based on difference between points
        diff = line.start.difference(line.end)
        // make sure the arc always points up (or right)
        const xAxisRotate = Number(diff.x < 0 || (diff.x === 0 && diff.y < 0))
        if (xAxisRotate) angle += 180

        const midpoint = line.midpoint()
        const centerLine = new g.Line(midpoint, line.end).rotate(
          midpoint,
          angle,
        )

        let halfLine

        // first half
        halfLine = new g.Line(line.start, midpoint)

        control1 = halfLine.pointAt(2 / 3).rotate(line.start, angle)
        control2 = centerLine.pointAt(1 / 3).rotate(centerLine.end, -angle)

        segment = g.Path.createSegment('C', control1, control2, centerLine.end)
        path.appendSegment(segment)

        // second half
        halfLine = new g.Line(midpoint, line.end)

        control1 = centerLine.pointAt(1 / 3).rotate(centerLine.end, angle)
        control2 = halfLine.pointAt(1 / 3).rotate(line.end, -angle)

        segment = g.Path.createSegment('C', control1, control2, line.end)
        path.appendSegment(segment)
      } else if (jumpType === 'gap') {
        segment = g.Path.createSegment('M', line.end)
        path.appendSegment(segment)
      } else if (jumpType === 'cubic') {
        // approximates semicircle with 1 curve
        angle = line.start.theta(line.end)

        const xOffset = jumpSize * 0.6
        let yOffset = jumpSize * 1.35

        // determine rotation of arc based on difference between points
        diff = line.start.difference(line.end)
        // make sure the arc always points up (or right)
        xAxisRotate = Number(diff.x < 0 || (diff.x === 0 && diff.y < 0))
        if (xAxisRotate) yOffset *= -1

        control1 = g
          .Point(line.start.x + xOffset, line.start.y + yOffset)
          .rotate(line.start, angle)
        control2 = g
          .Point(line.end.x - xOffset, line.end.y + yOffset)
          .rotate(line.end, angle)

        segment = g.Path.createSegment('C', control1, control2, line.end)
        path.appendSegment(segment)
      }
    } else {
      const nextLine = lines[index + 1]
      if (radius === 0 || !nextLine || nextLine.isJump) {
        segment = g.Path.createSegment('L', line.end)
        path.appendSegment(segment)
      } else {
        buildRoundedSegment(radius, path, line.end, line.start, nextLine.end)
      }
    }
  })

  return path
}

function buildRoundedSegment(offset, path, curr, prev, next) {
  const prevDistance = curr.distance(prev) / 2
  const nextDistance = curr.distance(next) / 2

  const startMove = -Math.min(offset, prevDistance)
  const endMove = -Math.min(offset, nextDistance)

  const roundedStart = curr
    .clone()
    .move(prev, startMove)
    .round()
  const roundedEnd = curr
    .clone()
    .move(next, endMove)
    .round()

  const control1 = new g.Point(
    f13 * roundedStart.x + f23 * curr.x,
    f23 * curr.y + f13 * roundedStart.y,
  )
  const control2 = new g.Point(
    f13 * roundedEnd.x + f23 * curr.x,
    f23 * curr.y + f13 * roundedEnd.y,
  )

  let segment
  segment = g.Path.createSegment('L', roundedStart)
  path.appendSegment(segment)

  segment = g.Path.createSegment('C', control1, control2, roundedEnd)
  path.appendSegment(segment)
}

export function jumpover(
  this: EdgeView,
  sourcePoint: Point,
  targetPoint: Point,
  routePoints: Point[],
  options: JumpoverConnectorOptions = {},
) {
  setupUpdating(this)

  const jumpSize = options.size || JUMP_SIZE
  const jumpType = options.type || 'arc'
  const radius = options.radius || RADIUS
  const ignoreConnectors = options.ignoreConnectors || IGNORED_CONNECTORS

  const paper = this.paper
  const graph = paper.model
  const allLinks = graph.getLinks()

  // there is just one link, draw it directly
  if (allLinks.length === 1) {
    return buildPath(
      createLines(sourcePoint, targetPoint, routePoints),
      jumpSize,
      jumpType,
      radius,
    )
  }

  const thisModel = this.model
  const thisIndex = allLinks.indexOf(thisModel)
  const defaultConnector = paper.options.defaultConnector || {}

  // not all links are meant to be jumped over.
  const links = allLinks.filter((link, idx) => {
    const connector = link.get('connector') || defaultConnector

    // avoid jumping over links with connector type listed in `ignored connectors`.
    if (util.toArray(ignoreConnectors).includes(connector.name)) {
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
  const linkViews = links.map(link => {
    return paper.findViewByModel(link)
  })

  // create lines for this link
  const thisLines = createLines(sourcePoint, targetPoint, routePoints)

  // create lines for all other links
  const linkLines = linkViews.map(linkView => {
    if (linkView == null) {
      return []
    }
    if (linkView === this) {
      return thisLines
    }
    return createLines(
      linkView.sourcePoint,
      linkView.targetPoint,
      linkView.route,
    )
  })

  // transform lines for this link by splitting with jump lines at
  // points of intersection with other links
  const jumpingLines = thisLines.reduce((resultLines, thisLine) => {
    // iterate all links and grab the intersections with this line
    // these are then sorted by distance so the line can be split more easily

    const intersections = links
      .reduce((res, link, i) => {
        // don't intersection with itself
        if (link !== thisModel) {
          const lineIntersections = findLineIntersections(
            thisLine,
            linkLines[i],
          )
          res.push.apply(res, lineIntersections)
        }
        return res
      }, [])
      .sort(function(a, b) {
        return sortPoints(thisLine.start, a) - sortPoints(thisLine.start, b)
      })

    if (intersections.length > 0) {
      // split the line based on found intersection points
      resultLines.push.apply(
        resultLines,
        createJumps(thisLine, intersections, jumpSize),
      )
    } else {
      // without any intersection the line goes uninterrupted
      resultLines.push(thisLine)
    }
    return resultLines
  }, [])

  const path = buildPath(jumpingLines, jumpSize, jumpType, radius)
  return options.raw ? path : path.serialize()
}

export interface JumpoverConnectorOptions extends ConnectorOptions {
  size?: number
  radius?: number
  type?: 'arc' | 'gap' | 'cubic'
  ignoreConnectors?: string[]
}
