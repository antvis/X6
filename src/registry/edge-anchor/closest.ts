import { Point } from '../../geometry'
import { type ResolveOptions, resolve } from '../node-anchor/util'
import type {
  EdgeAnchorDefinition,
  EdgeAnchorResolvedDefinition,
} from './index'

export interface ClosestEndpointOptions extends ResolveOptions {}

export const getClosestPoint: EdgeAnchorResolvedDefinition<
  ClosestEndpointOptions
> = (
  view,
  magnet,
  refPoint,
  options, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const closestPoint = view.getClosestPoint(refPoint)
  return closestPoint != null ? closestPoint : new Point()
}

export const closest = resolve<
  EdgeAnchorResolvedDefinition<ResolveOptions>,
  EdgeAnchorDefinition<ClosestEndpointOptions>
>(getClosestPoint)
