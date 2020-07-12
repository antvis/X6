import { Point, Path } from '../../geometry'
import { Connector } from './index'

export interface RoundedConnectorOptions extends Connector.BaseOptions {
  radius?: number
}

export const rounded: Connector.Definition<RoundedConnectorOptions> = function (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) {
  const path = new Path()

  path.appendSegment(Path.createSegment('M', sourcePoint))

  const f13 = 1 / 3
  const f23 = 2 / 3
  const radius = options.radius || 10

  let prevDistance
  let nextDistance
  for (let i = 0, ii = routePoints.length; i < ii; i += 1) {
    const curr = Point.create(routePoints[i])
    const prev = routePoints[i - 1] || sourcePoint
    const next = routePoints[i + 1] || targetPoint

    prevDistance = nextDistance || curr.distance(prev) / 2
    nextDistance = curr.distance(next) / 2

    const startMove = -Math.min(radius, prevDistance)
    const endMove = -Math.min(radius, nextDistance)

    const roundedStart = curr.clone().move(prev, startMove).round()
    const roundedEnd = curr.clone().move(next, endMove).round()

    const control1 = new Point(
      f13 * roundedStart.x + f23 * curr.x,
      f23 * curr.y + f13 * roundedStart.y,
    )
    const control2 = new Point(
      f13 * roundedEnd.x + f23 * curr.x,
      f23 * curr.y + f13 * roundedEnd.y,
    )

    path.appendSegment(Path.createSegment('L', roundedStart))
    path.appendSegment(Path.createSegment('C', control1, control2, roundedEnd))
  }

  path.appendSegment(Path.createSegment('L', targetPoint))

  return options.raw ? path : path.serialize()
}
