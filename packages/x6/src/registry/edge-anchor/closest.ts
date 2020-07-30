import { Point } from '../../geometry'
import { ResolveOptions, resolve } from '../node-anchor/util'
import { EdgeAnchor } from './index'

export interface ClosestEndpointOptions extends ResolveOptions {}

export const getClosestPoint: EdgeAnchor.ResolvedDefinition<ClosestEndpointOptions> = function (
  view,
  magnet,
  refPoint,
  options,
) {
  const closestPoint = view.getClosestPoint(refPoint)
  return closestPoint != null ? closestPoint : new Point()
}

export const closest = resolve<
  EdgeAnchor.ResolvedDefinition<ResolveOptions>,
  EdgeAnchor.Definition<ClosestEndpointOptions>
>(getClosestPoint)
