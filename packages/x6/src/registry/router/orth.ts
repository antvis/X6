import { Router } from './index'
import { ArrayExt } from '../../util'
import { Point, Rectangle, Line, Angle } from '../../geometry'
import * as Util from './util'

export interface OrthRouterOptions extends Util.PaddingOptions {}

/**
 * Returns a route with orthogonal line segments.
 */
export const orth: Router.Definition<OrthRouterOptions> = function (
  vertices,
  options,
  edgeView,
) {
  let sourceBBox = Util.getSourceBBox(edgeView, options)
  let targetBBox = Util.getTargetBBox(edgeView, options)
  const sourceAnchor = Util.getSourceAnchor(edgeView, options)
  const targetAnchor = Util.getTargetAnchor(edgeView, options)

  // If anchor lies outside of bbox, the bbox expands to include it
  sourceBBox = sourceBBox.union(Util.getPointBBox(sourceAnchor))
  targetBBox = targetBBox.union(Util.getPointBBox(targetAnchor))

  const points = vertices.map((p) => Point.create(p))
  points.unshift(sourceAnchor)
  points.push(targetAnchor)

  // bearing of previous route segment
  let bearing: Private.Bearings | null = null
  const result = []

  for (let i = 0, len = points.length - 1; i < len; i += 1) {
    let route = null

    const from = points[i]
    const to = points[i + 1]
    const isOrthogonal = Private.getBearing(from, to) != null

    if (i === 0) {
      // source

      if (i + 1 === len) {
        // source -> target

        // Expand one of the nodes by 1px to detect situations when the two
        // nodes are positioned next to each other with no gap in between.
        if (sourceBBox.intersectsWithRect(targetBBox.clone().inflate(1))) {
          route = Private.insideNode(from, to, sourceBBox, targetBBox)
        } else if (!isOrthogonal) {
          route = Private.nodeToNode(from, to, sourceBBox, targetBBox)
        }
      } else {
        // source -> vertex
        if (sourceBBox.containsPoint(to)) {
          route = Private.insideNode(
            from,
            to,
            sourceBBox,
            Util.getPointBBox(to).moveAndExpand(Util.getPaddingBox(options)),
          )
        } else if (!isOrthogonal) {
          route = Private.nodeToVertex(from, to, sourceBBox)
        }
      }
    } else if (i + 1 === len) {
      // vertex -> target

      // prevent overlaps with previous line segment
      const isOrthogonalLoop =
        isOrthogonal && Private.getBearing(to, from) === bearing

      if (targetBBox.containsPoint(from) || isOrthogonalLoop) {
        route = Private.insideNode(
          from,
          to,
          Util.getPointBBox(from).moveAndExpand(Util.getPaddingBox(options)),
          targetBBox,
          bearing,
        )
      } else if (!isOrthogonal) {
        route = Private.vertexToNode(from, to, targetBBox, bearing)
      }
    } else if (!isOrthogonal) {
      // vertex -> vertex
      route = Private.vertexToVertex(from, to, bearing)
    }

    // set bearing for next iteration
    if (route) {
      result.push(...route.points)
      bearing = route.direction as Private.Bearings
    } else {
      // orthogonal route and not looped
      bearing = Private.getBearing(from, to)
    }

    // push `to` point to identified orthogonal vertices array
    if (i + 1 < len) {
      result.push(to)
    }
  }

  return result
}

namespace Private {
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
    //   return null
    // }

    return p
  }

  /**
   * Returns either width or height of a bbox based on the given bearing.
   */
  export function getBBoxSize(bbox: Rectangle, bearing: Bearings) {
    return bbox[bearing === 'W' || bearing === 'E' ? 'width' : 'height']
  }

  export type Bearings = ReturnType<typeof getBearing>

  export function getBearing(from: Point.PointLike, to: Point.PointLike) {
    if (from.x === to.x) {
      return from.y > to.y ? 'N' : 'S'
    }

    if (from.y === to.y) {
      return from.x > to.x ? 'W' : 'E'
    }

    return null
  }

  export function vertexToVertex(from: Point, to: Point, bearing: Bearings) {
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

  export function nodeToVertex(from: Point, to: Point, fromBBox: Rectangle) {
    const p = freeJoin(from, to, fromBBox)

    return { points: [p], direction: getBearing(p, to) }
  }

  export function vertexToNode(
    from: Point,
    to: Point,
    toBBox: Rectangle,
    bearing: Bearings,
  ) {
    const points = [new Point(from.x, to.y), new Point(to.x, from.y)]
    const freePoints = points.filter((p) => !toBBox.containsPoint(p))
    const freeBearingPoints = freePoints.filter(
      (p) => getBearing(p, from) !== bearing,
    )

    let p

    if (freeBearingPoints.length > 0) {
      // Try to pick a point which bears the same direction as the previous segment.

      p = freeBearingPoints.filter((p) => getBearing(from, p) === bearing).pop()
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

  export function nodeToNode(
    from: Point,
    to: Point,
    fromBBox: Rectangle,
    toBBox: Rectangle,
  ) {
    let route = nodeToVertex(to, from, toBBox)
    const p1 = route.points[0]

    if (fromBBox.containsPoint(p1)) {
      route = nodeToVertex(from, to, fromBBox)
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
        const startRoute = nodeToVertex(from, mid, fromBBox)
        const endRoute = vertexToVertex(
          mid,
          to,
          startRoute.direction as Bearings,
        )

        route.points = [startRoute.points[0], endRoute.points[0]]
        route.direction = endRoute.direction
      }
    }

    return route
  }

  // Finds route for situations where one node is inside the other.
  // Typically the route is directed outside the outer node first and
  // then back towards the inner node.
  export function insideNode(
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
      p1 = boundary.getNearestPointToPoint(p1).move(p1, -1)
    } else {
      p1 = boundary.getNearestPointToPoint(start).move(start, 1)
    }

    p2 = freeJoin(p1, end, boundary)

    let points: Point[]

    if (p1.round().equals(p2.round())) {
      p2 = Point.fromPolar(
        boundary.width + boundary.height,
        Angle.toRad(p1.theta(start)) + Math.PI / 2,
        end,
      )
      p2 = boundary.getNearestPointToPoint(p2).move(end, 1).round()
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
}
