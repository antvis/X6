import { ResolveOptions, resolve } from '../util'
import { NodeAnchor } from './index'

export interface MiddleSideAnchorOptions extends ResolveOptions {
  rotated?: boolean
  padding?: number
}

const middleSide: NodeAnchor.ResolvedDefinition<MiddleSideAnchorOptions> = function (
  view,
  magnet,
  refPoint,
  options,
) {
  let bbox
  let angle = 0
  let center

  const node = view.cell
  if (options.rotated) {
    bbox = view.getNodeUnrotatedBBox(magnet)
    center = node.getBBox().getCenter()
    angle = node.rotation
  } else {
    bbox = view.getNodeBBox(magnet)
  }

  const padding = options.padding
  if (padding != null && isFinite(padding)) {
    bbox.inflate(padding)
  }

  if (options.rotated) {
    refPoint.rotate(angle, center)
  }

  const side = bbox.sideNearestToPoint(refPoint)
  let anchor
  switch (side) {
    case 'left':
      anchor = bbox.getLeftMiddle()
      break
    case 'right':
      anchor = bbox.getRightMiddle()
      break
    case 'top':
      anchor = bbox.getTopCenter()
      break
    case 'bottom':
      anchor = bbox.getBottomCenter()
      break
  }

  return options.rotated ? anchor.rotate(-angle, center) : anchor
}

/**
 * Places the anchor of the edge in the middle of the side of view bbox
 * closest to the other endpoint.
 */
export const midSide = resolve<
  NodeAnchor.ResolvedDefinition<ResolveOptions>,
  NodeAnchor.Definition<ResolveOptions>
>(middleSide)
