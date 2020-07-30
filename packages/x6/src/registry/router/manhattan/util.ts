import { KeyValue } from '../../../types'
import { Util } from '../../../global/util'
import { Point, Line, Angle, Rectangle } from '../../../geometry'
import { EdgeView } from '../../../view/edge'
import { ResolvedOptions, Direction } from './options'

export function getSourceBBox(view: EdgeView, options: ResolvedOptions) {
  const bbox = view.sourceBBox.clone()
  if (options && options.paddingBox) {
    return bbox.moveAndExpand(options.paddingBox)
  }

  return bbox
}

export function getTargetBBox(view: EdgeView, options: ResolvedOptions) {
  const bbox = view.targetBBox.clone()
  if (options && options.paddingBox) {
    return bbox.moveAndExpand(options.paddingBox)
  }

  return bbox
}

export function getSourceEndpoint(view: EdgeView, options: ResolvedOptions) {
  if (view.sourceAnchor) {
    return view.sourceAnchor
  }

  const sourceBBox = getSourceBBox(view, options)
  return sourceBBox.getCenter()
}

export function getTargetEndpoint(view: EdgeView, options: ResolvedOptions) {
  if (view.targetAnchor) {
    return view.targetAnchor
  }

  const targetBBox = getTargetBBox(view, options)
  return targetBBox.getCenter()
}

// returns a direction index from start point to end point
// corrects for grid deformation between start and end
export function getDirectionAngle(
  start: Point,
  end: Point,
  directionCount: number,
  grid: Grid,
  options: ResolvedOptions,
) {
  const quadrant = 360 / directionCount
  const angleTheta = start.theta(fixAngleEnd(start, end, grid, options))
  const normalizedAngle = Angle.normalize(angleTheta + quadrant / 2)
  return quadrant * Math.floor(normalizedAngle / quadrant)
}

function fixAngleEnd(
  start: Point,
  end: Point,
  grid: Grid,
  options: ResolvedOptions,
) {
  const step = options.step

  const diffX = end.x - start.x
  const diffY = end.y - start.y

  const gridStepsX = diffX / grid.x
  const gridStepsY = diffY / grid.y

  const distanceX = gridStepsX * step
  const distanceY = gridStepsY * step

  return new Point(start.x + distanceX, start.y + distanceY)
}

/**
 * Returns the change in direction between two direction angles.
 */
export function getDirectionChange(angle1: number, angle2: number) {
  const change = Math.abs(angle1 - angle2)
  return change > 180 ? 360 - change : change
}

// fix direction offsets according to current grid
export function getGridOffsets(grid: Grid, options: ResolvedOptions) {
  const step = options.step

  options.directions.forEach((direction) => {
    direction.gridOffsetX = (direction.offsetX / step) * grid.x
    direction.gridOffsetY = (direction.offsetY / step) * grid.y
  })

  return options.directions
}

export interface Grid {
  source: Point
  x: number
  y: number
}

// get grid size in x and y dimensions, adapted to source and target positions
export function getGrid(step: number, source: Point, target: Point): Grid {
  return {
    source: source.clone(),
    x: getGridDimension(target.x - source.x, step),
    y: getGridDimension(target.y - source.y, step),
  }
}

function getGridDimension(diff: number, step: number) {
  // return step if diff = 0
  if (!diff) {
    return step
  }

  const abs = Math.abs(diff)
  const count = Math.round(abs / step)

  // return `abs` if less than one step apart
  if (!count) {
    return abs
  }

  // otherwise, return corrected step
  const roundedDiff = count * step
  const remainder = abs - roundedDiff
  const correction = remainder / count

  return step + correction
}

function snapGrid(point: Point, grid: Grid) {
  const source = grid.source
  const x = Util.snapToGrid(point.x - source.x, grid.x) + source.x
  const y = Util.snapToGrid(point.y - source.y, grid.y) + source.y

  return new Point(x, y)
}

export function round(point: Point, precision: number) {
  return point.round(precision)
}

export function align(point: Point, grid: Grid, precision: number) {
  return round(snapGrid(point.clone(), grid), precision)
}

export function getKey(point: Point) {
  return point.toString()
}

export function normalizePoint(point: Point.PointLike) {
  return new Point(
    point.x === 0 ? 0 : Math.abs(point.x) / point.x,
    point.y === 0 ? 0 : Math.abs(point.y) / point.y,
  )
}

export function getCost(from: Point, anchors: Point[]) {
  let min = Infinity

  for (let i = 0, len = anchors.length; i < len; i += 1) {
    const dist = from.manhattanDistance(anchors[i])
    if (dist < min) {
      min = dist
    }
  }

  return min
}

// Find points around the bbox taking given directions into account
// lines are drawn from anchor in given directions, intersections recorded
// if anchor is outside bbox, only those directions that intersect get a rect point
// the anchor itself is returned as rect point (representing some directions)
// (since those directions are unobstructed by the bbox)
export function getRectPoints(
  anchor: Point,
  bbox: Rectangle,
  directionList: Direction[],
  grid: Grid,
  options: ResolvedOptions,
) {
  const precision = options.precision
  const directionMap = options.directionMap
  const centerVector = anchor.diff(bbox.getCenter())

  const rectPoints = Object.keys(directionMap).reduce<Point[]>(
    (res, key: Direction) => {
      if (directionList.includes(key)) {
        const direction = directionMap[key]

        // Create a line that is guaranteed to intersect the bbox if bbox
        // is in the direction even if anchor lies outside of bbox.
        const ending = new Point(
          anchor.x + direction.x * (Math.abs(centerVector.x) + bbox.width),
          anchor.y + direction.y * (Math.abs(centerVector.y) + bbox.height),
        )
        const intersectionLine = new Line(anchor, ending)

        // Get the farther intersection, in case there are two
        // (that happens if anchor lies next to bbox)
        const intersections = intersectionLine.intersect(bbox) || []
        let farthestIntersectionDistance
        let farthestIntersection = null
        for (let i = 0; i < intersections.length; i += 1) {
          const intersection = intersections[i]
          const distance = anchor.squaredDistance(intersection)
          if (
            farthestIntersectionDistance == null ||
            distance > farthestIntersectionDistance
          ) {
            farthestIntersectionDistance = distance
            farthestIntersection = intersection
          }
        }

        // If an intersection was found in this direction, it is our rectPoint
        if (farthestIntersection) {
          let target = align(farthestIntersection, grid, precision)
          // If the rectPoint lies inside the bbox, offset it by one more step
          if (bbox.containsPoint(target)) {
            target = align(
              target.translate(direction.x * grid.x, direction.y * grid.y),
              grid,
              precision,
            )
          }

          res.push(target)
        }
      }

      return res
    },
    [],
  )

  // if anchor lies outside of bbox, add it to the array of points
  if (!bbox.containsPoint(anchor)) {
    rectPoints.push(align(anchor, grid, precision))
  }

  return rectPoints
}

// reconstructs a route by concatenating points with their parents
export function reconstructRoute(
  parents: KeyValue<Point>,
  points: KeyValue<Point>,
  tailPoint: Point,
  from: Point,
  to: Point,
) {
  const route = []

  let prevDiff = normalizePoint(to.diff(tailPoint))

  // tailPoint is assumed to be aligned already
  let currentKey = getKey(tailPoint)
  let parent = parents[currentKey]

  let point
  while (parent) {
    // point is assumed to be aligned already
    point = points[currentKey]

    const diff = normalizePoint(point.diff(parent))
    if (!diff.equals(prevDiff)) {
      route.unshift(point)
      prevDiff = diff
    }

    // parent is assumed to be aligned already
    currentKey = getKey(parent)
    parent = parents[currentKey]
  }

  // leadPoint is assumed to be aligned already
  const leadPoint = points[currentKey]

  const fromDiff = normalizePoint(leadPoint.diff(from))
  if (!fromDiff.equals(prevDiff)) {
    route.unshift(leadPoint)
  }

  return route
}
