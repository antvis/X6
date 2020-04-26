import { NodeRegistry } from '../../registry'
import { getMarkup, bodyAttr, labelAttr } from './util'

export const Rect = NodeRegistry.register('rect', {
  markup: getMarkup('rect'),
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
