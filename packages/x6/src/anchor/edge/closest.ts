import { Point } from '../../geometry'
import { ResolveOptions, resolve } from '../util'
import { EdgeAnchor } from './index'

export interface ClosestAnchorOptions extends ResolveOptions {}

export const getClosestPoint: EdgeAnchor.ResolvedDefinition<ClosestAnchorOptions> = function (
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
  EdgeAnchor.Definition<ClosestAnchorOptions>
>(getClosestPoint)
