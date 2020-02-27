import { Point, Path } from '../../geometry'

export interface ConnectorOptions {
  raw?: boolean
}

export type ConnectorFunction = (
  sourcePoint: Point,
  targetPoint: Point,
  routePoints: Point[],
  options: ConnectorOptions,
) => Path | string
