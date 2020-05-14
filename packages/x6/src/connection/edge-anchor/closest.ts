import { Point } from '../../geometry'
import { ResolveOptions, resolve } from '../node-anchor/util'
import { EdgeConnectionAnchor } from './index'

export interface ClosestAnchorOptions extends ResolveOptions {}

export const getClosestPoint: EdgeConnectionAnchor.ResolvedDefinition<ClosestAnchorOptions> = function (
  view,
  magnet,
  refPoint,
  options,
) {
  const closestPoint = view.getClosestPoint(refPoint)
  return closestPoint != null ? closestPoint : new Point()
}

export const closest = resolve<
  EdgeConnectionAnchor.ResolvedDefinition<ResolveOptions>,
  EdgeConnectionAnchor.Definition<ClosestAnchorOptions>
>(getClosestPoint)
