import { ObjectExt } from '../../util'
import { PortLabelLayout } from './index'

export function toResult(
  preset: Partial<PortLabelLayout.Result>,
  args?: Partial<PortLabelLayout.Result>,
): PortLabelLayout.Result {
  return ObjectExt.defaultsDeep({}, args, preset, {
    x: 0,
    y: 0,
    angle: 0,
    attrs: {
      '.': {
        y: '0',
        'text-anchor': 'start',
      },
    },
  })
}
