import { Dom } from '../../util'
import { Grid } from './index'

export interface FixedDotOptions extends Grid.Options {}

export const fixedDot: Grid.Definition<FixedDotOptions> = {
  color: '#aaaaaa',
  thickness: 1,
  markup: 'rect',
  update(elem, options) {
    const size =
      options.sx <= 1 ? options.thickness * options.sx : options.thickness
    Dom.attr(elem, {
      width: size,
      height: size,
      rx: size,
      ry: size,
      fill: options.color,
    })
  },
}
