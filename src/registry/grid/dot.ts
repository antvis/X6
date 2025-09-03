import { Dom } from '../../common'
import type { GridDefinition, GridOptions } from './index'

export interface DotOptions extends GridOptions {}

export const dot: GridDefinition<DotOptions> = {
  color: '#aaaaaa',
  thickness: 1,
  markup: 'rect',
  update(elem, options) {
    const width = options.thickness * options.sx
    const height = options.thickness * options.sy
    Dom.attr(elem, {
      width,
      height,
      rx: width,
      ry: height,
      fill: options.color,
    })
  },
}
