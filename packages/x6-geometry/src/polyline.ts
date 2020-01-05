import { Point } from './point'
import { Rectangle } from './rectangle'
import { Line } from './line'

export class Polyline {
  points: Point[]

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

  constructor(points?: (Point | Point.PointLike | Point.PointData)[]) {
    if (points != null) {
      this.points = points.map(p => Point.normalize(p))
    } else {
      this.points = []
    }
  }

  scale(
    sx: number,
    sy: number,
    origin: Point | Point.PointLike | Point.PointData = new Point(),
  ) {
    this.points.forEach(p => p.scale(sx, sy, origin))
    return this
  }

  translate(dx: number, dy: number): this
  translate(p: Point | Point.PointLike | Point.PointData): this
  translate(
    dx: number | Point | Point.PointLike | Point.PointData,
    dy?: number,
  ): this {
    this.points.forEach(p => p.translate(dx, dy))
    return this
  }

  bbox() {
    if (this.points.length === 0) {
      return null
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

  closestPoint(p: Point | Point.PointLike | Point.PointData) {
    const cpLength = this.closestPointLength(p)
    return this.pointAtLength(cpLength)
  }

  closestPointLength(p: Point | Point.PointLike | Point.PointData) {
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

  closestPointNormalizedLength(p: Point | Point.PointLike | Point.PointData) {
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

  closestPointTangent(p: Point | Point.PointLike | Point.PointData) {
    const cpLength = this.closestPointLength(p)
    return this.tangentAtLength(cpLength)
  }

  containsPoint(p: Point | Point.PointLike | Point.PointData) {
    if (this.points.length === 0) {
      return false
    }

    const ref = Point.normalize(p)
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

          if (segment.intersectionWithLine(ray)) {
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

  // convexHull() {
  //   let i
  //   let n

  //   const points = this.points
  //   const count = points.length
  //   if (count === 0) {
  //     return new Polyline()
  //   }

  //   // step 1: find the starting point - point with the lowest y (if equality, highest x)
  //   let startPoint: Point | null = null
  //   for (i = 0; i < count; i += 1) {
  //     if (startPoint == null) {
  //       // if this is the first point we see, set it as start point
  //       startPoint = points[i]
  //     } else if (points[i].y < startPoint.y) {
  //       // start point should have lowest y from all points
  //       startPoint = points[i]
  //     } else if (points[i].y === startPoint.y && points[i].x > startPoint.x) {
  //       // if two points have the lowest y, choose the one that has highest x
  //       // there are no points to the right of startPoint - no ambiguity about theta 0
  //       // if there are several coincident start point candidates, first one is reported
  //       startPoint = points[i]
  //     }
  //   }

  //   // step 2: sort the list of points
  //   // sorting by angle between line from startPoint to point and the x-axis (theta)

  //   // step 2a: create the point records = [point, originalIndex, angle]
  //   const sortedPointRecords = []
  //   for (i = 0; i < count; i += 1) {
  //     let angle = startPoint!.theta(points[i])
  //     if (angle === 0) {
  //       angle = 360 // give highest angle to start point
  //       // the start point will end up at end of sorted list
  //       // the start point will end up at beginning of hull points list
  //     }

  //     const entry = [points[i], i, angle]
  //     sortedPointRecords.push(entry)
  //   }

  //   // step 2b: sort the list in place
  //   sortedPointRecords.sort((record1, record2) => {
  //     // returning a negative number here sorts record1 before record2
  //     // if first angle is smaller than second, first angle should come before second

  //     let sortOutput = record1[2] - record2[2] // negative if first angle smaller
  //     if (sortOutput === 0) {
  //       // if the two angles are equal, sort by originalIndex
  //       sortOutput = record2[1] - record1[1] // negative if first index larger
  //       // coincident points will be sorted in reverse-numerical order
  //       // so the coincident points with lower original index will be considered first
  //     }

  //     return sortOutput
  //   })

  //   // step 2c: duplicate start record from the top of the stack to the bottom of the stack
  //   if (sortedPointRecords.length > 2) {
  //     const startPointRecord = sortedPointRecords[sortedPointRecords.length - 1]
  //     sortedPointRecords.unshift(startPointRecord)
  //   }

  //   // step 3a: go through sorted points in order and find those with right turns
  //   // we want to get our results in clockwise order
  //   const insidePoints = {} // dictionary of points with left turns - cannot be on the hull
  //   const hullPointRecords = [] // stack of records with right turns - hull point candidates

  //   let currentPointRecord
  //   let currentPoint
  //   let lastHullPointRecord
  //   let lastHullPoint
  //   let secondLastHullPointRecord
  //   let secondLastHullPoint
  //   while (sortedPointRecords.length !== 0) {
  //     currentPointRecord = sortedPointRecords.pop()
  //     currentPoint = currentPointRecord[0]

  //     // check if point has already been discarded
  //     // keys for insidePoints are stored in the form 'point.x@point.y@@originalIndex'
  //     if (
  //       insidePoints.hasOwnProperty(
  //         currentPointRecord[0] + '@@' + currentPointRecord[1],
  //       )
  //     ) {
  //       // this point had an incorrect turn at some previous iteration of this loop
  //       // this disqualifies it from possibly being on the hull
  //       continue
  //     }

  //     let correctTurnFound = false
  //     while (!correctTurnFound) {
  //       if (hullPointRecords.length < 2) {
  //         // not enough points for comparison, just add current point
  //         hullPointRecords.push(currentPointRecord)
  //         correctTurnFound = true
  //       } else {
  //         lastHullPointRecord = hullPointRecords.pop()
  //         lastHullPoint = lastHullPointRecord[0]
  //         secondLastHullPointRecord = hullPointRecords.pop()
  //         secondLastHullPoint = secondLastHullPointRecord[0]

  //         const crossProduct = secondLastHullPoint.cross(
  //           lastHullPoint,
  //           currentPoint,
  //         )

  //         if (crossProduct < 0) {
  //           // found a right turn
  //           hullPointRecords.push(secondLastHullPointRecord)
  //           hullPointRecords.push(lastHullPointRecord)
  //           hullPointRecords.push(currentPointRecord)
  //           correctTurnFound = true
  //         } else if (crossProduct === 0) {
  //           // the three points are collinear
  //           // three options:
  //           // there may be a 180 or 0 degree angle at lastHullPoint
  //           // or two of the three points are coincident
  //           const THRESHOLD = 1e-10 // we have to take rounding errors into account
  //           const angleBetween = lastHullPoint.angleBetween(
  //             secondLastHullPoint,
  //             currentPoint,
  //           )
  //           if (abs(angleBetween - 180) < THRESHOLD) {
  //             // rouding around 180 to 180
  //             // if the cross product is 0 because the angle is 180 degrees
  //             // discard last hull point (add to insidePoints)
  //             // insidePoints.unshift(lastHullPoint);
  //             insidePoints[
  //               lastHullPointRecord[0] + '@@' + lastHullPointRecord[1]
  //             ] = lastHullPoint
  //             // reenter second-to-last hull point (will be last at next iter)
  //             hullPointRecords.push(secondLastHullPointRecord)
  //             // do not do anything with current point
  //             // correct turn not found
  //           } else if (
  //             lastHullPoint.equals(currentPoint) ||
  //             secondLastHullPoint.equals(lastHullPoint)
  //           ) {
  //             // if the cross product is 0 because two points are the same
  //             // discard last hull point (add to insidePoints)
  //             // insidePoints.unshift(lastHullPoint);
  //             insidePoints[
  //               lastHullPointRecord[0] + '@@' + lastHullPointRecord[1]
  //             ] = lastHullPoint
  //             // reenter second-to-last hull point (will be last at next iter)
  //             hullPointRecords.push(secondLastHullPointRecord)
  //             // do not do anything with current point
  //             // correct turn not found
  //           } else if (abs(((angleBetween + 1) % 360) - 1) < THRESHOLD) {
  //             // rounding around 0 and 360 to 0
  //             // if the cross product is 0 because the angle is 0 degrees
  //             // remove last hull point from hull BUT do not discard it
  //             // reenter second-to-last hull point (will be last at next iter)
  //             hullPointRecords.push(secondLastHullPointRecord)
  //             // put last hull point back into the sorted point records list
  //             sortedPointRecords.push(lastHullPointRecord)
  //             // we are switching the order of the 0deg and 180deg points
  //             // correct turn not found
  //           }
  //         } else {
  //           // found a left turn
  //           // discard last hull point (add to insidePoints)
  //           // insidePoints.unshift(lastHullPoint);
  //           insidePoints[
  //             lastHullPointRecord[0] + '@@' + lastHullPointRecord[1]
  //           ] = lastHullPoint
  //           // reenter second-to-last hull point (will be last at next iter of loop)
  //           hullPointRecords.push(secondLastHullPointRecord)
  //           // do not do anything with current point
  //           // correct turn not found
  //         }
  //       }
  //     }
  //   }
  //   // at this point, hullPointRecords contains the output points in clockwise order
  //   // the points start with lowest-y,highest-x startPoint, and end at the same point

  //   // step 3b: remove duplicated startPointRecord from the end of the array
  //   if (hullPointRecords.length > 2) {
  //     hullPointRecords.pop()
  //   }

  //   // step 4: find the lowest originalIndex record and put it at the beginning of hull
  //   let lowestHullIndex // the lowest originalIndex on the hull
  //   let indexOfLowestHullIndexRecord = -1 // the index of the record with lowestHullIndex
  //   n = hullPointRecords.length
  //   for (i = 0; i < n; i += 1) {
  //     const currentHullIndex = hullPointRecords[i][1]

  //     if (lowestHullIndex === undefined || currentHullIndex < lowestHullIndex) {
  //       lowestHullIndex = currentHullIndex
  //       indexOfLowestHullIndexRecord = i
  //     }
  //   }

  //   let hullPointRecordsReordered = []
  //   if (indexOfLowestHullIndexRecord > 0) {
  //     const newFirstChunk = hullPointRecords.slice(indexOfLowestHullIndexRecord)
  //     const newSecondChunk = hullPointRecords.slice(
  //       0,
  //       indexOfLowestHullIndexRecord,
  //     )
  //     hullPointRecordsReordered = newFirstChunk.concat(newSecondChunk)
  //   } else {
  //     hullPointRecordsReordered = hullPointRecords
  //   }

  //   const hullPoints = []
  //   n = hullPointRecordsReordered.length
  //   for (i = 0; i < n; i += 1) {
  //     hullPoints.push(hullPointRecordsReordered[i][0])
  //   }

  //   return new Polyline(hullPoints)
  // }

  intersectionWithLine(line: Line) {
    const intersections = []
    for (let i = 0, n = this.points.length - 1; i < n; i += 1) {
      const a = this.points[i]
      const b = this.points[i + 1]
      const int = line.intersectionWithLine(new Line(a, b))
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
      length = -length // tslint:disable-line
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
      ratio = 0 // tslint:disable-line
    }

    if (ratio > 1) {
      ratio = 1 // tslint:disable-line
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
      length = -length // tslint:disable-line
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

  serialize() {
    return this.points.map(p => `${p.x}, ${p.y}`).join(' ')
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
    return new Polyline(this.points.map(p => p.clone()))
  }

  toString() {}
}

export namespace Polyline {}

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
