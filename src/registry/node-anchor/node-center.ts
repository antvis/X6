import type { NodeAnchorDefinition } from './index'

export interface NodeCenterEndpointOptions {
  dx?: number
  dy?: number
}

/**
 * Places the anchor of the edge at center of the node bbox.
 */
export const nodeCenter: NodeAnchorDefinition<NodeCenterEndpointOptions> =
  function (view, magnet, ref, options, endType) {
    const result = view.cell.getConnectionPoint(this.cell, endType)
    if (options.dx || options.dy) {
      result.translate(options.dx || 0, options.dy || 0)
    }
    return result
  }
