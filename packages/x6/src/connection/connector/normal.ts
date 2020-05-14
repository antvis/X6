import { Polyline, Path } from '../../geometry'
import { Connector } from './index'

export const normal: Connector.Definition = function (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) {
  const points = [sourcePoint, ...routePoints, targetPoint]
  const polyline = new Polyline(points)
  const path = new Path(polyline)
  return options.raw ? path : path.serialize()
}
