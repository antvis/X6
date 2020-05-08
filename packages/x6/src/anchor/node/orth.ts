import { Angle } from '../../geometry'
import { ResolveOptions, resolve } from '../util'
import { NodeAnchor } from './index'

export interface OrthAnchorOptions extends ResolveOptions {
  padding: number
}

const orthogonal: NodeAnchor.ResolvedDefinition<OrthAnchorOptions> = function (
  view,
  magnet,
  refPoint,
  options,
) {
  const angle = view.cell.rotation
  const bbox = view.getNodeBBox(magnet)
  const anchor = bbox.center
  const topLeft = bbox.origin
  const bottomRight = bbox.corner

  let padding = options.padding
  if (!isFinite(padding)) {
    padding = 0
  }

  if (
    topLeft.y + padding <= refPoint.y &&
    refPoint.y <= bottomRight.y - padding
  ) {
    const dy = refPoint.y - anchor.y
    anchor.x +=
      angle === 0 || angle === 180 ? 0 : (dy * 1) / Math.tan(Angle.toRad(angle))
    anchor.y += dy
  } else if (
    topLeft.x + padding <= refPoint.x &&
    refPoint.x <= bottomRight.x - padding
  ) {
    const dx = refPoint.x - anchor.x
    anchor.y +=
      angle === 90 || angle === 270 ? 0 : dx * Math.tan(Angle.toRad(angle))
    anchor.x += dx
  }

  return anchor
}

/**
 * Tries to place the anchor of the edge inside the view bbox so that the
 * edge is made orthogonal. The anchor is placed along two line segments
 * inside the view bbox (between the centers of the top and bottom side and
 * between the centers of the left and right sides). If it is not possible
 * to place the anchor so that the edge would be orthogonal, the anchor is
 * placed at the center of the view bbox instead.
 */
export const orth = resolve<
  NodeAnchor.ResolvedDefinition<OrthAnchorOptions>,
  NodeAnchor.Definition<OrthAnchorOptions>
>(orthogonal)
