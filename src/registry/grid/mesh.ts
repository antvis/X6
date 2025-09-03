import { Dom } from '../../common'
import type { GridDefinition, GridOptions } from './index'

export interface MeshOptions extends GridOptions {}

export const mesh: GridDefinition<MeshOptions> = {
  color: 'rgba(224,224,224,1)',
  thickness: 1,
  markup: 'path',
  update(elem, options) {
    let d
    const width = options.width
    const height = options.height
    const thickness = options.thickness

    if (width - thickness >= 0 && height - thickness >= 0) {
      d = ['M', width, 0, 'H0 M0 0 V0', height].join(' ')
    } else {
      d = 'M 0 0 0 0'
    }

    Dom.attr(elem, {
      d,
      stroke: options.color,
      'stroke-width': options.thickness,
    })
  },
}
