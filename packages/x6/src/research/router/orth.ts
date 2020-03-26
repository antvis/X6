import { Router } from './index'
import { EdgeView } from '../core/edge-view'
import { Point, Rectangle, Line, Angle } from '../../geometry'
import { NumberExt, ArrayExt } from '../../util'

/**
 * Bearing to opposite bearing map
 */
const opposites = {
  N: 'S',
  S: 'N',
  E: 'W',
  W: 'E',
}

/**
 * Bearing to radians map
 */
const radians = {
  N: (-Math.PI / 2) * 3,
  S: -Math.PI / 2,
  E: 0,
  W: Math.PI,
}

/**
 * Returns a point `p` where lines p,p1 and p,p2 are perpendicular
 * and p is not contained in the given box
 */
function freeJoin(p1: Point, p2: Point, bbox: Rectangle) {
  let p = new Point(p1.x, p2.y)
  if (bbox.containsPoint(p)) {
    p = new Point(p2.x, p1.y)
  }

  // kept for reference
  // if (bbox.containsPoint(p)) {
  //   p = null
  // }

  return p
}

/**
 * Returns either width or height of a bbox based on the given bearing.
 */
function getBBoxSize(bbox: Rectangle, bearing: Bearings) {
  return bbox[bearing === 'W' || bearing === 'E' ? 'width' : 'height']
}

type Bearings = ReturnType<typeof getBearing>

function getBearing(from: Point.PointLike, to: Point.PointLike) {
  if (from.x === to.x) {
    return from.y > to.y ? 'N' : 'S'
  }
  if (from.y === to.y) {
    return from.x > to.x ? 'W' : 'E'
  }

  return null
}

function getPointBox(p: Point) {
  return new Rectangle(p.x, p.y, 0, 0)
}

function getPaddingBox(options: OrthOptions) {
  const sides = NumberExt.normalizeSides(options.padding || 20)

  return {
    x: -sides.left,
    y: -sides.top,
    width: sides.left + sides.right,
    height: sides.top + sides.bottom,
  }
}

function getSourceBBox(view: EdgeView, options: OrthOptions) {
  return view.sourceBBox.clone().moveAndExpand(getPaddingBox(options))
}

function getTargetBBox(view: EdgeView, options: OrthOptions) {
  return view.targetBBox.clone().moveAndExpand(getPaddingBox(options))
}

function getSourceAnchor(view: EdgeView, options: OrthOptions) {
  if (view.sourceAnchor) {
    return view.sourceAnchor
  }
  const bbox = getSourceBBox(view, options)
  return bbox.getCenter()
}

function getTargetAnchor(view: EdgeView, options: OrthOptions) {
  if (view.targetAnchor) {
    return view.targetAnchor
  }

  const bbox = getTargetBBox(view, options)
  return bbox.getCenter()
}

function vertexVertex(from: Point, to: Point, bearing: Bearings) {
  const p1 = new Point(from.x, to.y)
  const p2 = new Point(to.x, from.y)
  const d1 = getBearing(from, p1)
  const d2 = getBearing(from, p2)
  const opposite = bearing ? opposites[bearing] : null

  const p =
    d1 === bearing || (d1 !== opposite && (d2 === opposite || d2 !== bearing))
      ? p1
      : p2

  return { points: [p], direction: getBearing(p, to) }
}

function elementVertex(from: Point, to: Point, fromBBox: Rectangle) {
  const p = freeJoin(from, to, fromBBox)

  return { points: [p], direction: getBearing(p, to) }
}

function vertexElement(
  from: Point,
  to: Point,
  toBBox: Rectangle,
  bearing: Bearings,
) {
  const points = [new Point(from.x, to.y), new Point(to.x, from.y)]
  const freePoints = points.filter(p => !toBBox.containsPoint(p))
  const freeBearingPoints = freePoints.filter(
    p => getBearing(p, from) !== bearing,
  )

  let p

  if (freeBearingPoints.length > 0) {
    // Try to pick a point which bears the same direction as the previous segment.

    p = freeBearingPoints.filter(p => getBearing(from, p) === bearing).pop()
    p = p || freeBearingPoints[0]

    return {
      points: [p],
      direction: getBearing(p, to),
    }
  }

  {
    // Here we found only points which are either contained in the element or they would create
    // a link segment going in opposite direction from the previous one.
    // We take the point inside element and move it outside the element in the direction the
    // route is going. Now we can join this point with the current end (using freeJoin).

    p = ArrayExt.difference(points, freePoints)[0]

    const p2 = Point.create(to).move(p, -getBBoxSize(toBBox, bearing) / 2)
    const p1 = freeJoin(p2, from, toBBox)

    return {
      points: [p1, p2],
      direction: getBearing(p2, to),
    }
  }
}

function elementElement(
  from: Point,
  to: Point,
  fromBBox: Rectangle,
  toBBox: Rectangle,
) {
  let route = elementVertex(to, from, toBBox)
  const p1 = route.points[0]

  if (fromBBox.containsPoint(p1)) {
    route = elementVertex(from, to, fromBBox)
    const p2 = route.points[0]

    if (toBBox.containsPoint(p2)) {
      const fromBorder = Point.create(from).move(
        p2,
        -getBBoxSize(fromBBox, getBearing(from, p2)) / 2,
      )
      const toBorder = Point.create(to).move(
        p1,
        -getBBoxSize(toBBox, getBearing(to, p1)) / 2,
      )

      const mid = new Line(fromBorder, toBorder).getCenter()
      const startRoute = elementVertex(from, mid, fromBBox)
      const endRoute = vertexVertex(mid, to, startRoute.direction as Bearings)

      route.points = [startRoute.points[0], endRoute.points[0]]
      route.direction = endRoute.direction
    }
  }

  return route
}

// Finds route for situations where one node is inside the other.
// Typically the route is directed outside the outer node first and
// then back towards the inner node.
function insideElement(
  from: Point,
  to: Point,
  fromBBox: Rectangle,
  toBBox: Rectangle,
  bearing?: Bearings,
) {
  const boundary = fromBBox.union(toBBox).inflate(1)

  // start from the point which is closer to the boundary
  const center = boundary.getCenter()
  const reversed = center.distance(to) > center.distance(from)
  const start = reversed ? to : from
  const end = reversed ? from : to

  let p1: Point
  let p2: Point
  let p3: Point

  if (bearing) {
    // Points on circle with radius equals 'W + H` are always outside the rectangle
    // with width W and height H if the center of that circle is the center of that rectangle.
    p1 = Point.fromPolar(
      boundary.width + boundary.height,
      radians[bearing],
      start,
    )
    p1 = boundary.pointNearestToPoint(p1).move(p1, -1)
  } else {
    p1 = boundary.pointNearestToPoint(start).move(start, 1)
  }

  p2 = freeJoin(p1, end, boundary)

  let points: Point[]

  if (p1.round().equals(p2.round())) {
    p2 = Point.fromPolar(
      boundary.width + boundary.height,
      Angle.toRad(p1.theta(start)) + Math.PI / 2,
      end,
    )
    p2 = boundary
      .pointNearestToPoint(p2)
      .move(end, 1)
      .round()
    p3 = freeJoin(p1, p2, boundary)
    points = reversed ? [p2, p3, p1] : [p1, p3, p2]
  } else {
    points = reversed ? [p2, p1] : [p1, p2]
  }

  const direction = reversed ? getBearing(p1, to) : getBearing(p2, to)

  return {
    points,
    direction,
  }
}

export interface OrthOptions {
  padding?: NumberExt.SideOptions
}

export const orth: Router.Definition<OrthOptions> = function(
  vertices,
  options,
  linkView,
) {
  let sourceBBox = getSourceBBox(linkView, options)
  let targetBBox = getTargetBBox(linkView, options)
  const sourceAnchor = getSourceAnchor(linkView, options)
  const targetAnchor = getTargetAnchor(linkView, options)

  // If anchor lies outside of bbox, the bbox expands to include it
  sourceBBox = sourceBBox.union(getPointBox(sourceAnchor))
  targetBBox = targetBBox.union(getPointBox(targetAnchor))

  const points = vertices.map(p => Point.create(p))
  points.unshift(sourceAnchor)
  points.push(targetAnchor)

  let bearing: Bearings | null = null // bearing of previous route segment
  const orthVertices = []

  for (let i = 0, len = points.length - 1; i < len; i += 1) {
    let route = null

    const from = points[i]
    const to = points[i + 1]
    const isOrthogonal = !!getBearing(from, to)

    if (i === 0) {
      // source

      if (i + 1 === len) {
        // route source -> target

        // Expand one of the nodes by 1px to detect situations when the two
        // nodes are positioned next to each other with no gap in between.
        if (sourceBBox.intersect(targetBBox.clone().inflate(1))) {
          route = insideElement(from, to, sourceBBox, targetBBox)
        } else if (!isOrthogonal) {
          route = elementElement(from, to, sourceBBox, targetBBox)
        }
      } else {
        // route source -> vertex

        if (sourceBBox.containsPoint(to)) {
          route = insideElement(
            from,
            to,
            sourceBBox,
            getPointBox(to).moveAndExpand(getPaddingBox(options)),
          )
        } else if (!isOrthogonal) {
          route = elementVertex(from, to, sourceBBox)
        }
      }
    } else if (i + 1 === len) {
      // route vertex -> target

      // prevent overlaps with previous line segment
      const isOrthogonalLoop = isOrthogonal && getBearing(to, from) === bearing

      if (targetBBox.containsPoint(from) || isOrthogonalLoop) {
        route = insideElement(
          from,
          to,
          getPointBox(from).moveAndExpand(getPaddingBox(options)),
          targetBBox,
          bearing,
        )
      } else if (!isOrthogonal) {
        route = vertexElement(from, to, targetBBox, bearing)
      }
    } else if (!isOrthogonal) {
      // route vertex -> vertex
      route = vertexVertex(from, to, bearing)
    }

    // applicable to all routes:

    // set bearing for next iteration
    if (route) {
      Array.prototype.push.apply(orthVertices, route.points)
      bearing = route.direction as Bearings
    } else {
      // orthogonal route and not looped
      bearing = getBearing(from, to)
    }

    // push `to` point to identified orthogonal vertices array
    if (i + 1 < len) {
      orthVertices.push(to)
    }
  }

  return orthVertices
}
