import { ObjectExt } from '../../common'
import type {
  PortLabelLayoutCommonOptions,
  PortLabelLayoutResult,
} from './index'

const defaults: PortLabelLayoutResult = {
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
  preset: Partial<PortLabelLayoutResult>,
  args?: Partial<PortLabelLayoutCommonOptions>,
): PortLabelLayoutResult {
  const { x, y, angle, attrs } = args || {}
  return ObjectExt.defaultsDeep(
    {},
    { angle, attrs, position: { x, y } },
    preset,
    defaults,
  )
}
