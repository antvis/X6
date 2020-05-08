import { NodeRegistry } from '../../registry'
import { getMarkup, bodyAttr, labelAttr } from './util'

export const Polyline = NodeRegistry.register('polyline', {
  markup: getMarkup('polyline'),
  attrs: {
    body: {
      ...bodyAttr,
      refPoints: '0 0 10 0 10 10 0 10 0 0',
    },
    label: {
      ...labelAttr,
    },
  },
})
