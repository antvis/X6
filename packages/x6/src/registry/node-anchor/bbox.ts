import { NumberExt } from '@antv/x6-common'
import { NodeAnchor } from './index'

export interface BBoxEndpointOptions {
  dx?: number | string
  dy?: number | string
  /**
   * Should the anchor bbox rotate with the terminal view.
   *
   * Default is `false`, meaning that the unrotated bbox is used.
   */
  rotate?: boolean
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
): NodeAnchor.Definition<BBoxEndpointOptions> {
  return function (view, magnet, ref, options: BBoxEndpointOptions = {}) {
    const model = view.cell.model
    const cell = view.cell
    const bbox = options.rotate
      ? view.getUnrotatedBBoxOfElement(magnet)
      : view.getBBoxOfElement(magnet)
    const result = bbox[method]
    const vBbox = model?.getCellsBBox([cell]) || { width: 0, height: 0 }
    if (!bbox.width) {
      result.x += vBbox.width >> 1
    }
    if (!bbox.height) {
      result.y += vBbox.height >> 1
    }
    result.x += NumberExt.normalizePercentage(
      options.dx,
      bbox.width || vBbox.width,
    )
    result.y += NumberExt.normalizePercentage(
      options.dy,
      bbox.height || vBbox.height,
    )
    return options.rotate
      ? result.rotate(-cell.getAngle(), cell.getBBox().getCenter())
      : result
  }
}
