import { NodeAnchor } from './index'

export interface NodeCenterAnchorOptions {
  dx?: number
  dy?: number
}

/**
 * Places the anchor of the edge at center of the node bbox.
 */
export const nodeCenter: NodeAnchor.Definition<NodeCenterAnchorOptions> = function(
  view,
  magnet,
  ref,
  options,
  endType,
) {
  const p = view.cell.getConnectionPoint(this.cell, endType)
  if (options.dx || options.dy) {
    p.translate(options.dx || 0, options.dy || 0)
  }
  return p
}
