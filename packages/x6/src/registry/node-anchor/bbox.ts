import { NumberExt } from '../../util'
import { NodeConnectionAnchor } from './index'

export interface BBoxAnchorOptions {
  dx?: number | string
  dy?: number | string
  /**
   * Should the anchor bbox rotate with the terminal view.
   *
   * Default is `false`, meaning that the unrotated bbox is used.
   */
  rotated?: boolean
}

export const center = createBBoxAnchor('center')
export const top = createBBoxAnchor('topCenter')
export const bottom = createBBoxAnchor('bottomCenter')
export const left = createBBoxAnchor('leftMiddle')
export const right = createBBoxAnchor('rightMiddle')
export const topLeft = createBBoxAnchor('topLeft')
export const topRight = createBBoxAnchor('topRight')
export const bottomLeft = createBBoxAnchor('bottomLeft')
export const bottomRight = createBBoxAnchor('bottomRight')

function createBBoxAnchor(
  method:
    | 'center'
    | 'topCenter'
    | 'bottomCenter'
    | 'leftMiddle'
    | 'rightMiddle'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight',
): NodeConnectionAnchor.Definition<BBoxAnchorOptions> {
  return function (view, magnet, ref, options: BBoxAnchorOptions = {}) {
    const bbox = options.rotated
      ? view.getNodeUnrotatedBBox(magnet)
      : view.getElemBBox(magnet)
    const result = bbox[method]

    result.x += NumberExt.normalizePercentage(options.dx, bbox.width)
    result.y += NumberExt.normalizePercentage(options.dy, bbox.height)

    const cell = view.cell
    return options.rotated
      ? result.rotate(-cell.getAngle(), cell.getBBox().getCenter())
      : result
  }
}
