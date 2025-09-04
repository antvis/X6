import { Path, Polyline } from '../../geometry'
import type { ConnectorBaseOptions, ConnectorDefinition } from './index'

export interface NormalConnectorOptions extends ConnectorBaseOptions {
  split?: boolean | number
}

export const normal: ConnectorDefinition = (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) => {
  const points = [sourcePoint, ...routePoints, targetPoint]
  const polyline = new Polyline(points)
  const path = new Path(polyline)
  return options.raw ? path : path.serialize()
}
