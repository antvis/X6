import { Dom } from '../../util'
import { Grid } from './index'

export interface DoubleMeshOptions extends Grid.Options {
  factor?: number
}

export const doubleMesh: Grid.Definition<DoubleMeshOptions>[] = [
  {
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
  },
  {
    color: 'rgba(224,224,224,0.2)',
    thickness: 3,
    factor: 4,
    markup: 'path',
    update(elem, options) {
      let d
      const factor = options.factor || 1
      const width = options.width * factor
      const height = options.height * factor
      const thickness = options.thickness

      if (width - thickness >= 0 && height - thickness >= 0) {
        d = ['M', width, 0, 'H0 M0 0 V0', height].join(' ')
      } else {
        d = 'M 0 0 0 0'
      }

      // update wrapper size
      options.width = width
      options.height = height

      Dom.attr(elem, {
        d,
        stroke: options.color,
        'stroke-width': options.thickness,
      })
    },
  },
]
