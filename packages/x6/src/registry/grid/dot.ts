import { Dom } from '../../util'
import { Grid } from './index'

export interface DotOptions extends Grid.Options {}

export const dot: Grid.Definition<DotOptions> = {
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
