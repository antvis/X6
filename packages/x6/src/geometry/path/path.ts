import { Line } from '../line'
import { Curve } from '../curve'
import { Polyline } from '../polyline'
import { Rectangle } from '../rectangle'
import { LineTo } from './lineto'
import { MoveTo } from './moveto'
import { CurveTo } from './curveto'
import { Close } from './close'
import { Segment } from './segment'
import { Point } from '../point'
import { clamp } from '../util'

export class Path {
  PRECISION: 3
  segments: Segment[]

  constructor()
  constructor(line: Line)
  constructor(curve: Curve)
  constructor(polyline: Polyline)
  constructor(segment: Segment)
  constructor(segments: Segment[])
  constructor(lines: Line[])
  constructor(curves: Curve[])
  constructor(
    arg?: Line | Curve | Polyline | Segment | Segment[] | Line[] | Curve[],
  ) {
    this.segments = []
    if (Array.isArray(arg)) {
      if (arg[0] instanceof Line || arg[0] instanceof Curve) {
        let previousObj: Line | Curve | null = null
        const arr = arg as Line[] | Curve[]
        arr.forEach((o: Line | Curve, i: number) => {
          if (i === 0) {
            this.appendSegment(Path.createSegment('M', o.start))
          }
          if (previousObj != null && !previousObj.end.equals(o.start)) {
            this.appendSegment(Path.createSegment('M', o.start))
          }

          if (o instanceof Line) {
            this.appendSegment(Path.createSegment('L', o.end))
          } else if (o instanceof Curve) {
            this.appendSegment(
              Path.createSegment('C', o.controlPoint1, o.controlPoint2, o.end),
            )
          }

          previousObj = o
        })
      } else {
        const arr = arg as Segment[]
        arr.forEach(s => {
          if (s.isSegment) {
            this.appendSegment(s)
          }
        })
      }
    } else if (arg != null) {
      if (arg instanceof Line) {
        this.appendSegment(Path.createSegment('M', arg.start))
        this.appendSegment(Path.createSegment('L', arg.end))
      } else if (arg instanceof Curve) {
        this.appendSegment(Path.createSegment('M', arg.start))
        this.appendSegment(
          Path.createSegment(
            'C',
            arg.controlPoint1,
            arg.controlPoint2,
            arg.end,
          ),
        )
      } else if (arg instanceof Polyline) {
        if (arg.points && arg.points.length) {
          arg.points.forEach((point, index) => {
            const segment =
              index === 0
                ? Path.createSegment('M', point)
                : Path.createSegment('L', point)
            this.appendSegment(segment)
          })
        }
      } else if (arg.isSegment) {
        this.appendSegment(arg)
      }
    }
  }

  get start() {
    const segments = this.segments
    const count = segments.length
    if (count === 0) {
      return null
    }

    for (let i = 0; i < count; i += 1) {
      const segment = segments[i]
      if (segment.isVisible) {
        return segment.start
      }
    }

    // if no visible segment, return last segment end point
    return segments[count - 1].end
  }

  get end() {
    const segments = this.segments
    const count = segments.length
    if (count === 0) {
      return null
    }

    for (let i = count - 1; i >= 0; i -= 1) {
      const segment = segments[i]
      if (segment.isVisible) {
        return segment.end
      }
    }

    // if no visible segment, return last segment end point
    return segments[count - 1].end
  }

  bbox() {
    const segments = this.segments
    const count = segments.length
    if (count === 0) {
      return null
    }

    let bbox
    for (let i = 0; i < count; i += 1) {
      const segment = segments[i]
      if (segment.isVisible) {
        const segmentBBox = segment.bbox()
        if (segmentBBox != null) {
          bbox = bbox ? bbox.union(segmentBBox) : segmentBBox
        }
      }
    }

    if (bbox != null) {
      return bbox
    }

    // if the path has only invisible elements, return end point of last segment
    const lastSegment = segments[count - 1]
    return new Rectangle(lastSegment.end.x, lastSegment.end.y, 0, 0)
  }

  appendSegment(seg: Segment | Segment[]) {
    const count = this.segments.length
    let previousSegment = count !== 0 ? this.segments[count - 1] : null
    let currentSegment
    const nextSegment = null

    if (Array.isArray(seg)) {
      for (let i = 0, ii = seg.length; i < ii; i += 1) {
        const segment = seg[i]
        currentSegment = this.prepareSegment(
          segment,
          previousSegment,
          nextSegment,
        )
        this.segments.push(currentSegment)
        previousSegment = currentSegment
      }
    } else {
      if (seg != null && seg.isSegment) {
        currentSegment = this.prepareSegment(seg, previousSegment, nextSegment)
        this.segments.push(currentSegment)
      }
    }
  }

  insertSegment(index: number, seg: Segment | Segment[]) {
    const count = this.segments.length
    if (index < 0) {
      index = count + index + 1 // tslint:disable-line
    }

    if (index > count || index < 0) {
      throw new Error('Index out of range.')
    }

    let currentSegment
    let previousSegment = null
    let nextSegment = null

    if (count !== 0) {
      if (index >= 1) {
        previousSegment = this.segments[index - 1]
        nextSegment = previousSegment.nextSegment
      } else {
        previousSegment = null
        nextSegment = this.segments[0]
      }
    }

    if (!Array.isArray(seg)) {
      currentSegment = this.prepareSegment(seg, previousSegment, nextSegment)
      this.segments.splice(index, 0, currentSegment)
    } else {
      for (let i = 0, ii = seg.length; i < ii; i += 1) {
        const segment = seg[i]
        currentSegment = this.prepareSegment(
          segment,
          previousSegment,
          nextSegment,
        )
        this.segments.splice(index + i, 0, currentSegment)
        previousSegment = currentSegment
      }
    }
  }

  removeSegment(index: number) {
    const idx = this.fixIndex(index)
    const removedSegment = this.segments.splice(idx, 1)[0]
    const previousSegment = removedSegment.previousSegment
    const nextSegment = removedSegment.nextSegment

    // link the previous and next segments together (if present)
    if (previousSegment) {
      previousSegment.nextSegment = nextSegment
    }

    if (nextSegment) {
      nextSegment.previousSegment = previousSegment
    }

    if (removedSegment.isSubpathStart && nextSegment) {
      this.updateSubpathStartSegment(nextSegment)
    }
  }

  replaceSegment(index: number, seg: Segment | Segment[]) {
    const idx = this.fixIndex(index)

    let currentSegment
    const replacedSegment = this.segments[idx]
    let previousSegment = replacedSegment.previousSegment
    const nextSegment = replacedSegment.nextSegment

    let updateSubpathStart = replacedSegment.isSubpathStart

    if (!Array.isArray(seg)) {
      currentSegment = this.prepareSegment(seg, previousSegment, nextSegment)
      this.segments.splice(idx, 1, currentSegment)
      if (updateSubpathStart && currentSegment.isSubpathStart) {
        // already updated by `prepareSegment`
        updateSubpathStart = false
      }
    } else {
      this.segments.splice(index, 1)

      for (let i = 0, ii = seg.length; i < ii; i += 1) {
        const segment = seg[i]
        currentSegment = this.prepareSegment(
          segment,
          previousSegment,
          nextSegment,
        )
        this.segments.splice(index + i, 0, currentSegment)
        previousSegment = currentSegment

        if (updateSubpathStart && currentSegment.isSubpathStart) {
          updateSubpathStart = false
        }
      }
    }

    if (updateSubpathStart && nextSegment) {
      this.updateSubpathStartSegment(nextSegment)
    }
  }

  getSegment(index: number) {
    const idx = this.fixIndex(index)
    return this.segments[idx]
  }

  protected fixIndex(index: number) {
    const length = this.segments.length

    if (length === 0) {
      throw new Error('Path has no segments.')
    }

    let i = index
    while (i < 0) {
      i = length + i
    }

    if (i >= length || i < 0) {
      throw new Error('Index out of range.')
    }

    return i
  }

  segmentAt(ratio: number, options: Path.Options = {}) {
    const index = this.segmentIndexAt(ratio, options)
    if (!index) {
      return null
    }

    return this.getSegment(index)
  }

  segmentAtLength(length: number, options: Path.Options = {}) {
    const index = this.segmentIndexAtLength(length, options)
    if (!index) return null

    return this.getSegment(index)
  }

  segmentIndexAt(ratio: number, options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return null
    }

    const rate = clamp(ratio, 0, 1)
    const opt = this.getOptions(options)
    const len = this.length(opt)
    const length = len * rate
    return this.segmentIndexAtLength(length, opt)
  }

  segmentIndexAtLength(length: number, options: Path.Options = {}) {
    const count = this.segments.length
    if (count === 0) {
      return null
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // tslint:disable-line
    }

    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)

    let memo = 0
    let lastVisibleIndex = null

    for (let i = 0; i < count; i += 1) {
      const index = fromStart ? i : count - 1 - i

      const segment = this.segments[index]
      const subdivisions = segmentSubdivisions[index]
      const len = segment.length({ precision, subdivisions })

      if (segment.isVisible) {
        if (length <= memo + len) {
          return index
        }
        lastVisibleIndex = index
      }

      memo += len
    }

    // If length requested is higher than the length of the path, return
    // last visible segment index. If no visible segment, return null.
    return lastVisibleIndex
  }

  protected getSegmentSubdivisions(options: Path.Options = {}): Segment[][] {
    const precision = this.getPrecision(options)
    const segmentSubdivisions = []
    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const segment = this.segments[i]
      const subdivisions = segment.getSubdivisions({ precision })
      segmentSubdivisions.push(subdivisions)
    }

    return segmentSubdivisions
  }

  protected updateSubpathStartSegment(segment: Segment) {
    let previous = segment.previousSegment
    let current: Segment | null = segment

    while (current && !current.isSubpathStart) {
      // assign previous segment's subpath start segment to this segment
      if (previous != null) {
        current.subpathStartSegment = previous.subpathStartSegment
      } else {
        current.subpathStartSegment = null
      }

      previous = current
      current = current.nextSegment
    }
  }

  protected prepareSegment(
    segment: Segment,
    previousSegment: Segment | null,
    nextSegment: Segment | null,
  ) {
    segment.previousSegment = previousSegment
    segment.nextSegment = nextSegment

    if (previousSegment != null) {
      previousSegment.nextSegment = segment
    }

    if (nextSegment != null) {
      nextSegment.previousSegment = segment
    }

    let updateSubpathStart: Segment | null = segment
    if (segment.isSubpathStart) {
      // move to
      segment.subpathStartSegment = segment
      updateSubpathStart = nextSegment
    }

    // assign previous segment's subpath start (or self if it is a subpath start) to subsequent segments
    if (updateSubpathStart != null) {
      this.updateSubpathStartSegment(updateSubpathStart)
    }

    return segment
  }

  closestPoint(
    p: Point | Point.PointLike | Point.PointData,
    options: Path.Options = {},
  ) {
    const t = this.closestPointT(p, options)
    if (!t) {
      return null
    }

    return this.pointAtT(t)
  }

  closestPointLength(
    p: Point | Point.PointLike | Point.PointData,
    options: Path.Options = {},
  ) {
    const opts = this.getOptions(options)
    const t = this.closestPointT(p, opts)
    if (!t) {
      return 0
    }

    return this.lengthAtT(t, opts)
  }

  closestPointNormalizedLength(
    p: Point | Point.PointLike | Point.PointData,
    options: Path.Options = {},
  ) {
    const opts = this.getOptions(options)
    const cpLength = this.closestPointLength(p, opts)
    if (cpLength === 0) {
      return 0
    }

    const length = this.length(opts)
    if (length === 0) {
      return 0
    }

    return cpLength / length
  }

  closestPointT(
    p: Point | Point.PointLike | Point.PointData,
    options: Path.Options = {},
  ) {
    if (this.segments.length === 0) {
      return null
    }

    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)

    let closestPointT
    let minSquaredDistance = Infinity
    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const segment = this.segments[i]
      const subdivisions = segmentSubdivisions[i]

      if (segment.isVisible) {
        const segmentClosestPointT = segment.closestPointT(p, {
          precision,
          subdivisions,
        })
        const segmentClosestPoint = segment.pointAtT(segmentClosestPointT)
        const squaredDistance = new Line(segmentClosestPoint, p).squaredLength()

        if (squaredDistance < minSquaredDistance) {
          closestPointT = { segmentIndex: i, value: segmentClosestPointT }
          minSquaredDistance = squaredDistance
        }
      }
    }

    if (closestPointT) {
      return closestPointT
    }

    return { segmentIndex: this.segments.length - 1, value: 1 }
  }

  closestPointTangent(
    p: Point | Point.PointLike | Point.PointData,
    options: Path.Options = {},
  ) {
    if (this.segments.length === 0) {
      return null
    }

    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)

    let closestPointTangent
    let minSquaredDistance = Infinity
    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const segment = this.segments[i]
      const subdivisions = segmentSubdivisions[i]

      if (segment.isDifferentiable()) {
        const segmentClosestPointT = segment.closestPointT(p, {
          precision,
          subdivisions,
        })
        const segmentClosestPoint = segment.pointAtT(segmentClosestPointT)
        const squaredDistance = new Line(segmentClosestPoint, p).squaredLength()

        if (squaredDistance < minSquaredDistance) {
          closestPointTangent = segment.tangentAtT(segmentClosestPointT)
          minSquaredDistance = squaredDistance
        }
      }
    }

    if (closestPointTangent) {
      return closestPointTangent
    }

    return null
  }

  containsPoint(
    p: Point | Point.PointLike | Point.PointData,
    options: Path.Options = {},
  ) {
    const polylines = this.toPolylines(options)
    if (!polylines) {
      return false
    }

    let numIntersections = 0
    for (let i = 0, ii = polylines.length; i < ii; i += 1) {
      const polyline = polylines[i]
      if (polyline.containsPoint(p)) {
        numIntersections += 1
      }
    }

    // returns `true` for odd numbers of intersections (even-odd algorithm)
    return numIntersections % 2 === 1
  }

  pointAt(ratio: number, options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return null
    }

    if (ratio <= 0) {
      return this.start!.clone()
    }

    if (ratio >= 1) {
      return this.end!.clone()
    }

    const opts = this.getOptions(options)
    const pathLength = this.length(opts)
    const length = pathLength * ratio

    return this.pointAtLength(length, opts)
  }

  pointAtLength(length: number, options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return null
    }

    if (length === 0) {
      return this.start!.clone()
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // tslint:disable-line
    }

    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)

    let lastVisibleSegment
    let memo = 0

    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const index = fromStart ? i : ii - 1 - i

      const segment = this.segments[index]
      const subdivisions = segmentSubdivisions[index]
      const d = segment.length({
        precision,
        subdivisions,
      })

      if (segment.isVisible) {
        if (length <= memo + d) {
          return segment.pointAtLength((fromStart ? 1 : -1) * (length - memo), {
            precision,
            subdivisions,
          })
        }

        lastVisibleSegment = segment
      }

      memo += d
    }

    // if length requested is higher than the length of the path,
    // return last visible segment endpoint
    if (lastVisibleSegment) {
      return fromStart ? lastVisibleSegment.end : lastVisibleSegment.start
    }

    // if no visible segment, return last segment end point
    const lastSegment = this.segments[this.segments.length - 1]
    return lastSegment.end.clone()
  }

  pointAtT(t: { segmentIndex: number; value: number }) {
    const segments = this.segments
    const numSegments = segments.length
    if (numSegments === 0) return null // if segments is an empty array

    const segmentIndex = t.segmentIndex
    if (segmentIndex < 0) return segments[0].pointAtT(0)
    if (segmentIndex >= numSegments) {
      return segments[numSegments - 1].pointAtT(1)
    }

    const tValue = clamp(t.value, 0, 1)
    return segments[segmentIndex].pointAtT(tValue)
  }

  divideAt(ratio: number, options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return null
    }

    const rate = clamp(ratio, 0, 1)
    const opts = this.getOptions(options)
    const len = this.length(opts)
    const length = len * rate
    return this.divideAtLength(length, opts)
  }

  divideAtLength(length: number, options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return null
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // tslint:disable-line
    }

    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)

    let memo = 0
    let divided
    let dividedSegmentIndex
    let lastValidSegment
    let lastValidSegmentIndex
    let t

    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const index = fromStart ? i : ii - 1 - i
      const segment = this.getSegment(index)
      const subdivisions = segmentSubdivisions[index]
      const opts = { precision, subdivisions }
      const len = segment.length(opts)

      if (segment.isDifferentiable()) {
        lastValidSegment = segment
        lastValidSegmentIndex = index

        if (length <= memo + len) {
          dividedSegmentIndex = index
          divided = segment.divideAtLength(
            (fromStart ? 1 : -1) * (length - memo),
            opts,
          )
          break
        }
      }

      memo += len
    }

    if (!lastValidSegment) {
      return null
    }

    if (!divided) {
      dividedSegmentIndex = lastValidSegmentIndex
      t = fromStart ? 1 : 0
      divided = lastValidSegment.divideAtT(t)
    }

    // create a copy of this path and replace the identified segment with its two divided parts:

    const pathCopy = this.clone()
    const index = dividedSegmentIndex as number
    pathCopy.replaceSegment(index, divided)

    const divisionStartIndex = index
    let divisionMidIndex = index + 1
    let divisionEndIndex = index + 2

    // do not insert the part if it looks like a point
    if (!divided[0].isDifferentiable()) {
      pathCopy.removeSegment(divisionStartIndex)
      divisionMidIndex -= 1
      divisionEndIndex -= 1
    }

    // insert a Moveto segment to ensure secondPath will be valid:
    const movetoEnd = pathCopy.getSegment(divisionMidIndex).start
    pathCopy.insertSegment(divisionMidIndex, Path.createSegment('M', movetoEnd))
    divisionEndIndex += 1

    // do not insert the part if it looks like a point
    if (!divided[1].isDifferentiable()) {
      pathCopy.removeSegment(divisionEndIndex - 1)
      divisionEndIndex -= 1
    }

    // ensure that Closepath segments in secondPath will be assigned correct subpathStartSegment:

    const secondPathSegmentIndexConversion =
      divisionEndIndex - divisionStartIndex - 1

    for (
      let i = divisionEndIndex, ii = pathCopy.segments.length;
      i < ii;
      i += 1
    ) {
      const originalSegment = this.getSegment(
        i - secondPathSegmentIndexConversion,
      )
      const segment = pathCopy.getSegment(i)

      if (
        segment.type === 'Z' &&
        !originalSegment.subpathStartSegment!.end.equals(
          segment.subpathStartSegment!.end,
        )
      ) {
        // pathCopy segment's subpathStartSegment is different from original segment's one
        // convert this Closepath segment to a Lineto and replace it in pathCopy
        const convertedSegment = Path.createSegment('L', originalSegment.end)
        pathCopy.replaceSegment(i, convertedSegment)
      }
    }

    // distribute pathCopy segments into two paths and return those:
    const firstPath = new Path(pathCopy.segments.slice(0, divisionMidIndex))
    const secondPath = new Path(pathCopy.segments.slice(divisionMidIndex))

    return [firstPath, secondPath]
  }

  intersectionWithLine(line: Line, options: Path.Options = {}) {
    const polylines = this.toPolylines(options)
    if (polylines == null) {
      return null
    }

    let intersection: Point[] | null = null
    for (let i = 0, ii = polylines.length; i < ii; i += 1) {
      const polyline = polylines[i]
      const polylineIntersection = line.intersect(polyline)
      if (polylineIntersection) {
        if (intersection == null) {
          intersection = []
        }
        if (Array.isArray(polylineIntersection)) {
          intersection.push(...polylineIntersection)
        } else {
          intersection.push(polylineIntersection)
        }
      }
    }

    return intersection
  }

  isDifferentiable() {
    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const segment = this.segments[i]
      if (segment.isDifferentiable()) {
        return true
      }
    }

    return false
  }

  isValid() {
    const segments = this.segments
    const isValid = segments.length === 0 || segments[0].type === 'M'
    return isValid
  }

  length(options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return 0
    }

    const segmentSubdivisions = this.getSubdivisions(options)

    let length = 0
    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const segment = this.segments[i]
      const subdivisions = segmentSubdivisions[i]
      length += segment.length({ subdivisions })
    }

    return length
  }

  lengthAtT(
    t: { segmentIndex: number; value: number },
    options: Path.Options = {},
  ) {
    const count = this.segments.length
    if (count === 0) {
      return 0
    }

    let segmentIndex = t.segmentIndex
    if (segmentIndex < 0) {
      return 0
    }

    let tValue = clamp(t.value, 0, 1)
    if (segmentIndex >= count) {
      segmentIndex = count - 1
      tValue = 1
    }

    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)

    let length = 0
    for (let i = 0; i < segmentIndex; i += 1) {
      const segment = this.segments[i]
      const subdivisions = segmentSubdivisions[i]
      length += segment.length({ precision, subdivisions })
    }

    const segment = this.segments[segmentIndex]
    const subdivisions = segmentSubdivisions[segmentIndex]
    length += segment.lengthAtT(tValue, { precision, subdivisions })

    return length
  }

  tangentAt(ratio: number, options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return null
    }

    const rate = clamp(ratio, 0, 1)
    const opts = this.getOptions(options)
    const len = this.length(opts)
    const length = len * rate
    return this.tangentAtLength(length, opts)
  }

  tangentAtLength(length: number, options: Path.Options = {}) {
    if (this.segments.length === 0) {
      return null
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // tslint:disable-line
    }

    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)

    let lastValidSegment
    let memo = 0
    for (let i = 0, ii = this.segments.length; i < ii; i += 1) {
      const index = fromStart ? i : ii - 1 - i
      const segment = this.segments[index]
      const subdivisions = segmentSubdivisions[index]
      const len = segment.length({ precision, subdivisions })

      if (segment.isDifferentiable()) {
        if (length <= memo + len) {
          return segment.tangentAtLength(
            (fromStart ? 1 : -1) * (length - memo),
            {
              precision,
              subdivisions,
            },
          )
        }

        lastValidSegment = segment
      }

      memo += len
    }

    // if length requested is higher than the length of the path, return tangent of endpoint of last valid segment
    if (lastValidSegment) {
      const t = fromStart ? 1 : 0
      return lastValidSegment.tangentAtT(t)
    }

    // if no valid segment, return null
    return null
  }

  tangentAtT(t: { segmentIndex: number; value: number }) {
    const count = this.segments.length
    if (count === 0) {
      return null
    }

    const segmentIndex = t.segmentIndex
    if (segmentIndex < 0) {
      return this.segments[0].tangentAtT(0)
    }

    if (segmentIndex >= count) {
      return this.segments[count - 1].tangentAtT(1)
    }

    const tValue = clamp(t.value, 0, 1)
    return this.segments[segmentIndex].tangentAtT(tValue)
  }

  protected getPrecision(options: Path.Options = {}) {
    return options.precision == null ? this.PRECISION : options.precision
  }

  protected getSubdivisions(options: Path.Options = {}) {
    if (options.segmentSubdivisions == null) {
      const precision = this.getPrecision(options)
      return this.getSegmentSubdivisions({ precision })
    }
    return options.segmentSubdivisions
  }

  protected getOptions(options: Path.Options = {}) {
    const precision = this.getPrecision(options)
    const segmentSubdivisions = this.getSubdivisions(options)
    return { precision, segmentSubdivisions }
  }

  toPoints(options: Path.Options = {}) {
    const segments = this.segments
    const count = segments.length
    if (count === 0) {
      return null
    }

    const segmentSubdivisions = this.getSubdivisions(options)
    const points = []
    let partialPoints = []

    for (let i = 0; i < count; i += 1) {
      const segment = segments[i]
      if (segment.isVisible) {
        const divisions = segmentSubdivisions[i]
        if (divisions.length > 0) {
          divisions.forEach(c => partialPoints.push(c.start))
        } else {
          partialPoints.push(segment.start)
        }
      } else if (partialPoints.length > 0) {
        partialPoints.push(segments[i - 1].end)
        points.push(partialPoints)
        partialPoints = []
      }
    }

    if (partialPoints.length > 0) {
      partialPoints.push(this.end!)
      points.push(partialPoints)
    }

    return points
  }

  toPolylines(options: Path.Options = {}) {
    const points = this.toPoints(options)
    if (!points) {
      return null
    }

    return points.map(arr => new Polyline(arr))
  }

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike | Point.PointData,
  ) {
    this.segments.forEach(s => s.scale(sx, sy, origin))
    return this
  }

  translate(tx: number, ty: number) {
    this.segments.forEach(s => s.translate(tx, ty))
    return this
  }

  serialize() {
    if (!this.isValid()) {
      throw new Error('Invalid path segments.')
    }

    return this.toString()
  }

  clone() {
    const path = new Path()
    this.segments.forEach(s => path.appendSegment(s.clone()))
    return path
  }

  equals(p: Path) {
    if (p == null) {
      return false
    }

    const segments = this.segments
    const otherSegments = p.segments

    const count = segments.length
    if (otherSegments.length !== count) {
      return false
    }

    for (let i = 0; i < count; i += 1) {
      const a = segments[i]
      const b = otherSegments[i]
      if (a.type !== b.type || !a.equals(b)) {
        return false
      }
    }

    return true
  }

  toString() {
    return this.segments.map(s => s.serialize()).join(' ')
  }
}

export namespace Path {
  export interface Options {
    precision?: number
    segmentSubdivisions?: Segment[][]
  }
}
export namespace Path {
  export const segmentTypes = {
    L: LineTo,
    M: MoveTo,
    C: CurveTo,
    Z: Close,
    z: Close,
  }

  const regexSupportedData = new RegExp(
    `^[\\s\\d${Object.keys(segmentTypes).join('')},.]*$`,
  )

  export function isDataSupported(data: any) {
    if (typeof data !== 'string') {
      return false
    }

    return regexSupportedData.test(data)
  }

  export function parse(pathData: string) {
    if (!pathData) {
      return new Path()
    }

    const path = new Path()

    const commandRe = /(?:[a-zA-Z] *)(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)? *,? *)|(?:-?\.\d+ *,? *))+|(?:[a-zA-Z] *)(?! |\d|-|\.)/g
    const commands = pathData.match(commandRe)
    if (commands != null) {
      for (let i = 0, ii = commands.length; i < ii; i += 1) {
        const command = commands[i]
        const argRe = /(?:[a-zA-Z])|(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)?))|(?:(?:-?\.\d+))/g
        // args = [type, coordinate1, coordinate2...]
        const args = command.match(argRe)
        if (args != null) {
          const type = args[0]
          const coords = args.slice(1).map(a => +a)
          const segment = (createSegment as any)(type, ...coords)
          path.appendSegment(segment)
        }
      }
    }

    return path
  }

  type GetConstructorArgs<T> = T extends new (...args: infer U) => any
    ? U
    : never

  export function createSegment(
    type: 'L',
    ...args: GetConstructorArgs<typeof LineTo>
  ): Segment
  export function createSegment(
    type: 'M',
    ...args: GetConstructorArgs<typeof MoveTo>
  ): Segment
  export function createSegment(
    type: 'C',
    ...args: GetConstructorArgs<typeof CurveTo>
  ): Segment
  export function createSegment(type: 'Z' | 'z'): Segment

  export function createSegment(
    type: 'L' | 'M' | 'C' | 'Z' | 'z',
    ...args: any[]
  ): Segment {
    const constructor = segmentTypes[type]
    if (constructor == null) {
      throw new Error(`${type} is not a recognized path segment type.`)
    }

    args.unshift(null)

    return new (Function.prototype.bind.apply(constructor, args))()
  }
}
