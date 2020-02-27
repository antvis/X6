import { Point, Polyline, Path } from '../../geometry'
import { ConnectorOptions } from './util'

export function normal(
  sourcePoint: Point,
  targetPoint: Point,
  routePoints: Point[],
  options: ConnectorOptions = {},
) {
  const points = [sourcePoint, ...routePoints, targetPoint]
  const polyline = new Polyline(points)
  const path = new Path(polyline)
  return options.raw ? path : path.serialize()
}
