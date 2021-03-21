import { Point } from './point'
import { Rectangle } from './rectangle'
import { Line } from './line'
import { Geometry } from './geometry'

export class Polyline extends Geometry {
  points: Point[]

  protected get [Symbol.toStringTag]() {
    return Polyline.toStringTag
  }

  get start() {
    if (this.points.length === 0) {
      return null
    }
    return this.points[0]
  }

  get end() {
    if (this.points.length === 0) {
      return null
    }
    return this.points[this.points.length - 1]
  }

  constructor(points?: (Point.PointLike | Point.PointData)[] | string) {
    super()
    if (points != null) {
      if (typeof points === 'string') {
        return Polyline.parse(points)
      }
      this.points = points.map((p) => Point.create(p))
    } else {
      this.points = []
    }
  }

  scale(
    sx: number,
    sy: number,
    origin: Point.PointLike | Point.PointData = new Point(),
  ) {
    this.points.forEach((p) => p.scale(sx, sy, origin))
    return this
  }

  rotate(angle: number, origin?: Point.PointLike | Point.PointData) {
    this.points.forEach((p) => p.rotate(angle, origin))
    return this
  }

  translate(dx: number, dy: number): this
  translate(p: Point.PointLike | Point.PointData): this
  translate(dx: number | Point.PointLike | Point.PointData, dy?: number): this {
    const t = Point.create(dx, dy)
    this.points.forEach((p) => p.translate(t.x, t.y))
    return this
  }

  bbox() {
    if (this.points.length === 0) {
      return new Rectangle()
    }

    let x1 = Infinity
    let x2 = -Infinity
    let y1 = Infinity
    let y2 = -Infinity

    const points = this.points
    for (let i = 0, ii = points.length; i < ii; i += 1) {
      const point = points[i]
      const x = point.x
      const y = point.y

      if (x < x1) x1 = x
      if (x > x2) x2 = x
      if (y < y1) y1 = y
      if (y > y2) y2 = y
    }

    return new Rectangle(x1, y1, x2 - x1, y2 - y1)
  }

  closestPoint(p: Point.PointLike | Point.PointData) {
    const cpLength = this.closestPointLength(p)
    return this.pointAtLength(cpLength)
  }

  closestPointLength(p: Point.PointLike | Point.PointData) {
    const points = this.points
    const count = points.length
    if (count === 0 || count === 1) {
      return 0
    }

    let length = 0
    let cpLength = 0
    let minSqrDistance = Infinity
    for (let i = 0, ii = count - 1; i < ii; i += 1) {
      const line = new Line(points[i], points[i + 1])
      const lineLength = line.length()
      const cpNormalizedLength = line.closestPointNormalizedLength(p)
      const cp = line.pointAt(cpNormalizedLength)

      const sqrDistance = cp.squaredDistance(p)
      if (sqrDistance < minSqrDistance) {
        minSqrDistance = sqrDistance
        cpLength = length + cpNormalizedLength * lineLength
      }

      length += lineLength
    }

    return cpLength
  }

  closestPointNormalizedLength(p: Point.PointLike | Point.PointData) {
    const cpLength = this.closestPointLength(p)
    if (cpLength === 0) {
      return 0
    }

    const length = this.length()
    if (length === 0) {
      return 0
    }

    return cpLength / length
  }

  closestPointTangent(p: Point.PointLike | Point.PointData) {
    const cpLength = this.closestPointLength(p)
    return this.tangentAtLength(cpLength)
  }

  containsPoint(p: Point.PointLike | Point.PointData) {
    if (this.points.length === 0) {
      return false
    }

    const ref = Point.clone(p)
    const x = ref.x
    const y = ref.y
    const points = this.points
    const count = points.length

    let startIndex = count - 1
    let intersectionCount = 0
    for (let endIndex = 0; endIndex < count; endIndex += 1) {
      const start = points[startIndex]
      const end = points[endIndex]
      if (ref.equals(start)) {
        return true
      }

      const segment = new Line(start, end)
      if (segment.containsPoint(p)) {
        return true
      }

      // do we have an intersection?
      if ((y <= start.y && y > end.y) || (y > start.y && y <= end.y)) {
        // this conditional branch IS NOT entered when `segment` is collinear/coincident with `ray`
        // (when `y === start.y === end.y`)
        // this conditional branch IS entered when `segment` touches `ray` at only one point
        // (e.g. when `y === start.y !== end.y`)
        // since this branch is entered again for the following segment, the two touches cancel out

        const xDifference = start.x - x > end.x - x ? start.x - x : end.x - x
        if (xDifference >= 0) {
          // segment lies at least partially to the right of `p`
          const rayEnd = new Point(x + xDifference, y) // right
          const ray = new Line(p, rayEnd)

          if (segment.intersectsWithLine(ray)) {
            // an intersection was detected to the right of `p`
            intersectionCount += 1
          }
        } // else: `segment` lies completely to the left of `p` (i.e. no intersection to the right)
      }

      // move to check the next polyline segment
      startIndex = endIndex
    }

    // returns `true` for odd numbers of intersections (even-odd algorithm)
    return intersectionCount % 2 === 1
  }

  intersectsWithLine(line: Line) {
    const intersections = []
    for (let i = 0, n = this.points.length - 1; i < n; i += 1) {
      const a = this.points[i]
      const b = this.points[i + 1]
      const int = line.intersectsWithLine(new Line(a, b))
      if (int) {
        intersections.push(int)
      }
    }
    return intersections.length > 0 ? intersections : null
  }

  isDifferentiable() {
    for (let i = 0, ii = this.points.length - 1; i < ii; i += 1) {
      const a = this.points[i]
      const b = this.points[i + 1]
      const line = new Line(a, b)
      if (line.isDifferentiable()) {
        return true
      }
    }

    return false
  }

  length() {
    let len = 0
    for (let i = 0, ii = this.points.length - 1; i < ii; i += 1) {
      const a = this.points[i]
      const b = this.points[i + 1]
      len += a.distance(b)
    }
    return len
  }

  pointAt(ratio: number) {
    const points = this.points
    const count = points.length
    if (count === 0) {
      return null
    }

    if (count === 1) {
      return points[0].clone()
    }

    if (ratio <= 0) {
      return points[0].clone()
    }

    if (ratio >= 1) {
      return points[count - 1].clone()
    }

    const total = this.length()
    const length = total * ratio
    return this.pointAtLength(length)
  }

  pointAtLength(length: number) {
    const points = this.points
    const count = points.length
    if (count === 0) {
      return null
    }

    if (count === 1) {
      return points[0].clone()
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // eslint-disable-line
    }

    let tmp = 0
    for (let i = 0, ii = count - 1; i < ii; i += 1) {
      const index = fromStart ? i : ii - 1 - i
      const a = points[index]
      const b = points[index + 1]
      const l = new Line(a, b)
      const d = a.distance(b)

      if (length <= tmp + d) {
        return l.pointAtLength((fromStart ? 1 : -1) * (length - tmp))
      }

      tmp += d
    }

    const lastPoint = fromStart ? points[count - 1] : points[0]
    return lastPoint.clone()
  }

  tangentAt(ratio: number) {
    const points = this.points
    const count = points.length
    if (count === 0 || count === 1) {
      return null
    }

    if (ratio < 0) {
      ratio = 0 // eslint-disable-line
    }

    if (ratio > 1) {
      ratio = 1 // eslint-disable-line
    }

    const total = this.length()
    const length = total * ratio

    return this.tangentAtLength(length)
  }

  tangentAtLength(length: number) {
    const points = this.points
    const count = points.length
    if (count === 0 || count === 1) {
      return null
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // eslint-disable-line
    }

    let lastValidLine
    let tmp = 0
    for (let i = 0, ii = count - 1; i < ii; i += 1) {
      const index = fromStart ? i : ii - 1 - i
      const a = points[index]
      const b = points[index + 1]
      const l = new Line(a, b)
      const d = a.distance(b)

      if (l.isDifferentiable()) {
        // has a tangent line (line length is not 0)
        if (length <= tmp + d) {
          return l.tangentAtLength((fromStart ? 1 : -1) * (length - tmp))
        }

        lastValidLine = l
      }

      tmp += d
    }

    if (lastValidLine) {
      const ratio = fromStart ? 1 : 0
      return lastValidLine.tangentAt(ratio)
    }

    return null
  }

  simplify(
    // TODO: Accept startIndex and endIndex to specify where to start and end simplification
    options: {
      /**
       * The max distance of middle point from chord to be simplified.
       */
      threshold?: number
    } = {},
  ) {
    const points = this.points
    // we need at least 3 points
    if (points.length < 3) {
      return this
    }

    const threshold = options.threshold || 0

    // start at the beginning of the polyline and go forward
    let currentIndex = 0
    // we need at least one intermediate point (3 points) in every iteration
    // as soon as that stops being true, we know we reached the end of the polyline
    while (points[currentIndex + 2]) {
      const firstIndex = currentIndex
      const middleIndex = currentIndex + 1
      const lastIndex = currentIndex + 2

      const firstPoint = points[firstIndex]
      const middlePoint = points[middleIndex]
      const lastPoint = points[lastIndex]

      const chord = new Line(firstPoint, lastPoint) // = connection between first and last point
      const closestPoint = chord.closestPoint(middlePoint) // = closest point on chord from middle point
      const closestPointDistance = closestPoint.distance(middlePoint)
      if (closestPointDistance <= threshold) {
        // middle point is close enough to the chord = simplify
        // 1) remove middle point:
        points.splice(middleIndex, 1)
        // 2) in next iteration, investigate the newly-created triplet of points
        //    - do not change `currentIndex`
        //    = (first point stays, point after removed point becomes middle point)
      } else {
        // middle point is far from the chord
        // 1) preserve middle point
        // 2) in next iteration, move `currentIndex` by one step:
        currentIndex += 1
        //    = (point after first point becomes first point)
      }
    }

    // `points` array was modified in-place
    return this
  }

  toHull() {
    const points = this.points
    const count = points.length
    if (count === 0) {
      return new Polyline()
    }

    // Step 1: find the starting point -- point with
    // the lowest y (if equality, highest x).
    let startPoint: Point = points[0]
    for (let i = 1; i < count; i += 1) {
      if (points[i].y < startPoint.y) {
        startPoint = points[i]
      } else if (points[i].y === startPoint.y && points[i].x > startPoint.x) {
        startPoint = points[i]
      }
    }

    // Step 2: sort the list of points by angle between line
    // from start point to current point and the x-axis (theta).

    // Step 2a: create the point records = [point, originalIndex, angle]
    const sortedRecords: Types.HullRecord[] = []
    for (let i = 0; i < count; i += 1) {
      let angle = startPoint.theta(points[i])
      if (angle === 0) {
        // Give highest angle to start point.
        // The start point will end up at end of sorted list.
        // The start point will end up at beginning of hull points list.
        angle = 360
      }

      sortedRecords.push([points[i], i, angle])
    }

    // Step 2b: sort the list in place
    sortedRecords.sort((record1, record2) => {
      let ret = record1[2] - record2[2]
      if (ret === 0) {
        ret = record2[1] - record1[1]
      }

      return ret
    })

    // Step 2c: duplicate start record from the top of
    // the stack to the bottom of the stack.
    if (sortedRecords.length > 2) {
      const startPoint = sortedRecords[sortedRecords.length - 1]
      sortedRecords.unshift(startPoint)
    }

    // Step 3
    // ------

    // Step 3a: go through sorted points in order and find those with
    // right turns, and we want to get our results in clockwise order.

    // Dictionary of points with left turns - cannot be on the hull.
    const insidePoints: { [key: string]: Point } = {}
    // Stack of records with right turns - hull point candidates.
    const hullRecords: Types.HullRecord[] = []
    const getKey = (record: Types.HullRecord) =>
      `${record[0].toString()}@${record[1]}`

    while (sortedRecords.length !== 0) {
      const currentRecord = sortedRecords.pop()!
      const currentPoint = currentRecord[0]

      // Check if point has already been discarded.
      if (insidePoints[getKey(currentRecord)]) {
        continue
      }

      let correctTurnFound = false
      while (!correctTurnFound) {
        if (hullRecords.length < 2) {
          // Not enough points for comparison, just add current point.
          hullRecords.push(currentRecord)
          correctTurnFound = true
        } else {
          const lastHullRecord = hullRecords.pop()!
          const lastHullPoint = lastHullRecord[0]
          const secondLastHullRecord = hullRecords.pop()!
          const secondLastHullPoint = secondLastHullRecord[0]

          const crossProduct = secondLastHullPoint.cross(
            lastHullPoint,
            currentPoint,
          )

          if (crossProduct < 0) {
            // Found a right turn.
            hullRecords.push(secondLastHullRecord)
            hullRecords.push(lastHullRecord)
            hullRecords.push(currentRecord)
            correctTurnFound = true
          } else if (crossProduct === 0) {
            // the three points are collinear
            // three options:
            // there may be a 180 or 0 degree angle at lastHullPoint
            // or two of the three points are coincident

            // we have to take rounding errors into account
            const THRESHOLD = 1e-10
            const angleBetween = lastHullPoint.angleBetween(
              secondLastHullPoint,
              currentPoint,
            )

            if (Math.abs(angleBetween - 180) < THRESHOLD) {
              // rouding around 180 to 180
              // if the cross product is 0 because the angle is 180 degrees
              // discard last hull point (add to insidePoints)
              // insidePoints.unshift(lastHullPoint);
              insidePoints[getKey(lastHullRecord)] = lastHullPoint
              // reenter second-to-last hull point (will be last at next iter)
              hullRecords.push(secondLastHullRecord)
              // do not do anything with current point
              // correct turn not found
            } else if (
              lastHullPoint.equals(currentPoint) ||
              secondLastHullPoint.equals(lastHullPoint)
            ) {
              // if the cross product is 0 because two points are the same
              // discard last hull point (add to insidePoints)
              // insidePoints.unshift(lastHullPoint);
              insidePoints[getKey(lastHullRecord)] = lastHullPoint
              // reenter second-to-last hull point (will be last at next iter)
              hullRecords.push(secondLastHullRecord)
              // do not do anything with current point
              // correct turn not found
            } else if (Math.abs(((angleBetween + 1) % 360) - 1) < THRESHOLD) {
              // rounding around 0 and 360 to 0
              // if the cross product is 0 because the angle is 0 degrees
              // remove last hull point from hull BUT do not discard it
              // reenter second-to-last hull point (will be last at next iter)
              hullRecords.push(secondLastHullRecord)
              // put last hull point back into the sorted point records list
              sortedRecords.push(lastHullRecord)
              // we are switching the order of the 0deg and 180deg points
              // correct turn not found
            }
          } else {
            // found a left turn
            // discard last hull point (add to insidePoints)
            // insidePoints.unshift(lastHullPoint);
            insidePoints[getKey(lastHullRecord)] = lastHullPoint
            // reenter second-to-last hull point (will be last at next iter of loop)
            hullRecords.push(secondLastHullRecord)
            // do not do anything with current point
            // correct turn not found
          }
        }
      }
    }

    // At this point, hullPointRecords contains the output points in clockwise order
    // the points start with lowest-y,highest-x startPoint, and end at the same point

    // Step 3b: remove duplicated startPointRecord from the end of the array
    if (hullRecords.length > 2) {
      hullRecords.pop()
    }

    // Step 4: find the lowest originalIndex record and put it at the beginning of hull
    let lowestHullIndex // the lowest originalIndex on the hull
    let indexOfLowestHullIndexRecord = -1 // the index of the record with lowestHullIndex
    for (let i = 0, n = hullRecords.length; i < n; i += 1) {
      const currentHullIndex = hullRecords[i][1]

      if (lowestHullIndex === undefined || currentHullIndex < lowestHullIndex) {
        lowestHullIndex = currentHullIndex
        indexOfLowestHullIndexRecord = i
      }
    }

    let hullPointRecordsReordered = []
    if (indexOfLowestHullIndexRecord > 0) {
      const newFirstChunk = hullRecords.slice(indexOfLowestHullIndexRecord)
      const newSecondChunk = hullRecords.slice(0, indexOfLowestHullIndexRecord)
      hullPointRecordsReordered = newFirstChunk.concat(newSecondChunk)
    } else {
      hullPointRecordsReordered = hullRecords
    }

    const hullPoints = []
    for (let i = 0, n = hullPointRecordsReordered.length; i < n; i += 1) {
      hullPoints.push(hullPointRecordsReordered[i][0])
    }

    return new Polyline(hullPoints)
  }

  equals(p: Polyline) {
    if (p == null) {
      return false
    }

    if (p.points.length !== this.points.length) {
      return false
    }

    return p.points.every((a, i) => a.equals(this.points[i]))
  }

  clone() {
    return new Polyline(this.points.map((p) => p.clone()))
  }

  toJSON() {
    return this.points.map((p) => p.toJSON())
  }

  serialize() {
    return this.points.map((p) => `${p.x}, ${p.y}`).join(' ')
  }
}

export namespace Polyline {
  export const toStringTag = `X6.Geometry.${Polyline.name}`

  export function isPolyline(instance: any): instance is Polyline {
    if (instance == null) {
      return false
    }

    if (instance instanceof Polyline) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const polyline = instance as Polyline

    if (
      (tag == null || tag === toStringTag) &&
      typeof polyline.toHull === 'function' &&
      typeof polyline.simplify === 'function'
    ) {
      return true
    }

    return false
  }
}

export namespace Polyline {
  export function parse(svgString: string) {
    const str = svgString.trim()
    if (str === '') {
      return new Polyline()
    }

    const points = []

    const coords = str.split(/\s*,\s*|\s+/)
    for (let i = 0, ii = coords.length; i < ii; i += 2) {
      points.push({ x: +coords[i], y: +coords[i + 1] })
    }

    return new Polyline(points)
  }
}

namespace Types {
  export type HullRecord = [Point, number, number]
}
