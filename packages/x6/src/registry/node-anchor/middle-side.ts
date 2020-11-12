import { ResolveOptions, resolve } from './util'
import { NodeAnchor } from './index'

export interface MiddleSideEndpointOptions extends ResolveOptions {
  rotated?: boolean
  padding?: number
}

const middleSide: NodeAnchor.ResolvedDefinition<MiddleSideEndpointOptions> = function (
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
    bbox = view.getUnrotatedBBoxOfElement(magnet)
    center = node.getBBox().getCenter()
    angle = node.getAngle()
  } else {
    bbox = view.getBBoxOfElement(magnet)
  }

  const padding = options.padding
  if (padding != null && isFinite(padding)) {
    bbox.inflate(padding)
  }

  if (options.rotated) {
    refPoint.rotate(angle, center)
  }

  const side = bbox.getNearestSideToPoint(refPoint)
  let result
  switch (side) {
    case 'left':
      result = bbox.getLeftMiddle()
      break
    case 'right':
      result = bbox.getRightMiddle()
      break
    case 'top':
      result = bbox.getTopCenter()
      break
    case 'bottom':
      result = bbox.getBottomCenter()
      break
  }

  return options.rotated ? result.rotate(-angle, center) : result
}

/**
 * Places the anchor of the edge in the middle of the side of view bbox
 * closest to the other endpoint.
 */
export const midSide = resolve<
  NodeAnchor.ResolvedDefinition<ResolveOptions>,
  NodeAnchor.Definition<ResolveOptions>
>(middleSide)
