import { NodeRegistry } from '../../registry'
import { getMarkup, bodyAttr, labelAttr } from './util'

export const Circle = NodeRegistry.register('circle', {
  markup: getMarkup('circle'),
  attrs: {
    body: {
      ...bodyAttr,
      refWidth: '100%',
      refHeight: '100%',
    },
    label: {
      ...labelAttr,
    },
  },
})
