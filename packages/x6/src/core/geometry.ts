import { Angle, Point, Rectangle } from '../geometry'

export class Geometry {
  /**
   * Stores the position in `x` and `y`, the size in `width` and `height`.
   */
  bounds: Rectangle

  /**
   * Stores alternated `x`, `y`, `width` and `height` in a rectangle.
   */
  alternateBounds: Rectangle

  /**
   * The source `Point` of the edge. This is used if the edge does not
   * have a source node. Otherwise it is ignored.
   */
  sourcePoint: Point

  /**
   * The target `Point` of the edge. This is used if the  edge does not
   * have a target node. Otherwise it is ignored.
   */
  targetPoint: Point

  /**
   * Specifies the control points along the edge. These points are the
   * intermediate points on the edge, for the endpoints use `targetPoint`
   * and `sourcePoint` or set the terminals of the edge to a non-null value.
   */
  points: Point[]

  /**
   * For edges, this holds the offset from the position defined
   * by `x` and `y` on the edge.
   *
   * For relative geometries (for nodes), this defines the absolute offset
   * from the point defined by the relative coordinates.
   *
   * For absolute geometries (for nodes), this defines the offset for the
   * label.
   */
  offset: Point

  /**
   * Specifies if the coordinates in the geometry are to be interpreted as
   * relative coordinates.
   *
   * For edges, this is used to define the location of the edge label
   * relative to the edge.
   *
   * For nodes, this specifies the relative location inside the bounds of
   * the parent cell.
   *
   * If this is `true`, then the coordinates are relative to the origin of
   * the parent cell or, for edges, the edge label position is relative to
   * the center of the edge as rendered on screen.
   */
  relative: boolean = false

  translateControlPoints: boolean = true

  constructor(
    x: number = 0,
    y: number = 0,
    width: number = 0,
    height: number = 0,
  ) {
    this.bounds = new Rectangle(x, y, width, height)
  }

  swap() {
    if (this.alternateBounds != null) {
      const tmp = this.bounds.clone()
      this.bounds = this.alternateBounds.clone()
      this.alternateBounds = tmp
    }
  }

  getTerminalPoint(isSource?: boolean) {
    return isSource ? this.sourcePoint : this.targetPoint
  }

  setTerminalPoint(point: Point, isSource?: boolean) {
    if (isSource) {
      this.sourcePoint = point
    } else {
      this.targetPoint = point
    }
    return point
  }

  addPoint(point: Point | Point.PointLike | Point.PointData): void
  addPoint(x: number, y: number): void
  addPoint(x: number | Point | Point.PointLike | Point.PointData, y?: number) {
    if (this.points == null) {
      this.points = []
    }

    const p = Point.create(x, y)

    this.points.push(p)
  }

  /**
   * Translates the geometry by the specified amount.
   * @param dx Specifies the x-coordinate of the translation.
   * @param dy Specifies the y-coordinate of the translation.
   */
  translate(dx: number, dy: number) {
    if (!this.relative) {
      Private.translatePoint(this.bounds, dx, dy)
    }

    Private.translatePoint(this.sourcePoint, dx, dy)
    Private.translatePoint(this.targetPoint, dx, dy)

    if (this.translateControlPoints && this.points != null) {
      this.points.forEach(p => Private.translatePoint(p, dx, dy))
    }
  }

  /**
   * Rotates the geometry by the given angle around the given center.
   *
   * @param degree Specifies the rotation angle in degrees.
   * @param center Specifies the center of the rotation.
   */
  rotate(degree: number, center: Point) {
    const rad = Angle.toRad(degree)
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    if (!this.relative) {
      const ct = this.bounds.getCenter()
      const pt = Point.rotateEx(ct, cos, sin, center)

      this.bounds.x = Math.round(pt.x - this.bounds.width / 2)
      this.bounds.y = Math.round(pt.y - this.bounds.height / 2)
    }

    Private.rotatePoint(this.sourcePoint, cos, sin, center)
    Private.rotatePoint(this.targetPoint, cos, sin, center)

    if (this.points != null) {
      this.points.forEach(p => Private.rotatePoint(p, cos, sin, center))
    }
  }

  /**
   * Scales the geometry by the given amount.
   *
   * @param sx The horizontal scale factor.
   * @param sy The vertical scale factor.
   * @param fixedAspect Optional boolean to keep the aspect ratio fixed.
   */
  scale(sx: number, sy: number, fixedAspect?: boolean) {
    if (!this.relative) {
      Private.scalePoint(this.bounds, sx, sy)

      if (fixedAspect) {
        // tslint:disable-next-line:no-parameter-reassignment
        sy = sx = Math.min(sx, sy)
      }

      this.bounds.width *= sx
      this.bounds.height *= sy
    }

    Private.scalePoint(this.sourcePoint, sx, sy)
    Private.scalePoint(this.targetPoint, sx, sy)

    if (this.points != null) {
      this.points.forEach(p => Private.scalePoint(p, sx, sy))
    }
  }

  clone() {
    const { x, y, width, height } = this.bounds
    const geo = new Geometry(x, y, width, height)

    if (this.alternateBounds != null) {
      geo.alternateBounds = this.alternateBounds.clone()
    }

    if (this.sourcePoint != null) {
      geo.sourcePoint = this.sourcePoint.clone()
    }

    if (this.targetPoint != null) {
      geo.targetPoint = this.targetPoint.clone()
    }

    if (this.points != null) {
      geo.points = this.points.map(p => p.clone())
    }

    if (this.offset != null) {
      geo.offset = this.offset.clone()
    }

    geo.relative = this.relative
    geo.translateControlPoints = this.translateControlPoints

    return geo
  }

  equals(geo: Geometry) {
    return (
      this.relative === geo.relative &&
      this.translateControlPoints === geo.translateControlPoints &&
      this.bounds.equals(geo.bounds) &&
      ((this.alternateBounds == null && geo.alternateBounds == null) ||
        (this.alternateBounds != null &&
          this.alternateBounds.equals(geo.alternateBounds))) &&
      ((this.sourcePoint == null && geo.sourcePoint == null) ||
        (this.sourcePoint != null &&
          this.sourcePoint.equals(geo.sourcePoint))) &&
      ((this.targetPoint == null && geo.targetPoint == null) ||
        (this.targetPoint != null &&
          this.targetPoint.equals(geo.targetPoint))) &&
      ((this.points == null && geo.points == null) ||
        (this.points != null && Point.equalPoints(this.points, geo.points))) &&
      ((this.offset == null && geo.offset == null) ||
        (this.offset != null && this.offset.equals(geo.offset)))
    )
  }
}

namespace Private {
  export function translatePoint(
    point: Point | Point.PointLike,
    dx: number,
    dy: number,
  ) {
    if (point != null) {
      point.x += dx
      point.y += dy
    }

    return point
  }

  export function rotatePoint(
    point: Point | Point.PointLike,
    cos: number,
    sin: number,
    center: Point,
  ) {
    if (point != null) {
      const p = Point.rotateEx(point, cos, sin, center)
      point.x = Math.round(p.x)
      point.y = Math.round(p.y)
    }

    return point
  }

  export function scalePoint(
    point: Point | Point.PointLike,
    sx: number,
    sy: number,
  ) {
    if (point != null) {
      point.x *= sx
      point.y *= sy
    }

    return point
  }
}
