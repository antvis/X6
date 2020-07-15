import { ObjectExt } from '../../util'
import { PortLabelLayout } from './index'

const defaults: PortLabelLayout.Result = {
  position: { x: 0, y: 0 },
  angle: 0,
  attrs: {
    '.': {
      y: '0',
      'text-anchor': 'start',
    },
  },
}

export function toResult(
  preset: Partial<PortLabelLayout.Result>,
  args?: Partial<PortLabelLayout.CommonOptions>,
): PortLabelLayout.Result {
  const { x, y, angle, attrs } = args || {}
  return ObjectExt.defaultsDeep(
    {},
    { angle, attrs, position: { x, y } },
    preset,
    defaults,
  )
}
