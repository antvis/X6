import { Point } from './point'
import { Line } from './line'
import { Rectangle } from './rectangle'
import { Polyline } from './polyline'
import { Geometry } from './geometry'

export class Curve extends Geometry {
  start: Point
  end: Point
  controlPoint1: Point
  controlPoint2: Point

  PRECISION = 3

  protected get [Symbol.toStringTag]() {
    return Curve.toStringTag
  }

  constructor(
    start: Point.PointLike | Point.PointData,
    controlPoint1: Point.PointLike | Point.PointData,
    controlPoint2: Point.PointLike | Point.PointData,
    end: Point.PointLike | Point.PointData,
  ) {
    super()
    this.start = Point.create(start)
    this.controlPoint1 = Point.create(controlPoint1)
    this.controlPoint2 = Point.create(controlPoint2)
    this.end = Point.create(end)
  }

  bbox() {
    const start = this.start
    const controlPoint1 = this.controlPoint1
    const controlPoint2 = this.controlPoint2
    const end = this.end

    const x0 = start.x
    const y0 = start.y
    const x1 = controlPoint1.x
    const y1 = controlPoint1.y
    const x2 = controlPoint2.x
    const y2 = controlPoint2.y
    const x3 = end.x
    const y3 = end.y

    const points = [] // local extremes
    const tvalues = [] // t values of local extremes
    const bounds: [number[], number[]] = [[], []]

    let a
    let b
    let c
    let t
    let t1
    let t2
    let b2ac
    let sqrtb2ac

    for (let i = 0; i < 2; i += 1) {
      if (i === 0) {
        b = 6 * x0 - 12 * x1 + 6 * x2
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3
        c = 3 * x1 - 3 * x0
      } else {
        b = 6 * y0 - 12 * y1 + 6 * y2
        a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3
        c = 3 * y1 - 3 * y0
      }

      if (Math.abs(a) < 1e-12) {
        if (Math.abs(b) < 1e-12) {
          continue
        }

        t = -c / b
        if (t > 0 && t < 1) tvalues.push(t)

        continue
      }

      b2ac = b * b - 4 * c * a
      sqrtb2ac = Math.sqrt(b2ac)

      if (b2ac < 0) continue

      t1 = (-b + sqrtb2ac) / (2 * a)
      if (t1 > 0 && t1 < 1) tvalues.push(t1)

      t2 = (-b - sqrtb2ac) / (2 * a)
      if (t2 > 0 && t2 < 1) tvalues.push(t2)
    }

    let x
    let y
    let mt
    let j = tvalues.length
    const jlen = j

    while (j) {
      j -= 1
      t = tvalues[j]
      mt = 1 - t

      x =
        mt * mt * mt * x0 +
        3 * mt * mt * t * x1 +
        3 * mt * t * t * x2 +
        t * t * t * x3
      bounds[0][j] = x

      y =
        mt * mt * mt * y0 +
        3 * mt * mt * t * y1 +
        3 * mt * t * t * y2 +
        t * t * t * y3

      bounds[1][j] = y
      points[j] = { X: x, Y: y }
    }

    tvalues[jlen] = 0
    tvalues[jlen + 1] = 1

    points[jlen] = { X: x0, Y: y0 }
    points[jlen + 1] = { X: x3, Y: y3 }

    bounds[0][jlen] = x0
    bounds[1][jlen] = y0

    bounds[0][jlen + 1] = x3
    bounds[1][jlen + 1] = y3

    tvalues.length = jlen + 2
    bounds[0].length = jlen + 2
    bounds[1].length = jlen + 2
    points.length = jlen + 2

    const left = Math.min.apply(null, bounds[0])
    const top = Math.min.apply(null, bounds[1])
    const right = Math.max.apply(null, bounds[0])
    const bottom = Math.max.apply(null, bounds[1])

    return new Rectangle(left, top, right - left, bottom - top)
  }

  closestPoint(
    p: Point.PointLike | Point.PointData,
    options: Curve.Options = {},
  ) {
    return this.pointAtT(this.closestPointT(p, options))
  }

  closestPointLength(
    p: Point.PointLike | Point.PointData,
    options: Curve.Options = {},
  ) {
    const opts = this.getOptions(options)
    return this.lengthAtT(this.closestPointT(p, opts), opts)
  }

  closestPointNormalizedLength(
    p: Point.PointLike | Point.PointData,
    options: Curve.Options = {},
  ) {
    const opts = this.getOptions(options)
    const cpLength = this.closestPointLength(p, opts)
    if (!cpLength) {
      return 0
    }

    const length = this.length(opts)
    if (length === 0) {
      return 0
    }

    return cpLength / length
  }

  closestPointT(
    p: Point.PointLike | Point.PointData,
    options: Curve.Options = {},
  ) {
    const precision = this.getPrecision(options)
    const subdivisions = this.getDivisions(options)
    const precisionRatio = Math.pow(10, -precision) // eslint-disable-line

    let investigatedSubdivision: Curve | null = null
    let investigatedSubdivisionStartT = 0
    let investigatedSubdivisionEndT = 0
    let distFromStart = 0
    let distFromEnd = 0
    let chordLength = 0
    let minSumDist: number | null = null

    const count = subdivisions.length
    let piece = count > 0 ? 1 / count : 0

    subdivisions.forEach((division, i) => {
      const startDist = division.start.distance(p)
      const endDist = division.end.distance(p)
      const sumDist = startDist + endDist
      if (minSumDist == null || sumDist < minSumDist) {
        investigatedSubdivision = division
        investigatedSubdivisionStartT = i * piece
        investigatedSubdivisionEndT = (i + 1) * piece

        distFromStart = startDist
        distFromEnd = endDist
        minSumDist = sumDist
        chordLength = division.endpointDistance()
      }
    })

    // Recursively divide investigated subdivision, until distance between
    // baselinePoint and closest path endpoint is within `10^(-precision)`,
    // then return the closest endpoint of that final subdivision.
    // eslint-disable-next-line
    while (true) {
      // check if we have reached at least one required observed precision
      // - calculated as: the difference in distances from point to start and end divided by the distance
      // - note that this function is not monotonic = it doesn't converge stably but has "teeth"
      // - the function decreases while one of the endpoints is fixed but "jumps" whenever we switch
      // - this criterion works well for points lying far away from the curve
      const startPrecisionRatio = distFromStart
        ? Math.abs(distFromStart - distFromEnd!) / distFromStart
        : 0

      const endPrecisionRatio =
        distFromEnd != null
          ? Math.abs(distFromStart! - distFromEnd) / distFromEnd
          : 0

      const hasRequiredPrecision =
        startPrecisionRatio < precisionRatio ||
        endPrecisionRatio < precisionRatio

      // check if we have reached at least one required minimal distance
      // - calculated as: the subdivision chord length multiplied by precisionRatio
      // - calculation is relative so it will work for arbitrarily large/small curves and their subdivisions
      // - this is a backup criterion that works well for points lying "almost at" the curve
      const hasMiniStartDistance = distFromStart
        ? distFromStart < chordLength * precisionRatio
        : true
      const hasMiniEndDistance = distFromEnd
        ? distFromEnd < chordLength * precisionRatio
        : true
      const hasMiniDistance = hasMiniStartDistance || hasMiniEndDistance

      if (hasRequiredPrecision || hasMiniDistance) {
        return distFromStart <= distFromEnd
          ? investigatedSubdivisionStartT
          : investigatedSubdivisionEndT
      }

      // otherwise, set up for next iteration
      const divided: [Curve, Curve] = investigatedSubdivision!.divide(0.5)
      piece /= 2

      const startDist1 = divided[0].start.distance(p)
      const endDist1 = divided[0].end.distance(p)
      const sumDist1 = startDist1 + endDist1

      const startDist2 = divided[1].start.distance(p)
      const endDist2 = divided[1].end.distance(p)
      const sumDist2 = startDist2 + endDist2

      if (sumDist1 <= sumDist2) {
        investigatedSubdivision = divided[0]
        investigatedSubdivisionEndT -= piece
        distFromStart = startDist1
        distFromEnd = endDist1
      } else {
        investigatedSubdivision = divided[1]
        investigatedSubdivisionStartT += piece
        distFromStart = startDist2
        distFromEnd = endDist2
      }
    }
  }

  closestPointTangent(
    p: Point.PointLike | Point.PointData,
    options: Curve.Options = {},
  ) {
    return this.tangentAtT(this.closestPointT(p, options))
  }

  containsPoint(
    p: Point.PointLike | Point.PointData,
    options: Curve.Options = {},
  ) {
    const polyline = this.toPolyline(options)
    return polyline.containsPoint(p)
  }

  divideAt(ratio: number, options: Curve.Options = {}): [Curve, Curve] {
    if (ratio <= 0) {
      return this.divideAtT(0)
    }

    if (ratio >= 1) {
      return this.divideAtT(1)
    }

    const t = this.tAt(ratio, options)
    return this.divideAtT(t)
  }

  divideAtLength(length: number, options: Curve.Options = {}): [Curve, Curve] {
    const t = this.tAtLength(length, options)
    return this.divideAtT(t)
  }

  divide(t: number) {
    return this.divideAtT(t)
  }

  divideAtT(t: number): [Curve, Curve] {
    const start = this.start
    const controlPoint1 = this.controlPoint1
    const controlPoint2 = this.controlPoint2
    const end = this.end

    if (t <= 0) {
      return [
        new Curve(start, start, start, start),
        new Curve(start, controlPoint1, controlPoint2, end),
      ]
    }

    if (t >= 1) {
      return [
        new Curve(start, controlPoint1, controlPoint2, end),
        new Curve(end, end, end, end),
      ]
    }

    const dividerPoints = this.getSkeletonPoints(t)
    const startControl1 = dividerPoints.startControlPoint1
    const startControl2 = dividerPoints.startControlPoint2
    const divider = dividerPoints.divider
    const dividerControl1 = dividerPoints.dividerControlPoint1
    const dividerControl2 = dividerPoints.dividerControlPoint2

    return [
      new Curve(start, startControl1, startControl2, divider),
      new Curve(divider, dividerControl1, dividerControl2, end),
    ]
  }

  endpointDistance() {
    return this.start.distance(this.end)
  }

  getSkeletonPoints(t: number) {
    const start = this.start
    const control1 = this.controlPoint1
    const control2 = this.controlPoint2
    const end = this.end

    // shortcuts for `t` values that are out of range
    if (t <= 0) {
      return {
        startControlPoint1: start.clone(),
        startControlPoint2: start.clone(),
        divider: start.clone(),
        dividerControlPoint1: control1.clone(),
        dividerControlPoint2: control2.clone(),
      }
    }

    if (t >= 1) {
      return {
        startControlPoint1: control1.clone(),
        startControlPoint2: control2.clone(),
        divider: end.clone(),
        dividerControlPoint1: end.clone(),
        dividerControlPoint2: end.clone(),
      }
    }

    const midpoint1 = new Line(start, control1).pointAt(t)
    const midpoint2 = new Line(control1, control2).pointAt(t)
    const midpoint3 = new Line(control2, end).pointAt(t)

    const subControl1 = new Line(midpoint1, midpoint2).pointAt(t)
    const subControl2 = new Line(midpoint2, midpoint3).pointAt(t)

    const divideLine = new Line(subControl1, subControl2).pointAt(t)

    return {
      startControlPoint1: midpoint1,
      startControlPoint2: subControl1,
      divider: divideLine,
      dividerControlPoint1: subControl2,
      dividerControlPoint2: midpoint3,
    }
  }

  getSubdivisions(options: Curve.Options = {}): Curve[] {
    const precision = this.getPrecision(options)
    let subdivisions = [
      new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end),
    ]

    if (precision === 0) {
      return subdivisions
    }

    let previousLength = this.endpointDistance()
    const precisionRatio = Math.pow(10, -precision) // eslint-disable-line

    // Recursively divide curve at `t = 0.5`, until the difference between
    // observed length at subsequent iterations is lower than precision.
    let iteration = 0
    // eslint-disable-next-line
    while (true) {
      iteration += 1

      const divisions: Curve[] = []
      subdivisions.forEach((c) => {
        // dividing at t = 0.5 (not at middle length!)
        const divided = c.divide(0.5)
        divisions.push(divided[0], divided[1])
      })

      // measure new length
      const length = divisions.reduce(
        (memo, c) => memo + c.endpointDistance(),
        0,
      )

      // check if we have reached required observed precision
      // sine-like curves may have the same observed length in iteration 0 and 1 - skip iteration 1
      // not a problem for further iterations because cubic curves cannot have more than two local extrema
      // (i.e. cubic curves cannot intersect the baseline more than once)
      // therefore two subsequent iterations cannot produce sampling with equal length
      const ratio = length !== 0 ? (length - previousLength) / length : 0
      if (iteration > 1 && ratio < precisionRatio) {
        return divisions
      }

      subdivisions = divisions
      previousLength = length
    }
  }

  length(options: Curve.Options = {}) {
    const divisions = this.getDivisions(options)
    return divisions.reduce((memo, c) => {
      return memo + c.endpointDistance()
    }, 0)
  }

  lengthAtT(t: number, options: Curve.Options = {}) {
    if (t <= 0) {
      return 0
    }

    const precision =
      options.precision === undefined ? this.PRECISION : options.precision
    const subCurve = this.divide(t)[0]
    return subCurve.length({ precision })
  }

  pointAt(ratio: number, options: Curve.Options = {}) {
    if (ratio <= 0) {
      return this.start.clone()
    }

    if (ratio >= 1) {
      return this.end.clone()
    }

    const t = this.tAt(ratio, options)
    return this.pointAtT(t)
  }

  pointAtLength(length: number, options: Curve.Options = {}) {
    const t = this.tAtLength(length, options)
    return this.pointAtT(t)
  }

  pointAtT(t: number) {
    if (t <= 0) {
      return this.start.clone()
    }

    if (t >= 1) {
      return this.end.clone()
    }

    return this.getSkeletonPoints(t).divider
  }

  isDifferentiable() {
    const start = this.start
    const control1 = this.controlPoint1
    const control2 = this.controlPoint2
    const end = this.end

    return !(
      start.equals(control1) &&
      control1.equals(control2) &&
      control2.equals(end)
    )
  }

  tangentAt(ratio: number, options: Curve.Options = {}) {
    if (!this.isDifferentiable()) return null

    if (ratio < 0) {
      ratio = 0 // eslint-disable-line
    } else if (ratio > 1) {
      ratio = 1 // eslint-disable-line
    }

    const t = this.tAt(ratio, options)
    return this.tangentAtT(t)
  }

  tangentAtLength(length: number, options: Curve.Options = {}) {
    if (!this.isDifferentiable()) {
      return null
    }

    const t = this.tAtLength(length, options)
    return this.tangentAtT(t)
  }

  tangentAtT(t: number) {
    if (!this.isDifferentiable()) {
      return null
    }

    if (t < 0) {
      t = 0 // eslint-disable-line
    }

    if (t > 1) {
      t = 1 // eslint-disable-line
    }

    const skeletonPoints = this.getSkeletonPoints(t)
    const p1 = skeletonPoints.startControlPoint2
    const p2 = skeletonPoints.dividerControlPoint1

    const tangentStart = skeletonPoints.divider
    const tangentLine = new Line(p1, p2)
    // move so that tangent line starts at the point requested
    tangentLine.translate(tangentStart.x - p1.x, tangentStart.y - p1.y)
    return tangentLine
  }

  protected getPrecision(options: Curve.Options = {}) {
    return options.precision == null ? this.PRECISION : options.precision
  }

  protected getDivisions(options: Curve.Options = {}) {
    if (options.subdivisions != null) {
      return options.subdivisions
    }

    const precision = this.getPrecision(options)
    return this.getSubdivisions({ precision })
  }

  protected getOptions(options: Curve.Options = {}): Curve.Options {
    const precision = this.getPrecision(options)
    const subdivisions = this.getDivisions(options)
    return { precision, subdivisions }
  }

  protected tAt(ratio: number, options: Curve.Options = {}) {
    if (ratio <= 0) {
      return 0
    }
    if (ratio >= 1) {
      return 1
    }

    const opts = this.getOptions(options)
    const total = this.length(opts)
    const length = total * ratio
    return this.tAtLength(length, opts)
  }

  protected tAtLength(length: number, options: Curve.Options = {}) {
    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // eslint-disable-line
    }

    const precision = this.getPrecision(options)
    const subdivisions = this.getDivisions(options)
    const opts = { precision, subdivisions }

    let investigatedSubdivision: Curve | null = null
    let investigatedSubdivisionStartT: number
    let investigatedSubdivisionEndT: number
    let baselinePointDistFromStart = 0
    let baselinePointDistFromEnd = 0
    let memo = 0

    const count = subdivisions.length
    let piece = count > 0 ? 1 / count : 0

    for (let i = 0; i < count; i += 1) {
      const index = fromStart ? i : count - 1 - i
      const division = subdivisions[i]
      const dist = division.endpointDistance()

      if (length <= memo + dist) {
        investigatedSubdivision = division
        investigatedSubdivisionStartT = index * piece
        investigatedSubdivisionEndT = (index + 1) * piece

        baselinePointDistFromStart = fromStart
          ? length - memo
          : dist + memo - length
        baselinePointDistFromEnd = fromStart
          ? dist + memo - length
          : length - memo

        break
      }

      memo += dist
    }

    if (investigatedSubdivision == null) {
      return fromStart ? 1 : 0
    }

    // note that precision affects what length is recorded
    // (imprecise measurements underestimate length by up to 10^(-precision) of the precise length)
    // e.g. at precision 1, the length may be underestimated by up to 10% and cause this function to return 1

    const total = this.length(opts)
    const precisionRatio = Math.pow(10, -precision) // eslint-disable-line

    // recursively divide investigated subdivision:
    // until distance between baselinePoint and closest path endpoint is within 10^(-precision)
    // then return the closest endpoint of that final subdivision
    // eslint-disable-next-line
    while (true) {
      let ratio

      ratio = total !== 0 ? baselinePointDistFromStart / total : 0
      if (ratio < precisionRatio) {
        return investigatedSubdivisionStartT!
      }

      ratio = total !== 0 ? baselinePointDistFromEnd / total : 0
      if (ratio < precisionRatio) {
        return investigatedSubdivisionEndT!
      }

      // otherwise, set up for next iteration
      let newBaselinePointDistFromStart
      let newBaselinePointDistFromEnd

      const divided: [Curve, Curve] = investigatedSubdivision.divide(0.5)
      piece /= 2

      const baseline1Length = divided[0].endpointDistance()
      const baseline2Length = divided[1].endpointDistance()

      if (baselinePointDistFromStart <= baseline1Length) {
        investigatedSubdivision = divided[0]
        investigatedSubdivisionEndT! -= piece

        newBaselinePointDistFromStart = baselinePointDistFromStart
        newBaselinePointDistFromEnd =
          baseline1Length - newBaselinePointDistFromStart
      } else {
        investigatedSubdivision = divided[1]
        investigatedSubdivisionStartT! += piece

        newBaselinePointDistFromStart =
          baselinePointDistFromStart - baseline1Length
        newBaselinePointDistFromEnd =
          baseline2Length - newBaselinePointDistFromStart
      }

      baselinePointDistFromStart = newBaselinePointDistFromStart
      baselinePointDistFromEnd = newBaselinePointDistFromEnd
    }
  }

  toPoints(options: Curve.Options = {}) {
    const subdivisions = this.getDivisions(options)
    const points = [subdivisions[0].start.clone()]
    subdivisions.forEach((c) => points.push(c.end.clone()))
    return points
  }

  toPolyline(options: Curve.Options = {}) {
    return new Polyline(this.toPoints(options))
  }

  scale(sx: number, sy: number, origin?: Point.PointLike | Point.PointData) {
    this.start.scale(sx, sy, origin)
    this.controlPoint1.scale(sx, sy, origin)
    this.controlPoint2.scale(sx, sy, origin)
    this.end.scale(sx, sy, origin)
    return this
  }

  rotate(angle: number, origin?: Point.PointLike | Point.PointData) {
    this.start.rotate(angle, origin)
    this.controlPoint1.rotate(angle, origin)
    this.controlPoint2.rotate(angle, origin)
    this.end.rotate(angle, origin)
    return this
  }

  translate(tx: number, ty: number): this
  translate(p: Point.PointLike | Point.PointData): this
  translate(tx: number | Point.PointLike | Point.PointData, ty?: number) {
    if (typeof tx === 'number') {
      this.start.translate(tx, ty as number)
      this.controlPoint1.translate(tx, ty as number)
      this.controlPoint2.translate(tx, ty as number)
      this.end.translate(tx, ty as number)
    } else {
      this.start.translate(tx)
      this.controlPoint1.translate(tx)
      this.controlPoint2.translate(tx)
      this.end.translate(tx)
    }

    return this
  }

  equals(c: Curve) {
    return (
      c != null &&
      this.start.equals(c.start) &&
      this.controlPoint1.equals(c.controlPoint1) &&
      this.controlPoint2.equals(c.controlPoint2) &&
      this.end.equals(c.end)
    )
  }

  clone() {
    return new Curve(
      this.start,
      this.controlPoint1,
      this.controlPoint2,
      this.end,
    )
  }

  toJSON() {
    return {
      start: this.start.toJSON(),
      controlPoint1: this.controlPoint1.toJSON(),
      controlPoint2: this.controlPoint2.toJSON(),
      end: this.end.toJSON(),
    }
  }

  serialize() {
    return [
      this.start.serialize(),
      this.controlPoint1.serialize(),
      this.controlPoint2.serialize(),
      this.end.serialize(),
    ].join(' ')
  }
}

export namespace Curve {
  export const toStringTag = `X6.Geometry.${Curve.name}`

  export function isCurve(instance: any): instance is Curve {
    if (instance == null) {
      return false
    }

    if (instance instanceof Curve) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const curve = instance as Curve

    try {
      if (
        (tag == null || tag === toStringTag) &&
        Point.isPoint(curve.start) &&
        Point.isPoint(curve.controlPoint1) &&
        Point.isPoint(curve.controlPoint2) &&
        Point.isPoint(curve.end) &&
        typeof curve.toPoints === 'function' &&
        typeof curve.toPolyline === 'function'
      ) {
        return true
      }
    } catch (e) {
      return false
    }

    return false
  }
}

export namespace Curve {
  export interface Options {
    precision?: number
    subdivisions?: Curve[]
  }
}
export namespace Curve {
  function getFirstControlPoints(rhs: number[]) {
    const n = rhs.length
    const x = [] // `x` is a solution vector.
    const tmp = []
    let b = 2.0

    x[0] = rhs[0] / b

    // Decomposition and forward substitution.
    for (let i = 1; i < n; i += 1) {
      tmp[i] = 1 / b
      b = (i < n - 1 ? 4.0 : 3.5) - tmp[i]
      x[i] = (rhs[i] - x[i - 1]) / b
    }

    for (let i = 1; i < n; i += 1) {
      // Backsubstitution.
      x[n - i - 1] -= tmp[n - i] * x[n - i]
    }

    return x
  }

  function getCurveControlPoints(
    points: (Point.PointLike | Point.PointData)[],
  ) {
    const knots = points.map((p) => Point.clone(p))
    const firstControlPoints = []
    const secondControlPoints = []
    const n = knots.length - 1

    // Special case: Bezier curve should be a straight line.
    if (n === 1) {
      // 3P1 = 2P0 + P3
      firstControlPoints[0] = new Point(
        (2 * knots[0].x + knots[1].x) / 3,
        (2 * knots[0].y + knots[1].y) / 3,
      )

      // P2 = 2P1 – P0
      secondControlPoints[0] = new Point(
        2 * firstControlPoints[0].x - knots[0].x,
        2 * firstControlPoints[0].y - knots[0].y,
      )

      return [firstControlPoints, secondControlPoints]
    }

    // Calculate first Bezier control points.
    // Right hand side vector.
    const rhs = []

    // Set right hand side X values.
    for (let i = 1; i < n - 1; i += 1) {
      rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x
    }

    rhs[0] = knots[0].x + 2 * knots[1].x
    rhs[n - 1] = (8 * knots[n - 1].x + knots[n].x) / 2.0

    // Get first control points X-values.
    const x = getFirstControlPoints(rhs)

    // Set right hand side Y values.
    for (let i = 1; i < n - 1; i += 1) {
      rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y
    }

    rhs[0] = knots[0].y + 2 * knots[1].y
    rhs[n - 1] = (8 * knots[n - 1].y + knots[n].y) / 2.0

    // Get first control points Y-values.
    const y = getFirstControlPoints(rhs)

    // Fill output arrays.
    for (let i = 0; i < n; i += 1) {
      // First control point.
      firstControlPoints.push(new Point(x[i], y[i]))

      // Second control point.
      if (i < n - 1) {
        secondControlPoints.push(
          new Point(
            2 * knots[i + 1].x - x[i + 1],
            2 * knots[i + 1].y - y[i + 1],
          ),
        )
      } else {
        secondControlPoints.push(
          new Point((knots[n].x + x[n - 1]) / 2, (knots[n].y + y[n - 1]) / 2),
        )
      }
    }

    return [firstControlPoints, secondControlPoints]
  }

  export function throughPoints(points: (Point.PointLike | Point.PointData)[]) {
    if (points == null || (Array.isArray(points) && points.length < 2)) {
      throw new Error('At least 2 points are required')
    }

    const controlPoints = getCurveControlPoints(points)

    const curves = []
    for (let i = 0, ii = controlPoints[0].length; i < ii; i += 1) {
      const controlPoint1 = new Point(
        controlPoints[0][i].x,
        controlPoints[0][i].y,
      )
      const controlPoint2 = new Point(
        controlPoints[1][i].x,
        controlPoints[1][i].y,
      )

      curves.push(
        new Curve(points[i], controlPoint1, controlPoint2, points[i + 1]),
      )
    }

    return curves
  }
}
