import { Angle, Point, Line } from '../../geometry'
import { Router } from './index'

export interface LoopRouterOptions {
  width?: number
  height?: number
  angle?: 'auto' | number
  merge?: boolean | number
}

function rollup(points: Point.PointLike[], merge?: boolean | number) {
  if (merge != null && merge !== false) {
    const amount = typeof merge === 'boolean' ? 0 : merge
    if (amount > 0) {
      const center1 = Point.create(points[1]).move(points[2], amount)
      const center2 = Point.create(points[1]).move(points[0], amount)
      return [center1.toJSON(), ...points, center2.toJSON()]
    }
    {
      const center = points[1]
      return [{ ...center }, ...points, { ...center }]
    }
  }
  return points
}

export const loop: Router.Definition<LoopRouterOptions> = function (
  vertices,
  options,
  edgeView,
) {
  const width = options.width || 50
  const height = options.height || 80
  const halfHeight = height / 2
  const angle = options.angle || 'auto'

  const sourceAnchor = edgeView.sourceAnchor
  const targetAnchor = edgeView.targetAnchor
  const sourceBBox = edgeView.sourceBBox
  const targetBBox = edgeView.targetBBox

  if (sourceAnchor.equals(targetAnchor)) {
    const getVertices = (angle: number) => {
      const rad = Angle.toRad(angle)
      const sin = Math.sin(rad)
      const cos = Math.cos(rad)

      const center = new Point(
        sourceAnchor.x + cos * width,
        sourceAnchor.y + sin * width,
      )
      const ref = new Point(
        center.x - cos * halfHeight,
        center.y - sin * halfHeight,
      )
      const p1 = ref.clone().rotate(-90, center)
      const p2 = ref.clone().rotate(90, center)

      return [p1.toJSON(), center.toJSON(), p2.toJSON()]
    }

    const validate = (end: Point.PointLike) => {
      const start = sourceAnchor.clone().move(end, -1)
      const line = new Line(start, end)
      return (
        !sourceBBox.containsPoint(end) && !sourceBBox.intersectsWithLine(line)
      )
    }

    const angles = [0, 90, 180, 270, 45, 135, 225, 315]

    if (typeof angle === 'number') {
      return rollup(getVertices(angle), options.merge)
    }

    const center = sourceBBox.getCenter()
    if (center.equals(sourceAnchor)) {
      return rollup(getVertices(0), options.merge)
    }

    const deg = center.angleBetween(
      sourceAnchor,
      center.clone().translate(1, 0),
    )
    let ret = getVertices(deg)
    if (validate(ret[1])) {
      return rollup(ret, options.merge)
    }

    // return the best vertices
    for (let i = 1, l = angles.length; i < l; i += 1) {
      ret = getVertices(deg + angles[i])
      if (validate(ret[1])) {
        return rollup(ret, options.merge)
      }
    }
    return rollup(ret, options.merge)
  }
  {
    const line = new Line(sourceAnchor, targetAnchor)
    let parallel = line.parallel(-width)
    let center = parallel.getCenter()
    let p1 = parallel.start.clone().move(parallel.end, halfHeight)
    let p2 = parallel.end.clone().move(parallel.start, halfHeight)

    const ref = line.parallel(-1)
    const line1 = new Line(ref.start, center)
    const line2 = new Line(ref.end, center)

    if (
      sourceBBox.containsPoint(center) ||
      targetBBox.containsPoint(center) ||
      sourceBBox.intersectsWithLine(line1) ||
      sourceBBox.intersectsWithLine(line2) ||
      targetBBox.intersectsWithLine(line1) ||
      targetBBox.intersectsWithLine(line2)
    ) {
      parallel = line.parallel(width)
      center = parallel.getCenter()
      p1 = parallel.start.clone().move(parallel.end, halfHeight)
      p2 = parallel.end.clone().move(parallel.start, halfHeight)
    }

    if (options.merge) {
      const line = new Line(sourceAnchor, targetAnchor)
      const normal = new Line(center, line.center).setLength(
        Number.MAX_SAFE_INTEGER,
      )
      const intersects1 = sourceBBox.intersectsWithLine(normal)
      const intersects2 = targetBBox.intersectsWithLine(normal)
      const intersects = intersects1
        ? Array.isArray(intersects1)
          ? intersects1
          : [intersects1]
        : []
      if (intersects2) {
        if (Array.isArray(intersects2)) {
          intersects.push(...intersects2)
        } else {
          intersects.push(intersects2)
        }
      }
      const anchor = line.center.closest(intersects)
      if (anchor) {
        edgeView.sourceAnchor = anchor.clone()
        edgeView.targetAnchor = anchor.clone()
      } else {
        edgeView.sourceAnchor = line.center.clone()
        edgeView.targetAnchor = line.center.clone()
      }
    }

    return rollup([p1.toJSON(), center.toJSON(), p2.toJSON()], options.merge)
  }
}
