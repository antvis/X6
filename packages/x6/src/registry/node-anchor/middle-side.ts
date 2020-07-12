import { ResolveOptions, resolve } from './util'
import { NodeConnectionAnchor } from './index'

export interface MiddleSideAnchorOptions extends ResolveOptions {
  rotated?: boolean
  padding?: number
}

const middleSide: NodeConnectionAnchor.ResolvedDefinition<MiddleSideAnchorOptions> = function (
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
    angle = node.angle
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
  NodeConnectionAnchor.ResolvedDefinition<ResolveOptions>,
  NodeConnectionAnchor.Definition<ResolveOptions>
>(middleSide)
