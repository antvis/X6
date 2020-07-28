import { Point } from '../../geometry'
import { ResolveOptions, resolve } from '../node-endpoint/util'
import { EdgeEndpoint } from './index'

export interface ClosestEndpointOptions extends ResolveOptions {}

export const getClosestPoint: EdgeEndpoint.ResolvedDefinition<ClosestEndpointOptions> = function (
  view,
  magnet,
  refPoint,
  options,
) {
  const closestPoint = view.getClosestPoint(refPoint)
  return closestPoint != null ? closestPoint : new Point()
}

export const closest = resolve<
  EdgeEndpoint.ResolvedDefinition<ResolveOptions>,
  EdgeEndpoint.Definition<ClosestEndpointOptions>
>(getClosestPoint)
