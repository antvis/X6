import { NodeRegistry } from '../../registry'
import { getMarkup, bodyAttr, labelAttr } from './util'

export const Polygon = NodeRegistry.register('polygon', {
  markup: getMarkup('polygon'),
  attrs: {
    body: {
      ...bodyAttr,
      refPoints: '0 0 10 0 10 10 0 10',
    },
    label: {
      ...labelAttr,
    },
  },
})
