import { Path, Point } from '../../geometry'
import { Connector } from './index'

export interface LoopConnectorOptions extends Connector.BaseOptions {
  split?: boolean | number
}

export const loop: Connector.Definition<LoopConnectorOptions> = function (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) {
  const fix = routePoints.length === 3 ? 0 : 1
  const p1 = Point.create(routePoints[0 + fix])
  const p2 = Point.create(routePoints[2 + fix])
  const center = Point.create(routePoints[1 + fix])

  if (!Point.equals(sourcePoint, targetPoint)) {
    const middle = new Point(
      (sourcePoint.x + targetPoint.x) / 2,
      (sourcePoint.y + targetPoint.y) / 2,
    )
    const angle = middle.angleBetween(
      Point.create(sourcePoint).rotate(90, middle),
      center,
    )
    if (angle > 1) {
      p1.rotate(180 - angle, middle)
      p2.rotate(180 - angle, middle)
      center.rotate(180 - angle, middle)
    }
  }

  const pathData = `
     M ${sourcePoint.x} ${sourcePoint.y}
     Q ${p1.x} ${p1.y} ${center.x} ${center.y}
     Q ${p2.x} ${p2.y} ${targetPoint.x} ${targetPoint.y}
  `

  return options.raw ? Path.parse(pathData) : pathData
}
